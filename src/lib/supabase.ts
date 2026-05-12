import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { 
      from: () => ({ 
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ error: null })
      }) 
    } as any;

export const logVisitor = async (path: string) => {
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    await supabase
      .from('visitor_logs')
      .insert([
        {
          page_path: path,
          referrer: document.referrer || 'direct',
          user_agent: navigator.userAgent,
          screen_width: window.innerWidth,
          language: navigator.language,
        }
      ]);
  } catch (err) {
    console.error('Failed to log visitor:', err);
  }
};
