import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categories.service';
import { Category, CategoryType } from '../../types';

const typeLabels: Record<CategoryType, string> = {
  NEWS: 'Новости',
  RESOURCE: 'Ресурсы',
  COMMON: 'Общее',
};

const typeColors: Record<CategoryType, string> = {
  NEWS: '#1E40AF',
  RESOURCE: '#059669',
  COMMON: '#D97706',
};

export default function AdminCategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('NEWS');
  const [isSaving, setIsSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить категории');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setType('NEWS');
    setModalVisible(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setType(cat.type);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Введите название категории');
      return;
    }
    setIsSaving(true);
    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, { name: name.trim(), type });
        setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
      } else {
        const created = await createCategory({ name: name.trim(), type });
        setCategories(prev => [...prev, created]);
      }
      setModalVisible(false);
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить категорию');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Удалить категорию',
      `Удалить "${name}"? Связанный контент не удалится.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(id);
              setCategories(prev => prev.filter(c => c.id !== id));
            } catch {
              Alert.alert('Ошибка', 'Не удалось удалить категорию');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.card}>
      <View style={[styles.typeDot, { backgroundColor: typeColors[item.type] }]} />
      <View style={styles.cardContent}>
        <Text style={styles.catName}>{item.name}</Text>
        <Text style={[styles.catType, { color: typeColors[item.type] }]}>{typeLabels[item.type]}</Text>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
        <Ionicons name="pencil-outline" size={18} color="#64748B" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.name)}>
        <Ionicons name="trash-outline" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#1E40AF" /></View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="list-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>Категорий нет</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Модальное окно создания/редактирования */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{editingCategory ? 'Изменить категорию' : 'Новая категория'}</Text>

            <Text style={styles.fieldLabel}>Название</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Название категории"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.fieldLabel}>Тип</Text>
            <View style={styles.typeRow}>
              {(['NEWS', 'RESOURCE', 'COMMON'] as CategoryType[]).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeBtn, type === t && { backgroundColor: typeColors[t], borderColor: typeColors[t] }]}
                  onPress={() => setType(t)}
                >
                  <Text style={[styles.typeBtnText, type === t && { color: '#fff' }]}>{typeLabels[t]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Сохранить</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, gap: 10, paddingBottom: 90 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  typeDot: { width: 10, height: 10, borderRadius: 5 },
  cardContent: { flex: 1 },
  catName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  catType: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  editBtn: { padding: 7 },
  deleteBtn: { padding: 7 },
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.55)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 },
  modalTitle: { fontSize: 19, fontWeight: '800', color: '#0F172A', marginBottom: 22 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 7 },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 13,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 18,
  },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 26 },
  typeBtn: { flex: 1, padding: 11, borderRadius: 12, backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center' },
  typeBtnText: { fontSize: 13, color: '#475569', fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center' },
  cancelBtnText: { fontSize: 15, color: '#475569', fontWeight: '700' },
  saveBtn: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#1E40AF', alignItems: 'center' },
  saveBtnText: { fontSize: 15, color: '#ffffff', fontWeight: '800' },
});
