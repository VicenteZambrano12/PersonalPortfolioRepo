import { useEffect, useState } from 'react';
import { en } from './languages/en.jsx';
import { es } from './languages/es.jsx';

const STORAGE_KEY = 'portfolio-language';
const translations = { en, es };

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'es') return stored;
  return 'en';
}

// Persists the active language and exposes its translation dictionary.
export function useLanguage() {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  return { language, setLanguage, t: translations[language] };
}
