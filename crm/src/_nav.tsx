import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilList,
  cilPeople,
  cilClipboard
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';
import Applications from './pages/Applications';

const _nav = [
  // {
  //   component: CNavTitle,
  //   name: 'Custom nav'
  // },
  {
    component: CNavItem,
    name: 'users',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    roles: ['admin', 'moderator']
  },
  {
    component: CNavItem,
    name: 'applications',
    to: '/applications',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    roles: ['admin', 'moderator']
  }
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // }
];

export default _nav;
