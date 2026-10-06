import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Users, Shield, TrendingUp, Search, UserCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { AuthContext } from './AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // جلب المستخدمين عند فتح الصفحة
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('cherif_token');
      const res = await axios.get('http://127.0.0.1:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('خطأ في جلب البيانات:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if(!window.confirm(`هل أنت متأكد من تغيير الصلاحية إلى ${newRole}؟`)) return;
    
    try {
      const token = localStorage.getItem('cherif_token');
      await axios.put(`http://127.0.0.1:5001/api/admin/users/${userId}/role`, 
        { newRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // تحديث القائمة بعد التعديل
    } catch (err) {
      alert('حدث خطأ أثناء تعديل الصلاحية.');
    }
  };

  const filteredUsers = users.filter(u => u.name.includes(searchTerm) || u.email.includes(searchTerm));

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>;

  return (
    <div className="min-h-screen py-10 px-6 animate-fade-in-up">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* الترويسة والإحصائيات */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Shield className="text-red-500" size={32} /> غرفة التحكم المركزية
            </h1>
            <p className="text-gray-400 mt-2">نظرة شاملة على مستخدمي المنصة وصلاحياتهم.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-emerald-900/30 p-3 rounded-xl"><Users className="text-emerald-500" size={24} /></div>
              <div>
                <p className="text-gray-400 text-xs font-bold">إجمالي المستخدمين</p>
                <p className="text-2xl font-black text-white">{users.length}</p>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="bg-purple-900/30 p-3 rounded-xl"><UserCheck className="text-purple-500" size={24} /></div>
              <div>
                <p className="text-gray-400 text-xs font-bold">الأساتذة (Instructors)</p>
                <p className="text-2xl font-black text-white">{users.filter(u => u.role === 'instructor').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* جدول المستخدمين */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* شريط البحث */}
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
            <div className="relative w-full max-w-md">
              <Search className="absolute right-4 top-3.5 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="ابحث بالاسم أو البريد..." 
                className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl py-3 pr-12 pl-4 focus:outline-none focus:border-emerald-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-950/80 text-gray-400 text-sm">
                <tr>
                  <th className="p-5 font-bold">المستخدم</th>
                  <th className="p-5 font-bold">البريد الإلكتروني</th>
                  <th className="p-5 font-bold">تاريخ الانضمام</th>
                  <th className="p-5 font-bold">الصلاحية الحالية</th>
                  <th className="p-5 font-bold text-center">إجراءات المدير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-5 font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center text-white font-black shadow-lg">
                        {u.name.charAt(0)}
                      </div>
                      {u.name}
                    </td>
                    <td className="p-5 text-gray-400 font-mono text-sm" dir="ltr">{u.email}</td>
                    <td className="p-5 text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString('ar-DZ')}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        u.role === 'admin' ? 'bg-red-900/20 text-red-400 border-red-500/30' :
                        u.role === 'instructor' ? 'bg-purple-900/20 text-purple-400 border-purple-500/30' :
                        'bg-gray-800 text-gray-400 border-gray-700'
                      }`}>
                        {u.role === 'admin' ? 'مدير' : u.role === 'instructor' ? 'أستاذ' : 'طالب'}
                      </span>
                    </td>
                    <td className="p-5 flex justify-center gap-2">
                      {u.role !== 'admin' && (
                        <select 
                          className="bg-gray-950 border border-gray-700 text-white text-xs p-2 rounded-lg outline-none focus:border-emerald-500 cursor-pointer"
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          value={u.role}
                        >
                          <option value="user">تخفيض لطالب</option>
                          <option value="instructor">ترقية لأستاذ</option>
                        </select>
                      )}
                      {u.role === 'admin' && <ShieldAlert size={20} className="text-red-500" title="لا يمكن تعديل صلاحية المدير" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && <div className="p-10 text-center text-gray-500">لا يوجد مستخدمين بهذا الاسم.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;