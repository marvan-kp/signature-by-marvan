import express from 'express';
import { AiService } from '../services/ai/aiService.js';

const router = express.Router();

// Analyze gallery photos for quality and organization suggestions
router.get('/gallery/:galleryId/analyze', async (req, res) => {
  try {
    const { galleryId } = req.params;
    const analysis = await AiService.analyzeGallery(galleryId);
    res.json(analysis);
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: error.message || 'AI analysis failed' });
  }
});

// Smart search photos by natural language / tags
router.get('/gallery/:galleryId/search', (req, res) => {
  const { galleryId } = req.params;
  const { q } = req.query;
  const results = AiService.searchPhotos(galleryId, q);
  res.json(results);
});

export default router;
