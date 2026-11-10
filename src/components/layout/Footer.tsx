import React from 'react'
import Link from 'next/link'
import { BayyoraLogo } from '@/components/domain/BayyoraLogo'
import { RisingLineSvg } from '@/components/domain/RisingLineSvg'
import { Button, WhatsAppIcon } from '@/components/ui/Button'
import { getLocaleDirection, localizePath, type Locale } from '@/i18n/config'

interface FooterProps {
  locale: Locale
  siteSettings: {
    whatsappNumber?: string | null
    phoneNumber?: string | null
    businessEmail?: string | null
    workingHours?: string | null
    serviceAreasSummary?: string | null
    instagramUrl?: string | null
    snapchatUrl?: string | null
    tiktokUrl?: string | null
    xUrl?: string | null
    legalEntityName?: string | null
    commercialRegistrationNumber?: string | null
    vatRegistrationNumber?: string | null
    saudiBusinessCenterAuthId?: string | null
    saudiBusinessCenterUrl?: string | null
  }
  footerNav: {
    brandDescription?: string | null
    servicesColumnTitle?: string | null
    companyColumnTitle?: string | null
    citiesColumnTitle?: string | null
    contactColumnTitle?: string | null
    companyLinks?: Array<{ label: string; href: string }> | null
    footerCtaBand?: {
      enabled?: boolean | null
      heading?: string | null
      subheading?: string | null
      whatsappCtaLabel?: string | null
      auditCtaLabel?: string | null
    } | null
    legalLinks?: Array<{ label: string; href: string }> | null
    copyrightText?: string | null
  }
  services: Array<{ slug: string; name: string }>
  cities: Array<{ slug: string; name: string }>
  whatsappUrl: string
}

