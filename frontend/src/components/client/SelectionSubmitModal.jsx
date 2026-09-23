import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Send, Sparkles } from 'lucide-react';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassCard';
import { api } from '../../services/api';

export function SelectionSubmitModal({ isOpen, onClose, gallery, selectedCount = 0, maxLimit = 100, onSubmitted }) {
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gallery?.id) return;

    setSubmitting(true);
    try {
      await api.submitSelection(gallery.id, notes);
      setIsSuccess(true);

      // Trigger celebratory luxury gold confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A86A', '#D8BE88', '#FFFFFF']
      });

      if (onSubmitted) onSubmitted();
    } catch (err) {
      alert('Could not submit selection: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="SUBMIT ALBUM SELECTION" maxWidth="520px">
      {!isSuccess ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Counter pill */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              background: 'rgba(201, 168, 106, 0.08)',
              border: '1px solid rgba(201, 168, 106, 0.25)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--gold-soft)', textTransform: 'uppercase' }}>
                SELECTION SUMMARY
              </div>
              <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: 600 }}>
                {selectedCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {maxLimit} PHOTOS</span>
              </div>
            </div>
            <Sparkles size={24} color="var(--gold-champagne)" />
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Once submitted, your photographer Marvan will receive your selected photographs, review your crop and color notes, and initiate the heirloom album layout.
          </p>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#fff', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Special Notes / Cover Photo Preference (Optional)
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. We love the sunset portraits! Please consider photo #1 for the leather embossed cover spread."
              className="glass-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <GlassButton
              variant="subtle"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              KEEP EDITING
            </GlassButton>
            <GlassButton
              type="submit"
              variant="gold"
              disabled={submitting || selectedCount === 0}
              style={{ flex: 1.5 }}
              icon={Send}
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT SELECTION'}
            </GlassButton>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(201, 168, 106, 0.2)',
              border: '2px solid var(--gold-champagne)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-soft)'
            }}
          >
            <Check size={32} />
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#fff' }}>
            Selection Submitted!
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: 1.5 }}>
            Thank you! Your selection of {selectedCount} photographs has been sent directly to Marvan. You will receive an update once the album proof is ready.
          </p>

          <GlassButton
            variant="gold"
            onClick={onClose}
            style={{ marginTop: '12px' }}
          >
            RETURN TO GALLERY
          </GlassButton>
        </div>
      )}
    </GlassModal>
  );
}
