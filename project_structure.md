# Project Structure

```text
platformauto/
    ├── project_structure.md
├── cherif-platform/
    ├── .oxlintrc.json
    ├── README.md
    ├── extract_code.py
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public/
    ├── src/
        ├── Academy.jsx
        ├── App.css
        ├── App.jsx
        ├── B2B.jsx
        ├── Vault.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
```


---

# Source Code

## `project_structure.md`

```markdown

```

---

## `cherif-platform\.oxlintrc.json`

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}

```

---

## `cherif-platform\README.md`

```markdown
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

```

---

## `cherif-platform\extract_code.py`

```python
import os

# ==============================
# الإعدادات
# ==============================

OUTPUT_FILE = "project_structure.md"
MAX_DEPTH = 3                 # أقصى عمق للشجرة
MAX_FILE_SIZE = 200 * 1024    # 200KB

IGNORE_DIRS = {
    ".git",
    ".github",
    ".idea",
    ".vscode",
    "node_modules",
    "fet-engine",
    "__pycache__",
    ".venv",
    "venv",
    "env",
    "build",
    "dist",
    "release",
    "out",
    "target",
    "bin",
    "obj",
    "coverage",
    ".next"
}

IGNORE_FILES = {
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    ".gitignore",
    ".DS_Store",
    "Thumbs.db"
}

IGNORE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif",
    ".svg", ".ico",
    ".pdf",
    ".zip", ".rar", ".7z",
    ".mp3", ".mp4", ".wav",
    ".exe", ".dll",
    ".pyc",
    ".log"
}

CODE_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".css",
    ".html",
    ".md",
    ".sql"
}


def language(ext):
    ext = ext.lower()

    if ext == ".py":
        return "python"

    if ext in [".js", ".jsx"]:
        return "javascript"

    if ext in [".ts", ".tsx"]:
        return "typescript"

    if ext == ".css":
        return "css"

    if ext == ".html":
        return "html"

    if ext == ".json":
        return "json"

    if ext == ".sql":
        return "sql"

    if ext == ".md":
        return "markdown"

    return "text"


def generate(directory):

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:

        ##################################################
        # Project Tree
        ##################################################

        f.write("# Project Structure\n\n")
        f.write("```text\n")

        for root, dirs, files in os.walk(directory):

            dirs[:] = sorted([d for d in dirs if d not in IGNORE_DIRS])

            level = os.path.relpath(root, directory).count(os.sep)

            if level > MAX_DEPTH:
                dirs.clear()
                continue

            indent = "    " * level

            folder = os.path.basename(root)

            if root == directory:
                f.write(f"{os.path.basename(directory)}/\n")
            else:
                f.write(f"{indent}├── {folder}/\n")

            sub = "    " * (level + 1)

            for file in sorted(files):

                if file in IGNORE_FILES:
                    continue

                ext = os.path.splitext(file)[1].lower()

                if ext in IGNORE_EXTENSIONS:
                    continue

                f.write(f"{sub}├── {file}\n")

        f.write("```\n\n")

        ##################################################
        # Source Code
        ##################################################

        f.write("\n---\n\n")
        f.write("# Source Code\n\n")

        for root, dirs, files in os.walk(directory):

            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in sorted(files):

                if file in IGNORE_FILES:
                    continue

                ext = os.path.splitext(file)[1].lower()

                if ext not in CODE_EXTENSIONS:
                    continue

                path = os.path.join(root, file)

                if os.path.getsize(path) > MAX_FILE_SIZE:
                    continue

                relative = os.path.relpath(path, directory)

                f.write(f"## `{relative}`\n\n")

                f.write(f"```{language(ext)}\n")

                try:
                    with open(path, "r", encoding="utf-8") as code:
                        f.write(code.read())
                except UnicodeDecodeError:
                    f.write("// Unable to read file (encoding).")
                except Exception as e:
                    f.write(f"// {e}")

                f.write("\n```\n\n---\n\n")

    print("Done!")
    print("Output:", OUTPUT_FILE)


if __name__ == "__main__":
    generate(os.getcwd())
```

---

## `cherif-platform\index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>cherif-platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

---

## `cherif-platform\package.json`

