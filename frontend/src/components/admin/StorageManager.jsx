import React, { useState } from 'react';
import {
  HardDrive,
  ShieldCheck,
  RefreshCw,
  Trash2,
  Sliders,
  Database,
  CheckCircle2,
  AlertTriangle,
  FolderArchive,
  Cloud,
  FileImage,
  Layers,
  Sparkles
} from 'lucide-react';
import { GlassCard, GlassButton } from '../glass/GlassCard';
import { GlassProgress } from '../glass/GlassModal';
import { api } from '../../services/api';

export function StorageManager({ storage, onStorageUpdated, onDataCleared }) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [breakdown, setBreakdown] = useState(null);

  // Storage Settings State
  const [selectedProvider, setSelectedProvider] = useState(storage?.provider || 'Unlimited Local Storage (Zero Cost)');
  const [unlimitedMode, setUnlimitedMode] = useState(storage?.limitFormatted === 'Unlimited');
  const [customLimitGB, setCustomLimitGB] = useState(20);

  const showFeedback = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSaveStorageConfig = async () => {
    setLoading(true);
    try {
      await api.updateStorageConfig({
        provider: selectedProvider,
        limitGB: customLimitGB,
        unlimitedMode
      });
      showFeedback('Storage policy updated successfully!');
      if (onStorageUpdated) onStorageUpdated();
    } catch (err) {
      alert('Could not update storage config: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateStorage = async () => {
    setLoading(true);
    try {
      const res = await api.recalculateStorage();
      setBreakdown(res.breakdown);
      showFeedback(`Disk recalculated: ${res.totalFormatted} across ${res.fileCount} files.`);
      if (onStorageUpdated) onStorageUpdated();
    } catch (err) {
      alert('Error calculating storage: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurgeCache = async () => {
    if (!window.confirm('Delete all temporary downloaded ZIP packages from cache to free up disk space? Originals and gallery photos remain 100% safe.')) return;
    setLoading(true);
    try {
      const res = await api.purgeDownloadCache();
      showFeedback(`Purged ${res.deletedFiles} temp ZIP files (${res.reclaimedFormatted} space freed).`);
      if (onStorageUpdated) onStorageUpdated();
    } catch (err) {
      alert('Error purging cache: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSampleData = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to remove all sample/demo wedding galleries and photographs?\n\nThis will give you a completely clean studio so you can upload and showcase only your REAL original client photographs.'
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await api.clearSampleData();
      showFeedback('All sample demo data removed! Studio is clean and ready for your real wedding clients.');
      if (onDataCleared) onDataCleared();
    } catch (err) {
      alert('Could not clear sample data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreSampleData = async () => {
    setLoading(true);
    try {
      await api.restoreSampleData();
      showFeedback('Sample portfolio and demo galleries restored.');
      if (onDataCleared) onDataCleared();
    } catch (err) {
      alert('Could not restore sample data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Toast Feedback */}
      {successMsg && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: '14px',
            background: 'rgba(103, 194, 58, 0.15)',
            border: '1px solid rgba(103, 194, 58, 0.35)',
            color: '#67C23A',
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {/* Grid: Storage Configuration & Quota Meter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        {/* Left: Free Storage Provider & Quota Management */}
        <GlassCard style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              <HardDrive size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff' }}>
                Storage Provider & Limits
              </h3>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Zero-cost free tier or local disk configuration
              </span>
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Select Storage Provider
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'Unlimited Local Storage (Zero Cost)', title: 'Free Local Server / Hard Drive', desc: 'Unlimited space on your machine. Zero cloud costs, zero monthly fees.' },
                { id: 'Cloudflare R2 Free Tier', title: 'Cloudflare R2 (10 GB Free)', desc: '10GB free tier per month with zero egress/download transfer fees.' },
                { id: 'AWS S3 Standard / Free Tier', title: 'Amazon AWS S3 Free Tier (5 GB)', desc: 'Standard cloud storage with signed expiring download tokens.' },
                { id: 'Supabase Storage Free Tier', title: 'Supabase Object Storage (1 GB Free)', desc: 'PostgreSQL-backed CDN object delivery.' }
              ].map((prov) => (
                <div
                  key={prov.id}
                  onClick={() => {
                    setSelectedProvider(prov.id);
                    if (prov.id.includes('Unlimited')) {
                      setUnlimitedMode(true);
                    } else {
                      setUnlimitedMode(false);
                    }
                  }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: selectedProvider === prov.id ? 'rgba(201, 168, 106, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: selectedProvider === prov.id ? '1px solid var(--gold-champagne)' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ color: selectedProvider === prov.id ? 'var(--gold-soft)' : '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
                    {prov.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {prov.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unlimited Local Mode Toggle */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                Free Unlimited Storage Mode
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Bypasses cloud quotas by utilizing local storage
              </div>
            </div>
            <input
              type="checkbox"
              checked={unlimitedMode}
              onChange={(e) => setUnlimitedMode(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--gold-champagne)', cursor: 'pointer' }}
            />
          </div>

          {/* Custom GB Limit if not unlimited */}
          {!unlimitedMode && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                <span>Free Tier Quota Limit</span>
                <span style={{ color: 'var(--gold-soft)', fontWeight: 600 }}>{customLimitGB} GB</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={customLimitGB}
                onChange={(e) => setCustomLimitGB(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold-champagne)' }}
              />
            </div>
          )}

          <GlassButton
            variant="gold"
            onClick={handleSaveStorageConfig}
            disabled={loading}
            style={{ width: '100%' }}
          >
            SAVE STORAGE SETTINGS
          </GlassButton>
        </GlassCard>

        {/* Right: Storage Breakdown & Optimization Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <GlassCard style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={18} color="var(--gold-soft)" />
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff' }}>
                  Live Storage Meter
                </h4>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--gold-champagne)', fontWeight: 600 }}>
                {storage?.usedFormatted} USED
              </span>
            </div>

            <GlassProgress
              value={storage?.percentage || 0}
              max={100}
              label={`Quota Utilization (${storage?.limitFormatted || '20 GB'} Capacity)`}
              alertLevel={storage?.warningLevel}
              height={10}
            />

            {/* Breakdown Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ORIGINALS (HIGH-RES)</div>
                <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>
                  {breakdown?.originals || '9.8 GB'}
                </div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>WEB DELIVERABLES</div>
                <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>
                  {breakdown?.web || '3.4 GB'}
                </div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>THUMBNAILS</div>
                <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>
                  {breakdown?.thumbnails || '840 MB'}
                </div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TEMP ZIP CACHE</div>
                <div style={{ fontSize: '1.1rem', color: 'var(--gold-soft)', fontWeight: 600 }}>
                  {breakdown?.tempZips || '360 MB'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <GlassButton
                variant="subtle"
                onClick={handleRecalculateStorage}
                disabled={loading}
                style={{ flex: 1, fontSize: '0.78rem' }}
                icon={RefreshCw}
              >
                RECALCULATE DISK
              </GlassButton>

              <GlassButton
                variant="outline-gold"
                onClick={handlePurgeCache}
                disabled={loading}
                style={{ flex: 1, fontSize: '0.78rem' }}
                icon={FolderArchive}
              >
                PURGE ZIP CACHE
              </GlassButton>
            </div>
          </GlassCard>

          {/* Sample Data vs Original Real Data Switcher */}
          <GlassCard style={{ padding: '28px', border: '1px solid rgba(245, 108, 108, 0.25)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={18} color="#E6A23C" />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff' }}>
                Live Data Switcher
              </h4>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Ready to replace sample demo collections with your actual weddings? Purge sample demo data to start fresh with 100% your own real client photographs.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <GlassButton
                variant="gold"
                onClick={handleClearSampleData}
                disabled={loading}
                style={{ flex: 1.5, background: 'rgba(235, 77, 75, 0.85)', color: '#fff', fontSize: '0.78rem' }}
                icon={Trash2}
              >
                CLEAR DEMO DATA (START REAL)
              </GlassButton>

              <GlassButton
                variant="subtle"
                onClick={handleRestoreSampleData}
                disabled={loading}
                style={{ flex: 1, fontSize: '0.78rem' }}
                icon={Sparkles}
              >
                RESTORE DEMO
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
