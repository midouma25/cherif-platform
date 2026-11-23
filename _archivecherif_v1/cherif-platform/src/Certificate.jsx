import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Award, CheckCircle, Printer, Share2, ShieldCheck, ArrowRight, GitBranch, Bot, Trophy, Sparkles } from 'lucide-react';

const Certificate = () => {
  const { certId } = useParams();
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5001/api/certificates/verify/${certId}`);
        if (res.data.isValid) {
          setCertData(res.data);
        }
      } catch (err) {
        console.error('خطأ في جلب الشهادة', err);
      } finally {
        setLoading(false);
      }
    };
    verifyCertificate();
  }, [certId]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div></div>;

  if (!certData) return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center text-white">
      <ShieldCheck size={64} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-black mb-2">وثيقة غير صالحة</h2>
      <p className="text-slate-400">لم يتم العثور على هذا الرقم التسلسلي في سجلات النظام.</p>
      <Link to="/" className="mt-6 text-amber-500 hover:text-amber-400 font-bold">العودة للرئيسية</Link>
    </div>
  );

  // تحديد ما إذا كانت شهادة مهنية خارقة أو شهادة كراش كورس متخصص
  const isSuperCertificate = certData.isSuperCertificate || certData.courseTitle?.includes('الشهادة المهنية') || certData.courseTitle?.includes('Professional Certificate');

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-6 flex flex-col items-center">
      
      {/* أزرار التحكم (تختفي عند الطباعة) */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 print:hidden">
        <Link to="/hub" className="text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors">
          <ArrowRight size={20} /> العودة للمكتبة
        </Link>
        <div className="flex gap-3">
          <button onClick={handleCopyLink} className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
            {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Share2 size={18} />}
            {copied ? 'تم نسخ رابط التوثيق' : 'مشاركة رابط التحقق'}
          </button>
          <button onClick={handlePrint} className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 px-6 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Printer size={18} /> طباعة / تصدير PDF
          </button>
        </div>
      </div>

      {/* الشهادة المعتمدة */}
      <div className={`w-full max-w-5xl bg-[#070b14] border-2 ${isSuperCertificate ? 'border-amber-500/60 shadow-[0_0_60px_rgba(245,158,11,0.15)]' : 'border-emerald-500/40 shadow-2xl'} p-3 rounded-3xl relative print:border-2 print:border-amber-600 print:shadow-none print:bg-white print:p-2`}>
        <div className={`border ${isSuperCertificate ? 'border-amber-500/30' : 'border-slate-800'} rounded-2xl p-10 md:p-16 text-center relative overflow-hidden print:border-gray-300 print:text-black`}>
          
          {/* إضاءات خلفية */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none print:hidden"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none print:hidden"></div>

          {/* شعار المنصة في الأعلى */}
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex flex-col items-center">
              <ShieldCheck size={44} className={`${isSuperCertificate ? 'text-amber-400' : 'text-emerald-400'} mb-1 print:text-amber-600`} />
              <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase print:text-gray-600">Verified Credential</span>
            </div>

            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs font-bold tracking-wider print:bg-gray-100 print:text-black">
                CHERIF.DEV ACADEMY
              </span>
            </div>

            <div className="flex flex-col items-center">
              {isSuperCertificate ? (
                <Trophy size={44} className="text-amber-400 mb-1 print:text-amber-600" />
              ) : (
                <Award size={44} className="text-emerald-400 mb-1 print:text-emerald-600" />
              )}
              <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase print:text-gray-600">
                {isSuperCertificate ? 'S-Rank Master' : 'Crash Course'}
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className={`${isSuperCertificate ? 'text-amber-400' : 'text-emerald-400'} font-black tracking-[0.15em] mb-4 text-sm md:text-base uppercase print:text-gray-700`}>
              {isSuperCertificate ? '👑 الشهادة المهنية الخارقة المعتمدة (Professional Certificate)' : 'شهادة إتمام كراش كورس متخصص'}
            </h3>
            
            <h1 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight print:text-black">
              {isSuperCertificate ? 'وثيقة احتراف وهندسة برمجيات شاملة' : 'وثيقة إثبات كفاءة تقنية'}
            </h1>
            
            <p className="text-slate-400 mb-3 text-base md:text-lg print:text-gray-600">تشهد أكاديمية Cherif.dev بأن المهندس والمطور:</p>
            <h2 className="text-3xl md:text-5xl font-black text-amber-400 mb-8 py-2 print:text-black">{certData.studentName}</h2>
            
            <p className="text-slate-400 mb-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed print:text-gray-600">
              قد اجتاز بنجاح كافة الدروس، التحديات البرمجية، بوابات الزعماء، واختبارات الوحدات، وأتم بناء ورفع المشاريع العملية على GitHub بمساعدة وكلاء الذكاء الاصطناعي (AI Agents) لمسار:
            </p>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-8 max-w-3xl mx-auto leading-relaxed bg-slate-900/60 border border-slate-800 py-4 px-6 rounded-2xl print:bg-gray-50 print:border-gray-300 print:text-black">
              {certData.courseTitle}
            </h3>

            {/* أوسمة التحقق العملي (GitHub + AI Agent + Code Challenges) */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold print:border-gray-400 print:text-black">
                <GitBranch size={14} /> مشروع GitHub موثق
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-bold print:border-gray-400 print:text-black">
                <Bot size={14} /> تطوير مدعوم بـ AI Agent
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold print:border-gray-400 print:text-black">
                <Sparkles size={14} /> اجتياز الاختبارات المختلطة والبوابات الحمراء
              </span>
            </div>

            {/* معلومات الإصدار والتوقيع */}
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 border-t border-slate-800/80 pt-8 print:border-gray-300">
              <div className="text-center">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-gray-500">تاريخ الإصدار الرسمي</p>
                <p className="text-white font-mono text-sm font-bold print:text-black">{new Date(certData.issueDate).toLocaleDateString('en-GB')}</p>
              </div>
              
              <div className="text-center">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-gray-500">اعتماد الأكاديمية</p>
                <p className="text-amber-400 font-black text-base print:text-black">المهندس غربي محمد الشريف</p>
              </div>
              
              <div className="text-center">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-gray-500">المُعرّف الرقمي الموثق (ID)</p>
                <p className="text-white font-mono text-sm font-bold print:text-black">{certData.certificateId}</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; color: black; }
          @page { margin: 0; size: landscape; }
        }
      `}} />
    </div>
  );
};

export default Certificate;