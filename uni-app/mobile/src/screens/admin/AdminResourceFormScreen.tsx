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
import * as DocumentPicker from 'expo-document-picker';

import { getResourceById, createResource, updateResource } from '../../services/resources.service';
import { getCategories } from '../../services/categories.service';
import { uploadFile } from '../../services/upload.service';
import { Category, ResourceType, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminResourceForm'>;

const resourceTypes: { value: ResourceType; label: string }[] = [
  { value: 'LINK', label: 'Ссылка' },
  { value: 'FILE', label: 'Файл' },
  { value: 'TEXT', label: 'Текст' },
];

export default function AdminResourceFormScreen({ route, navigation }: Props) {
  const { id } = route.params ?? {};
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ResourceType>('LINK');
  const [url, setUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [isPublished, setIsPublished] = useState(false);

  const [fileName, setFileName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Редактировать ресурс' : 'Новый ресурс' });
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const cats = await getCategories('RESOURCE');
      setCategories(cats);

      if (isEdit && id) {
        const resource = await getResourceById(id);
        setTitle(resource.title);
        setDescription(resource.description);
        setType(resource.type);
        setUrl(resource.url || '');
        setFileUrl(resource.fileUrl || '');
        if (resource.fileUrl) setFileName('Прикреплённый файл');
        setCategoryId(resource.categoryId || undefined);
        setIsPublished(resource.isPublished);
      }
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setIsLoading(false);
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    setIsUploading(true);
    try {
      const uploaded = await uploadFile(asset.uri, asset.name, asset.mimeType);
      setFileUrl(uploaded.url);
      setFileName(uploaded.name);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Не удалось загрузить файл';
      Alert.alert('Ошибка', msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Ошибка', 'Заполните обязательные поля');
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        type,
        url: url.trim() || undefined,
        fileUrl: fileUrl.trim() || undefined,
        categoryId,
        isPublished,
      };

      if (isEdit && id) {
        await updateResource(id, data);
      } else {
        await createResource(data);
      }

      Alert.alert('Успешно', isEdit ? 'Ресурс обновлен' : 'Ресурс создан', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить ресурс');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#1E40AF" /></View>;
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Тип ресурса *</Text>
          <View style={styles.typeRow}>
            {resourceTypes.map(t => (
              <TouchableOpacity
                key={t.value}
                style={[styles.typeBtn, type === t.value && styles.typeBtnActive]}
                onPress={() => setType(t.value)}
              >
                <Text style={[styles.typeBtnText, type === t.value && styles.typeBtnTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Название *</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Название ресурса" placeholderTextColor="#9ca3af" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Описание *</Text>
          <TextInput style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription} placeholder="Описание ресурса" placeholderTextColor="#9ca3af" multiline numberOfLines={4} />
        </View>

        {(type === 'LINK') && (
          <View style={styles.field}>
            <Text style={styles.label}>URL ссылки</Text>
            <TextInput style={styles.input} value={url} onChangeText={setUrl} placeholder="https://..." placeholderTextColor="#9ca3af" keyboardType="url" autoCapitalize="none" />
          </View>
        )}

        {(type === 'FILE') && (
          <View style={styles.field}>
            <Text style={styles.label}>Файл</Text>
            {!!fileName && (
              <View style={styles.fileChip}>
                <Text style={styles.fileChipName} numberOfLines={1}>{fileName}</Text>
                <TouchableOpacity onPress={() => { setFileUrl(''); setFileName(''); }}>
                  <Text style={styles.fileChipRemove}>Убрать</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
              onPress={pickFile}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#1E40AF" size="small" />
              ) : (
                <Text style={styles.uploadButtonText}>
                  {fileUrl ? 'Заменить файл' : 'Загрузить с устройства'}
                </Text>
              )}
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              value={fileUrl}
              onChangeText={setFileUrl}
              placeholder="или вставьте ссылку https://..."
              placeholderTextColor="#9ca3af"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Категория</Text>
          <View style={styles.categoryGrid}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, categoryId === cat.id && styles.catChipActive]}
                onPress={() => setCategoryId(categoryId === cat.id ? undefined : cat.id)}
              >
                <Text style={[styles.catChipText, categoryId === cat.id && styles.catChipTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Опубликовать</Text>
            <Text style={styles.switchDesc}>{isPublished ? 'Виден пользователям' : 'Черновик'}</Text>
          </View>
          <Switch value={isPublished} onValueChange={setIsPublished} trackColor={{ true: '#1E40AF' }} />
        </View>

        <TouchableOpacity style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>{isEdit ? 'Сохранить' : 'Создать ресурс'}</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { padding: 16, gap: 16, paddingBottom: 32 },
  field: {},
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 7 },
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
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  uploadButton: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    paddingVertical: 13,
    alignItems: 'center',
  },
  uploadButtonDisabled: { opacity: 0.6 },
  uploadButtonText: { color: '#1E40AF', fontSize: 14, fontWeight: '700' },
  fileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 8,
    gap: 12,
  },
  fileChipName: { flex: 1, fontSize: 14, color: '#0F172A', fontWeight: '600' },
  fileChipRemove: { fontSize: 13, color: '#DC2626', fontWeight: '700' },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: {
    flex: 1,
    padding: 11,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: '#1E40AF', borderColor: '#1E40AF' },
  typeBtnText: { fontSize: 13, color: '#475569', fontWeight: '700' },
  typeBtnTextActive: { color: '#ffffff' },
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
