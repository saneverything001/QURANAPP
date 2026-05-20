import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { fetchSurahList, fetchSurah } from '@/services/quranService';
import { SURAHS } from '@/constants/quran';
import { Surah, Ayah } from '@/types';
import { FontSize, Spacing, BorderRadius, Colors } from '@/constants/theme';

type SelectionStep = 'surah' | 'ayah';

export default function SelectVerseScreen() {
  const { theme } = useApp();
  const router = useRouter();
  const [step, setStep] = useState<SelectionStep>('surah');
  const [surahs, setSurahs] = useState<Surah[]>(SURAHS);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [search, setSearch] = useState('');
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const statusBarH = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

  useEffect(() => {
    fetchSurahList().then(setSurahs);
  }, []);

  const filteredSurahs = surahs.filter(s =>
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    s.name.includes(search) ||
    String(s.number).includes(search)
  );

  async function selectSurah(surah: Surah) {
    setSelectedSurah(surah);
    setLoadingAyahs(true);
    const data = await fetchSurah(surah.number);
    setAyahs(data);
    setLoadingAyahs(false);
    setStep('ayah');
  }

  function selectAyah(ayah: Ayah) {
    router.push({
      pathname: '/recite',
      params: {
        surah: String(selectedSurah!.number),
        ayah: String(ayah.numberInSurah),
      },
    } as any);
  }

  if (step === 'ayah' && selectedSurah) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => setStep('surah')} style={{ marginRight: 12 }}>
            <ChevronLeft size={24} color={theme.text.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text.primary, fontSize: FontSize.lg, fontWeight: '800' }}>Select Ayah</Text>
            <Text style={{ color: theme.gold, fontSize: FontSize.xs }}>{selectedSurah.englishName}</Text>
          </View>
        </View>

        {loadingAyahs ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={theme.primary} size="large" />
          </View>
        ) : (
          <FlatList
            data={ayahs}
            keyExtractor={(item) => String(item.numberInSurah)}
            contentContainerStyle={{ padding: Spacing.md, paddingBottom: 80 }}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.ayahCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => selectAyah(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.ayahNumber, { backgroundColor: theme.primaryLight }]}>
                  <Text style={{ color: theme.primary, fontWeight: '800' }}>{item.numberInSurah}</Text>
                </View>
                <Text
                  style={{ color: theme.text.primary, fontSize: FontSize.md, textAlign: 'right', flex: 1, lineHeight: 24, marginRight: 12 }}
                  numberOfLines={2}
                >
                  {item.text}
                </Text>
                <ChevronRight size={16} color={theme.text.tertiary} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, paddingTop: statusBarH + 8, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text.primary, fontSize: FontSize.xl, fontWeight: '800' }}>Select Verse to Practice</Text>
          <Text style={{ color: theme.gold, fontSize: FontSize.xs }}>اختر آية للممارسة</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md }}>
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
      </View>

      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 80, gap: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.surahCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => selectSurah(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.surahNumber, { backgroundColor: theme.primaryLight }]}>
              <Text style={{ color: theme.primary, fontWeight: '800', fontSize: FontSize.lg }}>{item.number}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: theme.text.primary, fontWeight: '700', fontSize: FontSize.md }}>{item.englishName}</Text>
              <Text style={{ color: theme.text.secondary, fontSize: FontSize.xs, marginTop: 2 }}>
                {item.englishNameTranslation} • {item.numberOfAyahs} verses
              </Text>
            </View>
            <Text style={{ color: theme.primary, fontSize: 18 }}>{item.name}</Text>
            <ChevronRight size={16} color={theme.text.tertiary} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 },
  surahCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderRadius: 12, borderWidth: 1 },
  surahNumber: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  ayahCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderRadius: 12, borderWidth: 1 },
  ayahNumber: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
