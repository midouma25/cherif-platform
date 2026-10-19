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
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            /* توسيع الحاويات في جميع الصفحات لتستغل مساحة الشاشة حتى 1536 بكسل (شاشات 2K) */
            .max-w-5xl, .max-w-6xl, .max-w-9xl {
              max-width: 1536px !important;
              width: 100% !important;
              padding-left: 3rem !important;
              padding-right: 3rem !important;
            }
          }
          
          @media (min-width: 1536px) {
            /* للشاشات العملاقة جداً (4K)، نجعلها تستغل 90% من العرض الإجمالي */
            .max-w-5xl, .max-w-6xl, .max-w-9xl {
              max-width: 90vw !important;
              padding-left: 4rem !important;
              padding-right: 4rem !important;
            }
          }

          /* 
            حماية النصوص من التمدد المفرط (Eye Comfort)
            الشبكات والبطاقات ستتمدد للحواف، لكن النصوص ستبقى في عرض مريح للعين
          */
          p.leading-relaxed, p.leading-\\[1\\.9\\], p.leading-\\[1\\.85\\] {
            max-width: 900px;
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