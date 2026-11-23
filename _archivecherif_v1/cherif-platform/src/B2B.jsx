import React from 'react';
import { Briefcase, BarChart, Server, MonitorSmartphone, Calendar, ChevronRight, CheckCircle, ArrowUpRight } from 'lucide-react';

const B2B = () => {
  const caseStudies = [
    {
      id: 1,
      title: "نظام إدارة موارد المدارس (School ERP DZ)",
      category: "Desktop / Enterprise",
      tech: ["Electron", "React", "SQLite", "C++ Engine"],
      results: "تقليص وقت جدولة الحصص بنسبة 85% والقضاء على التعارضات.",
      desc: "بناء نظام سطح مكتب متكامل غير متصل بالإنترنت (Offline-first) لمعالجة جداول البيانات المعقدة للمدارس باستخدام محرك قيود مخصص، مع واجهة مستخدم سريعة الاستجابة مبنية بـ Tailwind.",
      icon: <MonitorSmartphone className="text-blue-400" size={24} />,
      color: "from-blue-600 to-cyan-500"
    },
    {
      id: 2,
      title: "بوت التداول الخوارزمي المتقدم",
      category: "FinTech / Quantitative AI",
      tech: ["Python", "XGBoost", "Binance API", "MetaTrader 5"],
      results: "أتمتة استراتيجيات (SMC & ICT) بسرعة تنفيذ 0.02 ثانية.",
      desc: "تطوير روبوتات تداول (مثل Phoenix) قادرة على تحليل البيانات الزمنية (Time-Series) وتنفيذ أوامر البيع والشراء بناءً على مؤشرات زلازل الأسعار (Z-Score) وإدارة المخاطر الصارمة.",
      icon: <BarChart className="text-emerald-400" size={24} />,
      color: "from-emerald-500 to-green-600"
    },
    {
      id: 3,
      title: "أنظمة الرؤية الحاسوبية ومعالجة الإشارات",
      category: "AI Integration / DSP",
      tech: ["OpenCV", "MediaPipe", "Node.js", "Python"],
      results: "دقة 99% في التعرف على الإيماءات وتحسين الصوتيات.",
      desc: "بناء مسارات ذكاء اصطناعي قادرة على قراءة حركات الجسم في الوقت الفعلي، بالإضافة إلى خوادم معالجة الصوت الرقمي (Compressors & Limiters) باستخدام مكتبات بايثون المتقدمة.",
      icon: <Server className="text-purple-400" size={24} />,
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-6 animate-fade-in-up relative overflow-hidden">
      
      {/* خلفية تقنية */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* قسم الترويسة (Hero Section) */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-900/20 text-blue-400 border border-blue-800/50 px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Briefcase size={16} />
            <span>للمؤسسات والشركات التقنية</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            نحن لا نكتب أكواداً فحسب.. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              نحن نبني أنظمة تضاعف أرباحك
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            من أنظمة إدارة الموارد (ERP) المعقدة إلى خوارزميات الذكاء الاصطناعي وبوتات التداول. 
            نوفر لك حلولاً برمجية قوية، سريعة، وقابلة للتوسع.
          </p>
        </div>

        {/* قسم دراسات الحالة (Case Studies) */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4">
            معرض الأعمال المعقدة (Case Studies)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((study) => (
              <div key={study.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all group flex flex-col h-full relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${study.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="bg-gray-950 border border-gray-800 p-3 rounded-xl">
                    {study.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-950 px-3 py-1 rounded-full border border-gray-800">
                    {study.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{study.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow relative z-10">
                  {study.desc}
                </p>
                
                <div className="space-y-4 mt-auto relative z-10">
                  <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm font-bold text-emerald-400">{study.results}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {study.tech.map((t, index) => (
                      <span key={index} className="text-xs font-mono text-gray-400 bg-gray-950 px-2 py-1 rounded-md border border-gray-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* قسم الدعوة لاتخاذ إجراء (Call To Action - Booking) */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-950 border border-blue-900/50 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-3xl font-black text-white">هل لديك مشروع ضخم يحتاج لهندسة دقيقة؟</h2>
            <p className="text-blue-200/70">
              توقف عن إضاعة الوقت مع الهواة. احجز جلسة استشارية مجانية لنناقش المعمارية البرمجية لمشروعك، وكيف يمكننا تحويله إلى واقع قابل للتوسع.
            </p>
          </div>
          
          <div className="md:w-1/3 w-full flex justify-end">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
              <Calendar size={20} />
              احجز مكالمة استشارية
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default B2B;