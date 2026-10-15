import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    const result = await signup(data.name, data.email, data.password);

    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.message);
    }
  };

  return (
    <>
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        Создать аккаунт
      </h3>

      {serverError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Имя пользователя"
          type="text"
          placeholder="Иван Иванов"
          error={errors.name}
          {...register('name')}
        />

        <Input
          label="Email адрес"
          type="email"
          placeholder="example@mail.com"
          error={errors.email}
          {...register('email')}
        />

        <Input
          label="Пароль"
          type="password"
          placeholder="••••••••"
          error={errors.password}
          {...register('password')}
        />

        <Button type="submit" className="w-full mt-2" loading={loading}>
          Создать аккаунт
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Уже зарегистрированы?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Войти
        </Link>
      </p>
    </>
  );
};

export default Register;
