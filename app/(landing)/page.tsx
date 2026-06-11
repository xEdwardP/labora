import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Categories from '@/components/landing/Categories'
import HowItWorks from '@/components/landing/HowItWorks'
import FeaturedFreelancers from '@/components/landing/FeaturedFreelancers'
import CtaBanner from '@/components/landing/CtaBanner'
import Footer from '@/components/landing/Footer'
import TrustBar from '@/components/landing/TrustBar'

export default function LandingPage() {
  return (
    <main style={{ background: '#f4f4f4' }}>
      <Navbar />
      <Hero />
      <TrustBar />
      <Categories />
      <HowItWorks />
      <FeaturedFreelancers />
      <CtaBanner />
      <Footer />
    </main>
  )
}