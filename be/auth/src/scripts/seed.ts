/**
 * Seed Script для Auth Service
 * 
 * Назначение:
 * - Заполняет базу данных тестовыми пользователями для разработки
 * - Используется при первом запуске проекта или после очистки БД
 * 
 * Когда использовать:
 * - После первого клонирования проекта
 * - После выполнения npm run clear:auth
 * - Когда нужны тестовые пользователи для разработки/тестирования
 * 
 * Запуск:
 * - npm run seed:auth (из корня be/)
 * - npm run seed (из директории auth/)
 * 
 * Что создается:
 * - 3 тестовых пользователя с разными email и паролями
 * - Пароли автоматически хешируются через bcrypt
 * 
 * Безопасность:
 * - ⚠️ НЕ использовать в production!
 * - Только для development окружения
 */

import { connectDB, disconnectDB } from '../utils/mongodb';
import { userModel } from '../models/userModel';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Подключаемся к базе данных
    await connectDB();
    
    // Проверяем существующих пользователей
    const existingUsers = await userModel.findAll();
    
    if (existingUsers.length > 0) {
      console.log(`ℹ️  Database already has ${existingUsers.length} user(s)`);
      console.log('   Skipping seed. Use --force to override.');
      await disconnectDB();
      return;
    }
    
    // Тестовые пользователи для разработки
    const testUsers = [
      {
        email: 'test@example.com',
        password: 'password123',      // Будет автоматически захеширован
        username: 'Test User'
      },
      {
        email: 'admin@example.com',
        password: 'admin123',
        username: 'Admin User'
      },
      {
        email: 'john@example.com',
        password: 'john123',
        username: 'John Doe'
      }
    ];
    
    console.log(`\n📝 Creating ${testUsers.length} test users...`);
    
    // Создаем каждого пользователя
    for (const userData of testUsers) {
      const user = await userModel.create(userData);
      console.log(`   ✅ Created: ${user.email}`);
    }
    
    console.log('\n✅ Database seeding completed!');
    console.log('\n👤 Test users:');
    console.log('   Email: test@example.com   | Password: password123');
    console.log('   Email: admin@example.com  | Password: admin123');
    console.log('   Email: john@example.com   | Password: john123');
    console.log('\n💡 Tip: Use these credentials to login via API');
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await disconnectDB();
    process.exit(1);
  }
};

// Запуск скрипта
seedData();
