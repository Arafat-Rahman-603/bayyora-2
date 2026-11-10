import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Clock } from 'lucide-react'
import { isValidLocale, localizePath, type Locale } from '@/i18n/config'
import { getLayoutGlobals, getPostBySlug, getPublishedPosts } from '@/lib/data-queries'
import { buildPageMetadata } from '@/seo/metadata'
import { buildArticleJsonLd, buildBreadcrumbJsonLd, JsonLd } from '@/seo/json-ld'
import { Button } from '@/components/ui/Button'

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'ar'

  const [post, { siteSettings }] = await Promise.all([
    getPostBySlug(slug, locale),
    getLayoutGlobals(locale),
  ])

  if (!post) {
    return {
      title: locale === 'ar' ? 'المقال غير موجود | بيّورا' : 'Article Not Found | Bayyora',
      robots: { index: false, follow: false },
    }
  }

  return buildPageMetadata({
    locale,
    barePath: `/blog/${slug}`,
    title: post.title,
    description: post.excerpt,
    seo: post.seo,
    defaultSuffix: siteSettings?.defaultMetaTitleSuffix || undefined,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale
  const isAr = locale === 'ar'

  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug, locale),
    getPublishedPosts(locale),
  ])
  if (!post) {
    notFound()
  }

  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  const breadcrumbs = buildBreadcrumbJsonLd(locale, [
    { name: isAr ? 'الرئيسية' : 'Home', barePath: '/' },
    { name: isAr ? 'المدونة' : 'Blog', barePath: '/blog' },
    { name: post.title, barePath: `/blog/${post.slug}` },
  ])

  const articleSchema = buildArticleJsonLd(locale, {
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.authorName,
  })

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={articleSchema} />

      <article className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-narrow px-4 sm:px-6">
          <nav
            aria-label={isAr ? 'مسار الصفحة' : 'Breadcrumb'}
            className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted"
          >
            <Link href={localizePath('/', locale)} className="hover:text-navy">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={localizePath('/blog', locale)} className="hover:text-navy">
              {isAr ? 'المدونة' : 'Blog'}
            </Link>
            <span>/</span>
            <span className="text-navy font-bold line-clamp-1">{post.title}</span>
          </nav>

          <header className="border-b border-subtle pb-8">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted">
              <span>{post.authorName}</span>
              <span className="inline-flex items-center gap-1 text-oasis">
                <Clock aria-hidden="true" className="h-3.5 w-3.5" />
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

            <h1 className="mt-3 text-2xl font-bold leading-tight text-navy sm:text-3xl lg:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {post.excerpt}
            </p>
          </header>

          {/* Actionable Takeaways Box */}
          {Array.isArray(post.keyTakeaways) && post.keyTakeaways.length > 0 && (
            <div className="my-8 rounded-2xl border-2 border-oasis/30 bg-surface p-6 shadow-xs">
              <h2 className="text-base font-bold text-navy sm:text-lg">
                {isAr
                  ? 'خلاصة الخطوات العملية لمحلّك:'
                  : 'Key Actionable Takeaways for Your Shop:'}
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm text-ink">
                {post.keyTakeaways.map((k, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-oasis"
                    />
                    <span>{k.point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Body Paragraphs */}
          <div className="mt-8 space-y-5 rounded-2xl border border-subtle bg-surface p-6 sm:p-10">
            {String(post.bodyContent || '').split('\n\n').map((para: string, idx: number) => (
              <p
                key={idx}
                className="text-base leading-relaxed text-ink whitespace-pre-line"
              >
                {para.trim()}
              </p>
            ))}
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-10 space-y-4">
              <h2 className="text-xl font-bold text-navy">
                {isAr ? 'مقالات ذات صلة لأصحاب المحلات:' : 'Related Guides for Shop Owners:'}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={localizePath(`/blog/${rp.slug}`, locale)}
                    className="rounded-2xl border border-subtle bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <h3 className="text-base font-bold text-navy hover:text-oasis">
                      {rp.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                      {rp.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Conversion Box */}
          <div className="mt-10 rounded-2xl bg-canvas-sand p-6 text-center sm:p-8">
            <h2 className="text-xl font-bold text-navy">
              {isAr
                ? 'تبغى نطبّق هذي الخطوات على محلّك؟'
                : 'Want our team to apply these steps to your shop?'}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {isAr
                ? 'اطلب التحليل المجاني لمحلّك وبنرسل لك توصيات مخصصة خلال ٤٨ ساعة.'
                : 'Request your free mini audit and get 3 custom fixes on WhatsApp within 48 hours.'}
            </p>
            <div className="mt-5 flex justify-center">
              <Button href={localizePath('/free-audit', locale)} variant="primary">
                {isAr ? 'اطلب تحليل مجاني لمحلّك' : 'Request Free Mini Audit'}
              </Button>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
