'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Globe, Menu, X } from 'lucide-react'
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react'
import { BayyoraLogo } from '@/components/domain/BayyoraLogo'
import { Button, WhatsAppIcon } from '@/components/ui/Button'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { localizePath, stripLocaleFromPath, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

const EASE_OUT_QUART: [number, number, number, number] = [0.165, 0.84, 0.44, 1]

export interface HeaderServiceLink {
  slug: string
  name: string
  shortDescription: string
  iconName?: string | null
}

export interface HeaderNavItem {
  label: string
  href: string
  linkType?: 'standard' | 'services_dropdown' | null
  isVisible?: boolean | null
}

const DEFAULT_NAV_LABELS: Record<string, { ar: string; en: string }> = {
  '/': { ar: 'الرئيسية', en: 'Home' },
  '/services': { ar: 'خدماتنا', en: 'Services' },
  '/packages': { ar: 'الباقات', en: 'Packages' },
  '/our-work': { ar: 'أعمالنا', en: 'Our Work' },
  '/about': { ar: 'من نحن', en: 'About' },
  '/contact': { ar: 'تواصل معنا', en: 'Contact' },
  '/faq': { ar: 'الأسئلة الشائعة', en: 'FAQ' },
  '/blog': { ar: 'المدونة والنصائح', en: 'Blog & Guides' },
  '/free-audit': { ar: 'تحليل مجاني', en: 'Free Audit' },
}

function resolveNavLabel(href: string, label?: string | null, locale: Locale = 'ar'): string {
  if (label && label.trim().length > 0) return label
  return DEFAULT_NAV_LABELS[href]?.[locale] || (locale === 'ar' ? 'صفحة' : 'Page')
}

interface HeaderProps {
  locale: Locale
  navItems: HeaderNavItem[]
  services: HeaderServiceLink[]
  primaryCta: {
    label: string
    mobileShortLabel: string
    destination: string
  }
  languageSwitcher: {
    enabled: boolean
    arLabel: string
    enLabel: string
  }
  mobileDrawer: {
    whatsappButtonLabel: string
    workingHoursNote: string
  }
  whatsappUrl: string
  announcementBar?: {
    enabled?: boolean | null
    text?: string | null
    ctaLabel?: string | null
    ctaUrl?: string | null
  } | null
}

export function Header({
  locale,
  navItems,
  services,
  primaryCta,
  languageSwitcher,
  mobileDrawer,
  whatsappUrl,
  announcementBar,
}: HeaderProps) {
  const pathname = usePathname() || '/'
  const shouldReduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const drawerPanelRef = useRef<HTMLDivElement>(null)
  const drawerCloseBtnRef = useRef<HTMLButtonElement>(null)
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const { barePath } = stripLocaleFromPath(pathname)
  const alternateLocale: Locale = locale === 'ar' ? 'en' : 'ar'
  const alternateLocaleHref = localizePath(barePath, alternateLocale)

  // State-Aware Sticky Header + rAF-driven GPU-composited scroll progress bar (zero React re-renders per scroll frame)
  useEffect(() => {
    let rafId: number | null = null

    const updateScrollState = () => {
      rafId = null
      const y = window.scrollY
      const nextScrolled = y > 16
      setScrolled((prev) => (prev !== nextScrolled ? nextScrolled : prev))

      if (progressBarRef.current) {
        const docHeight =
          document.documentElement.scrollHeight - document.documentElement.clientHeight
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0
        progressBarRef.current.style.transform = `scaleX(${progress})`
      }
    }

    const onScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateScrollState)
      }
    }

    updateScrollState()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  // Close menus on route change
  useEffect(() => {
    setServicesOpen(false)
    setDrawerOpen(false)
  }, [pathname])

  // Close desktop dropdown on outside click or Escape key
  useEffect(() => {
    if (!servicesOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesOpen(false)
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [servicesOpen])

  // Focus trap & Escape handler for Mobile Drawer (WCAG 2.2 SC 2.1.2 & 2.4.3)
  useEffect(() => {
    if (!drawerOpen) return
    drawerCloseBtnRef.current?.focus()
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        hamburgerBtnRef.current?.focus()
        return
      }
      if (e.key === 'Tab' && drawerPanelRef.current) {
        const focusable = drawerPanelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [drawerOpen])

  const visibleNavItems = navItems.filter((item) => item.isVisible !== false)

  return (
    <LazyMotion features={domAnimation}>
      <header
        ref={headerRef}
        className={cn('sticky-header-container', scrolled && 'is-stuck')}
      >
        {/* Optional CMS-Managed Announcement Bar */}
        {announcementBar?.enabled && announcementBar.text && (
          <div className="section-navy bg-navy text-white border-b border-white/10 px-4 py-2 text-xs sm:text-sm">
            <div className="mx-auto flex max-w-main flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-white/95">{announcementBar.text}</p>
              {announcementBar.ctaLabel && announcementBar.ctaUrl && (
                <Link
                  href={localizePath(announcementBar.ctaUrl, locale)}
                  className="inline-flex items-center gap-1 font-bold text-accent underline underline-offset-4 transition-colors hover:text-white"
                >
                  {announcementBar.ctaLabel}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Main Sticky Header Bar — Solid Warm Canvas at top, Elevated White Surface when stuck */}
        <div
          className={cn(
            'sticky-header-bar relative w-full',
            scrolled ? 'bg-surface shadow-md' : 'bg-canvas',
          )}
        >
          <div className="mx-auto flex h-[74px] max-w-main items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            {/* Item 1: Brand Wordmark */}
            <BayyoraLogo locale={locale} showTagline />

            {/* Desktop Navigation (>= 1024px) */}
            <nav
              aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main Navigation'}
              className="hidden lg:flex lg:items-center lg:gap-1 xl:gap-2"
            >
              {visibleNavItems.map((item) => {
                const itemHref = localizePath(item.href, locale)
                const itemLabel = resolveNavLabel(item.href, item.label, locale)
                const isActive =
                  barePath === item.href ||
                  (item.href !== '/' && barePath.startsWith(`${item.href}/`))

                if (item.linkType === 'services_dropdown') {
                  return (
                    <div key={item.href} ref={dropdownRef} className="relative">
                      <button
                        type="button"
                        aria-expanded={servicesOpen}
                        aria-controls="desktop-services-menu"
                        aria-label={itemLabel}
                        onClick={() => setServicesOpen((prev) => !prev)}
                        className={cn(
                          'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-2.5 xl:px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-micro active:scale-[0.97]',
                          isActive || servicesOpen
                            ? 'bg-canvas-sand text-navy shadow-2xs'
                            : 'text-navy hover:bg-canvas-sand/80 hover:text-navy',
                        )}
                      >
                        <span>{itemLabel}</span>
                        <ChevronDown
                          aria-hidden="true"
                          className={cn(
                            'h-4 w-4 transition-transform duration-ui ease-out-quart',
                            servicesOpen ? 'rotate-180 text-oasis' : '',
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {servicesOpen && (
                          <m.div
                            id="desktop-services-menu"
                            aria-label={itemLabel}
                            initial={
                              shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: 0, y: 8, scale: 0.96 }
                            }
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={
                              shouldReduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: 6, scale: 0.97 }
                            }
                            transition={{
                              duration: shouldReduceMotion ? 0 : 0.18,
                              ease: EASE_OUT_QUART,
                            }}
                            style={{
                              transformOrigin: locale === 'ar' ? 'top right' : 'top left',
                            }}
                            className="absolute start-0 top-full z-50 mt-2.5 w-[640px] max-w-[calc(100dvw-2rem)] rounded-2xl border border-subtle bg-surface p-5 shadow-2xl"
                          >
                            <div className="mb-3 flex items-center justify-between border-b border-subtle pb-2.5">
                              <span className="text-xs font-bold text-muted">
                                {locale === 'ar'
                                  ? 'خدمات بيّورا الـ ٩ للمحلات والمشاريع'
                                  : 'Bayyora’s 9 Core Local Growth Services'}
                              </span>
                              <Link
                                href={itemHref}
                                className="text-xs font-bold text-oasis hover:underline"
                              >
                                {locale === 'ar'
                                  ? 'عرض صفحة كل الخدمات ←'
                                  : 'View All Services Hub →'}
                              </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {services.map((svc) => (
                                <Link
                                  key={svc.slug}
                                  href={localizePath(`/services/${svc.slug}`, locale)}
                                  className="group flex items-start gap-3 rounded-xl p-2.5 transition-all duration-micro hover:bg-canvas"
                                >
                                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas-sand text-navy transition-transform duration-micro ease-out-quart group-hover:scale-105 group-hover:bg-accent group-hover:text-on-accent">
                                    <ServiceIcon name={svc.iconName} className="h-4 w-4" />
                                  </span>
                                  <span className="flex flex-col">
                                    <span className="text-sm font-bold text-navy transition-colors group-hover:text-oasis">
                                      {svc.name}
                                    </span>
                                    <span className="line-clamp-1 text-xs text-muted">
                                      {svc.shortDescription}
                                    </span>
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={itemHref}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={itemLabel}
                    className={cn(
                      'relative inline-flex min-h-11 shrink-0 items-center rounded-lg px-2.5 xl:px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-micro active:scale-[0.97]',
                      isActive
                        ? 'bg-canvas-sand text-navy shadow-2xs'
                        : 'text-navy hover:bg-canvas-sand/80 hover:text-navy',
                    )}
                  >
                    <span>{itemLabel}</span>
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-accent"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop End Actions: Language Switcher + Primary CTA */}
            <div className="hidden lg:flex lg:shrink-0 lg:items-center lg:gap-2.5 xl:gap-3">
              {languageSwitcher.enabled && (
                <Link
                  href={alternateLocaleHref}
                  lang={alternateLocale}
                  hrefLang={alternateLocale === 'ar' ? 'ar-SA' : 'en'}
                  aria-label={
                    locale === 'ar'
                      ? 'Switch website language to English'
                      : 'تغيير لغة الموقع إلى العربية'
                  }
                  className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-button border border-subtle bg-surface px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-navy transition-all duration-micro hover:bg-canvas-sand active:scale-[0.97]"
                >
                  <Globe aria-hidden="true" className="h-4 w-4 shrink-0 text-oasis" />
                  <span>
                    {locale === 'ar' ? languageSwitcher.enLabel : languageSwitcher.arLabel}
                  </span>
                </Link>
              )}

              <Button
                href={localizePath(primaryCta.destination, locale)}
                variant="primary"
                size="sm"
                className="shrink-0 whitespace-nowrap"
              >
                {primaryCta.label}
              </Button>
            </div>

            {/* Mobile Top Bar (< 1024px): Strictly 3 items (Logo + Compact Audit CTA + Hamburger) for 360px safety */}
            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              <Button
                href={localizePath(primaryCta.destination, locale)}
                variant="primary"
                size="compact"
              >
                {primaryCta.mobileShortLabel}
              </Button>

              <button
                ref={hamburgerBtnRef}
                type="button"
                aria-expanded={drawerOpen}
                aria-controls="mobile-nav-drawer"
                aria-label={
                  drawerOpen
                    ? locale === 'ar'
                      ? 'إغلاق القائمة'
                      : 'Close navigation menu'
                    : locale === 'ar'
                      ? 'فتح القائمة الرئيسية'
                      : 'Open navigation menu'
                }
                onClick={() => setDrawerOpen((prev) => !prev)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-subtle bg-surface text-navy transition-all duration-micro hover:bg-canvas-sand active:scale-[0.96]"
              >
                {drawerOpen ? (
                  <X aria-hidden="true" className="h-5 w-5" />
                ) : (
                  <Menu aria-hidden="true" className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Dynamic Scroll Progress Bar along bottom edge of Sticky Header */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[2.5px] overflow-hidden bg-transparent"
          >
            <div
              ref={progressBarRef}
              style={{
                transform: 'scaleX(0)',
                transformOrigin: locale === 'ar' ? 'right' : 'left',
              }}
              className="h-full w-full bg-gradient-to-r from-oasis via-accent to-accent-terracotta"
            />
          </div>
        </div>

        {/* Mobile Slide-Over Navigation Drawer — Paired Elements Rule (240ms ease-out-quart) */}
        <AnimatePresence>
          {drawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Paired Backdrop */}
              <m.div
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.24,
                  ease: EASE_OUT_QUART,
                }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 bg-navy/65 backdrop-blur-xs"
              />

              {/* Paired Drawer Panel (Positioned at inline-end: left in RTL, right in LTR) */}
              <m.div
                ref={drawerPanelRef}
                id="mobile-nav-drawer"
                role="dialog"
                aria-modal="true"
                aria-label={locale === 'ar' ? 'قائمة تصفح الموقع' : 'Site navigation drawer'}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { x: locale === 'ar' ? '-100%' : '100%', opacity: 0.9 }
                }
                animate={{ x: 0, opacity: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { x: locale === 'ar' ? '-100%' : '100%', opacity: 0.9 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.24,
                  ease: EASE_OUT_QUART,
                }}
                className="fixed inset-y-0 end-0 z-50 flex w-full max-w-sm flex-col justify-between overflow-y-auto bg-canvas p-5 shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-subtle pb-4">
                    <BayyoraLogo locale={locale} />
                    <button
                      ref={drawerCloseBtnRef}
                      type="button"
                      onClick={() => setDrawerOpen(false)}
                      aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-subtle bg-surface text-navy transition-transform active:scale-[0.96]"
                    >
                      <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Language Switcher Pill inside Mobile Drawer */}
                  {languageSwitcher.enabled && (
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-subtle bg-surface p-3">
                      <span className="text-xs font-semibold text-muted">
                        {locale === 'ar' ? 'اللغة / Language' : 'Language / اللغة'}
                      </span>
                      <Link
                        href={alternateLocaleHref}
                        lang={alternateLocale}
                        className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-canvas-sand px-3.5 py-1.5 text-sm font-bold text-navy"
                      >
                        <Globe aria-hidden="true" className="h-4 w-4 text-oasis" />
                        <span>{locale === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
                      </Link>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav
                    aria-label={locale === 'ar' ? 'روابط الجوال' : 'Mobile Navigation'}
                    className="mt-5 flex flex-col gap-1.5"
                  >
                    {visibleNavItems.map((item) => {
                      const itemHref = localizePath(item.href, locale)
                      const itemLabel = resolveNavLabel(item.href, item.label, locale)
                      if (item.linkType === 'services_dropdown') {
                        return (
                          <div
                            key={item.href}
                            className="overflow-hidden rounded-xl border border-subtle bg-surface"
                          >
                            <div className="flex items-center justify-between">
                              <Link
                                href={itemHref}
                                aria-label={itemLabel}
                                className="flex-1 px-4 py-3 text-base font-bold text-navy"
                              >
                                {itemLabel}
                              </Link>
                              <button
                                type="button"
                                aria-expanded={mobileServicesExpanded}
                                aria-label={
                                  locale === 'ar'
                                    ? 'عرض قائمة الخدمات الفرعية'
                                    : 'Toggle services submenu'
                                }
                                onClick={() => setMobileServicesExpanded((prev) => !prev)}
                                className="flex h-11 w-11 items-center justify-center border-s border-subtle text-navy"
                              >
                                <ChevronDown
                                  aria-hidden="true"
                                  className={cn(
                                    'h-4 w-4 transition-transform duration-ui ease-out-quart',
                                    mobileServicesExpanded ? 'rotate-180 text-oasis' : '',
                                  )}
                                />
                              </button>
                            </div>

                            <AnimatePresence initial={false}>
                              {mobileServicesExpanded && (
                                <m.div
                                  initial={
                                    shouldReduceMotion
                                      ? { opacity: 1 }
                                      : { opacity: 0, y: -6 }
                                  }
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  transition={{ duration: 0.16, ease: EASE_OUT_QUART }}
                                  className="flex flex-col gap-1 border-t border-subtle bg-canvas px-3 py-2"
                                >
                                  {services.map((svc) => (
                                    <Link
                                      key={svc.slug}
                                      href={localizePath(`/services/${svc.slug}`, locale)}
                                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink hover:bg-surface"
                                    >
                                      <ServiceIcon
                                        name={svc.iconName}
                                        className="h-4 w-4 text-oasis"
                                      />
                                      <span>{svc.name}</span>
                                    </Link>
                                  ))}
                                </m.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      }

                      return (
                        <Link
                          key={item.href}
                          href={itemHref}
                          aria-label={itemLabel}
                          className="rounded-xl border border-subtle bg-surface px-4 py-3 text-base font-bold text-navy transition-colors hover:bg-canvas-sand"
                        >
                          {itemLabel}
                        </Link>
                      )
                    })}

                    {!visibleNavItems.some((i) => i.href === '/faq') && (
                      <Link
                        href={localizePath('/faq', locale)}
                        className="rounded-xl border border-subtle bg-surface px-4 py-3 text-base font-bold text-navy transition-colors hover:bg-canvas-sand"
                      >
                        {locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
                      </Link>
                    )}
                    {!visibleNavItems.some((i) => i.href === '/blog') && (
                      <Link
                        href={localizePath('/blog', locale)}
                        className="rounded-xl border border-subtle bg-surface px-4 py-3 text-base font-bold text-navy transition-colors hover:bg-canvas-sand"
                      >
                        {locale === 'ar' ? 'المدونة والنصائح' : 'Blog & Guides'}
                      </Link>
                    )}
                  </nav>
                </div>

                {/* Drawer Footer CTAs */}
                <div className="mt-6 flex flex-col gap-3 border-t border-subtle pt-4">
                  <Button href={whatsappUrl} variant="whatsapp" className="w-full" external>
                    <WhatsAppIcon />
                    <span>{mobileDrawer.whatsappButtonLabel}</span>
                  </Button>
                  <Button
                    href={localizePath(primaryCta.destination, locale)}
                    variant="primary"
                    className="w-full"
                  >
                    {primaryCta.label}
                  </Button>
                  <p className="text-center text-xs text-muted">
                    {mobileDrawer.workingHoursNote}
                  </p>
                </div>
              </m.div>
            </div>
          )}
        </AnimatePresence>
      </header>
    </LazyMotion>
  )
}
