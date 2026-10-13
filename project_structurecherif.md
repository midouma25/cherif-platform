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
    "react-syntax-highlighter": "^16.1.1"
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, BookOpen, Clock, PlayCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Academy = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  // فلترة الكورسات حسب البحث
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-6 animate-fade-in-up">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* الترويسة وشريط البحث */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 z-10">
            أكاديمية <span className="text-emerald-500">Cherif.Dev</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-8 z-10">
            ارتقِ بمهاراتك البرمجية والمالية. كورسات مكثفة، تطبيقات عملية، وخلاصة سنوات من الهندسة في مكان واحد.
          </p>

          <div className="relative w-full max-w-xl z-10">
            <Search className="absolute right-4 top-4 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن كورس (مثال: بايثون، MERN)..." 
              className="w-full bg-gray-950 border border-gray-700 text-white rounded-2xl py-4 pr-12 pl-4 focus:border-emerald-500 outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* عرض الكورسات */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div key={course._id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all flex flex-col">
                  
                  {/* صورة الكورس */}
                  <div className="h-52 bg-gray-800 relative overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <BookOpen size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-gray-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-black text-sm border border-gray-700">
                      {course.price === 0 ? <span className="text-emerald-400">مجاني</span> : `$${course.price}`}
                    </div>
                  </div>

                  {/* تفاصيل الكورس */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 text-yellow-500 text-xs mb-3">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <span className="text-gray-500 ml-1">(5.0)</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">{course.description}</p>
                    
                    {/* الفاصل المرن لضمان بقاء الزر في الأسفل */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-gray-500 text-xs mb-4 pb-4 border-b border-gray-800">
                        <div className="flex items-center gap-1"><Clock size={14} /> تعلم بالوتيرة التي تناسبك</div>
                        <div className="flex items-center gap-1"><PlayCircle size={14} /> وصول مدى الحياة</div>
                      </div>
                      
                      {/* زر الاشتراك (مؤقتاً يوجه للمكتبة، لاحقاً سنبرمج صفحة الشراء) */}
<Link to={`/course/${course._id}`} className="block w-full bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white text-center font-bold py-3 rounded-xl transition-all border border-emerald-500/20 hover:border-emerald-500">
  عرض التفاصيل
</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-700" />
                <p>لا توجد كورسات تطابق بحثك حالياً.</p>
              </div>
            )}
          </div>
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
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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


