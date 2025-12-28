import { AppSessionProvider } from '@/components/providers/session-provider'
import { AppleMetaTag } from '@/components/seo/apple-meta'
import { IntroGate } from '@/components/shared/intro-gate'
import { defaultMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'
import { Geist_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'

const sans = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
})

const mono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='nb' className='dark scroll-smooth' suppressHydrationWarning>
      <body
        className={`
          ${sans.variable}
          ${mono.variable}
          font-sans
          antialiased
        `}
      >
        <AppleMetaTag />
        <AppSessionProvider>
          <IntroGate logoSrc='/NoBgOnlyLogoSmall.PNG' minDurationMs={3000} showSkip={false}>
            <div className='min-h-screen bg-background text-foreground'>{children}</div>
          </IntroGate>
        </AppSessionProvider>
      </body>
    </html>
  )
}
