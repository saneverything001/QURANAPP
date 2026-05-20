import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, RotateCcw, ChevronRight, Flame, Target } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SAMPLE_AYAHS, SURAHS } from '@/constants/quran';
import { FontSize, Spacing } from '@/constants/theme';

type Mode = 'menu' | 'hide-word' | 'continue-ayah' | 'repeat-after';

export default function MemorizationScreen() {
  const { theme } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('menu');
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  if (mode === 'hide-word') return <HideWordChallenge onBack={() => setMode('menu')} theme={theme} />;
  if (mode === 'continue-ayah') return <ContinueAyahChallenge onBack={() => setMode('menu')} theme={theme} />;
  if (mode === 'repeat-after') return <RepeatAfterReciter onBack={() => setMode('menu')} theme={theme} />;

  const modes = [
    { id: 'hide-word', title: 'Hide Word Challenge', arabic: 'تحدي الكلمة المخفية', desc: 'Guess the hidden word in the ayah', icon: '🔍', color: theme.primary },
    { id: 'continue-ayah', title: 'Continue the Ayah', arabic: 'أكمل الآية', desc: 'Complete the ayah from where it stops', icon: '➡️', color: theme.gold },
    { id: 'repeat-after', title: 'Repeat After Reciter', arabic: 'ردد بعد القارئ', desc: 'Listen and repeat the recitation', icon: '🎵', color: '#0284c7' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <View>
          <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>Memorization</Text>
          <Text style={{ color: theme.gold, fontSize: FontSize.sm }}>الحفظ والمراجعة</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Streak & Goal */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard} padding={Spacing.md}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Flame size={20} color={theme.gold} />
              <View>
                <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.xl }}>7</Text>
                <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs }}>Day Streak</Text>
              </View>
            </View>
          </Card>
          <Card style={styles.statCard} padding={Spacing.md}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Target size={20} color={theme.primary} />
              <View>
                <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.xl }}>3/5</Text>
                <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs }}>Today's Goal</Text>
              </View>
            </View>
          </Card>
          <Card style={styles.statCard} padding={Spacing.md}>
            <ProgressRing progress={60} size={60} label="60%" color={theme.primary} />
          </Card>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Choose Mode</Text>
        {modes.map(m => (
          <TouchableOpacity key={m.id} onPress={() => setMode(m.id as Mode)} activeOpacity={0.85}>
            <Card style={[styles.modeCard, { borderLeftColor: m.color, borderLeftWidth: 4 }]} padding={Spacing.lg}>
              <View style={styles.modeRow}>
                <Text style={{ fontSize: 32, marginRight: 16 }}>{m.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.lg }}>{m.title}</Text>
                  <Text style={{ color: m.color, fontSize: FontSize.sm, marginTop: 2 }}>{m.arabic}</Text>
                  <Text style={{ color: theme.text.secondary, fontSize: FontSize.xs, marginTop: 4 }}>{m.desc}</Text>
                </View>
                <ChevronRight size={20} color={theme.text.tertiary} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Recently memorized */}
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Recently Practiced</Text>
        {[
          { surah: 'Al-Fatihah', ayahs: 7, progress: 100, status: 'memorized' },
          { surah: 'Al-Ikhlas', ayahs: 4, progress: 80, status: 'reviewing' },
          { surah: 'Al-Falaq', ayahs: 5, progress: 60, status: 'learning' },
        ].map((s, i) => (
          <Card key={i} style={styles.surahProgress} padding={Spacing.md}>
            <View style={styles.progressRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text.primary, fontWeight: '600' }}>{s.surah}</Text>
                <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs, marginTop: 2 }}>{s.ayahs} ayahs</Text>
              </View>
              <View style={[styles.statusBadge, {
                backgroundColor: s.status === 'memorized' ? `${theme.success}18` : s.status === 'reviewing' ? `${theme.gold}18` : `${theme.primary}18`,
              }]}>
                <Text style={{
                  color: s.status === 'memorized' ? theme.success : s.status === 'reviewing' ? theme.gold : theme.primary,
                  fontSize: FontSize.xs, fontWeight: '600', textTransform: 'capitalize',
                }}>{s.status}</Text>
              </View>
            </View>
            <View style={[styles.progressBar, { backgroundColor: theme.border, marginTop: 10 }]}>
              <View style={[styles.progressFill, { backgroundColor: theme.primary, width: `${s.progress}%` }]} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

function HideWordChallenge({ onBack, theme }: { onBack: () => void; theme: any }) {
  const ayah = SAMPLE_AYAHS[1]?.[1] ?? '';
  const words = ayah.split(' ');
  const [hiddenIdx] = useState(() => Math.floor(Math.random() * words.length));
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>Hide Word Challenge</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Card padding={Spacing.xl}>
          <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm, marginBottom: Spacing.lg, textAlign: 'center' }}>
            What is the missing word?
          </Text>
          <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {words.map((w, i) => (
              <View key={i} style={[styles.wordChip, {
                backgroundColor: i === hiddenIdx
                  ? (revealed ? theme.primaryLight : theme.surfaceSecondary)
                  : 'transparent',
                borderColor: i === hiddenIdx ? theme.primary : 'transparent',
                borderWidth: i === hiddenIdx ? 1.5 : 0,
                minWidth: i === hiddenIdx && !revealed ? 70 : 0,
              }]}>
                <Text style={{ fontSize: 22, color: i === hiddenIdx && !revealed ? 'transparent' : theme.text.primary }}>
                  {w}
                </Text>
                {i === hiddenIdx && !revealed && (
                  <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceSecondary, borderRadius: 8 }]}>
                    <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs }}>?????</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
          <View style={styles.challengeButtons}>
            <Button label={revealed ? "Hide Again" : "Reveal"} onPress={() => setRevealed(!revealed)}
              variant={revealed ? 'secondary' : 'primary'} icon={revealed ? <EyeOff size={18} color={theme.text.primary} /> : <Eye size={18} color="#fff" />} />
            <Button label="Next" onPress={() => setRevealed(false)} variant="ghost" icon={<ChevronRight size={18} color={theme.primary} />} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function ContinueAyahChallenge({ onBack, theme }: { onBack: () => void; theme: any }) {
  const ayah = SAMPLE_AYAHS[1]?.[1] ?? '';
  const words = ayah.split(' ');
  const cutoff = Math.ceil(words.length / 2);
  const [revealed, setRevealed] = useState(false);
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>Continue the Ayah</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Card padding={Spacing.xl}>
          <Text style={{ color: theme.text.secondary, textAlign: 'center', marginBottom: Spacing.lg }}>
            Continue the ayah from where it stops:
          </Text>
          <Text style={{ fontSize: 26, color: theme.primary, textAlign: 'right', lineHeight: 50 }}>
            {words.slice(0, cutoff).join(' ')} ...
          </Text>
          {revealed && (
            <View style={[styles.revealBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
              <Text style={{ fontSize: 22, color: theme.text.primary, textAlign: 'right', lineHeight: 44 }}>
                {words.slice(cutoff).join(' ')}
              </Text>
            </View>
          )}
          <View style={styles.challengeButtons}>
            <Button label={revealed ? "Hide" : "Reveal"} onPress={() => setRevealed(!revealed)} variant="primary" />
            <Button label="Next Ayah" onPress={() => setRevealed(false)} variant="secondary" icon={<ChevronRight size={18} color={theme.text.secondary} />} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function RepeatAfterReciter({ onBack, theme }: { onBack: () => void; theme: any }) {
  const [step, setStep] = useState<'listen' | 'repeat' | 'done'>('listen');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>Repeat After Reciter</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Card padding={Spacing.xl} style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: theme.text.primary, textAlign: 'right', lineHeight: 50, width: '100%' }}>
            {SAMPLE_AYAHS[1]?.[0] ?? ''}
          </Text>
          <View style={{ marginTop: Spacing.xl, gap: 12, width: '100%' }}>
            <Button
              label="▶ Listen to Reciter"
              onPress={() => setStep('repeat')}
              variant="primary" fullWidth size="lg"
            />
            <Button
              label="🎙 Record My Recitation"
              onPress={() => setStep('done')}
              variant={step === 'repeat' ? 'primary' : 'secondary'} fullWidth size="lg"
            />
            {step === 'done' && (
              <Button label="Next Ayah" onPress={() => setStep('listen')} variant="ghost" fullWidth />
            )}
          </View>
          <View style={[styles.steps, { marginTop: Spacing.xl }]}>
            {['Listen', 'Repeat', 'Done'].map((s, i) => (
              <View key={i} style={styles.stepItem}>
                <View style={[styles.stepDot, { backgroundColor: i <= ['listen', 'repeat', 'done'].indexOf(step) ? theme.primary : theme.border }]} />
                <Text style={{ color: theme.text.secondary, fontSize: FontSize.xs }}>{s}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' },
  content: { padding: Spacing.lg, paddingBottom: 80, gap: 16 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700' },
  modeCard: { marginBottom: 4 },
  modeRow: { flexDirection: 'row', alignItems: 'center' },
  surahProgress: {},
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  progressBar: { height: 5, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  wordChip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, position: 'relative' },
  challengeButtons: { flexDirection: 'row', gap: 12, marginTop: Spacing.xl, justifyContent: 'center' },
  revealBox: { borderRadius: 12, padding: Spacing.md, marginTop: Spacing.md, borderWidth: 1.5 },
  steps: { flexDirection: 'row', gap: 20 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: { width: 12, height: 12, borderRadius: 6 },
});
