import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AdminNotificationScreen from './AdminNotificationScreen';
import AdminEmailScreen from './AdminEmailScreen';

type BroadcastTab = 'push' | 'email';

export default function AdminBroadcastScreen() {
  const [tab, setTab] = useState<BroadcastTab>('push');

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => setTab('push')} activeOpacity={0.7}>
          <Ionicons
            name={tab === 'push' ? 'notifications' : 'notifications-outline'}
            size={18}
            color={tab === 'push' ? '#7C3AED' : '#94A3B8'}
          />
          <Text style={[styles.tabText, tab === 'push' && styles.tabTextActive]}>Push</Text>
          {tab === 'push' && <View style={styles.indicator} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={() => setTab('email')} activeOpacity={0.7}>
          <Ionicons
            name={tab === 'email' ? 'mail' : 'mail-outline'}
            size={18}
            color={tab === 'email' ? '#7C3AED' : '#94A3B8'}
          />
          <Text style={[styles.tabText, tab === 'email' && styles.tabTextActive]}>Email</Text>
          {tab === 'email' && <View style={styles.indicator} />}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tab === 'push' ? <AdminNotificationScreen /> : <AdminEmailScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 14,
    position: 'relative',
  },
  tabText: { fontSize: 14, fontWeight: '700', color: '#94A3B8' },
  tabTextActive: { color: '#7C3AED' },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 24,
    right: 24,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
  },
  content: { flex: 1 },
});
