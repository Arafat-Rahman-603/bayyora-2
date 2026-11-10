import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Building2, Calendar, CheckCircle2, MapPin } from 'lucide-react'
import {
  getLocaleDirection,
  isValidLocale,
  localizePath,
  type Locale,
} from '@/i18n/config'
import {
  getAllPublishedCities,
  getAllPublishedServices,
  getCityBySlug,
  getLayoutGlobals,
  getPublicProjects,
} from '@/lib/data-queries'
import { buildWhatsAppUrl } from '@/integrations/whatsapp'
import { buildPageMetadata } from '@/seo/metadata'
import { buildBreadcrumbJsonLd, buildCityServiceJsonLd, JsonLd } from '@/seo/json-ld'
import { RisingLineSvg } from '@/components/domain/RisingLineSvg'
import { Button, WhatsAppIcon } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { PortfolioFilterGrid } from '@/components/domain/PortfolioFilterGrid'

interface CityPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'ar'

  const [city, { siteSettings }] = await Promise.all([
    getCityBySlug(slug, locale),
    getLayoutGlobals(locale),
  ])

  if (!city) {
    return {
      title: locale === 'ar' ? 'المدينة غير موجودة | بيّورا' : 'City Not Found | Bayyora',
      robots: { index: false, follow: false },
    }
  }

  return buildPageMetadata({
    locale,
    barePath: `/city/${slug}`,
    title: city.heroHeadline,
    description: city.heroSubheadline,
    seo: city.seo,
    defaultSuffix: siteSettings?.defaultMetaTitleSuffix || undefined,
  })
}

