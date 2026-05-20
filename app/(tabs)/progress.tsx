import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, StatusBar } from 'react-native';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { supabase } from '@/lib/supabase';
import { FontSize, Spacing, Colors } from '@/constants/theme';
import { Flame, Award, BookOpen, Target, TrendingUp, CheckCircle } from 'lucide-react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function ProgressScreen() {
  const { theme, user } = useApp();
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  const [stats, setStats] = useState({
    memorizedAyahs: 42,
    totalSessions: 28,
    avgAccuracy: 87,
    currentStreak: user?.streak_days ?? 7,
    completedSurahs: 3,
    weeklyData: [4, 6, 3, 8, 5, 7, 9],
    accuracyHistory: [72, 78, 81, 85, 83, 88, 91],
  });

  const [recentSessions] = useState([
    { surah: 'Al-Fatihah', ayah: 1, accuracy: 96, date: 'Today' },
    { surah: 'Al-Ikhlas', ayah: 2, accuracy: 88, date: 'Today' },
    { surah: 'Al-Fatihah', ayah: 4, accuracy: 74, date: 'Yesterday' },
    { surah: 'Al-Falaq', ayah: 1, accuracy: 92, date: 'Yesterday' },
  ]);

  const statCards = [
    { icon: <Flame size={20} color={Colors.gold[500]} />, label: 'Day Streak', value: `${stats.currentStreak}`, sub: 'days', color: Colors.gold[500] },
    { icon: <BookOpen size={20} color={Colors.primary[600]} />, label: 'Ayahs Memorized', value: `${stats.memorizedAyahs}`, sub: 'verses', color: Colors.primary[600] },
    { icon: <TrendingUp size={20} color={Colors.primary[400]} />, label: 'Avg Accuracy', value: `${stats.avgAccuracy}%`, sub: 'overall', color: Colors.primary[400] },
    { icon: <CheckCircle size={20} color="#16a34a" />, label: 'Surahs Done', value: `${stats.completedSurahs}`, sub: 'completed', color: '#16a34a' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>My Progress</Text>
        <Text style={{ color: theme.gold, fontSize: FontSize.sm, marginTop: 2 }}>تقدمي</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stat grid */}
        <View style={styles.statGrid}>
          {statCards.map((s, i) => (
            <Card key={i} style={styles.statCard} padding={Spacing.md}>
              <View style={[styles.statIcon, { backgroundColor: `${s.color}18` }]}>{s.icon}</View>
              <Text style={{ color: theme.text.primary, fontSize: FontSize.xxl, fontWeight: '800', marginTop: 8 }}>{s.value}</Text>
              <Text style={{ color: theme.text.secondary, fontSize: FontSize.xs }}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Overall progress ring */}
        <Card style={styles.ringCard} padding={Spacing.lg}>
          <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.lg, marginBottom: Spacing.md }}>
            Overall Progress
          </Text>
          <View style={styles.ringsRow}>
            <View style={{ alignItems: 'center' }}>
              <ProgressRing progress={35} size={100} label="35%" sublabel="Hifz" color={theme.primary} />
              <Text style={{ color: theme.text.secondary, fontSize: FontSize.xs, marginTop: 6 }}>Memorization</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <ProgressRing progress={stats.avgAccuracy} size={100} label={`${stats.avgAccuracy}%`} sublabel="Avg" color={theme.gold} />
              <Text style={{ color: theme.text.secondary, fontSize: FontSize.xs, marginTop: 6 }}>Accuracy</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <ProgressRing progress={60} size={100} label="60%" sublabel="Goal" color={Colors.primary[400]} />
              <Text style={{ color: theme.text.secondary, fontSize: FontSize.xs, marginTop: 6 }}>Daily Goal</Text>
            </View>
          </View>
        </Card>

        {/* Weekly activity */}
        <Card style={styles.chartCard} padding={Spacing.lg}>
          <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.lg, marginBottom: Spacing.md }}>
            Weekly Practice
          </Text>
          <WeeklyChart data={stats.weeklyData} theme={theme} />
        </Card>

        {/* Accuracy trend */}
        <Card style={styles.chartCard} padding={Spacing.lg}>
          <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.lg, marginBottom: Spacing.md }}>
            Accuracy Trend
          </Text>
          <AccuracyChart data={stats.accuracyHistory} theme={theme} />
        </Card>

        {/* Recent sessions */}
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Recent Sessions</Text>
        {recentSessions.map((s, i) => (
          <Card key={i} style={styles.sessionItem} padding={Spacing.md}>
            <View style={styles.sessionRow}>
              <View style={[styles.sessionIcon, { backgroundColor: s.accuracy >= 85 ? `${theme.success}18` : `${theme.error}18` }]}>
                <Text style={{ fontSize: 18 }}>{s.accuracy >= 85 ? '✅' : '⚠️'}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: theme.text.primary, fontWeight: '600' }}>{s.surah}</Text>
                <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs }}>Ayah {s.ayah} • {s.date}</Text>
              </View>
              <View style={[styles.accuracyBadge, { backgroundColor: s.accuracy >= 85 ? `${theme.success}18` : `${theme.error}18` }]}>
                <Text style={{ color: s.accuracy >= 85 ? theme.success : theme.error, fontWeight: '700', fontSize: FontSize.sm }}>
                  {s.accuracy}%
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

function WeeklyChart({ data, theme }: { data: number[]; theme: any }) {
  const W = 280, H = 120;
  const max = Math.max(...data, 1);
  const barW = 28;
  const gap = (W - data.length * barW) / (data.length - 1);

  return (
    <Svg width={W} height={H + 24}>
      {data.map((v, i) => {
        const bh = (v / max) * H;
        const x = i * (barW + gap);
        return (
          <React.Fragment key={i}>
            <Rect x={x} y={H - bh} width={barW} height={bh} rx={6} fill={theme.primary} opacity={0.85} />
            <SvgText x={x + barW / 2} y={H + 16} fontSize="11" fill={theme.text.tertiary} textAnchor="middle">{DAYS[i]}</SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function AccuracyChart({ data, theme }: { data: number[]; theme: any }) {
  const W = 280, H = 100;
  const min = 60, max = 100;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min)) * H;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Svg width={W} height={H + 24}>
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((v - min) / (max - min)) * H;
        return <React.Fragment key={i}><Rect x={x - 4} y={y - 4} width={8} height={8} rx={4} fill={theme.gold} /></React.Fragment>;
      })}
      {data.slice(1).map((v, i) => {
        const x1 = (i / (data.length - 1)) * W;
        const y1 = H - ((data[i] - min) / (max - min)) * H;
        const x2 = ((i + 1) / (data.length - 1)) * W;
        const y2 = H - ((v - min) / (max - min)) * H;
        return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.gold} strokeWidth={2} />;
      })}
      {[60, 70, 80, 90, 100].map(label => {
        const y = H - ((label - min) / (max - min)) * H;
        return <SvgText key={label} x={W + 4} y={y + 4} fontSize="10" fill={theme.text.tertiary}>{label}</SvgText>;
      })}
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1 },
  content: { padding: Spacing.lg, paddingBottom: 80, gap: 16 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%' },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  ringCard: {},
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  chartCard: {},
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', marginBottom: 4 },
  sessionItem: {},
  sessionRow: { flexDirection: 'row', alignItems: 'center' },
  sessionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  accuracyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
});
