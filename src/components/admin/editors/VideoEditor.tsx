import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { extractYouTubeId, extractVimeoId } from '../../../lib/utils';
import type { Video } from '../../../types/memorial';

interface Props {
  memorialId: string;
  initialVideos: Video[];
}

type DraftVideo = Partial<Video> & { _tempId?: string };

const emptyVideo = (): DraftVideo => ({
  _tempId: crypto.randomUUID(),
  title: '',
  description: '',
  video_url: '',
});

function getVideoPreviewUrl(url: string): string | null {
  const ytId = extractYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  const vimeoId = extractVimeoId(url);
  if (vimeoId) return null; // Vimeo requires API call for thumbnail
  return null;
}

export default function VideoEditor({ memorialId, initialVideos }: Props) {
  const [videos, setVideos] = useState<(Video | DraftVideo)[]>(
    initialVideos.length > 0 ? initialVideos : [emptyVideo()]
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const update = (index: number, field: string, value: string) => {
    setVideos(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };
  const add = () => setVideos(prev => [...prev, emptyVideo()]);
  const remove = (index: number) => setVideos(prev => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await supabase.from('videos').delete().eq('memorial_id', memorialId);

      const toInsert = videos
        .filter(v => v.video_url && String(v.video_url).trim())
        .map((v, i) => ({
          memorial_id: memorialId,
          title: String(v.title || '').trim() || null,
          description: String(v.description || '').trim() || null,
          video_url: String(v.video_url).trim(),
          sort_order: i,
        }));

      if (toInsert.length > 0) {
        const { error: insErr } = await supabase.from('videos').insert(toInsert);
        if (insErr) throw insErr;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to save videos.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
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
        Paste YouTube or Vimeo links. Videos are embedded directly — no file uploads required.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {videos.map((video, index) => {
          const preview = getVideoPreviewUrl(String(video.video_url || ''));
          return (
            <div
              key={video.id || (video as DraftVideo)._tempId}
              style={{
                display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start',
                background: 'var(--color-surface-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
              }}
            >
              {/* Thumbnail Preview */}
              <div style={{
                width: 80, height: 56, borderRadius: 'var(--radius-md)',
                background: 'var(--color-ink)', flexShrink: 0,
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {preview ? (
                  <img src={preview} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.25rem', opacity: 0.4 }}>▶</span>
                )}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <input
                  type="url"
                  value={video.video_url || ''}
                  onChange={(e) => update(index, 'video_url', e.target.value)}
                  placeholder="Paste YouTube or Vimeo URL…"
                  style={inputStyle}
                />
                <input
                  type="text"
                  value={video.title || ''}
                  onChange={(e) => update(index, 'title', e.target.value)}
                  placeholder="Video title (optional)"
                  maxLength={120}
                  style={inputStyle}
                />
                <input
                  type="text"
                  value={video.description || ''}
                  onChange={(e) => update(index, 'description', e.target.value)}
                  placeholder="Short description (optional)"
                  maxLength={200}
                  style={inputStyle}
                />
              </div>

              <button onClick={() => remove(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-faint)', fontSize: 'var(--text-lg)', lineHeight: 1, flexShrink: 0 }}>✕</button>
            </div>
          );
        })}
      </div>

      <button onClick={add} style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'none', width: '100%', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        + Add Video
      </button>

      {error && <p style={{ color: '#b91c1c', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>{error}</p>}

      <div style={{ marginTop: 'var(--space-5)' }}>
        <button onClick={handleSave} disabled={saving} style={{ padding: 'var(--space-3) var(--space-6)', background: saved ? 'var(--color-gold-pale)' : saving ? 'var(--color-border)' : 'var(--color-ink)', color: saved ? 'var(--color-gold-muted)' : '#f5f0eb', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: 'var(--tracking-wide)' }}>
          {saving ? 'Saving...' : saved ? '✓ Videos Saved' : 'Save Videos'}
        </button>
      </div>
    </div>
  );
}
