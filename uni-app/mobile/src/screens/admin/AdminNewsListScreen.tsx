import React, { useEffect, useState, useCallback } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { getNews, deleteNews, updateNews } from '../../services/news.service';
import { News, RootStackParamList } from '../../types';
import { formatDate } from '../../utils/date';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function AdminNewsListScreen() {
  const navigation = useNavigation<Nav>();

  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = useCallback(async () => {
    try {
      const data = await getNews();
      setNews(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить новости');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Удалить новость',
      `Удалить "${title}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNews(id);
              setNews(prev => prev.filter(n => n.id !== id));
            } catch {
              Alert.alert('Ошибка', 'Не удалось удалить новость');
            }
          },
        },
      ]
    );
  };

  const handleTogglePublish = async (item: News) => {
    try {
      await updateNews(item.id, { isPublished: !item.isPublished });
      setNews(prev => prev.map(n => n.id === item.id ? { ...n, isPublished: !n.isPublished } : n));
    } catch {
      Alert.alert('Ошибка', 'Не удалось изменить статус');
    }
  };

  const renderItem = ({ item }: { item: News }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusDot, { backgroundColor: item.isPublished ? '#22c55e' : '#f59e0b' }]} />
        <Text style={styles.statusText}>{item.isPublished ? 'Опубликовано' : 'Черновик'}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.desc} numberOfLines={2}>{item.shortDescription}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.publishBtn]}
          onPress={() => handleTogglePublish(item)}
        >
          <Ionicons name={item.isPublished ? 'eye-off' : 'eye'} size={16} color="#1E40AF" />
          <Text style={styles.publishBtnText}>{item.isPublished ? 'Снять' : 'Опубликовать'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate('AdminNewsForm', { id: item.id })}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id, item.title)}
        >
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E40AF" />
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadNews(); }} colors={['#1E40AF']} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="newspaper-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Новостей нет</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AdminNewsForm', {})}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 7 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, color: '#475569', flex: 1, fontWeight: '500' },
  date: { fontSize: 12, color: '#94A3B8' },
  title: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 5, lineHeight: 21 },
  desc: { fontSize: 13, color: '#475569', lineHeight: 19, marginBottom: 14 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { borderRadius: 10, padding: 9, alignItems: 'center', justifyContent: 'center' },
  publishBtn: { flex: 1, flexDirection: 'row', gap: 6, backgroundColor: '#EFF6FF', borderWidth: 1.5, borderColor: '#BFDBFE' },
  publishBtnText: { fontSize: 13, color: '#1E40AF', fontWeight: '700' },
  editBtn: { backgroundColor: '#1E40AF', paddingHorizontal: 16 },
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
