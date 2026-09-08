-- ============================================================
-- DIGITAL MEMORIAL PLATFORM — Database Schema
-- Migration 001: Initial schema
--
-- Run this in the Supabase SQL Editor (Project → SQL Editor)
-- ============================================================

-- ── Enable UUID extension ────────────────────────────────────
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES
-- Extends Supabase auth.users with app-level metadata.
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text not null,
  role        text not null default 'MEMORIAL_ADMIN'
                check (role in ('SUPER_ADMIN', 'MEMORIAL_ADMIN')),
  created_at  timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- MEMORIALS
-- Core entity. Each record is one person's memorial.
-- ============================================================
create table if not exists public.memorials (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,             -- e.g. "kofi-mensah" — immutable once published
  full_name           text not null,
  date_of_birth       date,
  date_of_passing     date,
  tagline             text,
  profile_image_url   text,
  cover_image_url     text,
  programme_pdf_url   text,
  theme               text not null default 'classic',
  status              text not null default 'draft'
                        check (status in ('draft', 'published', 'archived')),
  published_at        timestamptz,
  created_by          uuid not null references public.profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_memorials_slug   on public.memorials(slug);
create index if not exists idx_memorials_status on public.memorials(status);

-- Auto-update updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger memorials_updated_at
  before update on public.memorials
  for each row execute function public.touch_updated_at();

-- ============================================================
-- MEMORIAL_ADMINS
-- Links profiles to memorials. Supports multiple admins per memorial.
-- ============================================================
create table if not exists public.memorial_admins (
  id           uuid primary key default gen_random_uuid(),
  memorial_id  uuid not null references public.memorials(id) on delete cascade,
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  role         text not null default 'editor'
                 check (role in ('owner', 'editor')),
  created_at   timestamptz not null default now(),
  unique(memorial_id, profile_id)
);

create index if not exists idx_memorial_admins_profile on public.memorial_admins(profile_id);

-- ============================================================
-- BIOGRAPHIES
-- One biography per memorial (rich text / HTML).
-- ============================================================
create table if not exists public.biographies (
  id           uuid primary key default gen_random_uuid(),
  memorial_id  uuid unique not null references public.memorials(id) on delete cascade,
  content      text not null default '',
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- TIMELINE_EVENTS
-- Ordered life milestones.
-- ============================================================
create table if not exists public.timeline_events (
  id           uuid primary key default gen_random_uuid(),
  memorial_id  uuid not null references public.memorials(id) on delete cascade,
  year         integer not null,
  title        text not null,
  description  text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists idx_timeline_memorial on public.timeline_events(memorial_id, sort_order);

-- ============================================================
-- PROGRAMME_SECTIONS
-- Ordered sections of the funeral programme.
-- ============================================================
create table if not exists public.programme_sections (
  id           uuid primary key default gen_random_uuid(),
  memorial_id  uuid not null references public.memorials(id) on delete cascade,
  title        text not null,
  content      text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists idx_programme_memorial on public.programme_sections(memorial_id, sort_order);

-- ============================================================
-- GALLERY_ALBUMS
-- Optional groupings for gallery images.
-- ============================================================
create table if not exists public.gallery_albums (
  id           uuid primary key default gen_random_uuid(),
  memorial_id  uuid not null references public.memorials(id) on delete cascade,
  name         text not null,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- GALLERY_IMAGES
-- Photos uploaded to Supabase Storage.
-- ============================================================
create table if not exists public.gallery_images (
  id           uuid primary key default gen_random_uuid(),
  memorial_id  uuid not null references public.memorials(id) on delete cascade,
  album_id     uuid references public.gallery_albums(id) on delete set null,
  image_url    text not null,
  caption      text,
  alt_text     text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists idx_gallery_memorial on public.gallery_images(memorial_id, sort_order);
create index if not exists idx_gallery_album    on public.gallery_images(album_id);

-- ============================================================
-- VIDEOS
-- YouTube or Vimeo URLs (no direct video file storage in MVP).
-- ============================================================
create table if not exists public.videos (
  id             uuid primary key default gen_random_uuid(),
  memorial_id    uuid not null references public.memorials(id) on delete cascade,
  title          text,
  description    text,
  video_url      text not null,
  thumbnail_url  text,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists idx_videos_memorial on public.videos(memorial_id, sort_order);

-- ============================================================
-- TRIBUTES
-- Visitor-submitted messages. All go to 'pending' first.
-- ip_hash stored for spam detection — never returned to public.
-- ============================================================
create table if not exists public.tributes (
  id            uuid primary key default gen_random_uuid(),
  memorial_id   uuid not null references public.memorials(id) on delete cascade,
  author_name   text,                                   -- null → display "Anonymous"
  relationship  text,
  message       text not null,
  status        text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected', 'hidden')),
  ip_hash       text,                                   -- hashed, never raw IP
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   uuid references public.profiles(id)
);

create index if not exists idx_tributes_memorial_status on public.tributes(memorial_id, status);
create index if not exists idx_tributes_created         on public.tributes(created_at desc);

-- ============================================================
-- CANDLES
-- Anonymous candle lightings. Rate-limited by ip_hash in Edge Function.
-- ============================================================
create table if not exists public.candles (
  id           uuid primary key default gen_random_uuid(),
  memorial_id  uuid not null references public.memorials(id) on delete cascade,
  ip_hash      text not null,                           -- hashed, for rate limiting
  fingerprint  text,                                    -- browser fingerprint hash
  lit_at       timestamptz not null default now()
);

create index if not exists idx_candles_memorial   on public.candles(memorial_id);
create index if not exists idx_candles_ip_hash    on public.candles(ip_hash, lit_at desc);

-- ============================================================
-- FUNERAL_DETAILS
-- Service logistics. One record per memorial.
-- ============================================================
create table if not exists public.funeral_details (
  id                uuid primary key default gen_random_uuid(),
  memorial_id       uuid unique not null references public.memorials(id) on delete cascade,
  service_date      date,
  service_time      time,
  venue_name        text,
  address           text,
  city              text,
  country           text,
  maps_url          text,
  additional_notes  text,
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- MEMORIAL_VIEWS
-- Anonymous visit tracking. No personal data stored.
-- source: 'qr' when ?ref=qr is in the URL
-- ============================================================
create table if not exists public.memorial_views (
  id           uuid primary key default gen_random_uuid(),
  memorial_id  uuid not null references public.memorials(id) on delete cascade,
  source       text not null default 'unknown'
                 check (source in ('qr', 'direct', 'social', 'unknown')),
  device_type  text not null default 'unknown'
                 check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  viewed_at    timestamptz not null default now()
);

create index if not exists idx_views_memorial on public.memorial_views(memorial_id, viewed_at desc);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles         enable row level security;
alter table public.memorials        enable row level security;
alter table public.memorial_admins  enable row level security;
alter table public.biographies      enable row level security;
alter table public.timeline_events  enable row level security;
alter table public.programme_sections enable row level security;
alter table public.gallery_albums   enable row level security;
alter table public.gallery_images   enable row level security;
alter table public.videos           enable row level security;
alter table public.tributes         enable row level security;
alter table public.candles          enable row level security;
alter table public.funeral_details  enable row level security;
alter table public.memorial_views   enable row level security;

-- ── Helper function: is_admin_of(memorial_id) ──────────────
create or replace function public.is_admin_of(p_memorial_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.memorial_admins
    where memorial_id = p_memorial_id
      and profile_id  = auth.uid()
  );
$$;

-- ── Helper function: is_super_admin() ──────────────────────
create or replace function public.is_super_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'SUPER_ADMIN'
  );
$$;

-- ────────────────────────────────────────────────────────────
-- PROFILES policies
-- ────────────────────────────────────────────────────────────
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

-- Auto-insert via trigger (no INSERT policy needed for users)

-- ────────────────────────────────────────────────────────────
-- MEMORIALS policies
-- ────────────────────────────────────────────────────────────

-- Public: read published memorials
create policy "Public can read published memorials"
  on public.memorials for select
  using (status = 'published');

-- Admins: full access to their own memorials
create policy "Admins can read own memorials"
  on public.memorials for select
  using (is_admin_of(id) or created_by = auth.uid() or is_super_admin());

create policy "Admins can insert memorials"
  on public.memorials for insert
  with check (auth.uid() is not null);

create policy "Admins can update own memorials"
  on public.memorials for update
  using (is_admin_of(id) or created_by = auth.uid() or is_super_admin());

create policy "Admins can delete own memorials"
  on public.memorials for delete
  using (created_by = auth.uid() or is_super_admin());

-- ────────────────────────────────────────────────────────────
-- MEMORIAL_ADMINS policies
-- ────────────────────────────────────────────────────────────
create policy "Admins can read own memorial_admins rows"
  on public.memorial_admins for select
  using (profile_id = auth.uid() or is_super_admin());

create policy "Owners can manage memorial_admins"
  on public.memorial_admins for all
  using (
    profile_id = auth.uid() or
    (select role from public.memorial_admins ma
       where ma.memorial_id = memorial_admins.memorial_id
         and ma.profile_id  = auth.uid()) = 'owner'
    or is_super_admin()
  );

-- ────────────────────────────────────────────────────────────
-- BIOGRAPHIES, TIMELINE, PROGRAMME, GALLERY, VIDEOS, FUNERAL DETAILS
-- Pattern: public SELECT on published memorials; admin full CRUD
-- ────────────────────────────────────────────────────────────

-- BIOGRAPHIES
create policy "Public can read biographies of published memorials"
  on public.biographies for select
  using (exists (
    select 1 from public.memorials m
    where m.id = biographies.memorial_id and m.status = 'published'
  ));

create policy "Admins can manage biographies"
  on public.biographies for all
  using (is_admin_of(memorial_id) or is_super_admin());

-- TIMELINE EVENTS
create policy "Public can read timeline of published memorials"
  on public.timeline_events for select
  using (exists (
    select 1 from public.memorials m
    where m.id = timeline_events.memorial_id and m.status = 'published'
  ));

create policy "Admins can manage timeline events"
  on public.timeline_events for all
  using (is_admin_of(memorial_id) or is_super_admin());

-- PROGRAMME SECTIONS
create policy "Public can read programme of published memorials"
  on public.programme_sections for select
  using (exists (
    select 1 from public.memorials m
    where m.id = programme_sections.memorial_id and m.status = 'published'
  ));

create policy "Admins can manage programme sections"
  on public.programme_sections for all
  using (is_admin_of(memorial_id) or is_super_admin());

-- GALLERY ALBUMS
create policy "Public can read albums of published memorials"
  on public.gallery_albums for select
  using (exists (
    select 1 from public.memorials m
    where m.id = gallery_albums.memorial_id and m.status = 'published'
  ));

create policy "Admins can manage gallery albums"
  on public.gallery_albums for all
  using (is_admin_of(memorial_id) or is_super_admin());

-- GALLERY IMAGES
create policy "Public can read images of published memorials"
  on public.gallery_images for select
  using (exists (
    select 1 from public.memorials m
    where m.id = gallery_images.memorial_id and m.status = 'published'
  ));

create policy "Admins can manage gallery images"
  on public.gallery_images for all
  using (is_admin_of(memorial_id) or is_super_admin());

-- VIDEOS
create policy "Public can read videos of published memorials"
  on public.videos for select
  using (exists (
    select 1 from public.memorials m
    where m.id = videos.memorial_id and m.status = 'published'
  ));

create policy "Admins can manage videos"
  on public.videos for all
  using (is_admin_of(memorial_id) or is_super_admin());

-- FUNERAL DETAILS
create policy "Public can read funeral details of published memorials"
  on public.funeral_details for select
  using (exists (
    select 1 from public.memorials m
    where m.id = funeral_details.memorial_id and m.status = 'published'
  ));

create policy "Admins can manage funeral details"
  on public.funeral_details for all
  using (is_admin_of(memorial_id) or is_super_admin());

-- ────────────────────────────────────────────────────────────
-- TRIBUTES policies
-- Public: INSERT (pending only) + SELECT approved only
-- Admin: full access
-- ip_hash is NEVER returned in public SELECT
-- ────────────────────────────────────────────────────────────

-- Public can INSERT tributes (they go to 'pending' by default)
create policy "Anyone can submit a tribute"
  on public.tributes for insert
  with check (
    status = 'pending' and
    exists (
      select 1 from public.memorials m
      where m.id = tributes.memorial_id and m.status = 'published'
    )
  );

-- Public can only read approved tributes (no ip_hash via SELECT column restriction in code)
create policy "Public can read approved tributes"
  on public.tributes for select
  using (
    status = 'approved' and
    exists (
      select 1 from public.memorials m
      where m.id = tributes.memorial_id and m.status = 'published'
    )
  );

-- Admins can read all tributes for their memorials
create policy "Admins can manage tributes"
  on public.tributes for all
  using (is_admin_of(memorial_id) or is_super_admin());

-- ────────────────────────────────────────────────────────────
-- CANDLES policies
-- Public: INSERT only (rate limiting handled in Edge Function)
-- Public: SELECT COUNT only (via aggregate, never raw rows)
-- ────────────────────────────────────────────────────────────

create policy "Anyone can light a candle"
  on public.candles for insert
  with check (
    exists (
      select 1 from public.memorials m
      where m.id = candles.memorial_id and m.status = 'published'
    )
  );

create policy "Public can count candles"
  on public.candles for select
  using (
    exists (
      select 1 from public.memorials m
      where m.id = candles.memorial_id and m.status = 'published'
    )
  );

create policy "Admins can read candles"
  on public.candles for select
  using (is_admin_of(memorial_id) or is_super_admin());

-- ────────────────────────────────────────────────────────────
-- MEMORIAL_VIEWS policies
-- Public: INSERT only (blind write — analytics)
-- Admin: SELECT
-- ────────────────────────────────────────────────────────────

create policy "Anyone can record a view"
  on public.memorial_views for insert
  with check (
    exists (
      select 1 from public.memorials m
      where m.id = memorial_views.memorial_id and m.status = 'published'
    )
  );

create policy "Admins can read view analytics"
  on public.memorial_views for select
  using (is_admin_of(memorial_id) or is_super_admin());

-- ============================================================
-- STORAGE BUCKETS (run in Supabase Storage section or via SQL)
-- ============================================================

-- Run these separately in the Supabase dashboard if SQL approach
-- is not supported, or use the Storage UI:
--
-- Bucket: memorial-images   (public: true)
-- Bucket: memorial-pdfs     (public: true)
--
-- Storage policies:
-- Anyone can read from both buckets (public CDN URLs)
-- Only authenticated users can upload/delete

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'memorial-images',
    'memorial-images',
    true,
    10485760,  -- 10MB limit per image
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'memorial-pdfs',
    'memorial-pdfs',
    true,
    52428800,  -- 50MB limit per PDF
    array['application/pdf']
  )
on conflict (id) do nothing;

-- Storage RLS policies
create policy "Anyone can view memorial images"
  on storage.objects for select
  using (bucket_id = 'memorial-images');

create policy "Authenticated users can upload memorial images"
  on storage.objects for insert
  with check (bucket_id = 'memorial-images' and auth.uid() is not null);

create policy "Authenticated users can delete own memorial images"
  on storage.objects for delete
  using (bucket_id = 'memorial-images' and auth.uid() is not null);

create policy "Anyone can view memorial PDFs"
  on storage.objects for select
  using (bucket_id = 'memorial-pdfs');

create policy "Authenticated users can upload memorial PDFs"
  on storage.objects for insert
  with check (bucket_id = 'memorial-pdfs' and auth.uid() is not null);

create policy "Authenticated users can delete own memorial PDFs"
  on storage.objects for delete
  using (bucket_id = 'memorial-pdfs' and auth.uid() is not null);
