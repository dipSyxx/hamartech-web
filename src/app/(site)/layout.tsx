import { Footer } from '@/components/shared/footer'
import { Header } from '@/components/shared/header'
import { buildPageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = buildPageMetadata({
  title: 'HamarTech – uke for teknologi og kreativitet',
  description:
    'HamarTech samler spill, XR, digital kunst, koding og kreative prosjekter i én festivaluke. Utforsk programmet, reserver billetter og oppdag hvordan teknologi og kultur møtes i Hamar-regionen.',
  path: '/',
})

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col bg-background text-foreground'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  )
}
