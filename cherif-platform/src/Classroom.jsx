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
  Target, Layers, RotateCcw, PhoneCall, PhoneOff, Send, MessageCircle, Radio, Compass, UserCheck,
  Stethoscope, Plus, Trash2, Edit3, RotateCw,
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
// 🧹 0.5 منقي النصوص التلقائي الشامل
// ============================================================================
const sanitizeLessonMarkdown = (raw = '', stripRawPromptSection = false) => {
  if (!raw) return '';
  let cleaned = raw
    .replace(/[\u0900-\u097F]+/g, '')
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

// 🎨 كاشف الجنس النحوي التلقائي لتلوين الكلمات المذكرة (🔵) والمؤنثة (🔴)
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
// 🧩 2. مستخرج مكعبات الليغو، سُلّم البناء، جدول الأخطاء، ومفردات الدرس
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

// ============================================================================
// 🧩 مكوّن "املأ الفراغ التفاعلي" في منتصف الدرس (Mid-Lesson Interactive Fill-in-the-Blank)
// ============================================================================
const InlineFillBlankSentence = ({ rawText, onSpeak }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const match = rawText.match(/\[\[([^\]]+)\]\]/);
  if (!match) return <span>{rawText}</span>;

  const beforeBlank = rawText.slice(0, match.index);
  const afterBlank = rawText.slice(match.index + match[0].length);
  const rawOptions = match[1].split('|').map(s => s.trim()).filter(Boolean);
  const correctOption = rawOptions[0] || '';

  const shuffledOptions = useMemo(() => {
    return [...rawOptions].sort((a, b) => a.localeCompare(b));
  }, [match[1]]);

  const isCorrect = selectedChoice === correctOption;
  const fullCompletedSentence = `${beforeBlank}${correctOption}${afterBlank}`.replace(/\([^)]*[\u0600-\u06FF]+[^)]*\)/g, '').trim();

  return (
    <div className="my-3 p-4 rounded-2xl bg-slate-950/95 border-2 border-amber-500/35 shadow-lg space-y-3" dir="auto">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-base md:text-[17px] font-bold text-white leading-relaxed flex flex-wrap items-center gap-1.5">
          <span>{beforeBlank}</span>
          <span
            className={`inline-flex items-center px-3.5 py-1 rounded-xl font-black text-sm border-2 transition-all ${
              !selectedChoice
                ? 'bg-slate-900 border-dashed border-amber-400/60 text-amber-300'
                : isCorrect
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-500/25 border-rose-400 text-rose-300'
            }`}
          >
            {selectedChoice || '........'}
          </span>
          <span>{afterBlank}</span>
        </div>

        {onSpeak && (
          <button
            type="button"
            onClick={() => onSpeak(fullCompletedSentence, 0.9, `blank_${correctOption}`)}
            className="bg-purple-500/20 hover:bg-purple-600 text-purple-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border border-purple-500/30 transition-all shrink-0"
            title="اسمع الجملة كاملة"
          >
            <Volume2 size={13} /> اسمع
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1" dir="ltr">
        <span className="text-[11px] font-bold text-slate-400 mr-1">اختر الإجابة الصحيحة:</span>
        {shuffledOptions.map((opt, idx) => {
          const isPicked = selectedChoice === opt;
          const isOptCorrect = opt === correctOption;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedChoice(opt);
                if (opt === correctOption && onSpeak) {
                  onSpeak(fullCompletedSentence, 0.95, `blank_win_${opt}`);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all ${
                isPicked
                  ? isOptCorrect
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-105'
                    : 'bg-rose-600 text-white border-rose-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400'
              }`}
            >
              {opt}
            </button>
          );
        })}

        {selectedChoice && (
          <span className={`text-xs font-bold mr-auto ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isCorrect ? '✅ إجابة صحيحة! أحسنت!' : '❌ جرب خياراً آخر!'}
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 🩺🛠️ شريط الجراحة العالمي لجميع عناصر الدرس الأخيرة والعلوية (Universal Widget Surgeon Bar)
// ============================================================================
const WidgetSurgeonBar = ({
  widgetTitle,
  widgetType,
  initialData,
  onSaveManual,
  onRunAiEdit,
  onDeleteWidget,
  isOperating
}) => {
  const [mode, setMode] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [draft, setDraft] = useState(initialData);

  useEffect(() => {
    setDraft(initialData);
  }, [initialData, mode]);

  const handleSave = () => {
    onSaveManual(draft);
    setMode(null);
  };

  const handleAiSubmit = async (customText = null) => {
    const instruction = customText || aiPrompt;
    if (!instruction || !instruction.trim()) return;
    await onRunAiEdit(instruction);
    setMode(null);
    setAiPrompt('');
  };

  if (!window.__CHERIF_CAN_EDIT_COURSE__) return null;

  return (
    <div className="mb-4 pb-3 border-b border-slate-800/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
          🛠️ تحكم العنصر: <strong className="text-slate-200">{widgetTitle}</strong>
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {onSaveManual && (
            <button
              type="button"
              onClick={() => setMode(mode === 'manual' ? null : 'manual')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                mode === 'manual'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              ✏️ {mode === 'manual' ? 'إلغاء اليدوي' : 'تعديل يدوي'}
            </button>
          )}

          {onRunAiEdit && (
            <button
              type="button"
              onClick={() => setMode(mode === 'ai' ? null : 'ai')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                mode === 'ai'
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-indigo-500/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border-indigo-500/30'
              }`}
            >
              🤖 تعديل بالـ AI
            </button>
          )}

          {onDeleteWidget && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`هل أنت متأكد من حذف (${widgetTitle}) من هذا الدرس؟ (يمكنك التراجع بزر تراجع في الأعلى)`)) {
                  onDeleteWidget();
                }
              }}
              className="bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
            >
              🗑️ حذف
            </button>
          )}
        </div>
      </div>

{mode === 'ai' && (
        <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2.5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-indigo-300 block">
              🤖 ماذا تريد من الذكاء الاصطناعي أن يعدل أو يضيف في ({widgetTitle})؟
            </label>
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setAiPrompt(`طوّر (${widgetTitle}) وأضف أمثلة ناطقة أكثر وضوحاً وتشويقاً تناسب مستوى الدرس.`)}
                className="bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 px-2 py-1 rounded-lg text-[10px] font-black transition-all"
              >
                ✨ إلهام: إثراء بالأمثلة
              </button>
              <button
                type="button"
                onClick={() => setAiPrompt(`بسّط محتوى (${widgetTitle}) بأسلوب مكعبات الليغو وشفرات الذاكرة السريعة مع أمثلة عملية من الحياة اليومية.`)}
                className="bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/30 px-2 py-1 rounded-lg text-[10px] font-black transition-all"
              >
                🧠 إلهام: تبسيط بصري
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={`مثال: طور (${widgetTitle})، أو اضغط على أزرار الإلهام بالأعلى...`}
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-indigo-400 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
            />
            <button
              type="button"
              disabled={isOperating || !aiPrompt.trim()}
              onClick={() => handleAiSubmit()}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50"
            >
              {isOperating ? '⏳ جاري التحديث...' : '⚡ نفّذ بالـ AI'}
            </button>
          </div>
        </div>
      )}



      {mode === 'manual' && (
        <div className="mt-3 p-4 rounded-xl bg-slate-950 border-2 border-amber-500/50 space-y-3 animate-fade-in">
          {(widgetType === 'audio_studio' || widgetType === 'code_explanation' || widgetType === 'lego' || widgetType === 'ladder') && (
            <div>
              <label className="text-xs font-bold text-amber-300 block mb-1.5">
                ✏️ حرر محتوى ({widgetTitle}) مباشرة:
              </label>
              <textarea
                value={typeof draft === 'string' ? draft : JSON.stringify(draft, null, 2)}
                onChange={(e) => setDraft(e.target.value)}
                rows={8}
                dir="auto"
                className="w-full bg-[#050811] border border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm text-emerald-300 font-mono leading-relaxed outline-none"
              />
            </div>
          )}

          {widgetType === 'mistakes' && Array.isArray(draft) && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-amber-300 block">
                ✏️ تعديل صفوف جدول الأخطاء الشائعة:
              </label>
              {draft.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-[#060b16] p-2.5 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    value={row.wrong || ''}
                    onChange={(e) => {
                      const copy = [...draft];
                      copy[idx] = { ...copy[idx], wrong: e.target.value };
                      setDraft(copy);
                    }}
                    placeholder="❌ الخطأ الشائع"
                    className="bg-slate-950 border border-red-500/30 rounded-lg px-2.5 py-1.5 text-xs text-red-200 outline-none"
                  />
                  <input
                    type="text"
                    value={row.right || ''}
                    onChange={(e) => {
                      const copy = [...draft];
                      copy[idx] = { ...copy[idx], right: e.target.value };
                      setDraft(copy);
                    }}
                    placeholder="✅ الصواب الأصيل"
                    className="bg-slate-950 border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-xs text-emerald-200 outline-none"
                  />
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={row.reason || ''}
                      onChange={(e) => {
                        const copy = [...draft];
                        copy[idx] = { ...copy[idx], reason: e.target.value };
                        setDraft(copy);
                      }}
                      placeholder="💡 التفسير اللغوي"
                      className="flex-1 bg-slate-950 border border-amber-500/30 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setDraft(draft.filter((_, i) => i !== idx))}
                      className="bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white px-2 py-1.5 rounded-lg text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDraft([...draft, { wrong: '', right: '', reason: '' }])}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                + إضافة صف جديد للجدول
              </button>
            </div>
          )}

          {widgetType === 'coding_practice' && draft && typeof draft === 'object' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1">📋 نص السؤال والمهام (taskQuestion):</label>
                <textarea
                  value={draft.taskQuestion || ''}
                  onChange={(e) => setDraft({ ...draft, taskQuestion: e.target.value })}
                  rows={4}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl p-3 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-indigo-300 block mb-1">💻 النص الابتدائي في الخانة (starterCode):</label>
                <textarea
                  value={draft.starterCode || ''}
                  onChange={(e) => setDraft({ ...draft, starterCode: e.target.value })}
                  rows={3}
                  dir="ltr"
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl p-3 text-xs text-emerald-300 font-mono outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-amber-400 block mb-1">💡 التلميحات (كل تلميح في سطر):</label>
                <textarea
                  value={Array.isArray(draft.hints) ? draft.hints.join('\n') : ''}
                  onChange={(e) => setDraft({ ...draft, hints: e.target.value.split('\n') })}
                  rows={3}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl p-3 text-xs text-amber-200 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-400 block mb-1">✅ الحل النموذجي (solutionCode):</label>
                <textarea
                  value={draft.solutionCode || ''}
                  onChange={(e) => setDraft({ ...draft, solutionCode: e.target.value })}
                  rows={4}
                  dir="ltr"
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl p-3 text-xs text-emerald-300 font-mono outline-none"
                />
              </div>
            </div>
          )}

          {widgetType === 'daily_quest' && draft && typeof draft === 'object' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-amber-300 block mb-1">❓ نص سؤال التحدي السريع:</label>
                <input
                  type="text"
                  value={draft.question || ''}
                  onChange={(e) => setDraft({ ...draft, question: e.target.value })}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(draft.options || ['', '', '', '']).map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2 bg-[#050811] p-2 rounded-xl border border-slate-800">
                    <input
                      type="radio"
                      name="correct_quest_opt"
                      checked={Number(draft.correctAnswerIndex) === oIdx}
                      onChange={() => setDraft({ ...draft, correctAnswerIndex: oIdx })}
                      title="حدد كإجابة صحيحة"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const nextOpts = [...(draft.options || [])];
                        nextOpts[oIdx] = e.target.value;
                        setDraft({ ...draft, options: nextOpts });
                      }}
                      placeholder={`الخيار ${oIdx + 1}`}
                      className="flex-1 bg-transparent text-xs text-white outline-none"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-bold text-emerald-400 block mb-1">💡 شرح الإجابة الصحيحة:</label>
                <textarea
                  value={draft.explanation || ''}
                  onChange={(e) => setDraft({ ...draft, explanation: e.target.value })}
                  rows={2}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setMode(null)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2 rounded-xl shadow"
            >
              💾 حفظ تعديل العنصر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 🧱 مكوّن تقسيم الدرس إلى عناصر وأقسام قابلة للتعديل اليدوي أو بالـ AI أو الحذف
// ============================================================================
const splitMarkdownIntoBlocks = (markdown = '') => {
  if (!markdown) return [];
  const cleaned = markdown.trim();
  const parts = cleaned.split(/(?=\n###\s+|\n##\s+)/g);
  return parts.map(p => p.trim()).filter(Boolean);
};

const EditableLessonBlocks = ({
  rawMarkdown,
  markdownComponents,
  onSaveFullMarkdown,
  onAiEditBlock,
  onAiInspireBlock,
  isOperating
}) => {
  const blocks = useMemo(() => splitMarkdownIntoBlocks(rawMarkdown), [rawMarkdown]);
  const [editingIdx, setEditingIdx] = useState(null);
  const [manualText, setManualText] = useState('');
  const [aiPromptIdx, setAiPromptIdx] = useState(null);
  const [aiBlockInstruction, setAiBlockInstruction] = useState('');
  const [loadingBlockIdx, setLoadingBlockIdx] = useState(null);

  // ✨ حالات محرك الإلهام المجهري لكل شريحة
  const [blockInspirationsMap, setBlockInspirationsMap] = useState({});
  const [inspiringBlockIdx, setInspiringBlockIdx] = useState(null);

  const handleSaveManualBlock = (idx) => {
    const nextBlocks = [...blocks];
    nextBlocks[idx] = manualText.trim();
    onSaveFullMarkdown(nextBlocks.join('\n\n'), `تم تعديل القسم (${idx + 1}) يدوياً وحفظه!`);
    setEditingIdx(null);
  };

  const handleDeleteBlock = (idx) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا القسم من الدرس؟ (يمكنك التراجع لاحقاً بزر تراجع)')) return;
    const nextBlocks = blocks.filter((_, i) => i !== idx);
    onSaveFullMarkdown(nextBlocks.join('\n\n'), `تم حذف القسم (${idx + 1}) من الدرس!`);
  };

  const handleRunAiOnBlock = async (idx, customPrompt = null) => {
    const instruction = customPrompt || aiBlockInstruction;
    if (!instruction || !instruction.trim()) return;
    setLoadingBlockIdx(idx);
    try {
      const updatedBlock = await onAiEditBlock(blocks[idx], instruction);
      if (updatedBlock) {
        const nextBlocks = [...blocks];
        nextBlocks[idx] = updatedBlock.trim();
        onSaveFullMarkdown(nextBlocks.join('\n\n'), `تم تحديث القسم (${idx + 1}) بالذكاء الاصطناعي!`);
        setAiPromptIdx(null);
        setAiBlockInstruction('');
      }
    } finally {
      setLoadingBlockIdx(null);
    }
  };

  // ✨ طلب الإلهام الذكي لتطوير الشريحة الحالية
  const handleGetBlockInspiration = async (idx) => {
    if (!onAiInspireBlock) return;
    setInspiringBlockIdx(idx);
    try {
      const data = await onAiInspireBlock(blocks[idx]);
      if (data) {
        setBlockInspirationsMap(prev => ({ ...prev, [idx]: data }));
      }
    } finally {
      setInspiringBlockIdx(null);
    }
  };

  if (!window.__CHERIF_CAN_EDIT_COURSE__) {
    return (
      <div className="space-y-4">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {rawMarkdown}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {blocks.map((blockMd, bIdx) => {
        const isManualEditing = editingIdx === bIdx;
        const isAiEditing = aiPromptIdx === bIdx;
        const isThisBlockLoading = loadingBlockIdx === bIdx;
        const isThisBlockInspiring = inspiringBlockIdx === bIdx;
        const currentInspiration = blockInspirationsMap[bIdx] || null;
        const firstLine = (blockMd.split('\n')[0] || '').replace(/^#+\s*/, '').slice(0, 55);

        return (
          <div
            key={bIdx}
            className="relative group/block rounded-2xl border border-slate-800/70 hover:border-emerald-500/40 bg-[#040914]/60 p-4 md:p-6 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 truncate max-w-[260px]">
                📌 قسم {bIdx + 1}: {firstLine}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (isManualEditing) {
                      setEditingIdx(null);
                    } else {
                      setEditingIdx(bIdx);
                      setManualText(blockMd);
                      setAiPromptIdx(null);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    isManualEditing ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  ✏️ {isManualEditing ? 'إلغاء اليدوي' : 'تعديل يدوي'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiPromptIdx(isAiEditing ? null : bIdx);
                    setEditingIdx(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                    isAiEditing ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-indigo-500/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border-indigo-500/30'
                  }`}
                >
                  🤖 تعديل بالـ AI
                </button>
                <button
                  type="button"
                  disabled={isThisBlockLoading || isOperating}
                  onClick={() => handleRunAiOnBlock(bIdx, 'أضف في نهاية هذا القسم تمرين (املأ الفراغ التفاعلي) من 3 جمل يختبر ما ورد في هذا القسم بصيغة [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]].')}
                  className="bg-emerald-500/15 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                  title="إضافة تمرين املأ الفراغ التفاعلي داخل هذا القسم مباشرة"
                >
                  🧩 + املأ الفراغ هنا
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteBlock(bIdx)}
                  className="bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                  title="حذف هذا القسم من الدرس"
                >
                  🗑️ حذف
                </button>
              </div>
            </div>

            {isAiEditing && (
              <div className="mb-4 p-4 rounded-2xl bg-indigo-950/35 border border-indigo-500/40 space-y-3.5 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    🤖 ماذا تريد من الذكاء الاصطناعي أن يعدل أو يضيف في هذا القسم تحديداً؟
                  </label>

                  {/* ✨ زر الإلهام الذكي لتطوير هذه الشريحة */}
                  <button
                    type="button"
                    disabled={isThisBlockInspiring || isThisBlockLoading}
                    onClick={() => handleGetBlockInspiration(bIdx)}
                    className="bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 hover:from-amber-500 hover:to-yellow-400 text-amber-300 hover:text-slate-950 border border-amber-400/50 px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50"
                  >
                    <Sparkles size={13} className={isThisBlockInspiring ? 'animate-spin' : ''} />
                    {isThisBlockInspiring
                      ? '⏳ جاري استخراج الإلهام لهذه الشريحة...'
                      : currentInspiration
                        ? '🔄 تجديد أفكار الإلهام لهذا القسم'
                        : '✨ ألهمني كيف أطوّر هذا القسم (AI Inspiration)'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiBlockInstruction}
                    onChange={(e) => setAiBlockInstruction(e.target.value)}
                    placeholder="مثال: بسط هذه القاعدة أكثر، أو أضف 3 أمثلة جديدة، أو اضغط على زر (ألهمني ✨) بالأعلى..."
                    className="flex-1 bg-slate-950 border border-slate-700 focus:border-indigo-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    disabled={isThisBlockLoading || !aiBlockInstruction.trim()}
                    onClick={() => handleRunAiOnBlock(bIdx)}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 shrink-0"
                  >
                    {isThisBlockLoading ? '⏳ جاري تحديث القسم...' : '⚡ نفّذ على هذا القسم'}
                  </button>
                </div>

                {/* 🌟 لوحة الأفكار الإلهامية المولدة خصيصاً لهذه الشريحة */}
                {currentInspiration && (
                  <div className="pt-3 border-t border-indigo-500/30 space-y-3 animate-fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/90 border border-amber-500/30 p-3 rounded-xl">
                      <p className="text-[11px] text-amber-200 font-semibold leading-relaxed">
                        💡 <strong className="text-amber-400">تشخيص الشريحة:</strong> {currentInspiration.blockDiagnosis}
                      </p>

                      {currentInspiration.superchargeCommand && (
                        <button
                          type="button"
                          disabled={isThisBlockLoading}
                          onClick={() => handleRunAiOnBlock(bIdx, currentInspiration.superchargeCommand)}
                          className="bg-gradient-to-l from-emerald-500 to-amber-400 hover:from-emerald-400 hover:to-yellow-300 text-slate-950 font-black text-[11px] px-3.5 py-1.5 rounded-lg shadow flex items-center gap-1 shrink-0 transition-all"
                        >
                          <Zap size={12} /> 🚀 ترقية شاملة للشريحة 10x فوراً
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {(currentInspiration.inspirations || []).map((item, iIdx) => (
                        <div
                          key={item.id || iIdx}
                          className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3 flex flex-col justify-between gap-2.5 transition-all"
                        >
                          <div>
                            <span className="text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                              {item.badge || '✨ فكرة تطوير'}
                            </span>
                            <h5 className="text-xs font-bold text-white mt-1.5">{item.title}</h5>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.why}</p>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => setAiBlockInstruction(item.command)}
                              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-bold py-1.5 px-2 rounded-lg transition-all"
                              title="ضع هذا الأمر في الخانة لتعديله قبل التنفيذ"
                            >
                              ✍️ نسخ للخانة
                            </button>
                            <button
                              type="button"
                              disabled={isThisBlockLoading}
                              onClick={() => handleRunAiOnBlock(bIdx, item.command)}
                              className="flex-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-[10px] font-black py-1.5 px-2 rounded-lg transition-all"
                            >
                              ⚡ طبّق فوراً
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isManualEditing ? (
              <div className="space-y-3">
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  rows={10}
                  dir="auto"
                  className="w-full bg-slate-950 border-2 border-amber-500/50 rounded-xl p-4 text-sm text-slate-100 font-mono leading-relaxed outline-none"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingIdx(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveManualBlock(bIdx)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2 rounded-xl shadow"
                  >
                    💾 حفظ التعديل اليدوي
                  </button>
                </div>
              </div>
            ) : (
              <div className={isThisBlockLoading ? 'opacity-40 pointer-events-none animate-pulse' : ''}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {blockMd}
                </ReactMarkdown>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};



// ============================================================================
// 🏛️ المكوّن الرئيسي: Classroom
// ============================================================================
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

  // 🎮 نظام الحالات الموحد (Quest & Boss States)
  const [selectedQuestAnswer, setSelectedQuestAnswer] = useState(null); 
  const [selectedBossAnswers, setSelectedBossAnswers] = useState({});   
  const [questStatus, setQuestStatus] = useState('idle'); 
  const [scoreInfo, setScoreInfo] = useState({ score: 0, percentage: 0 }); 
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // 💻 نظام خانة كتابة الكود / تركيب الجمل التفاعلية والتلميحات
  const [studentCode, setStudentCode] = useState('');
  const [revealedHintsCount, setRevealedHintsCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeFeedback, setCodeFeedback] = useState(null);

  // 🔊 نظام الصوتيات، البطاقات التفاعلية، ولعبة المكعبات
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

  // 🎙️🔥 نظام "Speak Class" الثلاثي المطور
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState(false);
  const [speakClassMode, setSpeakClassMode] = useState('speak_class');
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

  // 🩺 نظام المُشرط الذكي ومجلس الحكماء الثلاثي (Lesson + Unit + Course Surgeons)
  const [isSurgeonOpen, setIsSurgeonOpen] = useState(false);
  const [surgeonCritique, setSurgeonCritique] = useState(null);
  const [activePersonaTab, setActivePersonaTab] = useState('all');
  const [isAnalyzingLesson, setIsAnalyzingLesson] = useState(false);
  const [isOperatingLesson, setIsOperatingLesson] = useState(false);
  const [customSurgeonCommand, setCustomSurgeonCommand] = useState('');
  const [surgeonStatusMsg, setSurgeonStatusMsg] = useState('');
  const [lessonUndoStack, setLessonUndoStack] = useState([]);

  const [isSyncingCourse, setIsSyncingCourse] = useState(false);

 // 🌟 نظام التراجع والإعادة العالمي (Global Undo & Redo Stacks - Time Travel)
  const [globalUndoStack, setGlobalUndoStack] = useState([]);
  const [globalRedoStack, setGlobalRedoStack] = useState([]);

  // ↩️ التراجع للخلف (Undo)
  const handleGlobalUndo = () => {
    if (globalUndoStack.length === 0) return;
    
    // 1. قبل التراجع، نحفظ اللحظة الحالية في مكدس "المستقبل" (Redo)
    setGlobalRedoStack(prev => [...prev, JSON.parse(JSON.stringify(lessons))]);
    
    // 2. نسحب آخر لقطة من مكدس "الماضي" (Undo)
    const previousLessonsState = globalUndoStack[globalUndoStack.length - 1];
    const newUndoStack = globalUndoStack.slice(0, -1);
    
    setGlobalUndoStack(newUndoStack);
    setLessons(previousLessonsState);
    
    // استعادة الدرس النشط بشكل آمن
    if (activeLesson) {
      const restoredActive = previousLessonsState.find(l => l._id === activeLesson._id) || previousLessonsState[0];
      setActiveLesson(restoredActive || null);
    } else {
      setActiveLesson(previousLessonsState[0] || null);
    }

    try {
      const fullSnapshot = buildLiveCourseJSONSnapshot(previousLessonsState);
      localStorage.setItem('cherif_active_local_course_json', JSON.stringify(fullSnapshot));
    } catch (e) {}

    setSurgeonStatusMsg('↩️ تم التراجع خطوة للخلف بنجاح (Undo)!');
  };

  // ↪️ الإعادة للأمام (Redo)
  const handleGlobalRedo = () => {
    if (globalRedoStack.length === 0) return;
    
    // 1. قبل التقدم للأمام، نحفظ اللحظة الحالية في مكدس "الماضي" (Undo)
    setGlobalUndoStack(prev => [...prev, JSON.parse(JSON.stringify(lessons))]);
    
    // 2. نسحب آخر لقطة من مكدس "المستقبل" (Redo)
    const nextLessonsState = globalRedoStack[globalRedoStack.length - 1];
    const newRedoStack = globalRedoStack.slice(0, -1);
    
    setGlobalRedoStack(newRedoStack);
    setLessons(nextLessonsState);
    
    if (activeLesson) {
      const restoredActive = nextLessonsState.find(l => l._id === activeLesson._id) || nextLessonsState[0];
      setActiveLesson(restoredActive || null);
    } else {
      setActiveLesson(nextLessonsState[0] || null);
    }

    try {
      const fullSnapshot = buildLiveCourseJSONSnapshot(nextLessonsState);
      localStorage.setItem('cherif_active_local_course_json', JSON.stringify(fullSnapshot));
    } catch (e) {}

    setSurgeonStatusMsg('↪️ تم إعادة تطبيق التعديل بنجاح (Redo)!');
  };




// ☁️ دالة المزامنة الشاملة المباشرة مع سيرفر المنصة الأساسي (5001)
  const syncCourseListToPlatformDB = async (lessonsToSync = lessons, silent = false) => {
    if (!id || id === 'local_course_id') return false;
    try {
      const res = await axios.post(`http://127.0.0.1:5001/api/courses/${id}/sync-full-course`, {
        lessonsList: lessonsToSync,
        unitSummariesMap,
        courseTitle: course?.title,
        courseDescription: course?.description
      });

      if (res.data?.success && Array.isArray(res.data.lessons)) {
        // مسح أي كاش قديم في المتصفح حتى لا يطغى على قاعدة البيانات عند عمل Reload
        localStorage.removeItem('cherif_active_local_course_json');
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(`cherif_saved_lesson_${id}_`)) {
            localStorage.removeItem(key);
          }
        });

        const freshDbLessons = res.data.lessons;
        setLessons(freshDbLessons);
        if (activeLesson) {
          const matchedActive = freshDbLessons.find(
            l => String(l._id) === String(activeLesson._id) || l.title === activeLesson.title
          );
          setActiveLesson(matchedActive || freshDbLessons[0] || null);
        }
        return true;
      }
    } catch (err) {
      console.error('❌ Sync 5001 Error:', err);
      if (!silent) alert('❌ تعذر الاتصال بالسيرفر 5001 لحفظ الكورس. تأكد من تشغيل server_3.js');
    }
    return false;
  };

  const handleSyncFullCourseToDB = async () => {
    setIsSyncingCourse(true);
    setSurgeonStatusMsg('🔄 جاري حفظ ومزامنة الكورس بالكامل في قاعدة بيانات المنصة (5001)...');
    try {
      const ok = await syncCourseListToPlatformDB(lessons, false);
      if (ok) {
        setSurgeonStatusMsg('✅ تم حفظ جميع تعديلات الكورس والوحدات والدروس في قاعدة البيانات بنجاح!');
        alert('🎉 تم حفظ الكورس بجميع وحداته ودروسه وتعديلاته نهائياً! يمكنك عمل Reload بأمان.');
      }
    } finally {
      setIsSyncingCourse(false);
    }
  };

  // 💾 تحديث قائمة الدروس في الواجهة وحفظها تلقائياً في السيرفر 5001!
  const commitLessonsListUpdate = async (nextLessons, statusMessage = '') => {

    setGlobalUndoStack(prev => [...prev, JSON.parse(JSON.stringify(lessons))]);
   setGlobalRedoStack([]);

    const seenIds = new Set();
    const reordered = nextLessons.map((les, idx) => {
      let safeId = les._id || `lesson_uid_${Date.now()}_${idx}`;
      if (seenIds.has(safeId)) {
        safeId = `${safeId}_dup_${idx}_${Math.random().toString(36).slice(2, 6)}`;
      }
      seenIds.add(safeId);
      return { ...les, _id: safeId, order: idx + 1 };
    });

    setLessons(reordered);
    if (activeLesson) {
      const stillExists = reordered.find(l => l._id === activeLesson._id || l.title === activeLesson.title);
      setActiveLesson(stillExists || reordered[0] || null);
    } else if (reordered.length > 0) {
      setActiveLesson(reordered[0]);
    }

    if (statusMessage) setSurgeonStatusMsg(`⏳ ${statusMessage} (جاري الحفظ في السيرفر...)`);
    const synced = await syncCourseListToPlatformDB(reordered, true);
    if (statusMessage) {
      setSurgeonStatusMsg(synced ? `✅ ${statusMessage} (تم الحفظ النهائي في قاعدة البيانات 💾)` : `✅ ${statusMessage}`);
    }
  };





  // 🏗️ حالات جراح الوحدات (Unit Surgeon) وجراح الكورس الشامل (Course Surgeon)
  const [activeUnitSurgeon, setActiveUnitSurgeon] = useState(null);
  const [unitSurgeonCommand, setUnitSurgeonCommand] = useState('');
  const [newLessonTitleInUnit, setNewLessonTitleInUnit] = useState('');
  const [editingUnitNameValue, setEditingUnitNameValue] = useState('');
  const [isCourseSurgeonOpen, setIsCourseSurgeonOpen] = useState(false);
  const [courseSurgeonCommand, setCourseSurgeonCommand] = useState('');
  const [newUnitNameInput, setNewUnitNameInput] = useState('');

  const shuffleBossQuestions = (quizArray) => {
    return [...quizArray].sort(() => Math.random() - 0.5);
  };

  // 🔐 فك تشفير توكن المستخدم لمعرفة هويته وصلاحيته (Admin / Instructor / Student)
  const currentUser = useMemo(() => {
    try {
      const token = localStorage.getItem('cherif_token');
      if (!token) return null;
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }, []);

  // 🛡️ هل المستخدم الحالي هو الأدمين أو الأستاذ مالك الكورس؟
  const isCourseOwnerOrAdmin = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'instructor') {
      const courseOwnerId = course?.instructor?._id || course?.instructor;
      if (!courseOwnerId || course?._id === 'local_course_id') return true;
      return String(courseOwnerId) === String(currentUser.id);
    }
    return false;
  }, [currentUser, course]);

  // 👁️ زر اختياري للأدمين لمعاينة الصفحة كما يراها التلميذ تماماً
  const [studentPreviewMode, setStudentPreviewMode] = useState(false);
  const canEditCourse = isCourseOwnerOrAdmin && !studentPreviewMode;
  window.__CHERIF_CAN_EDIT_COURSE__ = canEditCourse;

  // معلومات اللغة الحالية للكورس والدرس
  const activeLangConfig = useMemo(() => {
    const fullContext = `${course?.targetLanguage || ''} ${course?.speechLang || ''} ${course?.parentCertTitle || ''} ${course?.title || ''} ${course?.description || ''} ${activeLesson?.section || ''} ${activeLesson?.title || ''}`;
    return resolveLanguageConfig(fullContext, activeLesson?.codeSnippet || '');
  }, [course, activeLesson]);

  // 🔄 بناء كائن JSON كامل للكورس أو الشهادة في أي وقت
  const buildLiveCourseJSONSnapshot = (updatedLessonsList = lessons) => {
    const cachedRaw = localStorage.getItem('cherif_active_local_course_json');
    if (cachedRaw) {
      try {
        const parsed = JSON.parse(cachedRaw);
        const buildSectionsFromFlat = () => {
          const map = {};
          updatedLessonsList.forEach(les => {
            const sName = les.section || 'الوحدة 1';
            if (!map[sName]) {
              map[sName] = {
                sectionOrder: les.sectionOrder || Object.keys(map).length + 1,
                sectionName: sName,
                unitDeepSummary: unitSummariesMap[sName] || null,
                lessons: []
              };
            }
            map[sName].lessons.push(les);
          });
          return Object.values(map);
        };

        if (Array.isArray(parsed.courses) && parsed.courses[activeCertCourseIdx]) {
          parsed.courses[activeCertCourseIdx].sections = buildSectionsFromFlat();
        } else {
          parsed.sections = buildSectionsFromFlat();
        }
        return parsed;
      } catch (e) {}
    }

    const sectionsMap = {};
    updatedLessonsList.forEach(les => {
      const secName = les.section || 'الوحدة 1';
      if (!sectionsMap[secName]) {
        sectionsMap[secName] = {
          sectionOrder: les.sectionOrder || Object.keys(sectionsMap).length + 1,
          sectionName: secName,
          unitDeepSummary: unitSummariesMap[secName] || null,
          lessons: []
        };
      }
      sectionsMap[secName].lessons.push(les);
    });

    return {
      _id: course?._id || id,
      courseTitle: course?.title || 'كورس معدل',
      courseDescription: course?.description || '',
      targetLanguage: course?.targetLanguage || activeLangConfig.nameAr,
      speechLang: activeLangConfig.code,
      unitSummariesMap,
      sections: Object.values(sectionsMap)
    };
  };

 

// 💾 حفظ تعديل الدرس الواحد في الواجهة وفي السيرفر 5001 فوراً!
const applyUpdatedLessonToState = async (updatedLessonObj, reportText = '') => {
    if (!updatedLessonObj || !activeLesson) return;

    // التقاط اللقطة الحالية قبل التغيير ومسح مسار المستقبل القديم
    setGlobalUndoStack(prev => [...prev, JSON.parse(JSON.stringify(lessons))]);
    setGlobalRedoStack([]); // 👈 هذا السطر الجديد
    setLessonUndoStack(prev => [...prev, activeLesson]);





    const mergedLesson = {
      ...activeLesson,
      ...updatedLessonObj,
      _id: activeLesson._id,
      order: activeLesson.order,
      section: activeLesson.section,
      sectionOrder: activeLesson.sectionOrder
    };

    const nextLessons = lessons.map(l => (l._id === activeLesson._id ? mergedLesson : l));
    setActiveLesson(mergedLesson);
    setLessons(nextLessons);

    // حفظ مباشر في السيرفر 5001
    await syncCourseListToPlatformDB(nextLessons, true);

    if (reportText) {
      setSurgeonStatusMsg(`✅ ${reportText} (تم الحفظ النهائي في قاعدة البيانات 💾)`);
    }
  };


  // ============================================================================
  // 🏗️ دوال جراح الوحدة (Unit-Level Surgeon) وجراح الكورس (Course-Level Surgeon)
  // ============================================================================

  // 1. إعادة تسمية الوحدة يدوياً
  const handleRenameUnit = (oldSectionName, newSectionName) => {
    const trimmed = (newSectionName || '').trim();
    if (!trimmed || trimmed === oldSectionName) return;
    const nextLessons = lessons.map(l => (l.section === oldSectionName ? { ...l, section: trimmed } : l));
    if (unitSummariesMap[oldSectionName]) {
      setUnitSummariesMap(prev => {
        const copy = { ...prev, [trimmed]: prev[oldSectionName] };
        delete copy[oldSectionName];
        return copy;
      });
    }
    setOpenSections(prev => ({ ...prev, [trimmed]: true }));
    setActiveUnitSurgeon(null);
    commitLessonsListUpdate(nextLessons, `تم تغيير اسم الوحدة إلى (${trimmed}) وحفظها!`);
  };

  // 2. إضافة درس جديد داخل وحدة محددة
  const handleAddLessonToUnit = async (sectionName, customTitle = '') => {
    const titleToUse = (customTitle || newLessonTitleInUnit || '').trim() || `درس تطبيقي جديد في ${sectionName}`;
    const newLessonObj = {
      _id: `lesson_custom_${Date.now()}`,
      title: titleToUse,
      description: `درس مضاف عبر جراح الوحدة (${sectionName})`,
      type: 'video',
      lessonCategory: 'language_mastery',
      section: sectionName,
      content: `### 🎯 1. هدف الدرس السريع\nمرحباً بك في درس **${titleToUse}** ضمن (${sectionName}). يمكنك تعديل هذا القسم يدوياً أو بالذكاء الاصطناعي فوراً!\n\n### 🧩 2. تمرين املأ الفراغ التفاعلي\n- اختر الكلمة الصحيحة لإتمام الجملة: [[الصواب | خيار 1 | خيار 2]]`,
      codeSnippet: '',
      codeExplanation: '',
      codingPractice: {
        hasPractice: true,
        taskQuestion: `اكتب جملة تطبيقية حول موضوع (${titleToUse}):`,
        starterCode: '',
        hints: ['تذكر القاعدة الأساسية للوحدة.', 'ابدأ بفاعل ثم فعل واضح.'],
        solutionCode: 'Good job!'
      },
      dailyQuest: {
        question: `ما هي الفكرة الرئيسية في درس (${titleToUse})؟`,
        options: ['التطبيق العملي للقاعدة', 'تجاهل القاعدة', 'حفظ عشوائي', 'لا شيء مما سبق'],
        correctAnswerIndex: 0,
        explanation: 'التطبيق العملي المنهجي هو أساس إتقان المهارة.',
        bonusExp: 50
      },
      bossQuiz: []
    };

    // إدراج الدرس في نهاية هذه الوحدة تحديداً
    const unitLessonIndices = lessons.map((l, i) => (l.section === sectionName ? i : -1)).filter(i => i !== -1);
    const insertAt = unitLessonIndices.length > 0 ? unitLessonIndices[unitLessonIndices.length - 1] + 1 : lessons.length;
    const nextLessons = [...lessons.slice(0, insertAt), newLessonObj, ...lessons.slice(insertAt)];

    setNewLessonTitleInUnit('');
    setActiveUnitSurgeon(null);
    commitLessonsListUpdate(nextLessons, `تمت إضافة الدرس (${titleToUse}) إلى (${sectionName})!`);
    setActiveLesson(newLessonObj);
  };

  // 3. حذف وحدة كاملة
  const handleDeleteUnit = (sectionName) => {
    if (!window.confirm(`هل أنت متأكد من حذف الوحدة (${sectionName}) بجميع دروسها؟`)) return;
    const nextLessons = lessons.filter(l => l.section !== sectionName);
    setActiveUnitSurgeon(null);
    commitLessonsListUpdate(nextLessons, `تم حذف الوحدة (${sectionName}) بنجاح!`);
  };

  // 4. جراحة الوحدة بالذكاء الاصطناعي (Unit AI Surgeon)
  const handleExecuteUnitSurgeon = async (sectionName, sectionLessons, customCmd = null) => {
    const cmd = (customCmd || unitSurgeonCommand || '').trim();
    if (!cmd) return;
    setIsOperatingLesson(true);
    setSurgeonStatusMsg(`🏗️ جاري تنفيذ الجراحة الذكية على الوحدة (${sectionName})...`);
    try {
      const res = await axios.post('http://localhost:5000/api/academy2/surgeon/operate-unit', {
        courseTitle: `${course?.parentCertTitle || ''} ${course?.title || ''}`.trim(),
        sectionName,
        currentLessons: sectionLessons,
        userCommand: cmd
      });

      if (res.data?.success && Array.isArray(res.data.data?.updatedLessonsBlueprint)) {
        const blueprint = res.data.data.updatedLessonsBlueprint;
        const rebuiltUnitLessons = blueprint.map((item, idx) => {
          const existing = sectionLessons.find(
            old => old.title.trim().toLowerCase() === (item.title || '').trim().toLowerCase()
          ) || sectionLessons[idx];

          if (existing && item.title === existing.title) {
            return { ...existing, description: item.description || existing.description };
          }
          return {
            ...(existing || {}),
            _id: existing?._id || `lesson_unit_ai_${Date.now()}_${idx}`,
            title: item.title || `درس ${idx + 1}`,
            description: item.description || '',
            type: item.type || existing?.type || 'video',
            section: sectionName,
            content: existing?.content || `### 🎯 1. مقدمة الدرس: ${item.title}\n${item.description || 'درس جديد تمت إضافته عبر جراح الوحدة الذكي.'}`
          };
        });

        // استبدال دروس هذه الوحدة بالدروس المهيكلة الجديدة مع الحفاظ على باقي الوحدات
        const finalLessons = [];
        let unitInserted = false;
        lessons.forEach(l => {
          if (l.section === sectionName) {
            if (!unitInserted) {
              finalLessons.push(...rebuiltUnitLessons);
              unitInserted = true;
            }
          } else {
            finalLessons.push(l);
          }
        });
        if (!unitInserted) finalLessons.push(...rebuiltUnitLessons);

        commitLessonsListUpdate(finalLessons, res.data.data.surgeonReport || `تم تحديث هيكل الوحدة (${sectionName}) بالذكاء الاصطناعي!`);
        setUnitSurgeonCommand('');
        setActiveUnitSurgeon(null);
      }
    } catch (e) {
      alert('تعذر الاتصال بمسار جراحة الوحدة في السيرفر، تأكد من إضافة مسار /operate-unit.');
    } finally {
      setIsOperatingLesson(false);
    }
  };

  // 5. إضافة وحدة جديدة بالكامل للكورس (Manual Course Unit Addition)
  const handleAddNewUnitToCourse = () => {
    const unitTitle = (newUnitNameInput || '').trim();
    if (!unitTitle) return alert('اكتب اسم الوحدة الجديدة أولاً!');
    const starterLesson = {
      _id: `lesson_new_unit_${Date.now()}`,
      title: `الدرس 1: مدخل إلى ${unitTitle}`,
      description: `الدرس الافتتاحي في ${unitTitle}`,
      type: 'video',
      lessonCategory: 'language_mastery',
      section: unitTitle,
      content: `### 🎯 1. مرحباً بك في ${unitTitle}\nتم إنشاء هذه الوحدة الجديدة بنجاح! يمكنك الآن استخدام **المُشرط الذكي** لتوليد أو تعديل محتوى هذا الدرس.`,
      codeSnippet: '',
      codeExplanation: ''
    };
    const nextLessons = [...lessons, starterLesson];
    setNewUnitNameInput('');
    setOpenSections(prev => ({ ...prev, [unitTitle]: true }));
    commitLessonsListUpdate(nextLessons, `تم إنشاء الوحدة الجديدة (${unitTitle}) وإضافتها للكورس!`);
    setActiveLesson(starterLesson);
  };

  // 6. جراحة الكراش كورس بالكامل بالذكاء الاصطناعي (Course-Level AI Surgeon)
  const handleExecuteCourseSurgeon = async (customCmd = null) => {
    const cmd = (customCmd || courseSurgeonCommand || '').trim();
    if (!cmd) return;
    setIsOperatingLesson(true);
    setSurgeonStatusMsg('🌍 جاري إعادة هيكلة الكراش كورس بالكامل عبر الذكاء الاصطناعي...');
    try {
      const currentBlueprint = Object.values(
        lessons.reduce((acc, l) => {
          const sName = l.section || 'الوحدة 1';
          if (!acc[sName]) acc[sName] = { sectionName: sName, lessons: [] };
          acc[sName].lessons.push({ title: l.title, type: l.type, description: l.description });
          return acc;
        }, {})
      );

      const res = await axios.post('http://localhost:5000/api/academy2/surgeon/operate-course-blueprint', {
        courseTitle: `${course?.parentCertTitle || ''} ${course?.title || ''}`.trim(),
        currentBlueprint,
        userCommand: cmd
      });

      if (res.data?.success && Array.isArray(res.data.data?.updatedBlueprint)) {
        const nextFlatLessons = [];
        res.data.data.updatedBlueprint.forEach((sec, sIdx) => {
          const secName = sec.sectionName || `الوحدة ${sIdx + 1}`;
          (sec.lessons || []).forEach((lesItem, lIdx) => {
            const matchedOld = lessons.find(
              old => old.title.trim().toLowerCase() === (lesItem.title || '').trim().toLowerCase()
            );
            if (matchedOld) {
              nextFlatLessons.push({
                ...matchedOld,
                section: secName,
                sectionOrder: sIdx + 1
              });
            } else {
              nextFlatLessons.push({
                _id: `lesson_course_ai_${Date.now()}_${sIdx}_${lIdx}`,
                title: lesItem.title || `الدرس ${lIdx + 1}`,
                description: lesItem.description || `درس جديد ضمن ${secName}`,
                type: lesItem.type || 'video',
                lessonCategory: 'language_mastery',
                section: secName,
                sectionOrder: sIdx + 1,
                content: `### 🎯 1. ${lesItem.title}\nدرس جديد تمت إضافته عبر **جراح الكورس الشامل** ضمن (${secName}). افتح المُشرط الذكي لإثرائه الآن!`
              });
            }
          });
        });

        if (nextFlatLessons.length > 0) {
          commitLessonsListUpdate(nextFlatLessons, res.data.data.surgeonReport || 'تم تحديث هيكل الكراش كورس بالكامل!');
        }
        setCourseSurgeonCommand('');
        setIsCourseSurgeonOpen(false);
      }
    } catch (e) {
      alert('تعذر الاتصال بمسار جراحة الكورس الشامل، تأكد من إضافة مسار /operate-course-blueprint.');
    } finally {
      setIsOperatingLesson(false);
    }
  };

 // 🤖 دالة تعديل قسم واحد فقط بالذكاء الاصطناعي
  const handleAiEditSingleSection = async (sectionMarkdown, userInstruction) => {
    try {
      const res = await axios.post('http://localhost:5000/api/academy2/surgeon/operate-section', {
        courseTitle: `${course?.parentCertTitle || ''} ${course?.title || ''}`.trim(),
        courseOrder: course?.courseOrder || (activeCertCourseIdx + 1) || 1,
        lessonTitle: activeLesson?.title || '',
        sectionMarkdown,
        userInstruction,
        targetLanguage: course?.targetLanguage || activeLangConfig.nameAr
      });
      if (res.data?.success && res.data.updatedSectionMarkdown) {
        return res.data.updatedSectionMarkdown;
      }
    } catch (e) {
      alert('تعذر تعديل هذا القسم بالذكاء الاصطناعي حالياً.');
    }
    return null;
  };

 // ✨ دالة جلب الإلهام الذكي لتطوير شريحة أو عنصر واحد من الدرس
  const handleAiInspireSingleSection = async (sectionMarkdown) => {
    try {
      const res = await axios.post('http://localhost:5000/api/academy2/surgeon/inspire-section', {
        courseTitle: `${course?.parentCertTitle || ''} ${course?.title || ''}`.trim(),
        courseOrder: course?.courseOrder || (activeCertCourseIdx + 1) || 1,
        sectionName: activeLesson?.section || '',
        lessonTitle: activeLesson?.title || '',
        sectionMarkdown,
        targetLanguage: course?.targetLanguage || activeLangConfig.nameAr
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (e) {
      alert('تعذر توليد الإلهام لهذه الشريحة، تأكد من إضافة مسار /inspire-section في السيرفر 5000.');
    }
    return null;
  };



  // 📥 تصدير وتحميل ملف الـ JSON المحدث في أي وقت
  const handleExportUpdatedJSON = () => {
    const fullSnapshot = buildLiveCourseJSONSnapshot(lessons);
    const jsonString = JSON.stringify(fullSnapshot, null, 2);
    localStorage.setItem('cherif_active_local_course_json', jsonString);

    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (course?.title || 'Master_Course').replace(/[^\u0600-\u06FFa-zA-Z0-9_-]/g, '_').slice(0, 45);
    a.download = `Updated_${safeName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSurgeonStatusMsg('📥 تم حفظ وتصدير ملف الـ JSON المحدث بنجاح!');
  };

  const handleAnalyzeCurrentLesson = async () => {
    if (!activeLesson) return;
    setIsAnalyzingLesson(true);
    setSurgeonStatusMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/academy2/surgeon/critique-and-suggest', {
        courseTitle: `${course?.parentCertTitle || ''} ${course?.title || ''}`.trim(),
        courseDescription: course?.description || '',
        courseOrder: course?.courseOrder || (activeCertCourseIdx + 1) || 1,
        sectionName: activeLesson.section || '',
        lesson: activeLesson,
        targetLanguage: course?.targetLanguage || activeLangConfig.nameAr
      });
      if (res.data?.success) {
        setSurgeonCritique(res.data.data);
      }
    } catch (e) {
      setSurgeonStatusMsg('⚠️ تعذر جلب الاقتراحات التلقائية، يمكنك كتابة أمرك مباشرة بالأسفل.');
    } finally {
      setIsAnalyzingLesson(false);
    }
  };

  const handleExecuteSurgeonCommand = async (commandText, opType = 'custom') => {
    if (!commandText || !commandText.trim() || !activeLesson) return;
    setIsOperatingLesson(true);
    setSurgeonStatusMsg('🩺 جاري تنفيذ التعديل الجراحي وحقن العناصر في الدرس...');

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/surgeon/operate-lesson', {
        courseTitle: `${course?.parentCertTitle || ''} ${course?.title || ''}`.trim(),
        courseDescription: course?.description || '',
        courseOrder: course?.courseOrder || (activeCertCourseIdx + 1) || 1,
        sectionName: activeLesson.section || '',
        lesson: activeLesson,
        userCommand: commandText,
        operationType: opType,
        targetLanguage: course?.targetLanguage || activeLangConfig.nameAr
      });

      if (res.data?.success && res.data.updatedLesson) {
        await applyUpdatedLessonToState(res.data.updatedLesson, res.data.surgeonReport);
        setCustomSurgeonCommand('');
      }
    } catch (e) {
      setSurgeonStatusMsg('❌ حدث خطأ أثناء تعديل الدرس. حاول مرة أخرى.');
    } finally {
      setIsOperatingLesson(false);
    }
  };

  const handleUndoLastSurgeonEdit = async () => {
    if (lessonUndoStack.length === 0) return;
    const previousVersion = lessonUndoStack[lessonUndoStack.length - 1];
    setLessonUndoStack(prev => prev.slice(0, -1));
    const nextLessons = lessons.map(l => (l._id === previousVersion._id ? previousVersion : l));
    setActiveLesson(previousVersion);
    setLessons(nextLessons);

    try {
      localStorage.setItem(`cherif_saved_lesson_${id}_${previousVersion._id}`, JSON.stringify(previousVersion));
      const fullSnapshot = buildLiveCourseJSONSnapshot(nextLessons);
      localStorage.setItem('cherif_active_local_course_json', JSON.stringify(fullSnapshot));
      await axios.post('http://localhost:5000/api/academy2/surgeon/save-lesson-db', {
        lessonId: previousVersion._id,
        courseId: id,
        updatedLesson: previousVersion
      });
    } catch (e) {}

    setSurgeonStatusMsg('↩️ تم التراجع واستعادة النسخة السابقة من الدرس وحفظها بنجاح.');
  };

  // ============================================================================
  // 🔄 دوال استرجاع وبناء الكورس وملفات JSON
  // ============================================================================
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
        const lessonId = les._id || `lesson_${sIdx + 1}_${lIdx + 1}`;
        let lessonObj = {
          ...les,
          _id: lessonId,
          order: les.order || globalOrder++,
          sectionOrder: sec.sectionOrder || (sIdx + 1),
          section: secName
        };
        const savedOverride = localStorage.getItem(`cherif_saved_lesson_${id}_${lessonId}`);
        if (savedOverride) {
          try { lessonObj = { ...lessonObj, ...JSON.parse(savedOverride) }; } catch (e) {}
        }
        flatLessons.push(lessonObj);
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
  // 🔊 نظام الصوتيات واستوديو الاستماع (Web Speech + AI Neural TTS)
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
      .map(l => l
        .replace(/🔊.*$/g, '')
        .replace(/\|.*$/g, '')
        .replace(/^✅.*$/g, '')
        .replace(/^\d+[.) -]+/, '')
        .replace(/\([^)]*[\u0600-\u06FF]+[^)]*\)/g, '')
        .replace(/[\u0600-\u06FF]+/g, '')
        .trim()
      )
      .filter(l => l && !l.startsWith('🎧') && /[A-Za-z\u00C0-\u024F\u3040-\u30ff\u4e00-\u9faf]/.test(l))
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
    const cacheKey = `${detectedLang.code}_${textToSpeak}`;
    setSpeakingKey(activeStateKey);

    const playDataUrlWithRate = async (dataUrl) => {
      const audio = new Audio(dataUrl);
      audio.playbackRate = Number(rate) || 1.0;
      activeHtmlAudioRef.current = audio;
      audio.onended = () => {
        setSpeakingKey('');
        if (onEndCallback) onEndCallback();
      };
      audio.onerror = () => setSpeakingKey('');
      await audio.play();
    };

    if (neuralAudioCacheRef.current[cacheKey]) {
      try {
        await playDataUrlWithRate(neuralAudioCacheRef.current[cacheKey]);
        return;
      } catch (e) {}
    }

    try {
      const res = await axios.post('http://localhost:5000/api/academy2/lang-cert/neural-tts', {
        text: textToSpeak,
        langCode: detectedLang.code,
        rate: 1.0
      }, { timeout: 7000 });

      if (res.data?.success && res.data.audioUrl) {
        neuralAudioCacheRef.current[cacheKey] = res.data.audioUrl;
        await playDataUrlWithRate(res.data.audioUrl);
        return;
      }
    } catch (e) {}

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

 // ============================================================================
  // 📡 جلب البيانات الأساسية من السيرفر 5001 (المصدر الحقيقي الوحيد للبيانات)
  // ============================================================================
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
        
        // 🌟 الأولوية رقم 1 دائماً للدروس المحفوظة فعلياً في قاعدة بيانات السيرفر 5001
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
          if (fetchedLessons[0]?.section) {
            setOpenSections({ [fetchedLessons[0].section]: true });
          }
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

  

  // ============================================================================
  // 🧠 معالجة الودجات الصوتية والبصرية للدرس
  // ============================================================================
  const audioStudioItems = useMemo(() => 
    parseAudioShadowingSnippet(activeLesson?.codeSnippet || ''), [activeLesson]);

  useEffect(() => {
    if (!audioStudioItems || audioStudioItems.length === 0) return;

    const preloadAudioInBg = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      for (const item of audioStudioItems) {
        if (!item.sentence) continue;
        const detectedLang = resolveLanguageConfig(
          `${course?.targetLanguage || ''} ${course?.speechLang || ''} ${activeLesson?.section || ''}`,
          item.sentence
        );
        const cacheKey = `${detectedLang.code}_${item.sentence}`;
        if (!neuralAudioCacheRef.current[cacheKey]) {
          try {
            const res = await axios.post('http://localhost:5000/api/academy2/lang-cert/neural-tts', {
              text: item.sentence,
              langCode: detectedLang.code,
              rate: 1.0
            });
            if (res.data?.success && res.data.audioUrl) {
              neuralAudioCacheRef.current[cacheKey] = res.data.audioUrl;
            }
          } catch (e) {}
        }
      }
    };
    preloadAudioInBg();
  }, [audioStudioItems, course, activeLesson]);

  const visualWidgets = useMemo(() => {
    return extractLanguageVisualWidgets(activeLesson?.content || '');
  }, [activeLesson]);

  const effectiveMistakeRows = useMemo(() => {
    if (Array.isArray(activeLesson?.customMistakeRows)) return activeLesson.customMistakeRows;
    return visualWidgets.mistakeRows;
  }, [activeLesson, visualWidgets]);

  const lessonTargetVocabulary = useMemo(() => {
    const fromAudio = audioStudioItems.map(i => i.sentence).filter(Boolean);
    const combined = [...new Set([...fromAudio, ...visualWidgets.extractedChunks])];
    return combined.slice(0, 6);
  }, [audioStudioItems, visualWidgets]);

  const effectiveLegoEquations = useMemo(() => {
    if (Array.isArray(activeLesson?.customLegoEquations)) return activeLesson.customLegoEquations;
    return visualWidgets.legoEquations;
  }, [activeLesson, visualWidgets]);

  const effectiveLadderSteps = useMemo(() => {
    if (Array.isArray(activeLesson?.customLadderSteps)) return activeLesson.customLadderSteps;
    return visualWidgets.ladderSteps;
  }, [activeLesson, visualWidgets]);

  // ============================================================================
  // 🧠🎙️ المحرك الثلاثي الذكي وحصة المحادثة (Voice Coach)
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
    setSurgeonCritique(null);
    setSurgeonStatusMsg('');
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
  }, [activeLesson?._id]);

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

  // ============================================================================
  // 🏆 نظام التقدم والشهادات والاختبارات
  // ============================================================================
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
      {/* 🗂️ القائمة الجانبية (Sidebar) + جراح الكورس والوحدات للأدمين */}
      {/* ======================================================= */}
      <div className={`fixed md:static inset-y-0 right-0 z-40 w-80 bg-[#0b1120] border-l border-slate-800/70 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} transition-transform duration-300 flex flex-col shadow-2xl`}>
<div className="p-4 border-b border-slate-800/60 flex justify-between items-center bg-[#0b1120] sticky top-0 z-10 gap-2">
          <Link to={`/course/${id}`} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-semibold text-xs transition-colors shrink-0">
            <ArrowRight size={15} /> العودة
          </Link>

          {canEditCourse && (
            <div className="flex items-center gap-1.5">
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
                className="bg-indigo-500/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                title="فتح ملف JSON"
              >
                <Upload size={12} /> JSON
              </button>

{/* ↩️ زر التراجع العالمي (Undo) */}
              {globalUndoStack.length > 0 && (
                <button
                  type="button"
                  onClick={handleGlobalUndo}
                  className="bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 px-2 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all border border-amber-500/30"
                  title="تراجع عن آخر تعديل (Undo)"
                >
                  <RotateCcw size={12} /> تراجع ({globalUndoStack.length})
                </button>
              )}

              {/* ↪️ زر الإعادة العالمي (Redo) */}
              {globalRedoStack.length > 0 && (
                <button
                  type="button"
                  onClick={handleGlobalRedo}
                  className="bg-sky-500/15 hover:bg-sky-500 text-sky-400 hover:text-slate-950 px-2 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all border border-sky-500/30 shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                  title="إعادة ما تم التراجع عنه (Redo)"
                >
                  <RotateCw size={12} /> استعادة ({globalRedoStack.length})
                </button>
              )}

              {/* 🟢 زر الحفظ الشامل */}
              <button
                type="button"
                disabled={isSyncingCourse}
                onClick={handleSyncFullCourseToDB}

                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] disabled:opacity-50"
                title="مزامنة جميع التعديلات في قاعدة البيانات فوراً"
              >
                <RefreshCw size={12} className={isSyncingCourse ? 'animate-spin' : ''} />
                {isSyncingCourse ? 'جاري الحفظ...' : 'حفظ التعديلات 💾'}
              </button>
            </div>
          )}

          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors shrink-0"><X size={20} /></button>
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

        {/* ======================================================= */}
        {/* 🌍 جراح الكراش كورس الشامل (Course-Level Surgeon - خاص بالأدمين) */}
        {/* ======================================================= */}
        {canEditCourse && (
          <div className="px-3.5 py-3 bg-gradient-to-r from-amber-950/30 via-[#070d19] to-indigo-950/30 border-b border-amber-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
                <Stethoscope size={13} className="text-amber-400" /> 🌍 جراح الكورس الشامل
              </span>
              <button
                type="button"
                onClick={() => setIsCourseSurgeonOpen(!isCourseSurgeonOpen)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                  isCourseSurgeonOpen
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500 hover:text-slate-950'
                }`}
              >
                {isCourseSurgeonOpen ? 'إغلاق ▲' : 'هندسة الوحدات ▼'}
              </button>
            </div>

            {isCourseSurgeonOpen && (
              <div className="space-y-2.5 pt-1 animate-fade-in">
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    disabled={isOperatingLesson}
                    onClick={() => handleExecuteCourseSurgeon('بصفتك الناقد العالمي Rater: راجع تسلسل وحدات هذا الكورس وأضف وحدة انتقالية أو مشروعاً يربط الوحدات ببعضها بتماسك 100%.')}
                    className="bg-slate-900 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-400 text-[10px] font-bold text-amber-300 p-1.5 rounded-lg text-center"
                  >
                    🧐 رؤية الناقد
                  </button>
                  <button
                    type="button"
                    disabled={isOperatingLesson}
                    onClick={() => handleExecuteCourseSurgeon('بصفتك الأستاذ الخبير: ادمج الوحدات المتشابهة، وأضف وحدة تطبيقية لما ينقص الكورس علمياً.')}
                    className="bg-slate-900 hover:bg-indigo-500/20 border border-slate-700 hover:border-indigo-400 text-[10px] font-bold text-indigo-300 p-1.5 rounded-lg text-center"
                  >
                    👨‍🏫 رؤية الأستاذ
                  </button>
                  <button
                    type="button"
                    disabled={isOperatingLesson}
                    onClick={() => handleExecuteCourseSurgeon('بصفتك التلميذ الذكي: أضف وحدة مراجعة سريعة وتحديات ممتعة قبل نهاية الكورس لتثبيت المهارات.')}
                    className="bg-slate-900 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-400 text-[10px] font-bold text-emerald-300 p-1.5 rounded-lg text-center"
                  >
                    🎓 رؤية التلميذ
                  </button>
                </div>

                <textarea
                  value={courseSurgeonCommand}
                  onChange={(e) => setCourseSurgeonCommand(e.target.value)}
                  placeholder="أمر جراحي للكورس (مثال: أضف وحدة محادثات المطار قبل الوحدة الأخيرة، أو رتب الوحدات من الأسهل للأصعب)..."
                  rows={2}
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl p-2 text-[11px] text-white outline-none resize-none"
                />
                <button
                  type="button"
                  disabled={isOperatingLesson || !courseSurgeonCommand.trim()}
                  onClick={() => handleExecuteCourseSurgeon()}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] py-2 rounded-xl transition-all disabled:opacity-50"
                >
                  {isOperatingLesson ? '⏳ جاري هندسة الكورس...' : '⚡ نفّذ على هيكل الكورس بالـ AI'}
                </button>

                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newUnitNameInput}
                    onChange={(e) => setNewUnitNameInput(e.target.value)}
                    placeholder="اسم وحدة جديدة يدوياً..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewUnitToCourse}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                  >
                    <Plus size={12} /> وحدة
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
          {Object.entries(groupedLessons).map(([sectionName, sectionLessons], sIndex) => {
            const completedInSection = sectionLessons.filter(l => completedLessons.includes(l._id)).length;
            const isSectionOpen = openSections[sectionName] || false;
            const isProjectSection = sectionName.includes('مشروع') || sectionName.includes('GitHub') || sectionName.includes('تحدي');
            const isThisUnitSurgeonActive = activeUnitSurgeon === sectionName;

            return (
              <div key={sIndex} className={`border rounded-xl overflow-hidden transition-all duration-300 ${isProjectSection ? 'bg-emerald-950/15 border-emerald-500/30' : 'bg-[#060b16] border-slate-800/70'}`}>
                
                <div className={`w-full flex items-center justify-between p-3.5 transition-all duration-200 ${isSectionOpen ? 'bg-slate-800/60 border-b border-slate-800' : 'hover:bg-slate-900/80'}`}>
                  <button 
                    type="button"
                    onClick={() => toggleSection(sectionName)}
                    className="text-right flex-1 pl-2"
                  >
                    <h3 className={`heading-font font-bold text-[13.5px] mb-1 leading-[1.5] ${isSectionOpen ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {sectionName}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">{completedInSection} / {sectionLessons.length} محطات مكتملة</p>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {canEditCourse && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isThisUnitSurgeonActive) {
                            setActiveUnitSurgeon(null);
                          } else {
                            setActiveUnitSurgeon(sectionName);
                            setEditingUnitNameValue(sectionName);
                          }
                        }}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isThisUnitSurgeonActive
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                            : 'bg-slate-900 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                        title="جراح الوحدة (إضافة/حذف دروس أو تعديل الوحدة بالـ AI)"
                      >
                        <Stethoscope size={13} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleSection(sectionName)}
                      className={`shrink-0 transition-transform duration-300 ${isSectionOpen ? 'text-emerald-400 rotate-180' : 'text-slate-500'}`}
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>

                {/* ======================================================= */}
                {/* 🏗️ لوحة جراح الوحدة الدراسية (Unit-Level Surgeon - خاص بالأدمين) */}
                {/* ======================================================= */}
                {canEditCourse && isThisUnitSurgeonActive && (
                  <div className="p-3 bg-amber-950/25 border-b border-amber-500/30 space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-amber-300">
                        🏗️ جراح الوحدة: {sectionName.slice(0, 26)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteUnit(sectionName)}
                        className="text-[10px] bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white px-2 py-0.5 rounded font-bold flex items-center gap-1"
                        title="حذف هذه الوحدة بالكامل"
                      >
                        <Trash2 size={11} /> حذف الوحدة
                      </button>
                    </div>

                    {/* أزرار الثلاثي السريعة للوحدة */}
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        disabled={isOperatingLesson}
                        onClick={() => handleExecuteUnitSurgeon(sectionName, sectionLessons, 'بصفتك الناقد العالمي: رتب دروس هذه الوحدة وأضف درساً يربط بينها بتسلسل منطقي متماسك.')}
                        className="bg-slate-950 hover:bg-amber-500/20 border border-slate-800 text-[10px] font-bold text-amber-300 py-1 rounded"
                      >
                        🧐 الناقد
                      </button>
                      <button
                        type="button"
                        disabled={isOperatingLesson}
                        onClick={() => handleExecuteUnitSurgeon(sectionName, sectionLessons, 'بصفتك الأستاذ الخبير: احذف أي تكرار في عناوين الدروس وأضف درساً يغطي الفجوة العلمية في هذه الوحدة.')}
                        className="bg-slate-950 hover:bg-indigo-500/20 border border-slate-800 text-[10px] font-bold text-indigo-300 py-1 rounded"
                      >
                        👨‍🏫 الأستاذ
                      </button>
                      <button
                        type="button"
                        disabled={isOperatingLesson}
                        onClick={() => handleExecuteUnitSurgeon(sectionName, sectionLessons, 'بصفتك التلميذ الذكي: أضف في نهاية هذه الوحدة درس مراجعة وتطبيق عملي مبسط.')}
                        className="bg-slate-950 hover:bg-emerald-500/20 border border-slate-800 text-[10px] font-bold text-emerald-300 py-1 rounded"
                      >
                        🎓 التلميذ
                      </button>
                    </div>

                    {/* أمر AI مخصص للوحدة */}
                    <textarea
                      value={unitSurgeonCommand}
                      onChange={(e) => setUnitSurgeonCommand(e.target.value)}
                      placeholder="أمر بالـ AI لهذه الوحدة (مثال: أضف درسين عن النطق، أو ادمج الدرس 1 و 2)..."
                      rows={2}
                      className="w-full bg-slate-950 border border-amber-500/40 rounded-lg p-2 text-[11px] text-white outline-none resize-none"
                    />
                    <button
                      type="button"
                      disabled={isOperatingLesson || !unitSurgeonCommand.trim()}
                      onClick={() => handleExecuteUnitSurgeon(sectionName, sectionLessons)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] py-1.5 rounded-lg transition-all disabled:opacity-50"
                    >
                      {isOperatingLesson ? '⏳ جاري تعديل الوحدة...' : '🤖 نفّذ تعديل الوحدة بالـ AI'}
                    </button>

                    {/* تعديل اسم الوحدة يدوياً */}
                    <div className="flex items-center gap-1 pt-1 border-t border-slate-800">
                      <input
                        type="text"
                        value={editingUnitNameValue}
                        onChange={(e) => setEditingUnitNameValue(e.target.value)}
                        placeholder="تعديل اسم الوحدة..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRenameUnit(sectionName, editingUnitNameValue)}
                        className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0"
                      >
                        ✏️ تسمية
                      </button>
                    </div>

                    {/* إضافة درس جديد يدوياً داخل هذه الوحدة */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newLessonTitleInUnit}
                        onChange={(e) => setNewLessonTitleInUnit(e.target.value)}
                        placeholder="عنوان درس جديد في هذه الوحدة..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddLessonToUnit(sectionName)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-0.5"
                      >
                        <Plus size={11} /> درس
                      </button>
                    </div>
                  </div>
                )}

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
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setShowUnitSummaryBanner(!showUnitSummaryBanner)}>
                      <Target size={18} className="text-amber-400 shrink-0" />
                      <span className="heading-font text-sm font-bold text-indigo-300">
                        بوصلة الوحدة الحالية: {activeLesson.section}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {canEditCourse && (
                        <button
                          type="button"
                          onClick={() => {
                            setSidebarOpen(true);
                            setActiveUnitSurgeon(activeUnitSurgeon === activeLesson.section ? null : activeLesson.section);
                            setEditingUnitNameValue(activeLesson.section);
                          }}
                          className="bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Stethoscope size={12} /> جراحة هذه الوحدة
                        </button>
                      )}
                      <ChevronDown
                        size={16}
                        onClick={() => setShowUnitSummaryBanner(!showUnitSummaryBanner)}
                        className={`text-slate-400 cursor-pointer transition-transform ${showUnitSummaryBanner ? 'rotate-180' : ''}`}
                      />
                    </div>
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
                /* 📘 الدرس العادي: الشرح + استوديو الجراحة الشامل لجميع العناصر */
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

                  {/* ======================================================= */}
                  {/* 🩺✨ غرفة الجراحة الذكية ومجلس الحكماء الثلاثي (AI Lesson Surgeon) */}
                  {/* 🛡️ لا يظهر هذا الصندوق أبداً إلا للأدمين أو الأستاذ صاحب الكورس! */}
                  {/* ======================================================= */}
                  {isCourseOwnerOrAdmin && (
                    <div className="mb-8 bg-gradient-to-br from-amber-950/25 via-[#0b1120] to-indigo-950/25 border-2 border-amber-500/40 rounded-2xl p-5 shadow-xl">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                            <Sparkles size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="heading-font text-sm md:text-base font-black text-white">
                                🩺 المُشرط الذكي ومجلس الحكماء الثلاثي (AI Lesson Surgeon)
                              </h3>
                              <span className="text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                                🔒 خاص بالأدمين فقط
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              استلهم من (الناقد Rater، الأستاذ، والتلميذ)، أو عدّل واحذف أي قسم أو عنصر في الدرس مع حفظ تلقائي فوري!
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setStudentPreviewMode(!studentPreviewMode)}
                            className={`text-xs font-bold px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                              studentPreviewMode
                                ? 'bg-sky-500 text-slate-950 border-sky-400 font-black'
                                : 'bg-slate-900 hover:bg-slate-800 text-sky-300 border-sky-500/30'
                            }`}
                            title="شاهد الدرس تماماً كما يراه التلميذ بدون أزرار التعديل"
                          >
                            {studentPreviewMode ? <Eye size={14} /> : <EyeOff size={14} />}
                            {studentPreviewMode ? 'العودة لوضع الأدمين 🩺' : 'معاينة كـتلميذ 🎓'}
                          </button>

                          {lessonUndoStack.length > 0 && !studentPreviewMode && (
                            <button
                              type="button"
                              onClick={handleUndoLastSurgeonEdit}
                              className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-3 py-2 rounded-xl border border-amber-500/30 flex items-center gap-1.5"
                            >
                              <RotateCcw size={13} /> تراجع ({lessonUndoStack.length})
                            </button>
                          )}
                          {!studentPreviewMode && (
                            <>
                              <button
                                type="button"
                                onClick={handleExportUpdatedJSON}
                                className="bg-emerald-500/15 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold px-3 py-2 rounded-xl border border-emerald-500/30 transition-all"
                              >
                                💾 حفظ JSON المحدث
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextState = !isSurgeonOpen;
                                  setIsSurgeonOpen(nextState);
                                  if (nextState && !surgeonCritique) handleAnalyzeCurrentLesson();
                                }}
                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all shadow"
                              >
                                {isSurgeonOpen ? 'إغلاق المحرر الجراحي ▲' : 'فتح المحرر واقتراحات الـ AI ▼'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {!studentPreviewMode && isSurgeonOpen && (
                        <div className="mt-5 pt-5 border-t border-slate-800/90 space-y-5">
                          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                                <Sparkles size={15} /> 🧠 استلهم التعديلات من مجلس الحكماء الثلاثي:
                              </span>

                              {surgeonCritique?.applyAllCommand && (
                                <button
                                  type="button"
                                  disabled={isOperatingLesson}
                                  onClick={() => handleExecuteSurgeonCommand(surgeonCritique.applyAllCommand, 'apply_all_personas')}
                                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-1.5 transition-all disabled:opacity-50"
                                >
                                  <Zap size={14} /> 🚀 تطبيق كل توصيات الثلاثي دفعة واحدة (Apply All)
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setActivePersonaTab('rater');
                                  if (!surgeonCritique) handleAnalyzeCurrentLesson();
                                }}
                                className={`p-3 rounded-xl border text-right transition-all ${
                                  activePersonaTab === 'rater'
                                    ? 'bg-amber-500/20 border-amber-400 text-white shadow'
                                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div className="font-black text-xs text-amber-300">🧐 1. إلهام الناقد والـ Rater</div>
                                <p className="text-[11px] text-slate-400 mt-1">ماذا نضيف ليصبح الدرس متماسكاً ومثالياً 100%؟</p>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActivePersonaTab('teacher');
                                  if (!surgeonCritique) handleAnalyzeCurrentLesson();
                                }}
                                className={`p-3 rounded-xl border text-right transition-all ${
                                  activePersonaTab === 'teacher'
                                    ? 'bg-indigo-500/20 border-indigo-400 text-white shadow'
                                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div className="font-black text-xs text-indigo-300">👨‍🏫 2. إلهام الأستاذ الخبير</div>
                                <p className="text-[11px] text-slate-400 mt-1">ما الذي ينقص الدرس؟ وما الحشو الذي يجب حذفه أو تعديله؟</p>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setActivePersonaTab('student');
                                  if (!surgeonCritique) handleAnalyzeCurrentLesson();
                                }}
                                className={`p-3 rounded-xl border text-right transition-all ${
                                  activePersonaTab === 'student'
                                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow'
                                    : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div className="font-black text-xs text-emerald-300">🎓 3. إلهام التلميذ الذكي</div>
                                <p className="text-[11px] text-slate-400 mt-1">ماذا يريد التلميذ إضافته بالمنتصف ليفهم الدرس أسرع؟</p>
                              </button>
                            </div>

                            {surgeonCritique?.personas && activePersonaTab !== 'all' && surgeonCritique.personas[activePersonaTab] && (
                              <div className="bg-[#060c1a] border border-amber-500/40 rounded-xl p-4 space-y-3 animate-fade-in">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <h4 className="font-black text-xs sm:text-sm text-amber-300">
                                    {surgeonCritique.personas[activePersonaTab].roleTitle}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => setActivePersonaTab('all')}
                                    className="text-[11px] text-slate-400 hover:text-white"
                                  >
                                    إخفاء التفصيل
                                  </button>
                                </div>

                                <p className="text-xs text-slate-200 leading-relaxed">
                                  {surgeonCritique.personas[activePersonaTab].diagnosis ||
                                    surgeonCritique.personas[activePersonaTab].whatIsMissing ||
                                    surgeonCritique.personas[activePersonaTab].studentNeed}
                                </p>

                                {surgeonCritique.personas[activePersonaTab].whatToDeleteOrEdit && (
                                  <p className="text-xs text-rose-300 bg-rose-950/30 border border-rose-500/30 p-2.5 rounded-lg">
                                    ✂️ <strong>ما يجب حذفه أو تعديله:</strong> {surgeonCritique.personas[activePersonaTab].whatToDeleteOrEdit}
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                  <span className="text-xs font-bold text-emerald-300">
                                    💡 الاقتراح الجاهز: {surgeonCritique.personas[activePersonaTab].suggestionTitle}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={isOperatingLesson}
                                    onClick={() =>
                                      handleExecuteSurgeonCommand(
                                        surgeonCritique.personas[activePersonaTab].command,
                                        `persona_${activePersonaTab}`
                                      )
                                    }
                                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all"
                                  >
                                    ⚡ طبّق توصية {activePersonaTab === 'rater' ? 'الناقد' : activePersonaTab === 'teacher' ? 'الأستاذ' : 'التلميذ'} الآن
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-amber-300 ml-1">⚡ حقن فوري في منتصف الدرس:</span>
                            <button
                              type="button"
                              disabled={isOperatingLesson}
                              onClick={() =>
                                handleExecuteSurgeonCommand(
                                  'أضف في منتصف الدرس (مباشرة بعد القسم 2 جدول المفردات وقبل القسم 3) قسماً تفاعلياً بعنوان (### 🧩 محطة منتصف الدرس: املأ الفراغ التفاعلي) يضم 4 جمل قصيرة من مفردات الدرس بصيغة [[الإجابة_الصحيحة | خيار_خاطئ_1 | خيار_خاطئ_2]].',
                                  'inject_mid_fill_blank'
                                )
                              }
                              className="bg-indigo-500/20 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition-all disabled:opacity-50"
                            >
                              🧩 + إضافة (املأ الفراغ التفاعلي) بمنتصف الدرس
                            </button>

                            <button
                              type="button"
                              disabled={isOperatingLesson}
                              onClick={() =>
                                handleExecuteSurgeonCommand(
                                  'أضف في منتصف الدرس (بعد القسم 3 سُلّم البناء) صندوقاً بعنوان (### 💡 شفرة الذاكرة السريعة وحيلة النطق) يلخص أهم قاعدة في الدرس بأسلوب بصري لا يُنسى.',
                                  'inject_mid_custom'
                                )
                              }
                              className="bg-purple-500/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition-all disabled:opacity-50"
                            >
                              🧠 + حقن (شفرة ذاكرة) بمنتصف الدرس
                            </button>

                            <button
                              type="button"
                              disabled={isOperatingLesson}
                              onClick={() =>
                                handleExecuteSurgeonCommand(
                                  'احذف أي فقرات مكررة أو حشو غير مهم في الدرس، واجعل الشرح مكثفاً ومباشراً ومناسباً تماماً لمستوى الطالب.',
                                  'prune_fluff'
                                )
                              }
                              className="bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold px-3.5 py-2 rounded-xl transition-all disabled:opacity-50"
                            >
                              ✂️ حذف الحشو وتكثيف الدرس
                            </button>

                            <button
                              type="button"
                              disabled={isAnalyzingLesson}
                              onClick={handleAnalyzeCurrentLesson}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl mr-auto flex items-center gap-1"
                            >
                              <RefreshCw size={13} className={isAnalyzingLesson ? 'animate-spin' : ''} /> إعادة فحص الدرس بالثلاثي الذكي
                            </button>
                          </div>

                          {isAnalyzingLesson ? (
                            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-indigo-300 animate-pulse flex items-center gap-2">
                              <Bot size={16} className="text-amber-400" /> مجلس الحكماء (الناقد + الأستاذ + التلميذ) يقرأ محتوى الدرس الآن ويستخرج أفضل الإضافات...
                            </div>
                          ) : surgeonCritique ? (
                            <div className="space-y-3">
                              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs text-slate-300">
                                  🎯 <strong>تقييم الناقد الأكاديمي:</strong> {surgeonCritique.raterVerdict}
                                </span>
                                <span className="text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
                                  جودة الدرس: {surgeonCritique.qualityScore || 92}%
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {(surgeonCritique.midLessonSuggestions || []).map((sug, sIdx) => (
                                  <div
                                    key={sug.id || sIdx}
                                    className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 flex flex-col justify-between gap-3 transition-all"
                                  >
                                    <div>
                                      <span className="text-[10px] font-black bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full">
                                        {sug.badge || '💡 اقتراح منتصف الدرس'}
                                      </span>
                                      <h4 className="font-bold text-white text-xs mt-2">{sug.title}</h4>
                                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{sug.why}</p>
                                    </div>
                                    <button
                                      type="button"
                                      disabled={isOperatingLesson}
                                      onClick={() => handleExecuteSurgeonCommand(sug.command, sug.operationType)}
                                      className="w-full bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-black text-xs py-2 rounded-lg transition-all"
                                    >
                                      + احقن هذا العنصر في الدرس الآن
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {surgeonCritique.fluffToPrune && (
                                <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="text-xs">
                                    <strong className="text-rose-300 block">{surgeonCritique.fluffToPrune.title}</strong>
                                    <span className="text-slate-300">{surgeonCritique.fluffToPrune.whatToRemove}</span>
                                  </div>
                                  <button
                                    type="button"
                                    disabled={isOperatingLesson}
                                    onClick={() => handleExecuteSurgeonCommand(surgeonCritique.fluffToPrune.command, 'prune_fluff')}
                                    className="shrink-0 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-lg"
                                  >
                                    ✂️ نفّذ الحذف والتنظيف
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : null}

                          <div className="flex flex-col sm:flex-row gap-2.5">
                            <input
                              type="text"
                              value={customSurgeonCommand}
                              onChange={(e) => setCustomSurgeonCommand(e.target.value)}
                              placeholder="اكتب أمرك الجراحي هنا (مثال: أضف تمرين املأ الفراغ من 5 جمل في منتصف الدرس حول الألوان، أو احذف الحوار واستبدله بحوار في المطار)..."
                              className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none"
                            />
                            <button
                              type="button"
                              disabled={isOperatingLesson || !customSurgeonCommand.trim()}
                              onClick={() => handleExecuteSurgeonCommand(customSurgeonCommand, 'custom')}
                              className="bg-gradient-to-l from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all disabled:opacity-50 shrink-0"
                            >
                              {isOperatingLesson ? '⏳ جاري التعديل...' : '🩺 نفّذ التعديل على الدرس'}
                            </button>
                          </div>

                          {surgeonStatusMsg && (
                            <div className="text-xs font-bold text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
                              {surgeonStatusMsg}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* 🧩 معادلة مكعبات الليغو (مع شريط التحكم الجراحي) */}
                  {/* ======================================================= */}
                  {!activeLesson.hideLegoWidget && effectiveLegoEquations.length > 0 && (
                    <div className="mb-10 bg-gradient-to-br from-amber-950/25 via-[#0b1120] to-[#0b1120] border-2 border-amber-500/35 rounded-2xl p-6 shadow-xl">
                      <WidgetSurgeonBar
                        widgetTitle="🧩 معادلة مكعبات الليغو لبناء الصوت والجملة"
                        widgetType="lego"
                        initialData={effectiveLegoEquations.join('\n')}
                        isOperating={isOperatingLesson}
                        onSaveManual={(newText) => {
                          const lines = String(newText).split('\n').map(l => l.trim()).filter(Boolean);
                          applyUpdatedLessonToState({ ...activeLesson, customLegoEquations: lines }, 'تم تعديل معادلات الليغو يدوياً!');
                        }}
                        onRunAiEdit={(instruction) =>
                          handleExecuteSurgeonCommand(`في قسم معادلة التركيب البصرية (Lego Formula): ${instruction}`, 'edit_lego_widget')
                        }
                        onDeleteWidget={() =>
                          applyUpdatedLessonToState({ ...activeLesson, hideLegoWidget: true }, 'تم حذف صندوق معادلة الليغو من الدرس!')
                        }
                      />

                      <h3 className="heading-font text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <Puzzle size={20} /> 🧩 معادلة مكعبات الليغو لبناء الصوت والجملة (Lego Formula):
                      </h3>
                      <div className="space-y-3">
                        {effectiveLegoEquations.map((eq, idx) => (
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

                  {/* ======================================================= */}
                  {/* 🪜 سُلّم البناء التراكمي الناطق (مع شريط التحكم الجراحي) */}
                  {/* ======================================================= */}
                  {!activeLesson.hideLadderWidget && effectiveLadderSteps.length > 0 && (
                    <div className="mb-10 bg-gradient-to-br from-indigo-950/30 via-[#0b1120] to-[#0b1120] border-2 border-indigo-500/35 rounded-2xl p-6 shadow-xl">
                      <WidgetSurgeonBar
                        widgetTitle="🪜 سُلّم البناء التراكمي الناطق"
                        widgetType="ladder"
                        initialData={effectiveLadderSteps.map(s => s.rawText).join('\n')}
                        isOperating={isOperatingLesson}
                        onSaveManual={(newText) => {
                          const steps = String(newText)
                            .split('\n')
                            .map(l => l.trim())
                            .filter(Boolean)
                            .map(cleanStep => {
                              const foreignMatch = cleanStep.match(/([A-Za-z\u00C0-\u024F\u3040-\u30ff\u4e00-\u9faf][A-Za-z\u00C0-\u024F\u3040-\u30ff\u4e00-\u9faf\s,.?!'’¿¡-]+)/);
                              return { rawText: cleanStep, englishText: foreignMatch ? foreignMatch[1].trim() : '' };
                            });
                          applyUpdatedLessonToState({ ...activeLesson, customLadderSteps: steps }, 'تم تعديل سُلّم البناء التراكمي يدوياً!');
                        }}
                        onRunAiEdit={(instruction) =>
                          handleExecuteSurgeonCommand(`في قسم سُلّم البناء والارتقاء التراكمي (Escalation Ladder): ${instruction}`, 'edit_ladder_widget')
                        }
                        onDeleteWidget={() =>
                          applyUpdatedLessonToState({ ...activeLesson, hideLadderWidget: true }, 'تم حذف سُلّم البناء التراكمي من الدرس!')
                        }
                      />

                      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                        <h3 className="heading-font text-lg font-bold text-indigo-300 flex items-center gap-2">
                          <Layers size={20} className="text-emerald-400" /> 🪜 سُلّم البناء التراكمي الناطق باللغة {activeLangConfig.nameAr} (اضغط على كل درجة لسماعها):
                        </h3>
                        <span className="text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                          من كلمة واحدة ➔ جملة كاملة 🔊
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {effectiveLadderSteps.map((step, sIdx) => {
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

                  {/* ======================================================= */}
                  {/* 🧱 عرض محتوى الدرس مقسماً إلى أقسام قابلة للتعديل اليدوي أو بالـ AI أو الحذف */}
                  {/* ======================================================= */}
                  <div className="lesson-content">
                    {activeLesson.content ? (
                      <EditableLessonBlocks
                        rawMarkdown={sanitizeLessonMarkdown(activeLesson.content, true)}
                        isOperating={isOperatingLesson}
                        onSaveFullMarkdown={(newMarkdownContent, reportMsg) =>
                          applyUpdatedLessonToState({ ...activeLesson, content: newMarkdownContent }, reportMsg)
                        }
                        onAiEditBlock={handleAiEditSingleSection}
                        onAiInspireBlock={handleAiInspireSingleSection}
                        markdownComponents={{
                          h1({children}) {
                            return <h2 className="heading-font text-xl md:text-[26px] font-bold text-white mt-6 mb-5 leading-[1.4]">{children}</h2>
                          },
                          h2({children}) {
                            return <h2 className="heading-font text-xl md:text-[25px] font-bold text-white mt-6 mb-5 leading-[1.4]">{children}</h2>
                          },
                          h3({children}) {
                            return (
                              <h3 className="heading-font text-[20px] md:text-[23px] font-bold text-emerald-400 mt-4 mb-5 py-2.5 pr-4 pl-3 bg-gradient-to-l from-emerald-950/30 to-transparent border-r-4 border-emerald-500 rounded-l-lg flex items-center gap-2.5 leading-[1.4]">
                                {children}
                              </h3>
                            )
                          },
                          h4({children}) {
                            return (
                              <h4 className="heading-font text-[17.5px] md:text-[19.5px] font-bold text-sky-400 mt-6 mb-3 flex items-center gap-2 leading-[1.5]">
                                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shrink-0"></span>
                                {children}
                              </h4>
                            )
                          },
                          p({children}) {
                            const rawText = React.Children.toArray(children)
                              .map(c => (typeof c === 'string' ? c : c?.props?.children || ''))
                              .join('');
                            if (rawText.includes('[[') && rawText.includes(']]')) {
                              return <InlineFillBlankSentence rawText={rawText} onSpeak={handlePlayAudioText} />;
                            }
                            return (
                              <p className="text-[#cbd5e1] text-[16px] md:text-[17px] leading-[2.0] mb-6 font-normal">
                                {children}
                              </p>
                            );
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
                            const rawText = React.Children.toArray(children)
                              .map(c => (typeof c === 'string' ? c : c?.props?.children || ''))
                              .join('');
                            if (rawText.includes('[[') && rawText.includes(']]')) {
                              return (
                                <li className="list-none my-2">
                                  <InlineFillBlankSentence rawText={rawText} onSpeak={handlePlayAudioText} />
                                </li>
                              );
                            }
                            return (
                              <li className="text-[#cbd5e1] text-[16px] md:text-[17px] leading-[1.9] flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-3 shrink-0"></span>
                                <div className="flex-1">{children}</div>
                              </li>
                            );
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
                      />
                    ) : (
                      <div className="text-center py-24">
                        <BookOpen size={48} className="mx-auto text-slate-700 mb-4 animate-pulse" />
                        <p className="text-slate-500 text-lg font-medium">محتوى هذا الدرس قيد التجهيز...</p>
                      </div>
                    )}
                  </div>

                  {/* ======================================================= */}
                  {/* 📋 3. جدول الخلاصة التصحيحية (مع شريط التحكم الجراحي) */}
                  {/* ======================================================= */}
                  {!activeLesson.hideMistakesWidget && effectiveMistakeRows.length > 0 && (
                    <div className="mt-10 bg-[#0b1120] border-2 border-emerald-500/35 rounded-2xl p-6 shadow-xl">
                      <WidgetSurgeonBar
                        widgetTitle="📋 جدول الخلاصة التصحيحية (لا تقل كذا ❌ .. بل قل كذا ✅)"
                        widgetType="mistakes"
                        initialData={effectiveMistakeRows}
                        isOperating={isOperatingLesson}
                        onSaveManual={(updatedRows) =>
                          applyUpdatedLessonToState({ ...activeLesson, customMistakeRows: updatedRows }, 'تم تحديث جدول الخلاصة التصحيحية يدوياً!')
                        }
                        onRunAiEdit={(instruction) =>
                          handleExecuteSurgeonCommand(`في قسم ورشة الكتابة وتصحيح الأخطاء الشائعة (❌ الخطأ الشائع / ✅ الصواب الأصيل / 💡 السبب اللغوي): ${instruction}`, 'edit_mistakes_widget')
                        }
                        onDeleteWidget={() =>
                          applyUpdatedLessonToState({ ...activeLesson, hideMistakesWidget: true }, 'تم حذف جدول الخلاصة التصحيحية من هذا الدرس!')
                        }
                      />

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
                            {effectiveMistakeRows.map((row, rIdx) => (
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
                  {/* 🎙️🔥 4. استوديو "Speak Class" الثلاثي الاحترافي (مع شريط التحكم الجراحي) */}
                  {/* ======================================================= */}
                  {!activeLesson.hideSpeakClassWidget && (isLanguageLesson || visualWidgets.voicePrompt) && (
                    <div className="mt-12 bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#131129] border-2 border-indigo-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_60px_rgba(99,102,241,0.12)] space-y-6">
                      <WidgetSurgeonBar
                        widgetTitle="🎙️ غرفة المحادثة الحية (Live Speak Class)"
                        widgetType="lego"
                        initialData={activeLesson.customVoiceTitle || activeLesson.title}
                        isOperating={isOperatingLesson}
                        onSaveManual={(newTitle) =>
                          applyUpdatedLessonToState({ ...activeLesson, customVoiceTitle: String(newTitle).trim() }, 'تم تحديث عنوان وسيناريو غرفة المحادثة الحية!')
                        }
                        onRunAiEdit={(instruction) =>
                          handleExecuteSurgeonCommand(`في قسم التدريب الصوتي الحي ومفردات المحادثة (Live AI Voice Tutor & codeSnippet): ${instruction}`, 'edit_speak_class')
                        }
                        onDeleteWidget={() =>
                          applyUpdatedLessonToState({ ...activeLesson, hideSpeakClassWidget: true }, 'تم إخفاء غرفة المحادثة الحية من هذا الدرس!')
                        }
                      />

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
                              غرفة المحادثة الحية باللغة {activeLangConfig.nameAr}: {activeLesson.customVoiceTitle || activeLesson.title}
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
                  {/* 🎧🃏🧩 5. المختبر الصوتي التفاعلي + دليل الأذن (مع شريط التحكم الجراحي لكل منهما!) */}
                  {/* ======================================================= */}
                  {((activeLesson.codeSnippet && activeLesson.codeSnippet.trim() !== '') || (activeLesson.codeExplanation && activeLesson.codeExplanation.trim() !== '')) && (
                    <div className="mt-12 mb-12 pt-8 border-t border-slate-800/70">
                      
                      {activeLesson.codeSnippet && activeLesson.codeSnippet.trim() !== '' && (
                        audioStudioItems.length > 0 ? (
                          <div className="bg-[#0b1120] border-2 border-purple-500/40 rounded-2xl p-6 md:p-7 shadow-2xl space-y-6">
                            <WidgetSurgeonBar
                              widgetTitle="🎧 استوديو الصوتيات، بطاقات الذاكرة، ولعبة تركيب المكعبات"
                              widgetType="audio_studio"
                              initialData={activeLesson.codeSnippet}
                              isOperating={isOperatingLesson}
                              onSaveManual={(newSnippet) =>
                                applyUpdatedLessonToState({ ...activeLesson, codeSnippet: String(newSnippet) }, 'تم تحديث جمل استوديو الصوتيات يدوياً!')
                              }
                              onRunAiEdit={(instruction) =>
                                handleExecuteSurgeonCommand(`في حقل استوديو الاستماع والترديد (codeSnippet): ${instruction}`, 'edit_audio_studio')
                              }
                              onDeleteWidget={() =>
                                applyUpdatedLessonToState({ ...activeLesson, codeSnippet: '' }, 'تم حذف استوديو الصوتيات من هذا الدرس!')
                              }
                            />

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
                          <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 shadow-xl">
                            <WidgetSurgeonBar
                              widgetTitle="💻 الكود البرمجي التطبيقي (codeSnippet)"
                              widgetType="audio_studio"
                              initialData={activeLesson.codeSnippet}
                              isOperating={isOperatingLesson}
                              onSaveManual={(newSnippet) =>
                                applyUpdatedLessonToState({ ...activeLesson, codeSnippet: String(newSnippet) }, 'تم تحديث الكود البرمجي التطبيقي يدوياً!')
                              }
                              onRunAiEdit={(instruction) =>
                                handleExecuteSurgeonCommand(`في حقل الكود التطبيقي (codeSnippet): ${instruction}`, 'edit_code_snippet')
                              }
                              onDeleteWidget={() =>
                                applyUpdatedLessonToState({ ...activeLesson, codeSnippet: '' }, 'تم حذف الكود التطبيقي من هذا الدرس!')
                              }
                            />

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
                          </div>
                        )
                      )}

                      {activeLesson.codeExplanation && activeLesson.codeExplanation.trim() !== '' && (
                        <div className="mt-4 bg-[#081226] border border-indigo-500/25 rounded-xl p-6 relative overflow-hidden">
                          <WidgetSurgeonBar
                            widgetTitle={isLanguageLesson ? '🔬 دليل تدريب الأذن والنطق (Shadowing & Ear Anatomy)' : '🔬 تشريح الكود (Code Anatomy)'}
                            widgetType="code_explanation"
                            initialData={activeLesson.codeExplanation}
                            isOperating={isOperatingLesson}
                            onSaveManual={(newExp) =>
                              applyUpdatedLessonToState({ ...activeLesson, codeExplanation: String(newExp) }, 'تم تحديث دليل تدريب الأذن يدوياً!')
                            }
                            onRunAiEdit={(instruction) =>
                              handleExecuteSurgeonCommand(`في حقل دليل تدريب الأذن وتشريح النطق (codeExplanation): ${instruction}`, 'edit_code_explanation')
                            }
                            onDeleteWidget={() =>
                              applyUpdatedLessonToState({ ...activeLesson, codeExplanation: '' }, 'تم حذف دليل تدريب الأذن من هذا الدرس!')
                            }
                          />

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
                  {/* 💻✍️ 6. خانة التطبيق التفاعلي (مع شريط التحكم الجراحي: تعديل يدوي / AI / حذف) */}
                  {/* ======================================================= */}
                  {!activeLesson.hideCodingWidget && activeLesson.codingPractice && activeLesson.codingPractice.taskQuestion && (
                    <div className="mt-12 bg-[#081021] border-2 border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                      <WidgetSurgeonBar
                        widgetTitle={isLanguageLesson ? `✍️ ورشة الإملاء وتركيب الجمل باللغة ${activeLangConfig.nameAr}` : '💻 مختبر كتابة الكود التفاعلي'}
                        widgetType="coding_practice"
                        initialData={activeLesson.codingPractice}
                        isOperating={isOperatingLesson}
                        onSaveManual={(updatedPractice) => {
                          setStudentCode(updatedPractice.starterCode || '');
                          applyUpdatedLessonToState({ ...activeLesson, codingPractice: updatedPractice }, 'تم تحديث التمرين التطبيقي والتلميحات يدوياً!');
                        }}
                        onRunAiEdit={(instruction) =>
                          handleExecuteSurgeonCommand(`في حقل التمرين التطبيقي (codingPractice شاملة taskQuestion و hints و solutionCode): ${instruction}`, 'edit_coding_practice')
                        }
                        onDeleteWidget={() =>
                          applyUpdatedLessonToState({ ...activeLesson, codingPractice: null, hideCodingWidget: true }, 'تم حذف ورشة الإملاء والتمرين التطبيقي من هذا الدرس!')
                        }
                      />

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
                  {/* 🌟 7. سؤال نهاية الدرس الاختياري (مع شريط التحكم الجراحي: تعديل يدوي / AI / حذف) */}
                  {/* ======================================================= */}
                  {!activeLesson.hideQuestWidget && activeLesson.dailyQuest && activeLesson.dailyQuest.question && (
                    <div className="mt-14 bg-[#0b1120] border border-slate-800 rounded-2xl p-6 md:p-9 relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500"></div>
                      
                      <WidgetSurgeonBar
                        widgetTitle="🧠 سؤال التحدي السريع (Daily Quest)"
                        widgetType="daily_quest"
                        initialData={activeLesson.dailyQuest}
                        isOperating={isOperatingLesson}
                        onSaveManual={(updatedQuest) => {
                          handleRetryDailyQuest();
                          applyUpdatedLessonToState({ ...activeLesson, dailyQuest: updatedQuest }, 'تم تحديث سؤال التحدي السريع وخياراته يدوياً!');
                        }}
                        onRunAiEdit={(instruction) =>
                          handleExecuteSurgeonCommand(`في حقل سؤال التحدي السريع (dailyQuest شاملة question و options و correctAnswerIndex و explanation): ${instruction}`, 'edit_daily_quest')
                        }
                        onDeleteWidget={() =>
                          applyUpdatedLessonToState({ ...activeLesson, dailyQuest: null, hideQuestWidget: true }, 'تم حذف سؤال التحدي السريع من هذا الدرس!')
                        }
                      />

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
              {canEditCourse && (
                <button
                  type="button"
                  onClick={() => jsonInputRef.current?.click()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg"
                >
                  <Upload size={16} /> افتح ملف JSON الكراش كورس أو الشهادة مباشرة من جهازك
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classroom;
