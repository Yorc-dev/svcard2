import { z } from 'zod'
import { TFunction } from 'i18next'

// Login validation schema
export const createLoginSchema = (t: TFunction) => z.object({
  email: z
    .string()
    .min(1, t('auth.validation.emailRequired'))
    .email(t('auth.validation.emailInvalid')),
  password: z
    .string()
    .min(1, t('auth.validation.passwordRequired'))
    .min(6, t('auth.validation.passwordMin')),
})

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>

// Register validation schema
export const createRegisterSchema = (t: TFunction) => z
  .object({
    username: z
      .string()
      .min(1, t('auth.validation.usernameRequired'))
      .min(3, t('auth.validation.usernameMin'))
      .max(50, t('auth.validation.usernameMax')),
    email: z
      .string()
      .min(1, t('auth.validation.emailRequired'))
      .email(t('auth.validation.emailInvalid')),
    phone_number: z
      .string()
      .min(1, t('auth.validation.phoneRequired'))
      .regex(/^\+?[0-9\s\-\(\)]{7,}$/, t('auth.validation.phoneInvalid')),
    tin: z
      .string()
      .min(1, t('auth.validation.tinRequired'))
      .min(14, t('auth.validation.tinMin'))
      .max(14, t('auth.validation.tinMax'))
      .regex(/^\d+$/, t('auth.validation.tinDigits')),
    password: z
      .string()
      .min(1, t('auth.validation.passwordRequired'))
      .min(6, t('auth.validation.passwordMin'))
      .max(100, t('auth.validation.passwordMax')),
    repeatPassword: z
      .string()
      .min(1, t('auth.validation.repeatPasswordRequired')),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: t('auth.validation.passwordsMismatch'),
    path: ['repeatPassword'],
  })

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>

