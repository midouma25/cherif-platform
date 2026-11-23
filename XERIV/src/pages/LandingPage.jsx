import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Activity, BookOpen, ShieldCheck, ArrowUpLeft, ChevronDown } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ========================================= */}
      {/* 1. الحاوية السينمائية (The Cinematic Hero) */}
      {/* ========================================= */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        
        {/* فيديو الخلفية التكنولوجي */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
        >
          {/* رابط تجريبي لفيديو Data/Tech - يمكن تغييره لاحقاً */}
          <source src="https://cdn.pixabay.com/video/2020/05/25/40138-424756543_large.mp4" type="video/mp4" />
        </video>

        {/* طبقات التدرج اللوني (Overlays) لدمج الفيديو مع الخلفية وإبراز النص */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/90 via-[#030712]/50 to-[#030712]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>

        {/* المحتوى المركزي */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center animate-fade-in-up mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black tracking-widest uppercase mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            Xeriv Ecosystem 1.0
          </div>
          
          <h1 className="heading-xeriv text-5xl md:text-7xl font-black text-white leading-[1.2] mb-6 tracking-tight">
            نهندس أنظمة الأعمال، <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
              ونبني عقول المستقبل.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            نحن لسنا مجرد وكالة برمجيات؛ نحن بيئة متكاملة. من أنظمة الإدارة المعقدة (B2B) التي تضاعف أرباحك، إلى المرصد التقني الذي يبقيك في صدارة وادي السيليكون.
          </p>

          <button 
            onClick={() => document.getElementById('ecosystem').scrollIntoView({ behavior: 'smooth' })}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-black flex items-center gap-2 transition-all shadow-[0_0_30px_rgba(8,145,178,0.4)] hover:scale-105"
          >
            استكشف الأجنحة <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. شبكة النظام البيئي (Ecosystem Grid) */}
      {/* ========================================= */}
      <div id="ecosystem" className="relative bg-[#030712] py-24 px-6 z-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-sm font-black text-cyan-500 tracking-[0.2em] uppercase font-mono">The Infrastructure</h2>
            <h3 className="heading-xeriv text-3xl md:text-4xl font-black text-white">اختر الجناح الذي تريده</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Systems (مفتوح) */}
            <Link to="/systems" className="group relative bg-[#0b1120] border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-8 md:p-10 overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(8,145,178,0.15)] flex flex-col justify-between h-[320px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Layers size={28} strokeWidth={1.5} />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-400 group-hover:bg-cyan-500 group-hover:text-slate-900 group-hover:border-cyan-400 transition-all">
                  <ArrowUpLeft size={20} />
                </div>
              </div>
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-cyan-400 tracking-widest uppercase font-mono">Xeriv Systems</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-emerald-500/30">Live</span>
                </div>
                <h4 className="heading-xeriv text-2xl font-black text-white">أنظمة وحلول الأعمال (B2B)</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  ترسانة من البرمجيات القوية (Mini ERP, POS, Trading Bots) مصممة لتسريع نمو شركتك وأتمتة عملياتك بالكامل.
                </p>
              </div>
            </Link>

            {/* 2. Pulse (مفتوح) */}
            <Link to="/pulse" className="group relative bg-[#0b1120] border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-8 md:p-10 overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] flex flex-col justify-between h-[320px]">
              <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-all"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Activity size={28} strokeWidth={1.5} />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all">
                  <ArrowUpLeft size={20} />
                </div>
              </div>
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-indigo-400 tracking-widest uppercase font-mono">Xeriv Pulse</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-emerald-500/30">Live</span>
                </div>
                <h4 className="heading-xeriv text-2xl font-black text-white">المرصد والمقالات التقنية</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  نبض وادي السيليكون في شاشتك. تحليلات عميقة، أدوات ذكاء اصطناعي، ومقالات تفصيلية تنقل معرفتك للمستوى التالي.
                </p>
              </div>
            </Link>

            {/* 3. Forge (قريباً) */}
            <div className="relative bg-[#050914] border border-slate-800/50 rounded-3xl p-8 md:p-10 flex flex-col justify-between h-[320px] opacity-60 cursor-not-allowed">
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-500">
                  <BookOpen size={28} strokeWidth={1.5} />
                </div>
              </div>
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-slate-500 tracking-widest uppercase font-mono">Xeriv Forge</span>
                  <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-amber-500/20">Coming Soon</span>
                </div>
                <h4 className="heading-xeriv text-2xl font-black text-slate-300">أكاديمية المهندسين</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  مصنع العقول. شهادات مهنية خارقة وكراش كورسات تبنيك من الصفر المطلق إلى الاحتراف المعماري. (جاري التجهيز).
                </p>
              </div>
            </div>

            {/* 4. Prime (قريباً) */}
            <div className="relative bg-[#050914] border border-slate-800/50 rounded-3xl p-8 md:p-10 flex flex-col justify-between h-[320px] opacity-60 cursor-not-allowed">
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-500">
                  <ShieldCheck size={28} strokeWidth={1.5} />
                </div>
              </div>
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-slate-500 tracking-widest uppercase font-mono">Xeriv Prime</span>
                  <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-amber-500/20">Coming Soon</span>
                </div>
                <h4 className="heading-xeriv text-2xl font-black text-slate-300">مركز الاعتماد والتقييم</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  امتحانات تحديد المستوى، وشارات رقمية مشفرة تثبت كفاءتك التقنية للشركات العالمية. (جاري التجهيز).
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
};

export default LandingPage;