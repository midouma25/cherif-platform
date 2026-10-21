import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlayCircle, Clock, Award, Shield, BookOpen, ArrowRight, Lock, Video, 
  Trophy, Flame, Skull, GitBranch, Bot, Code, Layers, CheckCircle2, Sparkles,
  DollarSign, Briefcase, TrendingUp, Zap, Compass, ChevronDown, Terminal, Rocket, Target, Lightbulb,
  Globe, Headphones, Mic, Volume2
} from 'lucide-react';
import { parseCourseHierarchy } from './Academy';

// تنظيف وصف الدرس أو الكورس من أي علامات ملخص مدمجة
const cleanTextFromMarkers = (rawText = '') => {
  if (!rawText) return '';
  return rawText
    .split('|||UNIT_SUMMARY:')[0]
    .split('|||UNITS_MAP:')[0]
    .trim();
};

// 1. استخراج خريطة ملخصات جميع الوحدات المحقونة داخل course.description القادم من سيرفر 5001
const extractCourseUnitsMap = (rawCourseDescription = '') => {
  if (!rawCourseDescription || !rawCourseDescription.includes('|||UNITS_MAP:')) return {};
  try {
    const jsonPart = rawCourseDescription.split('|||UNITS_MAP:')[1].trim();
    const parsed = JSON.parse(jsonPart);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    console.warn('خطأ في قراءة خريطة ملخصات الوحدات:', e);
    return {};
  }
};

