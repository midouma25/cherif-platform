import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlayCircle, Clock, Award, BookOpen, ArrowRight, Lock, Video, 
  Trophy, Flame, Skull, GitBranch, Bot, Code, Layers, CheckCircle2, Sparkles,
  DollarSign, Briefcase, Zap, Compass, ChevronDown, Terminal, Rocket, Target, Lightbulb,
  Globe, Headphones, Mic, Volume2, FileText, Eye, Upload, X, Square, MessageSquare, PenTool, Puzzle
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

// تنظيف تكرار "كراش كورس 1: كراش كورس 1" من العنوان
const sanitizeDuplicateCoursePrefix = (title = '') => {
  return title
    .replace(/^((?:الكراش كورس|كراش كورس|الكورس)\s*\d+)\s*:\s*(?:الكراش كورس|كراش كورس|الكورس)\s*\d+\s*[-:]?\s*/i, '$1: ')
    .trim();
};

// استخراج خريطة ملخصات جميع الوحدات المحقونة داخل course.description
const extractCourseUnitsMap = (rawCourseDescription = '') => {
  if (!rawCourseDescription || !rawCourseDescription.includes('|||UNITS_MAP:')) return {};
  try {
    const jsonPart = rawCourseDescription.split('|||UNITS_MAP:')[1].trim();
    const parsed = JSON.parse(jsonPart);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
};

// استخراج ملخص الوحدة إن كان محقوناً داخل وصف الدرس الأول
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

// ============================================================================
// 🎧 محلل نصوص الاستماع الصوتية (يحول codeSnippet إلى جدول جمل صوتية منظمة)
// ============================================================================
export const parseAudioShadowingScript = (rawSnippet = '') => {
  if (!rawSnippet || !rawSnippet.includes('IPA:')) return [];
  const lines = rawSnippet.split('\n').map(l => l.trim()).filter(Boolean);
  const items = [];
  let currentItem = null;

  lines.forEach(line => {
    if (line.startsWith('🎧')) return;
    const numberedMatch = line.match(/^(\d+)[.) -]+\s*(.+)$/);
    if (numberedMatch && !line.includes('IPA:')) {
      if (currentItem) items.push(currentItem);
      currentItem = {
        order: numberedMatch[1],
        sentence: numberedMatch[2].trim(),
        ipa: '',
        meaning: ''
      };
    } else if (line.includes('IPA:')) {
      const cleanLine = line.replace(/^🔊\s*/, '');
      const parts = cleanLine.split('|');
      const ipaPart = (parts[0] || '').replace(/IPA:\s*/i, '').trim();
      const meaningPart = (parts[1] || '').replace(/المعنى:\s*/i, '').trim();
      if (currentItem) {
        currentItem.ipa = ipaPart;
        currentItem.meaning = meaningPart;
      } else {
        items.push({
          order: items.length + 1,
          sentence: ipaPart,
          ipa: ipaPart,
          meaning: meaningPart
        });
      }
    }
  });

  if (currentItem) items.push(currentItem);
  return items;
};

