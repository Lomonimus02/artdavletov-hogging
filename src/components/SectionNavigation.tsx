'use client';

import { useState, useEffect } from 'react';

interface SectionNavigationProps {
  onNavigate: (section: string) => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({ onNavigate }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true); // true = dark bg (white squares), false = light bg (black squares) - start with white squares for hero

  const sections = [
    { id: 'architecture', name: 'Архитектура' },
    { id: 'urbanism', name: 'Благоустройство' },
    { id: 'interior', name: 'Интерьерный дизайн' },
    { id: 'textile', name: 'Текстиль' }
  ];

  const handleSectionClick = (sectionId: string) => {
    if (sectionId !== 'textile') {
      onNavigate(sectionId);
    }
  };

  // Function to determine background type behind navigation
  const checkBackgroundType = () => {
    const navigationElement = document.querySelector('.section-navigation');
    if (!navigationElement) return;

    // First, check if we're in the hero section by scroll position
    const scrollY = window.scrollY;
    const heroSection = document.querySelector('.mobile-hero-container') ||
                       document.querySelector('section.h-screen');

    if (heroSection) {
      const heroRect = heroSection.getBoundingClientRect();
      const heroTop = heroRect.top + scrollY;
      const heroBottom = heroRect.bottom + scrollY;
      const currentPosition = scrollY + window.innerHeight / 2; // Middle of viewport

      // If we're in the hero section area, always use white squares
      if (currentPosition >= heroTop && currentPosition <= heroBottom + 50) { // 50px buffer
        setIsDarkBackground(true);
        return;
      }
    }

    const rect = navigationElement.getBoundingClientRect();
    const navigationCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    // Check multiple points behind the navigation for better accuracy
    const checkPoints = [
      { x: navigationCenter.x - 50, y: navigationCenter.y },
      { x: navigationCenter.x - 100, y: navigationCenter.y },
      { x: navigationCenter.x - 150, y: navigationCenter.y }
    ];

    let lightBackgroundCount = 0;
    let darkBackgroundCount = 0;

    checkPoints.forEach(point => {
      const elementBehind = document.elementFromPoint(point.x, point.y);

      if (elementBehind) {
        // Check if we're over hero section (dark background with slideshow)
        const isOverHeroSection = elementBehind.closest('.mobile-hero-container') !== null ||
                                  elementBehind.closest('[style*="background-image"]') !== null ||
                                  elementBehind.closest('.hero-text-container') !== null ||
                                  elementBehind.closest('.mobile-hero-bg') !== null;

        // Check if we're over a service photo (dark background)
        const isOverServicePhoto = elementBehind.closest('.services-photo') !== null;

        // Check if we're over a light background section
        const isOverLightSection = elementBehind.closest('.bg-gray-50') !== null ||
                                   elementBehind.closest('.bg-white') !== null ||
                                   elementBehind.closest('[class*="bg-gray"]') !== null ||
                                   elementBehind.closest('.mobile-projects-section') !== null ||
                                   elementBehind.closest('.mobile-contact-section') !== null;

        if (isOverHeroSection || isOverServicePhoto) {
          darkBackgroundCount++;
        } else if (isOverLightSection) {
          lightBackgroundCount++;
        } else {
          // Default to dark background for unknown areas
          darkBackgroundCount++;
        }
      }
    });

    // Use majority vote to determine background type
    setIsDarkBackground(darkBackgroundCount >= lightBackgroundCount);
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track which section is currently in view with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // This observer is now mainly for fallback, the scroll handler does the main work
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-service-id');
            if (sectionId) {
              // Only set if no active section is already set by scroll handler
              setActiveSection(prev => prev || sectionId);
            }
          }
        });
      },
      {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    // Observe all service sections
    const sections = document.querySelectorAll('[data-service-id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Additional scroll handler for more precise tracking
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const serviceSections = document.querySelectorAll('[data-service-id]');
          let currentActiveSection = null;
          let maxVisibilityRatio = 0;

          serviceSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionId = section.getAttribute('data-service-id');

            if (sectionId) {
              // Calculate visibility ratio more accurately
              const viewportHeight = window.innerHeight;
              const sectionTop = rect.top;
              const sectionBottom = rect.bottom;
              const sectionHeight = rect.height;

              // Check if section is in viewport
              if (sectionBottom > 0 && sectionTop < viewportHeight) {
                // Calculate visible portion
                const visibleTop = Math.max(sectionTop, 0);
                const visibleBottom = Math.min(sectionBottom, viewportHeight);
                const visibleHeight = visibleBottom - visibleTop;

                // Calculate ratio based on viewport, not section height
                const visibilityRatio = visibleHeight / viewportHeight;

                // Use the section with highest visibility ratio (minimum 25% for mobile, 30% for desktop)
                const threshold = window.innerWidth <= 768 ? 0.25 : 0.3;

                if (visibilityRatio > threshold && visibilityRatio > maxVisibilityRatio) {
                  maxVisibilityRatio = visibilityRatio;
                  currentActiveSection = sectionId;
                }
              }
            }
          });

          // Only set active section if we found one with sufficient visibility
          // If no section meets the criteria, clear the active section
          setActiveSection(currentActiveSection);

          // Check background type for color adaptation
          checkBackgroundType();

          // Additional check: if scroll position is at the very top, ensure white squares
          if (window.scrollY < 100) {
            setIsDarkBackground(true);
          }

          // Debug log for mobile testing (remove in production)
          if (window.innerWidth <= 768 && currentActiveSection !== null) {
            console.log('Mobile active section:', currentActiveSection, 'Max visibility:', maxVisibilityRatio.toFixed(2));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    // Initial background check with delay to ensure DOM is ready
    setTimeout(() => {
      checkBackgroundType();
    }, 500);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-[60] section-navigation">
      <div className="flex flex-col space-y-3 md:space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="relative group"
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Square navigation item */}
            <button
              onClick={() => handleSectionClick(section.id)}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all duration-300 ${
                isDarkBackground ? 'bg-white' : 'bg-black'
              } ${
                section.id === 'textile'
                  ? 'cursor-default opacity-40'
                  : activeSection === section.id
                    ? 'cursor-pointer opacity-100 scale-125'
                    : 'cursor-pointer opacity-70 hover:opacity-100 hover:scale-110'
              }`}
              disabled={section.id === 'textile'}
            >
            </button>

            {/* Tooltip with section name - only on desktop */}
            {hoveredSection === section.id && !isMobile && (
              <div className={`absolute right-full mr-4 top-1/2 transform -translate-y-1/2 text-xs md:text-sm font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${
                isDarkBackground ? 'text-white' : 'text-black'
              }`}>
                {section.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionNavigation;
