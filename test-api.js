const http = require('http');

// Тестируем API аутентификации
function testAuthAPI() {
  const postData = JSON.stringify({
    username: ')bvbvbc761309y5t5r(',
    password: 'plpl(940180(yhnhaa13'
  });

  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🧪 Тестирование API аутентификации...');
  console.log('URL:', `http://localhost:3002/api/auth/login`);
  console.log('Данные:', { username: ')bvbvbc761309y5t5r(', password: '[СКРЫТ]' });

  const req = http.request(options, (res) => {
    console.log(`\n📊 Статус ответа: ${res.statusCode}`);
    console.log('Заголовки:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('\n📝 Тело ответа:', data);
      
      try {
        const jsonResponse = JSON.parse(data);
        if (res.statusCode === 200 && jsonResponse.success) {
          console.log('✅ УСПЕХ: Аутентификация прошла успешно!');
        } else {
          console.log('❌ ОШИБКА: Аутентификация не удалась');
          console.log('Причина:', jsonResponse.error || 'Неизвестная ошибка');
        }
      } catch (e) {
        console.log('❌ ОШИБКА: Не удалось разобрать JSON ответ');
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ ОШИБКА ЗАПРОСА:', e.message);
  });

  req.write(postData);
  req.end();
}

// Запускаем тест
testAuthAPI();
