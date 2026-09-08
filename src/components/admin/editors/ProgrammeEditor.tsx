import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { ProgrammeSection } from '../../../types/memorial';

interface Props {
  memorialId: string;
  initialSections: ProgrammeSection[];
}

type DraftSection = Partial<ProgrammeSection> & { _tempId?: string };

const emptySection = (): DraftSection => ({
  _tempId: crypto.randomUUID(),
  title: '',
  content: '',
});

export default function ProgrammeEditor({ memorialId, initialSections }: Props) {
  const [sections, setSections] = useState<(ProgrammeSection | DraftSection)[]>(
    initialSections.length > 0 ? initialSections : [emptySection()]
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const update = (index: number, field: string, value: string) => {
    setSections(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const add = () => setSections(prev => [...prev, emptySection()]);
  const remove = (index: number) => setSections(prev => prev.filter((_, i) => i !== index));

  const moveUp = (index: number) => {
    if (index === 0) return;
    setSections(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    setSections(prev => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await supabase.from('programme_sections').delete().eq('memorial_id', memorialId);

      const toInsert = sections
        .filter(s => s.title && String(s.title).trim())
        .map((s, i) => ({
          memorial_id: memorialId,
          title: String(s.title).trim(),
          content: String(s.content || '').trim() || null,
          sort_order: i,
        }));

      if (toInsert.length > 0) {
        const { error: insErr } = await supabase.from('programme_sections').insert(toInsert);
        if (insErr) throw insErr;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to save programme.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: 'var(--space-2) var(--space-3)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-ink)',
    background: 'var(--color-surface)',
    outline: 'none',
    width: '100%',
  };

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
        Add the order of service. Use the arrows to reorder items. Each item will be numbered automatically on the public memorial.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {sections.map((section, index) => (
          <div
            key={section.id || (section as DraftSection)._tempId}
            style={{
              display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start',
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
            }}
          >
            {/* Order number and reorder arrows */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-gold-muted)', fontWeight: 600, width: 28, textAlign: 'center' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <button onClick={() => moveUp(index)} disabled={index === 0} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-faint)', fontSize: 12, padding: 2, opacity: index === 0 ? 0.3 : 1 }}>▲</button>
              <button onClick={() => moveDown(index)} disabled={index === sections.length - 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-faint)', fontSize: 12, padding: 2, opacity: index === sections.length - 1 ? 0.3 : 1 }}>▼</button>
            </div>

            {/* Title and content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => update(index, 'title', e.target.value)}
                placeholder="Item title (e.g. Opening Hymn)"
                maxLength={120}
                style={inputStyle}
              />
              <input
                type="text"
                value={section.content || ''}
                onChange={(e) => update(index, 'content', e.target.value)}
                placeholder="Optional details (e.g. 'Abide With Me' — Congregation)"
                maxLength={300}
                style={inputStyle}
              />
            </div>

            {/* Remove */}
            <button
              onClick={() => remove(index)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-faint)', fontSize: 'var(--text-lg)', lineHeight: 1, flexShrink: 0 }}
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={add}
        style={{
          marginTop: 'var(--space-4)', padding: 'var(--space-3)',
          border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)',
          background: 'none', width: '100%', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)',
        }}
      >
        + Add Programme Item
      </button>

      {error && <p style={{ color: '#b91c1c', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>{error}</p>}

      <div style={{ marginTop: 'var(--space-5)' }}>
        <button
          onClick={handleSave} disabled={saving}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            background: saved ? 'var(--color-gold-pale)' : saving ? 'var(--color-border)' : 'var(--color-ink)',
            color: saved ? 'var(--color-gold-muted)' : '#f5f0eb',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
            cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: 'var(--tracking-wide)',
          }}
        >
          {saving ? 'Saving...' : saved ? '✓ Programme Saved' : 'Save Programme'}
        </button>
      </div>
    </div>
  );
}
