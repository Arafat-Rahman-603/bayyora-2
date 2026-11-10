import React from 'react'
import Link from 'next/link'
import { RisingLineSvg } from '@/components/domain/RisingLineSvg'
import { HeroComparisonCard } from '@/components/domain/HeroComparisonCard'
import { PackageCardGrid, type PackageCardItem } from '@/components/domain/PackageCardGrid'
import { SeasonalCampaignTabs, type SeasonItem } from '@/components/domain/SeasonalCampaignTabs'
import { FaqAccordion, type FaqItemData } from '@/components/domain/FaqAccordion'
import { PortfolioFilterGrid, type PortfolioProjectCardItem } from '@/components/domain/PortfolioFilterGrid'
import { BeforeAfterSlider } from '@/components/domain/BeforeAfterSlider'
import { Button, WhatsAppIcon } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import {
  AnimatedReveal,
  AnimatedStaggerGrid,
  AnimatedStaggerItem,
} from '@/components/ui/AnimatedSection'
import { getLocaleDirection, localizePath, type Locale } from '@/i18n/config'

export interface RenderBlocksContext {
  locale: Locale
  whatsappUrl: string
  whatsappNumber?: string | null
  publicPricingEnabled: boolean
  services: Array<{
    slug: string
    name: string
    benefitHeadline: string
    shortDescription: string
    iconName?: string | null
  }>
  packages: PackageCardItem[]
  projects: PortfolioProjectCardItem[]
  faqs: FaqItemData[]
}

interface RenderBlocksProps {
  blocks: Array<Record<string, unknown>>
  context: RenderBlocksContext
}

