import express from 'express';
import { db } from '../database/db.js';

const router = express.Router();

// List all clients
router.get('/', (req, res) => {
  const clients = db.collection('clients').find();
  res.json(clients);
});

// Create client
router.post('/', (req, res) => {
  const { name, brideName, groomName, email, phone, weddingDate, location, venue, notes } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const client = db.collection('clients').insert({
    name,
    brideName: brideName || '',
    groomName: groomName || '',
    email,
    phone: phone || '',
    weddingDate: weddingDate || new Date().toISOString().split('T')[0],
    location: location || 'Kerala, India',
    venue: venue || '',
    galleries: [],
    events: ['Wedding Ceremony', 'Reception'],
    notes: notes || '',
    deliveryStatus: 'BOOKED'
  });

  res.status(201).json(client);
});

// Update client
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.collection('clients').update(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Client not found' });
  res.json(updated);
});

// Delete client
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.collection('clients').delete(id);
  if (!deleted) return res.status(404).json({ error: 'Client not found' });
  res.json({ message: 'Client removed' });
});

export default router;
