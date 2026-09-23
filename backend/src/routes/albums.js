import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// Get albums for a gallery
router.get('/gallery/:galleryId', (req, res) => {
  const { galleryId } = req.params;
  const albums = db.collection('albums').find({ galleryId });

  // Compute live photo counts for each album
  const enriched = albums.map(album => {
    const liveCount = db.collection('photos').count(p => p.albumId === album.id && p.galleryId === galleryId);
    return {
      ...album,
      photoCount: liveCount > 0 ? liveCount : album.photoCount
    };
  });

  res.json(enriched);
});

// Create new album
router.post('/', (req, res) => {
  const { galleryId, title, coverImage } = req.body;
  if (!galleryId || !title) {
    return res.status(400).json({ error: 'Gallery ID and title are required' });
  }

  const album = db.collection('albums').insert({
    galleryId,
    title,
    photoCount: 0,
    coverImage: coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  });

  res.status(201).json(album);
});

// Update album
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.collection('albums').update(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Album not found' });
  res.json(updated);
});

// Delete album
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.collection('albums').delete(id);
  if (!deleted) return res.status(404).json({ error: 'Album not found' });
  res.json({ message: 'Album deleted' });
});

export default router;
