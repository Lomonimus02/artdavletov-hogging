# Инструкции по выгрузке на GitHub

## Автоматическая выгрузка (если git установлен)

Откройте терминал в папке проекта `interior-design-agency` и выполните следующие команды:

```bash
# Инициализация git репозитория
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: Архитектурная студия Артёма Давлетова"

# Добавление удаленного репозитория
git remote add origin git@github.com:Lomonimus02/artdavletov.git

# Создание основной ветки
git branch -M main

# Выгрузка на GitHub
git push -u origin main
```

## Ручная выгрузка через GitHub Desktop

1. **Установите GitHub Desktop** (если не установлен):
   - Скачайте с https://desktop.github.com/
   - Установите и войдите в свой аккаунт

2. **Создайте новый репозиторий**:
   - Откройте GitHub Desktop
   - File → New Repository
   - Name: `artdavletov`
   - Local Path: выберите папку `C:\Users\User\Desktop\`
   - Initialize with README: снимите галочку
   - Create Repository

3. **Скопируйте файлы**:
   - Скопируйте все содержимое папки `interior-design-agency`
   - Вставьте в созданную папку `artdavletov`

4. **Сделайте коммит**:
   - В GitHub Desktop увидите все изменения
   - Введите commit message: "Initial commit: Архитектурная студия Артёма Давлетова"
   - Нажмите "Commit to main"

5. **Опубликуйте на GitHub**:
   - Нажмите "Publish repository"
   - Убедитесь, что название `artdavletov`
   - Нажмите "Publish Repository"

## Ручная выгрузка через веб-интерфейс GitHub

1. **Создайте репозиторий на GitHub**:
   - Перейдите на https://github.com/new
   - Repository name: `artdavletov`
   - Сделайте репозиторий публичным или приватным
   - НЕ инициализируйте с README
   - Create repository

2. **Загрузите файлы**:
   - На странице нового репозитория нажмите "uploading an existing file"
   - Перетащите все файлы из папки `interior-design-agency`
   - Commit message: "Initial commit: Архитектурная студия Артёма Давлетова"
   - Commit directly to main branch
   - Commit changes

## Проверка

После выгрузки проверьте, что все файлы загружены:
- ✅ src/ (папка с исходным кодом)
- ✅ public/ (папка с изображениями)
- ✅ package.json
- ✅ README.md
- ✅ .gitignore
- ✅ И другие конфигурационные файлы

## Развертывание на Vercel

После выгрузки на GitHub можете развернуть сайт на Vercel:

1. Перейдите на https://vercel.com
2. Войдите через GitHub
3. Import Project → выберите репозиторий `artdavletov`
4. Deploy

Сайт будет автоматически развернут и получит URL для доступа.

## Структура файлов для проверки

```
artdavletov/
├── .gitignore
├── README.md
├── DEPLOY_INSTRUCTIONS.md
├── next-env.d.ts
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── public/
│   └── images/
│       ├── project-1.jpg
│       ├── project-2.jpg
│       └── ... (все изображения проектов)
└── src/
    ├── app/
    │   ├── about/
    │   ├── contacts/
    │   ├── projects/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   └── Navigation.tsx
    └── contexts/
        └── LanguageContext.tsx
```
