// Достаёт человекочитаемое сообщение об ошибке из ответа API/axios.
export function getErrorMessage(error: any, fallback = 'Что-то пошло не так'): string {
  // Серверное сообщение (Express/Zod): { message: '...' }
  const serverMessage = error?.response?.data?.message;
  if (typeof serverMessage === 'string' && serverMessage.length > 0) return serverMessage;

  // Нет связи с сервером (таймаут / бэкенд недоступен)
  if (error?.code === 'ECONNABORTED') return 'Превышено время ожидания. Проверьте соединение.';
  if (error?.message === 'Network Error') return 'Нет связи с сервером. Проверьте интернет.';

  if (typeof error?.message === 'string' && error.message.length > 0) return error.message;
  return fallback;
}
