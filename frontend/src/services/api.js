const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('signature_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('signature_token', token);
    } else {
      localStorage.removeItem('signature_token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Request failed (${response.status})`);
      }

      return await response.json();
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  }

  // Auth
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  verifyPin(galleryCode, pin) {
    return this.request('/auth/client-pin', {
      method: 'POST',
      body: JSON.stringify({ galleryCode, pin })
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Galleries
  getGalleries() {
    return this.request('/galleries');
  }

  getGallery(identifier) {
    return this.request(`/galleries/${identifier}`);
  }

  createGallery(data) {
    return this.request('/galleries', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  updateGallery(id, data) {
    return this.request(`/galleries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  deleteGallery(id) {
    return this.request(`/galleries/${id}`, {
      method: 'DELETE'
    });
  }

  // Albums & Photos
  getAlbums(galleryId) {
    return this.request(`/albums/gallery/${galleryId}`);
  }

  createAlbum(data) {
    return this.request('/albums', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  getPhotos(galleryId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/photos/gallery/${galleryId}${query ? `?${query}` : ''}`);
  }

  getPhoto(id) {
    return this.request(`/photos/${id}`);
  }

  // Favorites
  getFavorites(galleryId) {
    return this.request(`/favorites/gallery/${galleryId}`);
  }

  toggleFavorite(galleryId, photoId, clientName) {
    return this.request('/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ galleryId, photoId, clientName })
    });
  }

  // Selections
  getSelection(galleryId) {
    return this.request(`/selections/gallery/${galleryId}`);
  }

  toggleSelection(galleryId, photoId) {
    return this.request('/selections/toggle', {
      method: 'POST',
      body: JSON.stringify({ galleryId, photoId })
    });
  }

  submitSelection(galleryId, clientNotes) {
    return this.request('/selections/submit', {
      method: 'POST',
      body: JSON.stringify({ galleryId, clientNotes })
    });
  }

  approveSelection(selectionId, notes) {
    return this.request('/selections/approve', {
      method: 'POST',
      body: JSON.stringify({ selectionId, notes })
    });
  }

  requestSelectionChanges(selectionId, notes) {
    return this.request('/selections/request-changes', {
      method: 'POST',
      body: JSON.stringify({ selectionId, notes })
    });
  }

  // Bulk Downloads
  requestBulkDownload(galleryId, photoIds, quality, type, clientName) {
    return this.request('/downloads/bulk', {
      method: 'POST',
      body: JSON.stringify({ galleryId, photoIds, quality, type, clientName })
    });
  }

  getDownloadStatus(jobId) {
    return this.request(`/downloads/status/${jobId}`);
  }

  // Videos
  getVideos(galleryId) {
    return this.request(`/videos/gallery/${galleryId}`);
  }

  // Comments
  getComments(photoId) {
    return this.request(`/comments/photo/${photoId}`);
  }

  addComment(galleryId, photoId, content, userName, userRole) {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify({ galleryId, photoId, content, userName, userRole })
    });
  }

  replyComment(commentId, content, userName, userRole) {
    return this.request(`/comments/${commentId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content, userName, userRole })
    });
  }

  // Analytics & Storage
  getAnalytics() {
    return this.request('/analytics/overview');
  }

  getStorageUsage() {
    return this.request('/storage/usage');
  }

  updateStorageConfig(data) {
    return this.request('/storage/config', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  recalculateStorage() {
    return this.request('/storage/recalculate', {
      method: 'POST'
    });
  }

  purgeDownloadCache() {
    return this.request('/storage/purge-cache', {
      method: 'POST'
    });
  }

  clearSampleData() {
    return this.request('/storage/clear-sample-data', {
      method: 'POST'
    });
  }

  restoreSampleData() {
    return this.request('/storage/restore-sample-data', {
      method: 'POST'
    });
  }

  async uploadCoverImage(file) {
    const formData = new FormData();
    formData.append('cover', file);
    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const res = await fetch(`${API_BASE}/storage/upload-cover`, {
      method: 'POST',
      headers,
      body: formData
    });
    if (!res.ok) throw new Error('Cover upload failed');
    return await res.json();
  }

  deletePhoto(id) {
    return this.request(`/photos/${id}`, {
      method: 'DELETE'
    });
  }

  deleteAlbum(id) {
    return this.request(`/albums/${id}`, {
      method: 'DELETE'
    });
  }

  // CRM Clients & Projects
  getClients() {
    return this.request('/clients');
  }

  createClient(data) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  submitInquiry(data) {
    return this.request('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  getProjects() {
    return this.request('/projects');
  }

  updateProjectStage(id, stage, progressPercent) {
    return this.request(`/projects/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage, progressPercent })
    });
  }

  // AI Organization
  getAiAnalysis(galleryId) {
    return this.request(`/ai/gallery/${galleryId}/analyze`);
  }

  searchAiPhotos(galleryId, query) {
    return this.request(`/ai/gallery/${galleryId}/search?q=${encodeURIComponent(query)}`);
  }

  // Batch Uploads
  async uploadPhotos(galleryId, albumId, category, files, onProgress) {
    const formData = new FormData();
    formData.append('galleryId', galleryId);
    if (albumId) formData.append('albumId', albumId);
    if (category) formData.append('category', category);

    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    const headers = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE}/uploads/batch`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Upload failed');
    }

    return await res.json();
  }
}

export const api = new ApiService();
