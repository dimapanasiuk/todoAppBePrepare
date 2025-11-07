#!/bin/bash

echo "🚀 Starting TODO App with Redis"
echo "================================"
echo ""

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found! Please install Docker first."
    exit 1
fi

# Запуск Redis
echo "1. Starting Redis..."
docker-compose -f docker-compose.redis.yml up -d

# Ждем пока Redis запустится
sleep 2

# Проверка Redis
echo ""
echo "2. Checking Redis..."
if redis-cli ping > /dev/null 2>&1; then
    echo "   ✅ Redis is running"
else
    echo "   ❌ Redis failed to start!"
    exit 1
fi

echo ""
echo "================================"
echo "✅ Redis is ready!"
echo ""
echo "Next steps:"
echo ""
echo "Terminal 1 (Auth Service):"
echo "  cd be/auth && npm install && npm run dev"
echo ""
echo "Terminal 2 (Todos Service):"
echo "  cd be/todos && npm install && npm run dev"
echo ""
echo "📖 Documentation:"
echo "  - Quick Start: be/REDIS_QUICKSTART.md"
echo "  - Checklist: be/REDIS_CHECKLIST.md"
echo "  - Full Docs: be/REDIS_SETUP.md"
