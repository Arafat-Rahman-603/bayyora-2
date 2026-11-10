import { NextResponse, type NextRequest } from 'next/server'

/**
 * Bilingual Routing Middleware ('as-needed' prefix):
 * - Arabic (default locale) lives at '/' and '/services/...' (internally rewritten to '/ar' and '/ar/services/...')
 * - Explicit '/ar' or '/ar/...' requests are permanently redirected (308) to '/' or '/...' to prevent duplicate URLs
 * - English lives at '/en' and '/en/...'
 * - Strictly excludes '/api', '/_next', and static assets.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Skip API routes, Next.js internals, and files with extensions
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 1. Canonical Redirect: If a request explicitly starts with '/ar' or '/ar/', 308 redirect to bare '/' path
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    const stripped = pathname.slice(3) || '/'
    const cleanTarget = stripped === '/' ? '/' : stripped.replace(/\/+$/, '')
    const url = request.nextUrl.clone()
    url.pathname = cleanTarget
    return NextResponse.redirect(url, 308)
  }

  // 2. English Locale: '/en' or '/en/...' passes through directly to src/app/(frontend)/[locale] with locale='en'
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-bayyora-locale', 'en')
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // 3. Default Arabic Locale: Rewrite bare '/' or '/services/...' internally to '/ar' or '/ar/services/...'
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = pathname === '/' ? '/ar' : `/ar${pathname}`
  rewriteUrl.search = search

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-bayyora-locale', 'ar')

  return NextResponse.rewrite(rewriteUrl, {
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)'],
}
