import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock } from 'lucide-react'
import {
  getLocaleDirection,
  isValidLocale,
  localizePath,
  type Locale,
} from '@/i18n/config'
import { getLayoutGlobals, getPublishedPosts } from '@/lib/data-queries'
import { buildPageMetadata } from '@/seo/metadata'
import { buildBreadcrumbJsonLd, JsonLd } from '@/seo/json-ld'
import { RisingLineSvg } from '@/components/domain/RisingLineSvg'
import { Button } from '@/components/ui/Button'

interface BlogIndexProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: BlogIndexProps): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'ar'

  const { siteSettings, uiStrings } = await getLayoutGlobals(locale)
  const blogUi = uiStrings?.blogIndexPage

  return buildPageMetadata({
    locale,
    barePath: '/blog',
    title:
      blogUi?.title ||
      (locale === 'ar' ? 'مدونة بيّورا — نصائح للمحلات' : 'Bayyora Blog — Guides for Local Shops'),
    description:
      blogUi?.subtitle ||
      siteSettings?.defaultMetaDescription ||
      '',
    seo: blogUi?.seo,
    defaultSuffix: siteSettings?.defaultMetaTitleSuffix || undefined,
  })
}

export default async function BlogIndexPage({ params }: BlogIndexProps) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale
  const isAr = locale === 'ar'
  const dir = getLocaleDirection(locale)

  const [{ uiStrings }, posts] = await Promise.all([
    getLayoutGlobals(locale),
    getPublishedPosts(locale),
  ])

  const blogUi = uiStrings?.blogIndexPage
  const breadcrumbs = buildBreadcrumbJsonLd(locale, [
    { name: isAr ? 'الرئيسية' : 'Home', barePath: '/' },
    { name: isAr ? 'المدونة' : 'Blog', barePath: '/blog' },
  ])

  return (
    <>
      <JsonLd data={breadcrumbs} />

      <section className="border-b border-subtle bg-canvas py-12 sm:py-16">
        <div className="mx-auto max-w-main px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-3 flex justify-center">
            <RisingLineSvg dir={dir} variant="saffron" width={96} height={18} />
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold text-navy sm:text-4xl">
            {blogUi?.title ||
              (isAr
                ? 'مدونة بيّورا — نصائح عملية لأصحاب المحلات والمشاريع'
                : 'Bayyora Blog — Practical Guides for Local Shop Owners')}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted">
            {blogUi?.subtitle}
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-main px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col justify-between rounded-2xl border border-subtle bg-surface p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-muted">
                    <span>{post.authorName}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5 text-oasis" />
                      <span>
                        {post.readingTimeMinutes || 4} {isAr ? 'دقائق قراءة' : 'min read'}
                      </span>
                    </span>
                  </div>

                  {Array.isArray(post.categories) && post.categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.categories.map((cat: unknown, cIdx: number) => {
                        const catName =
                          typeof cat === 'object' && cat !== null && 'name' in cat
                            ? String((cat as { name?: string }).name || '')
                            : ''
                        if (!catName) return null
                        return (
                          <span
                            key={cIdx}
                            className="rounded-full bg-canvas-sand px-2.5 py-0.5 text-[11px] font-bold text-navy"
                          >
                            {catName}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  <h2 className="mt-3 text-xl font-bold leading-snug text-navy">
                    <Link
                      href={localizePath(`/blog/${post.slug}`, locale)}
                      className="hover:text-oasis"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 border-t border-subtle pt-4">
                  <Button
                    href={localizePath(`/blog/${post.slug}`, locale)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {blogUi?.readMoreLabel ||
                      (isAr ? 'اقرأ المقال كاملًا' : 'Read full article')}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

