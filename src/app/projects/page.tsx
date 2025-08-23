'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ProjectsSectionNavigation from '@/components/ProjectsSectionNavigation';

export default function Projects() {
  const { t, language } = useLanguage();
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Handle project click - navigate directly to project page
  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  // State for projects loaded from API
  const [apiProjects, setApiProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Load projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setApiProjects(data);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  // Function to get translated project data (fallback)
  const getTranslatedProjectsFallback = () => [
    {
      id: 1,
      title: t('project.1.title'),
      category: t('project.1.category'),
      type: t('project.1.type'),
      city: t('project.1.city'),
      area: "850 м²",
      year: "2024",
      image: "/images/project-1.JPG",
      description: t('project.1.description'),
      section: 'architecture'
    },
    {
      id: 2,
      title: t('project.2.title'),
      category: t('project.2.category'),
      type: t('project.2.type'),
      city: t('project.2.city'),
      area: "12,000 м²",
      year: "2023",
      image: "/images/project-2.JPG",
      description: t('project.2.description'),
      section: 'architecture'
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
      description: t('project.3.description'),
      section: 'interior'
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
      description: t('project.4.description'),
      section: 'interior'
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
      description: t('project.5.description'),
      section: 'interior'
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
      description: t('project.6.description'),
      section: 'interior'
    },
    {
      id: 7,
      title: t('project.7.title'),
      category: t('project.7.category'),
      type: t('project.7.type'),
      city: t('project.7.city'),
      area: "300 м²",
      year: "2022",
      image: "/images/project-7.jpg",
      description: t('project.7.description'),
      section: 'interior'
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
      description: t('project.8.description'),
      section: 'interior'
    },
    {
      id: 9,
      title: t('project.9.title'),
      category: t('project.9.category'),
      type: t('project.9.type'),
      city: t('project.9.city'),
      area: "1,200 м²",
      year: "2023",
      image: "/images/project-9.jpg",
      description: t('project.9.description'),
      section: 'interior'
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
      description: t('project.10.description'),
      section: 'interior'
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
      description: t('project.11.description'),
      section: 'architecture'
    },
    {
      id: 12,
      title: t('project.12.title'),
      category: t('project.12.category'),
      type: t('project.12.type'),
      city: t('project.12.city'),
      area: "150 м²",
      year: "2023",
      image: "/images/project-12.jpg",
      description: t('project.12.description'),
      section: 'interior'
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
      description: t('project.13.description'),
      section: 'urbanism'
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
      description: t('project.14.description'),
      section: 'interior'
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
      description: t('project.15.description'),
      section: 'architecture'
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
      description: t('project.16.description'),
      section: 'architecture'
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
      description: t('project.17.description'),
      section: 'architecture'
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
      description: t('project.18.description'),
      section: 'architecture'
    }
  ];

  // Use API projects if loaded, otherwise use translated fallback
  const projects = apiProjects.length > 0 ? apiProjects : getTranslatedProjectsFallback();

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

  // Group projects by sections
  const groupProjectsBySection = (projects: any[]) => {
    const sections = {
      architecture: {
        title: t('projects.section.architecture'),
        projects: projects.filter(p => p.section === 'architecture')
      },
      urbanism: {
        title: t('projects.section.urbanism'),
        projects: projects.filter(p => p.section === 'urbanism')
      },
      interior: {
        title: t('projects.section.interior'),
        projects: projects.filter(p => p.section === 'interior')
      }
    };

    // Return only sections that have projects
    return Object.entries(sections)
      .filter(([_, section]) => section.projects.length > 0)
      .map(([key, section]) => ({ key, ...section }));
  };

  const projectSections = groupProjectsBySection(filteredProjects);

  // Handle section navigation
  const handleSectionNavigation = (sectionId: string) => {
    console.log('=== NAVIGATION DEBUG ===');
    console.log('Navigating to section:', sectionId);

    // Check if we're on desktop (width > 768px)
    const isDesktop = window.innerWidth > 768;
    console.log('Is desktop:', isDesktop, 'Window width:', window.innerWidth);

    // Find all elements with the target data-service-id
    const allElements = document.querySelectorAll(`[data-service-id="${sectionId}"]`);
    console.log('All elements found:', allElements.length);

    let targetElement = null;

    // Log all elements and their visibility
    allElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      const isVisible = computedStyle.display !== 'none' && rect.height > 0;
      const parent = element.parentElement;

      console.log(`Element ${index}:`, {
        element,
        isVisible,
        display: computedStyle.display,
        height: rect.height,
        parentClasses: parent ? Array.from(parent.classList) : 'no parent'
      });
    });

    // Simple selection: use the visible element
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      const computedStyle = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const isVisible = computedStyle.display !== 'none' && rect.height > 0;

      if (isVisible) {
        targetElement = element;
        console.log('Selected visible element:', targetElement);
        break;
      }
    }

    // Final fallback: if no visible element found, use the first element
    if (!targetElement && allElements.length > 0) {
      targetElement = allElements[0];
      console.log('Using first element as final fallback:', targetElement);
    }

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      console.log('Element position:', elementPosition, 'Desktop:', isDesktop);

      if (isDesktop) {
        // On desktop, scroll with header offset (increased for fixed menu)
        const offsetPosition = elementPosition - 120;
        console.log('Scrolling to desktop position:', offsetPosition);
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // On mobile, use offset for fixed menu
        const offsetPosition = elementPosition - 100;
        console.log('Scrolling to mobile position:', offsetPosition);
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      console.error('Section element not found for:', sectionId);
    }
  };

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
      {/* Section Navigation */}
      <ProjectsSectionNavigation onNavigate={handleSectionNavigation} />

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100 projects-page-header">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-8xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-black tracking-wider uppercase leading-tight">
              {t('projects.title')}
            </h1>
            {isAdmin && (
              <div className="mt-8">
                <Link
                  href="/admin/dashboard"
                  className="bg-blue-600 text-white px-6 py-3 font-black uppercase tracking-wider text-sm hover:bg-blue-700 transition-colors duration-300"
                >
                  Редактировать проекты
                </Link>
              </div>
            )}
          </div>

          {/* Contact Button and Filter */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <a
              href="/contacts"
              className="inline-block bg-white text-black border-2 border-black px-8 py-3 font-black uppercase tracking-wider text-lg md:text-xl lg:text-2xl hover:bg-black hover:text-white transition-colors duration-500"
            >
              {t('projects.cta.button')}
            </a>

            {/* Filter Icon */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-white text-black border-2 border-black px-4 py-3 font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-500 flex items-center justify-center"
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
      <section className="py-8 projects-grid">
        <div className="w-full">
          {loadingProjects ? (
            <div className="text-center py-20">
              <p className="text-xl font-black text-gray-500 uppercase tracking-wider">
                Загрузка проектов...
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl font-black text-gray-500 uppercase tracking-wider">
                {t('projects.not.found')}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Layout */}
              <div className="hidden md:block">
                {projectSections.map((section, sectionIndex) => (
                  <div key={section.key} className="mb-16" data-service-id={section.key}>
                    {/* Section Title */}
                    <div className="text-center py-8">
                      <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-black uppercase tracking-wider">
                        {section.title}
                      </h2>
                    </div>

                    {/* Section Projects */}
                    {section.projects.map((project, index) => {
                      return (
                        <Link key={project.id} href={`/projects/${getProjectPageId(project.id)}`} className="group cursor-pointer block relative z-10 hover:z-20" id={`project-${project.id}`}>
                          <div className="flex items-center hover:bg-gray-50 transition-colors duration-300 flex-row">
                            {/* Project Image */}
                            <div className="relative overflow-hidden bg-gray-100 aspect-square w-80 md:w-96 lg:w-[28rem] xl:w-[32rem] flex-shrink-0 group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 origin-left">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                            </div>

                            {/* Project Info */}
                            <div className="flex-grow flex items-center justify-center">
                              <div className="space-y-4 text-right">
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
                ))}
              </div>

              {/* Mobile Layout */}
              <div className="block md:hidden mobile-projects-grid">
                {projectSections.map((section, sectionIndex) => (
                  <div key={section.key} className="mb-8" data-service-id={section.key}>
                    {/* Section Title */}
                    <div className="text-center py-6">
                      <h2 className="text-2xl lg:text-3xl font-black text-black uppercase tracking-wider">
                        {section.title}
                      </h2>
                    </div>

                    {/* Section Projects */}
                    {section.projects.map((project, index) => {
                      const projectId = project.id.toString();

                      return (
                        <Link
                          key={project.id}
                          href={`/projects/${getProjectPageId(project.id)}`}
                          id={`project-${project.id}`}
                          className={`mobile-project-item project-scroll-animate block ${
                            visibleProjects.has(projectId) ? 'project-visible' : 'project-hidden'
                          }`}
                          data-project-id={projectId}
                        >
                          <img
                            src={project.image}
                            alt={project.title}
                            className="mobile-project-image"
                          />
                          {/* Gradient overlay - always visible on mobile */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100"></div>

                          {/* Text - always visible on mobile */}
                          <div className="absolute bottom-4 left-4 right-4 transform translate-y-0 opacity-100">
                            <div className="space-y-2">
                              <div className="text-white font-black uppercase tracking-wider text-sm">
                                {project.title}
                              </div>
                              <div className="text-white font-black uppercase tracking-wider text-sm opacity-80">
                                {project.year}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>


    </div>
  );
}
