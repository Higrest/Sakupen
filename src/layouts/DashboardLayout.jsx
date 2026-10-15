import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Боковое меню фиксированной ширины */}
      <Sidebar />

      {/* Основная контентная область */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Здесь будут рендериться внутренние компоненты страниц */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
