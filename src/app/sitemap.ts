import type { MetadataRoute } from 'next'
import {
  getAllPublishedCities,
  getAllPublishedServices,
  getPageBySlug,
  getPublicProjects,
  getPublishedPosts,
} from '@/lib/data-queries'
import { buildCanonicalUrl } from '@/seo/metadata'
import { localizePath, SYSTEM_PAGE_SLUGS } from '@/i18n/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  const addBilingualEntry = (
    barePath: string,
    priority: number,
    changeFrequency: 'daily' | 'weekly' | 'monthly',
    lastModified?: string | Date,
  ) => {
    const arUrl = buildCanonicalUrl(localizePath(barePath, 'ar'))
    const enUrl = buildCanonicalUrl(localizePath(barePath, 'en'))
    const modDate = lastModified ? new Date(lastModified) : new Date()

    const alternates = {
      languages: {
        'ar-SA': arUrl,
        en: enUrl,
        'x-default': arUrl,
      },
    }

    entries.push({
      url: arUrl,
      lastModified: modDate,
      changeFrequency,
      priority,
      alternates,
    })

    entries.push({
      url: enUrl,
      lastModified: modDate,
      changeFrequency,
      priority: Math.max(0.5, Number((priority - 0.05).toFixed(2))),
      alternates,
    })
  }

  // 1. Core & Legal Pages (excluding any page marked seo.noIndex = true)
  for (const slug of SYSTEM_PAGE_SLUGS) {
    try {
      const pageDoc = await getPageBySlug(slug, 'ar')
      if (pageDoc && !pageDoc.seo?.noIndex) {
        const barePath = slug === 'home' ? '/' : `/${slug}`
        const priority =
          slug === 'home'
            ? 1.0
            : slug === 'free-audit' || slug === 'services' || slug === 'packages'
              ? 0.9
              : 0.75
        addBilingualEntry(barePath, priority, 'weekly', pageDoc.updatedAt)
      } else if (!pageDoc) {
        // Fallback static entry if page doc not queried
        const barePath = slug === 'home' ? '/' : `/${slug}`
        addBilingualEntry(barePath, slug === 'home' ? 1.0 : 0.8, 'weekly')
      }
    } catch {
      const barePath = slug === 'home' ? '/' : `/${slug}`
      addBilingualEntry(barePath, slug === 'home' ? 1.0 : 0.8, 'weekly')
    }
  }

  // 2. Blog Archive Index (/blog and /en/blog)
  addBilingualEntry('/blog', 0.8, 'weekly')

  // 3. All Published Services (/services/[slug])
  try {
    const services = await getAllPublishedServices('ar')
    for (const svc of services) {
      if (!svc.seo?.noIndex) {
        addBilingualEntry(`/services/${svc.slug}`, 0.9, 'weekly', svc.updatedAt)
      }
    }
  } catch {
    // Services table uninitialized or unreachable
  }

  // 4. All Published Cities (/city/[slug])
  try {
    const cities = await getAllPublishedCities('ar')
    for (const city of cities) {
      if (!city.seo?.noIndex) {
        addBilingualEntry(`/city/${city.slug}`, 0.85, 'weekly', city.updatedAt)
      }
    }
  } catch {
    // Cities table uninitialized or unreachable
  }

  // 5. All Published Blog Posts (/blog/[slug])
  try {
    const posts = await getPublishedPosts('ar')
    for (const post of posts) {
      if (!post.seo?.noIndex) {
        addBilingualEntry(`/blog/${post.slug}`, 0.75, 'monthly', post.updatedAt)
      }
    }
  } catch {
    // Posts table uninitialized or unreachable
  }

  // 6. Permission-Verified Full Case Study Pages (/our-work/[slug])
  try {
    const projects = await getPublicProjects('ar')
    for (const proj of projects) {
      if (
        proj.hasFullCaseStudyPage &&
        (proj.isSampleConcept || proj.clientPermissionVerified) &&
        !proj.seo?.noIndex
      ) {
        addBilingualEntry(`/our-work/${proj.slug}`, 0.8, 'monthly', proj.updatedAt)
      }
    }
  } catch {
    // Projects table uninitialized or unreachable
  }

  return entries
}

