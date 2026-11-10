export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ar'

export function isValidLocale(value: string | undefined | null): value is Locale {
  return value === 'ar' || value === 'en'
}

export function getLocaleDirection(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

export function getHtmlLang(locale: Locale): string {
  return locale === 'ar' ? 'ar' : 'en'
}

export function getHreflangCode(locale: Locale): 'ar-SA' | 'en' {
  return locale === 'ar' ? 'ar-SA' : 'en'
}

/**
 * Formats an internal path (e.g. "/", "/services", "/services/brand-identity")
 * with the canonical locale prefix ('as-needed': Arabic at "/", English at "/en").
 * Strictly enforces trailingSlash: false.
 */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  const normalized = clean === '/' ? '/' : clean.replace(/\/+$/, '')

  if (locale === 'ar') {
    return normalized
  }
  return normalized === '/' ? '/en' : `/en${normalized}`
}

/**
 * Strips any leading /ar or /en locale prefix to return the bare route path.
 */
export function stripLocaleFromPath(pathname: string): {
  locale: Locale
  barePath: string
  hadExplicitDefaultLocale: boolean
} {
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    const rest = pathname.slice(3) || '/'
    return {
      locale: 'ar',
      barePath: rest === '/' ? '/' : rest.replace(/\/+$/, ''),
      hadExplicitDefaultLocale: true,
    }
  }
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const rest = pathname.slice(3) || '/'
    return {
      locale: 'en',
      barePath: rest === '/' ? '/' : rest.replace(/\/+$/, ''),
      hadExplicitDefaultLocale: false,
    }
  }
  return {
    locale: 'ar',
    barePath: pathname === '/' ? '/' : pathname.replace(/\/+$/, ''),
    hadExplicitDefaultLocale: false,
  }
}

export const SYSTEM_PAGE_SLUGS = [
  'home',
  'services',
  'packages',
  'our-work',
  'about',
  'free-audit',
  'contact',
  'faq',
  'privacy',
  'terms',
  'refunds',
] as const

export type SystemPageSlug = (typeof SYSTEM_PAGE_SLUGS)[number]

