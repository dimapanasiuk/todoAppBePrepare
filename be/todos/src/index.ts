import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import apiRoutes from './routes';
import { connectRedis } from './utils/redis';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'todos-service',
    timestamp: new Date().toISOString() 
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(config.port, async () => {
  console.log(`🚀 Todos Service is running on http://localhost:${config.port}`);
  console.log(`📝 API endpoints available at http://localhost:${config.port}/api/tasks`);
  console.log(`🌍 Environment: ${config.env}`);
  
  // Connect to Redis
  await connectRedis();
});

export default app;



