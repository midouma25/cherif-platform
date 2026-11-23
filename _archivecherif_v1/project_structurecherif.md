# Project Structure

```text
platformauto/
    ├── project_structure.md
    ├── project_structurecherif.md
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
        ├── AdminDashboard.jsx
        ├── App.css
        ├── App.jsx
        ├── Auth.jsx
        ├── AuthContext.jsx
        ├── B2B.jsx
        ├── Certificate.jsx
        ├── Classroom.jsx
        ├── CourseDetails.jsx
        ├── Hub.jsx
        ├── InstructorStudio.jsx
        ├── LandingPage.jsx
        ├── Rankings.jsx
        ├── StudentHub.jsx
        ├── Vault.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        ├── components/
            ├── Navbar.jsx
            ├── ProtectedRoute.jsx
├── cherif-platform-backend/
    ├── .env
    ├── package.json
    ├── server.js
```


---

# Source Code

## `project_structure.md`

```markdown
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


```

---

## `project_structurecherif.md`

```markdown
# Project Structure

```text
platformauto/
    ├── project_structure.md
    ├── project_structurecherif.md
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
        ├── AdminDashboard.jsx
        ├── App.css
        ├── App.jsx
        ├── Auth.jsx
        ├── AuthContext.jsx
        ├── B2B.jsx
        ├── Certificate.jsx
        ├── Classroom.jsx
        ├── CourseDetails.jsx
        ├── Hub.jsx
        ├── InstructorStudio.jsx
        ├── LandingPage.jsx
        ├── Rankings.jsx
        ├── StudentHub.jsx
        ├── Vault.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        ├── components/
            ├── Navbar.jsx
            ├── ProtectedRoute.jsx
├── cherif-platform-backend/
    ├── .env
    ├── package.json
    ├── server.js
```


---

# Source Code

## `project_structure.md`

```markdown
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

OUTPUT_FILE = "project_structurecherif.md"
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
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800;900&display=swap" rel="stylesheet">
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
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.18.4",
    "react-syntax-highlighter": "^16.1.1",
    "remark-gfm": "^4.0.1"
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
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, BookOpen, Clock, PlayCircle, Star, Award, Trophy, Zap, 
  GitBranch, Bot, Layers, CheckCircle2, ArrowRight, ChevronLeft, 
  Sparkles, DollarSign, Briefcase, Rocket, Link2, ShieldCheck, Code, Flame,
  TrendingUp, Target, Compass, ChevronDown, Terminal, Users, Globe, Headphones, Mic, Volume2
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ============================================================================
// 🧠 المحرك الذكي لتحليل الكورسات (يدعم: البرمجة + بناء المشاريع + اللغات A0-C2 & IELTS)
// ============================================================================
export const detectLanguageProfile = (text = '') => {
  const lower = text.toLowerCase();
  const isLanguageCourse = Boolean(
    /لغة|لغات|إنجليزي|انجليزي|ياباني|فرنسي|ألماني|الماني|إسباني|اسباني|صيني|نطق|صوتيات|حروف|أبجدية|محادثة|استماع|مفردات|قواعد اللغة|ielts|toefl|jlpt|delf|dalf|goethe|testdaf|dele|hsk|cefr|pre-a1|a0|a1\.1|a1\.2|a2\.1|a2\.2|b1|b2|c1|c2|phonetics|phonics|ipa|shadowing|cambridge|native|hiragana|katakana|kanji/i.test(text)
  );

  if (!isLanguageCourse) return { isLanguageCourse: false };

  let flag = '🌍';
  let langName = 'اللغات العالمية';
  if (/إنجليزي|انجليزي|english|ielts|toefl/i.test(lower)) { flag = '🇬🇧'; langName = 'الإنجليزية (English)'; }
  else if (/ياباني|japanese|jlpt|hiragana|kanji/i.test(lower)) { flag = '🇯🇵'; langName = 'اليابانية (Japanese)'; }
  else if (/فرنسي|french|delf|dalf/i.test(lower)) { flag = '🇫🇷'; langName = 'الفرنسية (French)'; }
  else if (/ألماني|الماني|german|goethe|testdaf/i.test(lower)) { flag = '🇩🇪'; langName = 'الألمانية (German)'; }
  else if (/إسباني|اسباني|spanish|dele/i.test(lower)) { flag = '🇪🇸'; langName = 'الإسبانية (Spanish)'; }
  else if (/صيني|mandarin|chinese|hsk/i.test(lower)) { flag = '🇨🇳'; langName = 'الصينية (Mandarin)'; }

  let cefrBadge = 'مسار لغوي شامل';
  if (/pre-a1|a0|حروف|أبجدية|أصوات|phonics/i.test(lower)) cefrBadge = 'Pre-A1 / A0 (تأسيس الحروف والأصوات)';
  else if (/a1/i.test(lower)) cefrBadge = 'المستوى التأسيسي A1';
  else if (/a2/i.test(lower)) cefrBadge = 'المستوى قبل المتوسط A2';
  else if (/b1/i.test(lower)) cefrBadge = 'المستوى المتوسط والطلاقة B1';
  else if (/b2/i.test(lower)) cefrBadge = 'المستوى فوق المتوسط B2';
  else if (/c1/i.test(lower)) cefrBadge = 'المستوى المتقدم والأكاديمي C1';
  else if (/c2|native/i.test(lower)) cefrBadge = 'قمة الطلاقة C2 Native';
  else if (/ielts|toefl|jlpt|delf|dalf|testdaf|اختبار/i.test(lower)) cefrBadge = 'معسكر الاختبارات العالمية (Exam Prep)';

  return {
    isLanguageCourse: true,
    flag,
    langName,
    cefrBadge
  };
};

export const parseCourseHierarchy = (course) => {
  const rawTitle = course?.title || '';
  const rawDesc = course?.description || '';
  const rawDiff = course?.difficulty || '';
  const meta = course?.certificateMeta || {};

  // 1. استخراج اسم الشهادة الأم والشهادة الفرعية
  let parentCertTitle = meta.parentCertificateTitle || '';
  let subCertBadge = meta.subCertificateBadge || '';

  const withinMatch = rawDesc.match(/\(ضمن\s+([^)]+)\)/);
  if (!parentCertTitle && withinMatch) {
    parentCertTitle = withinMatch[1].trim();
  }

  const badgeMatch = rawDesc.match(/🏆\s*يمنح:\s*([^|(]+)/);
  if (!subCertBadge && badgeMatch) {
    subCertBadge = badgeMatch[1].trim();
  }

  // 2. استخراج رقم الكراش كورس بالترتيب
  let courseOrder = meta.courseOrder || null;
  if (!courseOrder) {
    const orderMatch = rawTitle.match(/(?:كراش كورس|الكورس|كورس|المرحلة|Course)\s*(\d+)/i);
    if (orderMatch) courseOrder = parseInt(orderMatch[1], 10);
  }

  const cleanDescription = rawDesc
    .split('|||UNITS_MAP:')[0]
    .replace(/\|\s*🏆\s*يمنح:.*$/, '')
    .trim();

  // 3. كشف نوع الكورس (لغات vs بناء مشروع بدون اختبارات vs برمجة)
  const combinedTextForDetection = `${rawTitle} ${cleanDescription} ${parentCertTitle} ${rawDiff} ${(meta.skills || []).join(' ')}`;
  const langProfile = detectLanguageProfile(combinedTextForDetection);
  const isLanguageCourse = langProfile.isLanguageCourse;

  const isNoExamProject = !isLanguageCourse && Boolean(
    /بدون اختبارات|بناء مشروع|من الصفر للإطلاق|from scratch/i.test(combinedTextForDetection)
  );

  const defaultSkills = meta.skills?.length > 0 
    ? meta.skills 
    : extractKeywordsFromText(combinedTextForDetection, isLanguageCourse);

  const shortCleanTitle = rawTitle.replace(/^(الكراش كورس|الكورس|كراش كورس|المرحلة)\s*\d+\s*:\s*/i, '').trim();

  const githubProjectTitle = meta.githubProject?.projectTitle || (
    isLanguageCourse
      ? `تحدي المحادثة والأداء اللغوي في (${shortCleanTitle})`
      : `مشروع تطبيقي متكامل في ${shortCleanTitle}`
  );

  const githubProjectSummary = meta.githubProject?.projectSummary || (
    isLanguageCourse
      ? `تطبيق عملي شامل للمواقف الحياتية والقواعد والصوتيات في (${shortCleanTitle}) عبر محادثة صوتية حية ومهمة كتابية مع الـ AI Voice Examiner.`
      : `بناء وتطوير مشروع عملي متكامل يطبق مفاهيم (${shortCleanTitle}) خطوة بخطوة بالاستعانة بأوامر AI Agent ورفعه بشكل احترافي على حسابك في GitHub.`
  );

  const isPartOfCertificate = Boolean(parentCertTitle);
  const estimatedHours = course.estimatedHours || 16;
  const xpReward = (courseOrder && courseOrder < 50 ? 1200 + (courseOrder * 150) : 1800);

  // 4. توليد الآفاق المهنية والمادية المخصصة (للغات أو للبرمجة)
  const horizons = isLanguageCourse
    ? generateLanguageHorizons(shortCleanTitle, cleanDescription, langProfile, courseOrder || 1)
    : generateCourseHorizons(shortCleanTitle, cleanDescription, defaultSkills, courseOrder || 1);

  // 5. بناء شرح غني ومفصل يناسب طبيعة الكورس
  const richExtendedDescription = isLanguageCourse
    ? `${cleanDescription} — صُمم هذا الكورس اللغوي وفق منهجية (Cambridge التفاعلية × مكعبات الليغو ELI5 👶) ليأخذك خطوة بخطوة عبر مواقف الحياة الواقعية؛ حيث تتقن مخارج الحروف والرموز الصوتية (IPA)، وتدرب أذنك ولسانك بـ 3 سرعات صوتية (Shadowing)، وتركب الجمل بطلاقة دون ترجمة ذهنية، وصولاً إلى ممارسة المحادثة الحية مع الـ AI Voice Partner.`
    : isNoExamProject
      ? `${cleanDescription} — ورشة بناء هندسية عملية 100% (بدون أي اختبارات أو حشو نظري) تأخذك ملفاً بملف وخطوة بخطوة لبناء هذا الجزء من المشروع من الصفر، مع إعطائك الأوامر الحرفية الجاهزة (Prompts) لتوجيه الـ AI Agent، والأكواد الكاملة وكيفية ربطها وتشغيلها حياً.`
      : `${cleanDescription} — يأخذك هذا المسار المكثف من المفاهيم التأسيسية بأسلوب التبسيط القصصي (مبدأ فاينمان ELI5 👶) إلى التطبيق الهندسي العميق، حيث تتدرب داخل مختبر الكود التفاعلي المدعوم بـ 3 تلميحات تدريجية ومصحح الذكاء الاصطناعي، وتجتاز بوابات الزعماء والبوابات الحمراء حتى تبني مشروعك النهائي وترفعه على GitHub.`;

  return {
    ...course,
    shortCleanTitle,
    cleanDescription,
    richExtendedDescription,
    isPartOfCertificate,
    isLanguageCourse,
    isNoExamProject,
    langProfile,
    parentCertTitle: parentCertTitle || null,
    parentCertDescription: meta.parentCertificateDescription || null,
    mainAnalogy: meta.mainAnalogy || null,
    subCertBadge: subCertBadge || `شهادة إتقان ${shortCleanTitle}`,
    courseOrder: courseOrder || 99,
    extractedSkills: defaultSkills,
    githubProjectTitle,
    githubProjectSummary,
    estimatedHours,
    xpReward,
    horizons,
    careerROI: meta.careerAndFinancialROI || null,
    timePlan: meta.timePlan || null
  };
};

// دالة استخراج المهارات (لغات أو برمجة)
const extractKeywordsFromText = (text, isLanguageCourse = false) => {
  if (isLanguageCourse) {
    const knownLangSkills = [
      'IPA Phonetics', 'Active Listening', 'Shadowing Technique', 'Connected Speech',
      'Lego Grammar', 'Cambridge Dialogues', 'Collocations & Idioms', 'Academic Writing',
      'Speaking Fluency', 'IELTS Strategies', 'JLPT Mastery', 'DELF/DALF Prep'
    ];
    const foundLang = knownLangSkills.filter(sk => text.toLowerCase().includes(sk.split(' ')[0].toLowerCase()));
    return foundLang.length >= 3
      ? foundLang.slice(0, 6)
      : ['IPA & Pronunciation', 'Connected Speech', 'Lego Grammar (ELI5)', 'Active Listening & Shadowing', 'Real-Life Fluency', 'AI Voice Roleplay'];
  }

  const knownTech = [
    'HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 
    'SQL', 'Python', 'Git', 'GitHub', 'Docker', 'Cloud', 'AI Agents', 
    'Prompt Engineering', 'REST API', 'JWT', 'Tailwind', 'Next.js', 'TypeScript', 'Linux', 'Cybersecurity', 'Testing', 'Supabase', 'Stripe'
  ];
  const found = knownTech.filter(tech => text.toLowerCase().includes(tech.toLowerCase()));
  return found.length > 0 ? found.slice(0, 6) : ['Software Architecture', 'Clean Code', 'AI-Assisted Dev', 'Problem Solving', 'GitHub Portfolio'];
};

// 🌍 محرك توليد الآفاق المهنية والمادية والشخصية لكورسات اللغات والاختبارات العالمية
const generateLanguageHorizons = (title, desc, langProfile, order) => {
  const combined = (title + ' ' + desc).toLowerCase();

  if (/pre-a1|a0|حروف|أصوات|أبجدية|phonics|كلمات.*أولى|بقاء/i.test(combined) || order <= 3) {
    return {
      freelanceGig: `كسر حاجز الأمية اللغوية في ${langProfile.langName}: قراءة وتهجئة أي كلمة، نطق الحروف من مخارجها الصحيحة، وبناء أول جملك للتعريف بنفسك.`,
      gigPriceRange: 'المستوى التأسيسي (Pre-A1 / A0)',
      careerImpact: 'التخلص نهائياً من عقدة الخوف من اللغة أو النطق الخاطئ أمام الآخرين وبناء أذن موسيقية تلتقط الأصوات بدقة.',
      saasCapability: 'التدرب الصوتي المباشر عبر مشغل الـ 3 سرعات (0.5x للحروف، 0.75x للترديد، و1.0x للسرعة الطبيعية) ومحاكي الـ AI.',
      beforeState: 'ترى حروف وكلمات اللغة كرموز غامضة لا تعرف كيف تقرؤها أو من أين تبدأ نطقها الصحيح.',
      afterState: 'تقرأ وتنطق الكلمات بثقة، تفهم معادلة تركيب الجملة البسيطة كالمكعبات، وتجري أول حوار تعارف كامل.'
    };
  }

  if (/a1|a2|روتين|مدينة|مطاعم|سفر|ماضي|مستقبل/i.test(combined) || order <= 7) {
    return {
      freelanceGig: `التواصل اليومي والسفر بثقة في ${langProfile.langName}: إدارة الحوارات في المطارات، الفنادق، المطاعم، التسوق، والتحدث عن حياتك وخططك.`,
      gigPriceRange: 'استقلالية الحياة والسفر (A1 ➔ A2)',
      careerImpact: 'القدرة على كتابة رسائل وإيميلات يومية صحيحة وفهم المحادثات المباشرة في بيئات العمل التأسيسية.',
      saasCapability: 'إتقان القوالب الجاهزة (Cambridge Power Chunks) التي تجعلك تركب جملاً في الزمن الحاضر والماضي والمستقبل فوراً.',
      beforeState: 'تعرف كلمات متفرقة لكنك تتجمد عندما تحاول ربطها في جملة للرد على شخص أو طلب شيء.',
      afterState: 'تتحدث عن يومك، تجاربك الماضية، وخططك المستقبلية بجمل مترابطة وسليمة دون تلعثم.'
    };
  }

  if (/b1|b2|طلاقة|ربط صوتي|connected speech|متلازمات|collocations|نقاش/i.test(combined) || order <= 13) {
    return {
      freelanceGig: `العمل عن بعد والتفاوض مع العملاء والشركات العالمية بـ ${langProfile.langName} دون الحاجة لمترجم.`,
      gigPriceRange: '+40% - 120% زيادة في الفرص والرواتب',
      careerImpact: 'اجتياز مقابلات العمل الدولية (Job Interviews)، المشاركة في اجتماعات الشركات الأجنبية، وفهم المتحدثين السريعين.',
      saasCapability: 'اختراق الأذن السمعية بإتقان أسرار الربط الصوتي (Connected Speech) والمتلازمات اللفظية (Collocations) كالمتحدثين الأصليين.',
      beforeState: 'تترجم كل كلمة في رأسك من العربية قبل أن تنطقها، وتضيع تماماً عندما يتحدث أهل اللغة بسرعة في الأفلام أو الاجتماعات.',
      afterState: 'تفكر وترد مباشرة باللغة الأجنبية بطلاقة، وتفهم الكلام السريع المدمج وتستخدم تعبيرات احترافية راقية.'
    };
  }

  return {
    freelanceGig: `الوصول لقمة الطلاقة (C1/C2 Native) واجتياز الاختبارات العالمية (IELTS Band 8+ / TOEFL / JLPT / DELF) للمنح والهجرة والشركات الكبرى.`,
    gigPriceRange: 'طلاقة C2 Native & Global Exams 🏆',
    careerImpact: 'التأهل المباشر للهجرة المهنية، المنح الجامعية العالمية، والمناصب القيادية والاستشارية في الشركات متعددة الجنسيات.',
    saasCapability: 'إتقان الهندسة البلاغية، كتابة المقالات والتقارير الأكاديمية المحكمة، والارتجال الشفوي البليغ في أعقد المواضيع.',
    beforeState: 'لغتك عادية أو متوسطة وتخشى الرسوب أو الحصول على درجة منخفضة في أقسام الكتابة والمحادثة في الاختبارات الدولية.',
    afterState: 'تتحدث وتكتب ببلاغة المتحدث الأصلي (C2) وتمتلك التكتيكات الهندسية لحصد أعلى الدرجات في الاختبارات العالمية.'
  };
};

// 💻 محرك توليد الآفاق المهنية والمادية للكورسات البرمجية والتقنية
const generateCourseHorizons = (title, desc, skills, order) => {
  const combined = (title + ' ' + desc + ' ' + skills.join(' ')).toLowerCase();

  if (combined.includes('html') || combined.includes('css') || combined.includes('tailwind') || combined.includes('واجهات') || combined.includes('تصميم')) {
    return {
      freelanceGig: 'تصميم وتكويد صفحات هبوط (Landing Pages) متجاوبة وعالية التحويل للشركات والمنتجات الرقمية.',
      gigPriceRange: '$120 - $350 / للمشروع',
      careerImpact: 'امتلاك عين المصمم الهندسية والقدرة على تحويل أي تصميم Figma إلى كود نظيف وسريع في وقت قياسي.',
      saasCapability: 'بناء الواجهات التسويقية الفخمة لمنتجاتك الرقمية الخاصة لجذب المشتركين من النظرة الأولى.',
      beforeState: 'تخاف من تنسيق الصفحات وتضيع ساعات في ضبط العناصر والألوان على الشاشات المختلفة.',
      afterState: 'تبني واجهات عصرية متجاوبة خلال ساعات قليلة بمساعدة الـ AI Agent وترفعها مباشرة على GitHub.'
    };
  }

  if (combined.includes('react') || combined.includes('next') || combined.includes('dom') || combined.includes('تفاعلي') || combined.includes('monorepo')) {
    return {
      freelanceGig: 'تطوير لوحات تحكم تفاعلية (Dashboards) وتطبيقات ويب حديثة (Next.js / React) للشركات الناشئة.',
      gigPriceRange: '$350 - $950 / للمشروع',
      careerImpact: 'التأهل المباشر لمقابلات مطوري الواجهات الأمامية والـ Full-Stack بإتقان معمارية المكونات الحديثة.',
      saasCapability: 'بناء واجهة الاستخدام الكاملة لأي تطبيق SaaS تفاعلي مع تجربة مستخدم فائقة السرعة.',
      beforeState: 'تجد صعوبة في إدارة البيانات المتغيرة وتنظيم مشاريع الويب الكبيرة.',
      afterState: 'تهندس تطبيقات تفاعلية معقدة ومقسمة إلى مكونات وحزم احترافية قابلة للتوسع.'
    };
  }

  if (combined.includes('node') || combined.includes('express') || combined.includes('api') || combined.includes('mongo') || combined.includes('sql') || combined.includes('supabase') || combined.includes('خادم') || combined.includes('بيانات')) {
    return {
      freelanceGig: 'بناء خوادم خلفية (APIs) وهيكلة قواعد بيانات آمنة ونظام مصادقة متكامل للمتاجر والمنصات.',
      gigPriceRange: '$450 - $1,200 / للمشروع',
      careerImpact: 'الانتقال من مجرد مصمم واجهات إلى مهندس نظم خلفية (Backend / Full-Stack) يفهم منطق الأعمال والبيانات.',
      saasCapability: 'برمجة العقل المدبر لمشاريعك، حفظ بيانات المشتركين، وإدارة العمليات المالية بأمان تام.',
      beforeState: 'تعتمد على بيانات وهمية ثابتة ولا تعرف كيف تحفظ بيانات المستخدمين أو تحمي صلاحياتهم.',
      afterState: 'تبني سيرفرات وقواعد بيانات حقيقية مؤمنة وجاهزة لاستقبال آلاف المستخدمين.'
    };
  }

  if (combined.includes('ai') || combined.includes('ذكاء') || combined.includes('agent') || combined.includes('python') || combined.includes('أتمتة')) {
    return {
      freelanceGig: 'دمج وكلاء الذكاء الاصطناعي (AI Agents) وبناء أنظمة أتمتة ذكية وبوتات مخصصة للشركات.',
      gigPriceRange: '$600 - $1,800 / للمشروع',
      careerImpact: 'التفوق على 90% من المبرمجين التقليديين عبر إتقان هندسة الأوامر والبرمجة المعززة بالذكاء الاصطناعي بسرعة 10x.',
      saasCapability: 'إطلاق أدوات AI Micro-SaaS مطلوبة بشدة في السوق العالمي وتحقيق دخل متكرر منها.',
      beforeState: 'تكتب كل سطر كود يدوياً ببطء وتستغرق أسابيع في إصلاح الأخطاء البرمجية البسيطة.',
      afterState: 'تقود وكلاء الذكاء الاصطناعي كمدير هندسي لينجزوا معك مشاريع كاملة في ساعات معدودة.'
    };
  }

  if (combined.includes('docker') || combined.includes('cloud') || combined.includes('سحاب') || combined.includes('نشر') || combined.includes('أمان') || combined.includes('security') || combined.includes('stripe')) {
    return {
      freelanceGig: 'ربط بوابات الدفع (Stripe)، نشر التطبيقات سحابياً (Cloud & Docker)، وتأمين المنصات الإنتاجية.',
      gigPriceRange: '$400 - $1,100 / للخدمة',
      careerImpact: 'اكتساب مهارات الإطلاق الإنتاجي وأمن التطبيقات التي تجعلك مهندساً نادراً لا غنى عنه في أي فريق.',
      saasCapability: 'تحويل مشاريعك إلى منتجات تجارية تستقبل المدفوعات والاشتراكات الشهرية وتعمل على مدار الساعة.',
      beforeState: 'مشاريعك حبيسة جهازك الشخصي (localhost) ولا تعرف كيف تطلقها للعالم أو تربطها بالدفع الإلكتروني.',
      afterState: 'تنشر أنظمتك سحابياً بروابط رسمية مؤمنة مع بوابات دفع واشتراكات جاهزة للربح.'
    };
  }

  return {
    freelanceGig: `تقديم استشارات وخدمات برمجية متخصصة في (${title}) وإنجاز مهام تقنية للعملاء.`,
    gigPriceRange: `$${150 + (order * 40)} - $${400 + (order * 60)} / للمشروع`,
    careerImpact: `تأسيس قاعدة هندسية صلبة في (${title}) تمنحك ثقة كاملة في النقاشات والمقابلات التقنية.`,
    saasCapability: 'امتلاك اللبنة الهندسية الأساسية التي تمكنك من بناء وتوسيع منتجاتك البرمجية الخاصة.',
    beforeState: 'تشعر بالرهبة من المصطلحات التقنية المعقدة ولا تعرف من أين تبدأ التطبيق العملي.',
    afterState: 'تفهم الفلسفة العميقة للمفهوم بأسلوب مبسط وتطبقها بيدك في مشروع موثق على GitHub.'
  };
};

