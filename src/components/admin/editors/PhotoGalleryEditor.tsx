import { useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import type { GalleryAlbum, GalleryImage } from '../../../types/memorial';

interface Props {
  memorialId: string;
  initialAlbums: GalleryAlbum[];
  initialImages: GalleryImage[];
  onPortraitChange: (url: string) => void;
  onCoverChange: (url: string) => void;
  currentPortrait: string | null;
  currentCover: string | null;
}

// ── Helpers ──────────────────────────────────────────────────

async function uploadToStorage(
  path: string,
  file: File,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('memorial-images')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('memorial-images')
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Derive a safe file extension from the MIME type.
 * Falls back to the file's own extension if the MIME type is unknown.
 */
function getExtension(file: File): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  if (mimeMap[file.type]) return mimeMap[file.type];
  // Fallback: try to extract from filename
  const parts = file.name.split('.');
  return parts.length > 1 ? parts.pop()! : 'jpg';
}


// ── Image Upload Button ───────────────────────────────────────

function UploadButton({
  label,
  accept,
  currentUrl,
  uploading,
  progress,
  onFile,
  aspectRatio = '1/1',
  hint,
}: {
  label: string;
  accept: string;
  currentUrl: string | null;
  uploading: boolean;
  progress: number;
  onFile: (f: File) => void;
  aspectRatio?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', color: 'var(--color-ink)', marginBottom: 'var(--space-2)' }}>
        {label}
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          aspectRatio,
          maxHeight: 240,
          border: `2px dashed ${uploading ? 'var(--color-gold-light)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-lg)',
          background: currentUrl ? 'none' : 'var(--color-surface)',
          cursor: uploading ? 'wait' : 'pointer',
          overflow: 'hidden',
          position: 'relative',
          transition: 'border-color var(--transition-base)',
        }}
        onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
        onMouseLeave={(e) => { if (!uploading) e.currentTarget.style.borderColor = 'var(--color-border)'; }}
        aria-label={`Upload ${label}`}
      >
        {currentUrl && (
          <img
            src={currentUrl}
            alt={label}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: uploading ? 0.4 : 1 }}
          />
        )}

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
          background: currentUrl ? 'rgba(10,9,7,0.5)' : 'transparent',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-md)',
          opacity: uploading || !currentUrl ? 1 : 0,
          transition: 'opacity var(--transition-base)',
        }}
          onMouseEnter={(e) => { if (currentUrl) e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { if (currentUrl && !uploading) e.currentTarget.style.opacity = '0'; }}
        >
          {uploading ? (
            <>
              <div style={{ width: 36, height: 36, border: '2px solid rgba(181,146,74,0.4)', borderTopColor: 'var(--color-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: currentUrl ? '#f5f0eb' : 'var(--color-text-muted)' }}>
                {progress}%
              </p>
            </>
          ) : (
            <>
              <span style={{ fontSize: '1.5rem' }} aria-hidden="true">📷</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: currentUrl ? '#f5f0eb' : 'var(--color-text-muted)', textAlign: 'center' }}>
                {currentUrl ? 'Tap to change' : 'Tap to upload'}
              </p>
            </>
          )}
        </div>
      </button>
      {hint && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: 'var(--space-1)' }}>
          {hint}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────

export default function PhotoGalleryEditor({
  memorialId,
  initialAlbums,
  initialImages,
  onPortraitChange,
  onCoverChange,
  currentPortrait,
  currentCover,
}: Props) {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(initialAlbums);
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(
    initialAlbums[0]?.id ?? null
  );
  const [newAlbumName, setNewAlbumName] = useState('');
  const [showAlbumInput, setShowAlbumInput] = useState(false);

  const [portraitUploading, setPortraitUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [portraitProgress, setPortraitProgress] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);

  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionValue, setCaptionValue] = useState('');
  const [error, setError] = useState('');

  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ── Portrait Upload ─────────────────────────────────────────

  const handlePortraitUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { setError('File must be under 10 MB.'); return; }
    setPortraitUploading(true);
    setPortraitProgress(30);
    setError('');
    try {
      const ext = getExtension(file);
      const url = await uploadToStorage(`${memorialId}/portrait.${ext}`, file);
      setPortraitProgress(80);
      await supabase.from('memorials').update({ profile_image_url: url }).eq('id', memorialId);
      setPortraitProgress(100);
      onPortraitChange(url);
    } catch (err: any) {
      setError(err.message || 'Portrait upload failed.');
    } finally {
      setPortraitUploading(false);
      setPortraitProgress(0);
    }
  };

  // ── Cover Upload ────────────────────────────────────────────

  const handleCoverUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) { setError('File must be under 10 MB.'); return; }
    setCoverUploading(true);
    setCoverProgress(30);
    setError('');
    try {
      const ext = getExtension(file);
      const url = await uploadToStorage(`${memorialId}/cover.${ext}`, file);
      setCoverProgress(80);
      await supabase.from('memorials').update({ cover_image_url: url }).eq('id', memorialId);
      setCoverProgress(100);
      onCoverChange(url);
    } catch (err: any) {
      setError(err.message || 'Cover upload failed.');
    } finally {
      setCoverUploading(false);
      setCoverProgress(0);
    }
  };

  // ── Album Management ────────────────────────────────────────

  const createAlbum = async () => {
    if (!newAlbumName.trim()) return;
    try {
      const { data, error: e } = await supabase
        .from('gallery_albums')
        .insert({ memorial_id: memorialId, name: newAlbumName.trim(), sort_order: albums.length })
        .select()
        .single();
      if (e) throw e;
      setAlbums(prev => [...prev, data]);
      setSelectedAlbumId(data.id);
      setNewAlbumName('');
      setShowAlbumInput(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ── Gallery Photo Upload ─────────────────────────────────────

  const handleGalleryUpload = async (files: FileList) => {
    if (!selectedAlbumId) { setError('Please select or create an album first.'); return; }
    setGalleryUploading(true);
    setError('');

    const fileArray = Array.from(files);
    let completed = 0;

    for (const file of fileArray) {
      if (file.size > 10 * 1024 * 1024) continue;
      try {
        const path = `${memorialId}/gallery/${selectedAlbumId}/${Date.now()}-${file.name}`;
        const url = await uploadToStorage(path, file);
        const { data, error: e } = await supabase
          .from('gallery_images')
          .insert({
            memorial_id: memorialId,
            album_id: selectedAlbumId,
            image_url: url,
            sort_order: images.length + completed,
          })
          .select()
          .single();
        if (e) throw e;
        setImages(prev => [...prev, data]);
        completed++;
        setGalleryProgress(Math.round((completed / fileArray.length) * 100));
      } catch (err) {
        console.error('Failed to upload', file.name, err);
      }
    }

    setGalleryUploading(false);
    setGalleryProgress(0);
  };

  // ── Caption Edit ────────────────────────────────────────────

  const saveCaption = async (imageId: string) => {
    await supabase.from('gallery_images').update({ caption: captionValue }).eq('id', imageId);
    setImages(prev => prev.map(img => img.id === imageId ? { ...img, caption: captionValue } : img));
    setEditingCaption(null);
  };

  // ── Delete Photo ────────────────────────────────────────────

  const deleteImage = async (image: GalleryImage) => {
    if (!window.confirm('Delete this photo? This cannot be undone.')) return;
    try {
      // Extract storage path from URL
      const url = new URL(image.image_url);
      const storagePath = url.pathname.split('/memorial-images/')[1];
      if (storagePath) {
        await supabase.storage.from('memorial-images').remove([storagePath]);
      }
      await supabase.from('gallery_images').delete().eq('id', image.id);
      setImages(prev => prev.filter(img => img.id !== image.id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete photo.');
    }
  };

  const albumImages = images.filter(img => img.album_id === selectedAlbumId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', color: '#b91c1c', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>
          {error}
        </div>
      )}

      {/* ── Portrait & Cover ──────────────────────────────── */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-5)' }}>
          Profile Photos
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-4)' }}>
          <UploadButton
            label="Portrait Photo"
            accept="image/jpeg,image/png,image/webp"
            currentUrl={currentPortrait}
            uploading={portraitUploading}
            progress={portraitProgress}
            onFile={handlePortraitUpload}
            aspectRatio="3/4"
            hint="JPG, PNG or WebP. Max 10 MB."
          />
          <UploadButton
            label="Cover / Hero Image"
            accept="image/jpeg,image/png,image/webp"
            currentUrl={currentCover}
            uploading={coverUploading}
            progress={coverProgress}
            onFile={handleCoverUpload}
            aspectRatio="16/9"
            hint="Wide landscape photo shown behind the name. Max 10 MB."
          />
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--color-border)' }} />

      {/* ── Albums ───────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
            Photo Albums
          </h3>
          <button
            onClick={() => setShowAlbumInput(true)}
            style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-gold-muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: 'var(--tracking-wide)' }}
          >
            + New Album
          </button>
        </div>

        {showAlbumInput && (
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <input
              type="text"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createAlbum()}
              placeholder="Album name (e.g. Family, Career)"
              autoFocus
              style={{ flex: 1, padding: 'var(--space-2) var(--space-3)', border: '1px solid var(--color-gold-light)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', outline: 'none', background: 'var(--color-surface)' }}
            />
            <button onClick={createAlbum} style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--color-ink)', color: '#f5f0eb', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              Create
            </button>
            <button onClick={() => { setShowAlbumInput(false); setNewAlbumName(''); }} style={{ padding: 'var(--space-2) var(--space-3)', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
              Cancel
            </button>
          </div>
        )}

        {albums.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-faint)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontStyle: 'italic' }}>
            Create an album to start adding photos.
          </div>
        ) : (
          <>
            {/* Album tab bar */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-2)', scrollbarWidth: 'none', marginBottom: 'var(--space-5)' }}>
              {albums.map(album => (
                <button
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  style={{
                    flexShrink: 0,
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: selectedAlbumId === album.id ? 'var(--color-ink)' : 'var(--color-border)',
                    background: selectedAlbumId === album.id ? 'var(--color-ink)' : 'none',
                    color: selectedAlbumId === album.id ? '#f5f0eb' : 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-xs)',
                    cursor: 'pointer',
                    letterSpacing: 'var(--tracking-wide)',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  {album.name} ({images.filter(i => i.album_id === album.id).length})
                </button>
              ))}
            </div>

            {/* Upload area */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={galleryUploading}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: 'var(--space-8)',
                border: `2px dashed ${galleryUploading ? 'var(--color-gold-light)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface)',
                cursor: galleryUploading ? 'wait' : 'pointer',
                marginBottom: 'var(--space-4)',
                transition: 'border-color var(--transition-base)',
                gap: 'var(--space-3)',
              }}
              onMouseEnter={(e) => { if (!galleryUploading) e.currentTarget.style.borderColor = 'var(--color-gold)'; }}
              onMouseLeave={(e) => { if (!galleryUploading) e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              {galleryUploading ? (
                <>
                  <div style={{ width: 36, height: 36, border: '2px solid rgba(181,146,74,0.3)', borderTopColor: 'var(--color-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                    Uploading… {galleryProgress}%
                  </p>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '2rem' }} aria-hidden="true">🖼</span>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    Tap to add photos from your camera roll
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
                    You can select multiple photos at once. JPG, PNG, WebP. Max 10 MB each.
                  </p>
                </>
              )}
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files) handleGalleryUpload(e.target.files); e.target.value = ''; }}
            />

            {/* Photo grid */}
            {albumImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
                {albumImages.map(image => (
                  <div key={image.id} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-border)', aspectRatio: '1' }}>
                    <img
                      src={image.image_url}
                      alt={image.caption || ''}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* Overlay actions */}
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(10,9,7,0)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                      padding: 'var(--space-2)',
                      transition: 'background var(--transition-base)',
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(10,9,7,0.55)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(10,9,7,0)'}
                    >
                      <div style={{ display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => { setEditingCaption(image.id); setCaptionValue(image.caption || ''); }}
                          style={{ padding: 4, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, lineHeight: 1 }}
                          title="Edit caption"
                        >✏️</button>
                        <button
                          onClick={() => deleteImage(image)}
                          style={{ padding: 4, background: 'rgba(220,38,38,0.9)', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12, lineHeight: 1, color: '#fff' }}
                          title="Delete photo"
                        >✕</button>
                      </div>
                      {image.caption && (
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#f5f0eb', marginTop: 4, lineHeight: 1.3 }}>
                          {image.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Caption edit modal */}
      {editingCaption && (
        <>
          <div onClick={() => setEditingCaption(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(10,9,7,0.5)', zIndex: 100 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 101, background: 'var(--color-surface-card)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0', padding: 'var(--space-6)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-ink)', marginBottom: 'var(--space-4)' }}>
              Edit Caption
            </h3>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveCaption(editingCaption)}
              placeholder="Add a caption for this photo…"
              autoFocus
              maxLength={200}
              style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', outline: 'none', marginBottom: 'var(--space-4)', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button onClick={() => saveCaption(editingCaption)} style={{ flex: 1, padding: 'var(--space-3)', background: 'var(--color-ink)', color: '#f5f0eb', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                Save Caption
              </button>
              <button onClick={() => setEditingCaption(null)} style={{ padding: 'var(--space-3) var(--space-5)', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
