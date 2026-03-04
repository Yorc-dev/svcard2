import React, { useState, FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  CAlert,
  CSpinner,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDescription, cilLockLocked, cilUser, cilPhone, cilChevronBottom } from '@coreui/icons'
import AuthControls from '../../components/AuthControls'
import styles from './Auth.module.css'
import { createRegisterSchema, RegisterFormData } from './validation'
import { useRegisterMutation } from '../../store/auth/auth.api'

type Country = 'KZ' | 'KG' | 'RU'

const Register: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()

  // Countries object with translated names
  const COUNTRIES: Record<Country, { name: string; code: string; mask: string; maxDigits: number }> = {
    KZ: { name: t('countries.kz'), code: '+7', mask: '+7 (XXX) XXX-XX-XX', maxDigits: 10 },
    KG: { name: t('countries.kg'), code: '+996', mask: '+996 XXX XXX-XXX', maxDigits: 9 },
    RU: { name: t('countries.ru'), code: '+7', mask: '+7 (XXX) XXX-XX-XX', maxDigits: 10 },
  }

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [displayPhoneValue, setDisplayPhoneValue] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<Country>('KZ')
  const [tin, setTin] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [rawBackendErrorType, setRawBackendErrorType] = useState<'tin' | 'user' | 'email' | 'generic' | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})  

  const getRegisterFieldErrors = (issues: { path: (string | number | symbol)[]; message: string }[]) => {
    const errors: Partial<Record<keyof RegisterFormData, string>> = {}
    issues.forEach((err) => {
      const field = err.path[0]
      if (typeof field === 'string') {
        errors[field as keyof RegisterFormData] = err.message
      }
    })
    return errors
  }

  const formatPhoneNumber = (phoneNumber: string, country: Country): string => {
    const digitsOnly = phoneNumber.replace(/\D/g, '')
    const countryCodeDigits = COUNTRIES[country].code.replace(/\D/g, '')
    
    // Remove country code from the beginning if present
    let localNumber = digitsOnly.startsWith(countryCodeDigits) 
      ? digitsOnly.slice(countryCodeDigits.length)
      : digitsOnly

    if (!localNumber) {
      return COUNTRIES[country].code
    }

    // Apply mask based on country
    if (country === 'KG') {
      // For Kyrgyzstan: +996 XXX XXX-XXX (3-digit city code + 3-digit + 3-digit)
      let formatted = COUNTRIES[country].code + ' '
      formatted += localNumber.slice(0, 3)
      if (localNumber.length > 3) formatted += ' ' + localNumber.slice(3, 6)
      if (localNumber.length > 6) formatted += '-' + localNumber.slice(6, 9)
      return formatted
    } else {
      // For Kazakhstan and Russia: +7 (XXX) XXX-XX-XX
      let formatted = COUNTRIES[country].code + ' ('
      formatted += localNumber.slice(0, 3)
      if (localNumber.length > 3) formatted += ') ' + localNumber.slice(3, 6)
      if (localNumber.length > 6) formatted += '-' + localNumber.slice(6, 8)
      if (localNumber.length > 8) formatted += '-' + localNumber.slice(8, 10)
      return formatted
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let displayValue = e.target.value
    const countryCode = COUNTRIES[selectedCountry].code
    const countryCodeDigits = countryCode.replace(/\D/g, '')
    const maxDigits = COUNTRIES[selectedCountry].maxDigits

    // Allow only digits and +
    displayValue = displayValue.replace(/[^0-9+]/g, '')

    // Remove all + signs
    let digitsOnly = displayValue.replace(/\+/g, '')

    // If it starts with country code AND has country code with + prefix, remove the code
    // But only if the user explicitly typed the + sign
    const hadPlusPrefix = e.target.value.includes('+')
    if (hadPlusPrefix && digitsOnly.startsWith(countryCodeDigits)) {
      // Remove country code only if there are digits left
      const withoutCode = digitsOnly.slice(countryCodeDigits.length)
      digitsOnly = withoutCode
    }

    // Limit digits to maxDigits
    const limitedDigits = digitsOnly.slice(0, maxDigits)

    // Store clean value (country code + digits)
    let cleanValue = ''
    if (limitedDigits.length > 0) {
      cleanValue = countryCode + limitedDigits
    }

    // Display value shows country code + space + digits without formatting
    // Show empty if no digits to allow user to clear the field
    const displayCleanValue = limitedDigits.length > 0 ? countryCode + ' ' + limitedDigits : ''

    // Update state with clean value
    setPhoneNumber(cleanValue)
    setDisplayPhoneValue(displayCleanValue)
    if (fieldErrors.phone_number) {
      setFieldErrors({ ...fieldErrors, phone_number: undefined })
    }
  }

  useEffect(() => {
    if (Object.keys(fieldErrors).length === 0) {
      return
    }

    const validationResult = createRegisterSchema(t).safeParse({
      username,
      email,
      phone_number,
      tin,
      password,
      repeatPassword,
    })

    if (validationResult.success) {
      setFieldErrors({})
    } else {
      setFieldErrors(getRegisterFieldErrors(validationResult.error.issues))
    }
  }, [i18n.language])

  // Re-translate backend non-validation errors when language changes
  useEffect(() => {
    if (rawBackendErrorType === 'tin') {
      setError(t('auth.register.errors.tinAlreadyExists'))
    } else if (rawBackendErrorType === 'user') {
      setError(t('auth.register.errors.userAlreadyExists'))
    } else if (rawBackendErrorType === 'email') {
      setError(t('auth.register.errors.emailAlreadyExists'))
    } else if (rawBackendErrorType === 'generic') {
      setError(t('auth.register.errors.generic'))
    }
  }, [t, rawBackendErrorType])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setFieldErrors({})
    setRawBackendErrorType(null)

    // Validate form data with Zod
    const validationResult = createRegisterSchema(t).safeParse({
      username,
      email,
      phone_number,
      tin,
      password,
      repeatPassword,
    })

    if (!validationResult.success) {
      setFieldErrors(getRegisterFieldErrors(validationResult.error.issues))
      return
    }

    try {
      await register({
        full_name: validationResult.data.username,
        email: validationResult.data.email,
        phone_number: validationResult.data.phone_number,
        tin: validationResult.data.tin,
        password: validationResult.data.password,
      }).unwrap()

      setSuccess(t('auth.register.success'))
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      console.error('Registration error:', err)
      
      // Handle 422 validation errors from backend
      if (err?.status === 422 && Array.isArray(err?.data?.detail)) {
        const backendErrors: Partial<Record<keyof RegisterFormData, string>> = {}
        let hasFieldErrors = false
        
        err.data.detail.forEach((error: any) => {
          if (error.loc && error.loc.length > 1) {
            const fieldName = error.loc[1] // loc is like ["body", "password"]
            let errorMessage = error.msg || t('auth.register.errors.invalidValue')
            
            // Remove "Value error, " prefix if present
            if (errorMessage.startsWith('Value error, ')) {
              errorMessage = errorMessage.substring(13)
            }
            
            // Translate common password validation errors
            if (errorMessage.includes('uppercase letter')) {
              errorMessage = t('auth.register.errors.passwordUppercase')
            } else if (errorMessage.includes('lowercase letter')) {
              errorMessage = t('auth.register.errors.passwordLowercase')
            } else if (errorMessage.includes('digit')) {
              errorMessage = t('auth.register.errors.passwordDigit')
            } else if (errorMessage.includes('8 characters')) {
              errorMessage = t('auth.register.errors.passwordLength')
            } else if (errorMessage.includes('special character')) {
              errorMessage = t('auth.register.errors.passwordSpecial')
            }
            // Translate email validation errors
            else if (errorMessage.includes('valid email') || errorMessage.includes('email format') || errorMessage.includes('not a valid email') || errorMessage.includes('Invalid email address')) {
              errorMessage = t('auth.register.errors.emailInvalid')
            } else if (errorMessage.includes('already exists') || errorMessage.includes('already registered') || errorMessage.includes('already in use')) {
              errorMessage = t('auth.register.errors.emailAlreadyExists')
            }
            
            // Map backend field names to form field names
            if (fieldName === 'full_name') {
              backendErrors.username = errorMessage
              hasFieldErrors = true
            } else if (fieldName === 'email') {
              backendErrors.email = errorMessage
              hasFieldErrors = true
            } else if (fieldName === 'phone_number') {
              backendErrors.phone_number = errorMessage
              hasFieldErrors = true
            } else if (fieldName === 'tin') {
              backendErrors.tin = errorMessage
              hasFieldErrors = true
            } else if (fieldName === 'password') {
              backendErrors.password = errorMessage
              hasFieldErrors = true
            }
          }
        })
        
        if (hasFieldErrors) {
          setFieldErrors(backendErrors)
        } else {
          setError(t('auth.register.errors.registrationFailed'))
        }
      } else {
        // Handle other errors (non-validation errors)
        let errorMessage = typeof err?.data?.detail === 'string' 
          ? err.data.detail 
          : t('auth.register.errors.generic')
        
        // Detect error type from message
        const lowerMessage = errorMessage.toLowerCase()
        if (lowerMessage.includes('инн') || lowerMessage.includes('tin')) {
          setRawBackendErrorType('tin')
        } else if (lowerMessage.includes('user already exists') || lowerMessage.includes('пользователь') || lowerMessage.includes('колдонуучу')) {
          setRawBackendErrorType('user')
        } else if (lowerMessage.includes('email') && (lowerMessage.includes('exists') || lowerMessage.includes('существует') || lowerMessage.includes('зарегистрирован') || lowerMessage.includes('катталган'))) {
          setRawBackendErrorType('email')
        } else if (lowerMessage.includes('already exists') || lowerMessage.includes('already registered') || lowerMessage.includes('already in use')) {
          setRawBackendErrorType('email')
        } else {
          setRawBackendErrorType('generic')
        }
      }
    }
  }

  return (
    <div className={`bg-body-tertiary min-vh-100 d-flex flex-row align-items-center ${styles.authPage}`}>
      <CContainer className="px-3 px-sm-4">
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <AuthControls />
            <CCard>
              <CCardBody className={styles.registerCardBody}>
                <CForm onSubmit={handleSubmit}>
                  <h1>{t('auth.register.title')}</h1>
                  <p className="text-body-secondary">{t('auth.register.subtitle')}</p>
                  
                  {error && (
                    <CAlert color="danger" dismissible onClose={() => setError(null)}>
                      {error}
                    </CAlert>
                  )}

                  {success && (
                    <CAlert color="success" dismissible onClose={() => setSuccess(null)}>
                      {success}
                    </CAlert>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder={t('auth.register.username')}
                      autoComplete="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value)
                        if (fieldErrors.username) {
                          setFieldErrors({ ...fieldErrors, username: undefined })
                        }
                      }}
                      disabled={isLoading}
                      className={fieldErrors.username ? 'is-invalid' : ''}
                    />
                  </CInputGroup>
                  {fieldErrors.username && (
                    <div className="text-danger small mb-3" style={{ marginTop: '-0.75rem' }}>
                      {fieldErrors.username}
                    </div>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder={t('auth.register.email')}
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

                  <div className={`mb-3 ${styles.phoneFieldGroup}`}>
                    <CDropdown className={styles.phoneCountryDropdown}>
                      <CDropdownToggle
                        color="secondary"
                        caret
                        className={`${styles.phoneCountryToggle} ${fieldErrors.phone_number ? styles.phoneCountryToggleInvalid : ''}`}
                        aria-invalid={Boolean(fieldErrors.phone_number)}
                      >
                        {COUNTRIES[selectedCountry].name}
                      </CDropdownToggle>
                      <CDropdownMenu className={styles.phoneCountryMenu}>
                        {(Object.entries(COUNTRIES) as [Country, typeof COUNTRIES[Country]][]).map(([code, country]) => (
                          <CDropdownItem
                            key={code}
                            onClick={() => {
                              setSelectedCountry(code)
                              setPhoneNumber('')
                              setDisplayPhoneValue('')
                            }}
                          >
                            {country.name} ({country.code})
                          </CDropdownItem>
                        ))}
                      </CDropdownMenu>
                    </CDropdown>
                    <CFormInput
                      type="tel"
                      placeholder={COUNTRIES[selectedCountry].mask}
                      autoComplete="tel"
                      value={displayPhoneValue}
                      onChange={handlePhoneChange}
                      disabled={isLoading}
                      className={`${styles.phoneNumberInput} ${fieldErrors.phone_number ? 'is-invalid' : ''}`}
                    />
                  </div>
                  {fieldErrors.phone_number && (
                    <div className="text-danger small mb-3" style={{ marginTop: '-0.75rem' }}>
                      {fieldErrors.phone_number}
                    </div>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      inputMode="numeric"
                      placeholder={t('auth.register.tinPlaceholder')}
                      value={tin}
                      onChange={(e) => {
                        const nextValue = e.target.value.replace(/\D/g, '').slice(0, 14)
                        setTin(nextValue)
                        if (fieldErrors.tin) {
                          setFieldErrors({ ...fieldErrors, tin: undefined })
                        }
                      }}
                      disabled={isLoading}
                      className={fieldErrors.tin ? 'is-invalid' : ''}
                    />
                  </CInputGroup>
                  {fieldErrors.tin && (
                    <div className="text-danger small mb-3" style={{ marginTop: '-0.75rem' }}>
                      {fieldErrors.tin}
                    </div>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.register.password')}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        const newValue = e.target.value
                        setPassword(newValue)
                        if (fieldErrors.password) {
                          setFieldErrors({ ...fieldErrors, password: undefined })
                        }
                        
                        // Real-time password match validation
                        if (repeatPassword && newValue && newValue !== repeatPassword) {
                          setFieldErrors(prev => ({ ...prev, repeatPassword: t('auth.register.passwordsMismatch') }))
                        } else if (repeatPassword && newValue && newValue === repeatPassword) {
                          setFieldErrors(prev => ({ ...prev, repeatPassword: undefined }))
                        }
                      }}
                      disabled={isLoading}
                      className={fieldErrors.password ? 'is-invalid' : ''}
                    />
                    <CInputGroupText
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                      role="button"
                      tabIndex={0}
                      title={showPassword ? t('hide') : t('show')}
                    >
                      <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </CInputGroupText>
                  </CInputGroup>
                  {fieldErrors.password && (
                    <div className="text-danger small mb-3" style={{ marginTop: '-0.75rem' }}>
                      {fieldErrors.password}
                    </div>
                  )}

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.register.repeatPassword')}
                      autoComplete="new-password"
                      value={repeatPassword}
                      onChange={(e) => {
                        const newValue = e.target.value
                        setRepeatPassword(newValue)
                        
                        // Real-time password match validation
                        if (newValue && password && newValue !== password) {
                          setFieldErrors({ ...fieldErrors, repeatPassword: t('auth.register.passwordsMismatch') })
                        } else {
                          setFieldErrors({ ...fieldErrors, repeatPassword: undefined })
                        }
                      }}
                      disabled={isLoading}
                      className={fieldErrors.repeatPassword ? 'is-invalid' : ''}
                    />
                    <CInputGroupText
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPassword(!showPassword)}
                      role="button"
                      tabIndex={0}
                      title={showPassword ? t('hide') : t('show')}
                    >
                      <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </CInputGroupText>
                  </CInputGroup>
                  {fieldErrors.repeatPassword && (
                    <div className="text-danger small mb-4" style={{ marginTop: '-1rem' }}>
                      {fieldErrors.repeatPassword}
                    </div>
                  )}

                  <div className="d-grid">
                    <CButton type="submit" color="success" disabled={isLoading} style={{ color: 'white' }}>
                      {isLoading ? (
                        <>
                          <CSpinner size="sm" className="me-2" />
                          Loading...
                        </>
                      ) : (
                        t('auth.register.submit')
                      )}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
            <div className="text-center mt-3">
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