// صفحة مؤقتة للرئيسية
const Home = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in-up">
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 leading-tight">
        هندسة برمجيات، ذكاء اصطناعي،<br />وأنظمة تداول خوارزمية.
      </h1>
      <Link to="/academy" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        تصفح الأكاديمية
      </Link>
    </div>
);


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans" dir="rtl">
          
          {/* الشريط العلوي المستقل */}
          <Navbar />
          
          <main className="max-w-6xl mx-auto">
            <Routes>
              {/* مسارات عامة */}
              <Route path="/" element={<Home />} />
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
import { Award, CheckCircle, Printer, Share2, ShieldCheck, ArrowRight } from 'lucide-react';

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

  if (loading) return <div className="min-h-screen bg-gray-950 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div></div>;

  if (!certData) return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center text-white">
      <ShieldCheck size={64} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-black mb-2">وثيقة غير صالحة</h2>
      <p className="text-gray-400">لم يتم العثور على هذا الرقم التسلسلي في سجلات النظام.</p>
      <Link to="/" className="mt-6 text-yellow-500 hover:text-yellow-400 font-bold">العودة للرئيسية</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-6 flex flex-col items-center">
      
      {/* أزرار التحكم (تختفي عند الطباعة) */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 print:hidden">
        <Link to="/hub" className="text-gray-400 hover:text-white flex items-center gap-2 font-bold transition-colors">
          <ArrowRight size={20} /> العودة للمكتبة
        </Link>
        <div className="flex gap-4">
          <button onClick={handleCopyLink} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
            {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Share2 size={18} />}
            {copied ? 'تم النسخ' : 'مشاركة الرابط'}
          </button>
          <button onClick={handlePrint} className="bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-gray-950 px-6 py-2 rounded-lg font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Printer size={18} /> طباعة / تصدير PDF
          </button>
        </div>
      </div>

      {/* الشهادة نفسها (المنطقة التي سيتم طباعتها) */}
      <div className="w-full max-w-4xl bg-[#0a0f16] border border-gray-800 p-2 rounded-xl shadow-2xl relative print:border-none print:shadow-none print:bg-white print:p-0">
        <div className="border border-gray-800 p-12 md:p-20 text-center relative overflow-hidden print:border-gray-300 print:text-black">
          
          {/* تأثيرات الإضاءة */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none print:hidden"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none print:hidden"></div>

          {/* ختم التوثيق */}
          <div className="absolute top-8 left-8 flex flex-col items-center opacity-80">
            <ShieldCheck size={48} className="text-yellow-500 mb-2 print:text-gray-600" />
            <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase print:text-gray-400">Verified Credential</span>
          </div>

          <div className="relative z-10">
            <h3 className="text-yellow-500 font-bold tracking-[0.2em] mb-8 text-sm md:text-base print:text-gray-500">شهادة إتمام مسار تقني</h3>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tight print:text-black">
              وثيقة إثبات كفاءة
            </h1>
            
            <p className="text-gray-400 mb-4 text-lg print:text-gray-600">يشهد النظام بأن المطور:</p>
            <h2 className="text-3xl md:text-4xl font-black text-blue-400 mb-12 print:text-black">{certData.studentName}</h2>
            
            <p className="text-gray-400 mb-4 text-lg print:text-gray-600">قد أتم بنجاح كافة التحديات والمتطلبات الخاصة بمسار:</p>
            <h3 className="text-2xl font-bold text-white mb-16 max-w-2xl mx-auto leading-relaxed print:text-black">
              {certData.courseTitle}
            </h3>

            {/* معلومات الإصدار */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 border-t border-gray-800/50 pt-8 print:border-gray-200">
              <div className="text-center">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-gray-400">تاريخ الإصدار</p>
                <p className="text-white font-mono print:text-black">{new Date(certData.issueDate).toLocaleDateString('en-GB')}</p>
              </div>
              
              <Award size={40} className="text-yellow-500 print:text-gray-400" />
              
              <div className="text-center">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-gray-400">المُعرّف الرقمي (ID)</p>
                <p className="text-white font-mono print:text-black">{certData.certificateId}</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* ستايل مخصص للطباعة */}
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

## `cherif-platform\src\Classroom.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BookOpen, CheckCircle, Menu, X, ArrowRight, Terminal, Code , HelpCircle  } from 'lucide-react';

const Classroom = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  // 🆕 حالات تتبع الاختبار (Quiz State)
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  // 🆕 حالات التتبع (التقدم)
  const [completedLessons, setCompletedLessons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('cherif_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // جلب البيانات مع تقدم الطالب في نفس الوقت
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

  // 🆕 دالة الضغط على زر "أنهيت الدرس"
  const handleCompleteLesson = async () => {
    const token = localStorage.getItem('cherif_token');
    if (!token) return alert("يجب عليك تسجيل الدخول من الخزنة السرية لحفظ تقدمك!");

    try {
      const res = await axios.post(`http://127.0.0.1:5001/api/courses/${id}/complete-lesson`, 
        { lessonId: activeLesson._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setCompletedLessons(res.data.completedLessons); // تحديث قائمة المكتمل
        
        // الانتقال الآلي للدرس التالي (Dopamine hit 🚀)
        const currentIndex = lessons.findIndex(l => l._id === activeLesson._id);
        if (currentIndex < lessons.length - 1) {
          setActiveLesson(lessons[currentIndex + 1]);
        }
      }
    } catch (error) {
      alert("حدث خطأ أثناء حفظ تقدمك.");
    }
  };

  // 🆕 حساب نسبة التقدم المئوية (%)
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0;
  const isCurrentLessonCompleted = completedLessons.includes(activeLesson?._id);

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div></div>;
// 🆕 دالة اختيار الإجابة
  const handleSelectAnswer = (questionIndex, optionIndex) => {
    // نمنع تغيير الإجابة إذا تم تسليم الاختبار
    if (isQuizSubmitted) return; 
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  // 🆕 دالة تسليم الاختبار
  const handleSubmitQuiz = () => {
    // التأكد من أن الطالب أجاب على جميع الأسئلة
    if (Object.keys(selectedAnswers).length < activeLesson.quiz.length) {
      alert("الرجاء الإجابة على جميع الأسئلة قبل التحقق!");
      return;
    }
    setIsQuizSubmitted(true);
  };
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row font-sans text-gray-200">
      
      {/* القائمة الجانبية (Syllabus Sidebar) */}
      <div className={`fixed md:static inset-y-0 right-0 z-40 w-72 bg-gray-900 border-l border-gray-800 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} transition-transform duration-300 flex flex-col`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <Link to={`/course/${id}`} className="text-emerald-500 hover:text-emerald-400 flex items-center gap-2 font-bold text-sm">
            <ArrowRight size={16} /> العودة
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        
        <div className="p-6 border-b border-gray-800">
          <h2 className="font-black text-white text-lg leading-tight">{course?.title}</h2>
          
          {/* 🆕 شريط التقدم الديناميكي */}
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-4 overflow-hidden relative">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-bold">{progressPercentage}% مكتمل</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson._id);
            const isActive = activeLesson?._id === lesson._id;
            
            return (
              <button 
                key={lesson._id}
              onClick={() => { 
                  setActiveLesson(lesson); 
                  setSidebarOpen(false); 
                  // 🆕 تصفير الاختبار عند الانتقال لدرس جديد
                  setSelectedAnswers({});
                  setIsQuizSubmitted(false);
                }}
                
                className={`w-full text-right p-3 rounded-xl flex items-start gap-3 transition-all ${isActive ? 'bg-emerald-900/20 border border-emerald-500/30 text-emerald-400' : 'hover:bg-gray-800 text-gray-400'}`}
              >
                <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-black mt-0.5 transition-colors ${isCompleted ? 'bg-emerald-500 text-white' : (isActive ? 'bg-emerald-900/50 text-emerald-500' : 'bg-gray-800 text-gray-500')}`}>
                  {isCompleted ? <CheckCircle size={12} strokeWidth={4} /> : lesson.order}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${isCompleted && !isActive ? 'text-gray-500 line-through decoration-gray-700' : ''}`}>{lesson.title}</p>
                </div>
              </button>
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
              <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">{activeLesson.title}</h1>
              
              {activeLesson.description && <p className="text-xl text-gray-400 mb-10 pb-10 border-b border-gray-800 leading-relaxed">{activeLesson.description}</p>}

              <div className="prose prose-invert prose-emerald max-w-none">
                {activeLesson.content ? (
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <div className="relative group rounded-xl overflow-hidden my-6 border border-gray-800 shadow-2xl">
                            <div className="bg-gray-900 text-gray-500 text-xs px-4 py-2 font-mono flex items-center gap-2 border-b border-gray-800"><Terminal size={14}/> {match[1]}</div>
                            <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1.5rem', background: '#0a0a0a' }} {...props}>
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (<code className="bg-gray-800 text-emerald-400 px-1.5 py-0.5 rounded-md text-sm font-mono border border-gray-700" {...props}>{children}</code>)
                      }
                    }}
                  >
                    {activeLesson.content}
                  </ReactMarkdown>
                ) : (
                  <div className="text-center py-20"><BookOpen size={48} className="mx-auto text-gray-600 mb-4" /><p className="text-gray-500">محتوى هذا الدرس قيد التجهيز.</p></div>
                )}
              </div>

{/* 🆕 إضافة عرض الكود البرمجي (Code Snippet) */}
              {activeLesson.codeSnippet && activeLesson.codeSnippet.trim() !== '' && (
                <div className="mt-10 mb-10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Code className="text-emerald-500" size={24} /> الكود البرمجي المرفق
                  </h3>
                  <div className="relative group rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                    <div className="bg-gray-900 text-gray-500 text-xs px-4 py-2 font-mono flex items-center gap-2 border-b border-gray-800">
                      <Terminal size={14}/> الشفرة (Snippet)
                    </div>
                    {/* يمكنك تحديد لغة افتراضية أو محاولة اكتشافها */}
                    <SyntaxHighlighter style={vscDarkPlus} language="javascript" PreTag="div" customStyle={{ margin: 0, padding: '1.5rem', background: '#0a0a0a' }}>
                      {activeLesson.codeSnippet}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}
{/* 🆕 عرض الاختبارات (Quizzes) التفاعلية */}
              {activeLesson.quiz && activeLesson.quiz.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-800">
                  <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                    <HelpCircle className="text-purple-500" size={28} /> اختبر معلوماتك
                  </h3>
                  
                  {activeLesson.quiz.map((q, qIndex) => (
                    <div key={qIndex} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
                      <p className="text-white font-bold text-lg mb-6 leading-relaxed">
                        {q.question}
                      </p>
                      <div className="space-y-3">
                        {q.options.map((opt, oIdx) => {
                          
                          // منطق التلوين الذكي
                          const isSelected = selectedAnswers[qIndex] === oIdx;
                          const isCorrect = q.correctAnswerIndex === oIdx;
                          
                          let boxStyle = "border-gray-800 bg-gray-950 text-gray-300 hover:border-emerald-500/50 cursor-pointer";
                          let circleStyle = "border-gray-600";
                          
                          // إذا تم تسليم الاختبار
                          if (isQuizSubmitted) {
                            if (isCorrect) {
                              // تلوين الإجابة الصحيحة دائماً بالأخضر
                              boxStyle = "border-emerald-500 bg-emerald-900/20 text-emerald-400";
                              circleStyle = "border-emerald-500 bg-emerald-500";
                            } else if (isSelected && !isCorrect) {
                              // تلوين إجابة الطالب الخاطئة بالأحمر
                              boxStyle = "border-red-500 bg-red-900/20 text-red-400";
                              circleStyle = "border-red-500 bg-red-500";
                            } else {
                              // باقي الخيارات تظل باهتة
                              boxStyle = "border-gray-800 bg-gray-950 text-gray-500 opacity-50 cursor-not-allowed";
                              circleStyle = "border-gray-700";
                            }
                          } else if (isSelected) {
                            // إذا اختارها الطالب قبل التسليم (تلوين أزرق أو زمردي خفيف ليدل على الاختيار)
                            boxStyle = "border-blue-500 bg-blue-900/20 text-blue-400";
                            circleStyle = "border-blue-500 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]";
                          }

                          return (
                            <div 
                              key={oIdx} 
                              onClick={() => handleSelectAnswer(qIndex, oIdx)}
                              className={`p-4 rounded-xl border font-bold flex items-center gap-3 transition-colors ${boxStyle} ${isQuizSubmitted ? 'cursor-not-allowed' : ''}`}
                            >
                              <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${circleStyle}`}>
                                {/* يمكن إضافة أيقونة صح أو خطأ هنا إن أردت */}
                              </div>
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* رسالة توضيحية تظهر تحت السؤال بعد التسليم */}
                      {isQuizSubmitted && (
                        <div className={`mt-4 p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${selectedAnswers[qIndex] === q.correctAnswerIndex ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
                           {selectedAnswers[qIndex] === q.correctAnswerIndex ? (
                             <><CheckCircle size={18} /> إجابة صحيحة، أحسنت!</>
                           ) : (
                             <><X size={18} /> إجابة خاطئة. الإجابة الصحيحة هي: {q.options[q.correctAnswerIndex]}</>
                           )}
                        </div>
                      )}

                    </div>
                  ))}
                  
                  {/* زر تسليم الاختبار */}
                  {!isQuizSubmitted && (
                    <button 
                      onClick={handleSubmitQuiz}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] mt-2"
                    >
                      تحقق من الإجابات 🧠
                    </button>
                  )}
                </div>
              )}

              {/* 🆕 الزر الديناميكي المطور */}
              <div className="mt-16 pt-8 border-t border-gray-800 flex justify-between items-center">
                {isCurrentLessonCompleted ? (
                  <div className="bg-emerald-900/20 text-emerald-500 font-bold py-4 px-8 rounded-xl flex items-center gap-3 border border-emerald-500/20">
                    <CheckCircle size={20} /> لقد أتممت هذا الدرس بنجاح
                  </div>
                ) : (
                  <button onClick={handleCompleteLesson} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:-translate-y-1">
                    <CheckCircle size={20} /> لقد أنهيت هذا الدرس
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
```

---

## `cherif-platform\src\CourseDetails.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, Clock, Award, Shield, BookOpen, ArrowRight, Lock, Video } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]); // حالة جديدة لتخزين الدروس
  const [loading, setLoading] = useState(true);

// تحديث الـ useEffect الأول ليتحقق أيضاً من اشتراك المستخدم
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('cherif_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [courseRes, lessonsRes, enrollRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5001/api/courses/public/${id}`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/lessons`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/check-enrollment`, { headers }).catch(() => ({ data: { isEnrolled: false } }))
        ]);
        
        if (courseRes.data.success) setCourse(courseRes.data.course);
        if (lessonsRes.data.success) setLessons(lessonsRes.data.lessons);
        if (enrollRes.data) setIsEnrolled(enrollRes.data.isEnrolled); // 🆕 تحديث حالة الاشتراك
        
      } catch (err) {
        console.error('خطأ في جلب البيانات', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 🆕 دالة الاشتراك عند الضغط على الزر
  const handleEnrollment = async () => {
    const token = localStorage.getItem('cherif_token');
    
    // إذا لم يكن مسجلاً للدخول، نوجهه للخزنة
    if (!token) {
      alert("يجب عليك تسجيل الدخول من الخزنة السرية لتتمكن من الاشتراك!");
      navigate('/auth'); // افترض أن مسار تسجيل الدخول هو /auth أو /vault
      return;
    }

    setIsEnrolling(true);
    try {
      const res = await axios.post(`http://127.0.0.1:5001/api/courses/${id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setIsEnrolled(true);
        // توجيهه فوراً للمختبر التفاعلي (دوبامين لحظي!)
        navigate(`/course/${id}/learn`);
      }
    } catch (error) {
      alert("حدث خطأ أثناء الاشتراك.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>;
  if (!course) return <div className="text-center py-20 text-white text-2xl font-bold">❌ الكورس غير موجود</div>;

  return (
    <div className="min-h-screen pb-20 animate-fade-in-up">
      
      {/* القسم العلوي (Hero Section) */}
      <div className="bg-gray-950 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-950 via-gray-950/90 to-transparent z-10"></div>
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="absolute top-0 right-0 w-2/3 h-full object-cover opacity-30 z-0" />
        )}
        
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-20 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <Link to="/academy" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors font-bold text-sm mb-4">
              <ArrowRight size={16} /> العودة للأكاديمية
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">{course.title}</h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">{course.description}</p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-gray-300 font-bold"><Clock className="text-emerald-500" /> وصول مدى الحياة</div>
              <div className="flex items-center gap-2 text-gray-300 font-bold"><Award className="text-emerald-500" /> شهادة إتمام</div>
              <div className="flex items-center gap-2 text-gray-300 font-bold"><Shield className="text-emerald-500" /> ضمان استرجاع 14 يوم</div>
            </div>
          </div>
          
          {/* بطاقة الشراء */}
          <div className="w-full md:w-96 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl shrink-0 text-center">
            <div className="text-5xl font-black text-white mb-2">
              {course.price === 0 ? <span className="text-emerald-400">مجاني!</span> : `$${course.price}`}
            </div>
            <p className="text-gray-500 mb-8 font-bold text-sm">دفعة واحدة، بدون اشتراكات مخفية.</p>
            
          {isEnrolled ? (
              <button onClick={() => navigate(`/course/${id}/learn`)} className="w-full bg-gray-800 hover:bg-gray-700 text-emerald-400 border border-emerald-500/30 font-black py-4 rounded-xl transition-all mb-4 flex justify-center items-center gap-2">
                <PlayCircle size={20} /> متابعة التعلم (أنت مشترك)
              </button>
            ) : (
              <button 
                onClick={handleEnrollment} 
                disabled={isEnrolling}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isEnrolling ? 'جاري تجهيز مختبرك...' : (
                  <><PlayCircle size={20} /> اشترك الآن وابدأ التعلم</>
                )}
              </button>
            )}
            <p className="text-xs text-gray-500">مدفوعات آمنة ومحمية بتشفير 256 بت.</p>
          </div>
        </div>
      </div>

      {/* قسم المنهج الدراسي الديناميكي (Dynamic Syllabus) */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <BookOpen className="text-emerald-500" /> المنهج الدراسي
          </h2>
          <span className="bg-gray-900 text-gray-400 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-800">
            {lessons.length} دروس
          </span>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
          {lessons.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <Video size={48} className="text-gray-700 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">جاري إعداد الدروس</h3>
              <p className="text-gray-500 text-sm">سيتم توفير محتوى هذا الكورس قريباً جداً.</p>
            </div>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson._id} className="p-6 border-b border-gray-800 flex items-center gap-4 hover:bg-gray-800/30 transition-colors group">
                
                {/* رقم الدرس (يتلون بالأخضر إذا كان مجانياً) */}
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black ${lesson.isFreePreview ? 'bg-emerald-900/30 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-gray-950 text-gray-600 border border-gray-800'}`}>
                  {lesson.order}
                </div>
                
                {/* تفاصيل الدرس */}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg transition-colors ${lesson.isFreePreview ? 'text-white group-hover:text-emerald-400' : 'text-gray-400'}`}>
                    {lesson.title}
                  </h3>
                  {lesson.description && <p className="text-gray-500 text-sm mt-1">{lesson.description}</p>}
                </div>
                
            {/* أيقونات الحالة (مجاني أم مقفل) */}
                {lesson.isFreePreview ? (
                  <Link 
                    to={`/course/${course._id}/learn`} 
                    className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    <PlayCircle size={14} /> معاينة مجانية
                  </Link>
                ) : (
                  <div className="text-gray-600 bg-gray-950 p-2 rounded-lg border border-gray-800" title="هذا الدرس مقفل. اشترك لمشاهدته.">
                    <Lock size={16} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
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
// 🆕 تم إضافة HelpCircle للاستيرادات لاستخدامها في زر الـ Quiz
import { Video, PlusCircle, LayoutDashboard, Edit, Trash2, ListVideo, ArrowRight, BarChart3, Users, DollarSign, BookOpen, CheckCircle, ChevronRight, ChevronLeft, Play, Eye, FileText, Code, HelpCircle, UploadCloud } from 'lucide-react';

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
  
 // 🆕 تم تحديث الحالة لتشمل codeSnippet و quiz
  const [lessonForm, setLessonForm] = useState({ 
    title: '', description: '', content: '', videoUrl: '', order: 1, 
    isFreePreview: false, section: 'الوحدة 1: الأساسيات', 
    codeSnippet: '', // 👈 تمت الإضافة هنا
    quiz: [] 
  });

  const contentTextareaRef = useRef(null);
// 🆕 حالات الاستيراد السحري (AutoFactory Import)
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

  // 🆕 تم تعديل وظيفة شريط الأدوات للـ quiz لفتح واجهة الأسئلة بدلاً من حقن نص
  const insertElement = (type) => {
    let snippet = '';
    if (type === 'video') document.getElementById('videoUrlInput')?.focus();
    if (type === 'article') snippet = '\n\n### عنوان فرعي جديد\nاكتب الشرح هنا...\n';
    if (type === 'code') snippet = '\n\n```javascript\n// اكتب الشفرة البرمجية هنا\nconst app = "CherifPlatform";\n```\n';
    
    if (type === 'quiz') {
      setLessonForm(prev => ({
        ...prev,
        quiz: [...(prev.quiz || []), { question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
      }));
      return; // توقف هنا ولا تضف نصاً للـ textarea
    }

    if (snippet) {
      setLessonForm(prev => ({ ...prev, content: prev.content + snippet }));
      if (contentTextareaRef.current) {
        contentTextareaRef.current.focus();
      }
    }
  };

  // 🆕 دوال إدارة واجهة الاختبار (تحديث السؤال، وتحديث الخيارات، وحذف سؤال)
  const handleQuizChange = (qIndex, field, value) => {
    const updatedQuiz = [...lessonForm.quiz];
    updatedQuiz[qIndex][field] = value;
    setLessonForm({ ...lessonForm, quiz: updatedQuiz });
  };

  const handleQuizOptionChange = (qIndex, optIndex, value) => {
    const updatedQuiz = [...lessonForm.quiz];
    updatedQuiz[qIndex].options[optIndex] = value;
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
      isFreePreview: false, section, 
      codeSnippet: '', // 👈 تمت الإضافة هنا
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
  // 📥 استيراد الكورس من ملف JSON (من AutoFactory)
  // ==========================================
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setIsImporting(true);
        const courseData = JSON.parse(event.target.result); // تحويل الملف النصي إلى كائن برمجي

        const token = localStorage.getItem('cherif_token');
        
        // إرسال الحزمة الضخمة إلى السيرفر الخاص بنا لفك تشفيرها وحفظها
        const res = await axios.post('http://127.0.0.1:5001/api/courses/auto-import', courseData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          alert('🎉 تم تفريغ الكورس السحري في قاعدة البيانات بنجاح!');
          fetchMyCourses(); // تحديث قائمة الكورسات لتظهر فوراً
          fetchStats();     // تحديث الإحصائيات (عدد الكورسات)
        }
      } catch (err) {
        console.error(err);
        alert('❌ فشل الاستيراد. تأكد من سيرفر المنصة أو من صلاحية ملف الـ JSON.');
      } finally {
        setIsImporting(false);
        e.target.value = null; // تفريغ الحقل ليسمح برفع نفس الملف مجدداً إن لزم الأمر
      }
    };
    reader.readAsText(file);
  };



  return (
    <div className="min-h-screen py-10 px-6 animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* القائمة الجانبية (تعرض فقط خارج باني المنهج) */}
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
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h2 className="text-2xl font-black text-white">المسارات المنشورة في النظام</h2>
                
                {/* 🆕 زر استيراد الـ JSON */}
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
                    استيراد كورس سحري (JSON)
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

        {/* 4️⃣ باني المناهج البصري المتقدم (The Master Forge) يغطي الشاشة */}
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

            {/* مساحة العمل ثلاثية الأبعاد */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* 1. العمود الأيمن: هيكل المنهج (الشجرة التفاعلية) */}
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
                                // 🆕 جلب الاختبارات إن وجدت
                                setLessonForm({ ...lesson, quiz: lesson.quiz || [] }); 
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

              {/* 2. العمود الأوسط: محرر العناصر (The Editor) */}
              <div className="flex-1 bg-[#0a0f16] flex flex-col overflow-y-auto">
                <div className="max-w-3xl w-full mx-auto p-8 space-y-8">
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-white">{editingLessonId ? 'تحرير الدرس المفتوح' : 'تهيئة درس جديد'}</h3>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-400 bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                      <input type="checkbox" className="accent-emerald-500 rounded" checked={lessonForm.isFreePreview} onChange={(e) => setLessonForm({...lessonForm, isFreePreview: e.target.checked})} /> 
                      متاح كمعاينة مجانية للمشاهدة
                    </label>
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
                      {/* 🆕 زر الاختبار المحدث */}
                      <button type="button" onClick={() => insertElement('quiz')} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:bg-purple-900/50 hover:text-purple-300 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-purple-500/50">
                        <HelpCircle size={16} className="text-purple-400" /> إضافة سؤال (Quiz)
                      </button>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
                      <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                        <Video size={18} className="text-blue-500" /> مصدر الفيديو
                      </label>
                      <input id="videoUrlInput" type="text" placeholder="رابط YouTube أو MP4..." className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 text-sm focus:border-blue-500 outline-none font-mono" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})} />
                    </div>

<div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
                      <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                        <Code size={18} className="text-yellow-500" /> الكود البرمجي (Code Snippet)
                      </label>
                      <textarea 
                        placeholder="اكتب الأكواد البرمجية هنا (سيتم عرضها بشكل مميز للطلاب)..." 
                        className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 text-sm h-32 font-mono focus:border-yellow-500 outline-none resize-none leading-relaxed" 
                        value={lessonForm.codeSnippet || ""} // 👈 إضافة || "" للحماية
                        onChange={(e) => setLessonForm({...lessonForm, codeSnippet: e.target.value})} 
                      ></textarea>
                    </div>

                    {/* 🆕 باني الاختبارات (Quiz Builder UI) */}
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
                  
                  {/* محاكاة مشغل الفيديو */}
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
                        <span className="text-xs font-bold">لا يوجد فيديو</span>
                      </div>
                    )}
                  </div>

                  {/* محاكاة العنوان والمحتوى */}
                  <h1 className="text-2xl font-black text-white mb-6 leading-tight">
                    {lessonForm.title || 'عنوان الدرس سيظهر هنا...'}
                  </h1>

                  <div className="prose prose-invert prose-sm max-w-none mb-8">
                    {lessonForm.content ? (
                      <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {lessonForm.content.split('```').map((block, index) => {
                          if (index % 2 !== 0) {
                            return <div key={index} className="bg-[#1e1e1e] p-4 my-4 rounded-xl border border-gray-700 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">{block}</div>;
                          }
                          return <span key={index}>{block}</span>;
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3 opacity-20">
                        <div className="h-3 bg-gray-500 rounded w-full"></div>
                        <div className="h-3 bg-gray-500 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-500 rounded w-4/6"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* 🆕 محاكاة واجهة الاختبار للطالب في المعاينة الحية */}
                  {lessonForm.quiz && lessonForm.quiz.length > 0 && (
                    <div className="border-t border-purple-900/50 pt-6 mt-6">
                      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2"><CheckCircle className="text-purple-500" size="{20}"/> اختبار المهارات</h3>
                      
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

                  {/* محاكاة زر إنهاء الدرس */}
                  <div className="mt-8 border-t border-gray-800 pt-6">
                    <div className="w-full bg-emerald-900/20 border border-emerald-500/30 text-emerald-500/50 py-3 rounded-xl font-bold flex justify-center items-center gap-2 text-sm cursor-not-allowed">
                      <CheckCircle size="{16}"/> لقد أنهيت هذا الدرس (محاكاة)
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
// السماح باستقبال حزم بيانات ضخمة (كورسات كاملة)
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
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// 3. مسارات المصادقة (Auth Routes)
// ==========================================

// أ) فحص هل الإيميل مسجل مسبقاً؟
app.post('/api/auth/check-email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        res.json({ exists: !!user, name: user ? user.name : null });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});

// ب) تسجيل مستخدم جديد عبر الخزنة (بكلمة المرور التي كتبها)
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

// ج) تسجيل الدخول الرسمي
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
        if(user) res.json({ success: true, message: 'مبروك! أصبحت المدير العام الآن. قم بتسجيل الدخول من جديد.' });
        else res.json({ error: 'لم يتم العثور على الإيميل' });
    } catch (error) { res.status(500).send('Error'); }
});

// ==========================================
// 5. نموذج الكورسات (Course Schema)
// ==========================================
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 }, // 0 تعني مجاني
    thumbnail: { type: String, default: '' }, // صورة الغلاف
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false }, // هل هو متاح للطلاب أم مسودة؟
    created_at: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', courseSchema);

// ==========================================
// 🛡️ حارس الأمان الخاص بالأساتذة (يسمح للأستاذ والمدير)
// ==========================================
const verifyInstructor = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'غير مصرح لك بالدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // نسمح بالدخول إذا كان أستاذاً أو مديراً عاماً
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

// أ) إنشاء كورس جديد
app.post('/api/courses', verifyInstructor, async (req, res) => {
    try {
        const { title, description, price, thumbnail } = req.body;
        
        const newCourse = new Course({
            title,
            description,
            price,
            thumbnail,
            instructor: req.user.id // نأخذ الـ ID من التوكن تلقائياً
        });

        await newCourse.save();
        res.json({ success: true, course: newCourse, message: 'تم إنشاء الكورس بنجاح!' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في إنشاء الكورس' });
    }
});

// ب) جلب الكورسات الخاصة بهذا الأستاذ فقط
app.get('/api/courses/my-courses', verifyInstructor, async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id }).sort({ created_at: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب الكورسات' });
    }
});

// ج) تعديل كورس موجود
app.put('/api/courses/:id', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });
        
        // الأمان: التأكد أن من يعدل الكورس هو صاحبه (أو المدير)
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك بتعديل هذا الكورس' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, course: updatedCourse, message: 'تم التعديل بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في تعديل الكورس' });
    }
});

// د) حذف كورس
app.delete('/api/courses/:id', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك بحذف هذا الكورس' });
        }

        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'تم حذف الكورس بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'فشل في حذف الكورس' });
    }
});


