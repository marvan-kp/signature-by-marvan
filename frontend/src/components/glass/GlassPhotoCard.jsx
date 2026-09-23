import React, { useState } from 'react';
import { Heart, Check, Eye, Download, MessageSquare } from 'lucide-react';

export function GlassPhotoCard({
  photo,
  onOpenViewer,
  onToggleFavorite,
  onToggleSelection,
  isFavorited = false,
  isSelected = false,
  selectionMode = false,
  watermark = false
}) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(15, 15, 18, 0.6)',
        border: isSelected
          ? '2px solid var(--gold-champagne)'
          : hovered
          ? '1px solid rgba(255, 255, 255, 0.22)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: hovered
          ? '0 20px 45px rgba(0, 0, 0, 0.5)'
          : '0 8px 24px rgba(0, 0, 0, 0.25)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        breakInside: 'avoid',
        marginBottom: '20px',
        cursor: 'pointer'
      }}
      onClick={() => onOpenViewer(photo)}
    >
      {/* Photo Image */}
      <img
        src={photo.webUrl || photo.url || photo.thumbnailUrl}
        alt={photo.title || 'Wedding Photograph'}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '75vh',
          objectFit: 'contain',
          display: 'block',
          background: 'rgba(5, 5, 5, 0.4)',
          filter: loaded ? 'none' : 'blur(10px)',
          transition: 'filter 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.02)' : 'scale(1.0)'
        }}
      />

      {/* Watermark subtle overlay if requested */}
      {watermark && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '14px',
            fontFamily: 'var(--font-serif)',
            fontSize: '0.68rem',
            letterSpacing: '0.18em',
            color: 'rgba(201, 168, 106, 0.45)',
            textTransform: 'uppercase',
            pointerEvents: 'none'
          }}
        >
          SIGNATURE BY MARVAN
        </div>
      )}

      {/* Top Controls Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          opacity: hovered || isFavorited || isSelected ? 1 : 0,
          transition: 'opacity 0.25s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Selection Checkbox Button */}
        <button
          onClick={() => onToggleSelection && onToggleSelection(photo)}
          title={isSelected ? 'Remove from selection' : 'Select for album'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isSelected ? 'var(--gold-champagne)' : 'rgba(10, 10, 12, 0.7)',
            backdropFilter: 'blur(16px)',
            border: isSelected ? '1px solid #fff' : '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSelected ? '#000' : '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Check size={16} strokeWidth={isSelected ? 3 : 2} />
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Direct Full Quality Download */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const downloadUrl = `/api/downloads/photo/${photo.id}?quality=original`;
              const filename = photo.originalFilename || `${(photo.title || 'photo').replace(/\s+/g, '_')}.jpg`;
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.setAttribute('download', filename);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            title="Download full quality original photo"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(10, 10, 12, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Download size={15} />
          </button>

          {/* Favorite Heart Button */}
          <button
            onClick={() => onToggleFavorite && onToggleFavorite(photo)}
            title={isFavorited ? 'Favorited' : 'Add to favorites'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isFavorited ? 'rgba(235, 77, 75, 0.85)' : 'rgba(10, 10, 12, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Heart size={16} fill={isFavorited ? '#fff' : 'none'} />
          </button>
        </div>
      </div>

      {/* Bottom Liquid Glass Info Bar on Hover */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          background: 'linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s ease'
        }}
      >
        <div>
          <h4 style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 500, letterSpacing: '0.02em' }}>
            {photo.title}
          </h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            {photo.category} • {photo.aspectRatio}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {photo.comments && photo.comments.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--gold-soft)' }}>
              <MessageSquare size={12} /> {photo.comments.length}
            </span>
          )}
          <Eye size={15} color="rgba(255,255,255,0.7)" />
        </div>
      </div>
    </div>
  );
}

export function GlassAlbumCard({ album, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        height: '240px',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: hovered ? '1px solid var(--border-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.55)' : '0 10px 30px rgba(0,0,0,0.3)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: hovered ? 'translateY(-4px)' : 'none'
      }}
    >
      <img
        src={album.coverImage}
        alt={album.title}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.06)' : 'scale(1.0)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(5,5,5,0.92) 10%, rgba(5,5,5,0.2) 60%, rgba(5,5,5,0.4) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-soft)',
            fontWeight: 600
          }}
        >
          {album.photoCount || 0} PHOTOGRAPHS
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            color: '#fff',
            letterSpacing: '0.04em'
          }}
        >
          {album.title.toUpperCase()}
        </h3>
      </div>
    </div>
  );
}
