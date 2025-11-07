#!/bin/bash

echo "🐳 Starting TODO App in Docker (Production Mode)"
echo "================================================"
echo ""

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found! Please install Docker first."
    exit 1
fi

# Проверка docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found! Please install docker-compose first."
    exit 1
fi

# Остановить старые контейнеры если есть
echo "1. Stopping old containers..."
docker-compose down 2>/dev/null

# Собрать образы
echo ""
echo "2. Building Docker images..."
docker-compose build

# Запустить все сервисы
echo ""
echo "3. Starting all services..."
docker-compose up -d

# Ждем пока сервисы запустятся
echo ""
echo "4. Waiting for services to start..."
sleep 10

# Проверка Redis
echo ""
echo "5. Checking services..."
if docker exec todo-redis redis-cli ping > /dev/null 2>&1; then
    echo "   ✅ Redis is running"
else
    echo "   ⚠️  Redis is not ready yet"
fi

# Проверка MongoDB
if docker exec todo-mongodb mongosh --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
    echo "   ✅ MongoDB is running"
else
    echo "   ⚠️  MongoDB is not ready yet"
fi

# Проверка Auth Service
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "   ✅ Auth Service is running"
else
    echo "   ⚠️  Auth Service is not ready yet"
fi

# Проверка Todos Service
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "   ✅ Todos Service is running"
else
    echo "   ⚠️  Todos Service is not ready yet"
fi

echo ""
echo "================================================"
echo "✅ Docker containers started!"
echo ""
echo "Services:"
echo "  Auth Service:  http://localhost:3000"
echo "  Todos Service: http://localhost:3001"
echo "  Redis:         localhost:6379"
echo "  MongoDB:       localhost:27017"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f          # View logs"
echo "  docker-compose ps               # List containers"
echo "  docker-compose down             # Stop all"
echo "  docker-compose down -v          # Stop and remove data"
echo ""
echo "📖 Documentation: START_HERE.md"
