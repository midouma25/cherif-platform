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
import StudentHub from './StudentHub'; // تأكد من استيراد هذه إذا كنت تستخدمها
import CourseDetails from './CourseDetails';
import Classroom from './Classroom';

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
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;