import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import CreateMemorialModal from '../../components/admin/CreateMemorialModal';
import type { Memorial } from '../../types/memorial';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchMemorials() {
      // In this version, we fetch memorials where this user is an admin.
      // Since we don't have the full RLS setup completely active for the UI view yet without using the `memorial_admins` table,
      // we'll fetch from `memorial_admins` first, then fetch the memorials.
      // Wait, our RLS policies on `memorials` state that an admin can SELECT if they are in `memorial_admins`.
      // Let's just query `memorials` directly, Supabase will filter via RLS!
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching memorials:', error);
      } else {
        setMemorials(data || []);
      }
      setLoading(false);
    }

    fetchMemorials();
  }, [user]);

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading memorials...
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-8) var(--space-6)', maxWidth: 1200, margin: '0 auto' }}>
      {showCreateModal && <CreateMemorialModal onClose={() => setShowCreateModal(false)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-3xl)', color: 'var(--color-ink)' }}>
            Your Memorials
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
            Select a memorial to manage content, tributes, and settings.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{ padding: 'var(--space-3) var(--space-6)', background: 'var(--color-ink)', color: '#f5f0eb', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: 'pointer', letterSpacing: 'var(--tracking-wide)', flexShrink: 0 }}
        >
          + Create Memorial
        </button>
      </div>

      {memorials.length === 0 ? (
        <div style={{ background: 'var(--color-surface-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
          <span aria-hidden="true" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)', display: 'block' }}>🕊</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-ink)', marginBottom: 'var(--space-2)' }}>
            No Memorials Found
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: 400, margin: '0 auto' }}>
            You have not been assigned to manage any memorials yet. Please contact the platform administrator to set up a new memorial.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {memorials.map((memorial) => (
            <div
              key={memorial.id}
              style={{
                background: 'var(--color-surface-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              onClick={() => navigate(`/admin/memorials/${memorial.id}`)}
            >
              {/* Cover placeholder */}
              <div
                style={{
                  height: 120,
                  background: memorial.cover_image_url ? `url(${memorial.cover_image_url}) center/cover` : 'var(--color-ink)',
                  position: 'relative',
                }}
              >
                {/* Status badge */}
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-3)',
                  right: 'var(--space-3)',
                  background: memorial.status === 'published' ? 'rgba(37,211,102,0.9)' : 'rgba(245,240,235,0.9)',
                  color: memorial.status === 'published' ? '#fff' : 'var(--color-ink)',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wider)',
                }}>
                  {memorial.status}
                </div>
              </div>

              <div style={{ padding: 'var(--space-5)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-ink)', marginBottom: 'var(--space-1)' }}>
                  {memorial.full_name}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginBottom: 'var(--space-4)' }}>
                  /{memorial.slug}
                </p>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/admin/memorials/${memorial.id}`); }}
                    style={{ flex: 1, padding: 'var(--space-2) 0', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-ink)', cursor: 'pointer' }}
                  >
                    Manage
                  </button>
                  <a
                    href={`/memorial/${memorial.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      background: 'var(--color-gold-pale)',
                      border: '1px solid var(--color-gold-light)',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-gold-muted)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
