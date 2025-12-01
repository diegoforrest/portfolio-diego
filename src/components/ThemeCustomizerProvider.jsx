import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeCustomizerContext = createContext(null);

const DEFAULT_THEME = {
  primaryColor: 'oklch(63.7% .237 25.331)', // Red
  fontFamily: '"Inter", system-ui, sans-serif',
  textSize: 1,
};

const getStoredTheme = () => {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = localStorage.getItem('customTheme');
  return stored ? JSON.parse(stored) : DEFAULT_THEME;
};

export function ThemeCustomizerProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme);
  const [history, setHistory] = useState([getStoredTheme()]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Primary color
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--accent-color', theme.primaryColor);
    root.style.setProperty('--hover-border', theme.primaryColor);
    root.style.setProperty('--gradient-start', theme.primaryColor);
    
    // Font family
    root.style.setProperty('--font-family', theme.fontFamily);
    document.body.style.fontFamily = theme.fontFamily;
    
    // Text size
    root.style.setProperty('--typography-scale', theme.textSize);
    document.documentElement.style.fontSize = `${theme.textSize * 16}px`;
    
    // Save to localStorage
    localStorage.setItem('customTheme', JSON.stringify(theme));
  }, [theme]);

  // Update theme with history tracking
  const updateTheme = useCallback((updates) => {
    setTheme(prev => {
      const newTheme = { ...prev, ...updates };
      // Add to history
      setHistory(h => [...h.slice(0, historyIndex + 1), newTheme]);
      setHistoryIndex(i => i + 1);
      return newTheme;
    });
  }, [historyIndex]);

  const setPrimaryColor = (color) => updateTheme({ primaryColor: color });
  const setFontFamily = (font) => updateTheme({ fontFamily: font });
  const setTextSize = (size) => updateTheme({ textSize: size });

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
    setHistory([DEFAULT_THEME]);
    setHistoryIndex(0);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(i => i - 1);
      setTheme(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(i => i + 1);
      setTheme(history[historyIndex + 1]);
    }
  };

  const value = {
    ...theme,
    setPrimaryColor,
    setFontFamily,
    setTextSize,
    resetTheme,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };

  return (
    <ThemeCustomizerContext.Provider value={value}>
      {children}
    </ThemeCustomizerContext.Provider>
  );
}

export const useThemeCustomizer = () => {
  const context = useContext(ThemeCustomizerContext);
  if (!context) {
    throw new Error('useThemeCustomizer must be used within ThemeCustomizerProvider');
  }
  return context;
};
