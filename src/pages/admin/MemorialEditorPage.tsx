import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Memorial, Biography, TimelineEvent, ProgrammeSection, FuneralDetails, Video, PublicTribute, GalleryAlbum, GalleryImage } from '../../types/memorial';
import BasicDetailsEditor from '../../components/admin/editors/BasicDetailsEditor';
import BiographyEditor from '../../components/admin/editors/BiographyEditor';
import TimelineEditor from '../../components/admin/editors/TimelineEditor';
import ProgrammeEditor from '../../components/admin/editors/ProgrammeEditor';
import FuneralDetailsEditor from '../../components/admin/editors/FuneralDetailsEditor';
import VideoEditor from '../../components/admin/editors/VideoEditor';
import TributeModeration from '../../components/admin/editors/TributeModeration';
import PhotoGalleryEditor from '../../components/admin/editors/PhotoGalleryEditor';
import QRCodeEditor from '../../components/admin/editors/QRCodeEditor';

const TABS = [
  { id: 'details',   label: 'Details',   icon: '✎' },
  { id: 'biography', label: 'Biography', icon: '📖' },
  { id: 'timeline',  label: 'Timeline',  icon: '📅' },
  { id: 'programme', label: 'Programme', icon: '📋' },
  { id: 'gallery',   label: 'Gallery',   icon: '🖼' },
  { id: 'videos',    label: 'Videos',    icon: '▶' },
  { id: 'service',   label: 'Service',   icon: '📍' },
  { id: 'tributes',  label: 'Tributes',  icon: '💬' },
  { id: 'qr',        label: 'QR Code',   icon: '⬛' },
];

export default function MemorialEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [biography, setBiography] = useState<Biography | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [programme, setProgramme] = useState<ProgrammeSection[]>([]);
  const [funeralDetails, setFuneralDetails] = useState<FuneralDetails | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [tributes, setTributes] = useState<PublicTribute[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const [
          memRes, bioRes, tlRes, progRes, fdRes, vidRes, tribRes, albRes, imgRes
        ] = await Promise.all([
          supabase.from('memorials').select('*').eq('id', id).single(),
          supabase.from('biographies').select('*').eq('memorial_id', id).maybeSingle(),
          supabase.from('timeline_events').select('*').eq('memorial_id', id).order('sort_order'),
          supabase.from('programme_sections').select('*').eq('memorial_id', id).order('sort_order'),
          supabase.from('funeral_details').select('*').eq('memorial_id', id).maybeSingle(),
          supabase.from('videos').select('*').eq('memorial_id', id).order('sort_order'),
          supabase.from('tributes').select('id,memorial_id,author_name,relationship,message,status,created_at').eq('memorial_id', id).order('created_at', { ascending: false }),
          supabase.from('gallery_albums').select('*').eq('memorial_id', id).order('sort_order'),
          supabase.from('gallery_images').select('*').eq('memorial_id', id).order('sort_order'),
        ]);

        if (memRes.error) throw memRes.error;

        setMemorial(memRes.data);
        setPortraitUrl(memRes.data.profile_image_url);
        setCoverUrl(memRes.data.cover_image_url);
        setBiography(bioRes.data ?? null);
        setTimeline(tlRes.data ?? []);
        setProgramme(progRes.data ?? []);
        setFuneralDetails(fdRes.data ?? null);
        setVideos(vidRes.data ?? []);
        setTributes(tribRes.data ?? []);
        setAlbums(albRes.data ?? []);
        setGalleryImages(imgRes.data ?? []);
      } catch (err: any) {
        setError('Could not load this memorial. ' + (err.message || ''));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const pendingTributeCount = tributes.filter(t => t.status === 'pending').length;

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading memorial editor…
      </div>
    );
  }

  if (error || !memorial) {
    return (
      <div style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
        <p style={{ color: '#b91c1c', fontFamily: 'var(--font-body)', marginBottom: 'var(--space-6)' }}>{error || 'Memorial not found.'}</p>
        <Link to="/admin" style={{ color: 'var(--color-gold-muted)' }}>← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Editor Header */}
      <div style={{
        background: 'var(--color-surface-card)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        flexWrap: 'wrap',
      }}>
        <Link
          to="/admin"
          style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none' }}
        >
          ← My Memorials
        </Link>

        <div style={{ width: 1, height: 16, background: 'var(--color-border)' }} />

        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-ink)', fontWeight: 400 }}>
            {memorial.full_name}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: 2 }}>
            <span style={{
              display: 'inline-block',
              padding: '1px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: memorial.status === 'published' ? 'var(--color-gold-light)' : 'var(--color-border)',
              color: memorial.status === 'published' ? 'var(--color-gold-muted)' : 'var(--color-text-faint)',
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wider)',
              marginRight: 'var(--space-2)',
            }}>
              {memorial.status}
            </span>
            /memorial/{memorial.slug}
          </p>
        </div>

        <a
          href={`/memorial/${memorial.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--color-gold-pale)',
            border: '1px solid var(--color-gold-light)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gold-muted)',
            textDecoration: 'none',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          View Public ↗
        </a>
      </div>

      {/* Tab Bar */}
      <div style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        <div style={{ display: 'flex', minWidth: 'max-content' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-4) var(--space-5)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-wide)',
                color: activeTab === tab.id ? 'var(--color-ink)' : 'var(--color-text-muted)',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--color-ink)' : 'transparent'}`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
            >
              {tab.icon} {tab.label}
              {tab.id === 'tributes' && pendingTributeCount > 0 && (
                <span style={{
                  background: '#dc2626', color: '#fff',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 10, fontWeight: 700,
                  padding: '1px 6px',
                  lineHeight: 1.4,
                }}>
                  {pendingTributeCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, padding: 'var(--space-8) var(--space-6)', maxWidth: 800 }}>
        {activeTab === 'details' && (
          <BasicDetailsEditor memorial={memorial} onSaved={setMemorial} />
        )}
        {activeTab === 'biography' && (
          <BiographyEditor memorialId={memorial.id} biography={biography} />
        )}
        {activeTab === 'timeline' && (
          <TimelineEditor memorialId={memorial.id} initialEvents={timeline} />
        )}
        {activeTab === 'programme' && (
          <ProgrammeEditor memorialId={memorial.id} initialSections={programme} />
        )}
        {activeTab === 'gallery' && (
          <PhotoGalleryEditor
            memorialId={memorial.id}
            initialAlbums={albums}
            initialImages={galleryImages}
            currentPortrait={portraitUrl}
            currentCover={coverUrl}
            onPortraitChange={setPortraitUrl}
            onCoverChange={setCoverUrl}
          />
        )}
        {activeTab === 'videos' && (
          <VideoEditor memorialId={memorial.id} initialVideos={videos} />
        )}
        {activeTab === 'service' && (
          <FuneralDetailsEditor memorialId={memorial.id} details={funeralDetails} />
        )}
        {activeTab === 'tributes' && (
          <TributeModeration memorialId={memorial.id} initialTributes={tributes} />
        )}
        {activeTab === 'qr' && (
          <QRCodeEditor
            memorial={memorial}
            deployedBaseUrl={import.meta.env.VITE_DEPLOYED_URL || window.location.origin}
          />
        )}
      </div>
    </div>
  );
}
