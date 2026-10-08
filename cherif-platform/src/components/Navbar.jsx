import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code, Briefcase, Lock, Terminal, User, LogOut , BookOpenText} from 'lucide-react';
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

];

  const handleLogout = () => {
    logout();
    navigate('/login'); // توجيه لصفحة الدخول بعد تسجيل الخروج
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* اللوجو */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-2 rounded-lg">
            <Terminal size={24} className="text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-wider">
            CHERIF<span className="text-emerald-500">.DEV</span>
          </span>
        </Link>

        {/* روابط الصفحات */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={`flex items-center gap-2 text-sm font-bold ${location.pathname.includes(link.path) ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'}`}>
              {link.icon} {link.name}
            </Link>
          ))}
        </div>

        {/* أزرار الدخول والخروج */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 px-2 py-1.5 rounded-xl">
              <div className="text-right hidden sm:block px-2">
                <div className="text-sm font-bold text-white">{user.name}</div>
                <div className="text-xs text-emerald-500">
                  {user.role === 'admin' ? 'المدير العام' : user.role === 'instructor' ? 'أستاذ' : 'طالب'}
                </div>
              </div>
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/hub'} className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors" title="لوحة التحكم">
                <User size={16} />
              </Link>
              <button onClick={handleLogout} className="bg-red-900/20 text-red-400 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors" title="تسجيل الخروج">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-gray-300 hover:text-white font-bold text-sm px-4">
                تسجيل الدخول
              </Link>
              <Link to="/login" className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all">
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