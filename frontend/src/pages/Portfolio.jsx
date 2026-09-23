import React, { useState, useEffect } from 'react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { GlassPhotoCard } from '../components/glass/GlassPhotoCard';
import { GlassPhotoViewer } from '../components/viewer/GlassPhotoViewer';
import { api } from '../services/api';

export function Portfolio() {
  const [photos, setPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePhoto, setActivePhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Weddings',
    'Engagement',
    'Pre-Wedding',
    'Bridal',
    'Groom',
    'Couples',
    'Ceremony',
    'Reception',
    'Candid',
    'Details',
    'Cinematic'
  ];

  useEffect(() => {
    // Load photos from primary featured gallery
    api.getPhotos('gal_arjun_anjali')
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Could not load portfolio photos:', err);
        setLoading(false);
      });
  }, []);

  const filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter(p => p.category === selectedCategory || (p.tags && p.tags.includes(selectedCategory)));

  const handleOpenViewer = (photo) => {
    const idx = filteredPhotos.findIndex(p => p.id === photo.id);
    setCurrentIndex(idx >= 0 ? idx : 0);
    setActivePhoto(photo);
  };

  const handleNavigateViewer = (newIndex) => {
    if (newIndex >= 0 && newIndex < filteredPhotos.length) {
      setCurrentIndex(newIndex);
      setActivePhoto(filteredPhotos[newIndex]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff' }}>
      <GlassNavbar />

      {/* Header Banner */}
      <div style={{ paddingTop: '140px', paddingBottom: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-champagne)', textTransform: 'uppercase', fontWeight: 600 }}>
          PORTFOLIO ARCHIVE
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: '#fff', marginTop: '8px' }}>
          Curated Fine-Art Gallery
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginTop: '12px' }}>
          Unposed, emotional wedding photography preserving natural light, heritage silks, and the sacred beauty of South Indian coastal rituals.
        </p>

        {/* Filter Categories Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '36px'
          }}
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  background: active ? 'var(--gold-champagne)' : 'rgba(255, 255, 255, 0.05)',
                  border: active ? '1px solid #fff' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: active ? '#000' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: active ? '600' : '400',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry Columns Container */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px 24px 100px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            Loading portfolio photographs...
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            No photographs found for category "{selectedCategory}".
          </div>
        ) : (
          <div
            style={{
              columns: '1 320px',
              columnGap: '20px'
            }}
          >
            {filteredPhotos.map((photo) => (
              <GlassPhotoCard
                key={photo.id}
                photo={photo}
                onOpenViewer={handleOpenViewer}
                watermark={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Photo Lightbox */}
      {activePhoto && (
        <GlassPhotoViewer
          photo={activePhoto}
          photos={filteredPhotos}
          currentIndex={currentIndex}
          onClose={() => setActivePhoto(null)}
          onNavigate={handleNavigateViewer}
        />
      )}
    </div>
  );
}
