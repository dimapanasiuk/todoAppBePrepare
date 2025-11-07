# Todos Service Dockerfile
FROM node:20-alpine

# Установка рабочей директории
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci --only=production

# Копирование исходного кода
COPY . .

# Компиляция TypeScript
RUN npm run build

# Открытие порта
EXPOSE 3001

# Запуск приложения
CMD ["node", "dist/index.js"]
