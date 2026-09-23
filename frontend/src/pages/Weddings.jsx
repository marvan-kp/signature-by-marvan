import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { api } from '../services/api';

export function Weddings() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGalleries()
      .then(setGalleries)
      .catch(err => console.warn('Could not load galleries:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff' }}>
      <GlassNavbar />

      <div style={{ paddingTop: '140px', paddingBottom: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-champagne)', textTransform: 'uppercase', fontWeight: 600 }}>
          CINEMATIC ARCHIVES
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: '#fff', marginTop: '8px' }}>
          Wedding Stories
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginTop: '12px' }}>
          Real South Indian and destination weddings captured with cinematic intimacy and timeless editorial elegance.
        </p>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 24px 100px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px' }}>
          {galleries.map((gal) => (
            <Link
              key={gal.id}
              to={`/weddings/${gal.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="glass-surface-card"
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '480px'
                }}
              >
                <img
                  src={gal.coverImage}
                  alt={gal.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(5,5,5,0.95) 15%, rgba(5,5,5,0.1) 60%, rgba(5,5,5,0.4) 100%)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.74rem', color: 'var(--gold-soft)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {gal.location}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> {gal.eventDate}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#fff', letterSpacing: '0.04em' }}>
                    {gal.title}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    {gal.subtitle}
                  </p>

                  <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--gold-champagne)', fontSize: '0.85rem', fontWeight: 600 }}>
                    EXPLORE STORY CHAPTERS <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
