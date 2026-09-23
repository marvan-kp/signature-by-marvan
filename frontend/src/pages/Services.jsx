import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Shield, ArrowRight } from 'lucide-react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { GlassCard, GlassButton } from '../components/glass/GlassCard';

export function Services() {
  const packages = [
    {
      title: 'ROYAL HERITAGE',
      tagline: 'Complete 2-Day Traditional Celebrations',
      price: 'Curated On Request',
      features: [
        'Principal Photographer Marvan + Senior Associate team',
        'Full coverage of Pre-wedding, Mehendi/Haldi, Ceremony & Reception',
        'Private Liquid Glass Client Gallery with lifetime archival backup',
        'Handcrafted 12x18 Italian Leather Heirloom Album (80 Spreads)',
        '4K Cinema Wedding Highlights & Teaser Reels for Instagram',
        'Express 2-week sneak peek delivery with uncompressed print files'
      ],
      popular: true
    },
    {
      title: 'DESTINATION SIGNATURE',
      tagline: 'Palaces, Coastal Escapes & Overseas Nuptials',
      price: 'Curated On Request',
      features: [
        'Comprehensive 3-Day Wedding Documentary by Marvan',
        'Sunset Pre-Wedding editorial session in location of choice',
        'Drone aerial 4K cinematography & sound recorded vows',
        '2 Parent Heirloom Keepsake albums + 1 Luxury Master Box',
        'Personal selection review and bespoke retouching consultation',
        'All master RAW and high-resolution files delivered on engraved crystal USB'
      ],
      popular: false
    },
    {
      title: 'INTIMATE SOIRÉE',
      tagline: 'Temple Weddings, Elopements & Boutique Receptions',
      price: 'Curated On Request',
      features: [
        'Full day coverage by Marvan',
        'Fine-art couple editorial portraits & family rituals',
        'Private PIN-secured Liquid Glass gallery for client & guests',
        'Handmade Linen Bound 10x14 Album (40 Spreads)',
        'Web & High-Resolution download center for all guests',
        'Fast delivery within 30 days'
      ],
      popular: false
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff' }}>
      <GlassNavbar />

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '140px 24px 100px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px auto' }}>
          <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-champagne)', textTransform: 'uppercase', fontWeight: 600 }}>
            COLLECTIONS & COMMISSIONS
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: '#fff', marginTop: '8px' }}>
            Wedding Collections
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginTop: '12px' }}>
            We accept a strictly limited number of wedding commissions annually to ensure meticulous artistry and personal attention for every couple.
          </p>
        </div>

        {/* Packages Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {packages.map((pkg, i) => (
            <GlassCard
              key={i}
              style={{
                padding: '40px 32px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: pkg.popular ? '1px solid var(--gold-champagne)' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: pkg.popular ? '0 20px 60px rgba(201, 168, 106, 0.15)' : 'none'
              }}
            >
              {pkg.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--gold-champagne)',
                    color: '#000',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    padding: '4px 16px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase'
                  }}
                >
                  MOST COMMISSIONED
                </div>
              )}

              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff', letterSpacing: '0.06em' }}>
                {pkg.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gold-soft)', marginBottom: '24px' }}>
                {pkg.tagline}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, marginBottom: '32px' }}>
                {pkg.features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <div style={{ color: 'var(--gold-champagne)', marginTop: '2px' }}>
                      <Check size={16} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <GlassButton
                  variant={pkg.popular ? 'gold' : 'default'}
                  style={{ width: '100%', minHeight: '48px' }}
                  icon={ArrowRight}
                >
                  INQUIRE AVAILABILITY
                </GlassButton>
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
