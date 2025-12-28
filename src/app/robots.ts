import { getSiteUrl } from '@/lib/seo/metadata'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/approver/', '/min-side/', '/api/', '/checkout/', '/login', '/register', '/qr/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
