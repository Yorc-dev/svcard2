import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import svcardLogo from '@/assets/svcard-logo.png'
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Auth = () => {
	const { t } = useTranslation()
	const location = useLocation()
	const navigate = useNavigate()
	const { toast } = useToast()
	const [activeTab, setActiveTab] = useState<'login' | 'register'>(() => {
		const state = location.state as { authTab?: 'login' | 'register' } | null
		return state?.authTab === 'register' ? 'register' : 'login'
	})
	const [isLoading, setIsLoading] = useState(false)
	const [showSuccessDialog, setShowSuccessDialog] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [loginErrors, setLoginErrors] = useState<
		Partial<Record<string, string>>
	>({})
	const [registerErrors, setRegisterErrors] = useState<
		Partial<Record<string, string>>
	>({})

	const [loginData, setLoginData] = useState({ email: '', password: '' })
	const [registerData, setRegisterData] = useState({
		full_name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})

	useEffect(() => {
		const state = location.state as { authTab?: 'login' | 'register' } | null
		if (!state?.authTab) return
		setActiveTab(state.authTab)
		navigate('.', { replace: true, state: null })
	}, [location.state, navigate])

	const loginSchema = z.object({
		email: z.string().trim().email(t('auth.login.errors.email')),
		password: z.string().min(6, t('auth.login.errors.password')),
	})

	const registerSchema = z
		.object({
			full_name: z.string().trim().min(2, t('auth.register.errors.fullName')),
			email: z.string().trim().email(t('auth.register.errors.email')),
			password: z.string().min(6, t('auth.register.errors.password')),
			confirmPassword: z.string(),
		})
		.refine(data => data.password === data.confirmPassword, {
			message: t('auth.register.errors.confirmPassword'),
			path: ['confirmPassword'],
		})

	const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setLoginData(prev => ({ ...prev, [name]: value }))
		if (loginErrors[name])
			setLoginErrors(prev => ({ ...prev, [name]: undefined }))
	}

	const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setRegisterData(prev => ({ ...prev, [name]: value }))
		if (registerErrors[name])
			setRegisterErrors(prev => ({ ...prev, [name]: undefined }))
	}

	const isRegisterFormValid = () => {
		const { full_name, email, password, confirmPassword } = registerData
		return (
			full_name.trim().length >= 2 &&
			email.trim().length > 0 &&
			email.includes('@') &&
			password.length >= 6 &&
			confirmPassword.length >= 6 &&
			password === confirmPassword
		)
	}

	const hasPasswordMismatch = () => {
		return (
			registerData.confirmPassword.length > 0 &&
			registerData.password !== registerData.confirmPassword
		)
	}

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setLoginErrors({})

		// Auth requests removed - authentication handled on CRM side
		toast({
			title: 'Авторизация перемещена на CRM',
			variant: 'destructive',
		})
		setIsLoading(false)
	}

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setRegisterErrors({})

		// Auth requests removed - registration handled on CRM side
		toast({
			title: 'Регистрация перемещена на CRM',
			variant: 'destructive',
		})
		setIsLoading(false)
	}

	return (
		<div className='min-h-screen relative overflow-hidden flex items-center justify-center p-4'>
			<div className='absolute inset-0 mesh-gradient-hero' />
			<div className='absolute inset-0 pattern-overlay' />

			<div className='absolute top-1/4 -right-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse' />
			<div
				className='absolute bottom-1/4 -left-32 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse'
				style={{ animationDelay: '1s' }}
			/>

			<Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
				<DialogContent className='glass-card border-primary/20 max-w-md'>
					<DialogHeader className='text-center space-y-4'>
						<div className='mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center animate-scale-in'>
							{/* <CheckCircle className='h-10 w-10 text-primary-foreground' /> */}
						</div>
						<DialogTitle className='text-2xl font-bold text-foreground flex items-center justify-center gap-2'>
							{/* <Sparkles className='h-5 w-5 text-primary' /> */}
							{t('auth.register.successDialog.title')}
							{/* <Sparkles className='h-5 w-5 text-primary' /> */}
						</DialogTitle>
						<DialogDescription className='text-muted-foreground text-base'>
							{t('auth.register.successDialog.description')}
						</DialogDescription>
					</DialogHeader>
					<div className='mt-4'>
						<Button
							variant='hero'
							className='w-full'
							onClick={() => {
								setShowSuccessDialog(false)
								navigate('/')
							}}
						>
							{t('auth.register.successDialog.button')}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<div className='w-full max-w-md relative'>
				<div className='text-center mb-8'>
					<img
						src={svcardLogo}
						alt='SVCard'
						className='h-20 w-auto mx-auto mb-4 drop-shadow-lg'
					/>
					<h1 className='text-2xl font-bold text-foreground'>
						{t('auth.title')}
					</h1>
					<p className='text-muted-foreground mt-2'>{t('auth.subtitle')}</p>
				</div>

				<div className='glass-card rounded-3xl shadow-2xl p-8'>
					<Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'login' | 'register')} className='w-full'>
						<TabsList className='grid w-full grid-cols-2 mb-6 bg-secondary/50'>
							<TabsTrigger
								value='login'
								className='flex items-center gap-2 data-[state=active]:bg-background'
							>
								<LogIn className='h-4 w-4' />
								{t('auth.tabs.login')}
							</TabsTrigger>
							<TabsTrigger
								value='register'
								className='flex items-center gap-2 data-[state=active]:bg-background'
							>
								<UserPlus className='h-4 w-4' />
								{t('auth.tabs.register')}
							</TabsTrigger>
						</TabsList>

						<TabsContent value='login'>
							<form onSubmit={handleLogin} className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='login-email'>{t('auth.login.email')}</Label>
									<Input
										id='login-email'
										name='email'
										type='email'
										placeholder={t('auth.login.emailPlaceholder')}
										value={loginData.email}
										onChange={handleLoginChange}
										className={loginErrors.email ? 'border-destructive' : ''}
									/>
									{loginErrors.email && (
										<p className='text-sm text-destructive'>
											{loginErrors.email}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='login-password'>
										{t('auth.login.password')}
									</Label>
									<Input
										id='login-password'
										name='password'
										type='password'
										placeholder={t('auth.login.passwordPlaceholder')}
										value={loginData.password}
										onChange={handleLoginChange}
										className={loginErrors.password ? 'border-destructive' : ''}
									/>
									{loginErrors.password && (
										<p className='text-sm text-destructive'>
											{loginErrors.password}
										</p>
									)}
								</div>

								<Button
									type='submit'
									variant='hero'
									size='lg'
									className='w-full'
									disabled={isLoading}
								>
									{isLoading
										? t('auth.login.submit.loading')
										: t('auth.login.submit.idle')}
								</Button>
							</form>
						</TabsContent>

						<TabsContent value='register'>
							<form onSubmit={handleRegister} className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='register-full_name'>
										{t('auth.register.fullName')}{' '}
										<span className='text-accent'>*</span>
									</Label>
									<Input
										id='register-full_name'
										name='full_name'
										placeholder={t('auth.register.fullNamePlaceholder')}
										value={registerData.full_name}
										onChange={handleRegisterChange}
										className={
											registerErrors.full_name ? 'border-destructive' : ''
										}
									/>
									{registerErrors.full_name && (
										<p className='text-sm text-destructive'>
											{registerErrors.full_name}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='register-email'>
										{t('auth.register.email')}{' '}
										<span className='text-accent'>*</span>
									</Label>
									<Input
										id='register-email'
										name='email'
										type='email'
										placeholder={t('auth.register.emailPlaceholder')}
										value={registerData.email}
										onChange={handleRegisterChange}
										className={registerErrors.email ? 'border-destructive' : ''}
									/>
									{registerErrors.email && (
										<p className='text-sm text-destructive'>
											{registerErrors.email}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='register-password'>
										{t('auth.register.password')}{' '}
										<span className='text-accent'>*</span>
									</Label>
									<div className='relative'>
										<Input
											id='register-password'
											name='password'
											type={showPassword ? 'text' : 'password'}
											placeholder={t('auth.register.passwordPlaceholder')}
											value={registerData.password}
											onChange={handleRegisterChange}
											className={
												registerErrors.password ? 'border-destructive pr-10' : 'pr-10'
											}
										/>
										<button
											type='button'
											onClick={() => setShowPassword(!showPassword)}
											className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
										>
											{/* {showPassword ? (
												<EyeOff className='h-4 w-4' />
											) : (
												<Eye className='h-4 w-4' />
											)} */}
										</button>
									</div>
									{registerErrors.password && (
										<p className='text-sm text-destructive'>
											{registerErrors.password}
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='register-confirmPassword'>
										{t('auth.register.confirmPassword')}{' '}
										<span className='text-accent'>*</span>
									</Label>
									<div className='relative'>
										<Input
											id='register-confirmPassword'
											name='confirmPassword'
										type={showPassword ? 'text' : 'password'}
										placeholder={t('auth.register.confirmPasswordPlaceholder')}
										value={registerData.confirmPassword}
										onChange={handleRegisterChange}
										className={
											registerErrors.confirmPassword || hasPasswordMismatch() ? 'border-destructive pr-10' : 'pr-10'
										}
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
									>
										{/* {showPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)} */}
									</button>
								</div>
								{registerErrors.confirmPassword && (
									<p className='text-sm text-destructive'>
										{registerErrors.confirmPassword}
									</p>
								)}
								{!registerErrors.confirmPassword && hasPasswordMismatch() && (
									<p className='text-sm text-destructive'>
										{t('auth.register.errors.confirmPassword')}
									</p>
								)}
							</div>

								<Button
									type='submit'
									variant='hero'
									size='lg'
									className='w-full'
									disabled={isLoading || !isRegisterFormValid()}
								>
									{isLoading
										? t('auth.register.submit.loading')
										: t('auth.register.submit.idle')}
								</Button>

								<p className='text-xs text-muted-foreground text-center'>
									{t('auth.register.agreement')}
								</p>
							</form>
						</TabsContent>
					</Tabs>
				</div>

				<div className='mt-6 text-center'>
					<Button
						variant='ghost'
						onClick={() => navigate('/')}
						className='text-muted-foreground hover:text-foreground'
					>
						<ArrowLeft className='h-4 w-4 mr-2' />
						{t('auth.backButton')}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Auth
