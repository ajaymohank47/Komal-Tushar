import { createClient } from '@supabase/supabase-js';

// Default project credentials (anon key is public and protected by Row Level Security)
const DEFAULT_SUPABASE_URL = 'https://ufawxnkjnzcfqbyiqiiq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmYXd4bmtqbnpjZnFieWlxaWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NjYxNDksImV4cCI6MjEwOTM0MjE0OX0.N7UtTrC6KEPXPv-mFa310ipihHYUhCuRCtWVau6-9Uc';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
