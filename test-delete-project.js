// Тестовый скрипт для проверки удаления проектов
const axios = require('axios');

async function testDeleteProject() {
  try {
    console.log('🧪 Тестирование удаления проекта...');
    
    // Тестируем удаление статического проекта (ID 1)
    const projectId = 1;
    const apiUrl = `http://localhost:3000/api/admin/static-projects/${projectId}`;
    
    console.log(`📍 Удаляем статический проект с ID: ${projectId}`);
    
    const response = await axios.delete(apiUrl, {
      headers: {
        'x-admin-session': 'true'
      }
    });

    if (response.status === 200) {
      console.log('✅ Проект успешно удален!');
      console.log('Response:', response.data);
      
      // Проверяем, что проект больше не отображается в публичном API
      console.log('\n🔍 Проверяем публичный API...');
      const publicResponse = await axios.get('http://localhost:3000/api/projects');
      const projects = publicResponse.data;
      const deletedProject = projects.find(p => p.id === projectId);
      
      if (!deletedProject) {
        console.log('✅ Проект корректно скрыт из публичного API');
      } else {
        console.log('❌ Проект все еще отображается в публичном API');
      }
      
    } else {
      console.log('❌ Ошибка удаления');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
    }

  } catch (error) {
    console.log('❌ Ошибка:', error.message);
    if (error.response) {
      console.log('API Error:', error.response.data);
      console.log('Status:', error.response.status);
    }
  }
}

// Функция для восстановления проекта (для тестирования)
async function restoreProject() {
  try {
    console.log('\n🔄 Восстанавливаем проект для повторного тестирования...');
    
    const fs = require('fs');
    const path = require('path');
    
    const deletedProjectsPath = path.join(process.cwd(), 'data', 'deleted-projects.json');
    
    // Очищаем список удаленных проектов
    fs.writeFileSync(deletedProjectsPath, JSON.stringify([], null, 2));
    
    console.log('✅ Проект восстановлен');
    
  } catch (error) {
    console.log('❌ Ошибка восстановления:', error.message);
  }
}

// Запускаем тест
testDeleteProject().then(() => {
  console.log('\n💡 Для восстановления проекта запустите: node test-delete-project.js restore');
});

// Проверяем аргументы командной строки
if (process.argv[2] === 'restore') {
  restoreProject();
}
