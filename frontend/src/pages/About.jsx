import React from 'react';
import { Camera, Award, Sparkles, Heart } from 'lucide-react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { GlassCard } from '../components/glass/GlassCard';

export function About() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff' }}>
      <GlassNavbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '140px 24px 100px 24px' }}>
        {/* Intro Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-champagne)', textTransform: 'uppercase', fontWeight: 600 }}>
              THE ARTIST BEHIND THE LENS
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: '#fff', margin: '12px 0 20px 0' }}>
              Marvan K.P.
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
              "A wedding is not a set of staged poses. It is a symphony of quiet glances, trembling hands tying the sacred thali, ocean winds catching fine silk, and the heartfelt laughter of those who love you most."
            </p>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Based in Kerala and documenting destination weddings worldwide, Marvan blends classical fine-art portraiture with cinematic reportage. With over a decade behind the camera, every wedding is approached as an heirloom legacy.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 30px 70px rgba(0,0,0,0.7)',
                border: '1px solid rgba(201, 168, 106, 0.3)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85"
                alt="Marvan K.P."
                style={{ width: '100%', height: '520px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Pillars / Philosophy */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            {
              icon: Camera,
              title: 'Master Optics',
              desc: 'Shot using medium-format and full-frame prime cinema lenses for rich micro-contrast and creamy subject separation.'
            },
            {
              icon: Sparkles,
              title: 'Bespoke Color Science',
              desc: 'Custom-tailored analog film emulation palettes highlighting luminous skin tones, gold temple embroidery, and rich deep shadows.'
            },
            {
              icon: Heart,
              title: 'Candid Intimacy',
              desc: 'We remain unobtrusive observers, letting you fully immerse in your celebration while capturing unscripted pure emotions.'
            },
            {
              icon: Award,
              title: 'Heirloom Printing',
              desc: 'Fine Italian leather, Japanese silk papers, and archival pigment inks guaranteed to resist fading for centuries.'
            }
          ].map((item, idx) => (
            <GlassCard key={idx} style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(201, 168, 106, 0.15)',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-soft)'
                }}
              >
                <item.icon size={18} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
