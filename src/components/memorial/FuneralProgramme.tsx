import type { ProgrammeSection } from '../../types/memorial';

interface Props {
  sections: ProgrammeSection[];
  pdfUrl: string | null;
}

// ── Section type detection ──────────────────────────────────────────────────

type SectionKind =
  | 'order-part1'
  | 'order-part2'
  | 'biography'
  | 'tribute'
  | 'generic';

function detectKind(title: string): SectionKind {
  const t = title.toLowerCase();
  if (t.includes('part 1') || t.includes('part one') || (t.includes('order') && !t.includes('part 2') && !t.includes('part two'))) return 'order-part1';
  if (t.includes('part 2') || t.includes('part two')) return 'order-part2';
  if (t.includes('biograph') || t.includes('life story') || t.includes('profile')) return 'biography';
  if (t.includes('tribute') || t.includes('eulogy') || t.includes('remembrance') || t.includes('message from')) return 'tribute';
  return 'generic';
}

// ── Kente-inspired border strip ─────────────────────────────────────────────

function KenteBorder() {
  const colors = ['#B5924A', '#4A0E8F', '#C0392B', '#1B5E20', '#B5924A', '#0D47A1', '#B5924A'];
  return (
    <div style={{ display: 'flex', width: '100%', height: 6 }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: colors[i % colors.length],
          }}
        />
      ))}
    </div>
  );
}

// ── Gold ornament divider ───────────────────────────────────────────────────

function GoldDivider({ wide = false }: { wide?: boolean }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      margin: '0 auto',
      maxWidth: wide ? 500 : 260,
      padding: '0 16px',
    }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #B5924A)' }} />
      <span style={{ color: '#B5924A', fontSize: '0.7rem', letterSpacing: 4 }}>✦ ✦ ✦</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #B5924A)' }} />
    </div>
  );
}

// ── Section: Order of Service (Part 1 or 2) ────────────────────────────────

function OrderSection({ section, partLabel }: { section: ProgrammeSection; partLabel: string }) {
  // Parse content lines — each line is one programme item
  const items = section.content
    ? section.content.split('\n').map(l => l.trim()).filter(Boolean)
    : [];

  return (
    <div style={{
      background: '#1a0a3a',
      borderRadius: 2,
      overflow: 'hidden',
      marginBottom: 24,
      boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
    }}>
      {/* Part header */}
      <div style={{
        background: 'linear-gradient(135deg, #2D1B69 0%, #1a0a3a 100%)',
        padding: '20px 28px 16px',
        borderBottom: '2px solid #B5924A',
        position: 'relative',
      }}>
        {/* Corner ornaments */}
        <span style={{ position: 'absolute', top: 8, left: 12, color: '#B5924A', fontSize: '1rem', opacity: 0.6 }}>✦</span>
        <span style={{ position: 'absolute', top: 8, right: 12, color: '#B5924A', fontSize: '1rem', opacity: 0.6 }}>✦</span>

        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#B5924A',
          marginBottom: 6,
          textAlign: 'center',
        }}>
          Order of Service
        </p>
        <h3 style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 700,
          fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
          color: '#F5F0EB',
          textAlign: 'center',
          margin: 0,
          letterSpacing: '0.05em',
        }}>
          {partLabel}
        </h3>
      </div>

      {/* Programme items */}
      <div style={{ padding: '4px 0' }}>
        {items.length === 0 ? (
          <p style={{ padding: '20px 28px', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: 'rgba(245,240,235,0.35)', fontSize: '0.85rem', textAlign: 'center' }}>
            Programme items will appear here.
          </p>
        ) : (
          items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              padding: '13px 28px',
              borderBottom: i < items.length - 1 ? '1px solid rgba(181,146,74,0.12)' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
            }}>
              <span style={{
                flexShrink: 0,
                width: 26,
                height: 26,
                borderRadius: '50%',
                border: '1px solid rgba(181,146,74,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Georgia, serif',
                fontSize: '0.7rem',
                color: '#B5924A',
                fontWeight: 700,
                marginTop: 1,
              }}>
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <p style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(0.82rem, 2vw, 0.92rem)',
                color: 'rgba(245,240,235,0.88)',
                lineHeight: 1.55,
                margin: 0,
                flex: 1,
              }}>
                {item}
              </p>
            </div>
          ))
        )}
      </div>

      <KenteBorder />
    </div>
  );
}

// ── Section: Biography ──────────────────────────────────────────────────────

