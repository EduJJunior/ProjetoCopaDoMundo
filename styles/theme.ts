export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  secondaryMuted: string;
  accent: string;
  text: string;
  textSecondary: string;
  textInverse: string;
  border: string;
  borderStrong: string;
  success: string;
  error: string;
  warning: string;
  overlay: string;
  gradientStart: string;
  gradientEnd: string;
  tabBar: string;
  tabBarBorder: string;
  chip: string;
  chipActive: string;
  chipText: string;
  chipTextActive: string;
  inputBg: string;
  shadow: string;
  albumSheet: string;
  albumBorder: string;
};

export type AppTheme = {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    fontRegular: string;
    fontMedium: string;
    fontSemiBold: string;
    fontBold: string;
  };
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
};

const shared = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24, full: 999 },
  typography: {
    fontRegular: 'Outfit_400Regular',
    fontMedium: 'Outfit_500Medium',
    fontSemiBold: 'Outfit_600SemiBold',
    fontBold: 'Outfit_700Bold',
  },
};

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: '#F0F2F8',
    backgroundAlt: '#E4E8F2',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    primary: '#8B1538',
    primaryLight: '#A91D45',
    secondary: '#C9A227',
    secondaryMuted: '#E8D48A',
    accent: '#1B8A4B',
    text: '#141824',
    textSecondary: '#5C6478',
    textInverse: '#FFFFFF',
    border: '#E2E6EF',
    borderStrong: '#C8CED9',
    success: '#1B8A4B',
    error: '#C62828',
    warning: '#E65100',
    overlay: 'rgba(20, 24, 36, 0.45)',
    gradientStart: '#8B1538',
    gradientEnd: '#5C0F28',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E6EF',
    chip: '#FFFFFF',
    chipActive: '#8B1538',
    chipText: '#5C6478',
    chipTextActive: '#FFFFFF',
    inputBg: '#FFFFFF',
    shadow: '#141824',
    albumSheet: '#FFFBF5',
    albumBorder: '#C9A227',
  },
  ...shared,
  shadows: {
    sm: {
      shadowColor: '#141824',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#141824',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#0C1017',
    backgroundAlt: '#141B26',
    surface: '#171E2B',
    surfaceElevated: '#1E2738',
    primary: '#E0456A',
    primaryLight: '#F06B88',
    secondary: '#F5C842',
    secondaryMuted: '#B8941F',
    accent: '#34D399',
    text: '#F0F2F8',
    textSecondary: '#9AA3B5',
    textInverse: '#0C1017',
    border: '#2A3344',
    borderStrong: '#3D4A60',
    success: '#34D399',
    error: '#F87171',
    warning: '#FB923C',
    overlay: 'rgba(0, 0, 0, 0.6)',
    gradientStart: '#1E2738',
    gradientEnd: '#8B1538',
    tabBar: '#141B26',
    tabBarBorder: '#2A3344',
    chip: '#1E2738',
    chipActive: '#E0456A',
    chipText: '#9AA3B5',
    chipTextActive: '#FFFFFF',
    inputBg: '#1E2738',
    shadow: '#000000',
    albumSheet: '#1A2230',
    albumBorder: '#F5C842',
  },
  ...shared,
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 6,
    },
  },
};

/** @deprecated Use useTheme() hook instead */
export const theme = lightTheme;
