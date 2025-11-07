export const config = {
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
};

