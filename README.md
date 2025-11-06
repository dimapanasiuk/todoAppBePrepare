# Todo Application

Полноценное Todo приложение с backend на Express и frontend на React.

## Структура проекта

```
todo/
├── be/          # Backend (Express + TypeScript)
└── fe/          # Frontend (React + TypeScript + MUI)
```

## Быстрый старт

### Backend

```bash
cd be
npm install
npm run dev
```

Backend запустится на `http://localhost:3000`

### Frontend

```bash
cd fe
npm install
npm run dev
```

Frontend запустится на `http://localhost:5173`

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

- `GET /api/tasks` - Получить все задачи
- `GET /api/tasks/:id` - Получить задачу по ID
- `POST /api/tasks` - Создать новую задачу
- `PUT /api/tasks/:id` - Обновить задачу
- `DELETE /api/tasks/:id` - Удалить задачу

## Возможности

- ✅ CRUD операции для задач
- ✅ Отметка задач как выполненных
- ✅ Адаптивный дизайн
- ✅ Современный UI с Material-UI
- ✅ Type-safe код с TypeScript
- ✅ Централизованное управление состоянием с Zustand

## Разработка

Для разработки запустите оба сервера (backend и frontend) в разных терминалах.

Frontend автоматически проксирует API запросы на backend через Vite proxy.
