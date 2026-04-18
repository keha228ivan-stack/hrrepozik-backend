# HRRepozik Backend (Unified API)

Единый backend для web (`hrrepozik`) и desktop (`repozik-desktop2`) клиентов.

## Stack
- Node.js + TypeScript + NestJS
- Prisma ORM
- SQLite для локальной разработки (без Docker)
- JWT auth
- Swagger/OpenAPI (`/docs`)

## Быстрый старт БЕЗ Docker (рекомендуется)
1. Скопируйте env:
   ```bash
   cp .env.example .env
   ```
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Сгенерируйте Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Создайте БД и примените миграции:
   ```bash
   npm run prisma:migrate
   ```
5. Заполните БД seed-данными:
   ```bash
   npm run prisma:seed
   ```
6. Запустите backend:
   ```bash
   npm run start:dev
   ```

SQLite-файл БД создастся автоматически по `DATABASE_URL="file:./dev.db"`.

API: `http://localhost:4000/api`  
Swagger: `http://localhost:4000/docs`

---

## Если хочешь PostgreSQL
Можно использовать локальный PostgreSQL или Docker-Compose (`npm run db:up`), но для старта это не обязательно.

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

## Seed пользователи
После `npm run prisma:seed`:
- manager@hrrepozik.local / password123
- employee@hrrepozik.local / password123
