import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials fehlen. Setze VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in .env.local');
  }
  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabase) {
  console.warn('Supabase credentials fehlen. Setze VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in .env.local');
}
