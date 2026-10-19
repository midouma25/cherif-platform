import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, BookOpen, Clock, PlayCircle, Star, Award, Trophy, Zap, 
  GitBranch, Bot, Layers, CheckCircle2, ArrowRight, ChevronLeft, 
  Sparkles, DollarSign, Briefcase, Rocket, Link2, ShieldCheck, Code, Flame,
  TrendingUp, Target, Compass, ChevronDown, Terminal, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ============================================================================
// 🧠 المحرك الذكي لتحليل الكورسات وتوليد الأوصاف العميقة والآفاق المادية والمهنية
// ============================================================================
export const parseCourseHierarchy = (course) => {
  const rawTitle = course?.title || '';
  const rawDesc = course?.description || '';
  const meta = course?.certificateMeta || {};

  // 1. استخراج اسم الشهادة الأم والشهادة الفرعية
  let parentCertTitle = meta.parentCertificateTitle || '';
  let subCertBadge = meta.subCertificateBadge || '';

  const withinMatch = rawDesc.match(/\(ضمن\s+([^)]+)\)/);
  if (!parentCertTitle && withinMatch) {
    parentCertTitle = withinMatch[1].trim();
  }

  const badgeMatch = rawDesc.match(/🏆\s*يمنح:\s*([^|(]+)/);
  if (!subCertBadge && badgeMatch) {
    subCertBadge = badgeMatch[1].trim();
  }

  // 2. استخراج رقم الكراش كورس بالترتيب
  let courseOrder = meta.courseOrder || null;
  if (!courseOrder) {
    const orderMatch = rawTitle.match(/(?:كراش كورس|الكورس|كورس|Course)\s*(\d+)/i);
    if (orderMatch) courseOrder = parseInt(orderMatch[1], 10);
  }

  // 3. تنظيف الوصف وبناء الوصف التفصيلي الغني
  const cleanDescription = rawDesc
    .replace(/\|\s*🏆\s*يمنح:.*$/, '')
    .trim();

  const defaultSkills = meta.skills?.length > 0 
    ? meta.skills 
    : extractKeywordsFromText(rawTitle + ' ' + cleanDescription);

  const shortCleanTitle = rawTitle.replace(/^(الكراش كورس|الكورس|كراش كورس)\s*\d+\s*:\s*/i, '').trim();

  const githubProjectTitle = meta.githubProject?.projectTitle || `مشروع تطبيقي متكامل في ${shortCleanTitle}`;
  const githubProjectSummary = meta.githubProject?.projectSummary || `بناء وتطوير مشروع عملي متكامل يطبق مفاهيم (${shortCleanTitle}) خطوة بخطوة بالاستعانة بأوامر AI Agent ورفعه بشكل احترافي على حسابك في GitHub.`;

  const isPartOfCertificate = Boolean(parentCertTitle);
  const estimatedHours = course.estimatedHours || 16;
  const xpReward = (courseOrder && courseOrder < 50 ? 1200 + (courseOrder * 150) : 1800);

  // 4. توليد الآفاق المهنية والمادية المخصصة لهذا الكراش كورس تحديداً
  const horizons = generateCourseHorizons(shortCleanTitle, cleanDescription, defaultSkills, courseOrder || 1);

  // 5. بناء شرح غني ومفصل للكورس يدمج فلسفة التبسيط مع التطبيق
  const richExtendedDescription = `${cleanDescription} — يأخذك هذا المسار المكثف من المفاهيم التأسيسية بأسلوب التبسيط القصصي (مبدأ فاينمان ELI5 👶) إلى التطبيق الهندسي العميق، حيث تتدرب داخل مختبر الكود التفاعلي المدعوم بـ 3 تلميحات تدريجية ومصحح الذكاء الاصطناعي، وتجتاز بوابات الزعماء والبوابات الحمراء حتى تبني مشروعك النهائي وترفعه على GitHub.`;

  return {
    ...course,
    shortCleanTitle,
    cleanDescription,
    richExtendedDescription,
    isPartOfCertificate,
    parentCertTitle: parentCertTitle || null,
    parentCertDescription: meta.parentCertificateDescription || null,
    mainAnalogy: meta.mainAnalogy || null,
    subCertBadge: subCertBadge || `شهادة إتقان ${shortCleanTitle}`,
    courseOrder: courseOrder || 99,
    extractedSkills: defaultSkills,
    githubProjectTitle,
    githubProjectSummary,
    estimatedHours,
    xpReward,
    horizons,
    careerROI: meta.careerAndFinancialROI || null,
    timePlan: meta.timePlan || null
  };
};

// دالة استخراج الكلمات المفتاحية التقنية
const extractKeywordsFromText = (text) => {
  const knownTech = [
    'HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 
    'SQL', 'Python', 'Git', 'GitHub', 'Docker', 'Cloud', 'AI Agents', 
    'Prompt Engineering', 'REST API', 'JWT', 'Tailwind', 'Next.js', 'TypeScript', 'Linux', 'Cybersecurity', 'Testing'
  ];
  const found = knownTech.filter(tech => text.toLowerCase().includes(tech.toLowerCase()));
  return found.length > 0 ? found.slice(0, 6) : ['Software Architecture', 'Clean Code', 'AI-Assisted Dev', 'Problem Solving', 'GitHub Portfolio'];
};

