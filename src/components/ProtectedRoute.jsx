import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  // Если пользователь не авторизован (нет данных в контексте),
  // принудительно перенаправляем его на страницу входа
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если пользователь успешно вошел, рендерим вложенные защищенные страницы
  return <Outlet />;
};

export default ProtectedRoute;
