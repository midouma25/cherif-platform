import React, { useState } from 'react';
import { Hexagon, Mail, Lock, User, LogIn, UserPlus, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* ========================================= */}
      {/* فيديو الخلفية السينمائي */}
      {/* ========================================= */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
      >
        <source src="https://cdn.coverr.co/videos/coverr-server-room-4712/1080p.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#030712]/80"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-[#0b1120]/60 backdrop-blur-3xl border border-slate-800/80 rounded-[2rem] shadow-[0_0_50px_rgba(8,145,178,0.15)] overflow-hidden relative z-10 animate-fade-in-up">
        
        {/* ========================================= */}
        {/* القسم الأيمن: الرسالة التسويقية والهوية */}
        {/* ========================================= */}
        <div className="p-10 md:p-14 flex flex-col justify-center relative overflow-hidden border-b md:border-b-0 md:border-l border-slate-800/50">
          
          <Link to="/" className="inline-flex items-center gap-2 mb-10 group w-fit relative z-10">
            <Hexagon size={28} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" strokeWidth={1.5} />
            <span className="text-xl font-black text-white tracking-[0.2em] font-mono">XERIV</span>
          </Link>

          <h2 className="heading-xeriv text-3xl md:text-4xl font-black text-white leading-tight mb-6 relative z-10">
            مرحباً بك في <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              مركز القيادة الموحد.
            </span>
          </h2>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">
            حساب واحد يمنحك وصولاً كاملاً لإمبراطورية XERIV. أدر أنظمتك، اقرأ تحليلاتنا الحصرية، واستعد لانطلاق أكاديمية المهندسين.
          </p>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 backdrop-blur-md">
              <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
              <span>تشفير عسكري (End-to-End Encryption) لبياناتك.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 backdrop-blur-md">
              <Zap className="text-amber-400 shrink-0" size={20} />
              <span>وصول فوري لتراخيص أنظمة (B2B) والمقالات المدفوعة.</span>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* القسم الأيسر: نموذج الدخول / التسجيل */}
        {/* ========================================= */}
        <div className="p-10 md:p-14 flex flex-col justify-center bg-[#050810]/80">
          
          <div className="flex bg-slate-900/80 border border-slate-800/80 p-1.5 rounded-2xl mb-10 relative">
            <button 
              onClick={() => setIsLogin(true)} 
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all z-10 ${isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              تسجيل الدخول
            </button>
            <button 
              onClick={() => setIsLogin(false)} 
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all z-10 ${!isLogin ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              حساب جديد
            </button>
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-slate-800 border border-slate-700/50 rounded-xl shadow-md transition-all duration-300 ease-in-out`}
              style={{
                transform: isLogin ? 'translateX(0)' : 'translateX(-100%)',
                right: '6px'
              }}
            ></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 flex flex-col items-center">
            {!isLogin && (
              <div className="space-y-1.5 animate-fade-in-up w-full max-w-sm" style={{animationDuration: '0.3s'}}>
                <label className="text-[11px] font-black tracking-wider text-slate-500 uppercase w-full text-right block">الاسم الكامل</label>
                <div className="relative group w-full">
                  <User className="absolute right-4 top-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required 
                    placeholder="مثال: أحمد عبد الله"
                    className="w-full bg-slate-900/60 border border-slate-800/80 text-white rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 backdrop-blur-sm"
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5 w-full max-w-sm">
              <label className="text-[11px] font-black tracking-wider text-slate-500 uppercase w-full text-right block">البريد الإلكتروني</label>
              <div className="relative group w-full">
                <Mail className="absolute right-4 top-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="email" 
                  required 
                  dir="ltr"
                  placeholder="name@company.com"
                  className="w-full bg-slate-900/60 border border-slate-800/80 text-white rounded-xl py-3.5 pl-4 pr-12 text-left focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 backdrop-blur-sm"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-1.5 w-full max-w-sm">
              <div className="flex justify-between items-center w-full">
                <label className="text-[11px] font-black tracking-wider text-slate-500 uppercase text-right">كلمة المرور</label>
                {isLogin && <a href="#" className="text-[11px] font-bold text-cyan-500 hover:text-cyan-400 transition-colors">نسيت الكلمة؟</a>}
              </div>
              <div className="relative group w-full">
                <Lock className="absolute right-4 top-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-slate-800/80 text-white rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 tracking-widest backdrop-blur-sm"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </div>

            <button 
              disabled={isLoading} 
              type="submit" 
              className="w-full max-w-sm bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-4 rounded-xl transition-all flex justify-center items-center gap-2 mt-6 shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري المصادقة...
                </span>
              ) : isLogin ? (
                <>الدخول للنظام <LogIn size={18} className="transform scale-x-[-1]" /></>
              ) : (
                <>إنشاء حسابي الموحد <UserPlus size={18} className="transform scale-x-[-1]" /></>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1">
              <ArrowRight size={14} /> العودة للصفحة الرئيسية
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Auth;