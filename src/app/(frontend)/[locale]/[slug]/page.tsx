import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { Calendar, CheckCircle2, Clock, MapPin, ShieldCheck } from 'lucide-react'
import {
  getLocaleDirection,
  isValidLocale,
  localizePath,
  type Locale,
} from '@/i18n/config'
import {
  findActiveRedirect,
  getAllPublishedCities,
  getAllPublishedPackages,
  getAllPublishedServices,
  getLayoutGlobals,
  getPageBySlug,
  getPublicProjects,
  getPublishedFaqs,
} from '@/lib/data-queries'
import { buildWhatsAppUrl } from '@/integrations/whatsapp'
import { buildPageMetadata } from '@/seo/metadata'
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, JsonLd } from '@/seo/json-ld'
import { RisingLineSvg } from '@/components/domain/RisingLineSvg'
import { Button, WhatsAppIcon } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { PackageCardGrid, type PackageCardItem } from '@/components/domain/PackageCardGrid'
import { PortfolioFilterGrid, type PortfolioProjectCardItem } from '@/components/domain/PortfolioFilterGrid'
import { BeforeAfterSlider } from '@/components/domain/BeforeAfterSlider'
import { FaqAccordion } from '@/components/domain/FaqAccordion'
import { FreeAuditForm } from '@/components/forms/FreeAuditForm'
import { ContactForm } from '@/components/forms/ContactForm'
import {
  AnimatedReveal,
  AnimatedStaggerGrid,
  AnimatedStaggerItem,
} from '@/components/ui/AnimatedSection'
import { RenderBlocks } from '@/blocks/RenderBlocks'

interface DynamicPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'ar'

  if (slug === 'home') {
    return {}
  }

  const [pageDoc, { siteSettings }] = await Promise.all([
    getPageBySlug(slug, locale),
    getLayoutGlobals(locale),
  ])

  if (!pageDoc) {
    return {
      title: locale === 'ar' ? 'الصفحة غير موجودة | بيّورا' : 'Page Not Found | Bayyora',
      robots: { index: false, follow: false },
    }
  }

  return buildPageMetadata({
    locale,
    barePath: `/${slug}`,
    title: pageDoc.title,
    description: pageDoc.subtitle || siteSettings?.defaultMetaDescription || '',
    seo: pageDoc.seo,
    defaultSuffix: siteSettings?.defaultMetaTitleSuffix || undefined,
  })
}

