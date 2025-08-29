'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAdminStatus: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Учетные данные админа теперь хранятся в переменных окружения
// и проверяются через безопасные утилиты аутентификации

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Проверяем статус админа при загрузке
  useEffect(() => {
    // Всегда сбрасываем состояние при загрузке
    setIsAdmin(false);

    // Очищаем сессию при загрузке любой страницы
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_session');
      sessionStorage.removeItem('admin_session_time');
    }
  }, []);

  const checkAdminStatus = () => {
    // Всегда возвращаем false - требуем новый вход каждый раз
    setIsAdmin(false);
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Попытка входа с логином:', username);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('📡 Ответ сервера:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Успешная аутентификация:', data);
        setIsAdmin(true);
        // Не сохраняем сессию - требуем вход каждый раз
        return true;
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.log('❌ Ошибка аутентификации:', errorData);
        return false;
      }
    } catch (error) {
      console.error('❌ Ошибка сети при входе:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    // Очищаем любые данные сессии
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
