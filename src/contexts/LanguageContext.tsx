'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ru' | 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.projects': 'Проекты',
    'nav.about': 'О нас',
    'nav.contacts': 'Контакты',
    'nav.language': 'Язык / Language',
    'nav.logo': 'Архитектурная Студия Артёма Давлетова',
    
    // Home page
    'home.hero.title': 'Будущее городов\nначинается с наших чертежей',
    'home.hero.title.mobile': 'Будущее городов\nначинается с\nнаших чертежей',
    'home.hero.subtitle': 'Масштабно. Дорого. Навсегда.',
    'home.stats.professionals': '10 профи',
    'home.stats.specializations': '5 специализаций в одном офисе',
    'home.stats.growth': 'до 76% роста цены м²',
    'home.projects.title': 'ПРОЕКТЫ',
    'home.projects.button': 'Смотреть все проекты',
    
    // About page
    'about.title': 'О НАС',
    'about.studio.name': 'Архитектурная\nСтудия\nАртёма\nДавлетова',
    'about.description.1': 'Молодая десятка из Москвы и Казани',
    'about.description.2': 'С 2021 года проектируем города и интерьеры',
    'about.description.3': 'Благоустройство, ландшафт, айдентика, VR‑визуализации',
    'about.description.4': 'Дотошно точим каждую деталь',
    'about.description.5': 'Ускоряем сроки и поднимаем рыночную ценность объектов',
    'about.description.6': 'Портфолио охватывает публичные пространства',
    'about.description.7': 'коммерцию и частные дома по всей России',
    'about.description.8': 'Коммерцию и частные дома по всей России',

    // About page main content
    'about.main.title': 'Архитектурная Студия Артёма Давлетова — Молодая десятка из Москвы и Казани.',
    'about.main.description1': 'С 2021 года проектируем города и интерьеры: благоустройство, ландшафт, айдентика, VR‑визуализации.',
    'about.main.description2': 'Дотошно точим каждую деталь, ускоряем сроки и поднимаем рыночную ценность объектов.',
    'about.main.description3': 'Портфолио охватывает публичные пространства, коммерцию и частные дома по всей России.',

    // About page team
    'about.team.title': 'НАША КОМАНДА',
    'about.team.member1.name': 'Давлетов Артём Маратович',
    'about.team.member1.position': 'Учредитель',
    'about.team.member2.name': 'Валиуллина Сабина',
    'about.team.member2.position': 'Ведущий арт-директор',
    'about.team.member3.name': 'Антюхова Елизавета',
    'about.team.member3.position': 'Арт-директор',
    'about.team.member4.name': 'Котельникова Алёна',
    'about.team.member4.position': 'Архитектор-дизайнер',
    'about.team.member5.name': 'Латыпова Элеонора',
    'about.team.member5.position': 'Архитектор',
    'about.team.member6.name': 'Абрамова Кира',
    'about.team.member6.position': 'Архитектор',
    'about.team.member7.name': 'Шаяхметова Сабина',
    'about.team.member7.position': 'Архитектор',
    
    // Projects page
    'projects.title': 'ПРОЕКТЫ',
    'projects.subtitle': 'Наши работы говорят сами за себя',
    'projects.filter.all': 'Все',
    'projects.filter.design': 'Дизайн-проект',
    'projects.filter.sketch': 'Эскизный проект',
    'projects.filter.title': 'Фильтры',
    'projects.cta.title': 'Готовы создать что-то уникальное?',
    'projects.cta.subtitle': 'Свяжитесь с нами для обсуждения вашего проекта',
    'projects.cta.button': 'Связаться с нами',
    'projects.not.found': 'Проекты не найдены',

    // Project sections
    'projects.section.architecture': 'АРХИТЕКТУРА',
    'projects.section.urbanism': 'БЛАГОУСТРОЙСТВО',
    'projects.section.interior': 'ИНТЕРЬЕРНЫЙ ДИЗАЙН',
    
    // Contacts page
    'contacts.title': 'КОНТАКТЫ',
    'contacts.subtitle': 'Свяжитесь с нами для обсуждения вашего проекта',
    'contacts.how.title': 'Как с нами связаться',
    'contacts.phone': 'Телефон',
    'contacts.email': 'Email',
    'contacts.address': 'Адрес',
    'contacts.hours': 'Время работы',
    'contacts.form.title': 'Напишите нам',
    'contacts.form.name': 'Имя',
    'contacts.form.email': 'Email',
    'contacts.form.phone': 'Телефон',
    'contacts.form.message': 'Сообщение',
    'contacts.form.submit': 'Отправить сообщение',
    'contacts.form.submitting': 'Отправка...',
    'contacts.form.success': 'Сообщение успешно отправлено!',
    'contacts.form.error': 'Ошибка отправки. Попробуйте еще раз.',
    'contacts.form.description': 'Заполните форму, и мы свяжемся с вами в течение рабочего дня для обсуждения деталей вашего проекта.',
    'contacts.address.line1': 'г. Казань, ул. Главная, д. 1',
    'contacts.address.line2': 'офис 111',
    'contacts.hours.weekdays': 'Пн-Пт: 9:00 - 18:00',
    'contacts.hours.weekends': 'Сб-Вс: 12:00 - 18:00',

    // Project descriptions for desktop grid
    'projects.project1.description': 'Частный дом в Жуковке, МО',
    'projects.project2.description': 'Частный дом в Жуковке, МО',
    'projects.project3.description': 'Мичуринский пр., Москва',
    'projects.project4.description': 'Calm Оболенский переулок, Москва',
    'projects.project5.description': 'Tau House Уфа',
    'projects.project6.description': 'Санкт-Петербург Загребский бульвар',
    'projects.project7.description': 'Санкт-Петербург Загребский бульвар',
    'projects.project9.description': 'Щипковский пер. Москва',
    'projects.project10.description': 'апартаменты на Шмидтовском проезде, Москва',
    'projects.project11.description': 'частный дом в Твери в современном русском стиле',

    // Project titles and details
    'project.1.title': 'ЧАСТНЫЙ ДОМ В ЖУКОВКЕ, МО',
    'project.1.category': 'Частный дом',
    'project.1.type': 'Эскизный проект',
    'project.1.city': 'Московская область',
    'project.1.description': 'Современная архитектура с элементами минимализма. Проект включает в себя полную реконструкцию фасада и ландшафтный дизайн.',

    'project.2.title': 'ЖИЛОЙ КОМПЛЕКС В ЦЕНТРЕ МОСКВЫ',
    'project.2.category': 'Жилой комплекс',
    'project.2.type': 'Архитектурный проект',
    'project.2.city': 'Москва',
    'project.2.description': 'Современный жилой комплекс в центре Москвы с инновационными архитектурными решениями.',

    'project.3.title': 'МИЧУРИНСКИЙ ПР., МОСКВА',
    'project.3.category': 'апартаменты',
    'project.3.type': 'Дизайн-проект',
    'project.3.city': 'Москва',
    'project.3.description': 'Элитный жилой комплекс с панорамными окнами и террасами. Уникальная архитектурная концепция вертикального озеленения.',

    'project.4.title': 'CALM ОБОЛЕНСКИЙ ПЕРЕУЛОК, МОСКВА',
    'project.4.category': 'апартаменты',
    'project.4.type': 'Дизайн-проект',
    'project.4.city': 'Москва',
    'project.4.description': 'Современные апартаменты в историческом центре Москвы.',

    'project.5.title': 'TAU HOUSE УФА',
    'project.5.category': 'Частный дом',
    'project.5.type': 'Дизайн-проект',
    'project.5.city': 'Уфа',
    'project.5.description': 'Инновационный дизайн частного дома с использованием экологичных материалов.',

    'project.6.title': 'САНКТ-ПЕТЕРБУРГ ЗАГРЕБСКИЙ БУЛЬВАР',
    'project.6.category': 'апартаменты',
    'project.6.type': 'Дизайн-проект',
    'project.6.city': 'Санкт-Петербург',
    'project.6.description': 'Элегантные апартаменты в Санкт-Петербурге с видом на город.',

    'project.7.title': 'ЗАГОРОДНЫЙ ДОМ В ПОДМОСКОВЬЕ',
    'project.7.category': 'Частный дом',
    'project.7.type': 'Дизайн-проект',
    'project.7.city': 'Московская область',
    'project.7.description': 'Уютный загородный дом с современными удобствами и природным ландшафтом.',

    'project.8.title': 'ЩИПКОВСКИЙ ПЕР. МОСКВА',
    'project.8.category': 'Частный дом',
    'project.8.type': 'Дизайн-проект',
    'project.8.city': 'Москва',
    'project.8.description': 'Реконструкция исторического здания в центре Москвы.',

    'project.9.title': 'КОММЕРЧЕСКИЙ ЦЕНТР В САНКТ-ПЕТЕРБУРГЕ',
    'project.9.category': 'Коммерческая недвижимость',
    'project.9.type': 'Дизайн-проект',
    'project.9.city': 'Санкт-Петербург',
    'project.9.description': 'Современный коммерческий центр с многофункциональными пространствами.',

    'project.10.title': 'АПАРТАМЕНТЫ НА ШМИДТОВСКОМ ПРОЕЗДЕ, МОСКВА',
    'project.10.category': 'апартаменты',
    'project.10.type': 'Дизайн-проект',
    'project.10.city': 'Москва',
    'project.10.description': 'Современные апартаменты в престижном районе Москвы.',

    'project.11.title': 'ЧАСТНЫЙ ДОМ В ТВЕРИ В СОВРЕМЕННОМ РУССКОМ СТИЛЕ',
    'project.11.category': 'частный дом',
    'project.11.type': 'дизайн проект',
    'project.11.city': 'Тверь',
    'project.11.description': 'Премиальный жилой комплекс с подземным паркингом и развитой инфраструктурой.',

    'project.12.title': 'СТУДИЯ В ИСТОРИЧЕСКОМ ЦЕНТРЕ',
    'project.12.category': 'Студия',
    'project.12.type': 'Дизайн-проект',
    'project.12.city': 'Москва',
    'project.12.description': 'Компактная студия в историческом центре Москвы с оптимальным использованием пространства.',

    'project.13.title': 'поселок в Блоне, Польша',
    'project.13.category': 'Частный дом',
    'project.13.type': 'Дизайн-проект',
    'project.13.city': 'Польша',
    'project.13.description': 'Элегантная резиденция в современном стиле с панорамными окнами и террасами. Проект сочетает в себе функциональность и эстетику.',

    'project.14.title': 'Филевский парк, Москва',
    'project.14.category': 'апартаменты',
    'project.14.type': 'Дизайн-проект',
    'project.14.city': 'Москва',
    'project.14.description': 'Многофункциональный комплекс премиум-класса с офисными и торговыми помещениями. Инновационные решения в области устойчивой архитектуры.',

    'project.15.title': 'Жилой дом в Корноухово, Татарстан',
    'project.15.category': 'Частный дом',
    'project.15.type': 'Дизайн-проект',
    'project.15.city': 'Татарстан',
    'project.15.description': 'Дом-убежище в горах с минималистичным дизайном. Проект создан для единения с природой и максимального комфорта.',

    'project.16.title': 'Жилой дом в Подушкино, МО',
    'project.16.category': 'Частный дом',
    'project.16.type': 'Дизайн-проект',
    'project.16.city': 'Московская область',
    'project.16.description': 'Экологичный дом в горной местности с использованием натуральных материалов. Проект интегрирован в природный ландшафт.',

    'project.17.title': 'частный дом в Новоалександровке',
    'project.17.category': 'Частный дом',
    'project.17.type': 'Дизайн-проект',
    'project.17.city': 'Новоалександровка',
    'project.17.description': 'Современный загородный дом с уникальной S-образной планировкой. Проект отличается инновационными конструктивными решениями.',

    'project.18.title': 'частный дом в Булгаково, Уфа',
    'project.18.category': 'Частный дом',
    'project.18.type': 'Дизайн-проект',
    'project.18.city': 'Уфа',
    'project.18.description': 'Современная вилла с геометричными формами и большими остекленными поверхностями. Проект создан для комфортной жизни большой семьи.',

    // Cities
    'city.moscow': 'Москва',
    'city.moscow-region': 'Московская область',
    'city.spb': 'Санкт-Петербург',
    'city.ufa': 'Уфа',
    'city.tver': 'Тверь',
    'city.tatarstan': 'Татарстан',
    'city.poland': 'Польша',
    'city.novoaleksandrovka': 'Новоалександровка',
    'city.ekaterinburg': 'Екатеринбург',
    'city.kazan': 'Казань',

    // Project categories
    'category.private-house': 'Частный дом',
    'category.commercial': 'Коммерческая недвижимость',
    'category.apartments': 'апартаменты',
    'category.education': 'Образование',
    'category.hotel': 'Гостиница',
    'category.library': 'Библиотека',

    // Project types
    'type.sketch': 'Эскизный проект',
    'type.design': 'Дизайн-проект',
    'type.public': 'Общественный',
    'type.commercial': 'Коммерческий',
    'type.residential': 'Жилой',

    // Individual project page texts
    'project.not-found': 'Проект не найден',
    'project.back-to-projects': '← Назад к проектам',
    'project.image-alt': 'изображение',
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.contacts': 'Contacts',
    'nav.language': 'Language / 语言',
    'nav.logo': 'Architectural Studio of Artem Davletov',
    
    // Home page
    'home.hero.title': 'The future of cities\nbegins with our blueprints',
    'home.hero.title.mobile': 'The future of cities\nbegins with\nour blueprints',
    'home.hero.subtitle': 'Large-scale. Expensive. Forever.',
    'home.stats.professionals': '10 professionals',
    'home.stats.specializations': '5 specializations in one office',
    'home.stats.growth': 'up to 76% price growth per m²',
    'home.projects.title': 'PROJECTS',
    'home.projects.button': 'View All Projects',
    
    // About page
    'about.title': 'ABOUT US',
    'about.studio.name': 'Architectural\nStudio of\nArtem\nDavletov',
    'about.description.1': 'Young team of ten from Moscow and Kazan.',
    'about.description.2': 'Since 2021, we design cities and interiors',
    'about.description.3': 'Landscaping, landscape, identity, VR visualizations',
    'about.description.4': 'We meticulously refine every detail',
    'about.description.5': 'Accelerate deadlines and increase market value',
    'about.description.6': 'Portfolio covers public spaces',
    'about.description.7': 'commerce and private homes throughout Russia',
    'about.description.8': 'Commerce and private homes throughout Russia',

    // About page main content
    'about.main.title': 'Architectural Studio of Artem Davletov — Young team of ten from Moscow and Kazan.',
    'about.main.description1': 'Since 2021, we design cities and interiors: landscaping, landscape, identity, VR visualizations.',
    'about.main.description2': 'We meticulously refine every detail, accelerate deadlines and increase market value of properties.',
    'about.main.description3': 'Portfolio covers public spaces, commerce and private homes throughout Russia.',

    // About page team
    'about.team.title': 'OUR TEAM',
    'about.team.member1.name': 'Davletov Artem Maratovich',
    'about.team.member1.position': 'Founder',
    'about.team.member2.name': 'Valiullina Sabina',
    'about.team.member2.position': 'Lead Art Director',
    'about.team.member3.name': 'Antyukhova Elizaveta',
    'about.team.member3.position': 'Art Director',
    'about.team.member4.name': 'Kotelnikova Alena',
    'about.team.member4.position': 'Architect-Designer',
    'about.team.member5.name': 'Latypova Eleonora',
    'about.team.member5.position': 'Architect',
    'about.team.member6.name': 'Abramova Kira',
    'about.team.member6.position': 'Architect',
    'about.team.member7.name': 'Shayakhmetova Sabina',
    'about.team.member7.position': 'Architect',
    
    // Projects page
    'projects.title': 'PROJECTS',
    'projects.subtitle': 'Our work speaks for itself',
    'projects.filter.all': 'All',
    'projects.filter.design': 'Design Project',
    'projects.filter.sketch': 'Sketch Project',
    'projects.filter.title': 'Filters',
    'projects.cta.title': 'Ready to create something unique?',
    'projects.cta.subtitle': 'Contact us to discuss your project',
    'projects.cta.button': 'Contact us',
    'projects.not.found': 'No projects found',

    // Project sections
    'projects.section.architecture': 'ARCHITECTURE',
    'projects.section.urbanism': 'LANDSCAPING',
    'projects.section.interior': 'INTERIOR DESIGN',
    
    // Contacts page
    'contacts.title': 'CONTACTS',
    'contacts.subtitle': 'Contact us to discuss your project',
    'contacts.how.title': 'How to contact us',
    'contacts.phone': 'Phone',
    'contacts.email': 'Email',
    'contacts.address': 'Address',
    'contacts.hours': 'Working hours',
    'contacts.form.title': 'Write to us',
    'contacts.form.name': 'Name',
    'contacts.form.email': 'Email',
    'contacts.form.phone': 'Phone',
    'contacts.form.message': 'Message',
    'contacts.form.submit': 'Send message',
    'contacts.form.submitting': 'Sending...',
    'contacts.form.success': 'Message sent successfully!',
    'contacts.form.error': 'Sending error. Please try again.',
    'contacts.form.description': 'Fill out the form and we will contact you within a business day to discuss the details of your project.',
    'contacts.address.line1': 'Kazan, Glavnaya St., 1',
    'contacts.address.line2': 'office 111',
    'contacts.hours.weekdays': 'Mon-Fri: 9:00 - 18:00',
    'contacts.hours.weekends': 'Sat-Sun: 12:00 - 18:00',

    // Project descriptions for desktop grid
    'projects.project1.description': 'Private house in Zhukovka, Moscow Region',
    'projects.project2.description': 'Private house in Zhukovka, Moscow Region',
    'projects.project3.description': 'Michurinsky Ave., Moscow',
    'projects.project4.description': 'Calm Obolensky Lane, Moscow',
    'projects.project5.description': 'Tau House Ufa',
    'projects.project6.description': 'St. Petersburg Zagreb Boulevard',
    'projects.project7.description': 'St. Petersburg Zagreb Boulevard',
    'projects.project9.description': 'Schipkovsky Lane, Moscow',
    'projects.project10.description': 'apartments on Schmidtovsky passage, Moscow',
    'projects.project11.description': 'private house in Tver in modern Russian style',

    // Project titles and details
    'project.1.title': 'PRIVATE HOUSE IN ZHUKOVKA, MOSCOW REGION',
    'project.1.category': 'Private House',
    'project.1.type': 'Sketch Project',
    'project.1.city': 'Moscow Region',
    'project.1.description': 'Modern architecture with minimalist elements. The project includes complete facade reconstruction and landscape design.',

    'project.2.title': 'PRIVATE HOUSE IN ZHUKOVKA, MOSCOW REGION',
    'project.2.category': 'Commercial Real Estate',
    'project.2.type': 'Sketch Project',
    'project.2.city': 'Kazan',
    'project.2.description': 'Modern architecture with minimalist elements.',

    'project.3.title': 'MICHURINSKY AVE., MOSCOW',
    'project.3.category': 'Apartments',
    'project.3.type': 'Design Project',
    'project.3.city': 'Moscow',
    'project.3.description': 'Elite residential complex with panoramic windows and terraces. Unique architectural concept of vertical landscaping.',

    'project.4.title': 'CALM OBOLENSKY LANE, MOSCOW',
    'project.4.category': 'Apartments',
    'project.4.type': 'Design Project',
    'project.4.city': 'Moscow',
    'project.4.description': 'Modern apartments in the historic center of Moscow.',

    'project.5.title': 'TAU HOUSE UFA',
    'project.5.category': 'Private House',
    'project.5.type': 'Design Project',
    'project.5.city': 'Ufa',
    'project.5.description': 'Innovative private house design using eco-friendly materials.',

    'project.6.title': 'ST. PETERSBURG ZAGREB BOULEVARD',
    'project.6.category': 'Apartments',
    'project.6.type': 'Design Project',
    'project.6.city': 'St. Petersburg',
    'project.6.description': 'Elegant apartments in St. Petersburg with city views.',

    'project.7.title': 'KINDERGARTEN IN EKATERINBURG',
    'project.7.category': 'Education',
    'project.7.type': 'Public',
    'project.7.city': 'Ekaterinburg',
    'project.7.description': 'Modern kindergarten with play areas and educational spaces.',

    'project.8.title': 'SCHIPKOVSKY LANE, MOSCOW',
    'project.8.category': 'Private House',
    'project.8.type': 'Design Project',
    'project.8.city': 'Moscow',
    'project.8.description': 'Reconstruction of a historic building in the center of Moscow.',

    'project.9.title': 'BOUTIQUE HOTEL IN ST. PETERSBURG',
    'project.9.category': 'Hotel',
    'project.9.type': 'Commercial',
    'project.9.city': 'St. Petersburg',
    'project.9.description': 'Elegant boutique hotel with unique design and high level of service.',

    'project.10.title': 'APARTMENTS ON SCHMIDTOVSKY PASSAGE, MOSCOW',
    'project.10.category': 'Apartments',
    'project.10.type': 'Design Project',
    'project.10.city': 'Moscow',
    'project.10.description': 'Modern apartments in a prestigious area of Moscow.',

    'project.11.title': 'PRIVATE HOUSE IN TVER IN MODERN RUSSIAN STYLE',
    'project.11.category': 'private house',
    'project.11.type': 'design project',
    'project.11.city': 'Tver',
    'project.11.description': 'Premium residential complex with underground parking and developed infrastructure.',

    'project.12.title': 'PRIVATE LIBRARY IN MOSCOW',
    'project.12.category': 'Library',
    'project.12.type': 'Residential',
    'project.12.city': 'Moscow',
    'project.12.description': 'Cozy private library with modern design and comfortable reading areas.',

    'project.13.title': 'village in Blonie, Poland',
    'project.13.category': 'Private House',
    'project.13.type': 'Design Project',
    'project.13.city': 'Poland',
    'project.13.description': 'Elegant residence in modern style with panoramic windows and terraces. The project combines functionality and aesthetics.',

    'project.14.title': 'Filevsky Park, Moscow',
    'project.14.category': 'apartments',
    'project.14.type': 'Design Project',
    'project.14.city': 'Moscow',
    'project.14.description': 'Premium multifunctional complex with office and retail spaces. Innovative solutions in sustainable architecture.',

    'project.15.title': 'Residential house in Kornoukhovo, Tatarstan',
    'project.15.category': 'Private House',
    'project.15.type': 'Design Project',
    'project.15.city': 'Tatarstan',
    'project.15.description': 'Mountain retreat house with minimalist design. The project is created for unity with nature and maximum comfort.',

    'project.16.title': 'Residential house in Podushkino, Moscow Region',
    'project.16.category': 'Private House',
    'project.16.type': 'Design Project',
    'project.16.city': 'Moscow Region',
    'project.16.description': 'Eco-friendly house in mountainous area using natural materials. The project is integrated into the natural landscape.',

    'project.17.title': 'private house in Novoaleksandrovka',
    'project.17.category': 'Private House',
    'project.17.type': 'Design Project',
    'project.17.city': 'Novoaleksandrovka',
    'project.17.description': 'Modern country house with unique S-shaped layout. The project features innovative structural solutions.',

    'project.18.title': 'private house in Bulgakovo, Ufa',
    'project.18.category': 'Private House',
    'project.18.type': 'Design Project',
    'project.18.city': 'Ufa',
    'project.18.description': 'Modern villa with geometric forms and large glazed surfaces. The project is created for comfortable living of a large family.',

    // Cities
    'city.moscow': 'Moscow',
    'city.moscow-region': 'Moscow Region',
    'city.spb': 'St. Petersburg',
    'city.ufa': 'Ufa',
    'city.tver': 'Tver',
    'city.tatarstan': 'Tatarstan',
    'city.poland': 'Poland',
    'city.novoaleksandrovka': 'Novoaleksandrovka',
    'city.ekaterinburg': 'Ekaterinburg',
    'city.kazan': 'Kazan',

    // Project categories
    'category.private-house': 'Private House',
    'category.commercial': 'Commercial Real Estate',
    'category.apartments': 'Apartments',
    'category.education': 'Education',
    'category.hotel': 'Hotel',
    'category.library': 'Library',

    // Project types
    'type.sketch': 'Sketch Project',
    'type.design': 'Design Project',
    'type.public': 'Public',
    'type.commercial': 'Commercial',
    'type.residential': 'Residential',

    // Individual project page texts
    'project.not-found': 'Project not found',
    'project.back-to-projects': '← Back to projects',
    'project.image-alt': 'image',
  },
  
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.projects': '项目',
    'nav.about': '关于我们',
    'nav.contacts': '联系方式',
    'nav.language': '语言 / Language',
    'nav.logo': '阿尔捷姆·达夫列托夫建筑工作室',
    
    // Home page
    'home.hero.title': '城市的未来\n始于我们的蓝图',
    'home.hero.title.mobile': '城市的未来\n始于\n我们的蓝图',
    'home.hero.subtitle': '大规模。昂贵。永恒。',
    'home.stats.professionals': '10名专业人士',
    'home.stats.specializations': '一个办公室内5个专业',
    'home.stats.growth': '每平方米价格增长高达76%',
    'home.projects.title': '项目',
    'home.projects.button': '查看所有项目',
    
    // About page
    'about.title': '关于我们',
    'about.studio.name': '阿尔捷姆·\n达夫列托夫\n建筑\n工作室',
    'about.description.1': '来自莫斯科和喀山的年轻十人团队。',
    'about.description.2': '自2021年以来，我们设计城市和室内',
    'about.description.3': '景观美化、景观、标识、VR可视化',
    'about.description.4': '我们精心打磨每一个细节',
    'about.description.5': '加快进度并提高物业的市场价值',
    'about.description.6': '作品集涵盖俄罗斯各地的公共空间',
    'about.description.7': '俄罗斯各地的商业和私人住宅',
    'about.description.8': '商业和私人住宅',

    // About page main content
    'about.main.title': '阿尔捷姆·达夫列托夫建筑工作室 — 来自莫斯科和喀山的年轻十人团队。',
    'about.main.description1': '自2021年以来，我们设计城市和室内：景观美化、景观、标识、VR可视化。',
    'about.main.description2': '我们精心打磨每一个细节，加快进度并提高物业的市场价值。',
    'about.main.description3': '作品集涵盖俄罗斯各地的公共空间、商业和私人住宅。',

    // About page team
    'about.team.title': '我们的团队',
    'about.team.member1.name': '达夫列托夫·阿尔捷姆·马拉托维奇',
    'about.team.member1.position': '创始人',
    'about.team.member2.name': '瓦利乌利娜·萨比娜',
    'about.team.member2.position': '首席艺术总监',
    'about.team.member3.name': '安秋霍娃·叶丽扎维塔',
    'about.team.member3.position': '艺术总监',
    'about.team.member4.name': '科捷利尼科娃·阿廖娜',
    'about.team.member4.position': '建筑师-设计师',
    'about.team.member5.name': '拉特波娃·埃莱奥诺拉',
    'about.team.member5.position': '建筑师',
    'about.team.member6.name': '阿布拉莫娃·基拉',
    'about.team.member6.position': '建筑师',
    'about.team.member7.name': '沙亚赫梅托娃·萨比娜',
    'about.team.member7.position': '建筑师',
    
    // Projects page
    'projects.title': '项目',
    'projects.subtitle': '我们的作品不言自明',
    'projects.filter.all': '全部',
    'projects.filter.design': '设计项目',
    'projects.filter.sketch': '草图项目',
    'projects.filter.title': '筛选器',
    'projects.cta.title': '准备创造独特的东西吗？',
    'projects.cta.subtitle': '联系我们讨论您的项目',
    'projects.cta.button': '联系我们',
    'projects.not.found': '未找到项目',

    // Project sections
    'projects.section.architecture': '建筑',
    'projects.section.urbanism': '景观美化',
    'projects.section.interior': '室内设计',
    
    // Contacts page
    'contacts.title': '联系方式',
    'contacts.subtitle': '联系我们讨论您的项目',
    'contacts.how.title': '如何联系我们',
    'contacts.phone': '电话',
    'contacts.email': '邮箱',
    'contacts.address': '地址',
    'contacts.hours': '工作时间',
    'contacts.form.title': '给我们写信',
    'contacts.form.name': '姓名',
    'contacts.form.email': '邮箱',
    'contacts.form.phone': '电话',
    'contacts.form.message': '消息',
    'contacts.form.submit': '发送消息',
    'contacts.form.submitting': '发送中...',
    'contacts.form.success': '消息发送成功！',
    'contacts.form.error': '发送错误。请重试。',
    'contacts.form.description': '填写表格，我们将在一个工作日内联系您，讨论您项目的详细信息。',
    'contacts.address.line1': '喀山，主街1号',
    'contacts.address.line2': '111办公室',
    'contacts.hours.weekdays': '周一至周五：9:00 - 18:00',
    'contacts.hours.weekends': '周六至周日：12:00 - 18:00',

    // Project descriptions for desktop grid
    'projects.project1.description': '茹科夫卡私人住宅，莫斯科州',
    'projects.project2.description': '茹科夫卡私人住宅，莫斯科州',
    'projects.project3.description': '米丘林斯基大道，莫斯科',
    'projects.project4.description': 'Calm奥博连斯基巷，莫斯科',
    'projects.project5.description': 'Tau House乌法',
    'projects.project6.description': '圣彼得堡萨格勒布大道',
    'projects.project7.description': '圣彼得堡萨格勒布大道',
    'projects.project9.description': '希普科夫斯基巷，莫斯科',
    'projects.project10.description': '施密特通道公寓，莫斯科',
    'projects.project11.description': '特维尔现代俄式私人住宅',

    // Project titles and details
    'project.1.title': '茹科夫卡私人住宅，莫斯科州',
    'project.1.category': '私人住宅',
    'project.1.type': '草图项目',
    'project.1.city': '莫斯科州',
    'project.1.description': '具有极简主义元素的现代建筑。项目包括完整的立面重建和景观设计。',

    'project.2.title': '茹科夫卡私人住宅，莫斯科州',
    'project.2.category': '商业地产',
    'project.2.type': '草图项目',
    'project.2.city': '喀山',
    'project.2.description': '具有极简主义元素的现代建筑。',

    'project.3.title': '米丘林斯基大道，莫斯科',
    'project.3.category': '公寓',
    'project.3.type': '设计项目',
    'project.3.city': '莫斯科',
    'project.3.description': '带有全景窗户和露台的精英住宅综合体。垂直绿化的独特建筑概念。',

    'project.4.title': 'CALM奥博连斯基巷，莫斯科',
    'project.4.category': '公寓',
    'project.4.type': '设计项目',
    'project.4.city': '莫斯科',
    'project.4.description': '莫斯科历史中心的现代公寓。',

    'project.5.title': 'TAU HOUSE乌法',
    'project.5.category': '私人住宅',
    'project.5.type': '设计项目',
    'project.5.city': '乌法',
    'project.5.description': '使用环保材料的创新私人住宅设计。',

    'project.6.title': '圣彼得堡萨格勒布大道',
    'project.6.category': '公寓',
    'project.6.type': '设计项目',
    'project.6.city': '圣彼得堡',
    'project.6.description': '圣彼得堡优雅的城市景观公寓。',

    'project.7.title': '叶卡捷琳堡幼儿园',
    'project.7.category': '教育',
    'project.7.type': '公共',
    'project.7.city': '叶卡捷琳堡',
    'project.7.description': '带有游戏区和教育空间的现代幼儿园。',

    'project.8.title': '希普科夫斯基巷，莫斯科',
    'project.8.category': '私人住宅',
    'project.8.type': '设计项目',
    'project.8.city': '莫斯科',
    'project.8.description': '莫斯科市中心历史建筑的重建。',

    'project.9.title': '圣彼得堡精品酒店',
    'project.9.category': '酒店',
    'project.9.type': '商业',
    'project.9.city': '圣彼得堡',
    'project.9.description': '具有独特设计和高水平服务的优雅精品酒店。',

    'project.10.title': '施密特通道公寓，莫斯科',
    'project.10.category': '公寓',
    'project.10.type': '设计项目',
    'project.10.city': '莫斯科',
    'project.10.description': '莫斯科高档地区的现代公寓。',

    'project.11.title': '特维尔现代俄式私人住宅',
    'project.11.category': '私人住宅',
    'project.11.type': '设计项目',
    'project.11.city': '特维尔',
    'project.11.description': '带有地下停车场和完善基础设施的高端住宅综合体。',

    'project.12.title': '莫斯科私人图书馆',
    'project.12.category': '图书馆',
    'project.12.type': '住宅',
    'project.12.city': '莫斯科',
    'project.12.description': '具有现代设计和舒适阅读区的温馨私人图书馆。',

    'project.13.title': '波兰布洛涅村庄',
    'project.13.category': '私人住宅',
    'project.13.type': '设计项目',
    'project.13.city': '波兰',
    'project.13.description': '现代风格的优雅住宅，配有全景窗户和露台。该项目结合了功能性和美学。',

    'project.14.title': '菲列夫斯基公园，莫斯科',
    'project.14.category': '公寓',
    'project.14.type': '设计项目',
    'project.14.city': '莫斯科',
    'project.14.description': '带有办公和零售空间的高端多功能综合体。可持续建筑的创新解决方案。',

    'project.15.title': '鞑靼斯坦科尔诺乌霍沃住宅',
    'project.15.category': '私人住宅',
    'project.15.type': '设计项目',
    'project.15.city': '鞑靼斯坦',
    'project.15.description': '具有极简主义设计的山地度假屋。该项目旨在与自然融为一体并提供最大舒适度。',

    'project.16.title': '莫斯科州波杜什基诺住宅',
    'project.16.category': '私人住宅',
    'project.16.type': '设计项目',
    'project.16.city': '莫斯科州',
    'project.16.description': '使用天然材料的山区生态友好住宅。该项目融入自然景观。',

    'project.17.title': '新亚历山德罗夫卡私人住宅',
    'project.17.category': '私人住宅',
    'project.17.type': '设计项目',
    'project.17.city': '新亚历山德罗夫卡',
    'project.17.description': '具有独特S形布局的现代乡村住宅。该项目具有创新的结构解决方案。',

    'project.18.title': '乌法布尔加科沃私人住宅',
    'project.18.category': '私人住宅',
    'project.18.type': '设计项目',
    'project.18.city': '乌法',
    'project.18.description': '具有几何形状和大面积玻璃表面的现代别墅。该项目为大家庭的舒适生活而设计。',

    // Cities
    'city.moscow': '莫斯科',
    'city.moscow-region': '莫斯科州',
    'city.spb': '圣彼得堡',
    'city.ufa': '乌法',
    'city.tver': '特维尔',
    'city.tatarstan': '鞑靼斯坦',
    'city.poland': '波兰',
    'city.novoaleksandrovka': '新亚历山德罗夫卡',
    'city.ekaterinburg': '叶卡捷琳堡',
    'city.kazan': '喀山',

    // Project categories
    'category.private-house': '私人住宅',
    'category.commercial': '商业地产',
    'category.apartments': '公寓',
    'category.education': '教育',
    'category.hotel': '酒店',
    'category.library': '图书馆',

    // Project types
    'type.sketch': '草图项目',
    'type.design': '设计项目',
    'type.public': '公共',
    'type.commercial': '商业',
    'type.residential': '住宅',

    // Individual project page texts
    'project.not-found': '未找到项目',
    'project.back-to-projects': '← 返回项目',
    'project.image-alt': '图像',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');

  useEffect(() => {
    // Проверяем sessionStorage для сохранения языка в рамках сессии
    const savedLanguage = sessionStorage.getItem('language') as Language;
    if (savedLanguage && ['ru', 'en', 'zh'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // По умолчанию всегда русский язык
      setLanguage('ru');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    // Сохраняем язык только в рамках текущей сессии
    sessionStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
