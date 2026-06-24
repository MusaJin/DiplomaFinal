import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import { env, corsOrigins } from './config/env';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

import authRouter from './modules/auth/auth.router';
import usersRouter from './modules/users/users.router';
import newsRouter from './modules/news/news.router';
import resourcesRouter from './modules/resources/resources.router';
import categoriesRouter from './modules/categories/categories.router';
import notificationsRouter from './modules/notifications/notifications.router';
import uploadRouter from './modules/upload/upload.router';

const app = express();

app.use(helmet());
// origin: true — отражает origin запроса (разрешить все); массив — ограничить списком из env
app.use(cors({ origin: corsOrigins ?? true }));
app.use(express.json());

// crossOriginResourcePolicy ослабляем только для статики, чтобы изображения грузились из веб-клиента
app.use('/images', helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }), express.static(path.join(__dirname, '..', 'public', 'images')));
app.use('/files', helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }), express.static(path.join(__dirname, '..', 'public', 'files')));

// Маршруты
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/news', newsRouter);
app.use('/resources', resourcesRouter);
app.use('/categories', categoriesRouter);
app.use('/notifications', notificationsRouter);
app.use('/upload', uploadRouter);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', message: 'Сервер работает', timestamp: new Date().toISOString() });
});

// Обработка несуществующих маршрутов и ошибок (после всех роутов)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Сервер запущен на порту ${env.PORT} (${env.NODE_ENV})`);
  console.log(`Health check: http://localhost:${env.PORT}/health`);
});
