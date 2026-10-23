-- ============================================================
-- DIGITAL MEMORIAL PLATFORM
-- Migration 003: Enable Realtime for the tributes table
--
-- Run this in the Supabase SQL Editor (Project → SQL Editor)
-- ============================================================

-- Add the tributes table to the supabase_realtime publication
-- so that INSERT / UPDATE events are broadcast to subscribers.
--
-- Note: By default Supabase only broadcasts on tables added to
-- the publication. This is safe to run multiple times.
alter publication supabase_realtime add table public.tributes;

-- Verify (optional — you can run this to confirm):
-- select schemaname, tablename
-- from pg_publication_tables
-- where pubname = 'supabase_realtime';
