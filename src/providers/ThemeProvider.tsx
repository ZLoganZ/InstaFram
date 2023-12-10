import { createContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  disableTransitionOnChange?: boolean;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

const initialState: ThemeContextType = {
  theme: 'system',
  setTheme: () => null,
  isDark: false
};

export const ThemeContext = createContext<ThemeContextType>(initialState);

export const ThemeProvider = ({
  children,
  defaultTheme = 'light',
  storageKey = 'ui-theme',
  disableTransitionOnChange = false
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>((localStorage.getItem(storageKey) as Theme) || defaultTheme);
  const isDark = theme === 'dark';

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    const css = document.createElement('style');
    css.type = 'text/css';
    css.appendChild(
      document.createTextNode(
        `* {
       -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
    }`
      )
    );

    if (disableTransitionOnChange) document.head.appendChild(css);

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

      localStorage.setItem(storageKey, theme);
      root.classList.add(systemTheme);
      if (disableTransitionOnChange) {
        window.getComputedStyle(css).opacity;
        document.head.removeChild(css);
      }
      return;
    }

    localStorage.setItem(storageKey, theme);
    root.classList.add(theme);
    if (disableTransitionOnChange) {
      window.getComputedStyle(css).opacity;
      document.head.removeChild(css);
    }
  }, [disableTransitionOnChange, theme]);

  const value = {
    theme,
    setTheme,
    isDark
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
