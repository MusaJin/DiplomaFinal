import { env } from '../../config/env';

interface EmailAttachment {
  url: string;
  name: string;
}

interface SendEmailDto {
  recipients: string[];
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
}

// Настроена ли рассылка (есть ли ключ Brevo и адрес отправителя)
export function isEmailConfigured(): boolean {
  return Boolean(env.BREVO_API_KEY && env.MAIL_FROM);
}

// Отправка через Brevo HTTP API (HTTPS — не блокируется хостингом, в отличие от SMTP).
// Реальные адресаты — в bcc, чтобы не видели друг друга.
export async function sendBroadcastEmail(dto: SendEmailDto) {
  const from = env.MAIL_FROM!;

  const payload: Record<string, unknown> = {
    sender: { email: from, name: 'УниВест' },
    to: [{ email: from }],
    bcc: dto.recipients.map((email) => ({ email })),
    subject: dto.subject,
    textContent: dto.body,
  };

  if (dto.attachments && dto.attachments.length > 0) {
    payload.attachment = dto.attachments.map((a) => ({ url: a.url, name: a.name }));
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Brevo ${response.status}: ${text}`);
  }

  return { recipients: dto.recipients.length };
}
