import { createClient } from '@supabase/supabase-js';

// Masukkan URL dan Anon Key Anda di sini agar tersimpan secara permanen dan tidak hilang saat reload!
const MY_CUSTOM_URL = 'https://kljjcxkyqffqsphuodcu.supabase.co'; 
const MY_CUSTOM_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsampjeGt5cWZmcXNwaHVvZGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjUyNTAsImV4cCI6MjA5NDE0MTI1MH0.LwNKOedyerLsv0ynQa0nB2OV7_whA1PIXcJbiFPzfC4'; // Contoh: 'eyJhbGciOi...'

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

const customUrl = getLocalStorageOverride('supabase_url') || MY_CUSTOM_URL;
const customKey = getLocalStorageOverride('supabase_anon_key') || MY_CUSTOM_ANON_KEY;

export const isCustomSupabaseConfigured = !!(customUrl && customKey);
export const isDefaultSupabaseActive = !isCustomSupabaseConfigured;

export const supabaseUrl = customUrl || import.meta.env.VITE_SUPABASE_URL || 'https://kljjcxkyqffqsphuodcu.supabase.co';

export const supabaseAnonKey = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsampjeGt5cWZmcXNwaHVvZGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjUyNTAsImV4cCI6MjA5NDE0MTI1MH0.LwNKOedyerLsv0ynQa0nB2OV7_whA1PIXcJbiFPzfC4';

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
  const newLog = {
    id: 'local-' + Math.random().toString(36).substring(2) + '-' + Date.now(),
    page_path: path,
    referrer: document.referrer || 'direct',
    user_agent: navigator.userAgent,
    screen_width: window.innerWidth,
    language: navigator.language,
    created_at: new Date().toISOString()
  };

  // 1. Save locally for instant real-time visualization on preview
  try {
    const localData = safeLocalStorage.getItem('duraphalte_visits');
    const localVisits = localData ? JSON.parse(localData) : [];
    localVisits.unshift(newLog);
    if (localVisits.length > 500) localVisits.pop();
    safeLocalStorage.setItem('duraphalte_visits', JSON.stringify(localVisits));
  } catch (err) {
    console.error('Failed to log visitor locally:', err);
  }

  // 2. Try Supabase
  if (!supabaseUrl || !supabaseAnonKey) return;
  try {
    await supabase
      .from('visitor_logs')
      .insert([
        {
          id: newLog.id,
          page_path: newLog.page_path,
          referrer: newLog.referrer,
          user_agent: newLog.user_agent,
          screen_width: newLog.screen_width,
          language: newLog.language,
          created_at: newLog.created_at
        }
      ]);
  } catch (err) {
    console.warn('Failed to log visitor to Supabase:', err);
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
      return data.map((p: any) => {
        let parsedImages: string[] = [];
        if (p.images) {
          if (Array.isArray(p.images)) {
            parsedImages = p.images;
          } else if (typeof p.images === 'string') {
            try {
              if (p.images.startsWith('{') && p.images.endsWith('}')) {
                const content = p.images.substring(1, p.images.length - 1);
                parsedImages = content ? content.split(',').map(s => s.trim().replace(/^"|"$/g, '')) : [];
              } else {
                const parsed = JSON.parse(p.images);
                if (Array.isArray(parsed)) {
                  parsedImages = parsed;
                }
              }
            } catch (e) {
              parsedImages = p.images.split(',').map((s: string) => s.trim());
            }
          }
        }
        
        const finalImages = parsedImages.filter((img: string) => img && img.trim() !== '');
        
        return {
          id: p.id,
          title: p.title || '',
          badge: p.badge || '',
          price: p.price || '',
          oldPrice: p.old_price || '',
          discount: p.discount || '',
          image: p.image || '',
          images: finalImages.length > 0 ? finalImages : [p.image || ''],
          desc: p.desc || '',
          tokopedia: p.tokopedia || '',
          shopee: p.shopee || '',
          berat_bersih: p.berat_bersih || '',
          cakupan: p.cakupan || '',
          masa_simpan: p.masa_simpan || '',
          waktu_pengeringan: p.waktu_pengeringan || '',
          hidden: p.hidden === true || p.hidden === 'true' || p.hidden === 1 || p.hidden === '1'
        };
      });
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
      hidden: p.hidden || false,
      updated_at: new Date().toISOString()
    }));
    
    const { error } = await supabase.from('products').upsert(dbProducts);
    if (error) {
      console.warn('First upsert attempt failed:', error);
      const errorMessage = error.message || '';
      const errorDetails = error.details || '';
      const isHiddenError = errorMessage.includes('hidden') || errorDetails.includes('hidden');
      
      if (isHiddenError) {
        console.info('Retrying upsert without the "hidden" column...');
        const cleanDbProducts = dbProducts.map(({ hidden, ...rest }: any) => rest);
        const { error: retryError } = await supabase.from('products').upsert(cleanDbProducts);
        if (retryError) {
          console.error('Retry upsert failed:', retryError);
          throw retryError;
        }
      } else {
        throw error;
      }
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

const compressImage = (file: File, maxWidth = 900, maxHeight = 900, quality = 0.65): Promise<File> => {
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

// Quote Requests Table Support
export interface QuoteRequest {
  id?: string;
  name: string;
  email: string;
  quantity: string;
  message?: string;
  created_at?: string;
}

export const loadQuoteRequests = async (): Promise<QuoteRequest[]> => {
  const localData = safeLocalStorage.getItem('duraphalte_quotes');
  const localQuotes: QuoteRequest[] = localData ? JSON.parse(localData) : [];
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return localQuotes;
  }
  
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.warn('Error loading quotes from Supabase (table probably does not exist yet):', error);
      return localQuotes;
    }
    
    // Merge database and local storage safely (deduplicate by id if exists, or combine)
    const dbQuotes = data || [];
    const dbIds = new Set(dbQuotes.map((q: any) => q.id));
    const mergedQuotes = [
      ...dbQuotes,
      ...localQuotes.filter(q => q.id && !dbIds.has(q.id))
    ];
    
    return mergedQuotes.sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    );
  } catch (err) {
    console.error('Failed to load quote requests:', err);
    return localQuotes;
  }
};

