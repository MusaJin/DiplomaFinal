import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AdminNewsListScreen from '../screens/admin/AdminNewsListScreen';
import AdminResourceListScreen from '../screens/admin/AdminResourceListScreen';
import AdminCategoriesScreen from '../screens/admin/AdminCategoriesScreen';
import AdminNotificationScreen from '../screens/admin/AdminNotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AdminTabParamList } from '../types';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            AdminNewsList: focused ? 'newspaper' : 'newspaper-outline',
            AdminResourceList: focused ? 'book' : 'book-outline',
            AdminCategories: focused ? 'grid' : 'grid-outline',
            AdminNotification: focused ? 'notifications' : 'notifications-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        headerStyle: {
          backgroundColor: '#5B21B6',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '800', fontSize: 18 },
      })}
    >
      <Tab.Screen name="AdminNewsList" component={AdminNewsListScreen} options={{ title: 'Новости' }} />
      <Tab.Screen name="AdminResourceList" component={AdminResourceListScreen} options={{ title: 'Ресурсы' }} />
      <Tab.Screen name="AdminCategories" component={AdminCategoriesScreen} options={{ title: 'Категории' }} />
      <Tab.Screen name="AdminNotification" component={AdminNotificationScreen} options={{ title: 'Рассылка' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль', headerShown: false }} />
    </Tab.Navigator>
  );
}
