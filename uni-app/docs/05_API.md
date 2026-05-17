# API документация

## Общие принципы

**Базовый URL:** `http://localhost:3000`

**Формат данных:** JSON (`Content-Type: application/json`)

**Авторизация:** Bearer Token в заголовке:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Формат ошибок:**
```json
{
  "message": "Описание ошибки"
}
```

**Коды ответов:**
| Код | Значение |
|---|---|
| 200 | Успешно |
| 201 | Создано |
| 400 | Ошибка валидации |
| 401 | Не авторизован |
| 403 | Нет прав доступа |
| 404 | Не найдено |
| 500 | Ошибка сервера |

---

## Auth — Авторизация

### POST /auth/login
Вход в систему. Не требует токена.

**Тело запроса:**
```json
{
  "email": "admin@university.ru",
  "password": "password123"
}
```

**Ответ 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "clxxx...",
    "fullName": "Козлов Дмитрий Александрович",
    "email": "admin@university.ru",
    "role": "ADMIN",
    "faculty": "Администрация",
    "createdAt": "2026-04-07T17:00:00.000Z",
    "updatedAt": "2026-04-07T17:00:00.000Z"
  }
}
```

---

### GET /auth/me
Получить профиль текущего пользователя. Требует токен.

**Ответ 200:**
```json
{
  "id": "clxxx...",
  "fullName": "Новиков Артём Сергеевич",
  "email": "student@university.ru",
  "role": "STUDENT",
  "faculty": "Факультет информационных технологий",
  "createdAt": "2026-04-07T17:00:00.000Z",
  "updatedAt": "2026-04-07T17:00:00.000Z"
}
```

---

## News — Новости

### GET /news
Получить список новостей. Требует токен.

Администратор видит все новости (включая черновики).
Остальные пользователи — только опубликованные.

**Query параметры:**
| Параметр | Тип | Описание |
|---|---|---|
| categoryId | string | Фильтр по ID категории |
| search | string | Поиск по заголовку и описанию |

**Пример:** `GET /news?categoryId=clxxx&search=конференция`

**Ответ 200:**
```json
[
  {
    "id": "clxxx...",
    "title": "Международная конференция",
    "shortDescription": "Краткое описание...",
    "content": "Полный текст...",
    "imageUrl": "http://10.0.2.2:3000/images/news1.jpg",
    "isPublished": true,
    "publishedAt": "2026-04-05T10:00:00.000Z",
    "authorId": "clxxx...",
    "categoryId": "clxxx...",
    "author": { "id": "clxxx...", "fullName": "Козлов Дмитрий Александрович" },
    "category": { "id": "clxxx...", "name": "Наука и исследования" },
    "createdAt": "2026-04-05T09:00:00.000Z",
    "updatedAt": "2026-04-05T10:00:00.000Z"
  }
]
```

---

### GET /news/:id
Получить новость по ID. Требует токен.

**Ответ 200:** Объект новости (см. выше)
**Ответ 404:** `{ "message": "Новость не найдена" }`

---

### POST /news
Создать новость. Требует токен. Только ADMIN.

**Тело запроса:**
```json
{
  "title": "Заголовок новости",
  "shortDescription": "Краткое описание для карточки",
  "content": "Полный текст новости...",
  "imageUrl": "http://example.com/image.jpg",
  "categoryId": "clxxx...",
  "isPublished": true
}
```

Поля `imageUrl` и `categoryId` — необязательные.

**Ответ 201:** Созданный объект новости

---

### PATCH /news/:id
Обновить новость. Требует токен. Только ADMIN.

**Тело запроса:** Любые поля из POST (все необязательные).

При первой смене `isPublished: false → true` автоматически устанавливается `publishedAt`.

**Ответ 200:** Обновлённый объект новости

---

### DELETE /news/:id
Удалить новость. Требует токен. Только ADMIN.

**Ответ 200:** `{ "message": "Новость удалена" }`

---

## Resources — Образовательные ресурсы

### GET /resources
Получить список ресурсов. Требует токен.

**Query параметры:**
| Параметр | Тип | Описание |
|---|---|---|
| categoryId | string | Фильтр по категории |
| type | string | Фильтр по типу: LINK / FILE / TEXT |

**Ответ 200:**
```json
[
  {
    "id": "clxxx...",
    "title": "Электронная библиотека университета",
    "description": "Доступ к каталогу...",
    "type": "LINK",
    "url": "https://library.university.ru",
    "fileUrl": null,
    "categoryId": "clxxx...",
    "category": { "id": "clxxx...", "name": "Библиотека" },
    "isPublished": true,
    "createdAt": "2026-04-07T17:00:00.000Z",
    "updatedAt": "2026-04-07T17:00:00.000Z"
  }
]
```

---

### GET /resources/:id
Получить ресурс по ID.

---

### POST /resources
Создать ресурс. Только ADMIN.

```json
{
  "title": "Название ресурса",
  "description": "Описание",
  "type": "LINK",
  "url": "https://example.com",
  "categoryId": "clxxx...",
  "isPublished": true
}
```

---

### PATCH /resources/:id
Обновить ресурс. Только ADMIN.

---

### DELETE /resources/:id
Удалить ресурс. Только ADMIN.

---

## Categories — Категории

### GET /categories
Получить список категорий. Требует токен.

**Query параметры:**
| Параметр | Значения | Описание |
|---|---|---|
| type | NEWS / RESOURCE / COMMON | Фильтр по типу |

**Ответ 200:**
```json
[
  {
    "id": "clxxx...",
    "name": "Мероприятия",
    "type": "NEWS",
    "createdAt": "2026-04-07T17:00:00.000Z",
    "updatedAt": "2026-04-07T17:00:00.000Z"
  }
]
```

---

### POST /categories
Создать категорию. Только ADMIN.

```json
{
  "name": "Название категории",
  "type": "NEWS"
}
```

---

### PATCH /categories/:id
Обновить категорию. Только ADMIN.

---

### DELETE /categories/:id
Удалить категорию. Только ADMIN.

> Связанный контент (новости/ресурсы) не удаляется — у них просто убирается ссылка на категорию.

---

## Notifications — Уведомления

### POST /notifications/send
Отправить push-уведомление всем пользователям. Только ADMIN.

**Тело запроса:**
```json
{
  "title": "Важное объявление",
  "body": "Текст уведомления",
  "relatedEntityType": "news",
  "relatedEntityId": "clxxx..."
}
```

`relatedEntityType` и `relatedEntityId` — необязательные (для deep link в уведомлении).

**Ответ 200:**
```json
{
  "message": "Уведомление отправлено на 3 устройств",
  "notification": { "id": "clxxx...", "title": "...", "sentAt": "..." },
  "sentCount": 3
}
```

**Как работает отправка:**
1. Сервер получает все device_tokens из БД
2. Фильтрует токены, начинающиеся с `ExponentPushToken`
3. Отправляет батч запрос на `https://exp.host/--/api/v2/push/send`
4. Expo серверы доставляют уведомления на устройства

