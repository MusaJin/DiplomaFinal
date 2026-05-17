import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuthStore } from '../store/auth.store';
import { RootStackParamList } from '../types';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import AdminNavigator from './AdminNavigator';
import NewsDetailScreen from '../screens/news/NewsDetailScreen';
import ResourceDetailScreen from '../screens/resources/ResourceDetailScreen';
import AdminNewsFormScreen from '../screens/admin/AdminNewsFormScreen';
import AdminResourceFormScreen from '../screens/admin/AdminResourceFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { isLoading, isAuthenticated, user, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E40AF' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : user?.role === 'ADMIN' ? (
          <>
            <Stack.Screen name="AdminMain" component={AdminNavigator} />
            <Stack.Screen
              name="NewsDetail"
              component={NewsDetailScreen}
              options={{ headerShown: true, title: 'Новость' }}
            />
            <Stack.Screen
              name="AdminNewsForm"
              component={AdminNewsFormScreen}
              options={{ headerShown: true, title: 'Новость' }}
            />
            <Stack.Screen
              name="AdminResourceForm"
              component={AdminResourceFormScreen}
              options={{ headerShown: true, title: 'Ресурс' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="NewsDetail"
              component={NewsDetailScreen}
              options={{ headerShown: true, title: 'Новость', headerBackTitle: 'Назад' }}
            />
            <Stack.Screen
              name="ResourceDetail"
              component={ResourceDetailScreen}
              options={{ headerShown: true, title: 'Ресурс', headerBackTitle: 'Назад' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
