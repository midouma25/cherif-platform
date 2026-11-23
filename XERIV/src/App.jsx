import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Systems from './pages/Systems';
import Pulse from './pages/Pulse'; // 👈 استيراد הגناح التسويقي (المرصد)

// صفحة مؤقتة لـ SSO (لم نبرمجها بعد)
const Auth = () => <div className="min-h-screen flex items-center justify-center text-4xl font-black text-cyan-400">XERIV SSO (بوابة الدخول)</div>;

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
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
};

export default App;