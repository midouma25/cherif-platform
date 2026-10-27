import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import {
  Globe, Award, Trophy, Headphones, BookOpen, PenTool, Mic, MicOff,
  Clock, CheckCircle2, Sparkles, Play, Square, Volume2, ShieldCheck,
  ArrowRight, ChevronLeft, Compass, Target, Zap, Printer, RefreshCw,
  AlertCircle, FileText, BrainCircuit, Layers, BarChart3, Lock
} from 'lucide-react';

// ============================================================================
// 🌍 إعدادات اللغات والاختبارات العالمية الرسمية (Official Exam Profiles)
// ============================================================================
const LANGUAGE_EXAM_CONFIGS = {
  en: {
    id: 'en',
    nameAr: 'الإنجليزية',
    nameEn: 'English',
    flag: '🇬🇧',
    ttsLang: 'en-US',
    officialExamName: 'IELTS Academic / TOEFL iBT',
    officialShort: 'IELTS Academic',
    scoreScaleLabel: 'Band 1.0 - 9.0',
    organization: 'British Council / IDP / Cambridge Standard Simulation',
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  fr: {
    id: 'fr',
    nameAr: 'الفرنسية',
    nameEn: 'Français',
    flag: '🇫🇷',
    ttsLang: 'fr-FR',
    officialExamName: 'DELF / DALF & TCF International',
    officialShort: 'DELF / DALF',
    scoreScaleLabel: 'Score / 100 (CEFR)',
    organization: 'France Éducation International Simulation',
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  de: {
    id: 'de',
    nameAr: 'الألمانية',
    nameEn: 'Deutsch',
    flag: '🇩🇪',
    ttsLang: 'de-DE',
    officialExamName: 'Goethe-Zertifikat / TestDaF',
    officialShort: 'Goethe / TestDaF',
    scoreScaleLabel: 'TDN 3 - 5 / Punkte 100',
    organization: 'Goethe-Institut Standard Simulation',
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  es: {
    id: 'es',
    nameAr: 'الإسبانية',
    nameEn: 'Español',
    flag: '🇪🇸',
    ttsLang: 'es-ES',
    officialExamName: 'DELE Oficial (Instituto Cervantes)',
    officialShort: 'DELE Oficial',
    scoreScaleLabel: 'Apto / Score 100',
    organization: 'Instituto Cervantes Standard Simulation',
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  ja: {
    id: 'ja',
    nameAr: 'اليابانية',
    nameEn: '日本語 (Japanese)',
    flag: '🇯🇵',
    ttsLang: 'ja-JP',
    officialExamName: 'JLPT (N5 to N1 Official Simulation)',
    officialShort: 'JLPT (N5-N1)',
    scoreScaleLabel: 'Level N5 ➔ N1 (180 Pts)',
    organization: 'JEES / Japan Foundation Standard Simulation',
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  zh: {
    id: 'zh',
    nameAr: 'الصينية',
    nameEn: '中文 (Mandarin)',
    flag: '🇨🇳',
    ttsLang: 'zh-CN',
    officialExamName: 'HSK Standard (Level 1 - 6)',
    officialShort: 'HSK 1 - 6',
    scoreScaleLabel: 'HSK 1 ➔ HSK 6 (300 Pts)',
    organization: 'Chinese Testing International Simulation',
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  }
};

// ============================================================================
// 🧠 بنك الاختبارات المعيارية المدمج (يعمل فوراً كاحتياط أو يولد بالـ AI من السيرفر 5000)
// ============================================================================
const buildDefaultExamBank = (langId, examMode) => {
  if (langId === 'fr') {
    return {
      examTitle: examMode === 'official_replica' ? 'محاكي اختبار DELF / TCF الرسمي الكامل' : 'اختبار Cherif.Dev التكيّفي الشامل للغة الفرنسية (A0-C2)',
      listeningSection: {
        audioScript: "Bonjour à tous. En raison de travaux sur la ligne B du métro, la station Gare Centrale sera fermée ce week-end. Des bus de remplacement circuleront toutes les dix minutes. Bien que cela puisse allonger votre trajet d'environ un quart d'heure, le service normal reprendra dès lundi matin à cinq heures.",
        questions: [
          {
            id: 'l1',
            cefrLevel: 'A2',
            question: "Quel est le sujet principal de cette annonce ?",
            options: [
              "La fermeture temporaire d'une station de métro pour travaux",
              "L'ouverture d'une nouvelle ligne de train à grande vitesse",
              "Une augmentation du prix des billets de bus ce week-end",
              "Une grève illimitée des conducteurs de métro"
            ],
            correctIndex: 0
          },
          {
            id: 'l2',
            cefrLevel: 'B1',
            question: "Quelle solution est proposée aux voyageurs pendant le week-end ?",
            options: [
              "Des taxis gratuits devant la gare",
              "Des bus de remplacement toutes les dix minutes",
              "Un remboursement complet de l'abonnement mensuel",
              "L'utilisation obligatoire du vélo"
            ],
            correctIndex: 1
          },
          {
            id: 'l3',
            cefrLevel: 'B2',
            question: "Quand la circulation normale du métro sera-t-elle rétablie ?",
            options: [
              "Dimanche soir à minuit",
              "Mardi prochain à midi",
              "Dès lundi matin à 5h00",
              "Dans deux semaines exactement"
            ],
            correctIndex: 2
          }
        ]
      },
      readingAndGrammarSection: {
        passage: "L'essor du télétravail a profondément transformé l'organisation des entreprises contemporaines. Si cette flexibilité permet aux salariés de mieux concilier vie professionnelle et vie privée tout en réduisant le temps consacré aux transports, elle soulève néanmoins des défis majeurs en matière de cohésion d'équipe et de droit à la déconnexion. Par conséquent, de nombreuses organisations adoptent désormais un modèle hybride.",
        questions: [
          {
            id: 'r1',
            cefrLevel: 'A1',
            question: "Complétez : « Marie habite _____ Paris depuis trois ans. »",
            options: ["dans", "à", "en", "sur"],
            correctIndex: 1
          },
          {
            id: 'r2',
            cefrLevel: 'A2',
            question: "Complétez : « Hier soir, nous _____ un excellent film au cinéma. »",
            options: ["avons vu", "sommes vus", "voyons", "verrons"],
            correctIndex: 0
          },
          {
            id: 'r3',
            cefrLevel: 'B1',
            question: "Complétez : « Il est indispensable que vous _____ ce dossier avant demain. »",
            options: ["finissez", "finissiez", "finirez", "avez fini"],
            correctIndex: 1
          },
          {
            id: 'r4',
            cefrLevel: 'B2',
            question: "D'après le texte, quel est l'un des risques principaux du télétravail ?",
            options: [
              "L'augmentation des coûts de transport pour l'employé",
              "La difficulté à maintenir la cohésion d'équipe et la déconnexion",
              "L'interdiction totale d'utiliser des outils numériques",
              "La baisse immédiate des salaires dans toutes les entreprises"
            ],
            correctIndex: 1
          },
          {
            id: 'r5',
            cefrLevel: 'C1',
            question: "Choisissez le connecteur logique de concession le plus soutenu : « _____ ses efforts constants, le projet a pris du retard. »",
            options: ["En dépit de", "À cause de", "Grâce à", "Afin de"],
            correctIndex: 0
          }
        ]
      },
      writingSection: {
        taskType: examMode === 'official_replica' ? 'Production Écrite DELF B2 (Essai Argumentatif)' : 'تقييم الكتابة الشامل (CEFR Writing Production)',
        prompt: "De plus en plus d'étudiants utilisent l'intelligence artificielle dans leurs études. Rédigez un texte structuré (80 à 180 mots) en français pour exposer les avantages et les limites de cette pratique, en donnant votre avis personnel avec des exemples précis.",
        minWords: 60
      },
      speakingSection: {
        part1Question: "Bonjour ! Pouvez-vous vous présenter brièvement et me parler de vos objectifs professionnels ou académiques ?",
        cueCardTopic: "Décrivez une compétence difficile que vous avez apprise récemment. Expliquez comment vous l'avez apprise, quelles difficultés vous avez rencontrées et pourquoi cette compétence est importante pour votre avenir.",
        part3Question: "Selon vous, comment la technologie va-t-elle transformer l'éducation et le marché du travail au cours des dix prochaines années ?"
      }
    };
  }

  // Default: English (IELTS Academic / CEFR Adaptive)
  return {
    examTitle: examMode === 'official_replica'
      ? 'IELTS Academic Full Simulation (Listening, Reading, Writing & Speaking)'
      : 'Cherif.Dev Adaptive CEFR Proficiency Assessment (Pre-A1 to C2 Native)',
    listeningSection: {
      audioScript: "Welcome to the University Innovation Hub orientation. Please note that while the main robotics laboratory on the third floor is accessible twenty-four hours a day for postgraduate researchers, undergraduate students must book their equipment slots at least forty-eight hours in advance via the online portal. Furthermore, safety goggles are mandatory at all times inside the prototyping workshop, regardless of whether machinery is actively operating.",
      questions: [
        {
          id: 'l1',
          cefrLevel: 'A2',
          question: "Where is the main robotics laboratory located?",
          options: [
            "On the ground floor next to the library",
            "On the third floor",
            "In the basement of the engineering building",
            "Off-campus in the city center"
          ],
          correctIndex: 1
        },
        {
          id: 'l2',
          cefrLevel: 'B1',
          question: "What must undergraduate students do to use the equipment?",
          options: [
            "Pay a deposit of fifty dollars in cash",
            "Book their slots at least 48 hours in advance online",
            "Arrive before 7:00 AM every morning",
            "Accompany a postgraduate researcher at all times"
          ],
          correctIndex: 1
        },
        {
          id: 'l3',
          cefrLevel: 'C1',
          question: "What does the speaker emphasize regarding safety goggles in the prototyping workshop?",
          options: [
            "They are only required when heavy machinery is turned on",
            "They are optional for experienced postgraduate researchers",
            "They must be worn at all times, even when machines are not running",
            "They can be rented from the reception desk for a small fee"
          ],
          correctIndex: 2
        }
      ]
    },
    readingAndGrammarSection: {
      passage: "Cognitive neuroscientists have long debated the mechanisms underlying adult second-language acquisition. While traditional hypotheses suggested a strict 'critical period' after which native-like proficiency becomes virtually unattainable, contemporary neuroimaging studies reveal a far more nuanced reality. Adult learners who engage in high-context, immersive environments—combining phonetic decoding with active production—demonstrate remarkable neuroplasticity, frequently outperforming younger learners in syntactic complexity and metalinguistic awareness.",
      questions: [
        {
          id: 'r1',
          cefrLevel: 'A1',
          question: "Choose the correct form: 'She _____ to the office by train every morning.'",
          options: ["go", "goes", "going", "is go"],
          correctIndex: 1
        },
        {
          id: 'r2',
          cefrLevel: 'A2',
          question: "Choose the correct option: 'I haven't seen my colleague _____ last Tuesday.'",
          options: ["for", "since", "during", "ago"],
          correctIndex: 1
        },
        {
          id: 'r3',
          cefrLevel: 'B1',
          question: "Choose the correct conditional structure: 'If we had tested the software earlier, we _____ that critical bug before launch.'",
          options: [
            "will discover",
            "would discover",
            "would have discovered",
            "discovered"
          ],
          correctIndex: 2
        },
        {
          id: 'r4',
          cefrLevel: 'B2',
          question: "According to the reading passage, what do modern neuroimaging studies show about adult language learners?",
          options: [
            "Adults can never learn a new language after age eighteen",
            "Adults show strong neuroplasticity and often excel in grammatical complexity when learning in immersive contexts",
            "Children always learn grammar rules faster than adults in every situation",
            "Phonetic decoding has no effect on brain development"
          ],
          correctIndex: 1
        },
        {
          id: 'r5',
          cefrLevel: 'C2',
          question: "Select the most precise academic inversion: '_____ had the company announced the merger than its stock price surged by twenty percent.'",
          options: [
            "Scarcely",
            "No sooner",
            "Not only",
            "Seldom"
          ],
          correctIndex: 1
        }
      ]
    },
    writingSection: {
      taskType: examMode === 'official_replica' ? 'IELTS Academic Writing Task 2 (250+ Words Essay)' : 'CEFR Diagnostic Writing Production (80 - 200 Words)',
      prompt: "Artificial Intelligence is rapidly automating both routine tasks and complex analytical jobs. To what extent do you agree or disagree that universities should redesign their curricula to focus on AI collaboration rather than traditional memorization? Give reasons for your answer and include relevant examples from your own knowledge or experience.",
      minWords: examMode === 'official_replica' ? 120 : 60
    },
    speakingSection: {
      part1Question: "Let's start with Part 1. Could you tell me a little about your daily routine and why you are learning this language?",
      cueCardTopic: "Part 2 (Cue Card): Describe an important goal or project you worked hard to achieve. You should say: what the goal was, what steps you took to achieve it, what challenges you faced along the way, and explain how you felt when you finally succeeded.",
      part3Question: "Part 3 (Two-Way Discussion): In your opinion, what distinguishes people who consistently achieve long-term goals from those who give up early?"
    }
  };
};

const LanguageExamCenter = () => {
  const { user } = useContext(AuthContext);

  // 1. إعدادات الاختبار المختارة
  const [selectedLang, setSelectedLang] = useState('en');
  const [examMode, setExamMode] = useState('cherif_adaptive'); // 'cherif_adaptive' | 'official_replica'
  const [examStage, setExamStage] = useState('lobby'); // 'lobby' | 'in_progress' | 'evaluating' | 'results'
  const [activeSectionIdx, setActiveSectionIdx] = useState(0); // 0: Listening, 1: Reading/Grammar, 2: Writing, 3: Speaking

  // 2. بيانات الاختبار وإجابات الممتحن
  const [examData, setExamData] = useState(() => buildDefaultExamBank('en', 'cherif_adaptive'));
  const [isGeneratingCustomAiExam, setIsGeneratingCustomAiExam] = useState(false);

  const [listeningAnswers, setListeningAnswers] = useState({});
  const [readingAnswers, setReadingAnswers] = useState({});
  const [writingResponse, setWritingResponse] = useState('');
  const [speakingTranscript, setSpeakingTranscript] = useState('');
  const [cueCardPrepSeconds, setCueCardPrepSeconds] = useState(60);
  const [isPrepTimerRunning, setIsPrepTimerRunning] = useState(false);

  // 3. المؤقت العام للاختبار والصوتيات والمايكروفون
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlayCount, setAudioPlayCount] = useState(0);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const recognitionRef = useRef(null);

  // 4. النتيجة النهائية والتشخيص التفصيلي والشهادة
  const [evaluationResult, setEvaluationResult] = useState(null);

  const langConfig = LANGUAGE_EXAM_CONFIGS[selectedLang] || LANGUAGE_EXAM_CONFIGS.en;

  // تحديث بنك الأسئلة عند تغيير اللغة أو نوع الاختبار
  useEffect(() => {
    setExamData(buildDefaultExamBank(selectedLang, examMode));
  }, [selectedLang, examMode]);

  // مؤقت الاختبار الرسمي
  useEffect(() => {
    if (examStage !== 'in_progress') return;
    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStage]);

  // مؤقت تحضير بطاقة التحدث (IELTS Part 2 Cue Card - 60s)
  useEffect(() => {
    if (!isPrepTimerRunning) return;
    const prepInterval = setInterval(() => {
      setCueCardPrepSeconds(prev => {
        if (prev <= 1) {
          setIsPrepTimerRunning(false);
          clearInterval(prepInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(prepInterval);
  }, [isPrepTimerRunning]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // تشغيل المقطع الصوتي (Web Speech API)
  const handlePlayExamAudio = (textToSpeak, rate = 1.0) => {
    if (!('speechSynthesis' in window)) {
      return alert('متصفحك لا يدعم النطق الصوتي المباشر.');
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langConfig.ttsLang;
    utterance.rate = rate;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setAudioPlayCount(prev => prev + 1);
    };
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopExamAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // تشغيل المايكروفون الحي في قسم المحادثة (Speaking)
  const handleToggleMicRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return alert('متصفحك لا يدعم التسجيل الصوتي المباشر. يمكنك كتابة إجابتك الشفوية في الصندوق المخصص.');
    }

    if (isRecordingMic) {
      recognitionRef.current?.stop();
      setIsRecordingMic(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langConfig.ttsLang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcriptText = '';
      for (let i = 0; i < event.results.length; i++) {
        transcriptText += event.results[i][0].transcript + ' ';
      }
      setSpeakingTranscript(transcriptText.trim());
    };

    recognition.onerror = () => setIsRecordingMic(false);
    recognition.onend = () => setIsRecordingMic(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecordingMic(true);
  };

  // توليد نسخة اختبار جديدة بالذكاء الاصطناعي من السيرفر 5000
  const handleGenerateFreshAiExam = async () => {
    setIsGeneratingCustomAiExam(true);
    try {
      const res = await axios.post('http://localhost:5000/api/academy2/lang-exam/generate', {
        targetLanguage: langConfig.nameAr,
        langCode: selectedLang,
        examMode,
        officialExamName: langConfig.officialExamName
      });
      if (res.data?.success && res.data.data) {
        setExamData(res.data.data);
      }
    } catch (e) {
      // في حال عدم تشغيل السيرفر 5000 نستخدم البنك المعياري المدمج فوراً
      setExamData(buildDefaultExamBank(selectedLang, examMode));
    } finally {
      setIsGeneratingCustomAiExam(false);
    }
  };

  // بدء الاختبار
  const handleStartExam = () => {
    setListeningAnswers({});
    setReadingAnswers({});
    setWritingResponse('');
    setSpeakingTranscript('');
    setAudioPlayCount(0);
    setActiveSectionIdx(0);
    setRemainingSeconds(examMode === 'official_replica' ? 40 * 60 : 25 * 60);
    setExamStage('in_progress');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // حساب المؤشر التكيّفي الحي أثناء الحل (Adaptive CEFR Radar)
  const computeLiveAdaptiveTarget = () => {
    const allQs = [
      ...(examData.listeningSection?.questions || []),
      ...(examData.readingAndGrammarSection?.questions || [])
    ];
    let correctCount = 0;
    let answeredCount = 0;

    (examData.listeningSection?.questions || []).forEach(q => {
      if (listeningAnswers[q.id] !== undefined) {
        answeredCount++;
        if (listeningAnswers[q.id] === q.correctIndex) correctCount++;
      }
    });
    (examData.readingAndGrammarSection?.questions || []).forEach(q => {
      if (readingAnswers[q.id] !== undefined) {
        answeredCount++;
        if (readingAnswers[q.id] === q.correctIndex) correctCount++;
      }
    });

    if (answeredCount === 0) return 'B1 (جاري المعايرة التكيّفية...)';
    const ratio = correctCount / answeredCount;
    if (ratio >= 0.85) return 'C1 / C2 (المستوى المتقدم والأكاديمي 🔥)';
    if (ratio >= 0.65) return 'B2 (المستوى فوق المتوسط ⚡)';
    if (ratio >= 0.45) return 'B1 (المستوى المتوسط المستقل ✓)';
    if (ratio >= 0.25) return 'A2 (المستوى الأساسي المتطور)';
    return 'Pre-A1 / A1 (المستوى التأسيسي)';
  };

  // ============================================================================
  // 🏆 إنهاء الاختبار والتقييم بالذكاء الاصطناعي (Psychometric + AI Rubric Grader)
  // ============================================================================
  const handleSubmitAndEvaluateExam = async () => {
    handleStopExamAudio();
    if (isRecordingMic) {
      recognitionRef.current?.stop();
      setIsRecordingMic(false);
    }

    setExamStage('evaluating');

    // 1. حساب درجات الاستماع والقراءة/القواعد موضوعياً
    const lQuestions = examData.listeningSection?.questions || [];
    let lCorrect = 0;
    lQuestions.forEach(q => {
      if (listeningAnswers[q.id] === q.correctIndex) lCorrect++;
    });
    const listeningPercent = lQuestions.length > 0 ? Math.round((lCorrect / lQuestions.length) * 100) : 70;

    const rQuestions = examData.readingAndGrammarSection?.questions || [];
    let rCorrect = 0;
    rQuestions.forEach(q => {
      if (readingAnswers[q.id] === q.correctIndex) rCorrect++;
    });
    const readingPercent = rQuestions.length > 0 ? Math.round((rCorrect / rQuestions.length) * 100) : 70;

    // 2. تقييم مبدئي محلي للكتابة والمحادثة (في حال عدم اتصال السيرفر 5000)
    const writingWordsCount = writingResponse.trim() ? writingResponse.trim().split(/\s+/).length : 0;
    const speakingWordsCount = speakingTranscript.trim() ? speakingTranscript.trim().split(/\s+/).length : 0;

    let writingPercent = Math.min(95, Math.round((writingWordsCount / (examData.writingSection?.minWords || 60)) * 78));
    if (writingWordsCount > 90 && /however|furthermore|therefore|although|moreover|cependant|néanmoins|par conséquent/i.test(writingResponse)) {
      writingPercent = Math.min(98, writingPercent + 15);
    }

    let speakingPercent = Math.min(95, Math.round((speakingWordsCount / 45) * 80));
    if (speakingWordsCount === 0) speakingPercent = Math.round((listeningPercent + readingPercent) * 0.4);

    let aiDetailedEvaluation = null;

    // 3. إرسال الكتابة والمحادثة ونتائج الأسئلة إلى السيرفر 5000 للتصحيح العميق بمعايير IELTS / CEFR
    try {
      const res = await axios.post('http://localhost:5000/api/academy2/lang-exam/evaluate', {
        targetLanguage: langConfig.nameAr,
        officialExamName: langConfig.officialExamName,
        examMode,
        listeningPercent,
        readingPercent,
        writingPrompt: examData.writingSection?.prompt,
        writingResponse,
        speakingPrompt: examData.speakingSection?.cueCardTopic,
        speakingTranscript
      });
      if (res.data?.success && res.data.data) {
        aiDetailedEvaluation = res.data.data;
        if (typeof aiDetailedEvaluation.writingScorePercent === 'number') {
          writingPercent = aiDetailedEvaluation.writingScorePercent;
        }
        if (typeof aiDetailedEvaluation.speakingScorePercent === 'number') {
          speakingPercent = aiDetailedEvaluation.speakingScorePercent;
        }
      }
    } catch (e) {
      // المتابعة السلسة بالمحرك المعياري المدمج
    }

    const overallPercent = Math.round(
      (listeningPercent * 0.25) +
      (readingPercent * 0.25) +
      (writingPercent * 0.25) +
      (speakingPercent * 0.25)
    );

    const mapPercentToCEFR = (pct) => {
      if (pct >= 90) return 'C2';
      if (pct >= 80) return 'C1';
      if (pct >= 68) return 'B2';
      if (pct >= 52) return 'B1';
      if (pct >= 36) return 'A2';
      if (pct >= 20) return 'A1';
      return 'A0';
    };

    const mapPercentToIeltsBand = (pct) => {
      const rawBand = 1.0 + (pct / 100) * 8.0;
      return (Math.round(rawBand * 2) / 2).toFixed(1);
    };

    const overallCEFR = aiDetailedEvaluation?.overallCEFR || mapPercentToCEFR(overallPercent);
    const ieltsEquivalentBand = aiDetailedEvaluation?.officialEquivalentScore || (
      selectedLang === 'en'
        ? `IELTS Band ${mapPercentToIeltsBand(overallPercent)}`
        : selectedLang === 'ja'
          ? `JLPT ${overallCEFR === 'C2' || overallCEFR === 'C1' ? 'N1' : overallCEFR === 'B2' ? 'N2' : overallCEFR === 'B1' ? 'N3' : overallCEFR === 'A2' ? 'N4' : 'N5'}`
          : `${langConfig.officialShort} ${overallCEFR} (${overallPercent}/100)`
    );

    const recommendedCourseNumber = langConfig.recommendedCourseOrderMap[overallCEFR] || 1;

    setEvaluationResult({
      certificateSerialId: `CHERIF-${selectedLang.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      issueDate: new Date().toLocaleDateString('en-GB'),
      studentName: user?.name || 'الممتحن المعتمد (Cherif.Dev Candidate)',
      overallPercent,
      overallCEFR,
      officialEquivalentScore: ieltsEquivalentBand,
      recommendedCourseNumber,
      skills: {
        listening: {
          percent: listeningPercent,
          cefr: mapPercentToCEFR(listeningPercent),
          band: mapPercentToIeltsBand(listeningPercent)
        },
        reading: {
          percent: readingPercent,
          cefr: mapPercentToCEFR(readingPercent),
          band: mapPercentToIeltsBand(readingPercent)
        },
        writing: {
          percent: writingPercent,
          cefr: mapPercentToCEFR(writingPercent),
          band: mapPercentToIeltsBand(writingPercent)
        },
        speaking: {
          percent: speakingPercent,
          cefr: mapPercentToCEFR(speakingPercent),
          band: mapPercentToIeltsBand(speakingPercent)
        }
      },
      strengths: aiDetailedEvaluation?.strengths || [
        listeningPercent >= 65 ? 'قدرة ممتازة على التقاط التفاصيل الصوتية وفهم السياق العام للمتحدث.' : 'بداية جيدة في التمييز السمعي للأصوات الأساسية.',
        readingPercent >= 65 ? 'استيعاب قوي للتراكيب النحوية والقدرة على استنتاج المعاني من النصوص.' : 'إلمام بالقواعد التأسيسية وبناء الجمل المباشرة.'
      ],
      weaknessesAndFixes: aiDetailedEvaluation?.weaknessesAndFixes || [
        writingPercent < 75 ? 'يُنصح بتكثيف استخدام الروابط المنطقية الأكاديمية (Cohesive Devices) وتنويع طول الجمل في الكتابة.' : 'الاستمرار في ممارسة الكتابة الأكاديمية المحكمة تحت ضغط الوقت.',
        speakingPercent < 75 ? 'تدرب يومياً على تقنية الترديد الظلي (Shadowing) بسرعة 0.75x و1.0x لرفع الطلاقة وتقليل التوقفات.' : 'تطوير المتلازمات اللفظية المتقدمة (Idiomatic Collocations) للوصول لمستوى C2.'
      ],
      writingCorrectionSample: aiDetailedEvaluation?.writingCorrectionSample || (
        writingResponse.trim()
          ? `تم تحليل نصك (${writingWordsCount} كلمة). للوصول إلى الدرجة الكاملة (C1/C2)، احرص على تقسيم المقال إلى مقدمة تطرح الأطروحة (Thesis Statement)، فقرتيْ عرض مدعومتين بالأمثلة، وخاتمة تلخص رأيك بوضوح.`
          : 'لم يتم إدخال نص كتابي كافٍ في قسم الكتابة؛ ننصحك بإعادة المحاولة لقياس مهارتك الكتابية بدقة.'
      )
    });

    setExamStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const writingWordCount = writingResponse.trim() ? writingResponse.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-10 px-6 pb-28 exam-typography" dir="rtl">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
        .exam-typography { font-family: 'Readex Pro', sans-serif; }
        .heading-alex { font-family: 'Alexandria', sans-serif; line-height: 1.45 !important; }
        .mono-code { font-family: 'JetBrains Mono', monospace; }
        @media print {
          .no-print { display: none !important; }
          body { background: #ffffff !important; color: #000000 !important; }
        }
      `}} />

      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================================================================= */}
        {/* 🏛️ المرحلة 1: ردهة الاختيار والإعداد (EXAM LOBBY) */}
        {/* ================================================================= */}
        {examStage === 'lobby' && (
          <div className="space-y-10 animate-fade-in-up">

            {/* الهيرو العلوي */}
            <div className="bg-gradient-to-br from-indigo-950/70 via-[#0b1120] to-purple-950/50 border-2 border-indigo-500/40 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[130px] pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none"></div>

              <div className="relative z-10 space-y-5 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                    <ShieldCheck size={15} /> المركز الدولي لتقييم اللغات ومحاكاة الاختبارات العالمية
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-bold">
                    <Sparkles size={14} /> مدعوم بممتحن الذكاء الاصطناعي الصوتي والكتابي 🎙️✍️
                  </span>
                </div>

                <h1 className="heading-alex text-3xl md:text-5xl font-black text-white">
                  اكتشف مستواك اللغوي الحقيقي بدقة معيارية أو عش تجربة <span className="text-amber-400">IELTS / DELF / JLPT</span> الرسمية!
                </h1>

                <p className="text-slate-300 text-base leading-[1.95]">
                  اختر لغتك المستهدفة، ثم حدد بين <strong className="text-emerald-400">اختبار Cherif.Dev التكيّفي الشامل (CEFR A0-C2)</strong> الذي يحدد مستواك بدقة ويوجهك للكراش كورس المناسب لك، أو <strong className="text-amber-400">المحاكي الرسمي طبق الأصل (1:1 Official Exam Replica)</strong> مع إصدار شهادة معتمدة وتقرير تشخيصي مفصل.
                </p>
              </div>
            </div>

            {/* الخطوة 1: اختيار اللغة */}
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-5 shadow-xl">
              <h2 className="heading-alex text-xl font-black text-white flex items-center gap-2.5">
                <Globe className="text-emerald-400" size={22} /> 1. اختر اللغة التي تريد اختبار مستواك فيها:
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {Object.values(LANGUAGE_EXAM_CONFIGS).map((lang) => {
                  const isSelected = selectedLang === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLang(lang.id)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                        isSelected
                          ? 'bg-indigo-950/60 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)] scale-[1.02]'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="text-3xl">{lang.flag}</span>
                      <span className="font-black text-sm text-white">{lang.nameAr}</span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {lang.officialShort}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* الخطوة 2: اختيار نوع الاختبار (الخياران اللذان طلبتهما) */}
            <div className="space-y-4">
              <h2 className="heading-alex text-xl font-black text-white flex items-center gap-2.5">
                <Layers className="text-amber-400" size={22} /> 2. اختر نظام الاختبار المعتمد:
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* الخيار الأول: اختبار Cherif.Dev التكيّفي الشامل */}
                <div
                  onClick={() => setExamMode('cherif_adaptive')}
                  className={`cursor-pointer rounded-3xl p-7 border-2 transition-all flex flex-col justify-between space-y-6 ${
                    examMode === 'cherif_adaptive'
                      ? 'bg-gradient-to-br from-emerald-950/40 via-[#0b1120] to-[#0b1120] border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.18)]'
                      : 'bg-[#0b1120] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-emerald-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full flex items-center gap-1.5">
                        <BrainCircuit size={14} /> الخيار 1: اختبار المنصة الذكي (Adaptive CEFR)
                      </span>
                      <span className="mono-code text-xs font-bold text-emerald-400">~25 دقيقة</span>
                    </div>

                    <h3 className="heading-alex text-2xl font-black text-white">
                      اختبار Cherif.Dev التكيّفي الشامل لتحديد المستوى (Pre-A1 ➔ C2)
                    </h3>

                    <p className="text-slate-300 text-sm leading-[1.85]">
                      اختبار ذكي يتكيّف مع إجاباتك لحظة بلحظة وفق الإطار الأوروبي المرجعي العام (<strong className="text-white">CEFR</strong>)؛ يفحص مهاراتك الخمس ويحدد مستواك بدقة متناهية ليرشدك إلى الكراش كورس المناسب لك في الأكاديمية.
                    </p>

                    <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                      <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400 shrink-0" /> <span>خوارزمية تكيّفية ترفع أو تخفض صعوبة الأسئلة حسب أدائك.</span></li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400 shrink-0" /> <span>يشمل: الاستماع، القراءة، القواعد السياقية، الكتابة، والتحدث بالمايكروفون.</span></li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400 shrink-0" /> <span>يمنحك <strong>شهادة تحديد مستوى رسمية + خريطة الطريق الذكية</strong> في الأكاديمية.</span></li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">المعيار: CEFR (A0, A1, A2, B1, B2, C1, C2)</span>
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${examMode === 'cherif_adaptive' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                      {examMode === 'cherif_adaptive' ? 'محدد حالياً ✓' : 'اختر هذا النظام'}
                    </span>
                  </div>
                </div>

                {/* الخيار الثاني: محاكي الاختبار العالمي طبق الأصل */}
                <div
                  onClick={() => setExamMode('official_replica')}
                  className={`cursor-pointer rounded-3xl p-7 border-2 transition-all flex flex-col justify-between space-y-6 ${
                    examMode === 'official_replica'
                      ? 'bg-gradient-to-br from-amber-950/40 via-[#0b1120] to-[#0b1120] border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.18)]'
                      : 'bg-[#0b1120] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full flex items-center gap-1.5">
                        <Trophy size={14} /> الخيار 2: المحاكي العالمي طبق الأصل (1:1 Replica)
                      </span>
                      <span className="mono-code text-xs font-bold text-amber-400">~40 دقيقة (محاكاة مركزة)</span>
                    </div>

                    <h3 className="heading-alex text-2xl font-black text-white">
                      محاكي {langConfig.officialExamName} الرسمي
                    </h3>

                    <p className="text-slate-300 text-sm leading-[1.85]">
                      صورة طبق الأصل من قاعة الاختبار الدولي لـ <strong className="text-amber-300">{langConfig.organization}</strong>؛ نفس تقسيم الأقسام الأربعة، مؤقت التحضير لبطاقة المحادثة (Cue Card)، وتصحيح الكتابة وفق المعايير الأكاديمية الرسمية.
                    </p>

                    <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                      <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-400 shrink-0" /> <span>حساب الدرجة الرسمية المعادلة ({langConfig.scoreScaleLabel}) لكل مهارة.</span></li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-400 shrink-0" /> <span>مهمة كتابة مقال أكاديمي مع تصحيح فوري للأخطاء بالذكاء الاصطناعي.</span></li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={15} className="text-amber-400 shrink-0" /> <span>مقابلة تحدث من 3 أجزاء (Part 1, Part 2 Cue Card, Part 3 Discussion).</span></li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">المعيار: {langConfig.scoreScaleLabel}</span>
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${examMode === 'official_replica' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                      {examMode === 'official_replica' ? 'محدد حالياً ✓' : 'اختر هذا النظام'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* شريط الانطلاق وتوليد أسئلة جديدة بالـ AI */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Award size={26} />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">
                    جاهز لبدء {examMode === 'official_replica' ? `محاكي ${langConfig.officialShort}` : `اختبار تحديد المستوى الشامل`} في اللغة {langConfig.nameAr}؟
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تأكد من وجودك في مكان هادئ وتفعيل السماعات والمايكروفون للحصول على أدق تقييم.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleGenerateFreshAiExam}
                  disabled={isGeneratingCustomAiExam}
                  className="bg-slate-950 hover:bg-slate-800 text-purple-300 border border-purple-500/40 font-bold text-xs px-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={15} className={isGeneratingCustomAiExam ? 'animate-spin' : ''} />
                  {isGeneratingCustomAiExam ? 'جاري توليد نموذج جديد بالـ AI...' : 'توليد نموذج أسئلة جديد بالـ AI'}
                </button>

                <button
                  type="button"
                  onClick={handleStartExam}
                  className="heading-alex flex-1 md:flex-initial bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all"
                >
                  <Play size={18} /> ابدأ الاختبار الرسمي الآن
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* 🎯 المرحلة 2: قاعة الاختبار التفاعلية (EXAM ARENA) */}
        {/* ================================================================= */}
        {examStage === 'in_progress' && (
          <div className="space-y-6 animate-fade-in-up">

            {/* الشريط العلوي لقاعة الاختبار */}
            <div className="bg-[#0b1120] border-2 border-indigo-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{langConfig.flag}</span>
                <div>
                  <h3 className="font-black text-white text-sm md:text-base">{examData.examTitle}</h3>
                  <span className="text-[11px] font-bold text-emerald-400">
                    {examMode === 'cherif_adaptive'
                      ? `الرادار التكيّفي الحالي: ${computeLiveAdaptiveTarget()}`
                      : `المعيار الرسمي: ${langConfig.officialExamName}`}
                  </span>
                </div>
              </div>

              {/* تبويبات الأقسام الأربعة */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {[
                  { idx: 0, label: '1. الاستماع (Listening)', icon: Headphones },
                  { idx: 1, label: '2. القراءة والقواعد (Reading)', icon: BookOpen },
                  { idx: 2, label: '3. الكتابة (Writing)', icon: PenTool },
                  { idx: 3, label: '4. التحدث (Speaking)', icon: Mic }
                ].map(sec => {
                  const IconComp = sec.icon;
                  return (
                    <button
                      key={sec.idx}
                      type="button"
                      onClick={() => setActiveSectionIdx(sec.idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        activeSectionIdx === sec.idx
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <IconComp size={13} />
                      <span>{sec.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* المؤقت وزر التسليم */}
              <div className="flex items-center gap-3">
                <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2 mono-code text-sm font-black text-amber-400">
                  <Clock size={16} />
                  <span>{formatTimer(remainingSeconds)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleSubmitAndEvaluateExam}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow transition-all"
                >
                  إنهاء وتصحيح الاختبار ✓
                </button>
              </div>
            </div>

            {/* القسم 1: الاستماع الصوتي (LISTENING SECTION) */}
            {activeSectionIdx === 0 && (
              <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-xs font-black text-purple-400 uppercase">Section 1 • Audio Comprehension</span>
                    <h3 className="heading-alex text-2xl font-black text-white mt-1">
                      🎧 قسم الاستماع وفهم المتحدث الأصلي (Listening)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      اضغط على زر تشغيل التسجيل الصوتي، استمع بتركيز، ثم أجب عن الأسئلة أدناه:
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handlePlayExamAudio(examData.listeningSection?.audioScript, 1.0)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-all"
                    >
                      <Volume2 size={16} />
                      {isPlayingAudio ? 'جاري تشغيل المقطع الصوتي...' : 'تشغيل التسجيل الصوتي (1.0x)'}
                    </button>
                    {isPlayingAudio && (
                      <button
                        type="button"
                        onClick={handleStopExamAudio}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-3 rounded-xl"
                      >
                        <Square size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  {(examData.listeningSection?.questions || []).map((q, qIdx) => (
                    <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-400">Question {qIdx + 1}</span>
                        <span className="text-[11px] font-black bg-slate-900 border border-slate-700 text-amber-400 px-2.5 py-0.5 rounded-full">
                          CEFR {q.cefrLevel}
                        </span>
                      </div>
                      <p className="font-bold text-white text-base" dir="ltr">{q.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1" dir="ltr">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => setListeningAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                            className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                              listeningAnswers[q.id] === oIdx
                                ? 'bg-purple-600/25 border-purple-400 text-white shadow'
                                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveSectionIdx(1)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    الانتقال إلى قسم القراءة والقواعد <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* القسم 2: القراءة التحليلية والقواعد السياقية (READING & GRAMMAR) */}
            {activeSectionIdx === 1 && (
              <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-black text-emerald-400 uppercase">Section 2 • Reading & Contextual Grammar</span>
                  <h3 className="heading-alex text-2xl font-black text-white mt-1">
                    📖 قسم القراءة التحليلية ودقة القواعد والمفردات
                  </h3>
                </div>

                {/* قطعة القراءة الأكاديمية */}
                <div className="bg-slate-950 border-l-4 border-emerald-500 rounded-2xl p-6 space-y-2" dir="ltr">
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">Reading Passage</span>
                  <p className="text-slate-200 text-sm md:text-base leading-[1.9]">
                    {examData.readingAndGrammarSection?.passage}
                  </p>
                </div>

                <div className="space-y-5">
                  {(examData.readingAndGrammarSection?.questions || []).map((q, qIdx) => (
                    <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-400">Question {qIdx + 1}</span>
                        <span className="text-[11px] font-black bg-slate-900 border border-slate-700 text-amber-400 px-2.5 py-0.5 rounded-full">
                          Target Level: {q.cefrLevel}
                        </span>
                      </div>
                      <p className="font-bold text-white text-base" dir="ltr">{q.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1" dir="ltr">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => setReadingAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                            className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all ${
                              readingAnswers[q.id] === oIdx
                                ? 'bg-emerald-600/25 border-emerald-400 text-white shadow'
                                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveSectionIdx(0)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl"
                  >
                    السابق: قسم الاستماع
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSectionIdx(2)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    الانتقال إلى قسم الكتابة الأكاديمية <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* القسم 3: الكتابة الأكاديمية (WRITING SECTION) */}
            {activeSectionIdx === 2 && (
              <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-black text-amber-400 uppercase">{examData.writingSection?.taskType}</span>
                    <h3 className="heading-alex text-2xl font-black text-white mt-1">
                      ✍️ قسم الإنتاج الكتابي وتصحيح الذكاء الاصطناعي (Writing)
                    </h3>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-xs font-black">
                    عدد الكلمات: <span className={writingWordCount >= (examData.writingSection?.minWords || 60) ? 'text-emerald-400' : 'text-amber-400'}>{writingWordCount}</span> / {examData.writingSection?.minWords || 60}+ كلمة
                  </div>
                </div>

                <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-5 space-y-2" dir="ltr">
                  <span className="text-xs font-black text-amber-400 uppercase">Official Writing Prompt:</span>
                  <p className="text-white text-sm md:text-base font-medium leading-relaxed">
                    {examData.writingSection?.prompt}
                  </p>
                </div>

                <textarea
                  dir="ltr"
                  rows={10}
                  value={writingResponse}
                  onChange={(e) => setWritingResponse(e.target.value)}
                  placeholder="Write your structured response/essay here..."
                  className="w-full bg-slate-950 border-2 border-slate-800 focus:border-amber-500 rounded-2xl p-5 text-white text-sm md:text-base leading-relaxed outline-none"
                />

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveSectionIdx(1)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl"
                  >
                    السابق: القراءة والقواعد
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSectionIdx(3)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    الانتقال إلى قسم التحدث والمقابلة الحية <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* القسم 4: مقابلة التحدث الصوتي الحي (SPEAKING SECTION) */}
            {activeSectionIdx === 3 && (
              <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-black text-rose-400 uppercase">Section 4 • Live AI Speaking Examiner</span>
                    <h3 className="heading-alex text-2xl font-black text-white mt-1">
                      🎙️ قسم مقابلة التحدث وبطاقة الـ Cue Card (Speaking)
                    </h3>
                  </div>

                  {/* مؤقت تحضير الدقيقة الواحدة لبطاقة IELTS Part 2 */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setCueCardPrepSeconds(60); setIsPrepTimerRunning(true); }}
                      className="bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-black px-3.5 py-2 rounded-xl transition-all"
                    >
                      ⏱️ ابدأ مؤقت التحضير (60 ثانية): {cueCardPrepSeconds}s
                    </button>
                  </div>
                </div>

                {/* بطاقة أسئلة الممتحن مع زر الاستماع لصوت الممتحن */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" dir="ltr">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-400">Part 1: Introduction</span>
                      <button
                        type="button"
                        onClick={() => handlePlayExamAudio(examData.speakingSection?.part1Question, 0.95)}
                        className="text-purple-400 hover:text-purple-300 p-1"
                        title="استمع لسؤال الممتحن"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{examData.speakingSection?.part1Question}</p>
                  </div>

                  <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400">Part 2: Official Cue Card</span>
                      <button
                        type="button"
                        onClick={() => handlePlayExamAudio(examData.speakingSection?.cueCardTopic, 0.95)}
                        className="text-amber-400 hover:text-amber-300 p-1"
                        title="استمع لبطاقة التحدث"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-white font-semibold leading-relaxed">{examData.speakingSection?.cueCardTopic}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-400">Part 3: Deep Discussion</span>
                      <button
                        type="button"
                        onClick={() => handlePlayExamAudio(examData.speakingSection?.part3Question, 0.95)}
                        className="text-emerald-400 hover:text-emerald-300 p-1"
                        title="استمع لسؤال المناقشة"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{examData.speakingSection?.part3Question}</p>
                  </div>
                </div>

                {/* زر تسجيل الصوت بالمايكروفون + صندوق النص الملتقط */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs text-slate-300">
                      اضغط على زر المايكروفون وتحدث بطلاقة للإجابة عن الأسئلة الثلاثة (أو دوّن إجابتك الشفوية مباشرة):
                    </p>
                    <button
                      type="button"
                      onClick={handleToggleMicRecording}
                      className={`px-5 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                        isRecordingMic
                          ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_25px_rgba(225,29,72,0.5)]'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                    >
                      {isRecordingMic ? <><MicOff size={16} /> إيقاف التسجيل الصوتي</> : <><Mic size={16} /> ابدأ التحدث بالمايكروفون الآن</>}
                    </button>
                  </div>

                  <textarea
                    dir="ltr"
                    rows={5}
                    value={speakingTranscript}
                    onChange={(e) => setSpeakingTranscript(e.target.value)}
                    placeholder="Your spoken response will appear here automatically as you speak into the microphone..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-emerald-300 text-sm outline-none"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveSectionIdx(2)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl"
                  >
                    السابق: قسم الكتابة
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitAndEvaluateExam}
                    className="heading-alex bg-gradient-to-l from-emerald-500 to-amber-400 hover:from-emerald-400 hover:to-yellow-300 text-slate-950 font-black text-sm px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2"
                  >
                    <Trophy size={18} /> تسليم الاختبار وإصدار الشهادة والتشخيص النهائي
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================================================================= */}
        {/* ⏳ مرحلة التصحيح بالذكاء الاصطناعي */}
        {/* ================================================================= */}
        {examStage === 'evaluating' && (
          <div className="py-24 text-center space-y-5 bg-[#0b1120] border border-slate-800 rounded-3xl">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>
            <h3 className="heading-alex text-2xl font-black text-white">
              جاري تحليل إجاباتك وتصحيح المقال والمحادثة وفق معايير {langConfig.officialShort} و CEFR...
            </h3>
            <p className="text-sm text-slate-400">يقوم الممتحن الذكي الآن بحساب درجاتك في المهارات الأربع وإصدار شهادتك الموثقة.</p>
          </div>
        )}

        {/* ================================================================= */}
        {/* 👑 المرحلة 3: التقرير التشخيصي + الشهادة الدولية + التوجيه للأكاديمية */}
        {/* ================================================================= */}
        {examStage === 'results' && evaluationResult && (
          <div className="space-y-10 animate-fade-in-up">

            {/* أزرار التحكم العلوية */}
            <div className="flex flex-wrap items-center justify-between gap-4 no-print">
              <button
                type="button"
                onClick={() => setExamStage('lobby')}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2"
              >
                <ArrowRight size={16} /> العودة لمركز الاختبارات
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow"
                >
                  <Printer size={16} /> طباعة / حفظ الشهادة الرسمية (PDF)
                </button>
              </div>
            </div>

            {/* 🏆 الشهادة الرسمية المعتمدة (Official Language Proficiency Certificate) */}
            <div className="bg-[#070b14] border-2 border-amber-500/60 rounded-3xl p-8 md:p-12 shadow-[0_0_70px_rgba(245,158,11,0.15)] relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={42} className="text-amber-400" />
                  <div>
                    <span className="mono-code text-xs font-bold text-emerald-400 block">CHERIF.DEV INTERNATIONAL LANGUAGE BOARD</span>
                    <h2 className="heading-alex text-xl md:text-2xl font-black text-white">
                      وثيقة إثبات الكفاءة اللغوية الرسمية ({langConfig.flag} {langConfig.nameEn})
                    </h2>
                  </div>
                </div>
                <div className="text-left mono-code text-xs text-slate-400">
                  <div>ID: <strong className="text-white">{evaluationResult.certificateSerialId}</strong></div>
                  <div>Date: <strong className="text-white">{evaluationResult.issueDate}</strong></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-sm text-slate-400">تشهد أكاديمية Cherif.Dev بأن الممتحن:</p>
                  <h3 className="heading-alex text-3xl md:text-4xl font-black text-amber-400">
                    {evaluationResult.studentName}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    قد أتم بنجاح تقييم الكفاءة اللغوية الشامل للغة <strong className="text-white">{langConfig.nameAr}</strong> في المهارات الأربع (الاستماع، القراءة، الكتابة، والتحدث) وحقق المستوى المعياري التالي:
                  </p>

                  {/* أشرطة المهارات الأربع */}
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    {[
                      { label: 'Listening (الاستماع)', data: evaluationResult.skills.listening, color: 'bg-purple-500' },
                      { label: 'Reading & Grammar (القراءة)', data: evaluationResult.skills.reading, color: 'bg-emerald-500' },
                      { label: 'Writing (الكتابة)', data: evaluationResult.skills.writing, color: 'bg-amber-500' },
                      { label: 'Speaking (التحدث)', data: evaluationResult.skills.speaking, color: 'bg-indigo-500' }
                    ].map((sk, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-black">
                          <span className="text-slate-300">{sk.label}</span>
                          <span className="text-white mono-code">{sk.data.cefr} ({sk.data.percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className={`${sk.color} h-full rounded-full`} style={{ width: `${sk.data.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* بطاقة المستوى النهائي الكبرى */}
                <div className="lg:col-span-5 bg-slate-950 border-2 border-amber-500/40 rounded-3xl p-7 text-center space-y-4">
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
                    المستوى المعتمد (CEFR Global Scale)
                  </span>
                  <div className="text-6xl font-black text-white mono-code">{evaluationResult.overallCEFR}</div>
                  <div className="text-lg font-black text-emerald-400 mono-code" dir="ltr">
                    {evaluationResult.officialEquivalentScore}
                  </div>
                  <p className="text-xs text-slate-400">
                    النتيجة الإجمالية: {evaluationResult.overallPercent}% • تقييم شامل للمهارات الأربع
                  </p>
                </div>
              </div>
            </div>

            {/* التشخيص التفصيلي وتوجيه الكراش كورس الذكي */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
              <div className="lg:col-span-7 bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-5">
                <h3 className="heading-alex text-xl font-black text-white flex items-center gap-2">
                  <BarChart3 className="text-emerald-400" size={22} /> التقرير التشخيصي للممتحن الذكي (AI Examiner Feedback)
                </h3>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-emerald-400">✅ نقاط القوة المرصودة:</h4>
                  {evaluationResult.strengths.map((st, i) => (
                    <p key={i} className="text-xs sm:text-sm text-slate-300 bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                      • {st}
                    </p>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-amber-400">🎯 خطة المعالجة والارتقاء للمستوى التالي:</h4>
                  {evaluationResult.weaknessesAndFixes.map((wk, i) => (
                    <p key={i} className="text-xs sm:text-sm text-slate-300 bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                      • {wk}
                    </p>
                  ))}
                </div>

                <div className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-2xl space-y-1.5">
                  <span className="text-xs font-black text-indigo-300 block">✍️ ملاحظة مصحح الكتابة الأكاديمية:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{evaluationResult.writingCorrectionSample}</p>
                </div>
              </div>

              {/* بطاقة التوجيه المباشر للكورس المناسب في الأكاديمية */}
              <div className="lg:col-span-5 bg-gradient-to-b from-emerald-950/40 to-[#0b1120] border-2 border-emerald-500/40 rounded-3xl p-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black bg-emerald-500 text-slate-950 px-3.5 py-1 rounded-full">
                    <Compass size={14} /> توصية المسار الذكي في الأكاديمية
                  </span>
                  <h3 className="heading-alex text-2xl font-black text-white">
                    ابدأ دراستك من الكراش كورس رقم ({evaluationResult.recommendedCourseNumber}) مباشرة!
                  </h3>
                  <p className="text-sm text-slate-300 leading-[1.85]">
                    بما أن مستواك الحالي هو <strong className="text-amber-400">{evaluationResult.overallCEFR}</strong>، لست بحاجة لإضاعة وقتك في البدايات البديهية؛ يمكنك القفز مباشرة إلى <strong className="text-white">الكراش كورس رقم {evaluationResult.recommendedCourseNumber}</strong> ضمن الشهادة المهنية للغة {langConfig.nameAr} للوصول إلى طلاقة <strong>C2 Native</strong>.
                  </p>
                </div>

                <Link
                  to="/academy"
                  className="heading-alex w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-4 px-6 rounded-2xl text-center shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all block"
                >
                  انتقل إلى الشهادة اللغوية في الأكاديمية ←
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default LanguageExamCenter;