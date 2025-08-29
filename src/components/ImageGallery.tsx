'use client';

import { useState, useEffect } from 'react';

interface ImageGalleryProps {
  images: string[];
  projectTitle: string;
}

export default function ImageGallery({ images, projectTitle }: ImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Touch handling for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Закрытие модального окна по ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      } else if (event.key === 'ArrowLeft') {
        prevImage();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Плавное исчезновение, затем смена изображения и появление
    setTimeout(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
      setTimeout(() => setIsTransitioning(false), 250);
    }, 250);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Плавное исчезновение, затем смена изображения и появление
    setTimeout(() => {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
      setTimeout(() => setIsTransitioning(false), 250);
    }, 250);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Grid Gallery */}
      <div className="w-full">
        {/* Mobile: 1 column, Desktop: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => openModal(index)}
              className="aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
            >
              <img
                src={image}
                alt={`${projectTitle} - изображение ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-300 z-[10000] p-2"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Container */}
          <div
            className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[currentImageIndex]}
              alt={`${projectTitle} - изображение ${currentImageIndex + 1}`}
              className={`max-w-full max-h-full object-contain transition-all duration-500 ease-out ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-3 hover:bg-opacity-75 transition-all duration-300 rounded-full"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-3 hover:bg-opacity-75 transition-all duration-300 rounded-full"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 md:px-4 md:py-2 rounded-full">
              <span className="font-black uppercase tracking-wider text-xs md:text-sm">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          </div>


        </div>
      )}
    </>
  );
}
