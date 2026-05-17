import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { getNews } from '../../services/news.service';
import { getCategories } from '../../services/categories.service';
import { News, Category, RootStackParamList } from '../../types';
import { formatDate } from '../../utils/date';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function NewsImage({ uri, style }: { uri: string; style: object }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <Image source={{ uri }} style={style} onError={() => setFailed(true)} />;
}

export default function NewsListScreen() {
  const navigation = useNavigation<Nav>();

  const [news, setNews] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [newsData, categoriesData] = await Promise.all([
        getNews({ categoryId: selectedCategory, search: search || undefined }),
        getCategories('NEWS'),
      ]);
      setNews(Array.isArray(newsData) ? newsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, search]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const renderNewsItem = ({ item }: { item: News }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('NewsDetail', { id: item.id })}
      activeOpacity={0.75}
    >
      {item.imageUrl && (
        <NewsImage uri={item.imageUrl} style={styles.cardImage} />
      )}
      <View style={styles.cardBody}>
        {item.category && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category.name}</Text>
          </View>
        )}
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={3}>{item.shortDescription}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.authorRow}>
            <Ionicons name="person-circle-outline" size={14} color="#94A3B8" />
            <Text style={styles.cardMeta} numberOfLines={1}>{item.author.fullName}</Text>
          </View>
          <Text style={styles.cardDate}>{formatDate(item.publishedAt || item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Поиск */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск новостей..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Категории */}
      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chips}>
            {[{ id: undefined, name: 'Все', type: 'NEWS' as const, createdAt: '', updatedAt: '' }, ...categories].map((item) => (
              <TouchableOpacity
                key={item.id ?? 'all'}
                style={[styles.chip, selectedCategory === item.id && styles.chipActive]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Text style={[styles.chipText, selectedCategory === item.id && styles.chipTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E40AF" />
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id}
          renderItem={renderNewsItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E40AF']} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="newspaper-outline" size={56} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Новостей не найдено</Text>
              <Text style={styles.emptyDesc}>Попробуйте изменить запрос или фильтр</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  searchWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#0F172A' },

  chipsContainer: { height: 52 },
  chips: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#1E40AF', borderColor: '#1E40AF' },
  chipText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  chipTextActive: { color: '#ffffff' },

  list: { paddingHorizontal: 16, paddingBottom: 20, gap: 14 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  cardImage: { width: '100%', height: 170, backgroundColor: '#E2E8F0' },
  cardBody: { padding: 16 },
  badge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  badgeText: { fontSize: 11, color: '#1E40AF', fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 6, lineHeight: 22 },
  cardDesc: { fontSize: 13, color: '#475569', lineHeight: 19, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  cardMeta: { fontSize: 12, color: '#94A3B8', flex: 1 },
  cardDate: { fontSize: 12, color: '#94A3B8' },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#64748B' },
  emptyDesc: { fontSize: 14, color: '#94A3B8' },
});
