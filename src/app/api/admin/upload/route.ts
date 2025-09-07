import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Проверка авторизации админа
const checkAdminAuth = (request: NextRequest): boolean => {
  const adminSession = request.headers.get('x-admin-session');
  return adminSession === 'true';
};

export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    if (!checkAdminAuth(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Проверяем размер файла (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Создаем уникальное имя файла
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;

    // Путь для сохранения
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'admin');
    const filePath = path.join(uploadDir, fileName);

    // Создаем директорию если её нет
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Сохраняем файл
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Возвращаем URL изображения
    const imageUrl = `/images/admin/${fileName}`;

    return NextResponse.json({
      imageUrl,
      message: 'Image uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
