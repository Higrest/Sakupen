import React from 'react';
import { User, Mail, ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Профиль пользователя</h1>
        <p className="text-sm text-gray-500 mt-1">Управление данными вашего аккаунта в системе TaskFlow.</p>
      </div>

      {/* Основная карточка профиля */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        {/* Шапка карточки с аватаром */}
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-md select-none">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Пользователь'}</h2>
            <p className="text-sm text-gray-500 font-medium">Fullstack разработчик</p>
          </div>
        </div>

        {/* Информационные поля внутри карточки */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Поле Имя */}
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-400 shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ваше имя</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{user?.name || 'Не указано'}</p>
              </div>
            </div>

            {/* Поле Email */}
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-400 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email адрес</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{user?.email || 'Не указан'}</p>
              </div>
            </div>
          </div>

          {/* Дополнительная плашка безопасности */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-indigo-50/50 border border-indigo-100/50">
            <ShieldAlert className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900/80 leading-relaxed">
              <strong>Безопасность сессии:</strong> Ваш токен авторизации зашифрован с помощью JWT и безопасно хранится в вашем браузере. Никогда не передавайте данные сторонним лицам.
            </div>
          </div>

          {/* Действия над профилем */}
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <Button 
              variant="danger" 
              onClick={logout}
              className="shadow-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
