'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';

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

  // Function to translate project titles
  const translateProjectTitle = (title: string): string => {
    // Create a key from the title - keep all characters but normalize
    const titleKey = title.toLowerCase()
      .replace(/[.,]/g, '')
      .replace(/\s+/g, '-')
      .replace('ё', 'е');
    const translationKey = `project.title.${titleKey}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : title;
  };

  // Function to translate city names
  const translateCity = (city: string): string => {
    const cityKey = city.toLowerCase().replace(/\s+/g, '-').replace('ё', 'е');
    const translationKey = `city.${cityKey}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : city;
  };
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-lg font-black text-gray-500 uppercase tracking-wider">
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
      <div className="py-8">
        {/* Project Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black uppercase tracking-wider mb-6">
            {translateProjectTitle(project.title)}
          </h1>

          {/* Mobile: 2 columns x 3 rows, Desktop: 6 columns in one row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-4 text-sm font-medium uppercase tracking-wide">
            <div>
              <span className="text-gray-500 block mb-1 font-medium">{t('project.detail.category')}</span>
              <span className="text-black font-medium">{project.category}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1 font-medium">{t('project.detail.type')}</span>
              <span className="text-black font-medium">{project.type}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1 font-medium">{t('project.detail.location')}</span>
              <span className="text-black font-medium">{translateCity(project.city)}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1 font-medium">{t('project.detail.area')}</span>
              <span className="text-black font-medium">{project.area}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1 font-medium">{t('project.detail.year')}</span>
              <span className="text-black font-medium">{project.year}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1 font-medium">{t('project.detail.section')}</span>
              <span className="text-black font-medium">
                {project.section === 'architecture' && t('nav.tooltip.architecture')}
                {project.section === 'interior' && t('nav.tooltip.interior')}
                {project.section === 'urbanism' && t('nav.tooltip.urbanism')}
              </span>
            </div>
          </div>
        </div>

        {/* Image Gallery - Full Width */}
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-12">
          <ImageGallery
            images={project.gallery && project.gallery.length > 0 ? project.gallery : [project.image]}
            projectTitle={translateProjectTitle(project.title)}
          />
        </div>

        {/* Project Description and Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Description */}
          {project.description && (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-black uppercase tracking-wider mb-4">
                {t('project.description.title')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {project.description}
              </p>
            </div>
          )}



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
    </div>
  );
}
