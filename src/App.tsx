import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  Menu, X, User, ChevronRight, ChevronLeft, 
  Bolt, Timer, TrendingUp, Verified, CheckCircle, ArrowRight, Star,
  Search, Globe, Mail, Play, MessageCircle, Instagram, Video,
  Music, MapPin
} from 'lucide-react';
import { logVisitor, loadSiteContent, loadBlogPosts, loadProducts, safeLocalStorage, saveQuoteRequest } from './lib/supabase';
import AdminPage from './pages/Admin';
import AboutPage from './pages/About';

// --- Types ---
type Page = 'home' | 'products' | 'product-detail' | 'blog';

// --- Components ---

const DMKLogo = ({ className = "w-20 h-20" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Top Left */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }} 
        transition={{ duration: 2, repeat: Infinity, delay: 0.2, ease: "easeInOut" }}
        className="absolute top-[5%] left-[5%] w-[35%] h-[35%] bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20" 
      />
      {/* Top Right (Large) */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }} 
        transition={{ duration: 2, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600 rounded-xl shadow-xl shadow-blue-600/30" 
      />
      {/* Center (Small) */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[25%] bg-blue-700 rounded-md z-10 ring-4 ring-white" 
      />
      {/* Bottom Left */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }} 
        transition={{ duration: 2, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
        className="absolute bottom-[5%] left-[10%] w-[40%] h-[40%] bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20" 
      />
      {/* Bottom Right */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }} 
        transition={{ duration: 2, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
        className="absolute bottom-0 right-[5%] w-[45%] h-[45%] bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20" 
      />
    </div>
  );
};

const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76 6.738 6.738 0 0 1 6.76-6.76c.42-.02.84.03 1.25.12V.02z" />
  </svg>
);

const Navbar = ({ onQuoteClick }: { onQuoteClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About Us', path: '/about' },
    { label: 'Knowledge Hub', path: '/blog' },
  ];

  return (
    <header className={`fixed top-0 w-full z-[100] border-b transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-200 h-16' : 'bg-transparent border-transparent h-20'}`}>
      <div className="flex justify-between items-center h-full px-8 max-w-7xl mx-auto">
        <Link 
          to="/"
          className="flex items-center group"
        >
          <span className="px-3.5 py-1.5 bg-[#006ceb] text-white rounded-lg font-menseal-logo text-xl md:text-2xl select-none leading-none inline-block shadow-sm">
            DURAPHALTE
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="font-menseal-bold transition-all duration-200 text-slate-600 hover:text-blue-600 tracking-wide text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button 
            onClick={onQuoteClick}
            className="bg-blue-700 text-white px-6 py-2.5 font-semibold rounded-lg hover:bg-blue-800 active:scale-95 transition-all duration-200 hidden sm:block"
          >
            Get Quote
          </button>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left font-menseal-bold py-2 text-slate-600 tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-slate-100" />
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onQuoteClick();
                }}
                className="bg-blue-700 text-white px-6 py-3 font-semibold rounded-lg text-center"
              >
                Get Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="w-full pt-20 pb-10 bg-slate-900 text-slate-400 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-8 max-w-7xl mx-auto">
        <div className="md:col-span-4">
          <div className="mb-6">
            <span className="px-3.5 py-1.5 bg-[#006ceb] text-white rounded-lg font-menseal-logo text-xl md:text-2xl select-none leading-none inline-block shadow-sm">
              DURAPHALTE
            </span>
          </div>
          <p className="mb-6 leading-relaxed">
            Pemimpin industri dalam solusi perbaikan aspal instan dan material konstruksi berkinerja tinggi. Part of DMK Group.
          </p>
          <div className="flex gap-5 items-center">
            <a href="https://www.dmkgroup.co.id/" target="_blank" rel="noreferrer" className="transition-all hover:opacity-80 hover:scale-105 active:scale-95" title="Website">
              <img src="https://cdn-icons-png.flaticon.com/512/12890/12890046.png" className="w-8 h-8 object-contain" alt="Website" referrerPolicy="no-referrer" />
            </a>
            <a href="https://instagram.com/dmkaspal" target="_blank" rel="noreferrer" className="transition-all hover:opacity-80 hover:scale-105 active:scale-95" title="Instagram">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" className="w-8 h-8 object-contain" alt="Instagram" referrerPolicy="no-referrer" />
            </a>
            <a href="https://tiktok.com/@kangaspalid" target="_blank" rel="noreferrer" className="transition-all hover:opacity-80 hover:scale-105 active:scale-95" title="TikTok">
              <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" className="w-8 h-8 object-contain" alt="TikTok" referrerPolicy="no-referrer" />
            </a>
          </div>
        </div>
        <div className="md:col-span-2">
          <h4 className="text-white font-bold mb-6">Navigation</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="hover:text-blue-400 transition-all hover:translate-x-1">Home</Link></li>
            <li><Link to="/products" className="hover:text-blue-400 transition-all hover:translate-x-1">Products</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition-all hover:translate-x-1">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-blue-400 transition-all hover:translate-x-1">Knowledge Hub</Link></li>
          </ul>
        </div>
        <div className="md:col-span-6 space-y-4">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Lokasi Kantor Pusat  PT Dhisa Manunggal Karya
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            The Samator Office Tower, Jl. Raya Kedung Baruk No.25-28, Kedung Baruk, Rungkut, Surabaya, East Java 60298
          </p>
          <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-800 shadow-md relative">
            <iframe 
              src="https://maps.google.com/maps?q=The%20Samator%20Office%20Tower%2C%20Surabaya&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer"
              title="Peta Lokasi Kantor Pusat PT DMK & PT WIA"
            ></iframe>
          </div>
          <a 
            href="https://maps.google.com/?q=The+Samator+Office+Tower,+Jl.+Raya+Kedung+Baruk+No.25-28,+Kedung+Baruk,+Rungkut,+Surabaya" 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Buka di Google Maps →</span>
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 DURAPHALTE. All rights reserved.</p>
        <div className="flex gap-6 text-xs font-semibold uppercase tracking-widest opacity-50">
          <span>Certified Quality</span>
          <span>Indonesian Made</span>
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

const HeroCarousel = ({ slides, onCtaClick }: { slides: any[], onCtaClick: () => void }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[500px] lg:h-[580px] flex items-center overflow-hidden bg-slate-900 pt-20 lg:pt-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={slides[currentSlide].image} 
            className="w-full h-full object-cover opacity-100" 
            alt="Hero background"
          />
          {/* Soft overlay to ensure readability against dynamic dark-asphalt background textures */}
          <div className="absolute inset-0 bg-slate-950/50"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            key={`badge-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-slate-100 backdrop-blur-md border border-white/20 font-bold text-xs rounded mb-4 uppercase tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-[#006ceb] animate-pulse"></span>
            {slides[currentSlide].badge}
          </motion.div>
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[42px] font-extrabold text-white mb-4 leading-[1.1] drop-shadow-sm"
          >
            {slides[currentSlide].title.split(" ").map((word, i) => (
              <span key={i} className={(word === "Instan" || word === "Berkualitas") ? "text-[#006ceb]" : ""}>{word} </span>
            ))}
          </motion.h1>
          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-200 mb-6 max-w-xl leading-relaxed drop-shadow-sm"
          >
            {slides[currentSlide].description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button 
              onClick={() => navigate('/products')}
              className="bg-[#006ceb] text-white px-8 py-3.5 font-bold rounded-lg hover:bg-blue-600 hover:shadow-xl transition-all active:scale-95 text-sm"
            >
              Pesan Sekarang
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="border-2 border-white text-white bg-white/5 backdrop-blur-sm px-8 py-3.5 font-bold rounded-lg hover:bg-white hover:text-slate-900 transition-all active:scale-95 text-sm"
            >
              Tentang Kami
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 right-8 z-20 flex gap-2">
        <button onClick={prevSlide} className="p-2.5 bg-white/10 border border-white/20 text-white backdrop-blur-md rounded-full hover:bg-white/20 transition-colors shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextSlide} className="p-2.5 bg-[#006ceb] text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-6 left-8 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${currentSlide === i ? 'w-10 bg-[#006ceb]' : 'w-3.5 bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  );
};

const TestimonialsSection = ({ testimonials }: { testimonials: any[] }) => {
  return (
    <section className="pt-12 pb-8 lg:pt-16 lg:pb-12 bg-white px-4 sm:px-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-4">
          <span className="text-blue-700 font-black uppercase tracking-[0.3em] text-[10px]">Testimonials</span>
          <h2 className="text-3xl lg:text-4xl font-black text-[#141d23]">Apa Kata Rekanan Kami?</h2>
          <div className="w-16 h-1.5 bg-blue-700 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials?.map((t: any, i: number) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative group hover:shadow-xl transition-all"
            >
              <div className="flex text-amber-400 mb-6">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-600 mb-8 italic leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img src={t.avatar} className="w-full h-full object-cover" alt={t.name} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">{t.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{t.role}</p>
                </div>
              </div>
              <div className="absolute top-8 right-8 text-blue-100 group-hover:text-blue-200 transition-colors">
                <MessageCircle size={48} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const QuoteForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Save to database / local management console
      await saveQuoteRequest({ name, email, quantity, message });
      
      // 2. Kirim email di latar belakang ke ask@dmkgroup.co.id secara langsung tanpa melibatkan interaksi client/mail-app
      try {
        await fetch("https://formsubmit.co/ajax/ask@dmkgroup.co.id", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            _subject: `Permintaan Quote Baru - Duraphalte (${name})`,
            "Nama Lengkap": name,
            "Email Perusahaan": email,
            "Estimasi Kebutuhan": quantity,
            "Pesan / Keterangan": message || 'Tidak ada pesan tambahan.',
            _honey: ""
          })
        });
      } catch (emailErr) {
        console.warn("Failed background email transmission:", emailErr);
      }
      
      setIsSuccess(true);
      setName('');
      setEmail('');
      setQuantity('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white text-slate-900 p-8 rounded-3xl text-center shadow-2xl border border-slate-100 max-w-lg mx-auto"
      >
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <p className="text-slate-800 text-lg mb-6 font-bold leading-relaxed">
          Terima kasih! Permintaan Penawaran Anda telah Berhasil Terikirim.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          type="button"
          className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md text-sm"
        >
          Kirim Lagi
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-md border border-white/20">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-left space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-blue-200">Nama Lengkap</label>
          <input 
            type="text"
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white text-slate-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full text-sm placeholder:text-slate-400" 
            placeholder="Contoh: Budi Santoso" 
          />
        </div>
        <div className="text-left space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-blue-200">Email Perusahaan</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-slate-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full text-sm placeholder:text-slate-400" 
            placeholder="n@perusahaan.com" 
          />
        </div>
        <div className="text-left space-y-1">
          <label className="text-[11px] font-black uppercase tracking-wider text-blue-200">Estimasi Kebutuhan</label>
          <input 
            type="text"
            required 
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="bg-white text-slate-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full text-sm placeholder:text-slate-400" 
            placeholder="Jumlah (kg/box/zak)" 
          />
        </div>
      </div>
      
      <div className="text-left space-y-1">
        <label className="text-[11px] font-black uppercase tracking-wider text-blue-200">Pesan / Keterangan Tambahan (Opsional)</label>
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="bg-white text-slate-900 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full text-sm resize-none placeholder:text-slate-400" 
          placeholder="Berikan detail lokasi proyek, jangka waktu, atau kebutuhan perbaikan sasis lainnya..." 
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-white text-blue-700 font-extrabold py-3.5 rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Mengirim Permintaan...
          </>
        ) : (
          <>Dapatkan Quote</>
        )}
      </button>
    </form>
  );
};

const HomePage = ({ content }: { content: any }) => {
  const { onQuoteClick } = useOutletContext<{ onQuoteClick: () => void }>();
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in duration-700">
      <HeroCarousel slides={content.hero} onCtaClick={onQuoteClick} />

      {content.videoSection?.enabled && (
        <section className="py-12 lg:py-16 bg-[#141d23] overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-6 lg:space-y-8">
                <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs">Produk Beraksi</span>
                <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                  {content.videoSection.title}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {content.videoSection.desc}
                </p>
                <button 
                  onClick={() => navigate('/products')}
                  className="inline-flex items-center gap-3 bg-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all active:scale-95 shadow-xl shadow-blue-700/20"
                >
                  Lihat Katalog Produk <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="relative group">
                <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800">
                  {content.videoSection.type === 'youtube' ? (
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${content.videoSection.videoId}?rel=0&showinfo=0&autoplay=1&mute=1&playlist=${content.videoSection.videoId}&loop=1`}
                      title="Video Demonstrasi"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video 
                      src={content.videoSection.url} 
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={content.videoSection.poster}
                    ></video>
                  )}
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-700/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-700/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
          {/* Background Text Overlay */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20rem] font-black text-white/[0.02] pointer-events-none select-none whitespace-nowrap -z-0">
            INDUSTRIAL PERFORMANCE
          </div>
        </section>
      )}

      {content.testimonials && content.testimonials.length > 0 && (
        <TestimonialsSection testimonials={content.testimonials} />
      )}

      <section className="pt-8 pb-10 lg:pt-10 lg:pb-12 bg-white px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-12 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#141d23]">{content.whySection.title}</h2>
            <div className="w-20 h-1.5 bg-blue-700 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {content.whySection.features.map((f: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="p-8 border border-slate-100 rounded-2xl bg-slate-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-6">
                  {i === 0 && <Bolt className="text-blue-700 w-8 h-8" />}
                  {i === 1 && <Timer className="text-blue-700 w-8 h-8" />}
                  {i === 2 && <TrendingUp className="text-blue-700 w-8 h-8" />}
                  {i === 3 && <Verified className="text-blue-700 w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-8 pb-10 lg:pt-10 lg:pb-12 bg-slate-50 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 lg:mb-10 gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#141d23] tracking-tight uppercase italic">Varian Produk Kami</h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md">Pilih kapasitas yang sesuai dengan kebutuhan proyek perbaikan Anda.</p>
            </div>
            <Link to="/products" className="text-blue-700 font-bold flex items-center gap-2 hover:underline text-xs sm:text-sm shrink-0">
              Lihat Semua Spesifikasi <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {(content.products || []).filter((p: any) => !p.hidden).slice(0, 2).map((prod: any) => (
              <div key={prod.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <div className="aspect-[16/10] overflow-hidden">
                  <img 
                    src={prod.image || (prod.images && prod.images.length > 0 ? prod.images[0] : '')} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={prod.title} 
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex justify-between items-center mb-3 gap-2">
                    <h3 className="text-lg md:text-xl font-bold text-[#141d23] tracking-tight">{prod.title}</h3>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-md shrink-0">{prod.badge}</span>
                  </div>
                  <p className="text-slate-500 text-xs sm:text-sm mb-5 leading-relaxed">{prod.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => navigate(`/product/${prod.id}`)}
                      className="py-2.5 md:py-3 border-2 border-[#141d23] text-[#141d23] font-bold rounded-xl hover:bg-[#141d23] hover:text-white transition-all active:scale-95 text-xs"
                    >
                      Detail Produk
                    </button>
                    <button 
                      onClick={() => navigate('/products')}
                      className="py-2.5 md:py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all active:scale-95 text-xs"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-8 pb-10 lg:pt-10 lg:pb-12 bg-white px-4 sm:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <img 
              src={content.innovation.image} 
              className="rounded-3xl shadow-2xl relative z-10 w-full" 
              alt="Innovation" 
            />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 lg:w-48 lg:h-48 bg-blue-100 rounded-full z-0"></div>
          </div>
          <div className="order-1 lg:order-2 space-y-6 lg:space-y-8">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#141d23] leading-tight">{content.innovation.title}</h2>
            <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
              {content.innovation.desc}
            </p>
            <ul className="space-y-4">
              {content.innovation.points.map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-4 group">
                  <CheckCircle className="text-blue-700 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-[#141d23]">{item}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => navigate('/about')}
              className="bg-[#141d23] text-white px-8 py-4 font-bold rounded-xl hover:shadow-xl transition-all active:scale-95"
            >
              Tentang Perusahaan
            </button>
          </div>
        </div>
      </section>

      <section id="quote-section" className="pt-10 pb-12 lg:pt-14 lg:pb-16 bg-blue-700 px-4 sm:px-8 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-extrabold mb-6">Butuh Penawaran untuk Proyek Skala Besar?</h2>
          <p className="text-lg lg:text-xl mb-12 text-blue-100">Kami menyediakan harga khusus wholesale untuk kontraktor, instansi pemerintah, dan pengelola kawasan industri.</p>
          <QuoteForm />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      </section>
    </div>
  );
};

const ProductDetailPage = ({ products }: { products: any[] }) => {
  const { onQuoteClick } = useOutletContext<{ onQuoteClick: () => void }>();
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id) || products[0];

  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.image || (product.images && product.images.length > 0 ? product.images[0] : ''));
    }
  }, [product]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 mt-16 lg:mt-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-32">
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm aspect-square flex items-center justify-center p-6 lg:p-12 group cursor-zoom-in">
            <img 
              src={activeImage || product.image || (product.images && product.images.length > 0 ? product.images[0] : '')} 
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
              alt={product.title} 
            />
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            {(product.images && product.images.length > 0 ? product.images : [product.image])
              .filter((img: string) => img && img.trim() !== '')
              .map((img: string, i: number) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`bg-white border rounded-xl p-1.5 w-16 h-16 sm:w-20 sm:h-20 shrink-0 hover:opacity-100 transition-all cursor-pointer flex items-center justify-center ${
                    activeImage === img ? 'border-blue-600 ring-2 ring-blue-500/20 opacity-100' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover rounded-lg" alt="Thumbnail" />
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-8">
          <nav className="flex items-center gap-2 text-sm font-semibold text-slate-400">
            <Link to="/" className="hover:text-blue-700">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-blue-700">Products</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-700">{product.title}</span>
          </nav>

          <h1 className="text-3xl lg:text-5xl font-black text-[#141d23] leading-tight text-balance">{product.title}</h1>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex text-amber-400">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-slate-500 font-bold text-sm lg:text-base">(1.2k+ Terjual)</span>
          </div>

          <div className="bg-blue-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 space-y-2 border border-blue-100">
            <span className="text-[10px] lg:text-xs font-black text-blue-700 uppercase tracking-[0.2em]">Harga Satuan</span>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl lg:text-4xl font-black text-[#141d23]">Rp {product.price}</span>
              <span className="text-slate-400 line-through text-sm">Rp {product.oldPrice}</span>
              <span className="bg-red-100 text-red-600 text-[10px] px-2 py-1 rounded font-black">SAVE {product.discount}</span>
            </div>
          </div>

          <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
            {product.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <a href={product.tokopedia} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-[#03AC0E] text-white py-4 px-6 rounded-xl font-bold transition-all hover:brightness-95 hover:shadow-lg active:scale-95 text-center">
              Beli di Tokopedia
            </a>
            <a href={product.shopee} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-[#EE4D2D] text-white py-4 px-6 rounded-xl font-bold transition-all hover:brightness-95 hover:shadow-lg active:scale-95 text-center">
              Beli di Shopee
            </a>
            <button 
              onClick={onQuoteClick}
              className="sm:col-span-2 flex items-center justify-center gap-3 bg-blue-700 text-white py-4 px-6 rounded-xl font-bold transition-all hover:bg-blue-800 hover:shadow-lg active:scale-95 text-center"
            >
              Dapatkan Penawaran Khusus (Get Quote)
            </button>
          </div>

          <div className="pt-8 border-t border-slate-200 space-y-8">
            <h3 className="text-2xl font-bold">Spesifikasi Teknis</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {[
                { label: "Berat Bersih", val: product.berat_bersih || (product.id === '5kg' ? "5.0 kg" : "25.0 kg") },
                { label: "Cakupan", val: product.cakupan || (product.id === '5kg' ? "± 0.1m² (tebal 25mm)" : "± 0.5m² (tebal 25mm)") },
                { label: "Masa Simpan", val: product.masa_simpan || "12 Bulan (Tertutup)" },
                { label: "Waktu Pengeringan", val: product.waktu_pengeringan || "Instan (Lalu Lintas Langsung)" }
              ].map((row, i) => (
                <div key={i} className={`flex justify-between p-4 ${i % 2 === 0 ? '' : 'bg-slate-50'}`}>
                  <span className="font-bold text-slate-500">{row.label}</span>
                  <span className="font-bold text-[#141d23]">{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const BlogPage = ({ posts }: { posts: any[] }) => {
  const { onQuoteClick } = useOutletContext<{ onQuoteClick: () => void }>();
  return (
    <div className="animate-in fade-in duration-700 mt-16 lg:mt-20">
      <section className="bg-slate-900 py-16 lg:py-32 px-4 sm:px-8 text-center text-white relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <span className="text-blue-400 font-black tracking-[0.3em] uppercase text-[10px] lg:text-xs">Knowledge Hub</span>
          <h1 className="text-4xl lg:text-7xl font-black leading-tight text-balance">Industrial Insights & Updates</h1>
          <p className="text-base lg:text-xl text-slate-400 max-w-2xl mx-auto">Edukasi, tren teknologi, dan studi kasus terbaru dalam pemeliharaan infrastruktur jalan.</p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="group cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                alert(`Membuka artikel: ${post.title}\n(Halaman detail sedang dalam pengembangan)`);
              }}
            >
              <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-8 shadow-sm">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="News" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-black text-blue-700 uppercase tracking-widest">
                  <span>{post.category}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-slate-400">{post.date}</span>
                </div>
                <h2 className="text-4xl font-extrabold text-[#141d23] group-hover:text-blue-700 transition-colors leading-tight">{post.title}</h2>
                <p className="text-lg text-slate-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-blue-700 font-bold">
                  Selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-[#141d23]">
            <h3 className="text-xl font-extrabold flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-700" /> Cari Artikel
            </h3>
            <div className="relative">
              <input className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-700/20" placeholder="Trending topics..." />
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-8">
            <h3 className="text-xl font-extrabold">Kategori Populer</h3>
            <div className="flex flex-wrap gap-2">
              {['Case Studies', 'Technical Data', 'Safety', 'Sustainability', 'Innovation'].map(tag => (
                <button key={tag} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-blue-700 hover:text-white transition-all uppercase tracking-wider">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-700 p-8 rounded-3xl text-white space-y-6">
            <h3 className="text-xl font-extrabold">Butuh Penawaran?</h3>
            <p className="text-blue-100 text-sm">Konsultasikan kebutuhan aspal Anda dengan tim ahli kami untuk mendapatkan harga wholesale terbaik.</p>
            <button 
              onClick={onQuoteClick}
              className="w-full bg-white text-blue-700 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Get Quote Now
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
};


const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Delay slightly to ensure content is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [pathname, hash]);

  return null;
};

// --- App ---

export default function App() {
  // Initial Content State
  const initialHomeContent = {
    hero: [
      {
        badge: "INDUSTRIAL GRADE TECHNOLOGY",
        title: "Solusi Aspal Dingin Instan Berkualitas Tinggi",
        description: "Duraphalte Fixit menghadirkan teknologi aspal dingin mutakhir untuk perbaikan jalan instan. Dirancang untuk ketahanan maksimal dengan aplikasi tanpa alat berat.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcBpXewE9Sfz8TVcY-jBUJcHusRpZf7ONgj0m-HIkrMcZWDE282bJWzDCis6VS-A4WZSaMGewL28-e25ORTxve5CGJcA1VyfyHpb2oeYg5ueNpTBersRDSKB7-4fMLOdnMba4sH1XQ6fORMqCH1MoKHBk02PJ0P73fKz__YLL6CBgpNoVp1jqjMJgABJwrT_-hJa_YDJYp9FXECwQJdkO5000Fz9Rw2Xje0psKGvP2QrvklG9uHVjt7tZ8JLzi-giIDVlDrRk9BDGR"
      },
      {
        badge: "ULTIMATE DURABILITY",
        title: "Ketahanan Maksimal di Berbagai Cuaca",
        description: "Diformulasikan khusus untuk iklim tropis dengan curah hujan tinggi. Memberikan ikatan permanen yang semakin kuat seiring beban kendaraan.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP4l6nSKUZpFNoPplHoonNEcEiqSv0_2cjTjuP8cWcwFVmg2eyFaZzE8jj002jyrKA6CjbxR5hg-W9UZ_OLrEiKq0rmXM9HGmahdqiNrHZ6lNz4i17Vpd_OKwgcIktHSwnLbrBWJLdWJ-n0KY99OKQeA74UecSwE714q6RCNIQcNnyjSYpe-VBwT-rdKvyVB6fRp8H2KzIjnvPaN0tFGU1ADpJB-6oHhBWAvh050yFGFEZzbSmeqyNucq-dufq4ioOy1WgXV9JiUWx"
      }
    ],
    whySection: {
      title: "Mengapa Duraphalte Fixit?",
      features: [
        { title: "Siap Pakai", desc: "Langsung diaplikasikan tanpa perlu pemanasan atau pencampuran tambahan." },
        { title: "Perbaikan Cepat", desc: "Pengerjaan singkat, meminimalisir gangguan lalu lintas secara signifikan." },
        { title: "Efisien", desc: "Mengurangi biaya operasional karena tidak memerlukan alat berat." },
        { title: "Tahan Lama", desc: "Ketahanan industri yang mampu menahan beban kendaraan berat." }
      ]
    },
    innovation: {
      title: "Inovasi Teknologi Aspal Dingin Untuk Masa Depan",
      desc: "Kami berkomitmen untuk menyediakan material konstruksi yang berkelanjutan and efisien. Duraphalte Fixit bukan sekadar aspal; ini adalah hasil riset mendalam untuk menjawab tantangan pemeliharaan infrastruktur modern.",
      points: [
        "Standar Internasional ISO 9001",
        "Ramah Lingkungan & Rendah Emisi",
        "Didukung oleh Pakar Civil Engineering"
      ],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUFPKM8wXgfbHnVjhJY-cX3iIV6MIhhhtMKYpA5lQb39CyODbAdnEUIDsrVgBjTmZrIPpeLXxqPiI03v3xlL5OLXhZAKnMTFbs5bIlodRWeqs6t95a11gp0_C_j3pI4r_hBgVCjVFhJwKFfXemgQcbZjSD1J0wOGKLtPbaB9lxT4dhIEPUM6y9TTzG5_g_A1DBt53S8uIlvDQ7QYwRhfR5wTVbiAFoDDSRBKfzrAVBx2pGqimMtHgyLuh0-g-PcUBF1tcXPr5RUf4p"
    },
    products: [
      { 
        id: '25kg', 
        title: "Duraphalte Fixit 25kg", 
        badge: "BEST VALUE", 
        price: "185.000",
        oldPrice: "215.000",
        discount: "15%",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9FFAVbnNi4bM_qFtIA9bwgVNVQ68EfH29_PU1DUS6oX1f6vuaDXZL2xisgd4oepFYeGVF5vI3A9Pa2pRvJM19XfW6k-hb3Oaen1OjXrnZZCKKt-TC_LyR9BKpQYofhbkYyyAQPI_0t5Mr1WVWSvpfUAcAkFC-Tu4ZZ5ra4WPuohLGZHj0YcZpHTchqzsM5EXP8ItbfJoQcQ7hXgBLUsWOxJhlZVL-rHnyu-_LfnDbN054gCjq6vFC0rIXzBgnYYYq5-Y7kkhUlSFn",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuC9FFAVbnNi4bM_qFtIA9bwgVNVQ68EfH29_PU1DUS6oX1f6vuaDXZL2xisgd4oepFYeGVF5vI3A9Pa2pRvJM19XfW6k-hb3Oaen1OjXrnZZCKKt-TC_LyR9BKpQYofhbkYyyAQPI_0t5Mr1WVWSvpfUAcAkFC-Tu4ZZ5ra4WPuohLGZHj0YcZpHTchqzsM5EXP8ItbfJoQcQ7hXgBLUsWOxJhlZVL-rHnyu-_LfnDbN054gCjq6vFC0rIXzBgnYYYq5-Y7kkhUlSFn"],
        desc: "Premium Instant Cold Mix Asphalt for heavy-duty road repairs. Diformulasikan khusus untuk iklim tropis Indonesia, memberikan ikatan permanen seketika tanpa perlu pemanasan.",
        tokopedia: "https://tokopedia.com",
        shopee: "https://shopee.co.id"
      },
      { 
        id: '5kg', 
        title: "Duraphalte Fixit 5kg", 
        badge: "COMPACT", 
        price: "45.000",
        oldPrice: "55.000",
        discount: "18%",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtnzJvZletIdbJFNjv_yE1cPMNu1CaqUpZvPQY_yB-6TL_zBOcZYsWYfZDrM5v9CPIZ7MQydDBh62j-I0QhuysPlOAgxNs_r3krnCUBi137GeQCdQgvF0bKcjbnHtF10prfQMG4o2mLOcK16tIslMchcd2UZx5SrzmU9Y3qePZkUJHIb-w-ubfbkkRRoBqzxSuaoQxKKJb6QShmc3Gj42o0M_aY193p4GwbwCndS_ynVwutL-PVmqkVVjT-Ev8MRUcYVjMBoybh5bc",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAtnzJvZletIdbJFNjv_yE1cPMNu1CaqUpZvPQY_yB-6TL_zBOcZYsWYfZDrM5v9CPIZ7MQydDBh62j-I0QhuysPlOAgxNs_r3krnCUBi137GeQCdQgvF0bKcjbnHtF10prfQMG4o2mLOcK16tIslMchcd2UZx5SrzmU9Y3qePZkUJHIb-w-ubfbkkRRoBqzxSuaoQxKKJb6QShmc3Gj42o0M_aY193p4GwbwCndS_ynVwutL-PVmqkVVjT-Ev8MRUcYVjMBoybh5bc"],
        desc: "Sempurna untuk perbaikan retakan kecil atau pemeliharaan area perumahan. Kemasan praktis untuk kebutuhan rumah tangga.",
        tokopedia: "https://tokopedia.com",
        shopee: "https://shopee.co.id"
      }
    ],
    videoSection: {
      enabled: true,
      type: 'youtube', // 'youtube' or 'direct'
      videoId: 'lKWVH6hLHNE', // Default for now
      url: '',
      poster: 'https://picsum.photos/1280/720',
      title: 'Lihat Ketangguhan Duraphalte Fixit di Lapangan',
      desc: 'Saksikan bagaimana tim kami melakukan aplikasi aspal dingin pada proyek perbaikan jalan raya dengan hasil instan dan tahan lama.'
    },
    testimonials: [
      {
        id: 1,
        name: "Bpk. Rahmat",
        role: "Project Manager, PT Indah Karya",
        content: "Duraphalte Fixit sangat membantu perbaikan jalan di kawasan industri kami. Aplikasinya sangat cepat dan tidak memerlukan alat berat, sehingga operasional logistik tidak terganggu.",
        avatar: "https://i.pravatar.cc/150?u=rahmat"
      },
      {
        id: 2,
        name: "Ibu Siti",
        role: "Pengelola Perumahan Green Valley",
        content: "Solusi terbaik untuk lubang jalan di area perumahan. Warga sangat senang karena perbaikan bisa dilakukan sendiri dan hasilnya sangat kuat menahan beban kendaraan.",
        avatar: "https://i.pravatar.cc/150?u=siti"
      },
      {
        id: 3,
        name: "Andi Wijaya",
        role: "Kontraktor Infrastruktur",
        content: "Saya telah mencoba berbagai jenis aspal dingin, tapi Duraphalte Fixit memiliki daya rekat yang luar biasa terutama di kondisi lembap. Sangat direkomendasikan.",
        avatar: "https://i.pravatar.cc/150?u=andi"
      }
    ]
  };

  const initialBlogPosts = [
    {
      id: 1,
      image: "https://picsum.photos/1000/500?random=11",
      category: "TECHNICAL",
      date: "MAY 04, 2026",
      title: "5 Cara Mengoptimalkan Perbaikan Jalan dengan Aspal Dingin",
      excerpt: "Temukan rahasia teknis untuk mendapatkan hasil perbaikan yang paling tahan lama di segala cuaca."
    },
    {
      id: 2,
      image: "https://picsum.photos/1000/500?random=12",
      category: "SAFETY",
      date: "MAY 02, 2026",
      title: "Standar Keselamatan Pekerja Jalan Raya Modern",
      excerpt: "Panduan lengkap mengenai prosedur keselamatan saat melakukan pemeliharaan infrastruktur."
    },
    {
      id: 3,
      image: "https://picsum.photos/1000/500?random=13",
      category: "CASE STUDY",
      date: "APR 28, 2026",
      title: "Implementasi Duraphalte di Kawasan Industri Bekasi",
      excerpt: "Bagaimana aspal dingin kami membantu mempercepat maintenance di jalur logistik tersibuk."
    }
  ];

  const initialAboutContent = {
    hero: {
      badge: "Mengenal Lebih Dekat",
      title: "Solusi Aspal Terpercaya Indonesia",
      desc: "Berdiri sejak 1984, DMK Group telah berevolusi menjadi salah satu pemasok aspal terkemuka di Indonesia, mendukung infrastruktur nasional dengan kualitas tanpa kompromi.",
      bgText: "WHO WE ARE",
      image: ""
    },
    history: {
      badge: "Sejarah Kami",
      title: "PT DHISA MANUNGGAL KARYA",
      content: "DMK Group dimulai dengan berdirinya PT DHISA MANUNGGAL KARYA (DMK) di Surabaya pada tanggal 4 September 1984. Awalnya didirikan sebagai perusahaan kontraktor umum dan transportasi aspal.\n\nDMK Group kini telah berkembang menjadi salah satu pemasok aspal terkemuka di Indonesia. Grup ini saat ini memiliki dan mengoperasikan total 4 Terminal Curah Aspal di Jawa Tengah, Bali, Sumbawa, dan Halmahera serta 1 Polymer Modified Asphalt di Demak, Jawa Tengah.\n\nSelain memasok aspal ke kontraktor lokal untuk jalan nasional, provinsi, dan regional, DMK Group melalui anak perusahaannya PT WANA INDAH ASRI juga mendukung Perusahaan Milik Negara untuk Proyek Jalan Tol dan Landasan Pacu Bandara dengan mengirimkan aspal berkualitas tinggi.",
      image: "/src/assets/images/dmk_asphalt_facility_1779760680117.png",
      experience: "40+",
      video: ""
    },
    visionMission: {
      vision: {
        title: "Visi Kami",
        desc: "Menjadi Penyedia Solusi Aspal Kelas Dunia Pertama di Indonesia dengan Pertumbuhan Penjualan dan Laba Berkelanjutan untuk Mendukung Jaringan Jalan Nasional dan Konstruksi Landasan Pacu.",
        image: ""
      },
      mission: {
        title: "Misi Kami",
        quote: "Jalan Halus di Seluruh Indonesia",
        desc: "Kami ingin membuat perjalanan di jalan menjadi lebih nyaman, transportasi barang lebih murah, dan membuat hidup lebih mudah. Kami berencana untuk mencapainya dengan memastikan jalan-jalan mulus di seluruh Indonesia.",
        image: ""
      }
    },
    banner: {
      title: "Mengaspal Indonesia",
      desc: "Kami memastikan hanya aspal terbaik yang dikirimkan kepada kontraktor agar mereka dapat menyelesaikan proyek konstruksi tanpa meninggalkan masalah.",
      cta: "Hubungi Kami",
      image: ""
    }
  };

  // Persistence Logic
  const [homeContent, setHomeContent] = useState(() => {
    const saved = safeLocalStorage.getItem('duraphalte_content');
    return saved ? JSON.parse(saved) : initialHomeContent;
  });

  const [aboutContent, setAboutContent] = useState(() => {
    const saved = safeLocalStorage.getItem('duraphalte_about');
    return saved ? JSON.parse(saved) : initialAboutContent;
  });

  const [blogPosts, setBlogPosts] = useState(() => {
    const saved = safeLocalStorage.getItem('duraphalte_blog');
    return saved ? JSON.parse(saved) : initialBlogPosts;
  });

  const [loading, setLoading] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    const withTimeout = <T,>(promise: Promise<T>, ms: number, defaultValue: T): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((resolve) => setTimeout(() => resolve(defaultValue), ms))
      ]);
    };

    const fetchData = async () => {
      try {
        // Fetch values concurrently with structured timeout to avoid holding the loading sequence
        const [remoteContent, remoteAbout, remotePosts, remoteProducts] = await Promise.all([
          withTimeout(loadSiteContent('home_main'), 7500, null),
          withTimeout(loadSiteContent('about_main'), 7500, null),
          withTimeout(loadBlogPosts(), 7500, null),
          withTimeout(loadProducts(), 7500, null)
        ]);

        if (remoteContent) {
          setHomeContent((prev: any) => {
            const merged = { ...prev, ...remoteContent };
            if (remoteProducts && remoteProducts.length > 0) {
              merged.products = remoteProducts.map((p: any) => {
                const prevInJson = (remoteContent.products || []).find((oldP: any) => oldP.id === p.id);
                return {
                  ...p,
                  hidden: prevInJson ? prevInJson.hidden === true : (p.hidden === true)
                };
              });
            }
            safeLocalStorage.setItem('duraphalte_content', JSON.stringify(merged));
            return merged;
          });
        } else if (remoteProducts && remoteProducts.length > 0) {
          setHomeContent((prev: any) => {
            const merged = { ...prev, products: remoteProducts };
            safeLocalStorage.setItem('duraphalte_content', JSON.stringify(merged));
            return merged;
          });
        }

        if (remoteAbout) {
          setAboutContent((prev: any) => {
            const merged = { ...prev, ...remoteAbout };
            safeLocalStorage.setItem('duraphalte_about', JSON.stringify(merged));
            return merged;
          });
        }

        if (remotePosts && remotePosts.length > 0) {
          setBlogPosts(remotePosts);
          safeLocalStorage.setItem('duraphalte_blog', JSON.stringify(remotePosts));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-12">
          <DMKLogo className="w-24 h-24" />
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">PT DHISA MANUNGGAL KARYA</h2>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              </div>
              <p className="font-black text-slate-400 uppercase tracking-[0.4em] text-[10px]">Syncing Data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin" element={
          <AdminPage 
            homeContent={homeContent} 
            setHomeContent={(content: any) => {
              setHomeContent(content);
              safeLocalStorage.setItem('duraphalte_content', JSON.stringify(content));
            }}
            aboutContent={aboutContent}
            setAboutContent={(content: any) => {
              setAboutContent(content);
              safeLocalStorage.setItem('duraphalte_about', JSON.stringify(content));
            }}
            blogPosts={blogPosts} 
            setBlogPosts={(posts: any) => {
              setBlogPosts(posts);
              safeLocalStorage.setItem('duraphalte_blog', JSON.stringify(posts));
            }} 
          />
        } />
        <Route path="/" element={<PublicLayout homeContent={homeContent} blogPosts={blogPosts} />}>
          <Route index element={<HomePage content={homeContent} />} />
          <Route path="products" element={<ProductsPage products={(homeContent.products || []).filter((p: any) => !p.hidden)} />} />
          <Route path="product/:id" element={<ProductDetailPage products={homeContent.products} />} />
          <Route path="about" element={<AboutPage content={aboutContent} />} />
          <Route path="blog" element={<BlogPage posts={blogPosts} />} />
          <Route path="*" element={<HomePage content={homeContent} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const ProductsPage = ({ products }: { products: any[] }) => {
  const { onQuoteClick } = useOutletContext<{ onQuoteClick: () => void }>();
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Safe reset of page if items per page or products list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, products.length]);

  const totalProducts = products.length;
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="pt-24 lg:pt-32 pb-16 lg:pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12 lg:space-y-20">
       <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-black text-[#141d23] leading-tight">Our Industrial Catalog</h1>
          <p className="text-base lg:text-lg text-slate-500 max-w-2xl mx-auto">High-performance material solutions engineered for the most demanding civil engineering environments.</p>
       </div>

       {/* Control Section: Selection Filter for Items Limit */}
       <div className="flex flex-col sm:flex-row sm:justify-between items-center bg-slate-50 p-4 sm:p-6 rounded-3xl gap-4 border border-slate-100 shadow-sm">
         <div className="text-sm font-semibold text-slate-500">
           Menampilkan <span className="text-[#141d23] font-black">{totalProducts > 0 ? indexOfFirstProduct + 1 : 0}-{Math.min(indexOfLastProduct, totalProducts)}</span> dari <span className="text-[#141d23] font-black">{totalProducts}</span> Produk
         </div>
         <div className="flex items-center gap-3">
           <label htmlFor="items-per-page-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
             Tampilkan per halaman:
           </label>
           <div className="relative">
             <select
               id="items-per-page-select"
               value={itemsPerPage}
               onChange={(e) => setItemsPerPage(Number(e.target.value))}
               className="appearance-none bg-white border border-slate-200 text-[#141d23] font-bold text-sm px-4 py-2 pr-10 rounded-xl focus:border-blue-500 focus:outline-none transition-all cursor-pointer shadow-sm hover:bg-slate-50/50"
             >
               <option value={6}>6 Produk (Max 6)</option>
               <option value={10}>10 Produk</option>
               <option value={15}>15 Produk</option>
               <option value={20}>20 Produk</option>
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                 <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
               </svg>
             </div>
           </div>
         </div>
       </div>

       {/* Products Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {currentProducts.map((prod: any) => (
            <div key={prod.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all">
              <div 
                className="aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-8 cursor-pointer"
                onClick={() => navigate(`/product/${prod.id}`)}
              >
                <img 
                  src={prod.image || (prod.images && prod.images.length > 0 ? prod.images[0] : '')} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                  alt={prod.title} 
                />
              </div>
              <div className="p-8 space-y-4">
                <span className="text-blue-700 text-xs font-black uppercase tracking-[0.2em]">{prod.badge}</span>
                <h3 className="text-xl font-bold">{prod.title}</h3>
                <div className="space-y-4">
                  <div className="text-2xl font-black text-[#141d23]">Rp {prod.price}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <a 
                      href={prod.tokopedia} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-[#03AC0E] text-white py-2.5 rounded-xl font-bold text-[10px] uppercase text-center flex items-center justify-center hover:brightness-95 transition-all"
                    >
                      Tokopedia
                    </a>
                    <a 
                      href={prod.shopee} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-[#EE4D2D] text-white py-2.5 rounded-xl font-bold text-[10px] uppercase text-center flex items-center justify-center hover:brightness-95 transition-all"
                    >
                      Shopee
                    </a>
                  </div>
                  <button 
                    onClick={() => navigate(`/product/${prod.id}`)}
                    className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    Selengkapnya <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
       </div>

       {/* Pagination Control UI */}
       {totalPages > 1 && (
         <div className="flex justify-center items-center gap-2 pt-6">
           <button
             onClick={handlePrevPage}
             disabled={currentPage === 1}
             className="p-3 bg-white hover:bg-slate-50 text-[#141d23] border border-slate-200 rounded-xl font-bold transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center gap-1.5"
           >
             <ChevronLeft size={16} />
             <span className="hidden sm:inline text-xs uppercase tracking-wider">Sebelumnya</span>
           </button>
           
           <div className="flex items-center gap-1.5">
             {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
               <button
                 key={pageNum}
                 onClick={() => setCurrentPage(pageNum)}
                 className={`w-11 h-11 rounded-xl font-bold text-sm transition-all shadow-sm ${
                   currentPage === pageNum
                     ? 'bg-blue-700 text-white'
                     : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                 }`}
               >
                 {pageNum}
               </button>
             ))}
           </div>

           <button
             onClick={handleNextPage}
             disabled={currentPage === totalPages}
             className="p-3 bg-white hover:bg-slate-50 text-[#141d23] border border-slate-200 rounded-xl font-bold transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center gap-1.5"
           >
             <span className="hidden sm:inline text-xs uppercase tracking-wider">Selanjutnya</span>
             <ChevronRight size={16} />
           </button>
         </div>
       )}

       <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-16 text-center space-y-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-black text-white">Butuh Solusi Custom?</h2>
            <p className="text-slate-400 text-lg mt-4">Tim kami siap membantu menghitung estimasi kebutuhan aspal untuk proyek infrastruktur Anda.</p>
            <button 
              onClick={onQuoteClick}
              className="mt-8 bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 active:scale-95"
            >
              Hubungi Tim Teknis Kami
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
       </div>
    </div>
  );
};

const WhatsAppFloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const salesChannels = [
    {
      region: "Admin Support",
      phone: "+62 812-2916-6263",
      url: "https://wa.me/6281229166263?text=Halo%20Admin%20Support%20DURAPHALTE%2C%20saya%20tertarik%20dengan%20produk%20Duraphalte%20dan%20ingin%20konsultasi.",
    },
    {
      region: "Wilayah Sidoarjo",
      phone: "+62 811-3010-3689",
      url: "https://wa.me/6281130103689?text=Halo%20Sales%20DURAPHALTE%20Wilayah%20Sidoarjo%2C%20saya%20tertarik%20dengan%20produk%20Duraphalte%20dan%20ingin%20konsultasi.",
    },
    {
      region: "Wilayah Jatim",
      phone: "+62 811-301-3945",
      url: "https://wa.me/628113013945?text=Halo%20Sales%20DURAPHALTE%20Wilayah%20Jatim%2C%20saya%20tertarik%20dengan%20produk%20Duraphalte%20dan%20ingin%20konsultasi.",
    },
    {
      region: "Wilayah Jateng",
      phone: "+62 811-3078-8002",
      url: "https://wa.me/6281130788002?text=Halo%20Sales%20DURAPHALTE%20Wilayah%20Jateng%2C%20saya%20tertarik%20dengan%20produk%20Duraphalte%20dan%20ingin%20konsultasi.",
    },
    {
      region: "Wilayah Bali",
      phone: "+62 811-3012-1178",
      url: "https://wa.me/6281130121178?text=Halo%20Sales%20DURAPHALTE%20Wilayah%20Bali%2C%20saya%20tertarik%20dengan%20produk%20Duraphalte%20dan%20ingin%20konsultasi.",
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Popover / Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-76 sm:w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#141d23] text-white p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366] rounded-full blur-3xl opacity-20 pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h4 className="font-menseal text-base tracking-wide uppercase text-white">WhatsApp Sales</h4>
                  <p className="text-[10px] uppercase font-black text-[#25D366] tracking-widest mt-1">DURAPHALTE INDONESIA</p>
                  <p className="text-xs text-slate-300 mt-2">Selamat datang! Silakan pilih layanan sales wilayah terdekat Anda:</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                  aria-label="Tutup"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="p-4 max-h-[380px] overflow-y-auto space-y-3 bg-slate-50/50">
              {salesChannels.map((chan, idx) => (
                <a
                  key={idx}
                  href={chan.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-md group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all">
                      <svg 
                        viewBox="0 0 24 24" 
                        className="w-5 h-5 fill-current" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-700 group-hover:text-blue-700 transition-colors">{chan.region}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">{chan.phone}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </a>
              ))}
            </div>
            
            {/* Footer helper */}
            <div className="p-3 text-center bg-slate-100 border-t border-slate-150 text-[10px] text-slate-500 font-medium">
              Senin - Sabtu (Jam Operasional Kerja)
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <div className="flex items-center gap-2">
        {/* Helper Tooltip label popup - Elegant, Small, and Less Obtrusive */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex bg-white/95 backdrop-blur-sm text-slate-800 hover:text-blue-700 hover:bg-white shadow-md px-3 py-1.5 rounded-full text-[10px] font-extrabold items-center gap-1.5 select-none hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-150 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse shrink-0" />
            <span className="tracking-wider font-menseal-bold uppercase">
              Tanya Sales WA
            </span>
          </button>
        )}

        {/* Real Button wrapper - Slightly more compact */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-white transition-all shadow-lg relative group cursor-pointer ${
            isOpen ? 'bg-slate-800 rotate-90 scale-95' : 'bg-[#25D366] hover:bg-[#128C7E] hover:scale-105 active:scale-95'
          }`}
          title="Hubungi Sales WhatsApp"
        >
          {/* Animated Pulsing Ring */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-25 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X size={18} className="text-white" />
          ) : (
            <svg 
              viewBox="0 0 24 24" 
              className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

const PublicLayout = ({ homeContent, blogPosts }: { homeContent: any, blogPosts: any[] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    logVisitor(window.location.pathname);
  }, [window.location.pathname]);

  const handleQuoteClick = () => {
    const element = document.getElementById('quote-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#quote-section');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onQuoteClick={handleQuoteClick} />
      <main className="flex-1">
        <Outlet context={{ onQuoteClick: handleQuoteClick }} />
      </main>
      <Footer />
      <WhatsAppFloatingWidget />
    </div>
  );
};
