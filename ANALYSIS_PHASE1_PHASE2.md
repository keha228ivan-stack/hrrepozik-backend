# Единый backend + БД для hrrepozik (web) и repozik-desktop2 (desktop)

## 1) Анализ репозитория сайта (`hrrepozik`)

### Что удалось установить по структуре
- Технология: Next.js + TypeScript, с `prisma/`, `src/app/`, `src/server/`, `tests/`.
- В `src/app` есть экраны/разделы:
  - `login`, `register`, `dashboard`
  - employee-модули: `certificates`, `courses`, `my-courses`, `notifications`, `profile`, `tests`
  - manager-модули: `courses`, `employees`, `notifications`, `performance`, `reports`, `training`
- В `src/app/api` есть route handlers (Next API routes):
  - `auth/login`, `auth/register`, `auth/me`
  - `courses`, `courses/[id]`
  - `enrollments`, `enrollments/[id]/status`
  - `manager/courses`, `manager/employees`
  - а также `assign-course`, `course`, `reports/summary`.

### Что удалось установить по текущему backend-контракту сайта
- Авторизация/регистрация уже есть как API-роуты, используют валидацию через `zod` и сервисный слой.
- `POST /api/auth/login` валидирует `email/password` и вызывает `loginUser`.
- `GET /api/auth/me` использует `requireAuth()` и возвращает пользователя.
- `POST /api/auth/register` нормализует ключи (`fullName/full_name/name`, `password/pass`) и вызывает `registerUser`.
- `GET /api/courses` и `POST /api/courses` ограничены ролью manager.
- `POST /api/enrollments` принимает `userId`, `courseId`, `deadline`.

### Что удалось установить по Prisma-схеме сайта
Текущая Prisma-модель (в `prisma/schema.prisma`) уже покрывает значимую часть LMS/HR:
- `User`, `Department`, `EmployeeProfile`
- `Course`, `CourseModule`, `CourseAttachment`
- `Enrollment`
- `Quiz`, `QuizQuestion`, `QuizAnswerOption`, `QuizAttempt`
- `Certificate`
- `PerformanceReview`
- `Notification`

Enum'ы:
- `UserRole`: `MANAGER | EMPLOYEE`
- `CourseStatus`: `draft | published | archived`
- `EnrollmentStatus`: `CREATED | ACTIVE | COMPLETED | CANCELLED`
- `EmployeeStatus`: `active | onboarding | vacation | inactive`

### Что важно по сайту
- Веб уже содержит «встроенный backend» в Next API routes, но это не выделенный отдельный backend-сервис.
- Контракт частично ориентирован на manager-first сценарии для курсов.
- Есть сильная база для переиспользования доменных моделей (Prisma), но не хватает части доменов из ТЗ (форум, отзывы, предложения курсов, достижения и т.д.).

---

## 2) Анализ репозитория desktop-приложения (`repozik-desktop2`)

### Что удалось установить по структуре
- Технология: Python + PySide6.
- Основные папки: `desktop_app/api`, `desktop_app/core`, `desktop_app/ui`.
- `ui/pages`: `dashboard_page.py`, `courses_page.py`, `forum_page.py`, `notifications_page.py`, `profile_page.py`.

### Клиентский API-контракт desktop
`desktop_app/api/client.py` ожидает следующие endpoint’ы:
- `GET /health`
- `POST /auth/login`
- `POST /auth/register` (с fallback-вариантами payload и альтернативными путями `/auth/signup`, `/register`, `/users/register` и т.п.)
- `GET /auth/me`
- `GET /profile`, `PATCH /profile`
- `GET /courses` (с опциональным query `q`)
- `GET /progress`
- `GET /notifications`
- `PATCH /notifications/:id/read`
- `GET /forum/topics`
- `POST /forum/topics`

### Desktop UX/поведение при недоступном backend
- Есть офлайн/демо-режим и graceful degradation.
- В `state.py` обнаружены mock/fallback данные для:
  - profile
  - courses
  - notifications
  - forum topics
- Регистрация в офлайн-режиме отключена; логин имеет демо-учётку.

### Что важно по desktop
- Desktop уже проектировался как API-клиент единой системы (не отдельный продукт).
- Есть явные ожидания по endpoint’ам, которые нужно стабилизировать единым REST-контрактом.
- Есть временная «толерантность» к несовместимым backend-контрактам (мульти-пути на register), что указывает на историческую несогласованность API.

---

## 3) Общее между web и desktop

