import type { FuneralDetails } from '../../types/memorial';

interface Props {
  details: FuneralDetails | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return dateStr; }
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';
  try {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch { return timeStr; }
}

export default function FuneralDetailsSection({ details }: Props) {
  return (
    <section id="details" style={{ background: 'var(--color-surface)', padding: 'var(--space-12) 0' }}>
      <div className="container">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>
            Service Information
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', color: 'var(--color-ink)' }}>
            Funeral Details
          </h2>
          <div className="ornament-divider" style={{ maxWidth: 200, margin: 'var(--space-6) auto 0' }}>
            <span style={{ fontSize: '0.5rem' }}>✦</span>
          </div>
        </div>

        {!details ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-faint)', fontStyle: 'italic', padding: 'var(--space-12) 0' }}>
            Service details will be published here.
          </p>
        ) : (
          <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 var(--space-5)' }}>
            {/* Card */}
            <div
              style={{
                background: 'var(--color-surface-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* Date */}
              {details.service_date && (
                <div style={{ marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border-soft)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-2)' }}>Date &amp; Time</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-ink)', fontWeight: 400 }}>
                    {formatDate(details.service_date)}
                  </p>
                  {details.service_time && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                      {formatTime(details.service_time)}
                    </p>
                  )}
                </div>
              )}

              {/* Venue */}
              {details.venue_name && (
                <div style={{ marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-5)', borderBottom: '1px solid var(--color-border-soft)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-2)' }}>Venue</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-ink)', fontWeight: 400 }}>
                    {details.venue_name}
                  </p>
                  {[details.address, details.city, details.country].filter(Boolean).join(', ') && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                      {[details.address, details.city, details.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              )}

              {/* Notes */}
              {details.additional_notes && (
                <div style={{ marginBottom: details.maps_url ? 'var(--space-5)' : 0, paddingBottom: details.maps_url ? 'var(--space-5)' : 0, borderBottom: details.maps_url ? '1px solid var(--color-border-soft)' : 'none' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-2)' }}>Additional Notes</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                    {details.additional_notes}
                  </p>
                </div>
              )}

              {/* Directions */}
              {details.maps_url && (
                <a
                  href={details.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    background: 'var(--color-gold-pale)',
                    color: 'var(--color-gold-muted)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    letterSpacing: 'var(--tracking-wide)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'background var(--transition-base)',
                  }}
                >
                  <span aria-hidden="true">📍</span>
                  Get Directions
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
