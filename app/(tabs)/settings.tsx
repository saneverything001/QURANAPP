import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Moon, Sun, Bell, Globe, Download, LogOut, ChevronRight, Volume2, User, Music } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RECITERS, LANGUAGES } from '@/constants/quran';
import { FontSize, Spacing, BorderRadius } from '@/constants/theme';

export default function SettingsScreen() {
  const { theme, isDark, toggleDarkMode, settings, updateSettings, signOut, user } = useApp();
  const router = useRouter();
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  const [showReciters, setShowReciters] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/welcome');
  }

  const fontSizes = ['small', 'medium', 'large', 'xlarge'] as const;

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text.tertiary }]}>{title}</Text>
        <Card padding={0} style={{ overflow: 'hidden' }}>
          {children}
        </Card>
      </View>
    );
  }

  function SettingRow({ icon, label, sublabel, rightElement, onPress, noBorder }: {
    icon: React.ReactNode; label: string; sublabel?: string;
    rightElement?: React.ReactNode; onPress?: () => void; noBorder?: boolean;
  }) {
    const content = (
      <View style={[styles.settingRow, { borderBottomColor: theme.border, borderBottomWidth: noBorder ? 0 : 1 }]}>
        <View style={[styles.settingIcon, { backgroundColor: theme.surfaceSecondary }]}>{icon}</View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={{ color: theme.text.primary, fontSize: FontSize.md, fontWeight: '500' }}>{label}</Text>
          {sublabel && <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs, marginTop: 2 }}>{sublabel}</Text>}
        </View>
        {rightElement}
      </View>
    );
    if (onPress) return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
    return content;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>Settings</Text>
        <Text style={{ color: theme.gold, fontSize: FontSize.sm, marginTop: 2 }}>الإعدادات</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile */}
        {user && (
          <Card style={styles.profileCard} padding={Spacing.lg}>
            <View style={styles.profileRow}>
              <View style={[styles.avatar, { backgroundColor: theme.primaryLight }]}>
                <Text style={{ fontSize: 28 }}>👤</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.lg }}>{user.display_name || 'Learner'}</Text>
                <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm }}>{user.email}</Text>
                <View style={styles.statsRow}>
                  <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
                    <Text style={{ color: theme.primary, fontSize: FontSize.xs, fontWeight: '600' }}>🔥 {user.streak_days}d</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: `${theme.gold}20` }]}>
                    <Text style={{ color: theme.gold, fontSize: FontSize.xs, fontWeight: '600' }}>⭐ {user.total_points}pts</Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Appearance */}
        <Section title="APPEARANCE">
          <SettingRow
            icon={isDark ? <Moon size={18} color={theme.primary} /> : <Sun size={18} color={theme.gold} />}
            label="Dark Mode"
            sublabel={isDark ? 'Currently dark' : 'Currently light'}
            rightElement={<Switch value={isDark} onValueChange={toggleDarkMode} trackColor={{ true: theme.primary }} />}
          />
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.settingIcon, { backgroundColor: theme.surfaceSecondary }]}>
              <Text style={{ fontSize: 16 }}>أ</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ color: theme.text.primary, fontSize: FontSize.md, fontWeight: '500' }}>Arabic Font Size</Text>
              <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs, marginTop: 2, textTransform: 'capitalize' }}>{settings.arabicFontSize}</Text>
            </View>
            <View style={styles.fontSizeRow}>
              {fontSizes.map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => updateSettings({ arabicFontSize: s })}
                  style={[styles.fontBtn, {
                    backgroundColor: settings.arabicFontSize === s ? theme.primary : theme.surfaceSecondary,
                  }]}
                >
                  <Text style={{ color: settings.arabicFontSize === s ? '#fff' : theme.text.secondary, fontSize: FontSize.xs, textTransform: 'capitalize' }}>
                    {s[0].toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Section>

        {/* Audio & Recitation */}
        <Section title="AUDIO & RECITATION">
          <SettingRow
            icon={<Music size={18} color={theme.primary} />}
            label="Reciter"
            sublabel={RECITERS.find(r => r.key === settings.reciter)?.name ?? 'Select reciter'}
            rightElement={<ChevronRight size={16} color={theme.text.tertiary} />}
            onPress={() => setShowReciters(!showReciters)}
          />
          {showReciters && (
            <View style={{ paddingHorizontal: Spacing.md, paddingBottom: Spacing.md }}>
              {RECITERS.map(r => (
                <TouchableOpacity
                  key={r.key}
                  style={[styles.reciterRow, {
                    backgroundColor: settings.reciter === r.key ? theme.primaryLight : theme.surfaceSecondary,
                    borderColor: settings.reciter === r.key ? theme.primary : 'transparent',
                  }]}
                  onPress={() => updateSettings({ reciter: r.key })}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text.primary, fontWeight: '600', fontSize: FontSize.sm }}>{r.name}</Text>
                    <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs }}>{r.arabicName} • {r.style}</Text>
                  </View>
                  {settings.reciter === r.key && <Text style={{ color: theme.primary }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          )}
          <SettingRow
            icon={<Volume2 size={18} color={theme.primary} />}
            label="Audio Quality"
            sublabel="High quality (128kbps)"
            rightElement={<ChevronRight size={16} color={theme.text.tertiary} />}
            noBorder
          />
        </Section>

        {/* Language */}
        <Section title="LANGUAGE">
          <SettingRow
            icon={<Globe size={18} color={theme.primary} />}
            label="App Language"
            sublabel={LANGUAGES.find(l => l.code === settings.language)?.name ?? 'English'}
            rightElement={<ChevronRight size={16} color={theme.text.tertiary} />}
            noBorder
          />
        </Section>

        {/* Notifications */}
        <Section title="NOTIFICATIONS">
          <SettingRow
            icon={<Bell size={18} color={theme.primary} />}
            label="Daily Reminders"
            sublabel="Get reminded to practice daily"
            rightElement={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
                trackColor={{ true: theme.primary }}
              />
            }
            noBorder
          />
        </Section>

        {/* Offline */}
        <Section title="OFFLINE">
          <SettingRow
            icon={<Download size={18} color={theme.primary} />}
            label="Download Surahs"
            sublabel="Save for offline reading"
            rightElement={<ChevronRight size={16} color={theme.text.tertiary} />}
            noBorder
          />
        </Section>

        {/* Account */}
        {user && (
          <View style={styles.section}>
            <Button label="Sign Out" onPress={handleSignOut} variant="danger" fullWidth icon={<LogOut size={18} color="#fff" />} />
          </View>
        )}

        <Text style={[styles.version, { color: theme.text.tertiary }]}>Quran Companion AI v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1 },
  content: { padding: Spacing.lg, paddingBottom: 80 },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8 },
  profileCard: { marginBottom: Spacing.lg },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  fontSizeRow: { flexDirection: 'row', gap: 6 },
  fontBtn: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  reciterRow: { borderRadius: 10, padding: 12, marginTop: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5 },
  version: { textAlign: 'center', fontSize: FontSize.xs, marginTop: 8, marginBottom: Spacing.md },
});
