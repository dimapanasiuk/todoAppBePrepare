# Todo Application

Полноценное Todo приложение с backend на Express и frontend на React.

## Структура проекта

```
todo/
├── be/          # Backend (Express + TypeScript)
└── fe/          # Frontend (React + TypeScript + MUI)
```

## Быстрый старт

### 1. Redis (обязательно!)

```bash
# Запуск Redis через Docker
cd be
docker-compose -f docker-compose.redis.yml up -d

# Или используй скрипт
./start-with-redis.sh
```

### 2. Backend

```bash
# Auth Service (Terminal 1)
cd be/auth
npm install
npm run dev
# Запустится на http://localhost:3000

# Todos Service (Terminal 2)
cd be/todos
npm install
npm run dev
# Запустится на http://localhost:3001
```

### 3. Frontend

```bash
cd fe
npm install
npm run dev
# Запустится на http://localhost:5173
```

📖 **Подробнее**: см. [be/REDIS_QUICKSTART.md](be/REDIS_QUICKSTART.md)

## Технологии

### Backend

- Express.js
- TypeScript
- CORS

### Frontend

- React 18
- TypeScript
- Material-UI (MUI)
- Zustand (state management)
- Axios (HTTP client)
- Vite (build tool)

## API Endpoints

### Auth Service (http://localhost:3000)

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход (устанавливает cookie)
- `POST /api/auth/logout` - Выход (blacklist токена)
- `GET /api/auth/me` - Текущий пользователь

### Todos Service (http://localhost:3001)

- `GET /api/tasks` - Получить все задачи (с кешированием)
- `GET /api/tasks/:id` - Получить задачу по ID
- `POST /api/tasks` - Создать новую задачу
- `PUT /api/tasks/:id` - Обновить задачу
- `DELETE /api/tasks/:id` - Удалить задачу

📖 **Подробная документация**: [be/README.md](be/README.md)

## Возможности

### Функциональность

- ✅ CRUD операции для задач
- ✅ Отметка задач как выполненных
- ✅ Регистрация и авторизация пользователей
- ✅ Изоляция данных по пользователям

### Архитектура

- ✅ Микросервисная архитектура (Auth + Todos)
- ✅ JWT авторизация через httpOnly cookies
- ✅ Redis для кеширования и blacklist токенов
- ✅ Type-safe код с TypeScript
- ✅ Адаптивный дизайн
- ✅ Современный UI с Material-UI
- ✅ Централизованное управление состоянием с Zustand

### Безопасность

- ✅ HttpOnly cookies (защита от XSS)
- ✅ Token blacklist при logout
- ✅ Проверка токенов на каждом запросе
- ✅ Изоляция данных пользователей

## Разработка

Для разработки запустите оба сервера (backend и frontend) в разных терминалах.

Frontend автоматически проксирует API запросы на backend через Vite proxy.