```json
{
  "name": "cherif-platform",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.20.0",
    "framer-motion": "^14.0.0",
    "lucide-react": "^1.51.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.4"
  },
  "devDependencies": {
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "autoprefixer": "^10.6.1",
    "oxlint": "^1.81.0",
    "postcss": "^8.5.28",
    "tailwindcss": "^3.4.19",
    "vite": "^8.3.0"
  }
}

```

---

## `cherif-platform\postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## `cherif-platform\tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## `cherif-platform\vite.config.js`

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

---

## `cherif-platform\src\Academy.jsx`

```javascript
import React from 'react';
import { BookOpen, Lock, Unlock, PlayCircle, Star, Code2, Terminal, ArrowLeft } from 'lucide-react';

const Academy = () => {
  const roadmaps = [
    {
      id: "mern-track",
      title: "مسار هندسة الويب الشاملة (MERN Stack)",
      description: "من الصفر إلى بناء أنظمة إدارة الموارد (ERP) ونقاط البيع (POS).",
      icon: <Code2 className="text-blue-400" size={28} />,
      theme: "blue",
      steps: [
        { title: "أساسيات React & Vite", type: "free", duration: "12 دقيقة" },
        { title: "تصميم واجهات احترافية بـ Tailwind", type: "free", duration: "18 دقيقة" },
        { title: "بناء سيرفر Node.js & Express", type: "free", duration: "25 دقيقة" },
        { title: "معسكر بناء نظام POS متكامل للشركات", type: "premium", price: "$99" }
      ]
    },
    {
      id: "quant-track",
      title: "مسار التداول الخوارزمي (Quantitative Dev)",
      description: "استخدم Python والذكاء الاصطناعي لأتمتة استراتيجيات (SMC & ICT).",
      icon: <Terminal className="text-emerald-400" size={28} />,
      theme: "emerald",
      steps: [
        { title: "إعداد بيئة Python و مكتبات البيانات", type: "free", duration: "15 دقيقة" },
        { title: "ربط واجهة Binance API", type: "free", duration: "20 دقيقة" },
        { title: "تحليل زلازل الأسعار (Z-Score)", type: "free", duration: "30 دقيقة" },
        { title: "المعسكر المغلق: الكود المصدري لبوت Phoenix", type: "premium", price: "$149" }
      ]
    }
  ];

  return (
    <div className="min-h-screen py-12 px-6 animate-fade-in-up">
      <div className="max-w-5xl mx-auto">
        
        {/* الترويسة */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center bg-gray-900 border border-gray-800 w-16 h-16 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="text-purple-400" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white">
            أكاديمية <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">المسارات البرمجية</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            توقف عن مشاهدة الدروس العشوائية. اتبع خرائط طريق هندسية واضحة، تعلم الأساسيات مجاناً، وانضم لمعسكراتنا لبناء أنظمة حقيقية تدر عليك الدخل.
          </p>
        </div>

        {/* خرائط الطريق (Roadmaps) */}
        <div className="space-y-12">
          {roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
              
              {/* تزيين لوني */}
              <div className={`absolute top-0 right-0 w-2 h-full bg-${roadmap.theme}-500`}></div>
              
              <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-6">
                <div className={`bg-gray-950 p-4 rounded-xl border border-${roadmap.theme}-900/30 shadow-inner`}>
                  {roadmap.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{roadmap.title}</h2>
                  <p className="text-gray-400 text-sm">{roadmap.description}</p>
                </div>
              </div>

              {/* خطوات المسار */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {roadmap.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`relative p-5 rounded-2xl border transition-all flex flex-col h-full ${
                      step.type === 'free' 
                        ? 'bg-gray-950 border-gray-800 hover:border-gray-600' 
                        : 'bg-gradient-to-br from-purple-900/40 to-gray-900 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] group hover:scale-[1.02] cursor-pointer'
                    }`}
                  >
                    {/* خط التوصيل بين الخطوات (يظهر في الشاشات الكبيرة) */}
                    {index !== roadmap.steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 left-[-1rem] w-4 h-0.5 bg-gray-800 z-0"></div>
                    )}

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <span className={`text-3xl font-black opacity-20 ${step.type === 'premium' ? 'text-purple-400' : 'text-gray-500'}`}>
                        0{index + 1}
                      </span>
                      {step.type === 'free' ? (
                        <span className="bg-emerald-900/30 text-emerald-400 p-1.5 rounded-lg">
                          <Unlock size={16} />
                        </span>
                      ) : (
                        <span className="bg-purple-600 text-white p-1.5 rounded-lg shadow-lg">
                          <Lock size={16} />
                        </span>
                      )}
                    </div>
                    
                    <h3 className={`font-bold mb-3 flex-grow text-sm ${step.type === 'premium' ? 'text-white' : 'text-gray-300'}`}>
                      {step.title}
                    </h3>
                    
                    <div className="mt-auto">
                      {step.type === 'free' ? (
                        <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                          <span className="flex items-center gap-1"><PlayCircle size={14} /> درس مجاني</span>
                          <span>{step.duration}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-purple-400 font-black text-lg">{step.price}</span>
                          <span className="text-xs font-bold text-white bg-purple-600 px-3 py-1.5 rounded-lg flex items-center gap-1 group-hover:bg-purple-500 transition-colors">
                            افتح المعسكر <ArrowLeft size={12} />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* حافز إضافي (Social Proof) */}
        <div className="mt-16 bg-gray-950 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3 space-x-reverse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-950 bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                  <Star size={14} className="text-yellow-500" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-bold text-sm">+500 مطور</p>
              <p className="text-gray-500 text-xs">انضموا لمعسكراتنا المغلقة</p>
            </div>
          </div>
          <button className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all">
            تصفح جميع التقييمات
          </button>
        </div>

      </div>
    </div>
  );
};

export default Academy;
```

