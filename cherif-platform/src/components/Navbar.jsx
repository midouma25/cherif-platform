import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Code, Briefcase, Lock, Terminal, User, LogOut, BookOpenText, Trophy, UserPlus, Presentation } from 'lucide-react';
import { AuthContext } from '../AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); 
  
  const navLinks = [
    { path: '/academy', name: 'الأكاديمية', icon: <Code size={18} /> },
    { path: '/vault', name: 'الخزنة السرية', icon: <Lock size={18} /> },
    { path: '/b2b', name: 'حلول الشركات', icon: <Briefcase size={18} /> },
    { path: '/hub', name: 'المستندات', icon: <BookOpenText size={18} /> },
    { path: '/rankings', name: 'التصنيفات', icon: <Trophy size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const becomeInstructor = async () => {
    if (!window.confirm('هل أنت مستعد لنقل خبرتك وتصبح صانع محتوى في النظام؟')) return;
    try {
      const token = localStorage.getItem('cherif_token');
      const res = await axios.post('http://127.0.0.1:5001/api/user/become-instructor', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert(res.data.message);
        window.location.href = '/instructor';
      }
    } catch (err) {
      alert('حدث خطأ أثناء الترقية. يرجى المحاولة لاحقاً.');
    }
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
      {/* 🛠️ تعديل 1: تكبير الحاوية إلى max-w-7xl لإعطاء مساحة تنفس للعناصر */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* ================= القسم الأيمن: اللوجو + الروابط ================= */}
        <div className="flex items-center gap-10">
          
          {/* اللوجو (shrink-0 لمنع انضغاطه) */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Terminal size={22} className="text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-wider">
              CHERIF<span className="text-emerald-500">.DEV</span>
            </span>
          </Link>

          {/* روابط الصفحات */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`flex items-center gap-2 text-sm font-bold transition-colors ${location.pathname.includes(link.path) ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}>
                {link.icon} {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ================= القسم الأيسر: أزرار المستخدم ================= */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              
              {/* زر الاستوديو / الترقية */}
              {user.role === 'instructor' || user.role === 'admin' ? (
                // 🛠️ تعديل 2: إضافة whitespace-nowrap لمنع انكسار النص إلى سطرين
                <Link to="/instructor" className="hidden lg:flex items-center gap-2 text-emerald-400 hover:text-white bg-emerald-900/20 hover:bg-emerald-600/30 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] whitespace-nowrap shrink-0">
                  <Presentation size={18} /> استوديو الأستاذ
                </Link>
              ) : (
                <button onClick={becomeInstructor} className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-emerald-400 text-sm font-bold transition-colors whitespace-nowrap shrink-0">
                  <UserPlus size={18} /> التدريس في المنصة
                </button>
              )}

              {/* 🛠️ تعديل 3: إضافة خط فاصل عمودي (Divider) لفصل الروابط عن بطاقة المستخدم */}
              <div className="hidden lg:block w-px h-8 bg-gray-800 mx-1"></div>

              {/* 🛠️ تعديل 4: إعادة تصميم بطاقة المستخدم لتكون كبسولة متناسقة */}
              <div className="flex items-center gap-3 bg-gray-900/80 border border-gray-800 pl-2 pr-4 py-1.5 rounded-2xl hover:border-gray-700 transition-colors shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-black text-white leading-tight">{user.name}</div>
                  <div className="text-[11px] font-bold text-emerald-500 mt-0.5">
                    {user.role === 'admin' ? 'عاهل النظام' : user.role === 'instructor' ? 'صانع أبراج' : 'مطور'}
                  </div>
                </div>
                
                {/* فاصل داخلي رفيع بين الاسم وأزرار التحكم */}
                <div className="flex items-center gap-1.5 mr-2 border-r border-gray-800 pr-3">
                  <Link to={user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/hub'} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-emerald-900/50 text-gray-400 hover:text-emerald-400 rounded-lg transition-colors" title="لوحة التحكم">
                    <User size={16} />
                  </Link>
                  <button onClick={handleLogout} className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-red-900/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors" title="تسجيل الخروج">
                    <LogOut size={16} />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-400 hover:text-white font-bold text-sm px-3 transition-colors">
                تسجيل الدخول
              </Link>
              <Link to="/login" className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] whitespace-nowrap">
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;