Общее ядро уже просматривается:
- Auth (login/register/me)
- Users/Profile
- Courses
- Enrollment/Progress
- Notifications
- Базовые роли и департаменты
- Tests/Quizzes
- Certificates

Desktop дополнительно явно требует Forum.
Web дополнительно явно содержит manager-разделы и performance/reports.

---

## 4) Что не хватает относительно целевой системы из ТЗ

### Функциональные пробелы
- Нет полноценного, выделенного backend-репозитория/сервиса (отдельного от Next web).
- Нет полностью покрытого единого REST API для всех требуемых доменов.
- Нет полной унификации contracts для web и desktop.

### Домены, которые нужно добавить/расширить
С учётом ТЗ и текущих репозиториев:
- Roles (как отдельная сущность, а не только enum)
- Lessons / Materials как first-class сущности
- Assignments + submissions
- UserCourseProgress (отдельно от Enrollment)
- Achievements + UserAchievements
- ForumTopics + ForumMessages
- Reviews
- CourseSuggestions
- История прохождения / рейтинг / рекомендации

---

## 5) Архитектурная основа (без реализации)

### Предлагаемый формат
Создать отдельный backend-проект (Node.js + TypeScript + NestJS + Prisma + PostgreSQL), который станет единым API для:
- web-клиента (Next frontend)
- desktop-клиента (PySide)
- будущего mobile-клиента

### Почему отдельный backend
- Разводит frontend и серверную бизнес-логику.
- Убирает дублирование и «клиентскую» импровизацию вокруг API.
- Централизует auth, роли, ACL, audit и доменные правила.

### Базовые bounded contexts
- Auth
- Users
- Roles
- Departments
- Courses (modules, lessons, materials)
- Enrollments / Progress
- Tests (questions, answers, attempts)
- Assignments
- Achievements / Certificates
- Notifications
- Forum (topics/messages)
- Reviews
- CourseSuggestions
- Reporting/Rating

### Базовый API-принцип
- `/api/*` — единый namespace.
- JWT Bearer auth.
- RBAC на уровне guards/policies.
- Пагинация/фильтрация/поиск в list endpoint’ах.
- Единый формат ошибок.

---

## 6) Предварительное соответствие endpoint’ов (web+desktop → unified API)

Минимальный «bridge»-набор для быстрого подключения desktop без ломки:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/health`
- `GET /api/profile`
- `PATCH /api/profile`
- `GET /api/courses`
- `GET /api/progress`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/forum/topics`
- `POST /api/forum/topics`

И расширенный набор — по вашему полному ТЗ (auth/users/courses/lessons/tests/assignments/history/forum/reviews/suggestions/notifications/system).

---

## 7) Выявленные противоречия/риски, которые нужно закрыть на этапе проектирования

1. **Role-модель**: сейчас в web это enum (`MANAGER/EMPLOYEE`), в целевом ТЗ нужны роли как сущность + минимум `employee/admin/manager`.
2. **Course progress**: сейчас есть `Enrollment.progress`, но в целевой модели нужен более богатый `user_course_progress`.
3. **Forum**: desktop уже ожидает `/forum/topics`, но в текущей Prisma-схеме web forum-таблиц нет.
4. **Register-контракт**: desktop пробует несколько payload/path из-за нестабильности API — нужно зафиксировать единый контракт.
5. **Монолит Next API vs отдельный backend**: требуется миграционный слой, чтобы web не ломался.

---

## 8) Что делаем дальше (следующий этап)

На следующем шаге (после вашего подтверждения):
1. Утверждаю финальную ER-модель (PostgreSQL + Prisma) по вашему списку сущностей.
2. Утверждаю полный REST-контракт (с DTO и примерами ответов).
3. Под это создаю полноценный backend-кодbase в этом репозитории:
   - NestJS структура модулей
   - Prisma schema + migrations + seed
   - JWT auth + roles/guards
   - Swagger
   - централизованный error handler + logger
   - CORS/env/readme
4. Подготовлю точечные изменения для web и desktop на единый `API_BASE_URL`.

---

## Ограничения текущего анализа

- Прямое `git clone` обоих внешних репозиториев из среды завершалось ошибкой `CONNECT tunnel failed, response 403`, поэтому анализ выполнен через web-доступ к GitHub-страницам/файлам.
- Из-за формата отдачи некоторых raw-файлов (desktop) часть данных прочитана как «сжатая строка», но ключевые endpoint-ожидания и fallback-логика выделены.