export default async function DynamicCmsPage({ params }: DynamicPageProps) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale
  const isAr = locale === 'ar'
  const dir = getLocaleDirection(locale)

  // Canonical Homepage Guard (AUD-009): Never serve duplicate homepage at /home or /en/home
  if (slug === 'home') {
    permanentRedirect(isAr ? '/' : '/en')
  }

  const pageDoc = await getPageBySlug(slug, locale)

  // Check CMS Redirects table before triggering 404 (AUD-004)
  if (!pageDoc) {
    const candidatePath = isAr ? `/${slug}` : `/en/${slug}`
    const redirectEntry =
      (await findActiveRedirect(candidatePath)) || (await findActiveRedirect(`/${slug}`))
    if (redirectEntry) {
      const target = localizePath(redirectEntry.toPath, locale)
      if (redirectEntry.statusCode === '301') {
        permanentRedirect(target)
      } else {
        redirect(target)
      }
    }
    notFound()
  }

  const [{ siteSettings, uiStrings }, services, packages, projects, faqs, cities] =
    await Promise.all([
      getLayoutGlobals(locale),
      getAllPublishedServices(locale),
      getAllPublishedPackages(locale),
      getPublicProjects(locale),
      getPublishedFaqs(locale, false),
      getAllPublishedCities(locale),
    ])

  const whatsappUrl = buildWhatsAppUrl(
    siteSettings?.whatsappNumber,
    pageDoc.whatsappPrefillMessage || siteSettings?.globalWhatsappPrefillMessage,
  )

  const breadcrumbs = buildBreadcrumbJsonLd(locale, [
    { name: isAr ? 'الرئيسية' : 'Home', barePath: '/' },
    { name: pageDoc.title, barePath: `/${slug}` },
  ])

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

  const mappedFaqs = faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
  }))

  const monthlyPackages = mappedPackages.filter((p) => p.packageType === 'monthly')
  const starterBundles = mappedPackages.filter((p) => p.packageType === 'one_time_bundle')

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {slug === 'faq' && mappedFaqs.length > 0 && (
        <JsonLd data={buildFaqPageJsonLd(mappedFaqs)} />
      )}

      {/* Page Hero Banner */}
      <section className="border-b border-subtle bg-canvas py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
          <AnimatedReveal className="mx-auto max-w-3xl text-center">
            <div className="mb-3 flex justify-center">
              <RisingLineSvg dir={dir} variant="saffron" width={96} height={18} />
            </div>
            <h1 className="text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
              {pageDoc.title}
            </h1>
            {pageDoc.subtitle && (
              <p className="mt-4 text-base leading-relaxed text-ink sm:text-lg">
                {pageDoc.subtitle}
              </p>
            )}
          </AnimatedReveal>
        </div>
      </section>

      {/* 1. SERVICES HUB (/services) */}
      {slug === 'services' && (
        <section className="py-14 lg:py-20 space-y-16">
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <AnimatedStaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((svc, idx) => (
                <AnimatedStaggerItem key={svc.slug} className="flex">
                  <article className="card-interactive flex w-full flex-col justify-between rounded-2xl border border-subtle bg-surface p-6 shadow-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-terracotta text-white">
                          <ServiceIcon name={svc.iconName} className="h-5 w-5" />
                        </span>
                        <span className="font-mono text-xs font-bold text-muted">
                          0{idx + 1}
                        </span>
                      </div>
                      <h2 className="mt-4 text-xl font-bold text-navy">{svc.name}</h2>
                      <p className="mt-1 text-xs font-bold text-oasis">{svc.benefitHeadline}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {svc.shortDescription}
                      </p>
                      <ul className="mt-4 space-y-2 border-t border-subtle pt-4 text-xs text-ink sm:text-sm">
                        {(svc.deliverables || []).slice(0, 3).map((d: { itemText?: string }, dIdx: number) => (
                          <li key={dIdx} className="flex items-start gap-2">
                            <CheckCircle2
                              aria-hidden="true"
                              className="mt-0.5 h-4 w-4 shrink-0 text-oasis"
                            />
                            <span>{d.itemText}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-subtle flex items-center justify-between gap-2">
                      <Button
                        href={localizePath(`/services/${svc.slug}`, locale)}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        {isAr ? `تفاصيل ${svc.name}` : `Explore ${svc.name}`}
                      </Button>
                    </div>
                  </article>
                </AnimatedStaggerItem>
              ))}
            </AnimatedStaggerGrid>
          </div>

          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <div className="section-navy rounded-3xl bg-navy p-8 text-center text-white shadow-xl sm:p-12">
              <div className="mb-3 flex justify-center">
                <RisingLineSvg dir={dir} variant="saffron" width={110} height={20} />
              </div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                {isAr
                  ? 'تفضّل خدمة مفردة أو باقة شهرية تجمع كل احتياجات محلّك؟'
                  : 'Need a Single Service or an All-in-One Monthly Package?'}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                {isAr
                  ? 'يمكنك طلب أي خدمة من خدماتنا الـ ٩ بشكل منفرد، أو اختيار باقة شهرية (بداية • نمو • ريادة) توفّر عليك الوقت والتكلفة.'
                  : 'You can request any of our 9 services individually, or choose a monthly package (Bidaya • Numow • Riyada) that bundles everything under one local team.'}
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <Button href={localizePath('/packages', locale)} variant="primary" size="lg">
                  {isAr ? 'استعرض الباقات الشهرية والتأسيسية' : 'Compare Packages & Starter Bundles'}
                </Button>
                <Button href={localizePath('/free-audit', locale)} variant="secondary" size="lg">
                  {isAr ? 'اطلب تحليل مجاني لمحلّك' : 'Request Free Mini Audit'}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. PACKAGES PAGE (/packages) */}
      {slug === 'packages' && (
        <section className="py-14 lg:py-20 space-y-20">
          {siteSettings?.foundingClientOffer?.enabled &&
            siteSettings.foundingClientOffer.headline && (
              <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-accent bg-surface p-5 shadow-xs sm:flex-row sm:px-8">
                  <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-start">
                    <span className="inline-flex shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold text-on-accent">
                      {isAr ? 'عرض التأسيس' : 'Founding Offer'}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-navy sm:text-base">
                        {siteSettings.foundingClientOffer.headline}
                      </p>
                      {siteSettings.foundingClientOffer.description && (
                        <p className="mt-1 text-xs text-muted sm:text-sm">
                          {siteSettings.foundingClientOffer.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    href={localizePath('/free-audit', locale)}
                    variant="primary"
                    size="sm"
                    className="shrink-0"
                  >
                    {isAr ? 'احجز مقعدك الآن' : 'Claim Founding Spot'}
                  </Button>
                </div>
              </div>
            )}

          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                {isAr
                  ? 'باقات النمو الشهرية (بداية • نمو • ريادة)'
                  : 'Monthly Growth Packages (Bidaya • Numow • Riyada)'}
              </h2>
            </div>

            <PackageCardGrid
              locale={locale}
              packages={monthlyPackages}
              publicPricingEnabled={Boolean(siteSettings?.publicPricingEnabled)}
              whatsappNumber={siteSettings?.whatsappNumber}
            />
          </div>

          {starterBundles.length > 0 && (
            <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <span className="text-xs font-bold text-oasis">
                  {isAr ? 'باقات التأسيس لمرة واحدة' : 'One-Time Starter Bundles'}
                </span>
                <h2 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
                  {isAr
                    ? 'تفتح محل جديد أو تجدّد واجهتك؟ باقات لمرة واحدة'
                    : 'Opening a new shop or refreshing your look? One-time bundles'}
                </h2>
              </div>

              <div className="mx-auto max-w-5xl">
                <PackageCardGrid
                  locale={locale}
                  packages={starterBundles}
                  publicPricingEnabled={Boolean(siteSettings?.publicPricingEnabled)}
                  whatsappNumber={siteSettings?.whatsappNumber}
                />
              </div>
            </div>
          )}

          {/* Single Services Callout + Ad Spend & VAT Clarity (BR-012) */}
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-subtle bg-surface p-6 shadow-xs sm:p-8">
                <span className="text-xs font-bold text-oasis">
                  {isAr ? 'خدمات مفردة حسب الطلب' : 'Single Services À La Carte'}
                </span>
                <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">
                  {isAr
                    ? 'تحتاج خدمة واحدة فقط بدون باقة شهرية؟'
                    : 'Need Just One Specific Service?'}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink sm:text-base">
                  {isAr
                    ? 'سواء كنت تحتاج تصميم شعار وهوية فقط، أو لوحة ومنيو للمحل، أو موقع إلكتروني، أو جلسة تصوير ميدانية — تقدر تطلب أي خدمة بشكل مستقل وبنطاق عمل واضح.'
                    : 'Whether you only need a logo and brand identity, storefront signage and menu design, a website, or an on-site photography session—you can request any of our 9 services individually.'}
                </p>
                <div className="mt-5">
                  <Button href={localizePath('/services', locale)} variant="secondary" size="sm">
                    {isAr ? 'استعرض جميع الخدمات الـ ٩' : 'Browse All 9 Individual Services'}
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-subtle bg-canvas-sand p-6 shadow-xs sm:p-8">
                <h2 className="text-xl font-bold text-navy sm:text-2xl">
                  {isAr
                    ? 'توضيح ميزانية الإعلانات الممولة والضريبة'
                    : 'Ad Spend Separation & VAT Clarity'}
                </h2>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-oasis"
                    />
                    <span>
                      {isAr
                        ? 'ميزانية الإعلانات الممولة (Ad Spend) تُدفع مباشرة لمنصات الإعلان (سناب شات، تيك توك، جوجل، إنستقرام) من بطاقتك الخاصة وباسم محلّك، وهي مستقلة عن رسوم إدارة الباقة.'
                        : 'Paid media ad spend is billed directly to your own card by Google, Snapchat, TikTok, or Meta—100% separate from Bayyora’s management retainer.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-oasis"
                    />
                    <span>
                      {isAr
                        ? 'تُصدر الفواتير الرسمية بالريال السعودي، وتُضاف ضريبة القيمة المضافة (١٥٪) حسب الأنظمة الضريبية في المملكة العربية السعودية.'
                        : 'All official invoices are issued in Saudi Riyals (SAR), with 15% VAT applied in accordance with ZATCA regulations in Saudi Arabia.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3 Simple Steps: How Quotes Work */}
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-subtle bg-surface p-6 sm:p-10">
              <div className="mx-auto max-w-2xl text-center">
                <span className="text-xs font-bold text-oasis">
                  {isAr ? 'آلية التسعير والبدء' : 'How Quotes & Onboarding Work'}
                </span>
                <h2 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">
                  {isAr
                    ? 'كيف نحدّد الباقة والتسعيرة المناسبة لمحلّك؟'
                    : 'How We Scope the Right Plan for Your Shop'}
                </h2>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-canvas p-5">
                  <span className="font-mono text-2xl font-bold text-accent-terracotta">01</span>
                  <h3 className="mt-2 text-base font-bold text-navy">
                    {isAr ? 'نراجع وضع محلّك الحالي مجانًا' : 'Free Shop & Digital Review'}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">
                    {isAr
                      ? 'نفحص حضورك في خرائط جوجل والسوشال ميديا ونفهم أهدافك قبل اقتراح أي باقة.'
                      : 'We inspect your Google Maps, social accounts, and goals before recommending any tier.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-canvas p-5">
                  <span className="font-mono text-2xl font-bold text-accent-terracotta">02</span>
                  <h3 className="mt-2 text-base font-bold text-navy">
                    {isAr ? 'نرسل لك عرض سعر واضح بالمخرجات' : 'Clear Written Scope & Quote'}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">
                    {isAr
                      ? 'تستلم تفاصيل المخرجات الشهرية بالأرقام والتسعيرة المناسبة لحجم نشاطك بدون أي رسوم مخفية.'
                      : 'You receive a transparent scope with exact monthly deliverables and pricing tailored to your shop.'}
                  </p>
                </div>
                <div className="rounded-2xl bg-canvas p-5">
                  <span className="font-mono text-2xl font-bold text-accent-terracotta">03</span>
                  <h3 className="mt-2 text-base font-bold text-navy">
                    {isAr ? 'ننطلق خلال ٤٨ ساعة بملكية كاملة لك' : 'Launch in 48 Hours with 100% Ownership'}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">
                    {isAr
                      ? 'نبدأ التنفيذ وتبقى كل الحسابات والمواقع والملفات المفتوحة باسمك وتحت إدارتك دائمًا.'
                      : 'We kick off execution within 48 hours while every account, domain, and source file stays in your name.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Package & Payment FAQs */}
          {mappedFaqs.filter(
            (f) => f.category === 'pricing_packages' || f.category === 'accounts_payment',
          ).length > 0 && (
            <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                  {isAr
                    ? 'إجابات واضحة حول الباقات والعقود والملكية'
                    : 'Common Questions About Packages, Contracts & Ownership'}
                </h2>
              </div>
              <FaqAccordion
                locale={locale}
                faqs={mappedFaqs.filter(
                  (f) => f.category === 'pricing_packages' || f.category === 'accounts_payment',
                )}
              />
            </div>
          )}
        </section>
      )}

      {/* 3. OUR WORK PORTFOLIO PAGE (/our-work) */}
      {slug === 'our-work' && (
        <section className="py-14 lg:py-20 space-y-14">
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            {mappedProjects[0] && (
              <div className="mb-12">
                <h2 className="mb-5 text-xl font-bold text-navy sm:text-2xl">
                  {isAr
                    ? 'مقارنة تفاعلية: قبل وبعد ترتيب الحضور الرقمي'
                    : 'Interactive Comparison: Before & After Digital Setup'}
                </h2>
                <BeforeAfterSlider
                  locale={locale}
                  project={mappedProjects[0]}
                  sampleBadgeLabel={
                    uiStrings?.portfolioFilterUi?.sampleConceptBadgeLabel || undefined
                  }
                />
              </div>
            )}

            <h2 className="mb-5 text-xl font-bold text-navy sm:text-2xl">
              {isAr
                ? 'استكشف النماذج حسب الخدمة ونوع النشاط'
                : 'Browse Examples by Service & Business Type'}
            </h2>
            <PortfolioFilterGrid
              locale={locale}
              projects={mappedProjects}
              showFilters
              uiLabels={uiStrings?.portfolioFilterUi}
            />

            {/* Approved Dawair Teaser Card (BR-010: No unapproved metrics/visuals, clear Coming Soon badge) */}
            <div className="mt-12 rounded-2xl border-2 border-dashed border-oasis/40 bg-surface p-6 shadow-xs sm:p-8">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="inline-flex items-center gap-2">
                    <span className="rounded-full bg-oasis/10 px-3 py-1 text-xs font-bold text-oasis">
                      {isAr
                        ? 'قريبًا (بعد إذن العميل)'
                        : 'Coming Soon (With Client Permission)'}
                    </span>
                    <span className="text-xs font-semibold text-muted">
                      {isAr ? 'الهفوف — الأحساء' : 'Hofuf — Al Ahsa'}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-navy sm:text-xl">
                    {isAr
                      ? 'عميلنا الأول: مطعم دواير (Dawair) في الهفوف — موقع إلكتروني + إدارة حسابات التواصل'
                      : 'First Client: Dawair Restaurant in Hofuf — Website + Social Media Management'}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {isAr
                      ? 'نلتزم في بيّورا بعدم نشر تفاصيل أو صور أي مشروع فعلي إلا بعد اكتمال الإطلاق والحصول على موافقة العميل الخطية. ستُنشر دراسة الحالة الكاملة قريبًا بإذن العميل.'
                      : 'At Bayyora, we never publish client visuals or metrics without explicit written permission. The full Dawair case study will be published soon with client approval.'}
                  </p>
                </div>
                <Button
                  href={localizePath('/free-audit', locale)}
                  variant="primary"
                  size="sm"
                  className="shrink-0"
                >
                  {isAr ? 'اطلب تحليل مجاني لمحلّك' : 'Request Free Shop Audit'}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. ABOUT PAGE (/about) */}
      {slug === 'about' && (
        <section className="py-14 lg:py-20 space-y-16">
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-5">
                <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                  {isAr
                    ? 'ليش أسّسنا بيّورا (خطوة لفوق)؟'
                    : 'Why We Built Bayyora ("One step up")'}
                </h2>
                <p className="text-base leading-relaxed text-ink">
                  {isAr
                    ? 'في الأحساء والمنطقة الشرقية، شفنا مئات المحلات والمطاعم والكافيهات والصيدليات اللي تقدّم جودة ممتازة وتخدم زبائنها بأمانة، لكنها مظلومة تسويقيًا: إما بسبب التعامل مع مستقلين متفرقين بدون خطة، أو وكالات بعيدة ما تزور المحل ولا تعرف طبيعة أهل المنطقة.'
                    : 'Across Al Ahsa and the Eastern Province, we saw hundreds of local shops, restaurants, cafes, and pharmacies offering outstanding quality while struggling with fragmented marketing—either juggling disconnected freelancers or distant agencies that never set foot in the store.'}
                </p>
                <p className="text-base leading-relaxed text-ink">
                  {isAr
                    ? 'لذلك جمعنا في «بيّورا» كل ما يحتاجه صاحب المحل تحت سقف واحد: من الشعار واللوحة والمنيو، إلى التصوير الميداني وإدارة السوشال ميديا وخرائط جوجل وواتساب الأعمال — بلغة واضحة، والتزام بالمواعيد، وملكية كاملة ١٠٠٪ لصاحب المحل.'
                    : 'Bayyora brings every essential growth discipline under one local team: from logo, signage, and menus to on-site photography, social media, Google Maps SEO, and WhatsApp Business—with clear deliverables and 100% client ownership.'}
                </p>

                {/* Brand Meaning Callout: بيّورا (بيّن) & Rising Line */}
                <div className="rounded-2xl border border-subtle bg-canvas-sand p-5">
                  <div className="flex items-center gap-3">
                    <RisingLineSvg dir={dir} variant="saffron" width={76} height={16} />
                    <h3 className="text-base font-bold text-navy">
                      {isAr
                        ? 'معنى «بيّورا» وشعارنا (خطوة لفوق)'
                        : 'The Meaning of “Bayyora” & Our Rising Line'}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink">
                    {isAr
                      ? 'اسم «بيّورا» مستلهم من الجذر العربي «بيّن» — أي الظهور بوضوح وتميّز. وخطّنا الصاعد يمثّل فلسفتنا البسيطة مع كل تاجر: نأخذ محلّك خطوة لفوق في كل شهر، بهوية واضحة وحضور يبيّن للناس.'
                      : 'The name “Bayyora” is inspired by the Arabic root “Bayyan” (بيّن)—meaning to stand out clearly and distinctly. Our Rising Line represents our promise to every local merchant: taking your shop one steady step up.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-subtle bg-surface p-4">
                    <MapPin aria-hidden="true" className="h-5 w-5 text-oasis" />
                    <h3 className="mt-2 text-sm font-bold text-navy">
                      {isAr ? 'قريبون منك ميدانيًا' : 'Local On-Site Team'}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {isAr
                        ? 'نزور محلّك في الأحساء والهفوف والمبرز والدمام والخبر.'
                        : 'We visit your storefront across Al Ahsa, Dammam & Khobar.'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-subtle bg-surface p-4">
                    <ShieldCheck aria-hidden="true" className="h-5 w-5 text-oasis" />
                    <h3 className="mt-2 text-sm font-bold text-navy">
                      {isAr ? 'ملكية كاملة ١٠٠٪ لك' : '100% Client Ownership'}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {isAr
                        ? 'كل الحسابات والملفات المفتوحة والمواقع باسمك دائمًا.'
                        : 'Every account, domain, and source file stays in your name.'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-subtle bg-surface p-4">
                    <Clock aria-hidden="true" className="h-5 w-5 text-oasis" />
                    <h3 className="mt-2 text-sm font-bold text-navy">
                      {isAr ? 'مرونة بدون عقود معقدة' : 'Month-to-Month Flexibility'}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {isAr
                        ? 'نبدأ خلال ٤٨ ساعة ونتجدد شهريًا بالنتائج والراحة.'
                        : '48-hour kickoff and flexible monthly plans.'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-subtle bg-surface p-4">
                    <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-oasis" />
                    <h3 className="mt-2 text-sm font-bold text-navy">
                      {isAr ? 'شريك نمو واحد متكامل' : 'One Integrated Growth Partner'}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {isAr
                        ? 'تتواصل مع مسؤول حساب واحد يرتّب لك التصميم والتصوير والتسويق.'
                        : 'One dedicated point of contact coordinating design, shoots, and growth.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="section-navy rounded-3xl bg-navy p-8 text-white shadow-xl sm:p-10">
                  <RisingLineSvg dir={dir} variant="saffron" width={120} height={22} />
                  <h3 className="mt-4 text-2xl font-bold">
                    {isAr ? 'المدن اللي نخدمها ميدانيًا' : 'Cities We Serve On-Site'}
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    {isAr
                      ? 'اضغط على مدينتك لاستكشاف خدماتنا المحلية وحجز زيارة لمحلّك:'
                      : 'Select your city to explore our local services and book a storefront visit:'}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {cities.map((c) => (
                      <Link
                        key={c.slug}
                        href={localizePath(`/city/${c.slug}`, locale)}
                        className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-accent hover:text-on-accent"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-7 border-t border-white/15 pt-6 flex flex-wrap gap-3">
                    <Button
                      href={localizePath('/free-audit', locale)}
                      variant="primary"
                      size="sm"
                    >
                      {isAr ? 'اطلب تحليل مجاني لمحلّك' : 'Request Free Mini Audit'}
                    </Button>
                    <Button
                      href={localizePath('/contact', locale)}
                      variant="secondary"
                      size="sm"
                    >
                      {isAr ? 'احجز زيارة ميدانية' : 'Book a Shop Visit'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. FREE MINI AUDIT PAGE (/free-audit) */}
      {slug === 'free-audit' && (
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-subtle bg-surface p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-navy sm:text-2xl">
                    {isAr
                      ? 'وش يشمل التحليل المجاني لمحلّك؟ (٦ نقاط فحص)'
                      : 'What Is Checked in Your Free Mini Audit? (6 Checkpoints)'}
                  </h2>
                  <ul className="mt-5 space-y-3.5 text-sm text-ink">
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-oasis"
                      />
                      <span>
                        <strong>
                          {isAr
                            ? '١. خرائط جوجل والظهور المحلي (Google Maps): '
                            : '1. Google Maps & Local Search: '}
                        </strong>
                        {isAr
                          ? 'فحص ظهور محلّك للباحثين في نفس الحي، التصنيفات، الصور، وتقييمات الزبائن.'
                          : 'How your shop ranks for nearby searchers, categories, photos, and reviews.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-oasis"
                      />
                      <span>
                        <strong>
                          {isAr ? '٢. حساب إنستقرام (Instagram): ' : '2. Instagram Profile: '}
                        </strong>
                        {isAr
                          ? 'مراجعة البايو، الهايلايت، وضوح الهوية البصرية، وسهولة الوصول للمنيو والأسعار.'
                          : 'Bio clarity, highlights organization, visual identity consistency, and menu access.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-oasis"
                      />
                      <span>
                        <strong>
                          {isAr ? '٣. حضور سناب شات (Snapchat): ' : '3. Snapchat Presence: '}
                        </strong>
                        {isAr
                          ? 'تقييم المحتوى اليومي، التغطيات المحلية، وجاذبية العروض لأهل المنطقة.'
                          : 'Story consistency, local offers visibility, and engagement readiness.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-oasis"
                      />
                      <span>
                        <strong>
                          {isAr ? '٤. حساب تيك توك (TikTok): ' : '4. TikTok Presence: '}
                        </strong>
                        {isAr
                          ? 'مراجعة الفيديوهات القصيرة (Reels/TikTok) وطريقة عرض المنتجات وتجربة المحل.'
                          : 'Short-form video hooks, storefront presentation, and local discovery potential.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-oasis"
                      />
                      <span>
                        <strong>
                          {isAr
                            ? '٥. الموقع الإلكتروني أو المنيو الرقمي: '
                            : '5. Website & Digital Menu: '}
                        </strong>
                        {isAr
                          ? 'فحص سرعة التصفح من الجوال وسهولة الطلب أو التواصل المباشر عبر واتساب.'
                          : 'Mobile loading speed, ordering friction, and direct WhatsApp conversion flow.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-oasis"
                      />
                      <span>
                        <strong>
                          {isAr
                            ? '٦. مقارنة سريعة مع ٣ منافسين في منطقتك: '
                            : '6. Benchmark Against 3 Local Competitors: '}
                        </strong>
                        {isAr
                          ? 'نوضح لك وين يتفوق منافسوك حاليًا وكيف تقدر تسبقهم بخطوات عملية.'
                          : 'See where 3 nearby competitors stand and the fastest wins to outrank them.'}
                      </span>
                    </li>
                  </ul>

                  {/* 3 Optional Sample Gifts Callout (BR-008) */}
                  <div className="mt-6 rounded-xl border border-oasis/30 bg-canvas p-4">
                    <p className="text-xs font-bold text-oasis">
                      {isAr
                        ? 'هدية إضافية مع التحليل (اختر واحدة في النموذج):'
                        : 'Bonus Free Sample Gift (Pick 1 in the form):'}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink sm:text-sm">
                      {isAr
                        ? '١) فكرة تطوير شعار • أو ٢) تصميم بوست سوشال ميديا تجريبي لمحلّك • أو ٣) خطة تحسين ملف خرائط جوجل.'
                        : '1) Free Logo Concept Idea • OR 2) 1 Custom Sample Social Post • OR 3) Google Maps Profile Fix Checklist.'}
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl bg-canvas-sand p-4 text-xs font-semibold text-navy">
                    {isAr
                      ? '✓ مجاني ١٠٠٪ • ✓ فحص يدوي حقيقي من فريقنا خلال ٤٨ ساعة • ✓ بدون أي التزام'
                      : '✓ 100% Free • ✓ Manual review by our local team in 48h • ✓ Zero obligation'}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <FreeAuditForm
                  locale={locale}
                  whatsappUrl={whatsappUrl}
                  uiLabels={uiStrings?.auditFormUi}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. CONTACT & VISIT BOOKING PAGE (/contact) */}
      {slug === 'contact' && (
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-subtle bg-surface p-6 sm:p-8 space-y-5">
                  <h2 className="text-xl font-bold text-navy sm:text-2xl">
                    {isAr ? 'قنوات التواصل المباشر' : 'Direct Contact Channels'}
                  </h2>

                  <div className="space-y-4 text-sm">
                    <div className="rounded-xl bg-canvas p-4">
                      <p className="text-xs font-bold text-muted">
                        {isAr ? 'أسرع طريقة للتواصل (واتساب):' : 'Fastest Response (WhatsApp):'}
                      </p>
                      <Button
                        href={whatsappUrl}
                        variant="whatsapp"
                        className="mt-2.5 w-full"
                        external
                      >
                        <WhatsAppIcon />
                        <span>
                          {isAr ? 'تحدث معنا على واتساب الآن' : 'Chat on WhatsApp Now'}
                        </span>
                      </Button>
                    </div>

                    <div className="rounded-xl border border-subtle p-4 space-y-2.5">
                      {siteSettings?.phoneNumber && (
                        <div>
                          <p className="font-bold text-navy">
                            {isAr ? 'رقم الجوال والاتصال المباشر:' : 'Direct Phone:'}
                          </p>
                          <a
                            href={`tel:${siteSettings.phoneNumber.replace(/\s+/g, '')}`}
                            dir="ltr"
                            className="inline-block font-mono text-sm font-semibold text-oasis hover:underline"
                          >
                            {siteSettings.phoneNumber}
                          </a>
                        </div>
                      )}
                      {siteSettings?.businessEmail && (
                        <div className="pt-1">
                          <p className="font-bold text-navy">
                            {isAr ? 'البريد الإلكتروني:' : 'Business Email:'}
                          </p>
                          <a
                            href={`mailto:${siteSettings.businessEmail}`}
                            dir="ltr"
                            className="inline-block font-mono text-sm font-semibold text-oasis hover:underline"
                          >
                            {siteSettings.businessEmail}
                          </a>
                        </div>
                      )}
                      <div className="pt-1">
                        <p className="font-bold text-navy">
                          {isAr ? 'ساعات العمل:' : 'Working Hours:'}
                        </p>
                        <p className="text-muted">{siteSettings?.workingHours}</p>
                      </div>
                      <div className="pt-1">
                        <p className="font-bold text-navy">
                          {isAr ? 'نطاق الزيارات الميدانية:' : 'On-Site Visit Coverage:'}
                        </p>
                        <p className="text-muted">{siteSettings?.serviceAreasSummary}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* On-Site Visit Calendar Booking Card */}
                <div className="rounded-2xl border-2 border-navy bg-surface p-6 sm:p-8">
                  <div className="flex items-center gap-2.5 text-oasis">
                    <Calendar aria-hidden="true" className="h-5 w-5" />
                    <span className="text-xs font-bold">
                      {isAr ? 'زيارة ميدانية للمحل' : 'On-Site Shop Visit'}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-navy sm:text-xl">
                    {uiStrings?.contactFormUi?.calendarHeading ||
                      (isAr
                        ? 'احجز موعد زيارة ميدانية لمحلّك'
                        : 'Book an On-Site Visit to Your Shop')}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                    {uiStrings?.contactFormUi?.calendarSubheading ||
                      (isAr
                        ? 'إذا كان محلّك في الأحساء (الهفوف أو المبرز) أو الدمام أو الخبر، نمرّ عليك في المحل لمعاينة الواجهة ومناقشة خطة النمو.'
                        : 'If your shop is in Al Ahsa, Hofuf, Mubarraz, Dammam, or Khobar, our team can visit your storefront in person.')}
                  </p>
                  <Button
                    href={buildWhatsAppUrl(
                      siteSettings?.whatsappNumber,
                      isAr
                        ? 'السلام عليكم فريق بيّورا، أبغى أحجز موعد زيارة ميدانية لمحلي.'
                        : 'Hello Bayyora team, I would like to schedule an on-site visit to my shop.',
                    )}
                    variant="primary"
                    size="sm"
                    className="mt-4 w-full"
                    external
                  >
                    {isAr ? 'نسّق موعد الزيارة عبر واتساب' : 'Schedule Visit Time via WhatsApp'}
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-7">
                <ContactForm locale={locale} uiLabels={uiStrings?.contactFormUi} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. FAQ PAGE (/faq) */}
      {slug === 'faq' && (
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
            <h2 className="sr-only">
              {isAr ? 'قائمة الأسئلة الشائعة' : 'Frequently Asked Questions List'}
            </h2>
            <FaqAccordion locale={locale} faqs={mappedFaqs} showCategoryFilter />
          </div>
        </section>
      )}

      {/* 8. LEGAL & COMPLIANCE PAGES (/privacy, /terms, /refunds) */}
      {pageDoc.isLegalPage && pageDoc.legalBodyMarkdown && (
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-narrow px-4 sm:px-6">
            <article className="rounded-2xl border border-subtle bg-surface p-6 shadow-xs sm:p-10 space-y-5">
              {String(pageDoc.legalBodyMarkdown).split('\n\n').map((blockText: string, idx: number) => {
                const trimmed = blockText.trim()
                if (trimmed.startsWith('### ')) {
                  return (
                    <h2 key={idx} className="pt-2 text-lg font-bold text-navy sm:text-xl">
                      {trimmed.replace(/^###\s+/, '')}
                    </h2>
                  )
                }
                return (
                  <p key={idx} className="text-sm leading-relaxed text-ink sm:text-base whitespace-pre-line">
                    {trimmed}
                  </p>
                )
              })}
            </article>
          </div>
        </section>
      )}

      {/* Render any custom CMS Page Builder blocks added to this page */}
      {Array.isArray(pageDoc.layout) && pageDoc.layout.length > 0 && (
        <RenderBlocks
          blocks={pageDoc.layout as unknown as Array<Record<string, unknown>>}
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
      )}
    </>
  )
}
