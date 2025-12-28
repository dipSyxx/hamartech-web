import { generateOrganizationSchema } from '@/lib/seo/structured-data'

/**
 * Component to inject JSON-LD structured data into the page
 */
export function StructuredData({ data }: { data: object | object[] }) {
  const jsonLd = Array.isArray(data) ? data : [data]

  return (
    <>
      {jsonLd.map((item, index) => (
        <script key={index} type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
    </>
  )
}

/**
 * Organization structured data component for homepage
 */
export function OrganizationStructuredData() {
  return <StructuredData data={generateOrganizationSchema()} />
}
