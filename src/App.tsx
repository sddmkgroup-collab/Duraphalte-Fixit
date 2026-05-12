import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, User, ChevronRight, ChevronLeft, 
  Bolt, Timer, TrendingUp, Verified, CheckCircle, ArrowRight, Star,
  Search, Globe, Phone, Mail
} from 'lucide-react';
import { logVisitor } from './lib/supabase';
import AdminPage from './pages/Admin';

// --- Types ---
type Page = 'home' | 'products' | 'product-detail' | 'blog';

// --- Components ---

const Navbar = () => {
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
    { label: 'Knowledge Hub', path: '/blog' },
  ];

  return (
    <header className={`fixed top-0 w-full z-[100] border-b transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-200 h-16' : 'bg-transparent border-transparent h-20'}`}>
      <div className="flex justify-between items-center h-full px-8 max-w-7xl mx-auto">
        <Link 
          to="/"
          className="text-xl font-black tracking-tighter text-blue-700 cursor-pointer"
        >
          Duraphalte Fixit
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="font-medium transition-all duration-200 text-slate-600 hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button className="bg-[#004497] text-white px-6 py-2.5 font-semibold rounded-lg hover:bg-blue-800 active:scale-95 transition-all duration-200 hidden sm:block">
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
                  className="text-left font-medium py-2 text-slate-600"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-slate-100" />
              <button className="bg-[#004497] text-white px-6 py-3 font-semibold rounded-lg text-center">
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
    <footer className="w-full pt-20 pb-10 bg-slate-900 text-slate-400 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto">
        <div>
          <div className="text-2xl font-black text-white mb-6">Duraphalte Fixit</div>
          <p className="mb-6 leading-relaxed">
            Pemimpin industri dalam solusi perbaikan aspal instan dan material konstruksi berkinerja tinggi.
          </p>
          <div className="flex gap-4">
            <Globe className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
            <Mail className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
            <Phone className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Navigation</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="hover:text-blue-400 transition-all hover:translate-x-1">Home</Link></li>
            <li><Link to="/products" className="hover:text-blue-400 transition-all hover:translate-x-1">Products</Link></li>
            <li><Link to="/blog" className="hover:text-blue-400 transition-all hover:translate-x-1">Knowledge Hub</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Technical Data</h4>
          <ul className="space-y-4">
            <li><Link to="/blog" className="hover:text-blue-400 transition-all hover:translate-x-1">Specification Sheets</Link></li>
            <li><Link to="/blog" className="hover:text-blue-400 transition-all hover:translate-x-1">Application Guide</Link></li>
            <li><Link to="/blog" className="hover:text-blue-400 transition-all hover:translate-x-1">Testing Reports</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4">
            <li><button className="hover:text-blue-400 transition-all hover:translate-x-1 text-left">Privacy Policy</button></li>
            <li><button className="hover:text-blue-400 transition-all hover:translate-x-1 text-left">Terms of Service</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2024 Duraphalte Fixit Industrial. All rights reserved.</p>
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[600px] lg:h-[800px] flex items-center overflow-hidden bg-slate-50 pt-20 lg:pt-0">
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
            className="w-full h-full object-cover opacity-30" 
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            key={`badge-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-700 font-bold text-xs rounded mb-6 uppercase tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-blue-700 animate-pulse"></span>
            {slides[currentSlide].badge}
          </motion.div>
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#141d23] mb-6 leading-[1.1]"
          >
            {slides[currentSlide].title.split(" ").map((word, i) => (
              <span key={i} className={word === "Instan" ? "text-blue-700" : ""}>{word} </span>
            ))}
          </motion.h1>
          <motion.p
            key={`desc-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed"
          >
            {slides[currentSlide].description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={onCtaClick}
              className="bg-[#004497] text-white px-8 py-4 font-bold rounded-lg hover:shadow-xl transition-all active:scale-95"
            >
              Beli Sekarang
            </button>
            <button className="border-2 border-[#141d23] text-[#141d23] px-8 py-4 font-bold rounded-lg hover:bg-[#141d23] hover:text-white transition-all active:scale-95">
              Pelajari Produk
            </button>
          </motion.div>
        </div>
        <div className="relative hidden lg:block">
           <motion.div
             key={`img-${currentSlide}`}
             initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
             animate={{ opacity: 1, scale: 1, rotate: 0 }}
             className="relative z-10 w-full aspect-square md:aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
           >
             <img src={slides[currentSlide].image} className="w-full h-full object-cover" alt="Banner" />
           </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 right-8 z-20 flex gap-2">
        <button onClick={prevSlide} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="p-3 bg-[#004497] text-white rounded-full hover:bg-blue-800 transition-colors shadow-lg">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-10 left-8 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-300 rounded-full ${currentSlide === i ? 'w-12 bg-blue-700' : 'w-4 bg-slate-300'}`}
          />
        ))}
      </div>
    </section>
  );
};

const HomePage = ({ content }: { content: any }) => {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in duration-700">
      <HeroCarousel slides={content.hero} onCtaClick={() => navigate('/products')} />

      <section className="py-16 lg:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#141d23]">{content.whySection.title}</h2>
            <div className="w-20 h-1.5 bg-blue-700 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {content.whySection.features.map((f: any, i: number) => (
              <div key={i} className="p-8 border border-slate-100 rounded-2xl bg-slate-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="mb-6">
                  {i === 0 && <Bolt className="text-blue-700 w-8 h-8" />}
                  {i === 1 && <Timer className="text-blue-700 w-8 h-8" />}
                  {i === 2 && <TrendingUp className="text-blue-700 w-8 h-8" />}
                  {i === 3 && <Verified className="text-blue-700 w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-slate-50 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 lg:mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#141d23]">Varian Produk Kami</h2>
              <p className="text-slate-600 text-base lg:text-lg max-w-lg">Pilih kapasitas yang sesuai dengan kebutuhan proyek perbaikan Anda.</p>
            </div>
            <Link to="/products" className="text-blue-700 font-bold flex items-center gap-2 hover:underline">
              Lihat Semua Spesifikasi <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {content.products.map((prod: any) => (
              <div key={prod.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                <div className="aspect-video overflow-hidden">
                  <img src={prod.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={prod.title} />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">{prod.title}</h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">{prod.badge}</span>
                  </div>
                  <p className="text-slate-600 mb-8">{prod.desc}</p>
                  <button 
                    onClick={() => navigate(`/product/${prod.id}`)}
                    className="w-full py-4 border-2 border-blue-700 text-blue-700 font-bold rounded-xl group-hover:bg-blue-700 group-hover:text-white transition-all active:scale-95"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white px-4 sm:px-8 overflow-hidden">
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
            <button className="bg-[#141d23] text-white px-8 py-4 font-bold rounded-xl hover:shadow-xl transition-all active:scale-95">
              Tentang Perusahaan
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-blue-700 px-4 sm:px-8 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-extrabold mb-6">Butuh Penawaran untuk Proyek Skala Besar?</h2>
          <p className="text-lg lg:text-xl mb-12 text-blue-100">Kami menyediakan harga khusus wholesale untuk kontraktor, instansi pemerintah, dan pengelola kawasan industri.</p>
          <div className="bg-white/10 p-6 lg:p-8 rounded-3xl backdrop-blur-md border border-white/20">
            <form 
              className="grid grid-cols-1 md:grid-cols-4 gap-4" 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name');
                const email = formData.get('email');
                const quantity = formData.get('quantity');

                const subject = encodeURIComponent(`Permintaan Penawaran: Duraphalte Fixit - ${name}`);
                const body = encodeURIComponent(
                  `Halo Admin Duraphalte Fixit,\n\n` +
                  `Saya tertarik untuk mendapatkan penawaran harga khusus untuk proyek saya.\n\n` +
                  `Detail Informasi:\n` +
                  `- Nama Lengkap: ${name}\n` +
                  `- Email Perusahaan: ${email}\n` +
                  `- Estimasi Kebutuhan (Jumlah): ${quantity}\n\n` +
                  `Mohon kirimkan draf penawaran atau hubungi saya kembali untuk diskusi lebih lanjut.\n\n` +
                  `Terima kasih.`
                );

                window.location.href = `mailto:hansen@dmkgroup.co.id?subject=${subject}&body=${body}`;
              }}
            >
              <input name="name" required className="bg-white text-slate-900 px-6 py-4 rounded-xl focus:ring-2 focus:ring-white outline-none w-full" placeholder="Nama Lengkap" />
              <input name="email" type="email" required className="bg-white text-slate-900 px-6 py-4 rounded-xl focus:ring-2 focus:ring-white outline-none w-full" placeholder="Email Perusahaan" />
              <input name="quantity" required className="bg-white text-slate-900 px-6 py-4 rounded-xl focus:ring-2 focus:ring-white outline-none w-full" placeholder="Jumlah (kg/box)" />
              <button type="submit" className="bg-white text-blue-700 font-bold py-4 rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-lg w-full">
                Dapatkan Quote
              </button>
            </form>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      </section>
    </div>
  );
};

const ProductDetailPage = ({ products }: { products: any[] }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id) || products[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 mt-16 lg:mt-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-32">
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm aspect-square flex items-center justify-center p-6 lg:p-12 group cursor-zoom-in">
            <img 
              src={product.image} 
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
              alt={product.title} 
            />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-2 aspect-square opacity-60 hover:opacity-100 transition-all cursor-pointer">
                <img src={product.image} className="w-full h-full object-cover rounded-lg" alt="Thumbnail" />
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
          </div>

          <div className="pt-8 border-t border-slate-200 space-y-8">
            <h3 className="text-2xl font-bold">Spesifikasi Teknis</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {[
                { label: "Berat Bersih", val: "25.0 kg" },
                { label: "Cakupan", val: "± 0.5m² (tebal 25mm)" },
                { label: "Masa Simpan", val: "12 Bulan (Tertutup)" },
                { label: "Waktu Pengeringan", val: "Instan (Lalu Lintas Langsung)" }
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
            <article key={post.id} className="group cursor-pointer">
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
        </aside>
      </section>
    </div>
  );
};

// --- Auth & Security ---

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simplified Login for ease of use as requested
    // Preset: admin@duraphalte.id / duraphalte2024
    if (email === 'admin@duraphalte.id' && password === 'duraphalte2024') {
      onLogin();
    } else {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-700 rounded-2xl mb-6 shadow-xl shadow-blue-700/20">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 font-medium mt-2">Access for industrial management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Authorized Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="admin@duraphalte.id"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">System Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            className="w-full py-5 bg-blue-700 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-700/20"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminDashboard = ({ setPage, onLogout, homeContent, setHomeContent, blogPosts, setBlogPosts }: { 
  setPage: (p: Page) => void, 
  onLogout: () => void,
  homeContent: any, 
  setHomeContent: any, 
  blogPosts: any[], 
  setBlogPosts: any 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<AdminView | 'analytics'>('dashboard');
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeView === 'analytics') {
      fetchAnalytics();
    }
  }, [activeView]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visitor_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAnalytics(data || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHomeUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedContent = {
      ...homeContent,
      hero: [
        { 
          ...homeContent.hero[0], 
          title: formData.get('hero0_title') as string, 
          description: formData.get('hero0_desc') as string,
          image: formData.get('hero0_image') as string 
        },
        { 
          ...homeContent.hero[1], 
          title: formData.get('hero1_title') as string, 
          description: formData.get('hero1_desc') as string,
          image: formData.get('hero1_image') as string 
        },
      ],
      innovation: {
        ...homeContent.innovation,
        title: formData.get('innov_title') as string,
        desc: formData.get('innov_desc') as string,
        image: formData.get('innov_image') as string
      },
      products: homeContent.products.map((prod: any, i: number) => ({
        ...prod,
        title: formData.get(`prod${i}_title`) as string,
        desc: formData.get(`prod${i}_desc`) as string,
        price: formData.get(`prod${i}_price`) as string,
        oldPrice: formData.get(`prod${i}_oldPrice`) as string,
        image: formData.get(`prod${i}_image`) as string,
        tokopedia: formData.get(`prod${i}_tokopedia`) as string,
        shopee: formData.get(`prod${i}_shopee`) as string,
      }))
    };
    setHomeContent(updatedContent);
    alert("Semua Konten Berhasil Diperbarui!");
  };

  const handleBlogDelete = (id: number) => {
    setBlogPosts(blogPosts.filter(p => p.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 animate-in fade-in duration-500 relative">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 border-r border-slate-200 bg-white flex flex-col z-[70] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 border-b border-slate-100 mb-6 flex justify-between items-center">
          <div>
            <div className="text-xl font-black text-blue-700 tracking-tighter">Duraphalte FIXIT</div>
            <div className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-[0.2em]">Management Console</div>
          </div>
          <button className="lg:hidden p-2 text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
            { id: 'editor', icon: <Edit2 className="w-4 h-4" />, label: "Content Editor" },
            { id: 'analytics', icon: <BarChart className="w-4 h-4" />, label: "Analytics" },
            { id: 'settings', icon: <Settings className="w-4 h-4" />, label: "Settings" }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeView === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all mt-4"
          >
            <X className="w-4 h-4" /> Sign Out Session
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setPage('home')}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 font-bold text-sm"
          >
            <LogOut className="w-4 h-4" /> Exit to Website
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-6 lg:p-12 w-full max-w-full overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900">
                {activeView === 'dashboard' ? 'Dashboard Overview' : 
                 activeView === 'analytics' ? 'Visitor Analytics' : 'Content Management'}
              </h1>
              <p className="text-slate-500 font-medium text-sm lg:text-base">Duraphalte Fixit Industrial Portal</p>
            </div>
          </div>
        </header>

        {activeView === 'dashboard' && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
              {[
                { label: "Active Products", val: "148", trend: "+3 this month", color: "bg-blue-700", textColor: "text-white" },
                { label: "Total Visits", val: "24.5k", trend: "8% up", color: "bg-white", textColor: "text-slate-900" },
                { label: "SEO Health", val: "94%", trend: "Optimized", color: "bg-white", textColor: "text-slate-900" }
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-40 lg:h-48 group hover:shadow-xl transition-all`}>
                  <div>
                    <div className={`text-[10px] lg:text-xs font-black uppercase tracking-widest opacity-60 ${stat.textColor}`}>{stat.label}</div>
                    <div className={`text-3xl lg:text-4xl font-black mt-2 ${stat.textColor}`}>{stat.val}</div>
                  </div>
                  <div className={`text-[11px] font-bold ${stat.textColor} opacity-80 flex items-center gap-1`}>
                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                  </div>
                </div>
              ))}
            </section>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-lg lg:text-xl font-extrabold">Recent Content Updates</h2>
                 <button className="text-blue-700 font-bold text-sm hover:underline flex items-center gap-1">
                   <Plus className="w-4 h-4" /> <span className="hidden xs:inline">Add New</span>
                 </button>
              </div>
              <div className="divide-y divide-slate-50">
                {blogPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-4 lg:p-6 flex items-center gap-4 lg:gap-6 group hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-10 lg:w-16 lg:h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img src={post.image} className="w-full h-full object-cover" alt="Thumb" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm lg:text-base truncate">{post.title}</h4>
                      <p className="text-[10px] lg:text-xs text-slate-400 font-medium uppercase tracking-widest">{post.category} • {post.date}</p>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <button className="p-1.5 lg:p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-700 transition-all border border-transparent hover:border-slate-200"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleBlogDelete(post.id)} className="p-1.5 lg:p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-slate-200"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Eye className="w-4 h-4 text-blue-700" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Total Page Views</span>
                </div>
                <div className="text-3xl font-black">{analytics.length}</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Unique Browsers</span>
                </div>
                <div className="text-3xl font-black">{new Set(analytics.map(l => l.user_agent)).size}</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Top Language</span>
                </div>
                <div className="text-xl font-black truncate">{analytics[0]?.language || '-'}</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Last Activity</span>
                </div>
                <div className="text-sm font-black">{analytics[0] ? new Date(analytics[0].created_at).toLocaleTimeString() : '-'}</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-lg lg:text-xl font-extrabold">Detailed Visitor Logs</h2>
                <button 
                  onClick={fetchAnalytics}
                  className="p-2 hover:bg-slate-50 rounded-lg text-blue-700 transition-all border border-slate-200"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Page Path</th>
                      <th className="px-6 py-4">Referrer</th>
                      <th className="px-6 py-4">Device/Browser</th>
                      <th className="px-6 py-4">Screen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold">Fetching latest data...</td></tr>
                    ) : analytics.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold">No visitor data yet.</td></tr>
                    ) : (
                      analytics.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">
                            {new Date(log.created_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: 'short' })}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-black">{log.page_path}</span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 truncate max-w-[200px]">{log.referrer}</td>
                          <td className="px-6 py-4 text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{log.user_agent}</td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">{log.screen_width}px</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {activeView === 'editor' && (
          <div className="space-y-12">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-700" />
                Edit Website Content
              </h2>
              <form onSubmit={handleHomeUpdate} className="space-y-12">
                {/* Hero Section */}
                <div className="space-y-8">
                  <h3 className="text-xl font-bold border-b border-slate-100 pb-4">Hero Slides</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {homeContent.hero.map((slide: any, i: number) => (
                      <div key={i} className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="font-black text-blue-700 uppercase tracking-widest text-xs">Slide {i + 1}</h4>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Title</label>
                          <input name={`hero${i}_title`} defaultValue={slide.title} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Description</label>
                          <textarea name={`hero${i}_desc`} defaultValue={slide.description} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm h-24" />
                        </div>
                        <ImageUpload 
                          label="Background Image" 
                          currentImage={slide.image} 
                          onImageChange={(base64) => {
                            const newHero = [...homeContent.hero];
                            newHero[i].image = base64;
                            setHomeContent({ ...homeContent, hero: newHero });
                          }} 
                        />
                        {/* Hidden input to keep value in formData if needed, but we update state directly */}
                        <input type="hidden" name={`hero${i}_image`} value={slide.image} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Innovation Section */}
                <div className="space-y-8 pt-8 border-t border-slate-100">
                   <h3 className="text-xl font-bold border-b border-slate-100 pb-4">Innovation Section</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Section Title</label>
                          <input name="innov_title" defaultValue={homeContent.innovation.title} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Description</label>
                          <textarea name="innov_desc" defaultValue={homeContent.innovation.desc} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm h-32" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <ImageUpload 
                          label="Innovation Image" 
                          currentImage={homeContent.innovation.image} 
                          onImageChange={(base64) => setHomeContent({ 
                            ...homeContent, 
                            innovation: { ...homeContent.innovation, image: base64 } 
                          })} 
                        />
                        <input type="hidden" name="innov_image" value={homeContent.innovation.image} />
                      </div>
                   </div>
                </div>

                {/* Products Section */}
                <div className="space-y-8 pt-8 border-t border-slate-100">
                   <h3 className="text-xl font-bold border-b border-slate-100 pb-4">Products Catalog</h3>
                   <div className="grid grid-cols-1 gap-8">
                    {homeContent.products.map((prod: any, i: number) => (
                      <div key={prod.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                        <div className="flex justify-between items-center">
                           <h4 className="font-black text-blue-700 uppercase tracking-widest text-xs">Product: {prod.id}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Product Name</label>
                              <input name={`prod${i}_title`} defaultValue={prod.title} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Description</label>
                              <textarea name={`prod${i}_desc`} defaultValue={prod.desc} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm h-24" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Current Price</label>
                                <input name={`prod${i}_price`} defaultValue={prod.price} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Old Price</label>
                                <input name={`prod${i}_oldPrice`} defaultValue={prod.oldPrice} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm" />
                              </div>
                            </div>
                            <ImageUpload 
                              label="Product Image" 
                              currentImage={prod.image} 
                              onImageChange={(base64) => {
                                const newProds = [...homeContent.products];
                                newProds[i].image = base64;
                                setHomeContent({ ...homeContent, products: newProds });
                              }}
                            />
                            <input type="hidden" name={`prod${i}_image`} value={prod.image} />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Tokopedia Link</label>
                              <input name={`prod${i}_tokopedia`} defaultValue={prod.tokopedia} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Shopee Link</label>
                              <input name={`prod${i}_shopee`} defaultValue={prod.shopee} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                   </div>
                </div>

                <div className="sticky bottom-0 pt-8 pb-4 bg-white/80 backdrop-blur-md">
                  <button type="submit" className="w-full lg:w-auto bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-700/20">
                    Publish Changes to Live Site
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <ArrowRight className="w-6 h-6 text-blue-700" />
                Manage Knowledge Hub
              </h2>
              
              <div className="space-y-8">
                {blogPosts.map((post, i) => (
                  <div key={post.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4 flex-1 mr-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Article Title</label>
                            <input 
                              value={post.title} 
                              onChange={(e) => {
                                const newPosts = [...blogPosts];
                                newPosts[i].title = e.target.value;
                                setBlogPosts(newPosts);
                              }}
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm font-bold" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Category</label>
                            <input 
                              value={post.category} 
                              onChange={(e) => {
                                const newPosts = [...blogPosts];
                                newPosts[i].category = e.target.value;
                                setBlogPosts(newPosts);
                              }}
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Excerpt</label>
                          <textarea 
                            value={post.excerpt} 
                            onChange={(e) => {
                              const newPosts = [...blogPosts];
                              newPosts[i].excerpt = e.target.value;
                              setBlogPosts(newPosts);
                            }}
                            className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm h-20" 
                          />
                        </div>
                      </div>
                      <div className="w-48 space-y-4">
                        <ImageUpload 
                          label="Cover Image" 
                          currentImage={post.image} 
                          onImageChange={(base64) => {
                            const newPosts = [...blogPosts];
                            newPosts[i].image = base64;
                            setBlogPosts(newPosts);
                          }} 
                        />
                        <button 
                          onClick={() => handleBlogDelete(post.id)}
                          className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-xs font-black hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-3 h-3" /> Delete Article
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  const newPost = {
                    id: Date.now(),
                    image: "https://picsum.photos/1000/500?random=" + blogPosts.length,
                    category: "NEW",
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
                    title: "Untitled Article",
                    excerpt: "Start writing your article summary here..."
                  };
                  setBlogPosts([newPost, ...blogPosts]);
                }}
                className="mt-8 w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-bold hover:border-blue-700 hover:text-blue-700 transition-all flex items-center justify-center gap-3"
              >
                <Plus className="w-5 h-5" /> Add New Knowledge Base Article
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
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
        desc: "Sempurna untuk perbaikan retakan kecil atau pemeliharaan area perumahan. Kemasan praktis untuk kebutuhan rumah tangga.",
        tokopedia: "https://tokopedia.com",
        shopee: "https://shopee.co.id"
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

  // Persistence Logic
  const [homeContent, setHomeContent] = useState(() => {
    const saved = localStorage.getItem('duraphalte_content');
    return saved ? JSON.parse(saved) : initialHomeContent;
  });

  const [blogPosts, setBlogPosts] = useState(() => {
    const saved = localStorage.getItem('duraphalte_blog');
    return saved ? JSON.parse(saved) : initialBlogPosts;
  });

  useEffect(() => {
    localStorage.setItem('duraphalte_content', JSON.stringify(homeContent));
  }, [homeContent]);

  useEffect(() => {
    localStorage.setItem('duraphalte_blog', JSON.stringify(blogPosts));
  }, [blogPosts]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={
          <AdminPage 
            homeContent={homeContent} 
            setHomeContent={setHomeContent} 
            blogPosts={blogPosts} 
            setBlogPosts={setBlogPosts} 
          />
        } />
        <Route path="*" element={<PublicRoutes homeContent={homeContent} blogPosts={blogPosts} />} />
      </Routes>
    </BrowserRouter>
  );
}

const PublicRoutes = ({ homeContent, blogPosts }: { homeContent: any, blogPosts: any[] }) => {
  const navigate = useNavigate();

  useEffect(() => {
    logVisitor(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage content={homeContent} />} />
          <Route path="/products" element={
            <div className="pt-24 lg:pt-32 pb-16 lg:pb-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-12 lg:space-y-20">
               <div className="text-center space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-black text-[#141d23] leading-tight">Our Industrial Catalog</h1>
                  <p className="text-base lg:text-lg text-slate-500 max-w-2xl mx-auto">High-performance material solutions engineered for the most demanding civil engineering environments.</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {homeContent.products.map((prod: any) => (
                    <div key={prod.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all cursor-pointer" onClick={() => navigate(`/product/${prod.id}`)}>
                      <div className="aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-8">
                        <img src={prod.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={prod.title} />
                      </div>
                      <div className="p-8 space-y-4">
                        <span className="text-blue-700 text-xs font-black uppercase tracking-[0.2em]">{prod.badge}</span>
                        <h3 className="text-xl font-bold">{prod.title}</h3>
                        <div className="text-2xl font-black text-[#141d23]">Rp {prod.price}</div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          } />
          <Route path="/product/:id" element={<ProductDetailPage products={homeContent.products} />} />
          <Route path="/blog" element={<BlogPage posts={blogPosts} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
