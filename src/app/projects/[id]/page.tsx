'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function ProjectDetail() {
  const { t } = useLanguage();
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.id as string;

  // Modal state for image gallery
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
      gallery: [
        "/images/project-1.JPG",
        "/images/project-2.JPG",
        "/images/project-1-2.JPG",
        "/images/project-1-3.JPG",
        "/images/project-1-4.JPG",
        "/images/project-1-5.JPG",
        "/images/project-1-6.JPG"
      ]
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
      gallery: [
        "/images/project-2.JPG",
        "/images/project-2.JPG",
        "/images/project-2.JPG",
        "/images/project-2.JPG"
      ]
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
      gallery: [
        "/images/project-3.jpeg",
        "/images/project-3-2.jpeg",
        "/images/project-3-3.jpeg",
        "/images/project-3-4.jpeg",
        "/images/project-3-5.jpeg",
        "/images/project-3-6.jpeg",
        "/images/project-3-7.jpeg",
        "/images/project-3-8.jpeg"
      ]
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
      gallery: [
        "/images/project-4.png",
        "/images/project-4-2.png",
        "/images/project-4-3.png",
        "/images/project-4-4.png",
        "/images/project-4-5.png",
        "/images/project-4-6.png",
        "/images/project-4-7.png"
      ]
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
      gallery: [
        "/images/project-5.jpeg",
        "/images/project-5-2.jpeg",
        "/images/project-5-3.jpeg",
        "/images/project-5-4.jpeg",
        "/images/project-5-5.jpeg",
        "/images/project-5-6.jpeg",
        "/images/project-5-7.jpeg",
        "/images/project-5-8.jpeg",
        "/images/project-5-9.jpeg",
        "/images/project-5-10.jpeg"
      ]
    },
    {
      id: 6,
      title: t('project.6.title'),
      type: t('project.6.type'),
      category: t('project.6.category'),
      area: "500 м²",
      year: "2023",
      city: t('project.6.city'),
      image: "/images/project-6.PNG",
      gallery: [
        "/images/project-6.PNG",
        "/images/project-7.jpg",
        "/images/project-6-2.jpg",
        "/images/project-6-3.jpg",
        "/images/project-6-4.jpg",
        "/images/project-6-5.jpg",
        "/images/project-6-6.jpg",
        "/images/project-6-7.jpg",
        "/images/project-6-8.jpg",
        "/images/project-6-9.jpg",
        "/images/project-6-10.jpg",
        "/images/project-6-11.jpg"
      ]
    },
    {
      id: 7,
      title: t('project.7.title'),
      type: t('project.7.type'),
      category: t('project.7.category'),
      area: "300 м²",
      year: "2022",
      city: t('project.7.city'),
      image: "/images/project-7.jpg",
      gallery: [
        "/images/project-7.jpg",
        "/images/project-7.jpg",
        "/images/project-7.jpg",
        "/images/project-7.jpg"
      ]
    },
    {
      id: 8,
      title: t('project.8.title'),
      type: t('project.8.type'),
      category: t('project.8.category'),
      area: "720 м²",
      year: "2024",
      city: t('project.8.city'),
      image: "/images/project-8.jpg",
      gallery: [
        "/images/project-8.jpg",
        "/images/project-9.jpg",
        "/images/project-8-2.jpg",
        "/images/project-8-3.jpg",
        "/images/project-8-4.jpg",
        "/images/project-8-5.jpg",
        "/images/project-8-6.jpg",
        "/images/project-8-7.jpg",
        "/images/project-8-8.jpg",
        "/images/project-8-9.jpg"
      ]
    },
    {
      id: 9,
      title: t('project.9.title'),
      type: t('project.9.type'),
      category: t('project.9.category'),
      area: "1200 м²",
      year: "2022",
      city: t('project.9.city'),
      image: "/images/project-9.jpg",
      gallery: [
        "/images/project-9.jpg",
        "/images/project-9.jpg",
        "/images/project-9.jpg",
        "/images/project-9.jpg"
      ]
    },
    {
      id: 10,
      title: t('project.10.title'),
      type: t('project.10.type'),
      category: t('project.10.category'),
      area: "600 м²",
      year: "2023",
      city: t('project.10.city'),
      image: "/images/project-10.jpeg",
      gallery: [
        "/images/project-10.jpeg",
        "/images/project-10-2.jpeg",
        "/images/project-10-3.jpeg"
      ]
    },
    {
      id: 11,
      title: t('project.11.title'),
      type: t('project.11.type'),
      category: t('project.11.category'),
      area: "400 м²",
      year: "2022",
      city: t('project.11.city'),
      image: "/images/project-11.jpg",
      gallery: [
        "/images/project-11.jpg",
        "/images/project-12.jpg",
        "/images/project-11-2.jpg",
        "/images/project-11-3.jpg",
        "/images/project-11-4.jpg",
        "/images/project-11-5.jpg",
        "/images/project-11-6.jpg",
        "/images/project-11-7.jpg",
        "/images/project-11-8.jpg",
        "/images/project-11-9.jpg",
        "/images/project-11-10.jpg"
      ]
    },
    {
      id: 12,
      title: t('project.12.title'),
      type: t('project.12.type'),
      category: t('project.12.category'),
      area: "150 м²",
      year: "2023",
      city: t('project.12.city'),
      image: "/images/project-12.jpg",
      gallery: [
        "/images/project-12.jpg",
        "/images/project-12.jpg",
        "/images/project-12.jpg",
        "/images/project-12.jpg"
      ]
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
      gallery: [
        "/images/KOZYN_1712609051430.jpeg",
        "/images/KOZYN_1712609051430-2.jpg",
        "/images/KOZYN_1712609051430-3.jpg",
        "/images/KOZYN_1712609051430-4.jpg",
        "/images/KOZYN_1712609051430-5.jpeg",
        "/images/KOZYN_1712609051430-6.jpeg",
        "/images/KOZYN_1712609051430-7.jpeg",
        "/images/KOZYN_1712609051430-8.jpeg",
        "/images/KOZYN_1712609051430-9.jpg",
        "/images/KOZYN_1712609051430-10.jpeg"
      ]
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
      gallery: [
        "/images/PRIME_66_1720719145868.jpeg",
        "/images/PRIME_66_1720719145868-2.jpg",
        "/images/PRIME_66_1720719145868-3.jpg",
        "/images/PRIME_66_1720719145868-4.jpg",
        "/images/PRIME_66_1720719145868-5.jpeg",
        "/images/PRIME_66_1720719145868-6.jpeg",
        "/images/PRIME_66_1720719145868-7.jpeg",
        "/images/PRIME_66_1720719145868-8.jpeg",
        "/images/PRIME_66_1720719145868-9.jpeg",
        "/images/PRIME_66_1720719145868-10.jpeg",
        "/images/PRIME_66_1720719145868-11.jpeg",
        "/images/PRIME_66_1720719145868-12.jpeg",
        "/images/PRIME_66_1720719145868-13.jpeg",
        "/images/PRIME_66_1720719145868-14.jpeg",
        "/images/PRIME_66_1720719145868-15.jpeg"
      ]
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
      gallery: [
        "/images/RETREAT 2_1712608916703.jpeg",
        "/images/RETREAT 2_1712608916703-2.jpg",
        "/images/RETREAT 2_1712608916703-3.jpg",
        "/images/RETREAT 2_1712608916703-4.jpg",
        "/images/RETREAT 2_1712608916703-5.jpg",
        "/images/RETREAT 2_1712608916703-6.jpg",
        "/images/RETREAT 2_1712608916703-7.jpeg",
        "/images/RETREAT 2_1712608916703-8.jpg"
      ]
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
      gallery: [
        "/images/RETREAT 5_1712158424199.jpeg",
        "/images/RETREAT 5_1712158424199-2.jpg",
        "/images/RETREAT 5_1712158424199-3.jpg",
        "/images/RETREAT 5_1712158424199-4.jpg",
        "/images/RETREAT 5_1712158424199-5.jpeg",
        "/images/RETREAT 5_1712158424199-6.jpeg",
        "/images/RETREAT 5_1712158424199-7.jpeg",
        "/images/RETREAT 5_1712158424199-8.jpg",
        "/images/RETREAT 5_1712158424199-9.jpg"
      ]
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
      gallery: [
        "/images/S-HOUSE_1720272109027 (2).jpeg",
        "/images/S-HOUSE_1720272109027 (2)-2.jpg",
        "/images/S-HOUSE_1720272109027 (2)-3.jpg",
        "/images/S-HOUSE_1720272109027 (2)-4.jpeg",
        "/images/S-HOUSE_1720272109027 (2)-5.png",
        "/images/S-HOUSE_1720272109027 (2)-6.jpeg",
        "/images/S-HOUSE_1720272109027 (2)-7.jpeg",
        "/images/S-HOUSE_1720272109027 (2)-8.jpeg",
        "/images/S-HOUSE_1720272109027 (2)-9.jpeg",
        "/images/S-HOUSE_1720272109027 (2)-10.jpeg"
      ]
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
      gallery: [
        "/images/4b4e6b200381579.66616a1110827.jpg",
        "/images/4b4e6b200381579.66616a1110827-2.jpg",
        "/images/4b4e6b200381579.66616a1110827-3.jpeg",
        "/images/4b4e6b200381579.66616a1110827-4.jpeg",
        "/images/4b4e6b200381579.66616a1110827-5.png",
        "/images/4b4e6b200381579.66616a1110827-6.jpg",
        "/images/4b4e6b200381579.66616a1110827-7.jpg",
        "/images/4b4e6b200381579.66616a1110827-8.jpg"
      ]
    }
  ];

  const projects = getTranslatedProjects();
  const project = projects.find(p => p.id === parseInt(projectId));

  // Build return URL with saved filters
  const buildReturnURL = () => {
    const params = new URLSearchParams();

    // Try to get filters from localStorage (only on client side)
    if (typeof window !== 'undefined') {
      const savedType = localStorage.getItem('projects-filter-type');
      const savedCity = localStorage.getItem('projects-filter-city');

      if (savedType && savedType !== 'undefined' && savedType !== 'null' &&
          savedType !== 'Все' && savedType !== 'All' && savedType !== '全部') {
        params.set('type', savedType);
      }
      if (savedCity && savedCity !== 'undefined' && savedCity !== 'null' &&
          savedCity !== 'Все' && savedCity !== 'All' && savedCity !== '全部') {
        params.set('city', savedCity);
      }
    }

    // Always add scrollTo parameter
    params.set('scrollTo', projectId);

    const returnURL = `/projects?${params.toString()}`;
    console.log(`[RETURN URL] Built return URL for project ${projectId}: ${returnURL}`);

    return returnURL;
  };

  // Modal functions
  const openModal = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  const nextImage = () => {
    if (project?.gallery && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % project.gallery.length);
        setTimeout(() => setIsTransitioning(false), 250);
      }, 400);
    }
  };

  const prevImage = () => {
    if (project?.gallery && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
        setTimeout(() => setIsTransitioning(false), 250);
      }, 400);
    }
  };

  // Touch/swipe functions
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (event.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, nextImage, prevImage, closeModal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('project.not-found')}</h1>
          <Link href={buildReturnURL()} className="text-black hover:text-gray-600 font-bold uppercase tracking-wider">
            {t('project.back-to-projects')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link href={buildReturnURL()} className="inline-block mb-8 text-white hover:text-gray-300 font-bold uppercase tracking-wider transition-colors duration-300">
            {t('project.back-to-projects')}
          </Link>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider mb-6">
            {project.title}
          </h1>
          {/* Desktop version - with bullets */}
          <div className="hidden md:flex flex-wrap gap-8 text-lg font-bold uppercase tracking-wide">
            <span>{project.type}</span>
            <span>•</span>
            <span>{project.category}</span>
            <span>•</span>
            <span>{project.area}</span>
            <span>•</span>
            <span>{project.year}</span>
            <span>•</span>
            <span>{project.city}</span>
          </div>

          {/* Mobile version - right-aligned, no bullets, separate lines */}
          <div className="block md:hidden text-right space-y-2 text-lg font-bold uppercase tracking-wide mobile-project-description">
            <div>{project.type}</div>
            <div>{project.category}</div>
            <div>{project.area}</div>
            <div>{project.year}</div>
            <div>{project.city}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.gallery.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-gray-100 aspect-[4/3] cursor-pointer group"
              onClick={() => openModal(index)}
            >
              <img
                src={image}
                alt={`${project.title} - ${t('project.image-alt')} ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-20">
          <Link
            href={buildReturnURL()}
            className="inline-block bg-white text-black border-2 border-black px-16 py-5 font-black uppercase tracking-wider text-2xl md:text-3xl lg:text-4xl hover:bg-black hover:text-white transition-colors duration-500"
          >
            {t('project.back-to-projects')}
          </Link>
        </div>
      </div>

      {/* Full-screen Image Modal */}
      {isModalOpen && project?.gallery && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeModal}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            backdropFilter: 'blur(2px)'
          }}
        >
          {/* Modal Content */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 md:top-4 right-2 md:right-4 z-60 text-white hover:text-gray-100 bg-black bg-opacity-30 hover:bg-opacity-70 hover:scale-105 hover:rotate-45 rounded-full p-2"
              style={{
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                backdropFilter: 'blur(8px)'
              }}
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-100 bg-black bg-opacity-30 hover:bg-opacity-70 hover:scale-105 rounded-full p-2 md:p-3"
              style={{
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                backdropFilter: 'blur(8px)'
              }}
              aria-label="Previous image"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-100 bg-black bg-opacity-30 hover:bg-opacity-70 hover:scale-105 rounded-full p-2 md:p-3"
              style={{
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                backdropFilter: 'blur(8px)'
              }}
              aria-label="Next image"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Main Image */}
            <div
              className="max-w-full max-h-full flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={project.gallery[currentImageIndex]}
                alt={`${project.title} - изображение ${currentImageIndex + 1}`}
                className={`max-w-full max-h-full object-contain transform ${
                  isTransitioning
                    ? 'opacity-0 scale-99 translate-y-0'
                    : 'opacity-100 scale-100 translate-y-0'
                }`}
                style={{
                  maxHeight: '90vh',
                  maxWidth: '90vw',
                  filter: isTransitioning ? 'blur(0.5px)' : 'blur(0px)',
                  transition: 'all 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              />
            </div>

            {/* Image Counter */}
            <div
              className={`absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 md:px-4 py-1 md:py-2 rounded-full text-sm md:text-base ${
                isTransitioning ? 'opacity-70 scale-99' : 'opacity-100 scale-100'
              }`}
              style={{
                transition: 'all 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {currentImageIndex + 1} / {project.gallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
