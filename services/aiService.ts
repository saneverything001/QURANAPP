import { RECITER_AUDIO_EDITIONS, SURAH_AYAH_COUNTS } from '@/constants/quran';
import { RecitationResult, TajwidError, WordMistake, ReciterKey } from '@/types';

interface BrowserSpeechRecognitionResult {
  isFinal: boolean;
  0?: { transcript?: string };
}

interface BrowserSpeechRecognitionEvent {
  results: ArrayLike<BrowserSpeechRecognitionResult>;
}

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

const DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL = /\u0640/g;

export function normalizeArabic(text: string, keepDiacritics = false): string {
  const normalized = text
    .replace(TATWEEL, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\u0600-\u06FF\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return keepDiacritics ? normalized : normalized.replace(DIACRITICS, '');
}

function wordDistance(a: string, b: string): number {
  const left = normalizeArabic(a);
  const right = normalizeArabic(b);
  if (left.length === 0) return right.length;
  if (right.length === 0) return left.length;

  const dp = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));
  for (let i = 0; i <= left.length; i++) dp[i][0] = i;
  for (let j = 0; j <= right.length; j++) dp[0][j] = j;

  for (let i = 1; i <= left.length; i++) {
    for (let j = 1; j <= right.length; j++) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[left.length][right.length];
}

function classifyMistake(userWord: string | undefined, correctWord: string | undefined): WordMistake['type'] {
  if (!userWord && correctWord) return 'omission';
  if (userWord && !correctWord) return 'addition';
  if (!userWord || !correctWord) return 'substitution';
  return wordDistance(userWord, correctWord) <= 2 ? 'mispronunciation' : 'substitution';
}

function buildMistakeFeedback(mistake: WordMistake): TajwidError {
  const word = mistake.correctWord || mistake.word;
  const normalized = normalizeArabic(word);

  if (/[اويى]/.test(normalized)) {
    return {
      word,
      position: mistake.position,
      type: 'elongation',
      description: `Review the madd length in "${word}". Stretch natural madd for 2 counts and avoid rushing long vowels.`,
      severity: mistake.type === 'omission' ? 'major' : 'minor',
    };
  }

  if (/[نم]/.test(normalized) || /[ًٌٍ]/.test(word)) {
    return {
      word,
      position: mistake.position,
      type: 'nasalization',
      description: `Check the ghunnah/nasal sound around "${word}" and keep it clear for the correct count.`,
      severity: 'minor',
    };
  }

  return {
    word,
    position: mistake.position,
    type: 'pronunciation',
    description: `Compare your articulation of "${word}" with the reference recitation, especially the makhraj of each letter.`,
    severity: mistake.type === 'substitution' || mistake.type === 'omission' ? 'major' : 'minor',
  };
}

export async function transcribeArabicSpeech(audioBlob: Blob): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return '';
}

export async function compareRecitation(userText: string, correctText: string): Promise<RecitationResult> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const userWords = userText.split(/\s+/).filter(Boolean);
  const correctWords = correctText.split(/\s+/).filter(Boolean);
  const mistakes: WordMistake[] = [];
  let matchedScore = 0;
  let userIndex = 0;

  correctWords.forEach((correctWord, correctIndex) => {
    const current = userWords[userIndex];
    const next = userWords[userIndex + 1];
    const allowedDistance = Math.max(1, Math.ceil(normalizeArabic(correctWord).length * 0.3));
    const currentDistance = current ? wordDistance(current, correctWord) : Number.POSITIVE_INFINITY;
    const nextDistance = next ? wordDistance(next, correctWord) : Number.POSITIVE_INFINITY;

    if (current && currentDistance === 0) {
      matchedScore += 1;
      userIndex += 1;
      return;
    }

    if (current && currentDistance <= allowedDistance) {
      matchedScore += 0.68;
      mistakes.push({ word: current, correctWord, position: correctIndex, type: classifyMistake(current, correctWord) });
      userIndex += 1;
      return;
    }

    if (next && nextDistance <= allowedDistance) {
      mistakes.push({ word: '', correctWord, position: correctIndex, type: 'omission' });
      return;
    }

    mistakes.push({
      word: current ?? '',
      correctWord,
      position: correctIndex,
      type: classifyMistake(current, correctWord),
    });
    if (current) userIndex += 1;
  });

  userWords.slice(userIndex).forEach((word, offset) => {
    mistakes.push({ word, correctWord: '', position: correctWords.length + offset, type: 'addition' });
  });

  const accuracy = correctWords.length > 0 ? Math.max(0, Math.round((matchedScore / correctWords.length) * 100)) : 0;
  const tajwidFeedback = [
    ...mistakes.slice(0, 4).map(buildMistakeFeedback),
    ...analyzeTajwidSync(correctText),
  ].slice(0, 6);

  return {
    userText,
    correctText,
    accuracy,
    mistakes,
    tajwidFeedback,
  };
}

