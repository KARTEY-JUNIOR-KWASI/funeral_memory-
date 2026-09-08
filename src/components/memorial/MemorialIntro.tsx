import { useEffect, useState } from 'react';
import { formatLifespan } from '../../lib/utils';
import type { Memorial } from '../../types/memorial';

interface Props {
  memorial: Memorial;
  onEnter: () => void;
}

export default function MemorialIntro({ memorial, onEnter }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const lifespan = formatLifespan(memorial.date_of_birth, memorial.date_of_passing);

  return (
    <div
      className="memorial-intro"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-ink)',
        padding: 'var(--space-8) var(--space-6)',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    >
      {/* Top label */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          letterSpacing: 'var(--tracking-widest)',
          textTransform: 'uppercase',
          color: 'var(--color-gold)',
          marginBottom: 'var(--space-8)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
        }}
      >
        In Loving Memory of
      </p>

      {/* Portrait */}
      {memorial.profile_image_url && (
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(181,146,74,0.4)',
            marginBottom: 'var(--space-8)',
            boxShadow: '0 0 0 8px rgba(181,146,74,0.08)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.94)',
            transition: 'opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s',
          }}
        >
          <img
            src={memorial.profile_image_url}
            alt={`Portrait of ${memorial.full_name}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Name */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 300,
          fontSize: 'clamp(var(--text-3xl), 7vw, var(--text-5xl))',
          color: '#f5f0eb',
          letterSpacing: 'var(--tracking-wide)',
          marginBottom: 'var(--space-3)',
          lineHeight: 1.2,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
        }}
      >
        {memorial.full_name}
      </h1>

      {/* Lifespan */}
      {lifespan && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-faint)',
            letterSpacing: 'var(--tracking-wider)',
            marginBottom: 'var(--space-6)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.8s',
          }}
        >
          {lifespan}
        </p>
      )}

      {/* Divider */}
      <div
        style={{
          width: 40,
          height: 1,
          background: 'rgba(181,146,74,0.4)',
          margin: '0 auto var(--space-6)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.9s',
        }}
      />

      {/* Tagline */}
      {memorial.tagline && (
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(var(--text-base), 3vw, var(--text-lg))',
            color: 'rgba(245,240,235,0.7)',
            maxWidth: 360,
            lineHeight: 1.7,
            marginBottom: 'var(--space-12)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 1s',
          }}
        >
          {memorial.tagline}
        </p>
      )}

      {/* Enter button */}
      <button
        onClick={onEnter}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          letterSpacing: 'var(--tracking-wider)',
          textTransform: 'uppercase',
          color: '#f5f0eb',
          border: '1px solid rgba(181,146,74,0.5)',
          borderRadius: 'var(--radius-full)',
          padding: 'var(--space-3) var(--space-8)',
          background: 'transparent',
          cursor: 'pointer',
          transition: 'border-color var(--transition-base), background var(--transition-base)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition2: 'opacity 0.8s ease 1.2s, transform 0.8s ease 1.2s',
        } as React.CSSProperties}
        onMouseEnter={e => {
          (e.target as HTMLButtonElement).style.background = 'rgba(181,146,74,0.15)';
          (e.target as HTMLButtonElement).style.borderColor = 'rgba(181,146,74,0.8)';
        }}
        onMouseLeave={e => {
          (e.target as HTMLButtonElement).style.background = 'transparent';
          (e.target as HTMLButtonElement).style.borderColor = 'rgba(181,146,74,0.5)';
        }}
        aria-label={`Enter the memorial for ${memorial.full_name}`}
      >
        Enter Memorial
      </button>

      {/* Subtle scroll hint */}
      <p
        style={{
          position: 'absolute',
          bottom: 'var(--space-8)',
          fontSize: 'var(--text-xs)',
          color: 'rgba(245,240,235,0.25)',
          fontFamily: 'var(--font-body)',
          letterSpacing: 'var(--tracking-wide)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 1.4s',
        }}
      >
        or scroll to continue
      </p>
    </div>
  );
}
