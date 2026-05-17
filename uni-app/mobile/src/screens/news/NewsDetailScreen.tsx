import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { getNewsById } from '../../services/news.service';
import { News, RootStackParamList } from '../../types';
import { formatDateTime } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;

function NewsDetailImage({ uri }: { uri: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <Image source={{ uri }} style={styles.image} onError={() => setFailed(true)} />;
}

export default function NewsDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, [id]);

  const loadNews = async () => {
    try {
      const data = await getNewsById(id);
      setNews(data);
      navigation.setOptions({ title: data.title.length > 28 ? data.title.slice(0, 28) + '…' : data.title });
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить новость');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (!news) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {news.imageUrl && (
        <NewsDetailImage uri={news.imageUrl} />
      )}

      <View style={styles.content}>
        {news.category && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{news.category.name}</Text>
          </View>
        )}

        <Text style={styles.title}>{news.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="person-circle-outline" size={16} color="#64748B" />
            <Text style={styles.metaText}>{news.author.fullName}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={15} color="#64748B" />
            <Text style={styles.metaText}>{formatDateTime(news.publishedAt || news.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.leadBlock}>
          <Text style={styles.leadText}>{news.shortDescription}</Text>
        </View>

        <Text style={styles.body}>{news.content}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9' },

  image: { width: '100%', height: 240, backgroundColor: '#E2E8F0' },

  content: { padding: 20 },

  badge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  badgeText: { fontSize: 12, color: '#1E40AF', fontWeight: '700' },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 32,
    marginBottom: 16,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: '#64748B' },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 },

  leadBlock: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: '#1E40AF',
    borderRadius: 4,
    padding: 14,
    marginBottom: 20,
  },
  leadText: { fontSize: 16, color: '#334155', fontWeight: '600', lineHeight: 24 },

  body: { fontSize: 16, color: '#334155', lineHeight: 26 },
});
