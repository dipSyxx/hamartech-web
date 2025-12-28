import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/lib/seo/metadata'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/program`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  try {
    // Fetch all events from database
    const events = await prisma.event.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // Generate sitemap entries for events
    const eventPages: MetadataRoute.Sitemap = events.map((event) => ({
      url: `${baseUrl}/program/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticPages, ...eventPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages even if database query fails
    return staticPages
  }
}

