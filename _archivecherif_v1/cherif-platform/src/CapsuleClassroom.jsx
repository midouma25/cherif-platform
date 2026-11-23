// [STANDALONE CAPSULE CLASSROOM & PLATFORM ONBOARDING FUNNEL - V3]
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Sparkles, Rocket, CheckCircle2, ExternalLink, Copy, Check, BookOpen,
  Code, HelpCircle, Trophy, Zap, ArrowLeft, Layers, Briefcase, Lock,
  Globe, Terminal, Star, PlayCircle, Award, ShieldCheck
} from 'lucide-react';

const STUDIO_BADGE_MAP = {
  template_binary: { label: '⚖️ كبسولة المقارنة الثنائية (أداة تقليدية ❌ ضد أداة ذكية ✅)', accent: 'from-emerald-600/30 to-teal-950/40 border-emerald-500/40 text-emerald-300' },
  template_triple: { label: '🏆 كبسولة المقارنة الثلاثية (سيئ 🔴 / جيد 🟡 / احترافي 🟢)', accent: 'from-amber-600/30 to-yellow-950/40 border-amber-500/40 text-amber-300' },
  roadmap_steps: { label: '🗺️ كبسولة خريطة الطريق التطبيقية (Step-by-Step Roadmap)', accent: 'from-teal-600/30 to-cyan-950/40 border-teal-500/40 text-teal-300' },
  business_saas: { label: '💰 كبسولة هندسة الأرباح وبناء الـ SaaS', accent: 'from-yellow-600/30 to-amber-950/40 border-yellow-500/40 text-yellow-300' },
  story_lab: { label: '📖 كبسولة دراسة الحالة والدليل التطبيقي (Playbook)', accent: 'from-purple-600/30 to-fuchsia-950/40 border-purple-500/40 text-purple-300' },
  commercial_lab: { label: '🎥 كبسولة عرض النظام والدليل التنفيذي للمشاريع', accent: 'from-orange-600/30 to-rose-950/40 border-orange-500/40 text-orange-300' }
};

const extractCapsuleMetadata = (courseObj) => {
  if (!courseObj) return { studioType: "template_binary", structuredSlides: [], cleanDesc: "" };
  const rawDesc = courseObj.description || "";
  const cleanDesc = rawDesc.split("|||CAPSULE_META:")[0].split("|||UNITS_MAP:")[0].trim();
  let meta = courseObj.certificateMeta || {};
  if (rawDesc.includes("|||CAPSULE_META:")) {
    try {
      const jsonPart = rawDesc.split("|||CAPSULE_META:")[1].split("|||UNITS_MAP:")[0].trim();
      meta = { ...meta, ...JSON.parse(jsonPart) };
    } catch (_) {}
  }
  return {
    studioType: meta.studioType || "template_binary",
    triggerKeyword: meta.triggerKeyword || "",
    carouselTopic: meta.carouselTopic || courseObj.title || "",
    structuredSlides: Array.isArray(meta.structuredSlides) ? meta.structuredSlides : [],
    cleanDesc
  };
};

const getToolLogoUrl = (domain = "", toolName = "") => {
  const cleanDom = String(domain || "").toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].trim();
  const fallbackDom = String(toolName || "").toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
  return "https://www.google.com/s2/favicons?domain=" + (cleanDom || fallbackDom) + "&sz=128";
};

