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
  Lightbulb, ChevronDown, Microscope, Trophy, Award, Sparkles, Eye, EyeOff, Bot,
  Volume2, Headphones, Mic, Copy, Check, Square, Upload, Puzzle, PenTool,
  Target, Layers, RotateCcw, PhoneCall, PhoneOff, Send, MessageCircle, Radio, Compass, UserCheck
} from 'lucide-react';

// ============================================================================
// 🎨 0. قاموس الصور الذهنية التلقائي متعدد اللغات (Visual Emoji Anchors)
// ============================================================================
const WORD_EMOJI_MAP = {
  // English
  cat: '🐱', dog: '🐕', bug: '🐞', ant: '🐜', fish: '🐟', owl: '🦉', pet: '🐾', rat: '🐭', bat: '🦇',
  apple: '🍎', egg: '🥚', cup: '☕', mug: '🍺', pot: '🍲', pan: '🍳', dish: '🍽️', chip: '🍟',
  sun: '☀️', hot: '🔥', bed: '🛏️', cot: '🛌', mat: '🧶', box: '📦', bin: '🗑️',
  pen: '🖊️', pin: '📌', net: '🕸️', bag: '🎒', hat: '🎩', red: '🔴',
  ship: '🚢', shop: '🏪', path: '🛣️', log: '🪵',
  man: '👨', chin: '🧔', run: '🏃', sit: '🪑', chat: '🐱', math: '🔢', thin: '📏', big: '🐘',
  eat: '🍽️', drink: '🥤', sleep: '😴', walk: '🚶',
  // French (Français)
  chien: '🐕', oiseau: '🐦', poisson: '🐟', cheval: '🐴',
  pomme: '🍎', pain: '🥖', croissant: '🥐', eau: '💧', café: '☕', lait: '🥛', fromage: '🧀',
  lit: '🛏️', table: '🪑', chaise: '🪑', maison: '🏠', école: '🏫', porte: '🚪', fenêtre: '🪟',
  livre: '📖', stylo: '🖊️', sac: '🎒', chapeau: '🎩', voiture: '🚗', bateau: '⛵', train: '🚆',
  soleil: '☀️', lune: '🌙', feu: '🔥', fleur: '🌸', arbre: '🌳', jardin: '🏡',
  garçon: '👦', fille: '👧', homme: '👨', femme: '👩', maman: '👩', père: '👨', ami: '🤝',
  rouge: '🔴', bleu: '🔵', vert: '🟢', bonjour: '👋', salut: '👋', merci: '🙏',
  // Spanish & German & Japanese Common
  gato: '🐱', perro: '🐕', casa: '🏠', libro: '📖', agua: '💧', mesa: '🪑',
  katze: '🐱', hund: '🐕', buch: '📖', wasser: '💧', haus: '🏠', tisch: '🪑', apfel: '🍎',
  ねこ: '🐱', いぬ: '🐕', みず: '💧', ほん: '📖', りんご: '🍎', さくら: '🌸'
};

const getEmojiForText = (text = '') => {
  const lower = (text || '').toLowerCase();
  for (const [word, emoji] of Object.entries(WORD_EMOJI_MAP)) {
    if (lower.includes(word)) return emoji;
  }
  return '🗣️';
};

// ============================================================================
// 🌍 0.2 كاشف اللغة الصوتي الذكي (يكتشف لغة الكورس أو النص تلقائياً)
// ============================================================================
const resolveLanguageConfig = (contextStr = '', sampleText = '') => {
  const combined = `${contextStr} ${sampleText}`.toLowerCase();

  if (/[\u3040-\u30ff]/.test(sampleText) || /يابان|japanese|日本語|jlpt|هيراغانا|كاتاكانا|كانجي/i.test(combined)) {
    return { code: 'ja-JP', nameAr: 'اليابانية', nameEn: 'Japanese', flag: '🇯🇵' };
  }
  if (/[\u4e00-\u9faf]/.test(sampleText) && /صين|mandarin|chinese|中文|hsk|pinyin/i.test(combined)) {
    return { code: 'zh-CN', nameAr: 'الصينية', nameEn: 'Chinese', flag: '🇨🇳' };
  }
  if (/فرنس|french|français|delf|dalf|أصوات أنفية|liaison|c'est|est-ce que|bonjour/i.test(combined)) {
    return { code: 'fr-FR', nameAr: 'الفرنسية', nameEn: 'French', flag: '🇫🇷' };
  }
  if (/ألمان|المان|german|deutsch|goethe|testdaf|umlaut|das ist|guten tag/i.test(combined)) {
    return { code: 'de-DE', nameAr: 'الألمانية', nameEn: 'German', flag: '🇩🇪' };
  }
  if (/إسبان|اسبان|spanish|español|dele|siele|buenos días|¿/i.test(combined)) {
    return { code: 'es-ES', nameAr: 'الإسبانية', nameEn: 'Spanish', flag: '🇪🇸' };
  }
  if (/صين|mandarin|chinese|中文|hsk|pinyin/i.test(combined)) {
    return { code: 'zh-CN', nameAr: 'الصينية', nameEn: 'Chinese', flag: '🇨🇳' };
  }
  return { code: 'en-US', nameAr: 'الإنجليزية', nameEn: 'English', flag: '🇬🇧' };
};

