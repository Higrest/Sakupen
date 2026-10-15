import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, Calendar, Trash2, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { taskSchema } from '../utils/validation';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';

const ProjectDetail = () => {
    const { id } = useParams();
    const { currentProject, loading, fetchProjectDetails, createTask, updateTaskStatus, deleteTask } = useProjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProjectDetails(id);
        }
    }, [id, fetchProjectDetails]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            status: 'Todo',
            priority: 'Medium',
            description: '',
        }
    });

    const onSubmit = async (data) => {
        setActionLoading(true);
        const result = await createTask(id, data);
        setActionLoading(false);

        if (result.success) {
            setIsModalOpen(false);
            reset({ status: 'Todo', priority: 'Medium', description: '' });
        } else {
            alert(result.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Вы точно хотите удалить эту задачу?')) {
            const result = await deleteTask(id, taskId);
            if (!result.success) {
                alert(result.message);
            }
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const result = await updateTaskStatus(id, taskId, newStatus);
        if (!result.success) {
            alert(result.message);
        }
    };

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-50 text-red-700 border-red-100';
            case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Low': return 'bg-green-50 text-green-700 border-green-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const columns = [
        { id: 'Todo', title: 'К выполнению', icon: ListTodo, color: 'text-amber-500 border-amber-500' },
        { id: 'In Progress', title: 'В процессе', icon: Clock, color: 'text-blue-500 border-blue-500' },
        { id: 'Done', title: 'Готово', icon: CheckCircle2, color: 'text-emerald-500 border-emerald-500' },
    ];

    if (loading && !currentProject) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!currentProject) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Проект не найден или у вас нет к нему доступа.</p>
                <Link to="/projects" className="text-indigo-600 font-medium inline-flex items-center mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к списку
                </Link>
            </div>
        );
    }

    const tasks = currentProject.tasks || [];
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                    <Link to="/projects" className="text-sm font-medium text-gray-500 hover:text-indigo-600 inline-flex items-center transition-colors">
                        <ArrowLeft className="mr-1.5 h-4 w-4" /> Назад к проектам
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{currentProject.title}</h1>
                    <p className="text-sm text-gray-500 max-w-xl line-clamp-1">{currentProject.description || 'Описание отсутствует'}</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)} className="self-start md:self-auto shadow-sm">
                    <Plus className="h-5 w-5 mr-2" /> Добавить задачу
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {columns.map((col) => {
                    const ColumnIcon = col.icon;
                    const columnTasks = tasks.filter((task) => task.status === col.id);

                    return (
                        <div key={col.id} className="bg-slate-100 rounded-xl p-4 border border-slate-200/60 shadow-sm flex flex-col min-h-[500px]">
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                                <div className="flex items-center space-x-2">
                                    <ColumnIcon className={`h-5 w-5 ${col.color.split(' ')}`} />
                                    <h3 className="font-semibold text-slate-800">{col.title}</h3>
                                </div>
                                <span className="bg-white text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-slate-200">
                                    {columnTasks.length}
                                </span>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto">
                                {columnTasks.length === 0 ? (
                                    <div className="text-center py-8 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                                        Нет задач в этой колонке
                                    </div>
                                ) : (
                                    columnTasks.map((task) => (
                                        <div key={task.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow space-y-3 group relative">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-medium text-gray-900 leading-snug">{task.title}</h4>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="text-gray-400 hover:text-red-600 p-1 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                                    title="Удалить задачу"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {task.description && (
                                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{task.description}</p>
                                            )}

                                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                                                <div className="flex items-center text-gray-400 text-[11px]">
                                                    <Calendar className="h-3.5 w-3.5 mr-1 shrink-0" />
                                                    <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                                </div>

                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${getPriorityBadgeClass(task.priority)}`}>
                                                    {task.priority}
                                                </span>

                                                <select
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    className="text-[11px] text-gray-600 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer ml-auto"
                                                >
                                                    <option value="Todo">В Todo</option>
                                                    <option value="In Progress">В Процесс</option>
                                                    <option value="Done">В Готово</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить новую задачу">
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    <Input
                        label="Название задачи"
                        type="text"
                        placeholder="Например: Спроектировать базу данных"
                        error={errors.title}
                        {...register('title')}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание задачи</label>
                        <textarea
                            placeholder="Детали выполнения..."
                            rows={3}
                            {...register('description')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Начальный статус</label>
                            <select
                                {...register('status')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Todo">К выполнению</option>
                                <option value="In Progress">В процессе</option>
                                <option value="Done">Готово</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                            <select
                                {...register('priority')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Low">Низкий</option>
                                <option value="Medium">Средний</option>
                                <option value="High">Высокий</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Срок выполнения (Deadline)"
                        type="date"
                        error={errors.deadline}
                        {...register('deadline')}
                    />

                    <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Отмена</Button>
                        <Button type="submit" loading={actionLoading}>Создать задачу</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProjectDetail;
