import express from 'express';
import { db } from '../database/db.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// List public/active galleries
router.get('/', (req, res) => {
  const isStudio = req.user && ['OWNER', 'PHOTOGRAPHER', 'EDITOR'].includes(req.user.role);
  let galleries = db.collection('galleries').find();

  if (!isStudio) {
    // Only return active and public metadata (exclude secret PINs)
    galleries = galleries.map(g => ({
      id: g.id,
      title: g.title,
      subtitle: g.subtitle,
      slug: g.slug,
      galleryCode: g.galleryCode,
      eventDate: g.eventDate,
      location: g.location,
      coverImage: g.coverImage,
      totalPhotos: g.photoCountDisplay || g.totalPhotos,
      status: g.status
    }));
  }

  res.json(galleries);
});

// Get single gallery by ID, Slug, or GalleryCode
router.get('/:identifier', (req, res) => {
  const { identifier } = req.params;
  const gallery = db.collection('galleries').findOne(g => 
    g.id === identifier || g.slug === identifier || g.galleryCode === identifier
  );

  if (!gallery) {
    return res.status(404).json({ error: 'Gallery not found' });
  }

  // Count live stats
  const photosCount = db.collection('photos').count(p => p.galleryId === gallery.id);
  const favoritesCount = db.collection('favorites').count(f => f.galleryId === gallery.id);
  const albums = db.collection('albums').find(a => a.galleryId === gallery.id);
  const selection = db.collection('selections').findOne(s => s.galleryId === gallery.id);

  const isStudio = req.user && ['OWNER', 'PHOTOGRAPHER', 'EDITOR'].includes(req.user.role);

  res.json({
    ...gallery,
    totalPhotos: gallery.photoCountDisplay || photosCount,
    livePhotoCount: photosCount,
    favoritesCount,
    albumsCount: albums.length,
    selectionStatus: selection?.status || 'NOT_STARTED',
    selectedCount: selection?.totalCount || 0,
    pin: isStudio ? gallery.pin : undefined // Do not expose pin publicly
  });
});

// Create new gallery
router.post('/', (req, res) => {
  const {
    title,
    subtitle,
    slug,
    eventDate,
    location,
    venue,
    pin = '2026',
    selectionLimit = 100,
    coverImage,
    watermarkSettings
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Gallery title is required' });
  }

  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
  const galleryCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const newGallery = db.collection('galleries').insert({
    title,
    subtitle: subtitle || `${title} • Wedding Gallery`,
    slug: generatedSlug,
    galleryCode,
    pin,
    eventDate: eventDate || new Date().toISOString().split('T')[0],
    location: location || 'Kerala, India',
    venue: venue || 'Destination Wedding Venue',
    status: 'ACTIVE',
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months
    totalPhotos: 0,
    photoCountDisplay: 0,
    favoritesCount: 0,
    downloadCount: 0,
    selectionLimit: Number(selectionLimit) || 100,
    coverImage: coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85',
    watermarkSettings: watermarkSettings || {
      enabled: true,
      type: 'text',
      text: 'SIGNATURE BY MARVAN',
      position: 'bottom-right',
      opacity: 0.22,
      size: 'medium'
    },
    storyChapters: [
      { title: 'THE BEGINNING', description: 'Quiet dawn preparations and heirloom silks.' },
      { title: 'THE CEREMONY', description: 'Sacred vows and timeless rituals.' },
      { title: 'THE MOMENTS', description: 'Stolen glances and heartfelt tears.' },
      { title: 'THE DETAILS', description: 'Handcrafted floral art and jewelry.' },
      { title: 'THE CELEBRATION', description: 'Music, laughter, and high energy.' },
      { title: 'FOREVER', description: 'The journey together begins.' }
    ]
  });

  // Automatically create default essential albums
  const defaultAlbums = ['Ceremony', 'Reception', 'Bride', 'Groom', 'Couple', 'Family', 'Details'];
  defaultAlbums.forEach(name => {
    db.collection('albums').insert({
      galleryId: newGallery.id,
      title: name,
      photoCount: 0,
      coverImage: newGallery.coverImage
    });
  });

  // Record activity
  db.collection('activities').insert({
    text: `Created new wedding gallery: ${newGallery.title}`,
    time: 'Just now',
    type: 'GALLERY_CREATE'
  });

  res.status(201).json(newGallery);
});

// Update gallery settings
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.collection('galleries').update(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Gallery not found' });
  }
  res.json(updated);
});

// Delete gallery
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.collection('galleries').delete(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Gallery not found' });
  }
  // Delete associated photos & albums
  db.collection('photos').deleteMany({ galleryId: id });
  db.collection('albums').deleteMany({ galleryId: id });
  res.json({ message: 'Gallery and associated assets removed' });
});

export default router;
