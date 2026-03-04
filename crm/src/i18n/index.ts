import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ky from './ky.json';
import ru from './ru.json';
import { LOCAL_STORAGE_LANGUAGE } from '../config';

export const defaultNS = 'translation';
export const resources = {
  en: { translation: en },
  ky: { translation: ky },
  ru: { translation: ru }
} as const;

const AVAILABLE_LANGUAGES = ['ru', 'ky', 'en'];
const DEFAULT_LANGUAGE = 'ru';

// Получаем сохраненный язык из localStorage с валидацией
const savedLanguage = localStorage.getItem(LOCAL_STORAGE_LANGUAGE);
const initialLanguage = savedLanguage && AVAILABLE_LANGUAGES.includes(savedLanguage)
  ? savedLanguage
  : DEFAULT_LANGUAGE;

i18next.use(initReactI18next).init({
  debug: true,
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS,
  resources,
  react: {
    useSuspense: true
  }
}).then(r => r);

// Сохраняем язык в localStorage при его изменении
i18next.on('languageChanged', (lng) => {
  if (AVAILABLE_LANGUAGES.includes(lng)) {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE, lng);
  }
});

export default i18next;
