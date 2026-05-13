import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Eye, Award, CheckCircle2, ArrowRight, ShieldCheck, Globe2, Users } from 'lucide-react';

const AboutPage = ({ content }: { content: any }) => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    const element = document.getElementById('quote-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#quote-section');
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#141d23] overflow-hidden">
        {content.hero.image && (
          <div className="absolute inset-0 opacity-20">
            <img src={content.hero.image} className="w-full h-full object-cover" alt="Hero background" />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-400 font-black uppercase tracking-[0.3em] text-xs mb-4 block"
          >
            {content.hero.badge}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-7xl font-black text-white leading-tight mb-8"
          >
            {content.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            {content.hero.desc}
          </motion.p>
        </div>
        
        {/* Background Visual */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-black text-white/[0.02] pointer-events-none select-none whitespace-nowrap -z-0">
          {content.hero.bgText}
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
              onClick={handleContactClick}
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
