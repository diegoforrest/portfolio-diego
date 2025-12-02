import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeCustomizerContext = createContext(null);

const DEFAULT_THEME = {
  primaryColor: 'oklch(63.7% .237 25.331)', // Red
  surfaceColor: 'zinc', // Default surface color palette
  fontFamily: '"Inter", system-ui, sans-serif',
  textSize: 1,
};

const getStoredTheme = () => {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem('customTheme');
    if (!stored) return DEFAULT_THEME;
    
    const parsed = JSON.parse(stored);
    
    // Validate that stored values are strings/numbers, not objects
    // This fixes corrupted localStorage data
    const isValid = 
      typeof parsed.primaryColor === 'string' &&
      typeof parsed.surfaceColor === 'string' &&
      typeof parsed.fontFamily === 'string' &&
      typeof parsed.textSize === 'number';
    
    if (!isValid) {
      localStorage.removeItem('customTheme');
      return DEFAULT_THEME;
    }
    
    return parsed;
  } catch {
    localStorage.removeItem('customTheme');
    return DEFAULT_THEME;
  }
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
    
    // Surface color - set CSS class on root
    const surfacePalettes = ['slate', 'gray', 'zinc', 'neutral', 'stone'];
    surfacePalettes.forEach(p => root.classList.remove(`surface-${p}`));
    if (theme.surfaceColor) {
      root.classList.add(`surface-${theme.surfaceColor}`);
    }
    
    // Font family
    root.style.setProperty('--font-family', theme.fontFamily);
    document.body.style.fontFamily = theme.fontFamily;
    
    // Text size
    root.style.setProperty('--typography-scale', theme.textSize);
    document.documentElement.style.fontSize = `${theme.textSize * 16}px`;
    
    // Save to localStorage
    localStorage.setItem('customTheme', JSON.stringify(theme));
    
    // Dispatch custom event for DarkVeil and other components
    window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
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
  const setSurfaceColor = (surface) => updateTheme({ surfaceColor: surface });
  const setFontFamily = (font) => updateTheme({ fontFamily: font });
  const setTextSize = (size) => updateTheme({ textSize: size });

  const resetTheme = () => {
    // Clear localStorage
    localStorage.removeItem('customTheme');
    
    // Reset state
    setTheme(DEFAULT_THEME);
    setHistory([DEFAULT_THEME]);
    setHistoryIndex(0);
    
    // Reset CSS variables and styles to defaults
    const root = document.documentElement;
    root.style.setProperty('--primary-color', DEFAULT_THEME.primaryColor);
    root.style.setProperty('--accent-color', DEFAULT_THEME.primaryColor);
    root.style.setProperty('--hover-border', DEFAULT_THEME.primaryColor);
    root.style.setProperty('--gradient-start', DEFAULT_THEME.primaryColor);
    root.style.setProperty('--font-family', DEFAULT_THEME.fontFamily);
    root.style.setProperty('--typography-scale', DEFAULT_THEME.textSize);
    document.documentElement.style.fontSize = `${DEFAULT_THEME.textSize * 16}px`;
    document.body.style.fontFamily = DEFAULT_THEME.fontFamily;
    
    // Reset surface color classes
    const surfacePalettes = ['slate', 'gray', 'zinc', 'neutral', 'stone'];
    surfacePalettes.forEach(p => root.classList.remove(`surface-${p}`));
    root.classList.add(`surface-${DEFAULT_THEME.surfaceColor}`);
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
    setSurfaceColor,
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
