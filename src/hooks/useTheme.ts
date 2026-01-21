// Gold and Black Theme Hook

import { useState, useCallback, useEffect } from 'react';
import { goldColors, obsidianColors, royalColors, themeConfig } from '@/utils/theme';

export interface ThemeState {
  isDark: boolean;
  primaryColor: string;
  accentColor: string;
}

export const useTheme = () => {
  const [isDark, setIsDark] = useState(true); // Default to dark for gold/black theme

  useEffect(() => {
    // For gold and black theme, always use dark mode
    setIsDark(true);
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const getBackgroundColor = useCallback(() => {
    return isDark ? obsidianColors[50] : goldColors[100];
  }, [isDark]);

  const getTextColor = useCallback(() => {
    return isDark ? goldColors[400] : obsidianColors[50];
  }, [isDark]);

  const getSurfaceColor = useCallback(() => {
    return isDark ? obsidianColors[100] : goldColors[50];
  }, [isDark]);

  const getPrimaryColor = useCallback(() => {
    return goldColors[500];
  }, []);

  const getAccentColor = useCallback(() => {
    return royalColors.medium;
  }, []);

  return {
    isDark,
    toggleDark,
    colors: goldColors,
    obsidian: obsidianColors,
    royal: royalColors,
    config: themeConfig,
    getBackgroundColor,
    getTextColor,
    getSurfaceColor,
    getPrimaryColor,
    getAccentColor,
  };
};

export default useTheme;
