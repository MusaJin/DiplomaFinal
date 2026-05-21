# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Проект: УниВест

Мобильное приложение для студентов и преподавателей университета — новости, ресурсы, уведомления.

- **Backend**: `uni-app/backend/` — Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Mobile**: `uni-app/mobile/` — React Native 0.81 + Expo 54 + TypeScript + Zustand

## Команды

### Backend (`uni-app/backend/`)
```bash
npm run dev           # dev-сервер с hot reload (ts-node-dev)
npm run build         # компиляция TypeScript → dist/
npm start             # запуск скомпилированного dist/index.js
npx prisma migrate dev --name <name>   # создать и применить миграцию
npx prisma generate   # регенерировать Prisma Client
npm run prisma:seed   # сидировать тестовые данные
npx prisma studio     # GUI для базы данных
```
Сервер: `http://localhost:3000`, health-check: `GET /health`

Перед запуском скопировать `.env.example` → `.env` и заполнить:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/uni_app"
JWT_SECRET="..."
JWT_EXPIRES_IN="7d"
PORT=3000
```

Тестовые аккаунты после сида: `admin@university.ru`, `teacher@university.ru`, `student@university.ru` (пароль `password123`)

### Mobile (`uni-app/mobile/`)
```bash
npm start             # запуск Expo dev server (QR-код для Expo Go)
npm run android       # запуск на Android эмуляторе
npm run ios           # запуск на iOS симуляторе
```
Базовый URL API задаётся константой `API_URL` в `src/services/api.ts`: эмулятор `10.0.2.2:3000`, физическое устройство — IP машины.

## Архитектура

### Backend — модульная структура
`src/modules/{module}/` → каждый модуль содержит:
- `{module}.router.ts` — Express-роуты
- `{module}.controller.ts` — обработчики запросов
- `{module}.service.ts` — бизнес-логика + Prisma-запросы

Исключение: модуль `upload` содержит только `upload.router.ts` (логика загрузки через multer прямо в роутере).

Middleware: `auth.middleware.ts` (проверка JWT, добавляет `req.user: { userId, role }`) + `role.middleware.ts` (`requireRole(...roles)`). Валидация через Zod-схемы в контроллерах.

Статические файлы отдаются напрямую: `GET /images/:filename` и `GET /files/:filename` → папка `backend/public/`.
Загрузка через `POST /upload/image` (до 5 MB, только ADMIN) и `POST /upload/file` (до 25 MB, только ADMIN).

### API routes
| Prefix | Описание |
|--------|----------|
| `/auth` | login, register, me |
| `/users` | управление пользователями |
| `/news` | новости (CRUD) |
| `/resources` | ресурсы (CRUD) |
| `/categories` | категории (NEWS / RESOURCE / COMMON) |
| `/notifications` | push-уведомления |
| `/upload` | загрузка изображений и файлов |

### Mobile — слоистая структура
- `src/navigation/index.tsx` — корневой навигатор: проверяет токен → role-based routing
  - неаутентифицирован → `Splash` + `Login`
  - `ADMIN` → `AdminNavigator` (+ `AdminNewsForm`, `AdminResourceForm`)
  - `STUDENT` / `TEACHER` → `TabNavigator` (+ `NewsDetail`, `ResourceDetail`)
- `src/screens/` — экраны по фичам: `news/`, `resources/`, `admin/`
- `src/services/` — Axios-вызовы к API (один файл на модуль + `api.ts` с interceptors)
- `src/store/auth.store.ts` — Zustand: `{ user, token, isLoading, isAuthenticated }`, токен хранится в `expo-secure-store` под ключом `auth_token`
- `src/types/index.ts` — все TypeScript-интерфейсы + типы навигационных параметров (`RootStackParamList`, `TabParamList`, `AdminTabParamList`)

### Роли
`STUDENT` | `TEACHER` | `ADMIN` — роль хранится в JWT, проверяется middleware на бэке и навигатором на мобилке. TEACHER использует тот же `TabNavigator` что и STUDENT, отдельного навигатора нет.

### Push-уведомления
`DeviceToken` привязывается к `userId` при логине; `notifications` модуль отправляет через Expo Notifications API.

## Работа с кодом

- Чистый, читаемый, эффективный и поддерживаемый код
- Без оверинжиниринга и лишних абстракций
- Только функциональные компоненты (для React)
- Компоненты маленькие — одна ответственность
- Логика в хуках/утилитах, UI отдельно
- Понятные и единообразные названия
- Перед созданием нового компонента проверь нет ли похожего
- Не дублировать логику — переиспользовать
- Не вносить новые зависимости без явной необходимости
- Всегда анализируй существующую структуру и стиль проекта перед тем как писать код
- Строго следуй архитектуре и паттернам которые уже используются в проекте

## Визуальный стиль

- Проанализируй существующие компоненты, цвета, шрифты, отступы и паттерны
- Строго следуй этой стилистике во всех новых элементах
- Не вноси визуальные изменения если не просят

## Экономия токенов

- Не объясняй что делаешь — просто делай
- Без лишних комментариев и резюме после выполнения
- Если задача понятна — не переспрашивай
- Думай на английском, отвечай на русском

## Ответ
Перед тем как начать генерацию ответа, задай мне любые уточняющие вопросы, которые тебе необходимы для наилучшего и точного выполнения этой задачи
