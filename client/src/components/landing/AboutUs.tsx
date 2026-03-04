import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

const AboutUs = () => {
	const { t } = useTranslation()

	const aboutUsData = t('aboutUsSection', { returnObjects: true }) as {
		label: string
		title: string
		intro: string
		systemSection: {
			title: string
			benefits: string[]
		}
		conclusion: string
	}

	return (
		<section id='about-us' className='py-12 sm:py-16 md:py-24 bg-background'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-8 sm:mb-12 md:mb-16'>
					<span className='inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4'>
						{aboutUsData.label}
					</span>
					<h2 className='text-3xl md:text-4xl font-bold mb-4'>
						{aboutUsData.title}
					</h2>
				</div>

				<div className='max-w-3xl mx-auto space-y-6 sm:space-y-8'>
					{/* Intro paragraph */}
					<div>
						<p className='text-lg text-muted-foreground leading-relaxed'>
							{aboutUsData.intro}
						</p>
					</div>

					{/* System section with benefits */}
					<div>
						<h3 className='text-xl font-semibold mb-6 text-foreground'>
							{aboutUsData.systemSection.title}
						</h3>
						<ul className='space-y-3 sm:space-y-4'>
							{aboutUsData.systemSection.benefits.map((benefit, index) => (
								<li key={index} className='flex items-start gap-3 sm:gap-4 group'>
									<div className='relative flex-shrink-0 mt-1'>
										<div className='w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
											<Check className='w-4 h-4 text-primary' />
										</div>
									</div>
									<span className='text-muted-foreground leading-relaxed'>
										{benefit}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Conclusion paragraph */}
					<div>
						<p className='text-lg text-muted-foreground leading-relaxed'>
							{aboutUsData.conclusion}
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AboutUs
