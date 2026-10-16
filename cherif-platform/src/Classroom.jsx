import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { 
  BookOpen, CheckCircle, Menu, X, ArrowRight, Terminal, Code, 
  Swords, Zap, Skull, Flame, ShieldAlert, RefreshCw, BrainCircuit, 
  Lightbulb, ChevronDown, Microscope, Trophy, Award, Sparkles, Eye, Bot
} from 'lucide-react';

const Classroom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openSections, setOpenSections] = useState({});

  // =========================================
  // 🎮 نظام الحالات الموحد (Quest & Boss States)
  // =========================================
  const [selectedQuestAnswer, setSelectedQuestAnswer] = useState(null); 
  const [selectedBossAnswers, setSelectedBossAnswers] = useState({});   
  const [questStatus, setQuestStatus] = useState('idle'); 
  const [scoreInfo, setScoreInfo] = useState({ score: 0, percentage: 0 }); 
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // =========================================
  // 💻 نظام خانة كتابة الكود التفاعلية والتلميحات (Coding Sandbox States)
  // =========================================
  const [studentCode, setStudentCode] = useState('');
  const [revealedHintsCount, setRevealedHintsCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeFeedback, setCodeFeedback] = useState(null); // { isCorrect, feedback, correctedSnippet }

  // حالة التقدم والشهادات
  const [completedLessons, setCompletedLessons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [claimingCert, setClaimingCert] = useState(false);

  const shuffleBossQuestions = (quizArray) => {
    return [...quizArray].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('cherif_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [courseRes, lessonsRes, progressRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5001/api/courses/public/${id}`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/lessons`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/progress`, { headers }).catch(() => ({ data: { completedLessons: [] } }))
        ]);
        
        if (courseRes.data.success) setCourse(courseRes.data.course);
        if (progressRes.data) setCompletedLessons(progressRes.data.completedLessons || []);
        
        if (lessonsRes.data.success) {
          setLessons(lessonsRes.data.lessons);
          if (lessonsRes.data.lessons.length > 0) {
            setActiveLesson(lessonsRes.data.lessons[0]);
          }
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (activeLesson) {
      if (activeLesson.section) {
        setOpenSections(prev => ({ ...prev, [activeLesson.section]: true }));
      }
      // تهيئة الكود الابتدائي في الخانة عند فتح درس جديد
      setStudentCode(activeLesson.codingPractice?.starterCode || '');
      setRevealedHintsCount(0);
      setShowSolution(false);
      setCodeFeedback(null);
    }
  }, [activeLesson]);

  const handleCompleteLesson = async () => {
    const token = localStorage.getItem('cherif_token');
    if (!token) return alert("يجب تسجيل الدخول لحفظ تقدمك!");

    try {
      const res = await axios.post(`http://127.0.0.1:5001/api/courses/${id}/complete-lesson`, 
        { lessonId: activeLesson._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setCompletedLessons(res.data.completedLessons);
        
        const currentIndex = lessons.findIndex(l => l._id === activeLesson._id);
        if (currentIndex < lessons.length - 1) {
          setActiveLesson(lessons[currentIndex + 1]);
          resetQuestState(); 
        }
      }
    } catch (error) {
      alert("حدث خطأ أثناء حفظ تقدمك.");
    }
  };

  // 🏆 إصدار الشهادة الخاصة بالكراش كورس أو الشهادة المهنية
  const handleClaimCertificate = async () => {
    const token = localStorage.getItem('cherif_token');
    if (!token) return alert("يرجى تسجيل الدخول لاستلام شهادتك!");

    setClaimingCert(true);
    try {
      const res = await axios.post(
        `http://127.0.0.1:5001/api/certificates/issue/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.certificateId) {
        navigate(`/certificate/${res.data.certificateId}`);
      }
    } catch (err) {
      alert("تأكد من إتمام جميع دروس الكورس أولاً لاستخراج الشهادة الموثقة.");
    } finally {
      setClaimingCert(false);
    }
  };

  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0;
  const isCurrentLessonCompleted = completedLessons.includes(activeLesson?._id);

  // ==========================================
  // 🧠 محرك التقييم وفحص الكود (Validation & AI Code Review Engine)
  // ==========================================
  const resetQuestState = () => {
    setSelectedQuestAnswer(null);
    setSelectedBossAnswers({});
    setIsQuizSubmitted(false);
    setQuestStatus('idle');
    setScoreInfo({ score: 0, percentage: 0 });
    setRevealedHintsCount(0);
    setShowSolution(false);
    setCodeFeedback(null);
  };

  const handleSelectAnswer = (questionIndex, optionIndex) => {
    if (isQuizSubmitted) return; 
    setSelectedBossAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleCheckDailyQuest = () => {
    if (selectedQuestAnswer === null) {
      alert("اختر إجابة أولاً لتجربة السؤال الإضافي!");
      return;
    }
    setIsQuizSubmitted(true);
    if (selectedQuestAnswer == activeLesson.dailyQuest.correctAnswerIndex) {
      setQuestStatus('success');
    } else {
      setQuestStatus('error');
    }
  };

  const handleCheckBossQuiz = () => {
    const totalQuestions = activeLesson.bossQuiz.length;
    if (Object.keys(selectedBossAnswers).length < totalQuestions) {
      alert("يجب الإجابة على جميع الأسئلة قبل الهجوم!");
      return;
    }

    let correctCount = 0;
    activeLesson.bossQuiz.forEach((q, idx) => {
      if (selectedBossAnswers[idx] == q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    setScoreInfo({ score: correctCount, percentage });
    setIsQuizSubmitted(true);

    if (percentage >= 70) {
      setQuestStatus('success');
    } else {
      setQuestStatus('error');
    }
  };

  const handleRetryDailyQuest = () => {
    setQuestStatus('idle');
    setIsQuizSubmitted(false);
    setSelectedQuestAnswer(null);
  };

  const handleReviveFromBoss = () => {
    resetQuestState();
    setActiveLesson(prev => ({
      ...prev,
      bossQuiz: shuffleBossQuestions(prev.bossQuiz)
    }));
  };

  // 🤖 فحص كود الطالب عبر الذكاء الاصطناعي (أو المطابقة الذكية)
  const handleVerifyStudentCode = async () => {
    if (!studentCode || studentCode.trim() === '') {
      return alert('اكتب الكود في الخانة أولاً قبل الضغط على زر التحقق!');
    }

    setVerifyingCode(true);
    setCodeFeedback(null);

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/verify-student-code', {
        taskQuestion: activeLesson.codingPractice.taskQuestion,
        studentCode: studentCode,
        solutionCode: activeLesson.codingPractice.solutionCode
      });

      if (res.data.success) {
        setCodeFeedback(res.data.data);
      }
    } catch (err) {
      // بديل محلي ذكي في حال كان سيرفر الأتمتة 5000 مغلقاً
      const cleanStudent = studentCode.replace(/\s+/g, '').toLowerCase();
      const cleanSolution = (activeLesson.codingPractice?.solutionCode || '').replace(/\s+/g, '').toLowerCase();
      const isMatch = cleanStudent.length > 8 && (cleanSolution.includes(cleanStudent.slice(0, 12)) || cleanStudent === cleanSolution);

      setCodeFeedback({
        isCorrect: isMatch,
        feedback: isMatch 
          ? '🎉 أحسنت أيها المبرمج البطل! الكود الذي كتبته سليم ويحقق المطلوب ببراعة.' 
          : '💡 محاولة رائعة! راجع التلميحات بالأسفل أو قارن كودك بالحل النموذجي لتكتشف الجزء الناقص.',
        correctedSnippet: isMatch ? '' : activeLesson.codingPractice?.solutionCode
      });
    } finally {
      setVerifyingCode(false);
    }
  };

  // 💡 إظهار التلميح التالي عند الضغط على زر التلميح
  const handleRevealNextHint = () => {
    const maxHints = activeLesson?.codingPractice?.hints?.length || 0;
    if (revealedHintsCount < maxHints) {
      setRevealedHintsCount(prev => prev + 1);
    }
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const section = lesson.section || 'دروس عامة';
    if (!acc[section]) acc[section] = [];
    acc[section].push(lesson);
    return acc;
  }, {});

  const toggleSection = (sectionName) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // 🔒 قفل زر إنهاء الدرس فقط في معارك الزعماء، البوابة الحمراء، واختبار نهاية الوحدة!
  // أما سؤال نهاية الدرس العادي (dailyQuest) فهو غير إجباري أبداً كما طلبت.
  const isGateOrExam = activeLesson?.type === 'boss_quiz' || activeLesson?.type === 'red_gate' || activeLesson?.type === 'unit_exam';
  let isLocked = false;
  if (!isCurrentLessonCompleted && isGateOrExam) {
    isLocked = questStatus !== 'success';
  }

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#020617]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div></div>;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row text-slate-200 classroom-typography">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        .classroom-typography {
          font-family: 'IBM Plex Sans Arabic', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        
        .heading-font {
          font-family: 'Cairo', 'IBM Plex Sans Arabic', sans-serif;
        }

        .code-font {
          font-family: 'JetBrains Mono', monospace;
        }
      `}} />

      {/* ======================================================= */}
      {/* 🗂️ القائمة الجانبية (Sidebar) */}
      {/* ======================================================= */}
      <div className={`fixed md:static inset-y-0 right-0 z-40 w-80 bg-[#0b1120] border-l border-slate-800/70 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} transition-transform duration-300 flex flex-col shadow-2xl`}>
        
        <div className="p-5 border-b border-slate-800/60 flex justify-between items-center bg-[#0b1120] sticky top-0 z-10">
          <Link to={`/course/${id}`} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 font-semibold text-sm transition-colors">
            <ArrowRight size={16} /> العودة للكورس
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-5 border-b border-slate-800/60 bg-gradient-to-b from-[#0f172a]/50 to-transparent">
          <h2 className="heading-font font-bold text-white text-[16px] leading-[1.6]">{course?.title}</h2>
          <div className="w-full bg-slate-800/90 rounded-full h-2 mt-4 overflow-hidden relative">
            <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-slate-400 font-medium">{progressPercentage}% مكتمل</p>
            {progressPercentage === 100 && (
              <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                <Award size={13}/> مؤهل للشهادة
              </span>
            )}
          </div>

          {/* 🎓 زر استلام الشهادة عند إتمام الكورس */}
          {progressPercentage === 100 && (
            <button
              onClick={handleClaimCertificate}
              disabled={claimingCert}
              className="w-full mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 transition-all"
            >
              <Award size={16} /> {claimingCert ? 'جاري التوثيق...' : 'استلام شهادة الكورس المعتمدة 🎓'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
          {Object.entries(groupedLessons).map(([sectionName, sectionLessons], sIndex) => {
            const completedInSection = sectionLessons.filter(l => completedLessons.includes(l._id)).length;
            const isSectionOpen = openSections[sectionName] || false;
            const isProjectSection = sectionName.includes('مشروع') || sectionName.includes('GitHub');

            return (
              <div key={sIndex} className={`border rounded-xl overflow-hidden transition-all duration-300 ${isProjectSection ? 'bg-emerald-950/15 border-emerald-500/30' : 'bg-[#060b16] border-slate-800/70'}`}>
                
                <button 
                  onClick={() => toggleSection(sectionName)}
                  className={`w-full flex items-center justify-between p-3.5 transition-all duration-200 ${isSectionOpen ? 'bg-slate-800/60 border-b border-slate-800' : 'hover:bg-slate-900/80'}`}
                >
                  <div className="text-right flex-1 pl-2">
                    <h3 className={`heading-font font-bold text-[13.5px] mb-1 leading-[1.5] ${isSectionOpen ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {sectionName}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">{completedInSection} / {sectionLessons.length} دروس مكتملة</p>
                  </div>
                  <div className={`shrink-0 transition-transform duration-300 ${isSectionOpen ? 'text-emerald-400 rotate-180' : 'text-slate-500'}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isSectionOpen && (
                  <div className="p-2 space-y-1 bg-[#040811]">
                    {sectionLessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson._id);
                      const isActive = activeLesson?._id === lesson._id;
                      const isBoss = lesson.type === 'boss_quiz';
                      const isRedGate = lesson.type === 'red_gate';
                      const isUnitExam = lesson.type === 'unit_exam';
                      
                      return (
                        <button 
                          key={lesson._id}
                          onClick={() => { 
                            setActiveLesson(lesson); 
                            if (window.innerWidth < 768) setSidebarOpen(false); 
                            resetQuestState(); 
                          }}
                          className={`w-full text-right p-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 group ${
                            isActive 
                              ? (isRedGate ? 'bg-red-950/40 border border-red-500/40 text-red-300' 
                                  : isBoss ? 'bg-purple-950/40 border border-purple-500/40 text-purple-300'
                                  : isUnitExam ? 'bg-amber-950/40 border border-amber-500/40 text-amber-300'
                                  : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300') 
                              : 'hover:bg-slate-800/50 text-slate-400 border border-transparent'
                          }`}
                        >
                          <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                            isCompleted 
                              ? 'bg-emerald-500 text-slate-950' 
                              : (isActive 
                                  ? (isRedGate ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                                      : isBoss ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                                      : isUnitExam ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                                      : 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]') 
                                  : 'bg-slate-800/90 text-slate-400 border border-slate-700/70 group-hover:border-slate-600')
                          }`}>
                            {isCompleted ? <CheckCircle size={13} strokeWidth={3} /> : (isRedGate ? <Flame size={13}/> : isBoss ? <Skull size={13}/> : isUnitExam ? <Trophy size={13}/> : lesson.order)}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className={`text-[13px] leading-[1.4] truncate transition-colors ${
                              isCompleted && !isActive ? 'text-slate-500 line-through' : (isActive ? 'font-semibold text-white' : 'font-normal group-hover:text-slate-200')
                            }`}>
                              {lesson.title}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ======================================================= */}
      {/* 📖 مساحة القراءة التفاعلية (Main Reading Area) */}
      {/* ======================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#020617] scroll-smooth">
        <div className="md:hidden bg-[#0b1120] border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-300 hover:text-white flex items-center gap-2"><Menu size={20} /> <span className="font-bold text-sm">المنهج</span></button>
          <span className="font-semibold text-white text-sm truncate max-w-[200px]">{activeLesson?.title}</span>
        </div>

        <div className="max-w-[820px] mx-auto w-full px-6 py-10 md:px-12 md:py-14">
          {activeLesson ? (
            <div className="animate-fade-in-up">
              
              {/* ======================================================= */}
              {/* 🐉 بوابة الزعيم + البوابة الحمراء + الاختبار النهائي للوحدة */}
              {/* ======================================================= */}
              {isGateOrExam ? (
                <div className="relative mt-4">
                  <div className={`absolute top-[-40px] left-1/2 -translate-x-1/2 w-64 h-64 blur-[110px] rounded-full pointer-events-none ${activeLesson.type === 'red_gate' ? 'bg-red-600/15' : activeLesson.type === 'unit_exam' ? 'bg-amber-500/15' : 'bg-purple-600/15'}`}></div>
                  
                  {isCurrentLessonCompleted ? (
                    <div className="text-center py-20 bg-emerald-950/20 border border-emerald-500/30 rounded-3xl shadow-2xl">
                      <ShieldAlert size={72} className="mx-auto text-emerald-400 mb-5 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
                      <h1 className="heading-font text-2xl md:text-3xl font-extrabold text-white mb-3">
                        {activeLesson.type === 'unit_exam' ? 'تم اجتياز الاختبار النهائي للوحدة!' : 'البوابة مكسورة بالفعل!'}
                      </h1>
                      <p className="text-slate-400 text-base md:text-lg">لقد أثبت جدارتك الكاملة للعبور إلى المرحلة التالية.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-center mb-12 relative z-10">
                        {activeLesson.type === 'red_gate' ? (
                           <Flame size={56} className="mx-auto text-red-500 mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                        ) : activeLesson.type === 'unit_exam' ? (
                           <Trophy size={56} className="mx-auto text-amber-400 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                        ) : (
                           <Skull size={56} className="mx-auto text-purple-500 mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
                        )}
                        
                        <h1 className="heading-font text-2xl md:text-4xl font-extrabold text-white mb-4 leading-[1.4]">{activeLesson.title}</h1>
                        
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold border mb-5 ${
                          activeLesson.type === 'red_gate' ? 'bg-red-950/60 text-red-400 border-red-500/30' 
                          : activeLesson.type === 'unit_exam' ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                          : 'bg-purple-950/60 text-purple-400 border-purple-500/30'
                        }`}>
                          {activeLesson.type === 'red_gate' ? <><Flame size={16} /> مستوى الخطورة: S-Rank (Red Gate)</> 
                           : activeLesson.type === 'unit_exam' ? <><Trophy size={16} /> الاختبار النهائي الشامل للوحدة (نظري + كودي)</>
                           : <><Skull size={16} /> مستوى الخطورة: A-Rank (Boss)</>}
                        </div>
                        <p className="text-slate-400 text-base md:text-[17px] max-w-xl mx-auto leading-[1.8]">
                          {activeLesson.description} أنت بحاجة إلى <strong className="text-white bg-slate-800 px-2 py-0.5 rounded">70%</strong> على الأقل للنجاح.
                        </p>
                      </div>

                      {isQuizSubmitted && (
                        <div className={`mb-10 p-8 rounded-2xl text-center border shadow-xl animate-fade-in-up ${questStatus === 'success' ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-red-950/30 border-red-500/40'}`}>
                           {questStatus === 'success' ? (
                             <>
                               <ShieldAlert size={56} className="mx-auto text-emerald-400 mb-4" />
                               <h3 className="heading-font text-2xl md:text-3xl font-bold text-emerald-400 mb-2">تم الاجتياز بنجاح ساحق! 🐉✨</h3>
                               <p className="text-slate-300 text-base">نسبة نجاحك: {scoreInfo.percentage}% ({scoreInfo.score}/{activeLesson.bossQuiz.length})</p>
                             </>
                           ) : (
                             <>
                               <Skull size={56} className="mx-auto text-red-500 mb-4" />
                               <h3 className="heading-font text-2xl md:text-3xl font-bold text-red-400 mb-2">لم تصل لنسبة النجاح المطلوبة! 💀</h3>
                               <p className="text-slate-300 text-base mb-6">نسبة نجاحك: <span className="font-bold text-red-400">{scoreInfo.percentage}%</span>. تحتاج إلى 70% للعبور.</p>
                               <button onClick={handleReviveFromBoss} className="bg-red-600 hover:bg-red-500 text-white font-bold text-base py-3 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto transition-all">
                                 <RefreshCw size={18} /> إعادة المحاولة بترتيب جديد
                               </button>
                             </>
                           )}
                        </div>
                      )}

                      <div className="space-y-6 relative z-10">
                        {activeLesson.bossQuiz?.map((q, qIndex) => (
                          <div key={qIndex} className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 md:p-8 relative shadow-lg">
                            <span className="absolute -top-3.5 -right-3.5 bg-slate-800 border border-slate-700 text-slate-300 w-9 h-9 flex items-center justify-center rounded-full font-bold text-sm">
                              {qIndex + 1}
                            </span>

                            {q.questionType && (
                              <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded mb-3 ${q.questionType === 'code' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                                {q.questionType === 'code' ? '💻 سؤال كودي تطبيقي' : '🧠 سؤال مفاهيمي نظري'}
                              </span>
                            )}
                            
                            <div className="text-slate-100 font-semibold text-[17px] md:text-[18px] mb-6 leading-[1.8]">
                               <ReactMarkdown
                                 remarkPlugins={[remarkGfm]}
                                 components={{
                                   p({children}) { return <p className="mb-3 leading-[1.8]">{children}</p> },
                                   code({node, inline, className, children, ...props}) {
                                     const match = /language-(\w+)/.exec(className || '')
                                     return !inline && match ? (
                                       <div className="my-4 rounded-xl overflow-hidden border border-slate-800" dir="ltr">
                                         <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.9rem', background: '#050811' }}>
                                           {String(children).replace(/\n$/, '')}
                                         </SyntaxHighlighter>
                                       </div>
                                     ) : (<code className="code-font bg-slate-800/90 text-amber-300 px-1.5 py-0.5 rounded text-[0.88em] mx-1" dir="ltr" {...props}>{children}</code>)
                                   }
                                 }}
                               >
                                 {q.question}
                               </ReactMarkdown>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = selectedBossAnswers[qIndex] === oIdx;
                                const isCorrect = q.correctAnswerIndex == oIdx;
                                
                                let boxStyle = "border-slate-800 bg-[#060b16] text-slate-300 hover:border-slate-700 hover:bg-slate-900 cursor-pointer";
                                let circleStyle = "border-slate-600";

                                if (isQuizSubmitted) {
                                  if (isCorrect) {
                                    boxStyle = "border-emerald-500/80 bg-emerald-950/30 text-emerald-300";
                                    circleStyle = "border-emerald-500 bg-emerald-500 text-slate-950";
                                  } else if (isSelected && !isCorrect) {
                                    boxStyle = "border-red-500/80 bg-red-950/30 text-red-300";
                                    circleStyle = "border-red-500 bg-red-500 text-white";
                                  } else {
                                    boxStyle = "border-slate-800/60 bg-[#060b16]/50 text-slate-500 opacity-50 cursor-not-allowed";
                                    circleStyle = "border-slate-700";
                                  }
                                } else if (isSelected) {
                                  boxStyle = "border-amber-500 bg-amber-950/25 text-white shadow-[0_0_15px_rgba(245,158,11,0.12)]";
                                  circleStyle = "border-amber-500 bg-amber-500 text-slate-950";
                                }

                                return (
                                  <div 
                                    key={oIdx} 
                                    onClick={() => !isQuizSubmitted && handleSelectAnswer(qIndex, oIdx)}
                                    className={`p-4 rounded-xl border font-medium text-[15.5px] flex items-center gap-3.5 transition-all ${boxStyle}`}
                                  >
                                    <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${circleStyle}`}>
                                      {isQuizSubmitted && isCorrect && <CheckCircle size={13} strokeWidth={3} />}
                                      {isQuizSubmitted && isSelected && !isCorrect && <X size={13} strokeWidth={3} />}
                                    </div>
                                    <span className="leading-[1.6]">{opt}</span>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {isQuizSubmitted && q.explanation && (
                                <div className="mt-5 p-4 rounded-xl bg-blue-950/25 border border-blue-500/25 text-blue-200 text-[14.5px] flex items-start gap-3">
                                  <Lightbulb size={18} className="shrink-0 mt-1 text-amber-400" />
                                  <p className="leading-[1.7]">{q.explanation}</p>
                                </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 💻 القسم الكودي التطبيقي داخل اختبار الوحدة النهائي إن وجد */}
                      {activeLesson.codingPractice && activeLesson.codingPractice.taskQuestion && (
                        <div className="mt-10 bg-[#081021] border-2 border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl">
                          <h3 className="heading-font text-xl font-bold text-indigo-400 mb-2 flex items-center gap-2.5">
                            <Terminal size={22} /> التحدي البرمجي العملي للوحدة
                          </h3>
                          <p className="text-slate-200 text-base mb-4 leading-relaxed">{activeLesson.codingPractice.taskQuestion}</p>

                          <div className="rounded-xl overflow-hidden border border-slate-700 mb-4" dir="ltr">
                            <div className="bg-slate-900 px-4 py-2 text-xs code-font text-slate-400 border-b border-slate-800 flex justify-between items-center">
                              <span>Interactive Code Editor</span>
                              <span className="text-emerald-400">JavaScript / Python</span>
                            </div>
                            <textarea
                              value={studentCode}
                              onChange={(e) => setStudentCode(e.target.value)}
                              rows={6}
                              dir="ltr"
                              placeholder="// اكتب الكود المطلوب هنا..."
                              className="w-full bg-[#04070e] text-emerald-300 code-font text-sm p-4 outline-none resize-y leading-relaxed"
                            />
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={handleVerifyStudentCode}
                              disabled={verifyingCode}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all"
                            >
                              <Bot size={17} /> {verifyingCode ? 'جاري فحص الكود...' : 'فحص الكود مع المعلم الذكي'}
                            </button>

                            {activeLesson.codingPractice.hints?.length > 0 && (
                              <button
                                type="button"
                                onClick={handleRevealNextHint}
                                disabled={revealedHintsCount >= activeLesson.codingPractice.hints.length}
                                className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-sm py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all disabled:opacity-40"
                              >
                                <Lightbulb size={16} /> طلب تلميح ({revealedHintsCount} / {activeLesson.codingPractice.hints.length})
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setShowSolution(!showSolution)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all mr-auto"
                            >
                              <Eye size={16} /> {showSolution ? 'إخفاء الحل' : 'إظهار الحل النموذجي'}
                            </button>
                          </div>

                          {revealedHintsCount > 0 && (
                            <div className="mt-4 space-y-2">
                              {activeLesson.codingPractice.hints.slice(0, revealedHintsCount).map((hint, hIdx) => (
                                <div key={hIdx} className="bg-amber-950/30 border border-amber-500/30 text-amber-200 text-sm p-3.5 rounded-xl flex items-start gap-2.5 animate-fade-in-up">
                                  <Lightbulb size={16} className="text-amber-400 shrink-0 mt-1" />
                                  <span>{hint}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {codeFeedback && (
                            <div className={`mt-4 p-4 rounded-xl border text-sm font-medium ${codeFeedback.isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-amber-950/30 border-amber-500/40 text-amber-200'}`}>
                              <p className="leading-relaxed">{codeFeedback.feedback}</p>
                            </div>
                          )}

                          {showSolution && activeLesson.codingPractice.solutionCode && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-emerald-500/30" dir="ltr">
                              <div className="bg-emerald-950/40 px-4 py-2 text-xs text-emerald-300 font-bold">Solution Code</div>
                              <SyntaxHighlighter style={vscDarkPlus} language="javascript" PreTag="div" customStyle={{ margin: 0, padding: '1rem', fontSize: '0.88rem', background: '#050811' }}>
                                {activeLesson.codingPractice.solutionCode}
                              </SyntaxHighlighter>
                            </div>
                          )}
                        </div>
                      )}

                      {!isQuizSubmitted && (
                        <button 
                          onClick={handleCheckBossQuiz}
                          className="heading-font w-full mt-10 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-[0_8px_30px_rgba(225,29,72,0.3)] flex justify-center items-center gap-2.5"
                        >
                          <Swords size={22} /> {activeLesson.type === 'unit_exam' ? 'تسليم الاختبار النهائي للوحدة 🏆' : 'هاجم الزعيم (تأكيد الإجابات)'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (

                /* ======================================================= */
                /* 📘 الدرس العادي: الشرح + تشريح الكود + تمرين كتابة الكود + السؤال غير الإجباري */
                /* ======================================================= */
                <div>
                  {activeLesson.section && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
                      <BookOpen size={13} />
                      <span>{activeLesson.section}</span>
                    </div>
                  )}

                  <h1 className="heading-font text-2xl sm:text-3xl md:text-[34px] font-extrabold text-white mb-4 leading-[1.45] tracking-normal">
                    {activeLesson.title}
                  </h1>
                  
                  {activeLesson.description && (
                    <p className="text-[16px] md:text-[18px] text-slate-400 mb-10 pb-8 border-b border-slate-800/80 leading-[1.8] font-normal">
                      {activeLesson.description}
                    </p>
                  )}

                  <div className="lesson-content">
                    {activeLesson.content ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1({children}) {
                            return <h2 className="heading-font text-xl md:text-[26px] font-bold text-white mt-12 mb-5 leading-[1.4]">{children}</h2>
                          },
                          h2({children}) {
                            return <h2 className="heading-font text-xl md:text-[25px] font-bold text-white mt-12 mb-5 leading-[1.4]">{children}</h2>
                          },
                          h3({children}) {
                            return (
                              <h3 className="heading-font text-[20px] md:text-[23px] font-bold text-emerald-400 mt-12 mb-5 py-2.5 pr-4 pl-3 bg-gradient-to-l from-emerald-950/30 to-transparent border-r-4 border-emerald-500 rounded-l-lg flex items-center gap-2.5 leading-[1.4]">
                                {children}
                              </h3>
                            )
                          },
                          h4({children}) {
                            return (
                              <h4 className="heading-font text-[17.5px] md:text-[19.5px] font-bold text-sky-400 mt-8 mb-3 flex items-center gap-2 leading-[1.5]">
                                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shrink-0"></span>
                                {children}
                              </h4>
                            )
                          },
                          p({children}) {
                            return (
                              <p className="text-[#cbd5e1] text-[16px] md:text-[17px] leading-[2.0] mb-6 font-normal">
                                {children}
                              </p>
                            )
                          },
                          strong({children}) {
                            return (
                              <strong className="font-semibold text-white bg-slate-800/70 px-1.5 py-0.5 rounded text-[0.96em]">
                                {children}
                              </strong>
                            )
                          },
                          ul({children}) {
                            return <ul className="space-y-3 mb-7 pr-2">{children}</ul>
                          },
                          ol({children}) {
                            return <ol className="list-decimal list-inside space-y-3 mb-7 pr-2 text-[#cbd5e1] text-[16px] md:text-[17px] leading-[1.9]">{children}</ol>
                          },
                          li({children}) {
                            return (
                              <li className="text-[#cbd5e1] text-[16px] md:text-[17px] leading-[1.9] flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-3 shrink-0"></span>
                                <div className="flex-1">{children}</div>
                              </li>
                            )
                          },
                          blockquote({children}) {
                            return (
                              <blockquote className="border-r-4 border-amber-500 bg-amber-950/15 py-3.5 px-5 rounded-l-xl my-6 text-slate-300 text-[15.5px] leading-[1.8]">
                                {children}
                              </blockquote>
                            )
                          },
                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                              <div className="relative group rounded-xl overflow-hidden my-7 border border-slate-800 shadow-xl" dir="ltr">
                                <div className="bg-[#0b1120] text-slate-400 text-xs px-4 py-2.5 code-font flex items-center justify-between border-b border-slate-800">
                                  <span className="flex items-center gap-2"><Terminal size={14} className="text-emerald-400"/> {match[1].toUpperCase()}</span>
                                </div>
                                <SyntaxHighlighter 
                                  style={vscDarkPlus} 
                                  language={match[1]} 
                                  PreTag="div" 
                                  customStyle={{ margin: 0, padding: '1.25rem 1.5rem', background: '#050811', fontSize: '0.92rem', lineHeight: '1.65' }} 
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className="code-font bg-slate-800/90 text-emerald-300 px-1.5 py-0.5 rounded text-[0.88em] border border-slate-700/60 mx-0.5" dir="ltr" {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {activeLesson.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="text-center py-24">
                        <BookOpen size={48} className="mx-auto text-slate-700 mb-4 animate-pulse" />
                        <p className="text-slate-500 text-lg font-medium">محتوى هذا الدرس قيد التجهيز...</p>
                      </div>
                    )}
                  </div>

                  {/* ======================================================= */}
                  {/* 🔬 قسم الكود المرفق وتشريح الكود (Code Anatomy) */}
                  {/* ======================================================= */}
                  {activeLesson.codeSnippet && activeLesson.codeSnippet.trim() !== '' && (
                    <div className="mt-12 mb-12 pt-8 border-t border-slate-800/70">
                      <h3 className="heading-font text-[20px] md:text-[22px] font-bold text-white mb-4 flex items-center gap-2.5">
                        <Code className="text-emerald-400" size={24} /> الكود البرمجي التطبيقي (الخلاصة)
                      </h3>
                      
                      <div className="relative group rounded-xl overflow-hidden border border-slate-800 shadow-xl" dir="ltr">
                        <div className="bg-[#0b1120] text-slate-400 text-xs px-4 py-2.5 code-font flex items-center gap-2 border-b border-slate-800">
                          <Terminal size={14} className="text-emerald-400"/> Source Code
                        </div>
                        <SyntaxHighlighter style={vscDarkPlus} language="javascript" PreTag="div" customStyle={{ margin: 0, padding: '1.5rem', background: '#050811', fontSize: '0.92rem', lineHeight: '1.65' }}>
                          {activeLesson.codeSnippet}
                        </SyntaxHighlighter>
                      </div>

                      {activeLesson.codeExplanation && activeLesson.codeExplanation.trim() !== '' && (
                        <div className="mt-4 bg-[#081226] border border-indigo-500/25 rounded-xl p-6 relative overflow-hidden">
                          <h4 className="heading-font text-indigo-400 text-[18px] font-bold mb-3.5 flex items-center gap-2.5">
                            <Microscope size={20} className="text-indigo-400" /> تشريح الكود (Code Anatomy)
                          </h4>
                          
                          <div className="text-slate-300 text-[15.5px] leading-[1.9]">
                            <ReactMarkdown
                              components={{
                                p({children}) { return <p className="mb-3 leading-[1.9]">{children}</p> },
                                li({children}) {
                                  return (
                                    <li className="mb-2 flex items-start gap-2.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 shrink-0"></span>
                                      <span className="flex-1">{children}</span>
                                    </li>
                                  )
                                },
                                code({node, inline, children, ...props}) {
                                  return <code className="code-font bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded text-[0.88em] border border-slate-800 mx-0.5" dir="ltr" {...props}>{children}</code>
                                }
                              }}
                            >
                              {activeLesson.codeExplanation}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* 💻 خانة كتابة الكود التفاعلية للطالب + زر التلميحات المتدرج */}
                  {/* ======================================================= */}
                  {activeLesson.codingPractice && activeLesson.codingPractice.taskQuestion && (
                    <div className="mt-12 bg-[#081021] border-2 border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <h3 className="heading-font text-xl md:text-2xl font-bold text-indigo-400 flex items-center gap-2.5">
                          <Terminal size={24} /> مختبر كتابة الكود التفاعلي (جرب بنفسك!)
                        </h3>
                        <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full font-semibold">
                          تطبيق عملي مدعوم بالتلميحات
                        </span>
                      </div>

                      <p className="text-slate-200 text-[16px] mb-5 leading-[1.8]">
                        {activeLesson.codingPractice.taskQuestion}
                      </p>

                      <div className="rounded-xl overflow-hidden border border-slate-700/80 mb-5 shadow-inner" dir="ltr">
                        <div className="bg-[#0b1120] px-4 py-2.5 text-xs code-font text-slate-400 border-b border-slate-800 flex justify-between items-center">
                          <span className="flex items-center gap-2"><Code size={14} className="text-emerald-400"/> مساحة كتابة الكود الخاصة بك</span>
                          <button 
                            type="button"
                            onClick={() => setStudentCode(activeLesson.codingPractice.starterCode || '')}
                            className="text-slate-400 hover:text-white text-[11px]"
                          >
                            إعادة ضبط الكود
                          </button>
                        </div>
                        <textarea
                          value={studentCode}
                          onChange={(e) => setStudentCode(e.target.value)}
                          rows={6}
                          dir="ltr"
                          placeholder="// اكتب الكود المطلوب هنا..."
                          className="w-full bg-[#04070e] text-emerald-300 code-font text-[14.5px] p-4 outline-none resize-y leading-[1.7]"
                        />
                      </div>

                      {/* أزرار التلميحات والفحص الذكي */}
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleVerifyStudentCode}
                          disabled={verifyingCode}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(79,70,229,0.3)]"
                        >
                          <Bot size={18} /> {verifyingCode ? 'المعلم الذكي يفحص كودك...' : 'تحقق من الكود'}
                        </button>

                        {activeLesson.codingPractice.hints && activeLesson.codingPractice.hints.length > 0 && (
                          <button
                            type="button"
                            onClick={handleRevealNextHint}
                            disabled={revealedHintsCount >= activeLesson.codingPractice.hints.length}
                            className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-sm py-3 px-5 rounded-xl flex items-center gap-2 transition-all disabled:opacity-40"
                          >
                            <Lightbulb size={17} className="text-amber-400" /> 
                            {revealedHintsCount < activeLesson.codingPractice.hints.length 
                              ? `إظهار تلميح (${revealedHintsCount + 1} من ${activeLesson.codingPractice.hints.length})` 
                              : 'تم إظهار جميع التلميحات'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setShowSolution(!showSolution)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm py-3 px-4 rounded-xl flex items-center gap-2 transition-all mr-auto"
                        >
                          <Eye size={16} /> {showSolution ? 'إخفاء الحل' : 'إظهار الحل النموذجي'}
                        </button>
                      </div>

                      {/* عرض التلميحات المكشوفة تدريجياً */}
                      {revealedHintsCount > 0 && (
                        <div className="mt-5 space-y-2.5">
                          {activeLesson.codingPractice.hints.slice(0, revealedHintsCount).map((hint, hIdx) => (
                            <div key={hIdx} className="bg-amber-950/25 border border-amber-500/30 text-amber-200 text-[15px] p-4 rounded-xl flex items-start gap-3 animate-fade-in-up">
                              <Lightbulb size={18} className="text-amber-400 shrink-0 mt-1" />
                              <span className="leading-[1.7]">{hint}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* نتيجة فحص الكود */}
                      {codeFeedback && (
                        <div className={`mt-5 p-4 rounded-xl border text-[15px] ${codeFeedback.isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-amber-950/30 border-amber-500/40 text-amber-200'}`}>
                          <p className="leading-[1.8] font-medium">{codeFeedback.feedback}</p>
                        </div>
                      )}

                      {/* الحل النموذجي */}
                      {showSolution && activeLesson.codingPractice.solutionCode && (
                        <div className="mt-5 rounded-xl overflow-hidden border border-emerald-500/30" dir="ltr">
                          <div className="bg-emerald-950/40 px-4 py-2 text-xs text-emerald-300 font-bold">الحل النموذجي (Model Solution)</div>
                          <SyntaxHighlighter style={vscDarkPlus} language="javascript" PreTag="div" customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.9rem', background: '#050811' }}>
                            {activeLesson.codingPractice.solutionCode}
                          </SyntaxHighlighter>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* 🌟 سؤال نهاية الدرس الاختياري (غير إجباري + يمنح Bonus EXP) */}
                  {/* ======================================================= */}
                  {activeLesson.dailyQuest && activeLesson.dailyQuest.question && (
                    <div className="mt-14 bg-[#0b1120] border border-slate-800 rounded-2xl p-6 md:p-9 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500"></div>
                      
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <h3 className="heading-font text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                          <BrainCircuit className="text-amber-500" size={26} /> سؤال التحدي السريع (اختياري)
                        </h3>
                        <span className="text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1">
                          <Sparkles size={13}/> غير إجباري • مكافأة +{activeLesson.dailyQuest.bonusExp || 50} EXP
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm md:text-[15px] mb-6 pb-4 border-b border-slate-800/80">
                        هذا السؤال اختياري لتنشيط ذهنك؛ يمكنك الإجابة عليه لكسب نقاط خبرة إضافية أو تخطيه وإنهاء الدرس مباشرة بالأسفل.
                      </p>
                      
                      <div className="text-slate-100 font-semibold text-[16.5px] md:text-[18px] mb-6 leading-[1.8]">
                         <ReactMarkdown
                           remarkPlugins={[remarkGfm]}
                           components={{
                             p({children}) { return <p className="mb-3 leading-[1.8]">{children}</p> },
                             code({node, inline, className, children, ...props}) {
                               const match = /language-(\w+)/.exec(className || '')
                               return !inline && match ? (
                                 <div className="my-4 rounded-xl overflow-hidden border border-slate-800" dir="ltr">
                                   <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.9rem', background: '#050811' }}>
                                     {String(children).replace(/\n$/, '')}
                                   </SyntaxHighlighter>
                                 </div>
                               ) : (<code className="code-font bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded text-[0.88em] mx-1" dir="ltr" {...props}>{children}</code>)
                             }
                           }}
                         >
                           {activeLesson.dailyQuest.question}
                         </ReactMarkdown>
                      </div>

                      <div className="space-y-3">
                        {activeLesson.dailyQuest.options.map((opt, oIdx) => {
                          const isSelected = selectedQuestAnswer === oIdx;
                          
                          let boxStyle = "border-slate-800 bg-[#060b16] text-slate-300 hover:border-slate-700 hover:bg-slate-900/80 cursor-pointer";
                          let circleStyle = "border-slate-600";

                          if (questStatus === 'success') {
                            if (isSelected) {
                              boxStyle = "border-emerald-500 bg-emerald-950/30 text-emerald-300";
                              circleStyle = "border-emerald-500 bg-emerald-500 text-slate-950";
                            } else {
                              boxStyle = "border-slate-800/60 bg-[#060b16]/40 text-slate-500 opacity-50 cursor-not-allowed";
                              circleStyle = "border-slate-700";
                            }
                          } else if (questStatus === 'error' && isSelected) {
                             boxStyle = "border-red-500 bg-red-950/30 text-red-300";
                             circleStyle = "border-red-500 bg-red-500 text-white";
                          } else if (isSelected) {
                             boxStyle = "border-amber-500 bg-amber-950/25 text-white";
                             circleStyle = "border-amber-500 bg-amber-500 text-slate-950";
                          }

                          return (
                            <div 
                              key={oIdx} 
                              onClick={() => questStatus !== 'success' && setSelectedQuestAnswer(oIdx)}
                              className={`p-4 rounded-xl border font-medium text-[15.5px] flex items-center gap-3.5 transition-all ${boxStyle}`}
                            >
                              <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${circleStyle}`}>
                                {questStatus === 'success' && isSelected && <CheckCircle size={13} strokeWidth={3} />}
                                {questStatus === 'error' && isSelected && <X size={13} strokeWidth={3} />}
                              </div>
                              <span className="leading-[1.6]">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {questStatus === 'error' && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-red-950/30 border border-red-500/30">
                          <div className="flex items-center gap-2.5 text-red-400">
                            <X size={20} className="shrink-0" />
                            <p className="font-semibold text-sm">إجابة غير صحيحة! يمكنك المحاولة مجدداً أو إكمال الدرس مباشرة.</p>
                          </div>
                          <button 
                            onClick={handleRetryDailyQuest}
                            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm py-2 px-5 rounded-lg transition-all flex items-center justify-center gap-2"
                          >
                            <RefreshCw size={15} /> إعادة المحاولة
                          </button>
                        </div>
                      )}

                      {questStatus === 'success' && activeLesson.dailyQuest.explanation && (
                        <div className="mt-6 p-4 rounded-xl text-[15px] flex items-start gap-3 bg-emerald-950/25 border border-emerald-500/30 text-emerald-200">
                           <Lightbulb size={20} className="shrink-0 mt-0.5 text-amber-400" /> 
                           <p className="leading-[1.7]">{activeLesson.dailyQuest.explanation}</p>
                        </div>
                      )}

                      {questStatus !== 'success' && (
                        <button 
                          onClick={handleCheckDailyQuest}
                          className="heading-font w-full mt-7 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-base py-3.5 rounded-xl transition-all shadow-[0_6px_20px_rgba(245,158,11,0.2)] flex justify-center items-center gap-2"
                        >
                          <Zap size={20} /> تحقق من الإجابة (+50 Bonus EXP)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================= */}
              {/* 🛑 زر إنهاء الدرس والانتقال (مفتوح دائماً للدروس العادية!) */}
              {/* ======================================================= */}
              <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4">
                {isCurrentLessonCompleted ? (
                  <div className="bg-emerald-950/30 text-emerald-400 font-bold text-base py-3.5 px-7 rounded-xl flex items-center justify-center gap-2.5 border border-emerald-500/30 w-full sm:w-auto">
                    <CheckCircle size={20} /> لقد أتممت هذا الدرس بنجاح
                  </div>
                ) : (
                  <button 
                    onClick={handleCompleteLesson} 
                    disabled={isLocked}
                    className={`heading-font w-full sm:w-auto font-bold text-base py-3.5 px-8 rounded-xl flex items-center justify-center gap-2.5 transition-all ${
                      isLocked
                        ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_6px_25px_rgba(16,185,129,0.25)] hover:-translate-y-0.5'
                    }`}
                  >
                    <CheckCircle size={20} /> 
                    {isLocked
                        ? 'اجتز الاختبار أولاً لفتح العبور' 
                        : (isGateOrExam ? 'أنهِ التحدي واستلم المكافأة الكبرى 🐉' : 'أنهِ الدرس وانتقل للدرس التالي 🚀')}
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-32 opacity-50">
              <BookOpen size={56} className="text-slate-700 mb-4 animate-bounce" />
              <p className="text-slate-400 text-lg font-bold">جاري تحميل المعرفة...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classroom;