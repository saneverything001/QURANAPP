export const Colors = {
  // Primary green shades
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  // Gold shades
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Neutral
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    1000: '#000000',
  },
  // Semantic
  success: '#16a34a',
  error: '#dc2626',
  warning: '#d97706',
  info: '#0284c7',
};

export const lightTheme = {
  background: Colors.neutral[50],
  surface: Colors.neutral[0],
  surfaceSecondary: Colors.neutral[100],
  border: Colors.neutral[200],
  text: {
    primary: Colors.neutral[900],
    secondary: Colors.neutral[600],
    tertiary: Colors.neutral[400],
    inverse: Colors.neutral[0],
  },
  primary: Colors.primary[700],
  primaryLight: Colors.primary[100],
  primaryDark: Colors.primary[900],
  gold: Colors.gold[500],
  goldLight: Colors.gold[100],
  error: Colors.error,
  success: Colors.success,
  tabBar: Colors.neutral[0],
  tabBarBorder: Colors.neutral[200],
  card: Colors.neutral[0],
  shadow: 'rgba(0,0,0,0.08)',
};

export const darkTheme = {
  background: '#0a0f0a',
  surface: '#111811',
  surfaceSecondary: '#1a2a1a',
  border: '#2a3d2a',
  text: {
    primary: Colors.neutral[50],
    secondary: Colors.neutral[300],
    tertiary: Colors.neutral[500],
    inverse: Colors.neutral[900],
  },
  primary: Colors.primary[400],
  primaryLight: Colors.primary[900],
  primaryDark: Colors.primary[200],
  gold: Colors.gold[400],
  goldLight: Colors.gold[900],
  error: '#ef4444',
  success: '#4ade80',
  tabBar: '#111811',
  tabBarBorder: '#2a3d2a',
  card: '#111811',
  shadow: 'rgba(0,0,0,0.4)',
};

export type Theme = typeof lightTheme;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const ArabicFontSize = {
  small: 20,
  medium: 26,
  large: 32,
  xlarge: 40,
};
