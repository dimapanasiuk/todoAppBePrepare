#!/bin/bash

echo "🚀 Starting TODO App Backend (Development Mode)"
echo "==============================================="
echo ""

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found! Please install Docker first."
    exit 1
fi

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install Node.js first."
    exit 1
fi

# Запуск Redis и MongoDB
echo "1. Starting Redis & MongoDB..."
docker-compose -f docker-compose.dev.yml up -d

# Ждем пока сервисы запустятся
sleep 5

# Проверка Redis
echo ""
echo "2. Checking Redis..."
if docker exec todo-redis redis-cli ping > /dev/null 2>&1; then
    echo "   ✅ Redis is running"
else
    echo "   ❌ Redis failed to start!"
    exit 1
fi

# Проверка MongoDB
echo ""
echo "3. Checking MongoDB..."
if docker exec todo-mongodb mongosh --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
    echo "   ✅ MongoDB is running"
else
    echo "   ❌ MongoDB failed to start!"
    exit 1
fi

# Установка зависимостей если нужно
echo ""
echo "4. Checking dependencies..."

if [ ! -d "auth/node_modules" ]; then
    echo "   Installing Auth service dependencies..."
    cd auth && npm install && cd ..
fi

if [ ! -d "todos/node_modules" ]; then
    echo "   Installing Todos service dependencies..."
    cd todos && npm install && cd ..
fi

# Создать директорию для логов если не существует
mkdir -p logs

echo ""
echo "==============================================="
echo "✅ Starting services..."
echo ""
echo "Auth Service:  http://localhost:3000"
echo "Todos Service: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"
echo "==============================================="
echo ""

# Функция для остановки всех процессов
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $AUTH_PID $TODOS_PID 2>/dev/null
    docker-compose -f docker-compose.dev.yml down
    echo "✅ All services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Запуск Auth сервиса
cd auth
npm run dev > ../logs/auth.log 2>&1 &
AUTH_PID=$!
cd ..

# Запуск Todos сервиса
cd todos
npm run dev > ../logs/todos.log 2>&1 &
TODOS_PID=$!
cd ..

# Ждем немного для запуска
sleep 3

# Показываем логи в реальном времени
tail -f logs/auth.log logs/todos.log
