import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendNotification } from '../../services/notifications.service';

const templates = [
  { title: 'Важное объявление', body: 'Уважаемые студенты! Ознакомьтесь с важной информацией.', icon: 'megaphone-outline' as const, color: '#DC2626' },
  { title: 'Изменение расписания', body: 'В расписание занятий внесены изменения. Проверьте актуальную версию.', icon: 'calendar-outline' as const, color: '#D97706' },
  { title: 'Новые учебные материалы', body: 'На портале опубликованы новые образовательные ресурсы.', icon: 'book-outline' as const, color: '#059669' },
];

export default function AdminNotificationScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Ошибка', 'Введите заголовок и текст уведомления');
      return;
    }
    Alert.alert(
      'Отправить уведомление',
      'Уведомление будет отправлено всем пользователям. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отправить',
          onPress: async () => {
            setIsSending(true);
            try {
              const result = await sendNotification(title.trim(), body.trim());
              Alert.alert(
                'Успешно',
                `Уведомление отправлено на ${result.sentCount} устройств`,
                [{ text: 'OK', onPress: () => { setTitle(''); setBody(''); } }]
              );
            } catch {
              Alert.alert('Ошибка', 'Не удалось отправить уведомление');
            } finally {
              setIsSending(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {/* Инфо-карточка */}
      <View style={styles.infoCard}>
        <View style={styles.infoIcon}>
          <Ionicons name="notifications" size={28} color="#7C3AED" />
        </View>
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>Рассылка уведомлений</Text>
          <Text style={styles.infoDesc}>Отправьте push-уведомление всем пользователям приложения</Text>
        </View>
      </View>

      {/* Шаблоны */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Быстрые шаблоны</Text>
        <View style={styles.templates}>
          {templates.map((tpl, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.tplCard}
              onPress={() => { setTitle(tpl.title); setBody(tpl.body); }}
              activeOpacity={0.75}
            >
              <View style={[styles.tplIcon, { backgroundColor: tpl.color + '18' }]}>
                <Ionicons name={tpl.icon} size={18} color={tpl.color} />
              </View>
              <Text style={styles.tplText}>{tpl.title}</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Форма */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Сообщение</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Заголовок *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Заголовок уведомления"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Текст *</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={body}
            onChangeText={setBody}
            placeholder="Текст уведомления..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Предпросмотр */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Предпросмотр</Text>
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={styles.previewAppIcon}>
              <Ionicons name="school" size={14} color="#7C3AED" />
            </View>
            <Text style={styles.previewAppName}>УниВест</Text>
            <Text style={styles.previewTime}>сейчас</Text>
          </View>
          <Text style={styles.previewTitle}>{title || 'Заголовок уведомления'}</Text>
          <Text style={styles.previewBody} numberOfLines={2}>{body || 'Текст уведомления появится здесь...'}</Text>
        </View>
      </View>

      {/* Кнопка отправки */}
      <View style={styles.sendSection}>
        <TouchableOpacity
          style={[styles.sendBtn, isSending && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={isSending}
          activeOpacity={0.8}
        >
          {isSending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.sendBtnText}>Отправить всем пользователям</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  infoIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: { flex: 1 },
  infoTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  infoDesc: { fontSize: 13, color: '#64748B', marginTop: 3, lineHeight: 18 },

  section: { marginHorizontal: 16, marginBottom: 4 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 12,
  },

  templates: { gap: 8 },
  tplCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tplIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tplText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#334155' },

  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 7 },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },

  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  previewAppIcon: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewAppName: { fontSize: 12, fontWeight: '700', color: '#7C3AED', flex: 1 },
  previewTime: { fontSize: 11, color: '#94A3B8' },
  previewTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  previewBody: { fontSize: 13, color: '#475569', lineHeight: 18 },

  sendSection: { padding: 16, paddingBottom: 32 },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    padding: 17,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  sendBtnDisabled: { backgroundColor: '#C4B5FD', shadowOpacity: 0 },
  sendBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
