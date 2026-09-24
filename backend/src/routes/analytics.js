import express from 'express';
import { db } from '../database/db.js';
import { StorageService } from '../services/storage/storageAdapter.js';

const router = express.Router();

router.get('/overview', (req, res) => {
  const galleriesCount = db.collection('galleries').count();
  const photosCount = db.collection('photos').count();
  const clientsCount = db.collection('clients').count();
  const storage = StorageService.getStorageUsage();

  const pendingSelections = db.collection('selections').find(s => s.status === 'SUBMITTED');
  const activities = db.collection('activities').find().slice(-10).reverse();

  res.json({
    metrics: {
      galleries: galleriesCount,
      photos: photosCount,
      clients: clientsCount,
      storageUsedPercent: storage.percentage,
      storageUsedFormatted: storage.usedFormatted,
      storageLimitFormatted: storage.limitFormatted,
      downloads: db.collection('downloads').count(),
      activeProjects: db.collection('projects').count()
    },
    storageWarning: {
      level: storage.warningLevel,
      message: storage.warningMessage,
      percentage: storage.percentage
    },
    pendingSelections,
    recentActivities: activities,
    backup: {
      status: storage.backupStatus,
      lastBackupDate: storage.lastBackupDate
    }
  });
});

export default router;
