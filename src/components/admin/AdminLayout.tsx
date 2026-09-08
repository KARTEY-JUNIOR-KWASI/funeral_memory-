import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const { signOut } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--color-surface)', flexDirection: 'column' }}>
      {/* Top Header */}
      <header
        style={{
          background: 'var(--color-ink)',
          color: '#f5f0eb',
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>🕊</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-lg)', letterSpacing: 'var(--tracking-wide)' }}>
            Memorial Admin
          </h1>
        </div>

        <button
          onClick={signOut}
          style={{
            background: 'none',
            border: '1px solid rgba(245,240,235,0.3)',
            borderRadius: 'var(--radius-full)',
            color: '#f5f0eb',
            padding: 'var(--space-2) var(--space-4)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,240,235,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
        >
          Sign Out
        </button>
      </header>

      {/* Main Layout Area */}
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
        {/* Sidebar Nav (Desktop) / Top Nav (Mobile) */}
        {/* For now, keeping it simple as we only have the Dashboard home. We can expand this later when editing specific memorials. */}
        <aside
          style={{
            width: 240,
            background: 'var(--color-surface-card)',
            borderRight: '1px solid var(--color-border)',
            padding: 'var(--space-6) 0',
            display: 'none', // Hidden for now until we add more global admin pages. We will build specific memorial navs later.
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <NavLink
              to="/admin"
              end
              style={({ isActive }) => ({
                padding: 'var(--space-3) var(--space-6)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                color: isActive ? 'var(--color-ink)' : 'var(--color-text-muted)',
                background: isActive ? 'var(--color-gold-pale)' : 'transparent',
                borderRight: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 500 : 400,
              })}
            >
              My Memorials
            </NavLink>
          </nav>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
