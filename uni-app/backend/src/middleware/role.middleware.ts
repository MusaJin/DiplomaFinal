import { Request, Response, NextFunction } from 'express';

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Необходима авторизация' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Недостаточно прав доступа' });
      return;
    }

    next();
  };
}
