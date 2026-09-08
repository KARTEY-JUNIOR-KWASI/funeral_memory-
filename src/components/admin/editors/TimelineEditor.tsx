import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { TimelineEvent } from '../../../types/memorial';

interface Props {
  memorialId: string;
  initialEvents: TimelineEvent[];
}

type DraftEvent = Partial<TimelineEvent> & { _tempId?: string };

const emptyEvent = (): DraftEvent => ({
  _tempId: crypto.randomUUID(),
  year: new Date().getFullYear(),
  title: '',
  description: '',
});

export default function TimelineEditor({ memorialId, initialEvents }: Props) {
  const [events, setEvents] = useState<(TimelineEvent | DraftEvent)[]>(
    initialEvents.length > 0 ? initialEvents : [emptyEvent()]
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const updateEvent = (index: number, field: string, value: string | number) => {
    setEvents(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

  const addEvent = () => {
    setEvents(prev => [...prev, emptyEvent()]);
  };

  const removeEvent = (index: number) => {
    setEvents(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Delete all existing events and reinsert (simplest approach for ordering)
      const { error: delErr } = await supabase
        .from('timeline_events')
        .delete()
        .eq('memorial_id', memorialId);
      if (delErr) throw delErr;

      const toInsert = events
        .filter(e => e.title && String(e.title).trim())
        .map((e, i) => ({
          memorial_id: memorialId,
          year: Number(e.year) || new Date().getFullYear(),
          title: String(e.title).trim(),
          description: String(e.description || '').trim() || null,
          sort_order: i,
        }));

      if (toInsert.length > 0) {
        const { error: insErr } = await supabase.from('timeline_events').insert(toInsert);
        if (insErr) throw insErr;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to save timeline.');
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
  };

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
        Add key life milestones in chronological order. They will appear as a beautiful scrollable timeline on the public memorial.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {events.map((event, index) => (
          <div
            key={event.id || (event as DraftEvent)._tempId}
            style={{
              display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start',
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
            }}
          >
            {/* Year */}
            <input
              type="number"
              value={event.year || ''}
              onChange={(e) => updateEvent(index, 'year', parseInt(e.target.value))}
              placeholder="Year"
              min={1900}
              max={new Date().getFullYear() + 1}
              style={{ ...inputStyle, width: 90, flexShrink: 0, textAlign: 'center' }}
            />

            {/* Title and Description */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <input
                type="text"
                value={event.title || ''}
                onChange={(e) => updateEvent(index, 'title', e.target.value)}
                placeholder="Milestone title (e.g. Born in Accra, Ghana)"
                maxLength={120}
                style={{ ...inputStyle, width: '100%' }}
              />
              <textarea
                value={event.description || ''}
                onChange={(e) => updateEvent(index, 'description', e.target.value)}
                placeholder="Optional description…"
                rows={2}
                maxLength={400}
                style={{ ...inputStyle, width: '100%', resize: 'vertical' }}
              />
            </div>

            {/* Remove */}
            <button
              onClick={() => removeEvent(index)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-faint)', fontSize: 'var(--text-lg)', lineHeight: 1, padding: 'var(--space-1)', flexShrink: 0 }}
              aria-label="Remove milestone"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addEvent}
        style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-5)',
          border: '1px dashed var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          background: 'none',
          width: '100%',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-muted)',
          transition: 'border-color var(--transition-base)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-gold-light)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
      >
        + Add Milestone
      </button>

      {error && <p style={{ color: '#b91c1c', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>{error}</p>}

      <div style={{ marginTop: 'var(--space-5)' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            background: saved ? 'var(--color-gold-pale)' : saving ? 'var(--color-border)' : 'var(--color-ink)',
            color: saved ? 'var(--color-gold-muted)' : '#f5f0eb',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
            cursor: saving ? 'not-allowed' : 'pointer',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          {saving ? 'Saving...' : saved ? '✓ Timeline Saved' : 'Save Timeline'}
        </button>
      </div>
    </div>
  );
}
