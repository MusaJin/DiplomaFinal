import 'dotenv/config';
import { z } from 'zod';

// Значение-заглушка из .env.example — недопустимо в реальном окружении
const placeholderSecret = 'your-super-secret-jwt-key-change-in-production';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL обязателен'),
  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET слишком короткий (минимум 16 символов)')
    .refine((v) => v !== placeholderSecret, 'JWT_SECRET использует значение из .env.example — задайте собственный секрет'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  // Список разрешённых origin через запятую; пусто → разрешить все (для нативного клиента CORS не критичен)
  CORS_ORIGIN: z.string().optional(),
  // Базовый URL для построения абсолютных ссылок на медиа (загрузки/сид)
  PUBLIC_BASE_URL: z.string().url().optional(),
  // SMTP для email-рассылки (опционально: без него бэкенд работает, но /email/send вернёт 503)
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Некорректная конфигурация окружения:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean)
  : undefined;
