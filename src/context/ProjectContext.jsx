import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получить список всех проектов пользователя
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить проекты');
    } finally {
      setLoading(false);
    }
  }, []);

  // Получить детальную информацию о конкретном проекте (включая его задачи)
  const fetchProjectDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/projects/${id}`);
      setCurrentProject(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить данные проекта');
    } finally {
      setLoading(false);
    }
  }, []);

  // Создать новый проект
  const createProject = async (title, description) => {
    try {
      const response = await api.post('/projects', { title, description });
      setProjects((prev) => [response.data, ...prev]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Ошибка при создании проекта',
      };
    }
  };

  // Удалить проект (Бизнес-правило: только владелец, проверка будет на бэкенде)
  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (currentProject?.id === id) setCurrentProject(null);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Не удалось удалить проект',
      };
    }
  };

  // Добавить задачу в текущий проект
  const createTask = async (projectId, taskData) => {
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, taskData);
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject((prev) => ({
          ...prev,
          tasks: [...prev.tasks, response.data],
        }));
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Ошибка при создании задачи',
      };
    }
  };

  // Обновить статус или приоритет задачи (для Канбан-доски)
  const updateTaskStatus = async (projectId, taskId, status) => {
    try {
      const response = await api.patch(`/projects/${projectId}/tasks/${taskId}`, { status });
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) => (task.id === taskId ? response.data : task)),
        }));
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Не удалось обновить статус задачи',
      };
    }
  };

  // Удалить задачу из проекта
  const deleteTask = async (projectId, taskId) => {
    try {
      await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      if (currentProject && currentProject.id === projectId) {
        setCurrentProject((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((task) => task.id !== taskId),
        }));
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Не удалось удалить задачу',
      };
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        error,
        fetchProjects,
        fetchProjectDetails,
        createProject,
        deleteProject,
        createTask,
        updateTaskStatus,
        deleteTask,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects должен использоваться внутри ProjectProvider');
  }
  return context;
};
