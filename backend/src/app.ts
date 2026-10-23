import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json } from 'body-parser';
import authRoutes from './routes/auth';
import loanRoutes from './routes/loans';
import summaryRoutes from './routes/summary';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config';

const createApp = (): Application => {
  const app = express();

  // Global middleware
  app.use(helmet());
  app.use(cors({ origin: '*', credentials: true })); // adjust origin in production
  app.use(json());
  app.use(morgan('dev'));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/loans', loanRoutes);
  app.use('/api/summary', summaryRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
  });

  // Error handling middleware (must be after routes)
  app.use(errorHandler);

  return app;
};

export default createApp;
