import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email обязателен для заполнения')
    .email('Неверный формат email адреса'),
  password: z.string()
    .min(6, 'Пароль должен быть не менее 6 символов'),
});

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string()
    .min(1, 'Email обязателен для заполнения')
    .email('Неверный формат email адреса'),
  password: z.string()
    .min(6, 'Пароль должен быть не менее 6 символов'),
}).refine((data) => data, {
  message: "Ошибка валидации",
});

export const projectSchema = z.object({
  title: z.string()
    .min(3, 'Название проекта должно быть не менее 3 символов')
    .max(50, 'Название проекта не должно превышать 50 символов'),
  description: z.string()
    .max(200, 'Описание не должно быть длиннее 200 символов')
    .optional()
    .or(z.literal('')),
});

export const taskSchema = z.object({
  title: z.string()
    .min(3, 'Название задачи должно быть не менее 3 символов'),
  description: z.string()
    .optional()
    .or(z.literal('')),
  status: z.enum(['Todo', 'In Progress', 'Done'], {
    required_error: 'Выберите статус задачи',
  }),
  priority: z.enum(['Low', 'Medium', 'High'], {
    required_error: 'Выберите приоритет задачи',
  }),
  deadline: z.string().min(1, 'Укажите дату дедлайна'),
});
