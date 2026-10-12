import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  mode: 'light' | 'dark';
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
  isDark: boolean;
}

export const lightTheme: Theme = {
  mode: 'light',
  background: '#F1F5F9',
  cardBackground: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  accent: '#2563EB',
  isDark: false,
};

export const darkTheme: Theme = {
  mode: 'dark',
  background: '#121212',
  cardBackground: '#1E1E1E',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  accent: '#3B82F6',
  isDark: true,
};

interface ThemeContextType {
  theme: Theme;
  themeMode: 'light' | 'dark';
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = '@user_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [userTheme, setUserTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setUserTheme(savedTheme);
        }
      } catch (error) {
        console.error('Kunde inte läsa in sparat tema:', error);
      }
    };

    loadSavedTheme();
  }, []);

  const currentMode = userTheme || (systemColorScheme === 'dark' ? 'dark' : 'light');
  const theme: Theme = currentMode === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = async () => {
    const newTheme = currentMode === 'dark' ? 'light' : 'dark';
    setUserTheme(newTheme);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Kunde inte spara tema:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode: currentMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme måste användas inom en ThemeProvider');
  return context;
};