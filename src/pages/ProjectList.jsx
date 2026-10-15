import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Plus, Folder, ArrowRight, Search, Trash2 } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { projectSchema } from '../utils/validation';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

const ProjectList = () => {
  const { projects, loading, fetchProjects, createProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Загружаем список проектов при монтировании страницы
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  // Отправка формы создания нового проекта
  const onSubmit = async (data) => {
    setActionLoading(true);
    const result = await createProject(data.title, data.description);
    setActionLoading(false);
    
    if (result.success) {
      setIsModalOpen(false);
      reset();
    } else {
      alert(result.message);
    }
  };

  // Удаление проекта
  const handleDelete = async (e, id) => {
    e.preventDefault(); // Чтобы не срабатывал переход по ссылке <Link>
    if (window.confirm('Вы уверены, что хотите удалить этот проект и все его задачи?')) {
      const result = await deleteProject(id);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  // Фильтрация проектов по поисковому запросу
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Шапка страницы */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мои проекты</h1>
          <p className="text-sm text-gray-500 mt-1">Управляйте своими проектами или создайте новый.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsModalOpen(true)}
          className="shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Новый проект
        </Button>
      </div>

      {/* Панель поиска */}
      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Поиск проектов по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-colors"
        />
      </div>

      {/* Список проектов */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 p-6">
          <Folder className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Проекты не найдены</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Попробуйте изменить запрос.' : 'Начните с создания вашего первого проекта.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                    <Folder className="h-6 w-6" />
                  </div>
                  {/* Кнопка удаления (только для владельца, бэкенд проверит) */}
                  <button
                    onClick={(e) => handleDelete(e, project.id)}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-gray-50 transition-colors"
                    title="Удалить проект"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {project.description || 'Описание отсутствует.'}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 text-sm font-medium text-indigo-600">
                <span>Перейти к задачам</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Модальное окно создания проекта */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Создать новый проект">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Название проекта"
            type="text"
            placeholder="Например: Разработка API бэкенда"
            error={errors.title}
            {...register('title')}
          />
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание проекта</label>
            <textarea
              placeholder="Краткое описание целей проекта..."
              rows={3}
              {...register('description')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Отмена</Button>
            <Button type="submit" loading={actionLoading}>Создать</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectList;
