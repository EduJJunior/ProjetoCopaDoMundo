import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../styles/theme';

export function useThemedStyles<T>(factory: (theme: AppTheme) => T): T {
  const { theme } = useTheme();
  return useMemo(() => factory(theme), [theme, factory]);
}
