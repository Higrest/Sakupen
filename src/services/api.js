import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL вашего будущего Node.js бэкенда
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для автоматического добавления JWT токена в заголовки
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
