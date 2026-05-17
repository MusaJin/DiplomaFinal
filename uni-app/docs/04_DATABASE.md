# База данных

## Схема базы данных

```
┌─────────────────────┐       ┌─────────────────────┐
│        users        │       │      categories      │
├─────────────────────┤       ├─────────────────────┤
│ id (PK, cuid)       │       │ id (PK, cuid)        │
│ fullName            │       │ name                 │
│ email (unique)      │       │ type (NEWS/RESOURCE/ │
│ passwordHash        │       │       COMMON)        │
│ role (STUDENT/      │       │ createdAt            │
│       TEACHER/ADMIN)│       │ updatedAt            │
│ faculty             │       └──────────┬──────────┘
│ createdAt           │                  │ 1
│ updatedAt           │                  │
└──────────┬──────────┘              ┌───┴───┐
           │ 1                       │       │
           │                        ▼       ▼
    ┌──────┴──────┐     ┌──────────────┐ ┌─────────────────┐
    │             │     │     news     │ │    resources     │
    ▼             │     ├──────────────┤ ├─────────────────┤
┌─────────────────────┐ │ id (PK)      │ │ id (PK)         │
│    device_tokens    │ │ title        │ │ title           │
├─────────────────────┤ │ shortDesc    │ │ description     │
│ id (PK)             │ │ content      │ │ type (LINK/FILE/│
│ userId (FK→users)   │ │ imageUrl     │ │       TEXT)     │
│ token (unique)      │ │ isPublished  │ │ url             │
│ platform            │ │ publishedAt  │ │ fileUrl         │
│ createdAt           │ │ authorId(FK) │ │ categoryId(FK)  │
└─────────────────────┘ │ categoryId   │ │ isPublished     │
                        │ createdAt    │ │ createdAt       │
                        │ updatedAt    │ │ updatedAt       │
                        └──────────────┘ └─────────────────┘

┌─────────────────────────────────┐
│          notifications          │
├─────────────────────────────────┤
│ id (PK)                         │
│ title                           │
│ body                            │
│ relatedEntityType (news/resource)│
│ relatedEntityId                 │
│ sentAt                          │
│ createdAt                       │
└─────────────────────────────────┘
```

---

## Таблицы подробно

### users — Пользователи

| Поле | Тип | Описание |
|---|---|---|
| id | String (cuid) | Уникальный идентификатор |
| fullName | String | Полное имя пользователя |
| email | String (unique) | Email, используется для входа |
| passwordHash | String | Хеш пароля (bcrypt, cost=10) |
| role | Enum | STUDENT / TEACHER / ADMIN |
| faculty | String? | Факультет (опционально) |
| createdAt | DateTime | Дата создания |
| updatedAt | DateTime | Дата последнего изменения |

**Роли:**
- `STUDENT` — студент, только чтение
- `TEACHER` — преподаватель, только чтение (роль существует в системе для разграничения)
- `ADMIN` — администратор, полный доступ к управлению контентом

---

### categories — Категории

| Поле | Тип | Описание |
|---|---|---|
| id | String (cuid) | Уникальный идентификатор |
| name | String | Название категории |
| type | Enum | NEWS / RESOURCE / COMMON |
| createdAt | DateTime | Дата создания |
| updatedAt | DateTime | Дата изменения |

**Типы категорий:**
- `NEWS` — для новостей (Конференции, Мероприятия и т.д.)
- `RESOURCE` — для ресурсов (Библиотека, Платформы и т.д.)
- `COMMON` — общие (Расписание — подходит для любого контента)

**Текущие категории в системе:**
```
NEWS:     Общие объявления, Мероприятия, Наука и исследования, Гранты и стипендии
RESOURCE: Библиотека, Методические материалы, Учебные платформы
COMMON:   Расписание и консультации
```

---

### news — Новости

| Поле | Тип | Описание |
|---|---|---|
| id | String (cuid) | Уникальный идентификатор |
| title | String | Заголовок новости |
| shortDescription | String | Краткое описание (для карточки) |
| content | String | Полный текст новости |
| imageUrl | String? | URL изображения (опционально) |
| isPublished | Boolean | Опубликована или черновик |
| publishedAt | DateTime? | Дата публикации |
| authorId | String (FK) | Ссылка на пользователя-автора |
| categoryId | String? (FK) | Ссылка на категорию |
| createdAt | DateTime | Дата создания |
| updatedAt | DateTime | Дата изменения |

**Логика публикации:**
- `isPublished = false` — черновик, виден только администратору
- `isPublished = true` — опубликована, видна всем пользователям
- При первой публикации автоматически устанавливается `publishedAt = now()`

---

### resources — Образовательные ресурсы

| Поле | Тип | Описание |
|---|---|---|
| id | String (cuid) | Уникальный идентификатор |
| title | String | Название ресурса |
| description | String | Описание |
| type | Enum | LINK / FILE / TEXT |
| url | String? | URL для ссылки |
| fileUrl | String? | URL для файла (скачивание) |
| categoryId | String? (FK) | Ссылка на категорию |
| isPublished | Boolean | Опубликован или нет |
| createdAt | DateTime | Дата создания |
| updatedAt | DateTime | Дата изменения |

**Типы ресурсов:**
- `LINK` — внешняя ссылка (библиотека, платформа)
- `FILE` — файл для скачивания (PDF, DOCX)
- `TEXT` — текстовый материал

---

### notifications — Отправленные уведомления

| Поле | Тип | Описание |
|---|---|---|
| id | String (cuid) | Уникальный идентификатор |
| title | String | Заголовок уведомления |
| body | String | Текст уведомления |
| relatedEntityType | String? | Тип связанного объекта (news/resource) |
| relatedEntityId | String? | ID связанного объекта |
| sentAt | DateTime | Время отправки |
| createdAt | DateTime | Дата создания записи |

---

### device_tokens — Токены устройств

| Поле | Тип | Описание |
|---|---|---|
| id | String (cuid) | Уникальный идентификатор |
| userId | String (FK) | Пользователь, которому принадлежит устройство |
| token | String (unique) | Expo Push Token |
| platform | String | ios / android / web |
| createdAt | DateTime | Дата регистрации |

---

## Идентификаторы (CUID vs UUID)

В проекте используются **CUID** (Collision-resistant Unique IDentifiers) вместо UUID:
- Короче UUID при той же уникальности
- Начинается с буквы `c`, удобно для отладки
- Генерируется Prisma автоматически: `@default(cuid())`

Пример: `clxxx1234abcdef567890`

---

## Команды для работы с БД

```bash
# Создать и применить новую миграцию
npx prisma migrate dev --name название_изменения

# Просмотр схемы в браузере
npx prisma studio

# Сбросить БД и заполнить заново
npx prisma migrate reset

# Заполнить тестовыми данными
npm run prisma:seed

# Посмотреть текущее состояние миграций
npx prisma migrate status
```
