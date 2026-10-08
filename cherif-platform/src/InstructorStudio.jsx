import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Video, PlusCircle, LayoutDashboard, Edit, Trash2, ListVideo, ArrowRight, BarChart3, Users, DollarSign, BookOpen, CheckCircle, ChevronRight, ChevronLeft, Play, Eye, FileText } from 'lucide-react';

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
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', content: '', videoUrl: '', order: 1, isFreePreview: false });

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
        // جعل ترتيب الدرس القادم تلقائياً هو الرقم التالي
        setLessonForm(prev => ({ ...prev, order: res.data.lessons.length + 1 }));
      }
    } catch (err) { console.error('خطأ في جلب الدروس'); }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cherif_token');
      await axios.post(`http://127.0.0.1:5001/api/courses/${managingCourse._id}/lessons`, lessonForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLessonForm({ title: '', description: '', content: '', videoUrl: '', order: lessons.length + 2, isFreePreview: false });
      fetchLessons(managingCourse._id);
    } catch (err) { alert('خطأ في إضافة الدرس'); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('هل تريد حذف هذا الدرس؟')) return;
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
        
        {/* القائمة الجانبية */}
        <div className="w-full md:w-64 bg-gray-900 border border-gray-800 rounded-3xl p-6 h-fit shrink-0">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <Video className="text-purple-500" /> غرفة التحكم
          </h2>
          <div className="space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-gray-400 hover:bg-gray-800'}`}>
              <BarChart3 size={18} /> الرادار (الإحصائيات)
            </button>
            <button onClick={() => setActiveTab('courses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'courses' || activeTab === 'curriculum' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-gray-400 hover:bg-gray-800'}`}>
              <LayoutDashboard size={18} /> الأبراج (دوراتي)
            </button>
            <button onClick={() => { resetCourseForm(); setActiveTab('add_course'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'add_course' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'text-gray-400 hover:bg-gray-800'}`}>
              <PlusCircle size={18} /> تهيئة مسار جديد
            </button>
          </div>
        </div>

        {/* منطقة العرض الرئيسية */}
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

          {/* 🆕 4️⃣ باني المناهج البصري (Visual Curriculum Builder) */}
          {activeTab === 'curriculum' && managingCourse && (
            <div className="animate-fade-in-up">
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <div>
                  <button onClick={() => setActiveTab('courses')} className="mb-2 flex items-center gap-2 text-gray-400 hover:text-purple-500 font-bold text-xs">
                    <ArrowRight size={14} /> العودة للمسارات
                  </button>
                  <h2 className="text-2xl font-black text-white">إدارة منهج: <span className="text-purple-400">{managingCourse.title}</span></h2>
                </div>
                <div className="bg-gray-950 border border-gray-800 px-4 py-2 rounded-xl text-xs font-bold text-gray-400">
                  إجمالي الدروس: <span className="text-white">{lessons.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* نموذج إضافة درس جديد (الجانب الأيمن) */}
                <div className="lg:col-span-1 bg-gray-950 border border-gray-800 rounded-2xl p-6 h-fit sticky top-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <PlusCircle size={18} className="text-purple-500" /> إضافة درس جديد
                  </h3>
                  <form onSubmit={handleCreateLesson} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">عنوان الدرس</label>
                      <input type="text" required placeholder="مثال: مقدمة في الـ Hooks" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-2.5 px-4 outline-none text-sm focus:border-purple-500" value={lessonForm.title} onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">رابط الفيديو (YouTube / MP4)</label>
                      <input type="text" placeholder="https://..." className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-2.5 px-4 outline-none text-sm focus:border-purple-500" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">الترتيب</label>
                        <input type="number" required min="1" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-2.5 px-4 outline-none text-sm focus:border-purple-500" value={lessonForm.order} onChange={(e) => setLessonForm({...lessonForm, order: Number(e.target.value)})} />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 bg-gray-900 border border-gray-800 w-full p-2.5 rounded-xl">
                          <input type="checkbox" className="accent-purple-600 rounded" checked={lessonForm.isFreePreview} onChange={(e) => setLessonForm({...lessonForm, isFreePreview: e.target.checked})} /> معاينة مجانية
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">محتوى الدرس (Markdown & Code)</label>
                      <textarea required placeholder="اكتب الشرح أو الأكواد هنا..." className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-2.5 px-4 outline-none text-sm h-32 font-mono resize-none focus:border-purple-500" value={lessonForm.content} onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})}></textarea>
                    </div>

                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                      إضافة الدرس للمنهج
                    </button>
                  </form>
                </div>

                {/* قائمة الدروس الحالية (الجانب الأيسر - العرض المرئي) */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <ListVideo size={18} className="text-purple-500" /> هيكل الدروس الحالي
                  </h3>

                  {lessons.length === 0 ? (
                    <div className="text-center py-16 bg-gray-950 border border-gray-800 rounded-2xl">
                      <FileText size={40} className="mx-auto text-gray-600 mb-3" />
                      <p className="text-gray-400 text-sm">لا توجد دروس في هذا المسار بعد. ابدأ بإضافة الدرس الأول من القائمة الجانبية.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lessons.map((lesson) => (
                        <div key={lesson._id} className="bg-gray-950 border border-gray-800 hover:border-purple-500/30 rounded-2xl p-5 flex items-center justify-between transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-900/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black text-sm shrink-0">
                              {lesson.order}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-white font-bold text-base">{lesson.title}</h4>
                                {lesson.isFreePreview && (
                                  <span className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    معاينة مجانية
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-500 text-xs line-clamp-1 font-mono">{lesson.content}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {lesson.videoUrl && (
                              <div className="w-8 h-8 rounded-lg bg-gray-900 text-blue-400 flex items-center justify-center" title="يحتوي على فيديو">
                                <Play size={14} />
                              </div>
                            )}
                            <button onClick={() => handleDeleteLesson(lesson._id)} className="w-8 h-8 rounded-lg bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InstructorStudio;