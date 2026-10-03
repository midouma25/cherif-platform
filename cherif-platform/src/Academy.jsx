import React from 'react';
import { BookOpen, Lock, Unlock, PlayCircle, Star, Code2, Terminal, ArrowLeft } from 'lucide-react';

const Academy = () => {
  const roadmaps = [
    {
      id: "mern-track",
      title: "مسار هندسة الويب الشاملة (MERN Stack)",
      description: "من الصفر إلى بناء أنظمة إدارة الموارد (ERP) ونقاط البيع (POS).",
      icon: <Code2 className="text-blue-400" size={28} />,
      theme: "blue",
      steps: [
        { title: "أساسيات React & Vite", type: "free", duration: "12 دقيقة" },
        { title: "تصميم واجهات احترافية بـ Tailwind", type: "free", duration: "18 دقيقة" },
        { title: "بناء سيرفر Node.js & Express", type: "free", duration: "25 دقيقة" },
        { title: "معسكر بناء نظام POS متكامل للشركات", type: "premium", price: "$99" }
      ]
    },
    {
      id: "quant-track",
      title: "مسار التداول الخوارزمي (Quantitative Dev)",
      description: "استخدم Python والذكاء الاصطناعي لأتمتة استراتيجيات (SMC & ICT).",
      icon: <Terminal className="text-emerald-400" size={28} />,
      theme: "emerald",
      steps: [
        { title: "إعداد بيئة Python و مكتبات البيانات", type: "free", duration: "15 دقيقة" },
        { title: "ربط واجهة Binance API", type: "free", duration: "20 دقيقة" },
        { title: "تحليل زلازل الأسعار (Z-Score)", type: "free", duration: "30 دقيقة" },
        { title: "المعسكر المغلق: الكود المصدري لبوت Phoenix", type: "premium", price: "$149" }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12 px-6 animate-fade-in-up">
      <div className="max-w-5xl mx-auto">
        
        {/* الترويسة */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center bg-gray-900 border border-gray-800 w-16 h-16 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="text-purple-400" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white">
            أكاديمية <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">المسارات البرمجية</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            توقف عن مشاهدة الدروس العشوائية. اتبع خرائط طريق هندسية واضحة، تعلم الأساسيات مجاناً، وانضم لمعسكراتنا لبناء أنظمة حقيقية تدر عليك الدخل.
          </p>
        </div>

        {/* خرائط الطريق (Roadmaps) */}
        <div className="space-y-12">
          {roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
              
              {/* تزيين لوني */}
              <div className={`absolute top-0 right-0 w-2 h-full bg-${roadmap.theme}-500`}></div>
              
              <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-6">
                <div className={`bg-gray-950 p-4 rounded-xl border border-${roadmap.theme}-900/30 shadow-inner`}>
                  {roadmap.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{roadmap.title}</h2>
                  <p className="text-gray-400 text-sm">{roadmap.description}</p>
                </div>
              </div>

              {/* خطوات المسار */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {roadmap.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`relative p-5 rounded-2xl border transition-all flex flex-col h-full ${
                      step.type === 'free' 
                        ? 'bg-gray-950 border-gray-800 hover:border-gray-600' 
                        : 'bg-gradient-to-br from-purple-900/40 to-gray-900 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] group hover:scale-[1.02] cursor-pointer'
                    }`}
                  >
                    {/* خط التوصيل بين الخطوات (يظهر في الشاشات الكبيرة) */}
                    {index !== roadmap.steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 left-[-1rem] w-4 h-0.5 bg-gray-800 z-0"></div>
                    )}

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <span className={`text-3xl font-black opacity-20 ${step.type === 'premium' ? 'text-purple-400' : 'text-gray-500'}`}>
                        0{index + 1}
                      </span>
                      {step.type === 'free' ? (
                        <span className="bg-emerald-900/30 text-emerald-400 p-1.5 rounded-lg">
                          <Unlock size={16} />
                        </span>
                      ) : (
                        <span className="bg-purple-600 text-white p-1.5 rounded-lg shadow-lg">
                          <Lock size={16} />
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`font-bold mb-3 flex-grow text-sm ${step.type === 'premium' ? 'text-white' : 'text-gray-300'}`}>
                      {step.title}
                    </h3>
                    
                    <div className="mt-auto">
                      {step.type === 'free' ? (
                        <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                          <span className="flex items-center gap-1"><PlayCircle size={14} /> درس مجاني</span>
                          <span>{step.duration}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-purple-400 font-black text-lg">{step.price}</span>
                          <span className="text-xs font-bold text-white bg-purple-600 px-3 py-1.5 rounded-lg flex items-center gap-1 group-hover:bg-purple-500 transition-colors">
                            افتح المعسكر <ArrowLeft size={12} />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* حافز إضافي (Social Proof) */}
        <div className="mt-16 bg-gray-950 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3 space-x-reverse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-950 bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                  <Star size={14} className="text-yellow-500" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-bold text-sm">+500 مطور</p>
              <p className="text-gray-500 text-xs">انضموا لمعسكراتنا المغلقة</p>
            </div>
          </div>
          <button className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all">
            تصفح جميع التقييمات
          </button>
        </div>

      </div>
    </div>
  );
};

export default Academy;