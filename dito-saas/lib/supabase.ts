import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hlzmahaekybidmwielsr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsem1haGFla3liaWRtd2llbHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDEzNjEsImV4cCI6MjA5MjQ3NzM2MX0.7LFLCe72ZyE245raNtJzi72meVhrhkO_45leQMUfHFM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Sugestão de Tabela no Supabase:
 * 
 * TABLE profiles (
 *   id uuid REFERENCES auth.users ON DELETE CASCADE,
 *   full_name text,
 *   avatar_url text,
 *   bio text,
 *   website text,
 *   updated_at timestamp with time zone,
 *   PRIMARY KEY (id)
 * );
 */
