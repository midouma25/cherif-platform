import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Code, Database, Briefcase, Lock, Sparkles, Terminal } from 'lucide-react';
import Vault from './Vault';
import B2B from './B2B';
import Academy from './Academy';
import { AuthProvider } from './AuthContext';
import AdminDashboard from './AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
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






const App = () => {
  return (
    // الغلاف يجب أن يكون هنا، يحيط بالـ Router وكل شيء
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans" dir="rtl">
          <Navbar />
          <main className="max-w-6xl mx-auto">
            <Routes>
               {/* مساراتك هنا */}
               <Route path="/" element={<Home />} />
               <Route path="/vault" element={<Vault />} />

                <Route path="/academy" element={<Academy />} /> 
              <Route path="/b2b" element={<B2B />} />
               <Route path="/admin" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />


               {/* ... */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;