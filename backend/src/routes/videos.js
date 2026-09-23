import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// List videos for a gallery
router.get('/gallery/:galleryId', (req, res) => {
  const { galleryId } = req.params;
  const videos = db.collection('videos').find({ galleryId });
  res.json(videos);
});

// Add new video entry
router.post('/', (req, res) => {
  const { galleryId, title, type = 'WEDDING_FILM', videoUrl, duration, thumbnailUrl, resolution } = req.body;
  if (!galleryId || !title || !videoUrl) {
    return res.status(400).json({ error: 'galleryId, title, and videoUrl are required' });
  }

  const video = db.collection('videos').insert({
    galleryId,
    title,
    type,
    duration: duration || '05:00',
    videoUrl,
    thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    resolution: resolution || '4K Cinema'
  });

  res.status(201).json(video);
});

export default router;
