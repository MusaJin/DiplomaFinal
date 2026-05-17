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
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

import { getNewsById, createNews, updateNews } from '../../services/news.service';
import { getCategories } from '../../services/categories.service';
import { uploadImage } from '../../services/upload.service';
import { Category, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminNewsForm'>;

export default function AdminNewsFormScreen({ route, navigation }: Props) {
  const { id } = route.params ?? {};
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [isPublished, setIsPublished] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [formError, setFormError] = useState('');

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
        setGallery(news.gallery || []);
        setCategoryId(news.categoryId || undefined);
        setIsPublished(news.isPublished);
      }
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Нет доступа', 'Разрешите доступ к галерее, чтобы выбрать фото');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (result.canceled) return;

    setIsUploading(true);
    setFormError('');
    try {
      const url = await uploadImage(result.assets[0].uri);
      setImageUrl(url);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Не удалось загрузить изображение';
      Alert.alert('Ошибка', msg);
    } finally {
      setIsUploading(false);
    }
  };

  const pickGalleryImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Нет доступа', 'Разрешите доступ к галерее, чтобы выбрать фото');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    if (result.canceled) return;

    setIsUploadingGallery(true);
    setFormError('');
    try {
      const urls = await Promise.all(result.assets.map((a) => uploadImage(a.uri)));
      setGallery((prev) => [...prev, ...urls]);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Не удалось загрузить изображения';
      Alert.alert('Ошибка', msg);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const removeGalleryImage = (url: string) => {
    setGallery((prev) => prev.filter((u) => u !== url));
  };

  const handleSave = async () => {
    setFormError('');
    setTitleError('');

    if (title.trim().length < 3) {
      setTitleError('Введите название (минимум 3 символа)');
      setFormError('Новость не создана: укажите корректное название');
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim() || undefined,
        gallery,
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
    } catch (error: any) {
      setFormError(getErrorMessage(error));
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
            style={[styles.input, !!titleError && styles.inputError]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (titleError) setTitleError('');
            }}
            placeholder="Введите заголовок новости"
            placeholderTextColor="#9ca3af"
          />
          {!!titleError && <Text style={styles.fieldError}>{titleError}</Text>}
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

        <Field label="Обложка новости">
          <Text style={styles.hint}>Основное изображение — показывается вверху новости</Text>
          {!!imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.preview} resizeMode="cover" />
          )}
          <View style={styles.imageActions}>
            <TouchableOpacity
              style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
              onPress={pickImage}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#1E40AF" size="small" />
              ) : (
                <Text style={styles.uploadButtonText}>
                  {imageUrl ? 'Заменить фото' : 'Загрузить с устройства'}
                </Text>
              )}
            </TouchableOpacity>
            {!!imageUrl && (
              <TouchableOpacity style={styles.removeButton} onPress={() => setImageUrl('')}>
                <Text style={styles.removeButtonText}>Убрать</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[styles.input, { marginTop: 8 }]}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="или вставьте ссылку https://..."
            placeholderTextColor="#9ca3af"
            keyboardType="url"
            autoCapitalize="none"
          />
        </Field>

        <Field label="Галерея">
          <Text style={styles.hint}>Необязательно — фото показываются в конце новости</Text>
          {gallery.length > 0 && (
            <View style={styles.galleryGrid}>
              {gallery.map((url) => (
                <View key={url} style={styles.galleryItem}>
                  <Image source={{ uri: url }} style={styles.galleryImage} resizeMode="cover" />
                  <TouchableOpacity
                    style={styles.galleryRemove}
                    onPress={() => removeGalleryImage(url)}
                  >
                    <Text style={styles.galleryRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={[styles.uploadButton, isUploadingGallery && styles.uploadButtonDisabled]}
            onPress={pickGalleryImages}
            disabled={isUploadingGallery}
          >
            {isUploadingGallery ? (
              <ActivityIndicator color="#1E40AF" size="small" />
            ) : (
              <Text style={styles.uploadButtonText}>Добавить фото в галерею</Text>
            )}
          </TouchableOpacity>
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

        {!!formError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{formError}</Text>
          </View>
        )}

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

function getErrorMessage(error: any): string {
  const fieldErrors = error?.response?.data?.errors?.fieldErrors;
  if (fieldErrors && typeof fieldErrors === 'object') {
    const messages = Object.values(fieldErrors).flat().filter(Boolean);
    if (messages.length) return `Новость не создана: ${messages.join(', ')}`;
  }
  const serverMessage = error?.response?.data?.message;
  if (serverMessage) return `Новость не создана: ${serverMessage}`;
  if (error?.message === 'Network Error') {
    return 'Нет связи с сервером. Проверьте подключение к интернету';
  }
  return 'Не удалось сохранить новость. Попробуйте ещё раз';
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
  inputError: { borderColor: '#DC2626' },
  fieldError: { fontSize: 12, color: '#DC2626', marginTop: 5, fontWeight: '600' },
  hint: { fontSize: 12, color: '#94A3B8', marginBottom: 8 },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  galleryItem: { position: 'relative' },
  galleryImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  galleryRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryRemoveText: { color: '#ffffff', fontSize: 16, fontWeight: '800', lineHeight: 18 },
  preview: {
    width: '100%',
    height: 170,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: '#E2E8F0',
  },
  imageActions: { flexDirection: 'row', gap: 8 },
  uploadButton: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    paddingVertical: 13,
    alignItems: 'center',
  },
  uploadButtonDisabled: { opacity: 0.6 },
  uploadButtonText: { color: '#1E40AF', fontSize: 14, fontWeight: '700' },
  removeButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: { color: '#DC2626', fontSize: 14, fontWeight: '700' },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 14,
  },
  errorBannerText: { color: '#B91C1C', fontSize: 14, fontWeight: '600' },
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
