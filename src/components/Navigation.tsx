'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

interface NavigationProps {
  projectsActiveSection?: string | null;
}

const Navigation = ({ projectsActiveSection = null }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  // Initialize based on current pathname - true for home page (dark background), false for others
  const [isDarkBackground, setIsDarkBackground] = useState(pathname === '/');
  const [isInHeroSection, setIsInHeroSection] = useState(pathname === '/');
  const { language, setLanguage, t } = useLanguage();

  // Determine if logo should be hidden on projects page
  const shouldHideLogo = pathname === '/projects' &&
                        projectsActiveSection &&
                        projectsActiveSection !== 'header';

  // Helper function to check if we're in hero section
  const checkHeroSection = () => {
    if (typeof window === 'undefined') return pathname === '/';
    if (pathname !== '/') return false;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    return scrollY < windowHeight * 0.85;
  };

  // Simplified logic:
  // - Menu open = dark text/logo
  // - Hero section = white text/logo
  // - Projects page = always dark elements (black hamburger on white background)
  // - Other cases = based on isDarkBackground
  const shouldUseWhiteElements = !isMenuOpen && (isInHeroSection || (pathname === '/' && isDarkBackground) || (pathname !== '/' && pathname !== '/projects' && isDarkBackground));

  // Dynamic logo selection
  const logoSrc = shouldUseWhiteElements ? '/images/IMG_9330.PNG' : '/images/IMG_9244.PNG';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to detect background color behind navigation using actual color sampling
  const detectBackgroundColor = () => {
    if (typeof window === 'undefined') return;

    console.log('Detecting background color, pathname:', pathname);

    // Check if we're in hero section and update state
    const inHeroSection = checkHeroSection();
    setIsInHeroSection(inHeroSection);

    // Special case: Home page hero section with background slideshow
    // This has HIGHEST priority and overrides all other detection
    if (inHeroSection) {
      console.log('Home page hero section - forcing white menu elements');
      setIsDarkBackground(true);
      return;
    }

    // Get navigation element position
    const navElement = document.querySelector('nav');
    if (!navElement) return;

    const navRect = navElement.getBoundingClientRect();

    // Sample multiple points behind the navigation bar
    const samplePoints = [
      { x: navRect.left + navRect.width * 0.25, y: navRect.top + navRect.height / 2 }, // Logo area
      { x: navRect.left + navRect.width * 0.75, y: navRect.top + navRect.height / 2 }, // Menu button area
      { x: navRect.left + navRect.width * 0.5, y: navRect.top + navRect.height / 2 },  // Center
    ];

    let darkPixelCount = 0;
    let totalSamples = 0;

    // Temporarily hide navigation to sample background
    navElement.style.visibility = 'hidden';

    try {
      samplePoints.forEach(point => {
        const elementBehind = document.elementFromPoint(point.x, point.y);
        if (elementBehind) {
          totalSamples++;

          // Check if we're over a dark element (images, dark backgrounds)
          const isDarkElement =
            elementBehind.tagName === 'IMG' ||
            elementBehind.closest('img') !== null ||
            elementBehind.closest('.bg-black') !== null ||
            elementBehind.closest('.bg-gray-900') !== null ||
            elementBehind.closest('.bg-gray-800') !== null ||
            elementBehind.closest('[style*="background"]') !== null ||
            // Check for project images specifically
            elementBehind.closest('.mobile-project-item') !== null ||
            elementBehind.closest('.group') !== null ||
            // Check for desktop project images
            elementBehind.closest('.aspect-square') !== null ||
            // Check for hero sections with background images (home page slideshow)
            elementBehind.closest('.mobile-hero-bg') !== null ||
            elementBehind.closest('.hero-text-container') !== null ||
            elementBehind.closest('[style*="background-image"]') !== null ||
            // Check computed background color
            window.getComputedStyle(elementBehind).backgroundImage !== 'none';

          // Additional check: sample actual background color if possible
          const computedStyle = window.getComputedStyle(elementBehind);
          const bgColor = computedStyle.backgroundColor;
          const bgImage = computedStyle.backgroundImage;

          // If there's a background image or it's a dark color, consider it dark
          if (bgImage !== 'none' || isDarkElement) {
            darkPixelCount++;
          } else if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            // Parse RGB values to determine if background is dark
            const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
              const [, r, g, b] = rgbMatch.map(Number);
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              if (brightness < 128) { // Dark background
                darkPixelCount++;
              }
            }
          }
        }
      });
    } finally {
      // Restore navigation visibility
      navElement.style.visibility = 'visible';
    }

    // Determine if background is dark based on sampling
    let isDark = totalSamples > 0 ? (darkPixelCount / totalSamples) > 0.5 : false;

    // Special handling for home page hero section with background slideshow
    if (inHeroSection) {
      isDark = true; // Dark background = white menu elements
      console.log('Home page hero section detected in fallback - forcing white menu elements');
    } else {
      // Fallback logic for other cases when sampling fails
      if (totalSamples === 0) {
        if (pathname === '/contacts') {
          // Contacts page typically has dark backgrounds
          isDark = true;
        } else if (pathname === '/') {
          // Home page below hero section
          isDark = false; // Light background = dark menu elements
        } else {
          // Other pages (projects, about) typically have light backgrounds
          isDark = false;
        }
      }
    }

    console.log('Background detection result:', {
      pathname,
      darkPixelCount,
      totalSamples,
      isDark,
      ratio: totalSamples > 0 ? darkPixelCount / totalSamples : 0,
      fallbackUsed: totalSamples === 0,
      scrollY: window.scrollY,
      windowHeight: window.innerHeight,
      isInHeroSection: pathname === '/' && window.scrollY < window.innerHeight * 0.9
    });

    setIsDarkBackground(isDark);
  };

  // Effect to handle scroll and page changes
  useEffect(() => {
    console.log('Navigation effect triggered, pathname:', pathname);

    // Set initial state immediately for home page hero section
    const inHeroSection = checkHeroSection();
    setIsInHeroSection(inHeroSection);

    if (inHeroSection) {
      console.log('Initial state: Home page hero section detected');
      setIsDarkBackground(true);
    } else if (pathname !== '/') {
      console.log('Initial state: Non-home page detected');
      setIsDarkBackground(false);
    }

    // Additional detection with delay to ensure DOM is ready
    setTimeout(() => detectBackgroundColor(), 100);

    const handleScroll = () => {
      // Throttle scroll detection for performance
      if (!(window as any).scrollThrottleTimeout) {
        (window as any).scrollThrottleTimeout = setTimeout(() => {
          // Update hero section state first
          const inHeroSection = checkHeroSection();
          setIsInHeroSection(inHeroSection);

          // Then detect background color
          detectBackgroundColor();
          (window as any).scrollThrottleTimeout = null;
        }, 50);
      }
    };

    const handleMouseMove = () => {
      // Detect color changes on mouse movement (for hover effects)
      if (!(window as any).mouseMoveThrottleTimeout) {
        (window as any).mouseMoveThrottleTimeout = setTimeout(() => {
          detectBackgroundColor();
          (window as any).mouseMoveThrottleTimeout = null;
        }, 150); // Slightly longer delay for mouse move
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', detectBackgroundColor);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', detectBackgroundColor);
      window.removeEventListener('mousemove', handleMouseMove);
      if ((window as any).scrollThrottleTimeout) {
        clearTimeout((window as any).scrollThrottleTimeout);
        (window as any).scrollThrottleTimeout = null;
      }
      if ((window as any).mouseMoveThrottleTimeout) {
        clearTimeout((window as any).mouseMoveThrottleTimeout);
        (window as any).mouseMoveThrottleTimeout = null;
      }
    };
  }, [pathname]);

  // Debug effect to log state changes
  useEffect(() => {
    console.log('Navigation state:', {
      pathname,
      isDarkBackground,
      shouldUseWhiteElements,
      isMenuOpen,
      isInHeroSection,
      logoSrc: logoSrc.includes('9330') ? 'WHITE' : 'BLACK'
    });
  }, [pathname, isDarkBackground, shouldUseWhiteElements, isMenuOpen, isInHeroSection]);



  // Effect to immediately set correct state when pathname changes
  useEffect(() => {
    const inHeroSection = checkHeroSection();
    setIsInHeroSection(inHeroSection);

    if (pathname === '/') {
      // For home page, check if we're in hero section
      if (inHeroSection) {
        console.log('Pathname change: Setting white menu for home page hero');
        setIsDarkBackground(true);
      }
    } else {
      // For other pages, set light background
      console.log('Pathname change: Setting dark menu for non-home page');
      setIsDarkBackground(false);
      setIsInHeroSection(false);
    }
  }, [pathname]);

  const menuItems = [
    { href: '/', label: t('nav.home') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/about', label: t('nav.about') },
    { href: '/contacts', label: t('nav.contacts') },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100]">
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className={`flex-shrink-0 transition-opacity duration-300 ${shouldHideLogo ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <Link href="/" className="mobile-logo-container">
                {/* Desktop text logo */}
                <span className={`text-lg font-black tracking-wider uppercase mobile-hide-text-logo transition-colors duration-300 ${
                  shouldUseWhiteElements ? 'text-white drop-shadow-lg' : 'text-black'
                }`}>
                  {t('nav.logo')}
                </span>

                {/* Mobile image logo */}
                <Image
                  src={logoSrc}
                  alt={t('nav.logo')}
                  width={120}
                  height={19}
                  className="mobile-logo block md:hidden"
                  priority
                />
              </Link>
            </div>

            {/* Hamburger Menu Button */}
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center p-2 focus:outline-none z-[110] relative mobile-menu-button ${
                  shouldUseWhiteElements ? 'text-white hover:text-white' : 'text-black hover:text-black'
                }`}
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Открыть главное меню</span>
                {/* Hamburger icon */}
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block h-0.5 w-6 rounded-sm mobile-menu-icon ${
                      isMenuOpen
                        ? 'bg-black rotate-45 translate-y-1'
                        : shouldUseWhiteElements
                          ? 'bg-white drop-shadow-sm -translate-y-0.5'
                          : 'bg-black -translate-y-0.5'
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 rounded-sm my-0.5 mobile-menu-icon ${
                      isMenuOpen
                        ? 'bg-black opacity-0'
                        : shouldUseWhiteElements
                          ? 'bg-white drop-shadow-sm opacity-100'
                          : 'bg-black opacity-100'
                    }`}
                  ></span>
                  <span
                    className={`block h-0.5 w-6 rounded-sm mobile-menu-icon ${
                      isMenuOpen
                        ? 'bg-black -rotate-45 -translate-y-1'
                        : shouldUseWhiteElements
                          ? 'bg-white drop-shadow-sm translate-y-0.5'
                          : 'bg-black translate-y-0.5'
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
        className={`fixed top-0 right-0 h-full w-80 md:w-full mobile-menu-full-width bg-white shadow-2xl transform transition-all duration-500 ease-in-out z-[90] ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-center items-center px-6 md:px-12">
          <div className="space-y-8 md:space-y-12 text-center">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block text-black hover:text-gray-600 text-xl md:text-3xl font-black uppercase tracking-wider transition-all duration-500 transform hover:scale-105 ${
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
          <div className="mt-16 pt-8 border-t border-gray-200 w-full max-w-md">
            <h3 className="text-sm md:text-base font-black uppercase tracking-wider text-gray-500 mb-4 text-center">
              {t('nav.language')}
            </h3>
            <div className="space-y-4 md:space-y-6 flex flex-col items-center">
              <button
                className={`inline-block text-lg md:text-xl font-black uppercase tracking-wider transition-all duration-500 transform hover:scale-105 ${
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
                className={`inline-block text-lg md:text-xl font-black uppercase tracking-wider transition-all duration-500 transform hover:scale-105 ${
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
                className={`inline-block text-lg md:text-xl font-black uppercase tracking-wider transition-all duration-500 transform hover:scale-105 ${
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
        className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out z-[80] ${
          isMenuOpen ? 'opacity-60 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navigation;