const CapsuleClassroom = () => {
  const { id } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [platformTracks, setPlatformTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visitorExp, setVisitorExp] = useState(250);
  const [completedStations, setCompletedStations] = useState([]);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizCorrect, setQuizCorrect] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const fetchCapsuleAndPlatform = async () => {
      setLoading(true);
      try {
        const [courseRes, lessonsRes, allCoursesRes] = await Promise.all([
          axios.get("http://127.0.0.1:5001/api/courses/public/" + id),
          axios.get("http://127.0.0.1:5001/api/courses/" + id + "/lessons"),
          axios.get("http://127.0.0.1:5001/api/courses/public").catch(() => ({ data: { courses: [] } }))
        ]);
        if (courseRes.data?.success) {
          setCapsule(courseRes.data.course);
        }
        if (lessonsRes.data?.success) {
          setLessons(lessonsRes.data.lessons || []);
        }
        if (allCoursesRes.data?.courses) {
          const majorCourses = allCoursesRes.data.courses.filter(c =>
            c._id !== id &&
            c.courseCategory !== "carousel_capsule" &&
            !c.certificateMeta?.isCarouselCapsule &&
            !(c.description || "").includes("|||CAPSULE_META:") &&
            !/^كبسولة/i.test(c.title || "")
          );
          setPlatformTracks(majorCourses.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading capsule:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCapsuleAndPlatform();
  }, [id]);

  const capsuleMeta = useMemo(() => extractCapsuleMetadata(capsule), [capsule]);
  const studioBadge = STUDIO_BADGE_MAP[capsuleMeta.studioType] || STUDIO_BADGE_MAP.template_binary;
  const activeLesson = lessons[activeLessonIdx] || null;

  const handleSelectStation = (idx) => {
    setActiveLessonIdx(idx);
    setSelectedQuizAnswer(null);
    setQuizCorrect(null);
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  const handleCheckStationQuiz = (optIdx, correctIdx) => {
    setSelectedQuizAnswer(optIdx);
    const isRight = Number(optIdx) === Number(correctIdx);
    setQuizCorrect(isRight);
    if (isRight && !completedStations.includes(activeLessonIdx)) {
      setCompletedStations(prev => [...prev, activeLessonIdx]);
      setVisitorExp(prev => prev + 150);
    }
  };

  const handleCopySnippet = (text) => {
    navigator.clipboard.writeText(text || "");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-black">لم يتم العثور على هذه الكبسولة التفاعلية</h2>
        <Link to="/academy" className="bg-emerald-500 text-slate-950 font-black px-6 py-3 rounded-xl">
          استكشف أكاديمية Cherif.Dev
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617] text-slate-200 pb-24">
      {/* 1. شريط الترحيب العلوي لزوار الكاروسيل ورسائل الـ DM */}
      <div className="bg-gradient-to-b from-emerald-950/40 via-[#070d1b] to-[#020617] border-b border-slate-800/90 py-8 px-6">
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={"px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-l border " + studioBadge.accent}>
                {studioBadge.label}
              </span>
              {capsuleMeta.triggerKeyword && (
                <span className="bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-black px-3 py-1 rounded-full">
                  🔑 هدية تعليقك بكلمة: {capsuleMeta.triggerKeyword}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Zap size={15} className="text-amber-400" />
              <span className="text-xs font-black text-amber-300">رصيدك التشجيعي: +{visitorExp} EXP 🎁</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-snug">
            {capsule.title}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            {capsuleMeta.cleanDesc}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-10">
        {/* 2. لوحة بطاقات الأدوات والمقارنات البصرية المرمزة حسب نوع الاستوديو */}
        {capsuleMeta.structuredSlides.length > 0 && (
          <div className="bg-[#091020] border-2 border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                <Layers className="text-emerald-400" size={22} />
                <span>
                  {capsuleMeta.studioType === "template_binary" && "⚖️ بطاقات المقارنة الثنائية والروابط الرسمية للأدوات البديلة الفائزة"}
                  {capsuleMeta.studioType === "template_triple" && "🏆 منصة المقارنة الثلاثية (سيئ / جيد / احترافي) والروابط المباشرة"}
                  {(capsuleMeta.studioType === "roadmap_steps" || capsuleMeta.studioType === "business_saas") && "🛠️ ترسانة الأدوات والروابط الرسمية المشروحة في الشرائح"}
                  {(capsuleMeta.studioType === "story_lab" || capsuleMeta.studioType === "commercial_lab") && "📌 المحطات الرئيسية المستخلصة من الشرائح"}
                </span>
              </h2>
              <span className="text-xs font-bold text-slate-400">اضغط على أي أداة لفتح موقعها الرسمي مباشرة</span>
            </div>

            {/* عرض بطاقات المقارنة الثنائية */}
            {capsuleMeta.studioType === "template_binary" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capsuleMeta.structuredSlides.map((pair, idx) => {
                  const goodUrl = pair.goodToolUrl || (pair.goodToolDomain ? ("https://" + pair.goodToolDomain) : "#");
                  return (
                    <div key={idx} className="bg-slate-950/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-4 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                          المقارنة {idx + 1}: {pair.category || pair.title}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 items-stretch">
                        <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3.5 flex flex-col items-center text-center justify-between opacity-75">
                          <span className="text-[10px] font-black text-rose-400">❌ الطريقة القديمة</span>
                          <p className="text-sm font-bold text-slate-300 line-through my-2">{pair.badTool}</p>
                          <span className="text-[10px] text-slate-500">تستهلك وقتاً وجهداً</span>
                        </div>
                        <div className="bg-emerald-950/25 border-2 border-emerald-500/50 rounded-xl p-3.5 flex flex-col items-center text-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.12)]">
                          <span className="text-[10px] font-black text-emerald-400">✅ البديل الذكي الفائز</span>
                          <div className="flex items-center gap-2 my-2">
                            <img src={getToolLogoUrl(pair.goodToolDomain, pair.goodTool)} alt="" className="w-6 h-6 rounded" />
                            <p className="text-sm font-black text-white">{pair.goodTool}</p>
                          </div>
                          {goodUrl !== "#" && (
                            <a href={goodUrl} target="_blank" rel="noreferrer" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1">
                              <span>فتح الأداة</span> <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* عرض بطاقات المقارنة الثلاثية */}
            {capsuleMeta.studioType === "template_triple" && (
              <div className="grid grid-cols-1 gap-4">
                {capsuleMeta.structuredSlides.map((tr, idx) => {
                  const goodUrl = tr.goodToolUrl || (tr.goodToolDomain ? ("https://" + tr.goodToolDomain) : "#");
                  const proUrl = tr.proToolUrl || (tr.proToolDomain ? ("https://" + tr.proToolDomain) : "#");
                  return (
                    <div key={idx} className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="text-sm font-black text-amber-400">المحور {idx + 1}: {tr.category || tr.title}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-rose-950/15 border border-rose-500/30 rounded-xl p-3 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black text-rose-400 block">🔴 سيئ / محدود</span>
                            <span className="text-xs font-bold text-slate-300 line-through">{tr.badTool}</span>
                          </div>
                        </div>
                        <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={getToolLogoUrl(tr.goodToolDomain, tr.goodTool)} alt="" className="w-6 h-6 rounded" />
                            <div>
                              <span className="text-[10px] font-black text-amber-300 block">🟡 جيد وعملي</span>
                              <span className="text-xs font-black text-white">{tr.goodTool}</span>
                            </div>
                          </div>
                          {goodUrl !== "#" && (
                            <a href={goodUrl} target="_blank" rel="noreferrer" className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
                              <span>فتح</span> <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        <div className="bg-emerald-950/25 border-2 border-emerald-500/50 rounded-xl p-3 flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                          <div className="flex items-center gap-2">
                            <img src={getToolLogoUrl(tr.proToolDomain, tr.proTool)} alt="" className="w-6 h-6 rounded" />
                            <div>
                              <span className="text-[10px] font-black text-emerald-400 block">🟢 احترافي 🏆</span>
                              <span className="text-xs font-black text-white">{tr.proTool}</span>
                            </div>
                          </div>
                          {proUrl !== "#" && (
                            <a href={proUrl} target="_blank" rel="noreferrer" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                              <span>فتح الأداة</span> <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* عرض بطاقات الخطوات أو الأرباح أو القصص */}
            {capsuleMeta.studioType !== "template_binary" && capsuleMeta.studioType !== "template_triple" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {capsuleMeta.structuredSlides.map((st, idx) => {
                  const tUrl = st.toolUrl || (st.toolDomain ? ("https://" + st.toolDomain) : "#");
                  return (
                    <div key={idx} className="bg-slate-950/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-300 px-2.5 py-0.5 rounded-full">
                          المحطة {idx + 1}
                        </span>
                        <h4 className="text-sm font-black text-white">{st.title}</h4>
                        {st.toolName && (
                          <div className="flex items-center gap-2 pt-1">
                            <img src={getToolLogoUrl(st.toolDomain, st.toolName)} alt="" className="w-5 h-5 rounded" />
                            <span className="text-xs font-bold text-amber-300">{st.toolName}</span>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 leading-relaxed">{st.explanation || st.text || st.narration}</p>
                      </div>
                      {tUrl !== "#" && (
                        <a href={tUrl} target="_blank" rel="noreferrer" className="bg-slate-900 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 text-[11px] font-black py-1.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-all">
                          <span>فتح {st.toolName}</span> <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. قارئ محطات الكبسولة التطبيقية + بوابة التمهيد للمنصة */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* العمود الأيمن (8 أعمدة): الدروس التطبيقية السريعة */}
          <div className="lg:col-span-8 space-y-6">
            {/* أزرار التنقل بين محطات الكبسولة */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
              {lessons.map((les, idx) => {
                const isDone = completedStations.includes(idx);
                const isActive = activeLessonIdx === idx;
                return (
                  <button
                    key={les._id || idx}
                    type="button"
                    onClick={() => handleSelectStation(idx)}
                    className={"px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all " + (
                      isActive
                        ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                        : isDone
                          ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    )}
                  >
                    <span>{isDone ? "✓" : (idx + 1)}</span>
                    <span className="truncate max-w-[180px]">{les.title}</span>
                  </button>
                );
              })}
            </div>

            {/* محتوى المحطة النشطة */}
            {activeLesson && (
              <div className="bg-[#091020] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-black text-emerald-400 block mb-1">
                    المحطة التطبيقية {activeLessonIdx + 1} من {lessons.length}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white">{activeLesson.title}</h3>
                </div>

                <div className="text-slate-200 text-sm sm:text-base leading-[2.0] whitespace-pre-wrap">
                  {activeLesson.content}
                </div>

                {activeLesson.codeSnippet && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                        <Code size={14} /> الكود / خطوات التشغيل الجاهزة للنسخ:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopySnippet(activeLesson.codeSnippet)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1"
                      >
                        {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedCode ? "تم النسخ!" : "نسخ الأمر"}</span>
                      </button>
                    </div>
                    <pre dir="ltr" className="p-4 text-xs sm:text-sm text-emerald-400 font-mono overflow-x-auto leading-relaxed">
                      <code>{activeLesson.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* سؤال التثبيت السريع لشحن نقاط الـ EXP */}
                {activeLesson.dailyQuest && activeLesson.dailyQuest.question && (
                  <div className="bg-indigo-950/25 border-2 border-indigo-500/35 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                        <HelpCircle size={15} /> تحدي الفهم السريع (+150 EXP):
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-black text-white">{activeLesson.dailyQuest.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(activeLesson.dailyQuest.options || []).map((opt, oIdx) => {
                        const isPicked = selectedQuizAnswer === oIdx;
                        const isRight = Number(oIdx) === Number(activeLesson.dailyQuest.correctAnswerIndex || 0);
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleCheckStationQuiz(oIdx, activeLesson.dailyQuest.correctAnswerIndex || 0)}
                            className={"p-3 rounded-xl border text-right text-xs sm:text-sm font-bold transition-all " + (
                              isPicked
                                ? isRight
                                  ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black"
                                  : "bg-rose-600 text-white border-rose-400"
                                : "bg-slate-950 hover:bg-slate-900 text-slate-200 border-slate-800"
                            )}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizCorrect !== null && (
                      <div className={"text-xs font-black pt-1 " + (quizCorrect ? "text-emerald-400" : "text-rose-400")}>
                        {quizCorrect ? "🎉 إجابة صحيحة! ربحت +150 EXP إضافية!" : "💡 جرب الخيار الصحيح لتثبيت المعلومة!"}
                      </div>
                    )}
                  </div>
                )}

                {/* أزرار الانتقال بين المحطات */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    disabled={activeLessonIdx === 0}
                    onClick={() => handleSelectStation(Math.max(0, activeLessonIdx - 1))}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold px-5 py-3 rounded-xl disabled:opacity-30"
                  >
                    → المحطة السابقة
                  </button>
                  {activeLessonIdx < lessons.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => handleSelectStation(activeLessonIdx + 1)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      المحطة التالية ←
                    </button>
                  ) : (
                    <Link
                      to="/academy"
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2"
                    >
                      <Trophy size={16} /> انتقل إلى الشهادات المهنية الكاملة في الأكاديمية ←
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* العمود الأيسر (4 أعمدة): بوابة التعريف بمنصة Cherif.Dev وجسر التحويل للأكاديمية */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-gradient-to-b from-amber-950/35 via-[#091020] to-[#091020] border-2 border-amber-500/45 rounded-3xl p-6 space-y-5 shadow-[0_0_40px_rgba(245,158,11,0.12)]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black">
                <Trophy size={14} /> مرحباً بك في منظومة Cherif.Dev
              </div>
              <h3 className="text-lg font-black text-white leading-snug">
                هل أعجبتك هذه الكبسولة السريعة؟ اكتشف الآن عالمنا الأكاديمي الكامل!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                هذه الكبسولة هي مجرد مدخل تمهيدي سريع للمنشور الذي شاهدته. داخل منصتنا ستجد مساراتنا العملاقة:
              </p>

              <div className="space-y-3 text-xs">
                <Link to="/academy" className="block bg-slate-950 hover:bg-slate-900 border border-emerald-500/35 rounded-2xl p-3.5 transition-all group">
                  <div className="font-black text-emerald-400 flex items-center justify-between mb-1">
                    <span>👑 1. الشهادات المهنية وبناء المشاريع</span>
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  </div>
                  <p className="text-slate-400 text-[11px]">سلاسل متكاملة (9 إلى 20+ كراش كورس) لبناء مشاريع حقيقية مع الـ AI Agent ورفعها على GitHub.</p>
                </Link>

                <Link to="/academy" className="block bg-slate-950 hover:bg-slate-900 border border-purple-500/35 rounded-2xl p-3.5 transition-all group">
                  <div className="font-black text-purple-300 flex items-center justify-between mb-1">
                    <span>🌍 2. أكاديمية اللغات السبع (A0-C2)</span>
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  </div>
                  <p className="text-slate-400 text-[11px]">تعلم الإنجليزية، الألمانية، الفرنسية، اليابانية وغيرها بالصوتيات الفيزيائية (IPA) ومحاكي المحادثة.</p>
                </Link>

                <Link to="/b2b" className="block bg-slate-950 hover:bg-slate-900 border border-sky-500/35 rounded-2xl p-3.5 transition-all group">
                  <div className="font-black text-sky-400 flex items-center justify-between mb-1">
                    <span>💼 3. حلول الشركات وبناء الأنظمة (B2B)</span>
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  </div>
                  <p className="text-slate-400 text-[11px]">هل أنت صاحب شركة وتريد بناء نظام ERP أو SaaS أو أتمتة بالذكاء الاصطناعي؟ اطلب استشارتك هنا.</p>
                </Link>
              </div>

              {platformTracks.length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-black text-amber-300 block">🔥 أبرز المسارات المتاحة الآن في الأكاديمية:</span>
                  {platformTracks.map((tr) => (
                    <Link
                      key={tr._id}
                      to={"/course/" + tr._id}
                      className="block bg-slate-950/90 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-2.5 text-xs font-bold text-white truncate transition-all"
                    >
                      🎓 {tr.title}
                    </Link>
                  ))}
                </div>
              )}

              <Link
                to="/academy"
                className="w-full bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm py-3.5 px-5 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all"
              >
                <Rocket size={17} /> دخول أكاديمية الشهادات المهنية الكاملة
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapsuleClassroom;