export function RenderBlocks({ blocks, context }: RenderBlocksProps) {
  const {
    locale,
    whatsappUrl,
    whatsappNumber,
    publicPricingEnabled,
    services,
    packages,
    projects,
    faqs,
  } = context
  const dir = getLocaleDirection(locale)
  const isAr = locale === 'ar'

  if (!Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        if (block.isVisible === false) return null
        const blockType = String(block.blockType || '')
        const key = `${blockType}-${index}`

        switch (blockType) {
          case 'hero': {
            const eyebrow = String(block.eyebrow || (isAr ? 'خطوة لفوق' : 'One step up'))
            const headline = String(
              block.headline ||
                (isAr
                  ? 'نخلّي محلّك يبان... ويجيب لك زباين أكثر'
                  : 'We make your shop stand out... and bring you more customers'),
            )
            const highlightWord = String(
              block.highlightWord || (isAr ? 'يبان' : 'stand out'),
            )
            const subheadline = String(
              block.subheadline ||
                (isAr
                  ? 'الهوية، اللوحة، المنيو، السوشال ميديا، التصوير، إعلانات وخرائط جوجل، ومتابعة واتساب — كل اللي يحتاجه محلّك من فريق واحد.'
                  : 'Brand identity, signage, menus, social media, photography, Google Maps & local ads, and WhatsApp follow-up — everything your shop needs from one local team.'),
            )
            const primaryCtaLabel = String(
              block.primaryCtaLabel || (isAr ? 'راسلنا واتساب' : 'Chat on WhatsApp'),
            )
            const secondaryCtaLabel = String(
              block.secondaryCtaLabel || (isAr ? 'اطلب تحليل مجاني' : 'Free mini audit'),
            )
            const trustNote = String(
              block.trustNote ||
                (isAr
                  ? 'الأحساء • الهفوف • المبرز • الدمام • الخبر — نخدم المنطقة الشرقية وكل السعودية'
                  : 'Al Ahsa • Hofuf • Mubarraz • Dammam • Khobar — Serving the Eastern Province & Saudi Arabia'),
            )

            const parts =
              highlightWord && headline.includes(highlightWord)
                ? headline.split(highlightWord)
                : [headline]

            return (
              <section
                key={key}
                className="relative overflow-hidden border-b border-subtle bg-canvas py-12 sm:py-16 lg:py-24"
              >
                {/* Subtle Warm Ambient Radial Backdrop */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 start-1/4 h-96 w-96 rounded-full bg-accent/15 blur-3xl"
                />

                <div className="relative mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
                    {/* Hero Text Column with Staggered Entrance */}
                    <AnimatedReveal className="min-w-0 lg:col-span-6" duration={0.44}>
                      <div className="mb-3 inline-flex items-center gap-2.5 rounded-full border border-subtle bg-surface/85 px-3.5 py-1.5 shadow-2xs">
                        <RisingLineSvg dir={dir} variant="saffron" width={64} height={15} />
                        <span className="text-sm font-bold text-oasis">{eyebrow}</span>
                      </div>

                      <h1 className="text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-5xl">
                        {parts.length === 2 ? (
                          <>
                            {parts[0]}
                            <span className="text-accent-terracotta underline decoration-accent decoration-4 underline-offset-8">
                              {highlightWord}
                            </span>
                            {parts[1]}
                          </>
                        ) : (
                          headline
                        )}
                      </h1>

                      {subheadline && (
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink sm:text-lg">
                          {subheadline}
                        </p>
                      )}

                      <div className="mt-7 flex flex-wrap items-center gap-3.5">
                        <Button
                          href={
                            typeof block.primaryCtaUrl === 'string' && block.primaryCtaUrl.trim()
                              ? block.primaryCtaUrl.startsWith('http')
                                ? block.primaryCtaUrl
                                : localizePath(block.primaryCtaUrl, locale)
                              : whatsappUrl
                          }
                          variant="whatsapp"
                          size="lg"
                          external={
                            typeof block.primaryCtaUrl === 'string' && block.primaryCtaUrl.trim()
                              ? block.primaryCtaUrl.startsWith('http')
                              : true
                          }
                        >
                          <WhatsAppIcon />
                          <span>{primaryCtaLabel}</span>
                        </Button>
                        <Button
                          href={localizePath(
                            typeof block.secondaryCtaUrl === 'string' &&
                              block.secondaryCtaUrl.trim()
                              ? block.secondaryCtaUrl
                              : '/free-audit',
                            locale,
                          )}
                          variant="outline"
                          size="lg"
                        >
                          {secondaryCtaLabel}
                        </Button>
                      </div>

                      {trustNote && (
                        <p className="mt-4 text-xs font-medium text-muted sm:text-sm">
                          {trustNote}
                        </p>
                      )}
                    </AnimatedReveal>

                    {/* Hero Visual Comparison Column with Smooth Entrance */}
                    <AnimatedReveal delay={0.12} direction="scale" className="min-w-0 lg:col-span-6">
                      <HeroComparisonCard locale={locale} />
                    </AnimatedReveal>
                  </div>
                </div>
              </section>
            )
          }

          case 'serviceCards': {
            const variant = String(block.layoutVariant || 'grid_3col_compact')
            const defaultPainItems = isAr
              ? [
                  {
                    title: 'ما له مكان على خرائط جوجل',
                    description: 'الناس يبحثون قريب منك وما يطلع لهم اسم محلّك أو ساعات العمل.',
                    iconName: 'map-pin',
                  },
                  {
                    title: 'حسابات التواصل نائمة',
                    description: 'آخر منشور قبل شهور يخلي الزبون يظن إن المحل مقفّل.',
                    iconName: 'share-2',
                  },
                  {
                    title: 'شعار ولوحة قديمة',
                    description: 'الواجهة والمنيو ما تعكس جودة البضاعة والأكل اللي تقدمه.',
                    iconName: 'printer',
                  },
                  {
                    title: 'طلبات بالتلفون تضيع',
                    description: 'بدون منيو واضح وواتساب منظم تضيع الرسائل وقت الزحمة.',
                    iconName: 'message-circle',
                  },
                ]
              : [
                  {
                    title: 'Invisible on Google Maps',
                    description: 'Shoppers search blocks away and your shop hours, pin, or photos never appear.',
                    iconName: 'map-pin',
                  },
                  {
                    title: 'Silent social media accounts',
                    description: 'When your last post was months ago, new visitors assume the business is closed.',
                    iconName: 'share-2',
                  },
                  {
                    title: 'Outdated sign & menu',
                    description: 'An old storefront sign or cluttered menu undersells the real quality of your product.',
                    iconName: 'printer',
                  },
                  {
                    title: 'Missed phone & WhatsApp orders',
                    description: 'Without a clear digital menu and structured WhatsApp, rush-hour inquiries slip away.',
                    iconName: 'message-circle',
                  },
                ]

            const rawPainItems = Array.isArray(block.painItems)
              ? (block.painItems as Array<{
                  title?: string
                  description?: string
                  iconName?: string
                }>)
              : []

            const painItems =
              rawPainItems.length > 0
                ? rawPainItems.map((item, idx) => ({
                    title: item.title || defaultPainItems[idx]?.title || '',
                    description: item.description || defaultPainItems[idx]?.description || '',
                    iconName: item.iconName || defaultPainItems[idx]?.iconName || 'map-pin',
                  }))
                : defaultPainItems

            if (variant === 'pain_strip_4col') {
              const heading = String(
                block.heading ||
                  (isAr
                    ? 'محلّك ممتاز.. بس الزباين ما يشوفونه'
                    : 'Your shop is great... but nearby customers can’t see it'),
              )

              return (
                <section key={key} className="border-b border-subtle bg-surface py-14 lg:py-20">
                  <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                    <AnimatedReveal className="mx-auto max-w-2xl text-center">
                      <h2 className="text-2xl font-bold text-navy sm:text-3xl lg:text-4xl">
                        {heading}
                      </h2>
                    </AnimatedReveal>

                    <AnimatedStaggerGrid className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      {painItems.map((item, idx) => (
                        <AnimatedStaggerItem key={idx} className="flex">
                          <div className="card-interactive flex w-full flex-col items-center rounded-2xl border border-subtle bg-canvas p-6 text-center hover:border-accent-terracotta/40 hover:bg-canvas-sand/60">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-terracotta text-white shadow-xs transition-transform duration-micro ease-out-quart">
                              <ServiceIcon name={item.iconName} className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold text-navy sm:text-lg">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                              {item.description}
                            </p>
                          </div>
                        </AnimatedStaggerItem>
                      ))}
                    </AnimatedStaggerGrid>
                  </div>
                </section>
              )
            }

            const heading = String(
              block.heading ||
                (isAr
                  ? 'كل اللي يحتاجه محلّك، من فريق واحد'
                  : 'Everything your shop needs, from one team'),
            )
            const subheading = String(
              block.subheading ||
                (isAr
                  ? '٩ خدمات عملية مصممة للمحلات والمطاعم والكافيهات والصيدليات والصالونات.'
                  : '9 practical services built for restaurants, cafes, pharmacies, salons, and retail stores.'),
            )
            const ctaLabel = String(
              block.ctaLabel || (isAr ? 'كل الخدمات بالتفصيل' : 'View all 9 services'),
            )
            const ctaUrl =
              typeof block.ctaUrl === 'string' && block.ctaUrl.trim()
                ? block.ctaUrl
                : '/services'

            const selectedServiceSlugs = Array.isArray(block.selectedServices)
              ? block.selectedServices
                  .map((s) =>
                    typeof s === 'object' && s !== null && 'slug' in s
                      ? String((s as { slug?: string }).slug || '')
                      : '',
                  )
                  .filter(Boolean)
              : []

            const displayedServices =
              selectedServiceSlugs.length > 0
                ? services.filter((s) => selectedServiceSlugs.includes(s.slug))
                : services

            return (
              <section key={key} className="border-b border-subtle bg-canvas py-14 lg:py-24">
                <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <AnimatedReveal className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-bold text-navy sm:text-3xl lg:text-4xl">
                      {heading}
                    </h2>
                    {subheading && (
                      <p className="mt-3 text-sm text-muted sm:text-base">{subheading}</p>
                    )}
                  </AnimatedReveal>

                  <AnimatedStaggerGrid className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {displayedServices.map((svc) => (
                      <AnimatedStaggerItem key={svc.slug} className="flex">
                        <Link
                          href={localizePath(`/services/${svc.slug}`, locale)}
                          className="card-interactive group flex w-full flex-col justify-between rounded-2xl border border-subtle bg-surface p-6 shadow-xs hover:border-oasis/40"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-terracotta text-white shadow-2xs transition-transform duration-ui ease-out-quart group-hover:scale-105">
                                <ServiceIcon name={svc.iconName} className="h-5 w-5" />
                              </span>
                              <span className="text-xs font-bold text-oasis transition-transform duration-micro group-hover:underline">
                                {isAr ? 'التفاصيل ←' : 'Explore →'}
                              </span>
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-navy transition-colors group-hover:text-oasis sm:text-xl">
                              {svc.name}
                            </h3>
                            <p className="mt-1 text-xs font-semibold text-oasis">
                              {svc.benefitHeadline}
                            </p>
                            <p className="mt-2.5 text-sm leading-relaxed text-muted">
                              {svc.shortDescription}
                            </p>
                          </div>
                        </Link>
                      </AnimatedStaggerItem>
                    ))}
                  </AnimatedStaggerGrid>

                  {ctaLabel && (
                    <div className="mt-10 text-center">
                      <Button href={localizePath(ctaUrl, locale)} variant="outline">
                        {ctaLabel}
                      </Button>
                    </div>
                  )}
                </div>
              </section>
            )
          }

          case 'processSteps': {
            const heading = String(
              block.heading || (isAr ? '٤ خطوات بسيطة وواضحة' : '4 simple, transparent steps'),
            )
            const defaultSteps = isAr
              ? [
                  {
                    stepNumber: '1',
                    title: 'راسلنا واتساب',
                    description: 'أرسل اسم محلّك ومدينتك أو اطلب التحليل المجاني في دقيقة.',
                  },
                  {
                    stepNumber: '2',
                    title: 'تحليل مجاني',
                    description: 'نفحص حساباتك وخرائط جوجل ونرسل لك ٣ ملاحظات عملية خلال ٤٨ ساعة.',
                  },
                  {
                    stepNumber: '3',
                    title: 'نستلم ونشتغل',
                    description: 'نصمّم، نصوّر في محلّك، وننشر المحتوى والإعلانات بانتظام.',
                  },
                  {
                    stepNumber: '4',
                    title: 'زباين أكثر',
                    description: 'محلّك يبان للناس القريبة منك وتزيد الزيارات والطلبات.',
                  },
                ]
              : [
                  {
                    stepNumber: '1',
                    title: 'Message us on WhatsApp',
                    description: 'Send your shop name and city or request your free mini audit in 60 seconds.',
                  },
                  {
                    stepNumber: '2',
                    title: 'Free mini audit',
                    description: 'We inspect your accounts and Google Maps and send 3 practical fixes within 48 hours.',
                  },
                  {
                    stepNumber: '3',
                    title: 'We create & manage',
                    description: 'We design, visit your shop for shoots, and publish content and local ads on schedule.',
                  },
                  {
                    stepNumber: '4',
                    title: 'More local customers',
                    description: 'Nearby shoppers find you first, boosting walk-ins, calls, and WhatsApp orders.',
                  },
                ]

            const rawSteps = Array.isArray(block.steps)
              ? (block.steps as Array<{
                  stepNumber?: string
                  title?: string
                  description?: string
                }>)
              : []

            const steps =
              rawSteps.length > 0
                ? rawSteps.map((s, idx) => ({
                    stepNumber: s.stepNumber || defaultSteps[idx]?.stepNumber || String(idx + 1),
                    title: s.title || defaultSteps[idx]?.title || '',
                    description: s.description || defaultSteps[idx]?.description || '',
                  }))
                : defaultSteps

            return (
              <section key={key} className="border-b border-subtle bg-canvas py-14 lg:py-20">
                <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <AnimatedReveal className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                      {heading}
                    </h2>
                  </AnimatedReveal>

                  <AnimatedStaggerGrid className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, idx) => (
                      <AnimatedStaggerItem key={idx} className="flex">
                        <div className="card-interactive group relative flex w-full flex-col items-center rounded-2xl border border-subtle bg-surface p-6 text-center shadow-xs hover:border-oasis/40">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas-sand font-mono text-2xl font-bold text-accent-terracotta tabular-nums transition-colors duration-micro group-hover:bg-oasis group-hover:text-white">
                            {step.stepNumber}
                          </span>
                          <h3 className="mt-4 text-lg font-bold text-navy">{step.title}</h3>
                          <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
                            {step.description}
                          </p>
                        </div>
                      </AnimatedStaggerItem>
                    ))}
                  </AnimatedStaggerGrid>
                </div>
              </section>
            )
          }

          case 'packageComparison': {
            const heading = String(
              block.heading ||
                (isAr
                  ? 'باقات شهرية واضحة تناسب محلّك'
                  : 'Clear monthly packages & starter bundles'),
            )
            const subheading = String(
              block.subheading ||
                (isAr
                  ? 'اختر الباقة المناسبة لحجم شغلك — مرونة شهرية بدون عقود سنوية معقدة.'
                  : 'Choose the right scope for your storefront — month-to-month flexibility with no annual lock-in.'),
            )
            const disclaimer = String(
              block.pricingDisclaimerNote ||
                (isAr
                  ? 'تُحدّد التكلفة الدقيقة حسب احتياج محلّك بعد التحليل المجاني • ميزانية المنصات الإعلانية تُدفع مباشرة للمنصة.'
                  : 'Exact quote tailored to your shop’s scope after your free audit • Platform ad spend is billed directly by the ad platform.'),
            )
            const showMonthly = block.showMonthlyPackages !== false
            const showStarter = Boolean(block.showStarterBundles)
            const monthlyPackages = packages.filter((p) => p.packageType === 'monthly')
            const starterBundles = packages.filter((p) => p.packageType === 'one_time_bundle')

            return (
              <section key={key} className="border-b border-subtle bg-canvas py-14 lg:py-24">
                <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <AnimatedReveal className="mx-auto mb-12 max-w-2xl text-center">
                    <h2 className="text-2xl font-bold text-navy sm:text-3xl lg:text-4xl">
                      {heading}
                    </h2>
                    {subheading && (
                      <p className="mt-3 text-sm text-muted sm:text-base">{subheading}</p>
                    )}
                  </AnimatedReveal>

                  {showMonthly && (
                    <PackageCardGrid
                      locale={locale}
                      packages={monthlyPackages}
                      publicPricingEnabled={publicPricingEnabled}
                      whatsappNumber={whatsappNumber}
                    />
                  )}

                  {showStarter && starterBundles.length > 0 && (
                    <div className="mt-12">
                      <div className="mx-auto mb-6 max-w-2xl text-center">
                        <span className="text-xs font-bold text-oasis">
                          {isAr
                            ? 'باقات التأسيس والتجهيز لمرة واحدة'
                            : 'One-Time Starter Bundles'}
                        </span>
                        <h3 className="mt-1 text-xl font-bold text-navy sm:text-2xl">
                          {isAr
                            ? 'تفتح محل جديد أو تجدّد هويتك؟ باقات لمرة واحدة'
                            : 'Opening a new shop or refreshing your look? One-time bundles'}
                        </h3>
                      </div>
                      <PackageCardGrid
                        locale={locale}
                        packages={starterBundles}
                        publicPricingEnabled={publicPricingEnabled}
                        whatsappNumber={whatsappNumber}
                      />
                    </div>
                  )}

                  {disclaimer && (
                    <p className="mt-6 text-center text-xs text-muted">{disclaimer}</p>
                  )}

                  <div className="mt-8 text-center">
                    <Button href={localizePath('/packages', locale)} variant="outline" size="sm">
                      {isAr
                        ? 'مقارنة الباقات الشهرية وباقات التأسيس بالتفصيل ←'
                        : 'Compare all monthly packages & starter bundles →'}
                    </Button>
                  </div>
                </div>
              </section>
            )
          }

          case 'textAndImage': {
            const heading = String(
              block.heading || (isAr ? 'شريك محلي تثق فيه' : 'A local partner you can trust'),
            )
            const defaultBullets = isAr
              ? [
                  {
                    title: 'فريق محلي يجيك للمحل',
                    description: 'نزورك ميدانيًا في الأحساء والشرقية للتصوير والمعاينة وجهًا لوجه.',
                    iconName: 'map-pin',
                  },
                  {
                    title: 'كل شيء من مكان واحد',
                    description: 'بدل التشتت بين مصمم ومصوّر ومسوق، فريق واحد يمسك كل شيء.',
                    iconName: 'layers',
                  },
                  {
                    title: 'نطاق عمل واضح ومرن',
                    description: 'تعرف بالضبط كم تصميم وكم فيديو وزيارة تحصل عليها كل شهر.',
                    iconName: 'check-circle',
                  },
                  {
                    title: 'الحسابات والملفات باسمك ١٠٠٪',
                    description: 'ملكية حساباتك وموقعك وملفات شعارك تبقى لك دائمًا.',
                    iconName: 'shield-check',
                  },
                  {
                    title: 'التزام بالمواعيد والرد السريع',
                    description: 'معك مباشرة على الواتساب ونبدأ الشغل خلال ٤٨ ساعة.',
                    iconName: 'clock',
                  },
                ]
              : [
                  {
                    title: 'Local team that visits your shop',
                    description: 'On-site visits across Al Ahsa and the Eastern Province for shoots and consultations.',
                    iconName: 'map-pin',
                  },
                  {
                    title: 'Everything under one roof',
                    description: 'No juggling separate freelancers for signs, photos, websites, and social media.',
                    iconName: 'layers',
                  },
                  {
                    title: 'Clear deliverables every month',
                    description: 'Know the exact number of designs, Reels, stories, and shoots included in your plan.',
                    iconName: 'check-circle',
                  },
                  {
                    title: '100% client ownership',
                    description: 'Your social accounts, Google Maps profile, domain, and source files remain yours.',
                    iconName: 'shield-check',
                  },
                  {
                    title: 'Fast WhatsApp communication & 48h kickoff',
                    description: 'Direct access to your team on WhatsApp with work starting within 48 hours.',
                    iconName: 'clock',
                  },
                ]

            const rawBullets = Array.isArray(block.bullets)
              ? (block.bullets as Array<{
                  title?: string
                  description?: string
                  iconName?: string
                }>)
              : []

            const bullets =
              rawBullets.length > 0
                ? rawBullets.map((b, idx) => ({
                    title: b.title || defaultBullets[idx]?.title || '',
                    description: b.description || defaultBullets[idx]?.description || '',
                    iconName: b.iconName || defaultBullets[idx]?.iconName || 'check-circle',
                  }))
                : defaultBullets

            const bodyText = typeof block.body === 'string' ? block.body.trim() : ''

            return (
              <section key={key} className="border-b border-subtle bg-canvas py-14 lg:py-24">
                <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                      <AnimatedReveal>
                        <h2 className="text-2xl font-bold text-navy sm:text-3xl lg:text-4xl">
                          {heading}
                        </h2>
                        {bodyText && (
                          <p className="mt-3 text-sm leading-relaxed text-ink sm:text-base">
                            {bodyText}
                          </p>
                        )}
                      </AnimatedReveal>

                      <AnimatedStaggerGrid className="mt-8 divide-y divide-subtle">
                        {bullets.map((b, idx) => (
                          <AnimatedStaggerItem
                            key={idx}
                            className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                          >
                            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-terracotta text-white shadow-2xs">
                              <ServiceIcon name={b.iconName} className="h-5 w-5" />
                            </span>
                            <div>
                              <h3 className="text-base font-bold text-navy sm:text-lg">
                                {b.title}
                              </h3>
                              {b.description && (
                                <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                                  {b.description}
                                </p>
                              )}
                            </div>
                          </AnimatedStaggerItem>
                        ))}
                      </AnimatedStaggerGrid>
                    </div>

                    {/* Signature Najd Night Brand Motif Card ("خطوة لفوق — One step up") */}
                    <AnimatedReveal delay={0.08} direction="scale" className="lg:col-span-5">
                      <div className="card-interactive section-navy flex flex-col items-center justify-center rounded-3xl border border-accent/30 bg-navy p-10 text-center text-white shadow-xl sm:p-14">
                        <RisingLineSvg dir={dir} variant="saffron" width={160} height={28} />
                        <p className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                          {isAr ? 'خطوة لفوق' : 'One step up'}
                        </p>
                        <p className="mt-2 text-sm font-medium text-white/75">
                          {isAr
                            ? 'بيّورا — شريك نمو المحلات في السعودية'
                            : 'Bayyora — Local Business Growth Partner'}
                        </p>
                      </div>
                    </AnimatedReveal>
                  </div>
                </div>
              </section>
            )
          }

          case 'seasonalBanner': {
            const heading = String(
              block.heading ||
                (isAr
                  ? 'جاهزين قبل الموسم... مو بعده'
                  : 'Ready before the season, not after it'),
            )
            const subheading = String(
              block.subheading ||
                (isAr
                  ? 'نجهّز لمحلّك عروض وتصاميم ومطبوعات وفيديوهات المواسم السعودية قبل وقتها بأسبوعين إلى ثلاثة.'
                  : 'We prepare your seasonal offers, packaging, print materials, and Reels weeks ahead of Saudi retail peaks.'),
            )
            const seasons = Array.isArray(block.seasons)
              ? (block.seasons as SeasonItem[])
              : []

            return (
              <section key={key} className="border-b border-subtle bg-canvas py-14 lg:py-20">
                <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <AnimatedReveal className="mx-auto mb-8 max-w-2xl text-center">
                    <h2 className="text-2xl font-bold text-navy sm:text-3xl lg:text-4xl">
                      {heading}
                    </h2>
                    {subheading && (
                      <p className="mt-3 text-sm text-muted sm:text-base">{subheading}</p>
                    )}
                  </AnimatedReveal>

                  <SeasonalCampaignTabs locale={locale} seasons={seasons} />
                </div>
              </section>
            )
          }

          case 'faqSection': {
            const heading = String(
              block.heading || (isAr ? 'عندك سؤال؟' : 'Have a question?'),
            )
            const subheading = String(
              block.subheading ||
                (isAr
                  ? 'إجابات سريعة وواضحة قبل ما نبدأ.'
                  : 'Clear answers before we get started.'),
            )
            const showCategoryFilter = Boolean(block.showCategoryFilter)

            const selectedFaqIds = Array.isArray(block.selectedFaqs)
              ? block.selectedFaqs
                  .map((f) =>
                    typeof f === 'object' && f !== null && 'id' in f
                      ? String((f as { id?: string | number }).id || '')
                      : typeof f === 'string' || typeof f === 'number'
                        ? String(f)
                        : '',
                  )
                  .filter(Boolean)
              : []

            const displayedFaqs =
              selectedFaqIds.length > 0
                ? faqs.filter((f) => selectedFaqIds.includes(String(f.id)))
                : faqs

            return (
              <section key={key} className="border-b border-subtle bg-canvas py-14 lg:py-24">
                <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <AnimatedReveal className="mx-auto mb-10 max-w-2xl text-center">
                    <h2 className="text-2xl font-bold text-navy sm:text-3xl lg:text-4xl">
                      {heading}
                    </h2>
                    {subheading && (
                      <p className="mt-2.5 text-sm text-muted sm:text-base">{subheading}</p>
                    )}
                  </AnimatedReveal>

                  <FaqAccordion
                    locale={locale}
                    faqs={displayedFaqs}
                    showCategoryFilter={showCategoryFilter}
                  />
                </div>
              </section>
            )
          }

          case 'portfolioGrid': {
            const heading = String(
              block.heading ||
                (isAr
                  ? 'شوف الفرق اللي نصنعه للمحلات المحلية'
                  : 'See the difference structured marketing makes'),
            )
            const subheading = String(block.subheading || '')

            const selectedProjectSlugs = Array.isArray(block.selectedProjects)
              ? block.selectedProjects
                  .map((p) =>
                    typeof p === 'object' && p !== null && 'slug' in p
                      ? String((p as { slug?: string }).slug || '')
                      : '',
                  )
                  .filter(Boolean)
              : []

            const displayedProjects =
              selectedProjectSlugs.length > 0
                ? projects.filter((p) => selectedProjectSlugs.includes(p.slug))
                : projects

            return (
              <section key={key} className="border-b border-subtle bg-canvas py-14 lg:py-20">
                <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <AnimatedReveal className="mx-auto mb-10 max-w-2xl text-center">
                    <h2 className="text-2xl font-bold text-navy sm:text-3xl lg:text-4xl">
                      {heading}
                    </h2>
                    {subheading && (
                      <p className="mt-2.5 text-sm text-muted sm:text-base">{subheading}</p>
                    )}
                  </AnimatedReveal>

                  <PortfolioFilterGrid locale={locale} projects={displayedProjects} />
                </div>
              </section>
            )
          }

          case 'beforeAndAfter': {
            const heading = String(
              block.heading ||
                (isAr
                  ? 'كيف يتحوّل ظهور محلّك من غير واضح إلى علامة تجارية تشد الزبون'
                  : 'How your shop transforms from invisible to a magnet for local customers'),
            )
            const subheading = String(
              block.subheading ||
                (isAr
                  ? 'نماذج توضيحية عملية لنتائج تنظيم الهوية وخرائط جوجل وحسابات التواصل.'
                  : 'Practical concept comparisons showing the impact of structured branding, Google Maps, and social media.'),
            )

            const selectedProjectSlugs = Array.isArray(block.selectedProjects)
              ? block.selectedProjects
                  .map((p) =>
                    typeof p === 'object' && p !== null && 'slug' in p
                      ? String((p as { slug?: string }).slug || '')
                      : '',
                  )
                  .filter(Boolean)
              : []

            const targetProject =
              (selectedProjectSlugs.length > 0
                ? projects.find((p) => selectedProjectSlugs.includes(p.slug))
                : undefined) || projects[0]

            if (!targetProject) return null

            return (
              <section key={key} className="border-b border-subtle bg-surface py-14 lg:py-24">
                <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <AnimatedReveal className="mx-auto mb-10 max-w-2xl text-center">
                    <h2 className="text-2xl font-bold text-navy sm:text-3xl lg:text-4xl">
                      {heading}
                    </h2>
                    {subheading && (
                      <p className="mt-2.5 text-sm text-muted sm:text-base">{subheading}</p>
                    )}
                  </AnimatedReveal>

                  <BeforeAfterSlider locale={locale} project={targetProject} />

                  <div className="mt-8 text-center">
                    <Button href={localizePath('/our-work', locale)} variant="outline" size="sm">
                      {isAr
                        ? 'استكشف كل نماذج قبل وبعد وأعمالنا ←'
                        : 'Explore all Before/After concepts & our work →'}
                    </Button>
                  </div>
                </div>
              </section>
            )
          }

          case 'ctaSection': {
            const heading = String(
              block.heading ||
                (isAr ? 'جاهز تطوّر ظهور محلّك؟' : 'Ready to elevate your shop’s presence?'),
            )
            const subheading = String(
              block.subheading ||
                (isAr
                  ? 'اطلب تحليل مجاني لمحلّك ونرسل لك ٣ ملاحظات عملية على الواتساب خلال ٤٨ ساعة.'
                  : 'Request a free mini audit and receive 3 actionable improvements on WhatsApp within 48 hours.'),
            )
            const primaryCtaLabel = String(
              block.primaryCtaLabel || (isAr ? 'راسلنا واتساب' : 'Chat on WhatsApp'),
            )
            const secondaryCtaLabel = String(
              block.secondaryCtaLabel || (isAr ? 'اطلب تحليل مجاني' : 'Request Free Audit'),
            )
            const variant = String(block.layoutVariant || 'najd_night_full')
            const isDark = variant === 'najd_night_full'

            return (
              <section
                key={key}
                className={
                  isDark
                    ? 'section-navy border-b border-white/10 bg-navy py-14 text-white lg:py-20'
                    : 'border-b border-subtle bg-canvas-sand py-14 text-ink lg:py-20'
                }
              >
                <div className="mx-auto max-w-main px-4 text-center sm:px-6 lg:px-8">
                  <AnimatedReveal className="mx-auto max-w-2xl">
                    <h2
                      className={
                        isDark
                          ? 'mt-1.5 text-2xl font-bold text-white sm:text-3xl lg:text-4xl'
                          : 'mt-1.5 text-2xl font-bold text-navy sm:text-3xl lg:text-4xl'
                      }
                    >
                      {heading}
                    </h2>
                    {subheading && (
                      <p
                        className={
                          isDark
                            ? 'mt-3 text-sm text-white/85 sm:text-base'
                            : 'mt-3 text-sm text-muted sm:text-base'
                        }
                      >
                        {subheading}
                      </p>
                    )}
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
                      <Button
                        href={
                          typeof block.primaryCtaUrl === 'string' && block.primaryCtaUrl.trim()
                            ? block.primaryCtaUrl.startsWith('http')
                              ? block.primaryCtaUrl
                              : localizePath(block.primaryCtaUrl, locale)
                            : whatsappUrl
                        }
                        variant="whatsapp"
                        size="lg"
                        external={
                          typeof block.primaryCtaUrl === 'string' && block.primaryCtaUrl.trim()
                            ? block.primaryCtaUrl.startsWith('http')
                            : true
                        }
                      >
                        <WhatsAppIcon />
                        <span>{primaryCtaLabel}</span>
                      </Button>
                      <Button
                        href={localizePath(
                          typeof block.secondaryCtaUrl === 'string' && block.secondaryCtaUrl.trim()
                            ? block.secondaryCtaUrl
                            : '/free-audit',
                          locale,
                        )}
                        variant={isDark ? 'primary' : 'secondary'}
                        size="lg"
                      >
                        {secondaryCtaLabel}
                      </Button>
                    </div>
                  </AnimatedReveal>
                </div>
              </section>
            )
          }

          case 'statistics': {
            // Strictly enforce BR-009 / BR-011 owner verification gate before rendering metrics publicly
            if (block.ownerApproved !== true) return null
            const heading = String(
              block.heading || (isAr ? 'أرقام موثّقة' : 'Verified Highlights'),
            )
            const items = Array.isArray(block.items)
              ? (block.items as Array<{ value?: string; label?: string }>)
              : []
            if (items.length === 0) return null

            return (
              <section key={key} className="border-b border-subtle bg-surface py-14 lg:py-20">
                <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <h2 className="mb-8 text-center text-2xl font-bold text-navy sm:text-3xl">
                    {heading}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((stat, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-subtle bg-canvas p-6 text-center shadow-2xs"
                      >
                        <p className="font-mono text-3xl font-bold text-oasis tabular-nums">
                          {stat.value}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-navy">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          case 'testimonial': {
            // Strictly enforce BR-010 written client permission gate before rendering testimonials publicly
            if (block.clientPermissionVerified !== true) return null
            const quoteText = String(block.quoteText || '')
            const clientName = String(block.clientName || '')
            const clientRole = String(block.clientRole || '')
            if (!quoteText || !clientName) return null

            return (
              <section key={key} className="border-b border-subtle bg-canvas-sand py-14 lg:py-20">
                <div className="mx-auto max-w-narrow px-4 text-center sm:px-6 lg:px-8">
                  <h2 className="sr-only">
                    {isAr ? 'شهادة عميل' : 'Client Testimonial'}
                  </h2>
                  <blockquote className="rounded-2xl border border-subtle bg-surface p-8 shadow-sm">
                    <p className="text-lg font-semibold leading-relaxed text-navy sm:text-xl">
                      “{quoteText}”
                    </p>
                    <footer className="mt-4 text-sm font-bold text-oasis">
                      {clientName}
                      {clientRole ? <span className="text-muted"> — {clientRole}</span> : null}
                    </footer>
                  </blockquote>
                </div>
              </section>
            )
          }

          case 'clientLogos': {
            const rawLogos = Array.isArray(block.logos)
              ? (block.logos as Array<{
                  clientName?: string
                  writtenPermissionVerified?: boolean
                }>)
              : []
            // Only display logos with verified written client permission (BR-010)
            const verifiedLogos = rawLogos.filter((l) => l.writtenPermissionVerified === true)
            if (verifiedLogos.length === 0) return null
            const heading = String(
              block.heading || (isAr ? 'شركاء النجاح' : 'Trusted Local Partners'),
            )

            return (
              <section key={key} className="border-b border-subtle bg-surface py-12">
                <div className="mx-auto max-w-main px-4 text-center sm:px-6 lg:px-8">
                  <h2 className="mb-6 text-sm font-bold tracking-wide text-muted">{heading}</h2>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {verifiedLogos.map((logo, idx) => (
                      <span
                        key={idx}
                        className="rounded-xl border border-subtle bg-canvas px-5 py-2.5 text-sm font-bold text-navy"
                      >
                        {logo.clientName}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          case 'imageGallery': {
            const heading = String(
              block.heading || (isAr ? 'معرض الصور' : 'Visual Gallery'),
            )
            const subheading = String(block.subheading || '')
            const images = Array.isArray(block.images)
              ? (block.images as Array<{
                  caption?: string
                  media?: { url?: string; alt?: string } | null
                }>)
              : []
            if (images.length === 0) return null

            return (
              <section key={key} className="border-b border-subtle bg-canvas py-14 lg:py-20">
                <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
                  <div className="mx-auto mb-8 max-w-2xl text-center">
                    <h2 className="text-2xl font-bold text-navy sm:text-3xl">{heading}</h2>
                    {subheading && <p className="mt-2 text-sm text-muted">{subheading}</p>}
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {images.map((img, idx) => {
                      const url =
                        typeof img.media === 'object' && img.media?.url ? img.media.url : ''
                      const alt =
                        (typeof img.media === 'object' && img.media?.alt) ||
                        img.caption ||
                        heading
                      return (
                        <figure
                          key={idx}
                          className="overflow-hidden rounded-2xl border border-subtle bg-surface p-3 shadow-xs"
                        >
                          {url && (
                            <img
                              src={url}
                              alt={alt}
                              loading="lazy"
                              className="aspect-[4/3] w-full rounded-xl object-cover"
                            />
                          )}
                          {img.caption && (
                            <figcaption className="mt-2.5 text-center text-xs font-medium text-muted">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          }

          case 'contactSection': {
            const eyebrow = String(
              block.eyebrow || (isAr ? 'تواصل معنا' : 'Get in Touch'),
            )
            const heading = String(
              block.heading ||
                (isAr
                  ? 'احصل على تحليل مجاني لمحلّك أو تواصل معنا مباشرة'
                  : 'Request a free shop audit or contact our team directly'),
            )
            const subheading = String(block.subheading || '')

            return (
              <section key={key} className="border-b border-subtle bg-canvas-sand py-14 lg:py-20">
                <div className="mx-auto max-w-main px-4 text-center sm:px-6 lg:px-8">
                  <span className="text-xs font-bold text-oasis">{eyebrow}</span>
                  <h2 className="mt-1.5 text-2xl font-bold text-navy sm:text-3xl">{heading}</h2>
                  {subheading && (
                    <p className="mx-auto mt-2.5 max-w-xl text-sm text-muted sm:text-base">
                      {subheading}
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
                    <Button href={whatsappUrl} variant="whatsapp" external>
                      <WhatsAppIcon />
                      <span>{isAr ? 'راسلنا واتساب' : 'Chat on WhatsApp'}</span>
                    </Button>
                    <Button href={localizePath('/free-audit', locale)} variant="primary">
                      {isAr ? 'اطلب تحليل مجاني' : 'Request Free Audit'}
                    </Button>
                  </div>
                </div>
              </section>
            )
          }

          default:
            return null
        }
      })}
    </>
  )
}
