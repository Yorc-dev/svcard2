import { useState, useRef, useEffect, type MouseEvent as ReactMouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, LogIn } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from '@/components/ui/tooltip'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import svcardLogo from '@/assets/svcard-logo.png'
import config from '@/config'

const LANGUAGES = [
	{ code: 'ru', label: 'Русский', flag: '🇷🇺' },
	{ code: 'ky', label: 'Кыргызча', flag: '🇰🇬' },
	{ code: 'en', label: 'English', flag: '🇺🇸' },
]

const Header = () => {
	const { t, i18n } = useTranslation()
	const [isOpen, setIsOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const location = useLocation()

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng)
		setIsOpen(false)
	}

	const currentLang =
		LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

	const loginUrl = `${config.crmUrl}/login?language=${i18n.language}`

	const scrollToSection = (targetId: string) => {
		const target = document.getElementById(targetId)
		if (!target) return

		const headerOffset = 72
		const targetPosition =
			target.getBoundingClientRect().top + window.scrollY - headerOffset

		window.scrollTo({
			top: targetPosition,
			behavior: 'smooth',
		})
	}

	const handleHomeNavClick = (
		event: ReactMouseEvent<HTMLAnchorElement>,
		targetId: string,
	) => {
		if (location.pathname !== '/') {
			return
		}
		event.preventDefault()
		scrollToSection(targetId)
	}

	const handleLogoClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
		if (location.pathname === '/') {
			event.preventDefault()
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	useEffect(() => {
		const handleClickOutside = (event: globalThis.MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	return (
		<header className='fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background/90 via-background/80 to-background/90 backdrop-blur-lg border-b border-border/60 shadow-md'>
			<div className='container mx-auto px-4 h-16 flex items-center justify-between'>
				<div className='flex items-center gap-3 flex-shrink-0 md:mr-8'>
					<Link to='/' aria-label='SVCard' onClick={handleLogoClick}>
						<img src={svcardLogo} alt='SVCard' className='h-14 w-auto' />
					</Link>
				</div>

				{/* Центр - навигация */}
				<nav className='hidden md:flex items-center gap-8 flex-1 justify-center min-w-0'>
					<Link
						to='/'
						state={{ scrollTo: 'features' }}
						onClick={event => handleHomeNavClick(event, 'features')}
						className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors truncate'
					>
						{t('features')}
					</Link>
					<Link
						to='/'
						state={{ scrollTo: 'about-us' }}
						onClick={event => handleHomeNavClick(event, 'about-us')}
						className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors truncate'
					>
						{t('aboutUs')}
					</Link>
					<Link
						to='/'
						state={{ scrollTo: 'apply' }}
						onClick={event => handleHomeNavClick(event, 'apply')}
						className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors truncate'
					>
						{t('apply')}
					</Link>
				</nav>

				<div className='hidden md:flex items-center gap-3 flex-shrink-0'>
					{/* Языковой селектор с иконкой флага */}
					<div className='relative flex-shrink-0' ref={dropdownRef}>
						<Button
							variant='ghost'
							size='icon'
							className='h-10 w-10 border border-border/60 bg-transparent hover:bg-muted/20'
							onClick={() => setIsOpen(open => !open)}
							aria-haspopup='listbox'
							aria-expanded={isOpen}
						>
							<span className='text-xl' aria-hidden='true'>
								{currentLang.flag}
							</span>
							<span className='sr-only'>{currentLang.label}</span>
						</Button>

						{isOpen && (
							<ul
								role='listbox'
								className='absolute right-0 mt-2 w-44 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden'
							>
								{LANGUAGES.map(({ code, label, flag }) => (
									<li
										key={code}
										role='option'
										aria-selected={i18n.language === code}
										className={`cursor-pointer px-4 py-2 hover:bg-muted/20 transition-colors flex items-center gap-2 ${
											i18n.language === code ? 'font-semibold bg-muted/30' : ''
										}`}
										onClick={() => changeLanguage(code)}
									>
										<span className='text-lg' aria-hidden='true'>
											{flag}
										</span>
										<span className='text-sm'>{label}</span>
									</li>
								))}
							</ul>
						)}
					</div>

					{/* Фиксированная минимальная ширина для кнопок */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='h-10 w-10 border border-border/60 bg-transparent hover:bg-muted/20'
								asChild
							>
								<a
									href={loginUrl}
									target='_blank'
									rel='noreferrer'
									className='flex items-center justify-center'
								>
									<LogIn className='h-5 w-5' />
									<span className='sr-only'>{t('loginRegister')}</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>{t('loginRegister')}</TooltipContent>
					</Tooltip>
				</div>

				<div className='md:hidden'>
					<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
						<SheetTrigger asChild>
							<span
								role='button'
								tabIndex={0}
								aria-label='Open menu'
								className='inline-flex items-center justify-center text-foreground hover:text-primary transition-colors cursor-pointer'
							>
								<Menu className='h-6 w-6' />
							</span>
						</SheetTrigger>
						<SheetContent side='right' className='w-full sm:max-w-sm'>
							<SheetHeader>
								<SheetTitle>Menu</SheetTitle>
							</SheetHeader>

								<div className='mt-6 flex flex-col gap-5'>
									<div className='flex flex-col gap-2'>
										<Link
											to='/'
											state={{ scrollTo: 'features' }}
											onClick={event => {
												handleHomeNavClick(event, 'features')
												setIsMobileMenuOpen(false)
											}}
											className='text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2'
										>
											{t('features')}
										</Link>
										<Link
											to='/'
											state={{ scrollTo: 'about-us' }}
											onClick={event => {
												handleHomeNavClick(event, 'about-us')
												setIsMobileMenuOpen(false)
											}}
											className='text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2'
										>
											{t('aboutUs')}
										</Link>
										<Link
											to='/'
											state={{ scrollTo: 'apply' }}
											onClick={event => {
												handleHomeNavClick(event, 'apply')
												setIsMobileMenuOpen(false)
											}}
											className='text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2'
										>
											{t('apply')}
										</Link>
								</div>

								<div className='border-t border-border pt-4'>
									<p className='text-xs text-muted-foreground mb-3'>
										{currentLang.flag} {currentLang.label}
									</p>
									<div className='flex flex-col gap-2'>
										{LANGUAGES.map(({ code, label, flag }) => (
											<Button
												key={code}
												type='button'
												variant={i18n.language === code ? 'default' : 'outline'}
												size='sm'
												onClick={() => i18n.changeLanguage(code)}
												className='w-full justify-start'
											>
												<span className='mr-2' aria-hidden='true'>
													{flag}
												</span>
												{label}
											</Button>
										))}
									</div>
								</div>

								<div className='border-t border-border pt-4 flex flex-col gap-2'>
									<Button
										variant='default'
										size='sm'
										asChild
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<a
											href={loginUrl}
											target='_blank'
											rel='noreferrer'
										>
											<LogIn className='h-4 w-4 mr-2' />
											{t('loginRegister')}
										</a>
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	)
}

export default Header
