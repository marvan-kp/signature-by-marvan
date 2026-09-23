import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  CheckCircle,
  Download,
  Play,
  BookOpen,
  Share2,
  Film,
  Sparkles,
  Lock,
  Search,
  Filter,
  Camera,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { GlassPhotoCard, GlassAlbumCard } from '../components/glass/GlassPhotoCard';
import { GlassPhotoViewer } from '../components/viewer/GlassPhotoViewer';
import { DownloadCenterModal } from '../components/client/DownloadCenterModal';
import { SelectionSubmitModal } from '../components/client/SelectionSubmitModal';
import { QrShareModal } from '../components/common/QrShareModal';
import { CinematicSlideshow } from '../components/slideshow/CinematicSlideshow';
import { DigitalAlbumBook } from '../components/album/DigitalAlbumBook';
import { GlassButton } from '../components/glass/GlassCard';
import { api } from '../services/api';

export function ClientGalleryPage() {
  const { slug } = useParams();
  const galleryIdentifier = slug || 'arjun-anjali-x82k';

  const [gallery, setGallery] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('GALLERY'); // GALLERY | ALBUMS | FAVORITES | SELECTIONS | VIDEOS
  const [selectedAlbumId, setSelectedAlbumId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selection, setSelection] = useState(null);
  const [videos, setVideos] = useState([]);
  const [gridDensity, setGridDensity] = useState('standard'); // 'compact' | 'standard' | 'large'

  // Modals
  const [viewerPhoto, setViewerPhoto] = useState(null);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [submitSelectionOpen, setSubmitSelectionOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [albumBookOpen, setAlbumBookOpen] = useState(false);

  // Load gallery data
  const loadGalleryData = async () => {
    try {
      const g = await api.getGallery(galleryIdentifier);
      setGallery(g);

      const [albs, pts, favs, sel, vids] = await Promise.all([
        api.getAlbums(g.id),
        api.getPhotos(g.id),
        api.getFavorites(g.id),
        api.getSelection(g.id),
        api.getVideos(g.id)
      ]);

      setAlbums(albs);
      setPhotos(pts);
      setFavorites(favs.photoIds || []);
      setSelection(sel);
      setVideos(vids);
    } catch (err) {
      console.error('Error loading gallery details:', err);
    }
  };

  useEffect(() => {
    loadGalleryData();
  }, [galleryIdentifier]);

  // Toggle favorite
  const handleToggleFavorite = async (photo) => {
    if (!gallery?.id) return;
    try {
      const res = await api.toggleFavorite(gallery.id, photo.id, gallery.title || 'Client');
      if (res.favorited) {
        setFavorites([...favorites, photo.id]);
      } else {
        setFavorites(favorites.filter(id => id !== photo.id));
      }
    } catch (e) {
      console.error('Favorite toggle failed:', e);
    }
  };

  // Toggle selection
  const handleToggleSelection = async (photo) => {
    if (!gallery?.id) return;
    try {
      const res = await api.toggleSelection(gallery.id, photo.id);
      setSelection(prev => ({
        ...prev,
        selectedPhotoIds: res.selectedPhotoIds,
        totalCount: res.selectedCount
      }));
    } catch (err) {
      alert(err.message || 'Cannot select photo');
    }
  };

  // Filtered photos based on active tab and search
  let displayPhotos = photos;
  if (activeTab === 'FAVORITES') {
    displayPhotos = photos.filter(p => favorites.includes(p.id));
  } else if (activeTab === 'SELECTIONS') {
    displayPhotos = photos.filter(p => (selection?.selectedPhotoIds || []).includes(p.id));
  } else {
    if (selectedAlbumId !== 'all') {
      displayPhotos = displayPhotos.filter(p => p.albumId === selectedAlbumId);
    }
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayPhotos = displayPhotos.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  const openViewerForPhoto = (photo) => {
    const idx = displayPhotos.findIndex(p => p.id === photo.id);
    setViewerIndex(idx >= 0 ? idx : 0);
    setViewerPhoto(photo);
  };

  const handleViewerNavigate = (newIdx) => {
    if (newIdx >= 0 && newIdx < displayPhotos.length) {
      setViewerIndex(newIdx);
      setViewerPhoto(displayPhotos[newIdx]);
    }
  };

  if (!gallery) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading your private wedding gallery...
      </div>
    );
  }

  const selectedCount = selection?.selectedPhotoIds?.length || 0;
  const selectionLimit = selection?.maxLimit || gallery.selectionLimit || 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff' }}>
      <GlassNavbar />

      {/* Cinematic Header Cover */}
      <section
        style={{
          position: 'relative',
          height: '65vh',
          minHeight: '480px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px'
        }}
      >
        <img
          src={gallery.coverImage}
          alt={gallery.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.52)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.2) 50%, rgba(5,5,5,1) 100%)'
          }}
        />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '880px', animation: 'fadeIn 0.6s ease' }}>
          <span style={{ fontSize: '0.74rem', letterSpacing: '0.28em', color: 'var(--gold-soft)', textTransform: 'uppercase', fontWeight: 600 }}>
            PRIVATE WEDDING GALLERY
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.8rem, 6.5vw, 5.4rem)',
              color: '#fff',
              margin: '8px 0 12px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {gallery.title}
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="var(--gold-champagne)" /> {gallery.location}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="var(--gold-champagne)" /> {gallery.eventDate}
            </span>
          </div>

          {/* Quick Action Ribbon */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <GlassButton
              variant="gold"
              onClick={() => setSlideshowOpen(true)}
              icon={Play}
            >
              PLAY STORY
            </GlassButton>

            <GlassButton
              variant="default"
              onClick={() => setAlbumBookOpen(true)}
              icon={BookOpen}
            >
              DIGITAL ALBUM
            </GlassButton>

            <GlassButton
              variant="default"
              onClick={() => setDownloadModalOpen(true)}
              icon={Download}
            >
              DOWNLOADS
            </GlassButton>

            <GlassButton
              variant="default"
              onClick={() => setQrModalOpen(true)}
              icon={Share2}
            >
              SHARE / QR
            </GlassButton>
          </div>
        </div>
      </section>

      {/* Main Client Dashboard Tabs & Sticky Glass Bar */}
      <section style={{ maxWidth: '1340px', margin: '0 auto', padding: '0 24px 100px 24px' }}>
        {/* Navigation Tabs Bar */}
        <div
          className="glass-surface-card"
          style={{
            marginTop: '-36px',
            marginBottom: '36px',
            position: 'relative',
            zIndex: 20,
            padding: '12px 20px',
            borderRadius: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          {/* Tab buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { id: 'GALLERY', label: `Gallery (${gallery.totalPhotos})` },
              { id: 'ALBUMS', label: `Albums (${albums.length})` },
              { id: 'FAVORITES', label: `Favorites (${favorites.length})` },
              { id: 'SELECTIONS', label: `Selections (${selectedCount}/${selectionLimit})` },
              { id: 'VIDEOS', label: `Videos (${videos.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  background: activeTab === tab.id ? 'var(--gold-champagne)' : 'rgba(255,255,255,0.04)',
                  border: activeTab === tab.id ? '1px solid #fff' : '1px solid rgba(255,255,255,0.08)',
                  color: activeTab === tab.id ? '#000' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  fontSize: '0.8rem',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input in Bar */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search wedding photos..."
              className="glass-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        {/* Tab 1: ALBUMS TAB */}
        {activeTab === 'ALBUMS' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff' }}>
                  Wedding Albums
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Organized by celebration sequence and portraits.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {albums.map((alb) => (
                <GlassAlbumCard
                  key={alb.id}
                  album={alb}
                  onClick={() => {
                    setSelectedAlbumId(alb.id);
                    setActiveTab('GALLERY');
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: SELECTIONS WORKFLOW TAB */}
        {activeTab === 'SELECTIONS' && (
          <div style={{ marginBottom: '32px' }}>
            {/* Selection Status Banner */}
            <div
              className="glass-surface-card"
              style={{
                padding: '24px 28px',
                borderRadius: '20px',
                marginBottom: '28px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
                border: '1px solid rgba(201, 168, 106, 0.3)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--gold-soft)', textTransform: 'uppercase', fontWeight: 600 }}>
                  ALBUM PHOTO SELECTION
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff', marginTop: '2px' }}>
                  {selectedCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {selectionLimit} SELECTED</span>
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Status: <strong style={{ color: selection?.status === 'APPROVED' ? '#67C23A' : 'var(--gold-champagne)' }}>
                    {selection?.status || 'IN_PROGRESS'}
                  </strong>
                  {selection?.photographerNotes && (
                    <span style={{ marginLeft: '12px', color: '#ddd' }}>
                      • Photographer: "{selection.photographerNotes}"
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <GlassButton
                  variant="gold"
                  onClick={() => setSubmitSelectionOpen(true)}
                  disabled={selectedCount === 0 || selection?.status === 'SUBMITTED'}
                >
                  {selection?.status === 'SUBMITTED' ? 'SELECTION SUBMITTED' : 'SUBMIT SELECTION TO MARVAN'}
                </GlassButton>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: VIDEOS TAB */}
        {activeTab === 'VIDEOS' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff' }}>
                Wedding Films & Cinema
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                4K Cinema highlight films and Instagram reels.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="glass-surface-card"
                  style={{ borderRadius: '20px', overflow: 'hidden' }}
                >
                  <div style={{ position: 'relative', height: '260px' }}>
                    <video
                      controls
                      poster={vid.thumbnailUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    >
                      <source src={vid.videoUrl} type="video/mp4" />
                      Your browser does not support HTML5 video.
                    </video>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      {vid.type} • {vid.duration} • {vid.resolution}
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', marginTop: '4px' }}>
                      {vid.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHOTO GRID (For GALLERY, FAVORITES, and SELECTIONS) */}
        {activeTab !== 'ALBUMS' && activeTab !== 'VIDEOS' && (
          <div>
            {/* Filter and Card Size Control Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '24px',
                paddingBottom: '8px'
              }}
            >
              {/* Album Sub-Filter if on main gallery tab */}
              {activeTab === 'GALLERY' ? (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  <button
                    onClick={() => setSelectedAlbumId('all')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: selectedAlbumId === 'all' ? 'rgba(255,255,255,0.15)' : 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: selectedAlbumId === 'all' ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    All Albums
                  </button>
                  {albums.map((alb) => (
                    <button
                      key={alb.id}
                      onClick={() => setSelectedAlbumId(alb.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        background: selectedAlbumId === alb.id ? 'rgba(201, 168, 106, 0.2)' : 'transparent',
                        border: selectedAlbumId === alb.id ? '1px solid var(--gold-champagne)' : '1px solid rgba(255,255,255,0.1)',
                        color: selectedAlbumId === alb.id ? 'var(--gold-soft)' : 'var(--text-muted)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {alb.title} ({alb.photoCount})
                    </button>
                  ))}
                </div>
              ) : <div />}

              {/* Card Size Density Switcher */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '4px 6px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  marginLeft: 'auto'
                }}
              >
                <span style={{ fontSize: '0.68rem', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0 6px', textTransform: 'uppercase' }}>
                  Card Size:
                </span>
                {[
                  { id: 'compact', label: 'Compact' },
                  { id: 'standard', label: 'Medium' },
                  { id: 'large', label: 'Large' }
                ].map(size => (
                  <button
                    key={size.id}
                    onClick={() => setGridDensity(size.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: gridDensity === size.id ? 'var(--gold-champagne)' : 'transparent',
                      color: gridDensity === size.id ? '#000' : 'var(--text-secondary)',
                      border: 'none',
                      fontSize: '0.74rem',
                      fontWeight: gridDensity === size.id ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photos Grid Display */}
            {displayPhotos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                No photographs in this collection.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: gridDensity === 'large'
                    ? 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))'
                    : gridDensity === 'compact'
                    ? 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))'
                    : 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                  gap: '24px',
                  alignItems: 'start',
                  maxWidth: displayPhotos.length === 1 ? '540px' : displayPhotos.length === 2 ? '900px' : '100%',
                  margin: displayPhotos.length <= 2 ? '0 auto' : '0'
                }}
              >
                {displayPhotos.map((photo) => (
                  <GlassPhotoCard
                    key={photo.id}
                    photo={photo}
                    onOpenViewer={openViewerForPhoto}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleSelection={handleToggleSelection}
                    isFavorited={favorites.includes(photo.id)}
                    isSelected={(selection?.selectedPhotoIds || []).includes(photo.id)}
                    watermark={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Fullscreen Photo Lightbox */}
      {viewerPhoto && (
        <GlassPhotoViewer
          photo={viewerPhoto}
          photos={displayPhotos}
          currentIndex={viewerIndex}
          gallery={gallery}
          isFavorited={favorites.includes(viewerPhoto.id)}
          isSelected={(selection?.selectedPhotoIds || []).includes(viewerPhoto.id)}
          onClose={() => setViewerPhoto(null)}
          onNavigate={handleViewerNavigate}
          onToggleFavorite={handleToggleFavorite}
          onToggleSelection={handleToggleSelection}
        />
      )}

      {/* Download Center Modal */}
      <DownloadCenterModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        gallery={gallery}
        favoritesCount={favorites.length}
        selectedCount={selectedCount}
      />

      {/* Selection Submit Modal */}
      <SelectionSubmitModal
        isOpen={submitSelectionOpen}
        onClose={() => setSubmitSelectionOpen(false)}
        gallery={gallery}
        selectedCount={selectedCount}
        maxLimit={selectionLimit}
        onSubmitted={loadGalleryData}
      />

      {/* QR & WhatsApp Share Modal */}
      <QrShareModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        gallery={gallery}
      />

      {/* Cinematic Slideshow */}
      <CinematicSlideshow
        isOpen={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
        photos={photos}
        gallery={gallery}
      />

      {/* Digital Album Book */}
      <DigitalAlbumBook
        isOpen={albumBookOpen}
        onClose={() => setAlbumBookOpen(false)}
        photos={photos}
        gallery={gallery}
      />
    </div>
  );
}
