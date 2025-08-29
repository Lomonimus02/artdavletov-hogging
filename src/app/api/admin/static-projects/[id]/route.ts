import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

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

// Путь к файлу со статическими проектами
const STATIC_PROJECTS_FILE_PATH = path.join(process.cwd(), 'data', 'static-projects.json');

// Функция для чтения статических проектов из файла
const readStaticProjects = (): Project[] => {
  try {
    if (!fs.existsSync(STATIC_PROJECTS_FILE_PATH)) {
      // Если файл не существует, создаем его с данными из API
      const staticProjects = getDefaultStaticProjects();
      writeStaticProjects(staticProjects);
      return staticProjects;
    }
    const data = fs.readFileSync(STATIC_PROJECTS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading static projects:', error);
    return getDefaultStaticProjects();
  }
};

// Функция для записи статических проектов в файл
const writeStaticProjects = (projects: Project[]): void => {
  try {
    const dataDir = path.dirname(STATIC_PROJECTS_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(STATIC_PROJECTS_FILE_PATH, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error writing static projects:', error);
    throw error;
  }
};

// Получить статические проекты по умолчанию
const getDefaultStaticProjects = (): Project[] => {
  // Возвращаем пустой массив - проекты будут загружены из основного API при необходимости
  return [];
};

// Проверка авторизации админа
const checkAdminAuth = (request: NextRequest): boolean => {
  const adminSession = request.headers.get('x-admin-session');
  return adminSession === 'true';
};

// GET - получить статический проект по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projectId = parseInt(params.id);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    // Сначала ищем в измененных статических проектах
    const modifiedProjects = readStaticProjects();
    const modifiedProject = modifiedProjects.find(p => p.id === projectId);

    if (modifiedProject) {
      return NextResponse.json(modifiedProject);
    }

    // Если не найден в измененных, ищем в оригинальных статических проектах
    const { getStaticProjects } = await import('../../../projects/route');
    const originalProjects = getStaticProjects();
    const originalProject = originalProjects.find((p: Project) => p.id === projectId);

    if (originalProject) {
      return NextResponse.json(originalProject);
    }

    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in GET /api/admin/static-projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - обновить статический проект
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projectId = parseInt(params.id);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, category, type, city, area, year, image, section, gallery } = body;

    // Валидация данных
    if (!title || !category || !type || !city || !year || !image || !section) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let projects = readStaticProjects();
    let projectIndex = projects.findIndex(p => p.id === projectId);

    // Убеждаемся, что главное изображение включено в галерею
    let finalGallery = gallery || [];
    if (!finalGallery.includes(image)) {
      finalGallery = [image, ...finalGallery];
    }

    const updatedProject: Project = {
      id: projectId,
      title,
      category,
      type,
      city,
      area: area || '',
      year,
      image,
      description: '',
      section,
      gallery: finalGallery
    };

    if (projectIndex === -1) {
      // Проект не найден в измененных статических проектах, добавляем его
      projects.push(updatedProject);
    } else {
      // Обновляем существующий проект
      projects[projectIndex] = updatedProject;
    }

    writeStaticProjects(projects);

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error in PUT /api/admin/static-projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - удалить статический проект
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projectId = parseInt(params.id);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    // Читаем список удаленных проектов
    const deletedProjectsPath = path.join(process.cwd(), 'data', 'deleted-projects.json');
    let deletedProjects: number[] = [];

    try {
      if (fs.existsSync(deletedProjectsPath)) {
        const data = fs.readFileSync(deletedProjectsPath, 'utf8');
        deletedProjects = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading deleted projects:', error);
      deletedProjects = [];
    }

    // Добавляем проект в список удаленных, если его там еще нет
    if (!deletedProjects.includes(projectId)) {
      deletedProjects.push(projectId);

      // Сохраняем обновленный список удаленных проектов
      try {
        const dataDir = path.dirname(deletedProjectsPath);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(deletedProjectsPath, JSON.stringify(deletedProjects, null, 2));
      } catch (error) {
        console.error('Error writing deleted projects:', error);
        throw error;
      }
    }

    // Также удаляем из измененных статических проектов, если он там есть
    const modifiedProjects = readStaticProjects();
    const modifiedProjectIndex = modifiedProjects.findIndex(p => p.id === projectId);

    if (modifiedProjectIndex !== -1) {
      modifiedProjects.splice(modifiedProjectIndex, 1);
      writeStaticProjects(modifiedProjects);
    }

    return NextResponse.json({
      message: 'Project deleted successfully',
      projectId: projectId
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/static-projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
