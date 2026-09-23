import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// List wedding projects across the 8-stage pipeline
router.get('/', (req, res) => {
  const projects = db.collection('projects').find();
  res.json(projects);
});

// Update project stage
router.patch('/:id/stage', (req, res) => {
  const { id } = req.params;
  const { stage, progressPercent } = req.body;

  // Stages: BOOKED, SHOOT_COMPLETED, EDITING, UPLOAD, GALLERY_DELIVERED, SELECTION, ALBUM, FINAL_DELIVERY
  const stageProgressMap = {
    BOOKED: 10,
    SHOOT_COMPLETED: 30,
    EDITING: 50,
    UPLOAD: 65,
    GALLERY_DELIVERED: 75,
    SELECTION: 85,
    ALBUM: 92,
    FINAL_DELIVERY: 100
  };

  const updated = db.collection('projects').update(id, {
    stage,
    progressPercent: progressPercent !== undefined ? progressPercent : (stageProgressMap[stage] || 50)
  });

  if (!updated) return res.status(404).json({ error: 'Project not found' });

  db.collection('activities').insert({
    text: `Project "${updated.clientName}" updated to stage: ${stage}`,
    time: 'Just now',
    type: 'PROJECT'
  });

  res.json(updated);
});

export default router;
