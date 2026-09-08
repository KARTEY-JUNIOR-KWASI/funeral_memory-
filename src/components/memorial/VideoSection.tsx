import { useState } from 'react';
import { getVideoEmbedUrl, getVideoThumbnail } from '../../lib/utils';
import type { Video } from '../../types/memorial';

interface Props {
  videos: Video[];
}

function VideoCard({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getVideoEmbedUrl(video.video_url);
  const thumbnail = video.thumbnail_url || getVideoThumbnail(video.video_url);

  if (!embedUrl) return null;

  return (
    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-ink)', boxShadow: 'var(--shadow-md)' }}>
      {playing ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`${embedUrl}&autoplay=1`}
            title={video.title || 'Memorial video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          style={{
            display: 'block',
            width: '100%',
            position: 'relative',
            aspectRatio: '16/9',
            cursor: 'pointer',
            border: 'none',
            padding: 0,
            background: 'none',
            overflow: 'hidden',
          }}
          aria-label={`Play video: ${video.title || 'Memorial video'}`}
        >
          {/* Thumbnail */}
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={video.title || 'Video thumbnail'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--color-ink-soft)' }} />
          )}
          {/* Play button overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(10,9,7,0.4)',
              transition: 'background var(--transition-base)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(245,240,235,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <span style={{ fontSize: 22, marginLeft: 4, color: 'var(--color-ink)' }}>▶</span>
            </div>
          </div>
        </button>
      )}

      {/* Video info */}
      {(video.title || video.description) && (
        <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
          {video.title && (
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'var(--text-xl)', color: '#f5f0eb', marginBottom: video.description ? 'var(--space-1)' : 0 }}>
              {video.title}
            </h3>
          )}
          {video.description && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'rgba(245,240,235,0.55)', lineHeight: 'var(--leading-relaxed)' }}>
              {video.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function VideoSection({ videos }: Props) {
  const validVideos = videos.filter(v => getVideoEmbedUrl(v.video_url));

  return (
    <section id="videos" style={{ background: 'var(--color-surface)', padding: 'var(--space-12) 0' }}>
      <div className="container">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>
            Moving Images
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', color: 'var(--color-ink)' }}>
            Video Memories
          </h2>
          <div className="ornament-divider" style={{ maxWidth: 200, margin: 'var(--space-6) auto 0' }}>
            <span style={{ fontSize: '0.5rem' }}>✦</span>
          </div>
        </div>

        {validVideos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-5)', color: 'var(--color-text-faint)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--text-xl)' }}>
              Videos celebrating this life will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', padding: '0 var(--space-5)' }}>
            {validVideos.map((video, i) => (
              <div key={video.id} style={{ animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
