# Project Structure

```text
platformauto/
    ├── xeriv.md
├── XERIV/
    ├── README.md
    ├── eslint.config.js
    ├── extract_code.py
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public/
    ├── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        ├── components/
            ├── Footer.jsx
            ├── Navbar.jsx
        ├── contexts/
        ├── layouts/
            ├── MainLayout.jsx
        ├── pages/
            ├── ArticleDetails.jsx
            ├── Auth.jsx
            ├── Dashboard.jsx
            ├── LandingPage.jsx
            ├── Pulse.jsx
            ├── Systems.jsx
        ├── utils/
```


---

# Source Code

## `xeriv.md`

```markdown

```

---

## `XERIV\README.md`

```markdown
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```

---

## `XERIV\eslint.config.js`

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])

```

---

## `XERIV\extract_code.py`

```python
import os

# ==============================
# الإعدادات
# ==============================

OUTPUT_FILE = "xeriv.md"
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
    "_archivecherif_v1",
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

## `XERIV\index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>xeriv</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

---

## `XERIV\package.json`

```json
{
  "name": "xeriv",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^14.14.0",
    "lucide-react": "^1.77.0",
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "react-router-dom": "^7.18.6"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.2",
    "autoprefixer": "^10.7.0",
    "eslint": "^10.14.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.7",
    "globals": "^17.13.0",
    "postcss": "^8.5.33",
    "tailwindcss": "^3.4.19",
    "vite": "^8.3.6"
  }
}

```

---

## `XERIV\postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## `XERIV\tailwind.config.js`

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

## `XERIV\vite.config.js`

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

---

## `XERIV\src\App.css`

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

## `XERIV\src\App.jsx`

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Systems from './pages/Systems';
import Pulse from './pages/Pulse';
import ArticleDetails from './pages/ArticleDetails';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard'; // 👈 استيراد لوحة القيادة المركزية

const App = () => {
  return (
    <Router>
      <div 
        className="bg-[#030712] min-h-screen text-slate-300 font-sans flex flex-col overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-100" 
        dir="rtl"
      >
        <MainLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/systems" element={<Systems />} />
            <Route path="/pulse" element={<Pulse />} />
            <Route path="/article/:id" element={<ArticleDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* 👈 مسار لوحة القيادة */}
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
};

export default App;
```

---

## `XERIV\src\index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800;900&family=Readex+Pro:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-[#030712] text-slate-300 font-sans antialiased overflow-x-hidden;
    font-family: 'Readex Pro', sans-serif;
  }
  
  h1, h2, h3, h4, h5, h6, .heading-xeriv {
    font-family: 'Alexandria', sans-serif;
  }

  ::selection {
    @apply bg-cyan-500/30 text-cyan-100;
  }
}

