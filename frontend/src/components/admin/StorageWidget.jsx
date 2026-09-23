import React, { useState } from 'react';
import { HardDrive, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { GlassCard, GlassButton } from '../glass/GlassCard';
import { GlassProgress } from '../glass/GlassModal';

export function StorageWidget({ storage, onTriggerBackup }) {
  const [syncing, setSyncing] = useState(false);

  if (!storage) return null;

  const handleSync = async () => {
    setSyncing(true);
    if (onTriggerBackup) await onTriggerBackup();
    setTimeout(() => setSyncing(false), 1200);
  };

  return (
    <GlassCard style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(201, 168, 106, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-soft)'
            }}
          >
            <HardDrive size={18} />
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff' }}>
              STORAGE & QUOTA
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {storage.provider || 'Cloudflare R2 / Local Hybrid Tier'}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: '#fff' }}>
            {storage.usedFormatted}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            FREE TIER LIMIT: {storage.limitFormatted}
          </div>
        </div>
      </div>

      <GlassProgress
        value={storage.percentage || 72}
        max={100}
        label={`Storage Consumption (${storage.percentage || 72}%)`}
        alertLevel={storage.warningLevel}
        height={10}
      />

      {/* Warning Alert if >= 70% */}
      {storage.warningLevel && storage.warningLevel !== 'NORMAL' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(230, 162, 60, 0.1)',
            border: '1px solid rgba(230, 162, 60, 0.3)',
            fontSize: '0.78rem',
            color: '#E6A23C'
          }}
        >
          <AlertTriangle size={16} />
          <span>{storage.warningMessage}</span>
        </div>
      )}

      {/* Secondary Backup Sync Status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#67C23A' }}>
          <ShieldCheck size={16} />
          <span>Primary & Backup: {storage.backupStatus || 'SYNCED (98.7%)'}</span>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gold-soft)',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync Backup'}
        </button>
      </div>
    </GlassCard>
  );
}
