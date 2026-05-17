import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { getNewsById } from '../../services/news.service';
import { News, RootStackParamList } from '../../types';
import { formatDateTime } from '../../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;

const SCREEN = Dimensions.get('window');
const SLIDE_WIDTH = SCREEN.width - 40;

function NewsDetailImage({ uri }: { uri: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <Image source={{ uri }} style={styles.image} onError={() => setFailed(true)} />;
}

function ImageViewer({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
}) {
  return (
    <Modal visible={index !== null} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.viewerBackdrop}>
        <TouchableOpacity style={styles.viewerClose} onPress={onClose} hitSlop={10}>
          <Ionicons name="close" size={30} color="#ffffff" />
        </TouchableOpacity>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: (index ?? 0) * SCREEN.width, y: 0 }}
        >
          {images.map((uri) => (
            <Pressable key={uri} onPress={onClose} style={styles.viewerSlide}>
              <Image source={{ uri }} style={styles.viewerImage} resizeMode="contain" />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

function GallerySlider({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    if (idx !== active) setActive(idx);
  };

  return (
    <View style={styles.gallery}>
      <Text style={styles.galleryTitle}>Галерея</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((uri, i) => (
          <TouchableOpacity
            key={uri}
            activeOpacity={0.9}
            onPress={() => setViewerIndex(i)}
            style={{ width: SLIDE_WIDTH }}
          >
            <Image source={{ uri }} style={styles.slide} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((uri, i) => (
            <View key={uri} style={[styles.dot, i === active && styles.dotActive]} />
          ))}
        </View>
      )}
      <ImageViewer images={images} index={viewerIndex} onClose={() => setViewerIndex(null)} />
    </View>
  );
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

        {!!news.gallery && news.gallery.length > 0 && (
          <GallerySlider images={news.gallery} />
        )}
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

  gallery: { marginTop: 24 },
  galleryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  slide: {
    width: SLIDE_WIDTH,
    height: 240,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#1E40AF',
  },

  viewerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.96)',
  },
  viewerClose: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
  },
  viewerSlide: {
    width: SCREEN.width,
    height: SCREEN.height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerImage: {
    width: SCREEN.width,
    height: SCREEN.height * 0.8,
  },
});
