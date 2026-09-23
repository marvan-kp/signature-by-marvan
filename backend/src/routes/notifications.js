import express from 'express';
import { db } from '../database/db.js';
import { NotificationService } from '../services/notification/notificationService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const role = req.query.role || 'PHOTOGRAPHER';
  const notifs = NotificationService.getNotifications(role);
  res.json(notifs);
});

router.patch('/:id/read', (req, res) => {
  const { id } = req.params;
  const updated = NotificationService.markAsRead(id);
  res.json(updated);
});

export default router;