// ==========================================
// 🌍 مسارات الأكاديمية العامة (Public APIs)
// ==========================================

// جلب كل الكورسات (للجمهور والزوار)
app.get('/api/courses/public', async (req, res) => {
    try {
        // نجلب كل الكورسات ونرتبها من الأحدث للأقدم
        const courses = await Course.find().sort({ created_at: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ error: 'فشل في جلب قائمة الكورسات' });
    }
});


// جلب كورس واحد بالتفصيل (للجمهور)
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
    content: { type: String, default: '' }, // محتوى الـ Markdown
    videoUrl: { type: String, default: '' }, 
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    isFreePreview: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    section: { type: String, default: 'الوحدة 1: الأساسيات' }, // 🆕 اسم الوحدة أو القسم
    codeSnippet: { type: String, default: '' }, // 🆕 الكود البرمجي
    quiz: [{ // 🆕 هيكل الاختبار التفاعلي
        question: String,
        options: [String],
        correctAnswerIndex: Number
    }],
    created_at: { type: Date, default: Date.now }
});

// تعريف النموذج (يجب أن يكون هنا قبل المسارات)
const Lesson = mongoose.model('Lesson', lessonSchema);


// ==========================================
// 📚 مسارات الدروس (Lesson APIs)
// ==========================================

