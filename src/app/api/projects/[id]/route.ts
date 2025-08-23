import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getStaticProjects } from '../route';

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



// Функция для чтения админских проектов
const readAdminProjects = (): Project[] => {
  try {
    const adminProjectsPath = path.join(process.cwd(), 'data', 'admin-projects.json');
    if (fs.existsSync(adminProjectsPath)) {
      const data = fs.readFileSync(adminProjectsPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading admin projects:', error);
    return [];
  }
};



// GET - получить проект по ID (публичный API)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    // Получаем все проекты напрямую
    try {
      const staticProjects = getStaticProjects();
      const adminProjects = readAdminProjects();

      // Объединяем статические проекты с админскими
      const adjustedAdminProjects = adminProjects.map(project => ({
        ...project,
        id: project.id + 1000
      }));

      const allProjects = [...staticProjects, ...adjustedAdminProjects];
      const project = allProjects.find(p => p.id === projectId);

      if (project) {
        return NextResponse.json(project);
      }

    } catch (fetchError) {
      console.error('Error getting projects:', fetchError);
    }

    // Fallback: если не найден в основном API, ищем в админских проектах
    if (projectId > 1000) {
      const adminProjects = readAdminProjects();
      const adminProject = adminProjects.find(p => p.id === (projectId - 1000));
      if (adminProject) {
        return NextResponse.json({
          ...adminProject,
          id: projectId
        });
      }
    }

    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in GET /api/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
