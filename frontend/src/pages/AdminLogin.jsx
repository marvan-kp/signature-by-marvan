import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Lock, Mail } from 'lucide-react';
import { GlassNavbar } from '../components/glass/GlassNavbar';
import { GlassCard, GlassButton } from '../components/glass/GlassCard';
import { useAuth } from '../context/AuthContext';

export function AdminLogin() {
  const [email, setEmail] = useState('marvan@signaturebymarvan.com');
  const [password, setPassword] = useState('signature2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginStudio } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginStudio(email.trim(), password.trim());
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-pitch)', color: '#fff', position: 'relative' }}>
      <GlassNavbar />

      <div
        style={{
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
            maxWidth: '440px',
            padding: '48px 36px',
            borderRadius: '28px',
            border: '1px solid rgba(201, 168, 106, 0.35)',
            textAlign: 'center'
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
            <Shield size={24} />
          </div>

          <span style={{ fontSize: '0.74rem', letterSpacing: '0.24em', color: 'var(--gold-soft)', textTransform: 'uppercase', fontWeight: 600 }}>
            STUDIO ATELIER
          </span>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: '#fff', marginTop: '6px', marginBottom: '8px' }}>
            Photographer Portal
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '28px' }}>
            Authenticate with your studio credentials to manage client galleries, review selections, and monitor storage.
          </p>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(245, 108, 108, 0.15)', border: '1px solid rgba(245, 108, 108, 0.3)', color: '#F56C6C', fontSize: '0.8rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  className="glass-input"
                  style={{ paddingLeft: '40px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  className="glass-input"
                  style={{ paddingLeft: '40px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <GlassButton
              type="submit"
              variant="gold"
              disabled={loading}
              style={{ width: '100%', minHeight: '48px', marginTop: '10px' }}
              icon={ArrowRight}
            >
              {loading ? 'AUTHENTICATING...' : 'ENTER STUDIO DASHBOARD'}
            </GlassButton>
          </form>

          <div style={{ marginTop: '24px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Default Studio Master: <code>marvan@signaturebymarvan.com</code>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
