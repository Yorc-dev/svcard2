import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

const ScrollToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const toggleVisibility = () => {
			const featuresElement = document.getElementById('features')
			if (!featuresElement) {
				// Fallback to fixed height if features element not found
				setIsVisible(window.scrollY > 300)
				return
			}

			const featuresTop = featuresElement.offsetTop - 100
			setIsVisible(window.scrollY >= featuresTop)
		}

		// Initial check
		toggleVisibility()

		window.addEventListener('scroll', toggleVisibility)

		return () => {
			window.removeEventListener('scroll', toggleVisibility)
		}
	}, [])

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}

	if (!isVisible) {
		return null
	}

	return (
		<button
			type='button'
			onClick={scrollToTop}
			className='group fixed bottom-[72px] right-8 z-50 h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center transition-transform duration-300 border border-white'
			style={{ transform: 'scale(1)' }}
			onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
			onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
			aria-label='Scroll to top'
		>
			<ArrowUp className='h-5 w-5 text-primary-foreground' />
		</button>
	)
}

export default ScrollToTopButton
