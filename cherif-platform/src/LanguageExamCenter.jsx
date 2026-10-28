import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import {
  Globe, Award, Trophy, Headphones, BookOpen, PenTool, Mic, MicOff,
  Clock, CheckCircle2, Sparkles, Play, Square, Volume2, ShieldCheck,
  ArrowRight, ChevronLeft, Compass, Target, Zap, Printer, RefreshCw,
  AlertCircle, FileText, BrainCircuit, Layers, BarChart3, Flame,
  GitCompare, Eye, Scale, Activity, MessageSquare, HelpCircle
} from 'lucide-react';

// ============================================================================
// 🌍 1. الدستور المعياري للغات الـ 7 وخصوصية الاختبارات العالمية (The 7 Languages Matrix)
// ============================================================================
const LANGUAGE_EXAM_CONFIGS = {
  en: {
    id: 'en',
    nameAr: 'الإنجليزية',
    nameEn: 'English',
    flag: '🇬🇧',
    ttsLang: 'en-US',
    officialExamName: 'IELTS Academic / TOEFL iBT Hybrid',
    officialShort: 'IELTS / TOEFL iBT',
    scoreScaleLabel: 'IELTS Band (1.0-9.0) • TOEFL (0-120) • EF/DET (0-100)',
    organization: 'British Council / IDP / ETS Standard Simulation',
    finalBossTitle: 'الزعيم الأخير للإنجليزية: إعادة الصياغة (Paraphrasing)، أدوات الربط (Discourse Markers)، والمهارات المدمجة (Integrated Read+Listen)',
    finalBossRule: 'المصحح يخصم الدرجات فوراً إذا كررت نفس الكلمات الموجودة في نص السؤال دون إعادة صياغة، أو إذا غابت أدوات التخفيف الأكاديمية (Hedging).',
    passingRule: 'تقييم معياري من Band 1.0 إلى 9.0 (أو 0-120 في TOEFL) مع تقسيم منفصل للمهارات الاستقبالية والإنتاجية.',
    hasSpeakingInOfficial: true,
    hasWritingInOfficial: true,
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  fr: {
    id: 'fr',
    nameAr: 'الفرنسية',
    nameEn: 'Français',
    flag: '🇫🇷',
    ttsLang: 'fr-FR',
    officialExamName: 'DELF B2 / DALF C1 & TCF International',
    officialShort: 'DELF / DALF C1',
    scoreScaleLabel: 'Score / 100 (النجاح ≥ 50/100 وشرط ≥ 5/25 لكل قسم)',
    organization: 'France Éducation International (CIEP) Simulation',
    finalBossTitle: 'الزعيم الأخير للفرنسية: التوليف الفلسفي المحايد (La Synthèse de documents) والجدلية الثلاثية (Thèse / Antithèse / Synthèse)',
    finalBossRule: 'في DALF C1، يُطلب منك دمج أفكار عدة نصوص في مقال واحد بهيكل صارم (أطروحة، نقيض، توليف) دون إضافة رأيك الشخصي ودون اقتباس حرفي!',
    passingRule: 'يتطلب النجاح في DELF/DALF تحقيق 50/100 على الأقل، بشرط عدم الحصول على أقل من 5/25 في أي مهارة منفردة (Note éliminatoire).',
    hasSpeakingInOfficial: true,
    hasWritingInOfficial: true,
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  de: {
    id: 'de',
    nameAr: 'الألمانية',
    nameEn: 'Deutsch',
    flag: '🇩🇪',
    ttsLang: 'de-DE',
    officialExamName: 'Goethe-Zertifikat C1 / TestDaF (TDN 3-5)',
    officialShort: 'TestDaF / Goethe',
    scoreScaleLabel: 'TestDaF (TDN 3, 4, 5) • Goethe (0-100 Punkte)',
    organization: 'Goethe-Institut & TestDaF-Institut Standard Simulation',
    finalBossTitle: 'الزعيم الأخير للألمانية: الأسلوب الاسمي المكثف (Nominalstil) ووصف الرسوم البيانية (Grafikbeschreibung) ودقة الـ Kasus',
    finalBossRule: 'للانتقال من B1 إلى C1/TDN 5، يجب تحويل الجمل الفعلية البسيطة (Verbalstil) إلى تراكيب اسمية مكثفة مرتبطة بحروف جر دقيقة (Genitiv/Dativ) وموقع فعل صارم.',
    passingRule: 'القبول الجامعي في ألمانيا يتطلب تحقيق مستوى TDN 4 على الأقل في جميع الأقسام الأربعة.',
    hasSpeakingInOfficial: true,
    hasWritingInOfficial: true,
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  es: {
    id: 'es',
    nameAr: 'الإسبانية',
    nameEn: 'Español',
    flag: '🇪🇸',
    ttsLang: 'es-ES',
    officialExamName: 'DELE Oficial / SIELE Global',
    officialShort: 'DELE / SIELE',
    scoreScaleLabel: 'DELE: Apto / No Apto (مجموعتان مستقلتان) • SIELE (0-1000)',
    organization: 'Instituto Cervantes Standard Simulation',
    finalBossTitle: 'الزعيم الأخير للإسبانية: تعدد اللهجات (إسبانيا vs أمريكا اللاتينية) وصيغة الـ Subjuntivo والنجاح المزدوج في المجموعتين',
    finalBossRule: 'يُقسم DELE إلى المجموعة 1 (القراءة + الكتابة: 50 نقطة) والمجموعة 2 (الاستماع + التحدث: 50 نقطة)، ويشترط تحقيق 30/50 في كل مجموعة على حدة للحصول على Apto!',
    passingRule: 'حكم نهائي صارم: مؤهل (APTO) أو غير مؤهل (NO APTO) بناءً على اجتياز المجموعتين معاً.',
    hasSpeakingInOfficial: true,
    hasWritingInOfficial: true,
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  ja: {
    id: 'ja',
    nameAr: 'اليابانية',
    nameEn: '日本語 (Japanese)',
    flag: '🇯🇵',
    ttsLang: 'ja-JP',
    officialExamName: 'JLPT Official Simulation (N5 ➔ N1)',
    officialShort: 'JLPT (N5-N1)',
    scoreScaleLabel: 'JLPT N5 ➔ N1 (180 نقطة: مفردات وكانجي /60 • قراءة وقواعد /60 • استماع /60)',
    organization: 'Japan Foundation & JEES Authentic Format',
    finalBossTitle: 'الزعيم الأخير لليابانية: المعالجة البصرية الفورية للـ Kanji في جزء من الثانية وغياب قسمي الكتابة والمحادثة في JLPT الرسمي!',
    finalBossRule: 'اختبار JLPT الرسمي لا يحتوي على كتابة مقال أو محادثة؛ بل يختبر سرعة دماغك الباطن في تمييز قراءات الـ Kanji المتعددة ومستويات الاحترام (Keigo) تحت ضغط الوقت.',
    passingRule: 'اجتياز المجموع الكلي (مثلاً 100/180 لمستوى N1) مع تحقيق الحد الأدنى الإلزامي (19/60) في كل قسم من الأقسام الثلاثة.',
    hasSpeakingInOfficial: false, // خصوصية JLPT الحقيقية!
    hasWritingInOfficial: false,
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  zh: {
    id: 'zh',
    nameAr: 'الصينية',
    nameEn: '中文 (Mandarin)',
    flag: '🇨🇳',
    ttsLang: 'zh-CN',
    officialExamName: 'HSK (Levels 1-6 & New 1-9) + HSKK Oral',
    officialShort: 'HSK + HSKK',
    scoreScaleLabel: 'HSK (300 نقطة: استماع /100 • قراءة /100 • كتابة Hanzi /100) + HSKK الشفوي',
    organization: 'Chinese Testing International (CTI) Simulation',
    finalBossTitle: 'الزعيم الأخير للصينية: الاختفاء التام لحروف البينين (Pinyin) ابتداءً من HSK 3 وهندسة ترتيب الجمل (Bingju)',
    finalBossRule: 'يُلغى الـ Pinyin تماماً بعد المستوى الثاني، ويُختبر المتقدم في المعالجة البصرية المباشرة لرموز الـ Hanzi، واكتشاف الأخطاء التركيبية (病句)، وكتابة القصة من الذاكرة.',
    passingRule: 'يتطلب النجاح تحقيق 180/300 في HSK مع تقييم منفصل للطلاقة والنغمات الأربع في اختبار HSKK الشفوي.',
    hasSpeakingInOfficial: true,
    hasWritingInOfficial: true,
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  },
  ar: {
    id: 'ar',
    nameAr: 'العربية الفصحى',
    nameEn: 'Arabic (ALPT / ACTFL)',
    flag: '🇸🇦',
    ttsLang: 'ar-SA',
    officialExamName: 'ALPT & ACTFL Arabic Proficiency',
    officialShort: 'ALPT / ACTFL',
    scoreScaleLabel: 'CEFR (A1-C2) • ACTFL (Novice ➔ Distinguished)',
    organization: 'Arab Academy & ACTFL Standard Simulation',
    finalBossTitle: 'الزعيم الأخير للعربية: القراءة الصحيحة للنصوص غير المشكولة، الاشتقاق الصرفي والجذور، والتمييز بين فصحى التراث وفصحى الإعلام',
    finalBossRule: 'يقيس الاختبار قدرة الممتحن على ضبط أواخر الكلمات إعرابياً وبنائياً دون تشكيل، واستنباط المعاني من الميزان الصرفي والجذور الثلاثية والرباعية، والبلاغة الاستدلالية.',
    passingRule: 'تقييم معياري شامل للمهارات الأربع والقدرة الصرفية والنحوية والبلاغية.',
    hasSpeakingInOfficial: true,
    hasWritingInOfficial: true,
    recommendedCourseOrderMap: { A0: 1, A1: 2, A2: 4, B1: 7, B2: 10, C1: 13, C2: 15 }
  }
};

// ============================================================================
// 🧠 2. بنك الأسئلة الهندسي المبني على نظرية (IRT Distractor Analysis) والطبقات الـ 4
// ============================================================================
const buildDeepPsychometricBank = (langId) => {
  if (langId === 'fr') {
    return {
      listeningSection: {
        audioScript: "Mesdames et messieurs, bien que la direction ait initialement envisagé de reporter le lancement du programme d'intelligence artificielle au trimestre prochain en raison de contraintes budgétaires, l'intervention décisive de nos partenaires européens a permis de maintenir la date prévue. Toutefois, seuls les départements ayant validé le protocole de sécurité des données avant vendredi midi pourront accéder au serveur central dès lundi.",
        questions: [
          {
            id: 'l1',
            cefrLevel: 'B1',
            subSkill: 'Skimming / Gist (الفهم العام)',
            question: "Quelle est la décision finale concernant le lancement du programme d'IA ?",
            options: [
              "Le lancement est reporté au trimestre prochain à cause du budget", // فخ A2: التقط كلمات (reporter, trimestre prochain, budget) حرفياً
              "Le programme est définitivement annulé par les partenaires européens", // فخ B1
              "La date initiale de lancement est maintenue grâce au soutien des partenaires", // الصواب C1: إعادة صياغة
              "Tous les départements auront un accès automatique sans condition"
            ],
            correctIndex: 2,
            distractorAnalysis: "الخيار الأول فخ لفظي (A2 Trap) لأنه يكرر كلمات 'reporter au trimestre prochain' المذكورة في النص لكنه يتجاهل أداة التضاد 'bien que'."
          },
          {
            id: 'l2',
            cefrLevel: 'B2',
            subSkill: 'Scanning (استخراج معلومات دقيقة)',
            question: "Quelle condition est imposée pour accéder au serveur central dès lundi ?",
            options: [
              "Payer une cotisation supplémentaire avant lundi matin",
              "Faire valider le protocole de sécurité des données avant vendredi à 12h00",
              "Envoyer un rapport écrit aux partenaires européens dimanche soir",
              "Attendre la fin du trimestre prochain"
            ],
            correctIndex: 1,
            distractorAnalysis: "يقيس مهارة Scanning لربط الشرط الزمني (avant vendredi midi) بالنتيجة."
          },
          {
            id: 'l3',
            cefrLevel: 'C1',
            subSkill: 'Inference (الاستنتاج الضمني وموقف المتحدث)',
            question: "Que peut-on déduire de l'attitude de l'orateur dans cette annonce ?",
            options: [
              "Il est totalement opposé à l'utilisation de l'intelligence artificielle",
              "Il rassure sur la continuité du projet tout en posant une exigence stricte de conformité",
              "Il critique ouvertement l'intervention des partenaires européens",
              "Il ignore les règles de sécurité informatique"
            ],
            correctIndex: 1,
            distractorAnalysis: "يقيس قراءة ما بين السطور (Inference)؛ المتحدث يوازن بين البشرى الإيجابية والشرط الصارم المسبوق بـ 'Toutefois'."
          }
        ]
      },
      readingSection: {
        passage: "L'essor fulgurant des algorithmes prédictifs dans le domaine médical suscite autant d'espoirs que de réserves éthiques. Si ces outils permettent indéniablement de déceler des pathologies précoces avec une acuité surpassant parfois l'œil humain, ils ne sauraient pour autant se substituer au jugement clinique du praticien. En effet, réduire le patient à une série de variables statistiques reviendrait à occulter la dimension singulière et psychologique du soin.",
        questions: [
          {
            id: 'r1',
            cefrLevel: 'A2',
            subSkill: 'Grammaire & Syntaxe',
            question: "Complétez : « Bien qu'il _____ très compétent, son dossier n'a pas été retenu. »",
            options: ["est", "sera", "soit", "était"],
            correctIndex: 2,
            distractorAnalysis: "بعد 'Bien que' يجب استخدام صيغة الـ Subjonctif (soit)، واختيار 'est' يكشف خطأً متحجراً (Fossilized Error)."
          },
          {
            id: 'r2',
            cefrLevel: 'B2',
            subSkill: 'Collocations & Nuance (المتلازمات والظلال الدلالية)',
            question: "Quelle expression du texte signifie « ignorer ou cacher un aspect essentiel » dans un registre soutenu ?",
            options: [
              "Déceler des pathologies",
              "Occulter la dimension",
              "Susciter des espoirs",
              "Surpasser l'œil humain"
            ],
            correctIndex: 1,
            distractorAnalysis: "الفعل 'Occulter' في المستوى المتقدم C1 يحمل دلالة حجب وإغفال بُعد جوهري."
          },
          {
            id: 'r3',
            cefrLevel: 'C1',
            subSkill: 'Inference & Thèse de l’auteur',
            question: "Quelle est la thèse centrale défendue par l'auteur de cet extrait ?",
            options: [
              "Les médecins humains doivent être remplacés par des algorithmes statistiques",
              "L'intelligence artificielle est inutile pour détecter les maladies précoces",
              "La technologie prédictive doit rester un outil complémentaire sans effacer l'approche humaine du médecin",
              "Les patients préfèrent être diagnostiqués uniquement par des ordinateurs"
            ],
            correctIndex: 2,
            distractorAnalysis: "يختبر فهم البنية الجدلية الفرنسية (Concession: 'Si ces outils permettent... ils ne sauraient pour autant...')."
          }
        ]
      },
      // الطبقات الأربع الخاصة باختبار Cherif.Dev التكيّفي التشخيصي
      adaptiveLayers: {
        layer1RegisterScenario: "لقد تأخرت 3 أيام عن تسليم مشروع تقني مهم بسبب عطل مفاجئ في الخادم. اكتب اعتذاراً بالفرنسية في 3 مستويات سجل لغوي مختلفة:",
        layer2FossilizedItems: [
          {
            id: 'f1',
            arabicSource: "هذه هي المشكلة التي تحدثنا عنها أمس (احذر من فخ تكرار الضمير العائد!)",
            trapHint: "تجنب الترجمة الحرفية: C'est le problème que nous avons parlé de lui ❌",
            idealTarget: "C'est le problème dont nous avons parlé hier."
          },
          {
            id: 'f2',
            arabicSource: "اتخذ المدير قراراً صارماً تحت المطر الغزير (اختبار المتلازمات اللفظية Collocations)",
            trapHint: "تجنب: faire une décision / forte pluie ❌",
            idealTarget: "Le directeur a pris une décision ferme sous une pluie battante."
          }
        ],
        layer3StressPrompt: "تحدي الضغط الارتجالي (Spontaneous Stress Test): دافع بقوة ومنطق لمدة دقيقتين عن الرأي القائل بضرورة « إلغاء العمل عن بُعد نهائياً وإجبار جميع الموظفين على الحضور للمكتب 6 أيام أسبوعياً » (حتى لو كنت تعارض هذا الرأي شخصياً!).",
        layer3BoundaryRoleplay: "اختبار الحدود التداولي (Pragmatic Boundary Roleplay): أنت عمدة مدينة صناعية، اكتب/انطق خطاباً مقتضباً تقنع فيه عمال المصانع (بأسلوب متعاطف جداً ولكن حازم وأنيق باستخدام أسلوب التخفيف Hedging) بأنك ستغلق مصانعهم لمدة شهر لإنقاذ المدينة من كارثة بيئية دون أن يتظاهروا ضدك."
      },
      // مهام المحاكي الرسمي (DALF C1 Synthèse + Essai)
      officialReplicaTasks: {
        integratedOrBossTitle: "DALF C1 : La Synthèse de documents (دمج المستندات بحياد تام)",
        doc1: "Document 1 (Sociologue) : L'automatisation cognitive libère l'homme des tâches répétitives mais crée une polarisation accrue du marché de l'emploi.",
        doc2: "Document 2 (Économiste) : La productivité générée par les systèmes autonomes nécessite une refonte immédiate de la formation continue des cadres.",
        integratedTaskPrompt: "Rédigez une synthèse structurée (Thèse / Antithèse / Synthèse) combinant les idées des deux documents ci-dessus SANS donner votre avis personnel et SANS recopier de phrases mot à mot.",
        essayPrompt: "Production Écrite (Essai Argumentatif DELF B2/DALF C1) : Dans quelle mesure la maîtrise de plusieurs langues étrangères reste-t-elle un avantage compétitif à l'ère de la traduction neuronale instantanée ?",
        speakingPart1: "Présentez votre parcours et expliquez comment vous utilisez le français dans votre vie quotidienne ou professionnelle.",
        speakingCueCard: "Exposé structuré (Monologue suivi) : Présentez la problématique de la protection de la vie privée à l'ère numérique (Introduction, 2 arguments illustrés, conclusion).",
        speakingPart3: "Débat avec le jury : Ne pensez-vous pas que la sécurité collective justifie parfois de restreindre l'anonymat sur Internet ?"
      }
    };
  }

  if (langId === 'de') {
    return {
      listeningSection: {
        audioScript: "Verehrte Fahrgäste, obwohl die Bauarbeiten an der Hochgeschwindigkeitsstrecke zwischen Frankfurt und München planmäßig voranschreiten, kommt es aufgrund einer kurzfristigen Softwareaktualisierung im Stellwerk heute Vormittag zu Verzögerungen von bis zu fünfundvierzig Minuten. Reisende mit Anschlusszügen werden gebeten, sich über die mobile Applikation über alternative Verbindungen zu informieren.",
        questions: [
          {
            id: 'l1',
            cefrLevel: 'B1',
            subSkill: 'Gist / Hauptaussage',
            question: "Was ist der tatsächliche Grund für die heutigen Verspätungen am Vormittag?",
            options: [
              "Die Bauarbeiten an der Strecke wurden komplett gestoppt",
              "Eine kurzfristige Softwareaktualisierung im Stellwerk",
              "Ein Streik des Zugpersonals in München",
              "Ein Ausfall der mobilen Applikation"
            ],
            correctIndex: 1,
            distractorAnalysis: "ذكر المتحدث 'Bauarbeiten' مع 'obwohl' (على الرغم من أنها تسير حسب الخطة)، بينما السبب الفعلي جاء بعد حرف الجر الإعرابي 'aufgrund + Genitiv'."
          },
          {
            id: 'l2',
            cefrLevel: 'B2',
            subSkill: 'Scanning / Detailverständnis',
            question: "Wie lange können die Verzögerungen maximal dauern?",
            options: ["15 Minuten", "30 Minuten", "Bis zu 45 Minuten", "Den ganzen Tag"],
            correctIndex: 2,
            distractorAnalysis: "يقيس دقة التقاط الأرقام والظروف المحددة (bis zu fünfundvierzig Minuten)."
          }
        ]
      },
      readingSection: {
        passage: "Infolge der fortschreitenden Digitalisierung mittelständischer Unternehmen gewinnt die datengestützte Entscheidungsfindung zunehmend an Bedeutung. Nichtsdestotrotz weisen führende Wirtschaftsforscher darauf hin, dass die bloße Implementierung komplexer Analysesoftware ohne eine gleichzeitige Weiterbildung der Belegschaft häufig zu erheblichen Effizienzverlusten führt.",
        questions: [
          {
            id: 'r1',
            cefrLevel: 'B2',
            subSkill: 'Kasus & Präpositionen',
            question: "Ergänzen Sie im korrekten Kasus: « Während _____ gesamten Konferenz wurde intensiv über nachhaltige Energie diskutiert. »",
            options: ["dem", "den", "der", "des"],
            correctIndex: 2,
            distractorAnalysis: "حرف الجر 'Während' يتطلب حالة المضاف إليه (Genitiv)، وبما أن 'Konferenz' مؤنث، فالاختيار الصحيح هو 'der'."
          },
          {
            id: 'r2',
            cefrLevel: 'C1',
            subSkill: 'Nominalstil Transformation (الزعيم الأخير للألمانية)',
            question: "Welche Variante wandelt den Satz « Weil das Wetter extrem schlecht war, wurde der Flug gestrichen » in den akademischen Nominalstil (C1/TestDaF) um?",
            options: [
              "Denn das Wetter war schlecht, strich man den Flug.",
              "Wegen des extrem schlechten Wetters erfolgte die Streichung des Fluges.",
              "Obwohl das Wetter schlecht war, flog das Flugzeug nicht.",
              "Das Wetter war schlecht und deshalb kein Flug."
            ],
            correctIndex: 1,
            distractorAnalysis: "تحويل الجملة الفعلية السببية (Weil + Verb) إلى أسلوب اسمي متقدم (Wegen + Genitiv + Nominalisierung: erfolgte die Streichung) هو المعيار الذهبي لمستوى C1 في ألمانيا."
          }
        ]
      },
      adaptiveLayers: {
        layer1RegisterScenario: "تحتاج إلى طلب تأجيل موعد اجتماع مهم. اكتب 3 رسائل قصيرة بالألمانية: (1) لصديق مقرب بـ Du، (2) لزميل في الفريق، (3) لمدير تنفيذي بـ Sie مع استخدام Konjunktiv II للتأدب والأسلوب الاسمي.",
        layer2FossilizedItems: [
          {
            id: 'f1',
            arabicSource: "حول من الأسلوب الفعلي إلى الأسلوب الاسمي (Nominalstil): لأن تكاليف الإنتاج ارتفعت، قامت الشركة بزيادة الأسعار.",
            trapHint: "استخدم Aufgrund + Genitiv بدلاً من weil",
            idealTarget: "Aufgrund der gestiegenen Produktionskosten nahm das Unternehmen eine Preiserhöhung vor."
          }
        ],
        layer3StressPrompt: "تحدي الضغط الارتجالي: دافع بالألمانية لمدة دقيقتين عن الرأي القائل بوجوب منع السيارات الخاصة تماماً داخل جميع المدن الكبرى ابتداءً من العام القادم.",
        layer3BoundaryRoleplay: "اختبار الحدود (Pragmatic Roleplay): أنت مدير مصنع في مدينة ألمانية، أقنع مجلس العمال (Betriebsrat) بأسلوب دبلوماسي حازم بضرورة إغلاق المصنع القديم لمدة شهر لتحديث فلاتر البيئة."
      },
      officialReplicaTasks: {
        integratedOrBossTitle: "TestDaF TDN 5 / Goethe C1 : Grafikbeschreibung & Nominalstil-Transformation",
        doc1: "Statistik-Daten: 2020 arbeiteten 14% der Beschäftigten im Homeoffice; 2026 stieg dieser Anteil auf 42%, während die Büroflächenkosten um 18% sanken.",
        doc2: "Aufgabe zur Nominalisierung: Formen Sie Ihre Analyse in präzisen wissenschaftlichen Nominalstil um.",
        integratedTaskPrompt: "Beschreiben Sie die wichtigsten Tendenzen der Statistik unter Verwendung von C1-Redemitteln und Nominalstil.",
        essayPrompt: "Schriftlicher Ausdruck (TestDaF): Sollten Universitäten traditionelle Klausuren vollständig durch projektbasierte KI-Prüfungen ersetzen? Begründen Sie Ihre Stellungnahme.",
        speakingPart1: "Stellen Sie sich kurz vor und erläutern Sie Ihre akademischen oder beruflichen Ziele in Deutschland.",
        speakingCueCard: "Vortrag (Goethe C1 / TestDaF): Halten Sie einen strukturierten Kurzvortrag über die Vor- und Nachteile der Automatisierung im Gesundheitswesen.",
        speakingPart3: "Diskussion: Wie können wir sicherstellen, dass ältere Generationen vom technologischen Fortschritt nicht ausgeschlossen werden?"
      }
    };
  }

  // Default & Comprehensive English Bank (IELTS Academic + TOEFL iBT + 4-Layer Diagnostic)
  return {
    listeningSection: {
      audioScript: "Good morning, everyone. Today we're examining why urban reforestation initiatives frequently fail to achieve their projected carbon-offset targets. While municipal authorities routinely publicize the sheer number of saplings planted—often in the hundreds of thousands—they rarely allocate sufficient long-term funding for soil microbiome maintenance and post-planting irrigation. Consequently, mortality rates among newly planted urban trees can exceed sixty percent within the first three years, rendering the initial headline figures largely deceptive.",
      questions: [
        {
          id: 'l1',
          cefrLevel: 'B1',
          subSkill: 'Skimming / Gist (الفكرة الجوهرية)',
          question: "What is the main point the lecturer is making about urban reforestation programs?",
          options: [
            "Cities are planting ratusan of thousands of trees that successfully eliminate carbon emissions", // فخ A2: التقط الكلمات الحرفية (hundreds of thousands, carbon) بعكس المعنى
            "Planting large numbers of trees is ineffective without long-term funding for maintenance and irrigation", // الصواب: إعادة صياغة للفكرة الكلية
            "Municipal authorities refuse to plant saplings in modern cities", // فخ نفي مطلق
            "Soil microbiome maintenance is only necessary after the first ten years"
          ],
          correctIndex: 1,
          distractorAnalysis: "الخيار الأول مصيدة كلاسيكية لمستوى A2 لأنه يردد كلمات المقطع (hundreds of thousands) لكنه يغفل أن المحاضر وصف هذه الأرقام في النهاية بأنها خادعة (deceptive)."
        },
        {
          id: 'l2',
          cefrLevel: 'B2',
          subSkill: 'Scanning (استخراج البيانات الدقيقة)',
          question: "According to the speaker, what happens within the first three years of planting?",
          options: [
            "Over 60% of the newly planted urban trees may die",
            "Carbon emissions drop by 60% in the city center",
            "Funding for irrigation increases by 60%",
            "Exactly 60,000 new saplings are planted every month"
          ],
          correctIndex: 0,
          distractorAnalysis: "يقيس القدرة على ربط النسبة المئوية (sixty percent) بالمصطلح الأكاديمي (mortality rates = معدل موت الأشجار)."
        },
        {
          id: 'l3',
          cefrLevel: 'C1',
          subSkill: 'Pragmatic Inference (استنتاج موقف المتحدث)',
          question: "What is the speaker's attitude toward the 'headline figures' published by municipal authorities?",
          options: [
            "Enthusiastic and fully supportive of their transparency",
            "Skeptical, viewing them as misleading because they ignore tree survival rates",
            "Indifferent to environmental statistics",
            "Convinced that cities should stop planting trees altogether"
          ],
          correctIndex: 1,
          distractorAnalysis: "استخدام المتحدث لعبارة 'rendering the initial headline figures largely deceptive' يكشف موقفاً نقدياً متشككاً (Skeptical)."
        }
      ]
    },
    readingSection: {
      passage: "The phenomenon of 'algorithmic echo chambers' has fundamentally altered public discourse. Far from democratizing access to diverse viewpoints—as early pioneers of the internet once optimistically envisioned—contemporary recommendation engines are architected to maximize user engagement by reinforcing preexisting cognitive biases. Paradoxically, the greater the volume of information available to an individual, the narrower their ideological exposure often becomes, necessitating a deliberate cultivation of epistemic humility.",
      questions: [
        {
          id: 'r1',
          cefrLevel: 'A2',
          subSkill: 'Contextual Grammar',
          question: "Choose the grammatically accurate sentence:",
          options: [
            "The research team has been investigating this anomaly since three years.",
            "The research team is investigating this anomaly since 2022.",
            "The research team has been investigating this anomaly for three years.",
            "The research team investigated this anomaly since three years ago."
          ],
          correctIndex: 2,
          distractorAnalysis: "الخلط بين 'since' و 'for' مع المضارع التام المستمر من أشهر الأخطاء المتحجرة."
        },
        {
          id: 'r2',
          cefrLevel: 'B2',
          subSkill: 'Collocations & Connotation (المتلازمات والظلال الدلالية)',
          question: "Which collocation best fits an academic C1 register? 'The central bank implemented _____ measures to curb inflation.'",
          options: [
            "strong and big",
            "stringent fiscal",
            "heavy and hard",
            "muscular money"
          ],
          correctIndex: 1,
          distractorAnalysis: "المتلازمة الأكاديمية الأصيلة هي 'stringent fiscal measures' وليست الترجمة الحرفية 'strong measures'."
        },
        {
          id: 'r3',
          cefrLevel: 'C2',
          subSkill: 'Deep Inference & Paraphrasing (IRT Level C2)',
          question: "What is the central paradox identified by the author in the passage?",
          options: [
            "Early internet pioneers wanted to limit the amount of information available to the public",
            "An abundance of accessible information frequently results in more restricted ideological perspectives",
            "Recommendation engines reduce user engagement when they show biased content",
            "Epistemic humility is automatically generated by modern algorithms"
          ],
          correctIndex: 1,
          distractorAnalysis: "الخيار الصحيح لا ينسخ كلمات النص حرفياً، بل يعيد صياغة التناقض (the greater the volume... the narrower their exposure) إلى (abundance... results in more restricted perspectives)."
        }
      ]
    },
    adaptiveLayers: {
      layer1RegisterScenario: "الموقف: تأخرت في تسليم مشروع برمجي حساس لمدة 48 ساعة بسبب مشكلة تقنية غير متوقعة. اكتب 3 رسائل قصيرة بالإنجليزية تعبر عن نفس الموقف ولكن بـ 3 سجلات لغوية متباينة (Register Shifting):",
      layer2FossilizedItems: [
        {
          id: 'f1',
          arabicSource: "1. التقرير الذي ناقشناه أمس يحتاج إلى مراجعة دقيقة (احذر من فخ الضمير العائد في الجملة الموصولة!).",
          trapHint: "خطأ التداخل اللغوي الشائع: The report which we discussed it yesterday ❌",
          idealTarget: "The report we discussed yesterday requires thorough revision."
        },
        {
          id: 'f2',
          arabicSource: "2. ارتكب الفريق خطأً فادحاً بسبب المطر القوي (اختبار المتلازمات اللفظية Collocations).",
          trapHint: "تجنب الترجمة الحرفية: did a big mistake / strong rain ❌",
          idealTarget: "The team committed a costly blunder due to torrential (heavy) rain."
        },
        {
          id: 'f3',
          arabicSource: "3. هذا القانون سيحل مشكلة البطالة بالتأكيد (حولها إلى أسلوب التخفيف الأكاديمي C1/C2 Hedging بدلاً من الجزم المطلق).",
          trapHint: "بدلاً من: This law will definitely solve unemployment ❌",
          idealTarget: "This legislation is likely to contribute significantly to mitigating unemployment."
        }
      ],
      layer3StressPrompt: "تحدي الضغط الارتجالي (Spontaneous Stress Test): دافع بالإنجليزية لمدة دقيقتين عن الرأي المعاكس للمألوف التالي: « يجب منع الطلاب من استخدام الحواسيب والهواتف الذكية نهائياً في الجامعات والعودة للورق والقلم فقط » (استخدم أدوات الربط والاستدراك مثل Admittedly, Nevertheless, Notwithstanding).",
      layer3BoundaryRoleplay: "اختبار الحدود التداولي (Stress-Testing the Boundaries): أنت عمدة مدينة صناعية كبرى، اكتب أو انطق خطاباً مقتضباً تقنع فيه عمال المصانع الغاضبين (بأسلوب متعاطف جداً ولكن حازم وقيادي) بأنك ستغلق مصانعهم لمدة 3 أشهر لإنقاذ المدينة من تلوث قاتل، مع ضمان تعويضهم، دون أن يتظاهروا ضدك!"
    },
    officialReplicaTasks: {
      integratedOrBossTitle: "TOEFL iBT / IELTS Hybrid : Integrated Read-Listen-Synthesize Task",
      doc1: "Reading Extract: Proponents of universal Four-Day Workweeks argue that compressing working hours boosts employee mental health, reduces carbon footprints from commuting, and maintains 100% productivity through heightened focus.",
      doc2: "Lecture Audio Summary: Conversely, the economics professor warns that while software firms easily adapt to four-day schedules, round-the-clock sectors like healthcare, logistics, and manufacturing face severe staffing shortages and inflated overtime costs when implementing this model.",
      integratedTaskPrompt: "Summarize the points made in the lecture note, explaining how they cast doubt on the universal applicability of the claims made in the reading extract (Do NOT copy phrases verbatim; use high-level discourse markers and paraphrasing).",
      essayPrompt: "IELTS Academic Writing Task 2 (250+ Words): Artificial Intelligence is increasingly capable of generating code, legal contracts, and medical diagnoses. To what extent do you agree or disagree that human specialists will become obsolete in analytical professions within the next two decades?",
      speakingPart1: "IELTS Speaking Part 1: Let's talk about your professional or academic background. How has technology changed the way you study or work in recent years?",
      speakingCueCard: "IELTS Speaking Part 2 (Cue Card - 1 Min Prep / 2 Min Talk): Describe a complex problem you solved using logic or creativity. You should say: what the problem was, why standard solutions did not work, what strategy you devised, and explain what you learned from the experience.",
      speakingPart3: "IELTS Speaking Part 3 (Two-Way Abstract Discussion): Why do you think organizations often resist innovative solutions even when traditional methods are clearly failing?"
    }
  };
};

// ============================================================================
// 🏛️ 3. المكون الرئيسي لمركز الاختبارات اللغوية العالمي
// ============================================================================
const LanguageExamCenter = () => {
  const { user } = useContext(AuthContext);

  // الإعدادات الأساسية
  const [selectedLang, setSelectedLang] = useState('en');
  const [examMode, setExamMode] = useState('cherif_adaptive'); // 'cherif_adaptive' | 'official_replica'
  const [examStage, setExamStage] = useState('lobby'); // 'lobby' | 'in_progress' | 'evaluating' | 'results'
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  const [examBank, setExamBank] = useState(() => buildDeepPsychometricBank('en'));
  const [isGeneratingAiExam, setIsGeneratingAiExam] = useState(false);

  // إجابات الممتحن في القسم الاستقبالي (Listening & Reading IRT)
  const [listeningAnswers, setListeningAnswers] = useState({});
  const [readingAnswers, setReadingAnswers] = useState({});

  // إجابات الطبقات الأربع الخاصة باختبار Cherif.Dev التكيّفي التشخيصي
  const [registerCasual, setRegisterCasual] = useState('');
  const [registerColleague, setRegisterColleague] = useState('');
  const [registerExecutive, setRegisterExecutive] = useState('');
  const [fossilizedResponses, setFossilizedResponses] = useState({});
  const [stressTestResponse, setStressTestResponse] = useState('');
  const [boundaryRoleplayResponse, setBoundaryRoleplayResponse] = useState('');

  // إجابات المحاكي الرسمي طبق الأصل (IELTS / TOEFL / DALF / TestDaF / DELE)
  const [integratedSynthesisResponse, setIntegratedSynthesisResponse] = useState('');
  const [officialEssayResponse, setOfficialEssayResponse] = useState('');
  const [officialSpeakingTranscript, setOfficialSpeakingTranscript] = useState('');

  // المؤقتات والصوتيات والمايكروفون
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [stressTimerSeconds, setStressTimerSeconds] = useState(120);
  const [isStressTimerActive, setIsStressTimerActive] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [activeMicTarget, setActiveMicTarget] = useState('official'); // 'official' | 'stress' | 'boundary'
  const recognitionRef = useRef(null);

  // النتيجة النهائية والتشريح العميق
  const [evaluationReport, setEvaluationReport] = useState(null);

  const langConfig = LANGUAGE_EXAM_CONFIGS[selectedLang] || LANGUAGE_EXAM_CONFIGS.en;

  useEffect(() => {
    setExamBank(buildDeepPsychometricBank(selectedLang));
  }, [selectedLang]);

  // المؤقت العام للاختبار
  useEffect(() => {
    if (examStage !== 'in_progress') return;
    const timer = setInterval(() => {
      setRemainingSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [examStage]);

  // مؤقت اختبار الضغط الارتجالي (120 ثانية)
  useEffect(() => {
    if (!isStressTimerActive) return;
    const t = setInterval(() => {
      setStressTimerSeconds(prev => {
        if (prev <= 1) {
          setIsStressTimerActive(false);
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isStressTimerActive]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // تشغيل النطق الصوتي
  const handlePlayAudio = (text, rate = 1.0) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langConfig.ttsLang;
    utterance.rate = rate;
    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // المايكروفون الحي (Speech-to-Text) لأي مهمة شفهية
  const handleToggleMic = (targetField = 'official') => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return alert('متصفحك لا يدعم التسجيل الصوتي المباشر؛ يمكنك الكتابة في الحقل مباشرة.');
    }

    if (isRecordingMic) {
      recognitionRef.current?.stop();
      setIsRecordingMic(false);
      return;
    }

    setActiveMicTarget(targetField);
    const recognition = new SpeechRecognition();
    recognition.lang = langConfig.ttsLang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + ' ';
      }
      const clean = text.trim();
      if (targetField === 'stress') setStressTestResponse(clean);
      else if (targetField === 'boundary') setBoundaryRoleplayResponse(clean);
      else setOfficialSpeakingTranscript(clean);
    };

    recognition.onerror = () => setIsRecordingMic(false);
    recognition.onend = () => setIsRecordingMic(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecordingMic(true);
  };

  // توليد اختبار عميق جديد بالذكاء الاصطناعي من السيرفر 5000
  const handleGenerateAiExam = async () => {
    setIsGeneratingAiExam(true);
    try {
      const res = await axios.post('http://localhost:5000/api/academy2/lang-exam/generate', {
        targetLanguage: langConfig.nameAr,
        langCode: selectedLang,
        examMode,
        officialExamName: langConfig.officialExamName,
        finalBossTitle: langConfig.finalBossTitle
      });
      if (res.data?.success && res.data.data) {
        setExamBank(prev => ({ ...prev, ...res.data.data }));
      }
    } catch (e) {
      setExamBank(buildDeepPsychometricBank(selectedLang));
    } finally {
      setIsGeneratingAiExam(false);
    }
  };

  const handleStartExamSession = () => {
    setListeningAnswers({});
    setReadingAnswers({});
    setRegisterCasual('');
    setRegisterColleague('');
    setRegisterExecutive('');
    setFossilizedResponses({});
    setStressTestResponse('');
    setBoundaryRoleplayResponse('');
    setIntegratedSynthesisResponse('');
    setOfficialEssayResponse('');
    setOfficialSpeakingTranscript('');
    setActiveTabIdx(0);
    setRemainingSeconds(examMode === 'official_replica' ? 45 * 60 : 25 * 60);
    setExamStage('in_progress');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // حساب مؤشر الـ IRT التكيّفي الحي أثناء الحل
  const computeLiveIRTStatus = () => {
    let total = 0;
    let scoreWeighted = 0;
    const weights = { A1: 1, A2: 1.2, B1: 1.5, B2: 1.8, C1: 2.2, C2: 2.5 };

    (examBank.listeningSection?.questions || []).forEach(q => {
      if (listeningAnswers[q.id] !== undefined) {
        const w = weights[q.cefrLevel] || 1.5;
        total += w;
        if (listeningAnswers[q.id] === q.correctIndex) scoreWeighted += w;
      }
    });
    (examBank.readingSection?.questions || []).forEach(q => {
      if (readingAnswers[q.id] !== undefined) {
        const w = weights[q.cefrLevel] || 1.5;
        total += w;
        if (readingAnswers[q.id] === q.correctIndex) scoreWeighted += w;
      }
    });

    if (total === 0) return { level: 'B1', label: 'معايرة أولية (IRT Theta = 0.0)' };
    const ratio = scoreWeighted / total;
    if (ratio >= 0.88) return { level: 'C2', label: 'C2 Native Mastery (IRT Theta +2.4 🔥)' };
    if (ratio >= 0.75) return { level: 'C1', label: 'C1 Advanced Autonomous (IRT Theta +1.6 ⚡)' };
    if (ratio >= 0.60) return { level: 'B2', label: 'B2 Vantage Upper-Intermediate (IRT Theta +0.8)' };
    if (ratio >= 0.42) return { level: 'B1', label: 'B1 Threshold Intermediate (IRT Theta 0.0)' };
    if (ratio >= 0.25) return { level: 'A2', label: 'A2 Waystage Elementary (IRT Theta -0.8)' };
    return { level: 'A1', label: 'Pre-A1 / A1 Breakthrough (IRT Theta -1.5)' };
  };

  // ============================================================================
  // 🔬 4. محرك التقييم السيكومتري واللغوي رباعي الأبعاد (Psychometric + Interlanguage Engine)
  // ============================================================================
  const handleEvaluateFullExam = async () => {
    handleStopAudio();
    if (isRecordingMic) {
      recognitionRef.current?.stop();
      setIsRecordingMic(false);
    }
    setExamStage('evaluating');

    // أ) حساب الدقة الموضوعية في الاستماع والقراءة مع تحليل المشتتات (IRT Distractor Traps)
    const lQs = examBank.listeningSection?.questions || [];
    let lCorrect = 0;
    const triggeredDistractorTraps = [];

    lQs.forEach(q => {
      if (listeningAnswers[q.id] === q.correctIndex) {
        lCorrect++;
      } else if (listeningAnswers[q.id] !== undefined && q.distractorAnalysis) {
        triggeredDistractorTraps.push(`في الاستماع (${q.subSkill}): ${q.distractorAnalysis}`);
      }
    });
    const listeningScore = lQs.length > 0 ? Math.round((lCorrect / lQs.length) * 100) : 72;

    const rQs = examBank.readingSection?.questions || [];
    let rCorrect = 0;
    rQs.forEach(q => {
      if (readingAnswers[q.id] === q.correctIndex) {
        rCorrect++;
      } else if (readingAnswers[q.id] !== undefined && q.distractorAnalysis) {
        triggeredDistractorTraps.push(`في القراءة (${q.subSkill}): ${q.distractorAnalysis}`);
      }
    });
    const readingScore = rQs.length > 0 ? Math.round((rCorrect / rQs.length) * 100) : 74;

    // ب) تجميع كافة النصوص الإنتاجية التي كتبها أو نطقها الطالب لتحليل الكثافة المعجمية والتراكيب
    const combinedWrittenText = examMode === 'cherif_adaptive'
      ? `${registerCasual} ${registerColleague} ${registerExecutive} ${Object.values(fossilizedResponses).join(' ')} ${boundaryRoleplayResponse}`.trim()
      : `${integratedSynthesisResponse} ${officialEssayResponse}`.trim();

    const combinedSpokenText = examMode === 'cherif_adaptive'
      ? `${stressTestResponse} ${boundaryRoleplayResponse}`.trim()
      : `${officialSpeakingTranscript}`.trim();

    const allProductionText = `${combinedWrittenText} ${combinedSpokenText}`.trim();
    const wordsArray = allProductionText ? allProductionText.split(/\s+/).filter(Boolean) : [];
    const uniqueWords = new Set(wordsArray.map(w => w.toLowerCase().replace(/[^a-z\u00C0-\u024F\u0600-\u06FF]/g, '')));

    // حساب الكثافة المعجمية الحقيقية (Lexical Density) والتنوع المعجمي
    const functionWordsRegex = /^(the|a|an|in|on|at|to|for|of|and|or|but|is|are|was|were|be|to|it|he|she|they|we|you|I|le|la|les|de|du|des|et|ou|dans|sur|der|die|das|und|in|zu|el|la|los|las|y|en)$/i;
    const contentWordsCount = wordsArray.filter(w => !functionWordsRegex.test(w)).length;
    const lexicalDensityPercent = wordsArray.length > 5
      ? Math.min(82, Math.max(38, Math.round((contentWordsCount / wordsArray.length) * 100)))
      : 54;

    // فحص مؤشرات التفرع النحوي (Syntactic Branching) وأسلوب التخفيف (Pragmatic Hedging)
    const hasAdvancedBranching = /although|nevertheless|notwithstanding|whereas|consequently|furthermore|bien que|néanmoins|par conséquent|toutefois|obwohl|nichtsdestotrotz|infolgedessen|sin embargo|no obstante/i.test(allProductionText);
    const hasPragmaticHedging = /tends to|appears to|might potentially|it is plausible|arguably|contribute to mitigating|il semblerait que|susceptible de|pourrait contribuer|es lässt sich vermuten/i.test(allProductionText);

    // تقييم المرونة السياقية (Register Shifting) في الوضع التكيفي
    const hasDistinctRegisters = registerCasual.trim().length > 10 && registerExecutive.trim().length > 15 && registerCasual.trim() !== registerExecutive.trim();

    let baseWritingScore = wordsArray.length > 0
      ? Math.min(94, 48 + Math.min(25, Math.round(wordsArray.length / 4)) + (hasAdvancedBranching ? 12 : 0) + (hasPragmaticHedging ? 9 : 0) + (hasDistinctRegisters ? 6 : 0))
      : Math.round((listeningScore + readingScore) * 0.65);

    let baseSpeakingScore = combinedSpokenText.length > 15
      ? Math.min(94, 52 + Math.min(25, Math.round(combinedSpokenText.split(/\s+/).length / 3)) + (hasAdvancedBranching ? 12 : 0))
      : Math.round((listeningScore + readingScore) * 0.68);

    // في حالة اختبار JLPT الرسمي (حيث لا يوجد تحدث أو كتابة مقال رسمياً)
    if (selectedLang === 'ja' && examMode === 'official_replica') {
      baseWritingScore = readingScore;
      baseSpeakingScore = listeningScore;
    }

    let aiDeepReport = null;

    // ج) إرسال جميع البيانات إلى السيرفر 5000 للتحليل العميق بنظرية اللغة البينية (Interlanguage Theory)
    try {
      const res = await axios.post('http://localhost:5000/api/academy2/lang-exam/evaluate', {
        targetLanguage: langConfig.nameAr,
        langCode: selectedLang,
        officialExamName: langConfig.officialExamName,
        examMode,
        listeningScore,
        readingScore,
        registerShifting: { casual: registerCasual, colleague: registerColleague, executive: registerExecutive },
        fossilizedResponses,
        stressTestResponse,
        boundaryRoleplayResponse,
        integratedSynthesisResponse,
        officialEssayResponse,
        officialSpeakingTranscript
      });
      if (res.data?.success && res.data.data) {
        aiDeepReport = res.data.data;
        if (typeof aiDeepReport.writingScore === 'number') baseWritingScore = aiDeepReport.writingScore;
        if (typeof aiDeepReport.speakingScore === 'number') baseSpeakingScore = aiDeepReport.speakingScore;
      }
    } catch (e) {
      // المتابعة السلسة بالمحرك السيكومتري المحلي عند عدم اتصال السيرفر
    }

    const receptiveScore = Math.round((listeningScore + readingScore) / 2);
    const productiveScore = Math.round((baseWritingScore + baseSpeakingScore) / 2);
    const overallScore = Math.round((receptiveScore + productiveScore) / 2);

    // حساب المقاييس الفرعية الأربعة على طريقة Duolingo English Test (DET Subscores)
    const detSubscores = {
      literacy: Math.round((readingScore + baseWritingScore) / 2), // القراءة + الكتابة
      comprehension: Math.round((listeningScore + readingScore) / 2), // الاستماع + القراءة
      conversation: Math.round((listeningScore + baseSpeakingScore) / 2), // الاستماع + التحدث
      production: Math.round((baseWritingScore + baseSpeakingScore) / 2) // الكتابة + التحدث
    };

    const mapScoreToCEFR = (sc) => {
      if (sc >= 88) return 'C2';
      if (sc >= 78) return 'C1';
      if (sc >= 65) return 'B2';
      if (sc >= 50) return 'B1';
      if (sc >= 35) return 'A2';
      if (sc >= 20) return 'A1';
      return 'A0';
    };

    const mapScoreToIelts = (sc) => (Math.round((1.0 + (sc / 100) * 8.0) * 2) / 2).toFixed(1);
    const mapScoreToToefl = (sc) => Math.round((sc / 100) * 120);

    const overallCEFR = aiDeepReport?.overallCEFR || mapScoreToCEFR(overallScore);

    // حساب حكم النجاح الرسمي الخاص بكل لغة (DELF 5/25 threshold, DELE Apto/No Apto, TestDaF TDN, JLPT N-Level)
    let officialVerdictBadge = '';
    if (selectedLang === 'en') {
      officialVerdictBadge = `IELTS Band ${mapScoreToIelts(overallScore)} • TOEFL iBT ${mapScoreToToefl(overallScore)}/120`;
    } else if (selectedLang === 'fr') {
      const minSkillOn25 = Math.round(Math.min(listeningScore, readingScore, baseWritingScore, baseSpeakingScore) / 4);
      const passedDelf = overallScore >= 50 && minSkillOn25 >= 5;
      officialVerdictBadge = `DELF/DALF ${overallCEFR}: ${overallScore}/100 (${passedDelf ? 'ADMIS ✓' : 'AJOURNÉ - أخلّ بشرط 50/100 أو عتبة 5/25'})`;
    } else if (selectedLang === 'de') {
      const tdn = overallScore >= 80 ? 'TDN 5 (C1.2)' : overallScore >= 65 ? 'TDN 4 (قبول جامعي كامل ✓)' : overallScore >= 50 ? 'TDN 3' : 'Unter TDN 3';
      officialVerdictBadge = `TestDaF ${tdn} • Goethe ${overallCEFR} (${overallScore}/100)`;
    } else if (selectedLang === 'es') {
      const group1 = Math.round((readingScore + baseWritingScore) / 2);
      const group2 = Math.round((listeningScore + baseSpeakingScore) / 2);
      const isApto = group1 >= 60 && group2 >= 60;
      officialVerdictBadge = `DELE ${overallCEFR}: ${isApto ? 'APTO (مؤهل رسمياً ✓)' : 'NO APTO'} [G1: ${group1}% | G2: ${group2}%]`;
    } else if (selectedLang === 'ja') {
      const jlptScore180 = Math.round((overallScore / 100) * 180);
      const nLevel = overallScore >= 82 ? 'N1' : overallScore >= 68 ? 'N2' : overallScore >= 52 ? 'N3' : overallScore >= 36 ? 'N4' : 'N5';
      officialVerdictBadge = `JLPT ${nLevel} (${jlptScore180} / 180 Pts)`;
    } else if (selectedLang === 'zh') {
      const hskScore300 = Math.round((overallScore / 100) * 300);
      const hskLevel = overallScore >= 85 ? 'HSK 6 (HSK 7-9 Advanced)' : overallScore >= 70 ? 'HSK 5' : overallScore >= 55 ? 'HSK 4' : 'HSK 3';
      officialVerdictBadge = `${hskLevel} (${hskScore300} / 300 Pts) + HSKK`;
    } else {
      officialVerdictBadge = `ALPT / ACTFL ${overallCEFR} (${overallScore}/100)`;
    }

    // الأركان الأربعة لتقييم الكتابة والتحدث (The 4 Official Rubrics - 25% each)
    const fourPillarsRubric = aiDeepReport?.fourPillarsRubric || [
      {
        title: '1. إنجاز المهمة والترابط المنطقي (Task Achievement & Coherence - 25%)',
        score: Math.min(96, Math.round((productiveScore + (hasAdvancedBranching ? 10 : 0)))),
        diagnosis: hasAdvancedBranching
          ? 'نجحت في استخدام أدوات الربط المنطقية والاستدراكية لبناء حجج متماسكة الانتقال.'
          : 'أفكارك واضحة، لكنك تحتاج إلى تكثيف أدوات الربط الأكاديمية (مثل Furthermore, Notwithstanding, En revanche, Nichtsdestotrotz) لربط الفقرات.'
      },
      {
        title: '2. الثروة والكثافة المعجمية (Lexical Resource & Collocations - 25%)',
        score: Math.min(95, Math.round((productiveScore + lexicalDensityPercent) / 1.6)),
        diagnosis: `الكثافة المعجمية المحسوبة لنصك هي (${lexicalDensityPercent}%). للوصول إلى C1/C2، ركز على المتلازمات اللفظية الدقيقة (Collocations) والظلال الدلالية (Connotation & Nuance).`
      },
      {
        title: '3. المدى والدقة النحوية وعمق التفرع (Syntactic Complexity & Branching - 25%)',
        score: Math.min(95, productiveScore),
        diagnosis: hasPragmaticHedging
          ? 'تحكم ممتاز في التضمين النحوي (Embedding) والمبني للمجهول وأسلوب التخفيف الأكاديمي (Hedging).'
          : 'تميل إلى الجمل البسيطة المتجاورة؛ ارفع درجتك عبر التضمين (الجمل الموصولة والشرطية المركبة) وإخفاء الفاعل بالمبني للمجهول.'
      },
      {
        title: '4. الطلاقة والتحكم الصوتي الإيقاعي (Fluency, Connected Speech & Chunking - 25%)',
        score: baseSpeakingScore,
        diagnosis: 'يركز التقييم المتقدم هنا على تقسيم الجمل إلى كتل صوتية منطقية (Chunking)، وتطبيق الوصل والحذف الطبيعي (Connected Speech / Liaison) دون ترددات طويلة.'
      }
    ];

    // تصنيف الأخطاء الثلاثي وفق نظرية اللغة البينية (Interlanguage Error Taxonomy)
    const errorTaxonomy = aiDeepReport?.errorTaxonomy || {
      slips: [
        'زلة عابرة (Slip): إغفال بعض علامات الترقيم الفاصلة بعد أدوات الربط الاستفتاحية نتيجة سرعة الكتابة تحت ضغط الوقت (لا يؤثر جوهرياً على تقييمك المتقدم).'
      ],
      mistakes: [
        hasPragmaticHedging
          ? 'فجوة معرفية طفيفة (Mistake): يمكن توسيع استخدام التراكيب السببية (Causative Structures) في الجمل التحليلية.'
          : 'فجوة معرفية (Mistake): غياب أسلوب التخفيف البراغماتي (Pragmatic Hedging) والجزم المطلق في القضايا الجدلية.'
      ],
      fossilizedAndL1: [
        ...(triggeredDistractorTraps.length > 0 ? triggeredDistractorTraps : []),
        'شبح اللغة الأم والأخطاء المتحجرة (Fossilization & L1 Interference): الحذر من نقل بنية الجملة العربية الموصولة أو المتلازمات الحرفية مباشرة إلى اللغة المستهدفة بدلاً من التفكير بالقوالب الأصيلة (Native Chunks).'
      ]
    };

    // الترقية الفورية جنباً إلى جنب (Side-by-Side C1/C2 Upgrading)
    const userSampleSentence = (
      registerExecutive ||
      officialEssayResponse ||
      boundaryRoleplayResponse ||
      stressTestResponse ||
      "This new technology will solve the problem and help people work better."
    ).split(/[.!?]/)[0].trim() + '.';

    const upgradingComparison = aiDeepReport?.upgradingComparison || {
      studentOriginal: userSampleSentence,
      upgradedC2Native: selectedLang === 'fr'
        ? "Il est fort probable que le déploiement de ce dispositif permette d'atténuer sensiblement cette problématique tout en optimisant le rendement des équipes."
        : selectedLang === 'de'
          ? "Die Implementierung dieser Technologie dürfte maßgeblich zur Bewältigung des Problems sowie zur Effizienzsteigerung beitragen."
          : "The strategic deployment of this paradigm is poised to substantially mitigate the underlying issue while optimizing workforce efficacy.",
      whatChanged: "تم تطبيق 3 تقنيات C2: (1) تحويل الأفعال المباشرة إلى متلازمات اسمية أكاديمية (Strategic deployment / Optimizing efficacy)، (2) إضافة أسلوب التخفيف البراغماتي (is poised to / dürfte / il est fort probable)، (3) دمج الجملتين عبر التضمين النحوي (while + Gerund)."
    };

    const recommendedCourseNumber = langConfig.recommendedCourseOrderMap[overallCEFR] || 1;

    setEvaluationReport({
      certificateId: `CHERIF-INTL-${selectedLang.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      issueDate: new Date().toLocaleDateString('en-GB'),
      candidateName: user?.name || 'الممتحن الدولي المعتمد (Cherif.Dev Candidate)',
      overallScore,
      overallCEFR,
      officialVerdictBadge,
      receptiveScore,
      receptiveCEFR: mapScoreToCEFR(receptiveScore),
      productiveScore,
      productiveCEFR: mapScoreToCEFR(productiveScore),
      lexicalDensityPercent,
      detSubscores,
      skills: {
        listening: { score: listeningScore, cefr: mapScoreToCEFR(listeningScore) },
        reading: { score: readingScore, cefr: mapScoreToCEFR(readingScore) },
        writing: { score: baseWritingScore, cefr: mapScoreToCEFR(baseWritingScore) },
        speaking: { score: baseSpeakingScore, cefr: mapScoreToCEFR(baseSpeakingScore) }
      },
      fourPillarsRubric,
      errorTaxonomy,
      upgradingComparison,
      recommendedCourseNumber
    });

    setExamStage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // تحديد التبويبات المعروضة داخل قاعة الاختبار بناءً على الخيار (اختبارنا ذو الطبقات الـ 4 vs المحاكي الرسمي)
  const arenaTabs = examMode === 'cherif_adaptive'
    ? [
        { idx: 0, label: '1. الاستماع والقراءة التكيّفي (IRT)', icon: Headphones },
        { idx: 1, label: '2. المرونة السياقية (Register Shifting)', icon: Layers },
        { idx: 2, label: '3. الفخاخ المتحجرة وشبح اللغة الأم', icon: GitCompare },
        { idx: 3, label: '4. اختبار الضغط الارتجالي والحدود', icon: Flame }
      ]
    : [
        { idx: 0, label: '1. الاستماع المعياري (Listening)', icon: Headphones },
        { idx: 1, label: '2. القراءة ومصائد IRT (Reading)', icon: BookOpen },
        { idx: 2, label: `3. الزعيم الأخير والكتابة (${langConfig.officialShort})`, icon: PenTool },
        ...(langConfig.hasSpeakingInOfficial
          ? [{ idx: 3, label: '4. المقابلة الشفوية الرسمية (Speaking)', icon: Mic }]
          : [])
      ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 py-10 px-6 pb-28 exam-font" dir="rtl">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
        .exam-font { font-family: 'Readex Pro', sans-serif; }
        .heading-alex { font-family: 'Alexandria', sans-serif; line-height: 1.45 !important; }
        .mono-code { font-family: 'JetBrains Mono', monospace; }
        @media print {
          .no-print { display: none !important; }
          body { background: #ffffff !important; color: #000000 !important; }
        }
      `}} />

      <div className="max-w-7xl mx-auto space-y-10">

        {/* ================================================================= */}
        {/* 🏛️ المرحلة 1: ردهة الاختيار الهندسية (LOBBY) */}
        {/* ================================================================= */}
        {examStage === 'lobby' && (
          <div className="space-y-10 animate-fade-in-up">

            {/* الهيرو العلوي */}
            <div className="bg-gradient-to-br from-indigo-950/80 via-[#0b1120] to-purple-950/60 border-2 border-indigo-500/40 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[130px] pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none"></div>

              <div className="relative z-10 space-y-5 max-w-5xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                    <ShieldCheck size={15} /> الجيل الجديد من التقييم اللغوي السيكومتري (IRT + Interlanguage AI)
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                    تفوق منهجي على EF SET • Duolingo DET • EnglishScore • Linguaskill
                  </span>
                </div>

                <h1 className="heading-alex text-3xl md:text-5xl font-black text-white">
                  مختبر التشخيص اللغوي العميق ومحاكي الاختبارات العالمية <span className="text-amber-400">(IELTS / DALF / TestDaF / JLPT)</span>
                </h1>

                <p className="text-slate-300 text-base leading-[1.95]">
                  نحن لا نختبر حفظك السطحي للكلمات؛ بل نقوم بتشريح دماغك اللغوي عبر <strong className="text-emerald-400">نظرية الاستجابة للمفردة (IRT)</strong> و<strong className="text-purple-300">نظرية اللغة البينية (Interlanguage Theory)</strong> لكشف الفجوة بين مهاراتك الاستقبالية والإنتاجية، ورصد الأخطاء المتحجرة وشبح اللغة الأم، مع ترقية إجاباتك فوراً إلى مستوى <strong>C2 Native</strong>.
                </p>
              </div>
            </div>

            {/* اختيار اللغة (7 لغات عالمية مع الزعيم الأخير لكل لغة) */}
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="heading-alex text-xl font-black text-white flex items-center gap-2.5">
                  <Globe className="text-emerald-400" size={22} /> 1. اختر اللغة المستهدفة (7 لغات عالمية بخصوصياتها المعيارية):
                </h2>
                <span className="text-xs text-slate-400">يتغير هيكل الاختبار و"الزعيم الأخير" تلقائياً حسب اللغة المختارة</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.values(LANGUAGE_EXAM_CONFIGS).map((lang) => {
                  const isSelected = selectedLang === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLang(lang.id)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                        isSelected
                          ? 'bg-indigo-950/70 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] scale-[1.03]'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="text-3xl">{lang.flag}</span>
                      <span className="font-black text-xs sm:text-sm text-white">{lang.nameAr}</span>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {lang.officialShort}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* بطاقة أسرار اللغة المختارة (The Final Boss of the Selected Language) */}
              <div className="bg-slate-950 border-r-4 border-amber-500 rounded-2xl p-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Flame size={15} /> {langConfig.finalBossTitle}
                  </span>
                  <span className="mono-code text-[11px] text-emerald-400 font-bold" dir="ltr">
                    {langConfig.scoreScaleLabel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {langConfig.finalBossRule}
                </p>
                <p className="text-[11px] text-indigo-300 font-semibold pt-1">
                  ⚖️ قاعدة الاجتياز الرسمية: {langConfig.passingRule}
                </p>
              </div>
            </div>

            {/* اختيار مسار الاختبار (الخياران الرئيسيان بعمق كامل) */}
            <div className="space-y-4">
              <h2 className="heading-alex text-xl font-black text-white flex items-center gap-2.5">
                <Layers className="text-amber-400" size={22} /> 2. اختر نوع التقييم:
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* الخيار 1: الاختبار التكيفي ذو الطبقات الأربع الخاص بمنصتنا */}
                <div
                  onClick={() => setExamMode('cherif_adaptive')}
                  className={`cursor-pointer rounded-3xl p-7 border-2 transition-all flex flex-col justify-between space-y-6 ${
                    examMode === 'cherif_adaptive'
                      ? 'bg-gradient-to-br from-emerald-950/45 via-[#0b1120] to-[#0b1120] border-emerald-400 shadow-[0_0_45px_rgba(16,185,129,0.2)]'
                      : 'bg-[#0b1120] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-emerald-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full flex items-center gap-1.5">
                        <BrainCircuit size={14} /> الخيار 1: الاختبار التكيّفي ذو الطبقات الأربع (20-25 دقيقة)
                      </span>
                      <span className="mono-code text-xs font-bold text-emerald-400">CAT + Interlanguage</span>
                    </div>

                    <h3 className="heading-alex text-2xl font-black text-white">
                      اختبار Cherif.Dev التشخيصي العميق (كاشف المستوى الحقيقي A0 ➔ C2)
                    </h3>

                    <p className="text-slate-300 text-sm leading-[1.85]">
                      صُمم هذا الاختبار ليكشف نقاط ضعفك المخفية التي لا تظهر في الاختبارات التقليدية عبر <strong>4 طبقات تشخيصية متتالية</strong>:
                    </p>

                    <div className="space-y-2.5 text-xs text-slate-200 pt-1">
                      <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl">
                        <strong className="text-emerald-400 block">1. المرونة السياقية (Register Shifting):</strong>
                        كتابة نفس الموقف في 3 رسائل (لصديق بالدارجة، لزميل عمل، ولمدير تنفيذي بأسلوب التخفيف الأكاديمي Hedging).
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl">
                        <strong className="text-amber-400 block">2. فحص الأخطاء المتحجرة وشبح اللغة الأم (Fossilized & L1 Check):</strong>
                        يكشف هل تترجم حرفياً من العربية أم تفكر باللغة المستهدفة والمتلازمات اللفظية الأصيلة (Collocations).
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl">
                        <strong className="text-purple-400 block">3. اختبار الضغط الارتجالي واختبار الحدود (Stress & Boundary Roleplay):</strong>
                        الدفاع عن الرأي المعاكس لقناعتك تحت الضغط الزمني لإسقاط القوالب المحفوظة، وتمثيل دور قيادي تداولي.
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl">
                        <strong className="text-indigo-400 block">4. تقرير التشريح الرباعي والترقية الفورية (C1/C2 Upgrading):</strong>
                        يفصل بين مهاراتك الاستقبالية والإنتاجية، يصنف أخطاءك (Slip / Mistake / Fossilized)، ويعيد صياغة جملك بمستوى C2.
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">يمنح: شهادة CEFR + 4 Subscores + ترقية C2</span>
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${examMode === 'cherif_adaptive' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                      {examMode === 'cherif_adaptive' ? 'محدد حالياً ✓' : 'اختر هذا النظام'}
                    </span>
                  </div>
                </div>

                {/* الخيار 2: المحاكي العالمي الرسمي طبق الأصل */}
                <div
                  onClick={() => setExamMode('official_replica')}
                  className={`cursor-pointer rounded-3xl p-7 border-2 transition-all flex flex-col justify-between space-y-6 ${
                    examMode === 'official_replica'
                      ? 'bg-gradient-to-br from-amber-950/45 via-[#0b1120] to-[#0b1120] border-amber-400 shadow-[0_0_45px_rgba(245,158,11,0.2)]'
                      : 'bg-[#0b1120] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full flex items-center gap-1.5">
                        <Trophy size={14} /> الخيار 2: المحاكي العالمي الرسمي طبق الأصل (1:1 Replica)
                      </span>
                      <span className="mono-code text-xs font-bold text-amber-400">{langConfig.officialShort}</span>
                    </div>

                    <h3 className="heading-alex text-2xl font-black text-white">
                      محاكي {langConfig.officialExamName} الرسمي الكامل
                    </h3>

                    <p className="text-slate-300 text-sm leading-[1.85]">
                      محاكاة واقعية صارمة لهيكل وطريقة تصحيح <strong className="text-amber-300">{langConfig.organization}</strong> مع تطبيق قوانين النجاح والرسوب الخاصة باللغة المختارة:
                    </p>

                    <div className="space-y-2.5 text-xs text-slate-200 pt-1">
                      <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl">
                        <strong className="text-amber-400 block">1. الاستماع والقراءة بمصائد (IRT Distractors):</strong>
                        أسئلة تقيس (Skimming / Scanning / Inference) مع مصائد مصممة لكشف الالتقاط الحرفي للكلمات.
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl">
                        <strong className="text-emerald-400 block">2. مهمة "الزعيم الأخير" والمهارات المدمجة:</strong>
                        {selectedLang === 'fr'
                          ? 'كتابة التوليف الفلسفي المحايد (La Synthèse de documents) والمقال الجدلي (Thèse/Antithèse/Synthèse).'
                          : selectedLang === 'de'
                            ? 'وصف الرسوم البيانية الإحصائية (Grafikbeschreibung) والتحويل إلى الأسلوب الاسمي (Nominalstil).'
                            : selectedLang === 'ja'
                              ? 'اختبار JLPT السريع في الكانجي والقواعد والاستماع (بدون محادثة أو مقال كما في JLPT الرسمي!).'
                              : 'دمج القراءة والاستماع (Integrated Task) + كتابة المقال الأكاديمي (Writing Task 2) مع فحص إعادة الصياغة.'}
                      </div>
                      <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl">
                        <strong className="text-purple-400 block">3. التقييم الرسمي بالأركان الأربعة (4 Rubrics × 25%):</strong>
                        إنجاز المهمة والترابط (25%)، الثروة المعجمية (25%)، المدى النحوي (25%)، والطلاقة والنطق الإيقاعي (25%).
                      </div>
                    </div>
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

            {/* شريط الانطلاق */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Scale size={24} />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">
                    جاهز لخوض {examMode === 'cherif_adaptive' ? 'الاختبار التشخيصي ذي الطبقات الأربع' : `محاكي ${langConfig.officialShort} الرسمي`}؟
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    يمكنك توليد سيناريوهات ونصوص جديدة لا نهائية بالذكاء الاصطناعي من السيرفر أو البدء فوراً بالنموذج المعياري المحكّم.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleGenerateAiExam}
                  disabled={isGeneratingAiExam}
                  className="bg-slate-950 hover:bg-slate-800 text-purple-300 border border-purple-500/40 font-bold text-xs px-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={15} className={isGeneratingAiExam ? 'animate-spin' : ''} />
                  {isGeneratingAiExam ? 'جاري هندسة أسئلة IRT بالـ AI...' : 'توليد نموذج جديد بالـ AI'}
                </button>

                <button
                  type="button"
                  onClick={handleStartExamSession}
                  className="heading-alex flex-1 md:flex-initial bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all"
                >
                  <Play size={18} /> ادخل قاعة الاختبار الآن
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* 🎯 المرحلة 2: قاعة الاختبار الحية (EXAM ARENA) */}
        {/* ================================================================= */}
        {examStage === 'in_progress' && (
          <div className="space-y-6 animate-fade-in-up">

            {/* شريط المراقبة العلوي (Sticky Header) */}
            <div className="bg-[#0b1120]/95 backdrop-blur-xl border-2 border-indigo-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 sticky top-20 z-30 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{langConfig.flag}</span>
                <div>
                  <h3 className="font-black text-white text-sm">
                    {examMode === 'cherif_adaptive'
                      ? `الاختبار التكيّفي ذو الطبقات الأربع (${langConfig.nameAr})`
                      : `محاكي ${langConfig.officialExamName}`}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-400">
                    مؤشر القدرة اللحظي (CAT): {computeLiveIRTStatus().label}
                  </span>
                </div>
              </div>

              {/* تبويبات مراحل الاختبار */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {arenaTabs.map(tab => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.idx}
                      type="button"
                      onClick={() => setActiveTabIdx(tab.idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        activeTabIdx === tab.idx
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <IconComp size={13} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2 mono-code text-sm font-black text-amber-400">
                  <Clock size={16} />
                  <span>{formatTimer(remainingSeconds)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleEvaluateFullExam}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow transition-all"
                >
                  تسليم وإصدار التقرير التشريحي ✓
                </button>
              </div>
            </div>

            {/* ============================================================= */}
            {/* التبويب 0 (مشترك): الاستماع والقراءة وفق نظرية الاستجابة للمفردة (IRT) */}
            {/* ============================================================= */}
            {activeTabIdx === 0 && (
              <div className="space-y-6">
                {/* قسم الاستماع */}
                <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <span className="text-xs font-black text-purple-400 uppercase">
                        Receptive Skill 1 • Listening (Skimming, Scanning & Pragmatic Inference)
                      </span>
                      <h3 className="heading-alex text-2xl font-black text-white mt-1">
                        🎧 تقييم الاستماع وفهم الإيقاع المتصل وما بين السطور
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        انتبه: الخيارات الخاطئة مصممة بنظام (Distractor Analysis) لاصطياد من يعتمد على سماع الكلمات المفردة دون فهم السياق!
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(examBank.listeningSection?.audioScript, 1.0)}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.35)]"
                      >
                        <Volume2 size={16} />
                        {isPlayingAudio ? 'جاري تشغيل المحاضرة الصوتية...' : 'تشغيل المقطع الصوتي (1.0x)'}
                      </button>
                      {isPlayingAudio && (
                        <button
                          type="button"
                          onClick={handleStopAudio}
                          className="bg-rose-600 text-white p-3 rounded-xl"
                        >
                          <Square size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(examBank.listeningSection?.questions || []).map((q, idx) => (
                      <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-black text-purple-300">
                            سؤال {idx + 1} • المهارة الفرعية: {q.subSkill || 'Inference'}
                          </span>
                          <span className="text-[11px] font-black bg-slate-900 border border-slate-700 text-amber-400 px-2.5 py-0.5 rounded-full">
                            IRT Target: {q.cefrLevel}
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
                </div>

                {/* إذا كنا في الوضع التكيفي، ندمج القراءة هنا مباشرة للانتقال للطبقات الثلاث الإنتاجية */}
                {examMode === 'cherif_adaptive' && (
                  <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
                    <div className="border-b border-slate-800 pb-4">
                      <span className="text-xs font-black text-emerald-400 uppercase">
                        Receptive Skill 2 • Reading, Collocations & Syntactic Precision
                      </span>
                      <h3 className="heading-alex text-2xl font-black text-white mt-1">
                        📖 تقييم القراءة التحليلية، المتلازمات اللفظية، وإعادة الصياغة
                      </h3>
                    </div>

                    <div className="bg-slate-950 border-l-4 border-emerald-500 rounded-2xl p-5" dir="ltr">
                      <p className="text-slate-200 text-sm md:text-base leading-[1.9]">
                        {examBank.readingSection?.passage}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {(examBank.readingSection?.questions || []).map((q, idx) => (
                        <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-emerald-400">
                              سؤال {idx + 1} • {q.subSkill || 'Contextual Analysis'}
                            </span>
                            <span className="text-[11px] font-black bg-slate-900 border border-slate-700 text-amber-400 px-2.5 py-0.5 rounded-full">
                              IRT Target: {q.cefrLevel}
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

                    <div className="flex justify-end pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setActiveTabIdx(1)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3.5 rounded-xl flex items-center gap-2"
                      >
                        الانتقال إلى الطبقة 1: اختبار المرونة السياقية (Register Shifting) <ChevronLeft size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {examMode === 'official_replica' && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTabIdx(1)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3.5 rounded-xl flex items-center gap-2"
                    >
                      الانتقال إلى قسم القراءة المعياري <ChevronLeft size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ============================================================= */}
            {/* التبويب 1: في وضع Cherif.Dev = الطبقة 1 (Register Shifting) | في وضع المحاكي = القراءة */}
            {/* ============================================================= */}
            {activeTabIdx === 1 && examMode === 'cherif_adaptive' && (
              <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-black text-emerald-400 uppercase">
                    Diagnostic Layer 1 • Sociolinguistic & Pragmatic Register Shifting
                  </span>
                  <h3 className="heading-alex text-2xl font-black text-white mt-1">
                    🎭 المرحلة الأولى: اختبار المرونة السياقية وتغيير السجل اللغوي (Register Shifting)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    نقيس هنا "الذكاء اللغوي الاجتماعي والتداولي"؛ المبتدئ يستخدم نفس الكلمات في المواقف الثلاثة، بينما المتقدم (C1/C2) يغير المفردات، التراكيب النحوية، وأسلوب التخفيف (Hedging) جذرياً!
                  </p>
                </div>

                <div className="bg-indigo-950/30 border border-indigo-500/40 rounded-2xl p-5">
                  <p className="text-sm md:text-base font-bold text-white leading-relaxed">
                    📌 {examBank.adaptiveLayers?.layer1RegisterScenario}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-black text-amber-400 block">
                      1. سجل غير رسمي / دارج (لصديق مقرب - Casual/Informal)
                    </span>
                    <textarea
                      dir="ltr"
                      rows={5}
                      value={registerCasual}
                      onChange={(e) => setRegisterCasual(e.target.value)}
                      placeholder="Write a casual message to a close friend..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl p-3.5 text-xs sm:text-sm text-white outline-none"
                    />
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-black text-indigo-400 block">
                      2. سجل مهني متوازن (لزميل عمل في نفس الفريق - Semi-Formal)
                    </span>
                    <textarea
                      dir="ltr"
                      rows={5}
                      value={registerColleague}
                      onChange={(e) => setRegisterColleague(e.target.value)}
                      placeholder="Write a balanced professional note to a teammate..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs sm:text-sm text-white outline-none"
                    />
                  </div>

                  <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-black text-emerald-400 block">
                      3. سجل رسمي رفيع + أسلوب التخفيف (لمدير تنفيذي - C2 Executive Hedging)
                    </span>
                    <textarea
                      dir="ltr"
                      rows={5}
                      value={registerExecutive}
                      onChange={(e) => setRegisterExecutive(e.target.value)}
                      placeholder="Write a high-register executive message using formal hedging & passive/nominal structures..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl p-3.5 text-xs sm:text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTabIdx(0)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl"
                  >
                    السابق: الاستماع والقراءة
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabIdx(2)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    الانتقال إلى الطبقة 2: فحص الفخاخ المتحجرة وشبح اللغة الأم <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeTabIdx === 1 && examMode === 'official_replica' && (
              <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-black text-emerald-400 uppercase">
                    Official Reading & IRT Distractor Analysis
                  </span>
                  <h3 className="heading-alex text-2xl font-black text-white mt-1">
                    📖 قسم القراءة الأكاديمية ومصائد الاستنتاج الضمني
                  </h3>
                </div>

                <div className="bg-slate-950 border-l-4 border-emerald-500 rounded-2xl p-6" dir="ltr">
                  <p className="text-slate-200 text-sm md:text-base leading-[1.95]">
                    {examBank.readingSection?.passage}
                  </p>
                </div>

                <div className="space-y-4">
                  {(examBank.readingSection?.questions || []).map((q, idx) => (
                    <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-400">
                          Question {idx + 1} • {q.subSkill}
                        </span>
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
                    onClick={() => setActiveTabIdx(0)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl"
                  >
                    السابق: الاستماع
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabIdx(2)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    الانتقال إلى الزعيم الأخير والكتابة الرسمية <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* التبويب 2: في وضع Cherif.Dev = الطبقة 2 (Fossilized & L1 Check) | في المحاكي = الزعيم الأخير والكتابة */}
            {/* ============================================================= */}
            {activeTabIdx === 2 && examMode === 'cherif_adaptive' && (
              <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-black text-amber-400 uppercase">
                    Diagnostic Layer 2 • Fossilized Errors & L1 Interference Detector
                  </span>
                  <h3 className="heading-alex text-2xl font-black text-white mt-1">
                    🧬 المرحلة الثانية: اختبار الفخاخ النحوية المتحجرة وكشف "شبح اللغة الأم"
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    قم بصياغة هذه الأفكار باللغة <strong className="text-white">{langConfig.nameAr}</strong>؛ نكتشف هنا ما إذا كنت تترجم الكلمات بعقلية عربية حرفية أم تستخدم المتلازمات اللفظية (Collocations) والتضمين النحوي الأصيل.
                  </p>
                </div>

                <div className="space-y-4">
                  {(examBank.adaptiveLayers?.layer2FossilizedItems || []).map((item) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <p className="text-sm font-bold text-amber-300">{item.arabicSource}</p>
                      <input
                        type="text"
                        dir="ltr"
                        value={fossilizedResponses[item.id] || ''}
                        onChange={(e) => setFossilizedResponses(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Write the natural C1/C2 formulation in the target language..."
                        className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTabIdx(1)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl"
                  >
                    السابق: المرونة السياقية
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabIdx(3)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    الانتقال إلى الطبقة 3: اختبار الضغط الارتجالي واختبار الحدود <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeTabIdx === 2 && examMode === 'official_replica' && (
              <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-7 shadow-xl">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-black text-amber-400 uppercase">
                    {examBank.officialReplicaTasks?.integratedOrBossTitle}
                  </span>
                  <h3 className="heading-alex text-2xl font-black text-white mt-1">
                    🔥 مهمة "الزعيم الأخير" والكتابة الأكاديمية المعيارية ({langConfig.officialShort})
                  </h3>
                </div>

                {/* المهمة المدمجة أو مهمة التوليف الخاصة باللغة */}
                <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="ltr">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-200 leading-relaxed">
                      {examBank.officialReplicaTasks?.doc1}
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-200 leading-relaxed">
                      {examBank.officialReplicaTasks?.doc2}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-amber-300" dir="ltr">
                    Task 1: {examBank.officialReplicaTasks?.integratedTaskPrompt}
                  </p>
                  <textarea
                    dir="ltr"
                    rows={5}
                    value={integratedSynthesisResponse}
                    onChange={(e) => setIntegratedSynthesisResponse(e.target.value)}
                    placeholder="Write your integrated synthesis / Nominalstil transformation here..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl p-4 text-sm text-white outline-none"
                  />
                </div>

                {/* المقال الأكاديمي الرئيسي */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <p className="text-xs sm:text-sm font-bold text-emerald-300" dir="ltr">
                    Task 2: {examBank.officialReplicaTasks?.essayPrompt}
                  </p>
                  <textarea
                    dir="ltr"
                    rows={8}
                    value={officialEssayResponse}
                    onChange={(e) => setOfficialEssayResponse(e.target.value)}
                    placeholder="Write your full structured academic essay here..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl p-4 text-sm text-white outline-none"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTabIdx(1)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl"
                  >
                    السابق: القراءة
                  </button>
                  {langConfig.hasSpeakingInOfficial ? (
                    <button
                      type="button"
                      onClick={() => setActiveTabIdx(3)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2"
                    >
                      الانتقال إلى المقابلة الشفوية الرسمية <ChevronLeft size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEvaluateFullExam}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-8 py-3.5 rounded-xl shadow"
                    >
                      تسليم اختبار {langConfig.officialShort} وإصدار الشهادة ✓
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* التبويب 3: في وضع Cherif.Dev = الطبقة 3 (Stress Test & Boundary Roleplay) | في المحاكي = المقابلة الشفوية */}
            {/* ============================================================= */}
            {activeTabIdx === 3 && examMode === 'cherif_adaptive' && (
              <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-7 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-black text-rose-400 uppercase">
                      Diagnostic Layer 3 • Spontaneous Stress Test & Boundary Roleplay
                    </span>
                    <h3 className="heading-alex text-2xl font-black text-white mt-1">
                      🔥 المرحلة الثالثة: اختبار الضغط الارتجالي (إسقاط القوالب المحفوظة) واختبار الحدود
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setStressTimerSeconds(120); setIsStressTimerActive(true); }}
                    className="bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-black px-4 py-2.5 rounded-xl transition-all"
                  >
                    ⏱️ ابدأ عداد الضغط الارتجالي (دقيقتان): {formatTimer(stressTimerSeconds)}
                  </button>
                </div>

                {/* المهمة أ: الدفاع عن الرأي المعاكس */}
                <div className="bg-slate-950 border-2 border-rose-500/40 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-bold text-rose-300 flex-1">
                      {examBank.adaptiveLayers?.layer3StressPrompt}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleToggleMic('stress')}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                        isRecordingMic && activeMicTarget === 'stress'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                    >
                      <Mic size={14} />
                      {isRecordingMic && activeMicTarget === 'stress' ? 'إيقاف المايكروفون' : 'تحدث بالمايكروفون'}
                    </button>
                  </div>

                  <textarea
                    dir="ltr"
                    rows={4}
                    value={stressTestResponse}
                    onChange={(e) => setStressTestResponse(e.target.value)}
                    placeholder="Speak via microphone or type your counter-intuitive argument under time pressure..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-white outline-none"
                  />
                </div>

                {/* المهمة ب: اختبار الحدود التداولي (عمدة المدينة الصناعية) */}
                <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-bold text-amber-300 flex-1">
                      {examBank.adaptiveLayers?.layer3BoundaryRoleplay}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleToggleMic('boundary')}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                        isRecordingMic && activeMicTarget === 'boundary'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      <Mic size={14} />
                      {isRecordingMic && activeMicTarget === 'boundary' ? 'إيقاف المايكروفون' : 'تسجيل الخطاب صوتياً'}
                    </button>
                  </div>

                  <textarea
                    dir="ltr"
                    rows={4}
                    value={boundaryRoleplayResponse}
                    onChange={(e) => setBoundaryRoleplayResponse(e.target.value)}
                    placeholder="Deliver your empathetic yet authoritative mayor's speech using C1/C2 hedging and persuasive vocabulary..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-white outline-none"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTabIdx(2)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl"
                  >
                    السابق: الفخاخ المتحجرة
                  </button>
                  <button
                    type="button"
                    onClick={handleEvaluateFullExam}
                    className="heading-alex bg-gradient-to-l from-emerald-500 to-amber-400 hover:from-emerald-400 hover:to-yellow-300 text-slate-950 font-black text-sm px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2"
                  >
                    <Trophy size={18} /> إنهاء الاختبار وإصدار خريطة التشريح الرباعي والشهادة
                  </button>
                </div>
              </div>
            )}

            {activeTabIdx === 3 && examMode === 'official_replica' && langConfig.hasSpeakingInOfficial && (
              <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-xl">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-xs font-black text-rose-400 uppercase">
                    Official Oral Examination • Part 1, Part 2 (Cue Card) & Part 3
                  </span>
                  <h3 className="heading-alex text-2xl font-black text-white mt-1">
                    🎙️ المقابلة الشفوية الرسمية ({langConfig.officialShort})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" dir="ltr">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-400">Part 1</span>
                      <button type="button" onClick={() => handlePlayAudio(examBank.officialReplicaTasks?.speakingPart1, 0.95)} className="text-purple-400">
                        <Volume2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{examBank.officialReplicaTasks?.speakingPart1}</p>
                  </div>

                  <div className="bg-slate-950 border-2 border-amber-500/40 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400">Part 2: Cue Card / Exposé</span>
                      <button type="button" onClick={() => handlePlayAudio(examBank.officialReplicaTasks?.speakingCueCard, 0.95)} className="text-amber-400">
                        <Volume2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-white font-semibold leading-relaxed">{examBank.officialReplicaTasks?.speakingCueCard}</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-400">Part 3: Débat / Discussion</span>
                      <button type="button" onClick={() => handlePlayAudio(examBank.officialReplicaTasks?.speakingPart3, 0.95)} className="text-emerald-400">
                        <Volume2 size={15} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{examBank.officialReplicaTasks?.speakingPart3}</p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-slate-300">سجل إجابتك الشفوية بالمايكروفون ليتم فحص الطلاقة والوصل الصوتي (Connected Speech & Chunking):</span>
                    <button
                      type="button"
                      onClick={() => handleToggleMic('official')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 ${
                        isRecordingMic && activeMicTarget === 'official'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                    >
                      {isRecordingMic ? <><MicOff size={15} /> إيقاف التسجيل</> : <><Mic size={15} /> ابدأ التحدث الآن</>}
                    </button>
                  </div>

                  <textarea
                    dir="ltr"
                    rows={5}
                    value={officialSpeakingTranscript}
                    onChange={(e) => setOfficialSpeakingTranscript(e.target.value)}
                    placeholder="Your spoken response transcript will appear here..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-emerald-300 outline-none"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTabIdx(2)}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl"
                  >
                    السابق: الكتابة والزعيم الأخير
                  </button>
                  <button
                    type="button"
                    onClick={handleEvaluateFullExam}
                    className="heading-alex bg-gradient-to-l from-emerald-500 to-amber-400 text-slate-950 font-black text-sm px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2"
                  >
                    <Trophy size={18} /> تسليم الاختبار وإصدار التقرير التشريحي والشهادة
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================================================================= */}
        {/* ⏳ مرحلة التحليل السيكومتري */}
        {/* ================================================================= */}
        {examStage === 'evaluating' && (
          <div className="py-24 text-center space-y-5 bg-[#0b1120] border border-slate-800 rounded-3xl">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>
            <h3 className="heading-alex text-2xl font-black text-white">
              جاري تشريح أدائك اللغوي عبر الفلاتر الثلاثة (Error Taxonomy • L1 Interference • 4-Pillar Rubrics)...
            </h3>
            <p className="text-sm text-slate-400">
              يتم الآن حساب الكثافة المعجمية، مقارنة المهارات الاستقبالية بالإنتاجية، وترقية إجابتك إلى مستوى C2 Native.
            </p>
          </div>
        )}

        {/* ================================================================= */}
        {/* 👑 المرحلة 3: التقرير التشريحي الشامل + الشهادة الدولية + الترقية لـ C2 */}
        {/* ================================================================= */}
        {examStage === 'results' && evaluationReport && (
          <div className="space-y-10 animate-fade-in-up">

            {/* شريط التحكم العلوي */}
            <div className="flex flex-wrap items-center justify-between gap-4 no-print">
              <button
                type="button"
                onClick={() => setExamStage('lobby')}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2"
              >
                <ArrowRight size={16} /> إجراء اختبار آخر
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow"
              >
                <Printer size={16} /> طباعة الشهادة والتقرير التشريحي (PDF)
              </button>
            </div>

            {/* 🏆 1. الشهادة الدولية الموثقة (EF SET / DET / Official Equivalent) */}
            <div className="bg-[#070b14] border-2 border-amber-500/60 rounded-3xl p-8 md:p-12 shadow-[0_0_70px_rgba(245,158,11,0.15)] space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-3.5">
                  <ShieldCheck size={46} className="text-amber-400" />
                  <div>
                    <span className="mono-code text-xs font-bold text-emerald-400 block">
                      CHERIF.DEV PSYCHOMETRIC & CEFR BOARD • VERIFIED CREDENTIAL
                    </span>
                    <h2 className="heading-alex text-xl md:text-2xl font-black text-white">
                      شهادة الكفاءة اللغوية والتشخيص المعياري ({langConfig.flag} {langConfig.nameEn})
                    </h2>
                  </div>
                </div>
                <div className="text-left mono-code text-xs text-slate-400">
                  <div>Serial ID: <strong className="text-white">{evaluationReport.certificateId}</strong></div>
                  <div>Issue Date: <strong className="text-white">{evaluationReport.issueDate}</strong></div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <p className="text-xs text-slate-400">مُنحت هذه الوثيقة الرسمية للممتحن:</p>
                    <h3 className="heading-alex text-3xl md:text-4xl font-black text-amber-400 mt-1">
                      {evaluationReport.candidateName}
                    </h3>
                  </div>

                  {/* الفجوة بين المهارات الاستقبالية والإنتاجية (Receptive vs Productive Breakdown) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="bg-slate-950 border border-indigo-500/40 p-4 rounded-2xl">
                      <span className="text-[11px] font-bold text-indigo-300 block">
                        🎧📖 المهارات الاستقبالية (Receptive: Listening & Reading)
                      </span>
                      <div className="flex items-baseline justify-between mt-2">
                        <span className="text-2xl font-black text-white mono-code">{evaluationReport.receptiveCEFR}</span>
                        <span className="text-sm font-bold text-emerald-400 mono-code">{evaluationReport.receptiveScore}/100</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-amber-500/40 p-4 rounded-2xl">
                      <span className="text-[11px] font-bold text-amber-300 block">
                        ✍️🎙️ المهارات الإنتاجية (Productive: Writing & Speaking)
                      </span>
                      <div className="flex items-baseline justify-between mt-2">
                        <span className="text-2xl font-black text-white mono-code">{evaluationReport.productiveCEFR}</span>
                        <span className="text-sm font-bold text-amber-400 mono-code">{evaluationReport.productiveScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* تفصيل المهارات الـ 4 + المقاييس المدمجة الأربعة (DET Subscores) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { label: 'Listening', val: evaluationReport.skills.listening },
                      { label: 'Reading', val: evaluationReport.skills.reading },
                      { label: 'Writing', val: evaluationReport.skills.writing },
                      { label: 'Speaking', val: evaluationReport.skills.speaking }
                    ].map((s, i) => (
                      <div key={i} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
                        <span className="text-[11px] text-slate-400 block">{s.label}</span>
                        <span className="text-base font-black text-white mono-code">{s.val.cefr} ({s.val.score}%)</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {[
                      { label: 'Literacy (القراءة والكتابة)', sc: evaluationReport.detSubscores.literacy },
                      { label: 'Comprehension (الاستيعاب)', sc: evaluationReport.detSubscores.comprehension },
                      { label: 'Conversation (المحادثة)', sc: evaluationReport.detSubscores.conversation },
                      { label: 'Production (الإنتاج اللغوي)', sc: evaluationReport.detSubscores.production }
                    ].map((sub, i) => (
                      <div key={i} className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-indigo-300 block">{sub.label}</span>
                        <span className="text-xs font-black text-emerald-400 mono-code">{sub.sc}/100</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* بطاقة الدرجة الكلية والمعادل الرسمي */}
                <div className="lg:col-span-5 bg-slate-950 border-2 border-amber-500/40 rounded-3xl p-7 text-center space-y-4">
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
                    المستوى المعتمد والحكم الرسمي
                  </span>
                  <div className="text-6xl font-black text-white mono-code">{evaluationReport.overallCEFR}</div>
                  <div className="text-sm sm:text-base font-black text-emerald-400 mono-code bg-emerald-950/30 border border-emerald-500/30 py-2 px-3 rounded-xl" dir="ltr">
                    {evaluationReport.officialVerdictBadge}
                  </div>
                  <div className="flex items-center justify-around text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>EF/DET Scale: <strong className="text-white">{evaluationReport.overallScore}/100</strong></span>
                    <span>الكثافة المعجمية: <strong className="text-amber-400">{evaluationReport.lexicalDensityPercent}%</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* 🔬 2. شبكة المعايير الأربعة الرسمية (The 4 Rubrics × 25%) */}
            <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-5">
              <h3 className="heading-alex text-xl font-black text-white flex items-center gap-2">
                <Activity className="text-emerald-400" size={22} /> تشريح الأركان الأربعة للإنتاج اللغوي (Official 4-Pillar Rubric Breakdown - 25% Each)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evaluationReport.fourPillarsRubric.map((pillar, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-black text-white text-xs sm:text-sm">{pillar.title}</h4>
                      <span className="mono-code text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        {pillar.score}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{pillar.diagnosis}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🧬 3. تصنيف الأخطاء الثلاثي (Error Taxonomy) + الترقية الفورية لـ C2 جنباً إلى جنب */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* الفلاتر الثلاثة لنظرية اللغة البينية */}
              <div className="lg:col-span-6 bg-[#0b1120] border border-slate-800 rounded-3xl p-7 space-y-4">
                <h3 className="heading-alex text-lg font-black text-white flex items-center gap-2">
                  <BrainCircuit className="text-purple-400" size={20} /> تشريح الدماغ اللغوي وتصنيف الأخطاء (Interlanguage Taxonomy)
                </h3>

                <div className="bg-slate-950 border-r-4 border-sky-400 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-black text-sky-400 block">1. الزلات العابرة (Slips - لا تؤثر على كفاءتك):</span>
                  {evaluationReport.errorTaxonomy.slips.map((s, i) => (
                    <p key={i} className="text-xs text-slate-300 leading-relaxed">• {s}</p>
                  ))}
                </div>

                <div className="bg-slate-950 border-r-4 border-amber-400 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-black text-amber-400 block">2. الفجوات المعرفية (Mistakes - قواعد ومفردات تحتاج لدراستها):</span>
                  {evaluationReport.errorTaxonomy.mistakes.map((m, i) => (
                    <p key={i} className="text-xs text-slate-300 leading-relaxed">• {m}</p>
                  ))}
                </div>

                <div className="bg-slate-950 border-r-4 border-rose-500 p-4 rounded-xl space-y-1">
                  <span className="text-xs font-black text-rose-400 block">3. الأخطاء المتحجرة وشبح اللغة الأم (Fossilization & L1 Interference):</span>
                  {evaluationReport.errorTaxonomy.fossilizedAndL1.map((f, i) => (
                    <p key={i} className="text-xs text-slate-300 leading-relaxed">• {f}</p>
                  ))}
                </div>
              </div>

              {/* الترقية الفورية جنباً إلى جنب (Instant C1/C2 Upgrading) + توجيه الكورس */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="bg-[#0b1120] border-2 border-indigo-500/40 rounded-3xl p-7 space-y-4">
                  <h3 className="heading-alex text-lg font-black text-white flex items-center gap-2">
                    <Sparkles className="text-amber-400" size={20} /> الترقية الفورية لجملتك إلى مستوى C2 Native (Upgrading)
                  </h3>

                  <div className="space-y-3" dir="ltr">
                    <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl">
                      <span className="text-[10px] font-black text-rose-400 uppercase block mb-1">Your Original Formulation:</span>
                      <p className="text-xs sm:text-sm text-slate-200">{evaluationReport.upgradingComparison.studentOriginal}</p>
                    </div>

                    <div className="bg-emerald-950/25 border border-emerald-500/40 p-3.5 rounded-xl">
                      <span className="text-[10px] font-black text-emerald-400 uppercase block mb-1">Upgraded C2 Native / Academic Version:</span>
                      <p className="text-xs sm:text-sm text-white font-bold">{evaluationReport.upgradingComparison.upgradedC2Native}</p>
                    </div>
                  </div>

                  <p className="text-xs text-indigo-200 bg-indigo-950/30 border border-indigo-500/30 p-3.5 rounded-xl leading-relaxed">
                    💡 <strong>ماذا غيّرنا؟</strong> {evaluationReport.upgradingComparison.whatChanged}
                  </p>
                </div>

                {/* التوجيه الذكي للكراش كورس المناسب في الأكاديمية */}
                <div className="bg-gradient-to-r from-emerald-950/50 via-[#0b1120] to-[#0b1120] border-2 border-emerald-500/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
                  <div>
                    <span className="text-xs font-black text-emerald-400 block">🎯 خطوتك العملية القادمة في الأكاديمية:</span>
                    <h4 className="heading-alex text-lg font-black text-white mt-0.5">
                      ابدأ مباشرة من الكراش كورس رقم ({evaluationReport.recommendedCourseNumber}) في شهادة اللغة {langConfig.nameAr}!
                    </h4>
                  </div>
                  <Link
                    to="/academy"
                    className="heading-alex bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                  >
                    انطلق للكورس {evaluationReport.recommendedCourseNumber} ←
                  </Link>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default LanguageExamCenter;