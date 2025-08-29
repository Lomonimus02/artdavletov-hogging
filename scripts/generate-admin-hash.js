#!/usr/bin/env node

/**
 * Скрипт для генерации хеша пароля администратора
 * Использование: node scripts/generate-admin-hash.js [пароль]
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function generateHash() {
  try {
    let password = process.argv[2];
    
    if (!password) {
      // Если пароль не передан как аргумент, запрашиваем его
      password = await new Promise((resolve) => {
        rl.question('Введите пароль для администратора: ', (answer) => {
          resolve(answer);
        });
      });
    }
    
    if (!password || password.trim().length === 0) {
      console.error('❌ Пароль не может быть пустым!');
      process.exit(1);
    }
    
    if (password.length < 6) {
      console.error('❌ Пароль должен содержать минимум 6 символов!');
      process.exit(1);
    }
    
    console.log('🔄 Генерация хеша пароля...');
    const hash = await hashPassword(password);
    
    console.log('\n✅ Хеш пароля успешно сгенерирован!');
    console.log('\n📋 Добавьте следующие строки в ваш .env.local файл:');
    console.log('─'.repeat(60));
    console.log(`ADMIN_USERNAME=admin`);
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('─'.repeat(60));
    
    console.log('\n🔒 Безопасность:');
    console.log('• Никогда не делитесь этим хешем');
    console.log('• Добавьте .env.local в .gitignore');
    console.log('• Используйте сложные пароли');
    console.log('• Регулярно меняйте пароли');
    
  } catch (error) {
    console.error('❌ Ошибка при генерации хеша:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Проверяем, что bcryptjs установлен
try {
  require('bcryptjs');
} catch (error) {
  console.error('❌ Библиотека bcryptjs не найдена!');
  console.error('Установите её командой: npm install bcryptjs');
  process.exit(1);
}

generateHash();
