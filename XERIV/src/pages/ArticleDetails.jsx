import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Share2, MonitorSmartphone, Zap, CheckCircle2, Hexagon } from 'lucide-react';

const ArticleDetails = () => {
  const { id } = useParams();

  // تمرير الشاشة للأعلى عند فتح المقال
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 animate-fade-in-up relative">
      
      {/* إضاءة علوية خافتة */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        
        {/* ========================================= */}
        {/* 1. ترويسة المقال (Article Header) */}
        {/* ========================================= */}
        <div className="mb-12 space-y-6 border-b border-slate-800/80 pb-10">
          <Link to="/pulse" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-bold text-sm">
            <ArrowRight size={16} /> العودة لمرصد Pulse
          </Link>
          
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
            <span className="uppercase tracking-wider text-indigo-400">هندسة النظم (Systems)</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 7 دقائق قراءة</span>
            <span>•</span>
            <span>23 نوفمبر 2026</span>
          </div>

          <h1 className="heading-xeriv text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            كيف تبني نظام POS متكامل بـ Electron.js وتتجاوز مشكلة الاتصال بالإنترنت؟
          </h1>

          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black">
                MC
              </div>
              <div>
                <p className="text-white font-bold text-sm">غربي محمد الشريف</p>
                <p className="text-xs text-slate-400">كبير مهندسي النظم - XERIV</p>
              </div>
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* 2. محتوى المقال (The Content) */}
        {/* ========================================= */}
        <div className="text-slate-300 text-lg leading-[2.2] space-y-8 font-medium">
          <p>
            في عصر الحوسبة السحابية، يرتكب الكثير من المبرمجين خطأً قاتلاً عند بناء أنظمة نقاط البيع (POS) للمحلات والشركات المتوسطة: يعتمدون 100% على الويب والاتصال المستمر بالإنترنت. ماذا يحدث عندما تنقطع الشبكة في متجر مزدحم؟ كارثة تشغيلية وتوقف للمبيعات.
          </p>

          <h2 className="heading-xeriv text-2xl font-black text-white mt-12 mb-6">الحل: معمارية Offline-First</h2>
          <p>
            المعمارية الصحيحة هي بناء نظام هجين باستخدام <strong className="text-cyan-400">Electron.js</strong> للواجهة، و <strong className="text-indigo-400">SQLite</strong> لقاعدة البيانات المحلية. هذا يضمن أن النظام يعمل بسرعة البرق (زمن استجابة 0.1 ثانية) دون الحاجة لأي اتصال بالإنترنت.
          </p>

          <div className="bg-[#0b1120] border border-slate-800 p-6 rounded-2xl my-8 font-mono text-sm text-emerald-400 overflow-x-auto shadow-inner" dir="ltr">
            <code>
              {`// مثال مبسط لإنشاء اتصال آمن بالقاعدة المحلية
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./xeriv_pos.db', (err) => {
  if (err) {
    console.error('Database connection failed', err.message);
  }
  console.log('Connected to the local POS database.');
});`}
            </code>
          </div>

          <p>
            بمجرد عودة الإنترنت، تقوم "خدمة مزامنة خلفية" (Background Sync Worker) بنقل كل البيانات والمبيعات المتراكمة إلى السيرفر السحابي المركزي بسلاسة تامة، مما يعطي الإدارة العليا تقارير لحظية عن المبيعات.
          </p>

          {/* ========================================= */}
          {/* 3. الفخ التسويقي المركزي (The Conversion Hook) */}
          {/* ========================================= */}
          <div className="my-14 bg-gradient-to-r from-[#0b1120] to-[#071324] border border-cyan-500/30 rounded-3xl p-8 md:p-10 shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-600"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 shrink-0 bg-cyan-950/50 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 shadow-inner">
                <MonitorSmartphone size={40} strokeWidth={1.5} />
              </div>
              
              <div className="flex-1 text-center md:text-right space-y-3">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full mb-1">
                  <Zap size={12} className="animate-pulse" /> حلول جاهزة للشركات
                </div>
                <h3 className="heading-xeriv text-2xl font-black text-white">هل تبحث عن نظام POS لا يتعطل أبداً؟</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                  لقد قمنا بهندسة نظام <strong>XERIV ERP & POS</strong> باستخدام هذه التقنيات الدقيقة. نظام مصمم للعمل تحت الضغط بلا إنترنت، مع تصميم زجاجي عصري وسرعة خرافية.
                </p>
                <div className="flex flex-wrap gap-4 pt-3 justify-center md:justify-start">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold"><CheckCircle2 size={14} className="text-emerald-400"/> يعمل بلا إنترنت</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold"><CheckCircle2 size={14} className="text-emerald-400"/> لوحة تحكم سحابية</div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Link to="/systems" className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:scale-105">
                  اكتشف النظام الآن <ArrowRight size={18} className="rotate-180" />
                </Link>
              </div>
            </div>
          </div>
          {/* نهاية الفخ التسويقي */}

          <h2 className="heading-xeriv text-2xl font-black text-white mt-12 mb-6">الخلاصة للشركات التقنية</h2>
          <p>
            تجنب الاعتماد الأعمى على الكلاود (Cloud). المستخدم النهائي لا يهتم بنوع قاعدة البيانات التي تستخدمها، هو يهتم فقط بمرور العميل بسلاسة أمام شاشة الدفع. كمهندس، يجب أن تبني الأنظمة لتتحمل أسوأ ظروف التشغيل.
          </p>
        </div>

        {/* ========================================= */}
        {/* 4. تذييل المقال (Article Footer) */}
        {/* ========================================= */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-400">التقنيات المذكورة:</span>
            <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg font-mono">Electron.js</span>
            <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg font-mono">SQLite</span>
          </div>
          
          <Link to="/auth" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors">
            <Hexagon size={16} /> انضم لمجتمع XERIV
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ArticleDetails;