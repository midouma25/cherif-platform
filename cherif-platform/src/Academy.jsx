import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, BookOpen, Clock, PlayCircle, Star, Award, Trophy, Zap, 
  GitBranch, Bot, Layers, CheckCircle2, ArrowRight, ChevronLeft, 
  Sparkles, DollarSign, Briefcase, Rocket, Link2, ShieldCheck, Code, Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ============================================================================
// 🧠 المحرك الذكي لتحليل الكورسات وربطها بالشهادات المهنية تلقائياً
// ============================================================================
export const parseCourseHierarchy = (course) => {
  const rawTitle = course?.title || '';
  const rawDesc = course?.description || '';
  const meta = course?.certificateMeta || {};

  // 1. محاولة استخراج اسم الشهادة الأم من certificateMeta أو من نص الوصف (ضمن ...)
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

  // 2. استخراج رقم الكراش كورس بالترتيب (مثال: الكراش كورس 1 أو الكورس 3 أو Course 2)
  let courseOrder = meta.courseOrder || null;
  if (!courseOrder) {
    const orderMatch = rawTitle.match(/(?:كراش كورس|الكورس|كورس|Course)\s*(\d+)/i);
    if (orderMatch) courseOrder = parseInt(orderMatch[1], 10);
  }

  // 3. تنظيف الوصف من نصوص الربط التقنية ليظهر بشكل أنيق للمستخدم
  const cleanDescription = rawDesc
    .replace(/\|\s*🏆\s*يمنح:.*$/, '')
    .trim();

  // 4. استنتاج المهارات واسم مشروع GitHub
  const defaultSkills = meta.skills?.length > 0 
    ? meta.skills 
    : extractKeywordsFromText(rawTitle + ' ' + cleanDescription);

  const githubProjectTitle = meta.githubProject?.projectTitle || `مشروع تطبيقي متكامل: ${rawTitle.replace(/^(الكراش كورس|الكورس)\s*\d+\s*:\s*/i, '')}`;

  const isPartOfCertificate = Boolean(parentCertTitle);

  return {
    ...course,
    cleanDescription,
    isPartOfCertificate,
    parentCertTitle: parentCertTitle || null,
    subCertBadge: subCertBadge || `شهادة إتمام ${rawTitle}`,
    courseOrder: courseOrder || 99,
    extractedSkills: defaultSkills,
    githubProjectTitle,
    estimatedHours: course.estimatedHours || 15
  };
};

// دالة مساعدة لاستخراج المهارات تلقائياً إذا لم تكن مخزنة
const extractKeywordsFromText = (text) => {
  const knownTech = [
    'HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 
    'SQL', 'Python', 'Git', 'GitHub', 'Docker', 'Cloud', 'AI Agents', 
    'Prompt Engineering', 'REST API', 'JWT', 'Tailwind', 'Next.js', 'TypeScript', 'Linux'
  ];
  const found = knownTech.filter(tech => text.toLowerCase().includes(tech.toLowerCase()));
  return found.length > 0 ? found.slice(0, 5) : ['Software Engineering', 'Problem Solving', 'AI-Assisted Coding', 'GitHub Portfolio'];
};

