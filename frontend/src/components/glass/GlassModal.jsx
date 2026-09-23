import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function GlassModal({ isOpen, onClose, title, children, maxWidth = '550px' }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(3, 3, 5, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth,
          background: 'rgba(17, 17, 19, 0.88)',
          backdropFilter: 'blur(36px) saturate(160%)',
          WebkitBackdropFilter: 'blur(36px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '24px',
          boxShadow: '0 25px 70px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
          padding: '28px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          {title && (
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', letterSpacing: '0.02em' }}>
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function GlassProgress({ value = 0, max = 100, label, height = 8, alertLevel = null }) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  
  const barColor = {
    WARNING: '#E6A23C',
    CRITICAL: '#F56C6C',
    LOCKED: '#F56C6C',
    NOTICE: 'var(--gold-champagne)',
    NORMAL: 'linear-gradient(90deg, #C9A86A, #E8D3A7)'
  }[alertLevel] || 'linear-gradient(90deg, #C9A86A, #E8D3A7)';

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>{label}</span>
          <span style={{ fontWeight: 600, color: '#fff' }}>{percent}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '9999px',
          overflow: 'hidden',
          padding: '1px'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: barColor,
            borderRadius: '9999px',
            transition: 'width 0.4s ease'
          }}
        />
      </div>
    </div>
  );
}
