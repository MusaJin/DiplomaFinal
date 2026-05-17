import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import NewsListScreen from '../screens/news/NewsListScreen';
import ResourcesListScreen from '../screens/resources/ResourcesListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            NewsList: focused ? 'newspaper' : 'newspaper-outline',
            ResourcesList: focused ? 'book' : 'book-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#1E40AF',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '800', fontSize: 18 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
      <Tab.Screen name="NewsList" component={NewsListScreen} options={{ title: 'Новости' }} />
      <Tab.Screen name="ResourcesList" component={ResourcesListScreen} options={{ title: 'Ресурсы' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль', headerShown: false }} />
    </Tab.Navigator>
  );
}
