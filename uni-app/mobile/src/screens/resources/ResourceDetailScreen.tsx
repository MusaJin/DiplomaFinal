import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { getResourceById } from '../../services/resources.service';
import { Resource, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ResourceDetail'>;

const typeConfig = {
  LINK: {
    icon: 'link' as const,
    label: 'Внешняя ссылка',
    color: '#1E40AF',
    bg: '#EFF6FF',
    btnColor: '#1E40AF',
    btnLabel: 'Открыть ресурс',
    btnIcon: 'open-outline' as const,
  },
  FILE: {
    icon: 'document-text' as const,
    label: 'Файл для скачивания',
    color: '#D97706',
    bg: '#FFFBEB',
    btnColor: '#D97706',
    btnLabel: 'Скачать файл',
    btnIcon: 'download-outline' as const,
  },
  TEXT: {
    icon: 'reader' as const,
    label: 'Текстовый материал',
    color: '#059669',
    bg: '#F0FDF4',
    btnColor: '#059669',
    btnLabel: 'Открыть материал',
    btnIcon: 'open-outline' as const,
  },
};

export default function ResourceDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadResource(); }, [id]);

  const loadResource = async () => {
    try {
      const data = await getResourceById(id);
      setResource(data);
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить ресурс');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const openUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Ошибка', 'Невозможно открыть ссылку');
      }
    } catch {
      Alert.alert('Ошибка', 'Не удалось открыть ссылку');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  if (!resource) return null;

  const config = typeConfig[resource.type];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Шапка */}
      <View style={[styles.header, { backgroundColor: config.bg }]}>
        <View style={styles.headerDecor} />
        <View style={[styles.iconBox, { backgroundColor: '#ffffff' }]}>
          <Ionicons name={config.icon} size={40} color={config.color} />
        </View>
        <View style={[styles.typePill, { backgroundColor: config.color }]}>
          <Text style={styles.typeLabel}>{config.label}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{resource.title}</Text>

        {resource.category && (
          <View style={styles.catRow}>
            <Ionicons name="folder-outline" size={15} color="#94A3B8" />
            <Text style={styles.catText}>{resource.category.name}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Описание</Text>
        <Text style={styles.description}>{resource.description}</Text>

        {(resource.url || resource.fileUrl) && (
          <TouchableOpacity
            style={[styles.openBtn, { backgroundColor: config.btnColor }]}
            onPress={() => openUrl((resource.url || resource.fileUrl)!)}
            activeOpacity={0.8}
          >
            <Ionicons name={config.btnIcon} size={20} color="#fff" />
            <Text style={styles.openBtnText}>{config.btnLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9' },

  header: {
    padding: 36,
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  headerDecor: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeLabel: { fontSize: 13, fontWeight: '700', color: '#ffffff' },

  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A', lineHeight: 30, marginBottom: 10 },

  catRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  catText: { fontSize: 13, color: '#94A3B8' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 18 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  description: { fontSize: 16, color: '#334155', lineHeight: 26, marginBottom: 28 },

  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  openBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
