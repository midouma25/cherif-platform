import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Video, PlusCircle, LayoutDashboard, Edit, Trash2, Image as ImageIcon, ListVideo, ArrowRight, PlayCircle } from 'lucide-react';

const InstructorStudio = () => {
  const { user } = useContext(AuthContext);
  
  // حالات (States) الكورسات
  const [courses, setCourses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', price: 0, thumbnail: '' });

  // حالات (States) الدروس والمنهج
  const [managingCourse, setManagingCourse] = useState(null); // الكورس المفتوح لإدارة دروسه
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', videoUrl: '', order: 1, isFreePreview: false });

  useEffect(() => {
    fetchMyCourses();
  }, []);

  // =========================================
  // دوال الكورسات
  // =========================================
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
    } catch (err) { alert('حدث خطأ'); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('هل أنت متأكد من الحذف نهائياً؟')) return;
    try {
      const token = localStorage.getItem('cherif_token');
      await axios.delete(`http://127.0.0.1:5001/api/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchMyCourses();
    } catch (err) { alert('خطأ في الحذف'); }
  };

  const resetCourseForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setCourseForm({ title: '', description: '', price: 0, thumbnail: '' });
  };

  // =========================================
  // دوال الدروس (الجديدة)
  // =========================================
  const openCurriculumManager = async (course) => {
    setManagingCourse(course);
    fetchLessons(course._id);
  };

  const fetchLessons = async (courseId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5001/api/courses/${courseId}/lessons`);
      if (res.data.success) setLessons(res.data.lessons);
    } catch (err) { console.error('خطأ في جلب الدروس'); }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cherif_token');
      await axios.post(`http://127.0.0.1:5001/api/courses/${managingCourse._id}/lessons`, lessonForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // تصفير فورم الدرس وزيادة الترتيب تلقائياً للدرس القادم
      setLessonForm({ title: '', description: '', videoUrl: '', order: lessonForm.order + 1, isFreePreview: false });
      fetchLessons(managingCourse._id); // تحديث القائمة
    } catch (err) {
      alert('خطأ في إضافة الدرس');
    }
  };

  // =========================================
  // واجهة المستخدم (UI)
  // =========================================
  return (
    <div className="min-h-screen py-10 px-6 animate-fade-in-up">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* القائمة الجانبية */}
        <div className="w-full md:w-64 bg-gray-900 border border-gray-800 rounded-3xl p-6 h-fit shrink-0">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <Video className="text-purple-500" /> الاستوديو
          </h2>
          <div className="space-y-2">
            <button onClick={() => { setManagingCourse(null); resetCourseForm(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${!isAdding && !managingCourse ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              <LayoutDashboard size={18} /> دوراتي
            </button>
            <button onClick={() => { setManagingCourse(null); resetCourseForm(); setIsAdding(true); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isAdding && !managingCourse ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
              <PlusCircle size={18} /> كورس جديد
            </button>
          </div>
        </div>

        {/* منطقة العرض الرئيسية */}
        <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          
          {/* 1️⃣ وضع إدارة المنهج (Curriculum Manager) */}
          {managingCourse ? (
            <div className="animate-fade-in-up">
              <button onClick={() => setManagingCourse(null)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-purple-500 font-bold text-sm transition-all">
                <ArrowRight size={16} /> العودة لقائمة الكورسات
              </button>
              
              <h2 className="text-2xl font-black text-white mb-2">المنهج الدراسي: <span className="text-purple-400">{managingCourse.title}</span></h2>
              <p className="text-gray-500 text-sm mb-8 pb-6 border-b border-gray-800">أضف الدروس، الفيديوهات، ورتبها لطلابك.</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* فورم إضافة درس */}
                <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 h-fit">
                  <h3 className="text-lg font-bold text-white mb-4">إضافة درس جديد</h3>
                  <form onSubmit={handleCreateLesson} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">عنوان الدرس</label>
                      <input type="text" required className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-2.5 px-4 focus:border-purple-500 outline-none text-sm"
                        value={lessonForm.title} onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">رابط الفيديو (URL)</label>
                      <input type="text" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-2.5 px-4 focus:border-purple-500 outline-none text-sm"
                        placeholder="رابط يوتيوب أو فيديو..." value={lessonForm.videoUrl} onChange={(e) => setLessonForm({...lessonForm, videoUrl: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">الترتيب</label>
                        <input type="number" required min="1" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-2.5 px-4 focus:border-purple-500 outline-none text-sm"
                          value={lessonForm.order} onChange={(e) => setLessonForm({...lessonForm, order: Number(e.target.value)})} />
                      </div>
                      <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 accent-purple-600 rounded" 
                            checked={lessonForm.isFreePreview} onChange={(e) => setLessonForm({...lessonForm, isFreePreview: e.target.checked})} />
                          <span className="text-xs font-bold text-gray-300">متاح كمعاينة مجانية؟</span>
                        </label>
                      </div>
                      <div>
  <label className="block text-xs font-bold text-gray-400 mb-1">محتوى الدرس (يدعم Markdown والأكواد)</label>
  <textarea required className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none text-sm h-48 font-mono"
    placeholder="اكتب هنا... يمكنك استخدام ```python لكتابة الكود" 
    value={lessonForm.content || ''} 
    onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})}></textarea>
</div>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl mt-2 text-sm">
                      ➕ حفظ الدرس
                    </button>
                  </form>
                </div>

                {/* قائمة الدروس الحالية */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white mb-4">الدروس الحالية ({lessons.length})</h3>
                  {lessons.length === 0 ? (
                    <div className="text-center py-10 bg-gray-950 border border-dashed border-gray-800 rounded-2xl text-gray-500 text-sm">
                      لا توجد دروس بعد.
                    </div>
                  ) : (
                    lessons.map((lesson) => (
                      <div key={lesson._id} className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gray-900 text-gray-400 flex items-center justify-center font-black text-sm">
                          {lesson.order}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-sm flex items-center gap-2">
                            {lesson.title}
                            {lesson.isFreePreview && <span className="bg-emerald-900/40 text-emerald-400 text-[10px] px-2 py-0.5 rounded">مجاني</span>}
                          </h4>
                          {lesson.videoUrl && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><PlayCircle size={12}/> فيديو مرفق</p>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) 
          
          /* 2️⃣ وضع إضافة/تعديل الكورسات */
          : isAdding ? (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-black text-white mb-6 border-b border-gray-800 pb-4">
                {editingId ? 'تعديل بيانات الكورس' : 'إعداد كورس جديد'}
              </h2>
              {/* فورم الكورس (نفسه القديم) */}
              <form onSubmit={handleSubmitCourse} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">عنوان الكورس</label>
                  <input type="text" required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none"
                    value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">وصف قصير</label>
                  <textarea required className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none h-24 resize-none"
                    value={courseForm.description} onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">السعر ($)</label>
                    <input type="number" required min="0" className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 px-4 focus:border-purple-500 outline-none"
                      value={courseForm.price} onChange={(e) => setCourseForm({...courseForm, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">صورة الغلاف (URL)</label>
                    <div className="relative">
                      <ImageIcon className="absolute right-3 top-3.5 text-gray-500" size={18} />
                      <input type="text" className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl py-3 pr-10 pl-4 focus:border-purple-500 outline-none"
                        value={courseForm.thumbnail} onChange={(e) => setCourseForm({...courseForm, thumbnail: e.target.value})} />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl mt-4">
                  {editingId ? '💾 حفظ التعديلات' : '🚀 نشر الكورس'}
                </button>
              </form>
            </div>
          ) 
          
          /* 3️⃣ وضع عرض قائمة الكورسات */
          : (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-black text-white mb-6 border-b border-gray-800 pb-4">دوراتي المنشورة</h2>
              {courses.length === 0 ? (
                <div className="text-center py-20 bg-gray-950/50 rounded-2xl border border-gray-800 border-dashed">
                  <Video className="mx-auto text-gray-600 mb-4" size={48} />
                  <p className="text-gray-400">لم تقم بإضافة أي كورسات بعد.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map(course => (
                    <div key={course._id} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden group flex flex-col">
                      <div className="h-40 bg-gray-800 relative overflow-hidden">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={40} /></div>
                        )}
                        <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur text-white px-3 py-1 rounded-lg font-black text-sm">
                          {course.price === 0 ? 'مجاني' : `$${course.price}`}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                        
                        {/* الزر الجديد لإدارة الدروس */}
                        <button onClick={() => openCurriculumManager(course)} className="w-full mt-auto mb-3 bg-purple-900/30 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                          <ListVideo size={18} /> إدارة الدروس (المنهج)
                        </button>
                        
                        <div className="flex gap-2">
                          <button onClick={() => { setCourseForm(course); setEditingId(course._id); setIsAdding(true); }} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-all">
                            <Edit size={14} /> تعديل الاسم
                          </button>
                          <button onClick={() => handleDeleteCourse(course._id)} className="bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorStudio;