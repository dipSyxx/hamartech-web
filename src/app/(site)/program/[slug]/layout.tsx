import { prisma } from '@/lib/prisma'
import { buildEventMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: { venue: true },
    })

    if (!event) {
      return {
        title: 'Arrangement ikke funnet',
        description: 'Dette arrangementet finnes ikke.',
      }
    }

    return buildEventMetadata({
      title: event.title,
      description: event.description,
      slug: event.slug,
      startsAt: event.startsAt?.toISOString() || null,
      endsAt: event.endsAt?.toISOString() || null,
      venue: event.venueLabel,
    })
  } catch (error) {
    console.error('Error generating metadata for event:', error)
    return {
      title: 'Arrangement',
      description: 'HamarTech arrangement',
    }
  }
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
