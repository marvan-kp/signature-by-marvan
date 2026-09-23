import express from 'express';
import multer from 'multer';
import { StorageService } from '../services/storage/storageAdapter.js';
import { db, clearSampleData, seedInitialData } from '../database/db.js';
import { ImageProcessor } from '../services/image/imageProcessor.js';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 30 * 1024 * 1024 }
});

// Get storage metrics and free tier warnings
router.get('/usage', (req, res) => {
    const usage = StorageService.getStorageUsage();
    res.json(usage);
});

// Update storage configuration (provider, limit, unlimited local mode)
router.post('/config', (req, res) => {
    const { provider, limitGB, unlimitedMode } = req.body;
    const limitBytes = limitGB ? Number(limitGB) * 1024 * 1024 * 1024 : undefined;
    const updated = StorageService.updateConfig({
          provider,
          limitBytes,
          unlimitedMode: !!unlimitedMode,
          freeTierProvider: unlimitedMode ? 'Unlimited Local Storage (Zero Cost)' : provider
    });
    db.collection('activities').insert({
          text: `Storage configuration updated: ${unlimitedMode ? 'Unlimited Free Local Mode' : `${limitGB} GB on ${provider}`}`,
          time: 'Just now',
          type: 'STORAGE'
    });
    res.json(updated);
});

// Recalculate storage breakdown from actual files on disk
router.post('/recalculate', (req, res) => {
    const breakdown = StorageService.recalculateStorage();
    res.json(breakdown);
});

// Purge temporary download ZIP cache
router.post('/purge-cache', (req, res) => {
    const result = StorageService.purgeDownloadsCache();
    db.collection('activities').insert({
          text: `Purged download cache (${result.deletedFiles} temporary ZIP files removed, ${result.reclaimedFormatted} reclaimed)`,
          time: 'Just now',
          type: 'STORAGE'
    });
    res.json(result);
});

// Purge demo sample data to start fresh with 100% original real client photos
router.post('/clear-sample-data', (req, res) => {
    const result = clearSampleData();
    res.json(result);
});

// Restore sample demo portfolio if needed
router.post('/restore-sample-data', (req, res) => {
    seedInitialData();
    res.json({ success: true, message: 'Sample portfolio and demo galleries restored.' });
});

// Upload cover image directly for gallery or album
router.post('/upload-cover', upload.single('cover'), async (req, res) => {
    try {
          if (!req.file) {
                  return res.status(400).json({ error: 'No image file provided' });
          }
          const processed = await ImageProcessor.processPhoto(
                  req.file.buffer,
                  req.file.originalname,
                  'covers'
                );
          res.json({
                  url: processed.webUrl,
                  thumbnailUrl: processed.thumbnailUrl,
                  originalUrl: processed.originalUrl
          });
    } catch (err) {
          console.error('Cover upload error:', err);
          res.status(500).json({ error: 'Failed to process cover image' });
    }
});

// Trigger storage backup sync simulation
router.post('/backup-sync', (req, res) => {
    db.collection('storageObjects').update('storage_summary_active', {
          backupStorageStatus: 'SYNCED (100%)',
          lastBackupDate: new Date().toISOString()
    });
    db.collection('activities').insert({
          text: 'Automated secondary cloud storage backup completed successfully',
          time: 'Just now',
          type: 'BACKUP'
    });
    res.json({ success: true, status: 'SYNCED' });
});

// Stream proxy for cloud storage objects (R2 / S3)
router.get('/proxy/*', async (req, res) => {
    try {
          const key = req.params[0];
          if (!key) return res.status(400).send('Storage key required');
          const signedUrl = await StorageService.getSignedUrl(key, 300);
          res.redirect(signedUrl);
    } catch (err) {
          console.error('Storage proxy error:', err);
          res.status(404).send('Object not found');
    }
});

export default router;
