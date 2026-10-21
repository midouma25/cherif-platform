import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { 
  BookOpen, CheckCircle, Menu, X, ArrowRight, Terminal, Code, 
  Swords, Zap, Skull, Flame, ShieldAlert, RefreshCw, BrainCircuit, 
  Lightbulb, ChevronDown, Microscope, Trophy, Award, Sparkles, Eye, Bot,
  Volume2, Headphones, Mic, Copy, Check, Square, Upload, Puzzle, PenTool, Target, GitBranch
} from 'lucide-react';

// ============================================================================
// 🎧 1. محلل استوديو الاستماع والترديد (يحول codeSnippet الصوتي إلى جدول جمل ناطقة)
// ============================================================================
const parseAudioShadowingSnippet = (rawSnippet = '') => {
  if (!rawSnippet || (!rawSnippet.includes('IPA:') && !rawSnippet.includes('🎧'))) return [];
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

// ============================================================================
// 🧩 2. مستخرج مكعبات الليغو، جدول (لا تقل ❌ / بل قل ✅)، وبرومبت المحادثة الصوتية
// ============================================================================
const extractLanguageVisualWidgets = (markdown = '') => {
  if (!markdown) return { legoEquations: [], mistakeRows: [], voicePrompt: '' };

  const lines = markdown.split('\n');
  const legoEquations = [];
  const mistakeRows = [];
  let currentMistake = null;

  lines.forEach(line => {
    const trimmed = line.trim();

    // استخراج معادلات مكعبات الليغو [المكعب 1] + [المكعب 2]
    if (trimmed.includes('[') && trimmed.includes(']') && (trimmed.includes('+') || trimmed.includes('='))) {
      const cleanedEq = trimmed.replace(/^[*-\d.]+\s*/, '').replace(/`/g, '').trim();
      if (cleanedEq.length > 8 && cleanedEq.length < 220) {
        legoEquations.push(cleanedEq);
      }
    }

    // استخراج جدول الفخاخ اللغوية (❌ الخطأ الشائع vs ✅ الصواب الأصيل + 💡 السبب)
    if (trimmed.includes('❌')) {
      if (currentMistake && (currentMistake.wrong || currentMistake.right)) {
        mistakeRows.push(currentMistake);
      }
      const wrongText = trimmed.replace(/^[*-\d.]+\s*/, '').replace('❌', '').trim();
      if (trimmed.includes('✅')) {
        const splitParts = wrongText.split('✅');
        currentMistake = {
          wrong: splitParts[0].trim(),
          right: (splitParts[1] || '').trim(),
          reason: ''
        };
      } else {
        currentMistake = { wrong: wrongText, right: '', reason: '' };
      }
    } else if (trimmed.includes('✅') && currentMistake) {
      currentMistake.right = trimmed.replace(/^[*-\d.]+\s*/, '').replace('✅', '').trim();
    } else if ((trimmed.includes('💡') || trimmed.startsWith('*السبب') || trimmed.startsWith('**السبب')) && currentMistake) {
      currentMistake.reason = trimmed.replace(/^[*-\d.]+\s*/, '').replace('💡', '').trim();
    }
  });

  if (currentMistake && (currentMistake.wrong || currentMistake.right)) {
    mistakeRows.push(currentMistake);
  }

  // استخراج برومبت المحادثة الصوتية مع المدرب الذكي من القسم الخامس
  let voicePrompt = '';
  const voiceSec = markdown.split(/###\s*🎙️/)[1] || '';
  if (voiceSec) {
    const codeMatch = voiceSec.match(/```(?:text)?\n([\s\S]*?)```/);
    if (codeMatch) {
      voicePrompt = codeMatch[1].trim();
    } else {
      const quoteLines = voiceSec
        .split('\n')
        .filter(l => l.trim().startsWith('>'))
        .map(l => l.replace(/^\s*>\s*/, '').trim())
        .join('\n');
      if (quoteLines) {
        voicePrompt = quoteLines.replace(/^["*]+|["*]+$/g, '').trim();
      } else {
        const quotedMatch = voiceSec.match(/"([^"]{45,})"/);
        if (quotedMatch) voicePrompt = quotedMatch[1].trim();
      }
    }
  }

  return {
    legoEquations: legoEquations.slice(0, 6),
    mistakeRows: mistakeRows.filter(r => r.wrong && r.right).slice(0, 6),
    voicePrompt
  };
};

// تنظيف وصف الدرس من علامات الملخصات المحقونة
const cleanLessonDesc = (desc = '') => {
  return (desc || '').split('|||UNIT_SUMMARY:')[0].split('|||UNITS_MAP:')[0].trim();
};

// تنظيف تكرار "كراش كورس 1: كراش كورس 1" في العنوان
const cleanCourseTitleText = (title = '') => {
  return (title || '')
    .replace(/^((?:الكراش كورس|كراش كورس|الكورس)\s*\d+)\s*:\s*(?:الكراش كورس|كراش كورس|الكورس)\s*\d+\s*[-:]?\s*/i, '$1: ')
    .trim();
};

const Classroom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [unitSummariesMap, setUnitSummariesMap] = useState({});

  // =========================================
  // 🎮 نظام الحالات الموحد (Quest & Boss States)
  // =========================================
  const [selectedQuestAnswer, setSelectedQuestAnswer] = useState(null); 
  const [selectedBossAnswers, setSelectedBossAnswers] = useState({});   
  const [questStatus, setQuestStatus] = useState('idle'); 
  const [scoreInfo, setScoreInfo] = useState({ score: 0, percentage: 0 }); 
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // =========================================
  // 💻 نظام خانة كتابة الكود / تركيب الجمل التفاعلية والتلميحات (Sandbox States)
  // =========================================
  const [studentCode, setStudentCode] = useState('');
  const [revealedHintsCount, setRevealedHintsCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeFeedback, setCodeFeedback] = useState(null);

  // =========================================
  // 🔊 نظام الصوتيات والترديد والمايكروفون للغات (Audio & Shadowing States)
  // =========================================
  const [speakingKey, setSpeakingKey] = useState('');
  const [copiedVoicePrompt, setCopiedVoicePrompt] = useState(false);
  const [listeningRowIdx, setListeningRowIdx] = useState(null);
  const [speechCheckResult, setSpeechCheckResult] = useState(null);
  const [showUnitSummaryBanner, setShowUnitSummaryBanner] = useState(true);
  const jsonInputRef = useRef(null);

  // حالة التقدم والشهادات
  const [completedLessons, setCompletedLessons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [claimingCert, setClaimingCert] = useState(false);

  const shuffleBossQuestions = (quizArray) => {
    return [...quizArray].sort(() => Math.random() - 0.5);
  };

  // ============================================================================
  // 📥 دالة تحويل كائن JSON الكامل (مثل CrashCourse_1.json) إلى هيكل Classroom
  // ============================================================================
  const hydrateFromRawCourseJSON = (rawJson) => {
    if (!rawJson) return false;
    const cleanedTitle = cleanCourseTitleText(rawJson.courseTitle || rawJson.title || 'كراش كورس تفاعلي');
    const courseObj = {
      _id: rawJson._id || id || 'local_course_id',
      title: cleanedTitle,
      description: rawJson.courseDescription || rawJson.description || '',
      difficulty: rawJson.difficultyLevel || '',
      estimatedHours: rawJson.estimatedHours || '18 ساعة',
      certificateBadge: rawJson.certificateBadge || '',
      connectionToPrevious: rawJson.connectionToPrevious || '',
      cliffhangerToNext: rawJson.cliffhangerToNext || '',
      githubProject: rawJson.githubProject || null,
      skills: rawJson.skills || []
    };

    const summaries = { ...(rawJson.unitSummariesMap || {}) };
    const flatLessons = [];
    let globalOrder = 1;

    const rawSections = rawJson.sections || rawJson.blueprint || [];
    rawSections.forEach((sec, sIdx) => {
      const secName = sec.sectionName || `الوحدة ${sIdx + 1}`;
      if (sec.unitDeepSummary) {
        summaries[secName] = sec.unitDeepSummary;
      }
      (sec.lessons || []).forEach((les, lIdx) => {
        flatLessons.push({
          ...les,
          _id: les._id || `lesson_${sIdx + 1}_${lIdx + 1}`,
          order: les.order || globalOrder++,
          section: secName
        });
      });
    });

    setCourse(courseObj);
    setUnitSummariesMap(summaries);
    setLessons(flatLessons);
    if (flatLessons.length > 0) {
      setActiveLesson(flatLessons[0]);
      setOpenSections({ [flatLessons[0].section]: true });
    }
    return true;
  };

  // رفع ملف JSON محلي مباشرة للتجربة الفورية
  const handleImportLocalJSONFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        localStorage.setItem('cherif_active_local_course_json', JSON.stringify(parsed));
        hydrateFromRawCourseJSON(parsed);
        resetQuestState();
      } catch (err) {
        alert('❌ ملف JSON غير صالح. تأكد من اختيار ملف الكراش كورس الصحيح.');
      } finally {
        e.target.value = null;
      }
    };
    reader.readAsText(file);
  };

  // ============================================================================
  // 🔊 دوال النطق الصوتي بـ 3 سرعات (1.0x طبيعي | 0.75x ترديد | 0.5x بطيء للحروف)
  // ============================================================================
  const handlePlayAudioText = (rawText, rate = 1.0, keyId = 'studio') => {
    if (!('speechSynthesis' in window)) {
      return alert('متصفحك لا يدعم محرك النطق الصوتي المباشر.');
    }
    window.speechSynthesis.cancel();

    const cleanForeign = (rawText || '')
      .split('\n')
      .map(l => l.replace(/🔊.*$/g, '').replace(/\Vert{}.*$/g, '').replace(/^\d+[.) -]+/, '').trim())
      .filter(l => l && !l.startsWith('🎧') && !/^[\u0600-\u06FF\s\d.,:!؟-]+$/.test(l))
      .join('. ');

    const textToSpeak = cleanForeign || rawText;
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.lang = 'en-US';
    utterance.onstart = () => setSpeakingKey(`${keyId}_${rate}`);
    utterance.onend = () => setSpeakingKey('');
    utterance.onerror = () => setSpeakingKey('');
    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingKey('');
    }
  };

  // 🎤 فحص نطق الطالب بالمايكروفون ومقارنته بالجملة المستهدفة
  const handleTestPronunciationMic = (targetSentence, rowIndex) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return alert('يرجى استخدام متصفح Google Chrome أو Edge لتفعيل ميزة فحص النطق بالمايكروفون.');
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onstart = () => {
      setListeningRowIdx(rowIndex);
      setSpeechCheckResult(null);
    };
    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript || '';
      const cleanTarget = targetSentence.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
      const cleanSpoken = spoken.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
      const isGoodMatch = cleanSpoken === cleanTarget || cleanTarget.includes(cleanSpoken) || cleanSpoken.includes(cleanTarget);

      setSpeechCheckResult({
        rowIndex,
        spoken,
        target: targetSentence,
        isGoodMatch
      });
      setListeningRowIdx(null);
    };
    recognition.onerror = () => setListeningRowIdx(null);
    recognition.onend = () => setListeningRowIdx(null);
    recognition.start();
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
        
        if (courseRes.data.success) {
          const rawCourse = courseRes.data.course;
          setCourse({
            ...rawCourse,
            title: cleanCourseTitleText(rawCourse.title)
          });

          // استخراج خريطة ملخصات الوحدات المحقونة في وصف الكورس أو في certificateMeta
          let extractedMap = rawCourse.certificateMeta?.unitSummariesMap || {};
          if (rawCourse.description && rawCourse.description.includes('|||UNITS_MAP:')) {
            try {
              extractedMap = {
                ...extractedMap,
                ...JSON.parse(rawCourse.description.split('|||UNITS_MAP:')[1].trim())
              };
            } catch (e) {}
          }
          setUnitSummariesMap(extractedMap);
        }

        if (progressRes.data) setCompletedLessons(progressRes.data.completedLessons || []);
        
        if (lessonsRes.data.success && lessonsRes.data.lessons?.length > 0) {
          const fetchedLessons = lessonsRes.data.lessons;
          // استخراج أي ملخصات وحدات محقونة داخل الدرس الأول لكل وحدة
          const lessonSummaries = {};
          fetchedLessons.forEach(l => {
            if (l.description && l.description.includes('|||UNIT_SUMMARY:')) {
              try {
                const jsonStr = l.description.split('|||UNIT_SUMMARY:')[1].split('|||UNITS_MAP:')[0].trim();
                lessonSummaries[l.section] = JSON.parse(jsonStr);
              } catch (e) {}
            }
          });
          if (Object.keys(lessonSummaries).length > 0) {
            setUnitSummariesMap(prev => ({ ...lessonSummaries, ...prev }));
          }

          setLessons(fetchedLessons);
          setActiveLesson(fetchedLessons[0]);
        } else {
          // في حال كان الكورس يحتوي على sections مباشرة في نفس الكائن
          if (courseRes.data?.course?.sections || courseRes.data?.course?.blueprint) {
            hydrateFromRawCourseJSON(courseRes.data.course);
          }
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات من السيرفر، جاري فحص النسخة المحلية إن وجدت:', err);
        const cachedLocal = localStorage.getItem('cherif_active_local_course_json');
        if (cachedLocal) {
          try {
            hydrateFromRawCourseJSON(JSON.parse(cachedLocal));
          } catch (e) {}
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => handleStopAudio();
  }, [id]);

  useEffect(() => {
    handleStopAudio();
    setSpeechCheckResult(null);
    if (activeLesson) {
      if (activeLesson.section) {
        setOpenSections(prev => ({ ...prev, [activeLesson.section]: true }));
      }
      setStudentCode(activeLesson.codingPractice?.starterCode || '');
      setRevealedHintsCount(0);
      setShowSolution(false);
      setCodeFeedback(null);
    }
  }, [activeLesson]);

  const handleCompleteLesson = async () => {
    // إذا كنا في وضع المعاينة المحلية لملف JSON بدون سيرفر، نسمح بالانتقال السلس للدرس التالي
    const token = localStorage.getItem('cherif_token');
    if (!token || String(activeLesson?._id).startsWith('lesson_')) {
      if (!completedLessons.includes(activeLesson._id)) {
        setCompletedLessons(prev => [...prev, activeLesson._id]);
      }
      const currentIndex = lessons.findIndex(l => l._id === activeLesson._id);
      if (currentIndex < lessons.length - 1) {
        setActiveLesson(lessons[currentIndex + 1]);
        resetQuestState();
      }
      return;
    }

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
  // 🧠 محرك التقييم وفحص الكود / الجمل (Validation & AI Review Engine)
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

  // 🤖 فحص كود الطالب أو جمله اللغوية عبر الذكاء الاصطناعي (أو المطابقة الذكية)
  const handleVerifyStudentCode = async () => {
    if (!studentCode || studentCode.trim() === '') {
      return alert('اكتب إجابتك أو الكود في الخانة أولاً قبل الضغط على زر التحقق!');
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
      // بديل محلي ذكي يدعم كلاً من الجمل اللغوية والأكواد البرمجية
      const normalize = (str) => (str || '')
        .replace(/\/\/.*$/gm, '')
        .replace(/#.*$/gm, '')
        .replace(/✅.*$/gm, '')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

      const cleanStudent = normalize(studentCode);
      const cleanSolution = normalize(activeLesson.codingPractice?.solutionCode || '');

      const solutionWords = cleanSolution.split(' ').filter(w => w.length > 2);
      const matchedWords = solutionWords.filter(w => cleanStudent.includes(w));
      const matchRatio = solutionWords.length > 0 ? matchedWords.length / solutionWords.length : 0;
      const isMatch = cleanStudent.length > 10 && (matchRatio >= 0.55 || cleanSolution.includes(cleanStudent));

      setCodeFeedback({
        isCorrect: isMatch,
        feedback: isMatch 
          ? '🎉 أحسنت يا بطل! تركيبك للجمل / الكود سليم ومطابق للمعايير القياسية ببراعة.' 
          : '💡 محاولة رائعة! راجع التلميحات بالأسفل أو اضغط على "إظهار الحل النموذجي" لمقارنة إجابتك وتصحيح الفروق البسيطة.',
        correctedSnippet: isMatch ? '' : activeLesson.codingPractice?.solutionCode
      });
    } finally {
      setVerifyingCode(false);
    }
  };

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

  // تحليل الدرس الحالي لمعرفة ما إذا كان درساً لغوياً/صوتياً ويحتوي على استوديو استماع
  const isLanguageLesson = Boolean(
    activeLesson?.lessonCategory === 'language_mastery' ||
    activeLesson?.codeSnippet?.includes('IPA:') ||
    activeLesson?.codeSnippet?.includes('🎧') ||
    /Pre-A1|Phonics|Lego Grammar|Shadowing|الحروف والأصوات/i.test(course?.title || '')
  );

  const audioStudioItems = useMemo(() => {
    return parseAudioShadowingSnippet(activeLesson?.codeSnippet || '');
  }, [activeLesson]);

  const visualWidgets = useMemo(() => {
    return extractLanguageVisualWidgets(activeLesson?.content || '');
  }, [activeLesson]);

  const activeUnitSummary = useMemo(() => {
    if (!activeLesson?.section) return null;
    if (unitSummariesMap[activeLesson.section]) return unitSummariesMap[activeLesson.section];
    const keys = Object.keys(unitSummariesMap);
    const matchedKey = keys.find(k => k.includes(activeLesson.section) || activeLesson.section.includes(k));
    return matchedKey ? unitSummariesMap[matchedKey] : null;
  }, [activeLesson, unitSummariesMap]);

  // 🔒 قفل زر إنهاء الدرس فقط في معارك الزعماء، البوابة الحمراء، واختبار نهاية الوحدة
  const isGateOrExam = activeLesson?.type === 'boss_quiz' || activeLesson?.type === 'red_gate' || activeLesson?.type === 'unit_exam';
  let isLocked = false;
  if (!isCurrentLessonCompleted && isGateOrExam) {
    isLocked = questStatus !== 'success';
  }

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#020617]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div></div>;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row text-slate-200 classroom-typography" dir="rtl">
      
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
        
        <div className="p-4 border-b border-slate-800/60 flex justify-between items-center bg-[#0b1120] sticky top-0 z-10 gap-2">
          <Link to={`/course/${id}`} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-semibold text-xs transition-colors">
            <ArrowRight size={15} /> العودة للكورس
          </Link>

          {/* زر استيراد ملف JSON للتجربة المباشرة */}
          <input
            type="file"
            accept=".json"
            ref={jsonInputRef}
            onChange={handleImportLocalJSONFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => jsonInputRef.current?.click()}
            className="bg-indigo-500/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
            title="فتح ملف JSON للكورس مباشرة"
          >
            <Upload size={12} /> فتح JSON
          </button>

          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-5 border-b border-slate-800/60 bg-gradient-to-b from-[#0f172a]/50 to-transparent">
          {course?.certificateBadge && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full mb-2">
              <Award size={11} /> {course.certificateBadge}
            </span>
          )}
          <h2 className="heading-font font-bold text-white text-[15.5px] leading-[1.6]">{course?.title}</h2>
          <div className="w-full bg-slate-800/90 rounded-full h-2 mt-4 overflow-hidden relative">
            <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-slate-400 font-medium">{progressPercentage}% مكتمل ({completedLessons.length}/{lessons.length})</p>
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
            const isProjectSection = sectionName.includes('مشروع') || sectionName.includes('GitHub') || sectionName.includes('تحدي');

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
                    <p className="text-[11px] text-slate-500 font-medium">{completedInSection} / {sectionLessons.length} محطات مكتملة</p>
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
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* عرض مشروع التخرج اللغوي أو البرمجي من الـ JSON في أسفل القائمة الجانبية */}
          {course?.githubProject?.projectTitle && (
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3.5 space-y-1.5 mt-4">
              <span className="text-[10px] font-black text-amber-400 flex items-center gap-1">
                <Trophy size={12} /> تحدي ومشروع الكورس النهائي:
              </span>
              <p className="text-xs font-bold text-white">{course.githubProject.projectTitle}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{course.githubProject.projectSummary}</p>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================= */}
      {/* 📖 مساحة القراءة والاستوديو الصوتي التفاعلي (Main Reading Area) */}
      {/* ======================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#020617] scroll-smooth">
        <div className="md:hidden bg-[#0b1120] border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-300 hover:text-white flex items-center gap-2"><Menu size={20} /> <span className="font-bold text-sm">المنهج</span></button>
          <span className="font-semibold text-white text-sm truncate max-w-[200px]">{activeLesson?.title}</span>
        </div>

        <div className="max-w-[920px] mx-auto w-full px-6 py-10 md:px-12 md:py-14">
          {activeLesson ? (
            <div className="animate-fade-in-up">

              {/* 🎯 بطاقة ملخص الوحدة العميق (unitDeepSummary من ملف الـ JSON) */}
              {activeUnitSummary && (
                <div className="mb-8 bg-gradient-to-r from-indigo-950/50 via-[#0b1120] to-[#0b1120] border border-indigo-500/30 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowUnitSummaryBanner(!showUnitSummaryBanner)}>
                    <div className="flex items-center gap-2.5">
                      <Target size={18} className="text-amber-400 shrink-0" />
                      <span className="heading-font text-sm font-bold text-indigo-300">
                        بوصلة الوحدة الحالية: {activeLesson.section}
                      </span>
                    </div>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${showUnitSummaryBanner ? 'rotate-180' : ''}`} />
                  </div>

                  {showUnitSummaryBanner && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs sm:text-sm text-slate-300">
                      {activeUnitSummary.unitSummary && (
                        <p className="text-white font-semibold">{activeUnitSummary.unitSummary}</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {activeUnitSummary.whatYouLearn && (
                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                            <strong className="text-amber-400 block mb-1">🎯 ماذا ستتقن في هذه الوحدة؟</strong>
                            <span>{activeUnitSummary.whatYouLearn}</span>
                          </div>
                        )}
                        {activeUnitSummary.whyItMatters && (
                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                            <strong className="text-emerald-400 block mb-1">💡 لماذا هذه الوحدة حاسمة؟</strong>
                            <span>{activeUnitSummary.whyItMatters}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
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
                           : activeLesson.type === 'unit_exam' ? <><Trophy size={16} /> الاختبار النهائي الشامل للوحدة (لغوي + كودي هجين)</>
                           : <><Skull size={16} /> بوابة التحدي اللغوي والسمعي (Boss Check)</>}
                        </div>
                        <p className="text-slate-400 text-base md:text-[17px] max-w-xl mx-auto leading-[1.8]">
                          {cleanLessonDesc(activeLesson.description)} أنت بحاجة إلى <strong className="text-white bg-slate-800 px-2 py-0.5 rounded">70%</strong> على الأقل للنجاح.
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
                                {q.questionType === 'code' ? '💻 سؤال كودي-لغوي تطبيقي' : '🗣️ سؤال صوتي ومفاهيمي'}
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
                            <Terminal size={22} /> التحدي البرمجي واللغوي العملي للوحدة
                          </h3>
                          <p className="text-slate-200 text-base mb-4 leading-relaxed whitespace-pre-wrap">{activeLesson.codingPractice.taskQuestion}</p>

                          <div className="rounded-xl overflow-hidden border border-slate-700 mb-4" dir="ltr">
                            <div className="bg-slate-900 px-4 py-2 text-xs code-font text-slate-400 border-b border-slate-800 flex justify-between items-center">
                              <span>Interactive Hybrid Sandbox</span>
                              <span className="text-emerald-400">Code & Language Builder</span>
                            </div>
                            <textarea
                              value={studentCode}
                              onChange={(e) => setStudentCode(e.target.value)}
                              rows={6}
                              dir="ltr"
                              placeholder="// اكتب الكود أو الجمل المطلوبة هنا..."
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
                              <Bot size={17} /> {verifyingCode ? 'جاري الفحص...' : 'فحص الإجابة مع المعلم الذكي'}
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
                /* 📘 الدرس العادي: مكعبات الليغو + استوديو الصوتيات + الشرح + التمارين */
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
                    <p className="text-[16px] md:text-[18px] text-slate-400 mb-8 pb-6 border-b border-slate-800/80 leading-[1.8] font-normal">
                      {cleanLessonDesc(activeLesson.description)}
                    </p>
                  )}

                  {/* 🧩 1. لوحة معادلات مكعبات الليغو البصرية المستخرجة تلقائياً من الدرس */}
                  {visualWidgets.legoEquations.length > 0 && (
                    <div className="mb-10 bg-gradient-to-br from-amber-950/25 via-[#0b1120] to-[#0b1120] border-2 border-amber-500/35 rounded-2xl p-6 shadow-xl">
                      <h3 className="heading-font text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <Puzzle size={20} /> 🧩 معادلات مكعبات الليغو لبناء الجمل في هذا الدرس (Lego Formula):
                      </h3>
                      <div className="space-y-3">
                        {visualWidgets.legoEquations.map((eq, idx) => (
                          <div key={idx} className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center gap-2 text-sm md:text-base font-bold text-white" dir="auto">
                            {eq.split('+').map((part, pIdx, arr) => (
                              <React.Fragment key={pIdx}>
                                <span className={`px-3 py-1.5 rounded-lg border ${
                                  pIdx === 0 ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                  : pIdx === 1 ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                                  : 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                                }`}>
                                  {part.trim()}
                                </span>
                                {pIdx < arr.length - 1 && <span className="text-emerald-400 font-black text-lg">+</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 📖 2. محتوى الدرس التفصيلي (ReactMarkdown) */}
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

                  {/* ✍️ 3. جدول المقارنة المنظم للفخاخ اللغوية (لا تقل ❌ / بل قل ✅) */}
                  {visualWidgets.mistakeRows.length > 0 && (
                    <div className="mt-10 bg-[#0b1120] border-2 border-emerald-500/35 rounded-2xl p-6 shadow-xl">
                      <h3 className="heading-font text-lg md:text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <CheckCircle size={20} /> 📋 جدول الخلاصة التصحيحية: لا تقل كذا ❌ .. بل قل كذا ✅
                      </h3>
                      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                        <table className="w-full text-right border-collapse text-sm">
                          <thead>
                            <tr className="bg-slate-900 border-b border-slate-800 text-xs font-bold">
                              <th className="p-3.5 text-red-400">❌ الخطأ الشائع (ترجمة حرفية)</th>
                              <th className="p-3.5 text-emerald-400">✅ الصواب الأصيل (Native Way)</th>
                              <th className="p-3.5 text-amber-300">💡 التفسير اللغوي</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80">
                            {visualWidgets.mistakeRows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-900/40">
                                <td className="p-3.5 text-red-200/90 bg-red-950/10">{row.wrong}</td>
                                <td className="p-3.5 text-emerald-200 font-semibold bg-emerald-950/10">{row.right}</td>
                                <td className="p-3.5 text-slate-300 text-xs leading-relaxed">{row.reason || 'تطبيق قاعدة مكعبات الجملة الإنجليزية السليمة.'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 🎙️ 4. بطاقة النسخ السريع لبرومبت المحادثة الصوتية مع الـ AI */}
                  {visualWidgets.voicePrompt && (
                    <div className="mt-8 bg-gradient-to-r from-rose-950/30 via-[#0b1120] to-[#0b1120] border border-rose-500/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                          <Mic size={22} />
                        </div>
                        <div>
                          <h4 className="heading-font font-bold text-white text-sm md:text-base">جاهز للتحدث صوتياً مع مدربك الذكي؟</h4>
                          <p className="text-xs text-slate-400">انسخ أمر المحادثة الصوتية لهذا الدرس بضغطة زر وضعه في ChatGPT Voice أو Gemini Live.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(visualWidgets.voicePrompt);
                          setCopiedVoicePrompt(true);
                          setTimeout(() => setCopiedVoicePrompt(false), 2500);
                        }}
                        className="shrink-0 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all"
                      >
                        {copiedVoicePrompt ? <Check size={16} /> : <Copy size={16} />}
                        {copiedVoicePrompt ? 'تم نسخ البرومبت الصوتي!' : 'نسخ برومبت المحادثة الصوتية'}
                      </button>
                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* 🎧🔬 5. قسم استوديو الاستماع والنطق (أو الكود المرفق) + التشريح */}
                  {/* ======================================================= */}
                  {activeLesson.codeSnippet && activeLesson.codeSnippet.trim() !== '' && (
                    <div className="mt-12 mb-12 pt-8 border-t border-slate-800/70">
                      
                      {audioStudioItems.length > 0 ? (
                        /* 🎧 عرض استوديو الصوتيات وجدول الـ IPA التفاعلي بـ 3 سرعات */
                        <div className="bg-[#0b1120] border-2 border-purple-500/40 rounded-2xl p-6 md:p-7 shadow-2xl space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                            <div>
                              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 mb-1">
                                <Headphones size={15} /> Listening & Shadowing Studio
                              </span>
                              <h3 className="heading-font text-xl md:text-2xl font-bold text-white">
                                🎧 استوديو الاستماع والنطق الصوتي (IPA & Shadowing Table)
                              </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handlePlayAudioText(activeLesson.codeSnippet, 1.0, 'all_studio')}
                                className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                                  speakingKey === 'all_studio_1'
                                    ? 'bg-purple-500 text-white shadow'
                                    : 'bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30'
                                }`}
                              >
                                <Volume2 size={14} /> تشغيل الكل (1.0x)
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePlayAudioText(activeLesson.codeSnippet, 0.75, 'all_studio')}
                                className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                                  speakingKey === 'all_studio_0.75'
                                    ? 'bg-amber-500 text-slate-950 shadow'
                                    : 'bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                🐢 ترديد بطيء (0.75x)
                              </button>
                              {speakingKey && (
                                <button
                                  type="button"
                                  onClick={handleStopAudio}
                                  className="bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold px-3 py-2 rounded-xl border border-red-500/30 flex items-center gap-1"
                                >
                                  <Square size={12} /> إيقاف
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#050811]">
                            <table className="w-full text-right border-collapse">
                              <thead>
                                <tr className="bg-slate-900 border-b border-slate-800 text-xs font-bold text-slate-400">
                                  <th className="p-3.5 w-10 text-center">#</th>
                                  <th className="p-3.5">الجملة الإنجليزية (Target Sentence)</th>
                                  <th className="p-3.5">الرمز الصوتي (IPA)</th>
                                  <th className="p-3.5">المعنى بالعربية</th>
                                  <th className="p-3.5 text-center">استمع (3 سرعات) + اختبر نطقك</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/70 text-sm">
                                {audioStudioItems.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                                    <td className="p-3.5 text-center font-bold text-purple-400 code-font">{item.order || idx + 1}</td>
                                    <td className="p-3.5 font-bold text-white text-base" dir="ltr">{item.sentence}</td>
                                    <td className="p-3.5 code-font text-emerald-400 text-xs" dir="ltr">{item.ipa}</td>
                                    <td className="p-3.5 text-slate-300">{item.meaning}</td>
                                    <td className="p-3.5">
                                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                        <button
                                          type="button"
                                          onClick={() => handlePlayAudioText(item.sentence, 1.0, `sent_${idx}`)}
                                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                                            speakingKey === `sent_${idx}_1`
                                              ? 'bg-purple-500 text-white'
                                              : 'bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30'
                                          }`}
                                          title="سرعة المتحدث الأصلي 1.0x"
                                        >
                                          <Volume2 size={12} /> 1.0x
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handlePlayAudioText(item.sentence, 0.75, `sent_${idx}`)}
                                          className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                                            speakingKey === `sent_${idx}_0.75`
                                              ? 'bg-amber-500 text-slate-950'
                                              : 'bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                                          }`}
                                          title="سرعة الترديد 0.75x"
                                        >
                                          🐢 0.75x
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handlePlayAudioText(item.sentence, 0.5, `sent_${idx}`)}
                                          className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                                            speakingKey === `sent_${idx}_0.5`
                                              ? 'bg-emerald-500 text-slate-950'
                                              : 'bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                                          }`}
                                          title="سرعة بطيئة لتفكيك الحروف 0.5x"
                                        >
                                          🧒 0.5x
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleTestPronunciationMic(item.sentence, idx)}
                                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border ${
                                            listeningRowIdx === idx
                                              ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                                              : 'bg-slate-900 hover:bg-slate-800 text-rose-300 border-rose-500/30'
                                          }`}
                                          title="اختبر نطقك لهذه الجملة بالمايكروفون"
                                        >
                                          <Mic size={11} /> {listeningRowIdx === idx ? 'انطق الآن...' : 'انطق'}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* نتيجة فحص النطق بالمايكروفون */}
                          {speechCheckResult && (
                            <div className={`p-4 rounded-xl border text-sm flex items-center justify-between gap-4 ${
                              speechCheckResult.isGoodMatch
                                ? 'bg-emerald-950/35 border-emerald-500/40 text-emerald-200'
                                : 'bg-amber-950/35 border-amber-500/40 text-amber-200'
                            }`}>
                              <div>
                                <p className="font-bold">
                                  {speechCheckResult.isGoodMatch ? '🎉 نطق ممتاز وواضح جداً!' : '💡 قريب جداً! حاول ضبط مخارج الحروف مرة أخرى:'}
                                </p>
                                <p className="text-xs mt-1" dir="ltr">
                                  Target: <strong>"{speechCheckResult.target}"</strong> | You said: <strong>"{speechCheckResult.spoken}"</strong>
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSpeechCheckResult(null)}
                                className="text-xs text-slate-400 hover:text-white"
                              >
                                إغلاق
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* 💻 عرض الكود البرمجي التقليدي إذا كان درس برمجة */
                        <>
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
                        </>
                      )}

                      {activeLesson.codeExplanation && activeLesson.codeExplanation.trim() !== '' && (
                        <div className="mt-4 bg-[#081226] border border-indigo-500/25 rounded-xl p-6 relative overflow-hidden">
                          <h4 className="heading-font text-indigo-400 text-[18px] font-bold mb-3.5 flex items-center gap-2.5">
                            <Microscope size={20} className="text-indigo-400" /> 
                            {isLanguageLesson ? 'دليل تدريب الأذن والنطق (Shadowing & Ear Anatomy)' : 'تشريح الكود (Code Anatomy)'}
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
                  {/* 💻✍️ 6. خانة التطبيق التفاعلي (تركيب الجمل / كتابة الكود) + 3 تلميحات */}
                  {/* ======================================================= */}
                  {activeLesson.codingPractice && activeLesson.codingPractice.taskQuestion && (
                    <div className="mt-12 bg-[#081021] border-2 border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <h3 className="heading-font text-xl md:text-2xl font-bold text-indigo-400 flex items-center gap-2.5">
                          {isLanguageLesson ? <PenTool size={24} /> : <Terminal size={24} />}
                          {isLanguageLesson ? 'ورشة تركيب الجمل والكتابة التفاعلية (جرب بنفسك!)' : 'مختبر كتابة الكود التفاعلي (جرب بنفسك!)'}
                        </h3>
                        <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full font-semibold">
                          تطبيق عملي مدعوم بـ {activeLesson.codingPractice.hints?.length || 3} تلميحات
                        </span>
                      </div>

                      <p className="text-slate-200 text-[16px] mb-5 leading-[1.8] whitespace-pre-wrap">
                        {activeLesson.codingPractice.taskQuestion}
                      </p>

                      <div className="rounded-xl overflow-hidden border border-slate-700/80 mb-5 shadow-inner" dir="ltr">
                        <div className="bg-[#0b1120] px-4 py-2.5 text-xs code-font text-slate-400 border-b border-slate-800 flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <Code size={14} className="text-emerald-400"/> 
                            {isLanguageLesson ? 'Lego Sentence & Writing Workspace' : 'مساحة كتابة الكود الخاصة بك'}
                          </span>
                          <button 
                            type="button"
                            onClick={() => setStudentCode(activeLesson.codingPractice.starterCode || '')}
                            className="text-slate-400 hover:text-white text-[11px]"
                          >
                            إعادة ضبط الخانة
                          </button>
                        </div>
                        <textarea
                          value={studentCode}
                          onChange={(e) => setStudentCode(e.target.value)}
                          rows={6}
                          dir="ltr"
                          placeholder={isLanguageLesson ? "// Write your English sentences here..." : "// اكتب الكود المطلوب هنا..."}
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
                          <Bot size={18} /> {verifyingCode ? 'المعلم الذكي يفحص إجابتك...' : (isLanguageLesson ? 'تحقق من صحة جملك' : 'تحقق من الكود')}
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

                      {/* نتيجة فحص الكود / الجمل */}
                      {codeFeedback && (
                        <div className={`mt-5 p-4 rounded-xl border text-[15px] ${codeFeedback.isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-amber-950/30 border-amber-500/40 text-amber-200'}`}>
                          <p className="leading-[1.8] font-medium">{codeFeedback.feedback}</p>
                        </div>
                      )}

                      {/* الحل النموذجي */}
                      {showSolution && activeLesson.codingPractice.solutionCode && (
                        <div className="mt-5 rounded-xl overflow-hidden border border-emerald-500/30" dir="ltr">
                          <div className="bg-emerald-950/40 px-4 py-2 text-xs text-emerald-300 font-bold flex items-center justify-between">
                            <span>الحل النموذجي (Model Solution)</span>
                            {isLanguageLesson && (
                              <button
                                type="button"
                                onClick={() => handlePlayAudioText(activeLesson.codingPractice.solutionCode, 1.0, 'solution_audio')}
                                className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-200 hover:text-slate-950 px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1"
                              >
                                <Volume2 size={12} /> استمع للحل الصحيح
                              </button>
                            )}
                          </div>
                          <SyntaxHighlighter style={vscDarkPlus} language="javascript" PreTag="div" customStyle={{ margin: 0, padding: '1.25rem', fontSize: '0.9rem', background: '#050811' }}>
                            {activeLesson.codingPractice.solutionCode}
                          </SyntaxHighlighter>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* 🌟 7. سؤال نهاية الدرس الاختياري (غير إجباري + يمنح Bonus EXP) */}
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
            <div className="flex flex-col items-center justify-center h-full py-32 opacity-80 space-y-4">
              <BookOpen size={56} className="text-slate-700 mb-2 animate-bounce" />
              <p className="text-slate-300 text-lg font-bold">لم يتم العثور على دروس من السيرفر حالياً</p>
              <button
                type="button"
                onClick={() => jsonInputRef.current?.click()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <Upload size={16} /> افتح ملف JSON الكراش كورس مباشرة من جهازك
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classroom;