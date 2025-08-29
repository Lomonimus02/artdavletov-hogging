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
      return [];
    }
    const data = fs.readFileSync(STATIC_PROJECTS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading static projects:', error);
    return [];
  }
};

// Проверка авторизации админа
const checkAdminAuth = (request: NextRequest): boolean => {
  const adminSession = request.headers.get('x-admin-session');
  return adminSession === 'true';
};

// GET - получить все статические проекты
export async function GET(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projects = readStaticProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in GET /api/admin/static-projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
