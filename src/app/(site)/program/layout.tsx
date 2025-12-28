import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Program – hele uka',
  description:
    'Her finner du hele programmet for HamarTech-uka. Filtrer på spor og dag, søk etter temaer – og finn arrangementer som passer for deg.',
  path: '/program',
})

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

