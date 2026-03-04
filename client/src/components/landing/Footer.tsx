import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import svcardLogo from '@/assets/svcard-logo.png'

const Footer = () => {
	const { t } = useTranslation()
	const currentYear = new Date().getFullYear()

	return (
		<footer className='bg-foreground py-8 md:py-6'>
			<div className='container mx-auto px-4'>
				<div className='pt-2'>
					<div className='flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between text-xs md:text-sm text-muted/50'>
						{/* Left: Copyright */}
						<p className='text-center md:text-left'>
							{t('footer.rightsReserved', { year: currentYear })}
						</p>

						{/* Center/Right: Links and Credits */}
						<div className='flex flex-col md:flex-row md:items-baseline gap-4 md:gap-6'>
							{/* Links Grid */}
							<div className='flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-6'>
								<a
									href='#'
									className='leading-5 hover:text-muted/80 transition-colors text-center sm:text-left'
								>
									{t('footer.privacyPolicy')}
								</a>
								<a
									href='#'
									className='leading-5 hover:text-muted/80 transition-colors text-center sm:text-left'
								>
									{t('footer.termsOfUse')}
								</a>
							</div>

							{/* Credits */}
							<div className='flex flex-col sm:flex-row items-center sm:items-baseline gap-2 justify-center sm:justify-start md:justify-end'>
								<span className='leading-5 whitespace-nowrap'>
									{t('footer.developedBy')}
								</span>
								<a
									href='https://yorc.org/'
									target='_blank'
									rel='noreferrer'
									className='leading-5'
								>
									<img src='/YorcLogo.svg' alt='Yorc' className='h-4 md:h-5 w-auto' />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
