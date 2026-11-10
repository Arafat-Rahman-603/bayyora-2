import React from 'react'
import { notFound } from 'next/navigation'
import {
  getLocaleDirection,
  getHtmlLang,
  isValidLocale,
  locales,
  type Locale,
} from '@/i18n/config'
import {
  getAllPublishedCities,
  getAllPublishedServices,
  getLayoutGlobals,
} from '@/lib/data-queries'
import { hexToRgbChannels } from '@/lib/contrast-validator'
import { buildWhatsAppUrl } from '@/integrations/whatsapp'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp'
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner'
import { buildOrganizationJsonLd, JsonLd } from '@/seo/json-ld'
import '../globals.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const dir = getLocaleDirection(locale)
  const lang = getHtmlLang(locale)

  const [{ siteSettings, headerNav, footerNav, themeSettings, uiStrings }, services, cities] =
    await Promise.all([
      getLayoutGlobals(locale),
      getAllPublishedServices(locale),
      getAllPublishedCities(locale),
    ])

  const whatsappUrl = buildWhatsAppUrl(
    siteSettings?.whatsappNumber,
    siteSettings?.globalWhatsappPrefillMessage,
  )

  const canvasHex = themeSettings?.canvasColor || '#F7F3EB'
  const canvasSandHex = themeSettings?.canvasSandColor || '#EFE9DC'
  const navyHex = themeSettings?.navyColor || '#0D2235'
  const accentHex = themeSettings?.accentColor || '#F2A541'
  const onAccentHex = themeSettings?.onAccentColor || '#0D2235'
  const oasisHex = themeSettings?.oasisColor || '#136F63'
  const inkHex = themeSettings?.inkColor || '#141A21'
  const inputBorderHex = themeSettings?.inputBorderColor || '#7A869A'

  const radiusPreset = String(themeSettings?.borderRadiusPreset || 'rounded_modern')
  const radiusCard =
    radiusPreset === 'soft_architectural'
      ? '0.5rem'
      : radiusPreset === 'rounded_modern'
        ? '1rem'
        : '0.75rem'
  const radiusButton =
    radiusPreset === 'soft_architectural'
      ? '0.375rem'
      : radiusPreset === 'rounded_modern'
        ? '0.75rem'
        : '0.625rem'

  const themeStyle: React.CSSProperties = {
    '--color-canvas': canvasHex,
    '--rgb-canvas': hexToRgbChannels(canvasHex, '247 243 235'),
    '--color-canvas-sand': canvasSandHex,
    '--rgb-canvas-sand': hexToRgbChannels(canvasSandHex, '239 233 220'),
    '--color-navy': navyHex,
    '--rgb-navy': hexToRgbChannels(navyHex, '13 34 53'),
    '--color-accent': accentHex,
    '--rgb-accent': hexToRgbChannels(accentHex, '242 165 65'),
    '--color-on-accent': onAccentHex,
    '--rgb-on-accent': hexToRgbChannels(onAccentHex, '13 34 53'),
    '--color-oasis': oasisHex,
    '--rgb-oasis': hexToRgbChannels(oasisHex, '19 111 99'),
    '--color-ink': inkHex,
    '--rgb-ink': hexToRgbChannels(inkHex, '20 26 33'),
    '--color-border-input': inputBorderHex,
    '--rgb-border-input': hexToRgbChannels(inputBorderHex, '122 134 154'),
    '--radius-card': radiusCard,
    '--radius-button': radiusButton,
    '--font-sans': 'var(--font-arabic)',
  } as React.CSSProperties

  const navItems = Array.isArray(headerNav?.navItems)
    ? headerNav.navItems.map((i) => ({
        label: String(i.label || ''),
        href: String(i.href || '/'),
        linkType: (i.linkType as 'standard' | 'services_dropdown') || 'standard',
        isVisible: i.isVisible !== false,
      }))
    : []

  return (
    <html
      lang={lang}
      dir={dir}
      style={themeStyle}
    >
      <head>
        <JsonLd data={buildOrganizationJsonLd(locale, siteSettings)} />
      </head>
      <body className="flex min-h-screen flex-col bg-canvas text-ink antialiased">
        {/* Skip to Main Content Link (WCAG 2.2 SC 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-accent focus:shadow-xl"
        >
          {locale === 'ar' ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content'}
        </a>

        <Header
          locale={locale}
          navItems={navItems}
          services={services.map((s) => ({
            slug: s.slug,
            name: s.name,
            shortDescription: s.shortDescription,
            iconName: s.iconName,
          }))}
          primaryCta={{
            label:
              headerNav?.primaryCta?.label ||
              (locale === 'ar' ? 'اطلب تحليل مجاني' : 'Free mini audit'),
            mobileShortLabel:
              headerNav?.primaryCta?.mobileShortLabel ||
              (locale === 'ar' ? 'تحليل مجاني' : 'Free Audit'),
            destination: headerNav?.primaryCta?.destination || '/free-audit',
          }}
          languageSwitcher={{
            enabled: headerNav?.languageSwitcher?.enabled !== false,
            arLabel: headerNav?.languageSwitcher?.arLabel || 'عربي',
            enLabel: headerNav?.languageSwitcher?.enLabel || 'EN',
          }}
          mobileDrawer={{
            whatsappButtonLabel:
              headerNav?.mobileDrawer?.whatsappButtonLabel ||
              (locale === 'ar' ? 'راسلنا واتساب مباشرة' : 'Chat on WhatsApp'),
            workingHoursNote:
              headerNav?.mobileDrawer?.workingHoursNote ||
              (locale === 'ar'
                ? 'الأحد – الخميس، ٩ ص إلى ٦ م'
                : 'Sun – Thu, 9 AM to 6 PM'),
          }}
          whatsappUrl={whatsappUrl}
          announcementBar={siteSettings?.announcementBar}
        />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer
          locale={locale}
          siteSettings={siteSettings || {}}
          footerNav={footerNav || {}}
          services={services.map((s) => ({ slug: s.slug, name: s.name }))}
          cities={cities.map((c) => ({ slug: c.slug, name: c.name }))}
          whatsappUrl={whatsappUrl}
        />

        <FloatingWhatsApp locale={locale} whatsappUrl={whatsappUrl} />

        <CookieConsentBanner
          locale={locale}
          message={uiStrings?.cookieBannerUi?.message}
          acceptLabel={uiStrings?.cookieBannerUi?.acceptLabel}
          essentialOnlyLabel={uiStrings?.cookieBannerUi?.essentialOnlyLabel}
        />
      </body>
    </html>
  )
}

