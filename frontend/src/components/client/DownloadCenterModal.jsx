import React, { useState } from 'react';
import { Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { GlassModal, GlassProgress } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassCard';
import { api } from '../../services/api';

export function DownloadCenterModal({ isOpen, onClose, gallery, favoritesCount = 0, selectedCount = 0 }) {
  const [downloadScope, setDownloadScope] = useState('ALL'); // ALL | FAVORITES | SELECTIONS
  const [quality, setQuality] = useState('web'); // web | high | original
  const [downloadJob, setDownloadJob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startDownload = async () => {
    setIsProcessing(true);
    try {
      const job = await api.requestBulkDownload(
        gallery.id,
        null,
        quality,
        downloadScope,
        gallery.title || 'Client'
      );
      setDownloadJob(job);

      // Poll download job status until ready
      const interval = setInterval(async () => {
        try {
          const status = await api.getDownloadStatus(job.id);
          setDownloadJob(status);
          if (status.status === 'READY' || status.status === 'FAILED') {
            clearInterval(interval);
            setIsProcessing(false);
          }
        } catch (e) {
          clearInterval(interval);
          setIsProcessing(false);
        }
      }, 1500);
    } catch (err) {
      alert('Could not start download: ' + err.message);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setDownloadJob(null);
    setIsProcessing(false);
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="DOWNLOAD CENTER" maxWidth="580px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {!downloadJob ? (
          <>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Choose your preferred resolution and collection scope. High resolution and original files will be packaged into a secure ZIP archive.
            </p>

            {/* Scope Selection */}
            <div>
              <label style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--gold-soft)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                1. Select Package Scope
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setDownloadScope('ALL')}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    background: downloadScope === 'ALL' ? 'rgba(201, 168, 106, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: downloadScope === 'ALL' ? '1px solid var(--gold-champagne)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: downloadScope === 'ALL' ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>Entire Gallery</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {gallery?.totalPhotos || '1,248'} photos
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDownloadScope('FAVORITES')}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    background: downloadScope === 'FAVORITES' ? 'rgba(201, 168, 106, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: downloadScope === 'FAVORITES' ? '1px solid var(--gold-champagne)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: downloadScope === 'FAVORITES' ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>Favorites</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {favoritesCount} photos
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDownloadScope('SELECTIONS')}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    background: downloadScope === 'SELECTIONS' ? 'rgba(201, 168, 106, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: downloadScope === 'SELECTIONS' ? '1px solid var(--gold-champagne)' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: downloadScope === 'SELECTIONS' ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>Album Selection</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {selectedCount} photos
                  </div>
                </button>
              </div>
            </div>

            {/* Quality Selection */}
            <div>
              <label style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--gold-soft)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                2. Select Image Quality
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'web', title: 'Web Quality (Fast & Optimized)', desc: '2000px resolution, ideal for Instagram, social sharing, and smartphones.' },
                  { id: 'high', title: 'High Resolution (Print Ready)', desc: 'Full clarity 4000px+, ideal for home frames, photo books, and digital displays.' },
                  { id: 'original', title: 'Master Originals (Preserved RAW/JPEG)', desc: 'Bit-for-bit exact original files uploaded from studio master archive.' }
                ].map((q) => (
                  <div
                    key={q.id}
                    onClick={() => setQuality(q.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: quality === q.id ? 'rgba(201, 168, 106, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: quality === q.id ? '1px solid var(--gold-champagne)' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ color: quality === q.id ? 'var(--gold-soft)' : '#fff', fontWeight: 600, fontSize: '0.88rem' }}>
                      {q.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      {q.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <GlassButton
              variant="gold"
              onClick={startDownload}
              disabled={isProcessing}
              style={{ width: '100%', marginTop: '10px' }}
              icon={Download}
            >
              PREPARE SECURE DOWNLOAD
            </GlassButton>
          </>
        ) : (
          /* Processing / Ready State */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
            {downloadJob.status === 'PROCESSING' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={24} color="var(--gold-champagne)" />
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff' }}>
                      Preparing Your Wedding ZIP Archive
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Packaging {downloadJob.totalPhotos} photographs in {quality.toUpperCase()} quality. You can continue browsing.
                    </p>
                  </div>
                </div>

                <GlassProgress
                  value={downloadJob.progress || 20}
                  max={100}
                  label="Archiving & Generating Signed Token"
                  height={10}
                />
              </>
            ) : downloadJob.status === 'READY' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle size={28} color="#67C23A" />
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#fff' }}>
                      DOWNLOAD READY
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Your custom ZIP archive is compiled with a signed, expiring security link.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div><strong>File:</strong> {downloadJob.zipFilename}</div>
                  <div><strong>Format:</strong> ZIP (.zip)</div>
                  <div><strong>Link Validity:</strong> 2 Hours</div>
                </div>

                <a
                  href={downloadJob.signedUrl || downloadJob.downloadUrl || '#'}
                  download={downloadJob.zipFilename}
                  className="glass-btn glass-btn-gold"
                  style={{ width: '100%', minHeight: '48px', textDecoration: 'none' }}
                >
                  <Download size={18} /> DOWNLOAD ZIP ARCHIVE NOW
                </a>

                <button
                  onClick={handleReset}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '-8px'
                  }}
                >
                  Create another download
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#F56C6C' }}>
                <AlertCircle size={24} />
                <div>Download temporarily unavailable. Please retry shortly.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </GlassModal>
  );
}
