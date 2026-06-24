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
import * as DocumentPicker from 'expo-document-picker';

import { sendEmail } from '../../services/email.service';
import { getUsers } from '../../services/users.service';
import { uploadFile } from '../../services/upload.service';
import { getErrorMessage } from '../../utils/error';
import { UserRole } from '../../types';

interface Attachment {
  url: string;
  name: string;
  size?: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export default function AdminEmailScreen() {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [addingRole, setAddingRole] = useState<UserRole | null>(null);

  const addEmail = () => {
    const value = emailInput.trim().toLowerCase();
    if (!value) return;
    if (!EMAIL_RE.test(value)) {
      Alert.alert('Ошибка', 'Некорректный email-адрес');
      return;
    }
    if (recipients.includes(value)) {
      setEmailInput('');
      return;
    }
    setRecipients((prev) => [...prev, value]);
    setEmailInput('');
  };

  const removeEmail = (email: string) => {
    setRecipients((prev) => prev.filter((e) => e !== email));
  };

  const addAllByRole = async (role: UserRole, label: string) => {
    setAddingRole(role);
    try {
      const users = await getUsers();
      const emails = users
        .filter((u) => u.role === role && EMAIL_RE.test(u.email))
        .map((u) => u.email.toLowerCase());
      setRecipients((prev) => {
        const set = new Set(prev);
        emails.forEach((e) => set.add(e));
        return Array.from(set);
      });
      const added = emails.length;
      Alert.alert('Готово', added ? `Добавлено адресов: ${added} (${label})` : `Нет адресов: ${label}`);
    } catch (error) {
      Alert.alert('Ошибка', getErrorMessage(error, 'Не удалось загрузить пользователей'));
    } finally {
      setAddingRole(null);
    }
  };

  const pickAttachment = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
      if (res.canceled || !res.assets?.length) return;
      const file = res.assets[0];
      setIsUploading(true);
      const uploaded = await uploadFile(file.uri, file.name ?? 'file', file.mimeType ?? undefined);
      setAttachments((prev) => [...prev, { url: uploaded.url, name: uploaded.name, size: file.size ?? undefined }]);
    } catch (error) {
      Alert.alert('Ошибка', getErrorMessage(error, 'Не удалось прикрепить файл'));
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setRecipients([]);
    setEmailInput('');
    setSubject('');
    setBody('');
    setAttachments([]);
  };

  const handleSend = () => {
    if (recipients.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы одного получателя');
      return;
    }
    if (!subject.trim() || !body.trim()) {
      Alert.alert('Ошибка', 'Заполните тему и текст сообщения');
      return;
    }
    Alert.alert(
      'Отправить рассылку',
      `Письмо будет отправлено на ${recipients.length} адрес(ов). Продолжить?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отправить',
          onPress: async () => {
            setIsSending(true);
            try {
              await sendEmail(recipients, subject.trim(), body.trim(), attachments.map((a) => ({ url: a.url, name: a.name })));
              Alert.alert('Успешно', `Письмо отправлено на ${recipients.length} адрес(ов)`, [
                { text: 'OK', onPress: resetForm },
              ]);
            } catch (error) {
              Alert.alert('Ошибка', getErrorMessage(error, 'Не удалось отправить письма'));
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
          <Ionicons name="mail" size={28} color="#7C3AED" />
        </View>
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>Email рассылка</Text>
          <Text style={styles.infoDesc}>Отправьте сообщение с файлами на список адресов</Text>
        </View>
      </View>

      {/* Получатели */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>Получатели</Text>
          {recipients.length > 0 && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>{recipients.length}</Text>
            </View>
          )}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputFlex}
            value={emailInput}
            onChangeText={setEmailInput}
            placeholder="email@university.ru"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={addEmail}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addEmail} activeOpacity={0.8}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {recipients.length > 0 && (
          <View style={styles.chips}>
            {recipients.map((email) => (
              <View key={email} style={styles.chip}>
                <Text style={styles.chipText}>{email}</Text>
                <TouchableOpacity onPress={() => removeEmail(email)} hitSlop={6}>
                  <Ionicons name="close" size={14} color="#5B21B6" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => addAllByRole('STUDENT', 'студенты')}
            disabled={addingRole !== null}
            activeOpacity={0.75}
          >
            {addingRole === 'STUDENT' ? (
              <ActivityIndicator size="small" color="#7C3AED" />
            ) : (
              <>
                <Ionicons name="people-outline" size={15} color="#7C3AED" />
                <Text style={styles.quickBtnText}>Все студенты</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={() => addAllByRole('TEACHER', 'преподаватели')}
            disabled={addingRole !== null}
            activeOpacity={0.75}
          >
            {addingRole === 'TEACHER' ? (
              <ActivityIndicator size="small" color="#7C3AED" />
            ) : (
              <>
                <Ionicons name="person-outline" size={15} color="#7C3AED" />
                <Text style={styles.quickBtnText}>Все преподаватели</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Тема */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Тема</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Тема письма"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Сообщение */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Сообщение</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={body}
          onChangeText={setBody}
          placeholder="Текст сообщения..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={5}
        />
      </View>

      {/* Вложения */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>Вложения</Text>
          {attachments.length > 0 && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>{attachments.length}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.attachBtn} onPress={pickAttachment} disabled={isUploading} activeOpacity={0.75}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#7C3AED" />
          ) : (
            <>
              <Ionicons name="attach" size={20} color="#7C3AED" />
              <Text style={styles.attachBtnText}>Прикрепить файл</Text>
            </>
          )}
        </TouchableOpacity>

        {attachments.map((file, idx) => (
          <View key={`${file.url}-${idx}`} style={styles.fileRow}>
            <View style={styles.fileIcon}>
              <Ionicons name="document-text" size={18} color="#7C3AED" />
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              {!!formatSize(file.size) && <Text style={styles.fileSize}>{formatSize(file.size)}</Text>}
            </View>
            <TouchableOpacity onPress={() => removeAttachment(idx)} hitSlop={6}>
              <Ionicons name="close" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Отправка */}
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
              <Text style={styles.sendBtnText}>
                Отправить{recipients.length > 0 ? ` · ${recipients.length}` : ''}
              </Text>
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
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 12,
  },
  counter: {
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  counterText: { fontSize: 12, fontWeight: '700', color: '#5B21B6' },

  inputRow: { flexDirection: 'row', gap: 8 },
  inputFlex: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  addBtn: {
    width: 48,
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 9,
    paddingVertical: 7,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: '#5B21B6' },

  quickRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5F3FF',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    borderRadius: 12,
    paddingVertical: 11,
  },
  quickBtnText: { fontSize: 12, fontWeight: '700', color: '#7C3AED' },

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
  textarea: { minHeight: 110, textAlignVertical: 'top' },

  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FAF8FF',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 14,
  },
  attachBtnText: { fontSize: 14, fontWeight: '700', color: '#7C3AED' },

  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  fileSize: { fontSize: 12, color: '#94A3B8', marginTop: 2 },

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
