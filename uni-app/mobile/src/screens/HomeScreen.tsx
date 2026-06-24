import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '../store/auth.store';
import { getNews } from '../services/news.service';
import { getResources } from '../services/resources.service';
import { News, Resource, RootStackParamList, TabParamList } from '../types';
import { formatDate } from '../utils/date';
import { getErrorMessage } from '../utils/error';
import ErrorState from '../components/ErrorState';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const roleLabel: Record<string, string> = {
  STUDENT: 'Студент',
  TEACHER: 'Преподаватель',
  ADMIN: 'Администратор',
};

const roleBg: Record<string, string> = {
  STUDENT: '#DBEAFE',
  TEACHER: '#D1FAE5',
  ADMIN: '#EDE9FE',
};

const roleColor: Record<string, string> = {
  STUDENT: '#1E40AF',
  TEACHER: '#059669',
  ADMIN: '#7C3AED',
};

function NewsImage({ uri, style }: { uri: string; style: object }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <Image source={{ uri }} style={style} onError={() => setFailed(true)} />;
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuthStore();

  const [news, setNews] = useState<News[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [newsData, resourcesData] = await Promise.all([
        getNews(),
        getResources(),
      ]);
      setNews(Array.isArray(newsData) ? newsData.slice(0, 5) : []);
      setResources(Array.isArray(resourcesData) ? resourcesData.slice(0, 5) : []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <ErrorState message={error} onRetry={() => { setIsLoading(true); loadData(); }} />
      </View>
    );
  }

  const userRole = user?.role ?? 'STUDENT';

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E40AF']} />}
    >
      {/* Приветствие */}
      <View style={styles.greetCard}>
        <View style={styles.greetDecor} />
        <View style={styles.greetLeft}>
          <Text style={styles.greetSmall}>Добро пожаловать!</Text>
          <Text style={styles.greetName} numberOfLines={2}>{user?.fullName}</Text>
          <View style={[styles.roleBadge, { backgroundColor: roleBg[userRole] }]}>
            <Text style={[styles.roleText, { color: roleColor[userRole] }]}>
              {roleLabel[userRole]}
            </Text>
          </View>
        </View>
        <View style={styles.greetIconWrap}>
          <Ionicons name="school" size={36} color="#1E40AF" />
        </View>
      </View>

      {/* Новости */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Последние новости</Text>
          <TouchableOpacity onPress={() => navigation.navigate('NewsList')}>
            <Text style={styles.seeAll}>Все →</Text>
          </TouchableOpacity>
        </View>

        {news.length === 0 ? (
          <View style={styles.emptyBlock}>
            <Ionicons name="newspaper-outline" size={32} color="#CBD5E1" />
            <Text style={styles.emptyText}>Новостей пока нет</Text>
          </View>
        ) : (
          news.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.newsCard}
              onPress={() => navigation.navigate('NewsDetail', { id: item.id })}
              activeOpacity={0.75}
            >
              {item.imageUrl && (
                <NewsImage uri={item.imageUrl} style={styles.newsImage} />
              )}
              <View style={styles.newsBody}>
                {item.category && (
                  <View style={styles.catBadge}>
                    <Text style={styles.catText}>{item.category.name}</Text>
                  </View>
                )}
                <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.newsDesc} numberOfLines={2}>{item.shortDescription}</Text>
                <View style={styles.newsMeta}>
                  <Ionicons name="time-outline" size={12} color="#94A3B8" />
                  <Text style={styles.newsDate}>{formatDate(item.publishedAt || item.createdAt)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Ресурсы */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Образовательные ресурсы</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ResourcesList')}>
            <Text style={styles.seeAll}>Все →</Text>
          </TouchableOpacity>
        </View>

        {resources.length === 0 ? (
          <View style={styles.emptyBlock}>
            <Ionicons name="book-outline" size={32} color="#CBD5E1" />
            <Text style={styles.emptyText}>Ресурсов пока нет</Text>
          </View>
        ) : (
          resources.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.resCard}
              onPress={() => navigation.navigate('ResourceDetail', { id: item.id })}
              activeOpacity={0.75}
            >
              <View style={[styles.resIconWrap, {
                backgroundColor: item.type === 'LINK' ? '#EFF6FF' : item.type === 'FILE' ? '#FFFBEB' : '#F0FDF4',
              }]}>
                <Ionicons
                  name={item.type === 'LINK' ? 'link' : item.type === 'FILE' ? 'document-text' : 'text'}
                  size={22}
                  color={item.type === 'LINK' ? '#1E40AF' : item.type === 'FILE' ? '#D97706' : '#059669'}
                />
              </View>
              <View style={styles.resBody}>
                <Text style={styles.resTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.resDesc} numberOfLines={1}>{item.description}</Text>
                {item.category && (
                  <Text style={styles.resCat}>{item.category.name}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9' },

  greetCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  greetDecor: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
  },
  greetLeft: { flex: 1, gap: 6 },
  greetSmall: { fontSize: 13, color: '#64748B' },
  greetName: { fontSize: 19, fontWeight: '800', color: '#0F172A', lineHeight: 25 },
  roleBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  roleText: { fontSize: 12, fontWeight: '700' },
  greetIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  section: { marginHorizontal: 16, marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  seeAll: { fontSize: 14, color: '#1E40AF', fontWeight: '600' },

  newsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  newsImage: { width: '100%', height: 160, backgroundColor: '#E2E8F0' },
  newsBody: { padding: 14 },
  catBadge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  catText: { fontSize: 11, color: '#1E40AF', fontWeight: '700' },
  newsTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 5, lineHeight: 21 },
  newsDesc: { fontSize: 13, color: '#475569', lineHeight: 19, marginBottom: 8 },
  newsMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  newsDate: { fontSize: 11, color: '#94A3B8' },

  resCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  resIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resBody: { flex: 1 },
  resTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
  resDesc: { fontSize: 12, color: '#64748B', lineHeight: 17 },
  resCat: { fontSize: 11, color: '#1E40AF', fontWeight: '600', marginTop: 4 },

  emptyBlock: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 14, color: '#94A3B8' },
});
