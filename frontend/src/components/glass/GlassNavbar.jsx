import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Menu, X, Shield, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function GlassNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isStudioAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Weddings', path: '/weddings' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: scrolled ? '12px 24px' : '22px 32px',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}
    >
      <nav
        style={{
          width: '100%',
          maxWidth: '1240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'auto',
          background: scrolled ? 'rgba(10, 10, 12, 0.78)' : 'rgba(13, 13, 15, 0.5)',
          backdropFilter: scrolled ? 'blur(30px) saturate(150%)' : 'blur(20px)',
          WebkitBackdropFilter: scrolled ? 'blur(30px) saturate(150%)' : 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: scrolled ? '40px' : '24px',
          padding: '10px 24px',
          boxShadow: scrolled
            ? '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)'
            : '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: '#fff'
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(201,168,106,0.3), rgba(255,255,255,0.05))',
              border: '1px solid rgba(201, 168, 106, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-soft)'
            }}
          >
            <Camera size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                letterSpacing: '0.12em',
                fontWeight: 500,
                color: '#fff'
              }}
            >
              SIGNATURE
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.24em',
                color: 'var(--gold-champagne)',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginTop: '-3px'
              }}
            >
              BY MARVAN
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '28px'
          }}
          className="desktop-nav-items"
        >
          {navLinks.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  color: active ? 'var(--gold-soft)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.86rem',
                  letterSpacing: '0.04em',
                  fontWeight: active ? '600' : '400',
                  transition: 'color 0.2s ease',
                  position: 'relative'
                }}
              >
                {item.label}
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--gold-champagne)'
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA & Portal Buttons */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '12px'
          }}
          className="desktop-nav-actions"
        >
          {isStudioAdmin && (
            <Link
              to="/admin"
              className="glass-btn"
              style={{
                padding: '8px 16px',
                fontSize: '0.78rem',
                borderColor: 'var(--border-gold)',
                color: 'var(--gold-soft)'
              }}
            >
              <Shield size={14} />
              Studio Dashboard
            </Link>
          )}

          <Link
            to="/gallery"
            className="glass-btn glass-btn-gold"
            style={{
              padding: '8px 20px',
              fontSize: '0.8rem',
              letterSpacing: '0.08em'
            }}
          >
            <Lock size={14} />
            CLIENT GALLERY
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="mobile-nav-trigger"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Full-screen Mobile Glass Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(5, 5, 5, 0.94)',
            backdropFilter: 'blur(36px)',
            WebkitBackdropFilter: 'blur(36px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            pointerEvents: 'auto',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', letterSpacing: '0.1em' }}>
              SIGNATURE <span style={{ color: 'var(--gold-champagne)', fontSize: '0.85rem' }}>BY MARVAN</span>
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={22} />
            </button>
          </div>

          <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: location.pathname === item.path ? 'var(--gold-soft)' : '#fff',
                  textDecoration: 'none',
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-serif)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: '12px'
                }}
              >
                {item.label}
                <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Link
              to="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="glass-btn glass-btn-gold"
              style={{ width: '100%', minHeight: '50px', fontSize: '0.9rem' }}
            >
              <Lock size={16} /> CLIENT GALLERY
            </Link>
            {isStudioAdmin ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-btn"
                style={{ width: '100%', minHeight: '50px', color: 'var(--gold-soft)' }}
              >
                <Shield size={16} /> STUDIO DASHBOARD
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="glass-btn"
                style={{ width: '100%', minHeight: '50px', color: 'var(--text-secondary)' }}
              >
                STUDIO LOGIN
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-items { display: flex !important; }
          .desktop-nav-actions { display: flex !important; }
          .mobile-nav-trigger { display: none !important; }
        }
      `}</style>
    </header>
  );
}
