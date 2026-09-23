import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Share2, Copy, Check } from 'lucide-react';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassCard';

export function QrShareModal({ isOpen, onClose, gallery }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [galleryUrl, setGalleryUrl] = useState('');

  useEffect(() => {
    if (gallery) {
      const url = `${window.location.origin}/gallery/${gallery.slug || gallery.galleryCode || gallery.id}`;
      setGalleryUrl(url);

      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, url, {
          width: 240,
          margin: 2,
          color: {
            dark: '#C9A86A',
            light: '#0D0D0F'
          }
        }, (error) => {
          if (error) console.error('QR code error:', error);
        });
      }
    }
  }, [gallery, isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(galleryUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Signature_By_Marvan_QR_${gallery?.title?.replace(/\s+/g, '_') || 'Gallery'}.png`;
    a.click();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `✨ *SIGNATURE BY MARVAN*\n\nYour private wedding gallery is ready to experience.\n\n💍 *${gallery?.title || 'Wedding Gallery'}*\n📍 ${gallery?.location || 'Kerala'}\n\n👉 View your photographs:\n${galleryUrl}\n\n*Gallery PIN:* ${gallery?.pin || '2026'}\n\n_Your Moments. Your Story. Your Signature._`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="SHARE GALLERY & QR CODE" maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {/* QR Code Canvas */}
        <div
          style={{
            padding: '16px',
            background: '#0D0D0F',
            borderRadius: '20px',
            border: '1px solid rgba(201, 168, 106, 0.4)',
            boxShadow: '0 14px 40px rgba(0, 0, 0, 0.5)'
          }}
        >
          <canvas ref={canvasRef} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff' }}>
            {gallery?.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold-soft)', letterSpacing: '0.1em', marginTop: '2px' }}>
            SCAN FOR DIRECT MOBILE ACCESS
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* WhatsApp Direct Share Button */}
          <button
            onClick={handleWhatsAppShare}
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
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.25)'
            }}
          >
            <Share2 size={16} /> SHARE VIA WHATSAPP
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <GlassButton
              variant="default"
              onClick={handleCopyLink}
              style={{ flex: 1 }}
              icon={copied ? Check : Copy}
            >
              {copied ? 'LINK COPIED' : 'COPY LINK'}
            </GlassButton>

            <GlassButton
              variant="outline-gold"
              onClick={handleDownloadQr}
              style={{ flex: 1 }}
              icon={Download}
            >
              DOWNLOAD QR
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassModal>
  );
}