// محرك توليد الآفاق المهنية والمادية لكل كراش كورس حسب موضوعه
const generateCourseHorizons = (title, desc, skills, order) => {
  const combined = (title + ' ' + desc + ' ' + skills.join(' ')).toLowerCase();

  if (combined.includes('html') || combined.includes('css') || combined.includes('tailwind') || combined.includes('واجهات') || combined.includes('تصميم')) {
    return {
      freelanceGig: 'تصميم وتكويد صفحات هبوط (Landing Pages) متجاوبة وعالية التحويل للشركات والمنتجات الرقمية.',
      gigPriceRange: '$120 - $350 / للمشروع',
      careerImpact: 'امتلاك عين المصمم الهندسية والقدرة على تحويل أي تصميم Figma إلى كود نظيف وسريع في وقت قياسي.',
      saasCapability: 'بناء الواجهات التسويقية الفخمة لمنتجاتك الرقمية الخاصة لجذب المشتركين من النظرة الأولى.',
      beforeState: 'تخاف من تنسيق الصفحات وتضيع ساعات في ضبط العناصر والألوان على الشاشات المختلفة.',
      afterState: 'تبني واجهات عصرية متجاوبة خلال ساعات قليلة بمساعدة الـ AI Agent وترفعها مباشرة على GitHub.'
    };
  }

  if (combined.includes('react') || combined.includes('next') || combined.includes('dom') || combined.includes('تفاعلي')) {
    return {
      freelanceGig: 'تطوير لوحات تحكم تفاعلية (Dashboards) وتطبيقات ويب أحادية الصفحة (SPA) للشركات الناشئة.',
      gigPriceRange: '$350 - $900 / للمشروع',
      careerImpact: 'التأهل المباشر لمقابلات مطوري الواجهات الأمامية (Frontend Engineers) بإتقان إدارة الحالة والمكونات.',
      saasCapability: 'بناء واجهة الاستخدام الكاملة لأي تطبيق SaaS تفاعلي مع تجربة مستخدم فائقة السرعة.',
      beforeState: 'تجد صعوبة في إدارة البيانات المتغيرة وتحديث الشاشة دون إعادة تحميل الصفحة.',
      afterState: 'تهندس تطبيقات تفاعلية معقدة ومقسمة إلى مكونات احترافية قابلة لإعادة الاستخدام.'
    };
  }

  if (combined.includes('node') || combined.includes('express') || combined.includes('api') || combined.includes('mongo') || combined.includes('sql') || combined.includes('خادم') || combined.includes('بيانات')) {
    return {
      freelanceGig: 'بناء خوادم خلفية (RESTful APIs) وهيكلة قواعد بيانات آمنة وقابلة للتوسع للمتاجر والمنصات.',
      gigPriceRange: '$450 - $1,200 / للمشروع',
      careerImpact: 'الانتقال من مجرد مصمم واجهات إلى مهندس نظم خلفية (Backend / Full-Stack) يفهم منطق الأعمال والبيانات.',
      saasCapability: 'برمجة العقل المدبر لمشاريعك، حفظ بيانات المشتركين، وإدارة العمليات المالية بأمان تام.',
      beforeState: 'تعتمد على بيانات وهمية ثابتة ولا تعرف كيف تحفظ بيانات المستخدمين أو تعالج طلباتهم.',
      afterState: 'تبني سيرفرات حقيقية متصلة بقواعد بيانات مؤمنة وجاهزة لاستقبال آلاف الطلبات.'
    };
  }

  if (combined.includes('ai') || combined.includes('ذكاء') || combined.includes('agent') || combined.includes('python') || combined.includes('أتمتة')) {
    return {
      freelanceGig: 'دمج وكلاء الذكاء الاصطناعي (AI Agents) وبناء أنظمة أتمتة ذكية وبوتات مخصصة للشركات.',
      gigPriceRange: '$600 - $1,800 / للمشروع',
      careerImpact: 'التفوق على 90% من المبرمجين التقليديين عبر إتقان هندسة الأوامر والبرمجة المعززة بالذكاء الاصطناعي بسرعة 10x.',
      saasCapability: 'إطلاق أدوات AI Micro-SaaS مطلوبة بشدة في السوق العالمي وتحقيق دخل متكرر منها.',
      beforeState: 'تكتب كل سطر كود يدوياً ببطء وتستغرق أسابيع في إصلاح الأخطاء البرمجية البسيطة.',
      afterState: 'تقود وكلاء الذكاء الاصطناعي كمدير هندسي لينجزوا معك مشاريع كاملة في ساعات معدودة.'
    };
  }

  if (combined.includes('docker') || combined.includes('cloud') || combined.includes('سحاب') || combined.includes('نشر') || combined.includes('أمان') || combined.includes('security')) {
    return {
      freelanceGig: 'نشر التطبيقات على السحابة (Cloud Deployment)، إعداد الحاويات، وتأمين المنصات ضد الاختراق.',
      gigPriceRange: '$300 - $850 / للخدمة',
      careerImpact: 'اكتساب مهارات DevOps وأمن التطبيقات التي تجعلك مهندساً نادراً لا غنى عنه في أي فريق تقني.',
      saasCapability: 'إطلاق مشاريعك للعالم الحقيقي على خوادم سحابية مستقرة وآمنة تعمل على مدار الساعة.',
      beforeState: 'مشاريعك حبيسة جهازك الشخصي (localhost) ولا تعرف كيف يراها العالم أو كيف تحميها.',
      afterState: 'تنشر أنظمتك سحابياً بروابط رسمية مؤمنة وتتحكم في تحديثاتها بضغطة زر.'
    };
  }

  return {
    freelanceGig: `تقديم استشارات وخدمات برمجية متخصصة في (${title}) وإنجاز مهام تقنية للعملاء.`,
    gigPriceRange: `$${150 + (order * 40)} - $${400 + (order * 60)} / للمشروع`,
    careerImpact: `تأسيس قاعدة هندسية صلبة في (${title}) تمنحك ثقة كاملة في النقاشات والمقابلات التقنية.`,
    saasCapability: 'امتلاك اللبنة الهندسية الأساسية التي تمكنك من بناء وتوسيع منتجاتك البرمجية الخاصة.',
    beforeState: 'تشعر بالرهبة من المصطلحات التقنية المعقدة ولا تعرف من أين تبدأ التطبيق العملي.',
    afterState: 'تفهم الفلسفة العميقة للمفهوم بأسلوب مبسط وتطبقها بيدك في مشروع موثق على GitHub.'
  };
};

