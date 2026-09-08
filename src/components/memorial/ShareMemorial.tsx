import { useState } from 'react';
import { memorialAbsoluteUrl } from '../../lib/utils';

interface Props {
  slug: string;
  name: string;
}

export default function ShareMemorial({ slug, name }: Props) {
  const [copied, setCopied] = useState(false);
  const url = memorialAbsoluteUrl(slug);
  const text = `In Loving Memory of ${name} — ${url}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const hasNativeShare = typeof navigator.share === 'function';

  const nativeShare = async () => {
    try {
      await navigator.share({ title: `In Loving Memory of ${name}`, url });
    } catch { /* user cancelled */ }
  };

  const btnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-4)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface-card)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    transition: 'all var(--transition-base)',
    boxShadow: 'var(--shadow-sm)',
    textDecoration: 'none',
    width: '100%',
  };

  return (
    <section id="share" style={{ background: 'var(--color-surface-warm)', padding: 'var(--space-12) 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>
            Help Others Remember
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', color: 'var(--color-ink)' }}>
            Share This Memorial
          </h2>
          <div className="ornament-divider" style={{ maxWidth: 200, margin: 'var(--space-6) auto 0' }}>
            <span style={{ fontSize: '0.5rem' }}>✦</span>
          </div>
        </div>

        <div style={{ maxWidth: 400, margin: '0 auto', padding: '0 var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* URL display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--color-surface-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              marginBottom: 'var(--space-2)',
            }}
          >
            <p style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {url}
            </p>
          </div>

          {/* Copy link */}
          <button onClick={copyLink} style={{ ...btnStyle, background: copied ? 'var(--color-gold-pale)' : 'var(--color-surface-card)', borderColor: copied ? 'var(--color-gold-light)' : 'var(--color-border)', color: copied ? 'var(--color-gold-muted)' : 'var(--color-text-muted)' }}>
            <span aria-hidden="true">{copied ? '✓' : '🔗'}</span>
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>

          {/* WhatsApp */}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ ...btnStyle }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.color = '#25D366'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}>
            <span aria-hidden="true" style={{ fontSize: 'var(--text-xl)' }}>💬</span>
            Share on WhatsApp
          </a>

          {/* Native share (mobile) */}
          {hasNativeShare && (
            <button onClick={nativeShare} style={btnStyle} onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-warm)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-card)'; }}>
              <span aria-hidden="true">⬆</span>
              More Sharing Options
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