function BiographySection({ section }: { section: ProgrammeSection }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {/* Chapter header */}
      <div style={{
        textAlign: 'center',
        padding: '24px 20px 20px',
        background: 'linear-gradient(180deg, #F9F5EE 0%, #FFF8EC 100%)',
        border: '2px solid #B5924A',
        borderRadius: 2,
        marginBottom: 0,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: 'linear-gradient(90deg, #2D1B69, #B5924A, #C0392B, #B5924A, #2D1B69)',
        }} />
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#7B5B27',
          marginBottom: 8,
        }}>
          Chapter
        </p>
        <h3 style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 700,
          fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
          color: '#1a0a3a',
          margin: '0 0 12px',
          letterSpacing: '0.04em',
        }}>
          {section.title}
        </h3>
        <GoldDivider wide />
      </div>

      {/* Biography body */}
      {section.content && (
        <div style={{
          background: '#FFFDF7',
          border: '1px solid rgba(181,146,74,0.35)',
          borderTop: 'none',
          padding: '28px 32px',
          borderRadius: '0 0 2px 2px',
        }}>
          {section.content.split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(0.88rem, 2.2vw, 0.97rem)',
              lineHeight: 1.85,
              color: '#1C1209',
              marginBottom: i < section.content!.split('\n\n').length - 1 ? 18 : 0,
              textAlign: 'justify',
            }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section: Tribute ────────────────────────────────────────────────────────

function TributeSection({ section, index }: { section: ProgrammeSection; index: number }) {
  const accentColors = [
    { bg: '#2D1B69', light: 'rgba(45,27,105,0.08)' },
    { bg: '#7B1818', light: 'rgba(123,24,24,0.08)' },
    { bg: '#1B3A5E', light: 'rgba(27,58,94,0.08)' },
    { bg: '#1B5E20', light: 'rgba(27,94,32,0.08)' },
    { bg: '#4A2C00', light: 'rgba(74,44,0,0.08)' },
  ];
  const accent = accentColors[index % accentColors.length];

  return (
    <div style={{
      marginBottom: 24,
      border: '1px solid rgba(181,146,74,0.3)',
      borderRadius: 2,
      overflow: 'hidden',
      background: '#FFFDF7',
    }}>
      {/* Tribute chapter header */}
      <div style={{
        background: accent.bg,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '2px solid rgba(181,146,74,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '1.1rem' }}>✍</span>
        </div>
        <div>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(181,146,74,0.8)',
            marginBottom: 3,
          }}>
            Tribute
          </p>
          <h3 style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
            color: '#F5F0EB',
            margin: 0,
            letterSpacing: '0.03em',
          }}>
            {section.title}
          </h3>
        </div>
      </div>

      {/* Tribute content */}
      {section.content && (
        <div style={{
          padding: '22px 24px 24px',
          background: accent.light,
          borderTop: '2px solid #B5924A',
          position: 'relative',
        }}>
          {/* Decorative quote mark */}
          <span style={{
            position: 'absolute',
            top: 10,
            left: 18,
            fontFamily: 'Georgia, serif',
            fontSize: '4rem',
            color: '#B5924A',
            opacity: 0.15,
            lineHeight: 1,
            userSelect: 'none',
          }} aria-hidden="true">"</span>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(0.88rem, 2.2vw, 0.95rem)',
            lineHeight: 1.8,
            color: '#1C1209',
            margin: 0,
            paddingLeft: 8,
            textAlign: 'justify',
            position: 'relative',
            zIndex: 1,
          }}>
            {section.content}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Section: Generic ────────────────────────────────────────────────────────

function GenericSection({ section, index }: { section: ProgrammeSection; index: number }) {
  return (
    <div style={{
      marginBottom: 24,
      background: '#FFFDF7',
      border: '1px solid rgba(181,146,74,0.25)',
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 24px',
        background: 'linear-gradient(90deg, #1a0a3a, #2D1B69)',
        borderBottom: '2px solid #B5924A',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{ color: '#B5924A', fontSize: '0.9rem' }}>✦</span>
        <h3 style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 700,
          fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
          color: '#F5F0EB',
          margin: 0,
          letterSpacing: '0.04em',
        }}>
          {section.title}
        </h3>
        <span style={{ color: '#B5924A', fontSize: '0.75rem', marginLeft: 'auto', opacity: 0.7 }}>
          {(index + 1).toString().padStart(2, '0')}
        </span>
      </div>
      {section.content && (
        <div style={{ padding: '18px 24px' }}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(0.87rem, 2.2vw, 0.94rem)',
            lineHeight: 1.8,
            color: '#2A1C0E',
            margin: 0,
            textAlign: 'justify',
          }}>
            {section.content}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function FuneralProgramme({ sections, pdfUrl }: Props) {
  // Track separate counters for tribute sections for cycling accent colors
  let tributeIndex = 0;
  let genericIndex = 0;

  return (
    <section id="programme" style={{ background: '#F2EDE3', padding: '0 0 60px' }}>

      {/* ── Programme Cover Header ──────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #1a0a3a 0%, #2D1B69 55%, #4A0E8F 100%)',
        padding: '48px 24px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Kente border top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <KenteBorder />
        </div>

        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(181,146,74,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(181,146,74,0.05) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />

        {/* Corner ornaments */}
        <span style={{ position: 'absolute', top: 20, left: 20, color: '#B5924A', fontSize: '1.4rem', opacity: 0.5 }}>✦</span>
        <span style={{ position: 'absolute', top: 20, right: 20, color: '#B5924A', fontSize: '1.4rem', opacity: 0.5 }}>✦</span>
        <span style={{ position: 'absolute', bottom: 20, left: 20, color: '#B5924A', fontSize: '1.4rem', opacity: 0.5 }}>✦</span>
        <span style={{ position: 'absolute', bottom: 20, right: 20, color: '#B5924A', fontSize: '1.4rem', opacity: 0.5 }}>✦</span>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: '0.65rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#B5924A',
            marginBottom: 14,
          }}>
            ✦ &nbsp; Funeral Brochure &nbsp; ✦
          </p>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 5vw, 2.4rem)',
            color: '#F5F0EB',
            marginBottom: 8,
            letterSpacing: '0.06em',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}>
            Order of Service
          </h2>

          <p style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            color: 'rgba(245,240,235,0.55)',
            marginBottom: 20,
          }}>
            — Including Tributes & Biography —
          </p>

          <GoldDivider />
        </div>

        {/* Kente border bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <KenteBorder />
        </div>
      </div>

      {/* ── Scripture / Epigraph ─────────────────────────────────── */}
      <div style={{
        background: '#FFF8EC',
        borderLeft: '4px solid #B5924A',
        borderRight: '4px solid #B5924A',
        padding: '20px 32px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(181,146,74,0.2)',
      }}>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
          color: '#4A2C00',
          lineHeight: 1.7,
          margin: 0,
        }}>
          "I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live."
        </p>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: '0.72rem',
          letterSpacing: '0.15em',
          color: '#B5924A',
          marginTop: 8,
          textTransform: 'uppercase',
        }}>
          John 11:25
        </p>
      </div>

      {/* ── Programme Sections ───────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px 0' }}>

        {sections.length === 0 ? (
          /* ── Empty state ──────────────────────────────────────── */
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            background: '#FFFDF7',
            border: '2px dashed rgba(181,146,74,0.3)',
            borderRadius: 4,
          }}>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: '1rem',
              color: 'rgba(74,44,0,0.4)',
            }}>
              The funeral programme chapters will appear here.
            </p>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '0.78rem',
              color: 'rgba(181,146,74,0.5)',
              marginTop: 8,
              letterSpacing: '0.1em',
            }}>
              Add sections from the admin panel
            </p>
          </div>
        ) : (
          sections.map((section, index) => {
            const kind = detectKind(section.title);
            const isLastSection = index === sections.length - 1;

            return (
              <div
                key={section.id}
                style={{ animation: `fadeUp 0.5s ease ${index * 0.07}s both` }}
              >
                {kind === 'order-part1' && (
                  <OrderSection section={section} partLabel={section.title} />
                )}
                {kind === 'order-part2' && (
                  <OrderSection section={section} partLabel={section.title} />
                )}
                {kind === 'biography' && (
                  <BiographySection section={section} />
                )}
                {kind === 'tribute' && (
                  <TributeSection section={section} index={tributeIndex++} />
                )}
                {kind === 'generic' && (
                  <GenericSection section={section} index={genericIndex++} />
                )}

                {/* Gold divider between major chapters */}
                {!isLastSection && kind !== 'order-part1' && kind !== 'order-part2' && (
                  <div style={{ margin: '8px 0 24px' }}>
                    <GoldDivider wide />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* ── PDF Download ─────────────────────────────────────── */}
        {pdfUrl && (
          <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(181,146,74,0.25)' }}>
            <p style={{
              fontFamily: 'Georgia, serif',
              fontSize: '0.72rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B5924A',
              marginBottom: 14,
            }}>
              Download a Copy
            </p>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #2D1B69, #4A0E8F)',
                border: '1px solid #B5924A',
                borderRadius: 2,
                fontFamily: 'Georgia, serif',
                fontSize: '0.88rem',
                color: '#F5F0EB',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                boxShadow: '0 4px 16px rgba(45,27,105,0.3)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(45,27,105,0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(45,27,105,0.3)';
              }}
            >
              <span aria-hidden="true">↓</span>
              Download Programme PDF
            </a>
          </div>
        )}
      </div>

      {/* ── Footer strip ────────────────────────────────────────── */}
      <div style={{ marginTop: 48 }}>
        <KenteBorder />
      </div>
    </section>
  );
}