function analyzeTajwidSync(arabicText: string): TajwidError[] {
  const words = arabicText.split(/\s+/).filter(Boolean);
  const feedback: TajwidError[] = [];
  const seen = new Set<string>();

  words.forEach((word, position) => {
    if (seen.has(word)) return;
    const bare = normalizeArabic(word);

    if (/[اويىٰ]/.test(word) && feedback.length < 2) {
      seen.add(word);
      feedback.push({
        word,
        position,
        type: 'elongation',
        description: `Madd in "${word}": hold the long vowel steadily for its proper count and avoid clipping it.`,
        severity: 'minor',
      });
    }

    if (/[قطبجدْ]$/.test(word) || /[قطبجد]\u0652/.test(word)) {
      seen.add(word);
      feedback.push({
        word,
        position,
        type: 'pronunciation',
        description: `Qalqalah in "${word}": give ق ط ب ج د a light echo when paused on or marked with sukoon.`,
        severity: 'minor',
      });
    }

    if (bare.includes('الله') || word.includes('اللَّه')) {
      seen.add(word);
      feedback.push({
        word,
        position,
        type: 'pronunciation',
        description: `Name of Allah "اللَّه": keep the lam heavy or light according to the vowel before it.`,
        severity: 'minor',
      });
    }

    if (/[أؤئء]/.test(word)) {
      seen.add(word);
      feedback.push({
        word,
        position,
        type: 'pronunciation',
        description: `Hamza in "${word}": pronounce the glottal stop clearly without softening it.`,
        severity: 'minor',
      });
    }

    if (/[ًٌٍ]|[نم][ّْ]/.test(word)) {
      seen.add(word);
      feedback.push({
        word,
        position,
        type: 'nasalization',
        description: `Ghunnah in "${word}": keep the nasal sound clear for the correct count.`,
        severity: 'minor',
      });
    }
  });

  return feedback.slice(0, 5);
}

export async function analyzeTajwid(arabicText: string): Promise<TajwidError[]> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return analyzeTajwidSync(arabicText);
}

export async function generateCorrectRecitationAudio(ayahText: string, reciter: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return '';
}

export async function startRealtimeSpeechRecognition(
  onResult: (text: string, isFinal: boolean) => void
): Promise<() => void> {
  if (typeof window !== 'undefined') {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (Recognition) {
      const recognition = new Recognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript ?? '')
          .join(' ')
          .trim();
        const finalResult = Array.from(event.results).some((result) => result.isFinal);
        onResult(transcript, finalResult);
      };
      recognition.start();
      return () => recognition.stop();
    }
  }

  const words = ['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ'];
  let index = 0;
  const interval = setInterval(() => {
    onResult(words.slice(0, index + 1).join(' '), index === words.length - 1);
    index = Math.min(index + 1, words.length - 1);
  }, 650);

  return () => clearInterval(interval);
}

export function getGlobalAyahNumber(surahNumber: number, ayahNumber: number): number {
  const previousAyahs = SURAH_AYAH_COUNTS
    .slice(0, Math.max(0, surahNumber - 1))
    .reduce((total, count) => total + count, 0);
  return previousAyahs + ayahNumber;
}

export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciter: ReciterKey): string {
  return getAyahAudioUrlByGlobalNumber(getGlobalAyahNumber(surahNumber, ayahNumber), reciter);
}

export function getAyahAudioUrlByGlobalNumber(globalAyahNumber: number, reciter: ReciterKey): string {
  const edition = RECITER_AUDIO_EDITIONS[reciter] ?? RECITER_AUDIO_EDITIONS.mishary_alafasy;
  return `https://cdn.islamic.network/quran/audio/128/${edition}/${globalAyahNumber}.mp3`;
}
