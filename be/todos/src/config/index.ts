export const config = {
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017',
  mongodbDbName: process.env.MONGODB_DB_NAME || 'todos_db',
};

