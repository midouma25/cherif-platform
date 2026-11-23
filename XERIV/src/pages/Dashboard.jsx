import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Terminal, Activity, BookOpen, ShieldCheck, 
  Settings, LogOut, Bell, Search, Hexagon, Zap, ArrowUpLeft, 
  Clock, CheckCircle2, AlertTriangle, CreditCard, ChevronLeft
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
      <aside className="w-72 bg-[#0b1120] border-l border-slate-800/80 flex flex-col relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* اللوجو والهوية */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <Hexagon size={24} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" strokeWidth={1.5} />
            <span className="text-xl font-black text-white tracking-[0.2em] font-mono">XERIV</span>
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
        <header className="h-20 border-b border-slate-800/80 bg-[#0b1120]/50 backdrop-blur-xl flex items-center justify-between px-8 relative z-10">
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
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
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
        <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
              
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="heading-xeriv text-3xl font-black text-white">نظرة عامة على الأنظمة</h2>
                  <p className="text-sm text-slate-400 mt-2">إليك ملخص سريع لحالة حسابك وتراخيصك الحالية.</p>
                </div>
                <Link to="/systems" className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(8,145,178,0.3)] flex items-center gap-2">
                  تصفح أنظمة جديدة <ArrowUpLeft size={16} />
                </Link>
              </div>

              {/* بطاقات الإحصائيات (Stats Widgets) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="lg:col-span-8 bg-[#0b1120]/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                    <Terminal className="text-cyan-400" size={20} /> تراخيص الأنظمة الخاصة بي
                  </h3>
                  
                  <div className="bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all group">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-14 h-14 bg-cyan-950/50 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 shrink-0">
                        <MonitorSmartphone size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-white text-base">XERIV ERP & POS</h4>
                          <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 size={10} /> نشط
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono tracking-wider">License: XRV-9942-AXB-2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors">
                        تحميل التحديث (v2.1)
                      </button>
                      <button className="flex-1 md:flex-none bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black px-4 py-2.5 rounded-lg transition-colors shadow-lg">
                        لوحة تحكم النظام
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
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up">
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