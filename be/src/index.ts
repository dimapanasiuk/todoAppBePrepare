import express from 'express';
import cors from 'cors';
import { config } from './config';
import apiRoutes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(config.staticPath));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server is running on http://localhost:${config.port}`);
  console.log(`📝 API endpoints available at http://localhost:${config.port}/api/tasks`);
  console.log(`🌍 Environment: ${config.env}`);
});

export default app;