export function Footer({
  locale,
  siteSettings,
  footerNav,
  services,
  cities,
  whatsappUrl,
}: FooterProps) {
  const dir = getLocaleDirection(locale)
  const ctaBand = footerNav.footerCtaBand

  return (
    <footer className="section-navy bg-navy text-white border-t border-white/10">
      {/* Pre-Footer Najd Night Conversion Band */}
      {ctaBand?.enabled !== false && (
        <div className="border-b border-white/10 bg-navy-elevated/60 py-14 lg:py-20">
          <div className="mx-auto max-w-main px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-3 flex justify-center">
              <RisingLineSvg dir={dir} variant="saffron" width={140} height={24} />
            </div>
            <h2 className="mx-auto max-w-2xl text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {ctaBand?.heading ||
                (locale === 'ar' ? 'جاهز تاخذ خطوة لفوق؟' : 'Ready to take one step up?')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/85 sm:text-lg">
              {ctaBand?.subheading ||
                (locale === 'ar'
                  ? 'اطلب تحليل مجاني لمحلّك ونرسل لك ٣ ملاحظات عملية واضحة على الواتساب خلال ٤٨ ساعة.'
                  : 'Request a free mini audit for your shop and receive 3 actionable improvements on WhatsApp within 48 hours.')}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
              <Button href={whatsappUrl} variant="whatsapp" size="lg" external>
                <WhatsAppIcon />
                <span>
                  {ctaBand?.whatsappCtaLabel ||
                    (locale === 'ar' ? 'راسلنا واتساب' : 'Chat on WhatsApp')}
                </span>
              </Button>
              <Button
                href={localizePath('/free-audit', locale)}
                variant="primary"
                size="lg"
              >
                {ctaBand?.auditCtaLabel ||
                  (locale === 'ar' ? 'اطلب تحليل مجاني' : 'Request a free audit')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main 4-Column Footer */}
      <div className="mx-auto max-w-main px-4 pt-14 pb-24 sm:px-6 lg:px-8 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand Identity & Saudi Legal Credentials */}
          <div className="lg:col-span-4">
            <BayyoraLogo locale={locale} variant="light-on-dark" showTagline />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
              {footerNav.brandDescription}
            </p>

            {/* Saudi Legal & Commercial Registration Credentials (MCI / ZATCA / Saudi Business Center) */}
            <div className="mt-6 rounded-xl border border-white/15 bg-white/5 p-4 text-xs text-white/80 space-y-1.5">
              {siteSettings.legalEntityName && (
                <p className="font-bold text-white">{siteSettings.legalEntityName}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {siteSettings.commercialRegistrationNumber && (
                  <span>
                    {locale === 'ar' ? 'السجل التجاري: ' : 'CR: '}
                    <span dir="ltr" className="font-mono">
                      {siteSettings.commercialRegistrationNumber}
                    </span>
                  </span>
                )}
                {siteSettings.vatRegistrationNumber && (
                  <span>
                    {locale === 'ar' ? 'الرقم الضريبي: ' : 'VAT: '}
                    <span dir="ltr" className="font-mono">
                      {siteSettings.vatRegistrationNumber}
                    </span>
                  </span>
                )}
              </div>
              {siteSettings.saudiBusinessCenterAuthId && (
                <p>
                  {locale === 'ar'
                    ? 'موثّق في المركز السعودي للأعمال: '
                    : 'Verified by Saudi Business Center: '}
                  {siteSettings.saudiBusinessCenterUrl ? (
                    <a
                      href={siteSettings.saudiBusinessCenterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className="font-mono text-accent underline underline-offset-2 hover:text-white"
                    >
                      {siteSettings.saudiBusinessCenterAuthId}
                    </a>
                  ) : (
                    <span dir="ltr" className="font-mono text-accent">
                      {siteSettings.saudiBusinessCenterAuthId}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Column 2: All 9 Services */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold tracking-wide text-accent">
              {footerNav.servicesColumnTitle || (locale === 'ar' ? 'خدماتنا' : 'Services')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((svc) => (
                <li key={svc.slug}>
                  <Link
                    href={localizePath(`/services/${svc.slug}`, locale)}
                    className="text-white/80 transition-colors hover:text-white hover:underline"
                  >
                    {svc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company Links & Eastern Province Cities */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold tracking-wide text-accent">
              {footerNav.companyColumnTitle || (locale === 'ar' ? 'بيّورا' : 'Bayyora')}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {(footerNav.companyLinks || []).map((link) => {
                const fallbackLabels: Record<string, { ar: string; en: string }> = {
                  '/packages': { ar: 'الباقات والأسعار', en: 'Packages & Retainers' },
                  '/our-work': { ar: 'أعمالنا ونماذج قبل وبعد', en: 'Portfolio & Case Studies' },
                  '/about': { ar: 'من نحن وقصتنا', en: 'About Bayyora' },
                  '/faq': { ar: 'الأسئلة الشائعة', en: 'Frequently Asked Questions' },
                  '/blog': { ar: 'المدونة ونصائح التسويق', en: 'Blog & Local Guides' },
                  '/free-audit': { ar: 'تحليل مجاني لمحلّك', en: 'Free Mini Audit' },
                }
                const label = link.label || fallbackLabels[link.href]?.[locale] || (locale === 'ar' ? 'صفحة' : 'Page')

                return (
                  <li key={link.href}>
                    <Link
                      href={localizePath(link.href, locale)}
                      aria-label={label}
                      className="text-white/80 transition-colors hover:text-white hover:underline"
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <h3 className="mt-7 text-sm font-bold tracking-wide text-accent">
              {footerNav.citiesColumnTitle ||
                (locale === 'ar' ? 'مدن نخدمها' : 'Cities We Serve')}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={localizePath(`/city/${city.slug}`, locale)}
                    className="text-white/80 transition-colors hover:text-white hover:underline"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold tracking-wide text-accent">
              {footerNav.contactColumnTitle ||
                (locale === 'ar' ? 'تواصل معنا' : 'Get in Touch')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-white hover:text-accent"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  <span dir="ltr">{siteSettings.phoneNumber || '+966 50 000 0000'}</span>
                </a>
              </li>
              {siteSettings.businessEmail && (
                <li>
                  <a
                    href={`mailto:${siteSettings.businessEmail}`}
                    dir="ltr"
                    className="inline-block font-mono text-white/80 hover:text-white"
                  >
                    {siteSettings.businessEmail}
                  </a>
                </li>
              )}
              {siteSettings.workingHours && (
                <li className="text-xs text-white/75">{siteSettings.workingHours}</li>
              )}
              {siteSettings.serviceAreasSummary && (
                <li className="text-xs text-white/75">{siteSettings.serviceAreasSummary}</li>
              )}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {siteSettings.instagramUrl && (
                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/15"
                >
                  Instagram
                </a>
              )}
              {siteSettings.snapchatUrl && (
                <a
                  href={siteSettings.snapchatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Snapchat"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/15"
                >
                  Snapchat
                </a>
              )}
              {siteSettings.tiktokUrl && (
                <a
                  href={siteSettings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/15"
                >
                  TikTok
                </a>
              )}
              {siteSettings.xUrl && (
                <a
                  href={siteSettings.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/15"
                >
                  X
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/75 sm:flex-row text-center sm:text-start">
          <p>{footerNav.copyrightText || (locale === 'ar' ? '© ٢٠٢٦ بيّورا. جميع الحقوق محفوظة.' : '© 2026 Bayyora. All rights reserved.')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {(footerNav.legalLinks || []).map((item) => {
              const fallbackLabel =
                item.href === '/privacy'
                  ? locale === 'ar'
                    ? 'سياسة الخصوصية (PDPL)'
                    : 'Privacy Policy (PDPL)'
                  : item.href === '/terms'
                    ? locale === 'ar'
                      ? 'الشروط والأحكام'
                      : 'Terms & Conditions'
                    : locale === 'ar'
                      ? 'سياسة الإلغاء والاسترجاع'
                      : 'Refund Policy'
              const label = item.label || fallbackLabel

              return (
                <Link
                  key={item.href}
                  href={localizePath(item.href, locale)}
                  className="hover:text-white hover:underline"
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

