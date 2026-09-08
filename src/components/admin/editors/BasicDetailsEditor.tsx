import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Memorial } from '../../../types/memorial';

interface Props {
  memorial: Memorial;
  onSaved: (updated: Memorial) => void;
}

export default function BasicDetailsEditor({ memorial, onSaved }: Props) {
  const [fullName, setFullName] = useState(memorial.full_name);
  const [tagline, setTagline] = useState(memorial.tagline || '');
  const [dateOfBirth, setDateOfBirth] = useState(memorial.date_of_birth || '');
  const [dateOfPassing, setDateOfPassing] = useState(memorial.date_of_passing || '');
  const [status, setStatus] = useState(memorial.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const { data, error: dbErr } = await supabase
        .from('memorials')
        .update({
          full_name: fullName.trim(),
          tagline: tagline.trim() || null,
          date_of_birth: dateOfBirth || null,
          date_of_passing: dateOfPassing || null,
          status,
        })
        .eq('id', memorial.id)
        .select()
        .single();

      if (dbErr) throw dbErr;
      onSaved(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

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
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wide)',
    color: 'var(--color-ink)',
    marginBottom: 'var(--space-2)',
    textTransform: 'uppercase',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <label style={labelStyle}>Full Name</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120} style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      <div>
        <label style={labelStyle}>Tagline</label>
        <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={200}
          placeholder="A short, meaningful phrase shown under the name"
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div>
          <label style={labelStyle}>Date of Birth</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>
        <div>
          <label style={labelStyle}>Date of Passing</label>
          <input type="date" value={dateOfPassing} onChange={(e) => setDateOfPassing(e.target.value)} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as Memorial['status'])}
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        >
          <option value="draft">Draft — Not visible to public</option>
          <option value="published">Published — Visible to anyone with the link</option>
          <option value="archived">Archived — Hidden from public view</option>
        </select>
      </div>

      {/* Public link */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--color-border)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginBottom: 'var(--space-1)' }}>Public Memorial URL</p>
        <a
          href={`/memorial/${memorial.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-gold-muted)', wordBreak: 'break-all' }}
        >
          {window.location.origin}/memorial/{memorial.slug}
        </a>
      </div>

      {error && (
        <p style={{ color: '#b91c1c', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>{error}</p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            background: saved ? 'var(--color-gold-pale)' : saving ? 'var(--color-border)' : 'var(--color-ink)',
            color: saved ? 'var(--color-gold-muted)' : '#f5f0eb',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            cursor: saving ? 'not-allowed' : 'pointer',
            letterSpacing: 'var(--tracking-wide)',
            transition: 'all var(--transition-base)',
          }}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
