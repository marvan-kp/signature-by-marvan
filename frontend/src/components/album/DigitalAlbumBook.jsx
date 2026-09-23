import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export function DigitalAlbumBook({ isOpen, onClose, photos = [], gallery }) {
  const [spreadIndex, setSpreadIndex] = useState(0);

  if (!isOpen) return null;

  // Group photos into dual-page spreads (2 photos per spread)
  const spreads = [];
  for (let i = 0; i < photos.length; i += 2) {
    spreads.push({
      left: photos[i],
      right: photos[i + 1] || null
    });
  }

  const currentSpread = spreads[spreadIndex] || { left: photos[0], right: photos[1] };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 130,
        background: '#070709',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '32px',
          right: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={18} color="var(--gold-soft)" />
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff' }}>
            {gallery?.title} • <span style={{ color: 'var(--gold-soft)', fontSize: '0.85rem' }}>DIGITAL HEIRLOOM ALBUM</span>
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Album Dual Spread Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          height: '75vh',
          background: 'rgba(18, 18, 22, 0.75)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(201, 168, 106, 0.25)',
          borderRadius: '16px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8), inset 0 0 100px rgba(0,0,0,0.6)',
          display: 'flex',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Center Spine Shadow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '30px',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.5) 100%)',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        />

        {/* Left Page */}
        <div
          style={{
            flex: 1,
            padding: '40px 30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            position: 'relative'
          }}
        >
          {currentSpread.left && (
            <div style={{ maxWidth: '90%', maxHeight: '85%', textAlign: 'center' }}>
              <img
                src={currentSpread.left.webUrl || currentSpread.left.url}
                alt={currentSpread.left.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '52vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              />
              <div style={{ marginTop: '16px', fontFamily: 'var(--font-serif)', fontSize: '0.95rem', color: '#ccc' }}>
                {currentSpread.left.title}
              </div>
            </div>
          )}
          <span style={{ position: 'absolute', bottom: '16px', left: '32px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Page {spreadIndex * 2 + 1}
          </span>
        </div>

        {/* Right Page */}
        <div
          style={{
            flex: 1,
            padding: '40px 30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {currentSpread.right ? (
            <div style={{ maxWidth: '90%', maxHeight: '85%', textAlign: 'center' }}>
              <img
                src={currentSpread.right.webUrl || currentSpread.right.url}
                alt={currentSpread.right.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '52vh',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              />
              <div style={{ marginTop: '16px', fontFamily: 'var(--font-serif)', fontSize: '0.95rem', color: '#ccc' }}>
                {currentSpread.right.title}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
              End of Album Collection
            </div>
          )}
          <span style={{ position: 'absolute', bottom: '16px', right: '32px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Page {spreadIndex * 2 + 2}
          </span>
        </div>
      </div>

      {/* Spread Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
        <button
          onClick={() => setSpreadIndex(Math.max(0, spreadIndex - 1))}
          disabled={spreadIndex === 0}
          className="glass-btn"
          style={{ padding: '8px 16px' }}
        >
          <ChevronLeft size={16} /> PREVIOUS SPREAD
        </button>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Spread {spreadIndex + 1} of {spreads.length || 1}
        </span>

        <button
          onClick={() => setSpreadIndex(Math.min(spreads.length - 1, spreadIndex + 1))}
          disabled={spreadIndex >= spreads.length - 1}
          className="glass-btn"
          style={{ padding: '8px 16px' }}
        >
          NEXT SPREAD <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
