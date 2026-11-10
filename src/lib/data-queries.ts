import type { Locale } from '@/i18n/config'
import type { PackageCardItem } from '@/components/domain/PackageCardGrid'

// Import all JSON data directly
import siteSettingsData from '@/data/globals/site-settings.json'
import headerNavData from '@/data/globals/header-nav.json'
import footerNavData from '@/data/globals/footer-nav.json'
import themeSettingsData from '@/data/globals/theme-settings.json'
import uiStringsData from '@/data/globals/ui-strings.json'

import packagesData from '@/data/packages/packages.json'
import servicesData from '@/data/services/services.json'
import citiesData from '@/data/cities/cities.json'
import projectsData from '@/data/projects/projects.json'
import faqsData from '@/data/faqs/faqs.json'
import postsData from '@/data/blog/posts.json'
import categoriesData from '@/data/blog/categories.json'
import redirectsData from '@/data/redirects.json'

// Page-specific JSON imports
import homePageData from '@/data/pages/home.json'
import servicesPageData from '@/data/pages/services.json'
import packagesPageData from '@/data/pages/packages.json'
import ourWorkPageData from '@/data/pages/our-work.json'
import aboutPageData from '@/data/pages/about.json'
import freeAuditPageData from '@/data/pages/free-audit.json'
import contactPageData from '@/data/pages/contact.json'
import faqPageData from '@/data/pages/faq.json'
import privacyPageData from '@/data/pages/privacy.json'
import termsPageData from '@/data/pages/terms.json'
import refundsPageData from '@/data/pages/refunds.json'

const pagesMap: Record<string, Record<string, unknown>> = {
  home: homePageData,
  services: servicesPageData,
  packages: packagesPageData,
  'our-work': ourWorkPageData,
  about: aboutPageData,
  'free-audit': freeAuditPageData,
  contact: contactPageData,
  faq: faqPageData,
  privacy: privacyPageData,
  terms: termsPageData,
  refunds: refundsPageData,
}

const categoriesMap: Record<string, { ar: { name: string }; en: { name: string } }> = {}
for (const cat of categoriesData) {
  categoriesMap[cat.slug] = cat
}

export interface ResolvedSiteSettings {
  publicPricingEnabled: boolean
  siteName: string
  siteTagline: string
  phoneNumber: string
  primaryPhoneE164: string
  whatsappNumber: string
  contactEmail: string
  businessEmail: string
  commercialRegistrationNumber: string
  headquartersAddress: string
  workingHours: string
  serviceAreasSummary: string
  globalAuditCtaText: string
  globalWhatsappPrefillMessage: string
  defaultMetaTitleSuffix: string
  defaultMetaDescription: string
  foundingClientOffer: {
    enabled: boolean
    badge: string
    title: string
    headline: string
    description: string
    slotsRemaining: number
    ctaLabel: string
  }
  announcementBar: {
    enabled: boolean
    text: string
    linkText: string
    linkUrl: string
    ctaLabel?: string
    ctaUrl?: string
  }
  googleMapsVerificationStatus: string
}

export interface LayoutGlobals {
  siteSettings: ResolvedSiteSettings
  headerNav: (typeof headerNavData)['ar']
  footerNav: (typeof footerNavData)['ar']
  themeSettings: typeof themeSettingsData
  uiStrings: (typeof uiStringsData)['ar']
}

/**
 * Fetches all 5 Globals (SiteSettings, HeaderNav, FooterNav, ThemeSettings, UIStrings)
 * for a given locale from JSON data.
 */
