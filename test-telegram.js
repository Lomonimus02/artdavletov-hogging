// Тестовый скрипт для проверки отправки в Telegram
// Запуск: node test-telegram.js

const axios = require('axios');

async function testTelegramAPI() {
  try {
    console.log('🧪 Тестирование API отправки в Telegram...');
    
    const testData = {
      name: 'Тестовый пользователь',
      email: 'test@example.com',
      phone: '+7 999 123 45 67',
      message: 'Это тестовое сообщение для проверки интеграции с Telegram',
      source: 'home'
    };

    // Тестируем напрямую Telegram API
    const botToken = '8324078996:AAFXqv17aurMtN1ONjtpEzo9DULAPPd71ss';
    const chatId = '1412400648';

    const telegramMessage = `Тестовое сообщение с сайта!

Источник: Тестирование
Имя: ${testData.name}
Email: ${testData.email}
Телефон: ${testData.phone}

Сообщение:
${testData.message}

Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await axios.post(telegramApiUrl, {
      chat_id: chatId,
      text: telegramMessage,
      parse_mode: 'HTML'
    });
    });

    if (response.status === 200) {
      console.log('✅ Тест успешно пройден!');
      console.log('📱 Проверьте Telegram - должно прийти уведомление');
      console.log('Response:', response.data);
    } else {
      console.log('❌ Тест не пройден');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    }

  } catch (error) {
    console.log('❌ Ошибка при тестировании:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('\n💡 Возможные причины:');
    console.log('1. Проект не запущен (npm run dev)');
    console.log('2. Не настроены переменные окружения в .env.local');
    console.log('3. Неверный токен бота или Chat ID');
  }
}

testTelegramAPI();
