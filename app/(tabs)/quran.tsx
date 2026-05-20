import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Platform, StatusBar, ActivityIndicator, TextInput } from 'react-native';
import { Search, BookMarked, ChevronRight, Play, Plus, Minus, List, Mic, Pause } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { fetchSurahList, fetchSurah } from '@/services/quranService';
import { getAyahAudioUrl } from '@/services/aiService';
import { useAudio } from '@/hooks/useAudio';
import { Surah, Ayah } from '@/types';
import { BISMILLAH, SURAHS } from '@/constants/quran';
import { FontSize, Spacing } from '@/constants/theme';

type QuranView = 'list' | 'reader';

export default function QuranScreen() {
  const { theme } = useApp();
  const [view, setView] = useState<QuranView>('list');
  const [surahs, setSurahs] = useState<Surah[]>(SURAHS);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [activeAyah, setActiveAyah] = useState(0);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  useEffect(() => {
    fetchSurahList().then(setSurahs);
  }, []);

  const filtered = surahs.filter((surah) =>
    surah.englishName.toLowerCase().includes(search.toLowerCase()) ||
    surah.name.includes(search) ||
    String(surah.number).includes(search)
  );

  async function openSurah(surah: Surah) {
    setSelectedSurah(surah);
    setView('reader');
    setLoadingAyahs(true);
    setActiveAyah(0);
    const data = await fetchSurah(surah.number);
    setAyahs(data);
    setLoadingAyahs(false);
  }

  if (view === 'reader' && selectedSurah) {
    return (
      <SurahReader
        surah={selectedSurah}
        ayahs={ayahs}
        surahs={surahs}
        loading={loadingAyahs}
        activeAyah={activeAyah}
        setActiveAyah={setActiveAyah}
        onBack={() => setView('list')}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>Quran</Text>
            <Text style={{ color: theme.gold, fontSize: FontSize.sm }}>القرآن الكريم</Text>
          </View>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={[styles.iconBtn, { backgroundColor: theme.surfaceSecondary }]}>
            <Search size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>
        {showSearch && (
          <View style={[styles.searchBox, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
            <Search size={16} color={theme.text.tertiary} />
            <TextInput
              placeholder="Search surah..."
              placeholderTextColor={theme.text.tertiary}
              value={search}
              onChangeText={setSearch}
              style={{ flex: 1, color: theme.text.primary, fontSize: FontSize.md, marginLeft: 8 }}
            />
          </View>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={{ padding: Spacing.md }}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: theme.border, marginHorizontal: Spacing.md }} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.surahRow, { backgroundColor: theme.surface }]} onPress={() => openSurah(item)} activeOpacity={0.7}>
            <View style={[styles.surahNum, { backgroundColor: theme.primaryLight }]}>
              <Text style={{ color: theme.primary, fontSize: FontSize.sm, fontWeight: '700' }}>{item.number}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ color: theme.text.primary, fontSize: FontSize.md, fontWeight: '600' }}>{item.englishName}</Text>
              <Text style={{ color: theme.text.secondary, fontSize: FontSize.xs, marginTop: 2 }}>
                {item.englishNameTranslation} - {item.numberOfAyahs} verses - {item.revelationType}
              </Text>
            </View>
            <Text style={{ color: theme.primary, fontSize: 18, marginRight: 8 }}>{item.name}</Text>
            <ChevronRight size={16} color={theme.text.tertiary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function SurahReader({
  surah,
  ayahs,
  surahs,
  loading,
  activeAyah,
  setActiveAyah,
  onBack,
}: {
  surah: Surah;
  ayahs: Ayah[];
  surahs: Surah[];
  loading: boolean;
  activeAyah: number;
  setActiveAyah: (n: number) => void;
  onBack: () => void;
}) {
  const { theme, settings } = useApp();
  const router = useRouter();
  const audio = useAudio();
  const [fontSize, setFontSize] = useState(28);
  const [readerSurah, setReaderSurah] = useState(surah);
  const [readerAyahs, setReaderAyahs] = useState<Ayah[]>(ayahs);
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  useEffect(() => {
    setReaderSurah(surah);
    setReaderAyahs(ayahs);
  }, [surah, ayahs]);

  useEffect(() => {
    return () => audio.stopAudio();
  }, []);

  async function playAyah(ayah: Ayah) {
    if (audio.isPlaying) {
      audio.stopAudio();
      return;
    }

    const startIndex = Math.max(0, readerAyahs.findIndex((item) => item.numberInSurah === ayah.numberInSurah));
    const queue: { url: string; surah: Surah; ayahs: Ayah[]; index: number }[] = readerAyahs.slice(startIndex).map((item, index) => ({
      url: getAyahAudioUrl(readerSurah.number, item.numberInSurah, settings.reciter),
      surah: readerSurah,
      ayahs: readerAyahs,
      index: startIndex + index,
    }));

    const nextSurah = surahs.find((item) => item.number === readerSurah.number + 1);
    if (nextSurah) {
      const nextAyahs = await fetchSurah(nextSurah.number);
      nextAyahs.forEach((item, index) => {
        queue.push({
          url: getAyahAudioUrl(nextSurah.number, item.numberInSurah, settings.reciter),
          surah: nextSurah,
          ayahs: nextAyahs,
          index,
        });
      });
    }

    setActiveAyah(startIndex);
    audio.playQueue(
      queue.map((item) => item.url),
      undefined,
      (queueIndex) => {
        const current = queue[queueIndex];
        if (!current) return;
        setReaderSurah(current.surah);
        setReaderAyahs(current.ayahs);
        setActiveAyah(current.index);
      }
    );
  }

  function practiceAyah(ayah: Ayah) {
    audio.stopAudio();
    router.push({
      pathname: '/(tabs)/recite',
      params: {
        surah: String(readerSurah.number),
        ayah: String(ayah.numberInSurah),
      },
    } as any);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.readerHeader, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={{ padding: 6, marginRight: 8 }}>
          <List size={22} color={theme.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.lg }}>{readerSurah.englishName}</Text>
          <Text style={{ color: theme.gold, fontSize: FontSize.xs }}>{readerSurah.name} - {readerSurah.numberOfAyahs} ayahs</Text>
        </View>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.surfaceSecondary }]} onPress={() => setFontSize((size) => Math.min(44, size + 2))}>
          <Plus size={16} color={theme.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.surfaceSecondary, marginLeft: 8 }]} onPress={() => setFontSize((size) => Math.max(18, size - 2))}>
          <Minus size={16} color={theme.text.secondary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.primary} size="large" />
          <Text style={{ color: theme.text.secondary, marginTop: 12 }}>Loading surah...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.readerContent}>
          {readerSurah.number !== 1 && readerSurah.number !== 9 && (
            <Text style={[styles.bismillah, { color: theme.primary, fontSize: fontSize - 2 }]}>{BISMILLAH}</Text>
          )}

          <View style={[styles.surahHeader, { backgroundColor: theme.primaryLight, borderColor: `${theme.gold}40` }]}>
            <Text style={{ color: theme.primary, fontSize: 22, fontWeight: '800' }}>{readerSurah.name}</Text>
            <Text style={{ color: theme.text.secondary, fontSize: FontSize.sm, marginTop: 4 }}>
              {readerSurah.englishNameTranslation} - {readerSurah.revelationType}
            </Text>
          </View>

          <View style={styles.ayahsContainer}>
            {readerAyahs.map((ayah, idx) => (
              <TouchableOpacity
                key={`${readerSurah.number}-${ayah.numberInSurah}`}
                style={[
                  styles.ayahBlock,
                  {
                    backgroundColor: activeAyah === idx ? theme.primaryLight : theme.surface,
                    borderColor: activeAyah === idx ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setActiveAyah(idx)}
                activeOpacity={0.7}
              >
                <View style={styles.ayahMeta}>
                  <View style={[styles.ayahNumBadge, { backgroundColor: theme.primary }]}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{ayah.numberInSurah}</Text>
                  </View>
                  <TouchableOpacity style={[styles.playBtn, { backgroundColor: theme.primaryLight }]} onPress={() => playAyah(ayah)}>
                    {audio.isPlaying && activeAyah === idx ? (
                      <Pause size={12} color={theme.primary} fill={theme.primary} />
                    ) : (
                      <Play size={12} color={theme.primary} fill={theme.primary} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.playBtn, { backgroundColor: theme.goldLight }]} onPress={() => practiceAyah(ayah)}>
                    <Mic size={12} color={theme.gold} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.playBtn, { backgroundColor: theme.surfaceSecondary }]}>
                    <BookMarked size={12} color={theme.text.secondary} />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize, color: theme.text.primary, textAlign: 'right', lineHeight: fontSize * 1.9, direction: 'rtl' }}>
                  {ayah.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 4 },
  surahRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: Spacing.md },
  surahNum: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  readerHeader: { paddingHorizontal: Spacing.md, paddingBottom: 12, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' },
  readerContent: { padding: Spacing.lg, paddingBottom: 80 },
  bismillah: { textAlign: 'center', marginBottom: Spacing.lg },
  surahHeader: { borderRadius: 16, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.lg, borderWidth: 1 },
  ayahsContainer: { gap: 12 },
  ayahBlock: { borderRadius: 16, padding: Spacing.md, borderWidth: 1.5 },
  ayahMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  ayahNumBadge: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  playBtn: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
