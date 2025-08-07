import type { Metadata } from 'next'
import { Oswald } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Архитектурная Студия Артёма Давлетова',
  description: 'Будущее городов начинается с наших чертежей. Масштабно. Дорого. Навсегда.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={oswald.className}>
        <LanguageProvider>
          <Navigation />
          <main className="min-h-screen bg-white">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  )
}
