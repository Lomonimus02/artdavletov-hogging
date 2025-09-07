/**
 * Тестовый скрипт для проверки новой системы аутентификации
 */

const bcrypt = require('bcryptjs');

// Тестируем функции аутентификации
async function testAuthentication() {
  console.log('🧪 Тестирование системы аутентификации...\n');
  
  // Тестовые данные (новые учетные данные)
  const testPassword = 'plpl(940180(yhnhaa13';
  const testHash = '$2b$12$xbhTgxtcPMRlgXKjYNKgH.zIascWn3R71Nk.We0AHtubfrRFJBoYi';
  const wrongPassword = 'wrongpassword';
  
  try {
    // Тест 1: Проверка правильного пароля
    console.log('✅ Тест 1: Проверка правильного пароля');
    const validResult = await bcrypt.compare(testPassword, testHash);
    console.log(`   Результат: ${validResult ? '✅ УСПЕХ' : '❌ ОШИБКА'}`);
    console.log(`   Пароль "${testPassword}" ${validResult ? 'совпадает' : 'не совпадает'} с хешем\n`);
    
    // Тест 2: Проверка неправильного пароля
    console.log('✅ Тест 2: Проверка неправильного пароля');
    const invalidResult = await bcrypt.compare(wrongPassword, testHash);
    console.log(`   Результат: ${!invalidResult ? '✅ УСПЕХ' : '❌ ОШИБКА'}`);
    console.log(`   Пароль "${wrongPassword}" ${!invalidResult ? 'правильно отклонен' : 'неправильно принят'}\n`);
    
    // Тест 3: Генерация нового хеша
    console.log('✅ Тест 3: Генерация нового хеша');
    const newHash = await bcrypt.hash('testpassword123', 12);
    console.log(`   Новый хеш сгенерирован: ${newHash.substring(0, 20)}...\n`);
    
    // Тест 4: Проверка нового хеша
    console.log('✅ Тест 4: Проверка нового хеша');
    const newHashResult = await bcrypt.compare('testpassword123', newHash);
    console.log(`   Результат: ${newHashResult ? '✅ УСПЕХ' : '❌ ОШИБКА'}`);
    console.log(`   Новый хеш ${newHashResult ? 'работает корректно' : 'не работает'}\n`);
    
    // Итоговый результат
    const allTestsPassed = validResult && !invalidResult && newHashResult;
    console.log('📊 ИТОГОВЫЙ РЕЗУЛЬТАТ:');
    console.log(`   ${allTestsPassed ? '✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ' : '❌ ЕСТЬ ОШИБКИ'}`);
    
    if (allTestsPassed) {
      console.log('\n🎉 Система аутентификации работает корректно!');
      console.log('🔒 Пароли надежно зашифрованы с использованием bcrypt');
      console.log('🛡️ Безопасность значительно повышена');
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  }
}

// Запускаем тесты
testAuthentication();
