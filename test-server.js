// Простой тестовый сервер для проверки API
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Тестовый endpoint для отправки в Telegram
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body;

    // Валидация данных
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Обязательные поля: имя, email, сообщение'
      });
    }

    // Получаем переменные окружения
    const botToken = '8324078996:AAFXqv17aurMtN1ONjtpEzo9DULAPPd71ss';
    const chatId = '1412400648';

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
      }
    });

    // Ждем завершения всех отправок
    await Promise.allSettled(sendPromises);

    res.json({
      message: 'Сообщение успешно отправлено!'
    });

  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    
    // Проверяем, является ли это ошибкой Telegram API
    if (axios.isAxiosError(error) && error.response) {
      console.error('Telegram API error:', error.response.data);
    }

    res.status(500).json({
      error: 'Произошла ошибка при отправке сообщения'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Тестовый сервер запущен на http://localhost:${PORT}`);
  console.log(`📱 Тестируйте отправку сообщений: POST http://localhost:${PORT}/api/contact`);
});
