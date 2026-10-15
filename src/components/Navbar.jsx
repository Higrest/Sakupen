import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <div className="text-lg font-medium text-gray-800">
        Рабочая область
      </div>
      
      {/* Информация о пользователе */}
      <div className="flex items-center space-x-3">
        <div className="flex flex-col text-right">
          <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase shadow-inner">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
