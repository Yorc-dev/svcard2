import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ru from './locales/ru.json'
import ky from './locales/ky.json'

const LANGUAGE_KEY = 'svcard_language'
const AVAILABLE_LANGUAGES = ['ru', 'ky', 'en']
const DEFAULT_LANGUAGE = 'ru'

// Получаем сохраненный язык из localStorage с валидацией
const savedLanguage = localStorage.getItem(LANGUAGE_KEY)
const initialLanguage = savedLanguage && AVAILABLE_LANGUAGES.includes(savedLanguage)
	? savedLanguage
	: DEFAULT_LANGUAGE

i18n.use(initReactI18next).init({
	resources: {
		en: { translation: en },
		ru: { translation: ru },
		ky: { translation: ky },
	},
	lng: initialLanguage,
	fallbackLng: DEFAULT_LANGUAGE,
	interpolation: {
		escapeValue: false,
	},
})

// Сохраняем язык в localStorage при его изменении
i18n.on('languageChanged', (lng) => {
	localStorage.setItem(LANGUAGE_KEY, lng)
})

export default i18n
