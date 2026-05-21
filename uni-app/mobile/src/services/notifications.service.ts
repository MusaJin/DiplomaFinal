import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from './api';

export async function registerForPushNotifications(): Promise<string | null> {
  try {
    // Динамический импорт — не падает при загрузке модуля
    const Device = await import('expo-device');
    const Notifications = await import('expo-notifications');

    // expo-device экспортирует isDevice как named export, не через default
    if (!Device.isDevice) {
      console.warn('Push-уведомления работают только на реальном устройстве');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Разрешение на уведомления не получено');
      return null;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    await api.post('/notifications/register-token', {
      token,
      platform: Platform.OS,
    });

    return token;
  } catch (error) {
    console.warn('Push-уведомления недоступны:', error);
    return null;
  }
}

export async function sendNotification(
  title: string,
  body: string,
  entityType?: string,
  entityId?: string
) {
  const response = await api.post('/notifications/send', {
    title,
    body,
    relatedEntityType: entityType,
    relatedEntityId: entityId,
  });
  return response.data;
}
