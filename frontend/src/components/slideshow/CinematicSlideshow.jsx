import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, SkipForward, SkipBack } from 'lucide-react';

export function CinematicSlideshow({ isOpen, onClose, photos = [], gallery }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isOpen && isPlaying && photos.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 5500); // 5.5 seconds per photo
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, photos.length]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Play ambient audio soundtrack if available
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked by browser policy until interaction
        });
      }
    } else {
      document.body.style.overflow = 'unset';
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isOpen]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 130,
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Background Audio (soft romantic cinematic piano/ambient track) */}
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
        loop
        muted={isMuted}
      />

      {/* Top Floating Controls */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '32px',
          right: '32px',
          zIndex: 30,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', letterSpacing: '0.08em' }}>
            {gallery?.title}
          </span>
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--gold-soft)', textTransform: 'uppercase' }}>
            A CINEMATIC WEDDING STORY
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(20, 20, 24, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            onClick={toggleFullscreen}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(20, 20, 24, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Maximize2 size={18} />
          </button>

          <button
            onClick={onClose}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Image with Ken Burns Effect */}
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <img
          key={currentPhoto?.id || currentIndex}
          src={currentPhoto?.webUrl || currentPhoto?.url}
          alt={currentPhoto?.title}
          className="ken-burns"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />

        {/* Ambient Dark Gradient Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Bottom Floating Player Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          zIndex: 30,
          background: 'rgba(15, 15, 18, 0.7)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '40px',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <SkipBack size={18} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--gold-champagne)',
            border: 'none',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(201, 168, 106, 0.4)'
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <SkipForward size={18} />
        </button>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '10px' }}>
          {currentIndex + 1} / {photos.length}
        </span>
      </div>
    </div>
  );
}