---

## `cherif-platform\src\App.css`

```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}

```

---

## `cherif-platform\src\App.jsx`

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Code, Database, Briefcase, Lock, Sparkles, Terminal } from 'lucide-react';
import Vault from './Vault';
import B2B from './B2B';
import Academy from './Academy';
// ==========================================
// 1. مكون شريط التنقل (Navbar)
// ==========================================
const Navbar = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/academy', name: 'الأكاديمية', icon: <Code size={18} /> },
    { path: '/vault', name: 'الخزنة السرية', icon: <Lock size={18} /> },
    { path: '/b2b', name: 'حلول الشركات', icon: <Briefcase size={18} /> },
  ];

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* اللوجو والهوية */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
            <Terminal size={24} className="text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-wider">
            CHERIF<span className="text-emerald-500">.DEV</span>
          </span>
        </Link>

        {/* الروابط */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                location.pathname.includes(link.path)
                  ? 'text-emerald-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        {/* زر الإجراء الرئيسي (CTA) */}
        <Link 
          to="/vault" 
          className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
        >
          <Sparkles size={16} />
          ابدأ مجاناً
        </Link>
      </div>
    </nav>
  );
};

// ==========================================
// 2. الصفحات المؤقتة (Placeholders)
// ==========================================
const Home = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in-up">
    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 leading-tight">
      هندسة برمجيات، ذكاء اصطناعي،<br />وأنظمة تداول خوارزمية.
    </h1>
    <p className="text-gray-400 text-lg max-w-2xl mb-10">
      نحن لا نكتب الكود فقط، بل نبني أنظمة تحل مشاكل معقدة. اكتشف مسارات التعلم، أو وظفنا لبناء نظامك القادم.
    </p>
    <div className="flex gap-4">
      <Link to="/academy" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        تصفح الأكاديمية
      </Link>
      <Link to="/b2b" className="bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 px-8 py-4 rounded-xl font-bold transition-all">
        حلول الأعمال
      </Link>
    </div>
  </div>
);






// ==========================================
// 3. الهيكل الرئيسي (Main App)
// ==========================================
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans" dir="rtl">
        <Navbar />
        <main className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/b2b" element={<B2B />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
```

---

## `cherif-platform\src\B2B.jsx`

```javascript
import React from 'react';
import { Briefcase, BarChart, Server, MonitorSmartphone, Calendar, ChevronRight, CheckCircle, ArrowUpRight } from 'lucide-react';

