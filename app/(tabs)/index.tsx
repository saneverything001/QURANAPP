import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic, BookOpen, Upload, RefreshCw, BarChart3, Star, Settings, Bell, Flame, Award, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { IslamicStar } from '@/components/ui/IslamicPattern';
import { FontSize, Spacing, BorderRadius, Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

interface DashboardAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: string;
  route: string;
  featured?: boolean;
}

export default function HomeScreen() {
  const { theme, user, session } = useApp();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [dailyVerse, setDailyVerse] = useState({ arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship comes ease.', ref: 'Surah Al-Inshirah 94:6' });
  const [streak, setStreak] = useState(user?.streak_days ?? 0);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  const actions: DashboardAction[] = [
    { id: 'recite', icon: <Mic size={24} color="#fff" />, label: 'Start Recitation', sublabel: 'AI-powered feedback', color: Colors.primary[700], route: '/(tabs)/recite', featured: true },
    { id: 'memorize', icon: <BookOpen size={24} color="#fff" />, label: 'Memorization', sublabel: 'Hifz training', color: Colors.gold[600], route: '/memorization' },
    { id: 'quran', icon: <Star size={24} color="#fff" />, label: 'Quran Reader', sublabel: 'Full Arabic text', color: Colors.primary[500], route: '/(tabs)/quran' },
    { id: 'upload', icon: <Upload size={24} color="#fff" />, label: 'Upload Audio', sublabel: 'Analyze recording', color: '#0284c7', route: '/(tabs)/recite' },
    { id: 'revision', icon: <RefreshCw size={24} color="#fff" />, label: 'Daily Revision', sublabel: 'Review memorized', color: '#7c3aed', route: '/memorization' },
    { id: 'progress', icon: <BarChart3 size={24} color="#fff" />, label: 'Progress', sublabel: 'Track your journey', color: '#dc2626', route: '/(tabs)/progress' },
    { id: 'tajwid', icon: <Award size={24} color="#fff" />, label: 'Tajwid Lessons', sublabel: 'Learn the rules', color: '#d97706', route: '/tajwid' },
    { id: 'settings', icon: <Settings size={24} color="#fff" />, label: 'Settings', sublabel: 'Customize app', color: Colors.neutral[600], route: '/(tabs)/settings' },
  ];

  const displayName = user?.display_name || (session ? 'Learner' : 'Guest');
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary, paddingTop: statusBarH + 12 }]}>
        <View style={styles.headerDecor}><IslamicStar size={120} color="#fff" opacity={0.12} /></View>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.headerName}>{displayName} 👋</Text>
          </View>
          <TouchableOpacity style={[styles.notifBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Bell size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Streak row */}
        <View style={styles.statsRow}>
          <View style={[styles.statChip, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Flame size={16} color="#fcd34d" />
            <Text style={styles.statText}>{streak} day streak</Text>
          </View>
          <View style={[styles.statChip, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Award size={16} color="#fcd34d" />
            <Text style={styles.statText}>{user?.total_points ?? 0} pts</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Daily Verse Card */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Card style={[styles.verseCard, { borderLeftColor: theme.gold, borderLeftWidth: 4 }]} padding={Spacing.lg}>
            <Text style={{ color: theme.gold, fontSize: FontSize.xs, fontWeight: '700', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Daily Verse</Text>
            <Text style={{ color: theme.text.primary, fontSize: 22, textAlign: 'right', lineHeight: 40, marginBottom: 12 }}>{dailyVerse.arabic}</Text>
            <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm, lineHeight: 20, marginBottom: 6 }}>{dailyVerse.translation}</Text>
            <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs }}>{dailyVerse.ref}</Text>
          </Card>
        </Animated.View>

        {/* Featured action */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            onPress={() => router.push(actions[0].route as any)}
            activeOpacity={0.88}
            style={[styles.featuredBtn, { backgroundColor: theme.primary }]}
          >
            <View style={styles.featuredLeft}>
              <View style={[styles.featuredIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Mic size={28} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featuredLabel}>Start Recitation</Text>
                <Text style={styles.featuredSub}>Get AI tajwid feedback now</Text>
              </View>
            </View>
            <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </Animated.View>

        {/* Action grid */}
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Quick Actions</Text>
        <Animated.View style={[styles.grid, { opacity: fadeAnim }]}>
          {actions.slice(1).map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.gridItem, { backgroundColor: theme.card }]}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.85}
            >
              <View style={[styles.gridIcon, { backgroundColor: action.color }]}>
                {action.icon}
              </View>
              <Text style={[styles.gridLabel, { color: theme.text.primary }]} numberOfLines={1}>{action.label}</Text>
              <Text style={[styles.gridSub, { color: theme.text.tertiary }]} numberOfLines={1}>{action.sublabel}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Recent activity placeholder */}
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Continue Learning</Text>
        <Card style={styles.continueCard} onPress={() => router.push('/(tabs)/quran')}>
          <View style={styles.continueRow}>
            <View style={[styles.continueIcon, { backgroundColor: theme.primaryLight }]}>
              <Text style={{ fontSize: 24 }}>📖</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text.primary, fontWeight: '600', fontSize: FontSize.md }}>Al-Fatihah</Text>
              <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm, marginTop: 2 }}>7 ayahs • Last read today</Text>
              <View style={[styles.progressBar, { backgroundColor: theme.border, marginTop: 8 }]}>
                <View style={[styles.progressFill, { backgroundColor: theme.primary, width: '85%' }]} />
              </View>
            </View>
            <ChevronRight size={18} color={theme.text.tertiary} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, overflow: 'hidden' },
  headerDecor: { position: 'absolute', right: -20, top: -20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: FontSize.sm },
  headerName: { color: '#fff', fontSize: FontSize.xl, fontWeight: '700', marginTop: 2 },
  notifBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '600' },
  scroll: { padding: Spacing.lg, paddingTop: Spacing.md, paddingBottom: 80 },
  verseCard: { marginBottom: Spacing.md, borderRadius: 16 },
  featuredBtn: { borderRadius: 16, padding: Spacing.lg, flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg, shadowColor: Colors.primary[700], shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  featuredLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  featuredIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  featuredLabel: { color: '#fff', fontSize: FontSize.lg, fontWeight: '700' },
  featuredSub: { color: 'rgba(255,255,255,0.75)', fontSize: FontSize.sm, marginTop: 2 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.md, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: Spacing.lg },
  gridItem: { width: '47%', borderRadius: 16, padding: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  gridIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  gridLabel: { fontSize: FontSize.sm, fontWeight: '700', marginBottom: 2 },
  gridSub: { fontSize: FontSize.xs },
  continueCard: { marginBottom: 40 },
  continueRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  continueIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
});