const Academy = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'certificates' | 'crash_courses' | 'standalone'
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [activeHorizonTab, setActiveHorizonTab] = useState('freelance'); // 'freelance' | 'career' | 'saas' | 'transformation'
  const [expandedCourseIdx, setExpandedCourseIdx] = useState(0); // لفتح تفاصيل الكراش كورس داخل صفحة الشهادة
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicCourses = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5001/api/courses/public');
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        console.error('خطأ في جلب الكورسات:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicCourses();
  }, []);

  // معالجة جميع الكورسات وتجميع الشهادات المهنية مع حساب آفاقها الكلية
  const { enrichedCourses, certificateGroups } = useMemo(() => {
    const parsed = courses.map(parseCourseHierarchy);

    const groupsMap = {};
    parsed.forEach(c => {
      if (c.isPartOfCertificate && c.parentCertTitle) {
        if (!groupsMap[c.parentCertTitle]) {
          groupsMap[c.parentCertTitle] = {
            certTitle: c.parentCertTitle,
            certDescription: c.parentCertDescription || null,
            mainAnalogy: c.mainAnalogy || null,
            careerROI: c.careerROI || null,
            courses: [],
            totalHours: 0,
            totalXP: 0,
            allSkills: new Set(),
            totalPrice: 0
          };
        }
        groupsMap[c.parentCertTitle].courses.push(c);
        groupsMap[c.parentCertTitle].totalHours += c.estimatedHours;
        groupsMap[c.parentCertTitle].totalXP += c.xpReward;
        groupsMap[c.parentCertTitle].totalPrice += (c.price || 0);
        if (!groupsMap[c.parentCertTitle].certDescription && c.parentCertDescription) {
          groupsMap[c.parentCertTitle].certDescription = c.parentCertDescription;
        }
        if (!groupsMap[c.parentCertTitle].mainAnalogy && c.mainAnalogy) {
          groupsMap[c.parentCertTitle].mainAnalogy = c.mainAnalogy;
        }
        if (!groupsMap[c.parentCertTitle].careerROI && c.careerROI) {
          groupsMap[c.parentCertTitle].careerROI = c.careerROI;
        }
        c.extractedSkills.forEach(sk => groupsMap[c.parentCertTitle].allSkills.add(sk));
      }
    });

    const groupsArray = Object.values(groupsMap).map(group => {
      const sortedCourses = [...group.courses].sort((a, b) => a.courseOrder - b.courseOrder);
      return {
        ...group,
        courses: sortedCourses,
        skillsList: Array.from(group.allSkills),
        estimatedMonths: Math.max(2, Math.round(group.totalHours / 40)),
        marketValueUSD: sortedCourses.length * 190
      };
    });

    return { enrichedCourses: parsed, certificateGroups: groupsArray };
  }, [courses]);

  const filteredCrashCourses = enrichedCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.cleanDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.parentCertTitle && course.parentCertTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeTab === 'standalone') return !course.isPartOfCertificate;
    return true;
  }).sort((a, b) => a.courseOrder - b.courseOrder);

  const filteredCertificates = certificateGroups.filter(cert =>
    cert.certTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.courses.some(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ============================================================================
  // 👑 الواجهة الملحمية لتفاصيل الشهادة المهنية الخارقة (High-Dopamine Certificate Page)
  // ============================================================================
  if (selectedCertificate) {
    const firstCourse = selectedCertificate.courses[0];
    const jobRoles = selectedCertificate.careerROI?.jobRoles || [
      'Full-Stack Software Engineer',
      'AI-Augmented Application Developer',
      'Backend & Cloud Solutions Architect',
      'Freelance Technical Consultant & SaaS Founder'
    ];

    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 py-10 px-6 pb-28 animate-fade-in-up academy-typography" dir="rtl">
        
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
          .academy-typography { font-family: 'Readex Pro', sans-serif; }
          .heading-alex { font-family: 'Alexandria', sans-serif; line-height: 1.5 !important; }
          .mono-code { font-family: 'JetBrains Mono', monospace; }
        `}} />

        <div className="max-w-6xl mx-auto space-y-14">
          
          {/* شريط العودة العلوي */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button 
              onClick={() => { setSelectedCertificate(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              <ArrowRight size={18} /> العودة إلى كتالوج الأكاديمية
            </button>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                مكافأة المسار: +{selectedCertificate.totalXP.toLocaleString()} EXP (ترقية لرتبة S-Rank)
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 1. الهيرو الملحمي للشهادة المهنية + بطاقة القيمة المكدسة (Value Stack) */}
          {/* ================================================================= */}
          <div className="bg-gradient-to-br from-indigo-950/70 via-[#0b1120] to-[#070b14] border-2 border-amber-500/50 rounded-3xl p-8 md:p-12 shadow-[0_0_70px_rgba(245,158,11,0.15)] relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* تفاصيل الشهادة والوصف المعمق */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                    <Trophy size={15} /> شهادة مهنية شاملة (Professional Certificate)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    <Sparkles size={14} /> منهجية التبسيط المطلق (ELI5 👶) + AI Agents
                  </span>
                </div>

                <h1 className="heading-alex text-3xl md:text-5xl font-black text-white">
                  {selectedCertificate.certTitle}
                </h1>

                <div className="space-y-4 text-slate-300 text-base leading-[1.95]">
                  <p>
                    {selectedCertificate.certDescription || `هذا ليس مجرد كورس عادي، بل هو معسكر تحول مهني ومادي متكامل يأخذك بيدك من الصفر المطلق (دون أي خبرة سابقة) عبر سلسلة مترابطة من (${selectedCertificate.courses.length} كراش كورس) متدرجة الصعوبة بأسلوب القصة والتبسيط لطفل صغير، حتى تصل إلى مستوى مهندس محترف قادر على بناء أنظمة كاملة، قيادة وكلاء الذكاء الاصطناعي (AI Agents)، وإطلاق منتجاتك الرقمية الخاصة.`}
                  </p>

                  {selectedCertificate.mainAnalogy && (
                    <div className="bg-indigo-950/40 border-r-4 border-indigo-400 p-4 rounded-l-2xl text-sm text-indigo-200">
                      <strong className="text-white block mb-1">🎭 القصة والتشبيه الممتد عبر جميع الكورسات (ELI5 Storyline):</strong>
                      {selectedCertificate.mainAnalogy}
                    </div>
                  )}
                </div>

                {/* بطاقات الأرقام التحفيزية (Dopamine Metrics) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                  <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl">
                    <Layers className="text-indigo-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">{selectedCertificate.courses.length} كراش كورس</p>
                    <p className="text-[11px] text-slate-400">سلسلة متصلة من الصفر للاحتراف</p>
                  </div>
                  <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl">
                    <Clock className="text-emerald-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">{selectedCertificate.totalHours} ساعة</p>
                    <p className="text-[11px] text-slate-400">~{selectedCertificate.estimatedMonths} أشهر (أو شهرين مكثف)</p>
                  </div>
                  <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl">
                    <GitBranch className="text-amber-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">{selectedCertificate.courses.length} مشروع حي</p>
                    <p className="text-[11px] text-slate-400">تُبنى مع AI Agent وتُرفع لـ GitHub</p>
                  </div>
                  <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl">
                    <Award className="text-purple-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">{selectedCertificate.courses.length + 1} شهادة</p>
                    <p className="text-[11px] text-slate-400">{selectedCertificate.courses.length} فرعية + 1 شهادة خارقة</p>
                  </div>
                </div>
              </div>

              {/* بطاقة تكديس القيمة والاشتراك الفوري (High-Conversion Value Stack Card) */}
              <div className="lg:col-span-4 bg-slate-950/95 border-2 border-amber-500/40 rounded-3xl p-7 space-y-5 shadow-2xl relative">
                <div className="text-center pb-4 border-b border-slate-800">
                  <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    💎 القيمة الفعلية للمسار والمشاريع: <del className="text-slate-400">${selectedCertificate.marketValueUSD}</del>
                  </span>
                  <div className="text-4xl font-black text-emerald-400 mt-3">
                    {selectedCertificate.totalPrice === 0 ? 'مجاني بالكامل!' : `$${selectedCertificate.totalPrice}`}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">وصول فوري لجميع الكورسات الـ {selectedCertificate.courses.length} مدى الحياة</p>
                </div>

                {/* تكديس المكافآت التي يحصل عليها الطالب */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <p className="font-black text-white text-sm mb-2">ماذا ستمتلك عند دخولك هذه الشهادة؟</p>
                  <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> {selectedCertificate.courses.length} كراش كورس تفاعلي</span>
                    <span className="mono-code text-slate-500 line-through">${selectedCertificate.courses.length * 100}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> {selectedCertificate.courses.length} ورشة مشروع GitHub & AI</span>
                    <span className="mono-code text-slate-500 line-through">$450</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> مصحح أكواد ذكي + 3 تلميحات</span>
                    <span className="mono-code text-slate-500 line-through">$250</span>
                  </div>
                  <div className="flex items-center justify-between bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30 text-amber-300 font-bold">
                    <span className="flex items-center gap-2"><Trophy size={15} className="text-amber-400"/> الشهادة المهنية الخارقة (S-Rank)</span>
                    <span className="text-emerald-400">مشمولة ✓</span>
                  </div>
                </div>

                {firstCourse && (
                  <Link
                    to={`/course/${firstCourse._id}`}
                    className="heading-alex w-full bg-gradient-to-l from-amber-500 via-yellow-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5 transition-all text-base"
                  >
                    <Rocket size={20} /> ابدأ من الكراش كورس 1 الآن
                  </Link>
                )}

                <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" /> توثيق رقمي فوري لكل شهادة تنهيها في حسابك
                </p>
              </div>

            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. قسم الآفاق الكبرى التي تفتحها لك هذه الشهادة المهنية (Interactive Horizons Matrix) */}
          {/* ================================================================= */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-8 md:p-10 space-y-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Compass size={16} /> الآفاق المهنية والمادية بعد التخرج
                </span>
                <h2 className="heading-alex text-2xl md:text-3xl font-black text-white">
                  ما هي الأبواب والفرص المالية التي ستفتحها لك هذه الشهادة المهنية؟
                </h2>
              </div>

              {/* تبويبات الآفاق التفاعلية */}
              <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                {[
                  { id: 'freelance', label: '💰 آفاق العمل الحر ($)' },
                  { id: 'career', label: '🏢 آفاق التوظيف والشركات' },
                  { id: 'saas', label: '🚀 آفاق بناء منتجات SaaS' },
                  { id: 'transformation', label: '⚡ التحول (قبل vs بعد)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHorizonTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeHorizonTab === tab.id
                        ? 'bg-emerald-500 text-slate-950 font-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* محتوى التبويب 1: العمل الحر */}
            {activeHorizonTab === 'freelance' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in-up">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                    <DollarSign size={14} /> عائد مالي مباشر من أول شهرين
                  </div>
                  <h3 className="heading-alex text-xl md:text-2xl font-bold text-white">
                    لا تنتظر التخرج النهائي لتبدأ الربح.. كل كراش كورس يمنحك خدمة قابلة للبيع!
                  </h3>
                  <p className="text-slate-300 text-sm leading-[1.9]">
                    تم تصميم هذه الشهادة بحيث ينتهي كل كراش كورس بمشروع كامل ترفعه على GitHub. هذا يعني أنك بعد الكورس الثالث فقط تمتلك معرض أعمال يمكنك به التقدم لمشاريع العملاء على <strong className="text-white">Upwork ومستقل وبحر</strong>، وبنهاية الشهادة ستكون قادراً على استلام مشاريع أنظمة كاملة.
                  </p>
                  <div className="space-y-2.5 pt-2">
                    {selectedCertificate.courses.slice(0, 4).map((c, i) => (
                      <div key={i} className="bg-slate-950 border border-slate-800/90 p-3.5 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">{c.horizons.freelanceGig}</p>
                            <p className="text-[11px] text-slate-500">تفتح لك بعد إنهاء: {c.shortCleanTitle}</p>
                          </div>
                        </div>
                        <span className="mono-code text-xs font-bold text-emerald-400 shrink-0" dir="ltr">
                          {c.horizons.gigPriceRange}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-gradient-to-b from-emerald-950/30 to-slate-950 border border-emerald-500/30 rounded-3xl p-7 space-y-5">
                  <TrendingUp className="text-emerald-400" size={36} />
                  <h4 className="heading-alex text-lg font-bold text-white">متوسط تسعير مشاريع الخريجين</h4>
                  <div className="text-3xl font-black text-emerald-400 mono-code" dir="ltr">$800 - $3,500</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    قيمة المشروع المتكامل الواحد الذي تستطيع بناءه وتسليمه للعميل في أسبوع واحد بفضل إتقانك لأدوات الـ <strong className="text-white">AI Agents</strong> المشروحة في نهاية كل كراش كورس.
                  </p>
                </div>
              </div>
            )}

            {/* محتوى التبويب 2: التوظيف والشركات */}
            {activeHorizonTab === 'career' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in-up">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="heading-alex text-xl md:text-2xl font-bold text-white">
                    المسميات الوظيفية التي تؤهلك لها هذه الشهادة المهنية:
                  </h3>
                  <p className="text-slate-300 text-sm leading-[1.9]">
                    الشركات في عام 2026 لا تبحث عن شخص يحفظ الأكواد نظرياً، بل تبحث عن مهندس يمتلك <strong className="text-amber-400">معرض مشاريع موثق على GitHub</strong> ويجيد استخدام الذكاء الاصطناعي لمضاعفة إنتاجيته:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {jobRoles.map((role, idx) => (
                      <div key={idx} className="bg-slate-950 border border-indigo-500/30 p-4 rounded-2xl flex items-center gap-3">
                        <Briefcase size={18} className="text-indigo-400 shrink-0" />
                        <span className="font-bold text-sm text-white" dir="ltr">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-7 space-y-4">
                  <Award className="text-amber-400" size={36} />
                  <h4 className="heading-alex text-lg font-bold text-white">لماذا تقنع شهادتنا مسؤولي التوظيف (HR)؟</h4>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2"><CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5"/> <span>رابط تحقق رقمي مباشر يثبت اجتيازك للبوابات الحمراء واختبارات الوحدات.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5"/> <span>{selectedCertificate.courses.length} مستودع كود (Repository) جاهز للفحص في حسابك على GitHub.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5"/> <span>إتقان الفهم الهندسي العميق (Code Anatomy) الذي يجعلك تجيب عن أي سؤال تقني بثقة.</span></li>
                  </ul>
                </div>
              </div>
            )}

            {/* محتوى التبويب 3: بناء منتجات SaaS */}
            {activeHorizonTab === 'saas' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in-up">
                <div className="space-y-4">
                  <h3 className="heading-alex text-xl md:text-2xl font-bold text-white">
                    تحوّل من "باحث عن عمل" إلى "مؤسس منتجات رقمية (Micro-SaaS Founder)"
                  </h3>
                  <p className="text-slate-300 text-sm leading-[1.9]">
                    في الوحدة الأخيرة من كل كراش كورس، لا نعلمك فقط كيف تكتب الكود، بل نعطيك <strong className="text-emerald-400">الأوامر الحرفية الجاهزة (Prompts) لوكلاء الذكاء الاصطناعي</strong> لتبني أنظمة كاملة بمفردك كما لو كان لديك فريق من 5 مبرمجين.
                  </p>
                </div>
                <div className="bg-slate-950 border border-amber-500/30 rounded-3xl p-6 space-y-3">
                  <p className="text-xs font-black text-amber-400">🚀 مشاريع حقيقية ستكون في حوزتك وقابلة للتحويل إلى مشروع تجاري:</p>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {selectedCertificate.courses.map((c, i) => (
                      <div key={i} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-xs flex items-center gap-2.5">
                        <GitBranch size={14} className="text-emerald-400 shrink-0" />
                        <span className="text-white font-semibold">{c.githubProjectTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* محتوى التبويب 4: مقارنة التحول قبل وبعد */}
            {activeHorizonTab === 'transformation' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                <div className="bg-red-950/15 border border-red-500/30 rounded-2xl p-6 space-y-3">
                  <span className="text-xs font-black text-red-400 bg-red-500/10 px-3 py-1 rounded-full">❌ قبل دخول الشهادة المهنية</span>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 pt-2">
                    <li>• تشتت بين عشرات الفيديوهات العشوائية دون خريطة طريق واضحة.</li>
                    <li>• خوف من كتابة الكود من الصفر أمام الشاشة السوداء.</li>
                    <li>• عدم معرفة كيفية استخدام أدوات الـ AI لبناء مشاريع حقيقية.</li>
                    <li>• سيرة ذاتية وحساب GitHub فارغ لا يقنع الشركات أو العملاء.</li>
                  </ul>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-6 space-y-3">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">✅ بعد إتمام الشهادة المهنية الخارقة</span>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 pt-2">
                    <li>• فهم عميق ومبسط لكل تقنية بفضل منهجية فاينمان وتشريح الكود.</li>
                    <li>• سرعة برمجة مضاعفة 10x بقيادة وكلاء الذكاء الاصطناعي (AI Agents).</li>
                    <li>• امتلاك {selectedCertificate.courses.length} مشروعاً كاملاً مرفوعاً على حسابك في GitHub.</li>
                    <li>• حمل {selectedCertificate.courses.length} شهادة فرعية + الشهادة المهنية الكبرى الموثقة.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* 3. الخريطة التفصيلية للكراش كورسات والآفاق التي يفتحها كل كورس على حدة */}
          {/* ================================================================= */}
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-5">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-1">
                خريطة التدرج المعماري الكاملة (Skill Tree)
              </span>
              <h2 className="heading-alex text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <Layers className="text-indigo-400" /> تفصيل الكراش كورسات والآفاق التي يفتحها كل كورس ({selectedCertificate.courses.length} كورس)
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                اضغط على أي كراش كورس لاستعراض وصفه الكامل، المهارات التي يمنحك إياها، والآفاق المادية والمهنية التي ستفتح لك فور إنهائه.
              </p>
            </div>

            <div className="space-y-5">
              {selectedCertificate.courses.map((course, idx) => {
                const isExpanded = expandedCourseIdx === idx;

                return (
                  <div 
                    key={course._id || idx} 
                    className={`bg-[#0b1120] border-2 rounded-3xl transition-all overflow-hidden shadow-xl ${
                      isExpanded ? 'border-indigo-500/60 shadow-[0_0_35px_rgba(99,102,241,0.12)]' : 'border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    {/* رأس بطاقة الكراش كورس */}
                    <div 
                      onClick={() => setExpandedCourseIdx(isExpanded ? -1 : idx)}
                      className="p-6 md:p-7 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-900/40 transition-colors"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-indigo-600 text-white text-xs font-black px-3.5 py-1 rounded-full">
                            الكراش كورس {idx + 1} من {selectedCertificate.courses.length}
                          </span>
                          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Zap size={12} /> +{course.xpReward} EXP
                          </span>
                          <span className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Clock size={12} className="text-indigo-400" /> {course.estimatedHours} ساعة
                          </span>
                          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Award size={13} /> {course.subCertBadge}
                          </span>
                        </div>

                        <h3 className="heading-alex text-xl md:text-2xl font-bold text-white">
                          {course.title}
                        </h3>

                        <p className="text-slate-300 text-sm leading-[1.85]">
                          {course.cleanDescription}
                        </p>

                        {/* شريط الآفاق السريع لهذا الكراش كورس */}
                        <div className="inline-flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs text-emerald-300">
                          <DollarSign size={14} className="text-emerald-400 shrink-0" />
                          <span><strong>الأفق الفوري بعد هذا الكورس:</strong> {course.horizons.freelanceGig} (<span dir="ltr" className="text-white font-bold">{course.horizons.gigPriceRange}</span>)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Link
                          to={`/course/${course._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2 transition-all"
                        >
                          <PlayCircle size={18} /> صفحة الكورس والتفاصيل
                        </Link>
                        <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-indigo-400 border-indigo-500/40' : ''}`}>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>

                    {/* التفاصيل الموسعة للكراش كورس وآفاقه ومشروعه */}
                    {isExpanded && (
                      <div className="px-6 pb-7 pt-4 border-t border-slate-800/80 bg-slate-950/60 space-y-6 animate-fade-in-up">
                        
                        {/* الوصف التربوي العميق */}
                        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
                          <h4 className="text-xs font-black text-indigo-400 mb-1.5 flex items-center gap-1.5">
                            <BookOpen size={14} /> ماذا ستدرس بالتفصيل في الكراش كورس رقم {idx + 1}؟
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300 leading-[1.9]">
                            {course.richExtendedDescription}
                          </p>
                        </div>

                        {/* بطاقات الآفاق الثلاث التي يفتحها هذا الكراش كورس */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl space-y-1.5">
                            <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5">
                              <DollarSign size={14} /> 1. أفق العمل الحر بعد هذا الكورس
                            </span>
                            <p className="text-xs text-slate-200 leading-relaxed">{course.horizons.freelanceGig}</p>
                            <p className="mono-code text-xs font-bold text-amber-400 pt-1" dir="ltr">العائد المتوقع: {course.horizons.gigPriceRange}</p>
                          </div>

                          <div className="bg-slate-900/90 border border-indigo-500/30 p-4 rounded-2xl space-y-1.5">
                            <span className="text-[11px] font-black text-indigo-400 flex items-center gap-1.5">
                              <Briefcase size={14} /> 2. الأفق الوظيفي والهندسي
                            </span>
                            <p className="text-xs text-slate-200 leading-relaxed">{course.horizons.careerImpact}</p>
                          </div>

                          <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl space-y-1.5">
                            <span className="text-[11px] font-black text-amber-400 flex items-center gap-1.5">
                              <GitBranch size={14} /> 3. مشروع GitHub & AI Agent
                            </span>
                            <p className="text-xs font-bold text-white">{course.githubProjectTitle}</p>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{course.githubProjectSummary}</p>
                          </div>
                        </div>

                        {/* المهارات المكتسبة في هذا الكورس */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">المهارات المكتسبة:</span>
                            {course.extractedSkills.map((sk, sIdx) => (
                              <span key={sIdx} className="bg-slate-900 border border-slate-700 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-lg" dir="ltr">
                                ✓ {sk}
                              </span>
                            ))}
                          </div>

                          <Link
                            to={`/course/${course._id}`}
                            className="text-xs font-black text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
                          >
                            عرض جميع وحدات ودروس هذا الكورس <ChevronLeft size={15} />
                          </Link>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 🚀 شريط الدوبامين والتحويل السفلي العائم (Sticky Bottom CTA Bar) */}
        {firstCourse && (
          <div className="fixed bottom-0 inset-x-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-amber-500/30 py-3.5 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-white line-clamp-1">{selectedCertificate.certTitle}</p>
                  <p className="text-[11px] text-emerald-400 font-bold">
                    {selectedCertificate.courses.length} كراش كورسات • {selectedCertificate.courses.length} مشاريع GitHub • +{selectedCertificate.totalXP.toLocaleString()} EXP
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to={`/course/${firstCourse._id}`}
                  className="heading-alex w-full sm:w-auto bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm py-3 px-7 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all"
                >
                  <Rocket size={17} /> ابدأ الآن مجاناً من الكورس الأول
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 🏛️ الواجهة الرئيسية لكتالوج الأكاديمية (شهادات مهنية + كراش كورسات مصنفة)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#020617] py-10 px-6 animate-fade-in-up text-slate-200 academy-typography" dir="rtl">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
        .academy-typography { font-family: 'Readex Pro', sans-serif; }
        .heading-alex { font-family: 'Alexandria', sans-serif; line-height: 1.5 !important; }
        .mono-code { font-family: 'JetBrains Mono', monospace; }
      `}} />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* الترويسة وشريط البحث والفلاتر */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0b1120] to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4 z-10">
            <Sparkles size={14} /> شهادات مهنية خارقة + كراش كورسات بتبسيط ELI5 👶 + آفاق مادية واضحة
          </span>

          <h1 className="heading-alex text-3xl md:text-5xl font-black text-white mb-4 z-10">
            أكاديمية <span className="text-emerald-400" dir="ltr">Cherif.Dev</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl mb-8 z-10 leading-[1.9]">
            كل مسار هنا مصمم ليمنحك <strong className="text-amber-400">أصلاً رقمياً على GitHub</strong> و<strong className="text-emerald-400">مهارة قابلة للبيع في سوق العمل الحر والشركات</strong>. اختر شهادة مهنية متكاملة أو ابدأ بكراش كورس متخصص.
          </p>

          {/* شريط البحث */}
          <div className="relative w-full max-w-xl z-10 mb-8">
            <Search className="absolute right-4 top-4 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن شهادة مهنية، تقنية، أو مهارة للربح (مثال: MERN، بايثون، ذكاء اصطناعي)..." 
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-2xl py-4 pr-12 pl-4 focus:border-emerald-500 outline-none transition-all shadow-inner text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* أزرار التقسيم الرئيسية */}
          <div className="flex flex-wrap justify-center gap-2.5 z-10 bg-slate-950/90 p-2 rounded-2xl border border-slate-800">
            {[
              { id: 'all', label: '🌟 العرض الشامل (الشهادات + الكراش كورسات)' },
              { id: 'certificates', label: `👑 الشهادات المهنية الخارقة (${certificateGroups.length})` },
              { id: 'crash_courses', label: `⚡ جميع الكراش كورسات (${enrichedCourses.length})` },
              { id: 'standalone', label: '🎯 كراش كورسات وحيدة (مستقلة)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* 👑 القسم الأول: الشهادات المهنية الخارقة (Professional Certificates) */}
            {/* ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'certificates') && filteredCertificates.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="heading-alex text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
                      <Trophy className="text-amber-400" size={28} /> الشهادات المهنية المعتمدة (Professional Certificates)
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      برامج متكاملة تضم سلسلة كراش كورسات متدرجة، تفتح لك آفاق التوظيف، العمل الحر، وبناء مشاريع الـ SaaS.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {filteredCertificates.map((cert, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gradient-to-br from-indigo-950/45 via-[#0b1120] to-[#0b1120] border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl p-7 md:p-9 shadow-2xl transition-all"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        <div className="lg:col-span-8 space-y-5">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full flex items-center gap-1.5">
                              <Trophy size={14} /> شهادة مهنية خارقة (S-Rank)
                            </span>
                            <span className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
                              📚 سلسلة من {cert.courses.length} كراش كورس
                            </span>
                            <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                              ⏱️ {cert.totalHours} ساعة (~{cert.estimatedMonths} أشهر)
                            </span>
                            <span className="bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full">
                              ⚡ +{cert.totalXP.toLocaleString()} EXP
                            </span>
                          </div>

                          <h3 className="heading-alex text-2xl md:text-3xl font-black text-white">
                            {cert.certTitle}
                          </h3>

                          <p className="text-slate-300 text-sm leading-[1.9]">
                            {cert.certDescription || `تأخذك هذه الشهادة المهنية في رحلة متسلسلة من الصفر المطلق (${cert.courses[0]?.shortCleanTitle}) بأسلوب التبسيط لطفل صغير (ELI5)، وتصعد بك تدريجياً حتى الاحتراف الكامل (${cert.courses[cert.courses.length - 1]?.shortCleanTitle}). في نهاية كل كراش كورس تبني مشروعاً حقيقياً بمساعدة AI Agent وترفعه على GitHub لتخرج بمعرض أعمال لا يُقاوم.`}
                          </p>

                          {/* معاينة الآفاق الثلاثة للشهادة داخل البطاقة */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <div className="bg-slate-950/80 border border-slate-800/90 p-3 rounded-2xl text-xs">
                              <span className="text-emerald-400 font-bold block mb-1">💰 أفق العمل الحر:</span>
                              <span className="text-slate-300">بناء وبيع أنظمة كاملة ($800 - $3,500)</span>
                            </div>
                            <div className="bg-slate-950/80 border border-slate-800/90 p-3 rounded-2xl text-xs">
                              <span className="text-indigo-400 font-bold block mb-1">🏢 الأفق الوظيفي:</span>
                              <span className="text-slate-300">جاهزية كاملة لمقابلات الشركات التقنية</span>
                            </div>
                            <div className="bg-slate-950/80 border border-slate-800/90 p-3 rounded-2xl text-xs">
                              <span className="text-amber-400 font-bold block mb-1">🐙 أصولك على GitHub:</span>
                              <span className="text-slate-300">{cert.courses.length} مشروعاً موثقاً بمساعدة AI Agent</span>
                            </div>
                          </div>

                          {/* المهارات المكتسبة */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cert.skillsList.slice(0, 8).map((sk, sIdx) => (
                              <span key={sIdx} className="bg-slate-900 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-lg font-medium" dir="ltr">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* بطاقة الدخول لتفاصيل الشهادة المهنية */}
                        <div className="lg:col-span-4 bg-slate-950/90 border border-amber-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xl">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                              <span className="text-[11px] text-slate-400 block">القيمة السوقية للمسار</span>
                              <span className="mono-code text-sm text-slate-500 line-through">${cert.marketValueUSD}</span>
                            </div>
                            <div className="text-left">
                              <span className="text-[11px] text-emerald-400 font-bold block">متاح الآن</span>
                              <span className="text-xl font-black text-white">
                                {cert.totalPrice === 0 ? 'مجاناً 100%' : `$${cert.totalPrice}`}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2.5 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span>خريطة طريق مفصلة لـ {cert.courses.length} كراش كورس</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span>{cert.courses.length} شهادة فرعية + 1 شهادة مهنية خارقة</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span>تفصيل الآفاق المهنية والمادية لكل كورس</span>
                            </div>
                          </div>

                          <button
                            onClick={() => { setSelectedCertificate(cert); setExpandedCourseIdx(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="heading-alex w-full bg-gradient-to-l from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-4 px-5 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 text-sm"
                          >
                            <Award size={18} /> استكشف الشهادة والآفاق ({cert.courses.length} كورسات)
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ⚡ القسم الثاني: الكراش كورسات التفاعلية (مع الوصف الغني والآفاق تحت كل كورس) */}
            {/* ========================================================================= */}
            {activeTab !== 'certificates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="heading-alex text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
                      <Zap className="text-emerald-400" size={28} /> 
                      {activeTab === 'standalone' ? 'الكراش كورسات الوحيدة (المستقلة)' : 'الكراش كورسات التفاعلية (Crash Courses)'}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      كل كراش كورس يوضح لك تبعيته للشهادة المهنية، نقاط الـ EXP، والأفق المادي والمهني الذي يفتحه لك فور إتمامه.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCrashCourses.length > 0 ? (
                    filteredCrashCourses.map((course) => {
                      const parentGroup = certificateGroups.find(g => g.certTitle === course.parentCertTitle);

                      return (
                        <div 
                          key={course._id} 
                          className="bg-[#0b1120] border border-slate-800 rounded-3xl overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.12)] transition-all flex flex-col"
                        >
                          {/* غلاف الكورس مع شارات الدوبامين */}
                          <div className="h-44 bg-slate-900 relative overflow-hidden">
                            {course.thumbnail ? (
                              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-950 p-4 text-center">
                                <BookOpen size={38} className="text-emerald-400/80 mb-2" />
                                <span className="text-[11px] font-bold text-slate-300">ELI5 Storyline + Live Code Sandbox</span>
                              </div>
                            )}

                            <div className="absolute top-3.5 left-3.5 bg-slate-950/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg font-black text-xs border border-slate-700">
                              {course.price === 0 ? <span className="text-emerald-400">مجاني</span> : `$${course.price}`}
                            </div>

                            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                              {course.isPartOfCertificate && (
                                <span className="bg-indigo-600/95 text-white px-2.5 py-1 rounded-lg font-black text-[11px]">
                                  الكورس {course.courseOrder}
                                </span>
                              )}
                              <span className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-lg font-black text-[11px]">
                                +{course.xpReward} EXP
                              </span>
                            </div>
                          </div>

                          {/* تفاصيل الكورس والآفاق */}
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center justify-between text-xs mb-2.5">
                              <div className="flex items-center gap-1 text-amber-400">
                                <Star size={13} fill="currentColor" />
                                <Star size={13} fill="currentColor" />
                                <Star size={13} fill="currentColor" />
                                <Star size={13} fill="currentColor" />
                                <Star size={13} fill="currentColor" />
                                <span className="text-slate-500 mr-1">(5.0)</span>
                              </div>
                              <span className="text-slate-400 font-bold flex items-center gap-1">
                                <Clock size={12} className="text-emerald-400"/> {course.estimatedHours} ساعة
                              </span>
                            </div>
                            
                            <h3 className="heading-alex text-lg font-bold text-white mb-2.5 line-clamp-2">
                              {course.title}
                            </h3>

                            {/* الشارة المطلوبة تحت العنوان: تابع لشهادة مهنية أم كراش كورس وحيد */}
                            {course.isPartOfCertificate ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (parentGroup) {
                                    setSelectedCertificate(parentGroup);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }
                                }}
                                className="w-full text-right mb-3 p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-start gap-2 transition-all"
                              >
                                <Link2 size={15} className="shrink-0 mt-0.5 text-amber-400" />
                                <span className="line-clamp-2">
                                  تابع للشهادة المهنية: <strong className="text-white underline">{course.parentCertTitle}</strong>
                                </span>
                              </button>
                            ) : (
                              <div className="mb-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold flex items-center gap-2">
                                <Zap size={14} className="shrink-0" />
                                <span>كراش كورس وحيد ومستقل (Standalone)</span>
                              </div>
                            )}

                            <p className="text-slate-300 text-xs leading-[1.8] mb-4 line-clamp-3">
                              {course.cleanDescription}
                            </p>

                            {/* 🆕 صندوق الأفق المهني والمادي الذي يفتحه هذا الكراش كورس */}
                            <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-3 mb-4 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-black text-emerald-400 flex items-center gap-1">
                                  <TrendingUp size={13} /> الأفق الذي يفتحه لك الكورس:
                                </span>
                                <span className="mono-code text-amber-300 font-bold" dir="ltr">
                                  {course.horizons.gigPriceRange}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                                {course.horizons.freelanceGig}
                              </p>
                            </div>
                            
                            <div className="mt-auto space-y-3">
                              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 text-[11px] text-slate-300 flex items-center gap-2">
                                <Award size={14} className="text-amber-400 shrink-0" />
                                <span className="truncate">يمنح: {course.subCertBadge}</span>
                              </div>
                              
                              <Link 
                                to={`/course/${course._id}`} 
                                className="heading-alex block w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-center font-black py-3 rounded-xl transition-all shadow-[0_5px_20px_rgba(16,185,129,0.25)] text-xs sm:text-sm"
                              >
                                استكشف الكورس وآفاقه الكاملة
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-20 text-slate-500">
                      <BookOpen size={48} className="mx-auto mb-4 text-slate-700" />
                      <p>لا توجد كورسات تطابق بحثك حالياً.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Academy;