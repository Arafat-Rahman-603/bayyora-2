import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, localizePath, type Locale } from '@/i18n/config'
import { getCaseStudyProjectBySlug, getLayoutGlobals } from '@/lib/data-queries'
import { buildPageMetadata } from '@/seo/metadata'
import { buildBreadcrumbJsonLd, JsonLd } from '@/seo/json-ld'
import { BeforeAfterSlider } from '@/components/domain/BeforeAfterSlider'
import { Button } from '@/components/ui/Button'

interface CaseStudyPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'ar'

  const [project, { siteSettings }] = await Promise.all([
    getCaseStudyProjectBySlug(slug, locale),
    getLayoutGlobals(locale),
  ])

  if (!project) {
    return {
      title: locale === 'ar' ? 'الصفحة غير موجودة | بيّورا' : 'Page Not Found | Bayyora',
      robots: { index: false, follow: false },
    }
  }

  return buildPageMetadata({
    locale,
    barePath: `/our-work/${slug}`,
    title: project.title,
    description: project.summary,
    seo: project.seo,
    defaultSuffix: siteSettings?.defaultMetaTitleSuffix || undefined,
  })
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale
  const isAr = locale === 'ar'

  // Enforces BR-010: Dawair (clientPermissionVerified: false, _status: 'draft') returns null
  // for all public visitors, immediately triggering Next.js notFound() (404).
  const project = await getCaseStudyProjectBySlug(slug, locale)
  if (!project) {
    notFound()
  }

  const breadcrumbs = buildBreadcrumbJsonLd(locale, [
    { name: isAr ? 'الرئيسية' : 'Home', barePath: '/' },
    { name: isAr ? 'أعمالنا' : 'Our Work', barePath: '/our-work' },
    { name: project.title, barePath: `/our-work/${project.slug}` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <Link
              href={localizePath('/our-work', locale)}
              className="text-xs font-bold text-oasis hover:underline"
            >
              {isAr ? '→ العودة إلى معرض الأعمال' : '← Back to Our Work'}
            </Link>
            <h1 className="mt-3 text-3xl font-bold text-navy sm:text-4xl">{project.title}</h1>
            <p className="mt-3 max-w-2xl text-base text-muted">{project.summary}</p>
          </div>

        <BeforeAfterSlider
          locale={locale}
          project={{
            slug: project.slug,
            title: project.title,
            isSampleConcept: Boolean(project.isSampleConcept),
            cityTag: project.cityTag,
            summary: project.summary,
            beforeHeadline: project.beforeHeadline,
            afterHeadline: project.afterHeadline,
            beforeMetrics: project.beforeMetrics,
            afterMetrics: project.afterMetrics,
          }}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {project.challengeSummary && (
            <div className="rounded-2xl border border-subtle bg-surface p-6">
              <h2 className="text-lg font-bold text-navy">
                {isAr ? 'التحدي' : 'The Challenge'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {project.challengeSummary}
              </p>
            </div>
          )}
          {project.solutionSummary && (
            <div className="rounded-2xl border border-subtle bg-surface p-6">
              <h2 className="text-lg font-bold text-navy">
                {isAr ? 'الحل والتنفيذ' : 'What We Built'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {project.solutionSummary}
              </p>
            </div>
          )}
          {project.verifiedOutcomeSummary && (
            <div className="rounded-2xl border border-subtle bg-surface p-6">
              <h2 className="text-lg font-bold text-navy">
                {isAr ? 'النتيجة' : 'Verified Outcome'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {project.verifiedOutcomeSummary}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button href={localizePath('/free-audit', locale)} variant="primary">
            {isAr ? 'اطلب تحليل مجاني لمحلّك' : 'Request a Free Mini Audit'}
          </Button>
        </div>
      </div>
    </section>
    </>
  )
}

