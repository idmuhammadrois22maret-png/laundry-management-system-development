'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const navLinks = [
  { label: 'Fitur', href: '#features' },
  { label: 'Harga', href: '#pricing' },
  { label: 'Pelanggan', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-colors duration-300',
        scrolled && 'border-border bg-white/80 backdrop-blur-xl',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#111827"/>
            <path d="M10 20V12L16 8L22 12V20L16 24L10 20Z" fill="white" opacity="0.9"/>
            <path d="M13 16L15 18L19 14" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 8V24" stroke="#111827" strokeWidth="0.5" opacity="0.2"/>
          </svg>
          <span className="text-lg font-semibold tracking-tight">Laundrio</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-[#6B7280] transition-colors hover:text-[#111827]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button size="sm" className="bg-[#111827] text-white hover:bg-[#111827]/90" onClick={() => router.push('/login')}>
            Mulai
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-white md:hidden"
          >
            <div className="space-y-1 px-6 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]"
                >
                  {link.label}
                </a>
              ))}
              <hr className="my-3 border-border" />
              <Button size="sm" className="mt-1 w-full bg-[#111827] text-white hover:bg-[#111827]/90" onClick={() => router.push('/app')}>
                Mulai
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