export async function getLayoutGlobals(locale: Locale): Promise<LayoutGlobals> {
  const loc = locale === 'en' ? 'en' : 'ar'

  const founding = siteSettingsData.foundingClientOffer[loc]
  const announcement = siteSettingsData.announcementBar[loc]

  const siteSettings: ResolvedSiteSettings = {
    publicPricingEnabled: siteSettingsData.publicPricingEnabled,
    siteName: siteSettingsData.siteName[loc],
    siteTagline: siteSettingsData.siteTagline[loc],
    phoneNumber: siteSettingsData.phoneNumber,
    primaryPhoneE164: siteSettingsData.primaryPhoneE164,
    whatsappNumber: siteSettingsData.whatsappNumber,
    contactEmail: siteSettingsData.contactEmail,
    businessEmail: siteSettingsData.businessEmail,
    commercialRegistrationNumber: siteSettingsData.commercialRegistrationNumber,
    headquartersAddress: siteSettingsData.headquartersAddress[loc],
    workingHours: siteSettingsData.workingHours[loc],
    serviceAreasSummary: siteSettingsData.serviceAreasSummary[loc],
    globalAuditCtaText: siteSettingsData.globalAuditCtaText[loc],
    globalWhatsappPrefillMessage: siteSettingsData.globalWhatsappPrefillMessage[loc],
    defaultMetaTitleSuffix: siteSettingsData.defaultMetaTitleSuffix[loc],
    defaultMetaDescription: siteSettingsData.defaultMetaDescription[loc],
    foundingClientOffer: {
      enabled: founding.enabled,
      badge: founding.badge,
      title: founding.title,
      headline: founding.title,
      description: founding.description,
      slotsRemaining: founding.slotsRemaining,
      ctaLabel: founding.ctaLabel,
    },
    announcementBar: {
      enabled: announcement.enabled,
      text: announcement.text,
      linkText: announcement.linkText,
      linkUrl: announcement.linkUrl,
      ctaLabel: announcement.linkText,
      ctaUrl: announcement.linkUrl,
    },
    googleMapsVerificationStatus: siteSettingsData.googleMapsVerificationStatus,
  }

  const headerNav = headerNavData[loc]
  const footerNav = footerNavData[loc]
  const themeSettings = themeSettingsData
  const uiStrings = uiStringsData[loc]

  return {
    siteSettings,
    headerNav,
    footerNav,
    themeSettings,
    uiStrings,
  }
}

/**
 * Fetches a single Page by slug from JSON data.
 */
export async function getPageBySlug(slug: string, locale: Locale) {
  const pageRaw = pagesMap[slug]
  if (!pageRaw) {
    return null
  }

  const loc = locale === 'en' ? 'en' : 'ar'
  const localized = (pageRaw[loc] as Record<string, unknown>) || {}

  return {
    id: slug,
    slug: pageRaw.slug as string,
    isLegalPage: Boolean(pageRaw.isLegalPage),
    updatedAt: (pageRaw.updatedAt as string) || '2026-03-01T00:00:00.000Z',
    title: (localized.title as string) || '',
    subtitle: (localized.subtitle as string) || '',
    legalBodyMarkdown: (localized.legalBodyMarkdown as string) || '',
    whatsappPrefillMessage: (localized.whatsappPrefillMessage as string) || '',
    seo: {
      metaTitle: ((localized.seo as Record<string, unknown>)?.metaTitle as string) || '',
      metaDescription: ((localized.seo as Record<string, unknown>)?.metaDescription as string) || '',
      noIndex: Boolean((localized.seo as Record<string, unknown>)?.noIndex),
    },
    layout: (localized.layout as Array<Record<string, unknown>>) || [],
    _status: 'published' as const,
    translationStatus: 'published' as const,
  }
}

/**
 * Fetches all published Services ordered by displayOrder (1..9+).
 */
export async function getAllPublishedServices(locale: Locale) {
  const loc = locale === 'en' ? 'en' : 'ar'

  const sorted = [...servicesData].sort((a, b) => a.displayOrder - b.displayOrder)

  return sorted.map((svc) => {
    const localized = svc[loc]
    return {
      id: svc.slug,
      slug: svc.slug,
      displayOrder: svc.displayOrder,
      iconName: svc.iconName,
      name: localized.name,
      benefitHeadline: localized.benefitHeadline,
      shortDescription: localized.shortDescription,
      heroSubheadline: localized.heroSubheadline,
      problemStatement: localized.problemStatement,
      deliverables: localized.deliverables,
      packageInclusionNote: localized.packageInclusionNote,
      processSteps: localized.processSteps,
      serviceFaqs: localized.serviceFaqs,
      primaryCtaLabel: localized.primaryCtaLabel,
      whatsappPrefillMessage: localized.whatsappPrefillMessage,
      seo: {
        metaTitle: localized.seo?.metaTitle || '',
        metaDescription: localized.seo?.metaDescription || '',
        noIndex: false as boolean,
      },
      _status: 'published' as const,
      translationStatus: 'published' as const,
      updatedAt: '2026-03-01T00:00:00.000Z',
    }
  })
}

/**
 * Fetches a single Service by slug.
 */
