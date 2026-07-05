'use client'

import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { TrustSection } from '@/components/landing/trust-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { DashboardPreview } from '@/components/landing/dashboard-preview'
import { HowItWorks } from '@/components/landing/how-it-works'
import { WhatsAppSection } from '@/components/landing/whatsapp-section'
import { ReportsSection } from '@/components/landing/reports-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { FAQSection } from '@/components/landing/faq-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <DashboardPreview />
        <HowItWorks />
        <WhatsAppSection />
        <ReportsSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
