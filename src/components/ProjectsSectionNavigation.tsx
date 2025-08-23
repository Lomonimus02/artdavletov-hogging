'use client';

import React, { useState, useEffect } from 'react';

interface ProjectsSectionNavigationProps {
  onNavigate: (sectionId: string) => void;
}

const ProjectsSectionNavigation: React.FC<ProjectsSectionNavigationProps> = ({ onNavigate }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false); // false = light bg (black squares) for projects page

  // 4 sections including textile (disabled)
  const sections = [
    { id: 'architecture', name: 'Архитектура' },
    { id: 'urbanism', name: 'Благоустройство' },
    { id: 'interior', name: 'Интерьерный дизайн' },
    { id: 'textile', name: 'Текстиль' }
  ];

  const handleSectionClick = (sectionId: string) => {
    if (sectionId !== 'textile') {
      console.log('Navigation clicked:', sectionId, 'Mobile:', isMobile);
      onNavigate(sectionId);
    }
  };

  // Function to determine background type behind navigation
  const checkBackgroundType = () => {
    // On desktop, always use black squares
    if (window.innerWidth > 768) {
      setIsDarkBackground(false); // false = black squares
      return;
    }

    // On mobile, check background dynamically
    const navigationElement = document.querySelector('.section-navigation');
    if (!navigationElement) return;

    const rect = navigationElement.getBoundingClientRect();
    const navigationCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    // Sample multiple points around the navigation
    const samplePoints = [
      { x: navigationCenter.x, y: navigationCenter.y },
      { x: navigationCenter.x - 20, y: navigationCenter.y },
      { x: navigationCenter.x + 20, y: navigationCenter.y },
      { x: navigationCenter.x, y: navigationCenter.y - 20 },
      { x: navigationCenter.x, y: navigationCenter.y + 20 }
    ];

    let darkBackgroundCount = 0;
    let lightBackgroundCount = 0;

    samplePoints.forEach(point => {
      const elementBehind = document.elementFromPoint(point.x, point.y);
      if (elementBehind) {
        // Check if we're over a light background section
        const isOverLightSection = elementBehind.closest('.bg-white') !== null ||
                                   elementBehind.closest('.bg-gray-50') !== null ||
                                   elementBehind.closest('[class*="bg-gray"]') !== null ||
                                   elementBehind.closest('.projects-page-header') !== null ||
                                   elementBehind.closest('.projects-grid') !== null;

        // Check if we're over a dark background (project images)
        const isOverDarkSection = elementBehind.closest('.mobile-project-item') !== null ||
                                  elementBehind.closest('img') !== null;

        if (isOverDarkSection) {
          darkBackgroundCount++;
        } else if (isOverLightSection) {
          lightBackgroundCount++;
        }
      }
    });

    // On mobile: white squares on dark background, black squares on light background
    setIsDarkBackground(darkBackgroundCount > lightBackgroundCount);
  };

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Also recheck background when viewport changes
      setTimeout(() => checkBackgroundType(), 100);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track which section is currently in view with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-service-id');
            if (sectionId) {
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
              const viewportHeight = window.innerHeight;
              const sectionTop = rect.top;
              const sectionBottom = rect.bottom;

              // Check if section is in viewport
              if (sectionBottom > 0 && sectionTop < viewportHeight) {
                const visibleTop = Math.max(sectionTop, 0);
                const visibleBottom = Math.min(sectionBottom, viewportHeight);
                const visibleHeight = visibleBottom - visibleTop;
                const visibilityRatio = visibleHeight / viewportHeight;

                const threshold = window.innerWidth <= 768 ? 0.25 : 0.3;

                if (visibilityRatio > threshold && visibilityRatio > maxVisibilityRatio) {
                  maxVisibilityRatio = visibilityRatio;
                  currentActiveSection = sectionId;
                }
              }
            }
          });

          setActiveSection(currentActiveSection);
          checkBackgroundType();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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

export default ProjectsSectionNavigation;
