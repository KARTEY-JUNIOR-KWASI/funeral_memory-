/**
 * Utility functions for the Digital Memorial Platform.
 */

/**
 * Format a date string for display.
 * Handles partial dates (year only, year+month, full date).
 */
export function formatMemorialDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr + 'T00:00:00'); // avoid timezone shift
    return date.getFullYear().toString();
  } catch {
    return dateStr;
  }
}

/**
 * Format birth/death years as a range string.
 * Example: "1952 — 2026"
 */
export function formatLifespan(
  dateOfBirth: string | null | undefined,
  dateOfPassing: string | null | undefined
): string {
  const birth = formatMemorialDate(dateOfBirth);
  const passing = formatMemorialDate(dateOfPassing);
  if (birth && passing) return `${birth} \u2014 ${passing}`;
  if (birth) return `Born ${birth}`;
  if (passing) return `${passing}`;
  return '';
}

/**
 * Detect device type from window.innerWidth.
 * Used for analytics — never for user-visible logic.
 */
export function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Detect visit source from URL search params.
 * QR codes should include ?ref=qr on the memorial URL.
 */
export function detectVisitSource(): 'qr' | 'direct' | 'social' | 'unknown' {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref === 'qr') return 'qr';
  if (ref === 'social' || ref === 'facebook' || ref === 'whatsapp') return 'social';
  if (!document.referrer) return 'direct';
  return 'unknown';
}

/**
 * Extract YouTube video ID from a URL.
 * Supports standard, shortened, and embed URLs.
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract Vimeo video ID from a URL.
 */
export function extractVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/)(\d+)/);
  return match ? match[1] : null;
}

/**
 * Get a video thumbnail URL for YouTube or Vimeo.
 */
export function getVideoThumbnail(url: string): string | null {
  const ytId = extractYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

  // Vimeo thumbnails require an API call — return null, handle in component
  return null;
}

/**
 * Generate the embed URL for a YouTube or Vimeo video.
 * Returns null if the URL is not recognised.
 */
export function getVideoEmbedUrl(url: string): string | null {
  const ytId = extractYouTubeId(url);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`;
  }

  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`;
  }

  return null;
}

/**
 * Slugify a string for use in URLs.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '\u2026';
}

/**
 * Format a display name for a tribute author.
 * Returns "Anonymous" if no name provided.
 */
export function formatTributeAuthor(name: string | null | undefined): string {
  if (!name || name.trim() === '') return 'Anonymous';
  return name.trim();
}

/**
 * Build the memorial public URL from a slug.
 */
export function memorialUrl(slug: string, withRef?: 'qr' | 'social'): string {
  const base = `/memorial/${slug}`;
  return withRef ? `${base}?ref=${withRef}` : base;
}

/**
 * Build the full absolute memorial URL (for sharing/QR).
 */
export function memorialAbsoluteUrl(slug: string, withRef?: 'qr' | 'social'): string {
  const origin = window.location.origin;
  return origin + memorialUrl(slug, withRef);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Simple debounce implementation.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
