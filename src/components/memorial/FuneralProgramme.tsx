import type { ProgrammeSection } from '../../types/memorial';

interface Props {
  sections: ProgrammeSection[];
  pdfUrl: string | null;
}

export default function FuneralProgramme({ sections, pdfUrl }: Props) {
  return (
    <section id="programme" style={{ background: 'var(--color-surface)', padding: 'var(--space-12) 0' }}>
      <div className="container">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>
            Order of Service
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', color: 'var(--color-ink)' }}>
            Funeral Programme
          </h2>
          <div className="ornament-divider" style={{ maxWidth: 200, margin: 'var(--space-6) auto 0' }}>
            <span style={{ fontSize: '0.5rem' }}>✦</span>
          </div>
        </div>

        {sections.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-faint)', fontStyle: 'italic', padding: 'var(--space-12) 0' }}>
            The funeral programme will appear here.
          </p>
        ) : (
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 var(--space-5)' }}>
            {sections.map((section, index) => (
              <div
                key={section.id}
                style={{
                  display: 'flex',
                  gap: 'var(--space-5)',
                  paddingBottom: 'var(--space-6)',
                  marginBottom: 'var(--space-6)',
                  borderBottom: index < sections.length - 1 ? '1px solid var(--color-border-soft)' : 'none',
                  animation: `fadeUp 0.5s ease ${index * 0.06}s both`,
                }}
              >
                {/* Number */}
                <div
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '1px solid var(--color-gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-gold-muted)', fontWeight: 600 }}>
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-xl)', color: 'var(--color-ink)', marginBottom: section.content ? 'var(--space-1)' : 0 }}>
                    {section.title}
                  </h3>
                  {section.content && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
                      {section.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PDF Download */}
        {pdfUrl && (
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-6)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                transition: 'border-color var(--transition-base), color var(--transition-base)',
              }}
            >
              <span aria-hidden="true">↓</span>
              Download Programme PDF
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
