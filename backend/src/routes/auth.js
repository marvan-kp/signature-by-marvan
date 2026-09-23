import express from 'express';
import { db } from '../database/db.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Admin / Studio Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = db.collection('users').findOne({ email: email.toLowerCase().trim() });
  if (!user || user.passwordHash !== password) {
    // In demo environment, allow any password matching our seed or default
    if (user && (password === 'signature2026' || password === 'admin123')) {
      // pass
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar
    }
  });
});

// Client Gallery PIN Login
router.post('/client-pin', (req, res) => {
  const { galleryCode, pin } = req.body;
  if (!galleryCode || !pin) {
    return res.status(400).json({ error: 'Gallery code and PIN required' });
  }

  // Find gallery by slug or code
  const gallery = db.collection('galleries').findOne(g => 
    g.slug === galleryCode || g.galleryCode === galleryCode || g.id === galleryCode
  );

  if (!gallery) {
    return res.status(404).json({ error: 'Gallery not found. Please verify the URL or link.' });
  }

  if (gallery.pin && gallery.pin !== pin.trim()) {
    return res.status(401).json({ error: 'Incorrect PIN. Please re-enter the 4-digit code provided by your photographer.' });
  }

  // Generate client session token
  const token = generateToken({
    id: `client_${gallery.id}`,
    role: 'CLIENT',
    galleryId: gallery.id,
    galleryCode: gallery.galleryCode
  }, '30d');

  // Record activity
  db.collection('activities').insert({
    text: `Client entered gallery: ${gallery.title}`,
    time: 'Just now',
    type: 'GALLERY_ACCESS'
  });

  return res.json({
    token,
    gallery: {
      id: gallery.id,
      title: gallery.title,
      slug: gallery.slug,
      galleryCode: gallery.galleryCode,
      location: gallery.location,
      eventDate: gallery.eventDate,
      totalPhotos: gallery.photoCountDisplay || gallery.totalPhotos
    }
  });
});

// Verify Current Token
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = db.collection('users').findById(req.user.id);
  if (user) {
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar: user.avatar
    });
  }
  return res.json(req.user);
});

export default router;
