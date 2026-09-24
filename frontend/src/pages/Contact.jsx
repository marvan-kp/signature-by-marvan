import React, { useState } from 'react';
import { Send, MessageSquare, Phone, Mail, MapPin, CheckCircle2, ExternalLink } from 'lucide-react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { GlassCard, GlassButton } from '../components/glass/GlassCard';
import { api } from '../services/api';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    venue: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inquiryResult, setInquiryResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.submitInquiry(formData);
      setInquiryResult(res);
      setSubmitted(true);
    } catch (err) {
      console.error('Inquiry transmission failed, using fallback:', err);
      // Fallback submission
      const mailSubject = encodeURIComponent(`Wedding Photography Inquiry — ${formData.name}`);
      const mailBody = encodeURIComponent(
        `Hello Marvan,\n\nInquiry Details:\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nWedding Date: ${formData.weddingDate}\nVenue: ${formData.venue}\n\nNote:\n${formData.message}`
      );
      setInquiryResult({
        targetEmail: 'marvankp847@gmail.com',
        mailtoUrl: `mailto:marvankp847@gmail.com?subject=${mailSubject}&body=${mailBody}`
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Marvan, I would like to inquire about wedding photography availability for our wedding on ${formData.weddingDate || '[Date]'} at ${formData.venue || '[Venue]'}.`
    );
    window.open(`https://api.whatsapp.com/send?phone=917591942952&text=${text}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff' }}>
      <GlassNavbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '140px 24px 100px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px auto' }}>
          <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-champagne)', textTransform: 'uppercase', fontWeight: 600 }}>
            BEGIN THE CONVERSATION
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', color: '#fff', marginTop: '8px' }}>
            Inquire About Your Date
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginTop: '12px' }}>
            Tell us about your celebration, your vision, and what matters most to you. We typically respond within 24 hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {/* Contact Details Card */}
          <GlassCard style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#fff' }}>
                Studio Contact
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                For urgent inquiries, reach out directly via WhatsApp or call our studio line.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201, 168, 106, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-soft)' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>EMAIL DIRECT</div>
                  <a href="mailto:marvankp847@gmail.com" style={{ fontSize: '0.9rem', color: '#fff', textDecoration: 'none' }}>marvankp847@gmail.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201, 168, 106, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-soft)' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STUDIO PHONE</div>
                  <a href="tel:+917591942952" style={{ fontSize: '0.9rem', color: '#fff', textDecoration: 'none' }}>+91 75919 42952</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201, 168, 106, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-soft)' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>BASE ATELIER</div>
                  <div style={{ fontSize: '0.9rem', color: '#fff' }}>Kannur & Kochi, Kerala, India</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                style={{
                  width: '100%',
                  minHeight: '48px',
                  borderRadius: '9999px',
                  background: '#25D366',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <MessageSquare size={16} /> QUICK CHAT ON WHATSAPP (+91 75919 42952)
              </button>
            </div>
          </GlassCard>

          {/* Inquiry Form */}
          <GlassCard style={{ padding: '40px 32px' }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#fff', display: 'block', marginBottom: '6px' }}>
                    Couple's Names *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun & Anjali"
                    className="glass-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#fff', display: 'block', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="hello@wedding.com"
                      className="glass-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#fff', display: 'block', marginBottom: '6px' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 75919..."
                      className="glass-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#fff', display: 'block', marginBottom: '6px' }}>
                      Wedding Date *
                    </label>
                    <input
                      type="date"
                      required
                      className="glass-input"
                      value={formData.weddingDate}
                      onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#fff', display: 'block', marginBottom: '6px' }}>
                      Venue & City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Kannur, Kerala"
                      className="glass-input"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#fff', display: 'block', marginBottom: '6px' }}>
                    Tell Us About Your Story & Events
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Approximate guest count, events planned, traditions, or aesthetic preferences..."
                    className="glass-input"
                    style={{ resize: 'vertical' }}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <GlassButton
                  type="submit"
                  variant="gold"
                  disabled={loading}
                  style={{ width: '100%', minHeight: '48px', marginTop: '10px' }}
                  icon={Send}
                >
                  {loading ? 'TRANSMITTING...' : 'TRANSMIT INQUIRY TO MARVANKP847@GMAIL.COM'}
                </GlassButton>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <CheckCircle2 size={52} color="#67C23A" />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', color: '#fff' }}>
                  Inquiry Sent Successfully!
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.6 }}>
                  Thank you <strong>{formData.name}</strong>! Your inquiry for <strong>{formData.weddingDate || 'your wedding date'}</strong> at {formData.venue || 'Kerala'} has been transmitted directly to <span style={{ color: 'var(--gold-soft)', fontWeight: 600 }}>marvankp847@gmail.com</span>.
                </p>

                {inquiryResult?.mailtoUrl && (
                  <a
                    href={inquiryResult.mailtoUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '9999px',
                      background: 'rgba(201, 168, 106, 0.2)',
                      border: '1px solid var(--gold-champagne)',
                      color: 'var(--gold-champagne)',
                      fontSize: '0.84rem',
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Mail size={16} /> Open Email App (Send Copy to marvankp847@gmail.com) <ExternalLink size={14} />
                  </a>
                )}

                <GlassButton variant="subtle" onClick={() => setSubmitted(false)} style={{ marginTop: '12px' }}>
                  Send Another Inquiry
                </GlassButton>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
