import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlayCircle, Clock, Award, Shield, BookOpen, ArrowRight, Lock, Video, 
  Trophy, Flame, Skull, GitBranch, Bot, Code, Layers, CheckCircle2, Sparkles,
  DollarSign, Briefcase, TrendingUp, Zap, Compass, ChevronDown, Terminal, Users, Rocket
} from 'lucide-react';
import { parseCourseHierarchy } from './Academy';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [course, setCourse] = useState(null);
  const [siblingCourses, setSiblingCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [openUnitIdx, setOpenUnitIdx] = useState(0); // لفتح الوحدة الأولى افتراضياً في المنهج
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('cherif_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [courseRes, lessonsRes, enrollRes, allCoursesRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5001/api/courses/public/${id}`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/lessons`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/check-enrollment`, { headers }).catch(() => ({ data: { isEnrolled: false } })),
          axios.get(`http://127.0.0.1:5001/api/courses/public`).catch(() => ({ data: { courses: [] } }))
        ]);
        
        if (courseRes.data.success) {
          const parsedCurrent = parseCourseHierarchy(courseRes.data.course);
          setCourse(parsedCurrent);

          if (parsedCurrent.isPartOfCertificate && allCoursesRes.data?.courses) {
            const siblings = allCoursesRes.data.courses
              .map(parseCourseHierarchy)
              .filter(c => c.parentCertTitle === parsedCurrent.parentCertTitle)
              .sort((a, b) => a.courseOrder - b.courseOrder);
            setSiblingCourses(siblings);
          }
        }
        if (lessonsRes.data.success) setLessons(lessonsRes.data.lessons);
        if (enrollRes.data) setIsEnrolled(enrollRes.data.isEnrolled);
        
      } catch (err) {
        console.error('خطأ في جلب البيانات', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEnrollment = async () => {
    const token = localStorage.getItem('cherif_token');
    if (!token) {
      alert("يجب عليك تسجيل الدخول لتتمكن من الاشتراك وبدء جمع نقاط الـ EXP!");
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    try {
      const res = await axios.post(`http://127.0.0.1:5001/api/courses/${id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setIsEnrolled(true);
        navigate(`/course/${id}/learn`);
      }
    } catch (error) {
      alert("حدث خطأ أثناء الاشتراك.");
    } finally {
      setIsEnrolling(false);
    }
  };

  // تجميع الدروس حسب الوحدات وحساب إحصائيات البوابات والتمارين
  const { groupedSections, syllabusStats } = useMemo(() => {
    let bossGatesCount = 0;
    let unitExamsCount = 0;
    let codingLabsCount = 0;

    const grouped = lessons.reduce((acc, lesson) => {
      const secName = lesson.section || 'الوحدة 1: الأساسيات';
      if (!acc[secName]) acc[secName] = [];
      acc[secName].push(lesson);

      if (lesson.type === 'red_gate' || lesson.type === 'boss_quiz') bossGatesCount++;
      else if (lesson.type === 'unit_exam') unitExamsCount++;
      else codingLabsCount++;

      return acc;
    }, {});

    return {
      groupedSections: grouped,
      syllabusStats: {
        unitsCount: Object.keys(grouped).length || 8,
        bossGatesCount: bossGatesCount || 6,
        unitExamsCount: unitExamsCount || Object.keys(grouped).length || 8,
        codingLabsCount: codingLabsCount || 24
      }
    };
  }, [lessons]);

  // تحديد الكراش كورس القادم في السلسلة لتشويق الطالب
  const nextSiblingCourse = useMemo(() => {
    if (!course || !siblingCourses.length) return null;
    const currentIndex = siblingCourses.findIndex(s => s._id === course._id);
    if (currentIndex >= 0 && currentIndex < siblingCourses.length - 1) {
      return siblingCourses[currentIndex + 1];
    }
    return null;
  }, [course, siblingCourses]);

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center bg-[#020617]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>;
  if (!course) return <div className="text-center py-20 text-white text-2xl font-bold bg-[#020617]">❌ الكورس غير موجود</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-28 animate-fade-in-up course-details-font" dir="rtl">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
        .course-details-font { font-family: 'Readex Pro', sans-serif; }
        .heading-alex { font-family: 'Alexandria', sans-serif; line-height: 1.5 !important; }
        .mono-code { font-family: 'JetBrains Mono', monospace; }
      `}} />

      {/* ================================================================= */}
      {/* 1. القسم العلوي الملحمي (High-Dopamine Hero & Value Stack) */}
      {/* ================================================================= */}
      <div className="bg-gradient-to-b from-indigo-950/35 via-slate-950 to-[#020617] border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 relative z-20 flex flex-col lg:flex-row gap-12 items-start">
          
          {/* العمود الأيمن: القصة، الوصف المعمق، والشهادات */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link to="/academy" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-bold text-sm">
                <ArrowRight size={16} /> العودة لكتالوج الأكاديمية
              </Link>

              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <Zap size={13} className="text-amber-400" /> مكافأة الإتمام: +{course.xpReward} EXP
              </span>
            </div>

            {/* شارة التبعية للشهادة المهنية أو الكورس المستقل */}
            <div>
              {course.isPartOfCertificate ? (
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold">
                  <Trophy size={16} className="text-amber-400 shrink-0" />
                  <span>
                    الكراش كورس رقم ({course.courseOrder} من {siblingCourses.length || 12}) ضمن الشهادة المهنية: <strong className="text-white">{course.parentCertTitle}</strong>
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Sparkles size={15} /> كراش كورس وحيد ومستقل (Standalone Crash Course)
                </div>
              )}
            </div>

            <h1 className="heading-alex text-3xl md:text-5xl font-black text-white">
              {course.title}
            </h1>

            {/* الوصف التفصيلي المزدوج (الوصف الأساسي + الوصف التربوي العميق) */}
            <div className="space-y-4 text-slate-300 text-base leading-[1.95]">
              <p className="text-white/95 font-medium text-base md:text-lg leading-[1.9]">
                {course.cleanDescription}
              </p>
              <div className="bg-slate-900/70 border-r-4 border-emerald-500 p-4 rounded-l-2xl text-sm text-slate-300 leading-[1.9]">
                <strong className="text-emerald-400 block mb-1">🧠 لماذا صُمم هذا الكراش كورس بهذه الطريقة؟</strong>
                لا مزيد من الحفظ الأعمى؛ ستدرس كل مفهوم في هذا الكورس عبر تشبيه قصصي مبسط يفهمه طفل في العاشرة (مبدأ فاينمان ELI5 👶)، ثم نأخذك لتشريح الكود سطراً بسطر (Code Anatomy) وتطبيقه بيدك في مختبر الكود التفاعلي، وصولاً إلى بناء مشروعك الكامل بمساعدة أوامر جاهزة لـ <strong className="text-white">AI Agent</strong> ورفعه على حسابك في <strong className="text-amber-400">GitHub</strong>.
              </div>
            </div>

            {/* شريط إحصائيات التلعيب داخل هذا الكورس */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
                <Layers size={18} className="text-indigo-400 mb-1" />
                <p className="text-lg font-black text-white">{syllabusStats.unitsCount} وحدات</p>
                <p className="text-[11px] text-slate-400">متدرجة من الصفر</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
                <Terminal size={18} className="text-emerald-400 mb-1" />
                <p className="text-lg font-black text-white">{syllabusStats.codingLabsCount}+ درساً</p>
                <p className="text-[11px] text-slate-400">مع مختبر كود وتلميحات</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
                <Flame size={18} className="text-red-400 mb-1" />
                <p className="text-lg font-black text-white">{syllabusStats.bossGatesCount} بوابات زعماء</p>
                <p className="text-[11px] text-slate-400">+ اختبارات وحدات مختلطة</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
                <GitBranch size={18} className="text-amber-400 mb-1" />
                <p className="text-lg font-black text-white">1 مشروع تخرج</p>
                <p className="text-[11px] text-slate-400">يُرفع على GitHub مع AI</p>
              </div>
            </div>

            {/* الشهادة الفرعية ومشروع التخرج */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
                <Award className="text-amber-400 shrink-0 mt-0.5" size={24} />
                <div>
                  <p className="text-xs text-amber-400 font-bold">الشهادة الموثقة الممنوحة لك فور الإتمام:</p>
                  <p className="text-sm font-black text-white mt-0.5">{course.subCertBadge}</p>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl flex items-start gap-3">
                <GitBranch className="text-emerald-400 shrink-0 mt-0.5" size={24} />
                <div>
                  <p className="text-xs text-emerald-400 font-bold">الأصل الرقمي في معرض أعمالك (GitHub):</p>
                  <p className="text-sm font-black text-white mt-0.5">{course.githubProjectTitle}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* العمود الأيسر: بطاقة القيمة المكدسة والاشتراك الفوري (High-Conversion Buy Box) */}
          <div className="w-full lg:w-[400px] bg-[#0b1120] border-2 border-emerald-500/40 rounded-3xl p-7 shadow-[0_0_50px_rgba(16,185,129,0.12)] shrink-0 space-y-5 lg:sticky lg:top-24">
            <div className="text-center pb-4 border-b border-slate-800">
              <span className="inline-block text-[11px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full mb-2">
                🔥 القيمة الفعلية للكورس والمختبر: <del className="text-slate-400">$199</del>
              </span>
              <div className="text-4xl font-black text-white">
                {course.price === 0 ? <span className="text-emerald-400">مجاني بالكامل!</span> : `$${course.price}`}
              </div>
              <p className="text-slate-400 font-medium text-xs mt-1">
                شامل جميع الوحدات • وصول مدى الحياة • تحديثات 2026
              </p>
            </div>
            
            {isEnrolled ? (
              <button 
                onClick={() => navigate(`/course/${id}/learn`)} 
                className="heading-alex w-full bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-4 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] text-base"
              >
                <PlayCircle size={20} /> متابعة التعلم في المختبر التفاعلي
              </button>
            ) : (
              <button 
                onClick={handleEnrollment} 
                disabled={isEnrolling}
                className="heading-alex w-full bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-50 text-base"
              >
                {isEnrolling ? 'جاري تجهيز مختبرك...' : (
                  <><Rocket size={20} /> اشترك الآن وابدأ جمع الـ EXP</>
                )}
              </button>
            )}

            {/* تكديس القيمة داخل بطاقة الشراء لإقناع العقل الباطن */}
            <div className="text-right space-y-2.5 pt-3 border-t border-slate-800 text-xs text-slate-300">
              <p className="font-black text-white text-xs mb-2">ماذا يضمن لك اشتراكك في هذا الكراش كورس؟</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> شرح قصصي مبسط (ELI5 👶)</span>
                <span className="text-emerald-400 font-bold">مشمول</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> محرر أكواد بـ 3 تلميحات ومصحح AI</span>
                <span className="text-emerald-400 font-bold">مشمول</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> بوابات زعماء واختبارات وحدات</span>
                <span className="text-emerald-400 font-bold">مشمول</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> ورشة بناء مشروع GitHub & AI Agent</span>
                <span className="text-emerald-400 font-bold">مشمول</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-400"/> شهادة إتمام الكورس برقم توثيق</span>
                <span className="text-amber-400 font-bold">مشمول 🏆</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. شريط الكورسات الشقيقة (خريطة موقعك داخل الشهادة المهنية) */}
      {/* ================================================================= */}
      {siblingCourses.length > 1 && (
        <div className="max-w-6xl mx-auto px-6 pt-12">
          <div className="bg-[#0b1120] border border-amber-500/30 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <Layers size={18} /> خريطة مسار الشهادة المهنية المتسلسل ({siblingCourses.length} كراش كورسات):
              </h3>
              <span className="text-xs text-slate-400">أنت تستعرض الآن الكورس رقم {course.courseOrder}</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
              {siblingCourses.map((sib, idx) => {
                const isCurrent = sib._id === course._id;
                return (
                  <Link
                    key={sib._id}
                    to={`/course/${sib._id}`}
                    className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    كورس {idx + 1}: {sib.shortCleanTitle.slice(0, 26)}...
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. قسم الآفاق المهنية والمادية التي يفتحها لك هذا الكراش كورس تحديداً */}
      {/* ================================================================= */}
      <div className="max-w-6xl mx-auto px-6 pt-14">
        <div className="bg-gradient-to-br from-slate-900 via-[#0b1120] to-[#0b1120] border border-slate-800 rounded-3xl p-8 md:p-10 space-y-8 shadow-2xl">
          <div>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Compass size={16} /> العائد المباشر من دراسة هذا الكراش كورس
            </span>
            <h2 className="heading-alex text-2xl md:text-3xl font-black text-white">
              ما هي الآفاق المهنية والمادية التي ستفتح لك فور إنهاء هذا الكراش كورس؟
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              نحن لا نعلمك معلومات نظرية لتخزنها في ذهنك، بل نسلحك بنتائج ملموسة يمكنك استثمارها فوراً:
            </p>
          </div>

          {/* البطاقات الثلاث للآفاق */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <DollarSign size={22} />
                </div>
                <span className="mono-code text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full" dir="ltr">
                  {course.horizons.gigPriceRange}
                </span>
              </div>
              <h3 className="heading-alex text-base font-bold text-white">1. خدمة عمل حر جاهزة للبيع</h3>
              <p className="text-xs text-slate-300 leading-[1.85]">
                {course.horizons.freelanceGig}
              </p>
            </div>

            <div className="bg-slate-950/90 border border-indigo-500/30 rounded-2xl p-6 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Briefcase size={22} />
              </div>
              <h3 className="heading-alex text-base font-bold text-white">2. القفزة في سيرتك الذاتية والشركات</h3>
              <p className="text-xs text-slate-300 leading-[1.85]">
                {course.horizons.careerImpact}
              </p>
            </div>

            <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-6 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Bot size={22} />
              </div>
              <h3 className="heading-alex text-base font-bold text-white">3. بناء مشاريعك الخاصة بسرعة 10x</h3>
              <p className="text-xs text-slate-300 leading-[1.85]">
                {course.horizons.saasCapability}
              </p>
            </div>
          </div>

          {/* مقارنة التحول النفسي والعملي لهذا الكورس (قبل الكورس vs بعد الكورس) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="bg-red-950/15 border border-red-500/25 rounded-2xl p-5 flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">✕</span>
              <div>
                <h4 className="text-xs font-black text-red-400 mb-1">حالتك قبل هذا الكراش كورس:</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{course.horizons.beforeState}</p>
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/35 rounded-2xl p-5 flex items-start gap-3.5">
              <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <div>
                <h4 className="text-xs font-black text-emerald-400 mb-1">حالتك فور إتمام هذا الكراش كورس:</h4>
                <p className="text-xs text-slate-200 leading-relaxed">{course.horizons.afterState}</p>
              </div>
            </div>
          </div>

          {/* المهارات المكتسبة */}
          {course.extractedSkills?.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 ml-2">المهارات والتقنيات التي ستتقنها في هذا الكورس:</span>
              {course.extractedSkills.map((sk, i) => (
                <span key={i} className="bg-slate-950 border border-slate-700 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-xl" dir="ltr">
                  ✓ {sk}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. قسم المنهج الدراسي التفصيلي بنظام الأكورديون ومكافآت الـ EXP */}
      {/* ================================================================= */}
      <div className="max-w-6xl mx-auto px-6 py-14 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-1">
              خريطة الدروس والبوابات ومختبرات الكود
            </span>
            <h2 className="heading-alex text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <BookOpen className="text-emerald-400" /> المنهج الدراسي التفصيلي ({Object.keys(groupedSections).length} وحدات)
            </h2>
          </div>
          <span className="bg-slate-900 text-emerald-400 px-4 py-2 rounded-xl text-xs font-black border border-slate-800 self-start">
            إجمالي {lessons.length} درساً وتحدياً • +{course.xpReward} EXP
          </span>
        </div>
        
        {Object.keys(groupedSections).length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
            <Video size={48} className="text-slate-700 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">جاري إعداد الدروس</h3>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(groupedSections).map(([sectionName, secLessons], sIdx) => {
              const isProjectUnit = sectionName.includes('مشروع') || sectionName.includes('GitHub');
              const isOpen = openUnitIdx === sIdx;

              return (
                <div 
                  key={sIdx} 
                  className={`border-2 rounded-3xl overflow-hidden transition-all ${
                    isProjectUnit 
                      ? 'bg-emerald-950/10 border-emerald-500/40' 
                      : isOpen ? 'bg-[#0b1120] border-indigo-500/40' : 'bg-[#0b1120] border-slate-800'
                  }`}
                >
                  {/* رأس الوحدة القابل للطي والفتح */}
                  <button
                    type="button"
                    onClick={() => setOpenUnitIdx(isOpen ? -1 : sIdx)}
                    className="w-full p-5 md:p-6 bg-slate-900/70 hover:bg-slate-900 flex items-center justify-between gap-4 text-right transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isProjectUnit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {isProjectUnit ? <Bot size={20} /> : <Layers size={18} />}
                      </div>
                      <div>
                        <h3 className="heading-alex font-bold text-base md:text-lg text-white">
                          {sectionName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isProjectUnit 
                            ? '🚀 ورشة بناء المشروع خطوة بخطوة مع أوامر الـ AI Agent ورفعه على GitHub' 
                            : `تضم ${secLessons.length} دروس وتحديات + اختبار الوحدة النهائي المختلط`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                        +{secLessons.length * 50} EXP
                      </span>
                      <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                    </div>
                  </button>

                  {/* قائمة الدروس والبوابات داخل الوحدة */}
                  {isOpen && (
                    <div className="divide-y divide-slate-800/70 border-t border-slate-800">
                      {secLessons.map((lesson) => {
                        const isRedGate = lesson.type === 'red_gate';
                        const isBoss = lesson.type === 'boss_quiz';
                        const isUnitExam = lesson.type === 'unit_exam';

                        return (
                          <div key={lesson._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                            <div className="flex items-start gap-4">
                              <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-black text-xs mt-0.5 ${
                                isRedGate ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : isBoss ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                                : isUnitExam ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-slate-950 text-emerald-400 border border-slate-800'
                              }`}>
                                {isRedGate ? <Flame size={15}/> : isBoss ? <Skull size={15}/> : isUnitExam ? <Trophy size={15}/> : lesson.order}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-bold text-sm md:text-base text-slate-100">{lesson.title}</h4>
                                  {isRedGate && <span className="text-[10px] font-black bg-red-500/20 text-red-300 px-2 py-0.5 rounded">بوابة حمراء S-Rank</span>}
                                  {isBoss && <span className="text-[10px] font-black bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">زعيم الوحدة</span>}
                                  {isUnitExam && <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">اختبار نهائي مختلط</span>}
                                </div>
                                {lesson.description && <p className="text-slate-400 text-xs mt-1 leading-relaxed">{lesson.description}</p>}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                              <span className="mono-code text-[11px] text-slate-500 font-bold">+50 EXP</span>
                              {isEnrolled || lesson.isFreePreview ? (
                                <Link 
                                  to={`/course/${course._id}/learn`} 
                                  className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-all"
                                >
                                  ابدأ الدرس
                                </Link>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                                  <Lock size={14} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* جسر التشويق للكراش كورس القادم في الشهادة المهنية */}
        {nextSiblingCourse && (
          <div className="mt-10 bg-gradient-to-r from-indigo-950/50 via-[#0b1120] to-[#0b1120] border border-indigo-500/40 rounded-3xl p-7 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                <Sparkles size={15} /> المحطة القادمة بعد إنهاء هذا الكراش كورس:
              </span>
              <h3 className="heading-alex text-xl font-bold text-white">
                {nextSiblingCourse.title}
              </h3>
              <p className="text-xs text-slate-400">
                سيفتح لك أفقاً جديداً: {nextSiblingCourse.horizons?.freelanceGig}
              </p>
            </div>
            <Link
              to={`/course/${nextSiblingCourse._id}`}
              className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl transition-all"
            >
              معاينة الكورس القادم ←
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default CourseDetails;