@layer utilities {
  .animate-fade-in-up {
    animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .glass-panel {
    @apply bg-[#0b1120]/80 backdrop-blur-xl border border-slate-800 shadow-2xl;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #030712; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
```

---

## `XERIV\src\main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

## `XERIV\src\components\Footer.jsx`

```javascript
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#030712] border-t border-slate-800/50 py-8 text-center text-slate-500 text-xs font-bold">
      <p>جميع الحقوق محفوظة © {new Date().getFullYear()} - إمبراطورية XERIV.</p>
    </footer>
  );
};

export default Footer;
```

---

## `XERIV\src\components\Navbar.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hexagon, Layers, Activity, User, ChevronLeft } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/systems', name: 'Systems', desc: 'الأنظمة والحلول', icon: <Layers size={16} /> },
    { path: '/pulse', name: 'Pulse', desc: 'المرصد والمقالات', icon: <Activity size={16} /> },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-slate-800/80 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        
        {/* اللوجو - XERIV */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <Hexagon size={32} className="text-cyan-500 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
          </div>
          <span className="text-2xl font-black text-white tracking-[0.2em] font-mono mt-1">
            XERIV
          </span>
        </Link>

        {/* الروابط المركزية (لشاشات الديسكتوب) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className="group flex items-center gap-2 relative"
              >
                <div className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`}>
                  {link.icon}
                </div>
                <span className={`text-sm font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                  {link.name}
                </span>
                {isActive && (
                  <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* بوابة العملاء (SSO) */}
        <Link 
          to="/auth" 
          className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-lg backdrop-blur-sm group"
        >
          <User size={16} className="text-cyan-400" />
          <span className="tracking-wide">بوابة العملاء</span>
          <ChevronLeft size={14} className="text-slate-500 group-hover:text-white group-hover:-translate-x-1 transition-all" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
```

---

## `XERIV\src\layouts\MainLayout.jsx`

```javascript
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
```

---

## `XERIV\src\pages\ArticleDetails.jsx`

```javascript
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Share2, MonitorSmartphone, Zap, CheckCircle2, Hexagon } from 'lucide-react';

const ArticleDetails = () => {
  const { id } = useParams();

  // تمرير الشاشة للأعلى عند فتح المقال
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 animate-fade-in-up relative">
      
      {/* إضاءة علوية خافتة */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        
        {/* ========================================= */}
        {/* 1. ترويسة المقال (Article Header) */}
        {/* ========================================= */}
        <div className="mb-12 space-y-6 border-b border-slate-800/80 pb-10">
          <Link to="/pulse" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-bold text-sm">
            <ArrowRight size={16} /> العودة لمرصد Pulse
          </Link>
          
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
            <span className="uppercase tracking-wider text-indigo-400">هندسة النظم (Systems)</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 7 دقائق قراءة</span>
            <span>•</span>
            <span>23 نوفمبر 2026</span>
          </div>

          <h1 className="heading-xeriv text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            كيف تبني نظام POS متكامل بـ Electron.js وتتجاوز مشكلة الاتصال بالإنترنت؟
          </h1>

          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black">
                MC
              </div>
              <div>
                <p className="text-white font-bold text-sm">غربي محمد الشريف</p>
                <p className="text-xs text-slate-400">كبير مهندسي النظم - XERIV</p>
              </div>
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* 2. محتوى المقال (The Content) */}
        {/* ========================================= */}
        <div className="text-slate-300 text-lg leading-[2.2] space-y-8 font-medium">
          <p>
            في عصر الحوسبة السحابية، يرتكب الكثير من المبرمجين خطأً قاتلاً عند بناء أنظمة نقاط البيع (POS) للمحلات والشركات المتوسطة: يعتمدون 100% على الويب والاتصال المستمر بالإنترنت. ماذا يحدث عندما تنقطع الشبكة في متجر مزدحم؟ كارثة تشغيلية وتوقف للمبيعات.
          </p>

          <h2 className="heading-xeriv text-2xl font-black text-white mt-12 mb-6">الحل: معمارية Offline-First</h2>
          <p>
            المعمارية الصحيحة هي بناء نظام هجين باستخدام <strong className="text-cyan-400">Electron.js</strong> للواجهة، و <strong className="text-indigo-400">SQLite</strong> لقاعدة البيانات المحلية. هذا يضمن أن النظام يعمل بسرعة البرق (زمن استجابة 0.1 ثانية) دون الحاجة لأي اتصال بالإنترنت.
          </p>

          <div className="bg-[#0b1120] border border-slate-800 p-6 rounded-2xl my-8 font-mono text-sm text-emerald-400 overflow-x-auto shadow-inner" dir="ltr">
            <code>
              {`// مثال مبسط لإنشاء اتصال آمن بالقاعدة المحلية
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./xeriv_pos.db', (err) => {
  if (err) {
    console.error('Database connection failed', err.message);
  }
  console.log('Connected to the local POS database.');
});`}
            </code>
          </div>

          <p>
            بمجرد عودة الإنترنت، تقوم "خدمة مزامنة خلفية" (Background Sync Worker) بنقل كل البيانات والمبيعات المتراكمة إلى السيرفر السحابي المركزي بسلاسة تامة، مما يعطي الإدارة العليا تقارير لحظية عن المبيعات.
          </p>

          {/* ========================================= */}
          {/* 3. الفخ التسويقي المركزي (The Conversion Hook) */}
          {/* ========================================= */}
          <div className="my-14 bg-gradient-to-r from-[#0b1120] to-[#071324] border border-cyan-500/30 rounded-3xl p-8 md:p-10 shadow-[0_0_40px_rgba(34,211,238,0.1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-600"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 shrink-0 bg-cyan-950/50 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 shadow-inner">
                <MonitorSmartphone size={40} strokeWidth={1.5} />
              </div>
              
              <div className="flex-1 text-center md:text-right space-y-3">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full mb-1">
                  <Zap size={12} className="animate-pulse" /> حلول جاهزة للشركات
                </div>
                <h3 className="heading-xeriv text-2xl font-black text-white">هل تبحث عن نظام POS لا يتعطل أبداً؟</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                  لقد قمنا بهندسة نظام <strong>XERIV ERP & POS</strong> باستخدام هذه التقنيات الدقيقة. نظام مصمم للعمل تحت الضغط بلا إنترنت، مع تصميم زجاجي عصري وسرعة خرافية.
                </p>
                <div className="flex flex-wrap gap-4 pt-3 justify-center md:justify-start">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold"><CheckCircle2 size={14} className="text-emerald-400"/> يعمل بلا إنترنت</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold"><CheckCircle2 size={14} className="text-emerald-400"/> لوحة تحكم سحابية</div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Link to="/systems" className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:scale-105">
                  اكتشف النظام الآن <ArrowRight size={18} className="rotate-180" />
                </Link>
              </div>
            </div>
          </div>
          {/* نهاية الفخ التسويقي */}

          <h2 className="heading-xeriv text-2xl font-black text-white mt-12 mb-6">الخلاصة للشركات التقنية</h2>
          <p>
            تجنب الاعتماد الأعمى على الكلاود (Cloud). المستخدم النهائي لا يهتم بنوع قاعدة البيانات التي تستخدمها، هو يهتم فقط بمرور العميل بسلاسة أمام شاشة الدفع. كمهندس، يجب أن تبني الأنظمة لتتحمل أسوأ ظروف التشغيل.
          </p>
        </div>

        {/* ========================================= */}
        {/* 4. تذييل المقال (Article Footer) */}
        {/* ========================================= */}
        <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-400">التقنيات المذكورة:</span>
            <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg font-mono">Electron.js</span>
            <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg font-mono">SQLite</span>
          </div>
          
          <Link to="/auth" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors">
            <Hexagon size={16} /> انضم لمجتمع XERIV
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ArticleDetails;
```

---

## `XERIV\src\pages\Auth.jsx`

```javascript
import React, { useState } from 'react';
import { Hexagon, Mail, Lock, User, LogIn, UserPlus, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* ========================================= */}
      {/* فيديو الخلفية السينمائي */}
      {/* ========================================= */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
      >
        <source src="https://cdn.coverr.co/videos/coverr-server-room-4712/1080p.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#030712]/80"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-[#0b1120]/60 backdrop-blur-3xl border border-slate-800/80 rounded-[2rem] shadow-[0_0_50px_rgba(8,145,178,0.15)] overflow-hidden relative z-10 animate-fade-in-up">
        
        {/* ========================================= */}
        {/* القسم الأيمن: الرسالة التسويقية والهوية */}
        {/* ========================================= */}
        <div className="p-10 md:p-14 flex flex-col justify-center relative overflow-hidden border-b md:border-b-0 md:border-l border-slate-800/50">
          
          <Link to="/" className="inline-flex items-center gap-2 mb-10 group w-fit relative z-10">
            <Hexagon size={28} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" strokeWidth={1.5} />
            <span className="text-xl font-black text-white tracking-[0.2em] font-mono">XERIV</span>
          </Link>

          <h2 className="heading-xeriv text-3xl md:text-4xl font-black text-white leading-tight mb-6 relative z-10">
            مرحباً بك في <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              مركز القيادة الموحد.
            </span>
          </h2>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">
            حساب واحد يمنحك وصولاً كاملاً لإمبراطورية XERIV. أدر أنظمتك، اقرأ تحليلاتنا الحصرية، واستعد لانطلاق أكاديمية المهندسين.
          </p>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 backdrop-blur-md">
              <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
              <span>تشفير عسكري (End-to-End Encryption) لبياناتك.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 backdrop-blur-md">
              <Zap className="text-amber-400 shrink-0" size={20} />
              <span>وصول فوري لتراخيص أنظمة (B2B) والمقالات المدفوعة.</span>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* القسم الأيسر: نموذج الدخول / التسجيل */}
        {/* ========================================= */}
        <div className="p-10 md:p-14 flex flex-col justify-center bg-[#050810]/80">
          
          <div className="flex bg-slate-900/80 border border-slate-800/80 p-1.5 rounded-2xl mb-10 relative">
            <button 
              onClick={() => setIsLogin(true)} 
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all z-10 ${isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              تسجيل الدخول
            </button>
            <button 
              onClick={() => setIsLogin(false)} 
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all z-10 ${!isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              حساب جديد
            </button>
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-slate-800 border border-slate-700/50 rounded-xl shadow-md transition-all duration-300 ease-in-out`}
              style={{
                transform: isLogin ? 'translateX(0)' : 'translateX(-100%)',
                right: '6px'
              }}
            ></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 flex flex-col items-center">
            {!isLogin && (
              <div className="space-y-1.5 animate-fade-in-up w-full max-w-sm" style={{animationDuration: '0.3s'}}>
                <label className="text-[11px] font-black tracking-wider text-slate-500 uppercase w-full text-right block">الاسم الكامل</label>
                <div className="relative group w-full">
                  <User className="absolute right-4 top-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required 
                    placeholder="مثال: أحمد عبد الله"
                    className="w-full bg-slate-900/60 border border-slate-800/80 text-white rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 backdrop-blur-sm"
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5 w-full max-w-sm">
              <label className="text-[11px] font-black tracking-wider text-slate-500 uppercase w-full text-right block">البريد الإلكتروني</label>
              <div className="relative group w-full">
                <Mail className="absolute right-4 top-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="email" 
                  required 
                  dir="ltr"
                  placeholder="name@company.com"
                  className="w-full bg-slate-900/60 border border-slate-800/80 text-white rounded-xl py-3.5 pl-4 pr-12 text-left focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 backdrop-blur-sm"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-1.5 w-full max-w-sm">
              <div className="flex justify-between items-center w-full">
                <label className="text-[11px] font-black tracking-wider text-slate-500 uppercase text-right">كلمة المرور</label>
                {isLogin && <a href="#" className="text-[11px] font-bold text-cyan-500 hover:text-cyan-400 transition-colors">نسيت الكلمة؟</a>}
              </div>
              <div className="relative group w-full">
                <Lock className="absolute right-4 top-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-slate-800/80 text-white rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 tracking-widest backdrop-blur-sm"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </div>

            <button 
              disabled={isLoading} 
              type="submit" 
              className="w-full max-w-sm bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-4 rounded-xl transition-all flex justify-center items-center gap-2 mt-6 shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري المصادقة...
                </span>
              ) : isLogin ? (
                <>الدخول للنظام <LogIn size={18} className="transform scale-x-[-1]" /></>
              ) : (
                <>إنشاء حسابي الموحد <UserPlus size={18} className="transform scale-x-[-1]" /></>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1">
              <ArrowRight size={14} /> العودة للصفحة الرئيسية
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Auth;
```

---

## `XERIV\src\pages\Dashboard.jsx`

```javascript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Terminal, Activity, BookOpen, ShieldCheck, 
  Settings, LogOut, Bell, Search, Hexagon, Zap, ArrowUpLeft, 
  Clock, CheckCircle2, AlertTriangle, CreditCard, ChevronLeft,
  MonitorSmartphone // 👈 تم إضافة الأيقونة المفقودة هنا
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // بيانات العميل الوهمية (سيتم ربطها بـ Backend لاحقاً)
  const user = {
    name: "أحمد عبد الله",
    role: "Enterprise Member",
    exp: 2450,
    joinDate: "نوفمبر 2026"
  };

  const sidebarLinks = [
    { id: 'overview', name: 'نظرة عامة', icon: <LayoutDashboard size={18} /> },
    { id: 'licenses', name: 'تراخيص الأنظمة (B2B)', icon: <Terminal size={18} /> },
    { id: 'reading', name: 'مكتبة Pulse', icon: <Activity size={18} /> },
    { id: 'academy', name: 'الأكاديمية (قريباً)', icon: <BookOpen size={18} /> },
    { id: 'billing', name: 'الفواتير والاشتراكات', icon: <CreditCard size={18} /> },
    { id: 'settings', name: 'الإعدادات', icon: <Settings size={18} /> },
  ];

  return (
    // حاوية تمتد على كامل الشاشة (تخفي الـ Navbar العادي للموقع وتصنع App Shell خاص بها)
    <div className="fixed inset-0 bg-[#030712] text-slate-300 flex overflow-hidden z-[100]" dir="rtl">
      
      {/* ========================================= */}
      {/* 1. الشريط الجانبي (Sidebar) */}
      {/* ========================================= */}
      <aside className="w-72 bg-[#0b1120] border-l border-slate-800/80 flex flex-col relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] shrink-0">
        
        {/* اللوجو والهوية */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <Hexagon size={24} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" strokeWidth={1.5} />
            <span className="text-xl font-black text-white tracking-[0.2em] font-mono mt-1">XERIV</span>
          </Link>
        </div>

        {/* بطاقة المستخدم السريعة */}
        <div className="p-6 border-b border-slate-800/50 bg-slate-900/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(8,145,178,0.4)] border border-cyan-400/30">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm truncate">{user.name}</h3>
              <p className="text-xs text-cyan-400 font-mono mt-0.5">{user.role}</p>
            </div>
          </div>
          <div className="mt-4 bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
              <Zap size={14} className="animate-pulse" /> رصيد الخبرة:
            </div>
            <span className="font-mono text-white text-xs">{user.exp} EXP</span>
          </div>
        </div>

        {/* روابط التنقل (Navigation) */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-2">
          <p className="px-3 text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">لوحة القيادة</p>
          {sidebarLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === link.id 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span>{link.name}</span>
              </div>
              {activeTab === link.id && <ChevronLeft size={16} className="text-cyan-500" />}
            </button>
          ))}
        </nav>

        {/* تذييل الشريط الجانبي (تسجيل الخروج) */}
        <div className="p-4 border-t border-slate-800/80">
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors">
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </Link>
        </div>
      </aside>

      {/* ========================================= */}
      {/* 2. منطقة المحتوى الرئيسية (Main Content) */}
      {/* ========================================= */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#030712]">
        
        {/* إضاءة خلفية ناعمة */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* شريط الأدوات العلوي (Topbar) */}
        <header className="h-20 border-b border-slate-800/80 bg-[#0b1120]/50 backdrop-blur-xl flex items-center justify-between px-8 relative z-10 shrink-0">
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="relative w-full group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="ابحث عن نظام، ترخيص، أو مقال..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-full py-2.5 pr-11 pl-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-300 tracking-wider">الاتصال مشفر وآمن</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse border border-slate-900"></span>
            </button>
          </div>
        </header>

        {/* المحتوى المتغير (Dynamic Content) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 custom-scrollbar">
          
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="heading-xeriv text-3xl font-black text-white">نظرة عامة على الأنظمة</h2>
                  <p className="text-sm text-slate-400 mt-2">إليك ملخص سريع لحالة حسابك وتراخيصك الحالية.</p>
                </div>
                <Link to="/systems" className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] flex items-center gap-2 w-fit">
                  تصفح أنظمة جديدة <ArrowUpLeft size={16} />
                </Link>
              </div>

              {/* بطاقات الإحصائيات (Stats Widgets) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400"><Terminal size={20} /></div>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">مُفعّل</span>
                  </div>
                  <p className="text-3xl font-black text-white font-mono">1</p>
                  <p className="text-xs text-slate-400 font-bold mt-1">تراخيص الأنظمة النشطة (B2B)</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400"><Activity size={20} /></div>
                  </div>
                  <p className="text-3xl font-black text-white font-mono">14</p>
                  <p className="text-xs text-slate-400 font-bold mt-1">المقالات والتحليلات المحفوظة</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400"><Zap size={20} /></div>
                  </div>
                  <p className="text-3xl font-black text-white font-mono">{user.exp}</p>
                  <p className="text-xs text-slate-400 font-bold mt-1">رصيد الخبرة (EXP)</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400"><AlertTriangle size={20} /></div>
                  </div>
                  <p className="text-lg font-black text-white mt-1.5">لا توجد تنبيهات</p>
                  <p className="text-xs text-slate-400 font-bold mt-1">حالة الأمان والمدفوعات</p>
                </div>
              </div>

              {/* تراخيصي (My Licenses) + أحدث المقالات (Recent Pulse) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                
                {/* قائمة التراخيص النشطة */}
                <div className="lg:col-span-8 bg-[#0b1120]/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
                  <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                    <Terminal className="text-cyan-400" size={20} /> تراخيص الأنظمة الخاصة بي
                  </h3>
                  
                  <div className="bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all group mt-auto mb-auto">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-14 h-14 bg-cyan-950/50 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 shrink-0">
                        <MonitorSmartphone size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="heading-xeriv font-black text-white text-base">XERIV ERP & POS</h4>
                          <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 size={10} /> نشط
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono tracking-wider">License: XRV-9942-AXB-2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors">
                        تحميل (v2.1)
                      </button>
                      <button className="flex-1 md:flex-none bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black px-4 py-2.5 rounded-lg transition-colors shadow-lg">
                        لوحة النظام
                      </button>
                    </div>
                  </div>
                </div>

                {/* أحدث ما تم رصده في Pulse */}
                <div className="lg:col-span-4 bg-[#0b1120]/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Activity className="text-indigo-400" size={20} /> مقالات محفوظة
                    </h3>
                    <Link to="/pulse" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">المرصد كامل ➔</Link>
                  </div>

                  <div className="space-y-4 flex-1">
                    <Link to="/article/1" className="block bg-slate-900 hover:bg-slate-800 border border-slate-800/80 p-4 rounded-2xl transition-all">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-1.5">
                        <Clock size={12} /> منذ يومين
                      </div>
                      <h4 className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug">
                        كيف تبني نظام POS متكامل بـ Electron.js وتتجاوز مشكلة الاتصال بالإنترنت؟
                      </h4>
                    </Link>
                    <div className="block bg-slate-900 border border-slate-800/80 p-4 rounded-2xl opacity-60">
                      <h4 className="text-sm font-bold text-slate-400 line-clamp-2 leading-snug">
                        وداعاً للاشتراكات: كيف تبني AI Agent خاصاً بشركتك بـ 5 دولارات شهرياً
                      </h4>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* الرسالة التحذيرية المؤقتة للأجنحة التي لم تبرمج بعد داخل لوحة القيادة */}
          {activeTab !== 'overview' && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up mt-20">
              <Hexagon size={64} className="text-slate-700 mb-6" strokeWidth={1} />
              <h2 className="heading-xeriv text-3xl font-black text-white mb-2">جاري تجهيز هذا الجناح</h2>
              <p className="text-slate-400 max-w-md">أنت تحاول الوصول إلى جناح ( {sidebarLinks.find(l => l.id === activeTab)?.name} ) وهو حالياً قيد التطوير في مركز الهندسة. سيتم إطلاقه قريباً.</p>
              <button onClick={() => setActiveTab('overview')} className="mt-8 bg-cyan-600/10 text-cyan-400 border border-cyan-500/30 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-cyan-600 hover:text-white transition-all">
                العودة للوحة الرئيسية
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
```

---

## `XERIV\src\pages\LandingPage.jsx`

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Activity, BookOpen, ShieldCheck, ArrowUpLeft, ChevronDown } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ========================================= */}
      {/* 1. الحاوية السينمائية (The Cinematic Hero) */}
      {/* ========================================= */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        
{/* فيديو الخلفية التكنولوجي */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
        >
          {/* رابط فيديو احترافي ومستقر للخوادم والبيانات */}
          <source src="https://cdn.coverr.co/videos/coverr-server-room-4712/1080p.mp4" type="video/mp4" />
        </video>

        {/* طبقات التدرج اللوني (Overlays) لدمج الفيديو مع الخلفية وإبراز النص */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/90 via-[#030712]/50 to-[#030712]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>

        {/* المحتوى المركزي */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center animate-fade-in-up mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black tracking-widest uppercase mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            Xeriv Ecosystem 1.0
          </div>
          
          <h1 className="heading-xeriv text-5xl md:text-7xl font-black text-white leading-[1.2] mb-6 tracking-tight">
            نهندس أنظمة الأعمال، <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
              ونبني عقول المستقبل.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            نحن لسنا مجرد وكالة برمجيات؛ نحن بيئة متكاملة. من أنظمة الإدارة المعقدة (B2B) التي تضاعف أرباحك، إلى المرصد التقني الذي يبقيك في صدارة وادي السيليكون.
          </p>

          <button 
            onClick={() => document.getElementById('ecosystem').scrollIntoView({ behavior: 'smooth' })}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-black flex items-center gap-2 transition-all shadow-[0_0_30px_rgba(8,145,178,0.4)] hover:scale-105"
          >
            استكشف الأجنحة <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. شبكة النظام البيئي (Ecosystem Grid) */}
      {/* ========================================= */}
      <div id="ecosystem" className="relative bg-[#030712] py-24 px-6 z-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-sm font-black text-cyan-500 tracking-[0.2em] uppercase font-mono">The Infrastructure</h2>
            <h3 className="heading-xeriv text-3xl md:text-4xl font-black text-white">اختر الجناح الذي تريده</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Systems (مفتوح) */}
            <Link to="/systems" className="group relative bg-[#0b1120] border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-8 md:p-10 overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(8,145,178,0.15)] flex flex-col justify-between h-[320px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Layers size={28} strokeWidth={1.5} />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-400 group-hover:bg-cyan-500 group-hover:text-slate-900 group-hover:border-cyan-400 transition-all">
                  <ArrowUpLeft size={20} />
                </div>
              </div>
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-cyan-400 tracking-widest uppercase font-mono">Xeriv Systems</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-emerald-500/30">Live</span>
                </div>
                <h4 className="heading-xeriv text-2xl font-black text-white">أنظمة وحلول الأعمال (B2B)</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  ترسانة من البرمجيات القوية (Mini ERP, POS, Trading Bots) مصممة لتسريع نمو شركتك وأتمتة عملياتك بالكامل.
                </p>
              </div>
            </Link>

            {/* 2. Pulse (مفتوح) */}
            <Link to="/pulse" className="group relative bg-[#0b1120] border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-8 md:p-10 overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] flex flex-col justify-between h-[320px]">
              <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-all"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Activity size={28} strokeWidth={1.5} />
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all">
                  <ArrowUpLeft size={20} />
                </div>
              </div>
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-indigo-400 tracking-widest uppercase font-mono">Xeriv Pulse</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-emerald-500/30">Live</span>
                </div>
                <h4 className="heading-xeriv text-2xl font-black text-white">المرصد والمقالات التقنية</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  نبض وادي السيليكون في شاشتك. تحليلات عميقة، أدوات ذكاء اصطناعي، ومقالات تفصيلية تنقل معرفتك للمستوى التالي.
                </p>
              </div>
            </Link>

            {/* 3. Forge (قريباً) */}
            <div className="relative bg-[#050914] border border-slate-800/50 rounded-3xl p-8 md:p-10 flex flex-col justify-between h-[320px] opacity-60 cursor-not-allowed">
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-500">
                  <BookOpen size={28} strokeWidth={1.5} />
                </div>
              </div>
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-slate-500 tracking-widest uppercase font-mono">Xeriv Forge</span>
                  <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-amber-500/20">Coming Soon</span>
                </div>
                <h4 className="heading-xeriv text-2xl font-black text-slate-300">أكاديمية المهندسين</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  مصنع العقول. شهادات مهنية خارقة وكراش كورسات تبنيك من الصفر المطلق إلى الاحتراف المعماري. (جاري التجهيز).
                </p>
              </div>
            </div>

            {/* 4. Prime (قريباً) */}
            <div className="relative bg-[#050914] border border-slate-800/50 rounded-3xl p-8 md:p-10 flex flex-col justify-between h-[320px] opacity-60 cursor-not-allowed">
              <div className="relative z-10 flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-500">
                  <ShieldCheck size={28} strokeWidth={1.5} />
                </div>
              </div>
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-slate-500 tracking-widest uppercase font-mono">Xeriv Prime</span>
                  <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded uppercase border border-amber-500/20">Coming Soon</span>
                </div>
                <h4 className="heading-xeriv text-2xl font-black text-slate-300">مركز الاعتماد والتقييم</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  امتحانات تحديد المستوى، وشارات رقمية مشفرة تثبت كفاءتك التقنية للشركات العالمية. (جاري التجهيز).
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
};

export default LandingPage;
```

---

## `XERIV\src\pages\Pulse.jsx`

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Clock, ArrowUpLeft, ChevronLeft, Zap, Sparkles, BookOpen } from 'lucide-react';

const Pulse = () => {
  // بيانات وهمية للمقالات (تمثل ما سيولده AutoFactory لاحقاً)
  const articles = [
    {
      id: 1,
      title: "كيف تبني نظام POS متكامل بـ Electron.js وتتجاوز مشكلة الاتصال بالإنترنت؟",
      excerpt: "اكتشف المعمارية الصحيحة لبناء نظام إدارة نقاط بيع (Offline-First) باستخدام React و SQLite، ولماذا تعتبر هذه التقنية منقذة للشركات المتوسطة.",
      category: "هندسة النظم (Systems)",
      readTime: "7 دقائق",
      date: "23 نوفمبر 2026",
      isHot: true,
    },
    {
      id: 2,
      title: "أسرار التداول الكمي: كيف حللنا زلازل الأسعار (Z-Score) لبناء بوت Phoenix",
      excerpt: "شرح تطبيقي لخوارزميات التداول المتقدمة، وكيف يمكن للذكاء الاصطناعي قراءة بيانات Binance بشكل أسرع من المحللين البشريين بألف مرة.",
      category: "الذكاء المالي (FinTech)",
      readTime: "12 دقيقة",
      date: "20 نوفمبر 2026",
      isHot: false,
    },
    {
      id: 3,
      title: "وداعاً للاشتراكات: كيف تبني AI Agent خاصاً بشركتك بـ 5 دولارات شهرياً",
      excerpt: "دليل عملي لتجاوز منصات الذكاء الاصطناعي المكلفة، وبناء وكيل ذكي ومستقل لخدمة العملاء باستخدام Node.js ومفتوح المصدر.",
      category: "الذكاء الاصطناعي (AI)",
      readTime: "5 دقائق",
      date: "15 نوفمبر 2026",
      isHot: false,
    },
    {
      id: 4,
      title: "الدليل الشامل لأمان واجهات الـ APIs في 2026 (OWASP Top 10)",
      excerpt: "لا تطلق مشروعك قبل قراءة هذا الدليل. الثغرات القاتلة التي تدمر تطبيقات الـ SaaS وكيف تغلقها كمهندس خبير.",
      category: "الأمن السيبراني (Security)",
      readTime: "9 دقائق",
      date: "10 نوفمبر 2026",
      isHot: false,
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 animate-fade-in-up relative overflow-hidden">
      
      {/* إضاءات الخلفية (Pulse effect) */}
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* ========================================= */}
        {/* الترويسة (Hero Section) */}
        {/* ========================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-800/80 pb-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-indigo-400">
              <Activity size={14} className="animate-pulse" />
              <span>XERIV Pulse — The Radar</span>
            </div>
            
            <h1 className="heading-xeriv text-4xl md:text-5xl font-black text-white leading-tight">
              نبض <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">التكنولوجيا.</span>
            </h1>
            
            <p className="text-slate-400 text-lg leading-relaxed">
              تحليلات هندسية، أدلة تطبيقية، وأسرار وادي السيليكون التقنية. هنا نكتب بشغف للمهندسين والمؤسسين الذين يرفضون السطحية.
            </p>
          </div>

          <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 flex flex-col justify-center shrink-0 w-full md:w-64">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">النشرة البريدية</span>
            <p className="text-white font-bold text-sm mb-4">انضم لـ 500+ مطور يستقبلون شفراتنا الأسبوعية.</p>
            <Link to="/auth" className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
              <Sparkles size={14} className="text-cyan-400" />
              اشترك مجاناً
            </Link>
          </div>
        </div>

        {/* ========================================= */}
        {/* شبكة المقالات (Articles Grid) */}
        {/* ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* المقال الرئيسي (Featured Article) - يأخذ مساحة أكبر */}
          <div className="lg:col-span-8">
            <Link to="/article/1" className="group block bg-[#0b1120] border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 md:p-10 transition-all duration-300 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-all"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div className="flex justify-between items-start gap-4">
                  <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-black px-3 py-1.5 rounded-lg border border-indigo-500/30">
                    <Zap size={14} className="text-amber-400" />
                    مقال مميز (Hot)
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all">
                    <ArrowUpLeft size={18} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                    <span className="uppercase tracking-wider text-cyan-400">{articles[0].category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {articles[0].readTime}</span>
                    <span>•</span>
                    <span>{articles[0].date}</span>
                  </div>
                  
                  <h2 className="heading-xeriv text-3xl md:text-4xl font-black text-white leading-tight group-hover:text-indigo-100 transition-colors">
                    {articles[0].title}
                  </h2>
                  
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    {articles[0].excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* باقي المقالات في قائمة جانبية */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-sm font-black text-slate-400 tracking-widest uppercase mb-2 flex items-center gap-2">
              <BookOpen size={16} className="text-cyan-400" />
              أحدث الإصدارات
            </h3>
            
            {articles.slice(1).map((article) => (
              <Link 
                key={article.id} 
                to={`/article/${article.id}`} 
                className="group block bg-[#0b1120] border border-slate-800/80 hover:border-slate-600 rounded-2xl p-5 transition-all hover:bg-slate-900/80"
              >
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 mb-3">
                  <span className="uppercase text-indigo-400">{article.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                </div>
                
                <h4 className="heading-xeriv text-lg font-bold text-slate-200 mb-2 group-hover:text-white transition-colors leading-snug">
                  {article.title}
                </h4>
                
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>

        </div>

        {/* ========================================= */}
        {/* فخ التسويق المركزي (Central Lead Magnet) */}
        {/* ========================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right mt-10">
          <div>
            <h3 className="heading-xeriv text-xl font-bold text-white mb-2">هل تريد أن نرسل لك المقالات الجديدة مباشرة؟</h3>
            <p className="text-sm text-slate-400">لا تفوت أي تحديث تقني. اشترك في النشرة الخاصة بمهندسي وادي السيليكون العرب.</p>
          </div>
          <Link to="/auth" className="bg-white hover:bg-slate-200 text-slate-950 font-black py-3 px-6 rounded-xl transition-colors shrink-0">
            اشترك في النشرة
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Pulse;
```

---

## `XERIV\src\pages\Systems.jsx`

```javascript
import React from 'react';
import { Briefcase, BarChart, Server, MonitorSmartphone, Calendar, CheckCircle, Hexagon, Terminal, ArrowUpLeft } from 'lucide-react';

const Systems = () => {
  const products = [
    {
      id: 1,
      title: "XERIV ERP & POS System",
      category: "Desktop / Enterprise",
      tech: ["Electron", "React", "SQLite", "Tailwind"],
      results: "سرعة تنفيذ 0.1s مع دعم كامل للعمل بلا إنترنت (Offline-First).",
      desc: "نظام إدارة موارد متكامل ونقاط بيع مخصص للشركات. يتميز بمحرك قيود مخصص، قاعدة بيانات محلية فائقة السرعة، وتصميم زجاجي (Glassmorphism) يسهل على الموظفين استخدامه بدون تدريب.",
      icon: <MonitorSmartphone className="text-cyan-400" size={28} strokeWidth={1.5} />,
      glow: "group-hover:bg-cyan-500/20",
      border: "hover:border-cyan-500/50"
    },
    {
      id: 2,
      title: "Phoenix Algorithmic Bot",
      category: "FinTech / Quantitative AI",
      tech: ["Python", "XGBoost", "Binance API", "MQL5"],
      results: "أتمتة استراتيجيات (SMC & ICT) بسرعة استجابة 0.02 ثانية.",
      desc: "بوت تداول خوارزمي متقدم يعمل على تحليل البيانات الزمنية (Time-Series) وتنفيذ أوامر التداول آلياً بناءً على مؤشرات زلازل الأسعار (Z-Score) وإدارة مخاطر صارمة لحماية رأس المال.",
      icon: <BarChart className="text-blue-400" size={28} strokeWidth={1.5} />,
      glow: "group-hover:bg-blue-500/20",
      border: "hover:border-blue-500/50"
    },
    {
      id: 3,
      title: "Vision & DSP Engines",
      category: "AI Integration / Vision",
      tech: ["OpenCV", "MediaPipe", "Node.js", "Python"],
      results: "دقة 99% في التعرف على الإيماءات وتحليل الإشارات المعقدة.",
      desc: "محركات ذكاء اصطناعي مخصصة قادرة على قراءة حركات الجسم في الوقت الفعلي، ومعالجة الصوت الرقمي المتقدم للأنظمة الأمنية والطبية والصناعية.",
      icon: <Server className="text-indigo-400" size={28} strokeWidth={1.5} />,
      glow: "group-hover:bg-indigo-500/20",
      border: "hover:border-indigo-500/50"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 animate-fade-in-up relative overflow-hidden flex flex-col items-center">
      
      {/* إضاءات الخلفية */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="w-full max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* ========================================= */}
        {/* الترويسة (Hero Section) */}
        {/* ========================================= */}
        <div className="text-center space-y-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#0b1120] border border-cyan-500/30 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <Terminal size={14} />
            <span>XERIV Systems — B2B Solutions</span>
          </div>
          
          <h1 className="heading-xeriv text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl mx-auto">
            نحن لا نكتب الكود فحسب.. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              نحن نهندس أنظمة تضاعف أرباحك.
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            من أنظمة إدارة الموارد (ERP) المعقدة، إلى بوتات التداول الكمي ومحركات الذكاء الاصطناعي. 
            نوفر لشركتك بنية تحتية برمجية صلبة، سريعة، وقابلة للتوسع اللانهائي.
          </p>
        </div>

        {/* ========================================= */}
        {/* معرض الأنظمة والبرمجيات (Products Catalog) */}
        {/* ========================================= */}
        <div>
          <div className="flex items-center gap-3 mb-10 border-b border-slate-800/80 pb-4">
            <Hexagon className="text-cyan-500" size={24} />
            <h2 className="heading-xeriv text-2xl font-black text-white">
              ترسانة الأنظمة والبرمجيات (Software Arsenal)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className={`bg-[#0b1120] border border-slate-800 rounded-3xl p-8 transition-all duration-300 group flex flex-col h-full relative overflow-hidden ${product.border} hover:shadow-[0_0_35px_rgba(34,211,238,0.1)]`}
              >
                {/* توهج داخلي عند المرور */}
                <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100 ${product.glow}`}></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="bg-slate-900/80 border border-slate-700/50 p-4 rounded-2xl shadow-inner">
                    {product.icon}
                  </div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="heading-xeriv text-2xl font-black text-white mb-3 relative z-10">
                  {product.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-[1.8] mb-8 flex-grow relative z-10">
                  {product.desc}
                </p>
                
                <div className="space-y-5 mt-auto relative z-10">
                  <div className="bg-[#030712]/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={16} />
                    <span className="text-xs font-bold text-slate-300 leading-relaxed">{product.results}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
                    {product.tech.map((t, index) => (
                      <span key={index} className="text-[10px] font-mono text-cyan-200/70 bg-cyan-950/30 px-2.5 py-1 rounded-md border border-cyan-900/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================= */}
        {/* الدعوة لاتخاذ إجراء (B2B CTA Booking) */}
        {/* ========================================= */}
        <div className="bg-gradient-to-r from-[#0b1120] to-[#0a192f] border border-cyan-900/50 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          {/* خط علوي مضيء */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"></div>
          
          <div className="md:w-2/3 space-y-4 relative z-10">
            <span className="text-xs font-black text-cyan-400 tracking-widest uppercase">XERIV Enterprise Consulting</span>
            <h2 className="heading-xeriv text-3xl md:text-4xl font-black text-white leading-tight">
              هل يواجه مشروعك تعقيدات هندسية؟
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              توقف عن إضاعة الوقت والميزانية مع الهواة. احجز جلسة استشارية تقنية لنناقش المعمارية البرمجية الصحيحة لمشروعك، وكيف نحوله إلى نظام قوي قابل للتوسع.
            </p>
          </div>
          
          <div className="md:w-1/3 w-full flex justify-end relative z-10">
            <button className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_25px_rgba(8,145,178,0.4)] hover:scale-105 hover:-translate-y-1">
              <Calendar size={20} />
              احجز مكالمة استشارية
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Systems;
```

---

