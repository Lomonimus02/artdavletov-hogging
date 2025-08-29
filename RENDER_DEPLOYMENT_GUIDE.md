# 🚀 Полное руководство по развертыванию на Render

## 📋 Предварительные требования

1. **GitHub аккаунт** - для хранения кода
2. **Render аккаунт** - зарегистрируйтесь на https://render.com
3. **Git установлен** на вашем компьютере

## 🔧 Подготовка проекта (уже выполнено)

Проект уже подготовлен со всеми необходимыми файлами:
- ✅ `render.yaml` - конфигурация для автоматического развертывания
- ✅ `next.config.js` - оптимизирован для production
- ✅ `package.json` - обновлен с engines и скриптами
- ✅ `.env.example` - шаблон переменных окружения
- ✅ `.gitignore` - настроен для Next.js

## 📤 Шаг 1: Загрузка на GitHub

### Вариант A: Через командную строку (рекомендуется)

1. Откройте терминал в папке проекта
2. Выполните команды по порядку:

```bash
# Инициализация git репозитория
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: Архитектурная студия Артёма Давлетова - готов к развертыванию на Render"

# Создание основной ветки
git branch -M main
```

3. Создайте репозиторий на GitHub:
   - Перейдите на https://github.com/new
   - Repository name: `artdavletov-hogging`
   - Сделайте репозиторий **публичным**
   - НЕ инициализируйте с README
   - Нажмите "Create repository"

4. Подключите локальный репозиторий к GitHub:
```bash
# Замените YOUR_USERNAME на ваш GitHub username
git remote add origin https://github.com/YOUR_USERNAME/artdavletov-hogging.git

# Загрузка на GitHub
git push -u origin main
```

### Вариант B: Через GitHub Desktop

1. Откройте GitHub Desktop
2. File → Add Local Repository
3. Выберите папку проекта
4. Сделайте коммит: "Initial commit: готов к развертыванию на Render"
5. Publish repository → название: `artdavletov-hogging`

## 🌐 Шаг 2: Развертывание на Render

### 2.1 Создание Web Service

1. Войдите в https://render.com
2. Нажмите **"New +"** → **"Web Service"**
3. Подключите GitHub аккаунт (если не подключен)
4. Выберите репозиторий `artdavletov-hogging`

### 2.2 Настройка сервиса

**В форме настройки введите следующие данные:**

**Name:** `artdavletov-hogging`

**Region:** `Frankfurt (EU Central)` (или ближайший к вам)

**Branch:** `main`

**Root Directory:** оставьте пустым

**Runtime:** `Node`

**Build Command:**
```
npm ci && npm run build
```

**Start Command:**
```
npm start
```

### 2.3 Настройка переменных окружения

В разделе **Environment Variables** добавьте:

**NODE_ENV**
```
production
```

**NEXT_TELEMETRY_DISABLED**
```
1
```

### 2.4 Выбор плана

- Выберите **Free Plan** (0$/месяц)
- Нажмите **"Create Web Service"**

## ⏱️ Шаг 3: Ожидание развертывания

1. Render автоматически начнет сборку
2. Процесс займет 5-10 минут
3. Следите за логами в реальном времени
4. После успешной сборки получите URL вида: `https://artdavletov-hogging.onrender.com`

## ✅ Шаг 4: Проверка работы

1. Откройте полученный URL
2. Проверьте все страницы:
   - Главная страница
   - О нас
   - Проекты
   - Контакты
3. Проверьте переключение языков
4. Убедитесь, что изображения загружаются

## 🔄 Автоматические обновления

Теперь при каждом push в GitHub ветку `main`, Render автоматически:
1. Скачает новый код
2. Выполнит сборку
3. Развернет обновления

## 🛠️ Возможные проблемы и решения

### Проблема: Сборка не удалась
**Решение:** Проверьте логи сборки в Render Dashboard

### Проблема: Сайт не загружается
**Решение:** 
1. Проверьте статус сервиса в Dashboard
2. Убедитесь, что все переменные окружения настроены
3. Проверьте логи приложения

### Проблема: Изображения не загружаются
**Решение:** Убедитесь, что папка `public/images` загружена в репозиторий

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в Render Dashboard
2. Убедитесь, что все файлы загружены в GitHub
3. Проверьте настройки переменных окружения

## 🎉 Готово!

Ваш сайт теперь доступен по адресу: `https://artdavletov-hogging.onrender.com`

**Важно:** Сохраните этот URL - это адрес вашего сайта в интернете!

---

## 📝 КРАТКИЙ СПИСОК КОМАНД ДЛЯ КОПИРОВАНИЯ

### Команды для терминала:
```bash
git init
git add .
git commit -m "Initial commit: Архитектурная студия Артёма Давлетова - готов к развертыванию на Render"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/artdavletov-hogging.git
git push -u origin main
```

### Настройки для Render:
- **Name:** artdavletov-hogging
- **Runtime:** Node
- **Build Command:** npm ci && npm run build
- **Start Command:** npm start
- **Environment Variables:**
  - NODE_ENV = production
  - NEXT_TELEMETRY_DISABLED = 1