export default async function CityLandingPage({ params }: CityPageProps) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale
  const isAr = locale === 'ar'
  const dir = getLocaleDirection(locale)

  const [city, { siteSettings, uiStrings }, services, allCities, projects] = await Promise.all([
    getCityBySlug(slug, locale),
    getLayoutGlobals(locale),
    getAllPublishedServices(locale),
    getAllPublishedCities(locale),
    getPublicProjects(locale),
  ])

  if (!city) {
    notFound()
  }

  const whatsappUrl = buildWhatsAppUrl(
    siteSettings?.whatsappNumber,
    city.whatsappPrefillMessage || siteSettings?.globalWhatsappPrefillMessage,
  )

  const breadcrumbs = buildBreadcrumbJsonLd(locale, [
    { name: isAr ? 'الرئيسية' : 'Home', barePath: '/' },
    { name: city.name, barePath: `/city/${city.slug}` },
  ])

  const cityServiceJsonLd = buildCityServiceJsonLd(locale, {
    name: city.name,
    slug: city.slug,
    region: city.region,
    heroHeadline: city.heroHeadline,
    heroSubheadline: city.heroSubheadline,
    latitude: city.latitude,
    longitude: city.longitude,
  })

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={cityServiceJsonLd} />

      {/* City Hero Section */}
      <section className="border-b border-subtle bg-canvas py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-oasis/10 px-3.5 py-1 text-xs font-bold text-oasis">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                <span>
                  {city.name} • {city.region}
                </span>
              </span>
              <RisingLineSvg dir={dir} variant="saffron" width={68} height={14} />
            </div>

            <h1 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              {city.heroHeadline}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink sm:text-lg">
              {city.heroSubheadline}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Button href={whatsappUrl} variant="whatsapp" size="lg" external>
                <WhatsAppIcon />
                <span>
                  {isAr ? `تواصل مع فريقنا في ${city.name}` : `Chat with our ${city.name} team`}
                </span>
              </Button>
              <Button
                href={localizePath('/free-audit', locale)}
                variant="primary"
                size="lg"
              >
                {isAr ? 'اطلب تحليل مجاني لمحلّك' : 'Request Free Shop Audit'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Authentic Local Market Narrative & Commercial Zones */}
      <section className="border-b border-subtle bg-surface py-14 lg:py-20">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-5">
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                {isAr
                  ? `نفهم طبيعة السوق والمحلات في ${city.name}`
                  : `Built for Local Businesses in ${city.name}`}
              </h2>
              <p className="text-base leading-relaxed text-ink">{city.localIntro}</p>

              {/* Merchant Challenges Solved */}
              <div className="pt-4 space-y-4">
                {(city.merchantChallenges || []).map((ch: { title?: string; description?: string }, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-subtle bg-canvas p-5"
                  >
                    <h3 className="flex items-center gap-2 text-base font-bold text-navy sm:text-lg">
                      <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-oasis shrink-0" />
                      <span>{ch.title}</span>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {ch.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Commercial Zones & On-Site Visit Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-subtle bg-canvas p-6 sm:p-7">
                <div className="flex items-center gap-2 text-oasis">
                  <Building2 aria-hidden="true" className="h-5 w-5" />
                  <h3 className="text-base font-bold text-navy">
                    {isAr
                      ? `أبرز المناطق والشوارع المخدومة في ${city.name}`
                      : `Commercial Corridors Served in ${city.name}`}
                  </h3>
                </div>
                <ul className="mt-4 space-y-3.5 text-sm">
                  {(city.commercialZones || []).map((z: { zoneName?: string; businessFocus?: string }, idx: number) => (
                    <li
                      key={idx}
                      className="rounded-xl border border-subtle bg-surface p-3.5"
                    >
                      <p className="font-bold text-navy">{z.zoneName}</p>
                      <p className="mt-1 text-xs text-muted">{z.businessFocus}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {city.canVisitInPerson && (
                <div className="section-navy rounded-2xl bg-navy p-6 text-white shadow-md sm:p-7">
                  <div className="flex items-center gap-2 text-accent">
                    <Calendar aria-hidden="true" className="h-5 w-5" />
                    <span className="text-xs font-bold">
                      {isAr ? 'زيارة ميدانية وتصوير' : 'On-Site Visit & Photography'}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold">
                    {city.visitSectionTitle ||
                      (isAr
                        ? `نمرّ عليك في محلّك بـ ${city.name}`
                        : `We Visit Your Shop in ${city.name}`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">
                    {city.visitSectionBody}
                  </p>
                  <Button
                    href={localizePath('/contact', locale)}
                    variant="primary"
                    size="sm"
                    className="mt-5 w-full"
                  >
                    {isAr ? 'احجز موعد زيارة لمحلّك' : 'Schedule an On-Site Visit'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Available in This City */}
      <section className="border-b border-subtle bg-canvas py-14 lg:py-20">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              {isAr
                ? `خدماتنا للمحلات والمشاريع في ${city.name}`
                : `Our Services for Shops in ${city.name}`}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <Link
                key={svc.slug}
                href={localizePath(`/services/${svc.slug}`, locale)}
                className="group rounded-2xl border border-subtle bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-terracotta text-white">
                    <ServiceIcon name={svc.iconName} className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold text-navy group-hover:text-oasis">
                    {svc.name}
                  </h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm">
                  {svc.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Concepts & Local Portfolio Preview */}
      {projects.length > 0 && (
        <section className="border-b border-subtle bg-surface py-14 lg:py-20">
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold text-oasis">
                  {isAr ? 'نماذج تطوير الأعمال' : 'Sample Concept Transformations'}
                </span>
                <h2 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
                  {isAr
                    ? `أمثلة عملية لتطوير المحلات في ${city.name}`
                    : `Sample Concepts for Businesses in ${city.name}`}
                </h2>
              </div>
              <Button href={localizePath('/our-work', locale)} variant="outline" size="sm">
                {isAr ? 'استعرض جميع النماذج (قبل وبعد)' : 'View All Before/After Concepts'}
              </Button>
            </div>
            <PortfolioFilterGrid
              locale={locale}
              projects={projects.slice(0, 3).map((proj) => ({
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
              }))}
              showFilters={false}
              uiLabels={uiStrings?.portfolioFilterUi}
            />
          </div>
        </section>
      )}

      {/* Other Eastern Province Cities */}
      <section className="bg-canvas py-12">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-sm font-bold text-muted">
            {isAr ? 'مدن أخرى نخدمها في المنطقة الشرقية:' : 'Other Eastern Province Cities We Serve:'}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {allCities
              .filter((c) => c.slug !== city.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={localizePath(`/city/${c.slug}`, locale)}
                  className="rounded-xl border border-subtle bg-canvas px-4 py-2 text-xs font-bold text-navy hover:bg-canvas-sand sm:text-sm"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
