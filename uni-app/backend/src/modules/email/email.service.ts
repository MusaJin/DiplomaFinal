import nodemailer, { Transporter } from 'nodemailer';
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

// Настроена ли рассылка (есть ли SMTP-креды)
export function isEmailConfigured(): boolean {
  return Boolean(env.SMTP_USER && env.SMTP_PASS);
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendBroadcastEmail(dto: SendEmailDto) {
  const from = env.MAIL_FROM || env.SMTP_USER!;

  // Вложения берём по публичной ссылке (nodemailer сам их подтянет)
  const attachments = (dto.attachments || []).map((a) => ({
    filename: a.name,
    path: a.url,
  }));

  // Реальные адресаты в Bcc — получатели не видят друг друга
  const info = await getTransporter().sendMail({
    from,
    to: from,
    bcc: dto.recipients,
    subject: dto.subject,
    text: dto.body,
    attachments,
  });

  return {
    accepted: Array.isArray(info.accepted) ? info.accepted.length : dto.recipients.length,
    recipients: dto.recipients.length,
  };
}
