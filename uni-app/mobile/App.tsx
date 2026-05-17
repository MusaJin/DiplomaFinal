import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './src/navigation';
import { useAuthStore } from './src/store/auth.store';
import { registerForPushNotifications } from './src/services/notifications.service';

export default function App() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotifications();
    }
  }, [isAuthenticated]);

  return (
    <>
      <StatusBar style="auto" />
      <Navigation />
    </>
  );
}
