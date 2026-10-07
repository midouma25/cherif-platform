import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, Clock, Award, Shield, BookOpen, ArrowRight, Lock, Video } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]); // حالة جديدة لتخزين الدروس
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // استخدمنا Promise.all لجلب الكورس والدروس في نفس اللحظة (لجعل الموقع سريعاً جداً)
        const [courseRes, lessonsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5001/api/courses/public/${id}`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/lessons`)
        ]);
        
        if (courseRes.data.success) setCourse(courseRes.data.course);
        if (lessonsRes.data.success) setLessons(lessonsRes.data.lessons);
        
      } catch (err) {
        console.error('خطأ في جلب البيانات', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>;
  if (!course) return <div className="text-center py-20 text-white text-2xl font-bold">❌ الكورس غير موجود</div>;

  return (
    <div className="min-h-screen pb-20 animate-fade-in-up">
      
      {/* القسم العلوي (Hero Section) */}
      <div className="bg-gray-950 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-950 via-gray-950/90 to-transparent z-10"></div>
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="absolute top-0 right-0 w-2/3 h-full object-cover opacity-30 z-0" />
        )}
        
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-20 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <Link to="/academy" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors font-bold text-sm mb-4">
              <ArrowRight size={16} /> العودة للأكاديمية
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">{course.title}</h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">{course.description}</p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-gray-300 font-bold"><Clock className="text-emerald-500" /> وصول مدى الحياة</div>
              <div className="flex items-center gap-2 text-gray-300 font-bold"><Award className="text-emerald-500" /> شهادة إتمام</div>
              <div className="flex items-center gap-2 text-gray-300 font-bold"><Shield className="text-emerald-500" /> ضمان استرجاع 14 يوم</div>
            </div>
          </div>
          
          {/* بطاقة الشراء */}
          <div className="w-full md:w-96 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl shrink-0 text-center">
            <div className="text-5xl font-black text-white mb-2">
              {course.price === 0 ? <span className="text-emerald-400">مجاني!</span> : `$${course.price}`}
            </div>
            <p className="text-gray-500 mb-8 font-bold text-sm">دفعة واحدة، بدون اشتراكات مخفية.</p>
            
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4 flex justify-center items-center gap-2">
              <PlayCircle size={20} /> اشترك الآن وابدأ التعلم
            </button>
            <p className="text-xs text-gray-500">الدفع آمن ومحمي بتشفير 256-bit.</p>
          </div>
        </div>
      </div>

      {/* قسم المنهج الدراسي الديناميكي (Dynamic Syllabus) */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <BookOpen className="text-emerald-500" /> المنهج الدراسي
          </h2>
          <span className="bg-gray-900 text-gray-400 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-800">
            {lessons.length} دروس
          </span>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
          {lessons.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <Video size={48} className="text-gray-700 mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">جاري إعداد الدروس</h3>
              <p className="text-gray-500 text-sm">سيتم توفير محتوى هذا الكورس قريباً جداً.</p>
            </div>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson._id} className="p-6 border-b border-gray-800 flex items-center gap-4 hover:bg-gray-800/30 transition-colors group">
                
                {/* رقم الدرس (يتلون بالأخضر إذا كان مجانياً) */}
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black ${lesson.isFreePreview ? 'bg-emerald-900/30 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-gray-950 text-gray-600 border border-gray-800'}`}>
                  {lesson.order}
                </div>
                
                {/* تفاصيل الدرس */}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg transition-colors ${lesson.isFreePreview ? 'text-white group-hover:text-emerald-400' : 'text-gray-400'}`}>
                    {lesson.title}
                  </h3>
                  {lesson.description && <p className="text-gray-500 text-sm mt-1">{lesson.description}</p>}
                </div>
                
                {/* أيقونات الحالة (مجاني أم مقفل) */}
                {lesson.isFreePreview ? (
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors">
                    <PlayCircle size={14} /> معاينة مجانية
                  </div>
                ) : (
                  <div className="text-gray-600 bg-gray-950 p-2 rounded-lg border border-gray-800" title="هذا الدرس مقفل. اشترك لمشاهدته.">
                    <Lock size={16} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;