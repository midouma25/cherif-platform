import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hexagon, Layers, Activity, User, ChevronLeft } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/systems', name: 'Systems', desc: 'الأنظمة والحلول', icon: <Layers size={16} /> },
    { path: '/pulse', name: 'Pulse', desc: 'المرصد والمقالات', icon: <Activity size={16} /> },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-slate-800/80 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        
        {/* اللوجو - XERIV */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <Hexagon size={32} className="text-cyan-500 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
          </div>
          <span className="text-2xl font-black text-white tracking-[0.2em] font-mono mt-1">
            XERIV
          </span>
        </Link>

        {/* الروابط المركزية (لشاشات الديسكتوب) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className="group flex items-center gap-2 relative"
              >
                <div className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`}>
                  {link.icon}
                </div>
                <span className={`text-sm font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                  {link.name}
                </span>
                {isActive && (
                  <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* بوابة العملاء (SSO) */}
        <Link 
          to="/auth" 
          className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-lg backdrop-blur-sm group"
        >
          <User size={16} className="text-cyan-400" />
          <span className="tracking-wide">بوابة العملاء</span>
          <ChevronLeft size={14} className="text-slate-500 group-hover:text-white group-hover:-translate-x-1 transition-all" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;