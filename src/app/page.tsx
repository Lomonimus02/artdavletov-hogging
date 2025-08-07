'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();

  const backgroundImages = [
    '/images/4b4e6b200381579.66616a1110827.jpg',
    '/images/KOZYN_1712609051430.jpeg',
    '/images/PRIME_66_1720719145868.jpeg',
    '/images/RETREAT 2_1712608916703.jpeg',
    '/images/RETREAT 5_1712158424199.jpeg',
    '/images/S-HOUSE_1720272109027 (2).jpeg'
  ];

  // Desktop project images - original unchanged images
  const desktopProjectImages = [
    '/images/project-1.JPG', // Original desktop image
    '/images/project-2.JPG',
    '/images/project-3.jpeg',
    '/images/project-4.png',
    '/images/project-5.jpeg',
    '/images/project-6.PNG',
    '/images/project-7.jpg', // Original desktop image
    '/images/project-8.jpg',
    '/images/project-9.jpg',
    '/images/project-10.jpeg',
    '/images/project-11.jpg',
    '/images/project-12.jpg',
    '/images/project-11-7.jpg'
  ];

  // Mobile project images - with requested changes
  const mobileProjectImages = [
    '/images/project-8-5.jpg', // Changed from project-1.JPG to project-8-5.jpg for mobile
    '/images/project-2.JPG',
    '/images/project-3.jpeg',
    '/images/project-4.png',
    '/images/project-5.jpeg',
    '/images/project-6.PNG',
    '/images/RETREAT 2_1712608916703-2.jpg', // Changed from project-7.jpg to RETREAT 2_1712608916703-2.jpg for mobile
    '/images/project-8.jpg',
    '/images/project-9.jpg',
    '/images/project-10.jpeg',
    '/images/project-11.jpg',
    '/images/project-12.jpg',
    '/images/project-11-7.jpg'
  ];

  // Mapping of mobile project images to their corresponding project IDs (for mobile navigation)
  const mobileProjectImageToIdMapping = [
    8,  // project-8-5.jpg -> Project 8 (mobile changed from project-1.JPG)
    1,  // project-2.JPG -> Project 1 (this is actually project-2.JPG but maps to project 1)
    3,  // project-3.jpeg -> Project 3
    4,  // project-4.png -> Project 4
    5,  // project-5.jpeg -> Project 5
    6,  // project-6.PNG -> Project 6
    15, // RETREAT 2_1712608916703-2.jpg -> Project 15 (mobile changed from project-7.jpg)
    8,  // project-8.jpg -> Project 8
    8,  // project-9.jpg -> Project 8 (this is in project 8's gallery)
    10, // project-10.jpeg -> Project 10
    11, // project-11.jpg -> Project 11
    12, // project-12.jpg -> Project 12
    11  // project-11-7.jpg -> Project 11
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [visibleProjects, setVisibleProjects] = useState<Set<string>>(new Set());

  // Function to handle project image clicks (mobile only)
  const handleProjectImageClick = (imageIndex: number) => {
    const projectId = mobileProjectImageToIdMapping[imageIndex];
    if (projectId) {
      console.log(`[PROJECT CLICK] Navigating to project ${projectId} from mobile image index ${imageIndex}`);
      router.push(`/projects/${projectId}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Симуляция отправки формы
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Здесь можно добавить реальную отправку на сервер
      console.log('Form submitted:', formData);

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Ускорили интервал до 5000 мс (5 секунд)

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Set page identifier for mobile menu styling
  useEffect(() => {
    document.body.setAttribute('data-page', 'home');
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  // Intersection Observer for mobile project cards scroll animations
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

    // Observe mobile project items after a short delay to ensure DOM is ready
    const observeProjects = () => {
      const projectElements = document.querySelectorAll('.mobile-project-item.project-scroll-animate');
      projectElements.forEach((element) => observer.observe(element));
    };

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(observeProjects, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white mobile-no-overflow">
      {/* Hero Section with Background Slideshow */}
      <section className="h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden mobile-hero-container mobile-no-overflow">
        {/* Background Images */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[3000ms] ease-in-out mobile-hero-bg ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${image}')`
            }}
          />
        ))}

        <div className="max-w-6xl mx-auto text-center relative z-10 mobile-hero-text-container" style={{ marginTop: '-5vh' }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-wider uppercase drop-shadow-2xl mobile-hero-title mobile-hero-title-left" style={{ lineHeight: '1.2' }}>
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white font-bold max-w-4xl mx-auto leading-relaxed uppercase tracking-wide drop-shadow-xl mobile-hero-subtitle mobile-hero-subtitle-left">
            {t('home.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 mobile-stats-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 text-center mobile-stats-grid">
            <div>
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-black leading-relaxed uppercase tracking-wide mobile-stats-text">
                {t('home.stats.professionals')}
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-black leading-relaxed uppercase tracking-wide mobile-stats-text">
                {t('home.stats.specializations')}
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl lg:text-4xl font-black text-black leading-relaxed uppercase tracking-wide mobile-stats-text">
                {t('home.stats.growth')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-white mobile-projects-section">
        <div className="w-full">
          {/* Mobile Projects Layout - Single Column with Text Overlays */}
          <div className="mobile-projects-grid">
            {/* Project 1 with Text 1 */}
            <div
              className={`mobile-project-item cursor-pointer project-scroll-animate ${
                visibleProjects.has('home-project-1') ? 'project-visible' : 'project-hidden'
              }`}
              data-project-id="home-project-1"
              onClick={() => handleProjectImageClick(0)}
            >
              <img
                src={mobileProjectImages[0]}
                alt="Project 1"
                className="mobile-project-image"
              />
              <div className="mobile-project-text mobile-project-text-left mobile-project-text-optimized-1">
                {t('about.description.1')}
              </div>
            </div>

            {/* Project 2 with Text 2 */}
            <div
              className={`mobile-project-item cursor-pointer project-scroll-animate ${
                visibleProjects.has('home-project-2') ? 'project-visible' : 'project-hidden'
              }`}
              data-project-id="home-project-2"
              onClick={() => handleProjectImageClick(1)}
            >
              <img
                src={mobileProjectImages[1]}
                alt="Project 2"
                className="mobile-project-image"
              />
              <div className="mobile-project-text mobile-project-text-right">
                {t('about.description.2')}
              </div>
            </div>

            {/* Project 3 with Text 3 */}
            <div
              className={`mobile-project-item cursor-pointer project-scroll-animate ${
                visibleProjects.has('home-project-3') ? 'project-visible' : 'project-hidden'
              }`}
              data-project-id="home-project-3"
              onClick={() => handleProjectImageClick(2)}
            >
              <img
                src={mobileProjectImages[2]}
                alt="Project 3"
                className="mobile-project-image"
              />
              <div className="mobile-project-text mobile-project-text-left">
                {t('about.description.3')}
              </div>
            </div>

            {/* Project 4 with Text 4 */}
            <div
              className={`mobile-project-item cursor-pointer project-scroll-animate ${
                visibleProjects.has('home-project-4') ? 'project-visible' : 'project-hidden'
              }`}
              data-project-id="home-project-4"
              onClick={() => handleProjectImageClick(3)}
            >
              <img
                src={mobileProjectImages[3]}
                alt="Project 4"
                className="mobile-project-image"
              />
              <div className="mobile-project-text mobile-project-text-right">
                {t('about.description.4')}
              </div>
            </div>

            {/* Project 5 with Text 5 */}
            <div
              className={`mobile-project-item cursor-pointer project-scroll-animate ${
                visibleProjects.has('home-project-5') ? 'project-visible' : 'project-hidden'
              }`}
              data-project-id="home-project-5"
              onClick={() => handleProjectImageClick(4)}
            >
              <img
                src={mobileProjectImages[4]}
                alt="Project 5"
                className="mobile-project-image"
              />
              <div className="mobile-project-text mobile-project-text-left">
                {t('about.description.5')}
              </div>
            </div>

            {/* Project 6 with Text 6 */}
            <div
              className={`mobile-project-item cursor-pointer project-scroll-animate ${
                visibleProjects.has('home-project-6') ? 'project-visible' : 'project-hidden'
              }`}
              data-project-id="home-project-6"
              onClick={() => handleProjectImageClick(5)}
            >
              <img
                src={mobileProjectImages[5]}
                alt="Project 6"
                className="mobile-project-image"
              />
              <div className="mobile-project-text mobile-project-text-right">
                {t('about.description.6')}
              </div>
            </div>

            {/* Project 7 with Text 7 */}
            <div
              className={`mobile-project-item cursor-pointer project-scroll-animate ${
                visibleProjects.has('home-project-7') ? 'project-visible' : 'project-hidden'
              }`}
              data-project-id="home-project-7"
              onClick={() => handleProjectImageClick(6)}
            >
              <img
                src={mobileProjectImages[6]}
                alt="Project 7"
                className="mobile-project-image"
              />
              <div className="mobile-project-text mobile-project-text-left mobile-project-text-optimized-7">
                {t('about.description.7')}
              </div>
            </div>

            {/* Project 8 with "О НАС" text - New card */}
            <Link
              href="/about"
              className={`mobile-project-item mobile-project-about-link project-scroll-animate ${
                visibleProjects.has('home-project-about') ? 'project-visible' : 'project-hidden'
              }`}
              data-project-id="home-project-about"
            >
              <img
                src={mobileProjectImages[12]}
                alt="О НАС"
                className="mobile-project-image"
              />
              <div className="mobile-project-text mobile-project-text-center mobile-project-about-text">
                {t('about.title')}
              </div>
            </Link>
          </div>

          {/* Desktop Projects Grid with Text Blocks - Full Width */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 mb-0 mobile-hide-desktop-grid">
            {/* Row 1 */}
            {/* Project 1 - Columns 1-2, Rows 1-2 */}
            <Link href="/projects/1" className="group cursor-pointer md:col-span-2 md:row-span-2 relative z-10 hover:z-50 block">
              <div className="relative overflow-hidden bg-gray-100 aspect-square group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 origin-left">
                <img
                  src={desktopProjectImages[0]}
                  alt="Project 1"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-black uppercase tracking-wider text-sm">{t('projects.project1.description')}</p>
                </div>
              </div>
            </Link>

            {/* Text Block 1 - Column 3, Row 1 */}
            <div className="flex items-center justify-center bg-gray-50 aspect-square p-6 mobile-hide-text-blocks">
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-wide leading-tight text-center text-black mobile-projects-text">
                {t('about.description.1')}
              </p>
            </div>

            {/* Project 2 - Column 4, Row 1 */}
            <Link href="/projects/1" className="group cursor-pointer relative z-10 hover:z-50 block">
              <div className="relative overflow-hidden bg-gray-100 aspect-square group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <img
                  src={desktopProjectImages[1]}
                  alt="Project 2"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-black uppercase tracking-wider text-sm">{t('projects.project2.description')}</p>
                </div>
              </div>
            </Link>

            {/* Text Block 2 - Column 5, Row 1 */}
            <div className="flex items-center justify-center bg-gray-50 aspect-square p-6 mobile-hide-text-blocks">
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-wide leading-tight text-center text-black mobile-projects-text">
                {t('about.description.2')}
              </p>
            </div>

            {/* Project 3 - Column 6, Row 1 */}
            <Link href="/projects/3" className="group cursor-pointer relative z-10 hover:z-50 block">
              <div className="relative overflow-hidden bg-gray-100 aspect-square group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 origin-right">
                <img
                  src={desktopProjectImages[2]}
                  alt="Project 3"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-black uppercase tracking-wider text-sm">{t('projects.project3.description')}</p>
                </div>
              </div>
            </Link>

            {/* Row 2 - Project 1 continues, other elements */}
            {/* Project 4 - Column 3, Row 2 */}
            <Link href="/projects/4" className="group cursor-pointer relative z-10 hover:z-50 block">
              <div className="relative overflow-hidden bg-gray-100 aspect-square group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <img
                  src={desktopProjectImages[3]}
                  alt="Project 4"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-black uppercase tracking-wider text-sm">{t('projects.project4.description')}</p>
                </div>
              </div>
            </Link>

            {/* Text Block 3 - Column 4, Row 2 */}
            <div className="flex items-center justify-center bg-gray-50 aspect-square p-6 mobile-hide-text-blocks">
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-wide leading-tight text-center text-black mobile-projects-text">
                {t('about.description.3')}
              </p>
            </div>

            {/* Project 5 - Column 5, Row 2 */}
            <Link href="/projects/5" className="group cursor-pointer relative z-10 hover:z-50 block">
              <div className="relative overflow-hidden bg-gray-100 aspect-square group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <img
                  src={desktopProjectImages[4]}
                  alt="Project 5"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-black uppercase tracking-wider text-sm">{t('projects.project5.description')}</p>
                </div>
              </div>
            </Link>

            {/* Text Block 4 - Column 6, Row 2 */}
            <div className="flex items-center justify-center bg-gray-50 aspect-square p-6 mobile-hide-text-blocks">
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-wide leading-tight text-center text-black mobile-projects-text">
                {t('about.description.4')}
              </p>
            </div>

            {/* Row 3 */}
            {/* Text Block 5 - Column 1, Row 3 */}
            <div className="flex items-center justify-center bg-gray-50 aspect-square p-6 mobile-hide-text-blocks">
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-wide leading-tight text-center text-black mobile-projects-text">
                {t('about.description.5')}
              </p>
            </div>

            {/* Project 9 - Column 2, Row 3 */}
            <Link href="/projects/8" className="group cursor-pointer relative z-10 hover:z-50 block">
              <div className="relative overflow-hidden bg-gray-100 aspect-square group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <img
                  src={desktopProjectImages[8]}
                  alt="Project 9"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-black uppercase tracking-wider text-sm">{t('projects.project9.description')}</p>
                </div>
              </div>
            </Link>

            {/* Text Block 6 - Column 3, Row 3 */}
            <div className="flex items-center justify-center bg-gray-50 aspect-square p-6 mobile-hide-text-blocks">
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-wide leading-tight text-center text-black mobile-projects-text">
                {t('about.description.6')}
              </p>
            </div>

            {/* Project 7 - Column 4, Row 3 */}
            <Link href="/projects/6" className="group cursor-pointer relative z-10 hover:z-50 block">
              <div className="relative overflow-hidden bg-gray-100 aspect-square group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <img
                  src={desktopProjectImages[6]}
                  alt="Project 7"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-black uppercase tracking-wider text-sm">{t('projects.project7.description')}</p>
                </div>
              </div>
            </Link>

            {/* Project 6 - Columns 5-6, Rows 3-4 */}
            <Link href="/projects/6" className="group cursor-pointer md:col-span-2 md:row-span-2 relative z-10 hover:z-50 block">
              <div className="relative overflow-hidden bg-gray-100 aspect-square group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 origin-right">
                <img
                  src={desktopProjectImages[5]}
                  alt="Project 6"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-black uppercase tracking-wider text-sm">{t('projects.project6.description')}</p>
                </div>
              </div>
            </Link>

            {/* Row 4 */}
            {/* Project 10 - Column 1, Row 4 */}
            <Link href="/projects/10" className="group cursor-pointer relative z-10 hover:z-50 block">
              <div className="relative overflow-hidden bg-gray-100 aspect-square group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 origin-left">
                <img
                  src={desktopProjectImages[9]}
                  alt="Project 10"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-black uppercase tracking-wider text-sm">{t('projects.project10.description')}</p>
                </div>
              </div>
            </Link>

            {/* Text Block 7 - Column 2, Row 4 */}
            <div className="flex items-center justify-center bg-gray-50 aspect-square p-6 mobile-hide-text-blocks">
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-wide leading-tight text-center text-black mobile-projects-text">
                {t('about.description.7')}
              </p>
            </div>

            {/* Project 11 - Column 3, Row 4 */}
            <Link href="/projects/11" className="group cursor-pointer relative z-10 hover:z-50 block">
              <div className="relative overflow-hidden bg-gray-100 aspect-square group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                <img
                  src={desktopProjectImages[10]}
                  alt="Project 11"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-black uppercase tracking-wider text-sm">{t('projects.project11.description')}</p>
                </div>
              </div>
            </Link>

            {/* About Us Button - Column 4, Row 4 */}
            <Link href="/about" className="relative flex items-center justify-center bg-gray-50 aspect-square p-6 cursor-pointer group overflow-hidden mobile-hide-text-blocks">
              <div className="relative z-10 flex items-center justify-center">
                <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-black uppercase tracking-wide leading-tight text-center text-black relative mobile-projects-text">
                  {t('about.title')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-500 ease-out"></span>
                </p>
              </div>
            </Link>


          </div>
        </div>
      </section>

      {/* View All Projects Button Section */}
      <section className="bg-white py-20 mobile-projects-button-section">
        <div className="w-full">
          <div className="text-center mobile-projects-button-container">
            <Link
              href="/projects"
              className="inline-block bg-white text-black border-2 border-black px-16 py-5 font-black uppercase tracking-wider text-2xl md:text-3xl lg:text-4xl hover:bg-black hover:text-white transition-colors duration-500 mobile-projects-button"
            >
              {t('home.projects.button')}
            </Link>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section className="px-4 sm:px-6 lg:px-8 bg-black h-screen flex items-center mobile-contact-section mobile-no-overflow">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <p className="text-xl md:text-2xl lg:text-3xl text-white font-bold max-w-4xl mx-auto leading-relaxed uppercase tracking-wide mobile-contact-text">
              {t('contacts.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 mobile-contact-grid">
            {/* Contact Information */}
            <div className="space-y-16 h-full flex flex-col justify-center">
              <div className="space-y-12">
                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-wide mobile-contact-heading">{t('contacts.phone')}</h3>
                  <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold uppercase tracking-wide mobile-contact-text">+7 996 100 3484</p>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-wide mobile-contact-heading">{t('contacts.email')}</h3>
                  <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold uppercase tracking-wide mobile-contact-text">main@artdavletov.ru</p>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-wide mobile-contact-heading">{t('contacts.address')}</h3>
                  <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold uppercase tracking-wide leading-relaxed mobile-contact-text">
                    {t('contacts.address.line1')}<br />
                    {t('contacts.address.line2')}
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-wide mobile-contact-heading">{t('contacts.hours')}</h3>
                  <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold uppercase tracking-wide leading-relaxed mobile-contact-text">
                    {t('contacts.hours.weekdays')}<br />
                    {t('contacts.hours.weekends')}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="h-full flex items-center mobile-form-container">
              <form onSubmit={handleSubmit} className="space-y-8 w-full">
                <div>
                  <label htmlFor="name" className="block text-lg md:text-xl font-black text-white mb-4 uppercase tracking-wide mobile-form-label">
                    {t('contacts.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-white bg-transparent text-white placeholder-gray-300 focus:border-gray-300 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide mobile-form-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg md:text-xl font-black text-white mb-4 uppercase tracking-wide mobile-form-label">
                    {t('contacts.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-white bg-transparent text-white placeholder-gray-300 focus:border-gray-300 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide mobile-form-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-lg md:text-xl font-black text-white mb-4 uppercase tracking-wide mobile-form-label">
                    {t('contacts.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 border-white bg-transparent text-white placeholder-gray-300 focus:border-gray-300 focus:outline-none transition-colors duration-300 text-lg font-bold uppercase tracking-wide mobile-form-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-lg md:text-xl font-black text-white mb-4 uppercase tracking-wide mobile-form-label">
                    {t('contacts.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-white bg-transparent text-white placeholder-gray-300 focus:border-gray-300 focus:outline-none transition-colors duration-300 resize-vertical text-lg font-bold uppercase tracking-wide mobile-form-input"
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-100 border-2 border-green-500">
                    <p className="text-green-700 font-black uppercase tracking-wide">
                      {t('contacts.form.success')}
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-100 border-2 border-red-500">
                    <p className="text-red-700 font-black uppercase tracking-wide">
                      {t('contacts.form.error')}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black px-8 py-4 font-black uppercase tracking-wider text-xl hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mobile-form-button"
                >
                  {isSubmitting ? t('contacts.form.sending') : t('contacts.form.submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
