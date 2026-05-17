import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth.store';

const roleConfig: Record<string, { label: string; color: string; bg: string; headerBg: string }> = {
  STUDENT: { label: 'Студент', color: '#1E40AF', bg: '#DBEAFE', headerBg: '#1E40AF' },
  TEACHER: { label: 'Преподаватель', color: '#059669', bg: '#D1FAE5', headerBg: '#065F46' },
  ADMIN: { label: 'Администратор', color: '#7C3AED', bg: '#EDE9FE', headerBg: '#5B21B6' },
};

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Выход из системы',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (!user) return null;

  const rc = roleConfig[user.role] ?? roleConfig.STUDENT;
  const initials = user.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Шапка */}
      <View style={[styles.header, { backgroundColor: rc.headerBg }]}>
        <View style={styles.headerDecorTR} />
        <View style={styles.headerDecorBL} />
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user.fullName}</Text>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{rc.label}</Text>
        </View>
      </View>

      {/* Информация */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Информация об аккаунте</Text>
        <View style={styles.card}>
          <InfoRow icon="mail-outline" label="Email" value={user.email} />
          <View style={styles.sep} />
          <InfoRow icon="shield-checkmark-outline" label="Роль" value={rc.label} color={rc.color} />
          {user.faculty && (
            <>
              <View style={styles.sep} />
              <InfoRow icon="school-outline" label="Факультет" value={user.faculty} />
            </>
          )}
        </View>
      </View>

      {/* Выход */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.75}>
          <View style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          </View>
          <Text style={styles.logoutText}>Выйти из системы</Text>
          <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>УниВест v1.0.0</Text>
        <Text style={styles.footerSub}>Мобильный портал университета</Text>
      </View>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color="#1E40AF" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, color ? { color } : {}]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },

  header: {
    paddingTop: 36,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  headerDecorTR: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerDecorBL: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#ffffff' },
  name: { fontSize: 22, fontWeight: '800', color: '#ffffff', textAlign: 'center' },
  rolePill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  roleText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },

  section: { marginHorizontal: 16, marginTop: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  sep: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 70 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: { flex: 1, fontSize: 16, color: '#DC2626', fontWeight: '700' },

  footer: { alignItems: 'center', paddingVertical: 28, gap: 4 },
  footerText: { fontSize: 13, fontWeight: '600', color: '#94A3B8' },
  footerSub: { fontSize: 11, color: '#CBD5E1' },
});
