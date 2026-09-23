import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// Get favorites for a gallery
router.get('/gallery/:galleryId', (req, res) => {
  const { galleryId } = req.params;
  const favs = db.collection('favorites').find({ galleryId });
  const photoIds = favs.map(f => f.photoId);
  const photos = db.collection('photos').find(p => photoIds.includes(p.id));

  res.json({
    count: photos.length,
    photoIds,
    photos
  });
});

// Toggle favorite on a photo
router.post('/toggle', (req, res) => {
  const { galleryId, photoId, clientName = 'Client' } = req.body;
  if (!galleryId || !photoId) {
    return res.status(400).json({ error: 'galleryId and photoId are required' });
  }

  const existing = db.collection('favorites').findOne({ galleryId, photoId });
  let favorited = false;

  if (existing) {
    db.collection('favorites').delete(existing.id);
    favorited = false;
  } else {
    db.collection('favorites').insert({
      galleryId,
      photoId,
      clientName,
      favoritedAt: new Date().toISOString()
    });
    favorited = true;

    // Record activity
    db.collection('activities').insert({
      text: `${clientName} favorited a photograph in gallery`,
      time: 'Just now',
      type: 'FAVORITE'
    });
  }

  const totalFavs = db.collection('favorites').count(f => f.galleryId === galleryId);
  db.collection('galleries').update(galleryId, { favoritesCount: totalFavs });

  res.json({ favorited, totalFavorites: totalFavs });
});

export default router;
