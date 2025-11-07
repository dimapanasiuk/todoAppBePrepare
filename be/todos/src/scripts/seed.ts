/**
 * Seed Script для Todos Service
 * 
 * Назначение:
 * - Заполняет базу данных тестовыми задачами для разработки
 * - Создает задачи для конкретного пользователя
 * 
 * Когда использовать:
 * - После создания тестовых пользователей (npm run seed:auth)
 * - Когда нужны тестовые задачи для UI разработки
 * - Для демонстрации функционала приложения
 * 
 * Запуск:
 * - npm run seed:todos (из корня be/)
 * - npm run seed (из директории todos/)
 * 
 * ⚠️ ВАЖНО:
 * - Перед запуском нужно:
 *   1. Создать пользователя через npm run seed:auth
 *   2. Получить его ID из MongoDB
 *   3. Обновить testUserId в этом файле
 * 
 * Как получить ID пользователя:
 * 1. docker exec -it todo-mongodb mongosh -u admin -p admin123
 * 2. use auth_db
 * 3. db.users.findOne({ email: "test@example.com" })
 * 4. Скопировать значение _id
 * 
 * Что создается:
 * - 5 тестовых задач с разными названиями и описаниями
 * - Все задачи привязаны к одному пользователю
 * 
 * Безопасность:
 * - ⚠️ НЕ использовать в production!
 * - Только для development окружения
 */

import { connectDB, disconnectDB } from '../utils/mongodb';
import { taskModel } from '../models/taskModel';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Подключаемся к базе данных
    await connectDB();
    
    // ⚠️ ВАЖНО: Замените на реальный ID пользователя из auth_db!
    // Получить ID можно через: db.users.findOne({ email: "test@example.com" })
    const testUserId = 'test-user-id'; // TODO: Заменить на реальный ID
    
    // Тестовые задачи для разработки
    const testTasks = [
      {
        title: 'Купить молоко',
        description: 'В магазине на углу',
      },
      {
        title: 'Написать отчет',
        description: 'Квартальный отчет по проекту',
      },
      {
        title: 'Позвонить клиенту',
        description: 'Обсудить новый контракт',
      },
      {
        title: 'Сделать презентацию',
        description: 'Для встречи в понедельник',
      },
      {
        title: 'Обновить документацию',
        description: 'Добавить новые API endpoints',
      }
    ];
    
    console.log(`\n📝 Creating ${testTasks.length} test tasks for user: ${testUserId}...`);
    console.log('⚠️  Note: Make sure this user exists in auth_db!');
    
    // Создаем каждую задачу
    for (const taskData of testTasks) {
      const task = await taskModel.create(taskData, testUserId);
      console.log(`   ✅ Created: ${task.title}`);
    }
    
    console.log('\n✅ Database seeding completed!');
    console.log(`\n📋 Created ${testTasks.length} tasks for user: ${testUserId}`);
    console.log('\n💡 Tip: Login with test user to see these tasks in the app');
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MongoDB is running: docker ps');
    console.error('   2. Check if user exists: npm run seed:auth');
    console.error('   3. Update testUserId in this file with real user ID');
    await disconnectDB();
    process.exit(1);
  }
};

// Запуск скрипта
seedData();
