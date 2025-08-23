'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAdminStatus: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Учетные данные админа
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin2024'
};

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
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      // Не сохраняем сессию - требуем вход каждый раз
      return true;
    }
    return false;
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
