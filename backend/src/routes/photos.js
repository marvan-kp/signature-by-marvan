import express from 'express';
import { db } from '../database/db.js';
import { StorageService } from '../services/storage/storageAdapter.js';

const router = express.Router();

// Get photos for a gallery with optional album or category filter
router.get('/gallery/:galleryId', (req, res) => {
  const { galleryId } = req.params;
  const { albumId, category, search } = req.query;

  let photos = db.collection('photos').find(p => p.galleryId === galleryId);

  if (albumId && albumId !== 'all') {
    photos = photos.filter(p => p.albumId === albumId);
  }

  if (category && category !== 'All') {
    photos = photos.filter(p => p.category === category || (p.tags && p.tags.includes(category)));
  }

  if (search) {
    const q = search.toLowerCase();
    photos = photos.filter(p => 
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // Enrich with signed download URLs if needed
  const enriched = photos.map(p => ({
    ...p,
    signedWebUrl: p.storageKey ? StorageService.getSignedUrl(p.storageKey, 7200) : p.webUrl || p.url,
    signedThumbUrl: p.thumbnailUrl || p.url
  }));

  res.json(enriched);
});

// Get single photo details including comments
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const photo = db.collection('photos').findById(id);
  if (!photo) return res.status(404).json({ error: 'Photo not found' });

  const comments = db.collection('comments').find(c => c.photoId === id);
  const isFavorited = !!db.collection('favorites').findOne({ photoId: id });

  res.json({
    ...photo,
    comments,
    favorited: isFavorited
  });
});

// Update photo metadata
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.collection('photos').update(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Photo not found' });
  res.json(updated);
});

// Delete photo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const photo = db.collection('photos').findById(id);
  if (!photo) return res.status(404).json({ error: 'Photo not found' });

  if (photo.storageKey) {
    await StorageService.delete(photo.storageKey);
  }

  db.collection('photos').delete(id);
  db.collection('favorites').deleteMany({ photoId: id });
  db.collection('comments').deleteMany({ photoId: id });

  res.json({ message: 'Photo deleted successfully' });
});

export default router;
