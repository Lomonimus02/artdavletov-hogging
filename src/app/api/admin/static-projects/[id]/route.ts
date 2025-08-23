import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

    const projects = readStaticProjects();
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
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

    const projects = readStaticProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Убеждаемся, что главное изображение включено в галерею
    let finalGallery = gallery || [];
    if (!finalGallery.includes(image)) {
      finalGallery = [image, ...finalGallery];
    }

    // Обновляем проект
    projects[projectIndex] = {
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

    writeStaticProjects(projects);

    return NextResponse.json(projects[projectIndex]);
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

    const projects = readStaticProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Удаляем проект
    const deletedProject = projects.splice(projectIndex, 1)[0];
    writeStaticProjects(projects);

    return NextResponse.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    console.error('Error in DELETE /api/admin/static-projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
