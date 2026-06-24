import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth.store';
import { getErrorMessage } from '../utils/error';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Ошибка', 'Введите email и пароль');
      return;
    }
    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert('Ошибка входа', getErrorMessage(error, 'Не удалось войти'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Шапка */}
        <View style={styles.header}>
          <View style={styles.headerDecorLeft} />
          <View style={styles.headerDecorRight} />
          <View style={styles.logoWrap}>
            <Ionicons name="school" size={36} color="#1E40AF" />
          </View>
          <Text style={styles.appName}>УниВест</Text>
          <Text style={styles.appDesc}>Мобильный портал университета</Text>
        </View>

        {/* Карточка формы */}
        <View style={styles.card}>
          <Text style={styles.title}>Вход в систему</Text>
          <Text style={styles.subtitle}>Введите данные вашего аккаунта</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="example@university.ru"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Пароль</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Введите пароль"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Войти</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Тестовые аккаунты */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Тестовые аккаунты</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.hints}>
            <TouchableOpacity
              style={styles.hintChip}
              onPress={() => { setEmail('admin@university.ru'); setPassword('password123'); }}
            >
              <Ionicons name="shield-checkmark-outline" size={14} color="#7C3AED" />
              <Text style={[styles.hintChipText, { color: '#7C3AED' }]}>Администратор</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hintChip}
              onPress={() => { setEmail('teacher@university.ru'); setPassword('password123'); }}
            >
              <Ionicons name="person-outline" size={14} color="#059669" />
              <Text style={[styles.hintChipText, { color: '#059669' }]}>Преподаватель</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hintChip}
              onPress={() => { setEmail('student@university.ru'); setPassword('password123'); }}
            >
              <Ionicons name="school-outline" size={14} color="#1E40AF" />
              <Text style={[styles.hintChipText, { color: '#1E40AF' }]}>Студент</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hintPass}>Пароль для всех: password123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1E40AF' },
  scroll: { flexGrow: 1 },

  header: {
    backgroundColor: '#1E40AF',
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  headerDecorLeft: {
    position: 'absolute',
    top: -40,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  headerDecorRight: {
    position: 'absolute',
    bottom: -30,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  appName: { fontSize: 30, fontWeight: '800', color: '#ffffff', letterSpacing: 1 },
  appDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },

  card: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    padding: 28,
    paddingBottom: 40,
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 28 },

  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    paddingVertical: 13,
  },
  eyeBtn: { padding: 4 },

  button: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: '#1E40AF',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: { backgroundColor: '#93C5FD', shadowOpacity: 0 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 22,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },

  hints: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  hintChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  hintChipText: { fontSize: 12, fontWeight: '600' },
  hintPass: { fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 12 },
});
