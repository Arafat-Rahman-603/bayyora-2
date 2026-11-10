import React from 'react'
import { env } from '@/env'
import { buildCanonicalUrl } from './metadata'
import { localizePath, type Locale } from '@/i18n/config'

/**
 * XSS-Safe JSON-LD Serializer Component (AUD-022):
 * Escapes `<`, `>`, `&`, `\u2028`, and `\u2029` to prevent script tag breakout.
 */
export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLdStringify(data),
      }}
    />
  )
}

/**
 * Builds truthful Organization & ProfessionalService Schema.org JSON-LD.
 * Strictly omits any fabricated aggregateRating or review counts (BR-009).
 */
export function buildOrganizationJsonLd(
  locale: Locale,
  siteSettings?: {
    whatsappNumber?: string | null
    businessEmail?: string | null
    instagramUrl?: string | null
    snapchatUrl?: string | null
    tiktokUrl?: string | null
    xUrl?: string | null
  },
) {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
  const sameAs = [
    siteSettings?.instagramUrl,
    siteSettings?.snapchatUrl,
    siteSettings?.tiktokUrl,
    siteSettings?.xUrl,
  ].filter((u): u is string => Boolean(u && u.startsWith('http')))

  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${baseUrl}/#organization`,
    name: locale === 'ar' ? 'بيّورا (Bayyora)' : 'Bayyora (بيّورا)',
    alternateName: ['بيّورا', 'Bayyora', 'بيورا'],
    slogan: locale === 'ar' ? 'خطوة لفوق' : 'One step up',
    url: buildCanonicalUrl(localizePath('/', locale)),
    email: siteSettings?.businessEmail || 'hello@bayyora.com',
    telephone: siteSettings?.whatsappNumber ? `+${siteSettings.whatsappNumber.replace(/^\+/, '')}` : '+966500000000',
    areaServed: [
      { '@type': 'City', name: locale === 'ar' ? 'الأحساء' : 'Al Ahsa' },
      { '@type': 'City', name: locale === 'ar' ? 'الهفوف' : 'Hofuf' },
      { '@type': 'City', name: locale === 'ar' ? 'المبرز' : 'Mubarraz' },
      { '@type': 'City', name: locale === 'ar' ? 'الدمام' : 'Dammam' },
      { '@type': 'City', name: locale === 'ar' ? 'الخبر' : 'Khobar' },
      { '@type': 'AdministrativeArea', name: locale === 'ar' ? 'المنطقة الشرقية' : 'Eastern Province' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: locale === 'ar' ? 'الأحساء' : 'Al Ahsa',
      addressRegion: locale === 'ar' ? 'المنطقة الشرقية' : 'Eastern Province',
      addressCountry: 'SA',
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

export function buildBreadcrumbJsonLd(
  locale: Locale,
  items: Array<{ name: string; barePath: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: buildCanonicalUrl(localizePath(item.barePath, locale)),
    })),
  }
}

export function buildServiceJsonLd(
  locale: Locale,
  service: {
    name: string
    shortDescription: string
    slug: string
  },
) {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.shortDescription,
    url: buildCanonicalUrl(localizePath(`/services/${service.slug}`, locale)),
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: locale === 'ar' ? 'المنطقة الشرقية، المملكة العربية السعودية' : 'Eastern Province, Saudi Arabia',
    },
  }
}

export function buildFaqPageJsonLd(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}

export function buildArticleJsonLd(
  locale: Locale,
  post: {
    title: string
    excerpt: string
    slug: string
    publishedAt?: string | null
    updatedAt?: string | null
    authorName?: string | null
  },
) {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt || new Date().toISOString(),
    dateModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: post.authorName || (locale === 'ar' ? 'بيّورا' : 'Bayyora'),
    },
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    mainEntityOfPage: buildCanonicalUrl(localizePath(`/blog/${post.slug}`, locale)),
  }
}

export function buildCityServiceJsonLd(
  locale: Locale,
  city: {
    name: string
    slug: string
    region?: string | null
    heroHeadline: string
    heroSubheadline: string
    latitude?: number | null
    longitude?: number | null
  },
) {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: city.heroHeadline,
    description: city.heroSubheadline,
    url: buildCanonicalUrl(localizePath(`/city/${city.slug}`, locale)),
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name:
          city.region ||
          (locale === 'ar' ? 'المنطقة الشرقية' : 'Eastern Province'),
      },
      ...(typeof city.latitude === 'number' && typeof city.longitude === 'number'
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: city.latitude,
              longitude: city.longitude,
            },
          }
        : {}),
    },
  }
}