const B2B = () => {
  const caseStudies = [
    {
      id: 1,
      title: "نظام إدارة موارد المدارس (School ERP DZ)",
      category: "Desktop / Enterprise",
      tech: ["Electron", "React", "SQLite", "C++ Engine"],
      results: "تقليص وقت جدولة الحصص بنسبة 85% والقضاء على التعارضات.",
      desc: "بناء نظام سطح مكتب متكامل غير متصل بالإنترنت (Offline-first) لمعالجة جداول البيانات المعقدة للمدارس باستخدام محرك قيود مخصص، مع واجهة مستخدم سريعة الاستجابة مبنية بـ Tailwind.",
      icon: <MonitorSmartphone className="text-blue-400" size={24} />,
      color: "from-blue-600 to-cyan-500"
    },
    {
      id: 2,
      title: "بوت التداول الخوارزمي المتقدم",
      category: "FinTech / Quantitative AI",
      tech: ["Python", "XGBoost", "Binance API", "MetaTrader 5"],
      results: "أتمتة استراتيجيات (SMC & ICT) بسرعة تنفيذ 0.02 ثانية.",
      desc: "تطوير روبوتات تداول (مثل Phoenix) قادرة على تحليل البيانات الزمنية (Time-Series) وتنفيذ أوامر البيع والشراء بناءً على مؤشرات زلازل الأسعار (Z-Score) وإدارة المخاطر الصارمة.",
      icon: <BarChart className="text-emerald-400" size={24} />,
      color: "from-emerald-500 to-green-600"
    },
    {
      id: 3,
      title: "أنظمة الرؤية الحاسوبية ومعالجة الإشارات",
      category: "AI Integration / DSP",
      tech: ["OpenCV", "MediaPipe", "Node.js", "Python"],
      results: "دقة 99% في التعرف على الإيماءات وتحسين الصوتيات.",
      desc: "بناء مسارات ذكاء اصطناعي قادرة على قراءة حركات الجسم في الوقت الفعلي، بالإضافة إلى خوادم معالجة الصوت الرقمي (Compressors & Limiters) باستخدام مكتبات بايثون المتقدمة.",
      icon: <Server className="text-purple-400" size={24} />,
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-6 animate-fade-in-up relative overflow-hidden">
      
      {/* خلفية تقنية */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* قسم الترويسة (Hero Section) */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-900/20 text-blue-400 border border-blue-800/50 px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Briefcase size={16} />
            <span>للمؤسسات والشركات التقنية</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            نحن لا نكتب أكواداً فحسب.. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              نحن نبني أنظمة تضاعف أرباحك
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            من أنظمة إدارة الموارد (ERP) المعقدة إلى خوارزميات الذكاء الاصطناعي وبوتات التداول. 
            نوفر لك حلولاً برمجية قوية، سريعة، وقابلة للتوسع.
          </p>
        </div>

        {/* قسم دراسات الحالة (Case Studies) */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4">
            معرض الأعمال المعقدة (Case Studies)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((study) => (
              <div key={study.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all group flex flex-col h-full relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${study.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="bg-gray-950 border border-gray-800 p-3 rounded-xl">
                    {study.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-950 px-3 py-1 rounded-full border border-gray-800">
                    {study.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{study.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow relative z-10">
                  {study.desc}
                </p>
                
                <div className="space-y-4 mt-auto relative z-10">
                  <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-lg p-3 flex items-start gap-3">
                    <CheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm font-bold text-emerald-400">{study.results}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {study.tech.map((t, index) => (
                      <span key={index} className="text-xs font-mono text-gray-400 bg-gray-950 px-2 py-1 rounded-md border border-gray-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* قسم الدعوة لاتخاذ إجراء (Call To Action - Booking) */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-950 border border-blue-900/50 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-3xl font-black text-white">هل لديك مشروع ضخم يحتاج لهندسة دقيقة؟</h2>
            <p className="text-blue-200/70">
              توقف عن إضاعة الوقت مع الهواة. احجز جلسة استشارية مجانية لنناقش المعمارية البرمجية لمشروعك، وكيف يمكننا تحويله إلى واقع قابل للتوسع.
            </p>
          </div>
          
          <div className="md:w-1/3 w-full flex justify-end">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
              <Calendar size={20} />
              احجز مكالمة استشارية
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default B2B;
```

---

## `cherif-platform\src\Vault.jsx`

```javascript
import React, { useState } from 'react';
import { Lock, Mail, User, CheckCircle, Terminal, ShieldAlert, ArrowLeft, Code } from 'lucide-react';
import axios from 'axios';

const Vault = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    
    try {
      // إرسال البيانات الحقيقية إلى سيرفر AutoFactory (المنفذ 5000)
      const response = await axios.post('http://localhost:5000/api/vault/submit', formData);
      
      if (response.data.success) {
        setIsSuccess(true); // إظهار شاشة النجاح فقط إذا رد السيرفر بنجاح
      }
    } catch (error) {
      console.error("❌ فشل الاتصال بالسيرفر:", error);
      alert("عذراً، حدث خطأ أثناء إرسال البيانات. تأكد أن السيرفر يعمل.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 animate-fade-in-up">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* تأثير الإضاءة في الخلفية */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none"></div>

        {/* القسم الأيمن: النص التسويقي */}
        <div className="p-10 flex flex-col justify-center border-l border-gray-800/50">
          <div className="bg-gray-950 border border-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="text-emerald-500" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 leading-tight">
            افتح <span className="text-emerald-500">الخزنة السرية</span>
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            أنت هنا لأنك قادم من إنستغرام. أدخل بياناتك أدناه للحصول على <strong className="text-gray-200">السكربت المصدري لبوت التداول الخوارزمي</strong> مجاناً ومباشرة إلى بريدك الإلكتروني.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
              <CheckCircle className="text-emerald-500" size={18} />
              <span>كود Python جاهز للتشغيل والنسخ.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
              <CheckCircle className="text-emerald-500" size={18} />
              <span>خريطة طريق لربط البوت بمنصة Binance.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
              <ShieldAlert className="text-emerald-500" size={18} />
              <span>لن نقوم بإرسال رسائل مزعجة (Spam). خصوصيتك في أمان.</span>
            </div>
          </div>
        </div>

        {/* القسم الأيسر: نموذج الإدخال أو رسالة النجاح */}
        <div className="p-10 bg-gray-950/50 flex flex-col justify-center relative">
          
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">الاسم الأول أو اللقب</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <User className="text-gray-500" size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="مثال: محمد الشريف"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">البريد الإلكتروني المهني</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Mail className="text-gray-500" size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-4 pr-10 text-left focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="dev@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg mt-4 flex items-center justify-center transition-all ${
                  isSubmitting 
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <Terminal className="animate-spin" size={20} /> جاري التشفير والإرسال...
                  </span>
                ) : (
                  '📥 أرسل لي السكربت الآن'
                )}
              </button>
              <p className="text-xs text-center text-gray-500 mt-4">
                بالضغط على الزر، أنت توافق على الانضمام لقائمتنا البريدية الخاصة بالمطورين.
              </p>
            </form>
          ) : (
            
            /* ==========================================
               حالة النجاح (The Upsell Hook)
               هنا نصطاد العميل ونعرض عليه منتجاً مدفوعاً!
               ========================================== */
            <div className="text-center animate-fade-in-up relative z-10">
              <div className="mx-auto bg-emerald-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/50">
                <CheckCircle className="text-emerald-400" size={40} />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">تم الإرسال بنجاح!</h2>
              <p className="text-gray-400 mb-8 text-sm">
                تحقق من صندوق الوارد (أو مجلد الرسائل المزعجة) في بريدك الإلكتروني، لقد أرسلنا الكود للتو.
              </p>
              
              <div className="bg-gray-900 border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden text-right">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <span className="text-xs font-bold bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full mb-3 inline-block">
                  عرض لمرة واحدة (One-Time Offer) ⚡
                </span>
                <h3 className="text-lg font-bold text-white mb-2">هل تريد احتراف بناء أنظمة التداول؟</h3>
                <p className="text-gray-400 text-sm mb-5">
                  بما أنك مهتم بالسكربت، انضم لمعسكر MERN Stack لبناء نظام مالي متكامل وتداوله كمنتج SaaS. خصم 50% ينتهي قريباً!
                </p>
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <ArrowLeft size={18} />
                  انتقل إلى المعسكر الآن
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vault;
```

---

## `cherif-platform\src\index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-fade-in-up {
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

body {
  background-color: #030712; /* gray-950 */
}
```

---

## `cherif-platform\src\main.jsx`

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

---

