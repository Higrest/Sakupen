import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);
    
    const result = await login(data.email, data.password);
    
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
        Вход в систему
      </h3>

      {serverError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          Войти
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Нет аккаунта?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Зарегистрироваться
        </Link>
      </p>
    </>
  );
};

export default Login;
