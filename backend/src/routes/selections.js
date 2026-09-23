import express from 'express';
import { db } from '../database/db.js';
import { NotificationService } from '../services/notification/notificationService.js';

const router = express.Router();

// Get selection project for a gallery
router.get('/gallery/:galleryId', (req, res) => {
  const { galleryId } = req.params;
  const gallery = db.collection('galleries').findById(galleryId);
  if (!gallery) return res.status(404).json({ error: 'Gallery not found' });

  let selection = db.collection('selections').findOne({ galleryId });
  if (!selection) {
    // Create new selection if none exists
    selection = db.collection('selections').insert({
      galleryId,
      clientId: gallery.clientId,
      clientName: gallery.title,
      totalCount: 0,
      maxLimit: gallery.selectionLimit || 100,
      status: 'DRAFT',
      selectedPhotoIds: [],
      clientNotes: '',
      photographerNotes: ''
    });
  }

  // Fetch full photo details for selected items
  const selectedPhotos = db.collection('photos').find(p => (selection.selectedPhotoIds || []).includes(p.id));

  res.json({
    ...selection,
    selectedPhotos
  });
});

// Toggle selection of a photo
router.post('/toggle', (req, res) => {
  const { galleryId, photoId } = req.body;
  if (!galleryId || !photoId) {
    return res.status(400).json({ error: 'galleryId and photoId are required' });
  }

  let selection = db.collection('selections').findOne({ galleryId });
  const gallery = db.collection('galleries').findById(galleryId);
  const maxLimit = selection?.maxLimit || gallery?.selectionLimit || 100;

  if (!selection) {
    selection = db.collection('selections').insert({
      galleryId,
      clientId: gallery?.clientId,
      clientName: gallery?.title || 'Client',
      totalCount: 0,
      maxLimit,
      status: 'DRAFT',
      selectedPhotoIds: []
    });
  }

  if (['APPROVED', 'SUBMITTED'].includes(selection.status)) {
    return res.status(400).json({ 
      error: `Selection is currently ${selection.status}. Please request changes or unlock before editing.` 
    });
  }

  let selectedIds = [...(selection.selectedPhotoIds || [])];
  const index = selectedIds.indexOf(photoId);

  if (index > -1) {
    selectedIds.splice(index, 1);
  } else {
    if (selectedIds.length >= maxLimit) {
      return res.status(400).json({ 
        error: `Selection limit of ${maxLimit} photographs has been reached.` 
      });
    }
    selectedIds.push(photoId);
  }

  const updated = db.collection('selections').update(selection.id, {
    selectedPhotoIds: selectedIds,
    totalCount: selectedIds.length
  });

  res.json({
    selected: index === -1,
    selectedCount: selectedIds.length,
    maxLimit,
    selectedPhotoIds: selectedIds
  });
});

// Submit selection by client
router.post('/submit', (req, res) => {
  const { galleryId, clientNotes } = req.body;
  const selection = db.collection('selections').findOne({ galleryId });
  if (!selection) return res.status(404).json({ error: 'Selection project not found' });

  const gallery = db.collection('galleries').findById(galleryId);

  const updated = db.collection('selections').update(selection.id, {
    status: 'SUBMITTED',
    clientNotes: clientNotes || selection.clientNotes,
    submittedAt: new Date().toISOString()
  });

  // Notify photographer
  NotificationService.sendNotification({
    recipientRole: 'PHOTOGRAPHER',
    type: 'SELECTION_SUBMITTED',
    title: `Selection Submitted: ${gallery?.title || 'Client'}`,
    message: `${gallery?.title || 'Client'} has submitted ${updated.totalCount} photographs for album layout review.`,
    actionUrl: `/admin/selections`,
    galleryId
  });

  // Record activity
  db.collection('activities').insert({
    text: `Selection submitted by ${gallery?.title || 'Client'} (${updated.totalCount} photos)`,
    time: 'Just now',
    type: 'SELECTION'
  });

  res.json({ success: true, selection: updated });
});

// Photographer action: Approve selection
router.post('/approve', (req, res) => {
  const { selectionId, notes } = req.body;
  const selection = db.collection('selections').findById(selectionId);
  if (!selection) return res.status(404).json({ error: 'Selection not found' });

  const updated = db.collection('selections').update(selectionId, {
    status: 'APPROVED',
    photographerNotes: notes || 'Selection approved for heirloom album printing.',
    approvedAt: new Date().toISOString()
  });

  // Update project pipeline to ALBUM
  const project = db.collection('projects').findOne({ clientId: selection.clientId });
  if (project) {
    db.collection('projects').update(project.id, { stage: 'ALBUM', progressPercent: 85 });
  }

  // Notify client
  NotificationService.sendNotification({
    recipientRole: 'CLIENT',
    type: 'SELECTION_APPROVED',
    title: 'Album Selection Approved!',
    message: 'Your photographer has reviewed and approved your photo selection. Designing the heirloom album now!',
    galleryId: selection.galleryId
  });

  res.json({ success: true, selection: updated });
});

// Photographer action: Request changes
router.post('/request-changes', (req, res) => {
  const { selectionId, notes } = req.body;
  const selection = db.collection('selections').findById(selectionId);
  if (!selection) return res.status(404).json({ error: 'Selection not found' });

  const updated = db.collection('selections').update(selectionId, {
    status: 'CHANGES_REQUESTED',
    photographerNotes: notes || 'Please review recommendations before final approval.',
    statusUpdated: new Date().toISOString()
  });

  NotificationService.sendNotification({
    recipientRole: 'CLIENT',
    type: 'SELECTION_CHANGES_REQUESTED',
    title: 'Selection Revision Requested',
    message: notes || 'Your photographer left suggestions on your album selection.',
    galleryId: selection.galleryId
  });

  res.json({ success: true, selection: updated });
});

export default router;
