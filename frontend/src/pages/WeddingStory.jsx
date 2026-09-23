import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { GlassButton } from '../components/glass/GlassCard';
import { api } from '../services/api';

export function WeddingStory() {
  const { slug } = useParams();
  const [gallery, setGallery] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const targetSlug = slug || 'arjun-anjali-x82k';
    api.getGallery(targetSlug)
      .then((g) => {
        setGallery(g);
        return api.getPhotos(g.id);
      })
      .then((p) => {
        setPhotos(p);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching wedding story:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading wedding story...
      </div>
    );
  }

  // Story chapters
  const chapters = gallery?.storyChapters || [
    { title: 'THE BEGINNING', description: 'Quiet dawn preparations, soft jasmine garlands, and heirloom silks.' },
    { title: 'THE CEREMONY', description: 'Sacred thali tied amidst Vedic chants and temple bells echoing over the Arabian Sea.' },
    { title: 'THE MOMENTS', description: 'Stolen glances, joyous laughter, and tearful hugs from proud elders.' },
    { title: 'THE DETAILS', description: 'Handcrafted temple jewelry, Kasavu weaves, and crimson lotus blooms.' },
    { title: 'THE CELEBRATION', description: 'Sunset revelry, laughter under glowing bistro lights, and celebratory music.' },
    { title: 'FOREVER', description: 'A quiet embrace by the ocean tide as the first evening stars appear.' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff' }}>
      <GlassNavbar />

      {/* Hero Story Banner */}
      <section
        style={{
          position: 'relative',
          height: '80vh',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px'
        }}
      >
        <img
          src={gallery?.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=90'}
          alt={gallery?.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.6)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0.3) 60%, rgba(5,5,5,1) 100%)'
          }}
        />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', animation: 'fadeIn 0.6s ease' }}>
          <span style={{ fontSize: '0.74rem', letterSpacing: '0.28em', color: 'var(--gold-soft)', textTransform: 'uppercase', fontWeight: 600 }}>
            A WEDDING STORY
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
              color: '#fff',
              margin: '8px 0 16px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {gallery?.title || 'ARJUN & ANJALI'}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="var(--gold-champagne)" /> {gallery?.location || 'Kannur, Kerala'}
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="var(--gold-champagne)" /> {gallery?.eventDate || '12 February 2026'}
            </span>
          </div>
        </div>
      </section>

      {/* Chapters Narrative Flow */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px 100px 24px', display: 'flex', flexDirection: 'column', gap: '80px' }}>
        {chapters.map((ch, index) => {
          const associatedPhoto = photos[index % photos.length];
          const isEven = index % 2 === 0;

          return (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '40px',
                alignItems: 'center'
              }}
            >
              {/* Image Side */}
              <div
                style={{
                  order: isEven ? 1 : 2,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <img
                  src={associatedPhoto?.webUrl || associatedPhoto?.url}
                  alt={ch.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '420px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>

              {/* Text Side */}
              <div style={{ order: isEven ? 2 : 1, padding: '20px' }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.22em', color: 'var(--gold-champagne)', textTransform: 'uppercase', fontWeight: 600 }}>
                  CHAPTER {String(index + 1).padStart(2, '0')}
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: '#fff', margin: '8px 0 16px 0' }}>
                  {ch.title}
                </h2>
                <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'var(--font-sans)' }}>
                  {ch.description}
                </p>
                <div style={{ marginTop: '20px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Signature by Marvan Master Curation
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* End Call to Action: View Private Gallery */}
      <section
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '100px 24px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, var(--bg-pitch) 0%, rgba(13, 13, 15, 0.8) 100%)'
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-soft)', textTransform: 'uppercase', fontWeight: 600 }}>
            ACCESS COMPLETE COLLECTION
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', color: '#fff' }}>
            Experience the Entire Gallery
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Browse all {gallery?.totalPhotos || 1248} photographs across Ceremony, Bride, Groom, and Reception albums. Enter PIN or request access.
          </p>

          <Link to={`/gallery/${gallery?.slug || 'arjun-anjali-x82k'}`} style={{ textDecoration: 'none' }}>
            <GlassButton variant="gold" size="lg" icon={Lock}>
              VIEW PRIVATE GALLERY
            </GlassButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
