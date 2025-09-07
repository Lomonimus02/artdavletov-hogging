'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const [visibleTeamMembers, setVisibleTeamMembers] = useState<Set<string>>(new Set());
  const [isTabletLandscape, setIsTabletLandscape] = useState(false);
  const [visibleRoles, setVisibleRoles] = useState<Set<string>>(new Set());



  // Данные команды
  const teamMembers = [
    {
      name: t('about.team.member1.name'),
      position: t('about.team.member1.position'),
      image: "/images/IMG_9650.JPG",
      isFounder: true // Специальный флаг для учредителя
    },
    {
      name: t('about.team.member2.name'),
      position: t('about.team.member2.position'),
      image: "/images/IMG_9333.JPG"
    },
    {
      name: t('about.team.member3.name'),
      position: t('about.team.member3.position'),
      image: "/images/IMG_9334.JPG"
    },
    {
      name: t('about.team.member4.name'),
      position: t('about.team.member4.position'),
      image: "/images/IMG_9340.JPG"
    },
    {
      name: t('about.team.member5.name'),
      position: t('about.team.member5.position'),
      image: "/images/IMG_9335.JPG"
    },
    {
      name: t('about.team.member6.name'),
      position: t('about.team.member6.position'),
      image: "/images/IMG_9336.JPG"
    },
    {
      name: t('about.team.member7.name'),
      position: t('about.team.member7.position'),
      image: "/images/IMG_9332.JPG"
    }
  ];

  // Set page identifier for mobile menu styling and tablet detection
  useEffect(() => {
    document.body.setAttribute('data-page', 'about');

    // Detect tablet viewport and add class for tablet-specific styling - EXCLUDE DESKTOP
    const checkViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // More precise tablet detection - exclude tall desktop screens
      const isTabletLandscape = width >= 1024 && width <= 1366 && width > height && height <= 900;

      console.log(`Viewport: ${width}x${height}, isTabletLandscape: ${isTabletLandscape}`);

      if (isTabletLandscape) {
        document.body.classList.add('tablet-landscape');
        setIsTabletLandscape(true);
        console.log('Added tablet-landscape class - TABLET DETECTED');
      } else {
        document.body.classList.remove('tablet-landscape');
        setIsTabletLandscape(false);
        console.log('Removed tablet-landscape class - DESKTOP OR OTHER DEVICE');
      }
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);

    return () => {
      document.body.removeAttribute('data-page');
      document.body.classList.remove('tablet-landscape');
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  // Intersection Observer for team member scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const memberId = entry.target.getAttribute('data-member-id');
            if (memberId) {
              setVisibleTeamMembers(prev => {
                const newSet = new Set(prev);
                newSet.add(memberId);
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

    // Observe all team member items after a short delay to ensure DOM is ready
    const observeTeamMembers = () => {
      const teamElements = document.querySelectorAll('.team-scroll-animate');
      teamElements.forEach((element) => observer.observe(element));
    };

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(observeTeamMembers, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Function to toggle role visibility on photo click - only one role visible at a time
  const toggleRole = useCallback((memberId: string) => {
    setVisibleRoles(prev => {
      const newSet = new Set();
      // If clicking on the same member that's already visible, hide it
      if (prev.has(memberId)) {
        // Hide all roles (empty set)
        return newSet;
      } else {
        // Show only this member's role (hide all others)
        newSet.add(memberId);
        return newSet;
      }
    });
  }, []);


  return (
    <div className="min-h-screen bg-white pt-16">


      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white mobile-about-hero">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 mobile-about-heading-container">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] xl:text-[16rem] font-bold text-black tracking-wider uppercase leading-tight mobile-hide-about-heading">
              {t('about.title')}
            </h1>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto text-center desktop-about-content">
            <div className="bg-white p-12 lg:p-16">
              <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black leading-relaxed mb-12 mobile-about-main-heading">
                {t('about.main.title')}
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-black leading-relaxed mb-10">
                {t('about.main.description1')}
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-black leading-relaxed mb-10">
                {t('about.main.description2')}
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-black leading-relaxed">
                {t('about.main.description3')}
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Team Section - Reduced padding for desktop to move content up */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-wider uppercase">
              {t('about.team.title')}
            </h2>
          </div>

          {/* Desktop Layout - Founder left, team right */}
          <div className="hidden md:flex gap-16 lg:gap-20 xl:gap-24 items-start justify-center desktop-team-layout">
            {/* Founder Card - Large Left */}
            {teamMembers.filter(member => member.isFounder).map((founder, index) => {
              const founderId = `founder-${index}`;
              const isFounderRoleVisible = visibleRoles.has(founderId);

              return (
                <div key={index} className="flex-shrink-0 flex flex-col items-center">
                  <div className="group flex flex-col items-center">
                    <div
                      className="relative mb-2 transition-all duration-700 founder-photo-container-new tablet-clickable"
                      onClick={() => toggleRole(founderId)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className={`founder-image-new founder-height-responsive transition-all duration-700 ${isFounderRoleVisible ? 'tablet-image-clicked' : ''}`}
                      />

                      {/* Desktop hover role display */}
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 desktop-hover-role">
                        <p className="text-white font-medium uppercase tracking-wider text-lg">
                          {founder.position}
                        </p>
                      </div>

                      {/* Tablet click role display - always present for smooth transitions */}
                      {/* Gradient overlay for clicked state */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-700 z-10 tablet-click-gradient ${isFounderRoleVisible ? 'opacity-100' : 'opacity-0'}`}></div>
                      {/* Role text */}
                      <div className={`absolute bottom-4 left-4 right-4 transform transition-all duration-700 z-20 tablet-click-role ${isFounderRoleVisible ? 'translate-y-0 opacity-100 role-display-enter' : 'translate-y-4 opacity-0'}`}>
                        <p className="text-white font-medium uppercase tracking-wider text-lg">
                          {founder.position}
                        </p>
                      </div>
                    </div>
                    <div className="text-center w-full flex justify-center">
                      <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-black uppercase tracking-wider mb-2 group-hover:text-black transition-colors duration-300 text-center">
                        {founder.name}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Team Grid - 6 members in perfect 3x2 grid */}
            <div className="flex-1">
              <div className="desktop-team-grid">
                {teamMembers.filter(member => !member.isFounder).map((member, index) => {
                  // Абрамова Кира - это member6, что соответствует index 4 в отфильтрованном массиве (без учредителя)
                  const isAbramovaKira = member.name.includes('Абрамова') || member.name.includes('Abramova') || member.name.includes('阿布拉莫娃');
                  const memberId = `member-${index}`;
                  const isRoleVisible = visibleRoles.has(memberId);

                  return (
                    <div key={index} className={`group desktop-team-member ${isAbramovaKira ? 'team-member-abramova-kira' : ''}`}>
                    <div
                      className="relative mb-4 transition-all duration-700 team-photo-container-new tablet-clickable"
                      onClick={() => toggleRole(memberId)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                      <img
                        src={member.image}
                        alt={member.name}
                        className={`transition-all duration-700 group-hover:scale-105 team-image-new ${isRoleVisible ? 'tablet-image-clicked' : ''}`}
                      />

                      {/* Desktop hover role display - same as founder */}
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 desktop-hover-role">
                        <p className="text-white font-medium uppercase tracking-wider text-lg">
                          {member.position}
                        </p>
                      </div>

                      {/* Tablet click role display - always present for smooth transitions */}
                      {/* Gradient overlay for clicked state */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-700 z-10 tablet-click-gradient ${isRoleVisible ? 'opacity-100' : 'opacity-0'}`}></div>
                      {/* Role text */}
                      <div className={`absolute bottom-4 left-4 right-4 transform transition-all duration-700 z-20 tablet-click-role ${isRoleVisible ? 'translate-y-0 opacity-100 role-display-enter' : 'translate-y-4 opacity-0'}`}>
                        <p className="text-white font-medium uppercase tracking-wider text-lg">
                          {member.position}
                        </p>
                      </div>

                    </div>
                    <div className="text-center">
                      <h3 className="text-lg lg:text-xl font-bold text-black uppercase tracking-wider mb-2 group-hover:text-black transition-colors duration-300 whitespace-nowrap">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Layout - All members in single column with consistent margins */}
          <div className="block md:hidden space-y-8">
            <div className="mobile-team-container-wrapper">
              {teamMembers.map((member, index) => {
                const memberId = `member-${index}`;
                return (
                  <div
                    key={index}
                    className={`group mobile-team-member-wrapper team-scroll-animate ${
                      visibleTeamMembers.has(memberId) ? 'team-visible' : 'team-hidden'
                    }`}
                    data-member-id={memberId}
                  >
                    <div className="relative overflow-hidden bg-gray-200 mb-4 mobile-team-photo-container">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full mobile-team-image"
                      />
                      {/* Position always visible on mobile - white text without background */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-medium uppercase tracking-wider text-sm mobile-position-text">
                          {member.position}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-black uppercase tracking-wider mb-2">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>



    </div>
  )
}
