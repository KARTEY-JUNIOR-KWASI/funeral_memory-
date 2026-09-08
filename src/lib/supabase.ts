import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Warn in development if credentials haven't been configured yet.
// The app will still load — Supabase calls will simply fail gracefully.
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your_supabase') &&
  !supabaseAnonKey.includes('your_supabase');

if (!isConfigured) {
  console.warn(
    '[Memorial Platform] Supabase is not yet configured. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local ' +
    'once your Supabase project is ready.'
  );
}

/**
 * Public Supabase client.
 * Uses the anon key only — safe for client-side use.
 * Row Level Security policies enforce all data access rules.
 * The service_role key is NEVER used in frontend code.
 */
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://xxxxxxxxxxxxxxxxxxx.supabase.co',
  isConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

export const isSupabaseConfigured = isConfigured;

export type { SupabaseClient } from '@supabase/supabase-js';
