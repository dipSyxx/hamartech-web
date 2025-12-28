import type { Metadata } from 'next'

/**
 * Get the base URL for the site
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://hamartech-web.vercel.app'
}

/**
 * Default Open Graph image path
 * TODO: Create a proper 1200x630px Open Graph image at /public/og-image.png
 * For now, using the logo as a fallback
 */
export const DEFAULT_OG_IMAGE = '/HamarTechPrimaryWihoutBGsmall.PNG'

/**
 * Default site metadata
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'HamarTech – uke for teknologi og kreativitet',
    template: '%s | HamarTech',
  },
  description:
    'Digital festivalhub for HamarTech – en uke med teknologi, spill, XR og kreative uttrykk i Hamar-regionen. UNESCO Creative City of Media Arts.',
  keywords: [
    'HamarTech',
    'Hamar',
    'festival',
    'teknologi',
    'spill',
    'XR',
    'VR',
    'AR',
    'digital kunst',
    'media arts',
    'UNESCO',
    'kreativitet',
    'game development',
    'e-sport',
    'kodeklubb',
    'maker space',
  ],
  authors: [{ name: 'HamarTech' }],
  creator: 'HamarTech',
  publisher: 'Hamar kommune',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: getSiteUrl(),
    siteName: 'HamarTech',
    title: 'HamarTech – uke for teknologi og kreativitet',
    description:
      'Digital festivalhub for HamarTech – en uke med teknologi, spill, XR og kreative uttrykk i Hamar-regionen.',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'HamarTech – uke for teknologi og kreativitet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HamarTech – uke for teknologi og kreativitet',
    description:
      'Digital festivalhub for HamarTech – en uke med teknologi, spill, XR og kreative uttrykk i Hamar-regionen.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/icon0.svg', type: 'image/svg+xml' },
      { url: '/favicon/icon1.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/favicon/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon/icon0.svg',
        color: '#020617',
      },
    ],
  },
  manifest: '/favicon/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HamarTech',
  },
  verification: {
    // Add verification codes if available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

/**
 * Build metadata for a specific page
 */
export function buildPageMetadata({
  title,
  description,
  path = '',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
}: {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}): Metadata {
  const url = `${getSiteUrl()}${path}`
  const ogImage = image || `${getSiteUrl()}${DEFAULT_OG_IMAGE}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

/**
 * Build event-specific metadata
 */
export function buildEventMetadata({
  title,
  description,
  slug,
  startsAt,
  endsAt,
  venue,
  image,
}: {
  title: string
  description: string
  slug: string
  startsAt?: string | null
  endsAt?: string | null
  venue?: string
  image?: string
}): Metadata {
  const path = `/program/${slug}`
  const eventDescription = `${description}${venue ? ` Sted: ${venue}.` : ''}${
    startsAt ? ` ${new Date(startsAt).toLocaleDateString('nb-NO')}.` : ''
  }`

  return buildPageMetadata({
    title: `${title} – HamarTech`,
    description: eventDescription,
    path,
    image,
    type: 'article',
    publishedTime: startsAt || undefined,
    modifiedTime: endsAt || undefined,
  })
}