export async function getServiceBySlug(slug: string, locale: Locale) {
  const services = await getAllPublishedServices(locale)
  return services.find((s) => s.slug === slug) || null
}

/**
 * Fetches all published & visible Packages ordered by displayOrder.
 */
export async function getAllPublishedPackages(locale: Locale): Promise<PackageCardItem[]> {
  const loc = locale === 'en' ? 'en' : 'ar'

  const visiblePackages = packagesData.filter((p) => p.isVisible)
  const sorted = [...visiblePackages].sort((a, b) => a.displayOrder - b.displayOrder)

  return sorted.map((pkg): PackageCardItem => {
    const localized = pkg[loc]
    return {
      slug: pkg.slug,
      packageType: pkg.packageType as 'monthly' | 'one_time_bundle',
      isHighlighted: pkg.isHighlighted,
      internalPriceSar: typeof pkg.internalPriceSar === 'number' ? pkg.internalPriceSar : null,
      name: localized.name,
      positioningSubline: localized.positioningSubline,
      badgeText: localized.badgeText,
      description: localized.description,
      quantifiedDeliverables: localized.quantifiedDeliverables,
      featureBullets: localized.featureBullets,
      ctaLabel: localized.ctaLabel,
      whatsappPrefillMessage: localized.whatsappPrefillMessage,
    }
  })
}

/**
 * Fetches all public Portfolio & Sample Concept items.
 * Enforces BR-010: Unverified client projects (like Dawair with clientPermissionVerified: false) are excluded.
 */
export async function getPublicProjects(locale: Locale) {
  const loc = locale === 'en' ? 'en' : 'ar'

  const publicItems = projectsData.filter(
    (proj) =>
      proj._status === 'published' &&
      (proj.isSampleConcept === true || proj.clientPermissionVerified === true),
  )

  return publicItems.map((proj) => {
    const localized = proj[loc]
    return {
      id: proj.slug,
      slug: proj.slug,
      isSampleConcept: proj.isSampleConcept,
      clientPermissionVerified: proj.clientPermissionVerified,
      hasFullCaseStudyPage: proj.hasFullCaseStudyPage,
      serviceCategory: proj.serviceCategory,
      businessType: proj.businessType,
      title: localized.title,
      cityTag: localized.cityTag,
      summary: localized.summary,
      beforeHeadline: localized.beforeHeadline,
      afterHeadline: localized.afterHeadline,
      beforeMetrics: localized.beforeMetrics,
      afterMetrics: localized.afterMetrics,
      challengeSummary: localized.challengeSummary,
      solutionSummary: localized.solutionSummary,
      verifiedOutcomeSummary: localized.verifiedOutcomeSummary,
      seo: {
        metaTitle: localized.seo?.metaTitle || '',
        metaDescription: localized.seo?.metaDescription || '',
        noIndex: false as boolean,
      },
      _status: proj._status,
      updatedAt: '2026-03-01T00:00:00.000Z',
    }
  })
}

/**
 * Fetches a single Case Study Project by slug (e.g. /our-work/dawair).
 * Returns null unless the project is published AND (isSampleConcept || clientPermissionVerified).
 */
export async function getCaseStudyProjectBySlug(slug: string, locale: Locale) {
  const loc = locale === 'en' ? 'en' : 'ar'

  const project = projectsData.find((p) => p.slug === slug)
  if (!project) {
    return null
  }

  // Permission gate (BR-010): Dawair or any unpublished/unverified case study returns null -> 404
  if (
    project._status !== 'published' ||
    !project.hasFullCaseStudyPage ||
    (!project.isSampleConcept && !project.clientPermissionVerified)
  ) {
    return null
  }

  const localized = project[loc]
  return {
    id: project.slug,
    slug: project.slug,
    isSampleConcept: project.isSampleConcept,
    clientPermissionVerified: project.clientPermissionVerified,
    hasFullCaseStudyPage: project.hasFullCaseStudyPage,
    serviceCategory: project.serviceCategory,
    businessType: project.businessType,
    title: localized.title,
    cityTag: localized.cityTag,
    summary: localized.summary,
    beforeHeadline: localized.beforeHeadline,
    afterHeadline: localized.afterHeadline,
    beforeMetrics: localized.beforeMetrics,
    afterMetrics: localized.afterMetrics,
    challengeSummary: localized.challengeSummary,
    solutionSummary: localized.solutionSummary,
    verifiedOutcomeSummary: localized.verifiedOutcomeSummary,
    seo: {
      metaTitle: localized.seo?.metaTitle || '',
      metaDescription: localized.seo?.metaDescription || '',
      noIndex: false as boolean,
    },
    _status: project._status,
    updatedAt: '2026-03-01T00:00:00.000Z',
  }
}