---

### POST /notifications/register-token
Зарегистрировать push-токен устройства. Требует токен.

```json
{
  "token": "ExponentPushToken[xxxx]",
  "platform": "android"
}
```

Используется `upsert` — если токен уже есть, обновляет userId. Это нужно если пользователь вышел и зашёл под другим аккаунтом на том же устройстве.

---

### GET /notifications
Список отправленных уведомлений (последние 50). Только ADMIN.

---

## Users — Пользователи

### GET /users
Список всех пользователей. Только ADMIN.

**Ответ 200:**
```json
[
  {
    "id": "clxxx...",
    "fullName": "Новиков Артём Сергеевич",
    "email": "student@university.ru",
    "role": "STUDENT",
    "faculty": "Факультет информационных технологий",
    "createdAt": "2026-04-07T17:00:00.000Z"
  }
]
```

---

## Проверка API через curl

```bash
# 1. Получить токен
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@university.ru","password":"password123"}' \
  | python -c "import sys,json; print(json.load(sys.stdin)['token'])")

# 2. Получить новости
curl http://localhost:3000/news \
  -H "Authorization: Bearer $TOKEN"

# 3. Создать новость
curl -X POST http://localhost:3000/news \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Тест","shortDescription":"Краткое","content":"Полный текст","isPublished":true}'

# 4. Отправить уведомление
curl -X POST http://localhost:3000/notifications/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Тест","body":"Тестовое уведомление"}'
```
