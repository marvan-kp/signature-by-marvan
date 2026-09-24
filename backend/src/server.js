import fs from 'fs';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { seedInitialData } from './database/db.js';
import { authenticateToken } from './middleware/auth.js';

// Load environment variables
dotenv.config();

// Route imports
import authRoutes from './routes/auth.js';
import galleryRoutes from './routes/galleries.js';
import albumRoutes from './routes/albums.js';
import photoRoutes from './routes/photos.js';
import uploadRoutes from './routes/uploads.js';
import storageRoutes from './routes/storage.js';
import favoriteRoutes from './routes/favorites.js';
import selectionRoutes from './routes/selections.js';
import downloadRoutes from './routes/downloads.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comments.js';
import notificationRoutes from './routes/notifications.js';
import analyticsRoutes from './routes/analytics.js';
import clientRoutes from './routes/clients.js';
import projectRoutes from './routes/projects.js';
import aiRoutes from './routes/ai.js';
import inquiryRoutes from './routes/inquiries.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving (local disk storage provider)
const uploadDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// Global auth parsing middleware
app.use(authenticateToken);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/selections', selectionRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'SIGNATURE BY MARVAN',
    tagline: 'YOUR MOMENTS. YOUR STORY. YOUR SIGNATURE.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if it exists (Single-service free deployment)
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Seed data and start server
seedInitialData();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`✨ SIGNATURE BY MARVAN — Core Backend Active`);
  console.log(`🔗 API running on: http://0.0.0.0:${PORT}`);
  console.log(`📁 Upload storage directory: ${uploadDir}`);
  console.log(`======================================================\n`);
});
