import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Volume2, RefreshCw, TriangleAlert as AlertTriangle, Info, Pause } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AccuracyBadge } from '@/components/ui/AccuracyBadge';
import { useAudio } from '@/hooks/useAudio';
import { SAMPLE_AYAHS } from '@/constants/quran';
import { getAyahAudioUrl } from '@/services/aiService';
import { RecitationResult } from '@/types';
import { FontSize, Spacing } from '@/constants/theme';

export default function CorrectionScreen() {
  const { theme, settings } = useApp();
  const router = useRouter();
  const params = useLocalSearchParams<{ result?: string; surah?: string; ayah?: string }>();
  const audio = useAudio();
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;
  const surahNumber = Number(params.surah ?? 1);
  const ayahNumber = Number(params.ayah ?? 2);
  const result = parseResult(params.result) ?? fallbackResult();

  const correctWords = result.correctText.split(/\s+/).filter(Boolean);
  const userWords = result.userText.split(/\s+/).filter(Boolean);
  const mistakePositions = new Set(result.mistakes.map((m) => m.position));

  useEffect(() => {
    return () => {
      audio.stopAudio();
    };
  }, []);

  function playCorrectRecitation() {
    if (audio.isPlaying) {
      audio.stopAudio();
      return;
    }
    audio.playAudio(getAyahAudioUrl(surahNumber, ayahNumber, settings.reciter));
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>Correction Results</Text>
          <Text style={{ color: theme.gold, fontSize: FontSize.xs }}>نتائج التصحيح</Text>
        </View>
        <AccuracyBadge score={result.accuracy} size="sm" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card padding={Spacing.lg}>
          <View style={styles.scoreTop}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.xxl }}>
                {result.accuracy >= 90 ? 'Excellent' : result.accuracy >= 75 ? 'Good Work' : 'Keep Practicing'}
              </Text>
              <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm, marginTop: 4 }}>
                {result.mistakes.length === 0 ? 'No word-level mistakes detected.' : `${result.mistakes.length} issue(s) found`}
              </Text>
            </View>
            <AccuracyBadge score={result.accuracy} size="lg" />
          </View>
          <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBarFill, {
              width: `${result.accuracy}%`,
              backgroundColor: result.accuracy >= 85 ? theme.success : result.accuracy >= 70 ? theme.gold : theme.error,
            }]} />
          </View>
        </Card>

        <Card padding={Spacing.lg}>
          <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs, fontWeight: '700', marginBottom: Spacing.md }}>
            YOUR RECITATION vs CORRECT AYAH
          </Text>

          <View style={styles.compRow}>
            <View style={[styles.compBadge, { backgroundColor: theme.error + '18' }]}>
              <Text style={{ color: theme.error, fontSize: FontSize.xs, fontWeight: '700' }}>YOUR RECITATION</Text>
            </View>
            <View style={styles.wordsRow}>
              {userWords.length === 0 ? (
                <Text style={{ color: theme.text.tertiary }}>No transcription captured.</Text>
              ) : userWords.map((word, i) => (
                <Text key={`${word}-${i}`} style={[
                  styles.wordChip,
                  {
                    backgroundColor: mistakePositions.has(i) ? theme.error + '20' : theme.surfaceSecondary,
                    color: mistakePositions.has(i) ? theme.error : theme.text.primary,
                    borderColor: mistakePositions.has(i) ? theme.error : 'transparent',
                  },
                ]}>{word}</Text>
              ))}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.compRow}>
            <View style={[styles.compBadge, { backgroundColor: theme.success + '18' }]}>
              <Text style={{ color: theme.success, fontSize: FontSize.xs, fontWeight: '700' }}>CORRECT AYAH</Text>
            </View>
            <View style={styles.wordsRow}>
              {correctWords.map((word, i) => (
                <Text key={`${word}-${i}`} style={[
                  styles.wordChip,
                  {
                    backgroundColor: mistakePositions.has(i) ? theme.success + '20' : theme.surfaceSecondary,
                    color: mistakePositions.has(i) ? theme.success : theme.text.primary,
                    borderColor: mistakePositions.has(i) ? theme.success : 'transparent',
                  },
                ]}>{word}</Text>
              ))}
            </View>
          </View>

          <View style={[styles.correctBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
            <Text style={{ fontSize: 22, color: theme.text.primary, textAlign: 'right', lineHeight: 44 }}>
              {result.correctText}
            </Text>
          </View>
        </Card>

        {result.mistakes.length > 0 && (
          <Card padding={Spacing.lg}>
            <View style={styles.cardHeader}>
              <AlertTriangle size={18} color={theme.error} />
              <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.md, marginLeft: 8 }}>
                Mistakes ({result.mistakes.length})
              </Text>
            </View>
            {result.mistakes.map((mistake, i) => (
              <View key={`${mistake.position}-${i}`} style={[styles.mistakeItem, { borderBottomColor: theme.border, borderBottomWidth: i < result.mistakes.length - 1 ? 1 : 0 }]}>
                <View style={styles.mistakeWords}>
                  <View style={[styles.mistakeChip, { backgroundColor: theme.error + '18' }]}>
                    <Text style={{ color: theme.error, fontSize: 18 }}>{mistake.word || 'Missing'}</Text>
                  </View>
                  <Text style={{ color: theme.text.tertiary, fontSize: FontSize.sm }}>to</Text>
                  <View style={[styles.mistakeChip, { backgroundColor: theme.success + '18' }]}>
                    <Text style={{ color: theme.success, fontSize: 18 }}>{mistake.correctWord || 'Remove extra word'}</Text>
                  </View>
                </View>
                <Text style={{ color: theme.text.secondary, fontSize: FontSize.xs, marginTop: 6, textTransform: 'capitalize' }}>
                  Type: {mistake.type}
                </Text>
              </View>
            ))}
          </Card>
        )}

        <Card padding={Spacing.lg}>
          <View style={styles.cardHeader}>
            <Info size={18} color={theme.gold} />
            <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.md, marginLeft: 8 }}>
              Tajwid Feedback
            </Text>
          </View>
          {result.tajwidFeedback.length === 0 && (
            <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm }}>
              No tajwid issues were detected for this attempt. Keep matching the reference rhythm and articulation.
            </Text>
          )}
          {result.tajwidFeedback.map((feedback, i) => (
            <View key={`${feedback.word}-${i}`} style={[styles.tajwidItem, { borderLeftColor: theme.gold, backgroundColor: theme.goldLight }]}>
              <View style={styles.tajwidHeader}>
                <Text style={{ color: theme.gold, fontWeight: '700', fontSize: FontSize.sm }}>{feedback.word}</Text>
                <View style={[styles.severityBadge, { backgroundColor: feedback.severity === 'minor' ? `${theme.gold}20` : `${theme.error}20` }]}>
                  <Text style={{ color: feedback.severity === 'minor' ? theme.gold : theme.error, fontSize: FontSize.xs, textTransform: 'capitalize' }}>
                    {feedback.severity}
                  </Text>
                </View>
              </View>
              <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm, marginTop: 4 }}>{feedback.description}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.actions}>
          <Button
            label={audio.isPlaying ? 'Stop Audio' : 'Listen to Correct Recitation'}
            onPress={playCorrectRecitation}
            variant="primary"
            fullWidth
            size="lg"
            icon={audio.isPlaying ? <Pause size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}
          />
          <Button
            label="Try Again"
            onPress={() => {
              audio.stopAudio();
              router.back();
            }}
            variant="secondary"
            fullWidth
            size="lg"
            style={{ marginTop: 12 }}
            icon={<RefreshCw size={18} color={theme.text.secondary} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function parseResult(raw?: string): RecitationResult | null {
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as RecitationResult;
  } catch {
    return null;
  }
}

function fallbackResult(): RecitationResult {
  const text = SAMPLE_AYAHS[1]?.[1] ?? '';
  return {
    userText: text,
    correctText: text,
    accuracy: 100,
    mistakes: [],
    tajwidFeedback: [],
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' },
  content: { padding: Spacing.lg, paddingBottom: 80, gap: 16 },
  scoreTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  scoreBarBg: { height: 8, borderRadius: 4, backgroundColor: '#e5e5e5', overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  compRow: { marginBottom: Spacing.md },
  compBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 10 },
  wordsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end' },
  wordChip: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontSize: 18, borderWidth: 1.5 },
  divider: { height: 1, marginVertical: 16 },
  correctBox: { borderRadius: 12, padding: Spacing.md, marginTop: Spacing.md, borderWidth: 1.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  mistakeItem: { paddingVertical: 12 },
  mistakeWords: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  mistakeChip: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  tajwidItem: { borderLeftWidth: 3, borderRadius: 8, padding: 12, marginBottom: 10 },
  tajwidHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  actions: { marginTop: 4 },
});
