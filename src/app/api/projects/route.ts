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

// Статические проекты (оригинальные - 16 проектов)
export const getStaticProjects = (): Project[] => [
  {
    id: 1,
    title: 'ЧАСТНЫЙ ДОМ В ЖУКОВКЕ, МО',
    category: 'Частный дом',
    type: 'Эскизный проект',
    city: 'Московская область',
    area: '850 м²',
    year: '2024',
    image: '/images/project-1.JPG',
    description: '',
    section: 'architecture',
    gallery: [
      "/images/project-1.JPG",
      "/images/project-1-2.JPG",
      "/images/project-1-3.JPG",
      "/images/project-1-4.JPG",
      "/images/project-1-5.JPG",
      "/images/project-1-6.JPG"
    ]
  },
  {
    id: 2,
    title: 'ЖИЛОЙ КОМПЛЕКС В ЦЕНТРЕ МОСКВЫ',
    category: 'Жилой комплекс',
    type: 'Архитектурный проект',
    city: 'Москва',
    area: '12,000 м²',
    year: '2023',
    image: '/images/project-2.JPG',
    description: '',
    section: 'architecture',
    gallery: [
      "/images/project-2.JPG"
    ]
  },
  {
    id: 3,
    title: 'МИЧУРИНСКИЙ ПР., МОСКВА',
    category: 'апартаменты',
    type: 'Дизайн-проект',
    city: 'Москва',
    area: '250 м²',
    year: '2023',
    image: '/images/project-3.jpeg',
    description: '',
    section: 'interior',
    gallery: [
      "/images/project-3.jpeg",
      "/images/project-3-2.jpeg",
      "/images/project-3-3.jpeg",
      "/images/project-3-4.jpeg",
      "/images/project-3-5.jpeg",
      "/images/project-3-6.jpeg",
      "/images/project-3-7.jpeg",
      "/images/project-3-8.jpeg"
    ]
  },
  {
    id: 4,
    title: 'CALM ОБОЛЕНСКИЙ ПЕРЕУЛОК, МОСКВА',
    category: 'апартаменты',
    type: 'Дизайн-проект',
    city: 'Москва',
    area: '185 м²',
    year: '2022',
    image: '/images/project-4.png',
    description: '',
    section: 'interior',
    gallery: [
      "/images/project-4.png",
      "/images/project-4-2.png",
      "/images/project-4-3.png",
      "/images/project-4-4.png",
      "/images/project-4-5.png",
      "/images/project-4-6.png",
      "/images/project-4-7.png"
    ]
  },
  {
    id: 5,
    title: 'TAU HOUSE УФА',
    category: 'Частный дом',
    type: 'Дизайн-проект',
    city: 'Уфа',
    area: '650 м²',
    year: '2024',
    image: '/images/project-5.jpeg',
    description: '',
    section: 'interior',
    gallery: [
      "/images/project-5.jpeg",
      "/images/project-5-2.jpeg",
      "/images/project-5-3.jpeg",
      "/images/project-5-4.jpeg",
      "/images/project-5-5.jpeg",
      "/images/project-5-6.jpeg",
      "/images/project-5-7.jpeg",
      "/images/project-5-8.jpeg",
      "/images/project-5-9.jpeg",
      "/images/project-5-10.jpeg"
    ]
  },
  {
    id: 6,
    title: 'САНКТ-ПЕТЕРБУРГ ЗАГРЕБСКИЙ БУЛЬВАР',
    category: 'апартаменты',
    type: 'Дизайн-проект',
    city: 'Санкт-Петербург',
    area: '45,000 м²',
    year: '2022',
    image: '/images/project-6.PNG',
    description: '',
    section: 'interior',
    gallery: [
      "/images/project-6.PNG",
      "/images/project-6-2.jpg",
      "/images/project-6-3.jpg",
      "/images/project-6-4.jpg",
      "/images/project-6-5.jpg",
      "/images/project-6-6.jpg",
      "/images/project-6-7.jpg",
      "/images/project-6-8.jpg",
      "/images/project-6-9.jpg",
      "/images/project-6-10.jpg",
      "/images/project-6-11.jpg"
    ]
  },
  {
    id: 7,
    title: 'ЗАГОРОДНЫЙ ДОМ В ПОДМОСКОВЬЕ',
    category: 'Частный дом',
    type: 'Дизайн-проект',
    city: 'Московская область',
    area: '300 м²',
    year: '2022',
    image: '/images/project-7.jpg',
    description: '',
    section: 'interior',
    gallery: [
      "/images/project-7.jpg"
    ]
  },
  {
    id: 8,
    title: 'ЩИПКОВСКИЙ ПЕР. МОСКВА',
    category: 'Частный дом',
    type: 'Дизайн-проект',
    city: 'Москва',
    area: '720 м²',
    year: '2024',
    image: '/images/project-8.jpg',
    description: '',
    section: 'interior',
    gallery: [
      "/images/project-8.jpg",
      "/images/project-8-2.jpg",
      "/images/project-8-3.jpg",
      "/images/project-8-4.jpg",
      "/images/project-8-5.jpg",
      "/images/project-8-6.jpg",
      "/images/project-8-7.jpg",
      "/images/project-8-8.jpg",
      "/images/project-8-9.jpg"
    ]
  },
  {
    id: 9,
    title: 'КОММЕРЧЕСКИЙ ЦЕНТР В САНКТ-ПЕТЕРБУРГЕ',
    category: 'Коммерческая недвижимость',
    type: 'Дизайн-проект',
    city: 'Санкт-Петербург',
    area: '1,200 м²',
    year: '2023',
    image: '/images/project-9.jpg',
    description: '',
    section: 'interior',
    gallery: [
      "/images/project-9.jpg"
    ]
  },
  {
    id: 10,
    title: 'АПАРТАМЕНТЫ НА ШМИДТОВСКОМ ПРОЕЗДЕ, МОСКВА',
    category: 'апартаменты',
    type: 'Дизайн-проект',
    city: 'Москва',
    area: '2,500 м²',
    year: '2023',
    image: '/images/project-10.jpeg',
    description: '',
    section: 'interior',
    gallery: [
      "/images/project-10.jpeg",
      "/images/project-10-2.jpeg",
      "/images/project-10-3.jpeg"
    ]
  },
  {
    id: 11,
    title: 'ЧАСТНЫЙ ДОМ В ТВЕРИ В СОВРЕМЕННОМ РУССКОМ СТИЛЕ',
    category: 'частный дом',
    type: 'дизайн проект',
    city: 'Тверь',
    area: '32,000 м²',
    year: '2024',
    image: '/images/project-11.jpg',
    description: '',
    section: 'architecture',
    gallery: [
      "/images/project-11.jpg",
      "/images/project-11-2.jpg",
      "/images/project-11-3.jpg",
      "/images/project-11-4.jpg",
      "/images/project-11-5.jpg",
      "/images/project-11-6.jpg",
      "/images/project-11-7.jpg",
      "/images/project-11-8.jpg",
      "/images/project-11-9.jpg",
      "/images/project-11-10.jpg"
    ]
  },
  {
    id: 12,
    title: 'СТУДИЯ В ИСТОРИЧЕСКОМ ЦЕНТРЕ',
    category: 'Студия',
    type: 'Дизайн-проект',
    city: 'Москва',
    area: '150 м²',
    year: '2023',
    image: '/images/project-12.jpg',
    description: '',
    section: 'interior',
    gallery: [
      "/images/project-12.jpg"
    ]
  },
  {
    id: 13,
    title: 'поселок в Блоне, Польша',
    category: 'Частный дом',
    type: 'Дизайн-проект',
    city: 'Польша',
    area: '650 м²',
    year: '2024',
    image: '/images/KOZYN_1712609051430.jpeg',
    description: '',
    section: 'urbanism',
    gallery: [
      "/images/KOZYN_1712609051430.jpeg",
      "/images/KOZYN_1712609051430-2.jpg",
      "/images/KOZYN_1712609051430-3.jpg",
      "/images/KOZYN_1712609051430-4.jpg",
      "/images/KOZYN_1712609051430-5.jpeg",
      "/images/KOZYN_1712609051430-6.jpeg",
      "/images/KOZYN_1712609051430-7.jpeg",
      "/images/KOZYN_1712609051430-8.jpeg",
      "/images/KOZYN_1712609051430-9.jpg",
      "/images/KOZYN_1712609051430-10.jpeg"
    ]
  },
  {
    id: 14,
    title: 'Филевский парк, Москва',
    category: 'апартаменты',
    type: 'Дизайн-проект',
    city: 'Москва',
    area: '150 м²',
    year: '2024',
    image: '/images/PRIME_66_1720719145868.jpeg',
    description: '',
    section: 'interior',
    gallery: [
      "/images/PRIME_66_1720719145868.jpeg",
      "/images/PRIME_66_1720719145868-2.jpg",
      "/images/PRIME_66_1720719145868-3.jpg",
      "/images/PRIME_66_1720719145868-4.jpg",
      "/images/PRIME_66_1720719145868-5.jpeg",
      "/images/PRIME_66_1720719145868-6.jpeg",
      "/images/PRIME_66_1720719145868-7.jpeg",
      "/images/PRIME_66_1720719145868-8.jpeg",
      "/images/PRIME_66_1720719145868-9.jpeg",
      "/images/PRIME_66_1720719145868-10.jpeg",
      "/images/PRIME_66_1720719145868-11.jpeg",
      "/images/PRIME_66_1720719145868-12.jpeg",
      "/images/PRIME_66_1720719145868-13.jpeg",
      "/images/PRIME_66_1720719145868-14.jpeg",
      "/images/PRIME_66_1720719145868-15.jpeg"
    ]
  },
  {
    id: 15,
    title: 'Жилой дом в Корноухово, Татарстан',
    category: 'Частный дом',
    type: 'Дизайн-проект',
    city: 'Татарстан',
    area: '450 м²',
    year: '2023',
    image: '/images/RETREAT 2_1712608916703.jpeg',
    description: '',
    section: 'architecture',
    gallery: [
      "/images/RETREAT 2_1712608916703.jpeg",
      "/images/RETREAT 2_1712608916703-2.jpg",
      "/images/RETREAT 2_1712608916703-3.jpg",
      "/images/RETREAT 2_1712608916703-4.jpg",
      "/images/RETREAT 2_1712608916703-5.jpg",
      "/images/RETREAT 2_1712608916703-6.jpg",
      "/images/RETREAT 2_1712608916703-7.jpeg",
      "/images/RETREAT 2_1712608916703-8.jpg"
    ]
  },
  {
    id: 16,
    title: 'Жилой дом в Подушкино, МО',
    category: 'Частный дом',
    type: 'Дизайн-проект',
    city: 'Московская область',
    area: '380 м²',
    year: '2023',
    image: '/images/RETREAT 5_1712158424199.jpeg',
    description: '',
    section: 'architecture',
    gallery: [
      "/images/RETREAT 5_1712158424199.jpeg",
      "/images/RETREAT 5_1712158424199-2.jpg",
      "/images/RETREAT 5_1712158424199-3.jpg",
      "/images/RETREAT 5_1712158424199-4.jpg",
      "/images/RETREAT 5_1712158424199-5.jpeg",
      "/images/RETREAT 5_1712158424199-6.jpeg",
      "/images/RETREAT 5_1712158424199-7.jpeg",
      "/images/RETREAT 5_1712158424199-8.jpg",
      "/images/RETREAT 5_1712158424199-9.jpg"
    ]
  },
  {
    id: 17,
    title: 'частный дом в Новоалександровке',
    category: 'Частный дом',
    type: 'Дизайн-проект',
    city: 'Новоалександровка',
    area: '720 м²',
    year: '2024',
    image: '/images/S-HOUSE_1720272109027 (2).jpeg',
    description: '',
    section: 'architecture',
    gallery: [
      "/images/S-HOUSE_1720272109027 (2).jpeg",
      "/images/S-HOUSE_1720272109027 (2)-2.jpg",
      "/images/S-HOUSE_1720272109027 (2)-3.jpg",
      "/images/S-HOUSE_1720272109027 (2)-4.jpeg",
      "/images/S-HOUSE_1720272109027 (2)-5.png",
      "/images/S-HOUSE_1720272109027 (2)-6.jpeg",
      "/images/S-HOUSE_1720272109027 (2)-7.jpeg",
      "/images/S-HOUSE_1720272109027 (2)-8.jpeg",
      "/images/S-HOUSE_1720272109027 (2)-9.jpeg",
      "/images/S-HOUSE_1720272109027 (2)-10.jpeg"
    ]
  },
  {
    id: 18,
    title: 'частный дом в Булгаково, Уфа',
    category: 'Частный дом',
    type: 'Дизайн-проект',
    city: 'Уфа',
    area: '580 м²',
    year: '2024',
    image: '/images/4b4e6b200381579.66616a1110827.jpg',
    description: '',
    section: 'architecture',
    gallery: [
      "/images/4b4e6b200381579.66616a1110827.jpg",
      "/images/4b4e6b200381579.66616a1110827-2.jpg",
      "/images/4b4e6b200381579.66616a1110827-3.jpeg",
      "/images/4b4e6b200381579.66616a1110827-4.jpeg",
      "/images/4b4e6b200381579.66616a1110827-5.png",
      "/images/4b4e6b200381579.66616a1110827-6.jpg",
      "/images/4b4e6b200381579.66616a1110827-7.jpg",
      "/images/4b4e6b200381579.66616a1110827-8.jpg"
    ]
  }
];

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

// GET - получить все проекты (публичный API)
export async function GET(request: NextRequest) {
  try {
    // Получаем все статические проекты
    const staticProjects = getStaticProjects();

    const adminProjects = readAdminProjects();

    // Объединяем статические проекты с админскими
    // Админские проекты получают ID начиная с 1000, чтобы не конфликтовать со статическими
    const adjustedAdminProjects = adminProjects.map(project => ({
      ...project,
      id: project.id + 1000
    }));

    const allProjects = [...staticProjects, ...adjustedAdminProjects];

    return NextResponse.json(allProjects);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