// ============================================================================
// 🧹 0.5 منقي النصوص التلقائي الشامل (يصلح حتى ملفات JSON المولدة سابقاً فوراً!)
// ============================================================================
const sanitizeLessonMarkdown = (raw = '', stripRawPromptSection = false) => {
  if (!raw) return '';
  let cleaned = raw
    .replace(/[\u0900-\u097F]+/g, '') // إزالة أي رموز هندية عابرة مثل (وड़ने)
    .replace(/פּ/g, 'پ')
    .replace(/c'هست/gi, "c'est")
    .replace(/C'هست/g, "C'est")
    .replace(/c'ست/gi, "c'est")
    .replace(/C'ست/g, "C'est")
    .replace(/مaman/gi, "maman")
    .replace(/Il\s+هو\s+bon/gi, "Il est bon")
    .replace(/\bun clé\b/gi, "une clé")
    .replace(/\bUn clé\b/g, "Une clé")
    .replace(/---+\+/g, '---')
    .replace(/---;/g, '---')
    .replace(/🔊\s*IPA:\s*\/([\u0600-\u06FF\s]+)\//g, '🔊 النطق: /$1/');

  if (stripRawPromptSection) {
    cleaned = cleaned.split(/###\s*🎙️/)[0].trim();
  }
  return cleaned;
};

// 🎨 كاشف الجنس النحوي التلقائي لتلوين الكلمات المذكرة (🔵) والمؤنثة (🔴) في الفرنسية والإسبانية والألمانية
const detectGrammaticalGenderBadge = (text = '') => {
  const trimmed = (text || '').trim().toLowerCase();
  if (/^(un|le|du|mon|ton|son|ce|cet|el|un|der|ein)\s+/i.test(trimmed) || trimmed.includes('🔵')) {
    return { type: 'masc', label: '🔵 مذكر', classes: 'bg-sky-500/15 text-sky-300 border-sky-500/30' };
  }
  if (/^(une|la|de la|ma|ta|sa|cette|una|die|eine)\s+/i.test(trimmed) || trimmed.includes('🔴')) {
    return { type: 'fem', label: '🔴 مؤنث', classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
  }
  return null;
};


// ============================================================================
// 🎧 1. محلل استوديو الاستماع والترديد (يدعم جميع اللغات)
// ============================================================================
const parseAudioShadowingSnippet = (rawSnippet = '') => {
  if (!rawSnippet || (!rawSnippet.includes('IPA:') && !rawSnippet.includes('🎧'))) return [];
  const cleanedSnippet = sanitizeLessonMarkdown(rawSnippet);
  const lines = cleanedSnippet.split('\n').map(l => l.trim()).filter(Boolean);
  const items = [];
  let currentItem = null;

  lines.forEach(line => {
    if (line.startsWith('🎧')) return;
    const numberedMatch = line.match(/^(\d+)[.) -]+\s*(.+)$/);
    if (numberedMatch && !line.includes('IPA:')) {
      if (currentItem) items.push(currentItem);
      const sent = numberedMatch[2].trim();
      currentItem = {
        order: numberedMatch[1],
        sentence: sent,
        emoji: getEmojiForText(sent),
        ipa: '',
        meaning: ''
      };
    } else if (line.includes('IPA:') || line.includes('النطق:')) {
      const cleanLine = line.replace(/^🔊\s*/, '');
      const parts = cleanLine.split('|');
      const ipaPart = (parts[0] || '').replace(/(?:IPA|النطق):\s*/i, '').trim();
      const meaningPart = (parts[1] || '').replace(/المعنى:\s*/i, '').trim();
      if (currentItem) {
        currentItem.ipa = ipaPart;
        currentItem.meaning = meaningPart;
      } else {
        items.push({
          order: items.length + 1,
          sentence: ipaPart,
          emoji: '🔊',
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
// 🧩 2. مستخرج مكعبات الليغو، سُلّم البناء، جدول الأخطاء، ومفردات الدرس (متعدد اللغات)
// ============================================================================
const extractLanguageVisualWidgets = (rawMarkdown = '') => {
  const markdown = sanitizeLessonMarkdown(rawMarkdown, false);
  if (!markdown) return { legoEquations: [], ladderSteps: [], mistakeRows: [], voicePrompt: '', extractedChunks: [] };

  const lines = markdown.split('\n');
  const legoEquations = [];
  const mistakeRows = [];
  const extractedChunks = [];
  let currentMistake = null;

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.includes('[') && trimmed.includes(']') && (trimmed.includes('+') || trimmed.includes('=') || trimmed.includes('rightarrow'))) {
      const cleanedEq = trimmed
        .replace(/^[*-\d.]+\s*/, '')
        .replace(/`/g, '')
        .replace(/\$\\rightarrow\$/g, '=')
        .trim();
      if (cleanedEq.length > 8 && cleanedEq.length < 220) {
        legoEquations.push(cleanedEq);
      }
    }

    // استخراج القوالب الكلامية لجميع اللغات (بما فيها الفرنسية، الألمانية، الإسبانية، اليابانية، الصينية)
    const backtickMatches = trimmed.match(/`([^\u0600-\u06FF`]{2,45})`/g);
    if (backtickMatches) {
      backtickMatches.forEach(m => {
        const cleanM = m.replace(/`/g, '').replace(/\.\.\./g, '').trim();
        if (cleanM.length >= 2 && !cleanM.includes('[') && !extractedChunks.includes(cleanM)) {
          extractedChunks.push(cleanM);
        }
      });
    }

    if (!trimmed.startsWith('|')) {
      if (trimmed.includes('❌')) {
        if (currentMistake && (currentMistake.wrong || currentMistake.right)) {
          mistakeRows.push(currentMistake);
        }
        const wrongText = trimmed.replace(/^[*-\d.]+\s*/, '').replace(/\*\*الخطأ الشائع:\*\*/g, '').replace('❌', '').trim();
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
        currentMistake.right = trimmed.replace(/^[*-\d.]+\s*/, '').replace(/\*\*الصواب الأصيل.*?:\*\*/g, '').replace('✅', '').trim();
      } else if ((trimmed.includes('💡') || trimmed.startsWith('*السبب') || trimmed.startsWith('**السبب')) && currentMistake) {
        currentMistake.reason = trimmed.replace(/^[*-\d.]+\s*/, '').replace(/\*\*السبب اللغوي:\*\*/g, '').replace('💡', '').trim();
      }
    }
  });

  if (currentMistake && (currentMistake.wrong || currentMistake.right)) {
    mistakeRows.push(currentMistake);
  }

  const ladderSteps = [];
  const ladderSection = (markdown.split(/###\s*🪜/)[1] || '').split(/###/)[0] || '';
  if (ladderSection) {
    const ladderLines = ladderSection.split('\n').map(l => l.trim()).filter(Boolean);
    ladderLines.forEach(l => {
      if (/^(?:\d+\.|[-*])\s*\**الدرجة|^-\s*[^\u0600-\u06FF]/.test(l)) {
        const cleanStep = l.replace(/^(?:\d+\.|[-*])\s*/, '').replace(/\*\*/g, '').replace(/`/g, '').trim();
        // استخراج النص الأجنبي من الدرجة (فرنسي، إنجليزي، ألماني، إسباني، ياباني، صيني)
        const foreignMatch = cleanStep.match(/([A-Za-z\u00C0-\u024F\u3040-\u30ff\u4e00-\u9faf][A-Za-z\u00C0-\u024F\u3040-\u30ff\u4e00-\u9faf\s,.?!'’¿¡-]+)/);
        ladderSteps.push({
          rawText: cleanStep,
          englishText: foreignMatch ? foreignMatch[1].trim() : ''
        });
      }
    });
  }

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
    ladderSteps: ladderSteps.slice(0, 6),
    mistakeRows: mistakeRows.filter(r => r.wrong && r.right).slice(0, 6),
    voicePrompt,
    extractedChunks: extractedChunks.slice(0, 8)
  };
};

const cleanLessonDesc = (desc = '') => {
  return (desc || '').split('|||UNIT_SUMMARY:')[0].split('|||UNITS_MAP:')[0].trim();
};

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

  const [certificateCoursesList, setCertificateCoursesList] = useState([]);
  const [activeCertCourseIdx, setActiveCertCourseIdx] = useState(0);

  // =========================================
  // 🎮 نظام الحالات الموحد (Quest & Boss States)
  // =========================================
  const [selectedQuestAnswer, setSelectedQuestAnswer] = useState(null); 
  const [selectedBossAnswers, setSelectedBossAnswers] = useState({});   
  const [questStatus, setQuestStatus] = useState('idle'); 
  const [scoreInfo, setScoreInfo] = useState({ score: 0, percentage: 0 }); 
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // =========================================
  // 💻 نظام خانة كتابة الكود / تركيب الجمل التفاعلية والتلميحات
  // =========================================
  const [studentCode, setStudentCode] = useState('');
  const [revealedHintsCount, setRevealedHintsCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeFeedback, setCodeFeedback] = useState(null);

  // =========================================
  // 🔊 نظام الصوتيات، البطاقات التفاعلية، ولعبة المكعبات
  // =========================================
  const [speakingKey, setSpeakingKey] = useState('');
  const [listeningRowIdx, setListeningRowIdx] = useState(null);
  const [speechCheckResult, setSpeechCheckResult] = useState(null);
  const [showUnitSummaryBanner, setShowUnitSummaryBanner] = useState(true);

  const [studioMode, setStudioMode] = useState('table');
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const [builderTargetIdx, setBuilderTargetIdx] = useState(0);
  const [scrambledTokens, setScrambledTokens] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [builderSuccess, setBuilderSuccess] = useState(null);

  // =========================================
  // 🎙️🔥 نظام "Speak Class" الثلاثي المطور
  // =========================================
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState(false);
  const [speakClassMode, setSpeakClassMode] = useState('speak_class'); // 'speak_class' | 'roleplay' | 'mission'
  const [voiceChatMessages, setVoiceChatMessages] = useState([]);
  const [isCoachThinking, setIsCoachThinking] = useState(false);
  const [isMicRecordingCoach, setIsMicRecordingCoach] = useState(false);
  const [liveInterimTranscript, setLiveInterimTranscript] = useState('');
  const [coachTextInput, setCoachTextInput] = useState('');
  const [suggestedReplies, setSuggestedReplies] = useState([]);
  const [usedLessonWords, setUsedLessonWords] = useState([]);
  const [localTurnCounter, setLocalTurnCounter] = useState(0);

  const [blindListeningMode, setBlindListeningMode] = useState(false);
  const [revealedCoachMsgIds, setRevealedCoachMsgIds] = useState({});
  const [roleplaySceneMeta, setRoleplaySceneMeta] = useState(null);
  const [missionSpotlightIdx, setMissionSpotlightIdx] = useState(0);
  const [missionBonusExp, setMissionBonusExp] = useState(0);

  const recognitionRef = useRef(null);
  const accumulatedTranscriptRef = useRef('');
  const holdStartTimeRef = useRef(0);
  const voiceChatEndRef = useRef(null);
  const jsonInputRef = useRef(null);

  const [completedLessons, setCompletedLessons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [claimingCert, setClaimingCert] = useState(false);

  const shuffleBossQuestions = (quizArray) => {
    return [...quizArray].sort(() => Math.random() - 0.5);
  };

  // معلومات اللغة الحالية للكورس والدرس
  const activeLangConfig = useMemo(() => {
    const fullContext = `${course?.targetLanguage || ''} ${course?.speechLang || ''} ${course?.parentCertTitle || ''} ${course?.title || ''} ${course?.description || ''} ${activeLesson?.section || ''} ${activeLesson?.title || ''}`;
    return resolveLanguageConfig(fullContext, activeLesson?.codeSnippet || '');
  }, [course, activeLesson]);

  const hydrateSingleCourseObject = (courseJson, parentCertTitle = '', parentTargetLang = '', parentSpeechLang = '') => {
    if (!courseJson) return false;
    const cleanedTitle = cleanCourseTitleText(courseJson.courseTitle || courseJson.title || 'كراش كورس تفاعلي');
    const courseObj = {
      _id: courseJson._id || id || 'local_course_id',
      courseOrder: courseJson.courseOrder || 1,
      title: cleanedTitle,
      parentCertTitle: parentCertTitle || courseJson.parentCertTitle || '',
      targetLanguage: courseJson.targetLanguage || parentTargetLang || '',
      speechLang: courseJson.speechLang || parentSpeechLang || '',
      description: courseJson.courseDescription || courseJson.description || '',
      difficulty: courseJson.difficultyLevel || '',
      estimatedHours: courseJson.estimatedHours || '18 ساعة',
      certificateBadge: courseJson.certificateBadge || '',
      connectionToPrevious: courseJson.connectionToPrevious || '',
      cliffhangerToNext: courseJson.cliffhangerToNext || '',
      githubProject: courseJson.githubProject || null,
      skills: courseJson.skills || []
    };

    const summaries = { ...(courseJson.unitSummariesMap || {}) };
    const flatLessons = [];
    let globalOrder = 1;

    const rawSections = courseJson.sections || courseJson.blueprint || [];
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
          sectionOrder: sec.sectionOrder || (sIdx + 1),
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
    } else {
      setActiveLesson(null);
    }
    return true;
  };

  const hydrateFromRawCourseJSON = (rawJson, targetCourseIdx = 0) => {
    if (!rawJson) return false;
    if (Array.isArray(rawJson.courses) && rawJson.courses.length > 0) {
      setCertificateCoursesList(rawJson.courses);
      const validIdx = Math.min(targetCourseIdx, rawJson.courses.length - 1);
      setActiveCertCourseIdx(validIdx);
      return hydrateSingleCourseObject(
        rawJson.courses[validIdx],
        rawJson.certificateTitle || rawJson.courseTitle,
        rawJson.targetLanguage || '',
        rawJson.speechLang || ''
      );
    }
    setCertificateCoursesList([]);
    return hydrateSingleCourseObject(rawJson, rawJson.parentCertTitle || '', rawJson.targetLanguage || '', rawJson.speechLang || '');
  };

  const handleSwitchCertificateCourse = (cIdx) => {
    if (!certificateCoursesList[cIdx]) return;
    setActiveCertCourseIdx(cIdx);
    hydrateSingleCourseObject(
      certificateCoursesList[cIdx],
      course?.parentCertTitle,
      course?.targetLanguage,
      course?.speechLang
    );
    resetQuestState();
  };

  const handleImportLocalJSONFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        localStorage.setItem('cherif_active_local_course_json', JSON.stringify(parsed));
        hydrateFromRawCourseJSON(parsed, 0);
        resetQuestState();
      } catch (err) {
        alert('❌ ملف JSON غير صالح. تأكد من اختيار ملف الكراش كورس أو الشهادة الصحيح.');
      } finally {
        e.target.value = null;
      }
    };
    reader.readAsText(file);
  };

  // ============================================================================
  // 🔊 محرك اختيار الصوت الطبيعي والنطق لجميع اللغات (fr-FR, ja-JP, de-DE, es-ES, zh-CN, en-US)
  // ============================================================================
  const getBestNaturalVoiceForLang = (langCode = 'en-US') => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    const langPrefix = langCode.split('-')[0].toLowerCase();
    const matchingVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith(langPrefix));
    if (matchingVoices.length === 0) return null;

    const preferredKeywords = [
      'Natural', 'Online', 'Google', 'Microsoft', 'Denise', 'Henri', 'Paul', 'Julie',
      'Amelie', 'Thomas', 'Katja', 'Conrad', 'Alvaro', 'Elvira', 'Nanami', 'Keita',
      'Xiaoxiao', 'Yunxi', 'Samantha', 'Aria', 'Guy', 'Daniel'
    ];
    for (const pref of preferredKeywords) {
      const found = matchingVoices.find(v => v.name.includes(pref));
      if (found) return found;
    }
    return matchingVoices[0];
  };


const neuralAudioCacheRef = useRef({});
  const activeHtmlAudioRef = useRef(null);

  const handleStopAudio = () => {
    if (activeHtmlAudioRef.current) {
      activeHtmlAudioRef.current.pause();
      activeHtmlAudioRef.current.currentTime = 0;
      activeHtmlAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingKey('');
  };

  const handlePlayAudioText = async (rawText, rate = 1.0, keyId = 'studio', onEndCallback = null) => {
    handleStopAudio();

    const cleanForeign = sanitizeLessonMarkdown(rawText || '')
      .split('\n')
      .map(l => l.replace(/🔊.*$/g, '').replace(/\|.*$/g, '').replace(/^\d+[.) -]+/, '').replace(/\([^)]*[\u0600-\u06FF]+[^)]*\)/g, '').trim())
      .filter(l => l && !l.startsWith('🎧') && !/^[\u0600-\u06FF\s\d.,:!؟-]+$/.test(l))
      .join('. ');

    const textToSpeak = cleanForeign || rawText;
    if (!textToSpeak) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const detectedLang = resolveLanguageConfig(
      `${course?.targetLanguage || ''} ${course?.speechLang || ''} ${course?.parentCertTitle || ''} ${course?.title || ''} ${course?.description || ''} ${activeLesson?.section || ''}`,
      textToSpeak
    );

    const activeStateKey = `${keyId}_${rate}`;
    const cacheKey = `${detectedLang.code}_${rate}_${textToSpeak}`;
    setSpeakingKey(activeStateKey);

    // 1. إذا كان المقطع الصوتي العصبي محفوظاً في الكاش، نشغله في 0 جزء من الثانية!
    if (neuralAudioCacheRef.current[cacheKey]) {
      const cachedAudio = new Audio(neuralAudioCacheRef.current[cacheKey]);
      activeHtmlAudioRef.current = cachedAudio;
      cachedAudio.onended = () => {
        setSpeakingKey('');
        if (onEndCallback) onEndCallback();
      };
      cachedAudio.onerror = () => setSpeakingKey('');
      cachedAudio.play().catch(() => setSpeakingKey(''));
      return;
    }

    // 2. طلب الصوت البشري العصبي (Edge-TTS Neural Voice) من السيرفر
    try {
      const res = await axios.post('http://localhost:5000/api/academy2/lang-cert/neural-tts', {
        text: textToSpeak,
        langCode: detectedLang.code,
        rate
      }, { timeout: 6500 });

      if (res.data?.success && res.data.audioUrl) {
        neuralAudioCacheRef.current[cacheKey] = res.data.audioUrl;
        const audio = new Audio(res.data.audioUrl);
        activeHtmlAudioRef.current = audio;
        audio.onended = () => {
          setSpeakingKey('');
          if (onEndCallback) onEndCallback();
        };
        audio.onerror = () => setSpeakingKey('');
        await audio.play();
        return;
      }
    } catch (e) {
      // الانتقال الصامت والآني لصوت المتصفح في حال عدم توفر السيرفر
    }

    // 3. خطة الطوارئ الفورية (Web Speech API)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const bestVoice = getBestNaturalVoiceForLang(detectedLang.code);
      if (bestVoice) utterance.voice = bestVoice;
      utterance.rate = rate;
      utterance.lang = detectedLang.code;
      utterance.onend = () => {
        setSpeakingKey('');
        if (onEndCallback) onEndCallback();
      };
      utterance.onerror = () => {
        setSpeakingKey('');
        if (onEndCallback) onEndCallback();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setSpeakingKey('');
      if (onEndCallback) onEndCallback();
    }
  };



  const handleTestPronunciationMic = (targetSentence, rowIndex) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return alert('يرجى استخدام متصفح Google Chrome أو Edge لتفعيل ميزة فحص النطق بالمايكروفون.');
    }

    const recognition = new SpeechRecognition();
    recognition.lang = activeLangConfig.code;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setListeningRowIdx(rowIndex);
      setSpeechCheckResult(null);
    };
    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript || '';
      // مقارنة ذكية تدعم الحروف اللاتينية المزخرفة (é, è, ç, ü, ñ) واللغات الشرقية (اليابانية والصينية)
      const normalizeUnicode = (str) => (str || '')
        .replace(/[^\p{L}\p{N}\s]/gu, '')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

      const cleanTarget = normalizeUnicode(targetSentence);
      const cleanSpoken = normalizeUnicode(spoken);
      const isGoodMatch = cleanSpoken.length > 0 && (
        cleanSpoken === cleanTarget ||
        cleanTarget.includes(cleanSpoken) ||
        cleanSpoken.includes(cleanTarget)
      );

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
            title: cleanCourseTitleText(rawCourse.title),
            parentCertTitle: rawCourse.certificateMeta?.parentCertificateTitle || rawCourse.parentCertTitle || '',
            targetLanguage: rawCourse.certificateMeta?.targetLanguage || rawCourse.targetLanguage || ''
          });

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
        } else if (courseRes.data?.course?.sections || courseRes.data?.course?.blueprint || courseRes.data?.course?.courses) {
          hydrateFromRawCourseJSON(courseRes.data.course, 0);
        }
      } catch (err) {
        const cachedLocal = localStorage.getItem('cherif_active_local_course_json');
        if (cachedLocal) {
          try {
            hydrateFromRawCourseJSON(JSON.parse(cachedLocal), 0);
          } catch (e) {}
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => handleStopAudio();
  }, [id]);

  const audioStudioItems = useMemo(() => {
    return parseAudioShadowingSnippet(activeLesson?.codeSnippet || '');
  }, [activeLesson]);

  const visualWidgets = useMemo(() => {
    return extractLanguageVisualWidgets(activeLesson?.content || '');
  }, [activeLesson]);

  const lessonTargetVocabulary = useMemo(() => {
    const fromAudio = audioStudioItems.map(i => i.sentence).filter(Boolean);
    const combined = [...new Set([...fromAudio, ...visualWidgets.extractedChunks])];
    return combined.slice(0, 6);
  }, [audioStudioItems, visualWidgets]);

  // ============================================================================
  // 🧠🎙️ المحرك الثلاثي الذكي (متعدد اللغات: يدعم الفرنسية، الإنجليزية، وجميع اللغات!)
  // ============================================================================
  const generateSmartContextualFallback = (spokenText, turnIdx, mode, currentTargetIdx = 0) => {
    const fullCtx = `${course?.parentCertTitle || ''} ${course?.title || ''} ${course?.difficulty || ''} ${activeLesson?.section || ''} ${activeLesson?.title || ''}`;
    const cOrder = Number(course?.courseOrder) || (activeCertCourseIdx + 1) || 1;
    const isZeroLevel = cOrder <= 3 || /Pre-A1|A0|الحروف|أصوات|Phonics|CVC|الثلاثية|القصيرة جداً|كورس 1\b|كورس 2\b|كورس 3\b/i.test(fullCtx);
    const isFrench = activeLangConfig.code === 'fr-FR';

    const defaultFallbackVocab = isFrench
      ? (isZeroLevel ? ['un chat', 'un livre', 'une table', 'bonjour'] : ['prendre une décision', 'avoir besoin de', 'à mon avis'])
      : (isZeroLevel ? ['a cat', 'a mat', 'a red cup', 'in the sun'] : ['make a decision', 'take a break', 'heavy rain', 'have a great time']);

    const targets = lessonTargetVocabulary.length > 0 ? lessonTargetVocabulary : defaultFallbackVocab;

    const tCurrent = targets[currentTargetIdx % targets.length] || targets[0];
    const tNext = targets[(currentTargetIdx + 1) % targets.length] || targets[0];
    const tThird = targets[(currentTargetIdx + 2) % targets.length] || targets[0];

    const buildStudentSpeechUpgrade = (rawStudentText) => {
      if (!rawStudentText || rawStudentText === '__START_SESSION__') return { upgrade: '', tip: '' };
      const cleaned = rawStudentText.trim();
      const words = cleaned.split(/\s+/);
      if (words.length <= 2) {
        const cap = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).replace(/[.?!]+$/, '');
        if (isFrench) {
          return {
            upgrade: isZeroLevel ? `Oui, c'est ${cleaned.toLowerCase()}.` : `Je dirais "${cap}" dans cette situation.`,
            tip: `💡 نطقك لكلمة (${cleaned}) بالفرنسية واضح! لتحويلها إلى جملة كاملة، ابدأ بـ (Oui, c'est...).`
          };
        }
        return {
          upgrade: isZeroLevel ? `Yes, it is ${cleaned.toLowerCase()}.` : `I would say "${cap}" in this situation.`,
          tip: `💡 نطقك لكلمة (${cleaned}) واضح! لتحويلها إلى جملة كاملة كالمتحدث الأصلي، ابدأ بـ (Yes, it is...).`
        };
      }
      const formatted = cleaned.charAt(0).toUpperCase() + cleaned.slice(1) + (/[.?!]$/.test(cleaned) ? '' : '.');
      return {
        upgrade: formatted,
        tip: `✅ تركيب جملتك باللغة ${activeLangConfig.nameAr} ممتاز وطبيعي! استمر بهذا التدفق الصوتي الرائع.`
      };
    };

    const studentEval = buildStudentSpeechUpgrade(spokenText);

    if (isFrench) {
      if (spokenText === '__START_SESSION__') {
        return {
          studentSpeechUpgrade: '',
          studentSpeechFeedbackArabic: '',
          pronunciationScore: null,
          sceneMeta: {
            setting: '☕ في مقهى بباريس (Dans un café à Paris)',
            aiRole: 'الصديق لوكاس (Ton ami Lucas)',
            studentGoal: `تحدث بالفرنسية واستخدم مفردات الدرس مثل (${targets.slice(0, 3).join(' / ')})`
          },
          coachReactionEnglish: `Bonjour mon ami ! Bienvenue dans notre cours de français.`,
          coachReactionArabic: `مرحباً يا صديقي! أهلاً بك في حصتنا للغة الفرنسية.`,
          nextQuestionEnglish: isZeroLevel
            ? `Regarde bien : est-ce que c'est "${tCurrent}" ou "${tNext}" ?`
            : `Dis-moi, comment peux-tu utiliser "${tCurrent}" dans une phrase en français ?`,
          nextQuestionArabic: isZeroLevel
            ? `انظر جيداً: هل هذا (${tCurrent}) أم (${tNext})؟`
            : `أخبرني، كيف يمكنك استخدام (${tCurrent}) في جملة بالفرنسية؟`,
          connectedSpeechHint: `C'est un -> /sɛ.tœ̃/ (الربط الصوتي الفرنسي La Liaison)`,
          modelAnswerForNextQuestion: isZeroLevel ? `Oui, c'est ${tCurrent}.` : `Je pense que ${tCurrent} est très important.`,
          suggestedReplies: isZeroLevel
            ? [`Oui, c'est ${tCurrent}.`, `Voici ${tNext}.`, `C'est ${tCurrent} !`]
            : [`Je pense que ${tCurrent}.`, `J'utilise souvent ${tNext}.`, `Oui, bien sûr !`]
        };
      }

      return {
        studentSpeechUpgrade: studentEval.upgrade,
        studentSpeechFeedbackArabic: studentEval.tip,
        pronunciationScore: 95,
        coachReactionEnglish: `Très bien ! Ta prononciation française s'améliore beaucoup.`,
        coachReactionArabic: `ممتاز جداً! نطقك للفرنسية يتحسن كثيراً.`,
        nextQuestionEnglish: isZeroLevel
          ? `Maintenant, peux-tu dire une phrase simple avec "${tNext}" ?`
          : `Et si on utilise "${tNext}", que dirais-tu ?`,
        nextQuestionArabic: isZeroLevel
          ? `الآن، هل يمكنك قول جملة بسيطة تحتوي على (${tNext})؟`
          : `وماذا لو استخدمنا (${tNext})، ماذا ستقول؟`,
        connectedSpeechHint: `Est-ce que -> /ɛs.kə/`,
        modelAnswerForNextQuestion: isZeroLevel ? `C'est ${tNext}.` : `J'aime beaucoup ${tNext}.`,
        suggestedReplies: isZeroLevel
          ? [`C'est ${tNext}.`, `Voilà ${tNext} !`, `Oui, c'est ${tThird}.`]
          : [`J'aime bien ${tNext}.`, `Voici un exemple avec ${tNext}.`, `D'accord !`]
      };
    }

    if (mode === 'roleplay') {
      const sceneInfo = isZeroLevel
        ? {
            setting: '🏡 في الحديقة المشمسة (In the Sunny Garden)',
            aiRole: 'الصديق سام (Your Friend Sam)',
            studentGoal: `رحّب بصديقك سام، وأخبره ماذا ترى حولك في الحديقة مستخدماً عبارات مثل (${targets.slice(0, 3).join(' / ')})`
          }
        : {
            setting: '☕ في مقهى بلندن (At a London Café)',
            aiRole: 'أليكس - زميلك في العمل (Your Colleague Alex)',
            studentGoal: `حاور أليكس بشكل طبيعي حول يومك وقراراتك مستخدماً تعبيرات الدرس (${targets.slice(0, 3).join(' / ')})`
          };

      if (spokenText === '__START_SESSION__') {
        return {
          studentSpeechUpgrade: '',
          studentSpeechFeedbackArabic: '',
          pronunciationScore: null,
          sceneMeta: sceneInfo,
          coachReactionEnglish: isZeroLevel ? `Hi my friend! It is a sunny day in the garden.` : `Hey! I'm so glad you made it to the café today.`,
          coachReactionArabic: isZeroLevel ? `مرحباً يا صديقي! إنه يوم مشمس في الحديقة.` : `أهلاً! سعيد جداً بوصولك إلى المقهى اليوم.`,
          nextQuestionEnglish: isZeroLevel ? `Look by the tree! Do you see ${tCurrent} or ${tNext}?` : `Before we order our coffee, tell me—how is your week going so far?`,
          nextQuestionArabic: isZeroLevel ? `انظر بجانب الشجرة! هل ترى (${tCurrent}) أم (${tNext})؟` : `قبل أن نطلب قهوتنا، أخبرني—كيف يسير أسبوعك حتى الآن؟`,
          connectedSpeechHint: isZeroLevel ? `Do you see -> D'you-see` : `going so far -> goin-so-far`,
          modelAnswerForNextQuestion: isZeroLevel ? `I see ${tCurrent}!` : `It's going well! I just needed to ${tCurrent}.`,
          suggestedReplies: isZeroLevel
            ? [`I see ${tCurrent}!`, `Look, it is ${tNext}.`, `Yes, ${tCurrent}!`]
            : [`It's going well! I just needed to ${tCurrent}.`, `Honestly, it's been busy, especially with ${tNext}.`, `Pretty good! What are you ordering today?`]
        };
      }

      const roleplayTurns = isZeroLevel
        ? [
            {
              reactEn: `Oh, cool! I see it too!`,
              reactAr: `أوه، رائع! أنا أراه أيضاً!`,
              qEn: `Now look at the table near us. Is that ${tNext} on the table?`,
              qAr: `الآن انظر إلى الطاولة القريبة منا. هل هذا (${tNext}) على الطاولة؟`,
              modelAns: `Yes, that is ${tNext} on the table.`,
              linked: `Is that a -> Iz-tha-tə`
            },
            {
              reactEn: `Haha, you have sharp eyes!`,
              reactAr: `هاها، لديك عينان ثاقبتان!`,
              qEn: `I brought a little bag with me. Do you want ${tThird} from my bag?`,
              qAr: `لقد أحضرت حقيبة صغيرة معي. هل تريد (${tThird}) من حقيبتي؟`,
              modelAns: `Yes, please! I want ${tThird}.`,
              linked: `Do you want -> D'you-want`
            }
          ]
        : [
            {
              reactEn: `Oh really? I totally understand how that feels!`,
              reactAr: `أوه حقاً؟ أفهم تماماً هذا الشعور!`,
              qEn: `By the way, the waiter is coming over. After we get our drinks, how do you plan to handle "${tNext}" this week?`,
              qAr: `بالمناسبة، النادل قادم نحونا. بعد أن نأخذ مشروباتنا، كيف تخطط للتعامل مع موضوع (${tNext}) هذا الأسبوع؟`,
              modelAns: `I think the best way is to ${tNext} early.`,
              linked: `coming over -> comin-over`
            },
            {
              reactEn: `That sounds like a really smart plan!`,
              reactAr: `هذه تبدو خطة ذكية حقاً!`,
              qEn: `If a friend asked for your advice about "${tThird}", what would you tell them?`,
              qAr: `لو طلب منك صديق نصيحتك بخصوص (${tThird})، ماذا ستقول له؟`,
              modelAns: `I would tell them to ${tThird} carefully.`,
              linked: `asked for -> askt-fər`
            }
          ];

      const pickedTurn = roleplayTurns[turnIdx % roleplayTurns.length];
      return {
        studentSpeechUpgrade: studentEval.upgrade,
        studentSpeechFeedbackArabic: studentEval.tip,
        pronunciationScore: 95,
        sceneMeta: sceneInfo,
        coachReactionEnglish: pickedTurn.reactEn,
        coachReactionArabic: pickedTurn.reactAr,
        nextQuestionEnglish: pickedTurn.qEn,
        nextQuestionArabic: pickedTurn.qAr,
        connectedSpeechHint: pickedTurn.linked,
        modelAnswerForNextQuestion: pickedTurn.modelAns,
        suggestedReplies: [
          pickedTurn.modelAns,
          isZeroLevel ? `No, it is ${tCurrent}.` : `Actually, I prefer to focus on ${tCurrent}.`,
          isZeroLevel ? `Yes, it is!` : `That's a great question, let me think!`
        ]
      };
    }

    if (mode === 'mission') {
      if (spokenText === '__START_SESSION__') {
        return {
          studentSpeechUpgrade: '',
          studentSpeechFeedbackArabic: '',
          pronunciationScore: null,
          coachReactionEnglish: `Welcome to the Vocabulary Strike Challenge!`,
          coachReactionArabic: `مرحباً بك في تحدي قنص وتوظيف مفردات الدرس!`,
          nextQuestionEnglish: isZeroLevel
            ? `Target #1: Use "${tCurrent}" in a short sentence! What is in front of you?`
            : `Target #1: Can you answer me using the expression "${tCurrent}" in your own sentence?`,
          nextQuestionArabic: isZeroLevel
            ? `الهدف الأول 🎯: استخدم كلمة "${tCurrent}" في جملة قصيرة! ماذا يوجد أمامك؟`
            : `الهدف الأول 🎯: هل يمكنك الإجابة مستخدماً العبارة "${tCurrent}" في جملة من إنشائك؟`,
          connectedSpeechHint: `Target phrase: "${tCurrent}"`,
          modelAnswerForNextQuestion: isZeroLevel ? `This is ${tCurrent}.` : `In my daily life, I always try to ${tCurrent}.`,
          suggestedReplies: isZeroLevel
            ? [`This is ${tCurrent}.`, `I see ${tCurrent}.`, `It is ${tCurrent}!`]
            : [`In my daily life, I always ${tCurrent}.`, `I think "${tCurrent}" is very useful.`, `Yesterday, I had to ${tCurrent}.`]
        };
      }

      return {
        studentSpeechUpgrade: studentEval.upgrade,
        studentSpeechFeedbackArabic: studentEval.tip,
        pronunciationScore: 96,
        coachReactionEnglish: `Bullseye! You unlocked the target!`,
        coachReactionArabic: `إصابة دقيقة في الصميم! لقد نجحت في توظيف العبارة!`,
        nextQuestionEnglish: isZeroLevel
          ? `Next Target 🎯: Now use "${tNext}" to answer: What do you see on the mat?`
          : `Next Target 🎯: How would you use "${tNext}" to describe a situation at work or home?`,
        nextQuestionArabic: isZeroLevel
          ? `الهدف التالي 🎯: الآن استخدم "${tNext}" للإجابة: ماذا ترى على السجادة؟`
          : `الهدف التالي 🎯: كيف يمكنك استخدام "${tNext}" لوصف موقف في العمل أو المنزل؟`,
        connectedSpeechHint: `Focus on linking: "${tNext}"`,
        modelAnswerForNextQuestion: isZeroLevel ? `I see ${tNext} on the mat.` : `When I'm at home, I often ${tNext}.`,
        suggestedReplies: isZeroLevel
          ? [`I see ${tNext} on the mat.`, `It is ${tNext}.`, `Look at ${tNext}!`]
          : [`When I'm at home, I often ${tNext}.`, `My friend told me about ${tNext}.`, `It is important to ${tNext}.`]
      };
    }

    const stepNum = (turnIdx % 5) + 1;
    if (spokenText === '__START_SESSION__') {
      return {
        studentSpeechUpgrade: '',
        studentSpeechFeedbackArabic: '',
        pronunciationScore: null,
        coachReactionEnglish: isZeroLevel
          ? `Welcome to Step 1 of our Speak Class! Today we link sounds smoothly like native speakers.`
          : `Welcome to Step 1 of our Speak Class on "${activeLesson?.title}"!`,
        coachReactionArabic: isZeroLevel
          ? `مرحباً بك في الخطوة (1 من 5) من حصة المحادثة! اليوم سنتدرب على وصل الكلمات بنعومة.`
          : `مرحباً بك في الخطوة (1 من 5) من حصة المحادثة حول (${activeLesson?.title})!`,
        nextQuestionEnglish: isZeroLevel
          ? `Let's start super easy: Do you see "${tCurrent}" or "${tNext}" near you right now?`
          : `To kick things off in Step 1: When was the last time you had to use or think about "${tCurrent}"?`,
        nextQuestionArabic: isZeroLevel
          ? `لنبدأ بسؤال سهل جداً: هل ترى (${tCurrent}) أم (${tNext}) بالقرب منك الآن؟`
          : `لننطلق في الخطوة الأولى: متى كانت آخر مرة استخدمت أو فكرت فيها في (${tCurrent})؟`,
        connectedSpeechHint: isZeroLevel ? `Do you see -> D'you-see (تُنطق متصلة ككلمة واحدة)` : `had to use -> had-tə-use`,
        modelAnswerForNextQuestion: isZeroLevel ? `I see ${tCurrent} near me.` : `Just yesterday, I had to ${tCurrent}.`,
        suggestedReplies: isZeroLevel
          ? [`I see ${tCurrent} near me.`, `I see ${tNext}!`, `It is ${tCurrent}.`]
          : [`Just yesterday, I had to ${tCurrent}.`, `I use ${tCurrent} almost every day.`, `Let me share a quick example about ${tCurrent}.`]
      };
    }

    return {
      studentSpeechUpgrade: studentEval.upgrade,
      studentSpeechFeedbackArabic: studentEval.tip,
      pronunciationScore: 94,
      coachReactionEnglish: isZeroLevel
        ? `Great job on Step ${stepNum}! Your rhythm is getting smoother.`
        : `Awesome insight for Step ${stepNum}! Notice how natural that sounds.`,
      coachReactionArabic: isZeroLevel
        ? `عمل رائع في الخطوة ${stepNum}! إيقاع نطقك أصبح أكثر سلاسة.`
        : `فكرة رائعة في الخطوة ${stepNum}! لاحظ كم يبدو ذلك طبيعياً.`,
      nextQuestionEnglish: isZeroLevel
        ? `Step ${Math.min(5, stepNum + 1)}: If we put "${tNext}" in a question, can you ask me "Is this ${tNext}?" or tell me where it is?`
        : `Moving to Step ${Math.min(5, stepNum + 1)}: How would you combine "${tNext}" with your personal goal for this month?`,
      nextQuestionArabic: isZeroLevel
        ? `الخطوة ${Math.min(5, stepNum + 1)}: لو وضعنا (${tNext}) في جملة، هل يمكنك أن تسألني "Is this ${tNext}?" أو تخبرني أين هو؟`
        : `ننتقل للخطوة ${Math.min(5, stepNum + 1)}: كيف يمكنك ربط (${tNext}) بهدفك الشخصي لهذا الشهر؟`,
      connectedSpeechHint: isZeroLevel ? `Is this a -> Iz-thi-sə (اربط الزاي بالذال والهمزة الخفيفة)` : `combine with -> cəm-bine-with`,
      modelAnswerForNextQuestion: isZeroLevel ? `Is this ${tNext}? Yes, it is on the mat.` : `This month, my main goal is to ${tNext}.`,
      suggestedReplies: isZeroLevel
        ? [`Is this ${tNext}?`, `Yes, ${tNext} is on the mat.`, `This is ${tNext}.`]
        : [`This month, my main goal is to ${tNext}.`, `I definitely want to ${tNext} better.`, `I can connect ${tNext} with my daily study.`]
    };
  };

  // ============================================================================
  // 🚀 دالة إرسال كلام الطالب للمدرب الذكي (تمرر اللغة المستهدفة للسيرفر وتدعم كل اللغات!)
  // ============================================================================
  const sendToInAppVoiceCoach = async (spokenText, overrideMode = null) => {
    const activeMode = overrideMode || speakClassMode;
    setIsCoachThinking(true);
    setLiveInterimTranscript('');

    let nextMissionIdx = missionSpotlightIdx;
    let updatedHistory = [...voiceChatMessages];

    try {
      if (spokenText !== '__START_SESSION__') {
        updatedHistory.push({
          id: `stu_${Date.now()}`,
          role: 'student',
          text: spokenText,
          studentUpgrade: '',
          studentFeedbackAr: '',
          score: null
        });
        setVoiceChatMessages(updatedHistory);

        // فحص الكلمات التي نجح الطالب في توظيفها (يدعم الحروف الفرنسية واليابانية والألمانية والإسبانية!)
        const lowerSpoken = spokenText.replace(/[^\p{L}\p{N}\s]/gu, '').toLowerCase();
        lessonTargetVocabulary.forEach((vocab, vIdx) => {
          const cleanV = vocab.replace(/[^\p{L}\p{N}\s]/gu, '').toLowerCase().trim();
          if (cleanV && lowerSpoken.includes(cleanV)) {
            setUsedLessonWords(prev => {
              if (!prev.includes(vocab)) {
                setMissionBonusExp(exp => exp + 25);
                return [...prev, vocab];
              }
              return prev;
            });
            if (vIdx === missionSpotlightIdx) {
              nextMissionIdx = (missionSpotlightIdx + 1) % Math.max(1, lessonTargetVocabulary.length);
              setMissionSpotlightIdx(nextMissionIdx);
            }
          }
        });
      }

      const activeTargetWord = lessonTargetVocabulary[nextMissionIdx] || lessonTargetVocabulary[0] || '';
      const currentStepNumber = Math.min(5, localTurnCounter + 1);

      let coachData = null;
      try {
        const res = await axios.post('http://localhost:5000/api/academy2/lang-cert/live-voice-coach', {
          courseTitle: `${course?.parentCertTitle || ''} ${course?.title || ''}`.trim(),
          targetLanguage: course?.targetLanguage || activeLangConfig.nameAr,
          courseOrder: course?.courseOrder || (activeCertCourseIdx + 1) || 1,
          sectionOrder: activeLesson?.sectionOrder || 1,
          difficulty: course?.difficulty || '',
          sectionName: activeLesson?.section || '',
          lessonTitle: activeLesson?.title || '',
          lessonExcerpt: sanitizeLessonMarkdown(activeLesson?.content || '', true),
          classMode: activeMode,
          targetVocab: lessonTargetVocabulary,
          activeMissionWord: activeTargetWord,
          stepNumber: currentStepNumber,
          chatHistory: updatedHistory,
          studentSpokenText: spokenText
        }, { timeout: 18000 });

        if (res.data?.success && res.data?.data) {
          coachData = res.data.data;
        }
      } catch (err) {
        coachData = generateSmartContextualFallback(spokenText, localTurnCounter, activeMode, nextMissionIdx);
      }

      if (!coachData) {
        coachData = generateSmartContextualFallback(spokenText, localTurnCounter, activeMode, nextMissionIdx);
      }

      setLocalTurnCounter(prev => prev + 1);

      const upgradeForStudent = coachData.studentSpeechUpgrade || coachData.nativeUpgrade || '';
      const feedbackForStudent = coachData.studentSpeechFeedbackArabic || coachData.coachTipArabic || '';

      if (coachData.sceneMeta && coachData.sceneMeta.setting) {
        setRoleplaySceneMeta(coachData.sceneMeta);
      }

      const coachReactionEn = coachData.coachReactionEnglish || '';
      const nextQuestionEn = coachData.nextQuestionEnglish || coachData.replyEnglish || '';
      const fullSpokenCoachEn = [coachReactionEn, nextQuestionEn].filter(Boolean).join(' ');

      const newCoachMsgId = `coach_${Date.now()}`;
      const newCoachMsg = {
        id: newCoachMsgId,
        role: 'coach',
        reactionEnglish: coachReactionEn,
        reactionArabic: coachData.coachReactionArabic || '',
        questionEnglish: nextQuestionEn,
        questionArabic: coachData.nextQuestionArabic || coachData.replyArabicTranslation || '',
        text: fullSpokenCoachEn,
        connectedSpeechHint: coachData.connectedSpeechHint || '',
        modelAnswerForQuestion: coachData.modelAnswerForNextQuestion || (coachData.suggestedReplies?.[0] || '')
      };

      setVoiceChatMessages(prev => {
        const copy = [...prev];
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === 'student') {
            copy[i] = {
              ...copy[i],
              studentUpgrade: upgradeForStudent,
              studentFeedbackAr: feedbackForStudent,
              score: coachData.pronunciationScore || 94
            };
            break;
          }
        }
        return [...copy, newCoachMsg];
      });

      if (Array.isArray(coachData.suggestedReplies) && coachData.suggestedReplies.length > 0) {
        setSuggestedReplies(coachData.suggestedReplies);
      }

      handlePlayAudioText(fullSpokenCoachEn, 0.95, `coach_msg_${newCoachMsgId}`);
    } catch (unexpectedErr) {
      console.error('Unexpected error in voice coach:', unexpectedErr);
    } finally {
      setIsCoachThinking(false);
    }
  };

  const handleStartLiveVoiceSession = (selectedMode = speakClassMode) => {
    setSpeakClassMode(selectedMode);
    setIsVoiceSessionActive(true);
    setVoiceChatMessages([]);
    setLocalTurnCounter(0);
    setMissionSpotlightIdx(0);
    setRevealedCoachMsgIds({});
    sendToInAppVoiceCoach('__START_SESSION__', selectedMode);
  };

  const handleEndLiveVoiceSession = () => {
    handleStopAudio();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsVoiceSessionActive(false);
    setIsMicRecordingCoach(false);
    setLiveInterimTranscript('');
  };

  // ============================================================================
  // 🎙️🔥 نظام "اضغط مطولاً للتحدث" (Push-to-Talk) - يتعرف على لغة الكورس تلقائياً!
  // ============================================================================
  const startHoldToTalk = (e) => {
    if (e && e.cancelable) e.preventDefault();
    if (isCoachThinking || isMicRecordingCoach) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return alert('متصفحك لا يدعم المايكروفون المباشر، يرجى استخدام Google Chrome أو Edge.');
    }

    handleStopAudio();
    accumulatedTranscriptRef.current = '';
    setLiveInterimTranscript('');
    holdStartTimeRef.current = Date.now();

    const recognition = new SpeechRecognition();
    recognition.lang = activeLangConfig.code;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsMicRecordingCoach(true);
    };

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = 0; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += transcriptPiece + ' ';
        } else {
          interimChunk += transcriptPiece;
        }
      }
      const combined = (finalChunk + interimChunk).trim();
      accumulatedTranscriptRef.current = combined;
      setLiveInterimTranscript(combined);
    };

    recognition.onerror = () => {
      setIsMicRecordingCoach(false);
    };

    recognition.onend = () => {
      setIsMicRecordingCoach(false);
      const finalSpoken = accumulatedTranscriptRef.current.trim();
      if (finalSpoken) {
        accumulatedTranscriptRef.current = '';
        sendToInAppVoiceCoach(finalSpoken);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {}
  };

  const stopHoldToTalk = (e) => {
    if (e && e.cancelable) e.preventDefault();
    if (!isMicRecordingCoach) return;

    const heldDuration = Date.now() - holdStartTimeRef.current;
    if (heldDuration >= 350 && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
  };

  const handleManualStopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
  };

  useEffect(() => {
    if (voiceChatEndRef.current) {
      voiceChatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [voiceChatMessages, isCoachThinking, liveInterimTranscript]);

  const initBuilderGame = (itemIdx, itemsList = audioStudioItems) => {
    const targetObj = itemsList[itemIdx];
    if (!targetObj || !targetObj.sentence) return;

    const rawSent = targetObj.sentence.trim();
    const words = rawSent.split(/\s+/);

    const tokens = words.length === 1
      ? rawSent.split('').map((ch, i) => ({ id: `t_${i}_${ch}`, text: ch }))
      : words.map((w, i) => ({ id: `t_${i}_${w}`, text: w }));

    const shuffled = [...tokens].sort(() => Math.random() - 0.5);
    setBuilderTargetIdx(itemIdx);
    setScrambledTokens(shuffled);
    setSelectedTokens([]);
    setBuilderSuccess(null);
  };

  useEffect(() => {
    handleStopAudio();
    setSpeechCheckResult(null);
    setActiveCardIdx(0);
    setIsCardFlipped(false);
    setIsVoiceSessionActive(false);
    setVoiceChatMessages([]);
    setUsedLessonWords([]);
    setRoleplaySceneMeta(null);
    setMissionSpotlightIdx(0);
    if (activeLesson) {
      if (activeLesson.section) {
        setOpenSections(prev => ({ ...prev, [activeLesson.section]: true }));
      }
      setStudentCode(activeLesson.codingPractice?.starterCode || '');
      setRevealedHintsCount(0);
      setShowSolution(false);
      setCodeFeedback(null);

      const parsedAudio = parseAudioShadowingSnippet(activeLesson.codeSnippet || '');
      if (parsedAudio.length > 0) {
        initBuilderGame(0, parsedAudio);
      }
    }
  }, [activeLesson]);

  const handleTapScrambledToken = (tokenObj) => {
    const nextSelected = [...selectedTokens, tokenObj];
    const nextScrambled = scrambledTokens.filter(t => t.id !== tokenObj.id);
    setSelectedTokens(nextSelected);
    setScrambledTokens(nextScrambled);

    handlePlayAudioText(tokenObj.text, 1.0, `token_${tokenObj.id}`);

    if (nextScrambled.length === 0 && audioStudioItems[builderTargetIdx]) {
      const targetSent = audioStudioItems[builderTargetIdx].sentence.trim();
      const isSingleWord = targetSent.split(/\s+/).length === 1;
      const assembled = nextSelected.map(t => t.text).join(isSingleWord ? '' : ' ');

      if (assembled.toLowerCase() === targetSent.toLowerCase()) {
        setBuilderSuccess(true);
        setTimeout(() => handlePlayAudioText(targetSent, 1.0, 'builder_win'), 350);
      } else {
        setBuilderSuccess(false);
      }
    }
  };

  const handleRemoveSelectedToken = (tokenObj) => {
    setSelectedTokens(prev => prev.filter(t => t.id !== tokenObj.id));
    setScrambledTokens(prev => [...prev, tokenObj]);
    setBuilderSuccess(null);
  };

  const handleCompleteLesson = async () => {
    const token = localStorage.getItem('cherif_token');
    if (!token || String(activeLesson?._id).startsWith('lesson_')) {
      if (!completedLessons.includes(activeLesson._id)) {
        setCompletedLessons(prev => [...prev, activeLesson._id]);
      }
      const currentIndex = lessons.findIndex(l => l._id === activeLesson._id);
      if (currentIndex < lessons.length - 1) {
        setActiveLesson(lessons[currentIndex + 1]);
        resetQuestState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        solutionCode: activeLesson.codingPractice.solutionCode,
        targetLanguage: activeLangConfig.nameAr,
        isLanguageTask: isLanguageLesson
      });

      if (res.data.success) {
        setCodeFeedback(res.data.data);
      }
    } catch (err) {
      const normalize = (str) => (str || '')
        .replace(/\/\/.*$/gm, '')
        .replace(/#.*$/gm, '')
        .replace(/✅.*$/gm, '')
        .replace(/\s+/g, ' ')
        .toLowerCase()
        .trim();

      const cleanStudent = normalize(studentCode);
      const cleanSolution = normalize(activeLesson.codingPractice?.solutionCode || '');

      const solutionWords = cleanSolution.split(' ').filter(w => w.length > 1);
      const matchedWords = solutionWords.filter(w => cleanStudent.includes(w));
      const matchRatio = solutionWords.length > 0 ? matchedWords.length / solutionWords.length : 0;
      const isMatch = cleanStudent.length >= 3 && (matchRatio >= 0.5 || cleanSolution.includes(cleanStudent));

      setCodeFeedback({
        isCorrect: isMatch,
        feedback: isMatch 
          ? '🎉 أحسنت يا بطل! إجابتك وتركيبك للجمل سليم ومطابق للمعايير القياسية ببراعة.' 
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

  const isLanguageLesson = Boolean(
    activeLesson?.lessonCategory === 'language_mastery' ||
    activeLesson?.codeSnippet?.includes('IPA:') ||
    activeLesson?.codeSnippet?.includes('🎧') ||
    /Pre-A1|A0|A1|A2|B1|B2|C1|C2|Phonics|Lego|Shadowing|Collocations|الحروف|اللغة|متلازمات|فرنس|يابان|ألمان|إسبان|صين/i.test(`${course?.title || ''} ${activeLesson?.title || ''}`)
  );

  const activeUnitSummary = useMemo(() => {
    if (!activeLesson?.section) return null;
    if (unitSummariesMap[activeLesson.section]) return unitSummariesMap[activeLesson.section];
    const keys = Object.keys(unitSummariesMap);
    const matchedKey = keys.find(k => k.includes(activeLesson.section) || activeLesson.section.includes(k));
    return matchedKey ? unitSummariesMap[matchedKey] : null;
  }, [activeLesson, unitSummariesMap]);

  const isGateOrExam = activeLesson?.type === 'boss_quiz' || activeLesson?.type === 'red_gate' || activeLesson?.type === 'unit_exam';
  let isLocked = false;
  if (!isCurrentLessonCompleted && isGateOrExam) {
    isLocked = questStatus !== 'success';
  }

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#020617]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div></div>;

  const currentFlashcard = audioStudioItems[activeCardIdx] || null;
  const currentBuilderItem = audioStudioItems[builderTargetIdx] || null;
  const activeMissionTargetWord = lessonTargetVocabulary[missionSpotlightIdx % Math.max(1, lessonTargetVocabulary.length)] || '';
  const currentSpeakClassStep = Math.min(5, Math.max(1, localTurnCounter));

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

        @keyframes soundWave {
          0%, 100% { height: 8px; }
          50% { height: 28px; }
        }
        .wave-bar {
          animation: soundWave 0.7s ease-in-out infinite;
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
            title="فتح ملف JSON للكورس أو الشهادة الكاملة مباشرة"
          >
            <Upload size={12} /> فتح JSON
          </button>

          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {certificateCoursesList.length > 1 && (
          <div className="p-3.5 bg-indigo-950/30 border-b border-indigo-500/30 space-y-2">
            <label className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
              <Layers size={13} className="text-amber-400" /> اختر الكراش كورس من الشهادة ({certificateCoursesList.length}):
            </label>
            <select
              value={activeCertCourseIdx}
              onChange={(e) => handleSwitchCertificateCourse(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-2.5 py-2 text-xs text-white font-bold outline-none cursor-pointer"
            >
              {certificateCoursesList.map((c, idx) => {
                const hasLessons = (c.sections || []).some(s => (s.lessons || []).length > 0);
                return (
                  <option key={idx} value={idx}>
                    {hasLessons ? '✅ ' : '⏳ '} كورس {idx + 1}: {cleanCourseTitleText(c.courseTitle).slice(0, 38)}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        
        <div className="p-5 border-b border-slate-800/60 bg-gradient-to-b from-[#0f172a]/50 to-transparent">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {course?.certificateBadge && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full">
                <Award size={11} /> {course.certificateBadge}
              </span>
            )}
            {isLanguageLesson && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                {activeLangConfig.flag} {activeLangConfig.nameAr}
              </span>
            )}
          </div>
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
      {/* 📖 مساحة القراءة واستوديو Speak Class التفاعلي */}
      {/* ======================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#020617] scroll-smooth">
        <div className="md:hidden bg-[#0b1120] border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-300 hover:text-white flex items-center gap-2"><Menu size={20} /> <span className="font-bold text-sm">المنهج</span></button>
          <span className="font-semibold text-white text-sm truncate max-w-[200px]">{activeLesson?.title}</span>
        </div>

        <div className="max-w-[940px] mx-auto w-full px-6 py-10 md:px-12 md:py-14">
          {activeLesson ? (
            <div className="animate-fade-in-up">

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
                           : activeLesson.type === 'unit_exam' ? <><Trophy size={16} /> الاختبار النهائي الشامل للوحدة</>
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
                                {q.questionType === 'code' ? '✍️ سؤال تطبيقي وتركيب جمل' : '🗣️ سؤال صوتي ومفاهيمي'}
                              </span>
                            )}
                            
                            <div className="text-slate-100 font-semibold text-[17px] md:text-[18px] mb-6 leading-[1.8]">
                               <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
                /* 📘 الدرس العادي: الشرح + استوديو Speak Class الثلاثي الاحترافي */
                /* ======================================================= */
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {activeLesson.section && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                        <BookOpen size={13} />
                        <span>{activeLesson.section}</span>
                      </div>
                    )}
                    {isLanguageLesson && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                        <span>{activeLangConfig.flag}</span>
                        <span>النطق الصوتي المفعّل: {activeLangConfig.nameAr} ({activeLangConfig.code})</span>
                      </div>
                    )}
                  </div>

                  <h1 className="heading-font text-2xl sm:text-3xl md:text-[34px] font-extrabold text-white mb-4 leading-[1.45] tracking-normal">
                    {activeLesson.title}
                  </h1>
                  
                  {activeLesson.description && (
                    <p className="text-[16px] md:text-[18px] text-slate-400 mb-8 pb-6 border-b border-slate-800/80 leading-[1.8] font-normal">
                      {cleanLessonDesc(activeLesson.description)}
                    </p>
                  )}

                  {visualWidgets.legoEquations.length > 0 && (
                    <div className="mb-10 bg-gradient-to-br from-amber-950/25 via-[#0b1120] to-[#0b1120] border-2 border-amber-500/35 rounded-2xl p-6 shadow-xl">
                      <h3 className="heading-font text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <Puzzle size={20} /> 🧩 معادلة مكعبات الليغو لبناء الصوت والجملة (Lego Formula):
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

                  {visualWidgets.ladderSteps.length > 0 && (
                    <div className="mb-10 bg-gradient-to-br from-indigo-950/30 via-[#0b1120] to-[#0b1120] border-2 border-indigo-500/35 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                        <h3 className="heading-font text-lg font-bold text-indigo-300 flex items-center gap-2">
                          <Layers size={20} className="text-emerald-400" /> 🪜 سُلّم البناء التراكمي الناطق باللغة {activeLangConfig.nameAr} (اضغط على كل درجة لسماعها):
                        </h3>
                        <span className="text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                          من كلمة واحدة ➔ جملة كاملة 🔊
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {visualWidgets.ladderSteps.map((step, sIdx) => {
                          const widthPercent = Math.min(100, 62 + sIdx * 8);
                          return (
                            <div
                              key={sIdx}
                              onClick={() => step.englishText && handlePlayAudioText(step.englishText, 0.9, `ladder_${sIdx}`)}
                              style={{ width: `${widthPercent}%` }}
                              className="min-w-[270px] bg-slate-950/90 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 p-3.5 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-black text-xs flex items-center justify-center shrink-0">
                                  {sIdx + 1}
                                </span>
                                <span className="text-sm md:text-[15px] text-slate-200 group-hover:text-white font-medium">
                                  {step.rawText}
                                </span>
                              </div>
                              {step.englishText && (
                                <button
                                  type="button"
                                  className="shrink-0 bg-purple-500/15 group-hover:bg-purple-600 text-purple-300 group-hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                                >
                                  <Volume2 size={13} /> اسمع
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
                          table({children}) {
                            return (
                              <div className="my-7 overflow-x-auto rounded-2xl border-2 border-slate-800 bg-[#070c18] shadow-2xl">
                                <table className="w-full text-right border-collapse text-sm md:text-[15px]">
                                  {children}
                                </table>
                              </div>
                            )
                          },
                          thead({children}) {
                            return <thead className="bg-slate-900/95 border-b-2 border-slate-800 text-xs md:text-sm font-black text-indigo-300">{children}</thead>
                          },
                          tbody({children}) {
                            return <tbody className="divide-y divide-slate-800/80">{children}</tbody>
                          },
                          tr({children}) {
                            return <tr className="hover:bg-slate-900/60 transition-colors">{children}</tr>
                          },
                          th({children}) {
                            return <th className="p-3.5 md:p-4 font-bold text-right">{children}</th>
                          },
td({children}) {
                            const extractRawString = (node) => {
                              if (typeof node === 'string') return node;
                              if (Array.isArray(node)) return node.map(extractRawString).join('');
                              if (node?.props?.children) return extractRawString(node.props.children);
                              return '';
                            };
                            const cellText = extractRawString(children).trim();
                            const isWrongCell = cellText.includes('❌');
                            const isRightCell = cellText.includes('✅');
                            const isPureForeignWord =
                              cellText.length >= 1 &&
                              cellText.length <= 35 &&
                              !cellText.includes('/') &&
                              !/[\u0600-\u06FF]/.test(cellText) &&
                              /[\p{L}]/u.test(cellText);

                            const genderBadge = isPureForeignWord ? detectGrammaticalGenderBadge(cellText) : null;

                            return (
                              <td className={`p-3.5 md:p-4 leading-relaxed ${
                                isWrongCell ? 'bg-red-950/15 text-red-200 font-medium'
                                : isRightCell ? 'bg-emerald-950/15 text-emerald-200 font-bold'
                                : 'text-slate-200'
                              }`}>
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1.5 flex-wrap">
                                    {isPureForeignWord && <span className="ml-1">{getEmojiForText(cellText)}</span>}
                                    <span>{children}</span>
                                    {genderBadge && (
                                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${genderBadge.classes}`}>
                                        {genderBadge.label}
                                      </span>
                                    )}
                                  </span>
                                  {isPureForeignWord && (
                                    <button
                                      type="button"
                                      onClick={() => handlePlayAudioText(cellText.split('/')[0].trim(), 0.9, `tbl_${cellText}`)}
                                      className="shrink-0 bg-purple-500/15 hover:bg-purple-600 text-purple-300 hover:text-white p-1.5 rounded-lg border border-purple-500/30 transition-all"
                                      title={`استمع لنطق: ${cellText}`}
                                    >
                                      <Volume2 size={13} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            );
                          },

                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeStr = String(children).replace(/\n$/, '');
                            const isShortForeignPhrase =
                              (inline || !match) &&
                              codeStr.length < 65 &&
                              !/[\u0600-\u06FF]/.test(codeStr) &&
                              /[\p{L}]/u.test(codeStr) &&
                              !codeStr.includes('[');

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
                                  {codeStr}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code
                                onClick={() => isShortForeignPhrase && handlePlayAudioText(codeStr.replace(/\.\.\./g, ''), 0.9, `inline_${codeStr}`)}
                                className={`code-font bg-slate-800/90 text-emerald-300 px-2 py-0.5 rounded-md text-[0.9em] border border-slate-700/60 mx-0.5 inline-flex items-center gap-1 ${
                                  isShortForeignPhrase ? 'cursor-pointer hover:bg-purple-900/50 hover:border-purple-400 hover:text-white transition-all' : ''
                                }`}
                                dir="ltr"
                                title={isShortForeignPhrase ? `اضغط لسماع النطق باللغة ${activeLangConfig.nameAr} 🔊` : ''}
                                {...props}
                              >
                                {children}
                                {isShortForeignPhrase && <Volume2 size={11} className="text-purple-400 shrink-0" />}
                              </code>
                            )
                          }
                        }}
                      >
                        {sanitizeLessonMarkdown(activeLesson.content, true)}
                      </ReactMarkdown>
                    ) : (
                      <div className="text-center py-24">
                        <BookOpen size={48} className="mx-auto text-slate-700 mb-4 animate-pulse" />
                        <p className="text-slate-500 text-lg font-medium">محتوى هذا الدرس قيد التجهيز...</p>
                      </div>
                    )}
                  </div>

                  {visualWidgets.mistakeRows.length > 0 && (
                    <div className="mt-10 bg-[#0b1120] border-2 border-emerald-500/35 rounded-2xl p-6 shadow-xl">
                      <h3 className="heading-font text-lg md:text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <CheckCircle size={20} /> 📋 جدول الخلاصة التصحيحية: لا تقل كذا ❌ .. بل قل كذا ✅
                      </h3>
                      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                        <table className="w-full text-right border-collapse text-sm">
                          <thead>
                            <tr className="bg-slate-900 border-b border-slate-800 text-xs font-bold">
                              <th className="p-3.5 text-red-400">❌ الخطأ الشائع</th>
                              <th className="p-3.5 text-emerald-400">✅ الصواب الأصيل (Native Way)</th>
                              <th className="p-3.5 text-amber-300">💡 التفسير اللغوي</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80">
                            {visualWidgets.mistakeRows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-900/40">
                                <td className="p-3.5 text-red-200/90 bg-red-950/10">{row.wrong}</td>
                                <td className="p-3.5 text-emerald-200 font-semibold bg-emerald-950/10">{row.right}</td>
                                <td className="p-3.5 text-slate-300 text-xs leading-relaxed">{row.reason || `تطبيق القاعدة الصحيحة في اللغة ${activeLangConfig.nameAr}.`}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* 🎙️🔥 4. استوديو "Speak Class" الثلاثي الاحترافي (متعدد اللغات) */}
                  {/* ======================================================= */}
                  {(isLanguageLesson || visualWidgets.voicePrompt) && (
                    <div className="mt-12 bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#131129] border-2 border-indigo-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(99,102,241,0.12)] space-y-6">
                      
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/90 pb-5">
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${
                            speakingKey.startsWith('coach_msg_')
                              ? 'bg-purple-500/25 border-purple-400 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                              : isMicRecordingCoach
                                ? 'bg-rose-500/25 border-rose-400 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.5)]'
                                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          }`}>
                            <Radio size={28} className={isVoiceSessionActive ? 'animate-pulse' : ''} />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[11px] font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                                🎙️ LIVE SPEAK CLASS ({activeLangConfig.flag} {activeLangConfig.nameAr})
                              </span>
                              <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                                متكيف مع مستوى: {activeLesson.section}
                              </span>
                            </div>
                            <h3 className="heading-font text-xl md:text-2xl font-black text-white">
                              غرفة المحادثة الحية باللغة {activeLangConfig.nameAr}: {activeLesson.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                              اختر نوع الغرفة التدريبية بالأسفل، وتحدث باللغة {activeLangConfig.nameAr} باستخدام تقنية <strong className="text-emerald-300">اضغط مطولاً للتحدث (Push-to-Talk)</strong>!
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                          <button
                            type="button"
                            onClick={() => setBlindListeningMode(!blindListeningMode)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                              blindListeningMode
                                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                            }`}
                            title="إخفاء نص المعلم مؤقتاً لتدريب أذنك على الفهم السمعي أولاً قبل القراءة!"
                          >
                            {blindListeningMode ? <EyeOff size={14} /> : <Headphones size={14} />}
                            {blindListeningMode ? 'وضع تدريب الأذن السمعي: مفعّل 🎧' : 'تفعيل وضع تدريب الأذن 🎧'}
                          </button>

                          {isVoiceSessionActive && (
                            <button
                              type="button"
                              onClick={handleEndLiveVoiceSession}
                              className="bg-red-500/15 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                            >
                              <PhoneOff size={15} /> إنهاء الجلسة
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          {
                            id: 'speak_class',
                            title: '👩‍🏫 حصة محادثة ومناقشة',
                            desc: '5 خطوات متدرجة مع الأستاذ لشرح وتطبيق الدرس صوتياً',
                            activeColor: 'bg-indigo-600/25 border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.2)]'
                          },
                          {
                            id: 'roleplay',
                            title: '🎭 تمثيل موقف حقيقي (Roleplay)',
                            desc: 'تقمص سيناريو واقعي وشخصيات حية من الحياة اليومية',
                            activeColor: 'bg-purple-600/25 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                          },
                          {
                            id: 'mission',
                            title: '🎯 تحدي توظيف مفردات الدرس',
                            desc: 'رادار يطلب منك كلمة محددة في كل جولة لتكسب +25 EXP!',
                            activeColor: 'bg-emerald-600/25 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                          }
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setSpeakClassMode(m.id);
                              if (isVoiceSessionActive) handleStartLiveVoiceSession(m.id);
                            }}
                            className={`p-4 rounded-2xl border-2 text-right transition-all ${
                              speakClassMode === m.id
                                ? `${m.activeColor} text-white`
                                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <p className="heading-font font-bold text-xs sm:text-sm text-white">{m.title}</p>
                            <p className="text-[11px] text-slate-300/80 mt-1 leading-relaxed">{m.desc}</p>
                          </button>
                        ))}
                      </div>

                      {speakClassMode === 'speak_class' && (
                        <div className="bg-indigo-950/30 border border-indigo-500/35 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-black text-sm shrink-0">
                              {currentSpeakClassStep}/5
                            </div>
                            <div>
                              <span className="text-xs font-bold text-indigo-300 block">
                                👩‍🏫 مسار حصة الأستاذ الخصوصي للغة {activeLangConfig.nameAr} (Guided 5-Step Speak Class):
                              </span>
                              <p className="text-xs text-slate-300 mt-0.5">
                                الأستاذ يسير معك في 5 أسئلة تفاعلية متدرجة لضبط النطق، الوصل الصوتي، وتكوين الجمل باللغة {activeLangConfig.nameAr}.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {[1, 2, 3, 4, 5].map(st => (
                              <span
                                key={st}
                                className={`w-6 h-2 rounded-full transition-all ${
                                  st <= currentSpeakClassStep ? 'bg-emerald-400' : 'bg-slate-800'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {speakClassMode === 'roleplay' && (
                        <div className="bg-purple-950/30 border border-purple-500/40 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                              <Compass size={15} /> 🎬 بطاقة المشهد التمثيلي الحي (Live Roleplay Scenario):
                            </span>
                            <span className="text-[11px] bg-purple-500/20 text-purple-200 px-2.5 py-0.5 rounded-full font-bold">
                              حوار تمثيلي واقعي باللغة {activeLangConfig.nameAr}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                              <span className="text-slate-400 block mb-0.5">📍 المكان (Setting):</span>
                              <strong className="text-white">{roleplaySceneMeta?.setting || 'مشهد واقعي من صلب الوحدة'}</strong>
                            </div>
                            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                              <span className="text-slate-400 block mb-0.5">👤 الشخصية المحاورة (AI Role):</span>
                              <strong className="text-purple-300">{roleplaySceneMeta?.aiRole || 'شريك المحادثة الواقعي'}</strong>
                            </div>
                            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                              <span className="text-slate-400 block mb-0.5">🎯 مهمتك في المشهد:</span>
                              <strong className="text-emerald-300">{roleplaySceneMeta?.studentGoal || `التفاعل واستخدام عبارات (${activeLesson.title})`}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {speakClassMode === 'mission' && lessonTargetVocabulary.length > 0 && (
                        <div className="bg-emerald-950/25 border-2 border-emerald-500/40 rounded-2xl p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Target size={18} className="text-amber-400 animate-bounce" />
                              <span className="text-xs sm:text-sm font-black text-white">
                                🎯 رادار الكلمة المطلوبة في ردك الآن:
                              </span>
                              <button
                                type="button"
                                onClick={() => handlePlayAudioText(activeMissionTargetWord, 0.85, 'mission_target_spot')}
                                className="bg-amber-500 text-slate-950 font-black text-xs sm:text-sm px-3.5 py-1 rounded-xl flex items-center gap-1.5 shadow"
                                dir="ltr"
                              >
                                <Volume2 size={14} /> "{activeMissionTargetWord}"
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                                ⚡ مكافأة التحدي: +{missionBonusExp} EXP
                              </span>
                              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                قنصتَ {usedLessonWords.length} / {lessonTargetVocabulary.length}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1" dir="ltr">
                            {lessonTargetVocabulary.map((vocab, vIdx) => {
                              const isUsed = usedLessonWords.includes(vocab);
                              const isCurrentSpot = vocab === activeMissionTargetWord;
                              return (
                                <button
                                  key={vIdx}
                                  type="button"
                                  onClick={() => {
                                    setMissionSpotlightIdx(vIdx);
                                    handlePlayAudioText(vocab, 0.9, `vocab_chip_${vIdx}`);
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                                    isUsed
                                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                      : isCurrentSpot
                                        ? 'bg-amber-500/25 border-2 border-amber-400 text-amber-200 scale-105'
                                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                                  }`}
                                >
                                  {isUsed ? <CheckCircle size={13} className="text-emerald-400" /> : <Volume2 size={13} className="text-purple-400" />}
                                  <span>{vocab}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {!isVoiceSessionActive ? (
                        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-8 text-center space-y-5">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 to-indigo-500/20 border-2 border-emerald-400/50 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.25)]">
                            <Mic size={36} />
                          </div>
                          <div className="max-w-lg mx-auto space-y-2">
                            <h4 className="heading-font font-black text-white text-lg md:text-xl">
                              {speakClassMode === 'roleplay'
                                ? `جاهز لبدء تمثيل الموقف الواقعي باللغة ${activeLangConfig.nameAr}؟`
                                : speakClassMode === 'mission'
                                  ? `جاهز لبدء تحدي قنص وتوظيف مفردات اللغة ${activeLangConfig.nameAr}؟`
                                  : `جاهز لبدء حصة المحادثة باللغة ${activeLangConfig.nameAr} (5 خطوات)؟`}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                              اضغط على الزر بالأسفل ليبدأ المدرب الصوتي فوراً بالتحدث معك باللغة {activeLangConfig.nameAr} على مستوى <strong className="text-white">({activeLesson.section})</strong>!
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleStartLiveVoiceSession(speakClassMode)}
                            className="heading-font bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm md:text-base px-8 py-4 rounded-2xl inline-flex items-center gap-2.5 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all"
                          >
                            <PhoneCall size={20} />
                            {speakClassMode === 'roleplay'
                              ? 'ابدأ تمثيل المشهد الواقعي الآن 🎭'
                              : speakClassMode === 'mission'
                                ? 'ابدأ تحدي مفردات الدرس الآن 🎯'
                                : 'ابدأ حصة المحادثة مع الأستاذ الآن 👩‍🏫'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          
                          <div className="bg-[#050811] border border-slate-800 rounded-2xl p-4 md:p-6 max-h-[460px] overflow-y-auto space-y-5 custom-scrollbar">
                            {voiceChatMessages.map((msg, mIdx) => {
                              const isTextHiddenForEarTraining = blindListeningMode && msg.role === 'coach' && !revealedCoachMsgIds[msg.id];

                              return (
                                <div
                                  key={msg.id || mIdx}
                                  className={`flex flex-col ${msg.role === 'coach' ? 'items-start' : 'items-end'}`}
                                >
                                  {msg.role === 'student' ? (
                                    <div className="max-w-[90%] rounded-2xl p-4 md:p-5 space-y-3 bg-gradient-to-br from-emerald-950/60 to-teal-950/40 border border-emerald-500/40 text-emerald-100 shadow-lg">
                                      <div className="flex items-center justify-between gap-4 border-b border-emerald-500/20 pb-2">
                                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                                          <UserCheck size={14} /> ما قلته أنت (Your Spoken Reply)
                                        </span>
                                        {typeof msg.score === 'number' && (
                                          <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                                            الطلاقة: {msg.score}%
                                          </span>
                                        )}
                                      </div>

                                      <p className="text-base md:text-[17px] font-bold text-white leading-relaxed" dir="ltr">
                                        "{msg.text}"
                                      </p>

                                      {msg.studentUpgrade && (
                                        <div className="bg-slate-950/90 border border-emerald-400/40 rounded-xl p-3 flex items-center justify-between gap-3" dir="ltr">
                                          <div>
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                                              ✨ Native {activeLangConfig.nameEn} Upgrade (كيف نصوغ جملتك كمتحدث أصلي):
                                            </span>
                                            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                                              "{msg.studentUpgrade}"
                                            </p>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handlePlayAudioText(msg.studentUpgrade, 0.92, `stu_up_${mIdx}`)}
                                            className="shrink-0 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 p-2 rounded-lg transition-all"
                                            title="اسمع كيف تنطق جملتك بالصياغة الاحترافية"
                                          >
                                            <Volume2 size={15} />
                                          </button>
                                        </div>
                                      )}

                                      {msg.studentFeedbackAr && (
                                        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-200 leading-relaxed">
                                          {msg.studentFeedbackAr}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="max-w-[92%] rounded-2xl p-4 md:p-5 space-y-3 bg-gradient-to-br from-slate-900 to-[#0e172a] border border-indigo-500/35 text-white shadow-lg">
                                      <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-2">
                                        <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                                          <Bot size={15} className="text-emerald-400" />
                                          {speakClassMode === 'roleplay'
                                            ? (roleplaySceneMeta?.aiRole || 'شريك المشهد التمثيلي')
                                            : speakClassMode === 'mission'
                                              ? 'حكم تحدي المفردات (Mission Coach)'
                                              : `الأستاذ المحاور (الخطوة ${Math.min(5, Math.ceil((mIdx + 1) / 2))} من 5)`}
                                        </span>

                                        <div className="flex items-center gap-1.5">
                                          {blindListeningMode && (
                                            <button
                                              type="button"
                                              onClick={() => setRevealedCoachMsgIds(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                                              className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                                            >
                                              <Eye size={12} /> {isTextHiddenForEarTraining ? 'اكشف النص' : 'إخفاء النص'}
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => handlePlayAudioText(msg.text, 0.96, `replay_${mIdx}`)}
                                            className="bg-purple-500/20 hover:bg-purple-600 text-purple-300 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                                          >
                                            <Volume2 size={12} /> 1.0x
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handlePlayAudioText(msg.text, 0.68, `replay_slow_${mIdx}`)}
                                            className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 px-2 py-1 rounded-lg text-[11px] font-bold transition-all"
                                            title="نطق بطيء لتدريب الأذن"
                                          >
                                            🐢 0.7x
                                          </button>
                                        </div>
                                      </div>

                                      {isTextHiddenForEarTraining ? (
                                        <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 text-center space-y-2">
                                          <p className="text-xs text-amber-300 font-bold">
                                            🎧 وضع تدريب الأذن مفعّل: استمع لصوت المعلم بـ (1.0x أو 0.7x) وحاول فهم السؤال بأذنك أولاً!
                                          </p>
                                          <button
                                            type="button"
                                            onClick={() => setRevealedCoachMsgIds(prev => ({ ...prev, [msg.id]: true }))}
                                            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                                          >
                                            <Eye size={13} /> اكشف النص والترجمة الآن
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          {msg.reactionEnglish && (
                                            <div className="space-y-1">
                                              <p className="text-sm sm:text-base text-emerald-300 font-semibold" dir="ltr">
                                                {msg.reactionEnglish}
                                              </p>
                                              {msg.reactionArabic && (
                                                <p className="text-xs text-slate-400">
                                                  {msg.reactionArabic}
                                                </p>
                                              )}
                                            </div>
                                          )}

                                          {msg.questionEnglish && (
                                            <div className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-3.5 space-y-1.5">
                                              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">
                                                ❓ السؤال أو الموقف الموجه لك الآن ({activeLangConfig.nameAr}):
                                              </span>
                                              <p className="text-base md:text-[17.5px] font-black text-white leading-relaxed" dir="ltr">
                                                {msg.questionEnglish}
                                              </p>
                                              {msg.questionArabic && (
                                                <p className="text-xs sm:text-sm text-slate-300 pt-1">
                                                  💬 {msg.questionArabic}
                                                </p>
                                              )}
                                            </div>
                                          )}

                                          {msg.connectedSpeechHint && (
                                            <div className="bg-purple-950/25 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-purple-200 flex items-center justify-between gap-2" dir="ltr">
                                              <span>🔗 <strong>Connected Speech:</strong> {msg.connectedSpeechHint}</span>
                                            </div>
                                          )}

                                          {msg.modelAnswerForQuestion && (
                                            <div className="bg-indigo-950/35 border border-indigo-500/35 rounded-xl p-3 flex items-center justify-between gap-3" dir="ltr">
                                              <div>
                                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-wider block">
                                                  🎯 مثال لإجابة أصيلة باللغة {activeLangConfig.nameAr} على هذا السؤال:
                                                </span>
                                                <p className="text-xs sm:text-sm font-bold text-emerald-300 mt-0.5">
                                                  "{msg.modelAnswerForQuestion}"
                                                </p>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => handlePlayAudioText(msg.modelAnswerForQuestion, 0.9, `model_ans_${mIdx}`)}
                                                className="shrink-0 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-200 hover:text-white p-2 rounded-lg transition-all"
                                                title="اسمع كيف تجيب على هذا السؤال"
                                              >
                                                <Volume2 size={15} />
                                              </button>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {isMicRecordingCoach && (
                              <div className="flex flex-col items-end animate-fade-in">
                                <div className="bg-rose-950/40 border-2 border-rose-500/60 text-white rounded-2xl p-4 max-w-[85%] space-y-2 shadow-[0_0_25px_rgba(244,63,94,0.25)]">
                                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                                    <span>جاري التقاط صوتك باللغة {activeLangConfig.nameAr}... (ارفع إصبعك للإرسال)</span>
                                  </div>
                                  <p className="text-base font-bold text-emerald-300 min-h-[24px]" dir="ltr">
                                    {liveInterimTranscript || 'Listening to your voice...'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {isCoachThinking && (
                              <div className="flex items-center gap-2.5 text-xs font-bold text-indigo-300 bg-slate-900/90 border border-indigo-500/30 px-4 py-3 rounded-xl w-fit animate-pulse">
                                <Bot size={16} className="text-emerald-400" /> جاري تحليل نطقك باللغة {activeLangConfig.nameAr} وتجهيز الخطوة التالية...
                              </div>
                            )}
                            <div ref={voiceChatEndRef} />
                          </div>

                          {suggestedReplies.length > 0 && (
                            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                                <Lightbulb size={13} /> 💡 ردود مقترحة باللغة {activeLangConfig.nameAr} للسؤال الحالي (اسمعها بـ 🔊 أو اضغط عليها):
                              </span>
                              <div className="flex flex-wrap gap-2" dir="ltr">
                                {suggestedReplies.map((sug, sIdx) => (
                                  <div key={sIdx} className="inline-flex items-center bg-slate-900 border border-slate-700 hover:border-indigo-500/50 rounded-xl overflow-hidden transition-all">
                                    <button
                                      type="button"
                                      onClick={() => handlePlayAudioText(sug, 0.9, `sug_listen_${sIdx}`)}
                                      className="bg-purple-500/20 hover:bg-purple-600 text-purple-300 hover:text-white px-2.5 py-2 text-xs font-bold flex items-center gap-1 border-r border-slate-700"
                                      title="اسمع النطق"
                                    >
                                      <Volume2 size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => sendToInAppVoiceCoach(sug)}
                                      className="px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all text-left"
                                    >
                                      {sug}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
                            
                            {!isMicRecordingCoach ? (
                              <button
                                type="button"
                                onMouseDown={startHoldToTalk}
                                onMouseUp={stopHoldToTalk}
                                onTouchStart={startHoldToTalk}
                                onTouchEnd={stopHoldToTalk}
                                disabled={isCoachThinking}
                                className="heading-font flex-1 py-4 px-6 rounded-xl font-black text-sm md:text-base flex items-center justify-center gap-3 bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.35)] active:scale-[0.99] transition-all select-none cursor-pointer"
                              >
                                <Mic size={22} />
                                <span>🎙️ اضغط مطولاً للتحدث باللغة {activeLangConfig.nameAr} (أو اضغط مرة للتسجيل الحر)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onMouseUp={stopHoldToTalk}
                                onTouchEnd={stopHoldToTalk}
                                onClick={handleManualStopRecording}
                                className="heading-font flex-1 py-4 px-6 rounded-xl font-black text-sm md:text-base flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse select-none cursor-pointer"
                              >
                                <div className="flex items-center gap-1 h-5">
                                  <span className="w-1 bg-white rounded-full wave-bar" style={{ animationDelay: '0s' }} />
                                  <span className="w-1 bg-white rounded-full wave-bar" style={{ animationDelay: '0.2s' }} />
                                  <span className="w-1 bg-white rounded-full wave-bar" style={{ animationDelay: '0.4s' }} />
                                </div>
                                <span>🔴 جاري الاستماع ({activeLangConfig.nameAr})... ارفع إصبعك (أو اضغط هنا) لإرسال ردك</span>
                              </button>
                            )}

                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (!coachTextInput.trim()) return;
                                sendToInAppVoiceCoach(coachTextInput.trim());
                                setCoachTextInput('');
                              }}
                              className="flex items-center gap-2 md:w-[320px]"
                              dir="ltr"
                            >
                              <input
                                type="text"
                                value={coachTextInput}
                                onChange={(e) => setCoachTextInput(e.target.value)}
                                placeholder={`Type in ${activeLangConfig.nameEn}...`}
                                className="flex-1 bg-[#060b16] border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-3.5 text-xs text-white outline-none"
                              />
                              <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-xl transition-all"
                                title="إرسال"
                              >
                                <Send size={16} />
                              </button>
                            </form>
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* 🎧🃏🧩 5. المختبر الصوتي التفاعلي ثلاثي الأطوار (متعدد اللغات) */}
                  {/* ======================================================= */}
                  {activeLesson.codeSnippet && activeLesson.codeSnippet.trim() !== '' && (
                    <div className="mt-12 mb-12 pt-8 border-t border-slate-800/70">
                      
                      {audioStudioItems.length > 0 ? (
                        <div className="bg-[#0b1120] border-2 border-purple-500/40 rounded-2xl p-6 md:p-7 shadow-2xl space-y-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                            <div>
                              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5 mb-1">
                                <Headphones size={15} /> Interactive {activeLangConfig.nameEn} Phonics & Audio Studio ({activeLangConfig.flag})
                              </span>
                              <h3 className="heading-font text-xl md:text-2xl font-bold text-white">
                                🎧 استوديو الصوتيات ({activeLangConfig.nameAr})، بطاقات الذاكرة، ولعبة تركيب المكعبات
                              </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                              {[
                                { id: 'table', label: '📋 جدول الاستماع (3 سرعات)' },
                                { id: 'flashcards', label: '🃏 بطاقات الذاكرة الناطقة' },
                                { id: 'builder', label: '🧩 لعبة تركيب المكعبات باللمس' }
                              ].map(mode => (
                                <button
                                  key={mode.id}
                                  type="button"
                                  onClick={() => setStudioMode(mode.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    studioMode === mode.id
                                      ? 'bg-purple-600 text-white shadow'
                                      : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {mode.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {studioMode === 'table' && (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs text-slate-400">
                                  استمع لكل كلمة أو جملة باللغة {activeLangConfig.nameAr} بـ 3 سرعات، ثم اضغط على زر <strong className="text-rose-300">🎤 انطق</strong> لاختبار نطقك بالمايكروفون:
                                </p>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handlePlayAudioText(activeLesson.codeSnippet, 1.0, 'all_studio')}
                                    className="bg-purple-500/15 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                                  >
                                    <Volume2 size={14} /> تشغيل الكل (1.0x)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handlePlayAudioText(activeLesson.codeSnippet, 0.75, 'all_studio')}
                                    className="bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                                  >
                                    🐢 ترديد بطيء (0.75x)
                                  </button>
                                  {speakingKey && (
                                    <button
                                      type="button"
                                      onClick={handleStopAudio}
                                      className="bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-red-500/30 flex items-center gap-1"
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
                                      <th className="p-3.5">الكلمة / الجملة ({activeLangConfig.nameAr})</th>
                                      <th className="p-3.5">الرمز الصوتي (IPA)</th>
                                      <th className="p-3.5">المعنى بالعربية</th>
                                      <th className="p-3.5 text-center">استمع (3 سرعات) + اختبر نطقك</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800/70 text-sm">
                                    {audioStudioItems.map((item, idx) => (
                                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="p-3.5 text-center font-bold text-purple-400 code-font">{item.order || idx + 1}</td>
                                        <td className="p-3.5 font-bold text-white text-base" dir="ltr">
                                          <span className="mr-2">{item.emoji}</span>
                                          {item.sentence}
                                        </td>
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
                            </>
                          )}

                          {studioMode === 'flashcards' && currentFlashcard && (
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-5">
                              <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>بطاقة الذاكرة {activeCardIdx + 1} من {audioStudioItems.length}</span>
                                <span>اضغط على البطاقة لقلبها أو لسماع النطق باللغة {activeLangConfig.nameAr} 🔊</span>
                              </div>

                              <div
                                onClick={() => {
                                  setIsCardFlipped(!isCardFlipped);
                                  handlePlayAudioText(currentFlashcard.sentence, 0.9, `card_${activeCardIdx}`);
                                }}
                                className="min-h-[210px] bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/50 border-2 border-purple-500/40 hover:border-amber-400 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all shadow-xl select-none"
                              >
                                <span className="text-5xl mb-3">{currentFlashcard.emoji}</span>
                                {!isCardFlipped ? (
                                  <>
                                    <h4 className="text-3xl font-black text-white tracking-wide" dir="ltr">
                                      {currentFlashcard.sentence}
                                    </h4>
                                    <p className="code-font text-emerald-400 text-sm mt-2" dir="ltr">
                                      {currentFlashcard.ipa}
                                    </p>
                                    <span className="text-[11px] text-purple-300 mt-4 bg-purple-500/15 px-3 py-1 rounded-full">
                                      اضغط لكشف المعنى العربي وسماع الصوت 🔊
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <h4 className="heading-font text-2xl font-black text-amber-400">
                                      {currentFlashcard.meaning}
                                    </h4>
                                    <p className="text-lg font-bold text-white mt-2" dir="ltr">
                                      {currentFlashcard.sentence}
                                    </p>
                                    <span className="text-[11px] text-slate-400 mt-4">
                                      اضغط للعودة لوجه اللغة {activeLangConfig.nameAr}
                                    </span>
                                  </>
                                )}
                              </div>

                              <div className="flex items-center justify-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const prev = (activeCardIdx - 1 + audioStudioItems.length) % audioStudioItems.length;
                                    setActiveCardIdx(prev);
                                    setIsCardFlipped(false);
                                  }}
                                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                                >
                                  ← البطاقة السابقة
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePlayAudioText(currentFlashcard.sentence, 0.75, `card_slow_${activeCardIdx}`)}
                                  className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                                >
                                  <Volume2 size={15} /> نطق بطيء (0.75x)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (activeCardIdx + 1) % audioStudioItems.length;
                                    setActiveCardIdx(next);
                                    setIsCardFlipped(false);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                                >
                                  البطاقة التالية →
                                </button>
                              </div>
                            </div>
                          )}

                          {studioMode === 'builder' && currentBuilderItem && (
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                  <span className="text-xs font-bold text-amber-400 block">
                                    🧩 التحدي {builderTargetIdx + 1} من {audioStudioItems.length}: ركب باللمس ما يعبر باللغة {activeLangConfig.nameAr} عن:
                                  </span>
                                  <h4 className="heading-font text-lg font-black text-white mt-1">
                                    {currentBuilderItem.emoji} المعنى المطلوب: "{currentBuilderItem.meaning}"
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handlePlayAudioText(currentBuilderItem.sentence, 0.8, 'builder_hint')}
                                    className="bg-purple-500/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
                                  >
                                    <Volume2 size={14} /> اسمع الكلمة/الجملة
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => initBuilderGame(builderTargetIdx)}
                                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 p-2 rounded-xl border border-slate-700"
                                    title="إعادة خلط المكعبات"
                                  >
                                    <RotateCcw size={15} />
                                  </button>
                                </div>
                              </div>

                              <div className="min-h-[68px] bg-[#060b16] border-2 border-dashed border-indigo-500/40 rounded-xl p-4 flex flex-wrap items-center justify-center gap-2" dir="ltr">
                                {selectedTokens.length === 0 ? (
                                  <span className="text-xs text-slate-500">اضغط على المكعبات بالأسفل لترتيبها هنا...</span>
                                ) : (
                                  selectedTokens.map((tok) => (
                                    <button
                                      key={tok.id}
                                      type="button"
                                      onClick={() => handleRemoveSelectedToken(tok)}
                                      className="bg-indigo-600 hover:bg-red-600 text-white font-black text-base px-4 py-2 rounded-xl shadow transition-all"
                                    >
                                      {tok.text}
                                    </button>
                                  ))
                                )}
                              </div>

                              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2" dir="ltr">
                                {scrambledTokens.map((tok) => (
                                  <button
                                    key={tok.id}
                                    type="button"
                                    onClick={() => handleTapScrambledToken(tok)}
                                    className="bg-slate-900 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border-2 border-amber-500/40 font-black text-base px-4 py-2 rounded-xl transition-all shadow"
                                  >
                                    {tok.text}
                                  </button>
                                ))}
                              </div>

                              {builderSuccess === true && (
                                <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 p-4 rounded-xl flex items-center justify-between">
                                  <span className="font-bold text-sm">🎉 ممتاز! ركبت المكعبات بالترتيب الصحيح 100%!</span>
                                  <button
                                    type="button"
                                    onClick={() => initBuilderGame((builderTargetIdx + 1) % audioStudioItems.length)}
                                    className="bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2 rounded-lg"
                                  >
                                    الجملة التالية ←
                                  </button>
                                </div>
                              )}
                              {builderSuccess === false && (
                                <div className="bg-red-950/40 border border-red-500/50 text-red-300 p-3.5 rounded-xl flex items-center justify-between text-xs font-bold">
                                  <span>❌ الترتيب غير مطابق تماماً، اضغط على المكعبات لإعادة المحاولة!</span>
                                  <button
                                    type="button"
                                    onClick={() => initBuilderGame(builderTargetIdx)}
                                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg"
                                  >
                                    إعادة المحاولة
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

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
                              {sanitizeLessonMarkdown(activeLesson.codeExplanation)}
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
                          {isLanguageLesson ? `ورشة الإملاء وتركيب الجمل باللغة ${activeLangConfig.nameAr} (جرب بنفسك!)` : 'مختبر كتابة الكود التفاعلي (جرب بنفسك!)'}
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
                            {isLanguageLesson ? `Lego Sentence & Spelling Workspace (${activeLangConfig.nameEn})` : 'مساحة كتابة الكود الخاصة بك'}
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
                          placeholder={isLanguageLesson ? `// Write your ${activeLangConfig.nameEn} words or sentences here...` : "// اكتب الكود المطلوب هنا..."}
                          className="w-full bg-[#04070e] text-emerald-300 code-font text-[14.5px] p-4 outline-none resize-y leading-[1.7]"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleVerifyStudentCode}
                          disabled={verifyingCode}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_20px_rgba(79,70,229,0.3)]"
                        >
                          <Bot size={18} /> {verifyingCode ? 'المعلم الذكي يفحص إجابتك...' : (isLanguageLesson ? 'تحقق من إجابتك' : 'تحقق من الكود')}
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

                      {codeFeedback && (
                        <div className={`mt-5 p-4 rounded-xl border text-[15px] ${codeFeedback.isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-amber-950/30 border-amber-500/40 text-amber-200'}`}>
                          <p className="leading-[1.8] font-medium">{codeFeedback.feedback}</p>
                        </div>
                      )}

                      {showSolution && activeLesson.codingPractice.solutionCode && (
                        <div className="mt-5 rounded-xl overflow-hidden border border-emerald-500/30" dir="ltr">
                          <div className="bg-emerald-950/40 px-4 py-2 text-xs text-emerald-300 font-bold flex items-center justify-between">
                            <span>الحل النموذجي (Model Solution)</span>
                            {isLanguageLesson && (
                              <button
                                type="button"
                                onClick={() => handlePlayAudioText(activeLesson.codingPractice.solutionCode, 0.9, 'solution_audio')}
                                className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-200 hover:text-slate-950 px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1"
                              >
                                <Volume2 size={12} /> استمع للحل الصحيح ({activeLangConfig.nameAr})
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
                  {/* 🌟 7. سؤال نهاية الدرس الاختياري */}
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
                         <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
              {/* 🛑 زر إنهاء الدرس والانتقال */}
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
              <p className="text-slate-300 text-lg font-bold">
                {certificateCoursesList.length > 0
                  ? 'هذا الكراش كورس لم يتم تأليف دروسه بعد، اختر الكورس 1 من القائمة الجانبية أو قم بتأليفه في المختبر!'
                  : 'لم يتم العثور على دروس من السيرفر حالياً'}
              </p>
              <button
                type="button"
                onClick={() => jsonInputRef.current?.click()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg"
              >
                <Upload size={16} /> افتح ملف JSON الكراش كورس أو الشهادة مباشرة من جهازك
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classroom;