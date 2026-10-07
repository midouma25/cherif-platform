import React, { useState, useContext } from 'react';
import { Lock, Mail, User, CheckCircle, Terminal, ShieldAlert, Key } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Vault = () => {
  const [step, setStep] = useState(1); // المرحلة 1 (الإيميل) ، المرحلة 2 (كلمة السر)
  const [emailExists, setEmailExists] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // دالة فحص الإيميل (الانتقال للمرحلة 2)
  const handleNextStep = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await axios.post('http://127.0.0.1:5001/api/auth/check-email', { email: formData.email });
      setEmailExists(res.data.exists);
      if (res.data.exists) {
        setFormData({ ...formData, name: res.data.name }); // جلب اسمه إذا كان مسجلاً
      }
      setStep(2); // الانتقال لمرحلة كلمة السر
    } catch (err) {
      setError('حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة الإرسال النهائي (تسجيل أو دخول)
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailExists && formData.password !== formData.confirmPassword) {
      return setError('كلمتا المرور غير متطابقتين!');
    }

    setIsSubmitting(true);
    
    try {
      let response;
      if (emailExists) {
        // إذا كان مسجلاً، نقوم بتسجيل دخوله
        response = await axios.post('http://127.0.0.1:5001/api/auth/login', { 
          email: formData.email, 
          password: formData.password 
        });
      } else {
        // إذا كان جديداً، ننشئ حسابه
        response = await axios.post('http://127.0.0.1:5001/api/auth/vault-signup', formData);
      }
      
      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate('/hub'); // توجيه للمكتبة
      }
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ غير متوقع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 animate-fade-in-up">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none"></div>

        {/* القسم الأيمن (التسويقي) */}
        <div className="p-10 flex flex-col justify-center border-l border-gray-800/50">
          <div className="bg-gray-950 border border-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="text-emerald-500" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 leading-tight">
            افتح <span className="text-emerald-500">الخزنة السرية</span>
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            أنت هنا لأنك قادم من إنستغرام. أدخل بياناتك للحصول على <strong className="text-gray-200">السكربت المصدري لبوت التداول</strong>.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
              <CheckCircle className="text-emerald-500" size={18} /><span>كود Python جاهز للتشغيل.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
              <CheckCircle className="text-emerald-500" size={18} /><span>خريطة طريق لربط Binance.</span>
            </div>
          </div>
        </div>

        {/* القسم الأيسر (الفورم الديناميكي) */}
        <div className="p-10 bg-gray-950/50 flex flex-col justify-center relative">
          
          {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-xl mb-4 text-sm font-bold text-center animate-fade-in-up">{error}</div>}

          {step === 1 ? (
            // المرحلة 1: جمع الإيميل والاسم
            <form onSubmit={handleNextStep} className="space-y-5 animate-fade-in-up">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">الاسم الأول أو اللقب</label>
                <div className="relative">
                  <User className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input type="text" required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-10 pl-4 focus:border-emerald-500 outline-none transition-all"
                    placeholder="مثال: محمد الشريف" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">البريد الإلكتروني المهني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input type="email" required dir="ltr" className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-4 pr-10 text-left focus:border-emerald-500 outline-none transition-all"
                    placeholder="dev@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all">
                {isSubmitting ? 'جاري الفحص...' : 'التالي ⬅️'}
              </button>
            </form>
          ) : (
            // المرحلة 2: تعيين كلمة المرور
            <form onSubmit={handleFinalSubmit} className="space-y-5 animate-fade-in-up">
              
              <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl mb-6">
                <p className="text-emerald-400 text-sm font-bold flex items-center gap-2">
                  <ShieldAlert size={16} /> 
                  {emailExists ? `مرحباً بعودتك يا ${formData.name}! أدخل كلمة مرورك لفتح الخزنة.` : 'خطوة أخيرة! قم بتعيين كلمة مرور لحماية حسابك والسكربت.'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">كلمة المرور</label>
                <div className="relative">
                  <Key className="absolute right-3 top-3 text-gray-500" size={18} />
                  <input type="password" required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-10 pl-4 focus:border-emerald-500 outline-none transition-all"
                    placeholder="********" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>

              {!emailExists && (
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <Key className="absolute right-3 top-3 text-gray-500" size={18} />
                    <input type="password" required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-10 pl-4 focus:border-emerald-500 outline-none transition-all"
                      placeholder="********" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(1)} className="bg-gray-800 text-white px-4 py-4 rounded-xl hover:bg-gray-700">تراجع</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2">
                  {isSubmitting ? <Terminal className="animate-spin" size={20} /> : '📥 تأكيد وفتح الخزنة'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Vault;