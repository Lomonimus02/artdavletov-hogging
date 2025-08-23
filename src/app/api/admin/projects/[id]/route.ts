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

// Путь к файлу с данными проектов
const PROJECTS_FILE_PATH = path.join(process.cwd(), 'data', 'admin-projects.json');

// Функция для чтения проектов из файла
const readProjects = (): Project[] => {
  try {
    if (!fs.existsSync(PROJECTS_FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(PROJECTS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
};

// Функция для записи проектов в файл
const writeProjects = (projects: Project[]): void => {
  try {
    const dataDir = path.dirname(PROJECTS_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(PROJECTS_FILE_PATH, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error writing projects:', error);
    throw error;
  }
};

// Проверка авторизации админа
const checkAdminAuth = (request: NextRequest): boolean => {
  const adminSession = request.headers.get('x-admin-session');
  return adminSession === 'true';
};

// GET - получить проект по ID
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

    const projects = readProjects();
    const project = projects.find(p => p.id === projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error in GET /api/admin/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - обновить проект
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
    const { title, category, type, city, area, year, image, description, section, gallery } = body;

    // Валидация данных
    if (!title || !category || !type || !city || !year || !image || !section) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const projects = readProjects();
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
      description: description || '',
      section,
      gallery: finalGallery
    };

    writeProjects(projects);

    return NextResponse.json(projects[projectIndex]);
  } catch (error) {
    console.error('Error in PUT /api/admin/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - удалить проект
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

    const projects = readProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Удаляем проект
    const deletedProject = projects.splice(projectIndex, 1)[0];
    writeProjects(projects);

    return NextResponse.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    console.error('Error in DELETE /api/admin/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
