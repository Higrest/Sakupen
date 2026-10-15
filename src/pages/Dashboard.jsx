import React from 'react';
import { CheckCircle2, Clock, ListTodo, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Временные статические данные для визуализации (позже заменим на данные из контекста)
  const stats = [
    { name: 'Всего задач', value: '12', icon: BarChart3, color: 'bg-indigo-500' },
    { name: 'К выполнению', value: '5', icon: ListTodo, color: 'bg-amber-500' },
    { name: 'В процессе', value: '3', icon: Clock, color: 'bg-blue-500' },
    { name: 'Готово', value: '4', icon: CheckCircle2, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Приветствие */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать, {user?.name}! 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Вот текущий статус выполнения ваших командных проектов и задач.</p>
      </div>

      {/* Сетка карточек статистики */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 p-5 flex items-center space-x-4">
              <div className={`p-3 rounded-md text-white ${item.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Секция недавней активности (заглушка) */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ближайшие дедлайны</h3>
        <p className="text-sm text-gray-500">У вас нет срочных задач на сегодня. Отличная работа!</p>
      </div>
    </div>
  );
};

export default Dashboard;
