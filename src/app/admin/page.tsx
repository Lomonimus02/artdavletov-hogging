'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, login } = useAdmin();
  const router = useRouter();

  // Если уже авторизован, перенаправляем на панель управления
  useEffect(() => {
    if (isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [isAdmin, router]);

  // Set page identifier for mobile menu styling
  useEffect(() => {
    document.body.setAttribute('data-page', 'admin');
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('Неверный логин или пароль');
      }
    } catch (err) {
      setError('Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="username" className="block text-lg font-black text-black mb-4 uppercase tracking-wide">
              Логин
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-6 py-4 border-2 border-black bg-transparent text-black placeholder-gray-600 focus:border-gray-600 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide"
              placeholder="Введите логин"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-black text-black mb-4 uppercase tracking-wide">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-4 border-2 border-black bg-transparent text-black placeholder-gray-600 focus:border-gray-600 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide"
              placeholder="Введите пароль"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-100 border-2 border-red-500">
              <p className="text-red-700 font-black uppercase tracking-wide text-center">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white px-8 py-4 font-black uppercase tracking-wider text-xl hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
