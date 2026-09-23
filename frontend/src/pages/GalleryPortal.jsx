import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { GlassCard, GlassButton } from '../components/glass/GlassCard';
import { useAuth } from '../context/AuthContext';

export function GalleryPortal() {
  const [galleryCode, setGalleryCode] = useState('arjun-anjali-x82k');
  const [pin, setPin] = useState('2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginClientWithPin } = useAuth();
  const navigate = useNavigate();

  const handleEnterGallery = async (e) => {
    e.preventDefault();
    if (!galleryCode.trim() || !pin.trim()) {
      setError('Please enter both your gallery code/link and PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loginClientWithPin(galleryCode.trim(), pin.trim());
      navigate(`/gallery/${galleryCode.trim()}`);
    } catch (err) {
      setError(err.message || 'Incorrect PIN or gallery code. Please check your wedding invitation link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff', position: 'relative' }}>
      <GlassNavbar />

      {/* Cinematic Background with Vignette */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2600&q=90"
          alt="Client Gallery Portal"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.38) contrast(1.1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.92) 100%)' }} />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 24px 60px 24px'
        }}
      >
        <GlassCard
          elevated
          style={{
            width: '100%',
            maxWidth: '460px',
            padding: '48px 36px',
            textAlign: 'center',
            borderRadius: '28px',
            border: '1px solid rgba(201, 168, 106, 0.35)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.15)'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(201, 168, 106, 0.15)',
              border: '1px solid rgba(201, 168, 106, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-soft)',
              margin: '0 auto 16px auto'
            }}
          >
            <Lock size={22} />
          </div>

          <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-soft)', textTransform: 'uppercase', fontWeight: 600 }}>
            YOUR MEMORIES AWAIT
          </span>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: '#fff', marginTop: '6px', marginBottom: '8px' }}>
            Private Client Gallery
          </h2>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '28px' }}>
            Enter the 4-digit PIN provided in your invitation message to unlock your high-resolution wedding collection.
          </p>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(245, 108, 108, 0.15)',
                border: '1px solid rgba(245, 108, 108, 0.35)',
                color: '#F56C6C',
                fontSize: '0.8rem',
                marginBottom: '18px',
                textAlign: 'left'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleEnterGallery} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Gallery Name or Code
              </label>
              <input
                type="text"
                required
                className="glass-input"
                placeholder="e.g. arjun-anjali-x82k"
                value={galleryCode}
                onChange={(e) => setGalleryCode(e.target.value)}
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                4-Digit Gallery PIN
              </label>
              <input
                type="password"
                maxLength={8}
                required
                className="glass-input"
                placeholder="• • • •"
                style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem', fontFamily: 'monospace' }}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>

            <GlassButton
              type="submit"
              variant="gold"
              disabled={loading}
              style={{ width: '100%', minHeight: '48px', marginTop: '10px' }}
              icon={ArrowRight}
            >
              {loading ? 'UNLOCKING...' : 'ENTER GALLERY'}
            </GlassButton>
          </form>

          {/* Demonstration Quick Tip */}
          <div
            style={{
              marginTop: '28px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}
          >
            <div style={{ color: 'var(--gold-soft)', fontWeight: 600, marginBottom: '2px' }}>
              Demo Wedding Credentials
            </div>
            <div>Code: <code>arjun-anjali-x82k</code> • PIN: <code>2026</code></div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
