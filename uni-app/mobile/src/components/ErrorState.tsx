import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  message?: string;
  onRetry?: () => void;
};

// Состояние ошибки загрузки с кнопкой «Повторить» (отличает сбой сети от пустого списка).
export default function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="cloud-offline-outline" size={56} color="#CBD5E1" />
      <Text style={styles.title}>Не удалось загрузить</Text>
      <Text style={styles.desc}>
        {message || 'Проверьте подключение к интернету и попробуйте снова'}
      </Text>
      {onRetry && (
        <TouchableOpacity style={styles.btn} onPress={onRetry} activeOpacity={0.8}>
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={styles.btnText}>Повторить</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32, gap: 10 },
  title: { fontSize: 17, fontWeight: '700', color: '#64748B' },
  desc: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E40AF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
