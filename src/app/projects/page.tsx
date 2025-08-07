'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Projects() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [overlayStates, setOverlayStates] = useState<{[key: string]: boolean}>({});
  const [visibleProjects, setVisibleProjects] = useState<Set<string>>(new Set());

  // Utility function to determine if we're on mobile
  const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth <= 768;

  // Utility function to find the correct element (mobile or desktop)
  const findTargetElement = (projectId: string): HTMLElement | null => {
    if (typeof window === 'undefined') return null;

    const isMobile = isMobileViewport();
    const allElements = document.querySelectorAll(`#project-${projectId}`);

    console.log(`[SCROLL] Looking for project-${projectId}, found ${allElements.length} elements, mobile: ${isMobile}`);

    const elementsArray = Array.from(allElements);
    for (let element of elementsArray) {
      const isMobileElement = element.classList.contains('mobile-project-item');
      const computedStyle = window.getComputedStyle(element);
      const isVisible = computedStyle.display !== 'none';

      console.log(`[SCROLL] Element - Mobile: ${isMobileElement}, Visible: ${isVisible}`);

      if ((isMobile && isMobileElement && isVisible) || (!isMobile && !isMobileElement && isVisible)) {
        console.log(`[SCROLL] Selected correct element for ${isMobile ? 'mobile' : 'desktop'}`);
        return element as HTMLElement;
      }
    }

    console.log(`[SCROLL] No suitable element found for project-${projectId}`);
    return null;
  };

  // Main scroll function
  const scrollToProject = (projectId: string, maxAttempts: number = 15, delay: number = 200) => {
    let attempts = 0;

    const attemptScroll = () => {
      attempts++;
      console.log(`[SCROLL] Attempt ${attempts}/${maxAttempts} for project-${projectId}`);

      const element = findTargetElement(projectId);

      if (element) {
        console.log(`[SCROLL] Found target element project-${projectId}`);

        // Check if mobile element is hidden and make it visible
        const isMobileElement = element.classList.contains('mobile-project-item');
        const isHidden = element.classList.contains('project-hidden');

        if (isMobileElement && isHidden) {
          console.log(`[SCROLL] Mobile element is hidden, making it visible first`);
          element.classList.remove('project-hidden');
          element.classList.add('project-visible');

          // Update visibleProjects state
          const dataProjectId = element.getAttribute('data-project-id');
          if (dataProjectId) {
            setVisibleProjects(prev => {
              const newSet = new Set(prev);
              newSet.add(dataProjectId);
              return newSet;
            });
          }
        }

        // Scroll with delay
        const scrollDelay = isMobileElement && isHidden ? 300 : 100;
        setTimeout(() => {
          console.log(`[SCROLL] Scrolling to project-${projectId}...`);
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });

          // Verify scroll position after a delay
          setTimeout(() => {
            const rect = element.getBoundingClientRect();
            const isInView = rect.top >= 0 && rect.top <= window.innerHeight;
            console.log(`[SCROLL] Scroll completed. Element in view: ${isInView}, top: ${rect.top}`);
          }, 1000);
        }, scrollDelay);

        return true;
      } else if (attempts < maxAttempts) {
        console.log(`[SCROLL] Element not found, retrying in ${delay}ms...`);
        setTimeout(attemptScroll, delay);
        return false;
      } else {
        console.error(`[SCROLL] Failed to find element project-${projectId} after ${maxAttempts} attempts`);
        return false;
      }
    };

    attemptScroll();
  };

  // Initialize filters from URL params, localStorage, or defaults
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const cityParam = searchParams.get('city');

    if (typeParam || cityParam) {
      // Use URL params if available
      setSelectedType(typeParam || t('projects.filter.all'));
      setSelectedCity(cityParam || t('projects.filter.all'));
    } else if (typeof window !== 'undefined') {
      // Try to restore from localStorage (only on client side)
      const savedType = localStorage.getItem('projects-filter-type');
      const savedCity = localStorage.getItem('projects-filter-city');

      if (savedType && savedType !== 'undefined' && savedType !== 'null') {
        setSelectedType(savedType);
      } else {
        setSelectedType(t('projects.filter.all'));
      }

      if (savedCity && savedCity !== 'undefined' && savedCity !== 'null') {
        setSelectedCity(savedCity);
      } else {
        setSelectedCity(t('projects.filter.all'));
      }
    } else {
      // Fallback for server-side rendering
      setSelectedType(t('projects.filter.all'));
      setSelectedCity(t('projects.filter.all'));
    }
  }, [searchParams, t]);

  // Reset filters when language changes (only if no saved filters)
  useEffect(() => {
    const hasURLParams = searchParams.get('type') || searchParams.get('city');
    let hasSavedFilters = false;

    if (typeof window !== 'undefined') {
      hasSavedFilters = !!(localStorage.getItem('projects-filter-type') || localStorage.getItem('projects-filter-city'));
    }

    if (!hasURLParams && !hasSavedFilters) {
      setSelectedType(t('projects.filter.all'));
      setSelectedCity(t('projects.filter.all'));
    }
  }, [language, t, searchParams]);

  // Handle scroll to project when returning from individual project page
  useEffect(() => {
    const scrollToProjectId = searchParams.get('scrollTo');
    if (scrollToProjectId) {
      console.log(`[SCROLL] Initial scroll attempt for project-${scrollToProjectId}`);
      // Start scroll attempts with a small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToProject(scrollToProjectId, 20, 150);
      }, 100);
    }
  }, [searchParams]);

  // Additional scroll attempt after page is fully loaded
  useEffect(() => {
    const scrollToProjectId = searchParams.get('scrollTo');
    if (scrollToProjectId) {
      const handleLoad = () => {
        console.log(`[SCROLL] Post-load scroll attempt for project-${scrollToProjectId}`);
        setTimeout(() => {
          scrollToProject(scrollToProjectId, 10, 300);
        }, 1200);
      };

      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, [searchParams]);

  // Update URL and localStorage when filters change
  const updateURL = (type: string, city: string) => {
    const params = new URLSearchParams();

    // Save to localStorage (only on client side)
    if (typeof window !== 'undefined') {
      if (type === t('projects.filter.all')) {
        localStorage.removeItem('projects-filter-type');
      } else {
        localStorage.setItem('projects-filter-type', type);
      }

      if (city === t('projects.filter.all')) {
        localStorage.removeItem('projects-filter-city');
      } else {
        localStorage.setItem('projects-filter-city', city);
      }
    }

    if (type && type !== t('projects.filter.all')) {
      params.set('type', type);
    }
    if (city && city !== t('projects.filter.all')) {
      params.set('city', city);
    }

    const newURL = params.toString() ? `/projects?${params.toString()}` : '/projects';
    router.replace(newURL, { scroll: false });
  };

  // Handle filter selection without auto-close
  const handleTypeSelection = (typeLabel: string) => {
    setSelectedType(typeLabel);
    updateURL(typeLabel, selectedCity);
  };

  const handleCitySelection = (cityLabel: string) => {
    setSelectedCity(cityLabel);
    updateURL(selectedType, cityLabel);
  };

  // Handle project click - first click shows overlay, second click navigates
  const handleProjectClick = (projectId: string) => {
    if (overlayStates[projectId]) {
      // Second click - navigate to project page
      router.push(`/projects/${projectId}`);
    } else {
      // First click - hide all overlays and show only this one
      setOverlayStates({
        [projectId]: true
      });
    }
  };

  // Function to get translated project data
  const getTranslatedProjects = () => [
    {
      id: 1,
      title: t('project.1.title'),
      category: t('project.1.category'),
      type: t('project.1.type'),
      city: t('project.1.city'),
      area: "850 м²",
      year: "2024",
      image: "/images/project-1.JPG",
      description: t('project.1.description')
    },

    {
      id: 3,
      title: t('project.3.title'),
      category: t('project.3.category'),
      type: t('project.3.type'),
      city: t('project.3.city'),
      area: "250 м²",
      year: "2023",
      image: "/images/project-3.jpeg",
      description: t('project.3.description')
    },
    {
      id: 4,
      title: t('project.4.title'),
      category: t('project.4.category'),
      type: t('project.4.type'),
      city: t('project.4.city'),
      area: "185 м²",
      year: "2022",
      image: "/images/project-4.png",
      description: t('project.4.description')
    },
    {
      id: 5,
      title: t('project.5.title'),
      category: t('project.5.category'),
      type: t('project.5.type'),
      city: t('project.5.city'),
      area: "650 м²",
      year: "2024",
      image: "/images/project-5.jpeg",
      description: t('project.5.description')
    },
    {
      id: 6,
      title: t('project.6.title'),
      category: t('project.6.category'),
      type: t('project.6.type'),
      city: t('project.6.city'),
      area: "45,000 м²",
      year: "2022",
      image: "/images/project-6.PNG",
      description: t('project.6.description')
    },

    {
      id: 8,
      title: t('project.8.title'),
      category: t('project.8.category'),
      type: t('project.8.type'),
      city: t('project.8.city'),
      area: "720 м²",
      year: "2024",
      image: "/images/project-8.jpg",
      description: t('project.8.description')
    },

    {
      id: 10,
      title: t('project.10.title'),
      category: t('project.10.category'),
      type: t('project.10.type'),
      city: t('project.10.city'),
      area: "2,500 м²",
      year: "2023",
      image: "/images/project-10.jpeg",
      description: t('project.10.description')
    },
    {
      id: 11,
      title: t('project.11.title'),
      category: t('project.11.category'),
      type: t('project.11.type'),
      city: t('project.11.city'),
      area: "32,000 м²",
      year: "2024",
      image: "/images/project-11.jpg",
      description: t('project.11.description')
    },

    {
      id: 13,
      title: t('project.13.title'),
      category: t('project.13.category'),
      type: t('project.13.type'),
      city: t('project.13.city'),
      area: "650 м²",
      year: "2024",
      image: "/images/KOZYN_1712609051430.jpeg",
      description: t('project.13.description')
    },
    {
      id: 14,
      title: t('project.14.title'),
      category: t('project.14.category'),
      type: t('project.14.type'),
      city: t('project.14.city'),
      area: "150 м²",
      year: "2024",
      image: "/images/PRIME_66_1720719145868.jpeg",
      description: t('project.14.description')
    },
    {
      id: 15,
      title: t('project.15.title'),
      category: t('project.15.category'),
      type: t('project.15.type'),
      city: t('project.15.city'),
      area: "450 м²",
      year: "2023",
      image: "/images/RETREAT 2_1712608916703.jpeg",
      description: t('project.15.description')
    },
    {
      id: 16,
      title: t('project.16.title'),
      category: t('project.16.category'),
      type: t('project.16.type'),
      city: t('project.16.city'),
      area: "380 м²",
      year: "2023",
      image: "/images/RETREAT 5_1712158424199.jpeg",
      description: t('project.16.description')
    },
    {
      id: 17,
      title: t('project.17.title'),
      category: t('project.17.category'),
      type: t('project.17.type'),
      city: t('project.17.city'),
      area: "720 м²",
      year: "2024",
      image: "/images/S-HOUSE_1720272109027 (2).jpeg",
      description: t('project.17.description')
    },
    {
      id: 18,
      title: t('project.18.title'),
      category: t('project.18.category'),
      type: t('project.18.type'),
      city: t('project.18.city'),
      area: "580 м²",
      year: "2024",
      image: "/images/4b4e6b200381579.66616a1110827.jpg",
      description: t('project.18.description')
    }
  ];

  const projects = getTranslatedProjects();

  const projectTypes = [
    { key: 'all', label: t('projects.filter.all') },
    { key: 'design', label: t('projects.filter.design') },
    { key: 'sketch', label: t('projects.filter.sketch') }
  ];
  const cities = [
    { key: 'all', label: t('projects.filter.all') },
    { key: 'moscow', label: t('city.moscow') },
    { key: 'moscow-region', label: t('city.moscow-region') },
    { key: 'spb', label: t('city.spb') },
    { key: 'ufa', label: t('city.ufa') },
    { key: 'tver', label: t('city.tver') },
    { key: 'tatarstan', label: t('city.tatarstan') },
    { key: 'poland', label: t('city.poland') },
    { key: 'novoaleksandrovka', label: t('city.novoaleksandrovka') }
  ];

  const filteredProjects = projects.filter(project => {
    const typeMatch = !selectedType || selectedType === t('projects.filter.all') || selectedType === 'Все' || selectedType === '' || project.type === selectedType;
    const cityMatch = !selectedCity || selectedCity === t('projects.filter.all') || selectedCity === 'Все' || selectedCity === '' || project.city === selectedCity;
    return typeMatch && cityMatch;
  });

  // Функция для определения правильного ID страницы проекта
  // Удаленные проекты 2, 7, 9, 12 больше не нужны в redirectMap
  const getProjectPageId = (projectId: number) => {
    return projectId;
  };

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const projectId = entry.target.getAttribute('data-project-id');
            if (projectId) {
              setVisibleProjects(prev => {
                const newSet = new Set(prev);
                newSet.add(projectId);
                return newSet;
              });
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '50px 0px -50px 0px' // Start animation slightly before element enters viewport
      }
    );

    // Observe all project items after a short delay to ensure DOM is ready
    const observeProjects = () => {
      const projectElements = document.querySelectorAll('.project-scroll-animate');
      projectElements.forEach((element) => observer.observe(element));

      // После настройки observer, проверим нужно ли скроллить к проекту
      const scrollToProjectId = searchParams.get('scrollTo');
      if (scrollToProjectId) {
        console.log(`[SCROLL] Observer-based scroll attempt for project-${scrollToProjectId}`);
        setTimeout(() => {
          scrollToProject(scrollToProjectId, 8, 400);
        }, 1500);
      }
    };

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(observeProjects, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [filteredProjects.length, searchParams]); // Re-run when filtered projects count changes

  // Set page identifier for mobile menu styling
  useEffect(() => {
    document.body.setAttribute('data-page', 'projects');
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100 projects-page-header">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center relative">
            <div className="text-center">
              <h1 className="text-8xl md:text-9xl lg:text-[12rem] xl:text-[16rem] font-black text-black tracking-wider uppercase leading-tight">
                {t('projects.title')}
              </h1>
            </div>
            <div className="filter-dropdown absolute right-0 top-1/2 transform -translate-y-1/2">
              {/* Filter Icon */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-4 bg-black text-white hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
                title={t('projects.filter.title')}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transform transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
                >
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFilterOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Type Filter */}
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-gray-700 mb-4">Тип проекта</h3>
                <div className="flex flex-wrap gap-3">
                  {projectTypes.map((type) => (
                    <button
                      key={type.key}
                      onClick={() => handleTypeSelection(type.label)}
                      className={`px-4 py-2 text-sm font-black uppercase tracking-wider transition-colors duration-300 ${
                        selectedType === type.label
                          ? 'bg-black text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-gray-700 mb-4">Город</h3>
                <div className="flex flex-wrap gap-3">
                  {cities.map((city) => (
                    <button
                      key={city.key}
                      onClick={() => handleCitySelection(city.label)}
                      className={`px-4 py-2 text-sm font-black uppercase tracking-wider transition-colors duration-300 ${
                        selectedCity === city.label
                          ? 'bg-black text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Projects Grid */}
      <section className="py-20 projects-grid">
        <div className="w-full">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-black text-gray-500 uppercase tracking-wider">
                {t('projects.not.found')}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Layout */}
              <div className="hidden md:block">
                {filteredProjects.map((project, index) => {
                  // Простое чередование: четные слева, нечетные справа
                  const isEven = index % 2 === 0;

                  return (
                    <Link key={project.id} href={`/projects/${getProjectPageId(project.id)}`} className="group cursor-pointer block" id={`project-${project.id}`}>
                      <div className={`flex items-center hover:bg-gray-50 transition-colors duration-300 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                        {/* Project Image */}
                        <div className={`relative overflow-hidden bg-gray-100 aspect-square w-80 md:w-96 lg:w-[28rem] xl:w-[32rem] flex-shrink-0 group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 ${isEven ? 'origin-left' : 'origin-right'}`}>
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        </div>

                        {/* Project Info */}
                        <div className="flex-grow flex items-center justify-center">
                          <div className={`space-y-4 ${isEven ? 'text-right' : 'text-left'}`}>
                            {/* Название */}
                            <h3 className="text-3xl lg:text-4xl xl:text-5xl font-black text-black uppercase tracking-wider">
                              {project.title}
                            </h3>

                            {/* Год */}
                            <div className="space-y-2">
                              <span className="block text-3xl lg:text-4xl xl:text-5xl font-black text-gray-600 uppercase tracking-wider">
                                {project.year}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Layout */}
              <div className="block md:hidden mobile-projects-grid">
                {filteredProjects.map((project, index) => {
                  const isLeft = index % 2 === 0;
                  const projectId = project.id.toString();
                  const showOverlay = overlayStates[projectId];

                  return (
                    <div
                      key={project.id}
                      id={`project-${project.id}`}
                      className={`mobile-project-item project-scroll-animate ${
                        visibleProjects.has(projectId) ? 'project-visible' : 'project-hidden'
                      }`}
                      data-project-id={projectId}
                      onClick={() => handleProjectClick(projectId)}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="mobile-project-image"
                      />
                      {/* Gradient overlay that appears on click */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}></div>

                      {/* Text that slides up from bottom */}
                      <div className={`absolute bottom-4 left-4 right-4 transform transition-all duration-500 ${showOverlay ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <div className="space-y-2">
                          <div className="text-white font-black uppercase tracking-wider text-sm">
                            {project.title}
                          </div>
                          <div className="text-white font-black uppercase tracking-wider text-sm opacity-80">
                            {project.year}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="text-center">
          <a
            href="/contacts"
            className="inline-block bg-white text-black border-2 border-black px-16 py-5 font-black uppercase tracking-wider text-2xl md:text-3xl lg:text-4xl hover:bg-black hover:text-white transition-colors duration-500"
          >
            {t('projects.cta.button')}
          </a>
        </div>
      </section>
    </div>
  )
}
