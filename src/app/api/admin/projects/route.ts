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

// Путь к файлу с данными проектов
const PROJECTS_FILE_PATH = path.join(process.cwd(), 'data', 'admin-projects.json');

// Функция для чтения проектов из файла
const readProjects = (): Project[] => {
  try {
    // Создаем директорию data если её нет
    const dataDir = path.dirname(PROJECTS_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Если файл не существует, создаем его с пустым массивом
    if (!fs.existsSync(PROJECTS_FILE_PATH)) {
      const initialProjects: Project[] = [];
      fs.writeFileSync(PROJECTS_FILE_PATH, JSON.stringify(initialProjects, null, 2));
      return initialProjects;
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

// GET - получить все проекты
export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projects = readProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in GET /api/admin/projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - создать новый проект
export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
    
    // Генерируем новый ID
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    
    // Убеждаемся, что главное изображение включено в галерею
    let finalGallery = gallery || [];
    if (!finalGallery.includes(image)) {
      finalGallery = [image, ...finalGallery];
    }

    const newProject: Project = {
      id: newId,
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

    projects.push(newProject);
    writeProjects(projects);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