// أ) جلب الدروس (مسار عام)
app.get('/api/courses/:courseId/lessons', async (req, res) => {
    try {
        const lessons = await Lesson.find({ courseId: req.params.courseId }).sort({ order: 1 });
        
        const safeLessons = lessons.map(lesson => ({
            _id: lesson._id,
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            isFreePreview: lesson.isFreePreview,
            order: lesson.order,
            section: lesson.section || 'الوحدة 1: الأساسيات', // تحصين القسم
            videoUrl: lesson.isFreePreview ? lesson.videoUrl : null,
            codeSnippet: lesson.codeSnippet || "", // 🛡️ تحصين قوي لمنع الاختفاء
            quiz: Array.isArray(lesson.quiz) && lesson.quiz.length > 0 ? lesson.quiz : [] // 🛡️ تحصين مصفوفة الاختبار
        }));

        res.json({ success: true, lessons: safeLessons });
    } catch (error) {
        console.error('❌ خطأ في جلب الدروس:', error);
        res.status(500).json({ error: 'فشل في جلب الدروس' });
    }
});

// ب) إضافة درس جديد (مسار محمي للأستاذ)
app.post('/api/courses/:courseId/lessons', verifyInstructor, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ error: 'الكورس غير موجود' });
        
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'غير مصرح لك' });
        }

        const newLesson = new Lesson({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            videoUrl: req.body.videoUrl, 
            order: req.body.order,
            isFreePreview: req.body.isFreePreview,
            courseId: req.params.courseId,
            section: req.body.section,
            codeSnippet: req.body.codeSnippet, // 🆕 أضف هذا
            quiz: req.body.quiz // 🆕 أضف هذا
        });

        await newLesson.save();
        res.json({ success: true, lesson: newLesson, message: 'تمت إضافة الدرس بنجاح' });
    } catch (error) {
        console.error('❌ خطأ في إضافة الدرس:', error);
        res.status(500).json({ error: 'فشل في إضافة الدرس' });
    }
});