// تصنيف نوع الدرس داخل جدول الوحدة (مفردات، حوار، ليغو، نطق، استماع، كتابة، زعيم، اختبار هجين)
const classifyLessonBadge = (lesson, isLang) => {
  const t = (lesson.title || '').toLowerCase();
  if (lesson.type === 'red_gate') {
    return { label: 'بوابة حمراء كودية', color: 'bg-red-500/20 text-red-300 border-red-500/40', icon: Flame };
  }
  if (lesson.type === 'boss_quiz') {
    return { label: isLang ? 'تحدي التثبيت السمعي واللغوي' : 'بوابة الزعيم', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: Skull };
  }
  if (lesson.type === 'unit_exam') {
    return { label: isLang ? 'اختبار شامل (لغوي + برمجي هجين)' : 'اختبار نهاية الوحدة', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: Trophy };
  }

  if (isLang) {
    if (t.includes('word power') || t.includes('المفردات') || t.includes('القوالب')) {
      return { label: '1. المفردات والقوالب (Chunks)', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: Sparkles };
    }
    if (t.includes('conversation') || t.includes('المحادثة')) {
      return { label: '2. محادثة Cambridge واقعية', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: MessageSquare };
    }
    if (t.includes('lego') || t.includes('المكعبات') || t.includes('تركيب الجملة')) {
      return { label: '3. هندسة الجملة بالمكعبات (Lego)', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Puzzle };
    }
    if (t.includes('pronunciation') || t.includes('النطق') || t.includes('ipa')) {
      return { label: '4. معمل الصوتيات و IPA', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30', icon: Volume2 };
    }
    if (t.includes('shadowing') || t.includes('الاستماع') || t.includes('الترديد')) {
      return { label: '5. مختبر الاستماع والترديد', color: 'bg-pink-500/15 text-pink-300 border-pink-500/30', icon: Headphones };
    }
    if (t.includes('reading') || t.includes('writing') || t.includes('القراءة والكتابة')) {
      return { label: '6. ورشة القراءة والكتابة', color: 'bg-teal-500/15 text-teal-300 border-teal-500/30', icon: PenTool };
    }
  }

  return { label: isLang ? 'درس لغوي وتطبيقي' : 'درس ومختبر كود', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', icon: Code };
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

  // نافذة معاينة الدرس والاستوديو الصوتي داخل صفحة التفاصيل
  const [previewLesson, setPreviewLesson] = useState(null);
  const [speakingText, setSpeakingText] = useState('');
  const jsonFileInputRef = useRef(null);

  // دالة النطق الصوتي الفوري بـ 3 سرعات
  const speakSentence = (text, rate = 1.0) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = (text || '').replace(/🔊.*$/g, '').replace(/\|.*$/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.lang = 'en-US';
    utterance.onstart = () => setSpeakingText(`${cleanText}_${rate}`);
    utterance.onend = () => setSpeakingText('');
    utterance.onerror = () => setSpeakingText('');
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingText('');
    }
  };

  // ميزة إضافية: استيراد ملف JSON محلي لمعاينته مباشرة في صفحة التفاصيل وقاعة الدرس
  const handleLoadLocalCourseJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        localStorage.setItem('cherif_active_local_course_json', JSON.stringify(data));
        const cleanTitle = sanitizeDuplicateCoursePrefix(data.courseTitle || data.title || 'كورس محلي');
        const parsed = parseCourseHierarchy({
          _id: id || 'local_json_course',
          title: cleanTitle,
          description: data.courseDescription || data.description || '',
          difficulty: data.difficultyLevel || 'Pre-A1',
          estimatedHours: parseInt(String(data.estimatedHours || '18').match(/\d+/)?.[0] || '18', 10),
          price: 0,
          certificateMeta: {
            subCertificateBadge: data.certificateBadge,
            githubProject: data.githubProject,
            skills: data.skills,
            unitSummariesMap: data.unitSummariesMap || {}
          }
        });

        const flatLessons = [];
        let orderCounter = 1;
        (data.sections || data.blueprint || []).forEach(sec => {
          (sec.lessons || []).forEach(l => {
            flatLessons.push({
              ...l,
              _id: `local_lesson_${orderCounter}`,
              order: orderCounter++,
              section: sec.sectionName,
              isFreePreview: true
            });
          });
        });

        setCourse({
          ...parsed,
          title: cleanTitle,
          embeddedUnitsMap: data.unitSummariesMap || {}
        });
        setLessons(flatLessons);
        setIsEnrolled(true);
      } catch (err) {
        alert('❌ ملف JSON غير صالح.');
      }
    };
    reader.readAsText(file);
  };

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
          const rawCourse = courseRes.data.course;
          const embeddedUnitsMap = extractCourseUnitsMap(rawCourse.description);
          const cleanedTitle = sanitizeDuplicateCoursePrefix(rawCourse.title);
          const parsedCurrent = parseCourseHierarchy({
            ...rawCourse,
            title: cleanedTitle,
            description: cleanTextFromMarkers(rawCourse.description)
          });

          setCourse({
            ...parsedCurrent,
            title: cleanedTitle,
            cleanDescription: cleanTextFromMarkers(parsedCurrent.cleanDescription),
            embeddedUnitsMap
          });

          if (parsedCurrent.isPartOfCertificate && allCoursesRes.data?.courses) {
            const siblings = allCoursesRes.data.courses
              .map(c => parseCourseHierarchy({ ...c, title: sanitizeDuplicateCoursePrefix(c.title), description: cleanTextFromMarkers(c.description) }))
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
    return () => stopSpeaking();
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

  const { groupedSections, syllabusStats, sampleAudioItems } = useMemo(() => {
    let bossGatesCount = 0;
    let unitExamsCount = 0;
    let codingLabsCount = 0;
    let extractedAudioSamples = [];

    const grouped = lessons.reduce((acc, lesson) => {
      const secName = lesson.section || 'الوحدة 1: الأساسيات';
      if (!acc[secName]) acc[secName] = [];
      acc[secName].push(lesson);

      if (lesson.type === 'red_gate' || lesson.type === 'boss_quiz') bossGatesCount++;
      else if (lesson.type === 'unit_exam') unitExamsCount++;
      else codingLabsCount++;

      if (extractedAudioSamples.length < 6 && lesson.codeSnippet && lesson.codeSnippet.includes('IPA:')) {
        const parsedAudio = parseAudioShadowingScript(lesson.codeSnippet);
        extractedAudioSamples = [...extractedAudioSamples, ...parsedAudio].slice(0, 6);
      }

      return acc;
    }, {});

    return {
      groupedSections: grouped,
      sampleAudioItems: extractedAudioSamples,
      syllabusStats: {
        unitsCount: Object.keys(grouped).length || 8,
        bossGatesCount,
        unitExamsCount,
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
      {/* 1. القسم العلوي الملحمي */}
      {/* ================================================================= */}
      <div className={`bg-gradient-to-b ${isLang ? 'from-purple-950/45 via-slate-950 to-[#020617]' : 'from-indigo-950/35 via-slate-950 to-[#020617]'} border-b border-slate-800 relative overflow-hidden`}>
        <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-[1536px] w-full mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-20 relative z-20 flex flex-col lg:flex-row gap-16 xl:gap-24 items-start">
          
          <div className="flex-1 space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link to="/academy" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-bold text-sm">
                <ArrowRight size={16} /> العودة لكتالوج الأكاديمية
              </Link>

              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="file"
                  accept=".json"
                  ref={jsonFileInputRef}
                  onChange={handleLoadLocalCourseJSON}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => jsonFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all"
                  title="معاينة ملف JSON محلي مباشرة"
                >
                  <Upload size={12} /> معاينة ملف JSON
                </button>

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
                  <Sparkles size={15} /> {isLang ? 'كورس لغوي وصوتي وكودي تفاعلي متكامل' : 'كراش كورس وحيد ومستقل'}
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
                    <strong className="text-purple-300 block mb-1.5">🗣️ لماذا صُمم هذا الكورس بنظام (Cambridge × Lego Grammar × Hybrid Code)؟</strong>
                    هذا الكورس يجمع بين <strong className="text-white">التأسيس الصوتي واللغوي من الحروف (Phonics & IPA)</strong> وبين <strong className="text-amber-400">التفكير المنطقي بالمكعبات والجداول المنظمة</strong>:
                    في كل وحدة تمر بـ 6 محطات متكاملة (المفردات والقوالب الذهبية ➔ المحادثة الواقعية ➔ معادلات الليغو للقواعد ➔ تشريح مخارج الفم والـ IPA ➔ استوديو الاستماع والترديد بـ 3 سرعات ➔ ورشة الكتابة والاختبارات الهجينة).
                  </>
                ) : isNoExamProj ? (
                  <>
                    <strong className="text-emerald-400 block mb-1.5">🏗️ لماذا صُمم هذا الكورس بنمط (البناء الصافي من الصفر - بدون اختبارات)؟</strong>
                    يركز 100% على البناء الهندسي العملي ملفاً بملف مع إعطائك الأوامر الحرفية الجاهزة لتوجيه الـ AI Agent.
                  </>
                ) : (
                  <>
                    <strong className="text-emerald-400 block mb-1.5">🧠 لماذا صُمم هذا الكراش كورس بهذه الطريقة؟</strong>
                    ستدرس كل مفهوم عبر تشبيه قصصي مبسط (مبدأ فاينمان ELI5 👶)، ثم نأخذك لتشريح الكود وتطبيقه بيدك في مختبر الكود التفاعلي.
                  </>
                )}
              </div>
            </div>

            {/* بطاقات الإحصائيات الأربع */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <Layers size={20} className="text-indigo-400 mb-1.5" />
                <p className="text-xl font-black text-white">{syllabusStats.unitsCount} وحدات</p>
                <p className="text-xs text-slate-400">{isLang ? 'دورة كامبريدج السداسية' : 'متدرجة من الصفر'}</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                {isLang ? <Volume2 size={20} className="text-purple-400 mb-1.5" /> : <Terminal size={20} className="text-emerald-400 mb-1.5" />}
                <p className="text-xl font-black text-white">{syllabusStats.codingLabsCount}+ درساً</p>
                <p className="text-xs text-slate-400">{isLang ? 'استوديو نطق IPA + مكعبات' : 'مختبر كود تفاعلي'}</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <Flame size={20} className="text-red-400 mb-1.5" />
                <p className="text-xl font-black text-white">
                  {isNoExamProj ? '0 اختبارات' : `${syllabusStats.bossGatesCount + syllabusStats.unitExamsCount || 8} اختبارات`}
                </p>
                <p className="text-xs text-slate-400">{isLang ? 'بوابات صوتية + اختبار هجين' : 'زعماء واختبارات'}</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                {isLang ? <Mic size={20} className="text-amber-400 mb-1.5" /> : <GitBranch size={20} className="text-amber-400 mb-1.5" />}
                <p className="text-xl font-black text-white">{isLang ? 'AI Coach' : '1 مشروع'}</p>
                <p className="text-xs text-slate-400">{isLang ? 'غرفة محادثة صوتية حية' : 'يُرفع على GitHub'}</p>
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
                    {isLang ? 'تحدي التخرج الصوتي والعملي:' : 'مشروع معرض الأعمال (GitHub):'}
                  </p>
                  <p className="text-[15px] font-black text-white mt-1">{course.githubProjectTitle}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* بطاقة الاشتراك الجانبية */}
          <div className="w-full lg:w-[420px] xl:w-[460px] bg-[#0b1120] border-2 border-emerald-500/40 rounded-3xl p-8 xl:p-10 shadow-[0_0_60px_rgba(16,185,129,0.12)] shrink-0 space-y-6 lg:sticky lg:top-28">
            <div className="text-center pb-5 border-b border-slate-800">
              <span className="inline-block text-xs font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-3">
                🔥 القيمة الفعلية للكورس والاستوديو الصوتي: <del className="text-slate-400">$199</del>
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
                <PlayCircle size={22} /> دخول قاعة الدراسة والاستوديو الصوتي
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
              <p className="font-black text-white text-sm mb-3">ماذا يضمن لك اشتراكك في هذا الكورس؟</p>
              {isLang ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> معادلات مكعبات الليغو (Lego Grammar 👶)</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> جداول استماع IPA بـ 3 سرعات صوتية 🔊</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> مختبر كتابة + تحديات كودية لغوية هجينة 💻</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> برومبتات محادثة صوتية مع AI Coach 🎙️</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> شرح قصصي مبسط (ELI5 👶)</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> محرر أكواد بـ 3 تلميحات ومصحح AI</span>
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
      {/* 2. 🎧 استوديو العينة الصوتية والجدول التفاعلي المباشر (للكورسات اللغوية) */}
      {/* ================================================================= */}
      {isLang && sampleAudioItems.length > 0 && (
        <div className="max-w-[1536px] w-full mx-auto px-6 md:px-12 lg:px-24 pt-14">
          <div className="bg-gradient-to-br from-purple-950/35 via-[#0b1120] to-[#0b1120] border-2 border-purple-500/40 rounded-3xl p-7 md:p-10 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-black text-purple-300 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
                  <Headphones size={14} /> معاينة حية من استوديو الصوتيات داخل الكورس
                </span>
                <h2 className="heading-alex text-2xl md:text-3xl font-black text-white">
                  🎧 جدول الاستماع والترديد الصوتي (Interactive IPA & Shadowing Table)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  اضغط على أي جملة لسماع نطقها بالسرعة الطبيعية (1.0x) أو سرعة الترديد (0.75x) أو سرعة تفكيك الحروف للمبتدئين (0.5x):
                </p>
              </div>
              {speakingText && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 self-start"
                >
                  <Square size={14} /> إيقاف الصوت
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-xs font-black text-slate-400">
                    <th className="p-4 w-12 text-center">#</th>
                    <th className="p-4">الجملة الإنجليزية / القالب (Target Chunk)</th>
                    <th className="p-4">الرمز الصوتي العالمي (IPA)</th>
                    <th className="p-4">المعنى العربي</th>
                    <th className="p-4 text-center">مشغل النطق التفاعلي (3 سرعات)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-sm">
                  {sampleAudioItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 text-center font-black text-purple-400 mono-code">{idx + 1}</td>
                      <td className="p-4 font-black text-white text-base" dir="ltr">{item.sentence}</td>
                      <td className="p-4 mono-code text-emerald-400 text-xs" dir="ltr">{item.ipa}</td>
                      <td className="p-4 text-slate-300 font-semibold">{item.meaning}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => speakSentence(item.sentence, 1.0)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all ${
                              speakingText === `${item.sentence}_1`
                                ? 'bg-purple-500 text-white'
                                : 'bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            <Volume2 size={12} /> 1.0x
                          </button>
                          <button
                            type="button"
                            onClick={() => speakSentence(item.sentence, 0.75)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all ${
                              speakingText === `${item.sentence}_0.75`
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            🐢 0.75x
                          </button>
                          <button
                            type="button"
                            onClick={() => speakSentence(item.sentence, 0.5)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all ${
                              speakingText === `${item.sentence}_0.5`
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            🧒 0.5x
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. قسم المنهج الدراسي التفصيلي + جدول تنظيم الدروس والمحطات لكل وحدة */}
      {/* ================================================================= */}
      <div className="max-w-[1536px] w-full mx-auto px-6 md:px-12 lg:px-24 py-16 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-slate-800 pb-6">
          <div>
            <span className="text-sm font-black text-indigo-400 uppercase tracking-wider block mb-2">
              {isLang ? 'خريطة الوحدات الموقفية، الصوتيات، والاختبارات الهجينة (Cambridge × Lego Matrix)' : 'خريطة الدروس والبوابات ومختبرات الكود'}
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
                            ? `🗣️ تضم ${secLessons.length} محطات (مفردات + حوار Cambridge + قواعد بالمكعبات + صوتيات IPA + استماع + اختبار هجين)`
                            : `تضم ${secLessons.length} دروس وتحديات عملية`}
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
                      
                      {/* بطاقة ملخص الوحدة */}
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

                      {/* 📋 جدول الدروس والمحطات المنظم داخل الوحدة */}
                      <div className="p-6 overflow-x-auto">
                        <table className="w-full text-right border-collapse bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-800">
                          <thead>
                            <tr className="bg-slate-900 border-b border-slate-800 text-xs font-black text-slate-400">
                              <th className="p-4 w-14 text-center">#</th>
                              <th className="p-4">نوع المحطة / التخصص</th>
                              <th className="p-4">عنوان الدرس والمهارة التطبيقية</th>
                              <th className="p-4 text-center">محتوى المختبر</th>
                              <th className="p-4 text-center">الإجراء</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/70 text-sm">
                            {secLessons.map((lesson, lIdx) => {
                              const badge = classifyLessonBadge(lesson, isLang);
                              const BadgeIcon = badge.icon;
                              const cleanDesc = cleanTextFromMarkers(lesson.description);
                              const hasAudio = Boolean(lesson.codeSnippet && lesson.codeSnippet.includes('IPA:'));
                              const hasExercise = Boolean(lesson.codingPractice?.taskQuestion || lesson.bossQuiz?.length);

                              return (
                                <tr key={lesson._id || lIdx} className="hover:bg-slate-900/60 transition-colors">
                                  <td className="p-4 text-center font-black text-slate-400 mono-code">
                                    {lIdx + 1}
                                  </td>
                                  <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-lg border ${badge.color}`}>
                                      <BadgeIcon size={13} /> {badge.label}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <p className="font-bold text-white text-sm md:text-base">{lesson.title}</p>
                                    {cleanDesc && <p className="text-xs text-slate-400 mt-1">{cleanDesc}</p>}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                      {hasAudio && (
                                        <span className="text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md">
                                          🔊 صوتيات IPA
                                        </span>
                                      )}
                                      {hasExercise && (
                                        <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                                          ✍️ تمرين تفاعلي
                                        </span>
                                      )}
                                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md mono-code">
                                        +50 EXP
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      {(lesson.content || lesson.codeSnippet || lesson.bossQuiz?.length) && (
                                        <button
                                          type="button"
                                          onClick={() => setPreviewLesson(lesson)}
                                          className="text-xs font-bold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                                        >
                                          <Eye size={13} /> معاينة
                                        </button>
                                      )}
                                      {isEnrolled || lesson.isFreePreview ? (
                                        <Link 
                                          to={`/course/${course._id}/learn`} 
                                          className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-all"
                                        >
                                          ابدأ الدرس
                                        </Link>
                                      ) : (
                                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                                          <Lock size={14} />
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 🔍 نافذة المعاينة السريعة للدرس والصوتيات (Lesson Quick Preview Modal) */}
      {/* ================================================================= */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b1120] border-2 border-indigo-500/40 rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div>
                <span className="text-xs font-black text-emerald-400 block mb-1">معاينة محتوى الدرس والاستوديو الصوتي</span>
                <h3 className="heading-alex text-xl font-black text-white">{previewLesson.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => { stopSpeaking(); setPreviewLesson(null); }}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
              {/* إذا كان الدرس يحتوي على جمل صوتية IPA نعرضها في جدول ناطق */}
              {previewLesson.codeSnippet && previewLesson.codeSnippet.includes('IPA:') && (
                <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-4">
                  <h4 className="text-sm font-black text-purple-300 flex items-center gap-2">
                    <Headphones size={18} /> 🎧 استوديو الاستماع والنطق (اضغط للاستماع):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parseAudioShadowingScript(previewLesson.codeSnippet).map((item, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-white text-sm" dir="ltr">{item.sentence}</p>
                          <p className="mono-code text-xs text-emerald-400 mt-0.5" dir="ltr">{item.ipa}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.meaning}</p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => speakSentence(item.sentence, 1.0)}
                            className="bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <Volume2 size={12} /> 1.0x
                          </button>
                          <button
                            type="button"
                            onClick={() => speakSentence(item.sentence, 0.65)}
                            className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[11px] font-black px-3 py-1 rounded-lg"
                          >
                            🐢 0.65x
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewLesson.content && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-300 leading-[1.95] whitespace-pre-wrap">
                  {previewLesson.content}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
              <button
                type="button"
                onClick={() => { stopSpeaking(); setPreviewLesson(null); }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                إغلاق المعاينة
              </button>
              <Link
                to={`/course/${course._id}/learn`}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-6 py-2.5 rounded-xl"
              >
                فتح الدرس كاملاً في قاعة الدراسة التفاعلية ←
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseDetails;