import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Check,
  Download,
  Share2,
  MessageSquare,
  Shield,
  ZoomIn,
  ZoomOut,
  Send,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';

export function GlassPhotoViewer({
  photo,
  photos = [],
  currentIndex = 0,
  onClose,
  onNavigate,
  onToggleFavorite,
  onToggleSelection,
  isFavorited = false,
  isSelected = false,
  gallery
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isWatermarked, setIsWatermarked] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [commentSending, setCommentSending] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const lastTapRef = useRef(0);

  // Fetch comments when current photo changes
  useEffect(() => {
    if (photo?.id) {
      api.getComments(photo.id)
        .then(setComments)
        .catch(err => console.warn('Could not load comments:', err));
    }
    setZoomLevel(1);
  }, [photo?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onNavigate(currentIndex - 1);
      else if (e.key === 'ArrowRight') onNavigate(currentIndex + 1);
      else if (e.key.toLowerCase() === 'f') onToggleFavorite && onToggleFavorite(photo);
      else if (e.key.toLowerCase() === 's') onToggleSelection && onToggleSelection(photo);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photo, onClose, onNavigate, onToggleFavorite, onToggleSelection]);

  // Prefetch next and previous photos
  useEffect(() => {
    if (photos.length > 0) {
      const nextPhoto = photos[(currentIndex + 1) % photos.length];
      const prevPhoto = photos[(currentIndex - 1 + photos.length) % photos.length];
      if (nextPhoto?.webUrl) {
        const img = new Image();
        img.src = nextPhoto.webUrl;
      }
      if (prevPhoto?.webUrl) {
        const img = new Image();
        img.src = prevPhoto.webUrl;
      }
    }
  }, [currentIndex, photos]);

  if (!photo) return null;

  // Touch handlers for mobile swipe & double-tap favorite
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) onNavigate(currentIndex + 1);
      else onNavigate(currentIndex - 1);
    }

    // Double tap favorite
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      onToggleFavorite && onToggleFavorite(photo);
    }
    lastTapRef.current = now;
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !gallery?.id) return;

    setCommentSending(true);
    try {
      const newComment = await api.addComment(
        gallery.id,
        photo.id,
        commentText.trim(),
        'Client Guest',
        'CLIENT'
      );
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (err) {
      alert('Could not submit comment: ' + err.message);
    } finally {
      setCommentSending(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDirectDownload = (quality = 'original') => {
    // Direct stream endpoint that preserves the exact original extension and full uncompressed quality
    const downloadUrl = `/api/downloads/photo/${photo.id}?quality=${quality}`;
    const filename = photo.originalFilename || `${(photo.title || 'photo').replace(/\s+/g, '_')}.jpg`;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        overflow: 'hidden'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Floating Glass Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        {/* Photo Counter */}
        <div
          style={{
            pointerEvents: 'auto',
            background: 'rgba(20, 20, 24, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '30px',
            padding: '8px 18px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ color: 'var(--gold-soft)', fontWeight: 600 }}>{currentIndex + 1}</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span>{photos.length || 1}</span>
        </div>

        {/* Right Action Icons */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {/* Watermark preview toggle */}
          <button
            onClick={() => setIsWatermarked(!isWatermarked)}
            title={isWatermarked ? 'Watermark visible' : 'Watermark hidden'}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: isWatermarked ? 'rgba(201, 168, 106, 0.2)' : 'rgba(20, 20, 24, 0.65)',
              border: isWatermarked ? '1px solid var(--gold-champagne)' : '1px solid rgba(255, 255, 255, 0.12)',
              color: isWatermarked ? 'var(--gold-soft)' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Shield size={18} />
          </button>

          {/* Album Selection Toggle */}
          <button
            onClick={() => onToggleSelection && onToggleSelection(photo)}
            title={isSelected ? 'Selected for album' : 'Select for album'}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: isSelected ? 'var(--gold-champagne)' : 'rgba(20, 20, 24, 0.65)',
              border: isSelected ? '1px solid #fff' : '1px solid rgba(255, 255, 255, 0.12)',
              color: isSelected ? '#000' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Check size={18} strokeWidth={isSelected ? 3 : 2} />
          </button>

          {/* Favorite Heart */}
          <button
            onClick={() => onToggleFavorite && onToggleFavorite(photo)}
            title={isFavorited ? 'Favorited' : 'Favorite photo'}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: isFavorited ? 'rgba(235, 77, 75, 0.85)' : 'rgba(20, 20, 24, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Heart size={18} fill={isFavorited ? '#fff' : 'none'} />
          </button>

          {/* Comments Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            title="Discussion & Comments"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: showComments ? 'rgba(255, 255, 255, 0.25)' : 'rgba(20, 20, 24, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <MessageSquare size={18} />
            {comments.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: 'var(--gold-champagne)',
                  color: '#000',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {comments.length}
              </span>
            )}
          </button>

          {/* Direct Download */}
          <button
            onClick={handleDirectDownload}
            title="Download photograph"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(20, 20, 24, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Download size={18} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            title="Copy link"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: copyFeedback ? 'rgba(103, 194, 58, 0.4)' : 'rgba(20, 20, 24, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: copyFeedback ? '#67C23A' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {copyFeedback ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            title="Close viewer (ESC)"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
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

      {/* Main Image Stage */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '60px 40px 80px 40px',
          overflow: 'hidden'
        }}
      >
        {/* Navigation Arrow Left */}
        {currentIndex > 0 && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            style={{
              position: 'absolute',
              left: '24px',
              zIndex: 30,
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(20, 20, 24, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {currentIndex < photos.length - 1 && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            style={{
              position: 'absolute',
              right: '24px',
              zIndex: 30,
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(20, 20, 24, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Center Photograph */}
        <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={photo.webUrl || photo.url}
            alt={photo.title}
            style={{
              maxWidth: '92vw',
              maxHeight: '84vh',
              objectFit: 'contain',
              borderRadius: '6px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.85)',
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.25s ease'
            }}
          />

          {/* Watermark Overlay */}
          {isWatermarked && (
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                right: '32px',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                letterSpacing: '0.24em',
                color: 'rgba(201, 168, 106, 0.35)',
                textTransform: 'uppercase',
                pointerEvents: 'none',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)'
              }}
            >
              SIGNATURE BY MARVAN
            </div>
          )}
        </div>
      </div>

      {/* Bottom Photo Title & Metadata Info */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          background: 'rgba(15, 15, 18, 0.7)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '30px',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}
      >
        <span style={{ color: '#fff', fontWeight: 500 }}>{photo.title}</span>
        <span>•</span>
        <span>{photo.category}</span>
        <span>•</span>
        <span>{photo.aspectRatio}</span>
      </div>

      {/* Comments Drawer / Side Glass Panel */}
      {showComments && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '100%',
            maxWidth: '380px',
            background: 'rgba(12, 12, 14, 0.92)',
            backdropFilter: 'blur(36px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.14)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div
            style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff' }}>
              Photo Discussion
            </h4>
            <button
              onClick={() => setShowComments(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Comment list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px', fontSize: '0.85rem' }}>
                No comments yet. Leave a note or request for your photographer!
              </div>
            ) : (
              comments.map((cmt) => (
                <div
                  key={cmt.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '12px 16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--gold-soft)', fontWeight: 600 }}>{cmt.userName}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{cmt.userRole}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#fff', lineHeight: 1.4 }}>{cmt.content}</p>

                  {/* Photographer Replies */}
                  {cmt.replies && cmt.replies.map((rep) => (
                    <div
                      key={rep.id}
                      style={{
                        marginTop: '10px',
                        padding: '10px 12px',
                        background: 'rgba(201, 168, 106, 0.08)',
                        borderLeft: '2px solid var(--gold-champagne)',
                        borderRadius: '0 8px 8px 0'
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: 'var(--gold-champagne)', fontWeight: 600, marginBottom: '4px' }}>
                        {rep.userName} ({rep.userRole})
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#ddd' }}>{rep.content}</p>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <form onSubmit={handleSendComment} style={{ padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Ask or leave a note..."
                className="glass-input"
                style={{ fontSize: '0.85rem' }}
              />
              <button
                type="submit"
                disabled={commentSending || !commentText.trim()}
                className="glass-btn glass-btn-gold"
                style={{ padding: '0 16px', minHeight: '44px' }}
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
