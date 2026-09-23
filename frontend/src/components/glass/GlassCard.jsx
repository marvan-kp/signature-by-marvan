import React from 'react';

export function GlassCard({ children, className = '', style = {}, elevated = false, hoverable = true, onClick, id }) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`${elevated ? 'glass-surface-elevated' : 'glass-surface-card'} ${className}`}
      style={{
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        ...(hoverable ? {} : { transform: 'none !important' }),
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function GlassButton({
  children,
  onClick,
  variant = 'default', // 'default' | 'gold' | 'outline-gold' | 'subtle'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  className = '',
  style = {},
  type = 'button',
  id,
  icon: Icon
}) {
  const variantClass = {
    default: 'glass-btn',
    gold: 'glass-btn glass-btn-gold',
    'outline-gold': 'glass-btn glass-btn-outline-gold',
    subtle: 'glass-btn'
  }[variant] || 'glass-btn';

  const sizeStyle = {
    sm: { minHeight: '38px', padding: '6px 14px', fontSize: '0.78rem' },
    md: { minHeight: '44px', padding: '10px 22px', fontSize: '0.85rem' },
    lg: { minHeight: '52px', padding: '14px 32px', fontSize: '0.95rem' }
  }[size];

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${className}`}
      style={{
        ...sizeStyle,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        ...style
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
}

export function GlassStatCard({ title, value, subtitle, icon: Icon, trend, alertLevel = null, id }) {
  const alertColor = {
    WARNING: '#E6A23C',
    CRITICAL: '#F56C6C',
    NOTICE: 'var(--gold-champagne)',
    NORMAL: '#67C23A'
  }[alertLevel];

  return (
    <div
      id={id}
      className="glass-surface-card"
      style={{
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: alertColor || 'var(--gold-soft)'
            }}
          >
            <Icon size={16} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.9rem', fontFamily: 'var(--font-serif)', color: '#fff', fontWeight: 500 }}>
        {value}
      </div>

      {(subtitle || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: alertColor || 'var(--text-muted)' }}>
          {subtitle}
          {trend && <span style={{ color: 'var(--gold-champagne)', fontWeight: 600 }}>{trend}</span>}
        </div>
      )}

      {alertLevel && alertLevel !== 'NORMAL' && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: alertColor
          }}
        />
      )}
    </div>
  );
}
