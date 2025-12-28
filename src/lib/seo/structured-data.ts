import { getSiteUrl } from './metadata'

/**
 * Generate Organization structured data (JSON-LD)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HamarTech',
    url: getSiteUrl(),
    logo: `${getSiteUrl()}/NoBgOnlyLogoSmall.PNG`,
    description:
      'HamarTech er en uke for teknologi og kreativitet i Hamar-regionen. Festivalen samler spill, XR, digital kunst, koding og kreative prosjekter.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hamar',
      addressCountry: 'NO',
    },
    sameAs: [
      // Add social media links if available
      // 'https://www.facebook.com/hamartech',
      // 'https://twitter.com/hamartech',
    ],
    memberOf: {
      '@type': 'Organization',
      name: 'UNESCO Creative Cities Network',
      description: 'Hamar er UNESCO Creative City of Media Arts',
    },
  }
}

/**
 * Generate Event structured data (JSON-LD)
 */
export function generateEventSchema({
  title,
  description,
  slug,
  startsAt,
  endsAt,
  venue,
  venueAddress,
  venueCity,
  organizer,
  isFree,
  requiresRegistration,
}: {
  title: string
  description: string
  slug: string
  startsAt?: string | null
  endsAt?: string | null
  venue?: string
  venueAddress?: string | null
  venueCity?: string | null
  organizer?: string
  isFree?: boolean
  requiresRegistration?: boolean
}) {
  const eventUrl = `${getSiteUrl()}/program/${slug}`

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    description: description,
    url: eventUrl,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(startsAt && {
      startDate: new Date(startsAt).toISOString(),
    }),
    ...(endsAt && {
      endDate: new Date(endsAt).toISOString(),
    }),
    ...(venue && {
      location: {
        '@type': 'Place',
        name: venue,
        ...(venueAddress && {
          address: {
            '@type': 'PostalAddress',
            streetAddress: venueAddress,
            addressLocality: venueCity || 'Hamar',
            addressCountry: 'NO',
          },
        }),
      },
    }),
    ...(organizer && {
      organizer: {
        '@type': 'Organization',
        name: organizer,
      },
    }),
    ...(isFree !== undefined && {
      offers: {
        '@type': 'Offer',
        price: isFree ? '0' : undefined,
        priceCurrency: isFree ? undefined : 'NOK',
        availability: requiresRegistration ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
        url: eventUrl,
      },
    }),
  }

  return schema
}

/**
 * Generate BreadcrumbList structured data (JSON-LD)
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate CollectionPage structured data for program listing
 */
export function generateCollectionPageSchema({
  name,
  description,
  numberOfItems,
}: {
  name: string
  description: string
  numberOfItems: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    numberOfItems,
    url: `${getSiteUrl()}/program`,
  }
}

/**
 * Generate Festival structured data
 */
export function generateFestivalSchema({
  name,
  description,
  startDate,
  endDate,
  location,
}: {
  name: string
  description: string
  startDate?: string
  endDate?: string
  location?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Festival',
    name,
    description,
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(location && {
      location: {
        '@type': 'Place',
        name: location,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Hamar',
          addressCountry: 'NO',
        },
      },
    }),
  }
}
