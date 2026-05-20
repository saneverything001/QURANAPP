import { Reciter, Surah } from '@/types';

export const RECITERS: Reciter[] = [
  { key: 'mishary_alafasy', name: 'Mishary Rashid Alafasy', arabicName: 'مشاري راشد العفاسي', style: 'Murattal' },
  { key: 'abdul_basit', name: 'Abdul Basit Abdus Samad', arabicName: 'عبد الباسط عبد الصمد', style: 'Mujawwad' },
  { key: 'maher_al_muaiqly', name: 'Maher Al Muaiqly', arabicName: 'ماهر المعيقلي', style: 'Murattal' },
  { key: 'saad_al_ghamdi', name: "Sa'd Al-Ghamdi", arabicName: 'سعد الغامدي', style: 'Murattal' },
  { key: 'mahmoud_khalil', name: 'Mahmoud Khalil Al-Husary', arabicName: 'محمود خليل الحصري', style: 'Murattal' },
];

export const RECITER_AUDIO_EDITIONS: Record<Reciter['key'], string> = {
  mishary_alafasy: 'ar.alafasy',
  abdul_basit: 'ar.abdulbasitmurattal',
  maher_al_muaiqly: 'ar.mahermuaiqly',
  saad_al_ghamdi: 'ar.saadalghamdi',
  mahmoud_khalil: 'ar.husary',
};

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'ur', name: 'اردو' },
  { code: 'tr', name: 'Turkce' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'fr', name: 'Francais' },
];

export const SURAH_AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98,
  135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75,
  85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29,
  19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3,
  9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

export const SURAHS: Surah[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan' },
  { number: 3, name: 'آل عمران', englishName: "Ali 'Imran", englishNameTranslation: 'Family of Imran', numberOfAyahs: 200, revelationType: 'Medinan' },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan' },
  { number: 5, name: 'المائدة', englishName: "Al-Ma'idah", englishNameTranslation: 'The Table Spread', numberOfAyahs: 120, revelationType: 'Medinan' },
  { number: 6, name: 'الأنعام', englishName: "Al-An'am", englishNameTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'Meccan' },
  { number: 7, name: 'الأعراف', englishName: "Al-A'raf", englishNameTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'Meccan' },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', englishNameTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'Medinan' },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', englishNameTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'Medinan' },
  { number: 10, name: 'يونس', englishName: 'Yunus', englishNameTranslation: 'Jonah', numberOfAyahs: 109, revelationType: 'Meccan' },
  { number: 11, name: 'هود', englishName: 'Hud', englishNameTranslation: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan' },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', englishNameTranslation: 'Joseph', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 13, name: 'الرعد', englishName: "Ar-Ra'd", englishNameTranslation: 'The Thunder', numberOfAyahs: 43, revelationType: 'Medinan' },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', englishNameTranslation: 'The Rocky Tract', numberOfAyahs: 99, revelationType: 'Meccan' },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', englishNameTranslation: 'Ya Sin', numberOfAyahs: 83, revelationType: 'Meccan' },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', englishNameTranslation: 'The Beneficent', numberOfAyahs: 78, revelationType: 'Medinan' },
  { number: 56, name: 'الواقعة', englishName: "Al-Waqi'ah", englishNameTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan' },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 78, name: 'النبأ', englishName: "An-Naba'", englishNameTranslation: 'The Tidings', numberOfAyahs: 40, revelationType: 'Meccan' },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', englishNameTranslation: 'Sincerity', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 114, name: 'الناس', englishName: 'An-Nas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan' },
];

export const SAMPLE_AYAHS: Record<number, string[]> = {
  1: [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    'الرَّحْمَٰنِ الرَّحِيمِ',
    'مَالِكِ يَوْمِ الدِّينِ',
    'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
  ],
  112: [
    'قُلْ هُوَ اللَّهُ أَحَدٌ',
    'اللَّهُ الصَّمَدُ',
    'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
  ],
  113: [
    'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    'مِن شَرِّ مَا خَلَقَ',
    'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
    'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
  ],
  114: [
    'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    'مَلِكِ النَّاسِ',
    'إِلَٰهِ النَّاسِ',
    'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
    'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
    'مِنَ الْجِنَّةِ وَالنَّاسِ',
  ],
};

export const TAJWID_RULES = [
  { rule: 'Ikhfa', arabic: 'إخفاء', description: 'Hide the sound of noon sakinah or tanwin with a light nasal sound before one of the ikhfa letters.', example: 'مِن شَرِّ' },
  { rule: 'Idgham', arabic: 'إدغام', description: 'Merge noon sakinah or tanwin into the next letter when it is one of ي ر م ل و ن.', example: 'مَن يَقُولُ' },
  { rule: 'Iqlab', arabic: 'إقلاب', description: 'Change noon sakinah or tanwin into a meem sound before the letter ba with ghunnah.', example: 'مِن بَعْدِ' },
  { rule: 'Izhar', arabic: 'إظهار', description: 'Pronounce noon sakinah or tanwin clearly before throat letters ء ه ع ح غ خ.', example: 'مِنْهُمْ' },
  { rule: 'Madd', arabic: 'مد', description: 'Lengthen the vowel sound when a madd letter follows a matching vowel.', example: 'الرَّحْمَٰنِ' },
  { rule: 'Qalqalah', arabic: 'قلقلة', description: 'Make a light echo on the letters ق ط ب ج د when they carry sukoon or occur at a stop.', example: 'أَحَدٌ' },
  { rule: 'Waqf', arabic: 'وقف', description: 'Stop cleanly at pause marks and avoid cutting meaning in the middle of a phrase.', example: 'الْعَالَمِينَ' },
  { rule: 'Tafkhim', arabic: 'تفخيم', description: 'Give heavy resonance to emphatic letters and to the name of Allah in the correct contexts.', example: 'اللَّهُ الصَّمَدُ' },
  { rule: 'Tarqiq', arabic: 'ترقيق', description: 'Keep light letters thin and clear without adding heaviness.', example: 'بِسْمِ' },
];

export const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
