import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { db } from '../../database/db.js';
import { StorageService } from '../storage/storageAdapter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_DIR = path.resolve(__dirname, '../../../uploads/downloads');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export class DownloadService {
  /**
   * Start a ZIP download packaging job
   */
  static async createBulkZip({ galleryId, photoIds, quality = 'web', type = 'SELECTION', clientName = 'Client' }) {
    const gallery = db.collection('galleries').findById(galleryId);
    if (!gallery) throw new Error('Gallery not found');

    const photos = db.collection('photos').find(p => p.galleryId === galleryId && (!photoIds || photoIds.includes(p.id)));

    const jobId = `zip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const zipFilename = `Signature_By_Marvan_${gallery.title.replace(/\s+/g, '_')}_${quality.toUpperCase()}_${Date.now()}.zip`;
    const zipFilePath = path.join(CACHE_DIR, zipFilename);

    // Register job in database
    const job = db.collection('downloads').insert({
      id: jobId,
      galleryId,
      type,
      quality,
      status: 'PROCESSING',
      progress: 10,
      totalPhotos: photos.length,
      zipFilename,
      downloadUrl: null,
      createdAt: new Date().toISOString()
    });

    // Run archiving asynchronously
    this._processZipInBackground(jobId, photos, zipFilePath, zipFilename, quality, gallery.title);

    // Record activity
    db.collection('activities').insert({
      text: `${clientName} initiated bulk download (${photos.length} photos, ${quality} quality)`,
      time: 'Just now',
      type: 'DOWNLOAD'
    });

    return job;
  }

  static async _processZipInBackground(jobId, photos, zipFilePath, zipFilename, quality, galleryTitle) {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 6 } });

    archive.pipe(output);

    // Add luxury studio note into the zip
    const readmeContent = `
=====================================================
SIGNATURE BY MARVAN
"YOUR MOMENTS. YOUR STORY. YOUR SIGNATURE."
=====================================================

Wedding Collection: ${galleryTitle}
Packaging: ${quality.toUpperCase()} QUALITY DELIVERY
Generated: ${new Date().toUTCString()}

Thank you for trusting Signature by Marvan to preserve your sacred memories.
Photographs are protected under copyright.

Support & Album Inquiries:
Email: marvan@signaturebymarvan.com
Web: https://signaturebymarvan.com
=====================================================
    `;
    archive.append(readmeContent, { name: 'SIGNATURE_BY_MARVAN_NOTE.txt' });

    let count = 0;
    for (const photo of photos) {
      count++;
      // Determine file source
      const photoName = `${String(count).padStart(3, '0')}_${(photo.title || 'Photo').replace(/\s+/g, '_')}.webp`;
      
      // If photo has a local disk file
      if (photo.storageKey) {
        const localPath = path.resolve(__dirname, '../../../uploads', photo.storageKey.replace(/^\/uploads\//, ''));
        if (fs.existsSync(localPath)) {
          archive.file(localPath, { name: photoName });
        } else {
          // If remote mock URL, add a descriptive bookmark/file
          archive.append(`Direct Cloud Asset: ${photo.webUrl || photo.url}`, { name: `${photoName}.txt` });
        }
      } else {
        archive.append(`Cloud Asset: ${photo.webUrl || photo.url}`, { name: `${photoName}.txt` });
      }

      // Update progress
      const progressPercent = Math.min(95, Math.round((count / photos.length) * 85) + 10);
      db.collection('downloads').update(jobId, { progress: progressPercent });
    }

    archive.finalize();

    output.on('close', () => {
      const signedUrl = StorageService.getSignedUrl(`downloads/${zipFilename}`, 7200); // 2 hours expiry
      db.collection('downloads').update(jobId, {
        status: 'READY',
        progress: 100,
        downloadUrl: `/uploads/downloads/${zipFilename}`,
        signedUrl,
        fileSize: archive.pointer(),
        readyAt: new Date().toISOString()
      });
    });

    archive.on('error', (err) => {
      console.error('ZIP Archive error:', err);
      db.collection('downloads').update(jobId, {
        status: 'FAILED',
        error: err.message
      });
    });
  }
}
