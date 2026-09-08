import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { PublicTribute } from '../../../types/memorial';

interface Props {
  memorialId: string;
  initialTributes: PublicTribute[];
}

export default function TributeModeration({ initialTributes }: Props) {
  const [tributes, setTributes] = useState<PublicTribute[]>(initialTributes);
  const [processing, setProcessing] = useState<string | null>(null);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setProcessing(id);
    try {
      const { error } = await supabase
        .from('tributes')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      setTributes(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch (err) {
      console.error('Failed to update tribute:', err);
    } finally {
      setProcessing(null);
    }
  };

  const pending = tributes.filter(t => t.status === 'pending');
  const approved = tributes.filter(t => t.status === 'approved');
  const rejected = tributes.filter(t => t.status === 'rejected');

  const TributeRow = ({ tribute }: { tribute: PublicTribute }) => (
    <div style={{
      background: 'var(--color-surface-card)',
      border: `1px solid ${tribute.status === 'approved' ? 'var(--color-gold-light)' : tribute.status === 'rejected' ? '#fecaca' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
            {tribute.author_name || 'Anonymous'}
            {tribute.relationship && <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}> — {tribute.relationship}</span>}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: 2 }}>
            {new Date(tribute.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span style={{
          padding: '2px var(--space-3)',
          borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 'var(--tracking-wider)',
          textTransform: 'uppercase',
          background: tribute.status === 'approved' ? 'var(--color-gold-pale)' : tribute.status === 'rejected' ? '#fef2f2' : 'var(--color-surface)',
          color: tribute.status === 'approved' ? 'var(--color-gold-muted)' : tribute.status === 'rejected' ? '#b91c1c' : 'var(--color-text-muted)',
          border: `1px solid ${tribute.status === 'approved' ? 'var(--color-gold-light)' : tribute.status === 'rejected' ? '#fecaca' : 'var(--color-border)'}`,
          flexShrink: 0,
        }}>
          {tribute.status}
        </span>
      </div>

      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)', whiteSpace: 'pre-wrap' }}>
        {tribute.message}
      </p>

      {tribute.status === 'pending' && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-soft)' }}>
          <button
            onClick={() => updateStatus(tribute.id, 'approved')}
            disabled={processing === tribute.id}
            style={{ padding: 'var(--space-2) var(--space-5)', background: 'var(--color-ink)', color: '#f5f0eb', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', cursor: 'pointer', letterSpacing: 'var(--tracking-wide)' }}
          >
            ✓ Approve
          </button>
          <button
            onClick={() => updateStatus(tribute.id, 'rejected')}
            disabled={processing === tribute.id}
            style={{ padding: 'var(--space-2) var(--space-5)', background: 'none', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', cursor: 'pointer', letterSpacing: 'var(--tracking-wide)' }}
          >
            ✕ Reject
          </button>
        </div>
      )}

      {tribute.status !== 'pending' && (
        <div style={{ paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-soft)' }}>
          <button
            onClick={() => updateStatus(tribute.id, tribute.status === 'approved' ? 'rejected' : 'approved')}
            disabled={processing === tribute.id}
            style={{ padding: 'var(--space-2) var(--space-4)', background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}
          >
            {tribute.status === 'approved' ? '↩ Move to Rejected' : '↩ Move to Approved'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
        Review and approve tributes left by visitors. Only approved tributes are shown on the public memorial.
      </p>

      {/* Pending */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-ink)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>
            Awaiting Review
          </h3>
          {pending.length > 0 && (
            <span style={{ background: '#dc2626', color: '#fff', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
              {pending.length}
            </span>
          )}
        </div>
        {pending.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)', fontStyle: 'italic' }}>No pending tributes.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {pending.map(t => <TributeRow key={t.id} tribute={t} />)}
          </div>
        )}
      </div>

      {/* Approved */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-ink)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
          Approved ({approved.length})
        </h3>
        {approved.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-faint)', fontStyle: 'italic' }}>No approved tributes yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {approved.map(t => <TributeRow key={t.id} tribute={t} />)}
          </div>
        )}
      </div>

      {/* Rejected */}
      {rejected.length > 0 && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-ink)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
            Rejected ({rejected.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {rejected.map(t => <TributeRow key={t.id} tribute={t} />)}
          </div>
        </div>
      )}
    </div>
  );
}
