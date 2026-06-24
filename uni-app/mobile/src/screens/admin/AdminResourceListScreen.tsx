import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { getResources, deleteResource } from '../../services/resources.service';
import { Resource, RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const typeIcons = { LINK: 'link' as const, FILE: 'document-text' as const, TEXT: 'text' as const };
const typeLabels = { LINK: 'Ссылка', FILE: 'Файл', TEXT: 'Текст' };

export default function AdminResourceListScreen() {
  const navigation = useNavigation<Nav>();

  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadResources = useCallback(async () => {
    try {
      const data = await getResources();
      setResources(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить ресурсы');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Перезагружаем при каждом фокусе экрана (после возврата с формы создания/редактирования)
  useFocusEffect(
    useCallback(() => {
      loadResources();
    }, [loadResources])
  );

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Удалить ресурс',
      `Удалить "${title}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteResource(id);
              setResources(prev => prev.filter(r => r.id !== id));
            } catch {
              Alert.alert('Ошибка', 'Не удалось удалить ресурс');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Resource }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.iconBox, { backgroundColor: typeBg[item.type] }]}>
          <Ionicons name={typeIcons[item.type]} size={20} color={typeColors[item.type]} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardType}>{typeLabels[item.type]}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: item.isPublished ? '#22c55e' : '#f59e0b' }]} />
      </View>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate('AdminResourceForm', { id: item.id })}
        >
          <Ionicons name="pencil" size={14} color="#1E40AF" />
          <Text style={styles.editBtnText}>Изменить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id, item.title)}
        >
          <Ionicons name="trash" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#1E40AF" /></View>
      ) : (
        <FlatList
          data={resources}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadResources(); }} colors={['#1E40AF']} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="book-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Ресурсов нет</Text>
            </View>
          }
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AdminResourceForm', {})}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const typeColors = { LINK: '#1E40AF', FILE: '#D97706', TEXT: '#059669' };
const typeBg = { LINK: '#EFF6FF', FILE: '#FFFBEB', TEXT: '#F0FDF4' };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, gap: 12, paddingBottom: 90 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconBox: { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  cardType: { fontSize: 12, color: '#475569', fontWeight: '500', marginTop: 2 },
  statusDot: { width: 9, height: 9, borderRadius: 5 },
  cardDesc: { fontSize: 13, color: '#475569', lineHeight: 19, marginBottom: 14 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { borderRadius: 10, padding: 9, alignItems: 'center', justifyContent: 'center' },
  editBtn: { flex: 1, flexDirection: 'row', gap: 6, backgroundColor: '#EFF6FF', borderWidth: 1.5, borderColor: '#BFDBFE' },
  editBtnText: { fontSize: 13, color: '#1E40AF', fontWeight: '700' },
  deleteBtn: { backgroundColor: '#EF4444', paddingHorizontal: 16 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 16, color: '#94A3B8', fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
});
