import express from 'express';
import { db } from '../database/db.js';
import { NotificationService } from '../services/notification/notificationService.js';

const router = express.Router();

const TARGET_EMAIL = 'marvankp847@gmail.com';
const TARGET_PHONE = '+91 75919 42952';

// Submit new wedding inquiry
router.post('/', (req, res) => {
  const { name, email, phone, weddingDate, venue, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required to submit an inquiry.' });
  }

  // Insert inquiry into database
  const inquiry = db.collection('inquiries').insert({
    name,
    email,
    phone: phone || '',
    weddingDate: weddingDate || '',
    venue: venue || '',
    message: message || '',
    targetEmail: TARGET_EMAIL,
    targetPhone: TARGET_PHONE,
    status: 'NEW',
    createdAt: new Date().toISOString()
  });

  // Notify photographer admin
  NotificationService.sendNotification({
    recipientEmail: TARGET_EMAIL,
    recipientRole: 'PHOTOGRAPHER',
    type: 'WEDDING_INQUIRY',
    title: `New Wedding Inquiry: ${name}`,
    message: `Inquiry received for ${weddingDate || 'Upcoming Date'} at ${venue || 'Kerala'}. Client email: ${email}, Phone: ${phone}`,
    actionUrl: '/admin'
  });

  // Record activity
  db.collection('activities').insert({
    text: `New wedding inquiry from ${name} sent to ${TARGET_EMAIL}`,
    time: 'Just now',
    type: 'INQUIRY'
  });

  // Construct mailto URL for direct mail dispatch fallback
  const mailSubject = encodeURIComponent(`Wedding Photography Inquiry — ${name}`);
  const mailBody = encodeURIComponent(
    `Hello Marvan,\n\nNew Wedding Inquiry Details:\n\n• Couple: ${name}\n• Email: ${email}\n• Phone: ${phone}\n• Wedding Date: ${weddingDate}\n• Venue & City: ${venue}\n\nNote / Vision:\n${message}\n\nSent via Signature by Marvan Studio.`
  );
  const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

  res.status(201).json({
    success: true,
    message: `Inquiry successfully transmitted to ${TARGET_EMAIL}`,
    inquiry,
    targetEmail: TARGET_EMAIL,
    targetPhone: TARGET_PHONE,
    mailtoUrl
  });
});

// List all inquiries (Admin)
router.get('/', (req, res) => {
  const inquiries = db.collection('inquiries').find();
  res.json(inquiries);
});

export default router;