/**
 * Fetches all published Cities ordered by displayOrder.
 */
export async function getAllPublishedCities(locale: Locale) {
  const loc = locale === 'en' ? 'en' : 'ar'

  const sorted = [...citiesData].sort((a, b) => a.displayOrder - b.displayOrder)

  return sorted.map((city) => {
    const localized = city[loc]
    return {
      id: city.slug,
      slug: city.slug,
      displayOrder: city.displayOrder,
      canVisitInPerson: city.canVisitInPerson,
      latitude: city.latitude,
      longitude: city.longitude,
      name: localized.name,
      region: localized.region,
      heroHeadline: localized.heroHeadline,
      heroSubheadline: localized.heroSubheadline,
      localIntro: localized.localIntro,
      commercialZones: localized.commercialZones,
      merchantChallenges: localized.merchantChallenges,
      visitSectionTitle: localized.visitSectionTitle,
      visitSectionBody: localized.visitSectionBody,
      whatsappPrefillMessage: localized.whatsappPrefillMessage,
      seo: {
        metaTitle: localized.seo?.metaTitle || '',
        metaDescription: localized.seo?.metaDescription || '',
        noIndex: false as boolean,
      },
      _status: 'published' as const,
      translationStatus: 'published' as const,
      updatedAt: '2026-03-01T00:00:00.000Z',
    }
  })
}

/**
 * Fetches a single City by slug.
 */
export async function getCityBySlug(slug: string, locale: Locale) {
  const cities = await getAllPublishedCities(locale)
  return cities.find((c) => c.slug === slug) || null
}

/**
 * Fetches all published FAQs ordered by displayOrder.
 */
export async function getPublishedFaqs(locale: Locale, homeQuickOnly = false) {
  const loc = locale === 'en' ? 'en' : 'ar'

  let filtered = [...faqsData]
  if (homeQuickOnly) {
    filtered = filtered.filter((f) => f.showOnHomeQuickFaq)
  }

  const sorted = filtered.sort((a, b) => a.displayOrder - b.displayOrder)

  return sorted.map((faq) => {
    const localized = faq[loc]
    return {
      id: `faq-${faq.displayOrder}`,
      displayOrder: faq.displayOrder,
      category: faq.category,
      showOnHomeQuickFaq: faq.showOnHomeQuickFaq,
      question: localized.question,
      answer: localized.answer,
      _status: 'published' as const,
      translationStatus: 'published' as const,
    }
  })
}

/**
 * Fetches all published Blog Posts ordered by publishedAt descending.
 */
export async function getPublishedPosts(locale: Locale) {
  const loc = locale === 'en' ? 'en' : 'ar'

  const sorted = [...postsData].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  return sorted.map((post) => {
    const localized = post[loc]
    return {
      id: post.slug,
      slug: post.slug,
      categorySlug: post.categorySlug,
      categories: [
        {
          id: post.categorySlug,
          slug: post.categorySlug,
          name: categoriesMap[post.categorySlug]?.[loc]?.name || post.categorySlug,
        },
      ],
      publishedAt: post.publishedAt,
      readingTimeMinutes: post.readingTimeMinutes,
      title: localized.title,
      excerpt: localized.excerpt,
      bodyContent: localized.bodyContent,
      keyTakeaways: localized.keyTakeaways,
      authorName: localized.authorName,
      seo: {
        metaTitle: localized.seo?.metaTitle || '',
        metaDescription: localized.seo?.metaDescription || '',
        noIndex: false as boolean,
      },
      _status: 'published' as const,
      translationStatus: 'published' as const,
      updatedAt: post.publishedAt,
    }
  })
}

/**
 * Fetches a single Blog Post by slug.
 */
export async function getPostBySlug(slug: string, locale: Locale) {
  const posts = await getPublishedPosts(locale)
  return posts.find((p) => p.slug === slug) || null
}

/**
 * Resolves 301/302 Redirects.
 */
export async function findActiveRedirect(pathname: string) {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  const activeRedirects = redirectsData.filter((r) => r.isActive)
  return activeRedirects.find((r) => r.fromPath === normalized) || null
}
