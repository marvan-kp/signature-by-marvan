import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { db } from '../database/db.js';
import { ImageProcessor } from '../services/image/imageProcessor.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB per file
});

// Upload batch of photos
router.post('/batch', upload.array('photos', 50), async (req, res) => {
  try {
    const { galleryId, albumId, category = 'Weddings' } = req.body;
    if (!galleryId) {
      return res.status(400).json({ error: 'galleryId is required' });
    }

    const gallery = db.collection('galleries').findById(galleryId);
    if (!gallery) {
      return res.status(404).json({ error: 'Target gallery not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const processedResults = [];
    const duplicates = [];

    for (const file of req.files) {
      // 1. Check duplicate detection by md5 hash
      const hash = crypto.createHash('md5').update(file.buffer).digest('hex');
      const existing = db.collection('photos').findOne(p => p.galleryId === galleryId && p.fileHash === hash);

      if (existing) {
        duplicates.push({ filename: file.originalname, reason: 'Duplicate hash' });
        continue;
      }

      // 2. Process through Sharp pipeline
      const processed = await ImageProcessor.processPhoto(
        file.buffer,
        file.originalname,
        galleryId,
        gallery.watermarkSettings
      );

      // Clean title from original file name
      const title = file.originalname.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');

      // 3. Insert into database
      const photoDoc = db.collection('photos').insert({
        galleryId,
        albumId: albumId || 'alb_ceremony',
        category,
        title,
        originalFilename: file.originalname,
        fileHash: hash,
        aspectRatio: processed.aspectRatio,
        url: processed.webUrl,
        webUrl: processed.webUrl,
        thumbnailUrl: processed.thumbnailUrl,
        originalUrl: processed.originalUrl,
        storageKey: processed.storageKey,
        dimensions: processed.dimensions,
        fileSize: processed.fileSize,
        blurScore: processed.blurScore,
        aiQualityScore: processed.aiQualityScore,
        tags: [category, 'Upload', processed.aspectRatio],
        favorited: false,
        selected: false
      });

      processedResults.push(photoDoc);
    }

    // Update gallery stats
    const totalCount = db.collection('photos').count(p => p.galleryId === galleryId);
    db.collection('galleries').update(galleryId, {
      totalPhotos: totalCount,
      photoCountDisplay: (gallery.photoCountDisplay || 0) + processedResults.length
    });

    // Record activity
    db.collection('activities').insert({
      text: `Uploaded ${processedResults.length} new photographs to ${gallery.title}`,
      time: 'Just now',
      type: 'UPLOAD'
    });

    res.json({
      success: true,
      uploadedCount: processedResults.length,
      duplicateCount: duplicates.length,
      photos: processedResults,
      duplicates
    });
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({ error: error.message || 'Failed to process upload batch' });
  }
});

export default router;
