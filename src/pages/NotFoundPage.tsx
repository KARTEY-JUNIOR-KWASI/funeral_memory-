import { Link } from 'react-router-dom';

/**
 * 404 Not Found Page
 * Shown when a memorial slug doesn't exist or a URL is invalid.
 * Uses respectful, gentle language appropriate to the context.
 */
export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        padding: 'var(--space-8)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          marginBottom: 'var(--space-8)',
          color: 'var(--color-gold)',
          fontSize: '2rem',
        }}
        aria-hidden="true"
      >
        🕊
      </div>
      <p
        className="text-faint tracking-widest uppercase"
        style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}
      >
        Page Not Found
      </p>
      <h1
        className="font-display"
        style={{
          fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))',
          color: 'var(--color-ink)',
          fontWeight: 300,
          marginBottom: 'var(--space-6)',
        }}
      >
        This page does not exist.
      </h1>
      <p
        style={{
          maxWidth: '360px',
          color: 'var(--color-text-muted)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-10)',
          fontSize: 'var(--text-sm)',
        }}
      >
        The memorial you are looking for may have moved, or the link may be incorrect.
        Please check the QR code or link and try again.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: 'var(--space-3) var(--space-6)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          transition: 'border-color var(--transition-base), color var(--transition-base)',
        }}
      >
        ← Return Home
      </Link>
    </main>
  );
}
