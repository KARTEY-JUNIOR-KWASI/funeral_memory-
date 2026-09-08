import { formatLifespan } from '../../lib/utils';
import type { Memorial } from '../../types/memorial';

interface Props {
  memorial: Memorial;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SECTIONS = [
  { id: 'life-story',   label: 'Life Story' },
  { id: 'timeline',     label: 'Timeline' },
  { id: 'programme',    label: 'Programme' },
  { id: 'gallery',      label: 'Gallery' },
  { id: 'videos',       label: 'Videos' },
  { id: 'candle',       label: '🕯 Candle' },
  { id: 'tributes',     label: 'Tributes' },
  { id: 'details',      label: 'Service' },
  { id: 'share',        label: 'Share' },
];

export default function MemorialHero({ memorial, activeSection, onSectionChange }: Props) {
  const lifespan = formatLifespan(memorial.date_of_birth, memorial.date_of_passing);

  const scrollToSection = (id: string) => {
    onSectionChange(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header style={{ position: 'relative', background: 'var(--color-ink)' }}>
      {/* Cover image */}
      {memorial.cover_image_url && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${memorial.cover_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: 0.25,
          }}
          aria-hidden="true"
        />
      )}

      {/* Hero content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'var(--space-12) var(--space-6) var(--space-8)',
          animation: 'fadeUp 0.7s ease both',
        }}
      >
        {/* Portrait */}
        {memorial.profile_image_url && (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid rgba(181,146,74,0.5)',
              boxShadow: '0 0 0 6px rgba(181,146,74,0.1)',
              marginBottom: 'var(--space-6)',
              flexShrink: 0,
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
            fontSize: 'clamp(var(--text-2xl), 6vw, var(--text-4xl))',
            color: '#f5f0eb',
            letterSpacing: 'var(--tracking-wide)',
            marginBottom: 'var(--space-2)',
            lineHeight: 1.2,
          }}
        >
          {memorial.full_name}
        </h1>

        {/* Lifespan */}
        {lifespan && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              letterSpacing: 'var(--tracking-widest)',
              color: 'var(--color-gold)',
              marginBottom: memorial.tagline ? 'var(--space-4)' : 0,
            }}
          >
            {lifespan}
          </p>
        )}

        {/* Tagline */}
        {memorial.tagline && (
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'var(--text-base)',
              color: 'rgba(245,240,235,0.6)',
              maxWidth: 340,
              lineHeight: 1.7,
            }}
          >
            {memorial.tagline}
          </p>
        )}
      </div>

      {/* Section Navigation — horizontally scrollable on mobile */}
      <nav
        aria-label="Memorial sections"
        style={{
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(10,9,7,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}
      >
        <div
          style={{
            display: 'flex',
            gap: 0,
            minWidth: 'max-content',
            padding: '0 var(--space-4)',
          }}
        >
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-wide)',
                padding: 'var(--space-4) var(--space-4)',
                color: activeSection === section.id ? 'var(--color-gold)' : 'rgba(245,240,235,0.5)',
                background: 'none',
                border: 'none',
                borderBottom: activeSection === section.id ? '2px solid var(--color-gold)' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color var(--transition-base)',
                flexShrink: 0,
              } as React.CSSProperties}
              aria-current={activeSection === section.id ? 'true' : undefined}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
