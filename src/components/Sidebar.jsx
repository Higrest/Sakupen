import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', name: 'Панель', icon: LayoutDashboard },
    { path: '/projects', name: 'Проекты', icon: FolderKanban },
    { path: '/profile', name: 'Профиль', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col min-h-screen">
      {/* Логотип / Название */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold tracking-wider text-indigo-400">⚡ TaskFlow</span>
      </div>

      {/* Навигационные ссылки */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              <Icon className="mr-3 h-5 w-5 shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Кнопка выхода */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 rounded-md text-sm font-medium text-slate-400 hover:bg-red-950 hover:text-red-200 transition-colors duration-150"
        >
          <LogOut className="mr-3 h-5 w-5 shrink-0" />
          Выйти из системы
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
