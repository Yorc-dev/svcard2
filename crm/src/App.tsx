import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss';
import { useTranslation } from "react-i18next";
import { setLanguage } from "./store/global/global.slice.ts";
import { LOCAL_STORAGE_LANGUAGE, LOCAL_STORAGE_THEME } from "./config.ts";

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));
// const Page404 = React.lazy(() => import('./views/_coreUI/pages/page404/Page404.jsx'));
// const Page500 = React.lazy(() => import('./views/_coreUI/pages/page500/Page500.jsx'));

const App = () => {
  const { i18n } = useTranslation();

  const { isColorModeSet, setColorMode } = useColorModes(LOCAL_STORAGE_THEME);
  const storedTheme = useSelector((state: any) => state.global.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);

    const lang = urlParams.get('lang') && urlParams.get('lang')?.match(/^[A-Za-z0-9\s]+/)?.[0];
    const langLS = localStorage.getItem(LOCAL_STORAGE_LANGUAGE);
    if (lang === 'ky' || lang === 'ru' || lang === 'en') {
      i18n.changeLanguage(lang).then(() => {
        setLanguage(lang);
      });
    } else if (langLS === 'ky' || langLS === 'ru' || langLS === 'en') {
      i18n.changeLanguage(langLS).then(() => {
        setLanguage(langLS);
      });
    }

    const theme = urlParams.get('theme') && urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0];
    if (theme) setColorMode(theme);
    if (isColorModeSet()) return;
    setColorMode(storedTheme);
  }, []);

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* // <Route path="/404" element={<Page404 />} />
          // <Route path="/500" element={<Page500 />} /> */}
          <Route path="*" element={<DefaultLayout />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
};

export default App;
