'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
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

export default function AdminDashboard() {
  const { isAdmin, logout } = useAdmin();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Проверяем авторизацию
  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  // Загружаем проекты
  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Загружаем все проекты (статические + админские)
        const response = await fetch('/api/projects');
        if (response.ok) {
          const allProjects = await response.json();
          setProjects(allProjects);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      loadProjects();
    }
  }, [isAdmin]);

  // Set page identifier for mobile menu styling
  useEffect(() => {
    document.body.setAttribute('data-page', 'admin');
    return () => {
      document.body.removeAttribute('data-page');
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) {
      return;
    }

    try {
      let response;

      if (projectId >= 1000) {
        // Админский проект
        const realId = projectId - 1000;
        response = await fetch(`/api/admin/projects/${realId}`, {
          method: 'DELETE',
          headers: {
            'x-admin-session': 'true'
          }
        });
      } else {
        // Статический проект
        response = await fetch(`/api/admin/static-projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            'x-admin-session': 'true'
          }
        });
      }

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId));
      } else {
        alert('Ошибка при удалении проекта');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Ошибка при удалении проекта');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-black text-gray-500 uppercase tracking-wider">
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-wider">
              Админ панель
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 font-black uppercase tracking-wider text-sm hover:bg-red-700 transition-colors duration-300"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Add Project Button */}
        <div className="mb-8">
          <Link
            href="/admin/projects/new"
            className="bg-green-600 text-white px-8 py-4 font-black uppercase tracking-wider text-lg hover:bg-green-700 transition-colors duration-300 inline-block"
          >
            Добавить новый проект
          </Link>
        </div>

        {/* Projects List */}
        <div className="bg-white border-2 border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-black text-black uppercase tracking-wider">
              Ваши проекты ({projects.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl font-black text-gray-500 uppercase tracking-wider">
                Загрузка проектов...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-black text-gray-500 uppercase tracking-wider mb-4">
                У вас пока нет проектов
              </p>
              <Link
                href="/admin/projects/new"
                className="bg-green-600 text-white px-6 py-3 font-black uppercase tracking-wider text-sm hover:bg-green-700 transition-colors duration-300"
              >
                Создать первый проект
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div key={project.id} className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Project Image */}
                    <div className="w-full md:w-48 h-48 bg-gray-100 flex-shrink-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Project Info */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-black text-black uppercase tracking-wider mb-2">
                        {project.title}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-black text-gray-600 uppercase">Категория</p>
                          <p className="text-sm font-bold">{project.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-600 uppercase">Тип</p>
                          <p className="text-sm font-bold">{project.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-600 uppercase">Город</p>
                          <p className="text-sm font-bold">{project.city}</p>
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-600 uppercase">Год</p>
                          <p className="text-sm font-bold">{project.year}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{project.description}</p>
                      <div className="mb-4">
                        <p className="text-sm font-black text-gray-600 uppercase mb-2">Раздел</p>
                        <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider ${
                          project.section === 'architecture' ? 'bg-blue-100 text-blue-800' :
                          project.section === 'urbanism' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {project.section === 'architecture' ? 'Архитектура' :
                           project.section === 'urbanism' ? 'Благоустройство' :
                           'Интерьерный дизайн'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-32">
                      {project.id >= 1000 ? (
                        // Админские проекты
                        <>
                          <Link
                            href={`/admin/projects/edit/${project.id - 1000}`}
                            className="bg-blue-600 text-white px-4 py-2 font-black uppercase tracking-wider text-xs hover:bg-blue-700 transition-colors duration-300 text-center"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-red-600 text-white px-4 py-2 font-black uppercase tracking-wider text-xs hover:bg-red-700 transition-colors duration-300"
                          >
                            Удалить
                          </button>
                          <div className="bg-green-100 text-green-800 px-2 py-1 text-xs font-black uppercase text-center">
                            Админский
                          </div>
                        </>
                      ) : (
                        // Статические проекты - теперь тоже можно редактировать и удалять
                        <>
                          <Link
                            href={`/admin/static-projects/edit/${project.id}`}
                            className="bg-blue-600 text-white px-4 py-2 font-black uppercase tracking-wider text-xs hover:bg-blue-700 transition-colors duration-300 text-center"
                          >
                            Редактировать
                          </Link>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-red-600 text-white px-4 py-2 font-black uppercase tracking-wider text-xs hover:bg-red-700 transition-colors duration-300"
                          >
                            Удалить
                          </button>
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-black uppercase text-center">
                            Статический
                          </div>
                        </>
                      )}
                      <Link
                        href={`/projects/${project.id}`}
                        target="_blank"
                        className="bg-gray-600 text-white px-4 py-2 font-black uppercase tracking-wider text-xs hover:bg-gray-700 transition-colors duration-300 text-center"
                      >
                        Просмотр
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-black uppercase tracking-wider mb-6">
            Быстрые действия
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="bg-blue-600 text-white px-6 py-3 font-black uppercase tracking-wider text-sm hover:bg-blue-700 transition-colors duration-300"
            >
              Посмотреть сайт
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
