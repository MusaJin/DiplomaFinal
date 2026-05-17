import prisma from '../../lib/prisma';

interface SendNotificationDto {
  title: string;
  body: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

/**
 * Отправка push-уведомлений через Expo Push API.
 * В production замените на Firebase FCM для Android/iOS.
 */
export async function sendPushNotification(dto: SendNotificationDto) {
  // Получаем все device tokens
  const deviceTokens = await prisma.deviceToken.findMany({
    select: { token: true, platform: true },
  });

  // Сохраняем уведомление в БД
  const notification = await prisma.notification.create({
    data: {
      title: dto.title,
      body: dto.body,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
    },
  });

  // Отправляем через Expo Push API (работает с Expo Go)
  const expoPushMessages = deviceTokens
    .filter(t => t.token.startsWith('ExponentPushToken'))
    .map(t => ({
      to: t.token,
      title: dto.title,
      body: dto.body,
      data: {
        type: dto.relatedEntityType,
        id: dto.relatedEntityId,
      },
    }));

  if (expoPushMessages.length > 0) {
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expoPushMessages),
      });

      if (!response.ok) {
        console.error('Ошибка Expo Push API:', await response.text());
      } else {
        console.log(`Отправлено ${expoPushMessages.length} уведомлений через Expo Push`);
      }
    } catch (error) {
      console.error('Ошибка при отправке уведомлений:', error);
    }
  }

  return {
    notification,
    sentCount: expoPushMessages.length,
    totalDevices: deviceTokens.length,
  };
}

export async function registerDeviceToken(userId: string, token: string, platform: string) {
  // Upsert — обновляем если токен уже есть, создаем если нет
  return prisma.deviceToken.upsert({
    where: { token },
    update: { userId, platform },
    create: { userId, token, platform },
  });
}

export async function getNotificationsList() {
  return prisma.notification.findMany({
    orderBy: { sentAt: 'desc' },
    take: 50,
  });
}
