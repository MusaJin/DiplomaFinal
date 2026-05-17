import { Request, Response } from 'express';
import { z } from 'zod';
import { loginUser, getMe } from './auth.service';

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export async function login(req: Request, res: Response): Promise<void> {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Ошибка валидации', errors: result.error.flatten() });
    return;
  }

  try {
    const data = await loginUser(result.data.email, result.data.password);
    res.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка авторизации';
    res.status(401).json({ message });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const user = await getMe(req.user!.userId);
    res.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка получения данных';
    res.status(404).json({ message });
  }
}
