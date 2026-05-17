# Установка и запуск

## Требования

| Программа | Версия | Скачать |
|---|---|---|
| Node.js | 20+ | https://nodejs.org |
| PostgreSQL | 15+ | https://postgresql.org |
| Android Studio | Любая | https://developer.android.com/studio |
| Expo Go (телефон) | Актуальная | Google Play / App Store |

---

## Быстрый старт (все команды)

```bash
# 1. Установить зависимости backend
cd uni-app/backend
npm install

# 2. Создать .env (скопировать из примера и заполнить)
cp .env.example .env
# Отредактировать DATABASE_URL в .env

# 3. Применить миграции и заполнить данными
npx prisma migrate dev --name init
npm run prisma:seed

# 4. Запустить backend
npm run dev

# --- В новом терминале ---

# 5. Установить зависимости mobile
cd uni-app/mobile
npm install

# 6. Указать IP сервера в api.ts (для физического устройства)
# Отредактировать src/services/api.ts → API_URL

# 7. Запустить mobile
npx expo start --android   # для Android эмулятора
npx expo start --ios       # для iOS симулятора
npx expo start --lan       # для физического устройства (Expo Go)
```

---

## Файл .env (Backend)

Создать файл `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:ПАРОЛЬ@localhost:5432/uni_app"
JWT_SECRET="длинная-строка-минимум-32-символа"
JWT_EXPIRES_IN="7d"
PORT=3000
```

Где `ПАРОЛЬ` — пароль пользователя postgres, заданный при установке PostgreSQL.

---

## Настройка IP для мобильного приложения

Файл `mobile/src/services/api.ts`:

```ts
// Android эмулятор — хост машина всегда 10.0.2.2
const API_URL = 'http://10.0.2.2:3000';

// iOS симулятор — хост машина всегда localhost
const API_URL = 'http://localhost:3000';

// Физический телефон — ваш локальный IP (телефон и компьютер в одной Wi-Fi)
// Windows: ipconfig → IPv4 Address
// Mac/Linux: ifconfig | grep inet
const API_URL = 'http://192.168.X.X:3000';
```

---

## Создание Android эмулятора

Проблема: Expo Go не работает на Android 14+ (API 34+).
Решение: Использовать Android 11 (API 30).

```bash
# Посмотреть установленные образы
sdkmanager --list_installed | grep system-images

# Установить Android 11
sdkmanager "system-images;android-30;google_apis;x86_64"

# Создать эмулятор
avdmanager create avd -n "Pixel_4_API30" \
  -k "system-images;android-30;google_apis;x86_64" \
  -d "pixel_4" --force

# Запустить эмулятор
emulator -avd Pixel_4_API30

# Проверить подключение
adb devices
```

---

## Сброс и повторное заполнение БД

```bash
cd backend

# Полный сброс (удаляет все данные и миграции)
npx prisma migrate reset

# Только заполнить заново (без сброса миграций)
npm run prisma:seed
```

---

## Управление процессами

### Windows — проверить занятые порты
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :8081
```

### Windows — освободить порт
```powershell
# Найти PID процесса на порту 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
# Убить процесс
Stop-Process -Id <PID> -Force
```

---

## Структура переменных окружения

| Переменная | Пример | Описание |
|---|---|---|
| DATABASE_URL | postgresql://postgres:pass@localhost:5432/uni_app | Строка подключения к PostgreSQL |
| JWT_SECRET | my-secret-key-32chars | Секретный ключ для подписи JWT |
| JWT_EXPIRES_IN | 7d | Срок действия токена |
| PORT | 3000 | Порт HTTP сервера |

---

## Возможные проблемы

### Backend не запускается
```
Error: Can't reach database server
```
→ Убедитесь что PostgreSQL запущен и пароль в .env правильный.

### Приложение не подключается к API
```
Network request failed
```
→ Проверьте IP в `api.ts`. Для эмулятора должен быть `10.0.2.2`, не `localhost`.

### Expo Go: "main has not been registered"
→ Эмулятор на Android 14+. Нужен Android 11 (API 30) или ниже.

### Порт 8081 занят
```bash
# Убить процесс на 8081
npx kill-port 8081
# или
npx expo start --port 8082
```
