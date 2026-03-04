import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Register = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>{t('auth.register.title')}</h1>
                  <p className="text-body-secondary">{t('auth.register.subtitle')}</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder={t('auth.register.username')} autoComplete="username" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder={t('auth.register.email')} autoComplete="email" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder={t('auth.register.password')}
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder={t('auth.register.repeatPassword')}
                      autoComplete="new-password"
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success">{t('auth.register.submit')}</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
            <div className="text-center mt-3">
              <Link to="/" className="text-body-secondary">
                {t('auth.backToHome')}
              </Link>
              <span className="text-body-secondary mx-2">·</span>
              <Link to="/login" className="text-body-secondary">
                {t('auth.register.toLogin')}
              </Link>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
