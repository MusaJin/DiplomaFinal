import Constants from 'expo-constants';

const DEV_PORT = 3000;

// В dev-режиме (Expo Go / Metro) выводим LAN-IP машины из адреса Metro-сервера,
// чтобы база работала и на эмуляторе, и на физическом устройстве без ручной правки.
function resolveDevUrl(): string {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any).expoGoConfig?.debuggerHost ??
    '';
  const host = String(hostUri).split(':')[0];
  return host ? `http://${host}:${DEV_PORT}` : `http://localhost:${DEV_PORT}`;
}

// 1) Явный URL из сборки (eas.json → env.EXPO_PUBLIC_API_URL) — прод/облако.
// 2) Иначе — авто-определение dev-адреса по хосту Metro.
const explicitUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_URL =
  explicitUrl && explicitUrl.length > 0 ? explicitUrl : resolveDevUrl();
