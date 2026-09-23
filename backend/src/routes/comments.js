import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// Get comments for a photo
router.get('/photo/:photoId', (req, res) => {
  const { photoId } = req.params;
  const comments = db.collection('comments').find({ photoId });
  res.json(comments);
});

// Add comment to photo
router.post('/', (req, res) => {
  const { galleryId, photoId, userName = 'Client', userRole = 'CLIENT', content } = req.body;
  if (!galleryId || !photoId || !content) {
    return res.status(400).json({ error: 'galleryId, photoId, and content are required' });
  }

  const comment = db.collection('comments').insert({
    galleryId,
    photoId,
    userName,
    userRole,
    content,
    status: 'OPEN',
    replies: []
  });

  // Record activity
  db.collection('activities').insert({
    text: `${userName} left a comment on photograph`,
    time: 'Just now',
    type: 'COMMENT'
  });

  res.status(201).json(comment);
});

// Reply to comment
router.post('/:id/reply', (req, res) => {
  const { id } = req.params;
  const { userName = 'Marvan K.P.', userRole = 'PHOTOGRAPHER', content } = req.body;

  const comment = db.collection('comments').findById(id);
  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  const reply = {
    id: `rep_${Date.now()}`,
    userName,
    userRole,
    content,
    createdAt: new Date().toISOString()
  };

  const updated = db.collection('comments').update(id, {
    replies: [...(comment.replies || []), reply]
  });

  res.json(updated);
});

// Resolve comment
router.patch('/:id/resolve', (req, res) => {
  const { id } = req.params;
  const updated = db.collection('comments').update(id, { status: 'RESOLVED' });
  if (!updated) return res.status(404).json({ error: 'Comment not found' });
  res.json(updated);
});

export default router;
