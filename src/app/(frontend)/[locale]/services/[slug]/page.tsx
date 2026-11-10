import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import {
  getLocaleDirection,
  isValidLocale,
  localizePath,
  type Locale,
} from '@/i18n/config'
import {
  getAllPublishedServices,
  getLayoutGlobals,
  getPublicProjects,
  getServiceBySlug,
} from '@/lib/data-queries'
import { buildWhatsAppUrl } from '@/integrations/whatsapp'
import { buildPageMetadata } from '@/seo/metadata'
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
  JsonLd,
} from '@/seo/json-ld'
import { RisingLineSvg } from '@/components/domain/RisingLineSvg'
import { BeforeAfterSlider } from '@/components/domain/BeforeAfterSlider'
import { FaqAccordion } from '@/components/domain/FaqAccordion'
import { Button, WhatsAppIcon } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import {
  AnimatedReveal,
  AnimatedStaggerGrid,
  AnimatedStaggerItem,
} from '@/components/ui/AnimatedSection'

interface ServiceDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'ar'

  const [service, { siteSettings }] = await Promise.all([
    getServiceBySlug(slug, locale),
    getLayoutGlobals(locale),
  ])

  if (!service) {
    return {
      title: locale === 'ar' ? 'الخدمة غير موجودة | بيّورا' : 'Service Not Found | Bayyora',
      robots: { index: false, follow: false },
    }
  }

  return buildPageMetadata({
    locale,
    barePath: `/services/${slug}`,
    title: `${service.name} — ${service.benefitHeadline}`,
    description: service.shortDescription,
    seo: service.seo,
    defaultSuffix: siteSettings?.defaultMetaTitleSuffix || undefined,
  })
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale
  const isAr = locale === 'ar'
  const dir = getLocaleDirection(locale)

  const [service, { siteSettings, uiStrings }, allServices, projects] = await Promise.all([
    getServiceBySlug(slug, locale),
    getLayoutGlobals(locale),
    getAllPublishedServices(locale),
    getPublicProjects(locale),
  ])

  if (!service) {
    notFound()
  }

  const headings = uiStrings?.serviceTemplateHeadings
  const whatsappUrl = buildWhatsAppUrl(
    siteSettings?.whatsappNumber,
    service.whatsappPrefillMessage || siteSettings?.globalWhatsappPrefillMessage,
  )

  const fallbackCategoryMap: Record<string, string> = {
    'print-shop-design': 'brand-identity',
    'social-media': 'seasonal-campaigns',
    'video-animation': 'seasonal-campaigns',
    photography: 'brand-identity',
  }
  const linkedProjects = Array.isArray(
    (service as unknown as { beforeAfterProjects?: unknown[] }).beforeAfterProjects,
  )
    ? ((service as unknown as { beforeAfterProjects: Array<{ slug?: string }> })
        .beforeAfterProjects || [])
    : []
  const firstLinkedSlug =
    linkedProjects.length > 0 && typeof linkedProjects[0] === 'object' && linkedProjects[0]?.slug
      ? linkedProjects[0].slug
      : null

  const matchingProject =
    (firstLinkedSlug ? projects.find((p) => p.slug === firstLinkedSlug) : null) ||
    projects.find((p) => p.serviceCategory === service.slug) ||
    (fallbackCategoryMap[service.slug]
      ? projects.find((p) => p.serviceCategory === fallbackCategoryMap[service.slug])
      : null) ||
    projects[0] ||
    null

  const serviceFaqs = (service.serviceFaqs || []).map((f: { question?: string; answer?: string }, idx: number) => ({
    id: `${service.slug}-faq-${idx}`,
    question: f.question || '',
    answer: f.answer || '',
  }))

  const breadcrumbs = buildBreadcrumbJsonLd(locale, [
    { name: isAr ? 'الرئيسية' : 'Home', barePath: '/' },
    { name: isAr ? 'خدماتنا' : 'Services', barePath: '/services' },
    { name: service.name, barePath: `/services/${service.slug}` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd
        data={buildServiceJsonLd(locale, {
          name: service.name,
          shortDescription: service.shortDescription,
          slug: service.slug,
        })}
      />
      {serviceFaqs.length > 0 && <JsonLd data={buildFaqPageJsonLd(serviceFaqs)} />}

      {/* 1. Service Hero Section */}
      <section className="border-b border-subtle bg-canvas py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
          <nav
            aria-label={isAr ? 'مسار الصفحة' : 'Breadcrumb'}
            className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted"
          >
            <Link href={localizePath('/', locale)} className="hover:text-navy">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={localizePath('/services', locale)} className="hover:text-navy">
              {isAr ? 'خدماتنا' : 'Services'}
            </Link>
            <span>/</span>
            <span className="text-navy font-bold">{service.name}</span>
          </nav>

          <AnimatedReveal className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-terracotta text-white shadow-xs">
                <ServiceIcon name={service.iconName} className="h-6 w-6" />
              </span>
              <span className="rounded-full bg-canvas-sand px-3.5 py-1 text-xs font-bold text-navy">
                {service.name}
              </span>
              <RisingLineSvg dir={dir} variant="saffron" width={68} height={14} />
            </div>

            <h1 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              {service.benefitHeadline}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-ink sm:text-lg">
              {service.heroSubheadline || service.shortDescription}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Button href={whatsappUrl} variant="whatsapp" size="lg" external>
                <WhatsAppIcon />
                <span>{service.primaryCtaLabel}</span>
              </Button>
              <Button
                href={localizePath('/free-audit', locale)}
                variant="outline"
                size="lg"
              >
                {siteSettings?.globalAuditCtaText ||
                  (isAr ? 'اطلب تحليل مجاني' : 'Free mini audit')}
              </Button>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* 2. The Problem & 3. What You Get Deliverables */}
      <section className="border-b border-subtle bg-surface py-14 lg:py-20">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* The Problem Box */}
            <AnimatedReveal className="lg:col-span-5">
              <div className="card-interactive h-full rounded-2xl border border-subtle bg-canvas p-6 sm:p-8">
                <div className="mb-3 inline-flex items-center gap-2 text-danger">
                  <AlertTriangle aria-hidden="true" className="h-5 w-5" />
                  <span className="text-xs font-bold">
                    {isAr ? 'التحدي المعتاد' : 'The Common Challenge'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-navy sm:text-2xl">
                  {headings?.problemHeading ||
                    (isAr ? 'المشكلة اللي تتكرر في كثير من المحلات' : 'The Problem Many Shops Face')}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ink sm:text-base">
                  {service.problemStatement}
                </p>
              </div>
            </AnimatedReveal>

            {/* What You Get Deliverables Box */}
            <AnimatedReveal delay={0.08} className="lg:col-span-7">
              <div className="card-interactive h-full rounded-2xl border-2 border-oasis/30 bg-surface p-6 shadow-xs sm:p-8">
                <span className="text-xs font-bold text-oasis">
                  {isAr ? 'المخرجات الفعلية' : 'Concrete Deliverables'}
                </span>
                <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">
                  {headings?.deliverablesHeading ||
                    (isAr ? 'وش تحصل عليه بالضبط؟' : 'What You Get')}
                </h2>
                <ul className="mt-5 space-y-3.5 text-sm sm:text-base">
                  {(service.deliverables || []).map((item: { itemText?: string }, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-1 h-5 w-5 shrink-0 text-oasis"
                      />
                      <span className="font-medium text-ink">{item.itemText}</span>
                    </li>
                  ))}
                </ul>

                {service.packageInclusionNote && (
                  <div className="mt-6 rounded-xl bg-canvas-sand p-4 text-xs font-semibold text-navy sm:text-sm">
                    <strong className="block text-oasis">
                      {headings?.includedInPackagesHeading ||
                        (isAr ? 'موجودة في أي باقة؟' : 'Included In Which Packages?')}
                    </strong>
                    <span className="mt-1 block">{service.packageInclusionNote}</span>
                    <Link
                      href={localizePath('/packages', locale)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-oasis hover:underline"
                    >
                      {isAr
                        ? 'قارن الباقات الشهرية وباقات التأسيس ←'
                        : 'Compare Monthly Packages & Starter Bundles →'}
                    </Link>
                  </div>
                )}
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* 4. How It Works (3-Step Process) */}
      <section className="border-b border-subtle bg-canvas py-14 lg:py-20">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
          <AnimatedReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              {headings?.howItWorksHeading ||
                (isAr ? 'كيف نشتغل؟ (٣ خطوات واضحة)' : 'How It Works (3 Simple Steps)')}
            </h2>
          </AnimatedReveal>

          <AnimatedStaggerGrid className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {(service.processSteps || []).map((step: { stepTitle?: string; stepDescription?: string }, idx: number) => (
              <AnimatedStaggerItem key={idx} className="flex">
                <div className="card-interactive w-full rounded-2xl border border-subtle bg-surface p-6 shadow-xs">
                  <span className="font-mono text-3xl font-bold text-accent-terracotta">
                    0{idx + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-navy">{step.stepTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.stepDescription}
                  </p>
                </div>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStaggerGrid>
        </div>
      </section>

      {/* 5. Before & After Sample Comparison */}
      {matchingProject && (
        <section className="border-b border-subtle bg-surface py-14 lg:py-20">
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-center text-2xl font-bold text-navy sm:text-3xl">
              {headings?.beforeAfterHeading ||
                (isAr ? 'الفرق بين قبل وبعد الترتيب' : 'Before & After Comparison')}
            </h2>
            <BeforeAfterSlider
              locale={locale}
              project={{
                slug: matchingProject.slug,
                title: matchingProject.title,
                isSampleConcept: Boolean(matchingProject.isSampleConcept),
                cityTag: matchingProject.cityTag,
                summary: matchingProject.summary,
                beforeHeadline: matchingProject.beforeHeadline,
                afterHeadline: matchingProject.afterHeadline,
                beforeMetrics: matchingProject.beforeMetrics,
                afterMetrics: matchingProject.afterMetrics,
              }}
            />
          </div>
        </section>
      )}

      {/* 6. Service-Specific FAQs */}
      {serviceFaqs.length > 0 && (
        <section className="border-b border-subtle bg-canvas py-14 lg:py-20">
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-2xl font-bold text-navy sm:text-3xl">
              {headings?.faqHeading ||
                (isAr ? 'أسئلة شائعة عن الخدمة' : 'Frequently Asked Questions')}
            </h2>
            <FaqAccordion locale={locale} faqs={serviceFaqs} />
          </div>
        </section>
      )}

      {/* 7. Other Services Cross-Navigation */}
      <section className="border-b border-subtle bg-surface py-12 lg:py-16">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-lg font-bold text-navy sm:text-xl">
            {isAr ? 'استكشف خدمات بيّورا الأخرى:' : 'Explore Other Bayyora Services:'}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {allServices
              .filter((s) => s.slug !== service.slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={localizePath(`/services/${s.slug}`, locale)}
                  className="inline-flex items-center gap-2 rounded-xl border border-subtle bg-canvas px-4 py-2.5 text-xs font-bold text-navy transition-colors hover:bg-canvas-sand sm:text-sm"
                >
                  <ServiceIcon name={s.iconName} className="h-4 w-4 text-oasis" />
                  <span>{s.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* 8. Bottom Service Conversion CTA */}
      <section className="section-navy bg-navy py-14 text-white lg:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-3 flex justify-center">
            <RisingLineSvg dir={dir} variant="saffron" width={110} height={20} />
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            {isAr
              ? `جاهز تطوّر ${service.name} لمحلّك؟`
              : `Ready to Upgrade ${service.name} for Your Shop?`}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            {isAr
              ? 'تواصل معنا على الواتساب أو اطلب تحليلاً مجانيًا لمحلّك — ونرسل لك خطة واضحة خلال ٤٨ ساعة بدون أي التزام.'
              : 'Chat with our local team on WhatsApp or request your free mini audit—receive 3 actionable improvements within 48 hours.'}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <Button href={whatsappUrl} variant="whatsapp" size="lg" external>
              <WhatsAppIcon />
              <span>{service.primaryCtaLabel}</span>
            </Button>
            <Button href={localizePath('/free-audit', locale)} variant="primary" size="lg">
              {siteSettings?.globalAuditCtaText ||
                (isAr ? 'اطلب تحليل مجاني' : 'Free mini audit')}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