// تحديث بيانات درس موجود
app.put('/api/lessons/:lessonId', async (req, res) => {
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(req.params.lessonId, req.body, { new: true });
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
    // 🆕 نظام الشهادات والتوثيق
    certificate: {
        isIssued: { type: Boolean, default: false },
        certificateId: { type: String, sparse: true }, // رقم تسلسلي فريد
        issuedAt: { type: Date }
    }
});


const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// ==========================================
// 🎮 مسارات نظام التقدم (Gamification APIs)
// ==========================================

// أ) جلب تقدم الطالب الحالي في الكورس
app.get('/api/courses/:courseId/progress', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ success: true, completedLessons: [] }); // زائر غير مسجل

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const enrollment = await Enrollment.findOne({ userId: decoded.id, courseId: req.params.courseId });
        res.json({ success: true, completedLessons: enrollment ? enrollment.completedLessons : [] });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب التقدم' });
    }
});

// ب) زر "أنهيت الدرس" (حفظ تقدم الطالب)
app.post('/api/courses/:courseId/complete-lesson', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول لحفظ تقدمك!' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const { lessonId } = req.body;

        // البحث عن اشتراك الطالب، وإن لم يوجد ننشئ له ملف اشتراك جديد
        let enrollment = await Enrollment.findOne({ userId, courseId: req.params.courseId });
        
        if (!enrollment) {
            enrollment = new Enrollment({ userId, courseId: req.params.courseId, completedLessons: [] });
        }

        // إذا لم يكن الدرس في قائمة المكتملة، أضفه!
        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
            await enrollment.save();
        }

        res.json({ success: true, completedLessons: enrollment.completedLessons });
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
        
        // 🆕 جلب بيانات اللاعب (الطالب)
        const userStats = await User.findById(decoded.id).select('exp rank name');

        const enrollments = await Enrollment.find({ userId: decoded.id }).populate('courseId');
        const learningData = await Promise.all(enrollments.map(async (enr) => {
            // ... (نفس كود حساب تقدم الكورسات الموجود لديك)
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

        // 🆕 إرسال بيانات اللاعب مع بيانات الكورسات
        res.json({ success: true, learning: learningData.filter(item => item !== null), userStats });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});



// جلب حالة اشتراك الطالب في كورس معين (هل يمتلك الكورس؟)
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

// تسجيل الطالب في الكورس (شراء / اشتراك مجاني)
app.post('/api/courses/:courseId/enroll', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول أولاً' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // التأكد مما إذا كان مسجلاً بالفعل
        const existingEnrollment = await Enrollment.findOne({ userId, courseId: req.params.courseId });
        if (existingEnrollment) {
            return res.json({ success: true, message: 'أنت مسجل بالفعل في هذا الكورس' });
        }

        // إنشاء اشتراك جديد
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

// ب) زر "أنهيت الدرس" (حفظ تقدم الطالب وزيادة الـ EXP)
app.post('/api/courses/:courseId/complete-lesson', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        const { lessonId } = req.body;

        let enrollment = await Enrollment.findOne({ userId, courseId: req.params.courseId });
        if (!enrollment) {
            enrollment = new Enrollment({ userId, courseId: req.params.courseId, completedLessons: [] });
        }

        let expGained = false; // للتأكد أن الطالب لن يأخذ نقاط على درس أنهاه سابقاً
        let newRank = '';

        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);
            await enrollment.save();
            expGained = true;

// 🆕 إضافة 50 EXP للمستخدم وتحديث رتبته (Solo Leveling / Monarch Logic)
            const user = await User.findById(userId);
            if (user) {
                user.exp += 50;
                
                // التدرج الجديد المرعب
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
        res.status(500).json({ error: 'خطأ في السيرفر' });
    }
});



