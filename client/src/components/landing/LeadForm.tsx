import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { Send, CheckCircle, ChevronDown } from 'lucide-react'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useCreateApplicationMutation } from '@/store/slices/applications'

type Country = 'KZ' | 'KG' | 'RU'

const LeadForm = () => {
	const { t } = useTranslation()
	const { toast } = useToast()
	const [createApplication] = useCreateApplicationMutation()

	// Countries object with translated names
	const COUNTRIES: Record<Country, { name: string; code: string; mask: string; maxDigits: number }> = {
		KZ: { name: t('countries.kz'), code: '+7', mask: '+7 (XXX) XXX-XX-XX', maxDigits: 10 },
		KG: { name: t('countries.kg'), code: '+996', mask: '+996 XXX XXX-XXX', maxDigits: 9 },
		RU: { name: t('countries.ru'), code: '+7', mask: '+7 (XXX) XXX-XX-XX', maxDigits: 10 },
	}
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [selectedCountry, setSelectedCountry] = useState<Country>('KZ')
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [displayPhoneValue, setDisplayPhoneValue] = useState('')
	const [formData, setFormData] = useState({
		first_name: '',
		phone_number: '',
	})

	const leadSchema = z.object({
		first_name: z
			.string()
			.trim()
			.min(2, t('leadForm.errors.firstName.required'))
			.max(100, t('leadForm.errors.firstName.max')),
		phone_number: z
			.string()
			.trim()
			.min(10, t('leadForm.errors.phone.required'))
			.max(20, t('leadForm.errors.phone.max')),
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
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

		// Remove country code prefix only when it was explicitly entered
		const hasExplicitCountryCode =
			displayValue.trim().startsWith('+') || digitsOnly.length > maxDigits
		if (hasExplicitCountryCode && digitsOnly.startsWith(countryCodeDigits)) {
			digitsOnly = digitsOnly.slice(countryCodeDigits.length)
		}

		// Limit digits to maxDigits
		const limitedDigits = digitsOnly.slice(0, maxDigits)

		// Store clean value (country code + digits)
		let cleanValue = ''
		if (limitedDigits.length > 0) {
			cleanValue = countryCode + limitedDigits
		}

		// Display value shows country code + space + digits without formatting
		const displayCleanValue = cleanValue ? countryCode + ' ' + limitedDigits : ''

		// Update state with clean value (for submission) and display value
		setFormData(prev => ({ ...prev, phone_number: cleanValue }))
		setDisplayPhoneValue(displayCleanValue)
		if (errors.phone_number) {
			setErrors(prev => ({ ...prev, phone_number: '' }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setErrors({})

		const result = leadSchema.safeParse(formData)

		if (!result.success) {
			const fieldErrors: Record<string, string> = {}
			result.error.errors.forEach(err => {
				if (err.path[0]) {
					fieldErrors[err.path[0]] = err.message
				}
			})
			setErrors(fieldErrors)
			setIsLoading(false)
			return
		}

		try {
			await createApplication({
				first_name: result.data.first_name,
				phone_number: result.data.phone_number,
			}).unwrap()

			setIsSubmitted(true)

			toast({
				title: t('leadForm.success.title'),
				description: t('leadForm.success.description'),
			})
		} catch {
			toast({
				title: t('leadForm.errors.error'),
				description: t('leadForm.errors.applicationSendError'),
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	if (isSubmitted) {
		return (
			<section id='apply' className='relative py-24 overflow-hidden'>
				<div className='absolute inset-0 mesh-gradient-form' />
				<div className='absolute inset-0 pattern-overlay opacity-50' />

				<div className='container relative mx-auto px-4'>
					<div className='max-w-lg mx-auto text-center'>
						<div className='w-24 h-24 rounded-full glass-card-dark flex items-center justify-center mx-auto mb-8 animate-scale-in shadow-2xl'>
							<CheckCircle className='h-12 w-12 text-primary-foreground' />
						</div>
						<h2 className='text-4xl font-bold text-primary-foreground mb-4'>
							{t('leadForm.success.title')}
						</h2>
						<p className='text-primary-foreground/80 text-lg max-w-md mx-auto'>
							{t('leadForm.success.description')}
						</p>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section id='apply' className='relative py-12 sm:py-24 overflow-hidden'>
			<div className='absolute inset-0 mesh-gradient-form' />
			<div className='absolute inset-0 pattern-overlay opacity-50' />

			<div className='absolute top-0 right-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-primary-foreground/5 rounded-full blur-[100px]' />
			<div className='absolute bottom-0 left-0 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-accent/10 rounded-full blur-[80px]' />

			<div className='container relative mx-auto px-4'>
				<div className='max-w-xl mx-auto'>
					<div className='text-center mb-8 sm:mb-12'>
						<h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4'>
							{t('leadForm.title')}
						</h2>
						<p className='text-primary-foreground/80 text-base sm:text-lg'>
							{t('leadForm.subtitle')}
						</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className='glass-card-dark rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl'
					>
						<div className='space-y-3 sm:space-y-5'>
							<div className='space-y-2'>
								<Label htmlFor='first_name' className='text-foreground'>
									{t('leadForm.fields.firstName')}{' '}
									<span className='text-accent'>
										{t('leadForm.requiredMark')}
									</span>
								</Label>
								<Input
									id='first_name'
									name='first_name'
									placeholder={t('leadForm.fields.firstNamePlaceholder')}
									value={formData.first_name}
									onChange={handleChange}
									className={errors.first_name ? 'border-destructive' : ''}
								/>
								{errors.first_name && (
									<p className='text-sm text-destructive'>{errors.first_name}</p>
								)}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='phone_number' className='text-foreground'>
									{t('leadForm.fields.phone')}{' '}
									<span className='text-accent'>
										{t('leadForm.requiredMark')}
									</span>
								</Label>
								<div className='flex flex-col sm:flex-row gap-2'>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant='outline'
												className='flex items-center gap-2 border-input bg-background text-foreground w-full sm:w-auto'
											>
												{COUNTRIES[selectedCountry].name}
												<ChevronDown className='h-4 w-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='start'>
											{(Object.entries(COUNTRIES) as [Country, typeof COUNTRIES[Country]][]).map(
												([code, country]) => (
													<DropdownMenuItem
														key={code}
														onClick={() => {
															setSelectedCountry(code)
															setFormData(prev => ({ ...prev, phone_number: '' }))
															setDisplayPhoneValue('')
														}}
													>
														{country.name} ({country.code})
													</DropdownMenuItem>
												)
											)}
										</DropdownMenuContent>
									</DropdownMenu>
									<Input
										id='phone_number'
										name='phone_number'
										type='tel'
										placeholder={COUNTRIES[selectedCountry].mask}
										value={displayPhoneValue}
										onChange={handlePhoneChange}
										className={errors.phone_number ? 'border-destructive' : ''}
									/>
								</div>
								{errors.phone_number && (
									<p className='text-sm text-destructive'>{errors.phone_number}</p>
								)}
							</div>

							<Button
								type='submit'
								variant='hero'
								size='lg'
								className='w-full mt-4'
								disabled={isLoading}
							>
								{isLoading ? (
									t('leadForm.submit.sending')
								) : (
									<>
										{t('leadForm.submit.send')}
										<Send className='ml-2 h-4 w-4' />
									</>
								)}
							</Button>

							<p className='text-xs text-muted-foreground text-center mt-4'>
								{t('leadForm.agreement')}
							</p>
						</div>
					</form>
				</div>
			</div>
		</section>
	)
}

export default LeadForm