// 2. استخراج ملخص الوحدة إن كان محقوناً داخل وصف الدرس الأول
const extractLessonUnitSummary = (secLessons = []) => {
  for (const lesson of secLessons) {
    const desc = lesson?.description || '';
    if (desc.includes('|||UNIT_SUMMARY:')) {
      try {
        const jsonPart = desc.split('|||UNIT_SUMMARY:')[1].split('|||UNITS_MAP:')[0].trim();
        const parsed = JSON.parse(jsonPart);
        if (parsed && (parsed.whatYouLearn || parsed.whyItMatters)) {
          return parsed;
        }
      } catch (e) {}
    }
  }
  return null;
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [course, setCourse] = useState(null);
  const [siblingCourses, setSiblingCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [openUnitIdx, setOpenUnitIdx] = useState(0); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      localStorage.removeItem(`unit_summaries_cache_${id}`);
    } catch (e) {}

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
          const rawCourse = courseRes.data.course;
          const embeddedUnitsMap = extractCourseUnitsMap(rawCourse.description);
          const parsedCurrent = parseCourseHierarchy({
            ...rawCourse,
            description: cleanTextFromMarkers(rawCourse.description)
          });

          setCourse({
            ...parsedCurrent,
            cleanDescription: cleanTextFromMarkers(parsedCurrent.cleanDescription),
            embeddedUnitsMap
          });

          if (parsedCurrent.isPartOfCertificate && allCoursesRes.data?.courses) {
            const siblings = allCoursesRes.data.courses
              .map(c => parseCourseHierarchy({ ...c, description: cleanTextFromMarkers(c.description) }))
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
        bossGatesCount: bossGatesCount,
        unitExamsCount: unitExamsCount,
        codingLabsCount: codingLabsCount || 24
      }
    };
  }, [lessons]);

  const nextSiblingCourse = useMemo(() => {
    if (!course || !siblingCourses.length) return null;
    const currentIndex = siblingCourses.findIndex(s => s._id === course._id);
    if (currentIndex >= 0 && currentIndex < siblingCourses.length - 1) {
      return siblingCourses[currentIndex + 1];
    }
    return null;
  }, [course, siblingCourses]);

  // ============================================================================
  // 🎯 استرجاع ملخص الوحدة الحقيقي القادم من AcademyLab2 (unitDeepSummary)
  // ============================================================================
  const getSectionSummaryData = (sectionName, secLessons, isProjectUnit, sIdx) => {
    const mapFromCourseDesc = course?.embeddedUnitsMap || {};
    if (mapFromCourseDesc[sectionName] && mapFromCourseDesc[sectionName].whatYouLearn) {
      return mapFromCourseDesc[sectionName];
    }
    const mapValues = Object.values(mapFromCourseDesc);
    if (mapValues[sIdx] && mapValues[sIdx].whatYouLearn) {
      return mapValues[sIdx];
    }

    const fromLesson = extractLessonUnitSummary(secLessons);
    if (fromLesson) return fromLesson;

    const metaMap = course?.certificateMeta?.unitSummariesMap || {};
    if (metaMap[sectionName] && metaMap[sectionName].whatYouLearn) {
      return metaMap[sectionName];
    }

    const realLessonTitles = (secLessons || [])
      .filter(l => l.type !== 'red_gate' && l.type !== 'boss_quiz' && l.type !== 'unit_exam')
      .map(l => l.title);

    return {
      unitSummary: isProjectUnit
        ? (course?.isLanguageCourse
            ? `ورشة محادثة شاملة وتطبيق صوتي وكتابي لمحاور (${course?.githubProjectTitle}) مع الـ AI Voice Partner.`
            : `ورشة تطبيقية لبناء مشروع (${course?.githubProjectTitle}) خطوة بخطوة ورفعه على GitHub.`)
        : `وحدة تعليمية وتطبيقية مركزة في (${sectionName}).`,
      whatYouLearn: realLessonTitles.length > 0
        ? `ستتعلم وتطبق في هذه الوحدة: ${realLessonTitles.slice(0, 5).join('، ')}.`
        : `إتقان المفاهيم الأساسية والعملية الخاصة بـ (${sectionName}).`,
      whyItMatters: course?.isLanguageCourse
        ? `تمنحك هذه الوحدة الطلاقة السمعية والنطقية والقدرة على تركيب الجمل بثقة في مواقف الحياة والاختبارات الدولية.`
        : `تمنحك هذه الوحدة الفهم العملي لبناء المشاريع واجتياز اختبارات المقابلات التقنية وبوابات الزعماء بثقة.`,
      keyHighlights: realLessonTitles.slice(0, 3)
    };
  };

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center bg-[#020617]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>;
  if (!course) return <div className="text-center py-20 text-white text-2xl font-bold bg-[#020617]">❌ الكورس غير موجود</div>;

  const isLang = Boolean(course.isLanguageCourse);
  const isNoExamProj = Boolean(course.isNoExamProject || (syllabusStats.bossGatesCount === 0 && syllabusStats.unitExamsCount === 0 && !isLang));

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-28 animate-fade-in-up course-details-font" dir="rtl">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
        .course-details-font { font-family: 'Readex Pro', sans-serif; }
        .heading-alex { font-family: 'Alexandria', sans-serif; line-height: 1.45 !important; }
        .mono-code { font-family: 'JetBrains Mono', monospace; }
      `}} />

      {/* ================================================================= */}
      {/* 1. القسم العلوي الملحمي (يتكيف تلقائياً للغات أو لبناء المشاريع أو للبرمجة) */}
      {/* ================================================================= */}
      <div className={`bg-gradient-to-b ${isLang ? 'from-purple-950/40 via-slate-950 to-[#020617]' : 'from-indigo-950/35 via-slate-950 to-[#020617]'} border-b border-slate-800 relative overflow-hidden`}>
        <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-[1536px] w-full mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-20 relative z-20 flex flex-col lg:flex-row gap-16 xl:gap-24 items-start">
          
          <div className="flex-1 space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link to="/academy" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-bold text-sm">
                <ArrowRight size={16} /> العودة لكتالوج الأكاديمية
              </Link>

              <div className="flex items-center gap-2 flex-wrap">
                {isLang && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-black">
                    {course.langProfile.flag} {course.langProfile.cefrBadge}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <Zap size={13} className="text-amber-400" /> مكافأة الإتمام: +{course.xpReward} EXP
                </span>
              </div>
            </div>

            <div>
              {course.isPartOfCertificate ? (
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold">
                  <Trophy size={16} className="text-amber-400 shrink-0" />
                  <span>
                    الكراش كورس رقم ({course.courseOrder} من {siblingCourses.length || 16}) ضمن الشهادة المهنية: <strong className="text-white">{course.parentCertTitle}</strong>
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Sparkles size={15} /> كراش كورس وحيد ومستقل (Standalone Crash Course)
                </div>
              )}
            </div>

            <h1 className="heading-alex text-4xl md:text-5xl lg:text-6xl font-black text-white pr-4 lg:pr-0">
              {course.title}
            </h1>

            <div className="space-y-4 text-slate-300 text-base md:text-[17.5px] leading-[2.0]">
              <p className="text-white/95 font-medium leading-[2.0]">
                {course.cleanDescription}
              </p>

              {/* صندوق الفلسفة التعليمية المتكيف */}
              <div className={`bg-slate-900/70 border-r-4 ${isLang ? 'border-purple-500' : 'border-emerald-500'} p-5 rounded-l-3xl text-sm text-slate-300 leading-[1.95]`}>
                {isLang ? (
                  <>
                    <strong className="text-purple-300 block mb-1.5">🗣️ لماذا صُمم هذا الكورس اللغوي بمنهجية (Cambridge × Lego Grammar ELI5)؟</strong>
                    وداعاً لحفظ القواعد الميتة وقوائم الكلمات المنفصلة! في هذا الكورس تدخل في <strong className="text-white">مواقف حياتية حقيقية</strong>، تتعلم تركيب الجمل كـ <strong className="text-amber-400">مكعبات الليغو الملونة</strong> التي يفهمها طفل في العاشرة، وتتقن مخارج الحروف والربط الصوتي (<strong className="text-emerald-400">IPA & Connected Speech</strong>) عبر مشغل صوتي بـ 3 سرعات، وتمارس المحادثة الحية مع <strong className="text-white">AI Voice Examiner</strong>.
                  </>
                ) : isNoExamProj ? (
                  <>
                    <strong className="text-emerald-400 block mb-1.5">🏗️ لماذا صُمم هذا الكورس بنمط (البناء الصافي من الصفر - بدون اختبارات)؟</strong>
                    هذا الكورس يركز 100% على <strong className="text-white">البناء الهندسي العملي ملفاً بملف</strong>؛ ستعرف في كل خطوة أين تضع الكود في شجرة المشروع، وما هو <strong className="text-amber-400">الأمر الحرفي (Prompt)</strong> الذي تعطيه للـ AI Agent، وكيف تربط الملفات وتختبرها حياً في التيرمينال دون أي اختبارات نظرية تقطع تركيزك.
                  </>
                ) : (
                  <>
                    <strong className="text-emerald-400 block mb-1.5">🧠 لماذا صُمم هذا الكراش كورس بهذه الطريقة؟</strong>
                    لا مزيد من الحفظ الأعمى؛ ستدرس كل مفهوم في هذا الكورس عبر تشبيه قصصي مبسط يفهمه طفل في العاشرة (مبدأ فاينمان ELI5 👶)، ثم نأخذك لتشريح الكود سطراً بسطر وتطبيقه بيدك في مختبر الكود التفاعلي، وصولاً إلى بناء مشروعك الكامل بمساعدة <strong className="text-white">AI Agent</strong> ورفعه على <strong className="text-amber-400">GitHub</strong>.
                  </>
                )}
              </div>
            </div>

            {/* بطاقات الإحصائيات الأربع المتكيفة */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <Layers size={20} className="text-indigo-400 mb-1.5" />
                <p className="text-xl font-black text-white">{syllabusStats.unitsCount} وحدات</p>
                <p className="text-xs text-slate-400">{isLang ? 'مواقف حياتية (Cambridge)' : 'متدرجة من الصفر'}</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                {isLang ? <Volume2 size={20} className="text-purple-400 mb-1.5" /> : <Terminal size={20} className="text-emerald-400 mb-1.5" />}
                <p className="text-xl font-black text-white">{syllabusStats.codingLabsCount}+ درساً</p>
                <p className="text-xs text-slate-400">{isLang ? 'صوتيات IPA واستماع 3 سرعات' : isNoExamProj ? 'خطوات بناء وكود كامل' : 'مختبر كود تفاعلي'}</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <Flame size={20} className="text-red-400 mb-1.5" />
                <p className="text-xl font-black text-white">
                  {isNoExamProj ? '0 اختبارات' : `${syllabusStats.bossGatesCount + syllabusStats.unitExamsCount || 8} تحديات`}
                </p>
                <p className="text-xs text-slate-400">{isNoExamProj ? '100% بناء كودي صافي 🛠️' : isLang ? 'تثبيت المفردات والقواعد' : 'زعماء واختبارات'}</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                {isLang ? <Mic size={20} className="text-amber-400 mb-1.5" /> : <GitBranch size={20} className="text-amber-400 mb-1.5" />}
                <p className="text-xl font-black text-white">{isLang ? 'محاكي AI' : '1 مشروع'}</p>
                <p className="text-xs text-slate-400">{isLang ? 'محادثة واختبار صوتي حي' : 'يُرفع على GitHub'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl flex items-start gap-4">
                <Award className="text-amber-400 shrink-0 mt-0.5" size={26} />
                <div>
                  <p className="text-xs text-amber-400 font-bold">الشهادة الممنوحة بعد هذا الكورس:</p>
                  <p className="text-[15px] font-black text-white mt-1">{course.subCertBadge}</p>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-emerald-500/30 p-5 rounded-2xl flex items-start gap-4">
                {isLang ? <Headphones className="text-purple-400 shrink-0 mt-0.5" size={26} /> : <GitBranch className="text-emerald-400 shrink-0 mt-0.5" size={26} />}
                <div>
                  <p className="text-xs text-emerald-400 font-bold">
                    {isLang ? 'تحدي المحادثة والأداء اللغوي (AI Voice):' : 'مشروع معرض الأعمال (GitHub):'}
                  </p>
                  <p className="text-[15px] font-black text-white mt-1">{course.githubProjectTitle}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* بطاقة الاشتراك الجانبية المتكيفة */}
          <div className="w-full lg:w-[420px] xl:w-[460px] bg-[#0b1120] border-2 border-emerald-500/40 rounded-3xl p-8 xl:p-10 shadow-[0_0_60px_rgba(16,185,129,0.12)] shrink-0 space-y-6 lg:sticky lg:top-28">
            <div className="text-center pb-5 border-b border-slate-800">
              <span className="inline-block text-xs font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-3">
                🔥 القيمة الفعلية للكورس والمختبر: <del className="text-slate-400">$199</del>
              </span>
              <div className="text-5xl font-black text-white">
                {course.price === 0 ? <span className="text-emerald-400">مجاني بالكامل!</span> : `$${course.price}`}
              </div>
              <p className="text-slate-400 font-medium text-[13px] mt-2">
                شامل جميع الوحدات ({Object.keys(groupedSections).length}) • وصول مدى الحياة 
              </p>
            </div>
            
            {isEnrolled ? (
              <button 
                onClick={() => navigate(`/course/${id}/learn`)} 
                className="heading-alex w-full bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-4.5 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] text-base"
              >
                <PlayCircle size={22} /> متابعة التعلم في المختبر التفاعلي
              </button>
            ) : (
              <button 
                onClick={handleEnrollment} 
                disabled={isEnrolling}
                className="heading-alex w-full bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-4.5 rounded-2xl transition-all shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:-translate-y-1 flex justify-center items-center gap-2 disabled:opacity-50 text-base"
              >
                {isEnrolling ? 'جاري التجهيز...' : (
                  <><Rocket size={22} /> اشترك الآن وابدأ جمع الـ EXP</>
                )}
              </button>
            )}

            <div className="text-right space-y-3.5 pt-3 border-t border-slate-800 text-[13px] text-slate-300">
              <p className="font-black text-white text-sm mb-3">ماذا يضمن لك اشتراكك في هذا الكراش كورس؟</p>
              {isLang ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> قواعد مبسطة كالمكعبات (Lego ELI5 👶)</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> صوتيات IPA ومشغل نطق بـ 3 سرعات 🔊</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> حوارات واقعية بأسلوب Cambridge 💬</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> محاكي محادثة صوتية مع AI Examiner 🎙️</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> {isNoExamProj ? 'شجرة ملفات وأكواد كاملة للمشروع' : 'شرح قصصي مبسط (ELI5 👶)'}</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> {isNoExamProj ? 'أوامر وتوجيهات AI Agent حرفية جاهزة' : 'محرر أكواد بـ 3 تلميحات ومصحح AI'}</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> {isNoExamProj ? 'تشريح الكود والربط المعماري الحي' : 'بوابات زعماء واختبارات وحدات'}</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> ورشة بناء مشروع GitHub & AI</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-300 font-bold -mx-2">
                <span className="flex items-center gap-2"><Trophy size={16} className="text-amber-400"/> شهادة إتمام الكورس موثقة</span>
                <span className="text-amber-400 font-bold">مشمول 🏆</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. شريط الكورسات الشقيقة */}
      {/* ================================================================= */}
      {siblingCourses.length > 1 && (
        <div className="max-w-[1536px] w-full mx-auto px-6 md:px-12 lg:px-24 pt-16">
          <div className="bg-[#0b1120] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
              <h3 className="text-sm md:text-base font-black text-amber-400 flex items-center gap-2">
                <Layers size={20} /> خريطة مسار الشهادة المهنية المتسلسل ({siblingCourses.length} كراش كورسات):
              </h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">أنت تستعرض الآن الكورس رقم {course.courseOrder}</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
              {siblingCourses.map((sib, idx) => {
                const isCurrent = sib._id === course._id;
                return (
                  <Link
                    key={sib._id}
                    to={`/course/${sib._id}`}
                    className={`shrink-0 px-5 py-3 rounded-xl text-xs md:text-sm font-bold border transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    كورس {idx + 1}: {sib.shortCleanTitle.slice(0, 35)}...
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. قسم الآفاق المهنية والمادية واللغوية */}
      {/* ================================================================= */}
      <div className="max-w-[1536px] w-full mx-auto px-6 md:px-12 lg:px-24 pt-16">
        <div className="bg-gradient-to-br from-slate-900 via-[#0b1120] to-[#0b1120] border border-slate-800 rounded-3xl p-8 md:p-12 space-y-10 shadow-2xl">
          <div>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Compass size={18} /> العائد المباشر من دراسة هذا الكراش كورس
            </span>
            <h2 className="heading-alex text-2xl md:text-4xl font-black text-white">
              {isLang
                ? 'ما هي القدرات اللغوية والآفاق العالمية التي ستكتسبها فور إنهاء هذا الكورس؟'
                : 'ما هي الآفاق المهنية والمادية التي ستفتح لك فور إنهاء هذا الكورس؟'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  {isLang ? <Globe size={24} /> : <DollarSign size={24} />}
                </div>
                <span className="mono-code text-sm font-black text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full" dir="ltr">
                  {course.horizons.gigPriceRange}
                </span>
              </div>
              <h3 className="heading-alex text-lg font-bold text-white">
                {isLang ? '1. الطلاقة والمواقف الحياتية والعملية' : '1. خدمة عمل حر جاهزة للبيع'}
              </h3>
              <p className="text-[13px] text-slate-300 leading-[1.9]">
                {course.horizons.freelanceGig}
              </p>
            </div>

            <div className="bg-slate-950/90 border border-indigo-500/30 rounded-2xl p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Briefcase size={24} />
              </div>
              <h3 className="heading-alex text-lg font-bold text-white">
                {isLang ? '2. الأثر في الاختبارات الدولية والشركات' : '2. القفزة في سيرتك الذاتية والشركات'}
              </h3>
              <p className="text-[13px] text-slate-300 leading-[1.9]">
                {course.horizons.careerImpact}
              </p>
            </div>

            <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                {isLang ? <Headphones size={24} /> : <Bot size={24} />}
              </div>
              <h3 className="heading-alex text-lg font-bold text-white">
                {isLang ? '3. اختراق الأذن السمعية والنطق مع الـ AI' : '3. بناء مشاريعك الخاصة بسرعة 10x'}
              </h3>
              <p className="text-[13px] text-slate-300 leading-[1.9]">
                {course.horizons.saasCapability}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-red-950/15 border border-red-500/25 rounded-3xl p-7 flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 font-black text-sm flex items-center justify-center shrink-0 mt-0.5">✕</span>
              <div>
                <h4 className="text-sm font-black text-red-400 mb-1.5">حالتك قبل هذا الكراش كورس:</h4>
                <p className="text-[13.5px] text-slate-300 leading-[1.9]">{course.horizons.beforeState}</p>
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/35 rounded-3xl p-7 flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <div>
                <h4 className="text-sm font-black text-emerald-400 mb-1.5">حالتك فور إتمام هذا الكراش كورس:</h4>
                <p className="text-[13.5px] text-slate-200 leading-[1.9]">{course.horizons.afterState}</p>
              </div>
            </div>
          </div>

          {course.extractedSkills?.length > 0 && (
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-slate-400 ml-2">
                {isLang ? 'المهارات اللغوية والصوتية التي ستتقنها:' : 'المهارات التقنية التي ستتقنها:'}
              </span>
              {course.extractedSkills.map((sk, i) => (
                <span key={i} className="bg-slate-950 border border-slate-700 text-emerald-300 text-xs font-bold px-4 py-2 rounded-xl" dir="ltr">
                  ✓ {sk}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. قسم المنهج الدراسي التفصيلي */}
      {/* ================================================================= */}
      <div className="max-w-[1536px] w-full mx-auto px-6 md:px-12 lg:px-24 py-16 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-slate-800 pb-6">
          <div>
            <span className="text-sm font-black text-indigo-400 uppercase tracking-wider block mb-2">
              {isLang ? 'خريطة الوحدات الموقفية، الصوتيات، والمحادثات (Cambridge Cycle)' : 'خريطة الدروس والبوابات ومختبرات الكود'}
            </span>
            <h2 className="heading-alex text-3xl md:text-4xl font-black text-white flex items-center gap-3">
              <BookOpen className="text-emerald-400" /> المنهج الدراسي التفصيلي ({Object.keys(groupedSections).length} وحدات)
            </h2>
          </div>
          <span className="bg-slate-900 text-emerald-400 px-5 py-2.5 rounded-xl text-sm font-black border border-slate-800 self-start">
            إجمالي {lessons.length} درساً وتحدياً • +{course.xpReward} EXP
          </span>
        </div>
        
        {Object.keys(groupedSections).length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
            <Video size={56} className="text-slate-700 mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">جاري إعداد الدروس</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSections).map(([sectionName, secLessons], sIdx) => {
              const isProjectUnit = sectionName.includes('مشروع') || sectionName.includes('GitHub') || sectionName.includes('محادثة') || sectionName.includes('مراجعة');
              const isOpen = openUnitIdx === sIdx;
              const sectionSummary = getSectionSummaryData(sectionName, secLessons, isProjectUnit, sIdx);

              return (
                <div 
                  key={sIdx} 
                  className={`border-2 rounded-3xl overflow-hidden transition-all shadow-lg ${
                    isProjectUnit 
                      ? 'bg-emerald-950/10 border-emerald-500/40' 
                      : isOpen ? 'bg-[#0b1120] border-indigo-500/40' : 'bg-[#0b1120] border-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenUnitIdx(isOpen ? -1 : sIdx)}
                    className="w-full p-6 md:p-7 bg-slate-900/70 hover:bg-slate-900 flex items-center justify-between gap-5 text-right transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isProjectUnit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {isLang ? <Headphones size={24} /> : isProjectUnit ? <Bot size={24} /> : <Layers size={22} />}
                      </div>
                      <div>
                        <h3 className="heading-alex font-bold text-lg md:text-xl text-white">
                          {sectionName}
                        </h3>
                        <p className="text-[13px] text-slate-400 mt-1">
                          {isLang
                            ? `🗣️ تضم ${secLessons.length} دروس متكاملة (مفردات + حوار Cambridge + قواعد بالمكعبات + صوتيات واستماع)`
                            : isNoExamProj
                              ? `🛠️ تضم ${secLessons.length} خطوات بناء برمجية عملية مع أوامر الـ AI Agent`
                              : isProjectUnit 
                                ? '🚀 ورشة بناء المشروع خطوة بخطوة مع أوامر الـ AI Agent ورفعه على GitHub' 
                                : `تضم ${secLessons.length} دروس وتحديات + اختبار الوحدة النهائي المختلط`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="hidden sm:inline-block text-[13px] font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/20">
                        +{secLessons.length * 50} EXP
                      </span>
                      <ChevronDown size={22} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-800 bg-slate-950/40">
                      
                      <div className="p-6 md:p-8 border-b border-slate-800/80">
                        <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
                          
                          {sectionSummary.unitSummary && (
                            <div className="border-b border-slate-800/80 pb-3">
                              <span className="text-[11px] font-black text-indigo-400 flex items-center gap-1.5 mb-1">
                                <Sparkles size={13} /> ملخص الوحدة:
                              </span>
                              <p className="text-sm text-white font-semibold leading-relaxed">
                                {sectionSummary.unitSummary}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-[13px] font-black text-amber-400 flex items-center gap-2 mb-2">
                                <Target size={16} /> ماذا ستتعلم وتطبق في هذه الوحدة؟
                              </h4>
                              <p className="text-[13.5px] text-slate-200 leading-[1.85]">
                                {sectionSummary.whatYouLearn}
                              </p>
                            </div>
                            <div className="lg:border-r border-slate-800 lg:pr-6">
                              <h4 className="text-[13px] font-black text-emerald-400 flex items-center gap-2 mb-2">
                                <Lightbulb size={16} /> الفائدة العملية والمهنية من هذه الوحدة:
                              </h4>
                              <p className="text-[13.5px] text-slate-300 leading-[1.85]">
                                {sectionSummary.whyItMatters}
                              </p>
                            </div>
                          </div>

                          {sectionSummary.keyHighlights?.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                              <span className="text-[11px] font-bold text-slate-400">أبرز محاور الوحدة:</span>
                              {sectionSummary.keyHighlights.map((item, idx) => (
                                <span key={idx} className="text-[11px] bg-slate-950 border border-slate-800 text-indigo-300 px-3 py-1 rounded-lg font-medium">
                                  • {item}
                                </span>
                              ))}
                            </div>
                          )}

                        </div>
                      </div>

                      <div className="divide-y divide-slate-800/70">
                        {secLessons.map((lesson) => {
                          const isRedGate = lesson.type === 'red_gate';
                          const isBoss = lesson.type === 'boss_quiz';
                          const isUnitExam = lesson.type === 'unit_exam';
                          const cleanDesc = cleanTextFromMarkers(lesson.description);

                          return (
                            <div key={lesson._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-slate-900/60 transition-colors">
                              <div className="flex items-start gap-5">
                                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-sm mt-0.5 ${
                                  isRedGate ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                  : isBoss ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                                  : isUnitExam ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                  : 'bg-slate-950 text-emerald-400 border border-slate-800'
                                }`}>
                                  {isRedGate ? <Flame size={18}/> : isBoss ? <Skull size={18}/> : isUnitExam ? <Trophy size={18}/> : lesson.order}
                                </div>

                                <div>
                                  <div className="flex flex-wrap items-center gap-2.5">
                                    <h4 className="font-bold text-base md:text-[17px] text-slate-100">{lesson.title}</h4>
                                    {isRedGate && <span className="text-[11px] font-black bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded">بوابة حمراء S-Rank</span>}
                                    {isBoss && <span className="text-[11px] font-black bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded">{isLang ? 'تحدي التثبيت اللغوي' : 'زعيم الوحدة'}</span>}
                                    {isUnitExam && <span className="text-[11px] font-black bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded">{isLang ? 'اختبار الوحدة اللغوي الشامل' : 'اختبار نهائي مختلط'}</span>}
                                  </div>
                                  {cleanDesc && <p className="text-slate-400 text-[13px] mt-1.5 leading-relaxed">{cleanDesc}</p>}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                                <span className="mono-code text-[13px] text-slate-500 font-bold">+50 EXP</span>
                                {isEnrolled || lesson.isFreePreview ? (
                                  <Link 
                                    to={`/course/${course._id}/learn`} 
                                    className="text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-all"
                                  >
                                    ابدأ الدرس
                                  </Link>
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                                    <Lock size={16} />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
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