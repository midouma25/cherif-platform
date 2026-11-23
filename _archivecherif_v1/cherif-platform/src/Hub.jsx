import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import { PlayCircle, BookOpen, Trophy } from 'lucide-react';

const Hub = () => {
  const { user } = useContext(AuthContext);
  const [learningData, setLearningData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const token = localStorage.getItem('cherif_token');
        if (!token) return setLoading(false);

        const res = await axios.get('http://127.0.0.1:5001/api/user/my-learning', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setLearningData(res.data.learning);
        }
      } catch (err) {
        console.error('خطأ في جلب المكتبة', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHub();
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div></div>;

  if (!user) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950 text-white">
      <h2 className="text-2xl font-bold mb-4">يجب تسجيل الدخول للوصول إلى مكتبتك</h2>
      <Link to="/auth" className="bg-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors">الذهاب للخزنة السرية</Link>
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-6 bg-gray-950 animate-fade-in-up text-gray-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* الترويسة الفخمة */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">مرحباً بعودتك، <span className="text-emerald-500">{user.name}</span>! 🚀</h1>
            <p className="text-gray-400 text-sm md:text-base">حان الوقت لمواصلة رحلتك التعليمية. لديك {learningData.length} مسارات في مكتبتك.</p>
          </div>
          <div className="hidden md:flex w-16 h-16 bg-emerald-900/30 border border-emerald-500/30 rounded-full items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Trophy size={28} />
          </div>
        </div>

        {/* قائمة الكورسات التي يمتلكها الطالب */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <BookOpen className="text-emerald-500"/> مساراتي التعليمية
          </h2>
          
          {learningData.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/50 border border-gray-800 border-dashed rounded-3xl">
              <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 mb-6">مكتبتك فارغة حالياً. اكتشف الكورسات في الأكاديمية!</p>
              <Link to="/academy" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                تصفح الأكاديمية
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningData.map((item) => (
                <div key={item.enrollmentId} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col group">
                  
                  {/* صورة الكورس */}
                  <div className="h-44 bg-gray-800 relative overflow-hidden">
                    {item.course.thumbnail && (
                      <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
                    )}
                  </div>

                  {/* التفاصيل وشريط التقدم */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-6 line-clamp-2">{item.course.title}</h3>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                        <span>التقدم: {item.progress}%</span>
                        <span>{item.completedCount} / {item.totalLessons} دروس</span>
                      </div>
                      
                      <div className="w-full bg-gray-950 rounded-full h-2 mb-6 border border-gray-800 overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.progress}%` }}></div>
                      </div>
                      
                      <Link to={`/course/${item.course._id}/learn`} className="w-full bg-emerald-900/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 text-center font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <PlayCircle size={18} /> 
                        {item.progress === 0 ? 'ابدأ التعلم الآن' : (item.progress === 100 ? 'راجع الكورس' : 'واصل التعلم')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hub;