import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
// 🆕 تم إضافة HelpCircle للاستيرادات لاستخدامها في زر الـ Quiz
import { Video, PlusCircle, LayoutDashboard, Edit, Trash2, ListVideo, ArrowRight, BarChart3, Users, DollarSign, BookOpen, CheckCircle, ChevronRight, ChevronLeft, Play, Eye, FileText, Code, HelpCircle } from 'lucide-react';

const InstructorStudio = () => {
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalRevenue: 0 });
  const [courses, setCourses] = useState([]);
  
  // حالات معالج النشر
  const [courseStep, setCourseStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', price: 0, thumbnail: '' });

  // حالات باني المنهج
  const [managingCourse, setManagingCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  
  // حالات باني المنهج المتقدمة (Workspace)
  const [activeSection, setActiveSection] = useState('الوحدة 1: الأساسيات');
  const [editingLessonId, setEditingLessonId] = useState(null);
  
  // 🆕 تم تحديث الحالة المبدئية للدرس لتشمل مصفوفة quiz فارغة
  const [lessonForm, setLessonForm] = useState({ 
    title: '', description: '', content: '', videoUrl: '', order: 1, 
    isFreePreview: false, section: 'الوحدة 1: الأساسيات', quiz: [] 
  });

  const contentTextareaRef = useRef(null);

  useEffect(() => {
    fetchStats();
    fetchMyCourses();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('cherif_token');
      const res = await axios.get('http://127.0.0.1:5001/api/instructor/stats', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setStats(res.data.stats);
    } catch (err) { console.error(err); }
  };

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('cherif_token');
      const res = await axios.get('http://127.0.0.1:5001/api/courses/my-courses', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setCourses(res.data.courses);
    } catch (err) { console.error(err); }
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cherif_token');
      if (editingId) {
        await axios.put(`http://127.0.0.1:5001/api/courses/${editingId}`, courseForm, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('http://127.0.0.1:5001/api/courses', courseForm, { headers: { Authorization: `Bearer ${token}` } });
      }
      resetCourseForm();
      fetchMyCourses();
      fetchStats();
      setActiveTab('courses');
    } catch (err) { alert('حدث خطأ أثناء حفظ المسار'); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المسار نهائياً من النظام؟')) return;
    try {
      const token = localStorage.getItem('cherif_token');
      await axios.delete(`http://127.0.0.1:5001/api/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchMyCourses();
      fetchStats();
    } catch (err) { alert('خطأ في الحذف'); }
  };

  const resetCourseForm = () => {
    setEditingId(null);
    setCourseForm({ title: '', description: '', price: 0, thumbnail: '' });
    setCourseStep(1);
  };

  const openCurriculumManager = async (course) => {
    setManagingCourse(course);
    setActiveTab('curriculum');
    fetchLessons(course._id);
  };

  const fetchLessons = async (courseId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5001/api/courses/${courseId}/lessons`);
      if (res.data.success) {
        setLessons(res.data.lessons);
        resetLessonForm(res.data.lessons.length + 1, activeSection);
      }
    } catch (err) { console.error('خطأ في جلب الدروس'); }
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const sec = lesson.section || 'الوحدة 1: الأساسيات';
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(lesson);
    return acc;
  }, {});

  const handleAddNewSection = () => {
    const newSectionName = prompt('أدخل اسم الوحدة الجديدة (مثال: الوحدة 2: المكونات المتقدمة):');
    if (newSectionName && newSectionName.trim() !== '') {
      setActiveSection(newSectionName);
      setLessonForm(prev => ({ ...prev, section: newSectionName }));
    }
  };

  // 🆕 تم تعديل وظيفة شريط الأدوات للـ quiz لفتح واجهة الأسئلة بدلاً من حقن نص
  const insertElement = (type) => {
    let snippet = '';
    if (type === 'video') document.getElementById('videoUrlInput')?.focus();
    if (type === 'article') snippet = '\n\n### عنوان فرعي جديد\nاكتب الشرح هنا...\n';
    if (type === 'code') snippet = '\n\n```javascript\n// اكتب الشفرة البرمجية هنا\nconst app = "CherifPlatform";\n```\n';
    
    if (type === 'quiz') {
      setLessonForm(prev => ({
        ...prev,
        quiz: [...(prev.quiz || []), { question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
      }));
      return; // توقف هنا ولا تضف نصاً للـ textarea
    }

    if (snippet) {
      setLessonForm(prev => ({ ...prev, content: prev.content + snippet }));
      if (contentTextareaRef.current) {
        contentTextareaRef.current.focus();
      }
    }
  };

  // 🆕 دوال إدارة واجهة الاختبار (تحديث السؤال، وتحديث الخيارات، وحذف سؤال)
  const handleQuizChange = (qIndex, field, value) => {
    const updatedQuiz = [...lessonForm.quiz];
    updatedQuiz[qIndex][field] = value;
    setLessonForm({ ...lessonForm, quiz: updatedQuiz });
  };

  const handleQuizOptionChange = (qIndex, optIndex, value) => {
    const updatedQuiz = [...lessonForm.quiz];
    updatedQuiz[qIndex].options[optIndex] = value;
    setLessonForm({ ...lessonForm, quiz: updatedQuiz });
  };

  const removeQuestion = (qIndex) => {
    const updatedQuiz = lessonForm.quiz.filter((_, i) => i !== qIndex);
    setLessonForm({ ...lessonForm, quiz: updatedQuiz });
  };

  const resetLessonForm = (nextOrder = 1, section = activeSection) => {
    setEditingLessonId(null);
    setLessonForm({ title: '', description: '', content: '', videoUrl: '', order: nextOrder, isFreePreview: false, section, quiz: [] });
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cherif_token');
      if (editingLessonId) {
        await axios.put(`http://127.0.0.1:5001/api/lessons/${editingLessonId}`, lessonForm, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`http://127.0.0.1:5001/api/courses/${managingCourse._id}/lessons`, lessonForm, { headers: { Authorization: `Bearer ${token}` } });
      }
      fetchLessons(managingCourse._id);
    } catch (err) { alert('خطأ في حفظ الدرس'); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('هل تريد حذف هذا الدرس بشكل نهائي؟')) return;
    try {
      const token = localStorage.getItem('cherif_token');
      await axios.delete(`http://127.0.0.1:5001/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLessons(managingCourse._id);
    } catch (err) { alert('خطأ في حذف الدرس'); }
  };

  return (
    <div className="min-h-screen py-10 px-6 animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* القائمة الجانبية (تعرض فقط خارج باني المنهج) */}
        {activeTab !== 'curriculum' && (
          <div className="w-full md:w-64 bg-gray-900 border border-gray-800 rounded-3xl p-6 h-fit shrink-0">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Video className="text-purple-500" /> غرفة التحكم
            </h2>
            <div className="space-y-2">
              <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                <BarChart3 size={18} /> الرادار (الإحصائيات)
              </button>
              <button onClick={() => setActiveTab('courses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'courses' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                <LayoutDashboard size={18} /> الأبراج (دوراتي)
              </button>
              <button onClick={() => { resetCourseForm(); setActiveTab('add_course'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'add_course' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-gray-400 hover:bg-gray-800'}`}>
                <PlusCircle size={18} /> تهيئة مسار جديد
              </button>
            </div>
          </div>
        )}

        {/* منطقة العرض الرئيسية */}
        {activeTab !== 'curriculum' && (
          <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            
            {/* 1️⃣ الإحصائيات */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-black text-white mb-6 border-b border-gray-800 pb-4">نظرة عامة على أداء كورساتك</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl flex items-center gap-4 hover:border-purple-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-purple-900/30 flex items-center justify-center text-purple-500"><DollarSign size={24}/></div>
                    <div><p className="text-gray-500 text-sm font-bold">إجمالي الأرباح</p><p className="text-2xl font-black text-white">${stats.totalRevenue}</p></div>
                  </div>
                  <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-emerald-900/30 flex items-center justify-center text-emerald-500"><Users size={24}/></div>
                    <div><p className="text-gray-500 text-sm font-bold">الطلاب المشتركين</p><p className="text-2xl font-black text-white">{stats.totalStudents}</p></div>
                  </div>
                  <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center text-blue-500"><BookOpen size={24}/></div>
                    <div><p className="text-gray-500 text-sm font-bold">المسارات المنشورة</p><p className="text-2xl font-black text-white">{stats.totalCourses}</p></div>
                  </div>
                </div>
              </div>
            )}

            {/* 2️⃣ عرض الكورسات */}
            {activeTab === 'courses' && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-black text-white mb-6 border-b border-gray-800 pb-4">المسارات المنشورة في النظام</h2>
                {courses.length === 0 ? (
                  <div className="text-center py-20"><Video className="mx-auto text-gray-600 mb-4" size={48} /><p className="text-gray-400">لا توجد مسارات حالياً.</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                      <div key={course._id} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden flex flex-col group hover:border-purple-500/30 transition-all">
                        <div className="h-40 bg-gray-800 relative">
                          {course.thumbnail && <img src={course.thumbnail} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" alt="" />}
                          <div className="absolute top-3 left-3 bg-gray-900/80 text-white px-3 py-1 rounded-lg font-black text-sm">{course.price === 0 ? 'مجاني' : `$${course.price}`}</div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">{course.title}</h3>
                          <button onClick={() => openCurriculumManager(course)} className="w-full mt-auto mb-3 bg-purple-900/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                            <ListVideo size={18} /> باني المنهج
                          </button>
                          <div className="flex gap-2">
                            <button onClick={() => { setCourseForm(course); setEditingId(course._id); setActiveTab('add_course'); }} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                              <Edit size={14} /> تعديل
                            </button>
                            <button onClick={() => handleDeleteCourse(course._id)} className="bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3️⃣ معالج النشر الذكي */}
            {activeTab === 'add_course' && (
              <div className="animate-fade-in-up">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-2">{editingId ? 'تحديث بيانات المسار' : 'تهيئة مسار جديد في النظام'}</h2>
                  <p className="text-gray-400 text-sm">اتبع الخطوات لإعداد كورس احترافي يليق بنخبة المطورين.</p>
                </div>

                <div className="flex items-center justify-between mb-8 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 z-0 rounded-full"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-purple-600 z-0 rounded-full transition-all duration-500" style={{ width: courseStep === 1 ? '0%' : courseStep === 2 ? '50%' : '100%' }}></div>
                  {[1, 2, 3].map((step) => (
                    <div key={step} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-300 ${courseStep >= step ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-gray-900 border-2 border-gray-700 text-gray-500'}`}>
                      {courseStep > step ? <CheckCircle size={20} /> : step}
                    </div>
                  ))}
                </div>

                <form onSubmit={courseStep === 3 ? handleSubmitCourse : (e) => { e.preventDefault(); setCourseStep(courseStep + 1); }} className="space-y-6 bg-gray-950 p-8 rounded-2xl border border-gray-800">
                  {courseStep === 1 && (
                    <div className="space-y-5 animate-fade-in-up">
                      <h3 className="text-xl font-bold text-white mb-4 text-purple-400">1. هوية المسار</h3>
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">العنوان الرئيسي</label>
                        <input type="text" required placeholder="مثال: إتقان React.js المتقدم" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">الوصف الشامل</label>
                        <textarea required placeholder="ماذا سيتعلم الطالب..." className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none h-32 resize-none" value={courseForm.description} onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}></textarea>
                      </div>
                    </div>
                  )}

                  {courseStep === 2 && (
                    <div className="space-y-5 animate-fade-in-up">
                      <h3 className="text-xl font-bold text-white mb-4 text-purple-400">2. الكنوز والوسائط</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-400 mb-2">السعر ($)</label>
                          <input type="number" required min="0" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none" value={courseForm.price} onChange={(e) => setCourseForm({...courseForm, price: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-400 mb-2">رابط صورة الغلاف</label>
                          <input type="text" placeholder="https://..." className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none" value={courseForm.thumbnail} onChange={(e) => setCourseForm({...courseForm, thumbnail: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  )}

                  {courseStep === 3 && (
                    <div className="space-y-5 animate-fade-in-up text-center py-8">
                      <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/50 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                        <CheckCircle size={40} className="text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-black text-white">جاهز للنشر!</h3>
                      <p className="text-gray-400 max-w-md mx-auto">اضغط لإضافة المسار وبدء بناء المنهج والدروس.</p>
                    </div>
                  )}

                  <div className="flex justify-between pt-6 border-t border-gray-800 mt-8">
                    {courseStep > 1 ? (
                      <button type="button" onClick={() => setCourseStep(courseStep - 1)} className="flex items-center gap-2 text-gray-400 hover:text-white font-bold py-2 px-4 rounded-xl">
                        <ChevronRight size={20} /> السابق
                      </button>
                    ) : <div></div>}
                    {courseStep < 3 ? (
                      <button type="submit" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                        التالي <ChevronLeft size={20} />
                      </button>
                    ) : (
                      <button type="submit" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        {editingId ? 'حفظ التعديلات' : 'إطلاق المسار'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 4️⃣ باني المناهج البصري المتقدم (The Master Forge) يغطي الشاشة */}
        {activeTab === 'curriculum' && managingCourse && (
          <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col animate-fade-in">
            
            {/* شريط التحكم العلوي */}
            <div className="h-16 bg-gray-900 border-b border-gray-800 flex justify-between items-center px-6 shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => { setActiveTab('courses'); resetLessonForm(); }} className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <ArrowRight size={20} />
                </button>
                <div>
                  <h2 className="text-lg font-black text-white leading-tight">{managingCourse.title}</h2>
                  <p className="text-xs text-emerald-500 font-bold">باني المنهج المتقدم (Workspace)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-gray-800 px-4 py-2 rounded-lg text-xs font-bold text-gray-400 flex items-center gap-2">
                  <BookOpen size={14} /> إجمالي الدروس: <span className="text-white">{lessons.length}</span>
                </div>
                <button onClick={() => alert('تمت مزامنة جميع البيانات بنجاح! 🚀')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2">
                  <CheckCircle size={16} /> حفظ التغييرات
                </button>
              </div>
            </div>

            {/* مساحة العمل ثلاثية الأبعاد */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* 1. العمود الأيمن: هيكل المنهج (الشجرة التفاعلية) */}
              <div className="w-80 bg-gray-900/50 border-l border-gray-800 flex flex-col shrink-0 overflow-y-auto">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ListVideo size={16} className="text-purple-500" /> هيكل المسار
                  </h3>
                  <button onClick={handleAddNewSection} className="text-xs text-purple-400 hover:text-purple-300 font-bold bg-purple-900/20 px-2 py-1 rounded border border-purple-500/30 transition-colors">
                    + وحدة جديدة
                  </button>
                </div>
                
                <div className="p-4 space-y-6">
                  {Object.keys(groupedLessons).length === 0 ? (
                    <div className="text-center py-10"><p className="text-xs text-gray-500">لا توجد دروس. ابدأ بإضافة الدرس الأول.</p></div>
                  ) : (
                    Object.entries(groupedLessons).map(([sectionName, sectionLessons]) => (
                      <div key={sectionName} className="space-y-2">
                        <div onClick={() => { setActiveSection(sectionName); setLessonForm(prev => ({...prev, section: sectionName})); }} className={`flex items-center gap-2 font-bold text-sm p-2 rounded-lg border cursor-pointer transition-colors ${activeSection === sectionName ? 'bg-purple-900/20 border-purple-500/50 text-purple-400' : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800'}`}>
                          <ChevronLeft size={16} className={activeSection === sectionName ? '-rotate-90 transition-transform' : ''} /> {sectionName}
                        </div>
                        
                        {sectionLessons.map((lesson) => (
                          <div key={lesson._id} className={`mr-4 border p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors group ${editingLessonId === lesson._id ? 'bg-gray-800 border-purple-500' : 'bg-gray-950 border-gray-800 hover:border-purple-500/30'}`}>
                            <div className="flex items-center gap-3 overflow-hidden flex-1" onClick={() => { 
                                setEditingLessonId(lesson._id); 
                                // 🆕 جلب الاختبارات إن وجدت
                                setLessonForm({ ...lesson, quiz: lesson.quiz || [] }); 
                                setActiveSection(lesson.section || sectionName); 
                              }}>
                              <span className="text-gray-500 font-black text-xs">{lesson.order}</span>
                              <span className="text-sm font-bold text-white truncate">{lesson.title}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson._id); }} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                  <button onClick={() => resetLessonForm(lessons.length + 1)} className="w-full mt-4 py-2 bg-gray-900 border border-gray-800 border-dashed rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center gap-2">
                    <PlusCircle size={14} /> درس جديد في ({activeSection})
                  </button>
                </div>
              </div>

              {/* 2. العمود الأوسط: محرر العناصر (The Editor) */}
              <div className="flex-1 bg-[#0a0f16] flex flex-col overflow-y-auto">
                <div className="max-w-3xl w-full mx-auto p-8 space-y-8">
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-white">{editingLessonId ? 'تحرير الدرس المفتوح' : 'تهيئة درس جديد'}</h3>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-400 bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                      <input type="checkbox" className="accent-emerald-500 rounded" checked={lessonForm.isFreePreview} onChange={(e) => setLessonForm({...lessonForm, isFreePreview: e.target.checked})} /> 
                      متاح كمعاينة مجانية للمشاهدة
                    </label>
                  </div>

                  <form onSubmit={handleSaveLesson} className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-400 mb-2">عنوان الدرس</label>
                        <input type="text" required placeholder="مثال: كيف تعمل الـ State في React؟" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-4 px-4 text-lg font-bold focus:border-purple-500 outline-none" value={lessonForm.title} onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})} />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-bold text-gray-400 mb-2">الترتيب</label>
                        <input type="number" required min="1" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-4 px-4 text-lg font-bold focus:border-purple-500 outline-none text-center" value={lessonForm.order} onChange={(e) => setLessonForm({...lessonForm, order: Number(e.target.value)})} />
                      </div>
                    </div>

                    {/* شريط أدوات إضافة العناصر */}
                    <div className="bg-gray-900 border border-gray-800 p-2 rounded-xl flex flex-wrap gap-2">
                      <button type="button" onClick={() => insertElement('video')} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-lg transition-colors">
                        <Video size={16} className="text-blue-400" /> إضافة فيديو
                      </button>
                      <button type="button" onClick={() => insertElement('article')} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-lg transition-colors">
                        <FileText size={16} className="text-emerald-400" /> مقال / شرح
                      </button>
                      <button type="button" onClick={() => insertElement('code')} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 rounded-lg transition-colors">
                        <Code size={16} className="text-yellow-400" /> كود برمجي
                      </button>
                      {/* 🆕 زر الاختبار المحدث */}
                      <button type="button" onClick={() => insertElement('quiz')} className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:bg-purple-900/50 hover:text-purple-300 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-purple-500/50">
                        <HelpCircle size={16} className="text-purple-400" /> إضافة سؤال (Quiz)
                      </button>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
                      <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                        <Video size={18} className="text-blue-500" /> مصدر الفيديو
                      </label>
                      <input id="videoUrlInput" type="text" placeholder="رابط YouTube أو MP4..." className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 text-sm focus:border-blue-500 outline-none font-mono" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})} />
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl">
                      <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                        <FileText size={18} className="text-emerald-500" /> الشرح النصي والأكواد (يدعم Markdown)
                      </label>
                      <textarea ref={contentTextareaRef} placeholder="اكتب الشرح هنا... استخدم شريط الأدوات بالاعلى لحقن الأكواد الجاهزة." className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 text-sm h-64 font-mono focus:border-emerald-500 outline-none resize-none leading-relaxed" value={lessonForm.content} onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})}></textarea>
                    </div>

                    {/* 🆕 باني الاختبارات (Quiz Builder UI) */}
                    {lessonForm.quiz && lessonForm.quiz.length > 0 && (
                      <div className="bg-purple-900/10 border border-purple-500/30 p-6 rounded-2xl space-y-6">
                        <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                          <h4 className="text-purple-400 font-black text-lg flex items-center gap-2"><HelpCircle size={20}/> مهام التقييم (الأسئلة)</h4>
                        </div>
                        
                        {lessonForm.quiz.map((q, qIndex) => (
                          <div key={qIndex} className="bg-gray-950 border border-gray-800 p-5 rounded-xl relative group">
                            <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-4 left-4 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                            
                            <label className="block text-xs font-bold text-gray-400 mb-2">السؤال {qIndex + 1}</label>
                            <input type="text" required placeholder="ما هو الـ State في React؟" className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-2.5 px-4 text-sm focus:border-purple-500 outline-none mb-4" value={q.question} onChange={(e) => handleQuizChange(qIndex, 'question', e.target.value)} />
                            
                            <label className="block text-xs font-bold text-gray-400 mb-2">الخيارات (اختر الإجابة الصحيحة بالدائرة)</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt, optIndex) => (
                                <div key={optIndex} className={`flex items-center gap-3 p-2 rounded-lg border ${q.correctAnswerIndex === optIndex ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-800 bg-gray-900'}`}>
                                  <input type="radio" required name={`correct-${qIndex}`} checked={q.correctAnswerIndex === optIndex} onChange={() => handleQuizChange(qIndex, 'correctAnswerIndex', optIndex)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                                  <input type="text" required placeholder={`الخيار ${optIndex + 1}`} className="w-full bg-transparent text-white text-sm outline-none" value={opt} onChange={(e) => handleQuizOptionChange(qIndex, optIndex, e.target.value)} />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => insertElement('quiz')} className="w-full py-3 bg-purple-900/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white font-bold rounded-xl transition-colors text-sm">
                          + إضافة سؤال آخر
                        </button>
                      </div>
                    )}

                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl text-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                      {editingLessonId ? 'تحديث بيانات الدرس' : 'إضافة الدرس للمسار'}
                    </button>
                  </form>
                </div>
              </div>

              {/* 3. العمود الأيسر: المعاينة الحية (Live Student Preview) */}
              <div className="w-[450px] bg-[#0b1120] border-r border-gray-800 shrink-0 hidden xl:flex flex-col relative overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center sticky top-0 z-10">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye size={16} className="text-blue-500" /> معاينة شاشة الطالب
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-500/30 uppercase tracking-widest font-bold">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Live
                  </span>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  
                  {/* محاكاة مشغل الفيديو */}
                  <div className="w-full aspect-video bg-gray-900 rounded-xl border border-gray-800 flex flex-col items-center justify-center relative overflow-hidden mb-6 group">
                    {lessonForm.videoUrl ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                        <Play size={48} className="text-white/50 z-20" />
                        <p className="absolute bottom-3 left-3 text-xs font-mono text-gray-400 z-20 truncate w-11/12">{lessonForm.videoUrl}</p>
                      </>
                    ) : (
                      <div className="text-gray-600 flex flex-col items-center gap-2">
                        <Video size={32} />
                        <span className="text-xs font-bold">لا يوجد فيديو</span>
                      </div>
                    )}
                  </div>

                  {/* محاكاة العنوان والمحتوى */}
                  <h1 className="text-2xl font-black text-white mb-6 leading-tight">
                    {lessonForm.title || 'عنوان الدرس سيظهر هنا...'}
                  </h1>

                  <div className="prose prose-invert prose-sm max-w-none mb-8">
                    {lessonForm.content ? (
                      <div className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {lessonForm.content.split('```').map((block, index) => {
                          if (index % 2 !== 0) {
                            return <div key={index} className="bg-[#1e1e1e] p-4 my-4 rounded-xl border border-gray-700 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">{block}</div>;
                          }
                          return <span key={index}>{block}</span>;
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3 opacity-20">
                        <div className="h-3 bg-gray-500 rounded w-full"></div>
                        <div className="h-3 bg-gray-500 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-500 rounded w-4/6"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* 🆕 محاكاة واجهة الاختبار للطالب في المعاينة الحية */}
                  {lessonForm.quiz && lessonForm.quiz.length > 0 && (
                    <div className="border-t border-purple-900/50 pt-6 mt-6">
                      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2"><CheckCircle className="text-purple-500" size="{20}"/> اختبار المهارات</h3>
                      
                      {lessonForm.quiz.map((q, i) => (
                        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
                          <p className="text-white font-bold mb-4 text-sm leading-relaxed">{q.question || 'نص السؤال سيظهر هنا...'}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className={`p-3 rounded-lg border ${q.correctAnswerIndex === oIdx ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' : 'bg-gray-950 border-gray-800 text-gray-400'} text-xs font-bold flex items-center gap-3 transition-colors`}>
                                <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${q.correctAnswerIndex === oIdx ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'border-gray-600'}`}></div>
                                {opt || `الخيار ${oIdx + 1}`}
                                {q.correctAnswerIndex === oIdx && <span className="mr-auto text-[10px] bg-emerald-900/50 px-2 py-0.5 rounded text-emerald-300">الإجابة الصحيحة</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* محاكاة زر إنهاء الدرس */}
                  <div className="mt-8 border-t border-gray-800 pt-6">
                    <div className="w-full bg-emerald-900/20 border border-emerald-500/30 text-emerald-500/50 py-3 rounded-xl font-bold flex justify-center items-center gap-2 text-sm cursor-not-allowed">
                      <CheckCircle size="{16}"/> لقد أنهيت هذا الدرس (محاكاة)
                    </div>
                  </div>
                  
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorStudio;