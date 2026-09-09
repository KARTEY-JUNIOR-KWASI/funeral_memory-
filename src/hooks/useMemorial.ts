import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SAMPLE_MEMORIAL } from '../data/sampleMemorial';
import type { PublicMemorialData } from '../types/memorial';

interface UseMemorialResult {
  data: PublicMemorialData | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  isDemo: boolean;
}

export function useMemorial(slug: string): UseMemorialResult {
  const [data, setData] = useState<PublicMemorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    // Use sample data if Supabase not yet configured, or if the slug matches the demo slug
    // (VITE_DEMO_SLUG env var — prevents collisions with real memorials)
    const demoSlug = import.meta.env.VITE_DEMO_SLUG ?? 'kofi-mensah';
    if (!isSupabaseConfigured || slug === demoSlug) {
      setTimeout(() => {
        setData(SAMPLE_MEMORIAL);
        setLoading(false);
      }, 800); // small delay simulates network fetch
      return;
    }

    async function fetchMemorial() {
      try {
        setLoading(true);
        setError(null);

        // Fetch the core memorial
        const { data: memorial, error: mErr } = await supabase
          .from('memorials')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (mErr || !memorial) {
          setNotFound(true);
          return;
        }

        // Parallel fetch all related data
        const [
          bioRes, timelineRes, programmeRes,
          albumsRes, imagesRes, videosRes,
          tributesRes, detailsRes, candleRes,
        ] = await Promise.all([
          supabase.from('biographies').select('*').eq('memorial_id', memorial.id).maybeSingle(),
          supabase.from('timeline_events').select('*').eq('memorial_id', memorial.id).order('sort_order'),
          supabase.from('programme_sections').select('*').eq('memorial_id', memorial.id).order('sort_order'),
          supabase.from('gallery_albums').select('*').eq('memorial_id', memorial.id).order('sort_order'),
          supabase.from('gallery_images').select('*').eq('memorial_id', memorial.id).order('sort_order'),
          supabase.from('videos').select('*').eq('memorial_id', memorial.id).order('sort_order'),
          supabase.from('tributes').select('id,memorial_id,author_name,relationship,message,status,created_at')
            .eq('memorial_id', memorial.id).eq('status', 'approved').order('created_at', { ascending: false }),
          supabase.from('funeral_details').select('*').eq('memorial_id', memorial.id).maybeSingle(),
          supabase.from('candles').select('id', { count: 'exact', head: true }).eq('memorial_id', memorial.id),
        ]);

        // Log warnings for any individual table errors — these are non-fatal but indicate a problem
        if (bioRes.error) console.warn('[Memorial] Failed to load biography:', bioRes.error.message);
        if (timelineRes.error) console.warn('[Memorial] Failed to load timeline:', timelineRes.error.message);
        if (programmeRes.error) console.warn('[Memorial] Failed to load programme:', programmeRes.error.message);
        if (albumsRes.error) console.warn('[Memorial] Failed to load albums:', albumsRes.error.message);
        if (imagesRes.error) console.warn('[Memorial] Failed to load images:', imagesRes.error.message);
        if (videosRes.error) console.warn('[Memorial] Failed to load videos:', videosRes.error.message);
        if (tributesRes.error) console.warn('[Memorial] Failed to load tributes:', tributesRes.error.message);
        if (detailsRes.error) console.warn('[Memorial] Failed to load funeral details:', detailsRes.error.message);
        if (candleRes.error) console.warn('[Memorial] Failed to load candle count:', candleRes.error.message);

        setData({
          memorial,
          biography: bioRes.data ?? null,
          timeline: timelineRes.data ?? [],
          programme: programmeRes.data ?? [],
          albums: albumsRes.data ?? [],
          images: imagesRes.data ?? [],
          videos: videosRes.data ?? [],
          tributes: tributesRes.data ?? [],
          funeral_details: detailsRes.data ?? null,
          candle_count: candleRes.count ?? 0,
        });
      } catch (err) {
        console.error('Failed to load memorial:', err);
        setError('Failed to load the memorial. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchMemorial();
  }, [slug]);

  return { data, loading, error, notFound, isDemo: !isSupabaseConfigured };
}
