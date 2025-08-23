'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  category: string;
  type: string;
  city: string;
  area: string;
  year: string;
  image: string;
  description: string;
  section: string;
  gallery: string[];
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const projectId = parseInt(params.id);

  useEffect(() => {
    const loadProject = async () => {
      if (isNaN(projectId)) {
        setError('Invalid project ID');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (response.ok) {
          const projectData = await response.json();
          setProject(projectData);
        } else if (response.status === 404) {
          setError('Project not found');
        } else {
          setError('Failed to load project');
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // Set page identifier for mobile menu styling
  useEffect(() => {
    document.body.setAttribute('data-page', 'project-detail');
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  const handleBackToProjects = () => {
    router.push(`/projects?scrollTo=${projectId}`);
  };

  const nextImage = () => {
    if (project && project.gallery.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === project.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project && project.gallery.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.gallery.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-lg font-black text-gray-500 uppercase tracking-wider">
              Загрузка проекта...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-black text-black uppercase tracking-wider mb-8">
              {t('project.not-found')}
            </h1>
            <button
              onClick={handleBackToProjects}
              className="bg-black text-white px-8 py-3 font-black uppercase tracking-wider text-lg hover:bg-gray-800 transition-colors duration-300"
            >
              {t('project.back-to-projects')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Back Button */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBackToProjects}
            className="text-black hover:text-gray-600 font-black uppercase tracking-wider text-sm transition-colors duration-300"
          >
            {t('project.back-to-projects')}
          </button>
        </div>
      </div>

      {/* Project Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black uppercase tracking-wider mb-6">
            {project.title}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm font-black uppercase tracking-wider">
            <div>
              <span className="text-gray-500 block mb-1">Категория</span>
              <span className="text-black">{project.category}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Тип</span>
              <span className="text-black">{project.type}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Город</span>
              <span className="text-black">{project.city}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Площадь</span>
              <span className="text-black">{project.area}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-12">
          {project.gallery && project.gallery.length > 0 ? (
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden mb-4">
                <img
                  src={project.gallery[currentImageIndex]}
                  alt={`${project.title} - ${t('project.image-alt')} ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                {project.gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 hover:bg-opacity-75 transition-all duration-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 hover:bg-opacity-75 transition-all duration-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {project.gallery.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {project.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square bg-gray-100 overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'border-black' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${project.title} - thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Project Description */}
        {project.description && (
          <div className="mb-12">
            <h2 className="text-2xl font-black text-black uppercase tracking-wider mb-4">
              Описание проекта
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {project.description}
            </p>
          </div>
        )}

        {/* Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-black text-black uppercase tracking-wider mb-4">
              Детали проекта
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-black text-gray-500 uppercase tracking-wider text-sm">Год:</span>
                <span className="font-black text-black">{project.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-black text-gray-500 uppercase tracking-wider text-sm">Раздел:</span>
                <span className="font-black text-black">
                  {project.section === 'architecture' && 'Архитектура'}
                  {project.section === 'interior' && 'Интерьерный дизайн'}
                  {project.section === 'urbanism' && 'Благоустройство'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Projects Button */}
        <div className="text-center">
          <button
            onClick={handleBackToProjects}
            className="bg-black text-white px-8 py-3 font-black uppercase tracking-wider text-lg hover:bg-gray-800 transition-colors duration-300"
          >
            {t('project.back-to-projects')}
          </button>
        </div>
      </div>
    </div>
  );
}
