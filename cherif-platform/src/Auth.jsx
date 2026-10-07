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