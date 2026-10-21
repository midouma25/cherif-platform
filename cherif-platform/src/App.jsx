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