import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLogoutMutation, useGetMeQuery } from '../../../store/auth/auth.api'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from '../../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [logout] = useLogoutMutation();
  
  const hasToken = Boolean(localStorage.getItem('svcard_token'));
  const { data: currentUser, isSuccess } = useGetMeQuery(undefined, {
    skip: !hasToken,
  });
  
  const isAuthenticated = hasToken && isSuccess && currentUser;
  
  // Функция для получения инициалов из имени
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem('svcard_token');
      navigate('/login');
    } catch (error) {
      // В случае ошибки всё равно удаляем токен и редиректим
      localStorage.removeItem('svcard_token');
      navigate('/login');
    }
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle className="py-0 pe-0" caret={false}>
        {isAuthenticated && currentUser ? (
          <CAvatar 
            color="secondary" 
            textColor="white" 
            size="md"
          >
            {getInitials((currentUser as any).full_name)}
          </CAvatar>
        ) : (
          <CAvatar src={avatar8} size="md" />
        )}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">{t('account')}</CDropdownHeader>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownDivider /> */}
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          {t('logout')}
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">{t('settings')}</CDropdownHeader>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownDivider />
        {/* <CDropdownItem href="#">
          <CIcon icon={cilLockLocked} className="me-2" />
          Lock Account
        </CDropdownItem> */}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
