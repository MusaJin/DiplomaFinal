import { Request, Response } from 'express';
import { getAllUsers } from './users.service';

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Ошибка получения пользователей' });
  }
}
