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

// Функция для чтения измененных статических проектов
const readModifiedStaticProjects = (): Project[] => {
  try {
    const staticProjectsPath = path.join(process.cwd(), 'data', 'static-projects.json');
    if (fs.existsSync(staticProjectsPath)) {
      const data = fs.readFileSync(staticProjectsPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading modified static projects:', error);
    return [];
  }
};

// Функция для чтения списка удаленных проектов
const readDeletedProjects = (): number[] => {
  try {
    const deletedProjectsPath = path.join(process.cwd(), 'data', 'deleted-projects.json');
    if (fs.existsSync(deletedProjectsPath)) {
      const data = fs.readFileSync(deletedProjectsPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading deleted projects:', error);
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
      // Получаем список удаленных проектов
      const deletedProjects = readDeletedProjects();

      // Проверяем, не удален ли запрашиваемый проект
      if (projectId < 1000 && deletedProjects.includes(projectId)) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }

      // Получаем измененные статические проекты из файла, если они есть
      const modifiedStaticProjects = readModifiedStaticProjects();

      // Получаем оригинальные статические проекты
      const originalStaticProjects = getStaticProjects();

      // Создаем Map для быстрого поиска измененных проектов
      const modifiedProjectsMap = new Map(modifiedStaticProjects.map(p => [p.id, p]));

      // Объединяем: если проект был изменен, используем измененную версию, иначе оригинальную
      // Исключаем удаленные проекты
      const finalStaticProjects = originalStaticProjects
        .filter(project => !deletedProjects.includes(project.id))
        .map(originalProject => {
          const modifiedProject = modifiedProjectsMap.get(originalProject.id);
          return modifiedProject || originalProject;
        });

      const adminProjects = readAdminProjects();

      // Объединяем статические проекты с админскими
      const adjustedAdminProjects = adminProjects.map(project => ({
        ...project,
        id: project.id + 1000
      }));

      const allProjects = [...finalStaticProjects, ...adjustedAdminProjects];
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
