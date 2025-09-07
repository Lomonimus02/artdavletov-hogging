# 🚀 Быстрый деплой на Render

## 1. Зайти на render.com → New + → Web Service

## 2. Подключить репозиторий:
- **Repository:** `Lomonimus02/artdavletov-hogging`
- **Branch:** `complete-multilingual-translations`

## 3. Заполнить поля:

### **Основные настройки:**
- **Name:** `artdavletov-portfolio`
- **Region:** `Frankfurt (EU Central)`
- **Branch:** `complete-multilingual-translations`
- **Root Directory:** (пустое поле)
- **Runtime:** `Node`

### **Build & Deploy:**
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`

### **Environment Variables:**
- **NODE_ENV** = `production`
- **ADMIN_PASSWORD_HASH** = `получить командой: node scripts/generate-admin-hash.js`

## 4. Нажать "Create Web Service"

## 5. Дождаться деплоя (3-5 минут)

---

## 📋 Что получите:
✅ Полностью переведенный сайт (RU/EN/ZH)
✅ Рабочую админ-панель
✅ Все проекты с переводами
✅ Переведенные фильтры

## 🔗 После деплоя:
- Сайт будет доступен по URL от Render
- Админ-панель: `your-url.com/admin`
- Все переводы работают автоматически
