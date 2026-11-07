// src/utils/themeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeId, ThemeConfig, THEMES } from '../types/themes';
import { sound } from './soundEngine';

interface ThemeContextType {
  theme: ThemeConfig;
  currentThemeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('mekif_theme');
    if (saved && saved in THEMES) {
      return saved as ThemeId;
    }
    return 'classic';
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => sound.isEnabled());

  useEffect(() => {
    const isDark = currentThemeId === 'gaming' || currentThemeId === 'scifi';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    Object.keys(THEMES).forEach((t) => document.documentElement.classList.remove(`theme-${t}`));
    document.documentElement.classList.add(`theme-${currentThemeId}`);
  }, [currentThemeId]);

  const handleSetTheme = (id: ThemeId) => {
    if (id in THEMES) {
      setCurrentThemeId(id);
      localStorage.setItem('mekif_theme', id);
      sound.playThemeSwitch();
    }
  };

  const handleToggleSound = () => {
    const next = sound.toggle();
    setIsSoundEnabled(next);
  };

  const theme = THEMES[currentThemeId] || THEMES.classic;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentThemeId,
        setTheme: handleSetTheme,
        isSoundEnabled,
        toggleSound: handleToggleSound,
      }}
    >
      <div className={`min-h-screen transition-colors duration-300 ${theme.bodyBg}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
