import type { TimelineEvent } from '../../types/memorial';

interface Props {
  events: TimelineEvent[];
}

export default function LifeTimeline({ events }: Props) {
  return (
    <section id="timeline" style={{ background: 'var(--color-surface-warm)', padding: 'var(--space-12) 0' }}>
      <div className="container">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>
            A Journey Through Time
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', color: 'var(--color-ink)' }}>
            Life Timeline
          </h2>
          <div className="ornament-divider" style={{ maxWidth: 200, margin: 'var(--space-6) auto 0' }}>
            <span style={{ fontSize: '0.5rem' }}>✦</span>
          </div>
        </div>

        {events.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-faint)', fontStyle: 'italic', padding: 'var(--space-12) 0' }}>
            Timeline milestones will appear here.
          </p>
        ) : (
          <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto', padding: '0 var(--space-5)' }}>
            {/* Vertical line */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 'calc(var(--space-5) + 28px)',
                top: 0,
                bottom: 0,
                width: 1,
                background: 'linear-gradient(to bottom, transparent, var(--color-gold-light) 5%, var(--color-gold-light) 95%, transparent)',
                opacity: 0.4,
              }}
            />

            {events.map((event, index) => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  gap: 'var(--space-6)',
                  marginBottom: index < events.length - 1 ? 'var(--space-8)' : 0,
                  position: 'relative',
                  animation: `fadeUp 0.5s ease ${index * 0.08}s both`,
                }}
              >
                {/* Year node */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: index === events.length - 1 ? 'var(--color-ink)' : 'var(--color-surface-card)',
                      border: `1px solid ${index === events.length - 1 ? 'var(--color-ink)' : 'var(--color-gold-light)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)',
                      zIndex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: index === events.length - 1 ? '#f5f0eb' : 'var(--color-gold-muted)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {event.year}
                    </span>
                  </div>
                </div>

                {/* Event content */}
                <div style={{ paddingTop: 'var(--space-3)', flex: 1, paddingBottom: 'var(--space-2)' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 400,
                      fontSize: 'var(--text-xl)',
                      color: 'var(--color-ink)',
                      marginBottom: event.description ? 'var(--space-2)' : 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {event.title}
                  </h3>
                  {event.description && (
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-muted)',
                        lineHeight: 'var(--leading-relaxed)',
                      }}
                    >
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
