'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDarkText = pathname === '/projects' || pathname === '/about';
  const { language, setLanguage, t } = useLanguage();

  // Always use black logo for better brand consistency
  const logoSrc = '/images/IMG_9244.PNG';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { href: '/', label: t('nav.home') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/about', label: t('nav.about') },
    { href: '/contacts', label: t('nav.contacts') },
  ];

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="mobile-logo-container">
                {/* Desktop text logo */}
                <span className={`text-lg font-black tracking-wider uppercase mobile-hide-text-logo ${
                  isDarkText ? 'text-black' : 'text-white drop-shadow-lg'
                }`}>
                  {t('nav.logo')}
                </span>

                {/* Mobile image logo */}
                <Image
                  src={logoSrc}
                  alt={t('nav.logo')}
                  width={400}
                  height={64}
                  className="mobile-logo mobile-show-logo hidden"
                  priority
                />
              </Link>
            </div>

            {/* Hamburger Menu Button */}
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center p-2 focus:outline-none transition-colors duration-500 z-60 relative mobile-menu-button ${
                  isMenuOpen
                    ? 'text-black hover:text-black'
                    : isDarkText
                      ? 'text-black hover:text-black'
                      : 'text-white hover:text-white'
                }`}
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Открыть главное меню</span>
                {/* Hamburger icon */}
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block transition-all duration-500 ease-in-out h-0.5 w-6 rounded-sm mobile-menu-icon ${
                      isMenuOpen
                        ? 'bg-black rotate-45 translate-y-1'
                        : isDarkText
                          ? 'bg-black -translate-y-0.5'
                          : 'bg-white drop-shadow-sm -translate-y-0.5'
                    }`}
                  ></span>
                  <span
                    className={`block transition-all duration-500 ease-in-out h-0.5 w-6 rounded-sm my-0.5 mobile-menu-icon ${
                      isMenuOpen
                        ? 'bg-black opacity-0'
                        : isDarkText
                          ? 'bg-black opacity-100'
                          : 'bg-white drop-shadow-sm opacity-100'
                    }`}
                  ></span>
                  <span
                    className={`block transition-all duration-500 ease-in-out h-0.5 w-6 rounded-sm mobile-menu-icon ${
                      isMenuOpen
                        ? 'bg-black -rotate-45 -translate-y-1'
                        : isDarkText
                          ? 'bg-black translate-y-0.5'
                          : 'bg-white drop-shadow-sm translate-y-0.5'
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Vertical Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 md:w-80 mobile-menu-full-width bg-white shadow-2xl transform transition-all duration-500 ease-in-out z-40 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-20 px-6">
          <div className="space-y-8">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block text-black hover:text-gray-600 text-xl font-black uppercase tracking-wider transition-all duration-500 transform hover:translate-x-2 ${
                  isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 150}ms` : '0ms'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">
              {t('nav.language')}
            </h3>
            <div className="space-y-4">
              <button
                className={`block text-lg font-black uppercase tracking-wider transition-all duration-500 transform hover:translate-x-2 ${
                  language === 'ru' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                } ${
                  isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${(menuItems.length + 1) * 150}ms` : '0ms'
                }}
                onClick={() => {
                  setLanguage('ru');
                  setIsMenuOpen(false);
                }}
              >
                Русский
              </button>
              <button
                className={`block text-lg font-black uppercase tracking-wider transition-all duration-500 transform hover:translate-x-2 ${
                  language === 'en' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                } ${
                  isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${(menuItems.length + 2) * 150}ms` : '0ms'
                }}
                onClick={() => {
                  setLanguage('en');
                  setIsMenuOpen(false);
                }}
              >
                English
              </button>
              <button
                className={`block text-lg font-black uppercase tracking-wider transition-all duration-500 transform hover:translate-x-2 ${
                  language === 'zh' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                } ${
                  isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${(menuItems.length + 3) * 150}ms` : '0ms'
                }}
                onClick={() => {
                  setLanguage('zh');
                  setIsMenuOpen(false);
                }}
              >
                中文
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out z-35 ${
          isMenuOpen ? 'opacity-60 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navigation;
