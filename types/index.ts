export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  language: string;
  reciter: string;
  streak_days: number;
  total_points: number;
  dark_mode: boolean;
  notifications_enabled: boolean;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  text: string;
  surah: number;
  numberInSurah: number;
  juz: number;
  page: number;
  audio?: string;
}

export interface TajwidError {
  word: string;
  position: number;
  type: 'elongation' | 'nasalization' | 'stopping' | 'pronunciation' | 'rhythm';
  description: string;
  severity: 'minor' | 'major';
}

export interface RecitationResult {
  userText: string;
  correctText: string;
  accuracy: number;
  mistakes: WordMistake[];
  tajwidFeedback: TajwidError[];
  audioUrl?: string;
  userAudioUrl?: string;
}

export interface WordMistake {
  word: string;
  correctWord: string;
  position: number;
  type: 'omission' | 'substitution' | 'addition' | 'mispronunciation';
}

export interface MemorizationProgress {
  surahNumber: number;
  ayahNumber: number;
  status: 'learning' | 'memorized' | 'reviewing';
  lastPracticed: Date;
  streakCount: number;
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  note?: string;
  createdAt: Date;
}

export interface RecitationSession {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  accuracyScore: number;
  tajwidFeedback: TajwidError[];
  mistakes: WordMistake[];
  audioUrl?: string;
  durationSeconds: number;
  createdAt: Date;
}

export interface DailyGoal {
  id: string;
  goalDate: string;
  targetAyahs: number;
  completedAyahs: number;
  isCompleted: boolean;
}

export type ReciterKey =
  | 'mishary_alafasy'
  | 'abdul_basit'
  | 'maher_al_muaiqly'
  | 'saad_al_ghamdi'
  | 'mahmoud_khalil';

export interface Reciter {
  key: ReciterKey;
  name: string;
  arabicName: string;
  style: string;
}

export interface AppSettings {
  darkMode: boolean;
  reciter: ReciterKey;
  language: string;
  arabicFontSize: 'small' | 'medium' | 'large' | 'xlarge';
  notificationsEnabled: boolean;
  offlineMode: boolean;
}
