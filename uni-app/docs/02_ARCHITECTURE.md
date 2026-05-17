# Архитектура проекта

## Общая схема взаимодействия

```
┌──────────────────────────────────────────────────────────────────┐
│                    МОБИЛЬНОЕ ПРИЛОЖЕНИЕ                          │
│                                                                  │
│  ┌─────────────┐   ┌──────────────┐   ┌───────────────────────┐ │
│  │  Navigation │   │    Zustand   │   │      Screens          │ │
│  │  (экраны,   │◄──│    Store     │◄──│  (UI компоненты)      │ │
│  │  табы)      │   │  (состояние) │   │                       │ │
│  └─────────────┘   └──────┬───────┘   └───────────────────────┘ │
│                           │                                      │
│                    ┌──────▼───────┐                              │
│                    │   Services   │                              │
│                    │  (Axios API) │                              │
│                    └──────┬───────┘                              │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTP JSON REST API
                            │ Bearer JWT Token
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                       BACKEND (Express)                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Маршруты (Routers)                    │   │
│  │  /auth  /news  /resources  /categories  /notifications   │   │
│  └─────────────────────────┬────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────▼────────────────────────────────┐   │
│  │              Middleware (Промежуточный слой)              │   │
│  │         authMiddleware (JWT) + roleMiddleware             │   │
│  └─────────────────────────┬────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────▼────────────────────────────────┐   │
│  │              Controllers → Services                       │   │
│  │         (валидация Zod → бизнес-логика)                  │   │
│  └─────────────────────────┬────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────▼────────────────────────────────┐   │
│  │                  Prisma ORM Client                        │   │
│  └─────────────────────────┬────────────────────────────────┘   │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                           │
│  users │ news │ resources │ categories │ notifications │ tokens  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Паттерны и принципы архитектуры

### Backend — модульная структура

Каждый ресурс системы оформлен как отдельный модуль со своим набором файлов:

```
модуль/
├── router.ts      — маршруты HTTP
├── controller.ts  — обработка запросов, валидация
└── service.ts     — бизнес-логика, работа с БД
```

Это позволяет легко добавлять новые модули не затрагивая существующие.

### Mobile — слоистая архитектура

```
screens/        — UI, отображение данных
    ↓ вызывает
services/       — HTTP-запросы к API (Axios)
    ↓ данные идут в
store/          — глобальное состояние (Zustand)
    ↓ используется в
screens/        — отображает актуальные данные
```

### Авторизация — JWT (JSON Web Token)

```
1. Пользователь вводит email + пароль
2. Backend проверяет пароль через bcrypt
3. Backend выдаёт JWT токен (живёт 7 дней)
4. Токен сохраняется в Expo SecureStore (зашифрованное хранилище)
5. Каждый запрос к API: заголовок Authorization: Bearer <token>
6. Backend middleware декодирует токен, получает userId и role
7. roleMiddleware проверяет права доступа
```

---

## Структура файлов Backend

```
backend/
├── prisma/
│   ├── schema.prisma          # Описание всех таблиц БД
│   ├── seed.ts                # Скрипт заполнения тестовыми данными
│   └── migrations/            # История изменений схемы БД
├── public/
│   └── images/                # Локальные картинки для новостей
│       ├── news1.jpg
│       ├── news2.jpg
│       └── ...
├── src/
│   ├── index.ts               # Точка входа: настройка Express, маршруты
│   ├── lib/
│   │   └── prisma.ts          # Singleton клиент Prisma
│   ├── middleware/
│   │   ├── auth.middleware.ts  # Проверка JWT токена
│   │   └── role.middleware.ts  # Проверка роли пользователя
│   └── modules/
│       ├── auth/              # Вход, получение профиля
│       ├── users/             # Список пользователей (только ADMIN)
│       ├── news/              # CRUD новостей
│       ├── resources/         # CRUD ресурсов
│       ├── categories/        # CRUD категорий
│       └── notifications/     # Отправка уведомлений, регистрация токенов
├── .env                       # Переменные окружения (не в git)
├── .env.example               # Шаблон .env
├── package.json
└── tsconfig.json
```

---

## Структура файлов Mobile

```
mobile/
├── src/
│   ├── types/
│   │   └── index.ts           # Все TypeScript интерфейсы и типы
│   ├── services/              # Слой работы с API
│   │   ├── api.ts             # Axios инстанс с базовым URL и токеном
│   │   ├── auth.service.ts    # Вход, выход, получение профиля
│   │   ├── news.service.ts    # Новости: получение, создание, изменение
│   │   ├── resources.service.ts # Ресурсы
│   │   ├── categories.service.ts # Категории
│   │   └── notifications.service.ts # Push-уведомления
│   ├── store/
│   │   └── auth.store.ts      # Zustand: пользователь, токен, статус входа
│   ├── navigation/
│   │   ├── index.tsx          # Корневой навигатор (Auth/User/Admin)
│   │   ├── TabNavigator.tsx   # Нижние вкладки для студента/преподавателя
│   │   └── AdminNavigator.tsx # Нижние вкладки для администратора
│   ├── screens/
│   │   ├── SplashScreen.tsx   # Заставка при запуске
│   │   ├── LoginScreen.tsx    # Экран входа
│   │   ├── HomeScreen.tsx     # Главная страница
│   │   ├── ProfileScreen.tsx  # Профиль пользователя
│   │   ├── news/
│   │   │   ├── NewsListScreen.tsx    # Список новостей с поиском и фильтром
│   │   │   └── NewsDetailScreen.tsx  # Полная новость
│   │   ├── resources/
│   │   │   ├── ResourcesListScreen.tsx  # Список ресурсов с фильтром
│   │   │   └── ResourceDetailScreen.tsx # Детали ресурса + открытие ссылки
│   │   └── admin/
│   │       ├── AdminNewsListScreen.tsx    # Управление новостями
│   │       ├── AdminNewsFormScreen.tsx    # Создание/редактирование новости
│   │       ├── AdminResourceListScreen.tsx # Управление ресурсами
│   │       ├── AdminResourceFormScreen.tsx # Создание/редактирование ресурса
│   │       ├── AdminCategoriesScreen.tsx   # Управление категориями
│   │       └── AdminNotificationScreen.tsx # Отправка уведомлений
│   └── utils/
│       └── date.ts            # Форматирование дат на русском
├── App.tsx                    # Корневой компонент
├── app.json                   # Конфигурация Expo
├── babel.config.js            # Конфигурация Babel
├── package.json
└── tsconfig.json
```

---

## Навигационная схема

```
App.tsx
└── Navigation (index.tsx)
    ├── [не авторизован]
    │   ├── SplashScreen
    │   └── LoginScreen
    │
    ├── [STUDENT / TEACHER]
    │   ├── TabNavigator
    │   │   ├── HomeScreen
    │   │   ├── NewsListScreen
    │   │   ├── ResourcesListScreen
    │   │   └── ProfileScreen
    │   ├── NewsDetailScreen (stack)
    │   └── ResourceDetailScreen (stack)
    │
    └── [ADMIN]
        ├── AdminNavigator
        │   ├── AdminNewsListScreen
        │   ├── AdminResourceListScreen
        │   ├── AdminCategoriesScreen
        │   ├── AdminNotificationScreen
        │   └── ProfileScreen
        ├── AdminNewsFormScreen (stack)
        └── AdminResourceFormScreen (stack)
```
