import { Request, Response } from 'express';
import { z } from 'zod';
import { sendPushNotification, registerDeviceToken, getNotificationsList } from './notifications.service';

const sendSchema = z.object({
  title: z.string().min(2, 'Заголовок слишком короткий'),
  body: z.string().min(5, 'Текст слишком короткий'),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),
});

const registerTokenSchema = z.object({
  token: z.string().min(1, 'Токен обязателен'),
  platform: z.enum(['ios', 'android', 'web']),
});

export async function send(req: Request, res: Response): Promise<void> {
  const result = sendSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Ошибка валидации', errors: result.error.flatten() });
    return;
  }

  try {
    const data = await sendPushNotification(result.data);
    res.json({
      message: `Уведомление отправлено на ${data.sentCount} устройств`,
      notification: data.notification,
      sentCount: data.sentCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка отправки';
    res.status(500).json({ message });
  }
}

export async function registerToken(req: Request, res: Response): Promise<void> {
  const result = registerTokenSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Ошибка валидации', errors: result.error.flatten() });
    return;
  }

  try {
    const deviceToken = await registerDeviceToken(
      req.user!.userId,
      result.data.token,
      result.data.platform
    );
    res.json({ message: 'Токен зарегистрирован', deviceToken });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка регистрации токена';
    res.status(500).json({ message });
  }
}

export async function listNotifications(req: Request, res: Response): Promise<void> {
  try {
    const notifications = await getNotificationsList();
    res.json(notifications);
  } catch {
    res.status(500).json({ message: 'Ошибка получения уведомлений' });
  }
}
