import React from 'react';
import { Briefcase, BarChart, Server, MonitorSmartphone, Calendar, CheckCircle, Hexagon, Terminal, ArrowUpLeft } from 'lucide-react';

const Systems = () => {
  const products = [
    {
      id: 1,
      title: "XERIV ERP & POS System",
      category: "Desktop / Enterprise",
      tech: ["Electron", "React", "SQLite", "Tailwind"],
      results: "سرعة تنفيذ 0.1s مع دعم كامل للعمل بلا إنترنت (Offline-First).",
      desc: "نظام إدارة موارد متكامل ونقاط بيع مخصص للشركات. يتميز بمحرك قيود مخصص، قاعدة بيانات محلية فائقة السرعة، وتصميم زجاجي (Glassmorphism) يسهل على الموظفين استخدامه بدون تدريب.",
      icon: <MonitorSmartphone className="text-cyan-400" size={28} strokeWidth={1.5} />,
      glow: "group-hover:bg-cyan-500/20",
      border: "hover:border-cyan-500/50"
    },
    {
      id: 2,
      title: "Phoenix Algorithmic Bot",
      category: "FinTech / Quantitative AI",
      tech: ["Python", "XGBoost", "Binance API", "MQL5"],
      results: "أتمتة استراتيجيات (SMC & ICT) بسرعة استجابة 0.02 ثانية.",
      desc: "بوت تداول خوارزمي متقدم يعمل على تحليل البيانات الزمنية (Time-Series) وتنفيذ أوامر التداول آلياً بناءً على مؤشرات زلازل الأسعار (Z-Score) وإدارة مخاطر صارمة لحماية رأس المال.",
      icon: <BarChart className="text-blue-400" size={28} strokeWidth={1.5} />,
      glow: "group-hover:bg-blue-500/20",
      border: "hover:border-blue-500/50"
    },
    {
      id: 3,
      title: "Vision & DSP Engines",
      category: "AI Integration / Vision",
      tech: ["OpenCV", "MediaPipe", "Node.js", "Python"],
      results: "دقة 99% في التعرف على الإيماءات وتحليل الإشارات المعقدة.",
      desc: "محركات ذكاء اصطناعي مخصصة قادرة على قراءة حركات الجسم في الوقت الفعلي، ومعالجة الصوت الرقمي المتقدم للأنظمة الأمنية والطبية والصناعية.",
      icon: <Server className="text-indigo-400" size={28} strokeWidth={1.5} />,
      glow: "group-hover:bg-indigo-500/20",
      border: "hover:border-indigo-500/50"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 animate-fade-in-up relative overflow-hidden flex flex-col items-center">
      
      {/* إضاءات الخلفية */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="w-full max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* ========================================= */}
        {/* الترويسة (Hero Section) */}
        {/* ========================================= */}
        <div className="text-center space-y-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#0b1120] border border-cyan-500/30 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <Terminal size={14} />
            <span>XERIV Systems — B2B Solutions</span>
          </div>
          
          <h1 className="heading-xeriv text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl mx-auto">
            نحن لا نكتب الكود فحسب.. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              نحن نهندس أنظمة تضاعف أرباحك.
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            من أنظمة إدارة الموارد (ERP) المعقدة، إلى بوتات التداول الكمي ومحركات الذكاء الاصطناعي. 
            نوفر لشركتك بنية تحتية برمجية صلبة، سريعة، وقابلة للتوسع اللانهائي.
          </p>
        </div>

        {/* ========================================= */}
        {/* معرض الأنظمة والبرمجيات (Products Catalog) */}
        {/* ========================================= */}
        <div>
          <div className="flex items-center gap-3 mb-10 border-b border-slate-800/80 pb-4">
            <Hexagon className="text-cyan-500" size={24} />
            <h2 className="heading-xeriv text-2xl font-black text-white">
              ترسانة الأنظمة والبرمجيات (Software Arsenal)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className={`bg-[#0b1120] border border-slate-800 rounded-3xl p-8 transition-all duration-300 group flex flex-col h-full relative overflow-hidden ${product.border} hover:shadow-[0_0_35px_rgba(34,211,238,0.1)]`}
              >
                {/* توهج داخلي عند المرور */}
                <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100 ${product.glow}`}></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="bg-slate-900/80 border border-slate-700/50 p-4 rounded-2xl shadow-inner">
                    {product.icon}
                  </div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="heading-xeriv text-2xl font-black text-white mb-3 relative z-10">
                  {product.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-[1.8] mb-8 flex-grow relative z-10">
                  {product.desc}
                </p>
                
                <div className="space-y-5 mt-auto relative z-10">
                  <div className="bg-[#030712]/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={16} />
                    <span className="text-xs font-bold text-slate-300 leading-relaxed">{product.results}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
                    {product.tech.map((t, index) => (
                      <span key={index} className="text-[10px] font-mono text-cyan-200/70 bg-cyan-950/30 px-2.5 py-1 rounded-md border border-cyan-900/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================= */}
        {/* الدعوة لاتخاذ إجراء (B2B CTA Booking) */}
        {/* ========================================= */}
        <div className="bg-gradient-to-r from-[#0b1120] to-[#0a192f] border border-cyan-900/50 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          {/* خط علوي مضيء */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"></div>
          
          <div className="md:w-2/3 space-y-4 relative z-10">
            <span className="text-xs font-black text-cyan-400 tracking-widest uppercase">XERIV Enterprise Consulting</span>
            <h2 className="heading-xeriv text-3xl md:text-4xl font-black text-white leading-tight">
              هل يواجه مشروعك تعقيدات هندسية؟
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              توقف عن إضاعة الوقت والميزانية مع الهواة. احجز جلسة استشارية تقنية لنناقش المعمارية البرمجية الصحيحة لمشروعك، وكيف نحوله إلى نظام قوي قابل للتوسع.
            </p>
          </div>
          
          <div className="md:w-1/3 w-full flex justify-end relative z-10">
            <button className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_25px_rgba(8,145,178,0.4)] hover:scale-105 hover:-translate-y-1">
              <Calendar size={20} />
              احجز مكالمة استشارية
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Systems;