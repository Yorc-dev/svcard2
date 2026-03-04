import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import AboutUs from '@/components/landing/AboutUs'
import LeadForm from '@/components/landing/LeadForm'
import Footer from '@/components/landing/Footer'
import ScrollToTopButton from '@/components/landing/ScrollToTopButton'

type HomeLocationState = {
  scrollTo?: string
}

const Index = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const state = location.state as HomeLocationState | null
    const targetId = state?.scrollTo
    if (!targetId) return

    const scrollToSection = () => {
      const target = document.getElementById(targetId)
      if (!target) return
      const headerOffset = 72
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerOffset
      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    }

    requestAnimationFrame(scrollToSection)
    navigate('.', { replace: true, state: null })
  }, [location.state, navigate])

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Header />
      <main className='flex-1'>
        <Hero />
        <Features />
        <AboutUs />
        <LeadForm />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

export default Index
