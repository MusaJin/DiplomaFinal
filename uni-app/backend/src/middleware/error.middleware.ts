import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

// 404 для незарегистрированных маршрутов
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ message: 'Маршрут не найден' });
}

// Централизованный обработчик ошибок (должен иметь 4 аргумента)
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Необработанная ошибка:', err);
  const message =
    env.NODE_ENV === 'production'
      ? 'Внутренняя ошибка сервера'
      : err instanceof Error
      ? err.message
      : 'Внутренняя ошибка сервера';
  res.status(500).json({ message });
}
