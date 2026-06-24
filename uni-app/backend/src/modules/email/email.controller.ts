import { Request, Response } from 'express';
import { z } from 'zod';
import { sendBroadcastEmail, isEmailConfigured } from './email.service';

const sendSchema = z.object({
  recipients: z.array(z.string().email('Некорректный email-адрес')).min(1, 'Добавьте хотя бы одного получателя'),
  subject: z.string().min(2, 'Введите тему (минимум 2 символа)'),
  body: z.string().min(2, 'Введите текст сообщения'),
  attachments: z
    .array(z.object({ url: z.string().url(), name: z.string() }))
    .optional(),
});

export async function send(req: Request, res: Response): Promise<void> {
  const result = sendSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Ошибка валидации', errors: result.error.flatten() });
    return;
  }

  if (!isEmailConfigured()) {
    res.status(503).json({ message: 'Email-рассылка не настроена на сервере' });
    return;
  }

  try {
    const data = await sendBroadcastEmail(result.data);
    res.status(201).json({ message: 'Письма отправлены', ...data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка отправки писем';
    res.status(500).json({ message });
  }
}
