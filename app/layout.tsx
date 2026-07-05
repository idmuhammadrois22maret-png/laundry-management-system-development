import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/hooks/use-theme'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Laundry Business Management System',
  description: 'Complete laundry business management with customer orders, payments, and notifications',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={`antialiased ${inter.variable}`} style={{ fontFamily: 'var(--font-inter)' }}>
        <TooltipProvider delayDuration={0}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </TooltipProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
