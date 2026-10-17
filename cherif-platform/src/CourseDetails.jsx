import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  PlayCircle, Clock, Award, Shield, BookOpen, ArrowRight, Lock, Video, 
  Trophy, Flame, Skull, GitBranch, Bot, Code, Layers, CheckCircle2, Sparkles, Link2
} from 'lucide-react';
import { parseCourseHierarchy } from './Academy';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [course, setCourse] = useState(null);
  const [siblingCourses, setSiblingCourses] = useState([]); // الكراش كورسات الأخرى في نفس الشهادة المهنية
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('cherif_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [courseRes, lessonsRes, enrollRes, allCoursesRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5001/api/courses/public/${id}`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/lessons`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/check-enrollment`, { headers }).catch(() => ({ data: { isEnrolled: false } })),
          axios.get(`http://127.0.0.1:5001/api/courses/public`).catch(() => ({ data: { courses: [] } }))
        ]);
        
        if (courseRes.data.success) {
          const parsedCurrent = parseCourseHierarchy(courseRes.data.course);
          setCourse(parsedCurrent);

          // إذا كان الكورس تابعاً لشهادة مهنية، نجلب بقية الكراش كورسات التابعة لنفس الشهادة
          if (parsedCurrent.isPartOfCertificate && allCoursesRes.data?.courses) {
            const siblings = allCoursesRes.data.courses
              .map(parseCourseHierarchy)
              .filter(c => c.parentCertTitle === parsedCurrent.parentCertTitle)
              .sort((a, b) => a.courseOrder - b.courseOrder);
            setSiblingCourses(siblings);
          }
        }
        if (lessonsRes.data.success) setLessons(lessonsRes.data.lessons);
        if (enrollRes.data) setIsEnrolled(enrollRes.data.isEnrolled);
        
      } catch (err) {
        console.error('خطأ في جلب البيانات', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEnrollment = async () => {
    const token = localStorage.getItem('cherif_token');
    if (!token) {
      alert("يجب عليك تسجيل الدخول لتتمكن من الاشتراك!");
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    try {
      const res = await axios.post(`http://127.0.0.1:5001/api/courses/${id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setIsEnrolled(true);
        navigate(`/course/${id}/learn`);
      }
    } catch (error) {
      alert("حدث خطأ أثناء الاشتراك.");
    } finally {
      setIsEnrolling(false);
    }
  };

  // تجميع الدروس حسب الوحدات (Sections)
  const groupedSections = useMemo(() => {
    return lessons.reduce((acc, lesson) => {
      const secName = lesson.section || 'الوحدة 1: الأساسيات';
      if (!acc[secName]) acc[secName] = [];
      acc[secName].push(lesson);
      return acc;
    }, {});
  }, [lessons]);

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center bg-[#020617]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>;
  if (!course) return <div className="text-center py-20 text-white text-2xl font-bold bg-[#020617]">❌ الكورس غير موجود</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-20 animate-fade-in-up" dir="rtl">
      
      {/* القسم العلوي (Hero Section) */}
      <div className="bg-gradient-to-b from-slate-950 to-[#020617] border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-14 relative z-20 flex flex-col lg:flex-row gap-12 items-start">
          
          <div className="flex-1 space-y-6">
            <Link to="/academy" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-bold text-sm">
              <ArrowRight size={16} /> العودة لكتالوج الأكاديمية
            </Link>

            {/* شارة التبعية للشهادة المهنية أو الكورس المستقل */}
            <div>
              {course.isPartOfCertificate ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold">
                  <Trophy size={16} className="text-amber-400 shrink-0" />
                  <span>
                    الكراش كورس رقم ({course.courseOrder}) ضمن الشهادة المهنية: <strong className="text-white">{course.parentCertTitle}</strong>
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Sparkles size={15} /> كراش كورس وحيد ومستقل (Standalone Crash Course)
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.35]">{course.title}</h1>
            <p className="text-base md:text-lg text-slate-300 leading-[1.9] max-w-2xl">{course.cleanDescription}</p>
            
            {/* المزايا والشهادة الفرعية ومشروع GitHub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
                <Award className="text-amber-400 shrink-0 mt-0.5" size={22} />
                <div>
                  <p className="text-xs text-slate-400 font-bold">الشهادة الممنوحة بعد هذا الكورس:</p>
                  <p className="text-sm font-black text-white mt-0.5">{course.subCertBadge}</p>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
                <GitBranch className="text-emerald-400 shrink-0 mt-0.5" size={22} />
                <div>
                  <p className="text-xs text-slate-400 font-bold">مشروع التخرج (GitHub + AI Agent):</p>
                  <p className="text-sm font-black text-white mt-0.5">{course.githubProjectTitle}</p>
                </div>
              </div>
            </div>

            {/* المهارات المكتسبة في هذا الكراش كورس */}
            {course.extractedSkills?.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-400 mb-2.5">المهارات التي ستكتسبها في هذا الكراش كورس:</p>
                <div className="flex flex-wrap gap-2">
                  {course.extractedSkills.map((sk, i) => (
                    <span key={i} className="bg-slate-900 border border-slate-700 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl" dir="ltr">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* بطاقة الاشتراك والبدء */}
          <div className="w-full lg:w-96 bg-[#0b1120] border border-slate-800 rounded-3xl p-8 shadow-2xl shrink-0 text-center space-y-5">
            <div className="text-4xl font-black text-white">
              {course.price === 0 ? <span className="text-emerald-400">مجاني بالكامل!</span> : `$${course.price}`}
            </div>
            <p className="text-slate-400 font-medium text-xs">
              يشمل جميع الوحدات ({Object.keys(groupedSections).length} وحدات) • {lessons.length} درساً وتحدياً
            </p>
            
            {isEnrolled ? (
              <button 
                onClick={() => navigate(`/course/${id}/learn`)} 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
              >
                <PlayCircle size={20} /> متابعة التعلم في المختبر
              </button>
            ) : (
              <button 
                onClick={handleEnrollment} 
                disabled={isEnrolling}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isEnrolling ? 'جاري تجهيز مختبرك...' : (
                  <><PlayCircle size={20} /> اشترك مجاناً وابدأ الكورس</>
                )}
              </button>
            )}

            <div className="text-right space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> شرح مبسط بأسلوب القصة (ELI5 👶)</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> محرر أكواد تفاعلي بـ 3 تلميحات</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> بوابات زعماء واختبار نهائي لكل وحدة</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400"/> وحدة بناء مشروع GitHub بمساعدة AI Agent</div>
            </div>
          </div>

        </div>
      </div>

      {/* شريط الكورسات الشقيقة إذا كان هذا الكورس جزءاً من شهادة مهنية */}
      {siblingCourses.length > 1 && (
        <div className="max-w-5xl mx-auto px-6 pt-12">
          <div className="bg-[#0b1120] border border-amber-500/30 rounded-3xl p-6">
            <h3 className="text-sm font-black text-amber-400 mb-3 flex items-center gap-2">
              <Layers size={18} /> مسار الشهادة المهنية المتسلسل ({siblingCourses.length} كراش كورسات):
            </h3>
            <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
              {siblingCourses.map((sib, idx) => {
                const isCurrent = sib._id === course._id;
                return (
                  <Link
                    key={sib._id}
                    to={`/course/${sib._id}`}
                    className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    كورس {idx + 1}: {sib.title.slice(0, 28)}...
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* قسم المنهج الدراسي المقسم حسب الوحدات (Sections) */}
      <div className="max-w-5xl mx-auto px-6 py-14 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <BookOpen className="text-emerald-400" /> المنهج الدراسي التفصيلي ({Object.keys(groupedSections).length} وحدات)
          </h2>
          <span className="bg-slate-900 text-slate-300 px-4 py-1.5 rounded-full text-xs font-bold border border-slate-800">
            إجمالي {lessons.length} درساً وتحدياً
          </span>
        </div>
        
        {Object.keys(groupedSections).length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
            <Video size={48} className="text-slate-700 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">جاري إعداد الدروس</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSections).map(([sectionName, secLessons], sIdx) => {
              const isProjectUnit = sectionName.includes('مشروع') || sectionName.includes('GitHub');

              return (
                <div 
                  key={sIdx} 
                  className={`border rounded-3xl overflow-hidden ${
                    isProjectUnit ? 'bg-emerald-950/10 border-emerald-500/40' : 'bg-[#0b1120] border-slate-800'
                  }`}
                >
                  <div className="p-5 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="font-black text-base md:text-lg text-white flex items-center gap-2.5">
                      {isProjectUnit ? <Bot className="text-emerald-400" size={20} /> : <Layers className="text-indigo-400" size={18} />}
                      {sectionName}
                    </h3>
                    <span className="text-xs text-slate-400 font-bold">{secLessons.length} خطوات</span>
                  </div>

                  <div className="divide-y divide-slate-800/70">
                    {secLessons.map((lesson) => {
                      const isRedGate = lesson.type === 'red_gate';
                      const isBoss = lesson.type === 'boss_quiz';
                      const isUnitExam = lesson.type === 'unit_exam';

                      return (
                        <div key={lesson._id} className="p-5 flex items-center gap-4 hover:bg-slate-900/40 transition-colors">
                          <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-black text-xs ${
                            isRedGate ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : isBoss ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                            : isUnitExam ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-slate-950 text-emerald-400 border border-slate-800'
                          }`}>
                            {isRedGate ? <Flame size={15}/> : isBoss ? <Skull size={15}/> : isUnitExam ? <Trophy size={15}/> : lesson.order}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-bold text-sm md:text-base text-slate-200">{lesson.title}</h4>
                            {lesson.description && <p className="text-slate-500 text-xs mt-1">{lesson.description}</p>}
                          </div>

                          {isEnrolled || lesson.isFreePreview ? (
                            <Link 
                              to={`/course/${course._id}/learn`} 
                              className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl hover:bg-emerald-500 hover:text-slate-950 transition-all"
                            >
                              ابدأ الآن
                            </Link>
                          ) : (
                            <Lock size={15} className="text-slate-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;