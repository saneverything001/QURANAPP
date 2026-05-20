import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mic, MicOff, ChevronRight, CheckCircle, AlertCircle, RefreshCw, ChevronLeft, Volume2, SkipBack, SkipForward } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { WaveformVisualizer } from '@/components/ui/WaveformVisualizer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAudio } from '@/hooks/useAudio';
import { compareRecitation, getAyahAudioUrl, startRealtimeSpeechRecognition, transcribeArabicSpeech } from '@/services/aiService';
import { SAMPLE_AYAHS, SURAHS } from '@/constants/quran';
import { fetchSurah, fetchSurahList } from '@/services/quranService';
import { Ayah, RecitationResult, Surah } from '@/types';
import { FontSize, Spacing } from '@/constants/theme';

export default function ReciteScreen() {
  const { theme, settings } = useApp();
  const router = useRouter();
  const params = useLocalSearchParams<{ surah?: string; ayah?: string }>();
  const audio = useAudio();
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  const [surahs, setSurahs] = useState<Surah[]>(SURAHS);
  const [targetSurah, setTargetSurah] = useState(Number(params.surah ?? 1));
  const [targetAyahNum, setTargetAyahNum] = useState(Number(params.ayah ?? 2));
  const [targetAyahs, setTargetAyahs] = useState<Ayah[]>([]);
  const [targetText, setTargetText] = useState('');
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'idle' | 'recording' | 'processing' | 'done'>('idle');
  const [liveText, setLiveText] = useState('');
  const [result, setResult] = useState<RecitationResult | null>(null);
  const [stopFn, setStopFn] = useState<(() => void) | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);
  const surah = surahs.find((item) => item.number === targetSurah) ?? SURAHS.find((item) => item.number === targetSurah);

  useEffect(() => {
    fetchSurahList().then(setSurahs);
  }, []);

  useEffect(() => {
    if (params.surah) setTargetSurah(Number(params.surah));
    if (params.ayah) setTargetAyahNum(Number(params.ayah));
  }, [params.surah, params.ayah]);

  useEffect(() => {
    async function loadAyah() {
      setLoading(true);
      setPhase('idle');
      setLiveText('');
      setResult(null);
      audio.stopAudio();

      try {
        const ayahs = await fetchSurah(targetSurah);
        setTargetAyahs(ayahs);
        const boundedAyah = Math.min(Math.max(1, targetAyahNum), ayahs.length || targetAyahNum);
        if (boundedAyah !== targetAyahNum) setTargetAyahNum(boundedAyah);
        const ayah = ayahs.find((item) => item.numberInSurah === boundedAyah);
        setTargetText(ayah?.text ?? SAMPLE_AYAHS[targetSurah]?.[boundedAyah - 1] ?? '');
      } catch {
        setTargetText(SAMPLE_AYAHS[targetSurah]?.[targetAyahNum - 1] ?? '');
      } finally {
        setLoading(false);
      }
    }

    loadAyah();
  }, [targetSurah, targetAyahNum]);

  useEffect(() => {
    if (phase === 'recording') {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.12, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
    return () => pulseLoop.current?.stop();
  }, [phase]);

  function choosePreviousAyah() {
    if (targetAyahNum > 1) {
      setTargetAyahNum((ayah) => ayah - 1);
      return;
    }
    if (targetSurah > 1) {
      const previousSurah = surahs.find((item) => item.number === targetSurah - 1);
      setTargetSurah((number) => number - 1);
      setTargetAyahNum(previousSurah?.numberOfAyahs ?? 1);
    }
  }

  function chooseNextAyah() {
    const currentSurah = surahs.find((item) => item.number === targetSurah);
    if (currentSurah && targetAyahNum < currentSurah.numberOfAyahs) {
      setTargetAyahNum((ayah) => ayah + 1);
      return;
    }
    if (targetSurah < 114) {
      setTargetSurah((number) => number + 1);
      setTargetAyahNum(1);
    }
  }

  function choosePreviousSurah() {
    if (targetSurah <= 1) return;
    setTargetSurah((number) => number - 1);
    setTargetAyahNum(1);
  }

  function chooseNextSurah() {
    if (targetSurah >= 114) return;
    setTargetSurah((number) => number + 1);
    setTargetAyahNum(1);
  }

  function playReference() {
    if (audio.isPlaying) {
      audio.stopAudio();
      return;
    }
    audio.playAudio(getAyahAudioUrl(targetSurah, targetAyahNum, settings.reciter));
  }

  async function startRecording() {
    setPhase('recording');
    setLiveText('');
    setResult(null);
    await audio.startRecording();
    const stop = await startRealtimeSpeechRecognition((text) => {
      setLiveText(text);
    });
    setStopFn(() => stop);
  }

  async function stopRecording() {
    stopFn?.();
    setPhase('processing');
    const recordedBlob = await audio.stopRecording();
    const recordedText = recordedBlob ? await transcribeArabicSpeech(recordedBlob) : '';
    const transcribed = liveText || recordedText;
    const res = await compareRecitation(transcribed, targetText);
    setResult({ ...res, userAudioUrl: audio.audioUrl ?? undefined });
    setPhase('done');
  }

  function openDetailedCorrection() {
    if (!result) return;
    router.push({
      pathname: '/correction',
      params: {
        result: encodeURIComponent(JSON.stringify(result)),
        surah: String(targetSurah),
        ayah: String(targetAyahNum),
      },
    } as any);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        {params.surah && (
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <ChevronLeft size={24} color={theme.text.primary} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>Live Recitation</Text>
          <Text style={{ color: theme.gold, fontSize: FontSize.sm, marginTop: 2 }}>التلاوة المباشرة</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.primary} size="large" />
          <Text style={{ color: theme.text.secondary, marginTop: 12 }}>Loading verse...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.targetCard} padding={Spacing.lg}>
            <View style={styles.targetMeta}>
              <View style={[styles.sectionBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={{ color: theme.primary, fontSize: FontSize.xs, fontWeight: '700' }}>TARGET AYAH</Text>
              </View>
              <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs }}>
                {surah?.englishName ?? `Surah ${targetSurah}`} - Ayah {targetAyahNum}
              </Text>
            </View>
            <Text style={{ fontSize: 26, color: theme.text.primary, textAlign: 'right', lineHeight: 50, marginTop: 12 }}>
              {targetText}
            </Text>
            <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm, marginTop: 8, fontStyle: 'italic' }}>
              {surah?.englishNameTranslation}
            </Text>
            <View style={styles.selectorGrid}>
              <Button label="Prev Surah" onPress={choosePreviousSurah} variant="secondary" icon={<SkipBack size={16} color={theme.text.secondary} />} />
              <Button label="Prev Ayah" onPress={choosePreviousAyah} variant="secondary" icon={<SkipBack size={16} color={theme.text.secondary} />} />
              <Button label="Next Ayah" onPress={chooseNextAyah} variant="secondary" icon={<SkipForward size={16} color={theme.text.secondary} />} />
              <Button label="Next Surah" onPress={chooseNextSurah} variant="secondary" icon={<SkipForward size={16} color={theme.text.secondary} />} />
            </View>
            <Button
              label={audio.isPlaying ? 'Stop Reference' : 'Listen to This Ayah'}
              onPress={playReference}
              fullWidth
              variant="primary"
              style={{ marginTop: 12 }}
              icon={<Volume2 size={18} color="#fff" />}
            />
          </Card>

          <Card style={styles.recorderCard} padding={Spacing.xl}>
            <View style={styles.waveformArea}>
              <WaveformVisualizer data={audio.waveformData} isActive={phase === 'recording'} color={theme.primary} height={70} />
            </View>

            {phase === 'recording' && (
              <Text style={[styles.duration, { color: theme.primary }]}>
                {String(Math.floor(audio.duration / 60)).padStart(2, '0')}:{String(audio.duration % 60).padStart(2, '0')}
              </Text>
            )}

            <View style={styles.micArea}>
              {phase === 'idle' && (
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <TouchableOpacity style={[styles.micBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]} onPress={startRecording}>
                    <Mic size={36} color="#fff" />
                  </TouchableOpacity>
                </Animated.View>
              )}
              {phase === 'recording' && (
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <TouchableOpacity style={[styles.micBtn, { backgroundColor: theme.error, shadowColor: theme.error }]} onPress={stopRecording}>
                    <MicOff size={36} color="#fff" />
                  </TouchableOpacity>
                </Animated.View>
              )}
              {phase === 'processing' && (
                <View style={[styles.micBtn, { backgroundColor: theme.gold }]}>
                  <Text style={{ color: '#000', fontWeight: '700', fontSize: FontSize.xs, textAlign: 'center' }}>Processing</Text>
                </View>
              )}
              {phase === 'done' && (
                <TouchableOpacity style={[styles.micBtn, { backgroundColor: theme.success }]} onPress={() => { setPhase('idle'); setLiveText(''); setResult(null); audio.reset(); }}>
                  <RefreshCw size={32} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={{ color: theme.text.tertiary, fontSize: FontSize.sm, textAlign: 'center', marginTop: 12 }}>
              {phase === 'idle' && 'Tap the mic to start reciting this exact ayah'}
              {phase === 'recording' && 'Reciting... tap to stop'}
              {phase === 'processing' && 'Analyzing your recitation...'}
              {phase === 'done' && 'Analysis complete'}
            </Text>
          </Card>

          {(phase === 'recording' || liveText) && (
            <Card padding={Spacing.md}>
              <Text style={{ color: theme.text.tertiary, fontSize: FontSize.xs, fontWeight: '700', marginBottom: 8 }}>LIVE TRANSCRIPTION</Text>
              <Text style={{ fontSize: 22, color: theme.primary, textAlign: 'right', lineHeight: 40 }}>
                {liveText || '...'}
              </Text>
            </Card>
          )}

          {result && phase === 'done' && (
            <View style={styles.resultsSection}>
              <Card style={[styles.scoreCard, { borderColor: result.accuracy >= 80 ? theme.success : theme.error }]} padding={Spacing.lg}>
                <View style={styles.scoreRow}>
                  {result.accuracy >= 80
                    ? <CheckCircle size={32} color={theme.success} />
                    : <AlertCircle size={32} color={theme.error} />}
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.lg }}>
                      Accuracy: {result.accuracy}%
                    </Text>
                    <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm, marginTop: 2 }}>
                      {result.mistakes.length === 0 ? 'Perfect recitation!' : `${result.mistakes.length} mistake(s) found`}
                    </Text>
                  </View>
                </View>
              </Card>

              {result.tajwidFeedback.length > 0 && (
                <Card padding={Spacing.md}>
                  <Text style={{ color: theme.gold, fontSize: FontSize.sm, fontWeight: '700', marginBottom: 8 }}>TAJWID FEEDBACK</Text>
                  {result.tajwidFeedback.map((item, i) => (
                    <View key={`${item.word}-${i}`} style={[styles.tajwidItem, { borderLeftColor: theme.gold }]}>
                      <Text style={{ color: theme.text.primary, fontSize: FontSize.sm }}>{item.description}</Text>
                    </View>
                  ))}
                </Card>
              )}

              <Button
                label="View Detailed Correction"
                onPress={openDetailedCorrection}
                fullWidth
                variant="gold"
                size="lg"
                icon={<ChevronRight size={18} color="#000" />}
              />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' },
  content: { padding: Spacing.lg, paddingBottom: 80, gap: 16 },
  targetCard: {},
  targetMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  selectorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  recorderCard: { alignItems: 'center' },
  waveformArea: { width: '100%', alignItems: 'center', marginBottom: 16 },
  duration: { fontSize: FontSize.xxl, fontWeight: '700', marginBottom: 8 },
  micArea: { marginVertical: 8 },
  micBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  resultsSection: { gap: 12 },
  scoreCard: { borderWidth: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  tajwidItem: { borderLeftWidth: 3, paddingLeft: 10, marginBottom: 6 },
});
