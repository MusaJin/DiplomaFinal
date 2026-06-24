import api from './api';

export interface EmailAttachment {
  url: string;
  name: string;
}

export async function sendEmail(
  recipients: string[],
  subject: string,
  body: string,
  attachments: EmailAttachment[] = []
) {
  const response = await api.post('/email/send', { recipients, subject, body, attachments });
  return response.data;
}
