# Изменения в клиентах для подключения к единому backend

## Сайт `hrrepozik`

### Файлы для изменения
1. `src/app/api/**` (deprecate локальные API routes)
2. `src/lib/*` или текущий API wrapper (перевести на внешний backend)
3. Добавить `src/config/api.ts`:
   - экспорт `API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL`

### Что поменять
- Все запросы на `/api/...` внутри Next роутов заменить на прямые запросы к `http://<backend>/api/...`.
- Избавиться от дублирования auth-логики между Next routes и новым backend.

## Desktop `repozik-desktop2`

### Файлы для изменения
1. `desktop_app/api/client.py`
2. `desktop_app/core/config.py` (если есть) — добавить central env config

### Что поменять
- Один `base_url` из env `REPOZIK_API_BASE_URL`.
- Стандартизовать вызовы на новые endpoint'ы `/api/*`.
- Удалить мульти-fallback пути регистрации (`/register`, `/users/register` и т.д.), оставить `/api/auth/register`.

## Единый принцип
- В обоих клиентах **один source of truth** для API URL через env.
- Никакого хардкода URL в разных местах приложения.
