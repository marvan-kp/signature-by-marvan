import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Sparkles, Film, Heart, Award, ChevronDown } from 'lucide-react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { GlassButton, GlassCard } from '../components/glass/GlassCard';

export function Home() {
  const featuredWeddings = [
    {
      id: 'arjun-anjali-x82k',
      title: 'ARJUN & ANJALI',
      subtitle: 'A Coastal Monsoon Story',
      location: 'Kannur, Kerala',
      date: '12 February 2026',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
      slug: 'arjun-anjali-x82k'
    },
    {
      id: 'rahul-meera',
      title: 'RAHUL & MEERA',
      subtitle: 'Heirloom Heritage Celebration',
      location: 'Bolgatty Palace, Kochi',
      date: '20 January 2026',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85',
      slug: 'arjun-anjali-x82k' // Link to working showcase
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff', position: 'relative' }}>
      <GlassNavbar />

      {/* Cinematic Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '700px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          overflow: 'hidden'
        }}
      >
        {/* Hero Background Photograph */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2600&q=90"
            alt="Signature by Marvan Wedding Photography"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.68) contrast(1.05)'
            }}
          />
          {/* Subtle cinematic gradient overlays */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.2) 50%, rgba(5,5,5,0.95) 100%)'
            }}
          />
        </div>

        {/* Center Hero Editorial Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '900px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '9999px',
              background: 'rgba(201, 168, 106, 0.12)',
              border: '1px solid rgba(201, 168, 106, 0.3)',
              fontSize: '0.72rem',
              letterSpacing: '0.24em',
              color: 'var(--gold-soft)',
              textTransform: 'uppercase',
              fontWeight: 600
            }}
          >
            <Sparkles size={12} />
            PREMIUM WEDDING PHOTOGRAPHY & CINEMATIC STORIES
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.8rem, 7vw, 5.8rem)',
              lineHeight: 1.02,
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              textTransform: 'uppercase'
            }}
          >
            SIGNATURE
            <span
              style={{
                display: 'block',
                fontSize: 'clamp(1rem, 2.5vw, 1.8rem)',
                letterSpacing: '0.34em',
                color: 'var(--gold-champagne)',
                fontWeight: 300,
                marginTop: '4px'
              }}
            >
              BY MARVAN
            </span>
          </h1>

          <p
            className="brand-tagline"
            style={{
              fontSize: 'clamp(0.78rem, 1.4vw, 1.05rem)',
              letterSpacing: '0.3em',
              color: '#fff',
              marginTop: '4px',
              fontWeight: 400
            }}
          >
            YOUR MOMENTS. YOUR STORY. YOUR SIGNATURE.
          </p>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              lineHeight: 1.6,
              marginTop: '6px'
            }}
          >
            "Premium wedding photography and cinematic stories, beautifully preserved for generations."
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '16px'
            }}
          >
            <Link to="/portfolio" style={{ textDecoration: 'none' }}>
              <GlassButton variant="gold" size="lg" icon={ArrowRight}>
                VIEW PORTFOLIO
              </GlassButton>
            </Link>

            <Link to="/gallery" style={{ textDecoration: 'none' }}>
              <GlassButton variant="default" size="lg" icon={Lock}>
                CLIENT GALLERY
              </GlassButton>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}
        >
          <span>DISCOVER</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </section>

      {/* Featured Wedding Stories Section */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-champagne)', textTransform: 'uppercase', fontWeight: 600 }}>
            EDITORIAL SHOWCASE
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: '#fff', marginTop: '8px' }}>
            Featured Wedding Stories
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '520px', margin: '12px auto 0 auto' }}>
            Every wedding is an unrepeatable narrative. Step into our recent cinematic storybooks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {featuredWeddings.map((w) => (
            <Link
              key={w.id}
              to={`/weddings/${w.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="glass-surface-card"
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '460px'
                }}
              >
                <img
                  src={w.image}
                  alt={w.title}
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
                    background: 'linear-gradient(to top, rgba(5,5,5,0.92) 15%, rgba(5,5,5,0.1) 60%, rgba(5,5,5,0.3) 100%)'
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
                    gap: '6px'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--gold-soft)', textTransform: 'uppercase' }}>
                    {w.location} • {w.date}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', letterSpacing: '0.04em' }}>
                    {w.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {w.subtitle}
                  </p>
                  <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--gold-champagne)', fontSize: '0.82rem', fontWeight: 600 }}>
                    READ FULL STORY <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* The Signature Standard Experience */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--bg-pitch) 0%, rgba(13, 13, 15, 0.7) 50%, var(--bg-pitch) 100%)',
          padding: '100px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-champagne)', textTransform: 'uppercase', fontWeight: 600 }}>
              LUXURY PLATFORM
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: '#fff', marginTop: '8px' }}>
              The Signature Experience
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '540px', margin: '12px auto 0 auto' }}>
              Engineered exclusively for discerning couples who treasure fine-art memories.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: Lock,
                title: 'Private Client Galleries',
                desc: 'PIN-secured, high-speed private delivery with dedicated albums, no ads, and full download control.'
              },
              {
                icon: Film,
                title: 'Cinematic Slideshows',
                desc: 'Experience your wedding as a cinematic story with smooth Ken Burns panning and ambient music.'
              },
              {
                icon: Heart,
                title: 'Curated Album Selection',
                desc: 'Mark favorites, collaborate directly with Marvan on cover selections, and submit album limits with one click.'
              },
              {
                icon: Award,
                title: 'Master Originals & 4K',
                desc: 'Web-optimized for rapid social sharing, plus direct access to full uncompressed print-ready files.'
              }
            ].map((f, i) => (
              <GlassCard key={i} style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(201, 168, 106, 0.12)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-soft)'
                  }}
                >
                  <f.icon size={20} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#fff' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Client Gallery Access CTA */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <div
          className="glass-surface-elevated"
          style={{
            borderRadius: '32px',
            padding: '64px 32px',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-champagne)', textTransform: 'uppercase', fontWeight: 600 }}>
            PRIVATE ACCESS
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', color: '#fff', margin: '12px 0 16px 0' }}>
            Your Memories Await
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', maxWidth: '520px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            Enter your 4-digit gallery PIN or secure private link to step inside your wedding collection.
          </p>
          <Link to="/gallery" style={{ textDecoration: 'none' }}>
            <GlassButton variant="gold" size="lg" icon={Lock}>
              ENTER CLIENT GALLERY
            </GlassButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '60px 24px 40px 24px',
          background: 'var(--bg-deep)'
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '0.12em', color: '#fff' }}>
                SIGNATURE <span style={{ color: 'var(--gold-champagne)', fontSize: '0.9rem' }}>BY MARVAN</span>
              </div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.24em', color: 'var(--gold-soft)', textTransform: 'uppercase', marginTop: '2px' }}>
                YOUR MOMENTS. YOUR STORY. YOUR SIGNATURE.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem' }}>
              <Link to="/portfolio" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Portfolio</Link>
              <Link to="/weddings" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Weddings</Link>
              <Link to="/services" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Services</Link>
              <Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact</Link>
              <Link to="/admin/login" style={{ color: 'var(--gold-soft)', textDecoration: 'none' }}>Studio Login</Link>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '10px' }}>
            <div>© {new Date().getFullYear()} SIGNATURE BY MARVAN. All photographs protected under international copyright.</div>
            <div>Kannur • Kochi • Calicut • Worldwide Destination Weddings</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
