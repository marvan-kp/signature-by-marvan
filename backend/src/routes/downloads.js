import express from 'express';
import { DownloadService } from '../services/download/downloadService.js';
import { db } from '../database/db.js';

const router = express.Router();

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