const Academy = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'certificates' | 'crash_courses' | 'standalone'
  const [selectedCertificate, setSelectedCertificate] = useState(null); // عند فتح صفحة الشهادة المهنية التفصيلية
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

  // معالجة جميع الكورسات وتجميع الشهادات المهنية
  const { enrichedCourses, certificateGroups } = useMemo(() => {
    const parsed = courses.map(parseCourseHierarchy);

    // تجميع الكورسات التي تشترك في نفس الشهادة المهنية
    const groupsMap = {};
    parsed.forEach(c => {
      if (c.isPartOfCertificate && c.parentCertTitle) {
        if (!groupsMap[c.parentCertTitle]) {
          groupsMap[c.parentCertTitle] = {
            certTitle: c.parentCertTitle,
            courses: [],
            totalHours: 0,
            allSkills: new Set(),
            totalPrice: 0
          };
        }
        groupsMap[c.parentCertTitle].courses.push(c);
        groupsMap[c.parentCertTitle].totalHours += c.estimatedHours;
        groupsMap[c.parentCertTitle].totalPrice += (c.price || 0);
        c.extractedSkills.forEach(sk => groupsMap[c.parentCertTitle].allSkills.add(sk));
      }
    });

    // ترتيب الكراش كورسات داخل كل شهادة مهنية من 1 إلى 15
    const groupsArray = Object.values(groupsMap).map(group => {
      const sortedCourses = [...group.courses].sort((a, b) => a.courseOrder - b.courseOrder);
      return {
        ...group,
        courses: sortedCourses,
        skillsList: Array.from(group.allSkills),
        estimatedMonths: Math.max(2, Math.round(group.totalHours / 40))
      };
    });

    return { enrichedCourses: parsed, certificateGroups: groupsArray };
  }, [courses]);

  // فلترة الكراش كورسات حسب البحث والتبويب
  const filteredCrashCourses = enrichedCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.cleanDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.parentCertTitle && course.parentCertTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeTab === 'standalone') return !course.isPartOfCertificate;
    return true;
  }).sort((a, b) => a.courseOrder - b.courseOrder);

  // فلترة الشهادات المهنية حسب البحث
  const filteredCertificates = certificateGroups.filter(cert =>
    cert.certTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.courses.some(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ============================================================================
  // 👑 الواجهة الخاصة بتفاصيل الشهادة المهنية الخارقة (عند الضغط على شهادة مهنية)
  // ============================================================================
  if (selectedCertificate) {
    const firstCourse = selectedCertificate.courses[0];

    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 py-10 px-6 animate-fade-in-up" dir="rtl">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* زر العودة للأكاديمية */}
          <button 
            onClick={() => { setSelectedCertificate(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
          >
            <ArrowRight size={18} /> العودة إلى كتالوج الأكاديمية
          </button>

          {/* 1. الهيرو الملحمي للشهادة المهنية */}
          <div className="bg-gradient-to-br from-indigo-950/60 via-[#0b1120] to-[#0b1120] border-2 border-amber-500/40 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(245,158,11,0.12)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black">
                  <Trophy size={15} /> برنامج شهادة مهنية معتمدة (Professional Certificate Series)
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.35]">
                  {selectedCertificate.certTitle}
                </h1>

                <p className="text-slate-300 text-base md:text-lg leading-[1.9]">
                  مسار احترافي متكامل يأخذك من الصفر المطلق بأسلوب <strong className="text-emerald-400">التبسيط لطفل صغير (ELI5)</strong> عبر <strong className="text-white">{selectedCertificate.courses.length} كراش كورس متسلسل</strong>، لتبني في نهاية كل كورس مشروعاً حقيقياً بمساعدة <strong className="text-amber-400">AI Agent</strong> وترفعه على حسابك في <strong className="text-white">GitHub</strong> حتى تتوج بالشهادة المهنية الخارقة.
                </p>

                {/* شريط الإحصائيات السريعة للشهادة */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                    <Layers className="text-indigo-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">{selectedCertificate.courses.length} كورسات</p>
                    <p className="text-xs text-slate-400">سلسلة مترابطة تدريجياً</p>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                    <Clock className="text-emerald-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">{selectedCertificate.totalHours} ساعة</p>
                    <p className="text-xs text-slate-400">حوالي {selectedCertificate.estimatedMonths} أشهر (10 س/أسبوع)</p>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                    <GitBranch className="text-amber-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">+{selectedCertificate.courses.length} مشاريع</p>
                    <p className="text-xs text-slate-400">تُرفع على GitHub مع AI Agent</p>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
                    <Award className="text-purple-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">{selectedCertificate.courses.length + 1} شهادة</p>
                    <p className="text-xs text-slate-400">{selectedCertificate.courses.length} فرعية + 1 شهادة خارقة</p>
                  </div>
                </div>
              </div>

              {/* بطاقة البدء الفوري واستعراض الجائزة الكبرى */}
              <div className="lg:col-span-4 bg-slate-950/90 border border-amber-500/30 rounded-3xl p-7 text-center space-y-5 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <Trophy size={34} />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase">الجائزة الكبرى عند الإتمام</span>
                  <h3 className="text-lg font-black text-white mt-1">الشهادة المهنية الخارقة (S-Rank)</h3>
                  <p className="text-xs text-slate-400 mt-1">موثقة برقم تسلسلي رسمي + شهادة مستقلة لكل كراش كورس تنهيه</p>
                </div>

                <div className="py-3 border-y border-slate-800">
                  <span className="text-xs text-slate-400 block">تكلفة المسار الكامل</span>
                  <span className="text-3xl font-black text-emerald-400">
                    {selectedCertificate.totalPrice === 0 ? 'مجاني بالكامل!' : `$${selectedCertificate.totalPrice}`}
                  </span>
                </div>

                {firstCourse && (
                  <Link
                    to={`/course/${firstCourse._id}`}
                    className="w-full bg-gradient-to-l from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 transition-all"
                  >
                    <Rocket size={20} /> ابدأ من الكراش كورس 1 الآن
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* 2. ماذا يمكنك أن تفعل بهذه الشهادة المهنية؟ (العائد المادي والمهني) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign size={24} />
              </div>
              <h3 className="text-lg font-black text-white">1. العمل الحر واقتناص العملاء</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                بعد كل كراش كورس ستخرج بمشروع كامل على حسابك في GitHub؛ بنهاية الشهادة سيكون لديك <strong className="text-white">{selectedCertificate.courses.length} مشروعاً حقيقياً</strong> تقنع بها أي عميل على منصات العمل الحر فوراً.
              </p>
            </div>

            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Bot size={24} />
              </div>
              <h3 className="text-lg font-black text-white">2. بناء منتجات SaaS بسرعة 10x</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                لن تتعلم البرمجة بالطريقة البطيئة؛ في كل مشروع نعلمك كيف تكتب الأوامر الاحترافية لـ <strong className="text-white">AI Agents</strong> لتبني وتطلق تطبيقاتك الربحية الخاصة في أيام معدودة.
              </p>
            </div>

            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Briefcase size={24} />
              </div>
              <h3 className="text-lg font-black text-white">3. التوظيف واجتياز المقابلات</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                بفضل بوابات الزعماء، البوابات الحمراء الكودية، والاختبارات المختلطة في نهاية كل وحدة، ستكون مستعداً لاجتياز أصعب الاختبارات التقنية في الشركات.
              </p>
            </div>
          </div>

          {/* 3. المهارات المكتسبة والمشاريع التي ستكون بحوزتك */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-5">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="text-amber-400" size={22} /> المهارات والتقنيات التي ستتقنها
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تم تصميم هذه الشهادة لتغطي كافة المهارات الهندسية والعملية المطلوبة في سوق العمل:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCertificate.skillsList.map((skill, idx) => (
                  <span key={idx} className="bg-slate-900 border border-slate-700 text-emerald-300 text-xs font-bold px-3.5 py-2 rounded-xl" dir="ltr">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-5">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <GitBranch className="text-emerald-400" size={22} /> حقيبة مشاريع التخرج على GitHub (بمساعدة AI Agent)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                في الوحدة الأخيرة من كل كراش كورس، ستبني مشروعاً تطبيقياً خطوة بخطوة وترفعه على حسابك في GitHub:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {selectedCertificate.courses.map((c, i) => (
                  <div key={c._id || i} className="bg-slate-950 border border-slate-800/90 p-3.5 rounded-2xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-1">{c.githubProjectTitle}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">يُرفع على GitHub + توثيق AI Agent</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. الخريطة التفصيلية للكراش كورسات داخل هذه الشهادة (ماذا تدرس في كل كراش كورس؟) */}
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                  <Layers className="text-indigo-400" /> سلسلة الكراش كورسات المشمولة في الشهادة ({selectedCertificate.courses.length} كورس)
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  مرتبة تسلسلياً من الأسهل (تحت الصفر بأسلوب الطفل الصغير 👶) إلى الاحتراف الكامل. كل كورس يمنحك شهادة خاصة به!
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {selectedCertificate.courses.map((course, idx) => (
                <div 
                  key={course._id} 
                  className="bg-[#0b1120] border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 md:p-8 transition-all shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="bg-indigo-600 text-white text-xs font-black px-3.5 py-1 rounded-full">
                        الكراش كورس {idx + 1} من {selectedCertificate.courses.length}
                      </span>
                      <span className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock size={12} className="text-emerald-400" /> {course.estimatedHours} ساعة تدريبية
                      </span>
                      <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Award size={13} /> يمنح: {course.subCertBadge}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-slate-300 text-sm leading-[1.85]">
                      {course.cleanDescription}
                    </p>

                    {/* تفاصيل ما بداخل الكراش كورس */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <GitBranch size={14} /> {course.githubProjectTitle}
                      </span>
                      <span className="flex items-center gap-1.5 text-indigo-300">
                        <Code size={14} /> مختبر كود بـ 3 تلميحات
                      </span>
                      <span className="flex items-center gap-1.5 text-red-400">
                        <Flame size={14} /> بوابات زعماء واختبارات وحدات
                      </span>
                    </div>
                  </div>

                  <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                    <Link
                      to={`/course/${course._id}`}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm py-3.5 px-7 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 transition-all"
                    >
                      <PlayCircle size={18} /> ادخل الكراش كورس {idx + 1}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ============================================================================
  // 🏛️ الواجهة الرئيسية لصفحة الأكاديمية (شهادات مهنية + كراش كورسات مصنفة)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#020617] py-10 px-6 animate-fade-in-up text-slate-200" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* الترويسة وشريط البحث والفلاتر */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0b1120] to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4 z-10">
            <Sparkles size={14} /> شهادات مهنية خارقة + كراش كورسات بتبسيط ELI5 👶
          </span>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 z-10">
            أكاديمية <span className="text-emerald-400" dir="ltr">Cherif.Dev</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mb-8 z-10 leading-relaxed">
            اختر دراسة <strong className="text-amber-400">شهادة مهنية متكاملة (9-15 كراش كورس)</strong> تخرجك بمعرض مشاريع كامل على GitHub، أو ابدأ بأي <strong className="text-emerald-400">كراش كورس</strong> على حدة.
          </p>

          {/* شريط البحث */}
          <div className="relative w-full max-w-xl z-10 mb-8">
            <Search className="absolute right-4 top-4 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن شهادة مهنية أو كراش كورس (مثال: MERN، بايثون، ذكاء اصطناعي)..." 
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-2xl py-4 pr-12 pl-4 focus:border-emerald-500 outline-none transition-all shadow-inner text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* أزرار التقسيم الرئيسية (الشهادات المهنية vs الكراش كورسات) */}
          <div className="flex flex-wrap justify-center gap-2.5 z-10 bg-slate-950/90 p-2 rounded-2xl border border-slate-800">
            {[
              { id: 'all', label: '🌟 عرض الشامل (الشهادات + الكراش كورسات)' },
              { id: 'certificates', label: `👑 الشهادات المهنية الخارقة (${certificateGroups.length})` },
              { id: 'crash_courses', label: `⚡ جميع الكراش كورسات (${enrichedCourses.length})` },
              { id: 'standalone', label: '🎯 كراش كورسات وحيدة (مستقلة)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
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
            {/* 👑 القسم الأول: خانة الشهادات المهنية الخارقة (Professional Certificates) */}
            {/* ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'certificates') && filteredCertificates.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
                      <Trophy className="text-amber-400" size={28} /> الشهادات المهنية المعتمدة (Professional Certificates)
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      مسارات ضخمة على طراز Coursera تتكون من سلسلة كراش كورسات مترابطة مع مشاريع GitHub وشهادة مهنية خارقة.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {filteredCertificates.map((cert, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gradient-to-br from-indigo-950/40 via-[#0b1120] to-[#0b1120] border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl p-7 md:p-9 shadow-2xl transition-all"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        <div className="lg:col-span-8 space-y-4">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full flex items-center gap-1.5">
                              <Trophy size={14} /> شهادة مهنية خارقة
                            </span>
                            <span className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
                              📚 سلسلة من {cert.courses.length} كراش كورسات مترابطة
                            </span>
                            <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                              ⏱️ {cert.totalHours} ساعة تدريبية (~{cert.estimatedMonths} أشهر)
                            </span>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-black text-white leading-snug">
                            {cert.certTitle}
                          </h3>

                          <p className="text-slate-300 text-sm leading-[1.85]">
                            تبدأ هذه الشهادة من الكراش كورس الأول ({cert.courses[0]?.title}) وتتدرج معك خطوة بخطوة بأسلوب التبسيط المطلق حتى ({cert.courses[cert.courses.length - 1]?.title}). تحصل فيها على <strong className="text-amber-300">{cert.courses.length} شهادة فرعية</strong> + <strong className="text-emerald-300">{cert.courses.length} مشروعاً على GitHub بمساعدة AI Agent</strong> + <strong className="text-white">الشهادة المهنية الكبرى</strong>.
                          </p>

                          {/* المهارات المكتسبة */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cert.skillsList.slice(0, 8).map((sk, sIdx) => (
                              <span key={sIdx} className="bg-slate-900 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-lg font-medium" dir="ltr">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* أزرار الدخول لتفاصيل الشهادة المهنية */}
                        <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                          <div className="space-y-2 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span>شرح كامل لكل كراش كورس ومشاريعه</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span>شهادة فرعية لكل كورس + شهادة مهنية خارقة</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span>وحدة بناء مشروع GitHub & AI Agent في كل كورس</span>
                            </div>
                          </div>

                          <button
                            onClick={() => { setSelectedCertificate(cert); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="w-full bg-gradient-to-l from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-4 px-5 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 text-sm"
                          >
                            <Award size={18} /> استكشف تفاصيل الشهادة والكورسات ({cert.courses.length})
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ⚡ القسم الثاني: عرض الكراش كورسات (مع توضيح تبعيتها للشهادة المهنية أو كونها وحيدة) */}
            {/* ========================================================================= */}
            {activeTab !== 'certificates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
                      <Zap className="text-emerald-400" size={28} /> 
                      {activeTab === 'standalone' ? 'الكراش كورسات الوحيدة (المستقلة)' : 'الكراش كورسات التفاعلية (Crash Courses)'}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      كل كراش كورس موضح تحت عنوانه ما إذا كان جزءاً من شهادة مهنية شاملة أو كراش كورس وحيداً.
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
                          className="bg-[#0b1120] border border-slate-800 rounded-3xl overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all flex flex-col"
                        >
                          {/* صورة الكورس */}
                          <div className="h-48 bg-slate-900 relative overflow-hidden">
                            {course.thumbnail ? (
                              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 text-slate-600 p-4 text-center">
                                <BookOpen size={42} className="text-emerald-500/60 mb-2" />
                                <span className="text-xs font-bold text-slate-400">ELI5 Crash Course + AI Project</span>
                              </div>
                            )}
                            <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg font-black text-xs border border-slate-700">
                              {course.price === 0 ? <span className="text-emerald-400">مجاني</span> : `$${course.price}`}
                            </div>
                            {course.isPartOfCertificate && (
                              <div className="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg font-black text-xs">
                                الكورس {course.courseOrder} في السلسلة
                              </div>
                            )}
                          </div>

                          {/* تفاصيل الكورس */}
                          <div className="p-6 flex-1 flex flex-col">
                            {/* التقييم */}
                            <div className="flex items-center justify-between text-xs mb-2.5">
                              <div className="flex items-center gap-1 text-amber-400">
                                <Star size={13} fill="currentColor" />
                                <Star size={13} fill="currentColor" />
                                <Star size={13} fill="currentColor" />
                                <Star size={13} fill="currentColor" />
                                <Star size={13} fill="currentColor" />
                                <span className="text-slate-500 mr-1">(5.0)</span>
                              </div>
                              <span className="text-slate-400 font-bold">{course.estimatedHours} ساعة</span>
                            </div>
                            
                            {/* عنوان الكراش كورس */}
                            <h3 className="text-lg font-black text-white mb-2.5 line-clamp-2 leading-snug">
                              {course.title}
                            </h3>

                            {/* 🆕 الشارة المطلوبة تحت العنوان: تابع لشهادة مهنية أم كراش كورس وحيد */}
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
                                  كراش كورس تابع للشهادة المهنية: <strong className="text-white underline">{course.parentCertTitle}</strong>
                                </span>
                              </button>
                            ) : (
                              <div className="mb-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold flex items-center gap-2">
                                <Zap size={14} className="shrink-0" />
                                <span>كراش كورس وحيد ومستقل (Standalone)</span>
                              </div>
                            )}

                            <p className="text-slate-400 text-xs leading-relaxed mb-5 line-clamp-3">
                              {course.cleanDescription}
                            </p>
                            
                            <div className="mt-auto space-y-3">
                              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 text-[11px] text-slate-300 flex items-center gap-2">
                                <Award size={14} className="text-emerald-400 shrink-0" />
                                <span className="truncate">يمنح: {course.subCertBadge}</span>
                              </div>
                              
                              <Link 
                                to={`/course/${course._id}`} 
                                className="block w-full bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white text-center font-black py-3 rounded-xl transition-all border border-emerald-500/30 hover:border-emerald-500 text-sm"
                              >
                                عرض تفاصيل الكراش كورس
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