const Academy = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'certificates' | 'languages' | 'crash_courses' | 'standalone'
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [activeHorizonTab, setActiveHorizonTab] = useState('freelance'); // 'freelance' | 'career' | 'saas' | 'transformation'
  const [expandedCourseIdx, setExpandedCourseIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicCourses = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5001/api/courses/public');
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        console.error('خطأ في جلب الكورسات:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicCourses();
  }, []);

  const { enrichedCourses, certificateGroups } = useMemo(() => {
    const parsed = courses.map(parseCourseHierarchy);

    const groupsMap = {};
    parsed.forEach(c => {
      if (c.isPartOfCertificate && c.parentCertTitle) {
        if (!groupsMap[c.parentCertTitle]) {
          const certLangProfile = detectLanguageProfile(c.parentCertTitle + ' ' + (c.parentCertDescription || '') + ' ' + c.title);
          groupsMap[c.parentCertTitle] = {
            certTitle: c.parentCertTitle,
            certDescription: c.parentCertDescription || null,
            mainAnalogy: c.mainAnalogy || null,
            careerROI: c.careerROI || null,
            isLanguageCert: certLangProfile.isLanguageCourse || c.isLanguageCourse,
            langProfile: certLangProfile.isLanguageCourse ? certLangProfile : c.langProfile,
            isNoExamProjectCert: c.isNoExamProject,
            courses: [],
            totalHours: 0,
            totalXP: 0,
            allSkills: new Set(),
            totalPrice: 0
          };
        }
        groupsMap[c.parentCertTitle].courses.push(c);
        groupsMap[c.parentCertTitle].totalHours += c.estimatedHours;
        groupsMap[c.parentCertTitle].totalXP += c.xpReward;
        groupsMap[c.parentCertTitle].totalPrice += (c.price || 0);
        if (c.isLanguageCourse) {
          groupsMap[c.parentCertTitle].isLanguageCert = true;
          groupsMap[c.parentCertTitle].langProfile = c.langProfile;
        }
        if (!groupsMap[c.parentCertTitle].certDescription && c.parentCertDescription) {
          groupsMap[c.parentCertTitle].certDescription = c.parentCertDescription;
        }
        if (!groupsMap[c.parentCertTitle].mainAnalogy && c.mainAnalogy) {
          groupsMap[c.parentCertTitle].mainAnalogy = c.mainAnalogy;
        }
        if (!groupsMap[c.parentCertTitle].careerROI && c.careerROI) {
          groupsMap[c.parentCertTitle].careerROI = c.careerROI;
        }
        c.extractedSkills.forEach(sk => groupsMap[c.parentCertTitle].allSkills.add(sk));
      }
    });

    const groupsArray = Object.values(groupsMap).map(group => {
      const sortedCourses = [...group.courses].sort((a, b) => a.courseOrder - b.courseOrder);
      return {
        ...group,
        courses: sortedCourses,
        skillsList: Array.from(group.allSkills),
        estimatedMonths: Math.max(2, Math.round(group.totalHours / 40)),
        marketValueUSD: sortedCourses.length * 190
      };
    });

    return { enrichedCourses: parsed, certificateGroups: groupsArray };
  }, [courses]);

  const filteredCrashCourses = enrichedCourses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.cleanDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.parentCertTitle && course.parentCertTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeTab === 'standalone') return !course.isPartOfCertificate;
    if (activeTab === 'languages') return course.isLanguageCourse;
    return true;
  }).sort((a, b) => a.courseOrder - b.courseOrder);

  const filteredCertificates = certificateGroups.filter(cert => {
    const matchesSearch =
      cert.certTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.courses.some(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;
    if (activeTab === 'languages') return cert.isLanguageCert;
    return true;
  });

  // ============================================================================
  // 👑 الواجهة الملحمية لتفاصيل الشهادة المهنية (تتكيف تلقائياً بين شهادات اللغات وشهادات البرمجة!)
  // ============================================================================
  if (selectedCertificate) {
    const firstCourse = selectedCertificate.courses[0];
    const isLangCert = Boolean(selectedCertificate.isLanguageCert);
    const jobRoles = selectedCertificate.careerROI?.jobRoles || (
      isLangCert
        ? [
            'العمل عن بعد مع الشركات العالمية (International Remote Professional)',
            'اجتياز اختبارات القبول والهجرة الدولية (IELTS Band 8+ / TOEFL / JLPT)',
            'التفاوض التجاري وإدارة الاجتماعات الدولية بطلاقة (C1/C2)',
            'الترجمة التخصصية وصناعة المحتوى والتدريس الدولي'
          ]
        : [
            'Full-Stack Software Engineer',
            'AI-Augmented Application Developer',
            'Backend & Cloud Solutions Architect',
            'Freelance Technical Consultant & SaaS Founder'
          ]
    );

    const cefrStages = [
      { code: 'Pre-A1 / A0', label: 'الحروف والأصوات والكلمات الأولى' },
      { code: 'A1 ➔ A2', label: 'محادثات الحياة اليومية والسفر' },
      { code: 'B1 ➔ B2', label: 'الطلاقة، الربط الصوتي، والنقاش' },
      { code: 'C1 ➔ C2 Native', label: 'البلاغة الكاملة واجتياز IELTS/JLPT' }
    ];

    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 py-10 px-6 pb-28 animate-fade-in-up academy-typography" dir="rtl">
        
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
          .academy-typography { font-family: 'Readex Pro', sans-serif; }
          .heading-alex { font-family: 'Alexandria', sans-serif; line-height: 1.5 !important; }
          .mono-code { font-family: 'JetBrains Mono', monospace; }
        `}} />

        <div className="max-w-6xl mx-auto space-y-14">
          
          {/* شريط العودة العلوي */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <button 
              onClick={() => { setSelectedCertificate(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              <ArrowRight size={18} /> العودة إلى كتالوج الأكاديمية
            </button>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                مكافأة المسار: +{selectedCertificate.totalXP.toLocaleString()} EXP (ترقية لرتبة S-Rank)
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 1. الهيرو الملحمي للشهادة المهنية (يتكيف بصرياً ونصياً للغات أو البرمجة) */}
          {/* ================================================================= */}
          <div className={`bg-gradient-to-br ${isLangCert ? 'from-purple-950/70 via-[#0b1120] to-[#070b14] border-purple-500/50' : 'from-indigo-950/70 via-[#0b1120] to-[#070b14] border-amber-500/50'} border-2 rounded-3xl p-8 md:p-12 shadow-[0_0_70px_rgba(245,158,11,0.15)] relative overflow-hidden`}>
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                    <Trophy size={15} /> {isLangCert ? `${selectedCertificate.langProfile?.flag || '🌍'} شهادة مهنية دولية في اللغات` : 'شهادة مهنية شاملة (Professional Certificate)'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    <Sparkles size={14} /> {isLangCert ? 'منهجية Cambridge × مكعبات الليغو ELI5 + صوتيات IPA 🔊' : 'منهجية التبسيط المطلق (ELI5 👶) + AI Agents'}
                  </span>
                </div>

                <h1 className="heading-alex text-3xl md:text-5xl font-black text-white">
                  {selectedCertificate.certTitle}
                </h1>

                <div className="space-y-4 text-slate-300 text-base leading-[1.95]">
                  <p>
                    {selectedCertificate.certDescription || (
                      isLangCert
                        ? `منهج لغوي عالمي متكامل ومحبوك على طريقة (Cambridge Interchange المطورة) يأخذك بيدك من تعلم الحروف والأصوات ومخارج الفم (Pre-A1 / A0) عبر سلسلة من (${selectedCertificate.courses.length} كراش كورس) متدرجة في مواقف الحياة اليومية، حتى تصل إلى طلاقة المتحدث الأصلي (C2 Native) واجتياز الاختبارات العالمية بأعلى الدرجات.`
                        : `هذا ليس مجرد كورس عادي، بل هو معسكر تحول مهني ومادي متكامل يأخذك بيدك من الصفر المطلق عبر سلسلة مترابطة من (${selectedCertificate.courses.length} كراش كورس) متدرجة الصعوبة بأسلوب القصة والتبسيط لطفل صغير، حتى تصل إلى مستوى مهندس محترف قادر على بناء أنظمة كاملة وقيادة وكلاء الذكاء الاصطناعي.`
                    )}
                  </p>

                  {selectedCertificate.mainAnalogy && (
                    <div className="bg-indigo-950/40 border-r-4 border-indigo-400 p-4 rounded-l-2xl text-sm text-indigo-200">
                      <strong className="text-white block mb-1">
                        {isLangCert ? '🗣️ فلسفة الانغماس الصوتي ومكعبات الجمل (Cambridge × Lego Grammar):' : '🎭 القصة والتشبيه الممتد عبر جميع الكورسات (ELI5 Storyline):'}
                      </strong>
                      {selectedCertificate.mainAnalogy}
                    </div>
                  )}

                  {/* شريط مراحل الإتقان اللغوي من الحروف حتى C2 للشهادات اللغوية */}
                  {isLangCert && (
                    <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-4 space-y-2.5">
                      <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                        <Globe size={14} className="text-amber-400" /> خريطة التدرج اللغوي المحبوك في هذه الشهادة (من الحروف حتى القمة):
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {cefrStages.map((st, idx) => (
                          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-center">
                            <span className="text-xs font-black text-amber-400 block" dir="ltr">{st.code}</span>
                            <span className="text-[11px] text-slate-300 mt-0.5 block">{st.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* بطاقات الأرقام التحفيزية (Dopamine Metrics) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                  <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl">
                    <Layers className="text-indigo-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">{selectedCertificate.courses.length} كراش كورس</p>
                    <p className="text-[11px] text-slate-400">{isLangCert ? 'متدرجة من الحروف إلى C2' : 'سلسلة متصلة من الصفر للاحتراف'}</p>
                  </div>
                  <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl">
                    <Clock className="text-emerald-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">{selectedCertificate.totalHours} ساعة</p>
                    <p className="text-[11px] text-slate-400">~{selectedCertificate.estimatedMonths} أشهر (أو شهرين مكثف)</p>
                  </div>
                  <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl">
                    {isLangCert ? <Headphones className="text-amber-400 mb-1.5" size={20} /> : <GitBranch className="text-amber-400 mb-1.5" size={20} />}
                    <p className="text-xl font-black text-white">{selectedCertificate.courses.length} {isLangCert ? 'معمل صوتي' : 'مشروع حي'}</p>
                    <p className="text-[11px] text-slate-400">{isLangCert ? 'نطق IPA واستماع بـ 3 سرعات' : 'تُبنى مع AI Agent وتُرفع لـ GitHub'}</p>
                  </div>
                  <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl">
                    <Award className="text-purple-400 mb-1.5" size={20} />
                    <p className="text-xl font-black text-white">{selectedCertificate.courses.length + 1} شهادة</p>
                    <p className="text-[11px] text-slate-400">{selectedCertificate.courses.length} لكل مستوى + 1 شهادة كبرى</p>
                  </div>
                </div>
              </div>

              {/* بطاقة تكديس القيمة والاشتراك الفوري */}
              <div className="lg:col-span-4 bg-slate-950/95 border-2 border-amber-500/40 rounded-3xl p-7 space-y-5 shadow-2xl relative">
                <div className="text-center pb-4 border-b border-slate-800">
                  <span className="text-[11px] font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    💎 القيمة الفعلية للمسار الكامل: <del className="text-slate-400">${selectedCertificate.marketValueUSD}</del>
                  </span>
                  <div className="text-4xl font-black text-emerald-400 mt-3">
                    {selectedCertificate.totalPrice === 0 ? 'مجاني بالكامل!' : `$${selectedCertificate.totalPrice}`}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">وصول فوري لجميع الكورسات الـ {selectedCertificate.courses.length} مدى الحياة</p>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <p className="font-black text-white text-sm mb-2">ماذا ستمتلك عند دخولك هذه الشهادة؟</p>
                  <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> {selectedCertificate.courses.length} كراش كورس متدرج</span>
                    <span className="mono-code text-slate-500 line-through">${selectedCertificate.courses.length * 100}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-400"/> 
                      {isLangCert ? 'مشغل نطق أصلي بـ 3 سرعات + IPA 🔊' : `${selectedCertificate.courses.length} ورشة مشروع GitHub & AI`}
                    </span>
                    <span className="mono-code text-slate-500 line-through">$450</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-400"/> 
                      {isLangCert ? 'محاكي محادثة واختبار دولي مع الـ AI 🎙️' : 'مصحح أكواد ذكي + 3 تلميحات'}
                    </span>
                    <span className="mono-code text-slate-500 line-through">$250</span>
                  </div>
                  <div className="flex items-center justify-between bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30 text-amber-300 font-bold">
                    <span className="flex items-center gap-2"><Trophy size={15} className="text-amber-400"/> الشهادة المهنية الخارقة (S-Rank)</span>
                    <span className="text-emerald-400">مشمولة ✓</span>
                  </div>
                </div>

                {firstCourse && (
                  <Link
                    to={`/course/${firstCourse._id}`}
                    className="heading-alex w-full bg-gradient-to-l from-amber-500 via-yellow-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5 transition-all text-base"
                  >
                    <Rocket size={20} /> ابدأ من الكراش كورس 1 الآن
                  </Link>
                )}

                <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" /> توثيق رقمي فوري لكل شهادة تنهيها في حسابك
                </p>
              </div>

            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. قسم الآفاق الكبرى التي تفتحها لك هذه الشهادة المهنية */}
          {/* ================================================================= */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-8 md:p-10 space-y-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Compass size={16} /> {isLangCert ? 'الآفاق العالمية والأكاديمية والمهنية بعد إتقان اللغة' : 'الآفاق المهنية والمادية بعد التخرج'}
                </span>
                <h2 className="heading-alex text-2xl md:text-3xl font-black text-white">
                  {isLangCert ? 'ما هي الأبواب العالمية التي ستفتحها لك هذه الشهادة اللغوية؟' : 'ما هي الأبواب والفرص المالية التي ستفتحها لك هذه الشهادة المهنية؟'}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                {[
                  { id: 'freelance', label: isLangCert ? '🌍 التدرج من الحروف للطلاقة' : '💰 آفاق العمل الحر ($)' },
                  { id: 'career', label: isLangCert ? '🎓 الاختبارات الدولية والشركات' : '🏢 آفاق التوظيف والشركات' },
                  { id: 'saas', label: isLangCert ? '🔊 الصوتيات ومحاكي الـ AI' : '🚀 آفاق بناء منتجات SaaS' },
                  { id: 'transformation', label: '⚡ التحول (قبل vs بعد)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveHorizonTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeHorizonTab === tab.id
                        ? 'bg-emerald-500 text-slate-950 font-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* محتوى التبويب 1 */}
            {activeHorizonTab === 'freelance' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in-up">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                    {isLangCert ? <Globe size={14} /> : <DollarSign size={14} />}
                    {isLangCert ? 'تدرج طبيعي محبوك من الصفر المطلق حتى مستوى أهل اللغة' : 'عائد مالي مباشر من أول شهرين'}
                  </div>
                  <h3 className="heading-alex text-xl md:text-2xl font-bold text-white">
                    {isLangCert
                      ? 'كل كراش كورس ينقلك لمستوى حياتي وسمعي جديد تشعر بفرقه فوراً!'
                      : 'لا تنتظر التخرج النهائي لتبدأ الربح.. كل كراش كورس يمنحك خدمة قابلة للبيع!'}
                  </h3>
                  <p className="text-slate-300 text-sm leading-[1.9]">
                    {isLangCert
                      ? 'صُممت هذه السلسلة على طريقة كتب (Cambridge Interchange) مدمجة مع مبدأ فاينمان (ELI5)، بحيث يبني كل كورس على ما قبله بسلاسة تامة: تبدأ من نطق الحروف والكلمات الأولى، ثم تنتقل لحوارات الشارع والمطاعم والسفر، وصولاً إلى الطلاقة الكاملة واجتياز الاختبارات الدولية.'
                      : 'تم تصميم هذه الشهادة بحيث ينتهي كل كراش كورس بمشروع كامل ترفعه على GitHub. هذا يعني أنك بعد الكورس الثالث فقط تمتلك معرض أعمال يمكنك به التقدم لمشاريع العملاء على Upwork ومستقل.'}
                  </p>
                  <div className="space-y-2.5 pt-2">
                    {selectedCertificate.courses.slice(0, 4).map((c, i) => (
                      <div key={i} className="bg-slate-950 border border-slate-800/90 p-3.5 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white">{c.horizons.freelanceGig}</p>
                            <p className="text-[11px] text-slate-500">في: {c.shortCleanTitle}</p>
                          </div>
                        </div>
                        <span className="mono-code text-xs font-bold text-emerald-400 shrink-0" dir="ltr">
                          {c.horizons.gigPriceRange}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-gradient-to-b from-emerald-950/30 to-slate-950 border border-emerald-500/30 rounded-3xl p-7 space-y-5">
                  <TrendingUp className="text-emerald-400" size={36} />
                  <h4 className="heading-alex text-lg font-bold text-white">
                    {isLangCert ? 'القفزة في الدخل والفرص العالمية' : 'متوسط تسعير مشاريع الخريجين'}
                  </h4>
                  <div className="text-3xl font-black text-emerald-400 mono-code" dir="ltr">
                    {isLangCert ? 'A0 ➔ C2 Native' : '$800 - $3,500'}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isLangCert
                      ? 'إتقانك للغة الأجنبية بطلاقة يفتح لك باب العمل المباشر مع الشركات والعملاء الدوليين بالعملة الصعبة ويجتاز بك شروط الهجرة والمنح العالمية.'
                      : 'قيمة المشروع المتكامل الواحد الذي تستطيع بناءه وتسليمه للعميل في أسبوع واحد بفضل إتقانك لأدوات الـ AI Agents المشروحة في نهاية كل كراش كورس.'}
                  </p>
                </div>
              </div>
            )}

            {/* محتوى التبويب 2 */}
            {activeHorizonTab === 'career' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in-up">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="heading-alex text-xl md:text-2xl font-bold text-white">
                    {isLangCert ? 'الآفاق الأكاديمية والوظيفية والاختبارات التي تؤهلك لها الشهادة:' : 'المسميات الوظيفية التي تؤهلك لها هذه الشهادة المهنية:'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {jobRoles.map((role, idx) => (
                      <div key={idx} className="bg-slate-950 border border-indigo-500/30 p-4 rounded-2xl flex items-center gap-3">
                        <Briefcase size={18} className="text-indigo-400 shrink-0" />
                        <span className="font-bold text-sm text-white">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-7 space-y-4">
                  <Award className="text-amber-400" size={36} />
                  <h4 className="heading-alex text-lg font-bold text-white">
                    {isLangCert ? 'لماذا تتفوق هذه المنهجية على المعاهد التقليدية؟' : 'لماذا تقنع شهادتنا مسؤولي التوظيف (HR)؟'}
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2"><CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5"/> <span>{isLangCert ? 'دمج المهارات الخمس في كل وحدة: القواعد كالمكعبات + الصوتيات IPA + الاستماع + التحدث + الكتابة.' : 'رابط تحقق رقمي مباشر يثبت اجتيازك للبوابات الحمراء واختبارات الوحدات.'}</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5"/> <span>{isLangCert ? 'تدريب سمعي ونطقي حقيقي بـ 3 سرعات للقضاء على مشكلة عدم فهم المتحدث السريع.' : `${selectedCertificate.courses.length} مستودع كود جاهز للفحص في حسابك على GitHub.`}</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5"/> <span>{isLangCert ? 'تغطية تكتيكات الاختبارات العالمية ومعايير المصححين الرسميين.' : 'إتقان الفهم الهندسي العميق الذي يجعلك تجيب عن أي سؤال تقني بثقة.'}</span></li>
                  </ul>
                </div>
              </div>
            )}

            {/* محتوى التبويب 3 */}
            {activeHorizonTab === 'saas' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in-up">
                <div className="space-y-4">
                  <h3 className="heading-alex text-xl md:text-2xl font-bold text-white">
                    {isLangCert
                      ? 'تدرب صوتياً وكتابياً مع شريكك الذكي (AI Voice Examiner & Roleplay)'
                      : 'تحوّل من "باحث عن عمل" إلى "مؤسس منتجات رقمية (Micro-SaaS Founder)"'}
                  </h3>
                  <p className="text-slate-300 text-sm leading-[1.9]">
                    {isLangCert
                      ? 'لا مزيد من الخجل أثناء التحدث! في كل درس تحصل على نص استماع تفاعلي يمكنك تشغيله بـ 3 سرعات لتقليد نطق المتحدث الأصلي (Shadowing)، بالإضافة إلى أوامر صوتية جاهزة تجعل الذكاء الاصطناعي يحاورك صوتياً في نفس موقف الدرس ويصحح نطقك!'
                      : 'في الوحدة الأخيرة من كل كراش كورس، لا نعلمك فقط كيف تكتب الكود، بل نعطيك الأوامر الحرفية الجاهزة (Prompts) لوكلاء الذكاء الاصطناعي لتبني أنظمة كاملة بمفردك.'}
                  </p>
                </div>
                <div className="bg-slate-950 border border-amber-500/30 rounded-3xl p-6 space-y-3">
                  <p className="text-xs font-black text-amber-400">
                    {isLangCert ? '🎙️ التحديات الصوتية واللغوية التي ستنجزها عبر السلسلة:' : '🚀 مشاريع حقيقية ستكون في حوزتك:'}
                  </p>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {selectedCertificate.courses.map((c, i) => (
                      <div key={i} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-xs flex items-center gap-2.5">
                        {isLangCert ? <Mic size={14} className="text-purple-400 shrink-0" /> : <GitBranch size={14} className="text-emerald-400 shrink-0" />}
                        <span className="text-white font-semibold">{c.githubProjectTitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* محتوى التبويب 4 */}
            {activeHorizonTab === 'transformation' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                <div className="bg-red-950/15 border border-red-500/30 rounded-2xl p-6 space-y-3">
                  <span className="text-xs font-black text-red-400 bg-red-500/10 px-3 py-1 rounded-full">❌ قبل دخول الشهادة</span>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 pt-2">
                    {isLangCert ? (
                      <>
                        <li>• تحفظ قوائم كلمات وقواعد جافة ثم تنساها وتتجمد عند أول محادثة حقيقية.</li>
                        <li>• لا تفهم المتحدث الأصلي عندما يتكلم بسرعة في الأفلام أو الواقع.</li>
                        <li>• تترجم الجمل في رأسك من العربية كلمة بكلمة فيخرج نطقك بطيئاً وركيكاً.</li>
                        <li>• تخشى أقسام المحادثة والكتابة الأكاديمية في الاختبارات الدولية مثل IELTS.</li>
                      </>
                    ) : (
                      <>
                        <li>• تشتت بين عشرات الفيديوهات العشوائية دون خريطة طريق واضحة.</li>
                        <li>• خوف من كتابة الكود من الصفر أمام الشاشة السوداء.</li>
                        <li>• عدم معرفة كيفية استخدام أدوات الـ AI لبناء مشاريع حقيقية.</li>
                        <li>• سيرة ذاتية وحساب GitHub فارغ لا يقنع الشركات أو العملاء.</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-6 space-y-3">
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">✅ بعد إتمام الشهادة المهنية الخارقة</span>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 pt-2">
                    {isLangCert ? (
                      <>
                        <li>• تبني الجمل تلقائياً بسرعة البديهة بفضل معادلات (مكعبات الليغو) والقوالب الجاهزة.</li>
                        <li>• أذنك تلتقط الكلام السريع المدمج ولسانك ينطق مخارج الحروف (IPA) كأهل اللغة.</li>
                        <li>• تتحدث وتناقش وتكتب المقالات الأكاديمية والإيميلات الرسمية بثقة وطلاقة (C2).</li>
                        <li>• جاهزية تكتيكية كاملة لاكتساح الاختبارات العالمية بأعلى الدرجات.</li>
                      </>
                    ) : (
                      <>
                        <li>• فهم عميق ومبسط لكل تقنية بفضل منهجية فاينمان وتشريح الكود.</li>
                        <li>• سرعة برمجة مضاعفة 10x بقيادة وكلاء الذكاء الاصطناعي (AI Agents).</li>
                        <li>• امتلاك {selectedCertificate.courses.length} مشروعاً كاملاً مرفوعاً على حسابك في GitHub.</li>
                        <li>• حمل {selectedCertificate.courses.length} شهادة فرعية + الشهادة المهنية الكبرى الموثقة.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* 3. الخريطة التفصيلية للكراش كورسات والآفاق التي يفتحها كل كورس على حدة */}
          {/* ================================================================= */}
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-5">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-1">
                {isLangCert ? 'خريطة التدرج اللغوي والسمعي الكاملة (From Zero to C2 Native)' : 'خريطة التدرج المعماري الكاملة (Skill Tree)'}
              </span>
              <h2 className="heading-alex text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                <Layers className="text-indigo-400" /> تفصيل الكراش كورسات والآفاق التي يفتحها كل كورس ({selectedCertificate.courses.length} كورس)
              </h2>
            </div>

            <div className="space-y-5">
              {selectedCertificate.courses.map((course, idx) => {
                const isExpanded = expandedCourseIdx === idx;

                return (
                  <div 
                    key={course._id || idx} 
                    className={`bg-[#0b1120] border-2 rounded-3xl transition-all overflow-hidden shadow-xl ${
                      isExpanded ? 'border-indigo-500/60 shadow-[0_0_35px_rgba(99,102,241,0.12)]' : 'border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div 
                      onClick={() => setExpandedCourseIdx(isExpanded ? -1 : idx)}
                      className="p-6 md:p-7 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-900/40 transition-colors"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-indigo-600 text-white text-xs font-black px-3.5 py-1 rounded-full">
                            الكراش كورس {idx + 1} من {selectedCertificate.courses.length}
                          </span>
                          {course.isLanguageCourse && (
                            <span className="bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-black px-3 py-1 rounded-full">
                              {course.langProfile.flag} {course.langProfile.cefrBadge}
                            </span>
                          )}
                          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Zap size={12} /> +{course.xpReward} EXP
                          </span>
                          <span className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Clock size={12} className="text-indigo-400" /> {course.estimatedHours} ساعة
                          </span>
                        </div>

                        <h3 className="heading-alex text-xl md:text-2xl font-bold text-white">
                          {course.title}
                        </h3>

                        <p className="text-slate-300 text-sm leading-[1.85]">
                          {course.cleanDescription}
                        </p>

                        <div className="inline-flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs text-emerald-300">
                          {course.isLanguageCourse ? <Globe size={14} className="text-emerald-400 shrink-0" /> : <DollarSign size={14} className="text-emerald-400 shrink-0" />}
                          <span><strong>الأفق الفوري بعد هذا الكورس:</strong> {course.horizons.freelanceGig} (<span dir="ltr" className="text-white font-bold">{course.horizons.gigPriceRange}</span>)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Link
                          to={`/course/${course._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2 transition-all"
                        >
                          <PlayCircle size={18} /> صفحة الكورس والتفاصيل
                        </Link>
                        <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-indigo-400 border-indigo-500/40' : ''}`}>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-6 pb-7 pt-4 border-t border-slate-800/80 bg-slate-950/60 space-y-6 animate-fade-in-up">
                        
                        <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
                          <h4 className="text-xs font-black text-indigo-400 mb-1.5 flex items-center gap-1.5">
                            <BookOpen size={14} /> ماذا ستدرس وتتقن بالتفصيل في الكراش كورس رقم {idx + 1}؟
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300 leading-[1.9]">
                            {course.richExtendedDescription}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl space-y-1.5">
                            <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5">
                              {course.isLanguageCourse ? <Globe size={14} /> : <DollarSign size={14} />}
                              {course.isLanguageCourse ? '1. القدرة اللغوية المكتسبة' : '1. أفق العمل الحر بعد هذا الكورس'}
                            </span>
                            <p className="text-xs text-slate-200 leading-relaxed">{course.horizons.freelanceGig}</p>
                            <p className="mono-code text-xs font-bold text-amber-400 pt-1" dir="ltr">{course.horizons.gigPriceRange}</p>
                          </div>

                          <div className="bg-slate-900/90 border border-indigo-500/30 p-4 rounded-2xl space-y-1.5">
                            <span className="text-[11px] font-black text-indigo-400 flex items-center gap-1.5">
                              <Briefcase size={14} /> {course.isLanguageCourse ? '2. الأثر المهني والأكاديمي' : '2. الأفق الوظيفي والهندسي'}
                            </span>
                            <p className="text-xs text-slate-200 leading-relaxed">{course.horizons.careerImpact}</p>
                          </div>

                          <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl space-y-1.5">
                            <span className="text-[11px] font-black text-amber-400 flex items-center gap-1.5">
                              {course.isLanguageCourse ? <Mic size={14} /> : <GitBranch size={14} />}
                              {course.isLanguageCourse ? '3. تحدي المحادثة والصوتيات (AI Voice)' : '3. مشروع GitHub & AI Agent'}
                            </span>
                            <p className="text-xs font-bold text-white">{course.githubProjectTitle}</p>
                            <p className="text-[11px] text-slate-400 leading-relaxed">{course.githubProjectSummary}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">المهارات المكتسبة:</span>
                            {course.extractedSkills.map((sk, sIdx) => (
                              <span key={sIdx} className="bg-slate-900 border border-slate-700 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-lg" dir="ltr">
                                ✓ {sk}
                              </span>
                            ))}
                          </div>

                          <Link
                            to={`/course/${course._id}`}
                            className="text-xs font-black text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
                          >
                            عرض جميع وحدات ودروس هذا الكورس <ChevronLeft size={15} />
                          </Link>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 🚀 شريط الدوبامين والتحويل السفلي العائم */}
        {firstCourse && (
          <div className="fixed bottom-0 inset-x-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-amber-500/30 py-3.5 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-white line-clamp-1">{selectedCertificate.certTitle}</p>
                  <p className="text-[11px] text-emerald-400 font-bold">
                    {selectedCertificate.courses.length} كراش كورسات • {isLangCert ? 'صوتيات IPA واستماع 3 سرعات' : `${selectedCertificate.courses.length} مشاريع عملية`} • +{selectedCertificate.totalXP.toLocaleString()} EXP
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to={`/course/${firstCourse._id}`}
                  className="heading-alex w-full sm:w-auto bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm py-3 px-7 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all"
                >
                  <Rocket size={17} /> ابدأ الآن مجاناً من الكورس الأول
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 🏛️ الواجهة الرئيسية لكتالوج الأكاديمية (شهادات مهنية + أكاديمية اللغات + كراش كورسات)
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#020617] py-10 px-6 animate-fade-in-up text-slate-200 academy-typography" dir="rtl">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
        .academy-typography { font-family: 'Readex Pro', sans-serif; }
        .heading-alex { font-family: 'Alexandria', sans-serif; line-height: 1.5 !important; }
        .mono-code { font-family: 'JetBrains Mono', monospace; }
      `}} />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* الترويسة وشريط البحث والفلاتر */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0b1120] to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4 z-10">
            <Sparkles size={14} /> شهادات هندسية ومشاريع من الصفر 🛠️ + أكاديمية اللغات والاختبارات العالمية (A0-C2 & IELTS 🌍)
          </span>

          <h1 className="heading-alex text-3xl md:text-5xl font-black text-white mb-4 z-10">
            أكاديمية <span className="text-emerald-400" dir="ltr">Cherif.Dev</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl mb-8 z-10 leading-[1.9]">
            سواء كنت تريد <strong className="text-amber-400">احتراف هندسة البرمجيات وبناء المشاريع من الصفر</strong> أو <strong className="text-purple-400">إتقان اللغات الأجنبية من الحروف حتى طلاقة المتحدث الأصلي (C2 & IELTS)</strong>، كل مسار هنا مصمم بأسلوب التبسيط الخارق ليمنحك نتيجة عملية ملموسة.
          </p>

          {/* شريط البحث */}
          <div className="relative w-full max-w-xl z-10 mb-8">
            <Search className="absolute right-4 top-4 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن شهادة مهنية، لغة (إنجليزية، يابانية، IELTS)، أو مشروع تقني..." 
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-2xl py-4 pr-12 pl-4 focus:border-emerald-500 outline-none transition-all shadow-inner text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* أزرار التقسيم الرئيسية (مع تبويب اللغات الجديد) */}
          <div className="flex flex-wrap justify-center gap-2.5 z-10 bg-slate-950/90 p-2 rounded-2xl border border-slate-800">
            {[
              { id: 'all', label: '🌟 العرض الشامل' },
              { id: 'certificates', label: `👑 الشهادات المهنية الخارقة (${certificateGroups.length})` },
              { id: 'languages', label: '🌍 اللغات والاختبارات العالمية (A0-C2 & IELTS)' },
              { id: 'crash_courses', label: `⚡ جميع الكراش كورسات (${enrichedCourses.length})` },
              { id: 'standalone', label: '🎯 كراش كورسات مستقلة' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* 👑 القسم الأول: الشهادات المهنية الخارقة (التقنية + اللغوية) */}
            {/* ========================================================================= */}
            {(activeTab === 'all' || activeTab === 'certificates' || activeTab === 'languages') && filteredCertificates.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="heading-alex text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
                      <Trophy className="text-amber-400" size={28} /> الشهادات المهنية المعتمدة (Professional Certificates)
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      برامج متكاملة تضم سلسلة كراش كورسات متدرجة، تفتح لك آفاق التوظيف، العمل الحر، الطلاقة اللغوية، والاختبارات الدولية.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {filteredCertificates.map((cert, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-gradient-to-br ${
                        cert.isLanguageCert
                          ? 'from-purple-950/45 via-[#0b1120] to-[#0b1120] border-purple-500/45 hover:border-purple-400'
                          : 'from-indigo-950/45 via-[#0b1120] to-[#0b1120] border-amber-500/40 hover:border-amber-400'
                      } border-2 rounded-3xl p-7 md:p-9 shadow-2xl transition-all`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        <div className="lg:col-span-8 space-y-5">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full flex items-center gap-1.5">
                              <Trophy size={14} /> {cert.isLanguageCert ? `${cert.langProfile?.flag || '🌍'} شهادة لغوية دولية (S-Rank)` : 'شهادة مهنية خارقة (S-Rank)'}
                            </span>
                            <span className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
                              📚 سلسلة من {cert.courses.length} كراش كورس
                            </span>
                            <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                              ⏱️ {cert.totalHours} ساعة (~{cert.estimatedMonths} أشهر)
                            </span>
                            {cert.isLanguageCert && (
                              <span className="bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                                <Volume2 size={13} /> صوتيات IPA + استماع 3 سرعات
                              </span>
                            )}
                          </div>

                          <h3 className="heading-alex text-2xl md:text-3xl font-black text-white">
                            {cert.certTitle}
                          </h3>

                          <p className="text-slate-300 text-sm leading-[1.9]">
                            {cert.certDescription || (
                              cert.isLanguageCert
                                ? `تأخذك هذه الشهادة اللغوية في رحلة متدرجة محبوكة على طريقة Cambridge من الصفر المطلق وتعلم الحروف والأصوات (${cert.courses[0]?.shortCleanTitle}) حتى طلاقة المتحدث الأصلي واجتياز الاختبارات العالمية (${cert.courses[cert.courses.length - 1]?.shortCleanTitle}).`
                                : `تأخذك هذه الشهادة المهنية في رحلة متسلسلة من الصفر المطلق (${cert.courses[0]?.shortCleanTitle}) بأسلوب التبسيط لطفل صغير (ELI5)، وتصعد بك تدريجياً حتى الاحتراف الكامل (${cert.courses[cert.courses.length - 1]?.shortCleanTitle}).`
                            )}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <div className="bg-slate-950/80 border border-slate-800/90 p-3 rounded-2xl text-xs">
                              <span className="text-emerald-400 font-bold block mb-1">
                                {cert.isLanguageCert ? '🗣️ التدرج اللغوي:' : '💰 أفق العمل الحر:'}
                              </span>
                              <span className="text-slate-300">
                                {cert.isLanguageCert ? 'من الحروف (Pre-A1) إلى طلاقة C2 Native' : 'بناء وبيع أنظمة كاملة ($800 - $3,500)'}
                              </span>
                            </div>
                            <div className="bg-slate-950/80 border border-slate-800/90 p-3 rounded-2xl text-xs">
                              <span className="text-indigo-400 font-bold block mb-1">
                                {cert.isLanguageCert ? '🎯 الاختبارات العالمية:' : '🏢 الأفق الوظيفي:'}
                              </span>
                              <span className="text-slate-300">
                                {cert.isLanguageCert ? 'إتقان استراتيجيات IELTS / TOEFL / JLPT' : 'جاهزية كاملة لمقابلات الشركات التقنية'}
                              </span>
                            </div>
                            <div className="bg-slate-950/80 border border-slate-800/90 p-3 rounded-2xl text-xs">
                              <span className="text-amber-400 font-bold block mb-1">
                                {cert.isLanguageCert ? '🔊 المختبر الصوتي:' : '🐙 أصولك على GitHub:'}
                              </span>
                              <span className="text-slate-300">
                                {cert.isLanguageCert ? 'نطق IPA + ترديد Shadowing + محاكي AI' : `${cert.courses.length} مشروعاً موثقاً بمساعدة AI Agent`}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cert.skillsList.slice(0, 8).map((sk, sIdx) => (
                              <span key={sIdx} className="bg-slate-900 border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-lg font-medium" dir="ltr">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="lg:col-span-4 bg-slate-950/90 border border-amber-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xl">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                              <span className="text-[11px] text-slate-400 block">القيمة السوقية للمسار</span>
                              <span className="mono-code text-sm text-slate-500 line-through">${cert.marketValueUSD}</span>
                            </div>
                            <div className="text-left">
                              <span className="text-[11px] text-emerald-400 font-bold block">متاح الآن</span>
                              <span className="text-xl font-black text-white">
                                {cert.totalPrice === 0 ? 'مجاناً 100%' : `$${cert.totalPrice}`}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2.5 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span>خريطة طريق مفصلة لـ {cert.courses.length} كراش كورس</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span>{cert.courses.length} شهادة فرعية + 1 شهادة مهنية خارقة</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              <span>{cert.isLanguageCert ? 'تدريب سمعي ونطقي وقواعد بالمكعبات' : 'تفصيل الآفاق المهنية والمادية لكل كورس'}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => { setSelectedCertificate(cert); setExpandedCourseIdx(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="heading-alex w-full bg-gradient-to-l from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-4 px-5 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 text-sm"
                          >
                            <Award size={18} /> استكشف الشهادة والآفاق ({cert.courses.length} كورسات)
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* ⚡ القسم الثاني: الكراش كورسات التفاعلية (تتكيف بطاقاتها تلقائياً للغات أو البرمجة) */}
            {/* ========================================================================= */}
            {activeTab !== 'certificates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="heading-alex text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
                      <Zap className="text-emerald-400" size={28} /> 
                      {activeTab === 'languages'
                        ? 'الكراش كورسات اللغوية والصوتية (Language Crash Courses)'
                        : activeTab === 'standalone'
                          ? 'الكراش كورسات الوحيدة (المستقلة)'
                          : 'الكراش كورسات التفاعلية (Crash Courses)'}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCrashCourses.length > 0 ? (
                    filteredCrashCourses.map((course) => {
                      const parentGroup = certificateGroups.find(g => g.certTitle === course.parentCertTitle);

                      return (
                        <div 
                          key={course._id} 
                          className={`bg-[#0b1120] border ${
                            course.isLanguageCourse ? 'border-purple-500/30 hover:border-purple-400' : 'border-slate-800 hover:border-emerald-500/50'
                          } rounded-3xl overflow-hidden group hover:shadow-[0_0_35px_rgba(16,185,129,0.12)] transition-all flex flex-col`}
                        >
                          <div className="h-44 bg-slate-900 relative overflow-hidden">
                            {course.thumbnail ? (
                              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className={`w-full h-full flex flex-col items-center justify-center ${
                                course.isLanguageCourse
                                  ? 'bg-gradient-to-br from-purple-950/70 via-slate-900 to-slate-950'
                                  : 'bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-950'
                              } p-4 text-center`}>
                                {course.isLanguageCourse ? (
                                  <>
                                    <Headphones size={38} className="text-purple-400 mb-2" />
                                    <span className="text-[11px] font-bold text-purple-200">
                                      {course.langProfile.flag} Cambridge Method + 3-Speed IPA Audio 🔊
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <BookOpen size={38} className="text-emerald-400/80 mb-2" />
                                    <span className="text-[11px] font-bold text-slate-300">
                                      {course.isNoExamProject ? 'From-Scratch Build + AI Agent 🛠️' : 'ELI5 Storyline + Live Code Sandbox'}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}

                            <div className="absolute top-3.5 left-3.5 bg-slate-950/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg font-black text-xs border border-slate-700">
                              {course.price === 0 ? <span className="text-emerald-400">مجاني</span> : `$${course.price}`}
                            </div>

                            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                              {course.isPartOfCertificate && (
                                <span className="bg-indigo-600/95 text-white px-2.5 py-1 rounded-lg font-black text-[11px]">
                                  الكورس {course.courseOrder}
                                </span>
                              )}
                              <span className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-lg font-black text-[11px]">
                                +{course.xpReward} EXP
                              </span>
                            </div>
                          </div>

                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center justify-between text-xs mb-2.5">
                              <span className="text-amber-400 font-bold">
                                {course.isLanguageCourse ? `${course.langProfile.flag} ${course.langProfile.cefrBadge}` : '⭐⭐⭐⭐⭐ (5.0)'}
                              </span>
                              <span className="text-slate-400 font-bold flex items-center gap-1">
                                <Clock size={12} className="text-emerald-400"/> {course.estimatedHours} ساعة
                              </span>
                            </div>
                            
                            <h3 className="heading-alex text-lg font-bold text-white mb-2.5 line-clamp-2">
                              {course.title}
                            </h3>

                            {course.isPartOfCertificate ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (parentGroup) {
                                    setSelectedCertificate(parentGroup);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }
                                }}
                                className="w-full text-right mb-3 p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-start gap-2 transition-all"
                              >
                                <Link2 size={15} className="shrink-0 mt-0.5 text-amber-400" />
                                <span className="line-clamp-2">
                                  ضمن الشهادة: <strong className="text-white underline">{course.parentCertTitle}</strong>
                                </span>
                              </button>
                            ) : (
                              <div className="mb-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold flex items-center gap-2">
                                <Zap size={14} className="shrink-0" />
                                <span>كراش كورس وحيد ومستقل (Standalone)</span>
                              </div>
                            )}

                            <p className="text-slate-300 text-xs leading-[1.8] mb-4 line-clamp-3">
                              {course.cleanDescription}
                            </p>

                            <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-3 mb-4 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-black text-emerald-400 flex items-center gap-1">
                                  <TrendingUp size={13} /> {course.isLanguageCourse ? 'القدرة اللغوية المكتسبة:' : 'الأفق الذي يفتحه لك الكورس:'}
                                </span>
                                <span className="mono-code text-amber-300 font-bold" dir="ltr">
                                  {course.horizons.gigPriceRange}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                                {course.horizons.freelanceGig}
                              </p>
                            </div>
                            
                            <div className="mt-auto space-y-3">
                              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 text-[11px] text-slate-300 flex items-center gap-2">
                                <Award size={14} className="text-amber-400 shrink-0" />
                                <span className="truncate">يمنح: {course.subCertBadge}</span>
                              </div>
                              
                              <Link 
                                to={`/course/${course._id}`} 
                                className="heading-alex block w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-center font-black py-3 rounded-xl transition-all shadow-[0_5px_20px_rgba(16,185,129,0.25)] text-xs sm:text-sm"
                              >
                                استكشف الكورس وآفاقه الكاملة
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-20 text-slate-500">
                      <BookOpen size={48} className="mx-auto mb-4 text-slate-700" />
                      <p>لا توجد كورسات تطابق بحثك حالياً.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Academy;
```

---

## `cherif-platform\src\AdminDashboard.jsx`

```javascript
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Users, Shield, TrendingUp, Search, UserCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { AuthContext } from './AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // جلب المستخدمين عند فتح الصفحة
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('cherif_token');
      const res = await axios.get('http://127.0.0.1:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if(!window.confirm(`هل أنت متأكد من تغيير الصلاحية إلى ${newRole}؟`)) return;
    
    try {
      const token = localStorage.getItem('cherif_token');
      await axios.put(`http://127.0.0.1:5001/api/admin/users/${userId}/role`, 
        { newRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // تحديث القائمة بعد التعديل
    } catch (err) {
      alert('حدث خطأ أثناء تعديل الصلاحية.');
    }
  };

  const filteredUsers = users.filter(u => u.name.includes(searchTerm) || u.email.includes(searchTerm));

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>;

  return (
    <div className="min-h-screen py-10 px-6 animate-fade-in-up">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* الترويسة والإحصائيات */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Shield className="text-red-500" size={32} /> غرفة التحكم المركزية
            </h1>
            <p className="text-gray-400 mt-2">نظرة شاملة على مستخدمي المنصة وصلاحياتهم.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-emerald-900/30 p-3 rounded-xl"><Users className="text-emerald-500" size={24} /></div>
              <div>
                <p className="text-gray-400 text-xs font-bold">إجمالي المستخدمين</p>
                <p className="text-2xl font-black text-white">{users.length}</p>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-purple-900/30 p-3 rounded-xl"><UserCheck className="text-purple-500" size={24} /></div>
              <div>
                <p className="text-gray-400 text-xs font-bold">الأساتذة (Instructors)</p>
                <p className="text-2xl font-black text-white">{users.filter(u => u.role === 'instructor').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* جدول المستخدمين */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* شريط البحث */}
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
            <div className="relative w-full max-w-md">
              <Search className="absolute right-4 top-3.5 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو البريد..." 
                className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-emerald-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-950/80 text-gray-400 text-sm">
                <tr>
                  <th className="p-5 font-bold">المستخدم</th>
                  <th className="p-5 font-bold">البريد الإلكتروني</th>
                  <th className="p-5 font-bold">تاريخ الانضمام</th>
                  <th className="p-5 font-bold">الصلاحية الحالية</th>
                  <th className="p-5 font-bold text-center">إجراءات المدير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-5 font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center text-white font-black shadow-lg">
                        {u.name.charAt(0)}
                      </div>
                      {u.name}
                    </td>
                    <td className="p-5 text-gray-400 font-mono text-sm" dir="ltr">{u.email}</td>
                    <td className="p-5 text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString('ar-DZ')}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        u.role === 'admin' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
                        u.role === 'instructor' ? 'bg-purple-900/20 text-purple-400 border-purple-500/30' :
                        'bg-gray-800 text-gray-400 border-gray-700'
                      }`}>
                        {u.role === 'admin' ? 'مدير' : u.role === 'instructor' ? 'أستاذ' : 'طالب'}
                      </span>
                    </td>
                    <td className="p-5 flex justify-center gap-2">
                      {u.role !== 'admin' && (
                        <select 
                          className="bg-gray-950 border border-gray-700 text-white text-xs p-2 rounded-lg outline-none focus:border-emerald-500 cursor-pointer"
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          value={u.role}
                        >
                          <option value="user">تخفيض لطالب</option>
                          <option value="instructor">ترقية لأستاذ</option>
                        </select>
                      )}
                      {u.role === 'admin' && <ShieldAlert size={20} className="text-red-500" title="لا يمكن تعديل صلاحية المدير" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && <div className="p-10 text-center text-gray-500">لا يوجد مستخدمين بهذا الاسم.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

---

## `cherif-platform\src\App.css`

```css

```

---

## `cherif-platform\src\App.jsx`

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import InstructorStudio from './InstructorStudio';

// استيراد الصفحات
import Vault from './Vault';
import B2B from './B2B';
import Academy from './Academy';
import Auth from './Auth';
import AdminDashboard from './AdminDashboard';
import StudentHub from './StudentHub'; 
import CourseDetails from './CourseDetails';
import Classroom from './Classroom';
import Rankings from './Rankings'; 
import Certificate from './Certificate';
import LandingPage from './LandingPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* 
          🎯 الحقنة المعمارية الشاملة (Global Layout Override):
          هذا الكود يقوم بكسر قيود الشاشات الضيقة في جميع صفحات الموقع بضربة واحدة.
          سيحول أي حاوية مقيدة إلى حاوية سينمائية تستغل حواف الشاشة الكبيرة.
        */}
{/* 
          🎯 الحقنة المعمارية الشاملة (Fluid Edge-to-Edge Layout):
          هذا الكود يكسر جميع القيود ويجعل الموقع يستغل 100% من عرض أي شاشة في العالم.
        */}
        <style dangerouslySetInnerHTML={{__html: `
          /* تحويل جميع الحاويات الكبرى إلى حاويات مائعة (Fluid) بعرض 100% */
          .max-w-5xl, .max-w-6xl, .max-w-7xl, .max-w-\\[1536px\\] {
            max-width: 100% !important;
            width: 100% !important;
          }

          /* 
             هوامش تنفس ديناميكية أنيقة لكي لا تلتصق الكروت 
             بحافة الشاشة البلاستيكية بشكل مزعج
          */
          @media (min-width: 768px) {
            .max-w-5xl, .max-w-6xl, .max-w-7xl, .max-w-\\[1536px\\] {
              padding-left: 3rem !important;
              padding-right: 3rem !important;
            }
          }
          
          @media (min-width: 1280px) {
            .max-w-5xl, .max-w-6xl, .max-w-7xl, .max-w-\\[1536px\\] {
              padding-left: 5rem !important;
              padding-right: 5rem !important;
            }
          }

          @media (min-width: 1536px) {
            /* للشاشات العملاقة جداً (Ultrawide) نزيد الهامش قليلاً للحفاظ على الفخامة */
            .max-w-5xl, .max-w-6xl, .max-w-7xl, .max-w-\\[1536px\\] {
              padding-left: 6rem !important;
              padding-right: 6rem !important;
            }
          }

          /* حماية النصوص فقط من التمدد اللانهائي الذي يرهق عين القارئ */
          p.leading-relaxed, p.leading-\\[1\\.9\\], p.leading-\\[1\\.85\\] {
            max-width: 1000px;
          }
        `}} />

        {/* الحاوية الرئيسية للموقع: تأخذ العرض الكامل مع منع التمرير الأفقي */}
        <div className="bg-[#020617] text-slate-200 font-sans min-h-screen flex flex-col overflow-x-hidden" dir="rtl">
          
          {/* الشريط العلوي المستقل */}
          <Navbar />
          
          {/* الحاوية المتمددة للمحتوى */}
          <main className="w-full flex-1 flex flex-col">
            <Routes>
              {/* مسارات عامة */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/b2b" element={<B2B />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/course/:id/learn" element={<Classroom />} />
              
              {/* مسارات محمية بصلاحيات (RBAC) */}
              <Route path="/hub" element={
                <ProtectedRoute allowedRoles={['user', 'instructor', 'admin']}>
                  <StudentHub />
                </ProtectedRoute>
              } />

              <Route path="/instructor" element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <InstructorStudio />
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/certificate/:certId" element={<Certificate />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
```

---

## `cherif-platform\src\Auth.jsx`

```javascript
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';

// أيقونة جوجل بصيغة SVG لسرعة التحميل (بدون الحاجة لمكتبات خارجية)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.58c2.1-1.92 3.31-4.75 3.31-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.58-2.77c-.98.66-2.23 1.06-3.7 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // إذا كان تسجيل دخول، نرسل للرابط الأول، وإذا كان إنشاء حساب نرسل لرابط الخزنة
      const url = isLogin 
        ? 'http://127.0.0.1:5001/api/auth/login' 
        : 'http://127.0.0.1:5001/api/auth/vault-signup'; 
      
      const res = await axios.post(url, formData);
      
      if (res.data.success) {
        login(res.data.user, res.data.token);
        
        // التوجيه الذكي
        if (res.data.user.role === 'admin') navigate('/admin');
        else if (res.data.user.role === 'instructor') navigate('/instructor');
        else navigate('/hub');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // سنقوم ببرمجة هذا لاحقاً
    alert("سيتم تفعيل الدخول بجوجل قريباً بعد ربط المنصة بـ Google Cloud Console!");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 animate-fade-in-up">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex bg-gray-950 rounded-xl p-1 mb-8 border border-gray-800">
          <button 
            onClick={() => { setIsLogin(true); setError(''); }} 
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            تسجيل الدخول
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }} 
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            حساب جديد
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white">{isLogin ? 'مرحباً بعودتك' : 'انضم إلينا اليوم'}</h2>
          <p className="text-gray-400 text-sm mt-2">{isLogin ? 'قم بتسجيل الدخول للوصول لمكتبتك' : 'ابدأ رحلتك التعليمية والمهنية معنا'}</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-center gap-2 mb-6 text-sm font-bold">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute right-4 top-3.5 text-gray-500" size={18} />
              <input type="text" placeholder="الاسم الكامل" required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-emerald-500"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute right-4 top-3.5 text-gray-500" size={18} />
            <input type="email" placeholder="البريد الإلكتروني" required dir="ltr" className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-4 pr-12 text-left focus:outline-none focus:border-emerald-500"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          {/* الآن حقل كلمة المرور يظهر في كلتا الحالتين! */}
          <div className="relative">
            <Lock className="absolute right-4 top-3.5 text-gray-500" size={18} />
            <input type="password" placeholder="كلمة المرور" required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-emerald-500"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 mt-2 shadow-lg">
            {loading ? 'جاري التحميل...' : isLogin ? <><LogIn size={18} /> دخول</> : <><UserPlus size={18} /> إنشاء حساب</>}
          </button>
        </form>

        {/* فاصل الدخول بجوجل */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-800"></div>
          <span className="px-4 text-gray-500 text-xs font-bold">أو المتابعة باستخدام</span>
          <div className="flex-1 border-t border-gray-800"></div>
        </div>

        {/* زر جوجل */}
        <button 
          onClick={handleGoogleAuth} 
          type="button" 
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-3 shadow-md"
        >
          <GoogleIcon />
          <span>Google</span>
        </button>

      </div>
    </div>
  );
};

export default Auth;
```

---

## `cherif-platform\src\AuthContext.jsx`

```javascript
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('cherif_user');
    const token = localStorage.getItem('cherif_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('cherif_user', JSON.stringify(userData));
    localStorage.setItem('cherif_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cherif_user');
    localStorage.removeItem('cherif_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
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

## `cherif-platform\src\Certificate.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Award, CheckCircle, Printer, Share2, ShieldCheck, ArrowRight, GitBranch, Bot, Trophy, Sparkles } from 'lucide-react';

const Certificate = () => {
  const { certId } = useParams();
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5001/api/certificates/verify/${certId}`);
        if (res.data.isValid) {
          setCertData(res.data);
        }
      } catch (err) {
        console.error('خطأ في جلب الشهادة', err);
      } finally {
        setLoading(false);
      }
    };
    verifyCertificate();
  }, [certId]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div></div>;

  if (!certData) return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center text-white">
      <ShieldCheck size={64} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-black mb-2">وثيقة غير صالحة</h2>
      <p className="text-slate-400">لم يتم العثور على هذا الرقم التسلسلي في سجلات النظام.</p>
      <Link to="/" className="mt-6 text-amber-500 hover:text-amber-400 font-bold">العودة للرئيسية</Link>
    </div>
  );

  // تحديد ما إذا كانت شهادة مهنية خارقة أو شهادة كراش كورس متخصص
  const isSuperCertificate = certData.isSuperCertificate || certData.courseTitle?.includes('الشهادة المهنية') || certData.courseTitle?.includes('Professional Certificate');

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-6 flex flex-col items-center">
      
      {/* أزرار التحكم (تختفي عند الطباعة) */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 print:hidden">
        <Link to="/hub" className="text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors">
          <ArrowRight size={20} /> العودة للمكتبة
        </Link>
        <div className="flex gap-3">
          <button onClick={handleCopyLink} className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
            {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Share2 size={18} />}
            {copied ? 'تم نسخ رابط التوثيق' : 'مشاركة رابط التحقق'}
          </button>
          <button onClick={handlePrint} className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 px-6 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Printer size={18} /> طباعة / تصدير PDF
          </button>
        </div>
      </div>

      {/* الشهادة المعتمدة */}
      <div className={`w-full max-w-5xl bg-[#070b14] border-2 ${isSuperCertificate ? 'border-amber-500/60 shadow-[0_0_60px_rgba(245,158,11,0.15)]' : 'border-emerald-500/40 shadow-2xl'} p-3 rounded-3xl relative print:border-2 print:border-amber-600 print:shadow-none print:bg-white print:p-2`}>
        <div className={`border ${isSuperCertificate ? 'border-amber-500/30' : 'border-slate-800'} rounded-2xl p-10 md:p-16 text-center relative overflow-hidden print:border-gray-300 print:text-black`}>
          
          {/* إضاءات خلفية */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none print:hidden"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none print:hidden"></div>

          {/* شعار المنصة في الأعلى */}
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex flex-col items-center">
              <ShieldCheck size={44} className={`${isSuperCertificate ? 'text-amber-400' : 'text-emerald-400'} mb-1 print:text-amber-600`} />
              <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase print:text-gray-600">Verified Credential</span>
            </div>

            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs font-bold tracking-wider print:bg-gray-100 print:text-black">
                CHERIF.DEV ACADEMY
              </span>
            </div>

            <div className="flex flex-col items-center">
              {isSuperCertificate ? (
                <Trophy size={44} className="text-amber-400 mb-1 print:text-amber-600" />
              ) : (
                <Award size={44} className="text-emerald-400 mb-1 print:text-emerald-600" />
              )}
              <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase print:text-gray-600">
                {isSuperCertificate ? 'S-Rank Master' : 'Crash Course'}
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className={`${isSuperCertificate ? 'text-amber-400' : 'text-emerald-400'} font-black tracking-[0.15em] mb-4 text-sm md:text-base uppercase print:text-gray-700`}>
              {isSuperCertificate ? '👑 الشهادة المهنية الخارقة المعتمدة (Professional Certificate)' : 'شهادة إتمام كراش كورس متخصص'}
            </h3>
            
            <h1 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight print:text-black">
              {isSuperCertificate ? 'وثيقة احتراف وهندسة برمجيات شاملة' : 'وثيقة إثبات كفاءة تقنية'}
            </h1>
            
            <p className="text-slate-400 mb-3 text-base md:text-lg print:text-gray-600">تشهد أكاديمية Cherif.dev بأن المهندس والمطور:</p>
            <h2 className="text-3xl md:text-5xl font-black text-amber-400 mb-8 py-2 print:text-black">{certData.studentName}</h2>
            
            <p className="text-slate-400 mb-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed print:text-gray-600">
              قد اجتاز بنجاح كافة الدروس، التحديات البرمجية، بوابات الزعماء، واختبارات الوحدات، وأتم بناء ورفع المشاريع العملية على GitHub بمساعدة وكلاء الذكاء الاصطناعي (AI Agents) لمسار:
            </p>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-8 max-w-3xl mx-auto leading-relaxed bg-slate-900/60 border border-slate-800 py-4 px-6 rounded-2xl print:bg-gray-50 print:border-gray-300 print:text-black">
              {certData.courseTitle}
            </h3>

            {/* أوسمة التحقق العملي (GitHub + AI Agent + Code Challenges) */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold print:border-gray-400 print:text-black">
                <GitBranch size={14} /> مشروع GitHub موثق
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-bold print:border-gray-400 print:text-black">
                <Bot size={14} /> تطوير مدعوم بـ AI Agent
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold print:border-gray-400 print:text-black">
                <Sparkles size={14} /> اجتياز الاختبارات المختلطة والبوابات الحمراء
              </span>
            </div>

            {/* معلومات الإصدار والتوقيع */}
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 border-t border-slate-800/80 pt-8 print:border-gray-300">
              <div className="text-center">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-gray-500">تاريخ الإصدار الرسمي</p>
                <p className="text-white font-mono text-sm font-bold print:text-black">{new Date(certData.issueDate).toLocaleDateString('en-GB')}</p>
              </div>
              
              <div className="text-center">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-gray-500">اعتماد الأكاديمية</p>
                <p className="text-amber-400 font-black text-base print:text-black">المهندس غربي محمد الشريف</p>
              </div>
              
              <div className="text-center">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-gray-500">المُعرّف الرقمي الموثق (ID)</p>
                <p className="text-white font-mono text-sm font-bold print:text-black">{certData.certificateId}</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; color: black; }
          @page { margin: 0; size: landscape; }
        }
      `}} />
    </div>
  );
};

export default Certificate;
```

---

## `cherif-platform\src\CourseDetails.jsx`

```javascript
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlayCircle, Clock, Award, BookOpen, ArrowRight, Lock, Video, 
  Trophy, Flame, Skull, GitBranch, Bot, Code, Layers, CheckCircle2, Sparkles,
  DollarSign, Briefcase, Zap, Compass, ChevronDown, Terminal, Rocket, Target, Lightbulb,
  Globe, Headphones, Mic, Volume2, FileText, Eye, Upload, X, Square, MessageSquare, PenTool, Puzzle
} from 'lucide-react';
import { parseCourseHierarchy } from './Academy';

// تنظيف وصف الدرس أو الكورس من أي علامات ملخص مدمجة
const cleanTextFromMarkers = (rawText = '') => {
  if (!rawText) return '';
  return rawText
    .split('|||UNIT_SUMMARY:')[0]
    .split('|||UNITS_MAP:')[0]
    .trim();
};

// تنظيف تكرار "كراش كورس 1: كراش كورس 1" من العنوان
const sanitizeDuplicateCoursePrefix = (title = '') => {
  return title
    .replace(/^((?:الكراش كورس|كراش كورس|الكورس)\s*\d+)\s*:\s*(?:الكراش كورس|كراش كورس|الكورس)\s*\d+\s*[-:]?\s*/i, '$1: ')
    .trim();
};

// استخراج خريطة ملخصات جميع الوحدات المحقونة داخل course.description
const extractCourseUnitsMap = (rawCourseDescription = '') => {
  if (!rawCourseDescription || !rawCourseDescription.includes('|||UNITS_MAP:')) return {};
  try {
    const jsonPart = rawCourseDescription.split('|||UNITS_MAP:')[1].trim();
    const parsed = JSON.parse(jsonPart);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
};

// استخراج ملخص الوحدة إن كان محقوناً داخل وصف الدرس الأول
const extractLessonUnitSummary = (secLessons = []) => {
  for (const lesson of secLessons) {
    const desc = lesson?.description || '';
    if (desc.includes('|||UNIT_SUMMARY:')) {
      try {
        const jsonPart = desc.split('|||UNIT_SUMMARY:')[1].split('|||UNITS_MAP:')[0].trim();
        const parsed = JSON.parse(jsonPart);
        if (parsed && (parsed.whatYouLearn || parsed.whyItMatters)) {
          return parsed;
        }
      } catch (e) {}
    }
  }
  return null;
};

// ============================================================================
// 🎧 محلل نصوص الاستماع الصوتية (يحول codeSnippet إلى جدول جمل صوتية منظمة)
// ============================================================================
export const parseAudioShadowingScript = (rawSnippet = '') => {
  if (!rawSnippet || !rawSnippet.includes('IPA:')) return [];
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

// تصنيف نوع الدرس داخل جدول الوحدة (مفردات، حوار، ليغو، نطق، استماع، كتابة، زعيم، اختبار هجين)
const classifyLessonBadge = (lesson, isLang) => {
  const t = (lesson.title || '').toLowerCase();
  if (lesson.type === 'red_gate') {
    return { label: 'بوابة حمراء كودية', color: 'bg-red-500/20 text-red-300 border-red-500/40', icon: Flame };
  }
  if (lesson.type === 'boss_quiz') {
    return { label: isLang ? 'تحدي التثبيت السمعي واللغوي' : 'بوابة الزعيم', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: Skull };
  }
  if (lesson.type === 'unit_exam') {
    return { label: isLang ? 'اختبار شامل (لغوي + برمجي هجين)' : 'اختبار نهاية الوحدة', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: Trophy };
  }

  if (isLang) {
    if (t.includes('word power') || t.includes('المفردات') || t.includes('القوالب')) {
      return { label: '1. المفردات والقوالب (Chunks)', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: Sparkles };
    }
    if (t.includes('conversation') || t.includes('المحادثة')) {
      return { label: '2. محادثة Cambridge واقعية', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: MessageSquare };
    }
    if (t.includes('lego') || t.includes('المكعبات') || t.includes('تركيب الجملة')) {
      return { label: '3. هندسة الجملة بالمكعبات (Lego)', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Puzzle };
    }
    if (t.includes('pronunciation') || t.includes('النطق') || t.includes('ipa')) {
      return { label: '4. معمل الصوتيات و IPA', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30', icon: Volume2 };
    }
    if (t.includes('shadowing') || t.includes('الاستماع') || t.includes('الترديد')) {
      return { label: '5. مختبر الاستماع والترديد', color: 'bg-pink-500/15 text-pink-300 border-pink-500/30', icon: Headphones };
    }
    if (t.includes('reading') || t.includes('writing') || t.includes('القراءة والكتابة')) {
      return { label: '6. ورشة القراءة والكتابة', color: 'bg-teal-500/15 text-teal-300 border-teal-500/30', icon: PenTool };
    }
  }

  return { label: isLang ? 'درس لغوي وتطبيقي' : 'درس ومختبر كود', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', icon: Code };
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [course, setCourse] = useState(null);
  const [siblingCourses, setSiblingCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [openUnitIdx, setOpenUnitIdx] = useState(0); 
  const [loading, setLoading] = useState(true);

  // نافذة معاينة الدرس والاستوديو الصوتي داخل صفحة التفاصيل
  const [previewLesson, setPreviewLesson] = useState(null);
  const [speakingText, setSpeakingText] = useState('');
  const jsonFileInputRef = useRef(null);

  // دالة النطق الصوتي الفوري بـ 3 سرعات
  const speakSentence = (text, rate = 1.0) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = (text || '').replace(/🔊.*$/g, '').replace(/\|.*$/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.lang = 'en-US';
    utterance.onstart = () => setSpeakingText(`${cleanText}_${rate}`);
    utterance.onend = () => setSpeakingText('');
    utterance.onerror = () => setSpeakingText('');
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingText('');
    }
  };

  // ميزة إضافية: استيراد ملف JSON محلي لمعاينته مباشرة في صفحة التفاصيل وقاعة الدرس
  const handleLoadLocalCourseJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        localStorage.setItem('cherif_active_local_course_json', JSON.stringify(data));
        const cleanTitle = sanitizeDuplicateCoursePrefix(data.courseTitle || data.title || 'كورس محلي');
        const parsed = parseCourseHierarchy({
          _id: id || 'local_json_course',
          title: cleanTitle,
          description: data.courseDescription || data.description || '',
          difficulty: data.difficultyLevel || 'Pre-A1',
          estimatedHours: parseInt(String(data.estimatedHours || '18').match(/\d+/)?.[0] || '18', 10),
          price: 0,
          certificateMeta: {
            subCertificateBadge: data.certificateBadge,
            githubProject: data.githubProject,
            skills: data.skills,
            unitSummariesMap: data.unitSummariesMap || {}
          }
        });

        const flatLessons = [];
        let orderCounter = 1;
        (data.sections || data.blueprint || []).forEach(sec => {
          (sec.lessons || []).forEach(l => {
            flatLessons.push({
              ...l,
              _id: `local_lesson_${orderCounter}`,
              order: orderCounter++,
              section: sec.sectionName,
              isFreePreview: true
            });
          });
        });

        setCourse({
          ...parsed,
          title: cleanTitle,
          embeddedUnitsMap: data.unitSummariesMap || {}
        });
        setLessons(flatLessons);
        setIsEnrolled(true);
      } catch (err) {
        alert('❌ ملف JSON غير صالح.');
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('cherif_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [courseRes, lessonsRes, enrollRes, allCoursesRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5001/api/courses/public/${id}`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/lessons`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/check-enrollment`, { headers }).catch(() => ({ data: { isEnrolled: false } })),
          axios.get(`http://127.0.0.1:5001/api/courses/public`).catch(() => ({ data: { courses: [] } }))
        ]);
        
        if (courseRes.data.success) {
          const rawCourse = courseRes.data.course;
          const embeddedUnitsMap = extractCourseUnitsMap(rawCourse.description);
          const cleanedTitle = sanitizeDuplicateCoursePrefix(rawCourse.title);
          const parsedCurrent = parseCourseHierarchy({
            ...rawCourse,
            title: cleanedTitle,
            description: cleanTextFromMarkers(rawCourse.description)
          });

          setCourse({
            ...parsedCurrent,
            title: cleanedTitle,
            cleanDescription: cleanTextFromMarkers(parsedCurrent.cleanDescription),
            embeddedUnitsMap
          });

          if (parsedCurrent.isPartOfCertificate && allCoursesRes.data?.courses) {
            const siblings = allCoursesRes.data.courses
              .map(c => parseCourseHierarchy({ ...c, title: sanitizeDuplicateCoursePrefix(c.title), description: cleanTextFromMarkers(c.description) }))
              .filter(c => c.parentCertTitle === parsedCurrent.parentCertTitle)
              .sort((a, b) => a.courseOrder - b.courseOrder);
            setSiblingCourses(siblings);
          }
        }
        if (lessonsRes.data.success) setLessons(lessonsRes.data.lessons);
        if (enrollRes.data) setIsEnrolled(enrollRes.data.isEnrolled);
        
      } catch (err) {
        console.error('خطأ في جلب البيانات', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => stopSpeaking();
  }, [id]);

  const handleEnrollment = async () => {
    const token = localStorage.getItem('cherif_token');
    if (!token) {
      alert("يجب عليك تسجيل الدخول لتتمكن من الاشتراك وبدء جمع نقاط الـ EXP!");
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    try {
      const res = await axios.post(`http://127.0.0.1:5001/api/courses/${id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setIsEnrolled(true);
        navigate(`/course/${id}/learn`);
      }
    } catch (error) {
      alert("حدث خطأ أثناء الاشتراك.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const { groupedSections, syllabusStats, sampleAudioItems } = useMemo(() => {
    let bossGatesCount = 0;
    let unitExamsCount = 0;
    let codingLabsCount = 0;
    let extractedAudioSamples = [];

    const grouped = lessons.reduce((acc, lesson) => {
      const secName = lesson.section || 'الوحدة 1: الأساسيات';
      if (!acc[secName]) acc[secName] = [];
      acc[secName].push(lesson);

      if (lesson.type === 'red_gate' || lesson.type === 'boss_quiz') bossGatesCount++;
      else if (lesson.type === 'unit_exam') unitExamsCount++;
      else codingLabsCount++;

      if (extractedAudioSamples.length < 6 && lesson.codeSnippet && lesson.codeSnippet.includes('IPA:')) {
        const parsedAudio = parseAudioShadowingScript(lesson.codeSnippet);
        extractedAudioSamples = [...extractedAudioSamples, ...parsedAudio].slice(0, 6);
      }

      return acc;
    }, {});

    return {
      groupedSections: grouped,
      sampleAudioItems: extractedAudioSamples,
      syllabusStats: {
        unitsCount: Object.keys(grouped).length || 8,
        bossGatesCount,
        unitExamsCount,
        codingLabsCount: codingLabsCount || 24
      }
    };
  }, [lessons]);

  const nextSiblingCourse = useMemo(() => {
    if (!course || !siblingCourses.length) return null;
    const currentIndex = siblingCourses.findIndex(s => s._id === course._id);
    if (currentIndex >= 0 && currentIndex < siblingCourses.length - 1) {
      return siblingCourses[currentIndex + 1];
    }
    return null;
  }, [course, siblingCourses]);

  const getSectionSummaryData = (sectionName, secLessons, isProjectUnit, sIdx) => {
    const mapFromCourseDesc = course?.embeddedUnitsMap || {};
    if (mapFromCourseDesc[sectionName] && mapFromCourseDesc[sectionName].whatYouLearn) {
      return mapFromCourseDesc[sectionName];
    }
    const mapValues = Object.values(mapFromCourseDesc);
    if (mapValues[sIdx] && mapValues[sIdx].whatYouLearn) {
      return mapValues[sIdx];
    }

    const fromLesson = extractLessonUnitSummary(secLessons);
    if (fromLesson) return fromLesson;

    const metaMap = course?.certificateMeta?.unitSummariesMap || {};
    if (metaMap[sectionName] && metaMap[sectionName].whatYouLearn) {
      return metaMap[sectionName];
    }

    const realLessonTitles = (secLessons || [])
      .filter(l => l.type !== 'red_gate' && l.type !== 'boss_quiz' && l.type !== 'unit_exam')
      .map(l => l.title);

    return {
      unitSummary: isProjectUnit
        ? (course?.isLanguageCourse
            ? `ورشة محادثة شاملة وتطبيق صوتي وكتابي لمحاور (${course?.githubProjectTitle}) مع الـ AI Voice Partner.`
            : `ورشة تطبيقية لبناء مشروع (${course?.githubProjectTitle}) خطوة بخطوة ورفعه على GitHub.`)
        : `وحدة تعليمية وتطبيقية مركزة في (${sectionName}).`,
      whatYouLearn: realLessonTitles.length > 0
        ? `ستتعلم وتطبق في هذه الوحدة: ${realLessonTitles.slice(0, 5).join('، ')}.`
        : `إتقان المفاهيم الأساسية والعملية الخاصة بـ (${sectionName}).`,
      whyItMatters: course?.isLanguageCourse
        ? `تمنحك هذه الوحدة الطلاقة السمعية والنطقية والقدرة على تركيب الجمل بثقة في مواقف الحياة والاختبارات الدولية.`
        : `تمنحك هذه الوحدة الفهم العملي لبناء المشاريع واجتياز اختبارات المقابلات التقنية وبوابات الزعماء بثقة.`,
      keyHighlights: realLessonTitles.slice(0, 3)
    };
  };

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center bg-[#020617]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>;
  if (!course) return <div className="text-center py-20 text-white text-2xl font-bold bg-[#020617]">❌ الكورس غير موجود</div>;

  const isLang = Boolean(course.isLanguageCourse);
  const isNoExamProj = Boolean(course.isNoExamProject || (syllabusStats.bossGatesCount === 0 && syllabusStats.unitExamsCount === 0 && !isLang));

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-28 animate-fade-in-up course-details-font" dir="rtl">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
        .course-details-font { font-family: 'Readex Pro', sans-serif; }
        .heading-alex { font-family: 'Alexandria', sans-serif; line-height: 1.45 !important; }
        .mono-code { font-family: 'JetBrains Mono', monospace; }
      `}} />

      {/* ================================================================= */}
      {/* 1. القسم العلوي الملحمي */}
      {/* ================================================================= */}
      <div className={`bg-gradient-to-b ${isLang ? 'from-purple-950/45 via-slate-950 to-[#020617]' : 'from-indigo-950/35 via-slate-950 to-[#020617]'} border-b border-slate-800 relative overflow-hidden`}>
        <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-[1536px] w-full mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-20 relative z-20 flex flex-col lg:flex-row gap-16 xl:gap-24 items-start">
          
          <div className="flex-1 space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link to="/academy" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-bold text-sm">
                <ArrowRight size={16} /> العودة لكتالوج الأكاديمية
              </Link>

              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="file"
                  accept=".json"
                  ref={jsonFileInputRef}
                  onChange={handleLoadLocalCourseJSON}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => jsonFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition-all"
                  title="معاينة ملف JSON محلي مباشرة"
                >
                  <Upload size={12} /> معاينة ملف JSON
                </button>

                {isLang && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-black">
                    {course.langProfile.flag} {course.langProfile.cefrBadge}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <Zap size={13} className="text-amber-400" /> مكافأة الإتمام: +{course.xpReward} EXP
                </span>
              </div>
            </div>

            <div>
              {course.isPartOfCertificate ? (
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold">
                  <Trophy size={16} className="text-amber-400 shrink-0" />
                  <span>
                    الكراش كورس رقم ({course.courseOrder} من {siblingCourses.length || 16}) ضمن الشهادة المهنية: <strong className="text-white">{course.parentCertTitle}</strong>
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Sparkles size={15} /> {isLang ? 'كورس لغوي وصوتي وكودي تفاعلي متكامل' : 'كراش كورس وحيد ومستقل'}
                </div>
              )}
            </div>

            <h1 className="heading-alex text-4xl md:text-5xl lg:text-6xl font-black text-white pr-4 lg:pr-0">
              {course.title}
            </h1>

            <div className="space-y-4 text-slate-300 text-base md:text-[17.5px] leading-[2.0]">
              <p className="text-white/95 font-medium leading-[2.0]">
                {course.cleanDescription}
              </p>

              {/* صندوق الفلسفة التعليمية المتكيف */}
              <div className={`bg-slate-900/70 border-r-4 ${isLang ? 'border-purple-500' : 'border-emerald-500'} p-5 rounded-l-3xl text-sm text-slate-300 leading-[1.95]`}>
                {isLang ? (
                  <>
                    <strong className="text-purple-300 block mb-1.5">🗣️ لماذا صُمم هذا الكورس بنظام (Cambridge × Lego Grammar × Hybrid Code)؟</strong>
                    هذا الكورس يجمع بين <strong className="text-white">التأسيس الصوتي واللغوي من الحروف (Phonics & IPA)</strong> وبين <strong className="text-amber-400">التفكير المنطقي بالمكعبات والجداول المنظمة</strong>:
                    في كل وحدة تمر بـ 6 محطات متكاملة (المفردات والقوالب الذهبية ➔ المحادثة الواقعية ➔ معادلات الليغو للقواعد ➔ تشريح مخارج الفم والـ IPA ➔ استوديو الاستماع والترديد بـ 3 سرعات ➔ ورشة الكتابة والاختبارات الهجينة).
                  </>
                ) : isNoExamProj ? (
                  <>
                    <strong className="text-emerald-400 block mb-1.5">🏗️ لماذا صُمم هذا الكورس بنمط (البناء الصافي من الصفر - بدون اختبارات)؟</strong>
                    يركز 100% على البناء الهندسي العملي ملفاً بملف مع إعطائك الأوامر الحرفية الجاهزة لتوجيه الـ AI Agent.
                  </>
                ) : (
                  <>
                    <strong className="text-emerald-400 block mb-1.5">🧠 لماذا صُمم هذا الكراش كورس بهذه الطريقة؟</strong>
                    ستدرس كل مفهوم عبر تشبيه قصصي مبسط (مبدأ فاينمان ELI5 👶)، ثم نأخذك لتشريح الكود وتطبيقه بيدك في مختبر الكود التفاعلي.
                  </>
                )}
              </div>
            </div>

            {/* بطاقات الإحصائيات الأربع */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <Layers size={20} className="text-indigo-400 mb-1.5" />
                <p className="text-xl font-black text-white">{syllabusStats.unitsCount} وحدات</p>
                <p className="text-xs text-slate-400">{isLang ? 'دورة كامبريدج السداسية' : 'متدرجة من الصفر'}</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                {isLang ? <Volume2 size={20} className="text-purple-400 mb-1.5" /> : <Terminal size={20} className="text-emerald-400 mb-1.5" />}
                <p className="text-xl font-black text-white">{syllabusStats.codingLabsCount}+ درساً</p>
                <p className="text-xs text-slate-400">{isLang ? 'استوديو نطق IPA + مكعبات' : 'مختبر كود تفاعلي'}</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <Flame size={20} className="text-red-400 mb-1.5" />
                <p className="text-xl font-black text-white">
                  {isNoExamProj ? '0 اختبارات' : `${syllabusStats.bossGatesCount + syllabusStats.unitExamsCount || 8} اختبارات`}
                </p>
                <p className="text-xs text-slate-400">{isLang ? 'بوابات صوتية + اختبار هجين' : 'زعماء واختبارات'}</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                {isLang ? <Mic size={20} className="text-amber-400 mb-1.5" /> : <GitBranch size={20} className="text-amber-400 mb-1.5" />}
                <p className="text-xl font-black text-white">{isLang ? 'AI Coach' : '1 مشروع'}</p>
                <p className="text-xs text-slate-400">{isLang ? 'غرفة محادثة صوتية حية' : 'يُرفع على GitHub'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="bg-slate-900/90 border border-amber-500/30 p-5 rounded-2xl flex items-start gap-4">
                <Award className="text-amber-400 shrink-0 mt-0.5" size={26} />
                <div>
                  <p className="text-xs text-amber-400 font-bold">الشهادة الممنوحة بعد هذا الكورس:</p>
                  <p className="text-[15px] font-black text-white mt-1">{course.subCertBadge}</p>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-emerald-500/30 p-5 rounded-2xl flex items-start gap-4">
                {isLang ? <Headphones className="text-purple-400 shrink-0 mt-0.5" size={26} /> : <GitBranch className="text-emerald-400 shrink-0 mt-0.5" size={26} />}
                <div>
                  <p className="text-xs text-emerald-400 font-bold">
                    {isLang ? 'تحدي التخرج الصوتي والعملي:' : 'مشروع معرض الأعمال (GitHub):'}
                  </p>
                  <p className="text-[15px] font-black text-white mt-1">{course.githubProjectTitle}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* بطاقة الاشتراك الجانبية */}
          <div className="w-full lg:w-[420px] xl:w-[460px] bg-[#0b1120] border-2 border-emerald-500/40 rounded-3xl p-8 xl:p-10 shadow-[0_0_60px_rgba(16,185,129,0.12)] shrink-0 space-y-6 lg:sticky lg:top-28">
            <div className="text-center pb-5 border-b border-slate-800">
              <span className="inline-block text-xs font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-3">
                🔥 القيمة الفعلية للكورس والاستوديو الصوتي: <del className="text-slate-400">$199</del>
              </span>
              <div className="text-5xl font-black text-white">
                {course.price === 0 ? <span className="text-emerald-400">مجاني بالكامل!</span> : `$${course.price}`}
              </div>
              <p className="text-slate-400 font-medium text-[13px] mt-2">
                شامل جميع الوحدات ({Object.keys(groupedSections).length}) • وصول مدى الحياة 
              </p>
            </div>
            
            {isEnrolled ? (
              <button 
                onClick={() => navigate(`/course/${id}/learn`)} 
                className="heading-alex w-full bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-4.5 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] text-base"
              >
                <PlayCircle size={22} /> دخول قاعة الدراسة والاستوديو الصوتي
              </button>
            ) : (
              <button 
                onClick={handleEnrollment} 
                disabled={isEnrolling}
                className="heading-alex w-full bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-4.5 rounded-2xl transition-all shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:-translate-y-1 flex justify-center items-center gap-2 disabled:opacity-50 text-base"
              >
                {isEnrolling ? 'جاري التجهيز...' : (
                  <><Rocket size={22} /> اشترك الآن وابدأ جمع الـ EXP</>
                )}
              </button>
            )}

            <div className="text-right space-y-3.5 pt-3 border-t border-slate-800 text-[13px] text-slate-300">
              <p className="font-black text-white text-sm mb-3">ماذا يضمن لك اشتراكك في هذا الكورس؟</p>
              {isLang ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> معادلات مكعبات الليغو (Lego Grammar 👶)</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> جداول استماع IPA بـ 3 سرعات صوتية 🔊</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> مختبر كتابة + تحديات كودية لغوية هجينة 💻</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> برومبتات محادثة صوتية مع AI Coach 🎙️</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> شرح قصصي مبسط (ELI5 👶)</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-emerald-400"/> محرر أكواد بـ 3 تلميحات ومصحح AI</span>
                    <span className="text-emerald-400 font-bold">مشمول</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-300 font-bold -mx-2">
                <span className="flex items-center gap-2"><Trophy size={16} className="text-amber-400"/> شهادة إتمام الكورس موثقة</span>
                <span className="text-amber-400 font-bold">مشمول 🏆</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. 🎧 استوديو العينة الصوتية والجدول التفاعلي المباشر (للكورسات اللغوية) */}
      {/* ================================================================= */}
      {isLang && sampleAudioItems.length > 0 && (
        <div className="max-w-[1536px] w-full mx-auto px-6 md:px-12 lg:px-24 pt-14">
          <div className="bg-gradient-to-br from-purple-950/35 via-[#0b1120] to-[#0b1120] border-2 border-purple-500/40 rounded-3xl p-7 md:p-10 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-black text-purple-300 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
                  <Headphones size={14} /> معاينة حية من استوديو الصوتيات داخل الكورس
                </span>
                <h2 className="heading-alex text-2xl md:text-3xl font-black text-white">
                  🎧 جدول الاستماع والترديد الصوتي (Interactive IPA & Shadowing Table)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  اضغط على أي جملة لسماع نطقها بالسرعة الطبيعية (1.0x) أو سرعة الترديد (0.75x) أو سرعة تفكيك الحروف للمبتدئين (0.5x):
                </p>
              </div>
              {speakingText && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-1.5 self-start"
                >
                  <Square size={14} /> إيقاف الصوت
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-xs font-black text-slate-400">
                    <th className="p-4 w-12 text-center">#</th>
                    <th className="p-4">الجملة الإنجليزية / القالب (Target Chunk)</th>
                    <th className="p-4">الرمز الصوتي العالمي (IPA)</th>
                    <th className="p-4">المعنى العربي</th>
                    <th className="p-4 text-center">مشغل النطق التفاعلي (3 سرعات)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-sm">
                  {sampleAudioItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 text-center font-black text-purple-400 mono-code">{idx + 1}</td>
                      <td className="p-4 font-black text-white text-base" dir="ltr">{item.sentence}</td>
                      <td className="p-4 mono-code text-emerald-400 text-xs" dir="ltr">{item.ipa}</td>
                      <td className="p-4 text-slate-300 font-semibold">{item.meaning}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => speakSentence(item.sentence, 1.0)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all ${
                              speakingText === `${item.sentence}_1`
                                ? 'bg-purple-500 text-white'
                                : 'bg-purple-500/15 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            <Volume2 size={12} /> 1.0x
                          </button>
                          <button
                            type="button"
                            onClick={() => speakSentence(item.sentence, 0.75)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all ${
                              speakingText === `${item.sentence}_0.75`
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            🐢 0.75x
                          </button>
                          <button
                            type="button"
                            onClick={() => speakSentence(item.sentence, 0.5)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all ${
                              speakingText === `${item.sentence}_0.5`
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            🧒 0.5x
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. قسم المنهج الدراسي التفصيلي + جدول تنظيم الدروس والمحطات لكل وحدة */}
      {/* ================================================================= */}
      <div className="max-w-[1536px] w-full mx-auto px-6 md:px-12 lg:px-24 py-16 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-slate-800 pb-6">
          <div>
            <span className="text-sm font-black text-indigo-400 uppercase tracking-wider block mb-2">
              {isLang ? 'خريطة الوحدات الموقفية، الصوتيات، والاختبارات الهجينة (Cambridge × Lego Matrix)' : 'خريطة الدروس والبوابات ومختبرات الكود'}
            </span>
            <h2 className="heading-alex text-3xl md:text-4xl font-black text-white flex items-center gap-3">
              <BookOpen className="text-emerald-400" /> المنهج الدراسي التفصيلي ({Object.keys(groupedSections).length} وحدات)
            </h2>
          </div>
          <span className="bg-slate-900 text-emerald-400 px-5 py-2.5 rounded-xl text-sm font-black border border-slate-800 self-start">
            إجمالي {lessons.length} درساً وتحدياً • +{course.xpReward} EXP
          </span>
        </div>
        
        {Object.keys(groupedSections).length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
            <Video size={56} className="text-slate-700 mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">جاري إعداد الدروس</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSections).map(([sectionName, secLessons], sIdx) => {
              const isProjectUnit = sectionName.includes('مشروع') || sectionName.includes('GitHub') || sectionName.includes('محادثة') || sectionName.includes('مراجعة');
              const isOpen = openUnitIdx === sIdx;
              const sectionSummary = getSectionSummaryData(sectionName, secLessons, isProjectUnit, sIdx);

              return (
                <div 
                  key={sIdx} 
                  className={`border-2 rounded-3xl overflow-hidden transition-all shadow-lg ${
                    isProjectUnit 
                      ? 'bg-emerald-950/10 border-emerald-500/40' 
                      : isOpen ? 'bg-[#0b1120] border-indigo-500/40' : 'bg-[#0b1120] border-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenUnitIdx(isOpen ? -1 : sIdx)}
                    className="w-full p-6 md:p-7 bg-slate-900/70 hover:bg-slate-900 flex items-center justify-between gap-5 text-right transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isProjectUnit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {isLang ? <Headphones size={24} /> : isProjectUnit ? <Bot size={24} /> : <Layers size={22} />}
                      </div>
                      <div>
                        <h3 className="heading-alex font-bold text-lg md:text-xl text-white">
                          {sectionName}
                        </h3>
                        <p className="text-[13px] text-slate-400 mt-1">
                          {isLang
                            ? `🗣️ تضم ${secLessons.length} محطات (مفردات + حوار Cambridge + قواعد بالمكعبات + صوتيات IPA + استماع + اختبار هجين)`
                            : `تضم ${secLessons.length} دروس وتحديات عملية`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="hidden sm:inline-block text-[13px] font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/20">
                        +{secLessons.length * 50} EXP
                      </span>
                      <ChevronDown size={22} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-800 bg-slate-950/40">
                      
                      {/* بطاقة ملخص الوحدة */}
                      <div className="p-6 md:p-8 border-b border-slate-800/80">
                        <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
                          {sectionSummary.unitSummary && (
                            <div className="border-b border-slate-800/80 pb-3">
                              <span className="text-[11px] font-black text-indigo-400 flex items-center gap-1.5 mb-1">
                                <Sparkles size={13} /> ملخص الوحدة:
                              </span>
                              <p className="text-sm text-white font-semibold leading-relaxed">
                                {sectionSummary.unitSummary}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-[13px] font-black text-amber-400 flex items-center gap-2 mb-2">
                                <Target size={16} /> ماذا ستتعلم وتطبق في هذه الوحدة؟
                              </h4>
                              <p className="text-[13.5px] text-slate-200 leading-[1.85]">
                                {sectionSummary.whatYouLearn}
                              </p>
                            </div>
                            <div className="lg:border-r border-slate-800 lg:pr-6">
                              <h4 className="text-[13px] font-black text-emerald-400 flex items-center gap-2 mb-2">
                                <Lightbulb size={16} /> الفائدة العملية والمهنية من هذه الوحدة:
                              </h4>
                              <p className="text-[13.5px] text-slate-300 leading-[1.85]">
                                {sectionSummary.whyItMatters}
                              </p>
                            </div>
                          </div>

                          {sectionSummary.keyHighlights?.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                              <span className="text-[11px] font-bold text-slate-400">أبرز محاور الوحدة:</span>
                              {sectionSummary.keyHighlights.map((item, idx) => (
                                <span key={idx} className="text-[11px] bg-slate-950 border border-slate-800 text-indigo-300 px-3 py-1 rounded-lg font-medium">
                                  • {item}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 📋 جدول الدروس والمحطات المنظم داخل الوحدة */}
                      <div className="p-6 overflow-x-auto">
                        <table className="w-full text-right border-collapse bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-800">
                          <thead>
                            <tr className="bg-slate-900 border-b border-slate-800 text-xs font-black text-slate-400">
                              <th className="p-4 w-14 text-center">#</th>
                              <th className="p-4">نوع المحطة / التخصص</th>
                              <th className="p-4">عنوان الدرس والمهارة التطبيقية</th>
                              <th className="p-4 text-center">محتوى المختبر</th>
                              <th className="p-4 text-center">الإجراء</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/70 text-sm">
                            {secLessons.map((lesson, lIdx) => {
                              const badge = classifyLessonBadge(lesson, isLang);
                              const BadgeIcon = badge.icon;
                              const cleanDesc = cleanTextFromMarkers(lesson.description);
                              const hasAudio = Boolean(lesson.codeSnippet && lesson.codeSnippet.includes('IPA:'));
                              const hasExercise = Boolean(lesson.codingPractice?.taskQuestion || lesson.bossQuiz?.length);

                              return (
                                <tr key={lesson._id || lIdx} className="hover:bg-slate-900/60 transition-colors">
                                  <td className="p-4 text-center font-black text-slate-400 mono-code">
                                    {lIdx + 1}
                                  </td>
                                  <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-lg border ${badge.color}`}>
                                      <BadgeIcon size={13} /> {badge.label}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <p className="font-bold text-white text-sm md:text-base">{lesson.title}</p>
                                    {cleanDesc && <p className="text-xs text-slate-400 mt-1">{cleanDesc}</p>}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                      {hasAudio && (
                                        <span className="text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md">
                                          🔊 صوتيات IPA
                                        </span>
                                      )}
                                      {hasExercise && (
                                        <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                                          ✍️ تمرين تفاعلي
                                        </span>
                                      )}
                                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md mono-code">
                                        +50 EXP
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      {(lesson.content || lesson.codeSnippet || lesson.bossQuiz?.length) && (
                                        <button
                                          type="button"
                                          onClick={() => setPreviewLesson(lesson)}
                                          className="text-xs font-bold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                                        >
                                          <Eye size={13} /> معاينة
                                        </button>
                                      )}
                                      {isEnrolled || lesson.isFreePreview ? (
                                        <Link 
                                          to={`/course/${course._id}/learn`} 
                                          className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-all"
                                        >
                                          ابدأ الدرس
                                        </Link>
                                      ) : (
                                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                                          <Lock size={14} />
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 🔍 نافذة المعاينة السريعة للدرس والصوتيات (Lesson Quick Preview Modal) */}
      {/* ================================================================= */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b1120] border-2 border-indigo-500/40 rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div>
                <span className="text-xs font-black text-emerald-400 block mb-1">معاينة محتوى الدرس والاستوديو الصوتي</span>
                <h3 className="heading-alex text-xl font-black text-white">{previewLesson.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => { stopSpeaking(); setPreviewLesson(null); }}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
              {/* إذا كان الدرس يحتوي على جمل صوتية IPA نعرضها في جدول ناطق */}
              {previewLesson.codeSnippet && previewLesson.codeSnippet.includes('IPA:') && (
                <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-4">
                  <h4 className="text-sm font-black text-purple-300 flex items-center gap-2">
                    <Headphones size={18} /> 🎧 استوديو الاستماع والنطق (اضغط للاستماع):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parseAudioShadowingScript(previewLesson.codeSnippet).map((item, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-white text-sm" dir="ltr">{item.sentence}</p>
                          <p className="mono-code text-xs text-emerald-400 mt-0.5" dir="ltr">{item.ipa}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.meaning}</p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => speakSentence(item.sentence, 1.0)}
                            className="bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <Volume2 size={12} /> 1.0x
                          </button>
                          <button
                            type="button"
                            onClick={() => speakSentence(item.sentence, 0.65)}
                            className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[11px] font-black px-3 py-1 rounded-lg"
                          >
                            🐢 0.65x
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewLesson.content && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-300 leading-[1.95] whitespace-pre-wrap">
                  {previewLesson.content}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
              <button
                type="button"
                onClick={() => { stopSpeaking(); setPreviewLesson(null); }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                إغلاق المعاينة
              </button>
              <Link
                to={`/course/${course._id}/learn`}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-6 py-2.5 rounded-xl"
              >
                فتح الدرس كاملاً في قاعة الدراسة التفاعلية ←
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseDetails;
```

---

## `cherif-platform\src\Hub.jsx`

```javascript
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { PlayCircle, BookOpen, Trophy } from 'lucide-react';

const Hub = () => {
  const { user } = useContext(AuthContext);
  const [learningData, setLearningData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const token = localStorage.getItem('cherif_token');
        if (!token) return setLoading(false);

        const res = await axios.get('http://127.0.0.1:5001/api/user/my-learning', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setLearningData(res.data.learning);
        }
      } catch (err) {
        console.error('خطأ في جلب المكتبة', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHub();
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div></div>;

  if (!user) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950 text-white">
      <h2 className="text-2xl font-bold mb-4">يجب تسجيل الدخول للوصول إلى مكتبتك</h2>
      <Link to="/auth" className="bg-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors">الذهاب للخزنة السرية</Link>
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-6 bg-gray-950 animate-fade-in-up text-gray-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* الترويسة الفخمة */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">مرحباً بعودتك، <span className="text-emerald-500">{user.name}</span>! 🚀</h1>
            <p className="text-gray-400 text-sm md:text-base">حان الوقت لمواصلة رحلتك التعليمية. لديك {learningData.length} مسارات في مكتبتك.</p>
          </div>
          <div className="hidden md:flex w-16 h-16 bg-emerald-900/30 border border-emerald-500/30 rounded-full items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Trophy size={28} />
          </div>
        </div>

        {/* قائمة الكورسات التي يمتلكها الطالب */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-emerald-500"/> مساراتي التعليمية
          </h2>
          
          {learningData.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/50 border border-gray-800 border-dashed rounded-3xl">
              <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 mb-6">مكتبتك فارغة حالياً. اكتشف الكورسات في الأكاديمية!</p>
              <Link to="/academy" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                تصفح الأكاديمية
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningData.map((item) => (
                <div key={item.enrollmentId} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col group">
                  
                  {/* صورة الكورس */}
                  <div className="h-44 bg-gray-800 relative overflow-hidden">
                    {item.course.thumbnail && (
                      <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                    )}
                  </div>

                  {/* التفاصيل وشريط التقدم */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6 line-clamp-2">{item.course.title}</h3>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                        <span>التقدم: {item.progress}%</span>
                        <span>{item.completedCount} / {item.totalLessons} دروس</span>
                      </div>
                      
                      <div className="w-full bg-gray-950 rounded-full h-2 mb-6 border border-gray-800 overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.progress}%` }}></div>
                      </div>
                      
                      <Link to={`/course/${item.course._id}/learn`} className="w-full bg-emerald-900/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 text-center font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <PlayCircle size={18} /> 
                        {item.progress === 0 ? 'ابدأ التعلم الآن' : (item.progress === 100 ? 'راجع الكورس' : 'واصل التعلم')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hub;
```

---

## `cherif-platform\src\InstructorStudio.jsx`

```javascript
import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { 
  Video, PlusCircle, LayoutDashboard, Edit, Trash2, ListVideo, ArrowRight, 
  BarChart3, Users, DollarSign, BookOpen, CheckCircle, ChevronRight, ChevronLeft, 
  Play, Eye, FileText, Code, HelpCircle, UploadCloud, Microscope, Terminal, Lightbulb, Trophy
} from 'lucide-react';

const InstructorStudio = () => {
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalRevenue: 0 });
  const [courses, setCourses] = useState([]);
  
  // حالات معالج النشر
  const [courseStep, setCourseStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', price: 0, thumbnail: '' });

  // حالات باني المنهج
  const [managingCourse, setManagingCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  
  // حالات باني المنهج المتقدمة (Workspace)
  const [activeSection, setActiveSection] = useState('الوحدة 1: الأساسيات');
  const [editingLessonId, setEditingLessonId] = useState(null);
  
  // 🆕 تحديث الحالة لتشمل تشريح الكود وتمرين كتابة الكود بالتلميحات ونوع الدرس
  const [lessonForm, setLessonForm] = useState({ 
    title: '', description: '', content: '', videoUrl: '', order: 1, 
    type: 'video',
    isFreePreview: false, section: 'الوحدة 1: الأساسيات', 
    codeSnippet: '',
    codeExplanation: '',
    codingPractice: {
      hasPractice: false,
      taskQuestion: '',
      starterCode: '',
      hints: ['', '', ''],
      solutionCode: ''
    },
    quiz: [] 
  });

  const contentTextareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchMyCourses();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('cherif_token');
      const res = await axios.get('http://127.0.0.1:5001/api/instructor/stats', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setStats(res.data.stats);
    } catch (err) { console.error(err); }
  };

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('cherif_token');
      const res = await axios.get('http://127.0.0.1:5001/api/courses/my-courses', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setCourses(res.data.courses);
    } catch (err) { console.error(err); }
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cherif_token');
      if (editingId) {
        await axios.put(`http://127.0.0.1:5001/api/courses/${editingId}`, courseForm, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('http://127.0.0.1:5001/api/courses', courseForm, { headers: { Authorization: `Bearer ${token}` } });
      }
      resetCourseForm();
      fetchMyCourses();
      fetchStats();
      setActiveTab('courses');
    } catch (err) { alert('حدث خطأ أثناء حفظ المسار'); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المسار نهائياً من النظام؟')) return;
    try {
      const token = localStorage.getItem('cherif_token');
      await axios.delete(`http://127.0.0.1:5001/api/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchMyCourses();
      fetchStats();
    } catch (err) { alert('خطأ في الحذف'); }
  };

  const resetCourseForm = () => {
    setEditingId(null);
    setCourseForm({ title: '', description: '', price: 0, thumbnail: '' });
    setCourseStep(1);
  };

  const openCurriculumManager = async (course) => {
    setManagingCourse(course);
    setActiveTab('curriculum');
    fetchLessons(course._id);
  };

  const fetchLessons = async (courseId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5001/api/courses/${courseId}/lessons`);
      if (res.data.success) {
        setLessons(res.data.lessons);
        resetLessonForm(res.data.lessons.length + 1, activeSection);
      }
    } catch (err) { console.error('خطأ في جلب الدروس'); }
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const sec = lesson.section || 'الوحدة 1: الأساسيات';
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(lesson);
    return acc;
  }, {});

  const handleAddNewSection = () => {
    const newSectionName = prompt('أدخل اسم الوحدة الجديدة (مثال: الوحدة 2: المكونات المتقدمة):');
    if (newSectionName && newSectionName.trim() !== '') {
      setActiveSection(newSectionName);
      setLessonForm(prev => ({ ...prev, section: newSectionName }));
    }
  };

  const insertElement = (type) => {
    let snippet = '';
    if (type === 'video') document.getElementById('videoUrlInput')?.focus();
    if (type === 'article') snippet = '\n\n### 🎯 عنوان فرعي جديد\n\nاكتب الشرح المبسط هنا...\n';
    if (type === 'code') snippet = '\n\n```javascript\n// اكتب الشفرة البرمجية هنا\nconst app = "CherifPlatform";\n```\n';
    
    if (type === 'quiz') {
      setLessonForm(prev => ({
        ...prev,
        quiz: [...(prev.quiz || []), { question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
      }));
      return;
    }

    if (snippet) {
      setLessonForm(prev => ({ ...prev, content: (prev.content || '') + snippet }));
      if (contentTextareaRef.current) {
        contentTextareaRef.current.focus();
      }
    }
  };

  const handleQuizChange = (qIndex, field, value) => {
    const updatedQuiz = lessonForm.quiz.map((q, i) => {
      if (i === qIndex) {
        const finalValue = field === 'correctAnswerIndex' ? Number(value) : value;
        return { ...q, [field]: finalValue };
      }
      return q;
    });
    setLessonForm({ ...lessonForm, quiz: updatedQuiz });
  };

  const handleQuizOptionChange = (qIndex, optIndex, value) => {
    const updatedQuiz = lessonForm.quiz.map((q, i) => {
      if (i === qIndex) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    setLessonForm({ ...lessonForm, quiz: updatedQuiz });
  };

  const removeQuestion = (qIndex) => {
    const updatedQuiz = lessonForm.quiz.filter((_, i) => i !== qIndex);
    setLessonForm({ ...lessonForm, quiz: updatedQuiz });
  };

  const resetLessonForm = (nextOrder = 1, section = activeSection) => {
    setEditingLessonId(null);
    setLessonForm({ 
      title: '', description: '', content: '', videoUrl: '', order: nextOrder, 
      type: 'video',
      isFreePreview: false, section, 
      codeSnippet: '',
      codeExplanation: '',
      codingPractice: {
        hasPractice: false,
        taskQuestion: '',
        starterCode: '',
        hints: ['', '', ''],
        solutionCode: ''
      },
      quiz: [] 
    });
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cherif_token');
      if (editingLessonId) {
        await axios.put(`http://127.0.0.1:5001/api/lessons/${editingLessonId}`, lessonForm, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`http://127.0.0.1:5001/api/courses/${managingCourse._id}/lessons`, lessonForm, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchLessons(managingCourse._id);
    } catch (err) { alert('خطأ في حفظ الدرس'); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('هل تريد حذف هذا الدرس بشكل نهائي؟')) return;
    try {
      const token = localStorage.getItem('cherif_token');
      await axios.delete(`http://127.0.0.1:5001/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLessons(managingCourse._id);
    } catch (err) { alert('خطأ في حذف الدرس'); }
  };

  // ==========================================
  // 📥 استيراد الكورس أو الشهادة المهنية الكاملة من ملف JSON
  // ==========================================
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setIsImporting(true);
        const parsedData = JSON.parse(event.target.result);
        const token = localStorage.getItem('cherif_token');

        // 1. إذا كان الملف عبارة عن "شهادة مهنية كاملة" تحتوي على مصفوفة courses
        if (parsedData.isCertificateSeries && Array.isArray(parsedData.courses)) {
          let importedCount = 0;
          for (let i = 0; i < parsedData.courses.length; i++) {
            const c = parsedData.courses[i];
            if (!c.sections || c.sections.length === 0) continue;

            await axios.post('http://127.0.0.1:5001/api/courses/auto-import', {
              courseTitle: `${c.coursePrefix || `الكورس ${i + 1}`}: ${c.courseTitle}`,
              courseDescription: `${c.courseDescription || c.description} | 🏆 يمنح: ${c.certificateBadge || 'شهادة إتمام'}`,
              difficulty: c.difficultyLevel || 'كراش كورس مبسط (ELI5)',
              blueprint: c.sections
            }, { headers: { Authorization: `Bearer ${token}` } });
            importedCount++;
          }
          alert(`🎉 تم استيراد (${importedCount}) كراش كورسات من الشهادة المهنية بنجاح!`);
        } 
        // 2. إذا كان الملف عبارة عن كراش كورس واحد مقتطع من الشهادة (يحتوي على sections)
        else if (parsedData.sections && !parsedData.blueprint) {
          await axios.post('http://127.0.0.1:5001/api/courses/auto-import', {
            courseTitle: parsedData.courseTitle,
            courseDescription: parsedData.courseDescription || parsedData.description,
            difficulty: parsedData.difficultyLevel || 'كراش كورس مبسط (ELI5)',
            blueprint: parsedData.sections
          }, { headers: { Authorization: `Bearer ${token}` } });
          alert('🎉 تم استيراد الكراش كورس بنجاح!');
        }
        // 3. إذا كان كورساً قياسياً يحتوي على blueprint
        else {
          const res = await axios.post('http://127.0.0.1:5001/api/courses/auto-import', parsedData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            alert('🎉 تم تفريغ الكورس السحري في قاعدة البيانات بنجاح!');
          }
        }

        fetchMyCourses();
        fetchStats();
      } catch (err) {
        console.error(err);
        alert('❌ فشل الاستيراد. تأكد من سيرفر المنصة أو من صلاحية ملف الـ JSON.');
      } finally {
        setIsImporting(false);
        e.target.value = null;
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen py-10 px-6 animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* القائمة الجانبية */}
        {activeTab !== 'curriculum' && (
          <div className="w-full md:w-64 bg-gray-900 border border-gray-800 rounded-3xl p-6 h-fit shrink-0">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Video className="text-purple-500" /> غرفة التحكم
            </h2>
            <div className="space-y-2">
              <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                <BarChart3 size={18} /> الرادار (الإحصائيات)
              </button>
              <button onClick={() => setActiveTab('courses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'courses' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                <LayoutDashboard size={18} /> الأبراج (دوراتي)
              </button>
              <button onClick={() => { resetCourseForm(); setActiveTab('add_course'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'add_course' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                <PlusCircle size={18} /> تهيئة مسار جديد
              </button>
            </div>
          </div>
        )}

        {/* منطقة العرض الرئيسية */}
        {activeTab !== 'curriculum' && (
          <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            
            {/* 1️⃣ الإحصائيات */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-black text-white mb-6 border-b border-gray-800 pb-4">نظرة عامة على أداء كورساتك</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl flex items-center gap-4 hover:border-purple-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-purple-900/30 flex items-center justify-center text-purple-500"><DollarSign size={24}/></div>
                    <div><p className="text-gray-500 text-sm font-bold">إجمالي الأرباح</p><p className="text-2xl font-black text-white">${stats.totalRevenue}</p></div>
                  </div>
                  <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-emerald-900/30 flex items-center justify-center text-emerald-500"><Users size={24}/></div>
                    <div><p className="text-gray-500 text-sm font-bold">الطلاب المشتركين</p><p className="text-2xl font-black text-white">{stats.totalStudents}</p></div>
                  </div>
                  <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center text-blue-500"><BookOpen size={24}/></div>
                    <div><p className="text-gray-500 text-sm font-bold">المسارات المنشورة</p><p className="text-2xl font-black text-white">{stats.totalCourses}</p></div>
                  </div>
                </div>
              </div>
            )}

            {/* 2️⃣ عرض الكورسات */}
            {activeTab === 'courses' && (
              <div className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4 flex-wrap gap-4">
                  <h2 className="text-2xl font-black text-white">المسارات والشهادات المنشورة في النظام</h2>
                  
                  <div>
                    <input 
                      type="file" 
                      accept=".json" 
                      ref={fileInputRef} 
                      onChange={handleImportJSON} 
                      className="hidden" 
                    />
                    <button 
                      onClick={() => fileInputRef.current.click()} 
                      disabled={isImporting}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                      {isImporting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      ) : (
                        <UploadCloud size={18} />
                      )}
                      استيراد كورس أو شهادة مهنية (JSON)
                    </button>
                  </div>
                </div>
                {courses.length === 0 ? (
                  <div className="text-center py-20"><Video className="mx-auto text-gray-600 mb-4" size={48} /><p className="text-gray-400">لا توجد مسارات حالياً.</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                      <div key={course._id} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden flex flex-col group hover:border-purple-500/30 transition-all">
                        <div className="h-40 bg-gray-800 relative">
                          {course.thumbnail && <img src={course.thumbnail} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" alt="" />}
                          <div className="absolute top-3 left-3 bg-gray-900/80 text-white px-3 py-1 rounded-lg font-black text-sm">{course.price === 0 ? 'مجاني' : `$${course.price}`}</div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">{course.title}</h3>
                          <button onClick={() => openCurriculumManager(course)} className="w-full mt-auto mb-3 bg-purple-900/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                            <ListVideo size={18} /> باني المنهج
                          </button>
                          <div className="flex gap-2">
                            <button onClick={() => { setCourseForm(course); setEditingId(course._id); setActiveTab('add_course'); }} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                              <Edit size={14} /> تعديل
                            </button>
                            <button onClick={() => handleDeleteCourse(course._id)} className="bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3️⃣ معالج النشر الذكي */}
            {activeTab === 'add_course' && (
              <div className="animate-fade-in-up">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-2">{editingId ? 'تحديث بيانات المسار' : 'تهيئة مسار جديد في النظام'}</h2>
                  <p className="text-gray-400 text-sm">اتبع الخطوات لإعداد كورس احترافي يليق بنخبة المطورين.</p>
                </div>

                <div className="flex items-center justify-between mb-8 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 z-0 rounded-full"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-purple-600 z-0 rounded-full transition-all duration-500" style={{ width: courseStep === 1 ? '0%' : courseStep === 2 ? '50%' : '100%' }}></div>
                  {[1, 2, 3].map((step) => (
                    <div key={step} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-300 ${courseStep >= step ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-gray-900 border-2 border-gray-700 text-gray-500'}`}>
                      {courseStep > step ? <CheckCircle size={20} /> : step}
                    </div>
                  ))}
                </div>

                <form onSubmit={courseStep === 3 ? handleSubmitCourse : (e) => { e.preventDefault(); setCourseStep(courseStep + 1); }} className="space-y-6 bg-gray-950 p-8 rounded-2xl border border-gray-800">
                  {courseStep === 1 && (
                    <div className="space-y-5 animate-fade-in-up">
                      <h3 className="text-xl font-bold text-white mb-4 text-purple-400">1. هوية المسار</h3>
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">العنوان الرئيسي</label>
                        <input type="text" required placeholder="مثال: إتقان React.js المتقدم" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">الوصف الشامل</label>
                        <textarea required placeholder="ماذا سيتعلم الطالب..." className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none h-32 resize-none" value={courseForm.description} onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}></textarea>
                      </div>
                    </div>
                  )}

                  {courseStep === 2 && (
                    <div className="space-y-5 animate-fade-in-up">
                      <h3 className="text-xl font-bold text-white mb-4 text-purple-400">2. الكنوز والوسائط</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-400 mb-2">السعر ($)</label>
                          <input type="number" required min="0" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none" value={courseForm.price} onChange={(e) => setCourseForm({...courseForm, price: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-400 mb-2">رابط صورة الغلاف</label>
                          <input type="text" placeholder="https://..." className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none" value={courseForm.thumbnail} onChange={(e) => setCourseForm({...courseForm, thumbnail: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  )}

                  {courseStep === 3 && (
                    <div className="space-y-5 animate-fade-in-up text-center py-8">
                      <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/50 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                        <CheckCircle size={40} className="text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-black text-white">جاهز للنشر!</h3>
                      <p className="text-gray-400 max-w-md mx-auto">اضغط لإضافة المسار وبدء بناء المنهج والدروس.</p>
                    </div>
                  )}

                  <div className="flex justify-between pt-6 border-t border-gray-800 mt-8">
                    {courseStep > 1 ? (
                      <button type="button" onClick={() => setCourseStep(courseStep - 1)} className="flex items-center gap-2 text-gray-400 hover:text-white font-bold py-2 px-4 rounded-xl">
                        <ChevronRight size={20} /> السابق
                      </button>
                    ) : <div></div>}
                    {courseStep < 3 ? (
                      <button type="submit" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                        التالي <ChevronLeft size={20} />
                      </button>
                    ) : (
                      <button type="submit" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        {editingId ? 'حفظ التعديلات' : 'إطلاق المسار'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 4️⃣ باني المناهج البصري المتقدم (The Master Forge) */}
        {activeTab === 'curriculum' && managingCourse && (
          <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col animate-fade-in">
            
            {/* شريط التحكم العلوي */}
            <div className="h-16 bg-gray-900 border-b border-gray-800 flex justify-between items-center px-6 shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => { setActiveTab('courses'); resetLessonForm(); }} className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <ArrowRight size={20} />
                </button>
                <div>
                  <h2 className="text-lg font-black text-white leading-tight">{managingCourse.title}</h2>
                  <p className="text-xs text-emerald-500 font-bold">باني المنهج المتقدم (Workspace)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-gray-800 px-4 py-2 rounded-lg text-xs font-bold text-gray-400 flex items-center gap-2">
                  <BookOpen size={14} /> إجمالي الدروس: <span className="text-white">{lessons.length}</span>
                </div>
                <button onClick={() => alert('تمت مزامنة جميع البيانات بنجاح! 🚀')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2">
                  <CheckCircle size={16} /> حفظ التغييرات
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              
              {/* 1. العمود الأيمن: هيكل المنهج */}
              <div className="w-80 bg-gray-900/50 border-l border-gray-800 flex flex-col shrink-0 overflow-y-auto">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ListVideo size={16} className="text-purple-500" /> هيكل المسار
                  </h3>
                  <button onClick={handleAddNewSection} className="text-xs text-purple-400 hover:text-purple-300 font-bold bg-purple-900/20 px-2 py-1 rounded border border-purple-500/30 transition-colors">
                    + وحدة جديدة
                  </button>
                </div>
                
                <div className="p-4 space-y-6">
                  {Object.keys(groupedLessons).length === 0 ? (
                    <div className="text-center py-10"><p className="text-xs text-gray-500">لا توجد دروس. ابدأ بإضافة الدرس الأول.</p></div>
                  ) : (
                    Object.entries(groupedLessons).map(([sectionName, sectionLessons]) => (
                      <div key={sectionName} className="space-y-2">
                        <div onClick={() => { setActiveSection(sectionName); setLessonForm(prev => ({...prev, section: sectionName})); }} className={`flex items-center gap-2 font-bold text-sm p-2 rounded-lg border cursor-pointer transition-colors ${activeSection === sectionName ? 'bg-purple-900/20 border-purple-500/50 text-purple-400' : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800'}`}>
                          <ChevronLeft size={16} className={activeSection === sectionName ? '-rotate-90 transition-transform' : ''} /> {sectionName}
                        </div>
                        
                        {sectionLessons.map((lesson) => (
                          <div key={lesson._id} className={`mr-4 border p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors group ${editingLessonId === lesson._id ? 'bg-gray-800 border-purple-500' : 'bg-gray-950 border-gray-800 hover:border-purple-500/30'}`}>
                            <div className="flex items-center gap-3 overflow-hidden flex-1" onClick={() => { 
                                setEditingLessonId(lesson._id); 
                                setLessonForm({ 
                                  ...lesson, 
                                  codeExplanation: lesson.codeExplanation || '',
                                  codingPractice: lesson.codingPractice || { hasPractice: false, taskQuestion: '', starterCode: '', hints: ['', '', ''], solutionCode: '' },
                                  quiz: lesson.bossQuiz?.length > 0 ? lesson.bossQuiz : (lesson.quiz || [])
                                }); 
                                setActiveSection(lesson.section || sectionName); 
                              }}>
                              <span className="text-gray-500 font-black text-xs">{lesson.order}</span>
                              <span className="text-sm font-bold text-white truncate">{lesson.title}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson._id); }} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                  <button onClick={() => resetLessonForm(lessons.length + 1)} className="w-full mt-4 py-2 bg-gray-900 border border-gray-800 border-dashed rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center gap-2">
                    <PlusCircle size={14} /> درس جديد في ({activeSection})
                  </button>
                </div>
              </div>

              {/* 2. العمود الأوسط: محرر العناصر الشامل */}
              <div className="flex-1 bg-[#0a0f16] flex flex-col overflow-y-auto">
                <div className="max-w-3xl w-full mx-auto p-8 space-y-8">
                  
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <h3 className="text-2xl font-black text-white">{editingLessonId ? 'تحرير الدرس المفتوح' : 'تهيئة درس جديد'}</h3>
                    <div className="flex items-center gap-3">
                      <select 
                        value={lessonForm.type || 'video'} 
                        onChange={(e) => setLessonForm({...lessonForm, type: e.target.value})}
                        className="bg-gray-900 border border-gray-700 text-xs font-bold text-white rounded-lg px-3 py-2 outline-none"
                      >
                        <option value="video">📘 درس عادي (Video / Article)</option>
                        <option value="boss_quiz">🐉 بوابة زعيم (Boss Dungeon)</option>
                        <option value="red_gate">🔴 بوابة حمراء (Red Gate)</option>
                        <option value="unit_exam">🏆 اختبار نهاية الوحدة (Unit Exam)</option>
                      </select>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-400 bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-500/30">
                        <input type="checkbox" className="accent-emerald-500 rounded" checked={lessonForm.isFreePreview} onChange={(e) => setLessonForm({...lessonForm, isFreePreview: e.target.checked})} /> 
                        معاينة مجانية
                      </label>
                    </div>
                  </div>

                  <form onSubmit={handleSaveLesson} className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-400 mb-2">عنوان الدرس</label>
                        <input type="text" required placeholder="مثال: كيف تعمل الـ State في React؟" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-4 px-4 text-lg font-bold focus:border-purple-500 outline-none" value={lessonForm.title} onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})} />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-bold text-gray-400 mb-2">الترتيب</label>
                        <input type="number" required min="1" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-4 px-4 text-lg font-bold focus:border-purple-500 outline-none text-center" value={lessonForm.order} onChange={(e) => setLessonForm({...lessonForm, order: Number(e.target.value)})} />
                      </div>
                    </div>

                    {/* شريط أدوات إضافة العناصر */}
                    <div className="bg-gray-900 border border-gray-800 p-2 rounded-xl flex flex-wrap gap-2">
                      <button type="button" onClick={() => insertElement('video')} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-lg transition-colors">
                        <Video size={16} className="text-blue-400" /> إضافة فيديو
                      </button>
                      <button type="button" onClick={() => insertElement('article')} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-lg transition-colors">
                        <FileText size={16} className="text-emerald-400" /> مقال / شرح
                      </button>
                      <button type="button" onClick={() => insertElement('code')} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-lg transition-colors">
                        <Code size={16} className="text-yellow-400" /> كود برمجي
                      </button>
                      <button type="button" onClick={() => insertElement('quiz')} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:bg-purple-900/50 hover:text-purple-300 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-purple-500/50">
                        <HelpCircle size={16} className="text-purple-400" /> إضافة سؤال (Quiz)
                      </button>
                    </div>

                    {/* 📝 حقل الشرح النظري والمقال (Markdown Content) */}
                    <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
                      <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                        <FileText size={18} className="text-emerald-500" /> الشرح النظري والمحتوى التفصيلي (Markdown)
                      </label>
                      <textarea 
                        ref={contentTextareaRef}
                        placeholder="اكتب شرح الدرس بصيغة Markdown هنا..." 
                        className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 text-sm h-56 font-mono focus:border-emerald-500 outline-none resize-y leading-relaxed" 
                        value={lessonForm.content || ""} 
                        onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})} 
                      ></textarea>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
                      <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                        <Video size={18} className="text-blue-500" /> مصدر الفيديو (اختياري)
                      </label>
                      <input id="videoUrlInput" type="text" placeholder="رابط YouTube أو MP4..." className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 text-sm focus:border-blue-500 outline-none font-mono" value={lessonForm.videoUrl || ""} onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})} />
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                          <Code size={18} className="text-yellow-500" /> الكود البرمجي المرفق (Code Snippet)
                        </label>
                        <textarea 
                          placeholder="اكتب الأكواد البرمجية هنا..." 
                          className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 text-sm h-32 font-mono focus:border-yellow-500 outline-none resize-none leading-relaxed" 
                          value={lessonForm.codeSnippet || ""} 
                          onChange={(e) => setLessonForm({...lessonForm, codeSnippet: e.target.value})} 
                        ></textarea>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-indigo-400 mb-3">
                          <Microscope size={18} /> تشريح الكود (Code Anatomy)
                        </label>
                        <textarea 
                          placeholder="شرح الكود سطراً بسطر..." 
                          className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 text-sm h-28 font-mono focus:border-indigo-500 outline-none resize-none leading-relaxed" 
                          value={lessonForm.codeExplanation || ""} 
                          onChange={(e) => setLessonForm({...lessonForm, codeExplanation: e.target.value})} 
                        ></textarea>
                      </div>
                    </div>

                    {/* 🆕 إعدادات تمرين كتابة الكود التفاعلي مع التلميحات الثلاثة */}
                    <div className="bg-indigo-950/15 border border-indigo-500/30 p-5 rounded-2xl space-y-4">
                      <label className="flex items-center gap-2 text-sm font-black text-indigo-400">
                        <Terminal size={18} /> تمرين كتابة الكود للطالب (مع زر التلميحات)
                      </label>
                      <input 
                        type="text" 
                        placeholder="المطلوب من الطالب كتابته (مثال: اكتب دالة تطبع مجموع رقمين)..." 
                        className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-2.5 px-4 text-sm outline-none"
                        value={lessonForm.codingPractice?.taskQuestion || ''}
                        onChange={(e) => setLessonForm({
                          ...lessonForm, 
                          codingPractice: { ...(lessonForm.codingPractice || {}), hasPractice: true, taskQuestion: e.target.value }
                        })}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <textarea 
                          placeholder="كود البداية (Starter Code)..." 
                          className="bg-gray-950 border border-gray-800 text-emerald-300 rounded-xl p-3 text-xs font-mono h-24 outline-none"
                          dir="ltr"
                          value={lessonForm.codingPractice?.starterCode || ''}
                          onChange={(e) => setLessonForm({
                            ...lessonForm, 
                            codingPractice: { ...(lessonForm.codingPractice || {}), starterCode: e.target.value }
                          })}
                        />
                        <textarea 
                          placeholder="الحل النموذجي (Solution Code)..." 
                          className="bg-gray-950 border border-gray-800 text-amber-300 rounded-xl p-3 text-xs font-mono h-24 outline-none"
                          dir="ltr"
                          value={lessonForm.codingPractice?.solutionCode || ''}
                          onChange={(e) => setLessonForm({
                            ...lessonForm, 
                            codingPractice: { ...(lessonForm.codingPractice || {}), solutionCode: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    {/* باني الاختبارات (Quiz Builder UI) */}
                    {lessonForm.quiz && lessonForm.quiz.length > 0 && (
                      <div className="bg-purple-900/10 border border-purple-500/30 p-6 rounded-2xl space-y-6">
                        <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                          <h4 className="text-purple-400 font-black text-lg flex items-center gap-2"><HelpCircle size={20}/> مهام التقييم (الأسئلة)</h4>
                        </div>
                        
                        {lessonForm.quiz.map((q, qIndex) => (
                          <div key={qIndex} className="bg-gray-950 border border-gray-800 p-5 rounded-xl relative group">
                            <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-4 left-4 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                            
                            <label className="block text-xs font-bold text-gray-400 mb-2">السؤال {qIndex + 1}</label>
                            <input type="text" required placeholder="ما هو الـ State في React؟" className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-2.5 px-4 text-sm focus:border-purple-500 outline-none mb-4" value={q.question} onChange={(e) => handleQuizChange(qIndex, 'question', e.target.value)} />
                            
                            <label className="block text-xs font-bold text-gray-400 mb-2">الخيارات (اختر الإجابة الصحيحة بالدائرة)</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt, optIndex) => (
                                <div key={optIndex} className={`flex items-center gap-3 p-2 rounded-lg border ${q.correctAnswerIndex === optIndex ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-800 bg-gray-900'}`}>
                                  <input type="radio" required name={`correct-${qIndex}`} checked={q.correctAnswerIndex === optIndex} onChange={() => handleQuizChange(qIndex, 'correctAnswerIndex', optIndex)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                                  <input type="text" required placeholder={`الخيار ${optIndex + 1}`} className="w-full bg-transparent text-white text-sm outline-none" value={opt} onChange={(e) => handleQuizOptionChange(qIndex, optIndex, e.target.value)} />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => insertElement('quiz')} className="w-full py-3 bg-purple-900/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white font-bold rounded-xl transition-colors text-sm">
                          + إضافة سؤال آخر
                        </button>
                      </div>
                    )}

                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                      {editingLessonId ? 'تحديث بيانات الدرس' : 'إضافة الدرس للمسار'}
                    </button>
                  </form>
                </div>
              </div>

              {/* 3. العمود الأيسر: المعاينة الحية (Live Student Preview) */}
              <div className="w-[450px] bg-[#0b1120] border-r border-gray-800 shrink-0 hidden xl:flex flex-col relative overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center sticky top-0 z-10">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye size={16} className="text-blue-500" /> معاينة شاشة الطالب
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-500/30 uppercase tracking-widest font-bold">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Live
                  </span>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  
                  <div className="w-full aspect-video bg-gray-900 rounded-xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden mb-6 group">
                    {lessonForm.videoUrl ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                        <Play size={48} className="text-white/50 z-20" />
                        <p className="absolute bottom-3 left-3 text-xs font-mono text-gray-400 z-20 truncate w-11/12">{lessonForm.videoUrl}</p>
                      </>
                    ) : (
                      <div className="text-gray-600 flex flex-col items-center gap-2">
                        <Video size={32} />
                        <span className="text-xs font-bold">درس تفاعلي مقروء / كودي</span>
                      </div>
                    )}
                  </div>

                  <h1 className="text-2xl font-black text-white mb-6 leading-tight">
                    {lessonForm.title || 'عنوان الدرس سيظهر هنا...'}
                  </h1>

                  <div className="prose prose-invert prose-sm max-w-none mb-8">
                    {lessonForm.content ? (
                      <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {lessonForm.content}
                      </div>
                    ) : (
                      <div className="space-y-3 opacity-20">
                        <div className="h-3 bg-gray-500 rounded w-full"></div>
                        <div className="h-3 bg-gray-500 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-500 rounded w-4/6"></div>
                      </div>
                    )}
                  </div>

                  {lessonForm.codingPractice?.taskQuestion && (
                    <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 mb-6">
                      <h4 className="text-xs font-black text-indigo-400 mb-2 flex items-center gap-1.5">
                        <Terminal size={14}/> تمرين كتابة الكود للطالب
                      </h4>
                      <p className="text-xs text-white">{lessonForm.codingPractice.taskQuestion}</p>
                    </div>
                  )}
                  
                  {lessonForm.quiz && lessonForm.quiz.length > 0 && (
                    <div className="border-t border-purple-900/50 pt-6 mt-6">
                      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="text-purple-500" size={20}/> اختبار المهارات
                      </h3>
                      
                      {lessonForm.quiz.map((q, i) => (
                        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
                          <p className="text-white font-bold mb-4 text-sm leading-relaxed">{q.question || 'نص السؤال سيظهر هنا...'}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className={`p-3 rounded-lg border ${q.correctAnswerIndex === oIdx ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' : 'bg-gray-950 border-gray-800 text-gray-400'} text-xs font-bold flex items-center gap-3 transition-colors`}>
                                <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${q.correctAnswerIndex === oIdx ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'border-gray-600'}`}></div>
                                {opt || `الخيار ${oIdx + 1}`}
                                {q.correctAnswerIndex === oIdx && <span className="mr-auto text-[10px] bg-emerald-900/50 px-2 py-0.5 rounded text-emerald-300">الإجابة الصحيحة</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 border-t border-gray-800 pt-6">
                    <div className="w-full bg-emerald-900/20 border border-emerald-500/30 text-emerald-500/50 py-3 rounded-xl font-bold flex justify-center items-center gap-2 text-sm cursor-not-allowed">
                      <CheckCircle size={16}/> لقد أنهيت هذا الدرس (محاكاة)
                    </div>
                  </div>
                  
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorStudio;
```

---

## `cherif-platform\src\LandingPage.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Sparkles, Flame, Trophy, Award, Code, Terminal, 
  Play, Lightbulb, Bot, GitBranch, Zap, BookOpen, 
  Rocket, ChevronLeft, DollarSign, TrendingUp, Briefcase, 
  CheckCircle2, ArrowUpRight, ShieldCheck, Layers
} from 'lucide-react';

const LandingPage = () => {
  // ==========================================
  // 🌐 1. حالات الكورسات والشهادات
  // ==========================================
  const [courses, setCourses] = useState([]);
  const [activeCatalogFilter, setActiveCatalogFilter] = useState('all');

  // ==========================================
  // ⚡ 2. محرك الدوبامين والعائد المادي في الشاشة الأولى (Hero Dopamine Engine)
  // ==========================================
  const [selectedGoal, setSelectedGoal] = useState('saas'); // 'saas' | 'freelance' | 'job'
  const [hunterExp, setHunterExp] = useState(450);
  const [expBoostAnim, setExpBoostAnim] = useState(false);
  const [liveTickerIndex, setLiveTickerIndex] = useState(0);

  const liveAchievements = [
    "🔥 المطور أمين أتم بناء مشروع SaaS في الكورس 9 ورفعه على GitHub",
    "💰 الطالبة سارة اجتازت البوابة الحمراء (S-Rank) وحصلت على شهادة Node.js",
    "⚡ المطور ريان استخدم برومبتات الـ AI Agent لإنجاز مشروع التخرج في 3 ساعات",
    "🏆 المطور كريم جمع 12 شهادة كراش كورس وفتح الشهادة المهنية الخارقة"
  ];

  // بيانات العائد المادي لكل مسار يختاره الزائر في الشاشة الأولى
  const financialGoals = {
    saas: {
      badge: 'بناء منتجات رقمية (Micro-SaaS)',
      rank: 'S-RANK FOUNDER',
      incomeRange: '$1,500 - $5,000 / شهرياً',
      speedMultiplier: '10x أسرع بمساعدة AI Agent',
      deliverable: 'بناء وإطلاق 3 تطبيقات ويب كاملة قابلة للبيع والاشتراك الشهري',
      highlightColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40'
    },
    freelance: {
      badge: 'العمل الحر واقتناص العملاء (Freelancing)',
      rank: 'S-RANK HUNTER',
      incomeRange: '$800 - $2,500 / للمشروع',
      speedMultiplier: 'تسليم المشاريع في أيام بدل أشهر',
      deliverable: 'معرض أعمال (GitHub Portfolio) يضم +12 مشروعاً حقيقياً يقنع أي عميل فوراً',
      highlightColor: 'text-amber-400',
      borderColor: 'border-amber-500/40'
    },
    job: {
      badge: 'التوظيف في الشركات التقنية (Tech Career)',
      rank: 'S-RANK ENGINEER',
      incomeRange: 'رواتب الفئة العليا للمطورين',
      speedMultiplier: 'جاهزية تقنية كاملة في 4 أشهر',
      deliverable: 'شهادة مهنية موثقة + إتقان الخوارزميات واجتياز اختبارات البوابات الحمراء',
      highlightColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/40'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTickerIndex((prev) => (prev + 1) % liveAchievements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleDopamineBoost = () => {
    setHunterExp((prev) => (prev >= 1000 ? 500 : prev + 150));
    setExpBoostAnim(true);
    setTimeout(() => setExpBoostAnim(false), 600);
  };

  // ==========================================
  // 🎮 3. حالات المحاكي التفاعلي الحي (Interactive Demo)
  // ==========================================
  const [demoTab, setDemoTab] = useState('sandbox');
  const [demoCode, setDemoCode] = useState(
    `// 🎯 التحدي: احسب العائد المالي للمطور بعد أتمتة المشروع بالـ AI\nfunction calculateProfit( projectsCompleted ) {\n  return projectsCompleted * 500;\n}`
  );
  const [demoHintLevel, setDemoHintLevel] = useState(0);
  const [demoAiFeedback, setDemoAiFeedback] = useState(null);
  const [demoGateSelected, setDemoGateSelected] = useState(null);

  const demoHints = [
    "💡 التلميح 1 (الفكرة كأنك طفل 👶): كل مشروع تنجزه بمساعدة الـ AI Agent يوفر لك 500 دولار، نريد فقط ضرب عدد المشاريع في 500!",
    "🛠️ التلميح 2 (الأداة البرمجية): استخدم الكلمة المفتاحية return لإرجاع ناتج عملية الضرب (*).",
    "🔓 التلميح 3 (الاقتراب من الحل): return projectsCompleted * 500;"
  ];

  const fallbackCourses = [
    {
      _id: 'demo-cert-1',
      title: 'الشهادة المهنية الشاملة: مطور Full-Stack السحابي ووكلاء الذكاء الاصطناعي',
      description: 'سلسلة متكاملة من 12 كراش كورس مترابط بأسلوب التبسيط المطلق (ELI5) من الصفر وحتى بناء أنظمة MERN ودمج AI Agents ورفعها على السحابة وGitHub.',
      price: 0,
      isCertificate: true,
      coursesCount: '12 كراش كورس',
      roiText: 'تؤهلك لبناء منتجات SaaS واستلام مشاريع عمل حر كاملة',
      skills: ['HTML/CSS/JS', 'React.js', 'Node & Express', 'MongoDB', 'AI Agents', 'Docker & GitHub']
    },
    {
      _id: 'demo-cert-2',
      title: 'الشهادة المهنية في هندسة الذكاء الاصطناعي وبناء الأنظمة المؤتمتة بـ Python',
      description: 'رحلة متدرجة من أول سطر كود في بايثون إلى بناء وكلاء أذكياء، تحليل البيانات، وربط النماذج اللغوية الضخمة بمشاريع حقيقية تدر دخلاً.',
      price: 0,
      isCertificate: true,
      coursesCount: '10 كراش كورسات',
      roiText: 'تؤهلك لبيع خدمات أتمتة الشركات وبناء بوتات ذكية',
      skills: ['Python', 'Data Structures', 'Automation', 'LLM APIs', 'FastAPI', 'GitHub Portfolio']
    },
    {
      _id: 'demo-crash-1',
      title: 'كراش كورس 1: كيف يعمل الويب وبناء أول موقع تفاعلي (بأسلوب الليجو 👶)',
      description: 'مدخلك التأسيسي الممتع لعالم هندسة البرمجيات بدون تعقيد، مع بوابات زعماء ومشروع تطبيقي كامل ترفعه على حسابك في GitHub.',
      price: 0,
      isCertificate: false,
      coursesCount: '9 وحدات مفصلة',
      roiText: 'تبني فيه أول موقع حي في معرض أعمالك خلال أسبوع',
      skills: ['Web Architecture', 'HTML5', 'Modern CSS', 'Git Basics']
    }
  ];

  useEffect(() => {
    const fetchPublicCourses = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5001/api/courses/public');
        if (res.data?.success && res.data.courses?.length > 0) {
          setCourses(res.data.courses);
        } else {
          setCourses(fallbackCourses);
        }
      } catch (err) {
        setCourses(fallbackCourses);
      }
    };
    fetchPublicCourses();
  }, []);

  const handleTestDemoCode = () => {
    const clean = demoCode.replace(/\s+/g, '');
    if (clean.includes('*500') || clean.includes('return')) {
      setHunterExp((prev) => Math.min(prev + 100, 1000));
      setDemoAiFeedback({
        success: true,
        text: '🎉 كود مثالي! لقد ربحت +100 EXP في عداد الصياد الخاص بك في أعلى الصفحة!'
      });
    } else {
      setDemoAiFeedback({
        success: false,
        text: '💡 اقتربت جداً! اضغط على زر التلميح الأصفر لترى كيف نكتبها خطوة بخطوة.'
      });
    }
  };

  const displayedCourses = courses.filter(c => {
    if (activeCatalogFilter === 'certs') return c.isCertificate || c.title?.includes('شهادة') || c.title?.includes('الشهادة');
    if (activeCatalogFilter === 'crash') return !c.isCertificate && !c.title?.includes('الشهادة');
    return true;
  });

  const activeGoalData = financialGoals[selectedGoal];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 comfort-body-font overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950" dir="rtl">
      
      {/* 🎨 نظام الخطوط المريحة للعين والمضادة لتداخل السطور */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap');
        
        .comfort-body-font { 
          font-family: 'Readex Pro', 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          line-height: 1.85;
        }
        
        .title-font { 
          font-family: 'Alexandria', 'Plus Jakarta Sans', sans-serif; 
          line-height: 1.6 !important;
        }
        
        .mono-font { 
          font-family: 'JetBrains Mono', monospace; 
        }

        .bg-grid-pattern {
          background-size: 48px 48px;
          background-image: 
            linear-gradient(to right, rgba(30, 41, 59, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 41, 59, 0.2) 1px, transparent 1px);
        }
      `}} />

      {/* ======================================================= */}
      {/* 🥊 1. منطقة البطل (DOPAMINE & FINANCIAL ROI HERO) */}
      {/* ======================================================= */}
      <section className="relative py-14 md:py-20 bg-grid-pattern overflow-hidden border-b border-slate-900">
        {/* إضاءات نيون مدروسة لتحفيز العين بدون إزعاج */}
        <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* ================= العمود الأيمن: الوعد القوي والعائد المادي ================= */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              {/* 🔔 شريط الدوبامين الحي (Live Achievement Ticker) */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/95 border border-emerald-500/30 text-xs font-medium text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.12)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                <span className="truncate max-w-xs sm:max-w-md transition-all duration-500">
                  {liveAchievements[liveTickerIndex]}
                </span>
              </div>

              {/* العنوان الرئيسي: سطران واضحان بدون أي تداخل + ضرب الوتر المالي والمهاري */}
              <h1 className="title-font text-2xl sm:text-4xl lg:text-[38px] font-extrabold text-white space-y-2">
                <span className="block leading-[1.6]">
                  تعلّم البرمجة كأنها لعبة، ابنِ مشاريعك مع الـ AI،
                </span>
                <span className="block leading-[1.6] text-transparent bg-clip-text bg-gradient-to-l from-amber-300 via-emerald-400 to-teal-300">
                  وحوّل مهاراتك إلى دخل حقيقي وشهادات مهنية!
                </span>
              </h1>

              {/* الفقرة التوضيحية: تربط بين سهولة التعلم (ELI5) والعائد المادي */}
              <p className="text-slate-300/90 text-sm sm:text-base leading-[1.95] max-w-2xl font-normal">
                لماذا تضيع شهوراً في شروحات نظرية مملة؟ هنا تبدأ من الصفر المطلق بأسلوب <span className="text-white font-medium">التبسيط لطفل صغير (ELI5)</span>، وتكسر بوابات الزعماء، وتستخدم <span className="text-emerald-400 font-medium">وكلاء الذكاء الاصطناعي (AI Agents)</span> لبناء ورفع +12 مشروعاً حقيقياً على <span className="text-amber-400 font-medium" dir="ltr">GitHub</span> تجذب بها العملاء والشركات فوراً.
              </p>

              {/* بطاقات القيمة المادية السريعة (Value Pills) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">مهارات تدر دخلاً</p>
                    <p className="text-[11px] text-slate-400">مشاريع SaaS وعمل حر</p>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Bot size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">برمجة بسرعة 10x</p>
                    <p className="text-[11px] text-slate-400">بمساعدة AI Agents</p>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">9-15 كراش كورس</p>
                    <p className="text-[11px] text-slate-400">شهادة مهنية خارقة</p>
                  </div>
                </div>
              </div>

              {/* أزرار الدعوة الحاسمة */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  to="/academy" 
                  className="title-font bg-gradient-to-l from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-base px-8 py-4 rounded-2xl shadow-[0_10px_35px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 transition-all flex items-center gap-2.5"
                >
                  <Rocket size={20} /> ابدأ أول كراش كورس مجاناً
                </Link>
                <a 
                  href="#roi-section" 
                  className="title-font bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 hover:border-amber-500/60 font-semibold text-sm sm:text-base px-6 py-4 rounded-2xl transition-all flex items-center gap-2"
                >
                  <TrendingUp size={18} /> كيف سأربح من هذه المهارات؟
                </a>
              </div>

            </div>

            {/* ================= العمود الأيسر: آلة الدوبامين وحاسبة العائد المادي التفاعلية ================= */}
            <div className="lg:col-span-5">
              <div className="bg-[#0b1120] border-2 border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.8)] transition-all">
                
                {/* رأس البطاقة: حالة الصياد وشريط الـ EXP التفاعلي */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-400 block">محاكي مستقبل المطور (جرب الضغط 👇)</span>
                    <h3 className="title-font text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                      <Sparkles size={15} className="text-amber-400" /> اختر هدفك المادي لترى خطتك:
                    </h3>
                  </div>
                  <button
                    onClick={handleDopamineBoost}
                    className={`mono-font text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                      expBoostAnim 
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.6)]' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                    title="اضغط لشحن نقاط الخبرة!"
                  >
                    <Zap size={13} /> {hunterExp} EXP
                  </button>
                </div>

                {/* شريط تقدم الرتبة البصري */}
                <div className="mb-5">
                  <div className="flex justify-between text-[11px] font-bold mb-1.5">
                    <span className="text-slate-400">الرتبة الحالية: مبتدئ (E-Rank)</span>
                    <span className="text-amber-400" dir="ltr">{activeGoalData.rank}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-l from-amber-400 via-emerald-400 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      style={{ width: `${Math.min((hunterExp / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* أزرار اختيار الهدف المالي (يتفاعل معها الزائر فوراً) */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { id: 'saas', label: '💰 بناء SaaS' },
                    { id: 'freelance', label: '🌍 عمل حر' },
                    { id: 'job', label: '🏢 وظيفة تقنية' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setSelectedGoal(tab.id); handleDopamineBoost(); }}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedGoal === tab.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* شاشة النتيجة المادية والمهنية للهدف المختار */}
                <div className={`bg-slate-950/90 border ${activeGoalData.borderColor} rounded-2xl p-4 space-y-3.5 transition-all`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">العائد المالي المتوقع للمهارة:</span>
                    <span className={`mono-font text-sm font-bold ${activeGoalData.highlightColor}`} dir="ltr">
                      {activeGoalData.incomeRange}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-900 pt-2.5">
                    <span className="text-xs font-semibold text-slate-400">مضاعف السرعة بالـ AI:</span>
                    <span className="text-xs font-bold text-white">{activeGoalData.speedMultiplier}</span>
                  </div>

                  <div className="border-t border-slate-900 pt-2.5">
                    <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                      🎯 الأصول الحقيقية التي ستخرج بها في يدك:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeGoalData.deliverable}
                    </p>
                  </div>
                </div>

                {/* زر تفاعلي داخل البطاقة لجرعة دوبامين إضافية */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-emerald-400" /> شهادة مهنية موثقة لكل مسار
                  </span>
                  <Link 
                    to="/academy" 
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    استلم خطتك الآن <ArrowUpRight size={14} />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* 💰 2. قسم الإقناع المادي: كيف يعود عليك الاشتراك بأضعاف مضاعفة؟ */}
      {/* ======================================================= */}
      <section id="roi-section" className="py-20 bg-[#060b16] border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
              <DollarSign size={14} /> استثمارك في نفسك بالأرقام
            </span>
            <h2 className="title-font text-2xl sm:text-4xl font-extrabold text-white mb-4">
              لماذا يعتبر تعلم البرمجة مع الـ AI في منصتنا أسرع طريق لبناء دخلك؟
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              نحن لا نبيعك "فيديوهات مسجلة تنساها بعد يومين"، بل نسلحك بنظام عملي يبني لك أصولاً برمجية تدر المال.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* البطاقة الأولى: الطريقة التقليدية الخاسرة */}
            <div className="bg-slate-950/70 border border-red-900/40 rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <span className="inline-block text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full mb-4">
                  ❌ الكورسات التقليدية المملة (الطريق القديم)
                </span>
                <h3 className="title-font text-xl font-bold text-white mb-4">
                  شهور من التلقين النظري.. والنتيجة صفر مشاريع!
                </h3>
                <ul className="space-y-3.5 text-sm text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                    <span>شروحات معقدة ومصطلحات جافة تجعلك تفقد الشغف وتتوقف في الأسبوع الأول.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                    <span>تكتب الكود بمفردك بالطرق القديمة البطيئة دون معرفة كيفية استغلال الذكاء الاصطناعي.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold mt-0.5">✕</span>
                    <span>تتخرج بحساب GitHub فارغ، وعندما تتقدم لعميل أو شركة لا تجد شيئاً حقيقياً تعرضه.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-xs text-red-400 font-medium">
                النتيجة: ضياع للوقت وإحباط مستمر دون عائد مادي.
              </div>
            </div>

            {/* البطاقة الثانية: طريقة Cherif.dev المربحة */}
            <div className="bg-gradient-to-b from-emerald-950/30 via-[#0b1120] to-[#0b1120] border-2 border-emerald-500/50 rounded-3xl p-7 flex flex-col justify-between shadow-[0_0_50px_rgba(16,185,129,0.1)] relative">
              <div>
                <span className="inline-block text-xs font-bold bg-emerald-500 text-slate-950 px-3.5 py-1 rounded-full mb-4">
                  ✅ نظام Cherif.dev الخارق (طريق العائد المادي السريع)
                </span>
                <h3 className="title-font text-xl font-bold text-white mb-4">
                  شهادات مهنية + وكلاء ذكاء اصطناعي = مصنع مشاريع في يدك!
                </h3>
                <ul className="space-y-3.5 text-sm text-slate-200">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>تبسيط مطلق (ELI5):</strong> تفهم أعقد معماريات البرمجة كأنها قصة مشوقة وتطبقها في نفس الدقيقة.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>إتقان الـ AI Agents:</strong> نعلمك كيف تجعل الذكاء الاصطناعي يبني معك المشاريع ويصلح الأخطاء لتنجز عمل شهر في يومين.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>+12 مشروعاً جاهزاً للبيع على GitHub:</strong> في نهاية كل كراش كورس تبني مشروعاً كاملاً يمكنك عرضه للعملاء أو تحويله إلى مشروع SaaS خاص بك.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-500/20 flex items-center justify-between">
                <span className="text-xs text-emerald-300 font-semibold">
                  💡 مشروع واحد فقط لعميل يسترد لك أضعاف وقتك وجهدك!
                </span>
                <Link to="/academy" className="text-xs font-bold bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl hover:bg-emerald-400 transition-all">
                  ابدأ الآن
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* ⚡ 3. المحاكاة الحية (INTERACTIVE LIVE SANDBOX) */}
      {/* ======================================================= */}
      <section id="interactive-demo" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-4">
            <Terminal size={14} /> جرب بنفسك قبل أن تشترك
          </span>
          <h2 className="title-font text-2xl sm:text-4xl font-extrabold text-white mb-4">
            عِش تجربة الدراسة التفاعلية الآن في 30 ثانية!
          </h2>
          <p className="text-slate-400 text-base leading-[1.9]">
            اضغط على التلميحات، افحص الكود مع المعلم الذكي، أو اكسر البوابة الحمراء لترى كيف نحفز عقلك في كل درس.
          </p>
        </div>

        <div className="bg-[#0b1120] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-800 bg-slate-950/60">
            <button
              onClick={() => setDemoTab('sandbox')}
              className={`p-4 font-semibold text-sm flex items-center justify-center gap-2.5 border-b-2 transition-all ${
                demoTab === 'sandbox' 
                  ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Code size={18} /> 1. مختبر الكود + التلميحات الثلاثة
            </button>
            <button
              onClick={() => setDemoTab('red_gate')}
              className={`p-4 font-semibold text-sm flex items-center justify-center gap-2.5 border-b-2 transition-all ${
                demoTab === 'red_gate' 
                  ? 'border-red-500 bg-red-950/20 text-red-400' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Flame size={18} /> 2. تحدي البوابة الحمراء (Red Gate)
            </button>
            <button
              onClick={() => setDemoTab('ai_github')}
              className={`p-4 font-semibold text-sm flex items-center justify-center gap-2.5 border-b-2 transition-all ${
                demoTab === 'ai_github' 
                  ? 'border-amber-500 bg-amber-950/20 text-amber-400' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Bot size={18} /> 3. ورشة مشروع GitHub & AI Agent
            </button>
          </div>

          {demoTab === 'sandbox' && (
            <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">
                  👶 شرح مبسط + تدريب عملي فوري
                </div>
                <h3 className="title-font text-2xl font-bold text-white leading-snug">وداعاً لعقدة الشاشة السوداء!</h3>
                <p className="text-slate-300 text-sm leading-[1.9]">
                  في كل درس كودي، نعطيك تمريناً عملياً صغيراً مع <strong className="text-amber-400">3 تلميحات تدريجية</strong> ومصحح ذكي يشرح لك أخطاءك بلطف شديد ويمنحك نقاط خبرة فورية.
                </p>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => setDemoHintLevel(prev => Math.min(prev + 1, 3))}
                    disabled={demoHintLevel >= 3}
                    className="w-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                  >
                    <Lightbulb size={18} className="text-amber-400" />
                    {demoHintLevel < 3 ? `اضغط لطلب تلميح (${demoHintLevel + 1} من 3)` : 'تم إظهار جميع التلميحات الثلاثة'}
                  </button>

                  {demoHintLevel > 0 && (
                    <div className="space-y-2 pt-2">
                      {demoHints.slice(0, demoHintLevel).map((h, i) => (
                        <div key={i} className="bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs p-3.5 rounded-xl leading-[1.8]">
                          {h}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-2xl overflow-hidden border border-slate-700 bg-[#04070e]" dir="ltr">
                  <div className="bg-slate-900 px-4 py-2.5 text-xs mono-font text-slate-400 border-b border-slate-800 flex justify-between items-center">
                    <span>Interactive Sandbox • JavaScript</span>
                    <span className="text-emerald-400">Live Editor</span>
                  </div>
                  <textarea
                    value={demoCode}
                    onChange={(e) => setDemoCode(e.target.value)}
                    rows={5}
                    className="w-full bg-[#04070e] text-emerald-300 mono-font text-sm p-4 outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                  <button
                    onClick={handleTestDemoCode}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Bot size={18} /> افحص الكود واستلم +100 EXP
                  </button>
                  <span className="text-xs text-slate-400">✨ اضغط على الزر لترى التقييم الفوري!</span>
                </div>

                {demoAiFeedback && (
                  <div className={`mt-4 p-4 rounded-xl border text-sm font-medium leading-relaxed ${demoAiFeedback.success ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/40 border-amber-500/40 text-amber-300'}`}>
                    {demoAiFeedback.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {demoTab === 'red_gate' && (
            <div className="p-6 md:p-10 max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-semibold">
                <Flame size={15} /> محاكاة البوابة الحمراء • S-Rank Red Gate
              </div>
              <h3 className="title-font text-2xl font-bold text-white">
                ما هو الخطأ البرمجي في كود جلب البيانات التالي؟
              </h3>
              <div className="bg-[#050811] border border-slate-800 rounded-2xl p-4 text-left mono-font text-sm text-amber-300" dir="ltr">
                {`const fetchUser = () => {\n  const res = await fetch('/api/user');\n  return res.json();\n}`}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                {[
                  { text: 'لا يمكن استخدام await داخل دالة غير مسبوقة بكلمة async', correct: true },
                  { text: 'دالة fetch لا تقبل مسارات نصية', correct: false },
                  { text: 'يجب كتابة return قبل كلمة const', correct: false },
                  { text: 'الكود سليم تماماً ولا يوجد فيه أي خطأ', correct: false }
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDemoGateSelected(idx)}
                    className={`p-4 rounded-xl border text-sm font-medium transition-all text-right leading-relaxed ${
                      demoGateSelected === idx
                        ? (opt.correct ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-red-950/40 border-red-500 text-red-300')
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              {demoGateSelected !== null && (
                <p className={`text-sm font-semibold ${demoGateSelected === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {demoGateSelected === 0 
                    ? '🐉 ضربة قاضية صحيحة! لقد كسرت البوابة الحمراء لأن await تتطلب دائماً وجود async قبل الدالة.' 
                    : '💀 أصابك الزعيم! انظر جيداً إلى كلمة await؛ أين كلمة async؟ جرب الخيار الأول.'}
                </p>
              )}
            </div>
          )}

          {demoTab === 'ai_github' && (
            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg">
                  <GitBranch size={14} /> الوحدة النهائية في كل كراش كورس
                </span>
                <h3 className="title-font text-2xl font-bold text-white leading-snug">
                  ابنِ معرض أعمالك على GitHub بمساعدة الـ AI Agent!
                </h3>
                <p className="text-slate-300 text-sm leading-[1.9]">
                  في نهاية كل كراش كورس، نأخذك بالتفصيل الممل خطوة بخطوة لبناء مشروع متكامل، ونعلمك كيف تعطي الأوامر الاحترافية لـ <strong className="text-white">Cursor وGitHub Copilot وChatGPT</strong> لبرمجة المشروع معك ورفعه على GitHub.
                </p>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
                <div className="text-indigo-400 font-semibold flex items-center gap-2">
                  <Bot size={16}/> نموذج البرومبت الجاهز للنسخ في دروس المشاريع:
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-slate-300 leading-[1.8]">
                  "أنت مساعدي البرمجي الخبير. أريد بناء واجهة متجر كتب باستخدام React وTailwind CSS تتصل بمسار API... اشرح لي هيكل المجلدات أولاً ثم اكتب المكون الرئيسي مع التعليقات التوضيحية."
                </div>
                <div className="bg-[#050811] border border-slate-800 p-3.5 rounded-xl mono-font text-emerald-400 leading-relaxed" dir="ltr">
                  $git init && git add .<br/>$ git commit -m "feat: complete crash course project with AI Agent"<br/>
                  $ git push -u origin main
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================= */}
      {/* 🎓 4. كتالوج الشهادات المهنية والكورسات (THE GRAND CATALOG) */}
      {/* ======================================================= */}
      <section id="catalog" className="py-20 bg-[#060b16] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-amber-400 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Award size={16} /> مسارات معتمدة ذات عائد مهني ومادي مباشر
              </span>
              <h2 className="title-font text-2xl sm:text-4xl font-extrabold text-white">
                اختر تخصصك وابدأ بناء مشاريعك وشهاداتك
              </h2>
            </div>

            <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'certs', label: '🎓 الشهادات المهنية' },
                { id: 'crash', label: '⚡ الكراش كورسات' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCatalogFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeCatalogFilter === tab.id 
                      ? 'bg-indigo-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayedCourses.map((course, idx) => {
              const isProCert = course.isCertificate || course.title?.includes('الشهادة');
              const isRealDbCourse = course._id && !String(course._id).startsWith('demo-');

              return (
                <div 
                  key={course._id || idx} 
                  className={`rounded-3xl p-7 flex flex-col justify-between border transition-all duration-300 hover:-translate-y-1.5 shadow-2xl ${
                    isProCert 
                      ? 'bg-gradient-to-b from-indigo-950/40 via-[#0b1120] to-[#0b1120] border-indigo-500/40' 
                      : 'bg-[#0b1120] border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        isProCert 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {isProCert ? <><Trophy size={13}/> شهادة مهنية خارقة</> : <><Zap size={13}/> كراش كورس تفاعلي</>}
                      </span>
                      <span className="mono-font text-xs text-slate-400 font-semibold">
                        {course.coursesCount || 'مسار متكامل'}
                      </span>
                    </div>

                    <h3 className="title-font text-xl font-bold text-white mb-3 leading-[1.6]">
                      {course.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-[1.85] mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    {/* شارة العائد العملي والمادي للكورس */}
                    <div className="bg-emerald-950/25 border border-emerald-500/20 rounded-xl p-3 mb-5 text-xs text-emerald-300 flex items-center gap-2">
                      <TrendingUp size={15} className="shrink-0 text-emerald-400" />
                      <span>{course.roiText || 'يتضمن مشروع تخرج تطبيقي يرفع على GitHub'}</span>
                    </div>

                    {course.skills && course.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {course.skills.map((sk, sIdx) => (
                          <span key={sIdx} className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg font-medium" dir="ltr">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 block">الاستثمار</span>
                      <span className="title-font text-lg font-bold text-emerald-400">
                        {course.price > 0 ? `$${course.price}` : 'وصول مجاني مفتوح'}
                      </span>
                    </div>

                    <Link
                      to={isRealDbCourse ? `/course/${course._id}` : '/academy'}
                      className={`title-font font-bold text-sm px-5 py-3 rounded-xl flex items-center gap-2 transition-all ${
                        isProCert
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      ادخل المسار الآن <ChevronLeft size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* 🌌 5. البوابة الختامية والفوتر (FINAL CTA & FOOTER) */}
      {/* ======================================================= */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="bg-gradient-to-b from-indigo-950/60 to-[#0b1120] border border-indigo-500/40 rounded-3xl p-10 md:p-14 shadow-2xl">
            <Award size={52} className="mx-auto text-amber-400 mb-5" />
            <h2 className="title-font text-2xl sm:text-4xl font-extrabold text-white mb-5 leading-snug">
              كل يوم تؤجل فيه تعلمك هو مشروع وعائد مالي يفوتك!
            </h2>
            <p className="text-slate-300 text-base mb-8 max-w-2xl mx-auto leading-[1.9]">
              ابدأ الآن بأول كراش كورس مبسط، اجمع نقاط خبرتك، وابنِ معرض أعمالك الموثق على GitHub بمساعدة وكلاء الذكاء الاصطناعي.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/academy" 
                className="title-font bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base sm:text-lg px-9 py-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Zap size={20} /> انطلق إلى الأكاديمية الآن
              </Link>
              <Link 
                to="/b2b" 
                className="title-font bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-base px-7 py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Briefcase size={18} className="text-amber-400" /> حلول وتدريب الشركات (B2B)
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900 bg-[#01040d] py-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-slate-400" dir="ltr">CHERIF.DEV ACADEMY © {new Date().getFullYear()}</p>
          <div className="flex gap-6">
            <Link to="/academy" className="hover:text-emerald-400 transition-colors">الأكاديمية</Link>
            <Link to="/vault" className="hover:text-emerald-400 transition-colors">الخزنة السرية</Link>
            <Link to="/b2b" className="hover:text-emerald-400 transition-colors">حلول الشركات</Link>
            <Link to="/rankings" className="hover:text-emerald-400 transition-colors">التصنيفات</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
```

---

## `cherif-platform\src\Rankings.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Crown, Swords, Zap } from 'lucide-react';

const Rankings = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // نفس دوال الألوان الملحمية للحفاظ على الهوية البصرية
  const getRankColor = (rank) => {
    switch(rank) {
      case 'Monarch': return 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-600 to-black drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] font-black';
      case 'National Level': return 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-white drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] font-black';
      case 'S-Rank': return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] font-bold';
      case 'A-Rank': return 'text-red-500 font-bold';
      case 'B-Rank': return 'text-purple-500 font-bold';
      case 'C-Rank': return 'text-blue-500 font-bold';
      case 'D-Rank': return 'text-emerald-500 font-bold';
      default: return 'text-gray-400 font-bold'; // E-Rank
    }
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5001/api/leaderboard');
        if (res.data.success) {
          setPlayers(res.data.leaderboard);
        }
      } catch (err) {
        console.error('خطأ في جلب بيانات النقابة', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-950 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div></div>;

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-950 text-gray-200">
      <div className="max-w-4xl mx-auto">
        
{/* الترويسة المحدثة */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-900/20 border border-yellow-500/30 text-yellow-500 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.15)] relative overflow-hidden">
            {/* تأثير الإشعاع الخلفي */}
            <div className="absolute inset-0 bg-yellow-500/20 animate-pulse"></div>
            <Crown size={40} className="relative z-10" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            لوحة الصدارة: <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">النخبة المطلقة</span>
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            في هذا النظام، المهارة هي العملة الوحيدة والعالم التقني لا يعترف إلا بالنتائج. تُقاس قيمتك في سوق العمل بما تنجزه من أكواد. تنافس مع أشرس العقول، اكسر حدودك البرمجية، وارتقِ من مطور تقليدي إلى <span className="text-gray-200 font-bold">"عقل بمستوى أُمّة"</span>.
          </p>
        </div>

        {/* قائمة اللاعبين */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {players.map((player, index) => {
            // تمييز أصحاب المراكز الثلاثة الأولى
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;
            
            let borderClass = 'border-gray-800 bg-gray-900';
            if (isTop1) borderClass = 'border-yellow-500/50 bg-yellow-900/10 shadow-[0_0_20px_rgba(234,179,8,0.1)] transform scale-[1.02] z-10';
            else if (isTop2) borderClass = 'border-gray-300/50 bg-gray-800/50';
            else if (isTop3) borderClass = 'border-orange-700/50 bg-orange-900/10';

            return (
              <div key={player._id} className={`relative flex items-center justify-between p-5 md:p-6 rounded-2xl border transition-all hover:border-blue-500/30 ${borderClass}`}>
                
                <div className="flex items-center gap-4 md:gap-6">
                  {/* المركز */}
                  <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center font-black text-lg ${isTop1 ? 'bg-yellow-500 text-gray-950' : isTop2 ? 'bg-gray-300 text-gray-950' : isTop3 ? 'bg-orange-700 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    {isTop1 ? <Trophy size={24} /> : isTop2 ? <Medal size={24} /> : isTop3 ? <Medal size={24} /> : `#${index + 1}`}
                  </div>

                  {/* اسم اللاعب */}
                  <div>
                    <h3 className={`text-lg md:text-xl font-bold ${isTop1 ? 'text-yellow-500' : 'text-white'}`}>{player.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs md:text-sm ${getRankColor(player.rank)}`}>{player.rank}</span>
                    </div>
                  </div>
                </div>

                {/* نقاط الخبرة */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-blue-400 font-black text-lg md:text-2xl">
                    <Zap size={20} className={isTop1 ? 'animate-pulse' : ''} />
                    {player.exp.toLocaleString()}
                  </div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">EXP</span>
                </div>
              </div>
            );
          })}

{/* حالة النظام الفارغ (تحديث النص) */}
          {players.length === 0 && (
            <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-gray-700 to-blue-900"></div>
              <Swords size={48} className="mx-auto text-gray-700 mb-5 transition-transform group-hover:scale-110 duration-500" />
              <h3 className="text-xl font-black text-white mb-2">النظام قيد الانتظار</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                قاعدة البيانات خالية والقمة تنتظر من يعتليها. كُن أول من يُوقظ قدراته، يفرض سيطرته على الأكواد، ويحتكر المركز الأول.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rankings;
```

---

## `cherif-platform\src\StudentHub.jsx`

```javascript
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { PlayCircle, BookOpen, Trophy, Swords, Zap } from 'lucide-react';

const Hub = () => {
  const { user } = useContext(AuthContext);
  const [learningData, setLearningData] = useState([]);
  const [userStats, setUserStats] = useState({ exp: 0, rank: 'E-Rank' });
  const [loading, setLoading] = useState(true);

  // دوال الألوان مع تأثيرات (Aura) مخصصة للرتب العليا
  const getRankColor = (rank) => {
    switch(rank) {
      case 'Monarch': 
        return 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-600 to-black drop-shadow-[0_0_20px_rgba(220,38,38,0.9)] scale-110 transform transition-all tracking-widest';
      case 'National Level': 
        return 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-white drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]';
      case 'S-Rank': return 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]';
      case 'A-Rank': return 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]';
      case 'B-Rank': return 'text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]';
      case 'C-Rank': return 'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]';
      case 'D-Rank': return 'text-emerald-500';
      default: return 'text-gray-400'; // E-Rank
    }
  };

  // تحديد سقف الـ EXP للرتب الجديدة
  const getNextRankExp = (exp) => {
    if (exp >= 50000) return 50000; // الحد الأقصى المطلق (Monarch)
    if (exp >= 15000) return 50000; // الطريق نحو Monarch
    if (exp >= 5000) return 15000;  // الطريق نحو National Level
    if (exp >= 2000) return 5000;
    if (exp >= 1000) return 2000;
    if (exp >= 500) return 1000;
    if (exp >= 200) return 500;
    return 200;
  };

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const token = localStorage.getItem('cherif_token');
        if (!token) return setLoading(false);

        const res = await axios.get('http://127.0.0.1:5001/api/user/my-learning', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setLearningData(res.data.learning);
          if (res.data.userStats) setUserStats(res.data.userStats);
        }
      } catch (err) {
        console.error('خطأ في جلب المكتبة', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHub();
  }, []);

  const handleClaimCertificate = async (courseId) => {
    try {
      const token = localStorage.getItem('cherif_token');
      const res = await axios.post(`http://127.0.0.1:5001/api/courses/${courseId}/issue-certificate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // توجيه الطالب إلى صفحة شهادته الخاصة
        window.location.href = `/certificate/${res.data.certificateId}`;
      }
    } catch (err) {
      alert(err.response?.data?.error || 'حدث خطأ أثناء إصدار الشهادة');
    }
  };


  // حساب النسبة المئوية لشريط مستوى اللاعب
  const nextExp = getNextRankExp(userStats.exp);
  const rankProgress = userStats.rank === 'Monarch' ? 100 : Math.round((userStats.exp / nextExp) * 100);

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col items-center justify-center gap-4">
        <p>يجب تسجيل الدخول لعرض مكتبتك التعليمية.</p>
        <Link to="/auth" className="text-emerald-400 hover:text-emerald-300">الذهاب للخزنة السرية</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 bg-gray-950 animate-fade-in-up text-gray-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* شاشة الحالة (Status Window) */}
        <div className="bg-[#0b0f19] border border-blue-900/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(30,58,138,0.15)] relative overflow-hidden">
          {/* تأثيرات الإضاءة الخلفية */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full text-center md:text-right">
              <h1 className="text-3xl font-black text-white mb-1">
                اللاعب: <span className="text-blue-400">{user.name}</span>
              </h1>
              <p className="text-gray-400 font-mono text-sm mb-6 flex items-center justify-center md:justify-start gap-2">
                <Swords size={16} className="text-blue-500" /> مسجل في النظام
              </p>
              
              {/* شريط خبرة اللاعب */}
              <div className="max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-blue-400 flex items-center gap-1"><Zap size={14} /> {userStats.exp} EXP</span>
                  <span className="text-gray-500">{userStats.rank === 'Monarch' ? 'الحد الأقصى للنظام' : `إلى الرتبة التالية: ${nextExp}`}</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-2.5 border border-gray-800">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2.5 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(56,189,248,0.5)]" style={{ width: `${rankProgress}%` }}></div>
                </div>
              </div>
            </div>

            {/* شارة الرتبة مع الألقاب (The New Badge) */}
            <div className="shrink-0 flex flex-col items-center justify-center bg-gray-900/80 border border-gray-800 rounded-2xl p-6 min-w-[200px] relative overflow-hidden group">
              {/* تأثير النبض الخاص برتبة المونارك */}
              {userStats.rank === 'Monarch' && (
                <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none"></div>
              )}
              
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 z-10">تصنيف اللاعب</span>
              
              <div className={`text-4xl md:text-5xl font-black z-10 ${getRankColor(userStats.rank)}`}>
                {userStats.rank}
              </div>
              
              {/* الألقاب الملحمية */}
              <div className="text-xs font-bold mt-3 text-gray-400 z-10">
                {userStats.rank === 'Monarch' && 'عاهل النظام'}
                {userStats.rank === 'National Level' && 'عقل بمستوى أُمّة'}
                {userStats.rank === 'S-Rank' && 'خبير تقني'}
                {userStats.rank === 'A-Rank' && 'مطور متقدم'}
                {userStats.rank === 'B-Rank' && 'مطور محترف'}
                {userStats.rank === 'C-Rank' && 'مطور واعد'}
                {userStats.rank === 'D-Rank' && 'مبتدئ متمرس'}
                {userStats.rank === 'E-Rank' && 'مبتدئ النظام'}
              </div>
            </div>
          </div>
        </div>

        {/* الترويسة الفخمة */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">مرحباً بعودتك، <span className="text-emerald-500">{user.name}</span>! 🚀</h1>
            <p className="text-gray-400 text-sm md:text-base">حان الوقت لمواصلة رحلتك التعليمية. لديك {learningData.length} مسارات في مكتبتك.</p>
          </div>
          <div className="hidden md:flex w-16 h-16 bg-emerald-900/30 border border-emerald-500/30 rounded-full items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Trophy size={28} />
          </div>
        </div>

        {/* قائمة الكورسات التي يمتلكها الطالب */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-emerald-500"/> مساراتي التعليمية
          </h2>
          
          {learningData.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/50 border border-gray-800 border-dashed rounded-3xl">
              <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 mb-6">مكتبتك فارغة حالياً. اكتشف الكورسات في الأكاديمية!</p>
              <Link to="/academy" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                تصفح الأكاديمية
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningData.map((item) => (
                <div key={item.enrollmentId} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col group">
                  
                  {/* صورة الكورس */}
                  <div className="h-44 bg-gray-800 relative overflow-hidden">
                    {item.course.thumbnail && (
                      <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                    )}
                  </div>

                  {/* التفاصيل وشريط التقدم */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6 line-clamp-2">{item.course.title}</h3>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                        <span>التقدم: {item.progress}%</span>
                        <span>{item.completedCount} / {item.totalLessons} دروس</span>
                      </div>
                      
                      <div className="w-full bg-gray-950 rounded-full h-2 mb-6 border border-gray-800 overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.progress}%` }}></div>
                      </div>
                      
                      <Link to={`/course/${item.course._id}/learn`} className="w-full bg-emerald-900/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 text-center font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <PlayCircle size={18} /> 
                    {item.progress === 100 ? (
                        <button 
                          onClick={() => handleClaimCertificate(item.course._id)}
                          className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-gray-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-[1.02]"
                        >
                          <Trophy size={18} /> استلام وثيقة الإثبات
                        </button>
                      ) : (
                        <Link to={`/course/${item.course._id}/learn`} className="w-full bg-blue-900/20 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-500/20 text-center font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                          <PlayCircle size={18} /> 
                          {item.progress === 0 ? 'ابدأ التعلم الآن' : 'واصل التعلم'}
                        </Link>
                      )}                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hub;
```

---

## `cherif-platform\src\Vault.jsx`

```javascript
import React, { useState, useContext } from 'react';
import { Lock, Mail, User, CheckCircle, Terminal, ShieldAlert, Key } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Vault = () => {
  const [step, setStep] = useState(1); // المرحلة 1 (الإيميل) ، المرحلة 2 (كلمة السر)
  const [emailExists, setEmailExists] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // دالة فحص الإيميل (الانتقال للمرحلة 2)
  const handleNextStep = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await axios.post('http://127.0.0.1:5001/api/auth/check-email', { email: formData.email });
      setEmailExists(res.data.exists);
      if (res.data.exists) {
        setFormData({ ...formData, name: res.data.name }); // جلب اسمه إذا كان مسجلاً
      }
      setStep(2); // الانتقال لمرحلة كلمة السر
    } catch (err) {
      setError('حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة الإرسال النهائي (تسجيل أو دخول)
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailExists && formData.password !== formData.confirmPassword) {
      return setError('كلمتا المرور غير متطابقتين!');
    }

    setIsSubmitting(true);
    
    try {
      let response;
      if (emailExists) {
        // إذا كان مسجلاً، نقوم بتسجيل دخوله
        response = await axios.post('http://127.0.0.1:5001/api/auth/login', { 
          email: formData.email, 
          password: formData.password 
        });
      } else {
        // إذا كان جديداً، ننشئ حسابه
        response = await axios.post('http://127.0.0.1:5001/api/auth/vault-signup', formData);
      }
      
      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate('/hub'); // توجيه للمكتبة
      }
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ غير متوقع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 animate-fade-in-up">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none"></div>

        {/* القسم الأيمن (التسويقي) */}
        <div className="p-10 flex flex-col justify-center border-l border-gray-800/50">
          <div className="bg-gray-950 border border-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="text-emerald-500" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 leading-tight">
            افتح <span className="text-emerald-500">الخزنة السرية</span>
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            أنت هنا لأنك قادم من إنستغرام. أدخل بياناتك للحصول على <strong className="text-gray-200">السكربت المصدري لبوت التداول</strong>.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
              <CheckCircle className="text-emerald-500" size={18} /><span>كود Python جاهز للتشغيل.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
              <CheckCircle className="text-emerald-500" size={18} /><span>خريطة طريق لربط Binance.</span>
            </div>
          </div>
        </div>

        {/* القسم الأيسر (الفورم الديناميكي) */}
        <div className="p-10 bg-gray-950/50 flex flex-col justify-center relative">
          
          {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-xl mb-4 text-sm font-bold text-center animate-fade-in-up">{error}</div>}

          {step === 1 ? (
            // المرحلة 1: جمع الإيميل والاسم
            <form onSubmit={handleNextStep} className="space-y-5 animate-fade-in-up">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">الاسم الأول أو اللقب</label>
                <div className="relative">
                  <User className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input type="text" required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-10 pl-4 focus:border-emerald-500 outline-none transition-all"
                    placeholder="مثال: محمد الشريف" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">البريد الإلكتروني المهني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input type="email" required dir="ltr" className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-4 pr-10 text-left focus:border-emerald-500 outline-none transition-all"
                    placeholder="dev@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all">
                {isSubmitting ? 'جاري الفحص...' : 'التالي ⬅️'}
              </button>
            </form>
          ) : (
            // المرحلة 2: تعيين كلمة المرور
            <form onSubmit={handleFinalSubmit} className="space-y-5 animate-fade-in-up">
              
              <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl mb-6">
                <p className="text-emerald-400 text-sm font-bold flex items-center gap-2">
                  <ShieldAlert size={16} /> 
                  {emailExists ? `مرحباً بعودتك يا ${formData.name}! أدخل كلمة مرورك لفتح الخزنة.` : 'خطوة أخيرة! قم بتعيين كلمة مرور لحماية حسابك والسكربت.'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">كلمة المرور</label>
                <div className="relative">
                  <Key className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input type="password" required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-10 pl-4 focus:border-emerald-500 outline-none transition-all"
                    placeholder="********" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>

              {!emailExists && (
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <Key className="absolute right-3 top-3 text-gray-500" size={18} />
                    <input type="password" required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-10 pl-4 focus:border-emerald-500 outline-none transition-all"
                      placeholder="********" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(1)} className="bg-gray-800 text-white px-4 py-4 rounded-xl hover:bg-gray-700">تراجع</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2">
                  {isSubmitting ? <Terminal className="animate-spin" size={20} /> : '📥 تأكيد وفتح الخزنة'}
                </button>
              </div>
            </form>
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

## `cherif-platform\src\components\Navbar.jsx`

```javascript
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Code, Briefcase, Lock, Terminal, User, LogOut, BookOpenText, Trophy, UserPlus, Presentation } from 'lucide-react';
import { AuthContext } from '../AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); 
  
  const navLinks = [
    { path: '/academy', name: 'الأكاديمية', icon: <Code size={18} /> },
    { path: '/vault', name: 'الخزنة السرية', icon: <Lock size={18} /> },
    { path: '/b2b', name: 'حلول الشركات', icon: <Briefcase size={18} /> },
    { path: '/hub', name: 'المستندات', icon: <BookOpenText size={18} /> },
    { path: '/rankings', name: 'التصنيفات', icon: <Trophy size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const becomeInstructor = async () => {
    if (!window.confirm('هل أنت مستعد لنقل خبرتك وتصبح صانع محتوى في النظام؟')) return;
    try {
      const token = localStorage.getItem('cherif_token');
      const res = await axios.post('http://127.0.0.1:5001/api/user/become-instructor', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert(res.data.message);
        window.location.href = '/instructor';
      }
    } catch (err) {
      alert('حدث خطأ أثناء الترقية. يرجى المحاولة لاحقاً.');
    }
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
      {/* 🛠️ تعديل 1: تكبير الحاوية إلى max-w-7xl لإعطاء مساحة تنفس للعناصر */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* ================= القسم الأيمن: اللوجو + الروابط ================= */}
        <div className="flex items-center gap-10">
          
          {/* اللوجو (shrink-0 لمنع انضغاطه) */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Terminal size={22} className="text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-wider">
              CHERIF<span className="text-emerald-500">.DEV</span>
            </span>
          </Link>

          {/* روابط الصفحات */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`flex items-center gap-2 text-sm font-bold transition-colors ${location.pathname.includes(link.path) ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}>
                {link.icon} {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ================= القسم الأيسر: أزرار المستخدم ================= */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              
              {/* زر الاستوديو / الترقية */}
              {user.role === 'instructor' || user.role === 'admin' ? (
                // 🛠️ تعديل 2: إضافة whitespace-nowrap لمنع انكسار النص إلى سطرين
                <Link to="/instructor" className="hidden lg:flex items-center gap-2 text-emerald-400 hover:text-white bg-emerald-900/20 hover:bg-emerald-600/30 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] whitespace-nowrap shrink-0">
                  <Presentation size={18} /> استوديو الأستاذ
                </Link>
              ) : (
                <button onClick={becomeInstructor} className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-emerald-400 text-sm font-bold transition-colors whitespace-nowrap shrink-0">
                  <UserPlus size={18} /> التدريس في المنصة
                </button>
              )}

              {/* 🛠️ تعديل 3: إضافة خط فاصل عمودي (Divider) لفصل الروابط عن بطاقة المستخدم */}
              <div className="hidden lg:block w-px h-8 bg-gray-800 mx-1"></div>

              {/* 🛠️ تعديل 4: إعادة تصميم بطاقة المستخدم لتكون كبسولة متناسقة */}
              <div className="flex items-center gap-3 bg-gray-900/80 border border-gray-800 pl-2 pr-4 py-1.5 rounded-2xl hover:border-gray-700 transition-colors shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-black text-white leading-tight">{user.name}</div>
                  <div className="text-[11px] font-bold text-emerald-500 mt-0.5">
                    {user.role === 'admin' ? 'عاهل النظام' : user.role === 'instructor' ? 'صانع أبراج' : 'مطور'}
                  </div>
                </div>
                
                {/* فاصل داخلي رفيع بين الاسم وأزرار التحكم */}
                <div className="flex items-center gap-1.5 mr-2 border-r border-gray-800 pr-3">
                  <Link to={user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/hub'} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-emerald-900/50 text-gray-400 hover:text-emerald-400 rounded-lg transition-colors" title="لوحة التحكم">
                    <User size={16} />
                  </Link>
                  <button onClick={handleLogout} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-red-900/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors" title="تسجيل الخروج">
                    <LogOut size={16} />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-400 hover:text-white font-bold text-sm px-3 transition-colors">
                تسجيل الدخول
              </Link>
              <Link to="/login" className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] whitespace-nowrap">
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

---

## `cherif-platform\src\components\ProtectedRoute.jsx`

```javascript
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-500 font-bold">جاري التحقق من الهوية...</div>;

  if (!user) {
    return <Navigate to="/vault" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in-up">
        <h1 className="text-4xl font-black text-red-500 mb-4">🚫 وصول مرفوض</h1>
        <p className="text-gray-400">لا تملك صلاحيات كافية لدخول هذه الصفحة.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
```

---

## `cherif-platform-backend\package.json`

```json
{
  "name": "cherif-platform-backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "accepts": "^2.0.0",
    "bcrypt": "^6.0.0",
    "body-parser": "^2.3.0",
    "bson": "^7.3.3",
    "buffer-equal-constant-time": "^1.0.1",
    "bytes": "^3.1.2",
    "call-bind-apply-helpers": "^1.0.2",
    "call-bound": "^1.0.4",
    "content-disposition": "^1.1.0",
    "content-type": "^1.0.5",
    "cookie": "^0.7.2",
    "cookie-signature": "^1.2.2",
    "cors": "^2.8.6",
    "debug": "^4.4.3",
    "depd": "^2.0.0",
    "dotenv": "^18.0.5",
    "dunder-proto": "^1.0.1",
    "ecdsa-sig-formatter": "^1.0.11",
    "ee-first": "^1.1.1",
    "encodeurl": "^2.0.0",
    "es-define-property": "^1.0.1",
    "es-errors": "^1.3.0",
    "es-object-atoms": "^1.1.2",
    "escape-html": "^1.0.3",
    "etag": "^1.8.1",
    "express": "^5.2.1",
    "finalhandler": "^2.1.1",
    "forwarded": "^0.2.0",
    "fresh": "^2.0.0",
    "function-bind": "^1.1.2",
    "get-intrinsic": "^1.3.0",
    "get-proto": "^1.0.1",
    "gopd": "^1.2.0",
    "has-symbols": "^1.1.0",
    "hasown": "^2.0.4",
    "http-errors": "^2.0.1",
    "iconv-lite": "^0.7.3",
    "inherits": "^2.0.4",
    "ipaddr.js": "^1.9.1",
    "is-promise": "^4.0.0",
    "jsonwebtoken": "^9.0.3",
    "jwa": "^2.0.1",
    "jws": "^4.0.1",
    "kareem": "^3.4.0",
    "lodash.includes": "^4.3.0",
    "lodash.isboolean": "^3.0.3",
    "lodash.isinteger": "^4.0.4",
    "lodash.isnumber": "^3.0.3",
    "lodash.isplainobject": "^4.0.6",
    "lodash.isstring": "^4.0.1",
    "lodash.once": "^4.1.1",
    "math-intrinsics": "^1.1.0",
    "media-typer": "^1.1.1",
    "memory-pager": "^1.5.0",
    "merge-descriptors": "^2.0.0",
    "mime-db": "^1.54.0",
    "mime-types": "^3.0.2",
    "mongodb-connection-string-url": "^7.0.2",
    "mongoose": "^9.11.0",
    "mpath": "^0.9.0",
    "mquery": "^6.0.0",
    "ms": "^2.1.3",
    "negotiator": "^1.1.0",
    "node-addon-api": "^8.9.2",
    "node-gyp-build": "^4.8.4",
    "object-assign": "^4.1.1",
    "object-inspect": "^1.13.4",
    "on-finished": "^2.4.1",
    "once": "^1.4.0",
    "parseurl": "^1.3.3",
    "path-to-regexp": "^8.4.2",
    "proxy-addr": "^2.0.8",
    "punycode": "^2.3.1",
    "qs": "^6.16.0",
    "range-parser": "^1.3.0",
    "raw-body": "^3.0.2",
    "router": "^2.2.0",
    "safe-buffer": "^5.2.1",
    "safer-buffer": "^2.1.2",
    "semver": "^7.8.5",
    "send": "^1.2.1",
    "serve-static": "^2.2.1",
    "setprototypeof": "^1.2.0",
    "side-channel": "^1.1.1",
    "side-channel-list": "^1.0.1",
    "side-channel-map": "^1.0.1",
    "side-channel-weakmap": "^1.0.2",
    "sift": "^17.1.3",
    "sparse-bitfield": "^3.0.3",
    "statuses": "^2.0.2",
    "toidentifier": "^1.0.1",
    "tr46": "^5.1.1",
    "type-is": "^2.1.0",
    "unpipe": "^1.0.0",
    "vary": "^1.1.2",
    "webidl-conversions": "^7.0.0",
    "whatwg-url": "^14.2.0",
    "wrappy": "^1.0.2"
  }
}

```

---

## `cherif-platform-backend\server.js`

```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express();
app.use(cors());
// السماح باستقبال حزم بيانات ضخمة (كورسات وشهادات كاملة)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==========================================
// 1. الاتصال بقاعدة البيانات (MongoDB Atlas ☁️)
// ==========================================
const ATLAS_URI = process.env.MONGO_URI;

mongoose.connect(ATLAS_URI)
    .then(() => console.log('✅ تم الاتصال بقاعدة بيانات Cherif Platform (أطلس السحابية ☁️)'))
    .catch(err => console.error('❌ خطأ في الاتصال بقاعدة أطلس:', err));

// ==========================================
// 🧹 دوال التطهير الذكية (لمنع CastError وتكرار العناوين)
// ==========================================

// أ) تنظيف تكرار "الكراش كورس 1: كراش كورس 1:" من عنوان الكورس
const cleanCourseTitlePrefix = (rawTitle = '') => {
    if (!rawTitle || typeof rawTitle !== 'string') return 'كورس تدريبي';
    return rawTitle
        .replace(/^((?:الكراش كورس|كراش كورس|الكورس|المرحلة)\s*\d+(?:\s*\([^)]*\))?)\s*:\s*(?:الكراش كورس|كراش كورس|الكورس|المرحلة)\s*\d+\s*:\s*/i, '$1: ')
        .replace(/^((?:الكراش كورس|كراش كورس|الكورس)\s*\d+)\s*:\s*(?:الكراش كورس|كراش كورس|الكورس)\s*\d+\s*[-:]?\s*/i, '$1: ')
        .trim();
};

// ب) تحويل أي قيمة (سواء كانت نصاً، أو مصفوفة متداخلة [['...']]، أو كائناً) إلى نص صافي
const toCleanFlatString = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') {
        const trimmed = val.trim();
        // إذا كان النص عبارة عن مصفوفة JSON متداخلة كنص مثل "[ [ '/ˈtʃiːp.ər/' ] ]"
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
                if (Array.isArray(parsed)) {
                    return parsed.flat(Infinity).map(item => String(item).trim()).filter(Boolean).join(' | ');
                }
            } catch (e) {}
        }
        return trimmed;
    }
    if (Array.isArray(val)) {
        return val.flat(Infinity).map(toCleanFlatString).filter(Boolean).join(' | ');
    }
    if (typeof val === 'object') {
        return String(val.text || val.option || val.value || val.label || JSON.stringify(val));
    }
    return String(val);
};

// ج) تطبيع مصفوفة الخيارات (options) لتكون دائماً [String] مسطحة ونظيفة 100%
const normalizeQuizOptions = (rawOptions) => {
    if (!rawOptions) return ['الخيار 1', 'الخيار 2', 'الخيار 3', 'الخيار 4'];

    let workingArray = rawOptions;

    // إذا جاءت الخيارات كنص JSON مضغوط مثل "[ [ '/ˈtʃiːp.ər/' ], [ '/tʃɪpər/' ] ]"
    if (typeof workingArray === 'string') {
        const trimmed = workingArray.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                workingArray = JSON.parse(trimmed.replace(/'/g, '"'));
            } catch (e) {
                return [trimmed];
            }
        } else {
            return [trimmed];
        }
    }

    if (!Array.isArray(workingArray)) {
        return ['الخيار 1', 'الخيار 2', 'الخيار 3', 'الخيار 4'];
    }

    // إذا كان العنصر الأول بحد ذاته مصفوفة تحتوي على جميع الخيارات الأربع: [ [ ['a'], ['b'], ['c'], ['d'] ] ]
    if (workingArray.length === 1 && Array.isArray(workingArray[0]) && workingArray[0].length >= 2) {
        workingArray = workingArray[0];
    }

    // إذا كان العنصر الأول نصاً يحتوي على المصفوفة كاملة: [ "[ [ '/ˈtʃiːp.ər/' ], [ '/tʃɪpər/' ] ]" ]
    if (workingArray.length === 1 && typeof workingArray[0] === 'string' && workingArray[0].trim().startsWith('[')) {
        try {
            const parsedInner = JSON.parse(workingArray[0].trim().replace(/'/g, '"'));
            if (Array.isArray(parsedInner) && parsedInner.length >= 2) {
                workingArray = parsedInner;
            }
        } catch (e) {}
    }

    const flattened = workingArray.map(item => {
        if (Array.isArray(item)) {
            return item.flat(Infinity).map(x => String(x).trim()).filter(Boolean).join(' ');
        }
        return toCleanFlatString(item);
    }).filter(Boolean);

    return flattened.length > 0 ? flattened : ['الخيار 1', 'الخيار 2', 'الخيار 3', 'الخيار 4'];
};

// د) تطهير كائن الدرس بالكامل قبل حفظه في MongoDB
const sanitizeLessonData = (lesson = {}, courseId, sectionName = 'الوحدة 1: الأساسيات', lessonOrder = 1) => {
    // 1. تطهير bossQuiz
    const cleanBossQuiz = Array.isArray(lesson.bossQuiz)
        ? lesson.bossQuiz.map((q) => ({
            questionType: q?.questionType === 'code' ? 'code' : 'theory',
            question: toCleanFlatString(q?.question || 'سؤال تطبيقي'),
            options: normalizeQuizOptions(q?.options),
            correctAnswerIndex: Number.isFinite(Number(q?.correctAnswerIndex)) ? Number(q.correctAnswerIndex) : 0,
            explanation: toCleanFlatString(q?.explanation || '')
        }))
        : [];

    // 2. تطهير dailyQuest
    const hasDailyQuest = lesson.dailyQuest && (lesson.dailyQuest.question || lesson.dailyQuest.options?.length);
    const cleanDailyQuest = hasDailyQuest
        ? {
            question: toCleanFlatString(lesson.dailyQuest.question),
            options: normalizeQuizOptions(lesson.dailyQuest.options),
            correctAnswerIndex: Number.isFinite(Number(lesson.dailyQuest.correctAnswerIndex))
                ? Number(lesson.dailyQuest.correctAnswerIndex)
                : 0,
            explanation: toCleanFlatString(lesson.dailyQuest.explanation || ''),
            isMandatory: Boolean(lesson.dailyQuest.isMandatory),
            bonusExp: Number(lesson.dailyQuest.bonusExp) || 50
        }
        : null;

    // 3. تطهير codingPractice (أو unitCodingChallenge)
    const rawPractice = lesson.codingPractice || lesson.unitCodingChallenge;
    const hasPractice = rawPractice && (rawPractice.taskQuestion || rawPractice.solutionCode);
    const cleanCodingPractice = hasPractice
        ? {
            hasPractice: true,
            taskQuestion: toCleanFlatString(rawPractice.taskQuestion),
            starterCode: toCleanFlatString(rawPractice.starterCode || ''),
            hints: Array.isArray(rawPractice.hints)
                ? rawPractice.hints.map(toCleanFlatString).filter(Boolean)
                : [],
            solutionCode: toCleanFlatString(rawPractice.solutionCode || '')
        }
        : null;

    return {
        courseId,
        title: toCleanFlatString(lesson.title || `الدرس ${lessonOrder}`),
        description: toCleanFlatString(lesson.description || 'تم إنشاؤه تلقائياً عبر AutoFactory'),
        type: toCleanFlatString(lesson.type || 'video'),
        lessonCategory: toCleanFlatString(lesson.lessonCategory || 'standard'),
        content: toCleanFlatString(lesson.content || ''),
        codeSnippet: toCleanFlatString(lesson.codeSnippet || ''),
        codeExplanation: toCleanFlatString(lesson.codeExplanation || ''),
        videoUrl: toCleanFlatString(lesson.videoUrl || ''),
        order: lessonOrder,
        isFreePreview: Boolean(lesson.isFreePreview),
        section: toCleanFlatString(sectionName || lesson.section || 'الوحدة 1: الأساسيات'),
        codingPractice: cleanCodingPractice,
        dailyQuest: cleanDailyQuest,
        bossQuiz: cleanBossQuiz
    };
};

// ==========================================
// 2. نموذج المستخدم (User Model)
// ==========================================
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'instructor', 'admin'], default: 'user' },
    created_at: { type: Date, default: Date.now },
    exp: { type: Number, default: 0 },
    rank: { type: String, default: 'E-Rank' }
});
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// 3. مسارات المصادقة (Auth Routes)
// ==========================================

app.post('/api/auth/check-email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        res.json({ exists: !!user, name: user ? user.name : null });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

app.post('/api/auth/vault-signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'الرجاء إدخال الاسم، البريد، وكلمة المرور.' });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ error: 'هذا البريد مسجل بالفعل، يرجى تسجيل الدخول.' });
        }

        user = new User({ name, email, password, role: 'user' });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, role: user.role, email: user.email },
            message: 'تم إنشاء الحساب بنجاح!'
        });

    } catch (error) {
        console.error('❌ خطأ في التسجيل:', error);
        res.status(500).json({ error: 'خطأ في السيرفر.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'الرجاء إدخال البريد وكلمة المرور' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'هذا الحساب غير موجود' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'كلمة المرور غير صحيحة' });

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, role: user.role, email: user.email },
            message: 'تم تسجيل الدخول بنجاح'
        });

    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

// ==========================================
// 4. حارس الأمان (Middleware) والمسارات الإدارية (Admin APIs)
// ==========================================
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'غير مصرح لك بالدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'هذا المسار مخصص للمدير العام فقط' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'توكن غير صالح' });
    }
};

app.get('/api/admin/users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ created_at: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب المستخدمين' });
    }
});

app.put('/api/admin/users/:id/role', verifyAdmin, async (req, res) => {
    try {
        const { newRole } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role: newRole }, { new: true });
        res.json({ success: true, message: `تم تغيير صلاحية ${user.name} إلى ${newRole}` });
    } catch (error) {
        res.status(500).json({ error: 'فشل في تعديل الصلاحية' });
    }
});

app.get('/api/make-me-admin/:email', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            { role: 'admin' },
            { new: true }
        );
        if (user) res.json({ success: true, message: 'مبروك! أصبحت المدير العام الآن. قم بتسجيل الدخول من جديد.' });
        else res.json({ error: 'لم يتم العثور على الإيميل' });
    } catch (error) { res.status(500).send('Error'); }
});

// ==========================================
// 5. نموذج الكورسات (Course Schema)
// ==========================================
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, default: '' },
    estimatedHours: { type: Number, default: 18 },
    price: { type: Number, default: 0 },
    thumbnail: { type: String, default: '' },
    certificateMeta: { type: mongoose.Schema.Types.Mixed, default: {} },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
}, 
{ strict: false }); // 👈 السطر السحري: إيقاف الصرامة للسماح بقراءة الهياكل المعمارية الضخمة (Blueprint & Sections)!



const Course = mongoose.model('Course', courseSchema);

// ==========================================
// 🛡️ حارس الأمان الخاص بالأساتذة
// ==========================================
const verifyInstructor = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'غير مصرح لك بالدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'instructor' && decoded.role !== 'admin') {
            return res.status(403).json({ error: 'هذا المسار مخصص للأساتذة فقط' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'توكن غير صالح' });
    }
};

// ==========================================
// 🎙️ مسارات استوديو الأستاذ (Instructor APIs)
// ==========================================

app.post('/api/courses', verifyInstructor, async (req, res) => {
    try {
        const { title, description, price, thumbnail, difficulty, estimatedHours, certificateMeta } = req.body;

        const newCourse = new Course({
            title: cleanCourseTitlePrefix(title),
            description,
            price,
            thumbnail,
            difficulty: difficulty || '',
            estimatedHours: Number(estimatedHours) || 18,
            certificateMeta: certificateMeta || {},
            instructor: req.user.id
        });

        await newCourse.save();
        res.json({ success: true, course: newCourse, message: 'تم إنشاء الكورس بنجاح!' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في إنشاء الكورس' });
    }
});

app.get('/api/courses/my-courses', verifyInstructor, async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id }).sort({ created_at: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب الكورسات' });
    }
});

app.put('/api/courses/:id', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك بتعديل هذا الكورس' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, course: updatedCourse, message: 'تم التعديل بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في تعديل الكورس' });
    }
});

app.delete('/api/courses/:id', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك بحذف هذا الكورس' });
        }

        await Lesson.deleteMany({ courseId: req.params.id });
        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'تم حذف الكورس وجميع دروسه بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في حذف الكورس' });
    }
});

// ==========================================
// 🌍 مسارات الأكاديمية العامة (Public APIs)
// ==========================================

app.get('/api/courses/public', async (req, res) => {
    try {
        const courses = await Course.find().sort({ created_at: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب قائمة الكورسات' });
    }
});

app.get('/api/courses/public/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });
        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب تفاصيل الكورس' });
    }
});

// ==========================================
// 6. نموذج الدروس (Lesson Schema)
// ==========================================
const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, default: 'video' },
    lessonCategory: { type: String, default: 'standard' },
    content: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    isFreePreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    section: { type: String, default: 'الوحدة 1: الأساسيات' },
    codeSnippet: { type: String, default: '' },
    codeExplanation: { type: String, default: '' },

    codingPractice: {
        hasPractice: { type: Boolean, default: false },
        taskQuestion: { type: String, default: '' },
        starterCode: { type: String, default: '' },
        hints: [{ type: String }],
        solutionCode: { type: String, default: '' }
    },

    dailyQuest: {
        question: String,
        options: [String],
        correctAnswerIndex: Number,
        explanation: String,
        isMandatory: { type: Boolean, default: false },
        bonusExp: { type: Number, default: 50 }
    },

    bossQuiz: [{
        questionType: { type: String, default: 'theory' },
        question: String,
        options: [String],
        correctAnswerIndex: Number,
        explanation: String
    }],

    created_at: { type: Date, default: Date.now }
},
{ strict: false });

const Lesson = mongoose.model('Lesson', lessonSchema);

// ==========================================
// 📚 مسارات الدروس (Lesson APIs)
// ==========================================

app.get('/api/courses/:courseId/lessons', async (req, res) => {
    try {
        const lessons = await Lesson.find({ courseId: req.params.courseId }).sort({ order: 1 });

const safeLessons = lessons.map(lesson => {
            const rawObj = lesson.toObject ? lesson.toObject() : lesson;
            return {
                ...rawObj,
                _id: lesson._id,
                title: lesson.title,
                description: lesson.description,
                type: lesson.type || 'video',
                lessonCategory: lesson.lessonCategory || 'standard',
                content: lesson.content,
                isFreePreview: lesson.isFreePreview,
                order: lesson.order,
                section: lesson.section || 'الوحدة 1: الأساسيات',
                videoUrl: lesson.isFreePreview ? lesson.videoUrl : null,
                codeSnippet: lesson.codeSnippet || "",
                codeExplanation: lesson.codeExplanation || "",
                dailyQuest: lesson.dailyQuest || null,
                codingPractice: lesson.codingPractice || null,
                bossQuiz: (lesson.bossQuiz && lesson.bossQuiz.length > 0) ? lesson.bossQuiz : []
            };
        });

        res.json({ success: true, lessons: safeLessons });
    } catch (error) {
        console.error('❌ خطأ في جلب الدروس:', error);
        res.status(500).json({ error: 'فشل في جلب الدروس' });
    }
});

app.post('/api/courses/:courseId/lessons', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك' });
        }

        const existingCount = await Lesson.countDocuments({ courseId: course._id });
        const cleanPayload = sanitizeLessonData(
            req.body,
            course._id,
            req.body.section || 'الوحدة 1: الأساسيات',
            req.body.order || (existingCount + 1)
        );

        const newLesson = new Lesson(cleanPayload);
        await newLesson.save();

        res.json({ success: true, lesson: newLesson, message: 'تمت إضافة الدرس بنجاح' });
    } catch (error) {
        console.error('❌ خطأ في إضافة الدرس:', error);
        res.status(500).json({ error: 'فشل في إضافة الدرس' });
    }
});

// استبدل مسار app.put('/api/lessons/:lessonId') في server_4.js بهذا المسار المحصن:
app.put('/api/lessons/:lessonId', verifyInstructor, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.lessonId);
        if (!lesson) return res.status(404).json({ error: 'الدرس غير موجود' });

        const course = await Course.findById(lesson.courseId);
        if (course && course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك بتعديل دروس هذا الكورس' });
        }

        const { _id, courseId, ...updateFields } = req.body;
        const updatedLesson = await Lesson.findByIdAndUpdate(
            req.params.lessonId,
            { $set: updateFields },
            { new: true }
        );
        res.json({ success: true, lesson: updatedLesson });
    } catch (error) {
        res.status(500).json({ error: 'فشل في تحديث الدرس' });
    }
});

// ==========================================
// 7. نموذج الاشتراكات وتتبع التقدم (Enrollment Schema)
// ==========================================
const enrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    certificate: {
        isIssued: { type: Boolean, default: false },
        certificateId: { type: String, sparse: true },
        issuedAt: { type: Date }
    }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// ==========================================
// 🎮 مسارات نظام التقدم والـ EXP (Gamification APIs)
// ==========================================

app.get('/api/courses/:courseId/progress', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ success: true, completedLessons: [] });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const enrollment = await Enrollment.findOne({ userId: decoded.id, courseId: req.params.courseId });
        res.json({ success: true, completedLessons: enrollment ? enrollment.completedLessons : [] });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب التقدم' });
    }
});

// مسار موحد لإنهاء الدرس + إضافة 50 EXP + ترقية الرتبة
app.post('/api/courses/:courseId/complete-lesson', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول لحفظ تقدمك!' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const { lessonId } = req.body;

        let enrollment = await Enrollment.findOne({ userId, courseId: req.params.courseId });
        if (!enrollment) {
            enrollment = new Enrollment({ userId, courseId: req.params.courseId, completedLessons: [] });
        }

        let expGained = false;
        let newRank = '';

        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
            await enrollment.save();
            expGained = true;

            const user = await User.findById(userId);
            if (user) {
                user.exp += 50;

                if (user.exp >= 50000) user.rank = 'Monarch';
                else if (user.exp >= 15000) user.rank = 'National Level';
                else if (user.exp >= 5000) user.rank = 'S-Rank';
                else if (user.exp >= 2000) user.rank = 'A-Rank';
                else if (user.exp >= 1000) user.rank = 'B-Rank';
                else if (user.exp >= 500) user.rank = 'C-Rank';
                else if (user.exp >= 200) user.rank = 'D-Rank';
                else user.rank = 'E-Rank';

                newRank = user.rank;
                await user.save();
            }
        }

        res.json({ success: true, completedLessons: enrollment.completedLessons, expGained, newRank });
    } catch (error) {
        console.error('❌ خطأ في حفظ التقدم:', error);
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

// ==========================================
// 🎓 مسارات مكتبة الطالب (Student Hub)
// ==========================================
app.get('/api/user/my-learning', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userStats = await User.findById(decoded.id).select('exp rank name');

        const enrollments = await Enrollment.find({ userId: decoded.id }).populate('courseId');
        const learningData = await Promise.all(enrollments.map(async (enr) => {
            if (!enr.courseId) return null;
            const totalLessons = await Lesson.countDocuments({ courseId: enr.courseId._id });
            return {
                enrollmentId: enr._id,
                course: enr.courseId,
                progress: totalLessons > 0 ? Math.round((enr.completedLessons.length / totalLessons) * 100) : 0,
                completedCount: enr.completedLessons.length,
                totalLessons
            };
        }));

        res.json({ success: true, learning: learningData.filter(item => item !== null), userStats });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

app.get('/api/courses/:courseId/check-enrollment', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ isEnrolled: false });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const enrollment = await Enrollment.findOne({ userId: decoded.id, courseId: req.params.courseId });
        res.json({ isEnrolled: !!enrollment });
    } catch (error) {
        res.json({ isEnrolled: false });
    }
});

app.post('/api/courses/:courseId/enroll', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول أولاً' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const existingEnrollment = await Enrollment.findOne({ userId, courseId: req.params.courseId });
        if (existingEnrollment) {
            return res.json({ success: true, message: 'أنت مسجل بالفعل في هذا الكورس' });
        }

        const newEnrollment = new Enrollment({
            userId,
            courseId: req.params.courseId,
            completedLessons: []
        });

        await newEnrollment.save();
        res.json({ success: true, message: 'تم الاشتراك بنجاح!' });
    } catch (error) {
        console.error('❌ خطأ في الاشتراك:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء الاشتراك' });
    }
});

// ==========================================
// 📊 مسارات لوحة تحكم الأستاذ (Instructor Dashboard)
// ==========================================
app.get('/api/instructor/stats', verifyInstructor, async (req, res) => {
    try {
        const instructorId = req.user.id;
        const myCourses = await Course.find({ instructor: instructorId });
        const courseIds = myCourses.map(c => c._id);
        const enrollments = await Enrollment.find({ courseId: { $in: courseIds } });

        const totalCourses = myCourses.length;
        const totalStudents = enrollments.length;

        let totalRevenue = 0;
        myCourses.forEach(course => {
            const courseEnrollmentsCount = enrollments.filter(e => e.courseId.toString() === course._id.toString()).length;
            totalRevenue += courseEnrollmentsCount * course.price;
        });

        res.json({ success: true, stats: { totalCourses, totalStudents, totalRevenue } });
    } catch (error) {
        console.error('❌ خطأ في جلب الإحصائيات:', error);
        res.status(500).json({ error: 'فشل في جلب الإحصائيات' });
    }
});

// ==========================================
// 🏆 مسارات نقابة الصيادين (Leaderboard / Rankings)
// ==========================================
app.get('/api/leaderboard', async (req, res) => {
    try {
        const topPlayers = await User.find({})
            .sort({ exp: -1 })
            .limit(50)
            .select('name exp rank');

        res.json({ success: true, leaderboard: topPlayers });
    } catch (error) {
        console.error('❌ خطأ في جلب لوحة الصدارة:', error);
        res.status(500).json({ error: 'فشل في تحميل بيانات النقابة' });
    }
});

// ==========================================
// 📜 مسارات وثائق الإثبات (Certificates)
// ==========================================
const handleIssueCertificate = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'غير مصرح' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const enrollment = await Enrollment.findOne({ userId: decoded.id, courseId: req.params.courseId });

        if (!enrollment) return res.status(404).json({ error: 'لم يتم العثور على الاشتراك' });

        const totalLessons = await Lesson.countDocuments({ courseId: req.params.courseId });
        const progress = totalLessons > 0 ? (enrollment.completedLessons.length / totalLessons) * 100 : 0;

        if (progress < 100) {
            return res.status(400).json({ error: 'يجب إنهاء الكورس بالكامل لاستلام الشهادة' });
        }

        if (!enrollment.certificate.isIssued) {
            const uniqueId = 'CERT-' + crypto.randomBytes(4).toString('hex').toUpperCase();

            enrollment.certificate = {
                isIssued: true,
                certificateId: uniqueId,
                issuedAt: new Date()
            };
            await enrollment.save();
        }

        res.json({ success: true, certificateId: enrollment.certificate.certificateId });
    } catch (error) {
        console.error('❌ خطأ في إصدار الشهادة:', error);
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
};

app.post('/api/courses/:courseId/issue-certificate', handleIssueCertificate);
app.post('/api/certificates/issue/:courseId', handleIssueCertificate);

app.get('/api/certificates/verify/:certId', async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ 'certificate.certificateId': req.params.certId })
            .populate('userId', 'name')
            .populate('courseId', 'title thumbnail');

        if (!enrollment || !enrollment.certificate.isIssued) {
            return res.json({ isValid: false });
        }

        res.json({
            isValid: true,
            studentName: enrollment.userId.name,
            courseTitle: enrollment.courseId.title,
            issueDate: enrollment.certificate.issuedAt,
            certificateId: enrollment.certificate.certificateId
        });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في التحقق' });
    }
});

// ==========================================
// 🛡️ مسارات ترقية اللاعبين (Role Upgrades)
// ==========================================
app.post('/api/user/become-instructor', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });

        user.role = 'instructor';
        await user.save();

        res.json({ success: true, message: 'تمت ترقيتك إلى رتبة صانع محتوى بنجاح!', newRole: user.role });
    } catch (error) {
        console.error('❌ خطأ في الترقية:', error);
        res.status(500).json({ error: 'حدث خطأ في النظام' });
    }
});

// ==========================================
// 🚀 جسر الاستقبال التلقائي المحصن من (AutoFactory)
// يدعم التطهير التلقائي للمصفوفات المتداخلة + منع تكرار الكورسات عند إعادة الرفع!
// ==========================================
app.post('/api/courses/auto-import', async (req, res) => {
    const {
        courseTitle,
        courseDescription,
        difficulty,
        estimatedHours,
        certificateMeta,
        blueprint
    } = req.body;

    if (!courseTitle || !blueprint) {
        return res.status(400).json({ error: 'بيانات الكورس غير مكتملة!' });
    }

    try {
        const cleanedTitle = cleanCourseTitlePrefix(courseTitle);
        console.log(`\n📥 [استقبال آلي] جاري رفع/تحديث كورس: ${cleanedTitle}`);

        const systemInstructor = await User.findOne({ role: { $in: ['instructor', 'admin'] } });
        if (!systemInstructor) {
            return res.status(500).json({ error: 'لا يوجد حساب أستاذ في النظام لربط الكورس به!' });
        }

        console.log(`   🔗 سيتم ربط الكورس الآلي بالأستاذ: ${systemInstructor.name}`);

        // 🛡️ فحص ذكي لمنع تكرار الكورسات إذا تم رفع نفس الشهادة مرة ثانية:
        // نبحث عن الكورس سواء بعنوانه النظيف أو عنوانه القديم المكرر
        let targetCourse = await Course.findOne({
            $or: [
                { title: cleanedTitle },
                { title: courseTitle }
            ]
        });

        const parsedHours = parseInt(String(estimatedHours || '18').match(/\d+/)?.[0] || '18', 10);

        if (targetCourse) {
            targetCourse.title = cleanedTitle;
            targetCourse.description = courseDescription || targetCourse.description;
            targetCourse.difficulty = difficulty || targetCourse.difficulty || '';
            targetCourse.estimatedHours = parsedHours;
            targetCourse.certificateMeta = certificateMeta || targetCourse.certificateMeta || {};
            await targetCourse.save();

            // مسح الدروس الجزئية القديمة لإعادة كتابتها بشكل نظيف وكامل
            await Lesson.deleteMany({ courseId: targetCourse._id });
            console.log(`   🔄 تم العثور على الكورس مسبقاً وتحديث هيكله (ID: ${targetCourse._id}) بدون تكرار!`);
        } else {
            targetCourse = new Course({
                title: cleanedTitle,
                description: courseDescription || cleanedTitle,
                difficulty: difficulty || '',
                estimatedHours: parsedHours,
                price: 0,
                thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
                certificateMeta: certificateMeta || {},
                instructor: systemInstructor._id,
                isPublished: true
            });
            await targetCourse.save();
            console.log(`   ✅ تم إنشاء الهيكل الأساسي الجديد (ID: ${targetCourse._id})`);
        }

        // 2. تطهير ومعالجة وحفظ جميع الدروس
        let lessonOrder = 1;
        const lessonsToInsert = [];

        for (const section of (Array.isArray(blueprint) ? blueprint : [])) {
            const secName = section?.sectionName || 'الوحدة 1: الأساسيات';
            const rawLessons = Array.isArray(section?.lessons) ? section.lessons : [];

            for (const lesson of rawLessons) {
                if (lesson && (lesson.isForged || lesson.content || lesson.bossQuiz?.length)) {
                    const sanitized = sanitizeLessonData(lesson, targetCourse._id, secName, lessonOrder++);
                    lessonsToInsert.push(sanitized);
                }
            }
        }

        if (lessonsToInsert.length > 0) {
            await Lesson.insertMany(lessonsToInsert);
        }

        console.log(`🎉 [نجاح] اكتمل رفع الكورس (${lessonsToInsert.length} درساً وتحدياً) بالكامل إلى قاعدة البيانات!`);
        res.json({
            success: true,
            courseId: targetCourse._id,
            lessonsCount: lessonsToInsert.length,
            message: "تمت المزامنة بنجاح!"
        });

    } catch (error) {
        console.error('❌ خطأ في استيراد الكورس:', error);
        res.status(500).json({ error: 'حدث خطأ داخلي أثناء استيراد الكورس: ' + error.message });
    }
});



// ==========================================
// 💾 مسار المزامنة الشاملة للكورس والدروس والوحدات في السيرفر الرئيسي (5001)
// ==========================================
app.post('/api/courses/:courseId/sync-full-course', async (req, res) => {
    const { courseId } = req.params;
    const { lessonsList, unitSummariesMap, courseTitle, courseDescription } = req.body;

    if (!courseId || !Array.isArray(lessonsList)) {
        return res.status(400).json({ success: false, error: 'بيانات المزامنة غير مكتملة.' });
    }

    try {
        console.log(`\n☁️ [Master Sync 5001] جاري حفظ ومزامنة الكورس (${courseId}) بعدد (${lessonsList.length}) درساً...`);

        // 1. استخراج المعرفات الحقيقية الموجودة حالياً في الواجهة
        const incomingValidIds = lessonsList
            .filter(l => l._id && mongoose.Types.ObjectId.isValid(String(l._id)))
            .map(l => new mongoose.Types.ObjectId(String(l._id)));

        // 2. حذف أي درس قديم في قاعدة البيانات تم حذفه من الواجهة
        const deleteResult = await Lesson.deleteMany({
            courseId: new mongoose.Types.ObjectId(courseId),
            _id: { $nin: incomingValidIds }
        });
        console.log(`   🗑️ تم تنظيف ${deleteResult.deletedCount} دروس محذوفة.`);

        let updatedCount = 0;
        let insertedCount = 0;

        // 3. تحديث الدروس الموجودة وإدراج الدروس المضافة حديثاً بالترتيب الدقيق
        for (let i = 0; i < lessonsList.length; i++) {
            const les = lessonsList[i];
            const cleanPayload = sanitizeLessonData(
                les,
                new mongoose.Types.ObjectId(courseId),
                les.section || 'الوحدة 1: الأساسيات',
                i + 1
            );

            // الحفاظ على خصائص الودجات والتعديلات الجراحية الخاصة بالدرس
            const fullLessonFields = {
                ...cleanPayload,
                order: i + 1,
                sectionOrder: les.sectionOrder || 1,
                hideMistakesWidget: Boolean(les.hideMistakesWidget),
                hideLegoWidget: Boolean(les.hideLegoWidget),
                hideLadderWidget: Boolean(les.hideLadderWidget),
                hideSpeakClassWidget: Boolean(les.hideSpeakClassWidget),
                hideCodingWidget: Boolean(les.hideCodingWidget),
                hideQuestWidget: Boolean(les.hideQuestWidget),
                customMistakeRows: les.customMistakeRows || null,
                customLegoEquations: les.customLegoEquations || null,
                customLadderSteps: les.customLadderSteps || null,
                customVoiceTitle: les.customVoiceTitle || null,
                updatedAt: new Date()
            };

            const isValidObjId = les._id && mongoose.Types.ObjectId.isValid(String(les._id));
            if (isValidObjId) {
                const existing = await Lesson.findByIdAndUpdate(
                    les._id,
                    { $set: fullLessonFields },
                    { new: true }
                );
                if (existing) {
                    updatedCount++;
                } else {
                    const created = new Lesson(fullLessonFields);
                    await created.save();
                    insertedCount++;
                }
            } else {
                const created = new Lesson(fullLessonFields);
                await created.save();
                insertedCount++;
            }
        }

        // 4. تحديث بيانات الكورس وملخصات الوحدات في وثيقة Course
        const courseDoc = await Course.findById(courseId);
        if (courseDoc) {
            if (courseTitle) courseDoc.title = cleanCourseTitlePrefix(courseTitle);
            if (courseDescription) courseDoc.description = courseDescription;
            if (unitSummariesMap && typeof unitSummariesMap === 'object') {
                courseDoc.certificateMeta = {
                    ...(courseDoc.certificateMeta || {}),
                    unitSummariesMap
                };
                courseDoc.markModified('certificateMeta');
            }
            // إزالة أي نسخ قديمة مكررة داخل وثيقة الكورس لتكون مجموعة Lesson هي المرجع الوحيد
            courseDoc.set('courses', undefined, { strict: false });
            courseDoc.set('sections', undefined, { strict: false });
            courseDoc.set('blueprint', undefined, { strict: false });
            await courseDoc.save();
        }

        // 5. جلب الدروس المحدثة بمعرفاتها الحقيقية لإرجاعها للواجهة فوراً
        const freshLessons = await Lesson.find({ courseId: new mongoose.Types.ObjectId(courseId) }).sort({ order: 1 });

        console.log(`✅ [Master Sync 5001] اكتمل الحفظ بنجاح: (تحديث ${updatedCount}) | (إنشاء ${insertedCount}).`);
        res.json({
            success: true,
            updatedCount,
            insertedCount,
            lessons: freshLessons,
            message: 'تم حفظ جميع التعديلات في قاعدة بيانات المنصة بنجاح!'
        });
    } catch (error) {
        console.error('❌ خطأ في المزامنة الشاملة (5001):', error);
        res.status(500).json({ success: false, error: 'فشل في حفظ التعديلات في قاعدة البيانات.' });
    }
});


// ==========================================
// تشغيل السيرفر
// ==========================================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 سيرفر Cherif Platform يعمل بقوة على المنفذ http://localhost:${PORT}`);
});
```

---

