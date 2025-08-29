// Простой тест отправки в Telegram
const axios = require('axios');

async function testTelegram() {
  try {
    console.log('🧪 Тестирование отправки в Telegram...');
    
    const botToken = '8324078996:AAFXqv17aurMtN1ONjtpEzo9DULAPPd71ss';
    const chatId = '1412400648';
    
    const message = `Тестовое сообщение!

Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}

Это тест работы Telegram бота для сайта Артёма Давлетова.`;

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await axios.post(telegramApiUrl, {
      chat_id: chatId,
      text: message
    });

    if (response.status === 200) {
      console.log('✅ Сообщение успешно отправлено в Telegram!');
      console.log('📱 Проверьте ваш Telegram чат');
      console.log('Response:', response.data);
    } else {
      console.log('❌ Ошибка отправки');
      console.log('Status:', response.status);
    }

  } catch (error) {
    console.log('❌ Ошибка:', error.message);
    if (error.response) {
      console.log('Telegram API Error:', error.response.data);
    }
  }
}

testTelegram();
