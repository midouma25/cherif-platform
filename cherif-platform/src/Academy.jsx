import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, BookOpen, Clock, PlayCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Academy = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicCourses = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5001/api/courses/public');
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        console.error('خطأ في جلب الكورسات:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicCourses();
  }, []);

  // فلترة الكورسات حسب البحث
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-6 animate-fade-in-up">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* الترويسة وشريط البحث */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 z-10">
            أكاديمية <span className="text-emerald-500">Cherif.Dev</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-8 z-10">
            ارتقِ بمهاراتك البرمجية والمالية. كورسات مكثفة، تطبيقات عملية، وخلاصة سنوات من الهندسة في مكان واحد.
          </p>

          <div className="relative w-full max-w-xl z-10">
            <Search className="absolute right-4 top-4 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن كورس (مثال: بايثون، MERN)..." 
              className="w-full bg-gray-950 border border-gray-700 text-white rounded-2xl py-4 pr-12 pl-4 focus:border-emerald-500 outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* عرض الكورسات */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div key={course._id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all flex flex-col">
                  
                  {/* صورة الكورس */}
                  <div className="h-52 bg-gray-800 relative overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <BookOpen size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-gray-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg font-black text-sm border border-gray-700">
                      {course.price === 0 ? <span className="text-emerald-400">مجاني</span> : `$${course.price}`}
                    </div>
                  </div>

                  {/* تفاصيل الكورس */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 text-yellow-500 text-xs mb-3">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <span className="text-gray-500 ml-1">(5.0)</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-3">{course.description}</p>
                    
                    {/* الفاصل المرن لضمان بقاء الزر في الأسفل */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-gray-500 text-xs mb-4 pb-4 border-b border-gray-800">
                        <div className="flex items-center gap-1"><Clock size={14} /> تعلم بالوتيرة التي تناسبك</div>
                        <div className="flex items-center gap-1"><PlayCircle size={14} /> وصول مدى الحياة</div>
                      </div>
                      
                      {/* زر الاشتراك (مؤقتاً يوجه للمكتبة، لاحقاً سنبرمج صفحة الشراء) */}
<Link to={`/course/${course._id}`} className="block w-full bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white text-center font-bold py-3 rounded-xl transition-all border border-emerald-500/20 hover:border-emerald-500">
  عرض التفاصيل
</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-700" />
                <p>لا توجد كورسات تطابق بحثك حالياً.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Academy;