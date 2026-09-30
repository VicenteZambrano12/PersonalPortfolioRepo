import { useEffect, useState } from 'react';
import { createLogger } from './logger.js';

const STORAGE_KEY = 'portfolio-theme';
const log = createLogger('theme');

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

// Persists the active theme and reflects it on <html data-theme="..."> for CSS hover states.
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      log.warn('Unable to persist theme preference', { message: error.message });
    }
    log.debug('Theme applied', { theme });
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
