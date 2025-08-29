# 🚀 Инструкции по деплою на Render

## Шаг 1: Подготовка репозитория
✅ **Выполнено!** Проект уже загружен в ветку `complete-multilingual-translations` в репозиторий:
`git@github.com:Lomonimus02/artdavletov-hogging.git`

## Шаг 2: Создание нового Web Service на Render

1. **Зайдите на [render.com](https://render.com)** и войдите в свой аккаунт

2. **Нажмите "New +"** → **"Web Service"**

3. **Подключите GitHub репозиторий:**
   - Repository: `Lomonimus02/artdavletov-hogging`
   - Branch: `complete-multilingual-translations`

## Шаг 3: Настройки деплоя

### **Build & Deploy Settings:**
```
Name: artdavletov-portfolio
Region: Frankfurt (EU Central) или любой другой
Branch: complete-multilingual-translations
Root Directory: (оставить пустым)
Runtime: Node
Build Command: npm ci && npm run build
Start Command: npm start
```

### **Точные поля для заполнения:**
- **Name:** `artdavletov-portfolio` (или любое другое имя)
- **Region:** `Frankfurt (EU Central)` (рекомендуется для Европы)
- **Branch:** `complete-multilingual-translations`
- **Root Directory:** оставить пустым
- **Runtime:** `Node`
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`

### **Environment Variables (добавить в разделе Environment):**

**Обязательные:**
- **Key:** `NODE_ENV` **Value:** `production`
- **Key:** `ADMIN_PASSWORD_HASH` **Value:** `получить из шага 4`

**Опциональные (для Telegram уведомлений):**
- **Key:** `TELEGRAM_BOT_TOKEN` **Value:** `ваш_токен_бота`
- **Key:** `TELEGRAM_CHAT_ID` **Value:** `ваш_chat_id`

**Пример заполнения:**
```
NODE_ENV=production
ADMIN_PASSWORD_HASH=$2b$10$abcd1234567890abcdef...
TELEGRAM_BOT_TOKEN=1234567890:ABCDEFghijklmnopQRSTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

### **Advanced Settings:**
```
Node Version: 18
Auto-Deploy: Yes (рекомендуется)
```

## Шаг 4: Получение хеша пароля администратора

Выполните локально:
```bash
node scripts/generate-admin-hash.js
```
Введите желаемый пароль и скопируйте полученный хеш в переменную `ADMIN_PASSWORD_HASH`

## Шаг 5: Настройка Telegram (опционально)

Если хотите получать уведомления о новых сообщениях:
1. Создайте бота через @BotFather в Telegram
2. Получите токен бота
3. Получите свой chat_id (можно через @userinfobot)
4. Добавьте эти данные в Environment Variables

## Шаг 6: Деплой

1. **Нажмите "Create Web Service"**
2. **Дождитесь завершения сборки** (обычно 3-5 минут)
3. **Проверьте работу сайта** по предоставленному URL

## 🎯 Что будет работать после деплоя:

✅ **Полная многоязычная поддержка** (русский, английский, китайский)
✅ **Все переводы проектов и фильтров**
✅ **Адаптивный дизайн**
✅ **Админ-панель** (доступна по `/admin`)
✅ **API для проектов**
✅ **Telegram уведомления** (если настроены)

## 🔧 Возможные проблемы и решения:

**Проблема:** Build failed
**Решение:** Проверьте, что все зависимости установлены и нет ошибок в коде

**Проблема:** Изображения не загружаются
**Решение:** Убедитесь, что папка `public/images` загружена в репозиторий

**Проблема:** Админ-панель не работает
**Решение:** Проверьте правильность `ADMIN_PASSWORD_HASH` в Environment Variables
