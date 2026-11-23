import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Crown, Swords, Zap } from 'lucide-react';

const Rankings = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // نفس دوال الألوان الملحمية للحفاظ على الهوية البصرية
  const getRankColor = (rank) => {
    switch(rank) {
      case 'Monarch': return 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-600 to-black drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] font-black';
      case 'National Level': return 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-white drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] font-black';
      case 'S-Rank': return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] font-bold';
      case 'A-Rank': return 'text-red-500 font-bold';
      case 'B-Rank': return 'text-purple-500 font-bold';
      case 'C-Rank': return 'text-blue-500 font-bold';
      case 'D-Rank': return 'text-emerald-500 font-bold';
      default: return 'text-gray-400 font-bold'; // E-Rank
    }
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5001/api/leaderboard');
        if (res.data.success) {
          setPlayers(res.data.leaderboard);
        }
      } catch (err) {
        console.error('خطأ في جلب بيانات النقابة', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-950 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div></div>;

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-950 text-gray-200">
      <div className="max-w-4xl mx-auto">
        
{/* الترويسة المحدثة */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-900/20 border border-yellow-500/30 text-yellow-500 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.15)] relative overflow-hidden">
            {/* تأثير الإشعاع الخلفي */}
            <div className="absolute inset-0 bg-yellow-500/20 animate-pulse"></div>
            <Crown size={40} className="relative z-10" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            لوحة الصدارة: <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">النخبة المطلقة</span>
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            في هذا النظام، المهارة هي العملة الوحيدة والعالم التقني لا يعترف إلا بالنتائج. تُقاس قيمتك في سوق العمل بما تنجزه من أكواد. تنافس مع أشرس العقول، اكسر حدودك البرمجية، وارتقِ من مطور تقليدي إلى <span className="text-gray-200 font-bold">"عقل بمستوى أُمّة"</span>.
          </p>
        </div>

        {/* قائمة اللاعبين */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {players.map((player, index) => {
            // تمييز أصحاب المراكز الثلاثة الأولى
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;
            
            let borderClass = 'border-gray-800 bg-gray-900';
            if (isTop1) borderClass = 'border-yellow-500/50 bg-yellow-900/10 shadow-[0_0_20px_rgba(234,179,8,0.1)] transform scale-[1.02] z-10';
            else if (isTop2) borderClass = 'border-gray-300/50 bg-gray-800/50';
            else if (isTop3) borderClass = 'border-orange-700/50 bg-orange-900/10';

            return (
              <div key={player._id} className={`relative flex items-center justify-between p-5 md:p-6 rounded-2xl border transition-all hover:border-blue-500/30 ${borderClass}`}>
                
                <div className="flex items-center gap-4 md:gap-6">
                  {/* المركز */}
                  <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl flex items-center justify-center font-black text-lg ${isTop1 ? 'bg-yellow-500 text-gray-950' : isTop2 ? 'bg-gray-300 text-gray-950' : isTop3 ? 'bg-orange-700 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    {isTop1 ? <Trophy size={24} /> : isTop2 ? <Medal size={24} /> : isTop3 ? <Medal size={24} /> : `#${index + 1}`}
                  </div>

                  {/* اسم اللاعب */}
                  <div>
                    <h3 className={`text-lg md:text-xl font-bold ${isTop1 ? 'text-yellow-500' : 'text-white'}`}>{player.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs md:text-sm ${getRankColor(player.rank)}`}>{player.rank}</span>
                    </div>
                  </div>
                </div>

                {/* نقاط الخبرة */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-blue-400 font-black text-lg md:text-2xl">
                    <Zap size={20} className={isTop1 ? 'animate-pulse' : ''} />
                    {player.exp.toLocaleString()}
                  </div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">EXP</span>
                </div>
              </div>
            );
          })}

{/* حالة النظام الفارغ (تحديث النص) */}
          {players.length === 0 && (
            <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-gray-700 to-blue-900"></div>
              <Swords size={48} className="mx-auto text-gray-700 mb-5 transition-transform group-hover:scale-110 duration-500" />
              <h3 className="text-xl font-black text-white mb-2">النظام قيد الانتظار</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                قاعدة البيانات خالية والقمة تنتظر من يعتليها. كُن أول من يُوقظ قدراته، يفرض سيطرته على الأكواد، ويحتكر المركز الأول.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rankings;