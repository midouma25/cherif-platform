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