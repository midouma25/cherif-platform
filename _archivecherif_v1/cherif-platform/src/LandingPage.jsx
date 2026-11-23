import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Sparkles, Flame, Trophy, Award, Code, Terminal, 
  Play, Lightbulb, Bot, GitBranch, Zap, BookOpen, 
  Rocket, ChevronLeft, DollarSign, TrendingUp, Briefcase, 
  CheckCircle2, ArrowUpRight, ShieldCheck, Layers
} from 'lucide-react';

const LandingPage = () => {
  // ==========================================
  // 🌐 1. حالات الكورسات والشهادات
  // ==========================================
  const [courses, setCourses] = useState([]);
  const [activeCatalogFilter, setActiveCatalogFilter] = useState('all');

  // ==========================================
  // ⚡ 2. محرك الدوبامين والعائد المادي في الشاشة الأولى (Hero Dopamine Engine)
  // ==========================================
  const [selectedGoal, setSelectedGoal] = useState('saas'); // 'saas' | 'freelance' | 'job'
  const [hunterExp, setHunterExp] = useState(450);
  const [expBoostAnim, setExpBoostAnim] = useState(false);
  const [liveTickerIndex, setLiveTickerIndex] = useState(0);

  const liveAchievements = [
    "🔥 المطور أمين أتم بناء مشروع SaaS في الكورس 9 ورفعه على GitHub",
    "💰 الطالبة سارة اجتازت البوابة الحمراء (S-Rank) وحصلت على شهادة Node.js",
    "⚡ المطور ريان استخدم برومبتات الـ AI Agent لإنجاز مشروع التخرج في 3 ساعات",
    "🏆 المطور كريم جمع 12 شهادة كراش كورس وفتح الشهادة المهنية الخارقة"
  ];

  // بيانات العائد المادي لكل مسار يختاره الزائر في الشاشة الأولى
  const financialGoals = {
    saas: {
      badge: 'بناء منتجات رقمية (Micro-SaaS)',
      rank: 'S-RANK FOUNDER',
      incomeRange: '$1,500 - $5,000 / شهرياً',
      speedMultiplier: '10x أسرع بمساعدة AI Agent',
      deliverable: 'بناء وإطلاق 3 تطبيقات ويب كاملة قابلة للبيع والاشتراك الشهري',
      highlightColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40'
    },
    freelance: {
      badge: 'العمل الحر واقتناص العملاء (Freelancing)',
      rank: 'S-RANK HUNTER',
      incomeRange: '$800 - $2,500 / للمشروع',
      speedMultiplier: 'تسليم المشاريع في أيام بدل أشهر',
      deliverable: 'معرض أعمال (GitHub Portfolio) يضم +12 مشروعاً حقيقياً يقنع أي عميل فوراً',
      highlightColor: 'text-amber-400',
      borderColor: 'border-amber-500/40'
    },
    job: {
      badge: 'التوظيف في الشركات التقنية (Tech Career)',
      rank: 'S-RANK ENGINEER',
      incomeRange: 'رواتب الفئة العليا للمطورين',
      speedMultiplier: 'جاهزية تقنية كاملة في 4 أشهر',
      deliverable: 'شهادة مهنية موثقة + إتقان الخوارزميات واجتياز اختبارات البوابات الحمراء',
      highlightColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/40'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTickerIndex((prev) => (prev + 1) % liveAchievements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleDopamineBoost = () => {
    setHunterExp((prev) => (prev >= 1000 ? 500 : prev + 150));
    setExpBoostAnim(true);
    setTimeout(() => setExpBoostAnim(false), 600);
  };

  // ==========================================
  // 🎮 3. حالات المحاكي التفاعلي الحي (Interactive Demo)
  // ==========================================
  const [demoTab, setDemoTab] = useState('sandbox');
  const [demoCode, setDemoCode] = useState(
    `// 🎯 التحدي: احسب العائد المالي للمطور بعد أتمتة المشروع بالـ AI\nfunction calculateProfit( projectsCompleted ) {\n  return projectsCompleted * 500;\n}`
  );
  const [demoHintLevel, setDemoHintLevel] = useState(0);
  const [demoAiFeedback, setDemoAiFeedback] = useState(null);
  const [demoGateSelected, setDemoGateSelected] = useState(null);

  const demoHints = [
    "💡 التلميح 1 (الفكرة كأنك طفل 👶): كل مشروع تنجزه بمساعدة الـ AI Agent يوفر لك 500 دولار، نريد فقط ضرب عدد المشاريع في 500!",
    "🛠️ التلميح 2 (الأداة البرمجية): استخدم الكلمة المفتاحية return لإرجاع ناتج عملية الضرب (*).",
    "🔓 التلميح 3 (الاقتراب من الحل): return projectsCompleted * 500;"
  ];

  const fallbackCourses = [
    {
      _id: 'demo-cert-1',
      title: 'الشهادة المهنية الشاملة: مطور Full-Stack السحابي ووكلاء الذكاء الاصطناعي',
      description: 'سلسلة متكاملة من 12 كراش كورس مترابط بأسلوب التبسيط المطلق (ELI5) من الصفر وحتى بناء أنظمة MERN ودمج AI Agents ورفعها على السحابة وGitHub.',
      price: 0,
      isCertificate: true,
      coursesCount: '12 كراش كورس',
      roiText: 'تؤهلك لبناء منتجات SaaS واستلام مشاريع عمل حر كاملة',
      skills: ['HTML/CSS/JS', 'React.js', 'Node & Express', 'MongoDB', 'AI Agents', 'Docker & GitHub']
    },
    {
      _id: 'demo-cert-2',
      title: 'الشهادة المهنية في هندسة الذكاء الاصطناعي وبناء الأنظمة المؤتمتة بـ Python',
      description: 'رحلة متدرجة من أول سطر كود في بايثون إلى بناء وكلاء أذكياء، تحليل البيانات، وربط النماذج اللغوية الضخمة بمشاريع حقيقية تدر دخلاً.',
      price: 0,
      isCertificate: true,
      coursesCount: '10 كراش كورسات',
      roiText: 'تؤهلك لبيع خدمات أتمتة الشركات وبناء بوتات ذكية',
      skills: ['Python', 'Data Structures', 'Automation', 'LLM APIs', 'FastAPI', 'GitHub Portfolio']
    },
    {
      _id: 'demo-crash-1',
      title: 'كراش كورس 1: كيف يعمل الويب وبناء أول موقع تفاعلي (بأسلوب الليجو 👶)',
      description: 'مدخلك التأسيسي الممتع لعالم هندسة البرمجيات بدون تعقيد، مع بوابات زعماء ومشروع تطبيقي كامل ترفعه على حسابك في GitHub.',
      price: 0,
      isCertificate: false,
      coursesCount: '9 وحدات مفصلة',
      roiText: 'تبني فيه أول موقع حي في معرض أعمالك خلال أسبوع',
      skills: ['Web Architecture', 'HTML5', 'Modern CSS', 'Git Basics']
    }
  ];

  useEffect(() => {
    const fetchPublicCourses = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5001/api/courses/public');
        if (res.data?.success && res.data.courses?.length > 0) {
          setCourses(res.data.courses);
        } else {
          setCourses(fallbackCourses);
        }
      } catch (err) {
        setCourses(fallbackCourses);
      }
    };
    fetchPublicCourses();
  }, []);

  const handleTestDemoCode = () => {
    const clean = demoCode.replace(/\s+/g, '');
    if (clean.includes('*500') || clean.includes('return')) {
      setHunterExp((prev) => Math.min(prev + 100, 1000));
      setDemoAiFeedback({
        success: true,
        text: '🎉 كود مثالي! لقد ربحت +100 EXP في عداد الصياد الخاص بك في أعلى الصفحة!'
      });
    } else {
      setDemoAiFeedback({
        success: false,
        text: '💡 اقتربت جداً! اضغط على زر التلميح الأصفر لترى كيف نكتبها خطوة بخطوة.'
      });
    }
  };

  const displayedCourses = courses.filter(c => {
    if (activeCatalogFilter === 'certs') return c.isCertificate || c.title?.includes('شهادة') || c.title?.includes('الشهادة');
    if (activeCatalogFilter === 'crash') return !c.isCertificate && !c.title?.includes('الشهادة');
    return true;
  });

  const activeGoalData = financialGoals[selectedGoal];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 comfort-body-font overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950" dir="rtl">
      
      {/* 🎨 نظام الخطوط المريحة للعين والمضادة لتداخل السطور */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
        
        .comfort-body-font { 
          font-family: 'Readex Pro', 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          line-height: 1.85;
        }
        
        .title-font { 
          font-family: 'Alexandria', 'Plus Jakarta Sans', sans-serif; 
          line-height: 1.6 !important;
        }
        
        .mono-font { 
          font-family: 'JetBrains Mono', monospace; 
        }

        .bg-grid-pattern {
          background-size: 48px 48px;
          background-image: 
            linear-gradient(to right, rgba(30, 41, 59, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 41, 59, 0.2) 1px, transparent 1px);
        }
      `}} />

      {/* ======================================================= */}
      {/* 🥊 1. منطقة البطل (DOPAMINE & FINANCIAL ROI HERO) */}
      {/* ======================================================= */}
      <section className="relative py-14 md:py-20 bg-grid-pattern overflow-hidden border-b border-slate-900">
        {/* إضاءات نيون مدروسة لتحفيز العين بدون إزعاج */}
        <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* ================= العمود الأيمن: الوعد القوي والعائد المادي ================= */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              {/* 🔔 شريط الدوبامين الحي (Live Achievement Ticker) */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/95 border border-emerald-500/30 text-xs font-medium text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.12)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <span className="truncate max-w-xs sm:max-w-md transition-all duration-500">
                  {liveAchievements[liveTickerIndex]}
                </span>
              </div>

              {/* العنوان الرئيسي: سطران واضحان بدون أي تداخل + ضرب الوتر المالي والمهاري */}
              <h1 className="title-font text-2xl sm:text-4xl lg:text-[38px] font-extrabold text-white space-y-2">
                <span className="block leading-[1.6]">
                  تعلّم البرمجة كأنها لعبة، ابنِ مشاريعك مع الـ AI،
                </span>
                <span className="block leading-[1.6] text-transparent bg-clip-text bg-gradient-to-l from-amber-300 via-emerald-400 to-teal-300">
                  وحوّل مهاراتك إلى دخل حقيقي وشهادات مهنية!
                </span>
              </h1>

              {/* الفقرة التوضيحية: تربط بين سهولة التعلم (ELI5) والعائد المادي */}
              <p className="text-slate-300/90 text-sm sm:text-base leading-[1.95] max-w-2xl font-normal">
                لماذا تضيع شهوراً في شروحات نظرية مملة؟ هنا تبدأ من الصفر المطلق بأسلوب <span className="text-white font-medium">التبسيط لطفل صغير (ELI5)</span>، وتكسر بوابات الزعماء، وتستخدم <span className="text-emerald-400 font-medium">وكلاء الذكاء الاصطناعي (AI Agents)</span> لبناء ورفع +12 مشروعاً حقيقياً على <span className="text-amber-400 font-medium" dir="ltr">GitHub</span> تجذب بها العملاء والشركات فوراً.
              </p>

              {/* بطاقات القيمة المادية السريعة (Value Pills) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">مهارات تدر دخلاً</p>
                    <p className="text-[11px] text-slate-400">مشاريع SaaS وعمل حر</p>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Bot size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">برمجة بسرعة 10x</p>
                    <p className="text-[11px] text-slate-400">بمساعدة AI Agents</p>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">9-15 كراش كورس</p>
                    <p className="text-[11px] text-slate-400">شهادة مهنية خارقة</p>
                  </div>
                </div>
              </div>

              {/* أزرار الدعوة الحاسمة */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  to="/academy" 
                  className="title-font bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-base px-8 py-4 rounded-2xl shadow-[0_10px_35px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 transition-all flex items-center gap-2.5"
                >
                  <Rocket size={20} /> ابدأ أول كراش كورس مجاناً
                </Link>
                <a 
                  href="#roi-section" 
                  className="title-font bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 hover:border-amber-500/60 font-semibold text-sm sm:text-base px-6 py-4 rounded-2xl transition-all flex items-center gap-2"
                >
                  <TrendingUp size={18} /> كيف سأربح من هذه المهارات؟
                </a>
              </div>

            </div>

            {/* ================= العمود الأيسر: آلة الدوبامين وحاسبة العائد المادي التفاعلية ================= */}
            <div className="lg:col-span-5">
              <div className="bg-[#0b1120] border-2 border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.8)] transition-all">
                
                {/* رأس البطاقة: حالة الصياد وشريط الـ EXP التفاعلي */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-400 block">محاكي مستقبل المطور (جرب الضغط 👇)</span>
                    <h3 className="title-font text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                      <Sparkles size={15} className="text-amber-400" /> اختر هدفك المادي لترى خطتك:
                    </h3>
                  </div>
                  <button
                    onClick={handleDopamineBoost}
                    className={`mono-font text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                      expBoostAnim 
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.6)]' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                    title="اضغط لشحن نقاط الخبرة!"
                  >
                    <Zap size={13} /> {hunterExp} EXP
                  </button>
                </div>

                {/* شريط تقدم الرتبة البصري */}
                <div className="mb-5">
                  <div className="flex justify-between text-[11px] font-bold mb-1.5">
                    <span className="text-slate-400">الرتبة الحالية: مبتدئ (E-Rank)</span>
                    <span className="text-amber-400" dir="ltr">{activeGoalData.rank}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-l from-amber-400 via-emerald-400 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      style={{ width: `${Math.min((hunterExp / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* أزرار اختيار الهدف المالي (يتفاعل معها الزائر فوراً) */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { id: 'saas', label: '💰 بناء SaaS' },
                    { id: 'freelance', label: '🌍 عمل حر' },
                    { id: 'job', label: '🏢 وظيفة تقنية' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setSelectedGoal(tab.id); handleDopamineBoost(); }}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedGoal === tab.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* شاشة النتيجة المادية والمهنية للهدف المختار */}
                <div className={`bg-slate-950/90 border ${activeGoalData.borderColor} rounded-2xl p-4 space-y-3.5 transition-all`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">العائد المالي المتوقع للمهارة:</span>
                    <span className={`mono-font text-sm font-bold ${activeGoalData.highlightColor}`} dir="ltr">
                      {activeGoalData.incomeRange}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-900 pt-2.5">
                    <span className="text-xs font-semibold text-slate-400">مضاعف السرعة بالـ AI:</span>
                    <span className="text-xs font-bold text-white">{activeGoalData.speedMultiplier}</span>
                  </div>

                  <div className="border-t border-slate-900 pt-2.5">
                    <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                      🎯 الأصول الحقيقية التي ستخرج بها في يدك:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeGoalData.deliverable}
                    </p>
                  </div>
                </div>

                {/* زر تفاعلي داخل البطاقة لجرعة دوبامين إضافية */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-emerald-400" /> شهادة مهنية موثقة لكل مسار
                  </span>
                  <Link 
                    to="/academy" 
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    استلم خطتك الآن <ArrowUpRight size={14} />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* 💰 2. قسم الإقناع المادي: كيف يعود عليك الاشتراك بأضعاف مضاعفة؟ */}
      {/* ======================================================= */}
      <section id="roi-section" className="py-20 bg-[#060b16] border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
              <DollarSign size={14} /> استثمارك في نفسك بالأرقام
            </span>
            <h2 className="title-font text-2xl sm:text-4xl font-extrabold text-white mb-4">
              لماذا يعتبر تعلم البرمجة مع الـ AI في منصتنا أسرع طريق لبناء دخلك؟
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              نحن لا نبيعك "فيديوهات مسجلة تنساها بعد يومين"، بل نسلحك بنظام عملي يبني لك أصولاً برمجية تدر المال.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* البطاقة الأولى: الطريقة التقليدية الخاسرة */}
            <div className="bg-slate-950/70 border border-red-900/40 rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <span className="inline-block text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full mb-4">
                  ❌ الكورسات التقليدية المملة (الطريق القديم)
                </span>
                <h3 className="title-font text-xl font-bold text-white mb-4">
                  شهور من التلقين النظري.. والنتيجة صفر مشاريع!
                </h3>
                <ul className="space-y-3.5 text-sm text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                    <span>شروحات معقدة ومصطلحات جافة تجعلك تفقد الشغف وتتوقف في الأسبوع الأول.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                    <span>تكتب الكود بمفردك بالطرق القديمة البطيئة دون معرفة كيفية استغلال الذكاء الاصطناعي.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                    <span>تتخرج بحساب GitHub فارغ، وعندما تتقدم لعميل أو شركة لا تجد شيئاً حقيقياً تعرضه.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs text-red-400 font-medium">
                النتيجة: ضياع للوقت وإحباط مستمر دون عائد مادي.
              </div>
            </div>

            {/* البطاقة الثانية: طريقة Cherif.dev المربحة */}
            <div className="bg-gradient-to-b from-emerald-950/30 via-[#0b1120] to-[#0b1120] border-2 border-emerald-500/50 rounded-3xl p-7 flex flex-col justify-between shadow-[0_0_50px_rgba(16,185,129,0.1)] relative">
              <div>
                <span className="inline-block text-xs font-bold bg-emerald-500 text-slate-950 px-3.5 py-1 rounded-full mb-4">
                  ✅ نظام Cherif.dev الخارق (طريق العائد المادي السريع)
                </span>
                <h3 className="title-font text-xl font-bold text-white mb-4">
                  شهادات مهنية + وكلاء ذكاء اصطناعي = مصنع مشاريع في يدك!
                </h3>
                <ul className="space-y-3.5 text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>تبسيط مطلق (ELI5):</strong> تفهم أعقد معماريات البرمجة كأنها قصة مشوقة وتطبقها في نفس الدقيقة.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>إتقان الـ AI Agents:</strong> نعلمك كيف تجعل الذكاء الاصطناعي يبني معك المشاريع ويصلح الأخطاء لتنجز عمل شهر في يومين.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>+12 مشروعاً جاهزاً للبيع على GitHub:</strong> في نهاية كل كراش كورس تبني مشروعاً كاملاً يمكنك عرضه للعملاء أو تحويله إلى مشروع SaaS خاص بك.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-500/20 flex items-center justify-between">
                <span className="text-xs text-emerald-300 font-semibold">
                  💡 مشروع واحد فقط لعميل يسترد لك أضعاف وقتك وجهدك!
                </span>
                <Link to="/academy" className="text-xs font-bold bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl hover:bg-emerald-400 transition-all">
                  ابدأ الآن
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* ⚡ 3. المحاكاة الحية (INTERACTIVE LIVE SANDBOX) */}
      {/* ======================================================= */}
      <section id="interactive-demo" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-4">
            <Terminal size={14} /> جرب بنفسك قبل أن تشترك
          </span>
          <h2 className="title-font text-2xl sm:text-4xl font-extrabold text-white mb-4">
            عِش تجربة الدراسة التفاعلية الآن في 30 ثانية!
          </h2>
          <p className="text-slate-400 text-base leading-[1.9]">
            اضغط على التلميحات، افحص الكود مع المعلم الذكي، أو اكسر البوابة الحمراء لترى كيف نحفز عقلك في كل درس.
          </p>
        </div>

        <div className="bg-[#0b1120] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-800 bg-slate-950/60">
            <button
              onClick={() => setDemoTab('sandbox')}
              className={`p-4 font-semibold text-sm flex items-center justify-center gap-2.5 border-b-2 transition-all ${
                demoTab === 'sandbox' 
                  ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Code size={18} /> 1. مختبر الكود + التلميحات الثلاثة
            </button>
            <button
              onClick={() => setDemoTab('red_gate')}
              className={`p-4 font-semibold text-sm flex items-center justify-center gap-2.5 border-b-2 transition-all ${
                demoTab === 'red_gate' 
                  ? 'border-red-500 bg-red-950/20 text-red-400' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Flame size={18} /> 2. تحدي البوابة الحمراء (Red Gate)
            </button>
            <button
              onClick={() => setDemoTab('ai_github')}
              className={`p-4 font-semibold text-sm flex items-center justify-center gap-2.5 border-b-2 transition-all ${
                demoTab === 'ai_github' 
                  ? 'border-amber-500 bg-amber-950/20 text-amber-400' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Bot size={18} /> 3. ورشة مشروع GitHub & AI Agent
            </button>
          </div>

          {demoTab === 'sandbox' && (
            <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">
                  👶 شرح مبسط + تدريب عملي فوري
                </div>
                <h3 className="title-font text-2xl font-bold text-white leading-snug">وداعاً لعقدة الشاشة السوداء!</h3>
                <p className="text-slate-300 text-sm leading-[1.9]">
                  في كل درس كودي، نعطيك تمريناً عملياً صغيراً مع <strong className="text-amber-400">3 تلميحات تدريجية</strong> ومصحح ذكي يشرح لك أخطاءك بلطف شديد ويمنحك نقاط خبرة فورية.
                </p>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => setDemoHintLevel(prev => Math.min(prev + 1, 3))}
                    disabled={demoHintLevel >= 3}
                    className="w-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                  >
                    <Lightbulb size={18} className="text-amber-400" />
                    {demoHintLevel < 3 ? `اضغط لطلب تلميح (${demoHintLevel + 1} من 3)` : 'تم إظهار جميع التلميحات الثلاثة'}
                  </button>

                  {demoHintLevel > 0 && (
                    <div className="space-y-2 pt-2">
                      {demoHints.slice(0, demoHintLevel).map((h, i) => (
                        <div key={i} className="bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs p-3.5 rounded-xl leading-[1.8]">
                          {h}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-2xl overflow-hidden border border-slate-700 bg-[#04070e]" dir="ltr">
                  <div className="bg-slate-900 px-4 py-2.5 text-xs mono-font text-slate-400 border-b border-slate-800 flex justify-between items-center">
                    <span>Interactive Sandbox • JavaScript</span>
                    <span className="text-emerald-400">Live Editor</span>
                  </div>
                  <textarea
                    value={demoCode}
                    onChange={(e) => setDemoCode(e.target.value)}
                    rows={5}
                    className="w-full bg-[#04070e] text-emerald-300 mono-font text-sm p-4 outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                  <button
                    onClick={handleTestDemoCode}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Bot size={18} /> افحص الكود واستلم +100 EXP
                  </button>
                  <span className="text-xs text-slate-400">✨ اضغط على الزر لترى التقييم الفوري!</span>
                </div>

                {demoAiFeedback && (
                  <div className={`mt-4 p-4 rounded-xl border text-sm font-medium leading-relaxed ${demoAiFeedback.success ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/40 border-amber-500/40 text-amber-300'}`}>
                    {demoAiFeedback.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {demoTab === 'red_gate' && (
            <div className="p-6 md:p-10 max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-semibold">
                <Flame size={15} /> محاكاة البوابة الحمراء • S-Rank Red Gate
              </div>
              <h3 className="title-font text-2xl font-bold text-white">
                ما هو الخطأ البرمجي في كود جلب البيانات التالي؟
              </h3>
              <div className="bg-[#050811] border border-slate-800 rounded-2xl p-4 text-left mono-font text-sm text-amber-300" dir="ltr">
                {`const fetchUser = () => {\n  const res = await fetch('/api/user');\n  return res.json();\n}`}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                {[
                  { text: 'لا يمكن استخدام await داخل دالة غير مسبوقة بكلمة async', correct: true },
                  { text: 'دالة fetch لا تقبل مسارات نصية', correct: false },
                  { text: 'يجب كتابة return قبل كلمة const', correct: false },
                  { text: 'الكود سليم تماماً ولا يوجد فيه أي خطأ', correct: false }
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDemoGateSelected(idx)}
                    className={`p-4 rounded-xl border text-sm font-medium transition-all text-right leading-relaxed ${
                      demoGateSelected === idx
                        ? (opt.correct ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-red-950/40 border-red-500 text-red-300')
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              {demoGateSelected !== null && (
                <p className={`text-sm font-semibold ${demoGateSelected === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {demoGateSelected === 0 
                    ? '🐉 ضربة قاضية صحيحة! لقد كسرت البوابة الحمراء لأن await تتطلب دائماً وجود async قبل الدالة.' 
                    : '💀 أصابك الزعيم! انظر جيداً إلى كلمة await؛ أين كلمة async؟ جرب الخيار الأول.'}
                </p>
              )}
            </div>
          )}

          {demoTab === 'ai_github' && (
            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg">
                  <GitBranch size={14} /> الوحدة النهائية في كل كراش كورس
                </span>
                <h3 className="title-font text-2xl font-bold text-white leading-snug">
                  ابنِ معرض أعمالك على GitHub بمساعدة الـ AI Agent!
                </h3>
                <p className="text-slate-300 text-sm leading-[1.9]">
                  في نهاية كل كراش كورس، نأخذك بالتفصيل الممل خطوة بخطوة لبناء مشروع متكامل، ونعلمك كيف تعطي الأوامر الاحترافية لـ <strong className="text-white">Cursor وGitHub Copilot وChatGPT</strong> لبرمجة المشروع معك ورفعه على GitHub.
                </p>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                <div className="text-indigo-400 font-semibold flex items-center gap-2">
                  <Bot size={16}/> نموذج البرومبت الجاهز للنسخ في دروس المشاريع:
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-slate-300 leading-[1.8]">
                  "أنت مساعدي البرمجي الخبير. أريد بناء واجهة متجر كتب باستخدام React وTailwind CSS تتصل بمسار API... اشرح لي هيكل المجلدات أولاً ثم اكتب المكون الرئيسي مع التعليقات التوضيحية."
                </div>
                <div className="bg-[#050811] border border-slate-800 p-3.5 rounded-xl mono-font text-emerald-400 leading-relaxed" dir="ltr">
                  $git init && git add .<br/>$ git commit -m "feat: complete crash course project with AI Agent"<br/>
                  $ git push -u origin main
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================= */}
      {/* 🎓 4. كتالوج الشهادات المهنية والكورسات (THE GRAND CATALOG) */}
      {/* ======================================================= */}
      <section id="catalog" className="py-20 bg-[#060b16] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-amber-400 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Award size={16} /> مسارات معتمدة ذات عائد مهني ومادي مباشر
              </span>
              <h2 className="title-font text-2xl sm:text-4xl font-extrabold text-white">
                اختر تخصصك وابدأ بناء مشاريعك وشهاداتك
              </h2>
            </div>

            <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'certs', label: '🎓 الشهادات المهنية' },
                { id: 'crash', label: '⚡ الكراش كورسات' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCatalogFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeCatalogFilter === tab.id 
                      ? 'bg-indigo-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayedCourses.map((course, idx) => {
              const isProCert = course.isCertificate || course.title?.includes('الشهادة');
              const isRealDbCourse = course._id && !String(course._id).startsWith('demo-');

              return (
                <div 
                  key={course._id || idx} 
                  className={`rounded-3xl p-7 flex flex-col justify-between border transition-all duration-300 hover:-translate-y-1.5 shadow-2xl ${
                    isProCert 
                      ? 'bg-gradient-to-b from-indigo-950/40 via-[#0b1120] to-[#0b1120] border-indigo-500/40' 
                      : 'bg-[#0b1120] border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        isProCert 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {isProCert ? <><Trophy size={13}/> شهادة مهنية خارقة</> : <><Zap size={13}/> كراش كورس تفاعلي</>}
                      </span>
                      <span className="mono-font text-xs text-slate-400 font-semibold">
                        {course.coursesCount || 'مسار متكامل'}
                      </span>
                    </div>

                    <h3 className="title-font text-xl font-bold text-white mb-3 leading-[1.6]">
                      {course.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-[1.85] mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    {/* شارة العائد العملي والمادي للكورس */}
                    <div className="bg-emerald-950/25 border border-emerald-500/20 rounded-xl p-3 mb-5 text-xs text-emerald-300 flex items-center gap-2">
                      <TrendingUp size={15} className="shrink-0 text-emerald-400" />
                      <span>{course.roiText || 'يتضمن مشروع تخرج تطبيقي يرفع على GitHub'}</span>
                    </div>

                    {course.skills && course.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {course.skills.map((sk, sIdx) => (
                          <span key={sIdx} className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg font-medium" dir="ltr">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">الاستثمار</span>
                      <span className="title-font text-lg font-bold text-emerald-400">
                        {course.price > 0 ? `$${course.price}` : 'وصول مجاني مفتوح'}
                      </span>
                    </div>

                    <Link
                      to={isRealDbCourse ? `/course/${course._id}` : '/academy'}
                      className={`title-font font-bold text-sm px-5 py-3 rounded-xl flex items-center gap-2 transition-all ${
                        isProCert
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      ادخل المسار الآن <ChevronLeft size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* 🌌 5. البوابة الختامية والفوتر (FINAL CTA & FOOTER) */}
      {/* ======================================================= */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="bg-gradient-to-b from-indigo-950/60 to-[#0b1120] border border-indigo-500/40 rounded-3xl p-10 md:p-14 shadow-2xl">
            <Award size={52} className="mx-auto text-amber-400 mb-5" />
            <h2 className="title-font text-2xl sm:text-4xl font-extrabold text-white mb-5 leading-snug">
              كل يوم تؤجل فيه تعلمك هو مشروع وعائد مالي يفوتك!
            </h2>
            <p className="text-slate-300 text-base mb-8 max-w-2xl mx-auto leading-[1.9]">
              ابدأ الآن بأول كراش كورس مبسط، اجمع نقاط خبرتك، وابنِ معرض أعمالك الموثق على GitHub بمساعدة وكلاء الذكاء الاصطناعي.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/academy" 
                className="title-font bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base sm:text-lg px-9 py-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Zap size={20} /> انطلق إلى الأكاديمية الآن
              </Link>
              <Link 
                to="/b2b" 
                className="title-font bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-base px-7 py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Briefcase size={18} className="text-amber-400" /> حلول وتدريب الشركات (B2B)
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900 bg-[#01040d] py-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-slate-400" dir="ltr">CHERIF.DEV ACADEMY © {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link to="/academy" className="hover:text-emerald-400 transition-colors">الأكاديمية</Link>
            <Link to="/vault" className="hover:text-emerald-400 transition-colors">الخزنة السرية</Link>
            <Link to="/b2b" className="hover:text-emerald-400 transition-colors">حلول الشركات</Link>
            <Link to="/rankings" className="hover:text-emerald-400 transition-colors">التصنيفات</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;