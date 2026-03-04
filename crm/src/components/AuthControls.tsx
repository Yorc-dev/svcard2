import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cifKg,
  cifRu,
  cifUs,
  cilContrast,
  cilMoon,
  cilSun,
} from '@coreui/icons'
import { LOCAL_STORAGE_LANGUAGE, LOCAL_STORAGE_THEME } from '../config'
import styles from './AuthControls.module.css'

const AuthControls: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { colorMode, setColorMode } = useColorModes(LOCAL_STORAGE_THEME)
  const [searchParams] = useSearchParams()
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Используем текущий язык из i18n (который уже загружен из localStorage)
    return i18n?.language || 'ru'
  })

  // Синхронизируем отображение с текущим языком i18n
  useEffect(() => {
    if (i18n?.language) {
      setCurrentLanguage(i18n.language)
    }
  }, [i18n?.language])

  // Update display when language parameter changes in URL
  useEffect(() => {
    const languageParam = searchParams.get('language')
    if (languageParam && ['en', 'ky', 'ru'].includes(languageParam)) {
      setCurrentLanguage(languageParam)
      // Также применяем язык из URL параметра
      i18n.changeLanguage(languageParam)
    }
  }, [searchParams, i18n])

  const setLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      setCurrentLanguage(lang)
    })
  }

  return (
    <div className={styles.authControls}>
      {/* Language Dropdown */}
      <CDropdown variant="nav-item" placement="bottom-end">
        <CDropdownToggle caret={false} className={styles.dropdownToggle}>
          {currentLanguage === 'ky' ? (
            <CIcon icon={cifKg} size="lg" />
          ) : currentLanguage === 'ru' ? (
            <CIcon icon={cifRu} size="lg" />
          ) : currentLanguage === 'en' ? (
            <CIcon icon={cifUs} size="lg" />
          ) : null}
        </CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem
            active={currentLanguage === 'ky'}
            className="d-flex align-items-center"
            as="button"
            type="button"
            onClick={() => setLanguageHandler('ky')}
          >
            <CIcon className="me-2" icon={cifKg} size="lg" /> Кыргызча
          </CDropdownItem>
          <CDropdownItem
            active={currentLanguage === 'ru'}
            className="d-flex align-items-center"
            as="button"
            type="button"
            onClick={() => setLanguageHandler('ru')}
          >
            <CIcon className="me-2" icon={cifRu} size="lg" /> Русский
          </CDropdownItem>
          <CDropdownItem
            active={currentLanguage === 'en'}
            className="d-flex align-items-center"
            as="button"
            type="button"
            onClick={() => setLanguageHandler('en')}
          >
            <CIcon className="me-2" icon={cifUs} size="lg" /> English
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      {/* Theme Dropdown */}
      <CDropdown variant="nav-item" placement="bottom-end">
        <CDropdownToggle caret={false} className={styles.dropdownToggle}>
          {colorMode === 'dark' ? (
            <CIcon icon={cilMoon} size="lg" />
          ) : colorMode === 'auto' ? (
            <CIcon icon={cilContrast} size="lg" />
          ) : (
            <CIcon icon={cilSun} size="lg" />
          )}
        </CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem
            active={colorMode === 'light'}
            className="d-flex align-items-center"
            as="button"
            type="button"
            onClick={() => setColorMode('light')}
          >
            <CIcon className="me-2" icon={cilSun} size="lg" />
            {t('themeLight')}
          </CDropdownItem>
          <CDropdownItem
            active={colorMode === 'dark'}
            className="d-flex align-items-center"
            as="button"
            type="button"
            onClick={() => setColorMode('dark')}
          >
            <CIcon className="me-2" icon={cilMoon} size="lg" />
            {t('themeDark')}
          </CDropdownItem>
          <CDropdownItem
            active={colorMode === 'auto'}
            className="d-flex align-items-center"
            as="button"
            type="button"
            onClick={() => setColorMode('auto')}
          >
            <CIcon className="me-2" icon={cilContrast} size="lg" />
            {t('themeAuto')}
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </div>
  )
}

export default AuthControls
