import type { Metadata } from 'next'
import { env } from '@/env'
import { localizePath, type Locale } from '@/i18n/config'

export interface PageSeoInput {
  locale: Locale
  barePath: string // e.g. '/', '/services', '/services/brand-identity'
  title: string
  description: string
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
    canonicalUrl?: string | null
    noIndex?: boolean | null
    ogTitle?: string | null
    ogDescription?: string | null
    ogImage?: { url?: string | null } | string | number | null
  } | null
  defaultSuffix?: string
}

/**
 * Normalizes a full canonical URL with trailingSlash: false (AUD-018).
 */
export function buildCanonicalUrl(pathOrUrl: string): string {
  const siteBase = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl === `${siteBase}/` ? siteBase : pathOrUrl.replace(/\/+$/, '')
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  if (cleanPath === '/') {
    return siteBase
  }
  return `${siteBase}${cleanPath.replace(/\/+$/, '')}`
}

/**
 * Generates complete Next.js 15 Metadata including:
 * - Self-referencing canonical URL
 * - Reciprocal hreflang alternates ('ar-SA', 'en', 'x-default')
 * - Open Graph & Twitter card metadata
 * - Robots directives (index, follow vs noindex, nofollow)
 */
export function buildPageMetadata(input: PageSeoInput): Metadata {
  const { locale, barePath, title, description, seo, defaultSuffix } = input

  const suffix =
    defaultSuffix ||
    (locale === 'ar' ? 'بيّورا (Bayyora) — خطوة لفوق' : 'Bayyora (بيّورا) — One step up')

  const finalTitle =
    seo?.metaTitle && seo.metaTitle.trim().length > 0
      ? seo.metaTitle.trim()
      : title.includes('بيّورا') || title.includes('Bayyora')
        ? title
        : `${title} | ${suffix}`

  const finalDescription =
    seo?.metaDescription && seo.metaDescription.trim().length > 0
      ? seo.metaDescription.trim()
      : description

  const arPath = localizePath(barePath, 'ar')
  const enPath = localizePath(barePath, 'en')

  const arCanonical = buildCanonicalUrl(arPath)
  const enCanonical = buildCanonicalUrl(enPath)
  const selfCanonical =
    seo?.canonicalUrl && seo.canonicalUrl.trim().length > 0
      ? buildCanonicalUrl(seo.canonicalUrl.trim())
      : locale === 'ar'
        ? arCanonical
        : enCanonical

  const noIndex = Boolean(seo?.noIndex)

  const ogTitle =
    seo?.ogTitle && seo.ogTitle.trim().length > 0 ? seo.ogTitle.trim() : finalTitle
  const ogDescription =
    seo?.ogDescription && seo.ogDescription.trim().length > 0
      ? seo.ogDescription.trim()
      : finalDescription

  const ogImageUrl =
    typeof seo?.ogImage === 'object' && seo.ogImage !== null && 'url' in seo.ogImage && seo.ogImage.url
      ? buildCanonicalUrl(String(seo.ogImage.url))
      : undefined

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: selfCanonical,
      languages: {
        'ar-SA': arCanonical,
        en: enCanonical,
        'x-default': arCanonical,
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: selfCanonical,
      siteName: locale === 'ar' ? 'بيّورا — خطوة لفوق' : 'Bayyora — One step up',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_SA'],
      type: 'website',
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  }
}

