import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Target, Eye, Award, CheckCircle2, ArrowRight, ShieldCheck, Globe2, Users, Building2, Briefcase } from 'lucide-react';

const AboutPage = ({ content }: { content: any }) => {
  const navigate = useNavigate();
  const { onQuoteClick } = useOutletContext<{ onQuoteClick: () => void }>();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-br from-[#0c1216] via-[#141d23] to-[#1e2930] overflow-hidden border-b border-slate-800">
        {/* Subtle grid pattern for technical theme */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Left-aligned Premium Typography */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#006ae4]/10 border border-[#006ae4]/30 backdrop-blur-md rounded-full text-[#006ae4] text-xs font-black uppercase tracking-[0.25em]"
              >
                <Building2 className="w-3.5 h-3.5" />
                {content.hero.badge}
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05]"
              >
                {content.hero.title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed font-sans"
              >
                {content.hero.desc}
              </motion.p>

              {/* Unique Quick Fact Banner on About Page to increase interactive feedback */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-6 flex flex-wrap gap-6 border-t border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase">Proyek Nasional</p>
                    <p className="text-slate-400 text-xs">Dipercaya oleh BUMN & Swasta</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase">Sertifikasi ISO</p>
                    <p className="text-slate-400 text-xs">Standardisasi Mutu Tinggi</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Layered, Floating Architectural Picture Card */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                {/* Decorative border outline block */}
                <div className="absolute -inset-4 rounded-3xl border-2 border-dashed border-blue-500/20 pointer-events-none -translate-x-2 translate-y-3"></div>
                
                {/* Main image card */}
                {content.hero.image && (
                  <div className="relative aspect-[4/3] sm:aspect-[1.4] rounded-2xl overflow-hidden shadow-2xl shadow-blue-950/40 border-4 border-slate-700/50 group">
                    <img 
                      src={content.hero.image} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      alt="DMK Group Industrial Headquarters" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-left">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#006ae4]">PT DHISA MANUNGGAL KARYA</span>
                      <p className="text-white text-xs font-bold leading-tight">Unit Produksi & Pengawasan Mutu Aspal Instan</p>
                    </div>
                  </div>
                )}
                
                {/* Highlight badge floating behind */}
                <div className="absolute -top-4 -right-4 bg-[#006ae4]/90 text-white font-black text-xs px-4 py-2 rounded-xl shadow-lg uppercase tracking-wider backdrop-blur-sm">
                  Tentang Kami
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Background Visual text accent */}
        <div className="absolute bottom-4 right-8 text-[12rem] font-black text-white/[0.015] pointer-events-none select-none whitespace-nowrap z-0 tracking-tighter uppercase font-eurostile">
          {content.hero.bgText || "DMK GROUP"}
        </div>
      </section>

      {/* Main Content - Who We Are */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                {content.history.badge}
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight">
                {content.history.title}
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                {content.history.content}
              </div>
              {content.history.video && (
                <div className="pt-8">
                   <div className="aspect-video rounded-3xl overflow-hidden border-4 border-slate-100 shadow-xl">
                      <iframe 
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${content.history.video}`}
                        title="About Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                   </div>
                </div>
              )}
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                  src={content.history.image} 
                  alt="Industrial Infrastructure"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-blue-700 text-white p-8 rounded-3xl shadow-xl hidden lg:block">
                <p className="text-4xl font-black mb-1">{content.history.experience}</p>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Tahun Pengalaman</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-start gap-8 relative overflow-hidden"
            >
              {content.visionMission.vision.image && (
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <img src={content.visionMission.vision.image} className="w-full h-full object-cover" alt="Vision bg" />
                </div>
              )}
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 z-10">
                <Eye className="w-8 h-8" />
              </div>
              <div className="space-y-4 z-10">
                <h3 className="text-3xl font-black text-slate-900 leading-tight">{content.visionMission.vision.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {content.visionMission.vision.desc}
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-[#141d23] p-12 rounded-[2rem] border border-white/5 shadow-sm flex flex-col items-start gap-8 relative overflow-hidden"
            >
              {content.visionMission.mission.image && (
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <img src={content.visionMission.mission.image} className="w-full h-full object-cover" alt="Mission bg" />
                </div>
              )}
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 z-10">
                <Target className="w-8 h-8" />
              </div>
              <div className="space-y-4 z-10">
                <h3 className="text-3xl font-black text-white leading-tight">{content.visionMission.mission.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg italic">
                  "{content.visionMission.mission.quote}"
                </p>
                <p className="text-slate-400 leading-relaxed">
                  {content.visionMission.mission.desc}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Banner */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-blue-700 rounded-[3rem] p-8 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden relative min-h-[400px]">
             {content.banner.image && (
              <div className="absolute inset-0 opacity-20">
                <img src={content.banner.image} className="w-full h-full object-cover" alt="Banner background" />
              </div>
            )}
            <div className="relative z-10 text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">{content.banner.title}</h2>
              <p className="text-blue-100 text-lg max-w-xl">
                {content.banner.desc}
              </p>
            </div>
            <button 
              onClick={onQuoteClick}
              className="relative z-10 bg-white text-blue-700 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all flex items-center gap-3 group"
            >
              {content.banner.cta}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
