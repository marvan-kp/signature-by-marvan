import { db } from '../../database/db.js';

export class NotificationService {
  static sendNotification({ recipientEmail, recipientRole = 'CLIENT', type, title, message, actionUrl, galleryId }) {
    const notification = db.collection('notifications').insert({
      recipientEmail,
      recipientRole,
      type,
      title,
      message,
      actionUrl,
      galleryId,
      read: false,
      sentAt: new Date().toISOString()
    });

    // Also record in activity log for audit
    db.collection('activities').insert({
      text: `Notification triggered [${type}]: ${title}`,
      time: 'Just now',
      type: 'NOTIFICATION'
    });

    return notification;
  }

  static getNotifications(role = 'PHOTOGRAPHER') {
    return db.collection('notifications').find(n => !role || n.recipientRole === role);
  }

  static markAsRead(id) {
    return db.collection('notifications').update(id, { read: true });
  }
}
