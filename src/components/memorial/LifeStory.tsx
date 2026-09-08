import type { Biography } from '../../types/memorial';

interface Props {
  biography: Biography | null;
}

export default function LifeStory({ biography }: Props) {
  return (
    <section id="life-story" style={{ background: 'var(--color-surface)', padding: 'var(--space-12) 0' }}>
      <div className="container">
        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>
            A Life Remembered
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', color: 'var(--color-ink)' }}>
            Life Story
          </h2>
          <div className="ornament-divider" style={{ maxWidth: 200, margin: 'var(--space-6) auto 0' }}>
            <span style={{ fontSize: '0.5rem' }}>✦</span>
          </div>
        </div>

        {biography?.content ? (
          <div
            className="biography-content"
            dangerouslySetInnerHTML={{ __html: biography.content }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--space-16) 0', color: 'var(--color-text-faint)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--text-xl)' }}>
              The life story is being written.
            </p>
            <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
              Check back soon.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .biography-content {
          max-width: 680px;
          margin: 0 auto;
          padding: 0 var(--space-5);
        }
        .biography-content p {
          font-family: var(--font-body);
          font-size: clamp(var(--text-base), 2vw, var(--text-lg));
          line-height: var(--leading-loose);
          color: var(--color-text);
          margin-bottom: var(--space-6);
        }
        .biography-content blockquote {
          border-left: 3px solid var(--color-gold);
          padding: var(--space-4) var(--space-6);
          margin: var(--space-8) 0;
          background: var(--color-gold-pale);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          font-family: var(--font-display);
          font-style: italic;
          font-size: var(--text-xl);
          color: var(--color-ink-muted);
          line-height: var(--leading-relaxed);
        }
        .biography-content em {
          font-style: italic;
          color: var(--color-text-muted);
        }
        .biography-content strong {
          font-weight: 600;
          color: var(--color-ink);
        }
      `}</style>
    </section>
  );
}