export const saveQuoteRequest = async (quote: QuoteRequest): Promise<boolean> => {
  const newQuote: QuoteRequest = {
    id: quote.id || Math.random().toString(36).substring(2) + '-' + Date.now(),
    name: quote.name,
    email: quote.email,
    quantity: quote.quantity,
    message: quote.message || '',
    created_at: quote.created_at || new Date().toISOString()
  };

  // 1. Save to local storage first for resilience
  try {
    const localData = safeLocalStorage.getItem('duraphalte_quotes');
    const localQuotes: QuoteRequest[] = localData ? JSON.parse(localData) : [];
    localQuotes.unshift(newQuote);
    safeLocalStorage.setItem('duraphalte_quotes', JSON.stringify(localQuotes));
  } catch (err) {
    console.error('Failed to save quote locally:', err);
  }

  // 2. Try to save to Supabase
  if (!supabaseUrl || !supabaseAnonKey) {
    return true; // gracefully treat as success offline
  }

  try {
    const { error } = await supabase
      .from('quote_requests')
      .insert([
        {
          id: newQuote.id,
          name: newQuote.name,
          email: newQuote.email,
          quantity: newQuote.quantity,
          message: newQuote.message,
          created_at: newQuote.created_at
        }
      ]);
      
    if (error) {
      console.warn('Could not save quote to Supabase (table probably does not exist yet):', error);
      // We return true because local storage captured it and the UI can proceed normally.
    }
    return true;
  } catch (err) {
    console.error('Failed to insert quote request to database:', err);
    return true; 
  }
};

export const deleteQuoteRequestInDb = async (id: string): Promise<void> => {
  // Delete locally
  try {
    const localData = safeLocalStorage.getItem('duraphalte_quotes');
    if (localData) {
      const localQuotes: QuoteRequest[] = JSON.parse(localData);
      const filtered = localQuotes.filter(q => q.id !== id);
      safeLocalStorage.setItem('duraphalte_quotes', JSON.stringify(filtered));
    }
  } catch (err) {
    console.error('Failed to delete quote locally:', err);
  }

  if (!supabaseUrl || !supabaseAnonKey) return;
  
  try {
    await supabase.from('quote_requests').delete().eq('id', id);
  } catch (err) {
    console.error('Failed to delete quote request in Supabase:', err);
  }
};

