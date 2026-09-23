import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DownloadService } from '../services/download/downloadService.js';
import { StorageService } from '../services/storage/storageAdapter.js';
import { db } from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Direct single photograph download with original extension and untouched full quality
router.get('/photo/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    const { quality = 'original' } = req.query;
    const photo = db.collection('photos').findById(photoId);
    if (!photo) return res.status(404).send('Photograph not found');

    const originalFilename = photo.originalFilename || `${(photo.title || 'photo').replace(/\s+/g, '_')}.jpg`;
    const origExt = path.extname(originalFilename) || '.jpg';
    const targetFilename = quality === 'original' 
      ? originalFilename 
      : `${originalFilename.replace(/\.[^/.]+$/, '')}.webp`;

    const key = (quality === 'original' && photo.originalKey) 
      ? photo.originalKey 
      : (photo.storageKey || photo.originalKey);

    // 1. If stored on local disk
    if (key) {
      const localPath = path.resolve(__dirname, '../../../uploads', key.replace(/^\/uploads\//, ''));
      if (fs.existsSync(localPath)) {
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(targetFilename)}"`);
        return res.sendFile(localPath);
      }
    }

    // 2. If Cloudflare R2 / S3 storage is active
    if (StorageService.s3Client && key) {
      try {
        const command = new GetObjectCommand({
          Bucket: StorageService.bucketName,
          Key: key.replace(/\\/g, '/'),
          ResponseContentDisposition: `attachment; filename="${encodeURIComponent(targetFilename)}"`
        });
        const signedUrl = await getSignedUrl(StorageService.s3Client, command, { expiresIn: 300 });
        return res.redirect(signedUrl);
      } catch (err) {
        console.warn('R2 presigned download fallback:', err.message);
      }
    }

    // 3. Fallback: If external URL
    const targetUrl = quality === 'original' && photo.originalUrl ? photo.originalUrl : (photo.webUrl || photo.url);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(targetFilename)}"`);
    return res.redirect(targetUrl);
  } catch (err) {
    console.error('Photo download error:', err);
    res.status(500).send('Failed to download photograph');
  }
});

// Request bulk download job
router.post('/bulk', async (req, res) => {
  try {
    const { galleryId, photoIds, quality = 'web', type = 'SELECTION', clientName = 'Client' } = req.body;
    if (!galleryId) {
      return res.status(400).json({ error: 'galleryId is required' });
    }

    const job = await DownloadService.createBulkZip({
      galleryId,
      photoIds,
      quality,
      type,
      clientName
    });

    res.json(job);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: err.message || 'Failed to start download job' });
  }
});

// Check status of download job
router.get('/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = db.collection('downloads').findById(jobId);
  if (!job) return res.status(404).json({ error: 'Download job not found' });
  res.json(job);
});

export default router;

