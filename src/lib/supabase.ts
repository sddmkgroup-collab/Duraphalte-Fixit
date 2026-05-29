import { createClient } from '@supabase/supabase-js';

// Safe helper to read from localstorage before safeLocalStorage is declared
const getLocalStorageOverride = (key: string): string => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key) || '';
    }
  } catch (e) {
    // ignore
  }
  return '';
};

export const supabaseUrl = getLocalStorageOverride('supabase_url') || import.meta.env.VITE_SUPABASE_URL || 'https://kljjcxkyqffqsphuodcu.supabase.co';
export const supabaseAnonKey = getLocalStorageOverride('supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsampjeGt5cWZmcXNwaHVvZGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjUyNTAsImV4cCI6MjA5NDE0MTI1MH0.LwNKOedyerLsv0ynQa0nB2OV7_whA1PIXcJbiFPzfC4';

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
    const { error } = await supabase
      .from('site_content')
      .upsert({ id, content, updated_at: new Date().toISOString() });
    if (error) {
      console.error('Supabase upsert error:', error);
      throw error;
    }
  } catch (err) {
    console.error('Failed to save site content:', err);
    throw err;
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

export const loadProducts = async () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      // If table doesn't exist yet, it'll gracefully return null so we use fallback
      if (error.code !== 'PGRST116') {
        console.warn('Products database select returned error (table might not exist yet):', error);
      }
      return null;
    }
    
    if (data) {
      return data.map((p: any) => ({
        id: p.id,
        title: p.title || '',
        badge: p.badge || '',
        price: p.price || '',
        oldPrice: p.old_price || '',
        discount: p.discount || '',
        image: p.image || '',
        images: (p.images || [p.image || '']).filter((img: string) => img && img.trim() !== ''),
        desc: p.desc || '',
        tokopedia: p.tokopedia || '',
        shopee: p.shopee || '',
        berat_bersih: p.berat_bersih || '',
        cakupan: p.cakupan || '',
        masa_simpan: p.masa_simpan || '',
        waktu_pengeringan: p.waktu_pengeringan || ''
      }));
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return null;
  }
};

export const saveProducts = async (products: any[]) => {
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    const dbProducts = products.map((p: any) => ({
      id: p.id,
      title: p.title,
      badge: p.badge || '',
      price: p.price,
      old_price: p.oldPrice || p.old_price || '',
      discount: p.discount || '',
      image: p.image,
      images: (p.images || [p.image]).filter((img: string) => img && img.trim() !== ''),
      desc: p.desc || p.description || '',
      tokopedia: p.tokopedia || '',
      shopee: p.shopee || '',
      berat_bersih: p.berat_bersih || '',
      cakupan: p.cakupan || '',
      masa_simpan: p.masa_simpan || '',
      waktu_pengeringan: p.waktu_pengeringan || '',
      updated_at: new Date().toISOString()
    }));
    
    const { error } = await supabase.from('products').upsert(dbProducts);
    if (error) {
      console.error('Supabase query error on upserting products:', error);
      throw error;
    }
  } catch (err) {
    console.error('Failed to save products:', err);
    throw err;
  }
};

export const deleteProductInDb = async (id: string) => {
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product from DB:', error);
      throw error;
    }
  } catch (err) {
    console.error('Failed to delete product:', err);
    throw err;
  }
};

const compressImage = (file: File, maxWidth = 1000, maxHeight = 1000, quality = 0.75): Promise<File> => {
  return new Promise((resolve) => {
    // If not an image, resolve directly
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        
        // Fill white background (useful for transparent PNG backgrounds converted to JPEG)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob and then to file
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };
      
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (file: File): Promise<string | null> => {
  const toBase64 = (f: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(f);
  });

  // Prioritize compressing image before sending to Supabase or Base64 fallback
  let processedFile = file;
  try {
    processedFile = await compressImage(file);
    console.log(`[Image Compressor] Reduced size from ${(file.size / 1024).toFixed(1)}KB to ${(processedFile.size / 1024).toFixed(1)}KB`);
  } catch (compErr) {
    console.warn('[Image Compressor] Failed to compress image, using original file instead.', compErr);
  }

  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured, using Base64 fallback.');
    try {
      return await toBase64(processedFile);
    } catch (e) {
      console.error('Base64 conversion failed:', e);
      return null;
    }
  }

  try {
    const fileExt = processedFile.name.split('.').pop() || 'jpg';
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    console.log('Attempting Supabase upload:', filePath);
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, processedFile);

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      console.warn('Falling back to Base64 due to storage error.');
      return await toBase64(processedFile);
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      console.warn('Could not generate public URL, falling back to Base64.');
      return await toBase64(processedFile);
    }

    return data.publicUrl;
  } catch (err) {
    console.error('Unexpected error during Supabase upload:', err);
    try {
      console.warn('Trying ultimate Base64 fallback after unexpected error.');
      return await toBase64(processedFile);
    } catch (e) {
      console.error('Ultimate Base64 fallback also failed:', e);
      return null;
    }
  }
};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`Error reading from localStorage key "${key}":`, e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e: any) {
      console.warn(`Error writing to localStorage key "${key}":`, e);
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.warn('LocalStorage quota exceeded! Gracefully ignoring to prevent failure.');
      }
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing from localStorage key "${key}":`, e);
    }
  }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn(`Error reading from sessionStorage key "${key}":`, e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.warn(`Error writing to sessionStorage key "${key}":`, e);
    }
  },
  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing from sessionStorage key "${key}":`, e);
    }
  }
};

