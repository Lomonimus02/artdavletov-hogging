import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: 'home' | 'contacts';
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, phone, message, source } = body;

    // Валидация данных
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Обязательные поля: имя, email, сообщение' },
        { status: 400 }
      );
    }

    // Получаем переменные окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram bot token или chat ID не настроены');
      return NextResponse.json(
        { error: 'Сервис временно недоступен' },
        { status: 500 }
      );
    }

    // Формируем сообщение для Telegram
    const sourceText = source === 'home' ? 'Главная страница' : 'Страница контактов';
    const phoneText = phone ? `\nТелефон: ${phone}` : '';

    const telegramMessage = `Новое сообщение с сайта!

Источник: ${sourceText}
Имя: ${name}
Email: ${email}${phoneText}

Сообщение:
${message}

Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

    // Отправляем сообщение в Telegram двум пользователям
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // Список получателей
    const chatIds = [chatId, '378856303'];

    // Отправляем сообщение каждому получателю
    const sendPromises = chatIds.map(async (currentChatId) => {
      try {
        await axios.post(telegramApiUrl, {
          chat_id: currentChatId,
          text: telegramMessage,
          parse_mode: 'HTML'
        });
        console.log(`Сообщение успешно отправлено пользователю ${currentChatId}`);
      } catch (error) {
        console.error(`Ошибка отправки пользователю ${currentChatId}:`, error);
        // Не прерываем выполнение, если одна отправка не удалась
      }
    });

    // Ждем завершения всех отправок
    await Promise.allSettled(sendPromises);

    return NextResponse.json(
      { message: 'Сообщение успешно отправлено!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    
    // Проверяем, является ли это ошибкой Telegram API
    if (axios.isAxiosError(error) && error.response) {
      console.error('Telegram API error:', error.response.data);
    }

    return NextResponse.json(
      { error: 'Произошла ошибка при отправке сообщения' },
      { status: 500 }
    );
  }
}
