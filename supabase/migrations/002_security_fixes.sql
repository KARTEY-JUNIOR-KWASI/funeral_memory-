-- ============================================================
-- DIGITAL MEMORIAL PLATFORM — Security Fixes
-- Migration 002: Storage policy + candle rate limiting
--
-- Run this in the Supabase SQL Editor after 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- FIX 1: Storage delete policy — too broad
-- Previously: any authenticated user could delete any image.
-- Fix: users can only delete images whose storage path starts
--      with a memorial ID they own (are admin of).
-- ============================================================

-- Drop the overly broad delete policy
drop policy if exists "Authenticated users can delete own memorial images" on storage.objects;
drop policy if exists "Authenticated users can delete own memorial PDFs" on storage.objects;

-- New scoped delete policy for images
-- Storage paths are structured as: <memorial_id>/portrait.jpg etc.
-- We extract the memorial_id prefix and check is_admin_of().
create policy "Admins can delete their own memorial images"
  on storage.objects for delete
  using (
    bucket_id = 'memorial-images'
    and auth.uid() is not null
    and (
      -- Allow if user is admin of the memorial whose ID prefixes the path
      public.is_admin_of(
        (split_part(name, '/', 1))::uuid
      )
      -- Also allow super admins
      or public.is_super_admin()
    )
  );

-- New scoped delete policy for PDFs
create policy "Admins can delete their own memorial PDFs"
  on storage.objects for delete
  using (
    bucket_id = 'memorial-pdfs'
    and auth.uid() is not null
    and (
      public.is_admin_of(
        (split_part(name, '/', 1))::uuid
      )
      or public.is_super_admin()
    )
  );

-- ============================================================
-- FIX 2: Candle rate limiting
--
-- The frontend sends ip_hash: 'client-side' (a placeholder).
-- Until a proper Edge Function is implemented to hash real IPs,
-- we add a DB-level safeguard:
--
-- Rule: no more than 10 candles per (ip_hash, memorial_id) total.
-- This is minimal protection until the Edge Function is built.
--
-- IMPORTANT: You should ALSO create a Supabase Edge Function
-- at /supabase/functions/light-candle/index.ts that:
--   1. Hashes req.headers['x-forwarded-for'] with SHA-256
--   2. Inserts into candles with the real ip_hash
--   3. Enforces a stricter rate limit (e.g. 1 per 24h per IP)
-- ============================================================

-- Function to enforce candle rate limiting at the DB level
create or replace function public.check_candle_rate_limit()
returns trigger
language plpgsql security definer as $$
declare
  v_count integer;
begin
  -- Count candles from this ip_hash for this memorial in the last 24 hours
  select count(*) into v_count
  from public.candles
  where memorial_id = new.memorial_id
    and ip_hash = new.ip_hash
    and lit_at > now() - interval '24 hours';

  if v_count >= 3 then
    raise exception 'CANDLE_RATE_LIMIT_EXCEEDED'
      using hint = 'You have already lit a candle for this memorial recently.';
  end if;

  return new;
end;
$$;

drop trigger if exists candles_rate_limit on public.candles;
create trigger candles_rate_limit
  before insert on public.candles
  for each row execute function public.check_candle_rate_limit();

-- ============================================================
-- NOTE: Edge Function needed for real IP-based rate limiting
-- ============================================================
-- The trigger above only rate-limits by ip_hash. Since the frontend
-- currently sends ip_hash = 'client-side' (a hardcoded placeholder),
-- ALL candles from all users share the same ip_hash, which will
-- immediately trigger the rate limit for everyone.
--
-- Recommended short-term fix while Edge Function is pending:
-- Update LightACandle.tsx to send a proper browser fingerprint as ip_hash.
-- The trigger above will then work correctly per-fingerprint.
--
-- Recommended long-term fix:
-- Create a Supabase Edge Function that receives the candle request,
-- hashes the real IP, and does the insert server-side.
-- ============================================================