// ==========================================
// 📊 مسارات لوحة تحكم الأستاذ (Instructor Dashboard)
// ==========================================
app.get('/api/instructor/stats', verifyInstructor, async (req, res) => {
    try {
        const instructorId = req.user.id;

        // 1. جلب كل الكورسات الخاصة بك
        const myCourses = await Course.find({ instructor: instructorId });
        const courseIds = myCourses.map(c => c._id);

        // 2. جلب كل الاشتراكات المرتبطة بكورساتك
        const enrollments = await Enrollment.find({ courseId: { $in: courseIds } });

        // 3. تحليل البيانات
        const totalCourses = myCourses.length;
        const totalStudents = enrollments.length; // عدد الاشتراكات الإجمالي
        
        // 4. حساب الأرباح (عدد المشتركين × سعر الكورس)
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
        // جلب أفضل 50 لاعباً مرتبين تنازلياً حسب نقاط الخبرة
        const topPlayers = await User.find({})
            .sort({ exp: -1 })
            .limit(50)
            .select('name exp rank'); // نجلب البيانات الآمنة فقط

        res.json({ success: true, leaderboard: topPlayers });
    } catch (error) {
        console.error('❌ خطأ في جلب لوحة الصدارة:', error);
        res.status(500).json({ error: 'فشل في تحميل بيانات النقابة' });
    }
});


