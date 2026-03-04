import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/configureStore';
import { useTranslation } from "react-i18next";
import { useGetMeQuery } from '../../store/auth/auth.api';
import {
  CContainer,
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cifKg, cifRu, cifUs,
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons';

import { AppBreadcrumb } from './index.ts';
import { AppHeaderDropdown } from './header';

import { setLanguage, setSidebarShow } from "../../store/global/global.slice.ts";
import { LOCAL_STORAGE_LANGUAGE, LOCAL_STORAGE_THEME } from "../../config.ts";
import styles from './AppHeader.module.css';

const AppHeader = () => {
  const { t, i18n } = useTranslation();
  const headerRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state: RootState) => state.global.sidebarShow);

  const hasToken = Boolean(localStorage.getItem('svcard_token'));
  const { data: currentUser, isSuccess } = useGetMeQuery(undefined, {
    skip: !hasToken,
  });
  const isAuthenticated = hasToken && isSuccess && currentUser;

  const { colorMode, setColorMode } = useColorModes(LOCAL_STORAGE_THEME);

  const [ currentLanguage, setCurrentLanguage ] = useState(i18n?.language || 'ky');

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef?.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    })
  }, []);

  const setLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang).then(() => {
      setCurrentLanguage(lang);
      setLanguage(lang);
    });
  };

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch(setSidebarShow(!sidebarShow))}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          {/* <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem> */}
        </CHeaderNav>
        <CHeaderNav className="ms-auto align-items-center">
          {/* <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem> */}
        </CHeaderNav>

        <CHeaderNav className="align-items-center">
          <li className="nav-item py-1">
            {/* <div className="vr h-100 mx-2 text-body text-opacity-75"></div> */}
          </li>
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
        </CHeaderNav>

        <CHeaderNav className="align-items-center">
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
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
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          {isAuthenticated && <AppHeaderDropdown />}
          {!isAuthenticated && (
            <CNavItem className="ms-2">
              <CButton color="secondary" size="sm" as={NavLink} to="/login">
                {t('loginAuthorization')}
              </CButton>
            </CNavItem>
          )}
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
};

export default AppHeader;
