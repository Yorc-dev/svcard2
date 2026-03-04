import React, { useState, FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useLoginMutation } from '../../store/auth/auth.api'
import AuthControls from '../../components/AuthControls'
import styles from './Auth.module.css'
import { createLoginSchema, LoginFormData } from './validation'

const Login: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [rawBackendErrorType, setRawBackendErrorType] = useState<'invalidCredentials' | 'generic' | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})

  const getLoginFieldErrors = (issues: { path: (string | number | symbol)[]; message: string }[]) => {
    const errors: Partial<Record<keyof LoginFormData, string>> = {}
    issues.forEach((err) => {
      const field = err.path[0]
      if (typeof field === 'string') {
        errors[field as keyof LoginFormData] = err.message
      }
    })
    return errors
  }

  useEffect(() => {
    if (Object.keys(fieldErrors).length === 0) {
      return
    }

    const validationResult = createLoginSchema(t).safeParse({ email, password })
    if (validationResult.success) {
      setFieldErrors({})
    } else {
      setFieldErrors(getLoginFieldErrors(validationResult.error.issues))
    }
  }, [i18n.language])

  // Re-translate backend non-validation errors when language changes
  useEffect(() => {
    if (rawBackendErrorType === 'invalidCredentials') {
      setError(t('auth.login.invalidCredentials'))
    } else if (rawBackendErrorType === 'generic') {
      setError(t('auth.login.error'))
    }
  }, [t, rawBackendErrorType])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setRawBackendErrorType(null)

    // Validate form data with Zod
    const validationResult = createLoginSchema(t).safeParse({ email, password })

    if (!validationResult.success) {
      setFieldErrors(getLoginFieldErrors(validationResult.error.issues))
      return
    }

    try {
      const result = await login(validationResult.data).unwrap()
      
      // Сохраняем токен в localStorage
      localStorage.setItem('svcard_token', JSON.stringify({ access: result.access_token }))
      
      // Перенаправляем на главную страницу
      navigate('/')
    } catch (err: any) {
      console.error('Login error:', err)
      
      // Handle specific error messages
      const detailMessage = err?.data?.detail || ''
      if (typeof detailMessage === 'string') {
        const lowerMessage = detailMessage.toLowerCase()
        // Check for invalid credentials in multiple languages
        if (lowerMessage.includes('invalid') || 
            lowerMessage.includes('credentials') ||
            lowerMessage.includes('неверн') ||
            lowerMessage.includes('неправильн') ||
            lowerMessage.includes('нож эмес') ||
            lowerMessage.includes('туура эмес')) {
          setRawBackendErrorType('invalidCredentials')
        } else {
          setRawBackendErrorType('generic')
        }
      } else {
        setRawBackendErrorType('generic')
      }
    }
  }

  return (
    <div className={`bg-body-tertiary min-vh-100 d-flex align-items-center ${styles.authPage}`}>
      <CContainer className="px-3 px-sm-4">
        <CRow className="justify-content-center">
          <CCol xs={12} sm={11} md={10} lg={9} xl={8}>
            <AuthControls />
            <CCardGroup className={styles.loginCardGroup}>
              <CCard className={styles.loginCard}>
                <CCardBody className={styles.loginCardBody}>
                  <CForm onSubmit={handleSubmit}>
                    <h1 className="h2 h-md-1">{t('auth.login.title')}</h1>
                    <p className="text-body-secondary mb-4">{t('auth.login.subtitle')}</p>
                    
                    {error && (
                      <CAlert color="danger" dismissible onClose={() => setError(null)}>
                        {error}
                      </CAlert>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder={t('auth.login.username')}
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (fieldErrors.email) {
                            setFieldErrors({ ...fieldErrors, email: undefined })
                          }
                        }}
                        disabled={isLoading}
                        className={fieldErrors.email ? 'is-invalid' : ''}
                      />
                    </CInputGroup>
                    {fieldErrors.email && (
                      <div className="text-danger small mb-3" style={{ marginTop: '-0.75rem' }}>
                        {fieldErrors.email}
                      </div>
                    )}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder={t('auth.login.password')}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (fieldErrors.password) {
                            setFieldErrors({ ...fieldErrors, password: undefined })
                          }
                        }}
                        disabled={isLoading}
                        className={fieldErrors.password ? 'is-invalid' : ''}
                      />
                    </CInputGroup>
                    {fieldErrors.password && (
                      <div className="text-danger small mb-4" style={{ marginTop: '-1rem' }}>
                        {fieldErrors.password}
                      </div>
                    )}
                    <CRow className="g-2">
                      <CCol xs={12} sm={6}>
                        <CButton 
                          type="submit" 
                          color="primary" 
                          className="px-4 w-100 w-sm-auto"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              {t('auth.login.loading') || 'Loading...'}
                            </>
                          ) : (
                            t('auth.login.submit')
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={12} sm={6} className="text-start text-sm-end">
                        <CButton color="link" className="px-0" disabled={isLoading}>
                          {t('auth.login.forgot')}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className={`text-white bg-primary ${styles.promoCard}`}>
                <CCardBody className={`text-center ${styles.promoCardBody}`}>
                  <div>
                    <h2>{t('auth.login.signupTitle')}</h2>
                    <p>{t('auth.login.signupText')}</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3 w-100 w-sm-auto" active tabIndex={-1}>
                        {t('auth.login.signupButton')}
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login