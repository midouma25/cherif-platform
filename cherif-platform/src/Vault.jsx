import React, { useState } from 'react';
import { Lock, Mail, User, CheckCircle, Terminal, ShieldAlert, ArrowLeft, Code } from 'lucide-react';

const Vault = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    
    // محاكاة إرسال البيانات للسيرفر (سنربطها لاحقاً بـ Node.js و MongoDB)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 animate-fade-in-up">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* تأثير الإضاءة في الخلفية */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none"></div>

        {/* القسم الأيمن: النص التسويقي */}
        <div className="p-10 flex flex-col justify-center border-l border-gray-800/50">
          <div className="bg-gray-950 border border-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="text-emerald-500" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 leading-tight">
            افتح <span className="text-emerald-500">الخزنة السرية</span>
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            أنت هنا لأنك قادم من إنستغرام. أدخل بياناتك أدناه للحصول على <strong className="text-gray-200">السكربت المصدري لبوت التداول الخوارزمي</strong> مجاناً ومباشرة إلى بريدك الإلكتروني.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
              <CheckCircle className="text-emerald-500" size={18} />
              <span>كود Python جاهز للتشغيل والنسخ.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
              <CheckCircle className="text-emerald-500" size={18} />
              <span>خريطة طريق لربط البوت بمنصة Binance.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
              <ShieldAlert className="text-emerald-500" size={18} />
              <span>لن نقوم بإرسال رسائل مزعجة (Spam). خصوصيتك في أمان.</span>
            </div>
          </div>
        </div>

        {/* القسم الأيسر: نموذج الإدخال أو رسالة النجاح */}
        <div className="p-10 bg-gray-950/50 flex flex-col justify-center relative">
          
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">الاسم الأول أو اللقب</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <User className="text-gray-500" size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="مثال: محمد الشريف"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">البريد الإلكتروني المهني</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Mail className="text-gray-500" size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pl-4 pr-10 text-left focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="dev@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg mt-4 flex items-center justify-center transition-all ${
                  isSubmitting 
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <Terminal className="animate-spin" size={20} /> جاري التشفير والإرسال...
                  </span>
                ) : (
                  '📥 أرسل لي السكربت الآن'
                )}
              </button>
              <p className="text-xs text-center text-gray-500 mt-4">
                بالضغط على الزر، أنت توافق على الانضمام لقائمتنا البريدية الخاصة بالمطورين.
              </p>
            </form>
          ) : (
            
            /* ==========================================
               حالة النجاح (The Upsell Hook)
               هنا نصطاد العميل ونعرض عليه منتجاً مدفوعاً!
               ========================================== */
            <div className="text-center animate-fade-in-up relative z-10">
              <div className="mx-auto bg-emerald-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/50">
                <CheckCircle className="text-emerald-400" size={40} />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">تم الإرسال بنجاح!</h2>
              <p className="text-gray-400 mb-8 text-sm">
                تحقق من صندوق الوارد (أو مجلد الرسائل المزعجة) في بريدك الإلكتروني، لقد أرسلنا الكود للتو.
              </p>
              
              <div className="bg-gray-900 border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden text-right">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <span className="text-xs font-bold bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full mb-3 inline-block">
                  عرض لمرة واحدة (One-Time Offer) ⚡
                </span>
                <h3 className="text-lg font-bold text-white mb-2">هل تريد احتراف بناء أنظمة التداول؟</h3>
                <p className="text-gray-400 text-sm mb-5">
                  بما أنك مهتم بالسكربت، انضم لمعسكر MERN Stack لبناء نظام مالي متكامل وتداوله كمنتج SaaS. خصم 50% ينتهي قريباً!
                </p>
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <ArrowLeft size={18} />
                  انتقل إلى المعسكر الآن
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vault;