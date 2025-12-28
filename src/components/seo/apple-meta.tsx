'use client'

import { useEffect } from 'react'

/**
 * Component to inject apple-mobile-web-app-title meta tag
 * This is needed because Next.js metadata API doesn't directly support this meta tag
 */
export function AppleMetaTag() {
  useEffect(() => {
    // Check if meta tag already exists
    const existingMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]')

    if (!existingMeta) {
      const meta = document.createElement('meta')
      meta.name = 'apple-mobile-web-app-title'
      meta.content = 'HamarTech'
      document.head.appendChild(meta)
    } else {
      // Update if exists but content is different
      existingMeta.setAttribute('content', 'HamarTech')
    }
  }, [])

  return null
}
