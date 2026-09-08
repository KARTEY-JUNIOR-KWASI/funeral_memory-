import { useState } from 'react';
import type { GalleryAlbum, GalleryImage } from '../../types/memorial';

interface Props {
  albums: GalleryAlbum[];
  images: GalleryImage[];
}

export default function PhotoGallery({ albums, images }: Props) {
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredImages = activeAlbum
    ? images.filter(img => img.album_id === activeAlbum)
    : images;

  const openLightbox = (image: GalleryImage) => {
    const idx = filteredImages.findIndex(i => i.id === image.id);
    setLightboxIndex(idx);
    setLightbox(image);
  };

  const navigate = (dir: 1 | -1) => {
    const newIdx = (lightboxIndex + dir + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIdx);
    setLightbox(filteredImages[newIdx]);
  };

  return (
    <section id="gallery" style={{ background: 'var(--color-surface-warm)', padding: 'var(--space-12) 0' }}>
      <div className="container container--wide">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)', padding: '0 var(--space-5)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>
            Cherished Photographs
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', color: 'var(--color-ink)' }}>
            Photo Memories
          </h2>
          <div className="ornament-divider" style={{ maxWidth: 200, margin: 'var(--space-6) auto 0' }}>
            <span style={{ fontSize: '0.5rem' }}>✦</span>
          </div>
        </div>

        {/* Album filters */}
        {albums.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', padding: '0 var(--space-5) var(--space-6)', scrollbarWidth: 'none' }}>
            <button
              onClick={() => setActiveAlbum(null)}
              style={{
                flexShrink: 0,
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: activeAlbum === null ? 'var(--color-gold)' : 'var(--color-border)',
                background: activeAlbum === null ? 'var(--color-gold-pale)' : 'transparent',
                color: activeAlbum === null ? 'var(--color-gold-muted)' : 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                letterSpacing: 'var(--tracking-wide)',
                transition: 'all var(--transition-base)',
              }}
            >
              All Photos
            </button>
            {albums.map(album => (
              <button
                key={album.id}
                onClick={() => setActiveAlbum(album.id)}
                style={{
                  flexShrink: 0,
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: activeAlbum === album.id ? 'var(--color-gold)' : 'var(--color-border)',
                  background: activeAlbum === album.id ? 'var(--color-gold-pale)' : 'transparent',
                  color: activeAlbum === album.id ? 'var(--color-gold-muted)' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  letterSpacing: 'var(--tracking-wide)',
                  transition: 'all var(--transition-base)',
                }}
              >
                {album.name}
              </button>
            ))}
          </div>
        )}

        {/* Photo grid */}
        {filteredImages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-5)', color: 'var(--color-text-faint)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--text-xl)' }}>
              No memories have been added yet.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 'var(--space-2)',
              padding: '0 var(--space-4)',
            }}
          >
            {filteredImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => openLightbox(image)}
                style={{
                  aspectRatio: '1',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-border)',
                  cursor: 'pointer',
                  border: 'none',
                  padding: 0,
                  animation: `scaleIn 0.4s ease ${index * 0.05}s both`,
                }}
                aria-label={image.alt_text || image.caption || `Photo ${index + 1}`}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || image.caption || ''}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform var(--transition-slow)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal)',
            background: 'rgba(10,9,7,0.96)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          } as React.CSSProperties}
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: 'var(--space-4)',
              right: 'var(--space-5)',
              color: 'rgba(245,240,235,0.6)',
              fontSize: 'var(--text-2xl)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 1,
              lineHeight: 1,
            }}
            aria-label="Close photo viewer"
          >
            ✕
          </button>

          {/* Image */}
          <img
            src={lightbox.image_url}
            alt={lightbox.alt_text || lightbox.caption || ''}
            style={{
              maxWidth: '90vw',
              maxHeight: '80dvh',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
            }}
            onClick={e => e.stopPropagation()}
          />

          {/* Caption */}
          {lightbox.caption && (
            <p style={{ color: 'rgba(245,240,235,0.5)', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--text-sm)', marginTop: 'var(--space-4)', textAlign: 'center', maxWidth: '80vw' }}>
              {lightbox.caption}
            </p>
          )}

          {/* Navigation arrows */}
          {filteredImages.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); navigate(-1); }}
                style={{ position: 'absolute', left: 'var(--space-4)', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,240,235,0.6)', fontSize: 'var(--text-2xl)', background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-3)' }}
                aria-label="Previous photo"
              >←</button>
              <button
                onClick={e => { e.stopPropagation(); navigate(1); }}
                style={{ position: 'absolute', right: 'var(--space-4)', top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,240,235,0.6)', fontSize: 'var(--text-2xl)', background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-3)' }}
                aria-label="Next photo"
              >→</button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
