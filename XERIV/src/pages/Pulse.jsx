import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Clock, ArrowUpLeft, ChevronLeft, Zap, Sparkles, BookOpen } from 'lucide-react';

const Pulse = () => {
  // بيانات وهمية للمقالات (تمثل ما سيولده AutoFactory لاحقاً)
  const articles = [
    {
      id: 1,
      title: "كيف تبني نظام POS متكامل بـ Electron.js وتتجاوز مشكلة الاتصال بالإنترنت؟",
      excerpt: "اكتشف المعمارية الصحيحة لبناء نظام إدارة نقاط بيع (Offline-First) باستخدام React و SQLite، ولماذا تعتبر هذه التقنية منقذة للشركات المتوسطة.",
      category: "هندسة النظم (Systems)",
      readTime: "7 دقائق",
      date: "23 نوفمبر 2026",
      isHot: true,
    },
    {
      id: 2,
      title: "أسرار التداول الكمي: كيف حللنا زلازل الأسعار (Z-Score) لبناء بوت Phoenix",
      excerpt: "شرح تطبيقي لخوارزميات التداول المتقدمة، وكيف يمكن للذكاء الاصطناعي قراءة بيانات Binance بشكل أسرع من المحللين البشريين بألف مرة.",
      category: "الذكاء المالي (FinTech)",
      readTime: "12 دقيقة",
      date: "20 نوفمبر 2026",
      isHot: false,
    },
    {
      id: 3,
      title: "وداعاً للاشتراكات: كيف تبني AI Agent خاصاً بشركتك بـ 5 دولارات شهرياً",
      excerpt: "دليل عملي لتجاوز منصات الذكاء الاصطناعي المكلفة، وبناء وكيل ذكي ومستقل لخدمة العملاء باستخدام Node.js ومفتوح المصدر.",
      category: "الذكاء الاصطناعي (AI)",
      readTime: "5 دقائق",
      date: "15 نوفمبر 2026",
      isHot: false,
    },
    {
      id: 4,
      title: "الدليل الشامل لأمان واجهات الـ APIs في 2026 (OWASP Top 10)",
      excerpt: "لا تطلق مشروعك قبل قراءة هذا الدليل. الثغرات القاتلة التي تدمر تطبيقات الـ SaaS وكيف تغلقها كمهندس خبير.",
      category: "الأمن السيبراني (Security)",
      readTime: "9 دقائق",
      date: "10 نوفمبر 2026",
      isHot: false,
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 animate-fade-in-up relative overflow-hidden">
      
      {/* إضاءات الخلفية (Pulse effect) */}
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* ========================================= */}
        {/* الترويسة (Hero Section) */}
        {/* ========================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-800/80 pb-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-indigo-400">
              <Activity size={14} className="animate-pulse" />
              <span>XERIV Pulse — The Radar</span>
            </div>
            
            <h1 className="heading-xeriv text-4xl md:text-5xl font-black text-white leading-tight">
              نبض <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">التكنولوجيا.</span>
            </h1>
            
            <p className="text-slate-400 text-lg leading-relaxed">
              تحليلات هندسية، أدلة تطبيقية، وأسرار وادي السيليكون التقنية. هنا نكتب بشغف للمهندسين والمؤسسين الذين يرفضون السطحية.
            </p>
          </div>

          <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 flex flex-col justify-center shrink-0 w-full md:w-64">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">النشرة البريدية</span>
            <p className="text-white font-bold text-sm mb-4">انضم لـ 500+ مطور يستقبلون شفراتنا الأسبوعية.</p>
            <Link to="/auth" className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
              <Sparkles size={14} className="text-cyan-400" />
              اشترك مجاناً
            </Link>
          </div>
        </div>

        {/* ========================================= */}
        {/* شبكة المقالات (Articles Grid) */}
        {/* ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* المقال الرئيسي (Featured Article) - يأخذ مساحة أكبر */}
          <div className="lg:col-span-8">
            <Link to="/article/1" className="group block bg-[#0b1120] border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 md:p-10 transition-all duration-300 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-all"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div className="flex justify-between items-start gap-4">
                  <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-black px-3 py-1.5 rounded-lg border border-indigo-500/30">
                    <Zap size={14} className="text-amber-400" />
                    مقال مميز (Hot)
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all">
                    <ArrowUpLeft size={18} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                    <span className="uppercase tracking-wider text-cyan-400">{articles[0].category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {articles[0].readTime}</span>
                    <span>•</span>
                    <span>{articles[0].date}</span>
                  </div>
                  
                  <h2 className="heading-xeriv text-3xl md:text-4xl font-black text-white leading-tight group-hover:text-indigo-100 transition-colors">
                    {articles[0].title}
                  </h2>
                  
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    {articles[0].excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* باقي المقالات في قائمة جانبية */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-sm font-black text-slate-400 tracking-widest uppercase mb-2 flex items-center gap-2">
              <BookOpen size={16} className="text-cyan-400" />
              أحدث الإصدارات
            </h3>
            
            {articles.slice(1).map((article) => (
              <Link 
                key={article.id} 
                to={`/article/${article.id}`} 
                className="group block bg-[#0b1120] border border-slate-800/80 hover:border-slate-600 rounded-2xl p-5 transition-all hover:bg-slate-900/80"
              >
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 mb-3">
                  <span className="uppercase text-indigo-400">{article.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                </div>
                
                <h4 className="heading-xeriv text-lg font-bold text-slate-200 mb-2 group-hover:text-white transition-colors leading-snug">
                  {article.title}
                </h4>
                
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>

        </div>

        {/* ========================================= */}
        {/* فخ التسويق المركزي (Central Lead Magnet) */}
        {/* ========================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right mt-10">
          <div>
            <h3 className="heading-xeriv text-xl font-bold text-white mb-2">هل تريد أن نرسل لك المقالات الجديدة مباشرة؟</h3>
            <p className="text-sm text-slate-400">لا تفوت أي تحديث تقني. اشترك في النشرة الخاصة بمهندسي وادي السيليكون العرب.</p>
          </div>
          <Link to="/auth" className="bg-white hover:bg-slate-200 text-slate-950 font-black py-3 px-6 rounded-xl transition-colors shrink-0">
            اشترك في النشرة
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Pulse;