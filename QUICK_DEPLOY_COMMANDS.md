# 🚀 БЫСТРЫЕ КОМАНДЫ ДЛЯ РАЗВЕРТЫВАНИЯ НА RENDER

## 📋 ШАГ 1: КОМАНДЫ ДЛЯ ТЕРМИНАЛА

Скопируйте и выполните эти команды по порядку в терминале:

```bash
# 1. Инициализация git репозитория
git init

# 2. Добавление всех файлов
git add .

# 3. Первый коммит
git commit -m "Initial commit: Архитектурная студия Артёма Давлетова - готов к развертыванию на Render"

# 4. Создание основной ветки
git branch -M main

# 5. Подключение к GitHub (ЗАМЕНИТЕ YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/artdavletov-hogging.git

# 6. Загрузка на GitHub
git push -u origin main
```

## 🌐 ШАГ 2: СОЗДАНИЕ РЕПОЗИТОРИЯ НА GITHUB

1. Перейдите на: https://github.com/new
2. Repository name: `artdavletov-hogging`
3. Сделайте репозиторий **ПУБЛИЧНЫМ**
4. НЕ инициализируйте с README
5. Нажмите "Create repository"

## ⚙️ ШАГ 3: НАСТРОЙКИ В RENDER

### Основные настройки:
- **Name:** `artdavletov-hogging`
- **Region:** `Frankfurt (EU Central)`
- **Branch:** `main`
- **Runtime:** `Node`

### Команды сборки:
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`

### Переменные окружения:
```
NODE_ENV = production
NEXT_TELEMETRY_DISABLED = 1
```

## 🎯 ШАГ 4: ПРОЦЕСС В RENDER

1. Войдите в https://render.com
2. Нажмите "New +" → "Web Service"
3. Подключите GitHub аккаунт
4. Выберите репозиторий `artdavletov-hogging`
5. Введите настройки выше
6. Выберите Free Plan
7. Нажмите "Create Web Service"

## ✅ ГОТОВО!

После успешного развертывания ваш сайт будет доступен по адресу:
`https://artdavletov-hogging.onrender.com`

---

## 🔧 ЕСЛИ ЧТО-ТО ПОШЛО НЕ ТАК

### Проблема: "git: command not found"
**Решение:** Установите Git с https://git-scm.com/

### Проблема: "Permission denied (publickey)"
**Решение:** Используйте HTTPS вместо SSH:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/artdavletov-hogging.git
```

### Проблема: Сборка не удалась в Render
**Решение:** Проверьте логи в Render Dashboard и убедитесь, что все файлы загружены в GitHub

---

**📞 ПОДДЕРЖКА:** Если возникли проблемы, проверьте полное руководство в файле `RENDER_DEPLOYMENT_GUIDE.md`
