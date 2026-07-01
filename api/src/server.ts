import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { healthCheck } from './database';
import { createWebSocketServer } from './websocket/index';

import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import licensesRoutes from './routes/licenses.routes';
import devicesRoutes from './routes/devices.routes';
import updatesRoutes from './routes/updates.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await healthCheck();
  const status = dbHealthy ? 'healthy' : 'degraded';
  res.status(dbHealthy ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbHealthy ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/licenses', licensesRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/updates', updatesRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(config.port, () => {
    console.log(`API server running on port ${config.port}`);
  });

  const wss = createWebSocketServer();
  console.log(`WebSocket server running on port ${config.wsPort}`);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down...');
    wss.close();
    server.close(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down...');
    wss.close();
    server.close(() => process.exit(0));
  });
}

export default app;
