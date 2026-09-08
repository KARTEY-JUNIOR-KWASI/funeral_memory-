import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { slugify } from '../../lib/utils';

interface Props {
  onClose: () => void;
}

export default function CreateMemorialModal({ onClose }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfPassing, setDateOfPassing] = useState('');
  const [tagline, setTagline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (val: string) => {
    setFullName(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(slugify(val));
    setSlugManuallyEdited(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !slug.trim()) {
      setError('Full name and URL slug are required.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { data, error: dbErr } = await supabase
        .from('memorials')
        .insert({
          full_name: fullName.trim(),
          slug: slug.trim(),
          date_of_birth: dateOfBirth || null,
          date_of_passing: dateOfPassing || null,
          tagline: tagline.trim() || null,
          status: 'draft',
          created_by: user!.id,
        })
        .select()
        .single();

      if (dbErr) throw dbErr;

      // Also insert into memorial_admins so the creator can manage it
      await supabase.from('memorial_admins').insert({
        memorial_id: data.id,
        user_id: user!.id,
        role: 'primary',
      });

      // Navigate to the new memorial's editor
      navigate(`/admin/memorials/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create memorial. Please try again.');
    } finally {
      setLoading(false);
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
    fontWeight: 500,
    letterSpacing: 'var(--tracking-wide)',
    color: 'var(--color-ink)',
    marginBottom: 'var(--space-2)',
    textTransform: 'uppercase',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(10,9,7,0.6)',
          zIndex: 100, backdropFilter: 'blur(4px)',
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-memorial-title"
        style={{
          position: 'fixed', zIndex: 101,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw', maxWidth: 520,
          background: 'var(--color-surface-card)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border)',
          animation: 'fadeUp 0.25s ease',
          maxHeight: '90dvh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h2
            id="create-memorial-title"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-2xl)', color: 'var(--color-ink)' }}
          >
            Create Memorial
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-xl)', color: 'var(--color-text-muted)', lineHeight: 1 }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', color: '#b91c1c', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="cm-name" style={labelStyle}>
              Full Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="cm-name" type="text" required
              value={fullName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Kofi Emmanuel Mensah"
              maxLength={120}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          {/* URL Slug */}
          <div>
            <label htmlFor="cm-slug" style={labelStyle}>
              Memorial URL <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', transition: 'border-color var(--transition-base)' }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = 'var(--color-gold)')}
              onBlurCapture={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            >
              <span style={{ padding: '0 var(--space-3)', background: 'var(--color-surface)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', borderRight: '1px solid var(--color-border)', height: '100%', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                /memorial/
              </span>
              <input
                id="cm-slug" type="text" required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="kofi-mensah"
                maxLength={80}
                style={{ ...inputStyle, border: 'none', borderRadius: 0, flex: 1 }}
              />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: 'var(--space-1)' }}>
              This becomes the public URL. Use lowercase letters and hyphens only.
            </p>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label htmlFor="cm-dob" style={labelStyle}>Date of Birth</label>
              <input
                id="cm-dob" type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div>
              <label htmlFor="cm-dop" style={labelStyle}>Date of Passing</label>
              <input
                id="cm-dop" type="date"
                value={dateOfPassing}
                onChange={(e) => setDateOfPassing(e.target.value)}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label htmlFor="cm-tagline" style={labelStyle}>Tagline</label>
            <input
              id="cm-tagline" type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. A life beautifully lived."
              maxLength={200}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
            <button
              type="button" onClick={onClose}
              style={{ padding: 'var(--space-3) var(--space-5)', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              style={{ padding: 'var(--space-3) var(--space-6)', background: loading ? 'var(--color-border)' : 'var(--color-ink)', color: '#f5f0eb', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: 'var(--tracking-wide)' }}
            >
              {loading ? 'Creating...' : 'Create Memorial →'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
