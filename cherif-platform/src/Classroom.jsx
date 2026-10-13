import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { 
  BookOpen, CheckCircle, Menu, X, ArrowRight, Terminal, Code, 
  HelpCircle, Swords, Zap, Skull, Flame, ShieldAlert, RefreshCw, BrainCircuit, Lightbulb ,ChevronDown, ChevronUp
} from 'lucide-react';

const Classroom = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openSections, setOpenSections] = useState({});

  // =========================================
  // 🎮 نظام الحالات الموحد (Quest States)
  // =========================================
  const [selectedQuestAnswer, setSelectedQuestAnswer] = useState(null); 
  const [selectedBossAnswers, setSelectedBossAnswers] = useState({});   
  const [questStatus, setQuestStatus] = useState('idle'); 
  const [scoreInfo, setScoreInfo] = useState({ score: 0, percentage: 0 }); 
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // حالة التقدم
  const [completedLessons, setCompletedLessons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

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

  // ✅ تم رفع هذا الـ useEffect ليكون هنا قبل أي return
  useEffect(() => {
    if (activeLesson && activeLesson.section) {
      setOpenSections(prev => ({ ...prev, [activeLesson.section]: true }));
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

  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0;
  const isCurrentLessonCompleted = completedLessons.includes(activeLesson?._id);

  // ==========================================
  // 🧠 محرك التقييم (Validation Engine)
  // ==========================================
  const resetQuestState = () => {
    setSelectedQuestAnswer(null);
    setSelectedBossAnswers({});
    setIsQuizSubmitted(false);
    setQuestStatus('idle');
    setScoreInfo({ score: 0, percentage: 0 });
  };

  const handleSelectAnswer = (questionIndex, optionIndex) => {
    if (isQuizSubmitted) return; 
    setSelectedBossAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleCheckDailyQuest = () => {
    if (selectedQuestAnswer === null) {
      alert("أيها الصياد، يجب أن تختار إجابة أولاً!");
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
      alert("يجب الإجابة على جميع أسئلة الزعيم قبل الهجوم!");
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

  // ✅ رفعنا العمليات الحسابية قبل الخروج
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

  let isLocked = false;
  if (!isCurrentLessonCompleted) {
    if (activeLesson?.type === 'boss_quiz' || activeLesson?.type === 'red_gate') {
      isLocked = questStatus !== 'success';
    } else if (activeLesson?.dailyQuest && activeLesson.dailyQuest.question) {
      isLocked = questStatus !== 'success';
    }
  }

  // 🚨🚨 مكان الخروج المبكر الصحيح بعد انتهاء كل الـ Hooks! 🚨🚨
  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div></div>;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row font-sans text-gray-200">
      
      {/* القائمة الجانبية (Sidebar) */}
      <div className={`fixed md:static inset-y-0 right-0 z-40 w-72 bg-gray-900 border-l border-gray-800 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} transition-transform duration-300 flex flex-col`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <Link to={`/course/${id}`} className="text-emerald-500 hover:text-emerald-400 flex items-center gap-2 font-bold text-sm">
            <ArrowRight size={16} /> العودة للكورس
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        
        <div className="p-6 border-b border-gray-800">
          <h2 className="font-black text-white text-lg leading-tight">{course?.title}</h2>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-4 overflow-hidden relative">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-bold">{progressPercentage}% مكتمل</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {Object.entries(groupedLessons).map(([sectionName, sectionLessons], sIndex) => {
            const completedInSection = sectionLessons.filter(l => completedLessons.includes(l._id)).length;
            const isSectionOpen = openSections[sectionName] || false;

            return (
              <div key={sIndex} className="bg-gray-950/50 border border-gray-800 rounded-2xl overflow-hidden">
                
                <button 
                  onClick={() => toggleSection(sectionName)}
                  className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 transition-colors border-b border-gray-800"
                >
                  <div className="text-right flex-1">
                    <h3 className="font-black text-gray-200 text-sm mb-1">{sectionName}</h3>
                    <p className="text-xs text-gray-500 font-bold">{completedInSection} / {sectionLessons.length} دروس مكتملة</p>
                  </div>
                  <div className="shrink-0 text-gray-500 ml-2">
                    {isSectionOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isSectionOpen && (
                  <div className="p-2 space-y-1 bg-gray-900/20">
                    {sectionLessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson._id);
                      const isActive = activeLesson?._id === lesson._id;
                      const isBoss = lesson.type === 'boss_quiz';
                      const isRedGate = lesson.type === 'red_gate';
                      
                      return (
                        <button 
                          key={lesson._id}
                          onClick={() => { 
                            setActiveLesson(lesson); 
                            if (window.innerWidth < 768) setSidebarOpen(false); 
                            resetQuestState(); 
                          }}
                          className={`w-full text-right p-3 rounded-xl flex items-start gap-3 transition-all ${
                            isActive 
                              ? (isRedGate ? 'bg-red-900/20 border border-red-500/30 text-red-400' 
                                  : isBoss ? 'bg-purple-900/20 border border-purple-500/30 text-purple-400' 
                                  : 'bg-emerald-900/20 border border-emerald-500/30 text-emerald-400') 
                              : 'hover:bg-gray-800 text-gray-400 border border-transparent'
                          }`}
                        >
                          <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-black mt-0.5 transition-colors ${
                            isCompleted 
                              ? 'bg-emerald-500 text-white' 
                              : (isActive 
                                  ? (isRedGate ? 'bg-red-900/80 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                                      : isBoss ? 'bg-purple-900/50 text-purple-500' 
                                      : 'bg-emerald-900/50 text-emerald-500') 
                                  : 'bg-gray-800 text-gray-500 border border-gray-700')
                          }`}>
                            {isCompleted ? <CheckCircle size={12} strokeWidth={4} /> : (isRedGate ? <Flame size={12}/> : isBoss ? <Skull size={12}/> : lesson.order)}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className={`font-bold text-sm truncate ${isCompleted && !isActive ? 'text-gray-500 line-through decoration-gray-700' : ''}`}>
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

      {/* مساحة القراءة التفاعلية */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-950">
        <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white flex items-center gap-2"><Menu size={20} /> <span className="font-bold text-sm">المنهج</span></button>
          <span className="font-bold text-white text-sm truncate max-w-[200px]">{activeLesson?.title}</span>
        </div>

        <div className="max-w-4xl mx-auto w-full p-6 md:p-12">
          {activeLesson ? (
            <div className="animate-fade-in-up">
              
              {(activeLesson.type === 'boss_quiz' || activeLesson.type === 'red_gate') ? (
                <div className="relative">
                  <div className={`absolute top-[-50px] left-1/2 -translate-x-1/2 w-64 h-64 blur-[100px] rounded-full pointer-events-none ${activeLesson.type === 'red_gate' ? 'bg-red-600/10' : 'bg-purple-600/10'}`}></div>
                  
                  {isCurrentLessonCompleted ? (
                    <div className="text-center py-20 bg-emerald-900/10 border border-emerald-500/30 rounded-3xl">
                      <ShieldAlert size={80} className="mx-auto text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                      <h1 className="text-4xl font-black text-white mb-4">البوابة مكسورة بالفعل!</h1>
                      <p className="text-gray-400 text-lg">لقد قمت بهزيمة هذا الزعيم وأثبت جدارتك للعبور.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-center mb-12">
                        {activeLesson.type === 'red_gate' ? (
                           <Flame size={64} className="mx-auto text-red-500 mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                        ) : (
                           <Skull size={64} className="mx-auto text-purple-500 mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                        )}
                        
                        <h1 className={`text-4xl md:text-5xl font-black text-white mb-4 ${activeLesson.type === 'red_gate' ? 'drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}`}>{activeLesson.title}</h1>
                        
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold border mb-6 ${activeLesson.type === 'red_gate' ? 'bg-red-900/30 text-red-400 border-red-500/30' : 'bg-purple-900/30 text-purple-400 border-purple-500/30'}`}>
                          {activeLesson.type === 'red_gate' ? <><Flame size={18} /> مستوى الخطورة: S-Rank (Red Gate)</> : <><Skull size={18} /> مستوى الخطورة: A-Rank (Boss)</>}
                        </div>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                          {activeLesson.description} أنت بحاجة إلى <strong className="text-white">70%</strong> على الأقل لكسر البوابة وإلا ستموت وتعود للمراجعة.
                        </p>
                      </div>

                      {isQuizSubmitted && (
                        <div className={`mb-10 p-8 rounded-3xl text-center border-2 shadow-2xl animate-fade-in-up ${questStatus === 'success' ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                           {questStatus === 'success' ? (
                             <>
                               <ShieldAlert size={60} className="mx-auto text-emerald-500 mb-4" />
                               <h3 className="text-3xl font-black text-emerald-400 mb-2">تم كسر البوابة بنجاح! 🐉✨</h3>
                               <p className="text-gray-300 text-lg mb-6">نسبة نجاحك: {scoreInfo.percentage}% ({scoreInfo.score}/{activeLesson.bossQuiz.length})</p>
                             </>
                           ) : (
                             <>
                               <Skull size={60} className="mx-auto text-red-500 mb-4" />
                               <h3 className="text-3xl font-black text-red-500 mb-2">لقد تم سحقك بواسطة الزعيم! 💀</h3>
                               <p className="text-gray-300 text-lg mb-6">نسبة نجاحك: {scoreInfo.percentage}%. تحتاج إلى 70% للنجاح.</p>
                               <button onClick={handleReviveFromBoss} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                                 <RefreshCw size={18} /> النهوض من الموت (إعادة المحاولة مع أسئلة جديدة)
                               </button>
                             </>
                           )}
                        </div>
                      )}

                      <div className="space-y-8">
                        {activeLesson.bossQuiz.map((q, qIndex) => (
                          <div key={qIndex} className="bg-[#0b0f15] border border-red-900/30 rounded-2xl p-6 md:p-8 relative">
                            <span className="absolute -top-4 -right-4 bg-gray-900 border border-gray-700 text-gray-400 w-10 h-10 flex items-center justify-center rounded-full font-black text-sm">
                              {qIndex + 1}
                            </span>
                            
                            <div className="text-white font-bold text-lg md:text-xl mb-6 leading-relaxed prose prose-invert max-w-none">
                               <ReactMarkdown
                                 remarkPlugins={[remarkGfm]}
                                 components={{
                                   code({node, inline, className, children, ...props}) {
                                     const match = /language-(\w+)/.exec(className || '')
                                     return !inline && match ? (
                                       <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ borderRadius: '8px', padding: '1rem', marginTop: '10px' }}>
                                         {String(children).replace(/\n$/, '')}
                                       </SyntaxHighlighter>
                                     ) : (<code className="bg-gray-800 text-yellow-400 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>{children}</code>)
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
                                
                                let boxStyle = "border-gray-800 bg-gray-900 text-gray-300 hover:border-red-500/50 cursor-pointer";
                                let circleStyle = "border-gray-700";

                                if (isQuizSubmitted) {
                                  if (isCorrect) {
                                    boxStyle = "border-emerald-500 bg-emerald-900/20 text-emerald-400";
                                    circleStyle = "border-emerald-500 bg-emerald-500";
                                  } else if (isSelected && !isCorrect) {
                                    boxStyle = "border-red-500 bg-red-900/20 text-red-400";
                                    circleStyle = "border-red-500 bg-red-500";
                                  } else {
                                    boxStyle = "border-gray-800 bg-gray-900 text-gray-500 opacity-40 cursor-not-allowed";
                                    circleStyle = "border-gray-800";
                                  }
                                } else if (isSelected) {
                                  boxStyle = "border-red-500 bg-red-900/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
                                  circleStyle = "border-red-500 bg-red-500";
                                }

                                return (
                                  <div 
                                    key={oIdx} 
                                    onClick={() => !isQuizSubmitted && handleSelectAnswer(qIndex, oIdx)}
                                    className={`p-4 rounded-xl border font-bold flex items-center gap-4 transition-all ${boxStyle}`}
                                  >
                                    <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${circleStyle}`}>
                                      {isQuizSubmitted && isCorrect && <CheckCircle size={14} className="text-white" />}
                                      {isQuizSubmitted && isSelected && !isCorrect && <X size={14} className="text-white" />}
                                    </div>
                                    {opt}
                                  </div>
                                );
                              })}
                            </div>
                            
                            {isQuizSubmitted && q.explanation && (
                                <div className="mt-4 p-4 rounded-xl bg-blue-900/20 border border-blue-500/30 text-blue-300 text-sm font-bold flex items-start gap-3">
                                  <Lightbulb size={18} className="shrink-0 mt-0.5 text-blue-400" />
                                  <p>{q.explanation}</p>
                                </div>
                            )}

                          </div>
                        ))}
                      </div>

                      {!isQuizSubmitted && (
                        <button 
                          onClick={handleCheckBossQuiz}
                          className="w-full mt-10 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-black text-xl py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)] flex justify-center items-center gap-3 hover:scale-[1.02]"
                        >
                          <Swords size={28} /> هاجم الزعيم (تأكيد الإجابات)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (

                <div>
                  <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">{activeLesson.title}</h1>
                  
                  {activeLesson.description && <p className="text-xl text-gray-400 mb-10 pb-10 border-b border-gray-800 leading-relaxed">{activeLesson.description}</p>}

              <div className="prose prose-invert max-w-none 
                prose-p:text-gray-300 prose-p:leading-loose prose-p:text-lg prose-p:mb-8
                prose-headings:font-black prose-headings:text-white prose-headings:mt-12 prose-headings:mb-6
                prose-h3:text-2xl prose-h3:text-emerald-400 prose-h3:border-b prose-h3:border-gray-800 prose-h3:pb-3
                prose-h4:text-xl prose-h4:text-blue-400
                prose-strong:text-emerald-300 prose-strong:font-bold
                prose-ul:list-disc prose-ul:pr-6 prose-ul:space-y-3 prose-ul:mb-8
                prose-ol:list-decimal prose-ol:pr-6 prose-ol:space-y-3 prose-ol:mb-8
                prose-li:text-gray-300 prose-li:leading-relaxed
                marker:text-emerald-500
                prose-blockquote:border-r-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-gray-900/50 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-l-lg prose-blockquote:italic prose-blockquote:text-gray-400 prose-blockquote:mb-8
                space-y-6
              ">
                {activeLesson.content ? (
                 <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h3({node, inline, className, children, ...props}) {
                        return <h3 className="text-2xl md:text-3xl font-black text-emerald-400 mt-12 mb-6 border-b border-gray-800 pb-4 flex items-center gap-3" {...props}>{children}</h3>
                      },
                      h4({node, inline, className, children, ...props}) {
                        return <h4 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4 flex items-center gap-2" {...props}>{children}</h4>
                      },
                      p({node, children, ...props}) {
                        return <p className="text-gray-300 text-lg leading-relaxed mb-6" {...props}>{children}</p>
                      },
                      ul({node, children, ...props}) {
                        return <ul className="list-disc list-inside space-y-3 mb-8 text-gray-300 text-lg" {...props}>{children}</ul>
                      },
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <div className="relative group rounded-xl overflow-hidden my-8 border border-gray-800 shadow-2xl">
                            <div className="bg-gray-900 text-gray-500 text-xs px-4 py-2 font-mono flex items-center gap-2 border-b border-gray-800"><Terminal size={14}/> {match[1]}</div>
                            <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1.5rem', background: '#0a0a0a' }} {...props}>
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (<code className="bg-gray-800 text-emerald-400 px-2 py-1 rounded-md text-sm font-mono border border-gray-700" {...props}>{children}</code>)
                      }
                    }}
                  >
                    {activeLesson.content}
                  </ReactMarkdown>
                ) : (
                  <div className="text-center py-20"><BookOpen size={48} className="mx-auto text-gray-600 mb-4" /><p className="text-gray-500">محتوى هذا الدرس قيد التجهيز.</p></div>
                )}
              </div>

                  {activeLesson.dailyQuest && activeLesson.dailyQuest.question && !isCurrentLessonCompleted && (
                    <div className="mt-12 bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl animate-fade-in-up">
                      <div className="absolute top-0 right-0 w-2 h-full bg-yellow-500"></div>
                      
                      <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
                        <BrainCircuit className="text-yellow-500" size={28} /> مهمة الحارس (Daily Quest)
                      </h3>
                      <p className="text-gray-400 text-sm mb-8">لن يُسمح لك بإنهاء الدرس واستلام الـ EXP قبل إثبات جدارتك وحل هذا التحدي.</p>
                      
                      <div className="text-white font-bold text-lg mb-6 leading-relaxed prose prose-invert max-w-none">
                         <ReactMarkdown
                           remarkPlugins={[remarkGfm]}
                           components={{
                             code({node, inline, className, children, ...props}) {
                               const match = /language-(\w+)/.exec(className || '')
                               return !inline && match ? (
                                 <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ borderRadius: '8px', padding: '1rem', marginTop: '10px' }}>
                                   {String(children).replace(/\n$/, '')}
                                 </SyntaxHighlighter>
                               ) : (<code className="bg-gray-800 text-yellow-400 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>{children}</code>)
                             }
                           }}
                         >
                           {activeLesson.dailyQuest.question}
                         </ReactMarkdown>
                      </div>

                      <div className="space-y-3">
                        {activeLesson.dailyQuest.options.map((opt, oIdx) => {
                          const isSelected = selectedQuestAnswer === oIdx;
                          const isCorrect = activeLesson.dailyQuest.correctAnswerIndex == oIdx;
                          
                          let boxStyle = "border-gray-800 bg-gray-950 text-gray-300 hover:border-yellow-500/50 cursor-pointer";
                          let circleStyle = "border-gray-600";

                          if (questStatus === 'success') {
                            if (isSelected) {
                              boxStyle = "border-emerald-500 bg-emerald-900/20 text-emerald-400";
                              circleStyle = "border-emerald-500 bg-emerald-500";
                            } else {
                              boxStyle = "border-gray-800 bg-gray-950 text-gray-500 opacity-40 cursor-not-allowed";
                              circleStyle = "border-gray-700";
                            }
                          } else if (questStatus === 'error' && isSelected) {
                             boxStyle = "border-red-500 bg-red-900/20 text-red-400";
                             circleStyle = "border-red-500 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
                          } else if (isSelected) {
                             boxStyle = "border-yellow-500 bg-yellow-900/20 text-yellow-400";
                             circleStyle = "border-yellow-500 bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]";
                          }

                          return (
                            <div 
                              key={oIdx} 
                              onClick={() => questStatus !== 'success' && setSelectedQuestAnswer(oIdx)}
                              className={`p-4 rounded-xl border font-bold flex items-center gap-3 transition-colors ${boxStyle}`}
                            >
                              <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${circleStyle}`}>
                                {questStatus === 'success' && isSelected && <CheckCircle size={14} className="text-white" />}
                                {questStatus === 'error' && isSelected && <X size={14} className="text-white" />}
                              </div>
                              {opt}
                            </div>
                          );
                        })}
                      </div>

                      {questStatus === 'error' && (
                        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-red-900/20 border border-red-500/30">
                          <div className="flex items-center gap-3 text-red-400">
                            <X size={20} className="shrink-0" />
                            <p className="font-bold text-sm">إجابة خاطئة! ركز جيداً في الدرس.</p>
                          </div>
                          <button 
                            onClick={handleRetryDailyQuest}
                            className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <RefreshCw size={16} /> إعادة المحاولة
                          </button>
                        </div>
                      )}

                      {questStatus === 'success' && activeLesson.dailyQuest.explanation && (
                        <div className="mt-4 p-4 rounded-xl text-sm font-bold flex items-start gap-3 bg-emerald-900/10 border border-emerald-500/30 text-emerald-300">
                           <Lightbulb size={20} className="shrink-0 mt-0.5" /> 
                           <p>{activeLesson.dailyQuest.explanation}</p>
                        </div>
                      )}

                      {questStatus !== 'success' && (
                        <button 
                          onClick={handleCheckDailyQuest}
                          className="w-full mt-8 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-gray-950 font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex justify-center items-center gap-2 hover:scale-[1.02]"
                        >
                          <Zap size={20} /> تحقق من الإجابة
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-16 pt-8 border-t border-gray-800 flex justify-between items-center">
                {isCurrentLessonCompleted ? (
                  <div className="bg-emerald-900/20 text-emerald-500 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 border border-emerald-500/20 w-full md:w-auto">
                    <CheckCircle size={20} /> لقد أتممت هذا الدرس بنجاح
                  </div>
                ) : (
                  <button 
                    onClick={handleCompleteLesson} 
                    disabled={isLocked}
                    className={`w-full md:w-auto font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all ${
                      isLocked
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1'
                    }`}
                  >
                    <CheckCircle size={20} /> 
                    {isLocked
                        ? (activeLesson.type === 'boss_quiz' || activeLesson.type === 'red_gate' ? 'اكسر البوابة لإنهاء التحدي' : 'أكمل المهمة لإنهاء الدرس') 
                        : (activeLesson.type === 'boss_quiz' || activeLesson.type === 'red_gate' ? 'أنهِ التحدي واستلم المكافأة 🐉' : 'أنهِ الدرس واستلم الـ EXP')}
                  </button>
                )}
              </div>

            </div>
          ) : (<div className="text-center py-32 text-gray-500">جاري تحميل الدرس...</div>)}
        </div>
      </div>
    </div>
  );
};

export default Classroom;