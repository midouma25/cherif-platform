import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BookOpen, CheckCircle, Menu, X, ArrowRight, Terminal } from 'lucide-react';

const Classroom = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:5001/api/courses/public/${id}`),
          axios.get(`http://127.0.0.1:5001/api/courses/${id}/lessons`)
        ]);
        
        if (courseRes.data.success) setCourse(courseRes.data.course);
        if (lessonsRes.data.success) {
          setLessons(lessonsRes.data.lessons);
          if (lessonsRes.data.lessons.length > 0) {
            setActiveLesson(lessonsRes.data.lessons[0]); // فتح الدرس الأول تلقائياً
          }
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div></div>;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row font-sans text-gray-200">
      
      {/* القائمة الجانبية (Syllabus Sidebar) */}
      <div className={`fixed md:static inset-y-0 right-0 z-40 w-72 bg-gray-900 border-l border-gray-800 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} transition-transform duration-300 flex flex-col`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <Link to={`/course/${id}`} className="text-emerald-500 hover:text-emerald-400 flex items-center gap-2 font-bold text-sm">
            <ArrowRight size={16} /> العودة
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 border-b border-gray-800">
          <h2 className="font-black text-white text-lg leading-tight">{course?.title}</h2>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-4">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '0%' }}></div> {/* شريط التقدم (سيربط لاحقاً) */}
          </div>
          <p className="text-xs text-gray-500 mt-2 font-bold">0% مكتمل</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {lessons.map((lesson) => (
            <button 
              key={lesson._id}
              onClick={() => { setActiveLesson(lesson); setSidebarOpen(false); }}
              className={`w-full text-right p-3 rounded-xl flex items-start gap-3 transition-all ${activeLesson?._id === lesson._id ? 'bg-emerald-900/20 border border-emerald-500/30 text-emerald-400' : 'hover:bg-gray-800 text-gray-400'}`}
            >
              <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-black mt-0.5 ${activeLesson?._id === lesson._id ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
                {lesson.order}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{lesson.title}</p>
                {lesson.isFreePreview && <span className="text-[10px] bg-emerald-900/40 text-emerald-500 px-1.5 py-0.5 rounded mt-1 inline-block">مجاني</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* مساحة القراءة التفاعلية (Main Content Area) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-950">
        
        {/* الشريط العلوي في الموبايل */}
        <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white flex items-center gap-2">
            <Menu size={20} /> <span className="font-bold text-sm">المنهج</span>
          </button>
          <span className="font-bold text-white text-sm truncate max-w-[200px]">{activeLesson?.title}</span>
        </div>

        <div className="max-w-4xl mx-auto w-full p-6 md:p-12">
          {activeLesson ? (
            <div className="animate-fade-in-up">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight flex items-center gap-4">
                {activeLesson.title}
              </h1>
              
              {activeLesson.description && (
                <p className="text-xl text-gray-400 mb-10 pb-10 border-b border-gray-800 leading-relaxed">
                  {activeLesson.description}
                </p>
              )}

              {/* محرك تحويل Markdown مع تلوين الأكواد */}
              <div className="prose prose-invert prose-emerald max-w-none">
                {activeLesson.content ? (
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <div className="relative group rounded-xl overflow-hidden my-6 border border-gray-800 shadow-2xl">
                            <div className="bg-gray-900 text-gray-500 text-xs px-4 py-2 font-mono flex justify-between items-center border-b border-gray-800">
                              <span className="flex items-center gap-2"><Terminal size={14}/> {match[1]}</span>
                            </div>
                            <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1.5rem', background: '#0a0a0a' }} {...props}>
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className="bg-gray-800 text-emerald-400 px-1.5 py-0.5 rounded-md text-sm font-mono border border-gray-700" {...props}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {activeLesson.content}
                  </ReactMarkdown>
                ) : (
                  <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
                    <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-500">محتوى هذا الدرس قيد التجهيز.</p>
                  </div>
                )}
              </div>

              {/* زر إكمال الدرس */}
              <div className="mt-16 pt-8 border-t border-gray-800 flex justify-between items-center">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle size={20} /> لقد أنهيت هذا الدرس
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-32">
              <p className="text-gray-500">جاري تحميل الدرس...</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Classroom;