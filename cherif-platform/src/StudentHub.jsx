import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { BookOpen, Terminal, Download, Lock, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentHub = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen py-12 px-6 animate-fade-in-up">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ترحيب شخصي */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">
              أهلاً بك، <span className="text-emerald-500">{user?.name}</span> 👋
            </h1>
            <p className="text-gray-400">مكتبتك الشخصية جاهزة. لقد قمت بفتح عناصر جديدة!</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-gray-950 px-4 py-2 rounded-xl border border-gray-800">
            <ShieldCheck className="text-emerald-500" size={20} />
            <span className="text-sm font-bold text-gray-300">حساب مفعل</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* العنصر المجاني الذي حصل عليه (الخزنة) */}
          <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-900/50 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
            <div className="flex items-start justify-between mb-6">
              <div className="bg-emerald-900/20 p-3 rounded-xl border border-emerald-500/30">
                <Terminal className="text-emerald-400" size={28} />
              </div>
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                تم الفتح بنجاح
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">السكربت المصدري: بوت التداول الخوارزمي</h2>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              هذا هو السكربت الذي طلبته. مكتوب بلغة Python ومصمم للعمل مع منصة Binance عبر استراتيجيات SMC. 
              احتفظ به آمناً، ولا تشاركه مع غير المشتركين.
            </p>
            
            <div className="flex gap-4">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all">
                <Download size={18} /> تحميل الكود (ZIP)
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
                مشاهدة شرح التثبيت
              </button>
            </div>
          </div>

          {/* عنصر تسويقي مدفوع (Upsell) */}
          <div className="bg-gray-900 border border-purple-900/50 rounded-3xl p-8 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-1 bg-purple-500"></div>
            <div className="bg-purple-900/20 w-fit p-3 rounded-xl border border-purple-500/30 mb-6">
              <BookOpen className="text-purple-400" size={24} />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">معسكر MERN Stack</h2>
            <p className="text-gray-400 text-sm mb-6 flex-grow">
              انتقل من استخدام السكربتات الجاهزة إلى برمجة منصتك المالية الخاصة وبيعها للشركات.
            </p>
            
            <div className="bg-gray-950 rounded-xl p-4 mb-6 border border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Lock className="text-gray-500" size={16} />
                <span className="text-sm font-bold text-gray-500">مغلق</span>
              </div>
              <span className="text-purple-400 font-black">$99</span>
            </div>
            
            <Link to="/academy" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              افتح المعسكر الآن <ChevronLeft size={18} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentHub;