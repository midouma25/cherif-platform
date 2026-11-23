import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { PlayCircle, BookOpen, Trophy, Swords, Zap } from 'lucide-react';

const Hub = () => {
  const { user } = useContext(AuthContext);
  const [learningData, setLearningData] = useState([]);
  const [userStats, setUserStats] = useState({ exp: 0, rank: 'E-Rank' });
  const [loading, setLoading] = useState(true);

  // دوال الألوان مع تأثيرات (Aura) مخصصة للرتب العليا
  const getRankColor = (rank) => {
    switch(rank) {
      case 'Monarch': 
        return 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-600 to-black drop-shadow-[0_0_20px_rgba(220,38,38,0.9)] scale-110 transform transition-all tracking-widest';
      case 'National Level': 
        return 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-white drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]';
      case 'S-Rank': return 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]';
      case 'A-Rank': return 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]';
      case 'B-Rank': return 'text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]';
      case 'C-Rank': return 'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]';
      case 'D-Rank': return 'text-emerald-500';
      default: return 'text-gray-400'; // E-Rank
    }
  };

  // تحديد سقف الـ EXP للرتب الجديدة
  const getNextRankExp = (exp) => {
    if (exp >= 50000) return 50000; // الحد الأقصى المطلق (Monarch)
    if (exp >= 15000) return 50000; // الطريق نحو Monarch
    if (exp >= 5000) return 15000;  // الطريق نحو National Level
    if (exp >= 2000) return 5000;
    if (exp >= 1000) return 2000;
    if (exp >= 500) return 1000;
    if (exp >= 200) return 500;
    return 200;
  };

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
          if (res.data.userStats) setUserStats(res.data.userStats);
        }
      } catch (err) {
        console.error('خطأ في جلب المكتبة', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHub();
  }, []);

  const handleClaimCertificate = async (courseId) => {
    try {
      const token = localStorage.getItem('cherif_token');
      const res = await axios.post(`http://127.0.0.1:5001/api/courses/${courseId}/issue-certificate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // توجيه الطالب إلى صفحة شهادته الخاصة
        window.location.href = `/certificate/${res.data.certificateId}`;
      }
    } catch (err) {
      alert(err.response?.data?.error || 'حدث خطأ أثناء إصدار الشهادة');
    }
  };


  // حساب النسبة المئوية لشريط مستوى اللاعب
  const nextExp = getNextRankExp(userStats.exp);
  const rankProgress = userStats.rank === 'Monarch' ? 100 : Math.round((userStats.exp / nextExp) * 100);

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col items-center justify-center gap-4">
        <p>يجب تسجيل الدخول لعرض مكتبتك التعليمية.</p>
        <Link to="/auth" className="text-emerald-400 hover:text-emerald-300">الذهاب للخزنة السرية</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6 bg-gray-950 animate-fade-in-up text-gray-200">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* شاشة الحالة (Status Window) */}
        <div className="bg-[#0b0f19] border border-blue-900/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(30,58,138,0.15)] relative overflow-hidden">
          {/* تأثيرات الإضاءة الخلفية */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full text-center md:text-right">
              <h1 className="text-3xl font-black text-white mb-1">
                اللاعب: <span className="text-blue-400">{user.name}</span>
              </h1>
              <p className="text-gray-400 font-mono text-sm mb-6 flex items-center justify-center md:justify-start gap-2">
                <Swords size={16} className="text-blue-500" /> مسجل في النظام
              </p>
              
              {/* شريط خبرة اللاعب */}
              <div className="max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-blue-400 flex items-center gap-1"><Zap size={14} /> {userStats.exp} EXP</span>
                  <span className="text-gray-500">{userStats.rank === 'Monarch' ? 'الحد الأقصى للنظام' : `إلى الرتبة التالية: ${nextExp}`}</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-2.5 border border-gray-800">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2.5 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(56,189,248,0.5)]" style={{ width: `${rankProgress}%` }}></div>
                </div>
              </div>
            </div>

            {/* شارة الرتبة مع الألقاب (The New Badge) */}
            <div className="shrink-0 flex flex-col items-center justify-center bg-gray-900/80 border border-gray-800 rounded-2xl p-6 min-w-[200px] relative overflow-hidden group">
              {/* تأثير النبض الخاص برتبة المونارك */}
              {userStats.rank === 'Monarch' && (
                <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none"></div>
              )}
              
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 z-10">تصنيف اللاعب</span>
              
              <div className={`text-4xl md:text-5xl font-black z-10 ${getRankColor(userStats.rank)}`}>
                {userStats.rank}
              </div>
              
              {/* الألقاب الملحمية */}
              <div className="text-xs font-bold mt-3 text-gray-400 z-10">
                {userStats.rank === 'Monarch' && 'عاهل النظام'}
                {userStats.rank === 'National Level' && 'عقل بمستوى أُمّة'}
                {userStats.rank === 'S-Rank' && 'خبير تقني'}
                {userStats.rank === 'A-Rank' && 'مطور متقدم'}
                {userStats.rank === 'B-Rank' && 'مطور محترف'}
                {userStats.rank === 'C-Rank' && 'مطور واعد'}
                {userStats.rank === 'D-Rank' && 'مبتدئ متمرس'}
                {userStats.rank === 'E-Rank' && 'مبتدئ النظام'}
              </div>
            </div>
          </div>
        </div>

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
                    {item.progress === 100 ? (
                        <button 
                          onClick={() => handleClaimCertificate(item.course._id)}
                          className="w-full bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-gray-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-[1.02]"
                        >
                          <Trophy size={18} /> استلام وثيقة الإثبات
                        </button>
                      ) : (
                        <Link to={`/course/${item.course._id}/learn`} className="w-full bg-blue-900/20 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-500/20 text-center font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                          <PlayCircle size={18} /> 
                          {item.progress === 0 ? 'ابدأ التعلم الآن' : 'واصل التعلم'}
                        </Link>
                      )}                      </Link>
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