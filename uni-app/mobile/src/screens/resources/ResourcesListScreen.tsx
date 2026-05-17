import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { getResources } from '../../services/resources.service';
import { getCategories } from '../../services/categories.service';
import { Resource, Category, RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const typeIcons = {
  LINK: 'link' as const,
  FILE: 'document-text' as const,
  TEXT: 'reader' as const,
};

const typeLabels = { LINK: 'Ссылка', FILE: 'Файл', TEXT: 'Текст' };

const typeColors = {
  LINK: { bg: '#EFF6FF', icon: '#1E40AF', badge: '#DBEAFE', badgeText: '#1E40AF' },
  FILE: { bg: '#FFFBEB', icon: '#D97706', badge: '#FEF3C7', badgeText: '#92400E' },
  TEXT: { bg: '#F0FDF4', icon: '#059669', badge: '#D1FAE5', badgeText: '#065F46' },
};

export default function ResourcesListScreen() {
  const navigation = useNavigation<Nav>();

  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [resourcesData, categoriesData] = await Promise.all([
        getResources({ categoryId: selectedCategory }),
        getCategories('RESOURCE'),
      ]);
      setResources(Array.isArray(resourcesData) ? resourcesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Ошибка загрузки ресурсов:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const renderItem = ({ item }: { item: Resource }) => {
    const colors = typeColors[item.type];
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ResourceDetail', { id: item.id })}
        activeOpacity={0.75}
      >
        <View style={[styles.iconBox, { backgroundColor: colors.bg }]}>
          <Ionicons name={typeIcons[item.type]} size={22} color={colors.icon} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardMeta}>
            <View style={[styles.typeBadge, { backgroundColor: colors.badge }]}>
              <Text style={[styles.typeText, { color: colors.badgeText }]}>{typeLabels[item.type]}</Text>
            </View>
            {item.category && (
              <Text style={styles.catText}>{item.category.name}</Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chips}>
            {[{ id: undefined, name: 'Все', type: 'RESOURCE' as const, createdAt: '', updatedAt: '' }, ...categories].map((item) => (
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
          data={resources}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E40AF']} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="book-outline" size={56} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Ресурсов не найдено</Text>
              <Text style={styles.emptyDesc}>Попробуйте выбрать другую категорию</Text>
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

  list: { paddingHorizontal: 16, paddingBottom: 20, gap: 10 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#64748B', lineHeight: 17, marginBottom: 8 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  typeText: { fontSize: 11, fontWeight: '700' },
  catText: { fontSize: 12, color: '#94A3B8' },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#64748B' },
  emptyDesc: { fontSize: 14, color: '#94A3B8' },
});
