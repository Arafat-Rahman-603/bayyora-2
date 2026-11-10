import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/i18n/config'
import {
  getAllPublishedPackages,
  getAllPublishedServices,
  getLayoutGlobals,
  getPageBySlug,
  getPublicProjects,
  getPublishedFaqs,
} from '@/lib/data-queries'
import { buildWhatsAppUrl } from '@/integrations/whatsapp'
import { buildPageMetadata } from '@/seo/metadata'
import { buildFaqPageJsonLd, JsonLd } from '@/seo/json-ld'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { PackageCardItem } from '@/components/domain/PackageCardGrid'
import type { PortfolioProjectCardItem } from '@/components/domain/PortfolioFilterGrid'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'ar'

  const [homePage, { siteSettings }] = await Promise.all([
    getPageBySlug('home', locale),
    getLayoutGlobals(locale),
  ])

  return buildPageMetadata({
    locale,
    barePath: '/',
    title:
      homePage?.title ||
      (locale === 'ar'
        ? 'بيّورا (Bayyora) | خطوة لفوق لمحلّك'
        : 'Bayyora (بيّورا) | One step up for your shop'),
    description:
      homePage?.subtitle ||
      siteSettings?.defaultMetaDescription ||
      'Bayyora Digital Marketing & Creative Agency',
    seo: homePage?.seo,
    defaultSuffix: siteSettings?.defaultMetaTitleSuffix || undefined,
  })
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale

  const [homePage, { siteSettings }, services, packages, projects, homeFaqs] =
    await Promise.all([
      getPageBySlug('home', locale),
      getLayoutGlobals(locale),
      getAllPublishedServices(locale),
      getAllPublishedPackages(locale),
      getPublicProjects(locale),
      getPublishedFaqs(locale, true),
    ])

  if (!homePage) {
    notFound()
  }

  const whatsappUrl = buildWhatsAppUrl(
    siteSettings?.whatsappNumber,
    homePage.whatsappPrefillMessage || siteSettings?.globalWhatsappPrefillMessage,
  )

  const mappedPackages: PackageCardItem[] = packages.map((p) => ({
    slug: p.slug,
    packageType: p.packageType,
    isHighlighted: p.isHighlighted,
    name: p.name,
    positioningSubline: p.positioningSubline,
    badgeText: p.badgeText,
    description: p.description,
    quantifiedDeliverables: p.quantifiedDeliverables,
    featureBullets: p.featureBullets,
    ctaLabel: p.ctaLabel,
    whatsappPrefillMessage: p.whatsappPrefillMessage,
    internalPriceSar:
      typeof (p as unknown as { internalPriceSar?: number }).internalPriceSar === 'number'
        ? (p as unknown as { internalPriceSar: number }).internalPriceSar
        : null,
  }))

  const mappedProjects: PortfolioProjectCardItem[] = projects.map((proj) => ({
    slug: proj.slug,
    title: proj.title,
    isSampleConcept: Boolean(proj.isSampleConcept),
    hasFullCaseStudyPage: proj.hasFullCaseStudyPage,
    serviceCategory: proj.serviceCategory,
    businessType: proj.businessType,
    cityTag: proj.cityTag,
    summary: proj.summary,
    beforeHeadline: proj.beforeHeadline,
    afterHeadline: proj.afterHeadline,
    beforeMetrics: proj.beforeMetrics,
    afterMetrics: proj.afterMetrics,
  }))

  const mappedFaqs = homeFaqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
  }))

  return (
    <>
      {mappedFaqs.length > 0 && <JsonLd data={buildFaqPageJsonLd(mappedFaqs)} />}

      <RenderBlocks
        blocks={(homePage.layout as unknown as Array<Record<string, unknown>>) || []}
        context={{
          locale,
          whatsappUrl,
          whatsappNumber: siteSettings?.whatsappNumber,
          publicPricingEnabled: Boolean(siteSettings?.publicPricingEnabled),
          services: services.map((s) => ({
            slug: s.slug,
            name: s.name,
            benefitHeadline: s.benefitHeadline,
            shortDescription: s.shortDescription,
            iconName: s.iconName,
          })),
          packages: mappedPackages,
          projects: mappedProjects,
          faqs: mappedFaqs,
        }}
      />
    </>
  )
}

