import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { detectVisitSource, detectDeviceType } from '../../lib/utils';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useMemorial } from '../../hooks/useMemorial';

import MemorialIntro from '../../components/memorial/MemorialIntro';
import MemorialHero from '../../components/memorial/MemorialHero';
import LifeStory from '../../components/memorial/LifeStory';
import LifeTimeline from '../../components/memorial/LifeTimeline';
import FuneralProgramme from '../../components/memorial/FuneralProgramme';
import PhotoGallery from '../../components/memorial/PhotoGallery';
import VideoSection from '../../components/memorial/VideoSection';
import LightACandle from '../../components/memorial/LightACandle';
import TributeWall from '../../components/memorial/TributeWall';
import FuneralDetailsSection from '../../components/memorial/FuneralDetailsSection';
import ShareMemorial from '../../components/memorial/ShareMemorial';

/**
 * Public Memorial Page — /memorial/:slug
 *
 * ZERO authentication required.
 * ZERO login required.
 * ZERO registration required.
 *
 * Visitors scan QR → this page opens → memorial renders immediately.
 */
export default function MemorialPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, loading, error, notFound } = useMemorial(slug!);

  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState('life-story');
  const heroRef = useRef<HTMLDivElement>(null);
  const viewRecorded = useRef(false);

  // Record anonymous visit for analytics
  useEffect(() => {
    if (!data || viewRecorded.current || !isSupabaseConfigured) return;
    viewRecorded.current = true;
    const source = detectVisitSource();
    const device = detectDeviceType();
    supabase.from('memorial_views').insert({
      memorial_id: data.memorial.id,
      source,
      device_type: device,
    }).then(() => {});
  }, [data]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (showIntro) return;
    const sections = ['life-story', 'timeline', 'programme', 'gallery', 'videos', 'candle', 'tributes', 'details', 'share'];
    const observers: IntersectionObserver[] = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [showIntro, data]);

  // Update document title for SEO / accessibility
  useEffect(() => {
    if (data?.memorial) {
      document.title = `In Loving Memory of ${data.memorial.full_name}`;
    }
  }, [data]);

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'var(--color-ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40,
            border: '1px solid rgba(181,146,74,0.3)',
            borderTopColor: 'var(--color-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto var(--space-6)',
          }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'rgba(245,240,235,0.3)' }}>
            Loading memorial
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Not found state ───────────────────────────────────────
  if (notFound || error || !data) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-8)',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 'var(--space-6)' }} aria-hidden="true">🕊</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', color: 'var(--color-ink)', marginBottom: 'var(--space-4)' }}>
          Memorial not found
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: 360, lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
          {error || 'This memorial could not be found. Please check the link and try again.'}
        </p>
        <button onClick={() => navigate('/')} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', padding: 'var(--space-3) var(--space-6)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', background: 'none', cursor: 'pointer' }}>
          ← Return Home
        </button>
      </div>
    );
  }

  const { memorial, biography, timeline, programme, albums, images, videos, tributes, funeral_details, candle_count } = data;

  // ── Intro screen ─────────────────────────────────────────
  if (showIntro) {
    return (
      <div onWheel={() => setShowIntro(false)} onTouchStart={() => {}}>
        <MemorialIntro
          memorial={memorial}
          onEnter={() => setShowIntro(false)}
        />
      </div>
    );
  }

  // ── Full memorial ─────────────────────────────────────────
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-surface)' }}>
      {/* Sticky hero + nav */}
      <div ref={heroRef} style={{ position: 'sticky', top: 0, zIndex: 'var(--z-nav)' } as React.CSSProperties}>
        <MemorialHero
          memorial={memorial}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Memorial content sections */}
      <main id="main-content">
        <LifeStory biography={biography} />
        <LifeTimeline events={timeline} />
        <FuneralProgramme sections={programme} pdfUrl={memorial.programme_pdf_url} />
        <PhotoGallery albums={albums} images={images} />
        <VideoSection videos={videos} />
        <LightACandle
          memorialId={memorial.id}
          memorialName={memorial.full_name}
          initialCount={candle_count}
        />
        <TributeWall memorialId={memorial.id} tributes={tributes} />
        <FuneralDetailsSection details={funeral_details} />
        <ShareMemorial slug={memorial.slug} name={memorial.full_name} />
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--color-ink)',
        padding: 'var(--space-8)',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300, fontSize: 'var(--text-lg)', color: 'rgba(245,240,235,0.4)' }}>
          {memorial.full_name}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'rgba(245,240,235,0.2)', marginTop: 'var(--space-2)', letterSpacing: 'var(--tracking-wide)' }}>
          Forever remembered.
        </p>
      </footer>
    </div>
  );
}
