'use client';

import { useState, useEffect } from 'react';

interface SectionLogoProps {
  activeSection: string | null;
  isDarkBackground?: boolean;
}

export default function SectionLogo({ activeSection, isDarkBackground = false }: SectionLogoProps) {
  const [currentLogo, setCurrentLogo] = useState<string>('');
  const [backgroundType, setBackgroundType] = useState<boolean>(false);

  // Функция для определения типа фона
  const checkBackgroundType = () => {
    if (typeof window === 'undefined') return;

    const logoElement = document.querySelector('.section-logo-container');
    if (!logoElement) return;

    const rect = logoElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const isMobile = window.innerWidth <= 768;

    const elementBehind = document.elementFromPoint(centerX, centerY);
    if (elementBehind) {
      // Проверяем, находимся ли мы над темным фоном (изображения проектов)
      const isOverDarkBackground = elementBehind.closest('img') !== null ||
                                   elementBehind.closest('.bg-black') !== null ||
                                   elementBehind.closest('[style*="background"]') !== null ||
                                   // Специальная проверка для мобильных элементов проектов
                                   (isMobile && elementBehind.closest('.mobile-project-item') !== null);

      setBackgroundType(isOverDarkBackground);

      // Debug logging for mobile
      if (isMobile) {
        console.log(`[LOGO BACKGROUND DEBUG] Mobile: ${isMobile}, Over dark: ${isOverDarkBackground}, Element:`, elementBehind.className);
      }
    }
  };

  // Определяем логотип в зависимости от активного раздела и фона
  useEffect(() => {
    // Показываем логотип раздела только если пользователь находится в конкретном разделе
    if (!activeSection || activeSection === 'header') {
      setCurrentLogo('');
      return;
    }

    let logoPath = '';

    switch (activeSection) {
      case 'architecture':
        logoPath = backgroundType ? '/images/IMG_9325 (1).PNG' : '/images/Иллюстрация_без_названия 4.png';
        break;
      case 'urbanism':
        logoPath = backgroundType ? '/images/IMG_9324 (1).PNG' : '/images/Иллюстрация_без_названия 3.png';
        break;
      case 'interior':
        logoPath = backgroundType ? '/images/IMG_9322 (1).PNG' : '/images/Иллюстрация_без_названия 2.png';
        break;
      default:
        logoPath = '';
    }

    setCurrentLogo(logoPath);
  }, [activeSection, backgroundType]);

  // Проверяем фон при скролле и изменении раздела
  useEffect(() => {
    if (!activeSection) return;

    const handleScroll = () => {
      checkBackgroundType();
    };

    checkBackgroundType();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  if (!currentLogo) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 md:top-6 md:left-12 z-[90] transition-opacity duration-300 section-logo-container">
      {/* Backdrop blur area */}
      <div
        className="absolute inset-0 rounded-lg backdrop-blur-sm bg-white/10"
        style={{
          width: 'auto',
          height: 'auto',
          padding: '8px',
          margin: '-8px',
          minWidth: '60px',
          minHeight: '40px'
        }}
      />
      <img
        src={currentLogo}
        alt={`Логотип раздела ${activeSection}`}
        className="h-8 md:h-12 w-auto object-contain relative z-10"
        style={{ maxWidth: 'none' }}
      />
    </div>
  );
}
