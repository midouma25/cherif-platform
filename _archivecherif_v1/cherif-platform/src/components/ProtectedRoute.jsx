import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-500 font-bold">جاري التحقق من الهوية...</div>;

  if (!user) {
    return <Navigate to="/vault" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in-up">
        <h1 className="text-4xl font-black text-red-500 mb-4">🚫 وصول مرفوض</h1>
        <p className="text-gray-400">لا تملك صلاحيات كافية لدخول هذه الصفحة.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;