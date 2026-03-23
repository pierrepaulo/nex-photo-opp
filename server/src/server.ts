import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { container } from '@/container';
import { corsAllowedOrigins, env } from '@/infrastructure/config/env';
import { errorHandler } from '@/presentation/middleware/errorHandler';
import { createLogMiddleware } from '@/presentation/middleware/logMiddleware';
import { apiRoutes } from '@/presentation/routes';

const app = express();
app.set('trust proxy', 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (corsAllowedOrigins.includes(origin)) {
        callback(null, origin);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(createLogMiddleware(container.repositories.logRepository));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', apiRoutes);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.info(`Server running on port ${env.PORT}`);
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

