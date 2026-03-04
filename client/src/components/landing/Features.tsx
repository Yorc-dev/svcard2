import { useTranslation } from 'react-i18next'
import {
	Building2,
	Users,
	MapPin,
	BarChart3,
	Shield,
	QrCode,
	Wallet,
	Bell,
} from 'lucide-react'

const icons = {
	'ВОДИТЕЛИ НЕ БУДУТ ТРАТИТЬ ЛИШНЕГО': Wallet,
	'СКИДКА ДО 15%': BarChart3,
	'КОНТРОЛЬ РАСХОДОВ': BarChart3,
	'ПРОСТОТА И ПРОЗРАЧНОСТЬ': Shield,
	'ПОДДЕРЖКА 24/7': Bell,
	'БЫСТРЫЙ СТАРТ': Building2,
	'СЕТЕВЫЕ АЗС': MapPin,
	'ВИРТУАЛЬНАЯ ИЛИ ФИЗИЧЕСКАЯ КАРТА НА ВАШ ВЫБОР': QrCode,
}

const Features = () => {
	const { t } = useTranslation()

	// Берем массив объектов из перевода
	const features = t('featuresSection.items', {
		returnObjects: true,
	}) as Array<{
		title: string
		description: string
	}>

	return (
		<section id='features' className='py-12 sm:py-16 md:py-24 bg-secondary/30'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-8 sm:mb-12 md:mb-16'>
					<span className='inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4'>
						{t('featuresSection.label')}
					</span>
					<h2 className='text-3xl md:text-4xl font-bold mb-4'>
						{t('featuresSection.title')}
					</h2>
					<p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
						{t('featuresSection.description')}
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{features.map(({ title, description }) => {
						const Icon = icons[title] || Building2
						const colorClass = [
							'ВОДИТЕЛИ НЕ БУДУТ ТРАТИТЬ ЛИШНЕГО',
							'КОНТРОЛЬ РАСХОДОВ',
							'СКИДКА ДО 15%',
							'ПОДДЕРЖКА 24/7',
						].includes(title)
							? 'primary'
							: 'accent'

						return (
							<div
								key={title}
								className={`group p-4 sm:p-5 md:p-6 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1`}
							>
								<div
									className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center transition-colors duration-300 ${
										colorClass === 'primary'
											? 'bg-primary/10 group-hover:bg-primary/20'
											: 'bg-accent/10 group-hover:bg-accent/20'
									}`}
								>
									<Icon
										className={`h-6 w-6 ${
											colorClass === 'primary' ? 'text-primary' : 'text-accent'
										}`}
									/>
								</div>
								<h3 className='text-lg font-semibold mb-2 text-foreground'>
									{title}
								</h3>
								<p className='text-sm text-muted-foreground leading-relaxed'>
									{description}
								</p>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default Features
