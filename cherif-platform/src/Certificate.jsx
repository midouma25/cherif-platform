import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Award, CheckCircle, Printer, Share2, ShieldCheck, ArrowRight } from 'lucide-react';

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

  if (loading) return <div className="min-h-screen bg-gray-950 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div></div>;

  if (!certData) return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center text-white">
      <ShieldCheck size={64} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-black mb-2">وثيقة غير صالحة</h2>
      <p className="text-gray-400">لم يتم العثور على هذا الرقم التسلسلي في سجلات النظام.</p>
      <Link to="/" className="mt-6 text-yellow-500 hover:text-yellow-400 font-bold">العودة للرئيسية</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-6 flex flex-col items-center">
      
      {/* أزرار التحكم (تختفي عند الطباعة) */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 print:hidden">
        <Link to="/hub" className="text-gray-400 hover:text-white flex items-center gap-2 font-bold transition-colors">
          <ArrowRight size={20} /> العودة للمكتبة
        </Link>
        <div className="flex gap-4">
          <button onClick={handleCopyLink} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
            {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Share2 size={18} />}
            {copied ? 'تم النسخ' : 'مشاركة الرابط'}
          </button>
          <button onClick={handlePrint} className="bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-gray-950 px-6 py-2 rounded-lg font-black flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Printer size={18} /> طباعة / تصدير PDF
          </button>
        </div>
      </div>

      {/* الشهادة نفسها (المنطقة التي سيتم طباعتها) */}
      <div className="w-full max-w-4xl bg-[#0a0f16] border border-gray-800 p-2 rounded-xl shadow-2xl relative print:border-none print:shadow-none print:bg-white print:p-0">
        <div className="border border-gray-800 p-12 md:p-20 text-center relative overflow-hidden print:border-gray-300 print:text-black">
          
          {/* تأثيرات الإضاءة */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none print:hidden"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none print:hidden"></div>

          {/* ختم التوثيق */}
          <div className="absolute top-8 left-8 flex flex-col items-center opacity-80">
            <ShieldCheck size={48} className="text-yellow-500 mb-2 print:text-gray-600" />
            <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase print:text-gray-400">Verified Credential</span>
          </div>

          <div className="relative z-10">
            <h3 className="text-yellow-500 font-bold tracking-[0.2em] mb-8 text-sm md:text-base print:text-gray-500">شهادة إتمام مسار تقني</h3>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tight print:text-black">
              وثيقة إثبات كفاءة
            </h1>
            
            <p className="text-gray-400 mb-4 text-lg print:text-gray-600">يشهد النظام بأن المطور:</p>
            <h2 className="text-3xl md:text-4xl font-black text-blue-400 mb-12 print:text-black">{certData.studentName}</h2>
            
            <p className="text-gray-400 mb-4 text-lg print:text-gray-600">قد أتم بنجاح كافة التحديات والمتطلبات الخاصة بمسار:</p>
            <h3 className="text-2xl font-bold text-white mb-16 max-w-2xl mx-auto leading-relaxed print:text-black">
              {certData.courseTitle}
            </h3>

            {/* معلومات الإصدار */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 border-t border-gray-800/50 pt-8 print:border-gray-200">
              <div className="text-center">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-gray-400">تاريخ الإصدار</p>
                <p className="text-white font-mono print:text-black">{new Date(certData.issueDate).toLocaleDateString('en-GB')}</p>
              </div>
              
              <Award size={40} className="text-yellow-500 print:text-gray-400" />
              
              <div className="text-center">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 print:text-gray-400">المُعرّف الرقمي (ID)</p>
                <p className="text-white font-mono print:text-black">{certData.certificateId}</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* ستايل مخصص للطباعة */}
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