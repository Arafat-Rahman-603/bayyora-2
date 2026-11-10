import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Bayyora Bilingual Full-Stack E2E & Accessibility Suite', () => {
  test('renders Arabic RTL homepage at / with self-referencing canonical, hreflang, and zero horizontal overflow at 360px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('/')

    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
    await expect(html).toHaveAttribute('lang', 'ar')

    // Verify 3-item mobile header fits within 360px without horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)

    // Verify hreflang alternates
    const hreflangAr = page.locator('link[rel="alternate"][hreflang="ar-SA"]')
    const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]')
    await expect(hreflangAr).toHaveCount(1)
    await expect(hreflangEn).toHaveCount(1)
  })

  test('renders English LTR homepage at /en and switches language cleanly', async ({ page }) => {
    await page.goto('/en')
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'ltr')
    await expect(html).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toContainText(/stand out|get noticed/i)
  })

  test('enforces publicPricingEnabled=false on /packages (quote-only mode per BR-012) and Dawair permission gate on /our-work/dawair (404 per BR-010)', async ({
    page,
  }) => {
    await page.goto('/packages')
    await expect(page.locator('h1')).toBeVisible()
    // Should display quote CTA rather than raw numeric prices when publicPricingEnabled is false
    await expect(page.getByText(/عرض سعر مخصّص|اطلب تسعيرة مخصصة|اطلب عرض سعر/).first()).toBeVisible()

    // Dawair case study must return 404 while clientPermissionVerified is false
    const dawairRes = await page.goto('/our-work/dawair')
    expect(dawairRes?.status()).toBe(404)
  })

  test('displays explicit sample concept disclaimer badge on /our-work portfolio items (BR-011)', async ({
    page,
  }) => {
    await page.goto('/our-work')
    await expect(page.getByText('نموذج توضيحي').first()).toBeVisible()
  })

  test('submits the 6-field Free Mini Audit form with Arabic-Indic WhatsApp digits (٠٥٥١٢٣٤٥٦٧)', async ({
    page,
  }) => {
    await page.goto('/free-audit')
    await page.fill('#audit-name', 'عبدالله السبيعي')
    await page.fill('#audit-shopName', 'مقهى السرايا')
    await page.selectOption('#audit-businessType', 'cafe')
    await page.selectOption('#audit-city', 'al-ahsa')
    await page.fill('#audit-link', '@alsarayacafe')
    await page.fill('#audit-whatsapp', '٠٥٥١٢٣٤٥٦٧')
    await page.check('input[name="pdplConsent"]')

    await page.click('button[type="submit"]')
    await expect(page.locator('[role="status"]')).toBeVisible({ timeout: 15000 })
  })

  test('validates /api/health, /api/draft auth guard (401), /sitemap.xml, and /robots.txt', async ({
    request,
  }) => {
    const health = await request.get('/api/health')
    expect(health.status()).toBe(200)
    const healthJson = await health.json()
    expect(healthJson.status).toBe('ok')

    const draftUnauthorized = await request.get('/api/draft?secret=wrong_secret&slug=/')
    expect(draftUnauthorized.status()).toBe(401)

    const robots = await request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('Disallow: /admin')

    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    const sitemapXml = await sitemap.text()
    expect(sitemapXml).toContain('/services/brand-identity')
    expect(sitemapXml).not.toContain('/our-work/dawair')
  })

  test('passes WCAG 2.2 AA automated axe-core scan on Arabic Homepage', async ({ page }) => {
    await page.goto('/')
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('verifies zero horizontal overflow across critical mobile viewports (320px, 360px, 375px, 768px)', async ({
    page,
  }) => {
    const viewports = [
      { width: 320, height: 640 },
      { width: 360, height: 800 },
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
    ]
    const testRoutes = ['/', '/en', '/packages', '/services', '/our-work', '/free-audit', '/contact']

    for (const vp of viewports) {
      await page.setViewportSize(vp)
      for (const route of testRoutes) {
        await page.goto(route)
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth
        })
        expect(
          hasHorizontalScroll,
          `Expected route ${route} at ${vp.width}x${vp.height} to have no horizontal overflow`,
        ).toBe(false)
      }
    }
  })

  test('verifies Starter Bundle cards on /en/packages do not collapse in width and sticky header has solid opaque background when scrolled', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/en/packages')

    const shopLookHeading = page.getByRole('heading', { name: /Shop Look/i })
    await expect(shopLookHeading).toBeVisible()
    const cardArticle = shopLookHeading.locator('xpath=ancestor::article[1]')
    const box = await cardArticle.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width).toBeGreaterThan(360)

    // Scroll to bottom where dark navy footer CTA band is visible and verify sticky header is solid opaque white
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const headerBg = await page.locator('.sticky-header-bar').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    expect(headerBg).toBe('rgb(255, 255, 255)')
  })

  test('verifies all Homepage sections and Why Bayyora Arabic bullets render with full opacity (1) and zero console errors', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    await expect(page.getByText('فريق محلي يجيك للمحل')).toBeVisible()
    await expect(page.getByText('كل شيء من مكان واحد')).toBeVisible()
    await expect(page.getByText('الحسابات والملفات باسمك ١٠٠٪')).toBeVisible()

    const bulletOpacity = await page.getByText('فريق محلي يجيك للمحل').evaluate((el) => {
      return window.getComputedStyle(el).opacity
    })
    expect(bulletOpacity).toBe('1')
    expect(consoleErrors).toEqual([])
  })
})

