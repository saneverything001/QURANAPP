import { Surah, Ayah } from '@/types';
import { SURAHS, SAMPLE_AYAHS } from '@/constants/quran';

const API_BASE = 'https://api.alquran.cloud/v1';

export async function fetchSurahList(): Promise<Surah[]> {
  try {
    const res = await fetch(`${API_BASE}/surah`);
    const data = await res.json();
    if (data.code === 200) {
      return data.data.map((s: any) => ({
        number: s.number,
        name: s.name,
        englishName: s.englishName,
        englishNameTranslation: s.englishNameTranslation,
        numberOfAyahs: s.numberOfAyahs,
        revelationType: s.revelationType,
      }));
    }
  } catch {}
  return SURAHS;
}

export async function fetchSurah(surahNumber: number): Promise<Ayah[]> {
  try {
    const res = await fetch(`${API_BASE}/surah/${surahNumber}`);
    const data = await res.json();
    if (data.code === 200) {
      return data.data.ayahs.map((a: any) => ({
        number: a.number,
        text: a.text,
        surah: surahNumber,
        numberInSurah: a.numberInSurah,
        juz: a.juz,
        page: a.page,
      }));
    }
  } catch {}
  const texts = SAMPLE_AYAHS[surahNumber] ?? [];
  return texts.map((text, i) => ({
    number: (surahNumber - 1) * 100 + i + 1,
    text,
    surah: surahNumber,
    numberInSurah: i + 1,
    juz: 1,
    page: 1,
  }));
}

export async function fetchAyahTranslation(ayahNumber: number, language = 'en'): Promise<string> {
  try {
    const edition = language === 'en' ? 'en.sahih' : `${language}.sahih`;
    const res = await fetch(`${API_BASE}/ayah/${ayahNumber}/${edition}`);
    const data = await res.json();
    if (data.code === 200) return data.data.text;
  } catch {}
  return '';
}

export function getSurahByNumber(number: number): Surah | undefined {
  return SURAHS.find((s) => s.number === number);
}
