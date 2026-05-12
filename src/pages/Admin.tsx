import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, LayoutDashboard, BarChart, Settings, LogOut,
  Plus, Trash2, Edit2, Globe, Lock, Key,
  Eye, User, Clock, TrendingUp, Menu, Mail
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type AdminView = 'dashboard' | 'editor';

const ImageUpload = ({ label, currentImage, onImageChange }: { label: string, currentImage: string, onImageChange: (base64: string) => void }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
          <img src={currentImage} className="w-full h-full object-cover" alt="Preview" />
        </div>
        <label className="flex-1">
          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-sm cursor-pointer hover:bg-slate-50 transition-colors">
            <span className="text-slate-500 font-medium">Select new image...</span>
            <Plus className="w-4 h-4 text-blue-700" />
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
};

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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

const AdminDashboard = ({ onLogout, homeContent, setHomeContent, blogPosts, setBlogPosts, onExit }: { 
  onLogout: () => void,
  homeContent: any, 
  setHomeContent: any, 
  blogPosts: any[], 
  setBlogPosts: any,
  onExit: () => void
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
    setBlogPosts(blogPosts.filter((p: any) => p.id !== id));
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
            onClick={onExit}
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
                {blogPosts.slice(0, 3).map((post: any) => (
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
                {blogPosts.map((post: any, i: number) => (
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

export default function AdminPage({ homeContent, setHomeContent, blogPosts, setBlogPosts }: {
  homeContent: any,
  setHomeContent: any,
  blogPosts: any[],
  setBlogPosts: any
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('admin_session') === 'active';
  });

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => {
      setIsLoggedIn(true);
      localStorage.setItem('admin_session', 'active');
    }} />;
  }

  return (
    <AdminDashboard 
      onLogout={() => {
        setIsLoggedIn(false);
        localStorage.removeItem('admin_session');
        window.location.href = '/';
      }}
      onExit={() => {
        window.location.href = '/';
      }}
      homeContent={homeContent} 
      setHomeContent={setHomeContent} 
      blogPosts={blogPosts}
      setBlogPosts={setBlogPosts}
    />
  );
}
