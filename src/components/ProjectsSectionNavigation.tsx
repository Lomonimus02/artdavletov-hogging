'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectsSectionNavigationProps {
  onNavigate: (sectionId: string) => void;
  onSectionChange?: (sectionId: string | null) => void;
}

const ProjectsSectionNavigation: React.FC<ProjectsSectionNavigationProps> = ({ onNavigate, onSectionChange }) => {
  const { t } = useLanguage();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false); // false = light bg (black squares) for projects page

  // 4 sections including textile (disabled)
  const sections = [
    { id: 'architecture', name: t('nav.tooltip.architecture') },
    { id: 'urbanism', name: t('nav.tooltip.urbanism') },
    { id: 'interior', name: t('nav.tooltip.interior') },
    { id: 'textile', name: t('nav.tooltip.textile') }
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

  // Track which section is currently in view based on scroll position
  useEffect(() => {
    const determineActiveSection = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth <= 768;

      // Find section elements - prioritize mobile or desktop layout based on viewport
      let architectureSection, urbanismSection, interiorSection;

      if (isMobile) {
        // On mobile, look for elements in mobile layout first
        architectureSection = document.querySelector('.mobile-projects-grid [data-service-id="architecture"]') ||
                             document.querySelector('[data-service-id="architecture"]');
        urbanismSection = document.querySelector('.mobile-projects-grid [data-service-id="urbanism"]') ||
                         document.querySelector('[data-service-id="urbanism"]');
        interiorSection = document.querySelector('.mobile-projects-grid [data-service-id="interior"]') ||
                         document.querySelector('[data-service-id="interior"]');

        // Debug logging for mobile
        console.log(`[MOBILE DEBUG] Found sections - Architecture: ${!!architectureSection}, Urbanism: ${!!urbanismSection}, Interior: ${!!interiorSection}`);
      } else {
        // On desktop, look for elements in desktop layout first
        architectureSection = document.querySelector('.hidden.md\\:block [data-service-id="architecture"]') ||
                             document.querySelector('[data-service-id="architecture"]');
        urbanismSection = document.querySelector('.hidden.md\\:block [data-service-id="urbanism"]') ||
                         document.querySelector('[data-service-id="urbanism"]');
        interiorSection = document.querySelector('.hidden.md\\:block [data-service-id="interior"]') ||
                         document.querySelector('[data-service-id="interior"]');
      }

      if (!architectureSection || !urbanismSection || !interiorSection) {
        return null;
      }

      // Get section boundaries based on their title positions
      const architectureTitle = architectureSection.querySelector('h2');
      const urbanismTitle = urbanismSection.querySelector('h2');
      const interiorTitle = interiorSection.querySelector('h2');

      if (!architectureTitle || !urbanismTitle || !interiorTitle) {
        return null;
      }

      // Calculate absolute positions of section titles
      const architectureTop = architectureTitle.getBoundingClientRect().top + scrollY;
      const urbanismTop = urbanismTitle.getBoundingClientRect().top + scrollY;
      const interiorTop = interiorTitle.getBoundingClientRect().top + scrollY;

      // Determine current section based on scroll position
      // Different offsets for mobile and desktop
      const headerOffset = isMobile ? 80 : 100;
      const currentScrollPosition = scrollY + headerOffset;

      let currentSection = null;

      if (currentScrollPosition >= interiorTop) {
        // We're in the interior section (from interior title to end of page)
        currentSection = 'interior';
      } else if (currentScrollPosition >= urbanismTop) {
        // We're in the urbanism section (from urbanism title to interior title)
        currentSection = 'urbanism';
      } else if (currentScrollPosition >= architectureTop) {
        // We're in the architecture section (from architecture title to urbanism title)
        currentSection = 'architecture';
      } else {
        // We're above all sections (header area)
        currentSection = null;
      }

      // Debug logging
      console.log(`[SECTION DEBUG] Mobile: ${isMobile}, Scroll: ${scrollY}, Position: ${currentScrollPosition}, Architecture: ${architectureTop}, Urbanism: ${urbanismTop}, Interior: ${interiorTop}, Active: ${currentSection}`);

      return currentSection;
    };

    const handleScroll = () => {
      const newActiveSection = determineActiveSection();
      setActiveSection(newActiveSection);
      onSectionChange?.(newActiveSection);
      checkBackgroundType();
    };

    // Initial check
    setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
