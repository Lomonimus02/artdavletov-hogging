// Тест утилит аутентификации
console.log('🔍 Тестирование утилит аутентификации:');

// Импортируем утилиты (эмулируем ES модули в CommonJS)
const fs = require('fs');
const path = require('path');

// Читаем и выполняем код утилит
const authUtilsPath = path.join(__dirname, 'src', 'utils', 'auth.ts');
if (fs.existsSync(authUtilsPath)) {
  console.log('✅ Файл auth.ts найден');
} else {
  console.log('❌ Файл auth.ts не найден');
}

// Тест bcrypt
const bcrypt = require('bcryptjs');

async function testBcrypt() {
  try {
    const testPassword = 'plpl(940180(yhnhaa13';
    const expectedHash = '$2b$12$xbhTgxtcPMRlgXKjYNKgH.zIascWn3R71Nk.We0AHtubfrRFJBoYi';
    
    console.log('\n🧪 Тест bcrypt:');
    console.log('Пароль:', testPassword);
    console.log('Ожидаемый хеш:', expectedHash.substring(0, 20) + '...');
    
    const result = await bcrypt.compare(testPassword, expectedHash);
    console.log('Результат сравнения:', result ? '✅ СОВПАДАЕТ' : '❌ НЕ СОВПАДАЕТ');
    
    // Тест с переменной окружения
    if (process.env.ADMIN_PASSWORD_HASH) {
      const envResult = await bcrypt.compare(testPassword, process.env.ADMIN_PASSWORD_HASH);
      console.log('Результат с переменной окружения:', envResult ? '✅ СОВПАДАЕТ' : '❌ НЕ СОВПАДАЕТ');
    }
    
  } catch (error) {
    console.error('❌ Ошибка в тесте bcrypt:', error.message);
  }
}

testBcrypt();
