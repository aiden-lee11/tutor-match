import React, { createContext, useContext, useEffect, type ReactNode } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;  // Keep for compatibility but does nothing
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme: Theme = 'light'; // Always light mode

  const setTheme = (newTheme: Theme) => {
    // Always enforce light mode, ignore any attempts to change
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
  };

  const toggleTheme = () => {
    // Do nothing - keep light mode
  };

  useEffect(() => {
    // Always enforce light mode
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 