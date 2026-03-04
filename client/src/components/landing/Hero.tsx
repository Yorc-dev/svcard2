import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ArrowRight, Fuel, Users, CreditCard } from 'lucide-react'
import svcardLogo from '@/assets/svcard-logo.png'

const Hero = () => {
	const { t } = useTranslation()

	const scrollToForm = () => {
		const element = document.getElementById('apply')
		element?.scrollIntoView({ behavior: 'smooth' })
	}

	const stats = t('hero.stats', { returnObjects: true }) as Array<{
		value: string
		label: string
	}>

	return (
		<section className='relative min-h-screen flex items-center justify-center pt-16 overflow-hidden'>
			{/* Mesh Gradient Background */}
			<div className='absolute inset-0 mesh-gradient-hero' />
			<div className='absolute inset-0 pattern-overlay' />

			{/* Floating orbs for depth */}
			<div className='absolute top-1/4 -right-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse' />
			<div
				className='absolute bottom-1/4 -left-32 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse'
				style={{ animationDelay: '1s' }}
			/>
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]' />

		<div className='container relative mx-auto px-4 py-12 sm:py-16 md:py-20'>
			<div className='max-w-4xl mx-auto text-center'>
				{/* Logo animation */}
				<div className='mb-6 sm:mb-8 animate-fade-in'>
						<img
							src={svcardLogo}
							alt='SVCard'
							className='h-36 md:h-42 w-auto mx-auto animate-float'
						/>
					</div>

					{/* Main headline */}
					<h1 className='text-2xl sm:text-3xl md:text-5xl lg:text-5xl font-bold mb-4 sm:mb-6 animate-slide-up' style={{lineHeight: '1.2'}}>
						<span className='text-gradient-primary'>
							{t('hero.headline.line1')}
						</span>
						<br />
						<span className='text-foreground'>
							{t('hero.headline.line2')}
						</span>
					</h1>

					{/* Subtitle */}
					<p className='text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 animate-slide-up animation-delay-100'>
						{t('hero.subtitle')}
					</p>

					{/* CTA buttons */}
					<div className='flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up animation-delay-200'>
						<Button variant='hero' size='xl' onClick={scrollToForm}>
							{t('hero.buttons.apply')}
							<ArrowRight className='ml-2 h-5 w-5' />
						</Button>
					</div>

					{/* Stats/Trust indicators */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up animation-delay-300'>
						<div className='flex items-center justify-center gap-3 p-5 rounded-2xl glass-card shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'>
							<div className='w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center'>
								<Fuel className='h-7 w-7 text-primary' />
							</div>
							<div className='text-left'>
								<p className='text-2xl font-bold text-foreground'>
									{stats[0].value}
								</p>
								<p className='text-sm text-muted-foreground'>
									{stats[0].label}
								</p>
							</div>
						</div>

						<div className='flex items-center justify-center gap-3 p-5 rounded-2xl glass-card shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'>
							<div className='w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center'>
								<Users className='h-7 w-7 text-accent' />
							</div>
							<div className='text-left'>
								<p className='text-2xl font-bold text-foreground'>
									{stats[1].value}
								</p>
								<p className='text-sm text-muted-foreground'>
									{stats[1].label}
								</p>
							</div>
						</div>

						<div className='flex items-center justify-center gap-3 p-5 rounded-2xl glass-card shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1'>
							<div className='w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center'>
								<CreditCard className='h-7 w-7 text-primary' />
							</div>
							<div className='text-left'>
								<p className='text-2xl font-bold text-foreground'>
									{stats[2].value}
								</p>
								<p className='text-sm text-muted-foreground'>
									{stats[2].label}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Hero
