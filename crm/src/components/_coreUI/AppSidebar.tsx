import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/configureStore';
import {NavLink} from "react-router-dom";
import { useGetMeQuery } from '../../store/auth/auth.api';

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';

import { AppSidebarNav } from './AppSidebarNav';

import svCardLogo from '../../assets/svcard-logo.png';

// sidebar nav config
import coreUiNav from '../../_coreui.nav';
import navigation from '../../_nav';

import {setSidebarShow, setSidebarUnfoldable} from "../../store/global/global.slice.ts";
import { useTranslation } from 'react-i18next';

const AppSidebar = () => {
  const {t} = useTranslation();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const dispatch = useDispatch();
  const unfoldable = useSelector((state: RootState) => state.global.sidebarUnfoldable);
  const sidebarShow = useSelector((state: RootState) => state.global.sidebarShow);

  const hasToken = Boolean(localStorage.getItem('svcard_token'));
  const { data: currentUser, isSuccess } = useGetMeQuery(undefined, {
    skip: !hasToken,
    refetchOnMountOrArgChange: true,
  });
  const rawRole = isSuccess ? (currentUser as any)?.role ?? (currentUser as any)?.user?.role : null;
  const normalizedRole = typeof rawRole === 'string' ? rawRole.toLowerCase() : null;
  const navigationFiltered = navigation.filter((item) => {
    if (!item?.roles || !Array.isArray(item.roles)) {
      return true;
    }
    return Boolean(normalizedRole) && item.roles.some((role) => role === normalizedRole);
  });
  const navigationTranslate = navigationFiltered.map(item => ({...item, name: t(`nav.${item.name}`)}));

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
      onVisibleChange={(visible) => {
        dispatch(setSidebarShow(visible))
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" as={NavLink} className="d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
          <img src={svCardLogo} alt="SVCARD" height={43} />
          {(!unfoldable || isSidebarHovered) && <span className="fw-bold">SVCard</span>}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(setSidebarShow(false))}
        />
      </CSidebarHeader>
      <AppSidebarNav items={[...navigationTranslate,]} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch(setSidebarUnfoldable(!unfoldable))}
        />
      </CSidebarFooter>
    </CSidebar>
  )
};

export default React.memo(AppSidebar);
