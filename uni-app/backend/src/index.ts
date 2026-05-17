import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import authRouter from './modules/auth/auth.router';
import usersRouter from './modules/users/users.router';
import newsRouter from './modules/news/news.router';
import resourcesRouter from './modules/resources/resources.router';
import categoriesRouter from './modules/categories/categories.router';
import notificationsRouter from './modules/notifications/notifications.router';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

// Маршруты
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/news', newsRouter);
app.use('/resources', resourcesRouter);
app.use('/categories', categoriesRouter);
app.use('/notifications', notificationsRouter);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', message: 'Сервер работает', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
