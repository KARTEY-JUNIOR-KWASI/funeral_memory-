// ============================================================
// DIGITAL MEMORIAL PLATFORM — TypeScript Types
// Mirrors the PostgreSQL schema exactly.
// ============================================================

export type UserRole = 'SUPER_ADMIN' | 'MEMORIAL_ADMIN';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
}

// ----------------------------------------------------------
// Memorials
// ----------------------------------------------------------

export type MemorialStatus = 'draft' | 'published' | 'archived';
export type MemorialTheme = 'classic'; // extensible later

export interface Memorial {
  id: string;
  slug: string;
  full_name: string;
  date_of_birth: string | null;   // ISO date "YYYY-MM-DD"
  date_of_passing: string | null; // ISO date "YYYY-MM-DD"
  tagline: string | null;
  profile_image_url: string | null;
  cover_image_url: string | null;
  programme_pdf_url: string | null;
  theme: MemorialTheme;
  status: MemorialStatus;
  published_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MemorialAdmin {
  id: string;
  memorial_id: string;
  profile_id: string;
  role: 'owner' | 'editor';
  created_at: string;
}

// ----------------------------------------------------------
// Biography
// ----------------------------------------------------------

export interface Biography {
  id: string;
  memorial_id: string;
  content: string; // Rich text (HTML from Tiptap)
  updated_at: string;
}

// ----------------------------------------------------------
// Timeline
// ----------------------------------------------------------

export interface TimelineEvent {
  id: string;
  memorial_id: string;
  year: number;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

// ----------------------------------------------------------
// Funeral Programme
// ----------------------------------------------------------

export interface ProgrammeSection {
  id: string;
  memorial_id: string;
  title: string;
  content: string | null;
  sort_order: number;
  created_at: string;
}

// ----------------------------------------------------------
// Gallery
// ----------------------------------------------------------

export interface GalleryAlbum {
  id: string;
  memorial_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  memorial_id: string;
  album_id: string | null;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

// ----------------------------------------------------------
// Videos
// ----------------------------------------------------------

export interface Video {
  id: string;
  memorial_id: string;
  title: string | null;
  description: string | null;
  video_url: string; // YouTube or Vimeo URL
  thumbnail_url: string | null;
  sort_order: number;
  created_at: string;
}

// ----------------------------------------------------------
// Tributes
// ----------------------------------------------------------

export type TributeStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface Tribute {
  id: string;
  memorial_id: string;
  author_name: string | null;      // Null → display "Anonymous"
  relationship: string | null;
  message: string;
  status: TributeStatus;
  // ip_hash is excluded from public-facing types intentionally
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

// Public-safe tribute (returned by RLS for anon users — no ip_hash)
export type PublicTribute = Omit<Tribute, 'reviewed_at' | 'reviewed_by'>;

// ----------------------------------------------------------
// Candles
// ----------------------------------------------------------

export interface Candle {
  id: string;
  memorial_id: string;
  // ip_hash and fingerprint excluded from public-facing type
  lit_at: string;
}

export interface CandleCount {
  memorial_id: string;
  count: number;
}

// ----------------------------------------------------------
// Funeral Details
// ----------------------------------------------------------

export interface FuneralDetails {
  id: string;
  memorial_id: string;
  service_date: string | null;   // ISO date
  service_time: string | null;   // HH:MM
  venue_name: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  maps_url: string | null;
  additional_notes: string | null;
  updated_at: string;
}

// ----------------------------------------------------------
// Analytics
// ----------------------------------------------------------

export type ViewSource = 'qr' | 'direct' | 'social' | 'unknown';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface MemorialView {
  id: string;
  memorial_id: string;
  source: ViewSource;
  device_type: DeviceType;
  viewed_at: string;
}

// ----------------------------------------------------------
// Composite / API Response Types
// ----------------------------------------------------------

/**
 * Full public memorial data — everything needed to render
 * the public memorial experience in a single fetch.
 */
export interface PublicMemorialData {
  memorial: Memorial;
  biography: Biography | null;
  timeline: TimelineEvent[];
  programme: ProgrammeSection[];
  albums: GalleryAlbum[];
  images: GalleryImage[];
  videos: Video[];
  tributes: PublicTribute[];
  funeral_details: FuneralDetails | null;
  candle_count: number;
}

/**
 * Admin memorial detail — includes all data plus draft content.
 */
export interface AdminMemorialData extends PublicMemorialData {
  pending_tributes: Tribute[];
  total_views: number;
  qr_views: number;
}
