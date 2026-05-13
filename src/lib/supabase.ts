import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { 
      from: () => ({ 
        select: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }), single: () => Promise.resolve({ data: null, error: null }) }),
        insert: () => Promise.resolve({ error: null }),
        upsert: () => Promise.resolve({ error: null }),
        delete: () => Promise.resolve({ error: null })
      }) 
    } as any;

export const loadSiteContent = async () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'home_main')
      .single();
    if (error && error.code !== 'PGRST116') console.error('Error loading content:', error);
    return data?.content || null;
  } catch (err) {
    console.error('Failed to fetch site content:', err);
    return null;
  }
};

export const saveSiteContent = async (content: any) => {
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    await supabase
      .from('site_content')
      .upsert({ id: 'home_main', content, updated_at: new Date().toISOString() });
  } catch (err) {
    console.error('Failed to save site content:', err);
  }
};

export const loadBlogPosts = async () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('id', { ascending: false });
    if (error) console.error('Error loading blog posts:', error);
    return data || null;
  } catch (err) {
    console.error('Failed to fetch blog posts:', err);
    return null;
  }
};

export const saveBlogPosts = async (posts: any[]) => {
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    // For simplicity, we'll sync the whole array by deleting and re-inserting or using upsert
    // But since IDs might change or posts might be deleted, a full sync is easier for this context
    // In a real app, you'd manage individual rows.
    for (const post of posts) {
      await supabase.from('blog_posts').upsert(post);
    }
  } catch (err) {
    console.error('Failed to save blog posts:', err);
  }
};

export const deleteBlogPost = async (id: any) => {
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    await supabase.from('blog_posts').delete().eq('id', id);
  } catch (err) {
    console.error('Failed to delete blog post:', err);
  }
};

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
