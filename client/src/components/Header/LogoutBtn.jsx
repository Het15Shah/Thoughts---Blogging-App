import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import authService from '../../appwrite/auth';

function LogoutBtn({ className = '' }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout());
      navigate('/');
    });
  };

  return (
    <button
      onClick={handleLogout}
      className={`
        inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold
        active:scale-95 transition-all duration-200
        ${className || 'text-gray-500 hover:text-red-600 hover:bg-red-50'}
      `}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Sign out
    </button>
  );
}

export default LogoutBtn;
