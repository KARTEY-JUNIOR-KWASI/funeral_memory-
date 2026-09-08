/**
 * Landing Page — Public marketing page at /
 * Phase 2 will replace this with the full design.
 * This is the Phase 1 scaffold only.
 */
export default function LandingPage() {
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
      <p
        className="text-faint tracking-widest uppercase"
        style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-6)' }}
      >
        Digital Memorial Platform
      </p>
      <h1
        className="font-display"
        style={{
          fontSize: 'clamp(var(--text-3xl), 6vw, var(--text-5xl))',
          color: 'var(--color-ink)',
          marginBottom: 'var(--space-6)',
          fontWeight: 300,
        }}
      >
        Honour a Life, Beautifully.
      </h1>
      <p
        style={{
          maxWidth: '480px',
          color: 'var(--color-text-muted)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-10)',
        }}
      >
        A permanent digital memorial connected to a printed QR code. 
        Scan. Remember. Share.
      </p>
      <a
        href="/admin/login"
        style={{
          display: 'inline-block',
          padding: 'var(--space-3) var(--space-8)',
          background: 'var(--color-ink)',
          color: 'var(--color-surface)',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-sm)',
          letterSpacing: 'var(--tracking-wide)',
          transition: 'background var(--transition-base)',
        }}
      >
        For Families &amp; Funeral Organisers →
      </a>

      {/* Phase 1 indicator — remove in Phase 2 */}
      <p
        style={{
          marginTop: 'var(--space-16)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-faint)',
        }}
      >
        Phase 1 Scaffold — Design coming in Phase 2
      </p>
    </main>
  );
}
