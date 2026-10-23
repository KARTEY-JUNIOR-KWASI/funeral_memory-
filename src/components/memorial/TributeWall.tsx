import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { formatTributeAuthor } from '../../lib/utils';
import type { PublicTribute } from '../../types/memorial';

interface Props {
  memorialId: string;
  tributes: PublicTribute[];
}

function TributeCard({ tribute }: { tribute: PublicTribute }) {
  const [expanded, setExpanded] = useState(false);
  const MAX = 220;
  const isLong = tribute.message.length > MAX;

  return (
    <div
      style={{
        background: 'var(--color-surface-card)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5) var(--space-6)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border-soft)',
      }}
    >
      {/* Quote mark */}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', color: 'var(--color-gold-light)', lineHeight: 0.8, marginBottom: 'var(--space-3)', opacity: 0.6 }} aria-hidden="true">
        "
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-loose)', color: 'var(--color-text)', marginBottom: 'var(--space-4)' }}>
        {isLong && !expanded ? tribute.message.slice(0, MAX) + '…' : tribute.message}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ marginLeft: 6, fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-gold-muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: 'var(--tracking-wide)' }}
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </p>
      <div style={{ borderTop: '1px solid var(--color-border-soft)', paddingTop: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--color-gold-pale)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color: 'var(--color-gold-muted)' }}>
            {formatTributeAuthor(tribute.author_name).charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 'var(--text-sm)', color: 'var(--color-ink)' }}>
            {formatTributeAuthor(tribute.author_name)}
          </p>
          {tribute.relationship && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', letterSpacing: 'var(--tracking-wide)' }}>
              {tribute.relationship}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function LeaveMemoryForm({ memorialId, onSuccess }: { memorialId: string; onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-ink)',
    background: 'var(--color-surface)',
    outline: 'none',
    transition: 'border-color var(--transition-base)',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) { setError('Please write a message.'); return; }
    setError('');
    setSubmitting(true);

    try {
      if (isSupabaseConfigured) {
        const { error: dbErr } = await supabase.from('tributes').insert({
          memorial_id: memorialId,
          author_name: name.trim() || null,
          relationship: relationship.trim() || null,
          message: message.trim(),
          status: 'pending',
        });
        if (dbErr) throw dbErr;
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            Name <span style={{ color: 'var(--color-text-faint)' }}>(optional)</span>
          </label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" maxLength={80} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = 'var(--color-gold)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'} />
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            Relationship <span style={{ color: 'var(--color-text-faint)' }}>(optional)</span>
          </label>
          <input type="text" value={relationship} onChange={e => setRelationship(e.target.value)} placeholder="e.g. Friend, Colleague" maxLength={60} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = 'var(--color-gold)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
          Your Memory <span style={{ color: 'var(--color-error)', fontStyle: 'italic' }}>*</span>
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Share a memory, a word of comfort, or a tribute…"
          rows={4}
          maxLength={1200}
          required
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 'var(--leading-relaxed)' }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--color-gold)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: 'var(--space-1)', textAlign: 'right' }}>
          {message.length}/1200
        </p>
      </div>
      {error && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-error)' }}>{error}</p>}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', lineHeight: 'var(--leading-relaxed)' }}>
        Your message will be reviewed by the family before appearing publicly. No account required.
      </p>
      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: 'var(--space-3) var(--space-6)',
          background: submitting ? 'var(--color-border)' : 'var(--color-ink)',
          color: submitting ? 'var(--color-text-faint)' : '#f5f0eb',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          letterSpacing: 'var(--tracking-wide)',
          cursor: submitting ? 'wait' : 'pointer',
          alignSelf: 'flex-start',
          transition: 'background var(--transition-base)',
        }}
      >
        {submitting ? 'Sending…' : 'Submit Memory'}
      </button>
    </form>
  );
}

export default function TributeWall({ memorialId, tributes: initialTributes }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Local copy of tributes — updated in real-time via Supabase Realtime
  const [tributes, setTributes] = useState<PublicTribute[]>(initialTributes);

  // ── Realtime subscription ────────────────────────────────────
  // When an admin approves a tribute, it should appear here live.
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel(`tributes-public-${memorialId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tributes',
          filter: `memorial_id=eq.${memorialId}`,
        },
        (payload) => {
          const updated = payload.new as PublicTribute;
          if (updated.status === 'approved') {
            // If it's newly approved and not already in the list, prepend it.
            setTributes(prev => {
              const exists = prev.some(t => t.id === updated.id);
              if (exists) {
                // Update in place (e.g., previously hidden, now approved)
                return prev.map(t => t.id === updated.id ? updated : t);
              }
              // New approval — add to front
              return [updated, ...prev];
            });
          } else {
            // If it's been moved away from approved, remove it from the public view
            setTributes(prev => prev.filter(t => t.id !== updated.id || t.status === 'approved'));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memorialId]);

  // Keep in sync if parent re-fetches and passes new initial tributes
  useEffect(() => {
    setTributes(initialTributes);
  }, [initialTributes]);

  return (
    <section id="tributes" style={{ background: 'var(--color-surface-warm)', padding: 'var(--space-12) 0' }}>
      <div className="container">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>
            Words of Remembrance
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', color: 'var(--color-ink)' }}>
            Tributes
          </h2>
          <div className="ornament-divider" style={{ maxWidth: 200, margin: 'var(--space-6) auto 0' }}>
            <span style={{ fontSize: '0.5rem' }}>✦</span>
          </div>
        </div>

        {/* Tribute cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-10)', padding: '0 var(--space-5)' }}>
          {tributes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-10) 0', color: 'var(--color-text-faint)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--text-xl)' }}>
                Be the first to share a memory.
              </p>
            </div>
          ) : (
            tributes.map((tribute, i) => (
              <div key={tribute.id} style={{ animation: `fadeUp 0.5s ease ${i * 0.07}s both` }}>
                <TributeCard tribute={tribute} />
              </div>
            ))
          )}
        </div>

        {/* Leave a memory */}
        <div style={{ background: 'var(--color-surface-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-soft)', margin: '0 var(--space-5)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) 0', animation: 'fadeUp 0.5s ease' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-2xl)', color: 'var(--color-ink)', marginBottom: 'var(--space-3)' }}>
                Thank you for sharing.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Your memory has been received and will be reviewed by the family.
              </p>
            </div>
          ) : !showForm ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)', lineHeight: 'var(--leading-relaxed)' }}>
                Did you know this person? Share a memory, a kind word, or a tribute.
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: 'var(--space-3) var(--space-8)',
                  border: '1px solid var(--color-ink)',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  letterSpacing: 'var(--tracking-wide)',
                  background: 'none',
                  color: 'var(--color-ink)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = '#f5f0eb'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-ink)'; }}
              >
                ✍ Leave a Memory
              </button>
            </div>
          ) : (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-2xl)', color: 'var(--color-ink)' }}>
                  Leave a Memory
                </h3>
                <button onClick={() => setShowForm(false)} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
              <LeaveMemoryForm memorialId={memorialId} onSuccess={() => { setShowForm(false); setSubmitted(true); }} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
