import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

const HowItWorks = () => {
	const { t } = useTranslation()

	const steps = t('howItWorksSection.steps', { returnObjects: true }) as Array<{
		number: string
		title: string
		description: string
	}>

	return (
		<section id='how-it-works' className='py-12 sm:py-16 md:py-24 bg-background'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-8 sm:mb-12 md:mb-16'>
					<span className='inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4'>
						{t('howItWorksSection.label')}
					</span>
					<h2 className='text-3xl md:text-4xl font-bold mb-4'>
						{t('howItWorksSection.title')}
					</h2>
					<p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
						{t('howItWorksSection.description')}
					</p>
				</div>

				<div className='max-w-4xl mx-auto'>
					<div className='relative'>
						{/* Connection line */}
						<div className='absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-accent hidden md:block' />

						<div className='space-y-6 sm:space-y-8'>
							{steps.map((step, index) => (
								<div
									key={step.number}
									className='relative flex items-start gap-4 sm:gap-6 group'
								>
									{/* Step number */}
									<div className='relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
										<span className='text-xl font-bold text-primary-foreground'>
											{step.number}
										</span>
									</div>

									{/* Content */}
									<div className='flex-1 pt-2 pb-6'>
										<h3 className='text-xl font-semibold mb-2 text-foreground flex items-center gap-2'>
											{step.title}
											{index < steps.length - 1 && (
												<ArrowRight className='h-4 w-4 text-muted-foreground hidden md:inline' />
											)}
										</h3>
										<p className='text-muted-foreground leading-relaxed'>
											{step.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default HowItWorks
