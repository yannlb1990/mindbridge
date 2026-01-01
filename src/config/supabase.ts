/**
 * MindBridge - Supabase Configuration
 *
 * This file contains the Supabase client configuration.
 * Replace the placeholder values with your actual Supabase credentials
 * once you create your Supabase project.
 *
 * To set up:
 * 1. Go to https://supabase.com and create a new project
 * 2. Get your project URL and anon key from Settings > API
 * 3. Replace the values below or use environment variables
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Validate configuration
if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn(
    '⚠️ Supabase credentials not configured. Please update src/config/supabase.ts or set environment variables.'
  );
}

// Create Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  // Enable real-time subscriptions
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return (
    SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
    SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
  );
};

// Export configuration for reference
export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
};

export default supabase;
