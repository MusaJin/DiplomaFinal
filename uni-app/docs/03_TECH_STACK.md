# Технологический стек

## Backend

### Node.js 20
Среда выполнения JavaScript на сервере. Выбрана за высокую производительность на I/O операциях (запросы к БД, HTTP), огромную экосистему npm и единый язык с frontend (TypeScript).

### Express 4
Минималистичный HTTP-фреймворк для Node.js. Выбран вместо NestJS намеренно — для учебного проекта Express проще понять и объяснить на защите. Вся маршрутизация прозрачна и читаема без "магии" декораторов.

**Как используется:**
```ts
// src/index.ts — подключение роутеров
app.use('/auth', authRouter);
app.use('/news', newsRouter);
// и т.д.
```

### TypeScript 5
Строгая типизация JavaScript. Позволяет поймать большинство ошибок на этапе написания кода, а не в рантайме. Все модели, DTO и ответы API типизированы.

### Prisma ORM 5
Современный ORM для работы с базой данных. Ключевые преимущества:
- Автогенерация TypeScript типов из схемы БД
- Читаемый синтаксис запросов
- Система миграций
- Prisma Studio — визуальный редактор БД

**Пример запроса:**
```ts
const news = await prisma.news.findMany({
  where: { isPublished: true },
  include: {
    author: { select: { fullName: true } },
    category: { select: { name: true } },
  },
  orderBy: { publishedAt: 'desc' },
});
```

### PostgreSQL 18
Реляционная база данных. Выбрана за надёжность, поддержку транзакций, богатые возможности запросов и широкое распространение в production-системах.

### JWT (jsonwebtoken)
JSON Web Token — стандарт авторизации. Токен содержит зашифрованную информацию о пользователе (userId, role) и не требует хранения сессии на сервере. Срок действия — 7 дней.

**Структура токена:**
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjbHh4eCIsInJvbGUiOiJBRE1JTiJ9.xxx
```

### bcryptjs
Библиотека для безопасного хеширования паролей. Пароли никогда не хранятся в открытом виде — только хеш с солью (cost factor 10).

### Zod
Библиотека валидации данных на TypeScript. Используется для проверки входящих данных в каждом endpoint.

**Пример:**
```ts
const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});
```

---

## Mobile

### React Native 0.73
Фреймворк для разработки нативных мобильных приложений на JavaScript/TypeScript. Код пишется один раз — компилируется в нативные компоненты iOS и Android. Выбран как основное требование темы диплома.

### Expo SDK 50
Платформа поверх React Native, упрощающая разработку:
- Не нужна Xcode / Android Studio для запуска
- Готовые нативные модули (камера, уведомления, SecureStore)
- Expo Go — мгновенный просмотр приложения на телефоне
- Metro Bundler — быстрая пересборка при изменениях

### React Navigation 6
Стандартная библиотека навигации для React Native:
- `createNativeStackNavigator` — стек экранов (переходы между страницами)
- `createBottomTabNavigator` — нижняя панель вкладок

### Zustand 4
Лёгкая библиотека управления глобальным состоянием. Альтернатива Redux — проще, меньше кода, без boilerplate.

**Пример store:**
```ts
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    const data = await loginService(email, password);
    set({ user: data.user, isAuthenticated: true });
  },
  logout: async () => {
    await logoutService();
    set({ user: null, isAuthenticated: false });
  },
}));
```

### Axios 1
HTTP-клиент для запросов к backend API. Настроен с:
- Базовым URL сервера
- Автоматическим добавлением JWT токена в заголовок
- Перехватчиком ответов (401 → выход из системы)

### Expo SecureStore
Зашифрованное хранилище для конфиденциальных данных. JWT токен хранится здесь, а не в AsyncStorage, потому что SecureStore использует системное шифрование (Keychain на iOS, Keystore на Android).

### Expo Notifications
Библиотека push-уведомлений. Регистрирует устройство и получает Expo Push Token, который передаётся на сервер для последующей рассылки.

### @expo/vector-icons (Ionicons)
Набор из 1300+ иконок. Используется по всему приложению для визуального обозначения действий и типов контента.

---

## Инструменты разработки

| Инструмент | Назначение |
|---|---|
| ts-node-dev | Запуск TypeScript с горячей перезагрузкой при изменениях |
| Prisma Studio | Визуальный интерфейс для просмотра и редактирования БД |
| Prisma Migrate | Версионированные миграции схемы БД |
| Metro Bundler | Сборщик JavaScript для React Native |
| Expo Go | Приложение для тестирования без сборки APK |

---

## Почему именно этот стек

| Требование | Решение | Причина |
|---|---|---|
| Кросс-платформенность | React Native + Expo | Один код для Android и iOS |
| Простой backend | Express + TypeScript | Прозрачная архитектура, легко объяснить |
| Надёжная БД | PostgreSQL + Prisma | Промышленный стандарт, типобезопасные запросы |
| Безопасность | JWT + bcrypt | Стандарты индустрии, не изобретаем велосипед |
| Читаемый код | TypeScript везде | Самодокументируемый, меньше ошибок |
