import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getNewsById, createNews, updateNews } from '../../services/news.service';
import { getCategories } from '../../services/categories.service';
import { Category, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminNewsForm'>;

export default function AdminNewsFormScreen({ route, navigation }: Props) {
  const { id } = route.params ?? {};
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [isPublished, setIsPublished] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Редактировать новость' : 'Новая новость' });
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const cats = await getCategories('NEWS');
      setCategories(cats);

      if (isEdit && id) {
        const news = await getNewsById(id);
        setTitle(news.title);
        setShortDescription(news.shortDescription);
        setContent(news.content);
        setImageUrl(news.imageUrl || '');
        setCategoryId(news.categoryId || undefined);
        setIsPublished(news.isPublished);
      }
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !shortDescription.trim() || !content.trim()) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
        categoryId,
        isPublished,
      };

      if (isEdit && id) {
        await updateNews(id, data);
      } else {
        await createNews(data);
      }

      Alert.alert('Успешно', isEdit ? 'Новость обновлена' : 'Новость создана', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить новость');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Field label="Заголовок *">
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Введите заголовок новости"
            placeholderTextColor="#9ca3af"
          />
        </Field>

        <Field label="Краткое описание *">
          <TextInput
            style={[styles.input, styles.textarea]}
            value={shortDescription}
            onChangeText={setShortDescription}
            placeholder="Краткое описание для превью"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
          />
        </Field>

        <Field label="Содержание *">
          <TextInput
            style={[styles.input, styles.textareaLarge]}
            value={content}
            onChangeText={setContent}
            placeholder="Полный текст новости"
            placeholderTextColor="#9ca3af"
            multiline
          />
        </Field>

        <Field label="URL изображения">
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://..."
            placeholderTextColor="#9ca3af"
            keyboardType="url"
            autoCapitalize="none"
          />
        </Field>

        <Field label="Категория">
          <View style={styles.categoryGrid}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, categoryId === cat.id && styles.catChipActive]}
                onPress={() => setCategoryId(categoryId === cat.id ? undefined : cat.id)}
              >
                <Text style={[styles.catChipText, categoryId === cat.id && styles.catChipTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Field>

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Опубликовать</Text>
            <Text style={styles.switchDesc}>{isPublished ? 'Видна всем пользователям' : 'Сохранить как черновик'}</Text>
          </View>
          <Switch
            value={isPublished}
            onValueChange={setIsPublished}
            trackColor={{ true: '#1E40AF' }}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>{isEdit ? 'Сохранить изменения' : 'Создать новость'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { padding: 16, gap: 16, paddingBottom: 32 },
  field: {},
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 7 },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#0F172A',
  },
  textarea: { minHeight: 86, textAlignVertical: 'top' },
  textareaLarge: { minHeight: 168, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  catChipActive: { backgroundColor: '#1E40AF', borderColor: '#1E40AF' },
  catChipText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  catChipTextActive: { color: '#ffffff' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  switchLabel: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  switchDesc: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  saveButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 14,
    padding: 17,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#1E40AF',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  saveButtonDisabled: { backgroundColor: '#93C5FD', shadowOpacity: 0 },
  saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
});
