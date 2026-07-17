import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Clock, User, Tag, 
  MessageSquare, Share2, Bookmark, ChevronRight, 
  Search, ArrowRight, Star, Heart, MessageCircle
} from 'lucide-react';

interface BlogPost {
  id: number;
  image: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  content?: string;
  views?: number;
  likes?: number;
}

const BlogPostDetailPage = ({ posts }: { posts: BlogPost[] }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { onQuoteClick } = useOutletContext<{ onQuoteClick: () => void }>();
  
  // Find current post
  const post = posts.find(p => p.id.toString() === id);

  // Likes and Bookmark state for interaction
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (post) {
      setLikesCount(post.likes || Math.floor(Math.random() * 40) + 15);
    }
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Artikel Tidak Ditemukan</h2>
          <p className="text-slate-500 text-sm">
            Artikel yang Anda cari tidak dapat ditemukan atau telah dihapus oleh sistem administrasi kami.
          </p>
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Knowledge Hub
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Reading Time
  const wordCount = post.content ? post.content.split(/\s+/).length : post.excerpt.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Filter out current post to get other related articles
  const relatedPosts = posts.filter(p => p.id !== post.id).slice(0, 2);

  // Parse and render detailed formatted content with premium styles
  const renderFormattedContent = (contentString: string | undefined) => {
    const rawContent = contentString || `Perbaikan jalan berlubang dengan aspal dingin (cold mix asphalt) kini menjadi pilihan utama karena kepraktisan dan kecepatannya. Namun, untuk memastikan hasil perbaikan memiliki daya tahan maksimal seperti aspal konvensional (hot mix), terdapat beberapa langkah teknis penting yang wajib diperhatikan:\n\n1. Persiapan Area Kerja Secara Sempurna\nLangkah krusial pertama adalah membersihkan area lubang. Pastikan tidak ada genangan air, lumpur, pasir, atau sisa dedaunan di dasar lubang. Gunakan sapu keras atau blower udara. Permukaan yang bersih memastikan molekul pengikat Duraphalte Fixit menempel langsung pada material fondasi jalan yang solid.\n\n2. Pemotongan Tepi Lubang (Splicing/Squaring)\nBila memungkinkan, potong tepi lubang secara tegak lurus (berbentuk kotak) menggunakan pemotong aspal atau pahat beton. Sisi lubang yang vertikal akan menahan material aspal dingin dengan lebih kokoh dibanding tepi lubang yang landai atau miring.\n\n3. Pengisian Bertahap untuk Lubang yang Dalam\nJika lubang jalan memiliki kedalaman lebih dari 5 cm, jangan langsung menuangkan aspal sekaligus. Lakukan pengisian secara bertahap setiap ketebalan 2-3 cm, lalu padatkan secara parsial sebelum menuangkan lapisan berikutnya. Hal ini mencegah terjadinya deformasi atau gelombang pada permukaan aspal setelah dilewati kendaraan berat.\n\n4. Pemadatan Maksimal\nSetelah menuangkan lapisan terakhir (berikan sisa tinggi sekitar 1 cm di atas level jalan untuk kompensasi penurunan), lakukan pemadatan menyeluruh. Anda bisa menggunakan alat pemadat tangan (hand stamper), pelat penggetar (vibro plate), atau untuk hasil yang paling efisien, manfaatkan ban kendaraan roda empat untuk melindas permukaan aspal dingin berulang kali.\n\n5. Penguncian dan Penggunaan Pasir Pengisi (Opsional)\nUntuk mencegah kelekatan awal pada ban kendaraan saat baru diaplikasikan, taburkan sedikit pasir halus di atas permukaan aspal yang baru saja dipadatkan. Cara ini mempercepat penyatuan lapisan permukaan dan langsung mengizinkan lalu lintas untuk melintas tanpa merusak tambalan.`;
    
    const blocks = rawContent.split('\n\n');
    
    return blocks.map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;
      
      // Numbered List Headings (e.g., "1. Persiapan Area Kerja Secara Sempurna")
      const matchNumbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (matchNumbered) {
        const num = matchNumbered[1];
        const title = matchNumbered[2];
        return (
          <div key={index} className="space-y-3 mt-10 mb-4 first:mt-4">
            <h3 className="text-xl sm:text-2xl font-black text-[#141d23] flex items-start gap-4">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-700/10 text-blue-700 font-mono text-base font-black shrink-0 shadow-sm border border-blue-700/5">
                {num}
              </span>
              <span className="pt-1 leading-snug">{title}</span>
            </h3>
          </div>
        );
      }
      
      // Category header / sub titles (e.g., "Tantangan Utama:")
      if (trimmed.endsWith(':') && trimmed.length < 50) {
        return (
          <h3 key={index} className="text-xl sm:text-2xl font-black text-[#141d23] mt-10 mb-4 border-l-4 border-blue-700 pl-4 uppercase tracking-tight">
            {trimmed.replace(/:$/, '')}
          </h3>
        );
      }
      
      // Bullet items list
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').filter(item => item.trim().startsWith('- '));
        return (
          <ul key={index} className="space-y-3.5 my-6 pl-2 list-none">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3.5 text-slate-600 leading-relaxed text-base sm:text-lg">
                <span className="w-2 h-2 rounded-full bg-blue-700 mt-2.5 shrink-0" />
                <span>{item.replace(/^-\s+/, '')}</span>
              </li>
            ))}
          </ul>
        );
      }
      
      // Blockquote styling
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return (
          <blockquote key={index} className="my-8 p-6 sm:p-8 bg-blue-50/50 border-l-4 border-blue-700 rounded-r-3xl italic text-[#141d23] text-lg sm:text-xl font-medium leading-relaxed">
            {trimmed}
          </blockquote>
        );
      }
      
      // General paragraph
      return (
        <p key={index} className="text-slate-600 leading-relaxed text-base sm:text-lg mb-6 text-justify">
          {trimmed}
        </p>
      );
    });
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setHasLiked(!hasLiked);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-500">
      {/* Editorial Title Block & Hero Header */}
      <section className="relative bg-[#0d1117] pt-32 pb-20 lg:pt-44 lg:pb-28 px-4 sm:px-8 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px_24px' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/blog" className="hover:text-blue-400 transition-colors">Knowledge Hub</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-blue-400 truncate max-w-[200px] sm:max-w-none">{post.title}</span>
          </div>

          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/35 rounded text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              {post.category}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight text-balance">
              {post.title}
            </h1>

            {/* Author and Date Meta Row */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-6 text-sm text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-700/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-300">Tim Teknis DMK</span>
              </div>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{post.date}</span>
              </div>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{readingTime} Menit Baca</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Action Rail for Sharing and Bookmarking (Desktop view) */}
        <div className="hidden lg:flex lg:col-span-1 lg:flex-col lg:items-center lg:sticky lg:top-36 space-y-6 pt-4">
          <button 
            onClick={handleLike}
            className={`w-12 h-12 rounded-full border flex flex-col items-center justify-center transition-all cursor-pointer ${
              hasLiked ? 'bg-red-50 border-red-200 text-red-500 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
            title="Suka Artikel"
          >
            <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
          </button>
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{likesCount}</span>

          <button 
            onClick={() => setHasBookmarked(!hasBookmarked)}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              hasBookmarked ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
            title="Simpan Artikel"
          >
            <Bookmark className={`w-5 h-5 ${hasBookmarked ? 'fill-current' : ''}`} />
          </button>

          <button 
            onClick={handleShare}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              copied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
            title="Salin Link"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Center: Main Editorial Column */}
        <div className="lg:col-span-7 space-y-8">
          {/* Article Banner Image inside Polaroid card container */}
          <div className="bg-slate-50 border border-slate-200 p-3 sm:p-5 rounded-3xl shadow-xl shadow-slate-100">
            <div className="aspect-[21/10] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-100">
              <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
            </div>
            <p className="text-[10px] text-slate-400 italic mt-3 text-center sm:text-left pl-2">
              Gambar: Publikasi Teknis & Kajian Lapangan Duraphalte Cold Mix Asphalt
            </p>
          </div>

          {/* Render Full Written Content */}
          <div className="prose prose-blue max-w-none pt-4">
            {renderFormattedContent(post.content)}
          </div>

          {/* Social Feedback Bar for Mobile / Smaller screens */}
          <div className="lg:hidden flex items-center justify-between border-y border-slate-100 py-4 my-8">
            <div className="flex items-center gap-6">
              <button 
                onClick={handleLike}
                className="flex items-center gap-2 text-slate-500 font-bold text-sm cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${hasLiked ? 'text-red-500 fill-current' : ''}`} />
                <span>{likesCount} Likes</span>
              </button>
              
              <button 
                onClick={() => setHasBookmarked(!hasBookmarked)}
                className="flex items-center gap-2 text-slate-500 font-bold text-sm cursor-pointer"
              >
                <Bookmark className={`w-5 h-5 ${hasBookmarked ? 'text-blue-600 fill-current' : ''}`} />
                <span>{hasBookmarked ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-slate-500 font-bold text-sm cursor-pointer hover:text-blue-700"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Back button to Hub */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <Link 
              to="/blog"
              className="inline-flex items-center justify-center gap-2 py-4 px-6 border-2 border-[#141d23] text-[#141d23] hover:bg-[#141d23] hover:text-white rounded-xl font-black text-sm transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Knowledge Hub
            </Link>
            
            {copied && (
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest text-center sm:text-right">
                ✓ Tautan Artikel Berhasil Disalin!
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Editorial Sidebar */}
        <aside className="lg:col-span-4 space-y-10 lg:sticky lg:top-36">
          
          {/* Quick Search */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-[#141d23]">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-700" /> Cari Artikel Lain
            </h3>
            <div className="relative">
              <input 
                onClick={() => navigate('/blog')}
                className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer hover:bg-slate-100/50 transition-colors" 
                placeholder="Telusuri topik teknis..." 
                readOnly
              />
            </div>
          </div>

          {/* Related Articles list */}
          {relatedPosts.length > 0 && (
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
              <h3 className="text-lg font-black text-[#141d23] border-b border-slate-200 pb-3">Artikel Terkait</h3>
              <div className="space-y-6">
                {relatedPosts.map((rPost) => (
                  <Link 
                    key={rPost.id}
                    to={`/blog/${rPost.id}`}
                    className="group block space-y-2 text-left"
                  >
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-200 shadow-sm">
                      <img src={rPost.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={rPost.title} />
                    </div>
                    <div className="text-[10px] font-black uppercase text-blue-700 tracking-wider">
                      {rPost.category}
                    </div>
                    <h4 className="font-extrabold text-[#141d23] text-sm group-hover:text-blue-700 leading-snug line-clamp-2 transition-colors">
                      {rPost.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Direct CTA widget */}
          <div className="bg-blue-700 p-8 rounded-[2rem] text-white space-y-6 shadow-xl shadow-blue-700/20 text-left relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px_16px' }}></div>
            
            <div className="space-y-2 relative z-10">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/10 px-2.5 py-1 rounded inline-block">Layanan Kontraktor</span>
              <h3 className="text-2xl font-black leading-tight text-white">Butuh Estimasi Biaya Aspal?</h3>
            </div>
            
            <p className="text-blue-100 text-sm leading-relaxed relative z-10">
              Hubungi tim kami untuk menghitung volume aspal dingin Duraphalte Fixit yang dibutuhkan pada proyek infrastruktur atau kawasan industri Anda.
            </p>
            
            <button 
              onClick={onQuoteClick}
              className="relative z-10 w-full bg-white text-blue-700 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Get Free Quote Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

      </section>
    </div>
  );
};

export default BlogPostDetailPage;
