# HRRepozik Backend (Unified API)

Единый backend для web (`hrrepozik`) и desktop (`repozik-desktop2`) клиентов.

## Stack
- Node.js + TypeScript + NestJS
- PostgreSQL
- Prisma ORM
- JWT auth
- Swagger/OpenAPI (`/docs`)

## Быстрый старт (рекомендуемый)
1. Скопируйте env:
   ```bash
   cp .env.example .env
   ```
2. Поднимите PostgreSQL в Docker:
   ```bash
   npm run db:up
   ```
3. Установите зависимости:
   ```bash
   npm install
   ```
4. Сгенерируйте Prisma client:
   ```bash
   npm run prisma:generate
   ```
5. Выполните миграции:
   ```bash
   npm run prisma:migrate
   ```
6. Заполните БД seed-данными:
   ```bash
   npm run prisma:seed
   ```
7. Запустите сервер:
   ```bash
   npm run start:dev
   ```

API: `http://localhost:4000/api`  
Swagger: `http://localhost:4000/docs`

---

## Решение ошибки Prisma P1001 (`Can't reach database server at localhost:5432`)

Если при `npm run prisma:migrate` вы видите:

```text
Error: P1001: Can't reach database server at `localhost:5432`
```

значит PostgreSQL не запущен или недоступен.

### Проверка/исправление (Windows PowerShell)
```powershell
# 1) Запустить контейнер с БД
npm run db:up

# 2) Убедиться, что контейнер живой
npm run db:logs

# 3) Применить миграции повторно
npm run prisma:migrate
```

Если Docker не используется — запустите локальный PostgreSQL и проверьте, что `DATABASE_URL` в `.env` соответствует реальному хосту/порту/логину/паролю.

---

## Основные endpoint'ы
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- Users/Profile: `/api/users/me`, `/api/users/me/stats`, `/api/profile`
- Courses: `/api/courses`, `/api/courses/:id`, `/api/courses/recommended`, `/api/courses/in-progress`, `/api/courses/new`, `/api/courses/:id/start`, `/api/courses/:id/pause`, `/api/courses/:id/resume`, `/api/courses/:id/progress`, `/api/courses/:id/modules`
- Lessons: `/api/lessons/:id`, `/api/lessons/:id/complete`
- Tests: `/api/courses/:id/tests`, `/api/tests/:id`, `/api/tests/:id/submit`, `/api/tests/:id/attempts`
- Assignments: `/api/courses/:id/assignments`, `/api/assignments/:id/submit`
- History/Progress: `/api/history/courses`, `/api/progress`, `/api/rating/me`
- Achievements/Certificates: `/api/achievements`, `/api/certificates`
- Forum: `/api/forum/topics`, `/api/forum/topics/:id`, `/api/forum/topics/:id/messages`
- Reviews/Suggestions: `/api/reviews`, `/api/courses/:id/reviews`, `/api/suggestions`
- Notifications: `/api/notifications`, `/api/notifications/:id/read`, `/api/notifications/read-all`
- System: `/api/health`

## Интеграция клиентов

### 1) Web (`hrrepozik`)
Минимальные изменения:
- Убрать/заморозить локальные Next API routes в `src/app/api/*` и переключить frontend на внешний backend URL.
- Создать единый конфиг, например `src/config/api.ts`, и брать `NEXT_PUBLIC_API_BASE_URL` из env.
- Все запросы вести в `fetch(`${API_BASE_URL}/api/...`)`.

Рекомендуемые env:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### 2) Desktop (`repozik-desktop2`)
Минимальные изменения:
- В `desktop_app/api/client.py` хранить один источник истины для base URL (например `REPOZIK_API_BASE_URL`), убрать fallback на legacy endpoints.
- Оставить контракты ровно под `/api/*`.

Рекомендуемые env:
```env
REPOZIK_API_BASE_URL=http://localhost:4000/api
```

## Seed пользователи
После `npm run prisma:seed`:
- manager@hrrepozik.local / password123
- employee@hrrepozik.local / password123
