import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' &&
         supabaseAnonKey !== '' &&
         !supabaseUrl.includes('YOUR_') &&
         !supabaseAnonKey.includes('YOUR_');
};

// Demo mode flag
export const isDemoMode = !isSupabaseConfigured();

// Create Supabase client - use 'any' type when not configured to avoid type errors
export const supabase: SupabaseClient<any> = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
