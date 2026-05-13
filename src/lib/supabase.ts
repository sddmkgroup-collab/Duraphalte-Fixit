import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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

export const loadSiteContent = async (id: string = 'home_main') => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') console.error('Error loading content:', error);
    return data?.content || null;
  } catch (err) {
    console.error('Failed to fetch site content:', err);
    return null;
  }
};

export const saveSiteContent = async (content: any, id: string = 'home_main') => {
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    await supabase
      .from('site_content')
      .upsert({ id, content, updated_at: new Date().toISOString() });
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
    const { error } = await supabase.from('blog_posts').upsert(posts);
    if (error) throw error;
  } catch (err) {
    console.error('Failed to save blog posts:', err);
    throw err;
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

export const uploadImage = async (file: File): Promise<string | null> => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error('Unexpected error during upload:', err);
    return null;
  }
};