// ==========================================
// 📜 مسارات وثائق الإثبات (Certificates)
// ==========================================

// 1. إصدار الشهادة للطالب (فقط إذا أكمل 100%)
app.post('/api/courses/:courseId/issue-certificate', async (req, res) => {
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

        // إذا لم تكن مصدرة من قبل، قم بتوليدها
        if (!enrollment.certificate.isIssued) {
            // توليد رقم تسلسلي فخم مثل: CERT-A1B2C3D4
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
});

// 2. التحقق من الشهادة (مسار عام للشركات وأصحاب العمل)
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

        // ترقية اللاعب إلى صانع محتوى (أستاذ)
        user.role = 'instructor';
        await user.save();

        res.json({ success: true, message: 'تمت ترقيتك إلى رتبة صانع محتوى بنجاح!', newRole: user.role });
    } catch (error) {
        console.error('❌ خطأ في الترقية:', error);
        res.status(500).json({ error: 'حدث خطأ في النظام' });
    }
});



// ==========================================
// 🚀 جسر الاستقبال التلقائي من (AutoFactory)
// ==========================================
app.post('/api/courses/auto-import', async (req, res) => {
    const { courseTitle, courseDescription, difficulty, blueprint } = req.body;

    if (!courseTitle || !blueprint) {
        return res.status(400).json({ error: 'بيانات الكورس غير مكتملة!' });
    }

    try {
        console.log(`\n📥 [استقبال آلي] جاري رفع كورس: ${courseTitle}`);

        // 🛠️ الحل: البحث عن حسابك (أول حساب instructor أو admin في النظام)
        // أو يمكنك استخدام إيميلك مباشرة: await User.findOne({ email: 'midouma25@gmail.com' });
        const systemInstructor = await User.findOne({ role: { $in: ['instructor', 'admin'] } });
        
        if (!systemInstructor) {
            return res.status(500).json({ error: 'لا يوجد حساب أستاذ في النظام لربط الكورس به!' });
        }

        console.log(`   🔗 سيتم ربط الكورس الآلي بالأستاذ: ${systemInstructor.name}`);

        // 1. إنشاء الكورس الرئيسي
        const newCourse = new Course({
            title: courseTitle,
            description: courseDescription,
            price: 0,
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
            // 🛠️ ربط الكورس بالـ ID الذي وجدناه
            instructor: systemInstructor._id 
        });
        const savedCourse = await newCourse.save();
        console.log(`   ✅ تم إنشاء الهيكل الأساسي (ID: ${savedCourse._id})`);

        // 2. معالجة وحفظ الدروس
        let lessonOrder = 1;
        for (const section of blueprint) {
            for (const lesson of section.lessons) {
                if (lesson.isForged) {
                    const newLesson = new Lesson({
                        courseId: savedCourse._id,
                        title: lesson.title,
                        description: "تم إنشاؤه تلقائياً عبر AutoFactory",
                        content: lesson.content || "محتوى قيد التجهيز...",
                        codeSnippet: lesson.codeSnippet || "",
                        videoUrl: "", 
                        order: lessonOrder++,
                        isFreePreview: false,
                        section: section.sectionName,
                        quiz: lesson.quiz && lesson.quiz.question ? [lesson.quiz] : []
                    });
                    await newLesson.save();
                }
            }
        }

        console.log(`🎉 [نجاح] اكتمل رفع الكورس بالكامل إلى قاعدة البيانات!`);
        res.json({ success: true, courseId: savedCourse._id, message: "تمت المزامنة بنجاح!" });

    } catch (error) {
        console.error('❌ خطأ في استيراد الكورس:', error);
        res.status(500).json({ error: 'حدث خطأ داخلي أثناء استيراد الكورس.' });
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

