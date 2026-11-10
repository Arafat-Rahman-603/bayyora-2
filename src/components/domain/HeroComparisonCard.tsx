'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Check, Pause, Play, X } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

interface HeroComparisonCardProps {
  locale: Locale
}

/**
 * Recreates the signature Before vs. After Shop Presence Card from the owner's visual reference,
 * with stacked row labels so text never squishes inside 2-column grids,
 * viewport-aware spotlight cycling, an accessible Pause/Play control,
 * keyboard-operable row spotlighting, and WCAG 2.2 AA contrast.
 */
export function HeroComparisonCard({ locale }: HeroComparisonCardProps) {
  const isAr = locale === 'ar'
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeRowIndex, setActiveRowIndex] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const rows = isAr
    ? [
        { label: 'خرائط جوجل', before: 'غير موثّق بالخريطة', after: 'ظهور أول بالحي' },
        { label: 'السوشال ميديا', before: 'متوقف من شهور', after: 'نشر وريلز منتظم' },
        { label: 'المنيو والهوية', before: 'تصميم غير واضح', after: 'هوية ومنيو يفتح النفس' },
        { label: 'رسائل واتساب', before: 'تضيع وقت الزحمة', after: 'كتالوج ورد فوري' },
      ]
    : [
        { label: 'Google Maps', before: 'Unverified listing', after: 'Top local visibility' },
        { label: 'Social Media', before: 'Silent for months', after: 'Steady posts & Reels' },
        { label: 'Brand & Menu', before: 'Cluttered look', after: 'Clear identity & menu' },
        { label: 'WhatsApp Leads', before: 'Missed at rush hour', after: 'Instant catalog & reply' },
      ]

  useEffect(() => {
    const node = containerRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsVisible(entry.isIntersecting)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isPaused || !isVisible) return
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const timer = window.setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      setActiveRowIndex((prev) => (prev + 1) % rows.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [isPaused, isVisible, rows.length])

  const handleRowKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActiveRowIndex(idx)
    }
  }

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Before Card (Muted / Weak State) */}
        <article className="cq-card flex flex-col justify-between rounded-2xl border border-subtle bg-surface p-5 shadow-xs">
          <div>
            <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-canvas-sand px-3 py-1 text-xs font-bold text-muted">
                {isAr ? 'قبل' : 'Before'}
              </span>
            </header>
            <div className="mb-4 rounded-xl bg-canvas-sand p-3.5 text-center">
              <p className="text-sm font-bold text-muted">
                {isAr ? 'محل بدون ترتيب رقمي' : 'Unstructured Shop'}
              </p>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              {rows.map((r, idx) => {
                const isSpotlight = activeRowIndex === idx
                return (
                  <li
                    key={r.label}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSpotlight}
                    onMouseEnter={() => setActiveRowIndex(idx)}
                    onClick={() => setActiveRowIndex(idx)}
                    onKeyDown={(e) => handleRowKeyDown(e, idx)}
                    className={cn(
                      'cursor-pointer rounded-xl border px-3 py-2.5 transition-all duration-micro',
                      isSpotlight
                        ? 'border-danger/35 bg-danger/5 scale-[1.01]'
                        : 'border-subtle/50 bg-canvas/50 hover:bg-canvas',
                    )}
                  >
                    <span className="block text-[11px] font-bold text-muted">
                      {r.label}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 font-semibold text-danger">
                      <X aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      <span className="min-w-0 leading-snug">{r.before}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </article>

        {/* After Card (Bayyora Highlighted State) */}
        <article className="cq-card card-interactive relative flex flex-col justify-between rounded-2xl border-2 border-accent bg-surface p-5 shadow-xl">
          <div>
            <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-oasis px-3 py-1 text-xs font-bold text-white shadow-2xs">
                <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span>{isAr ? 'بعد بيّورا' : 'With Bayyora'}</span>
              </span>
              <span className="text-xs font-bold text-oasis">
                {isAr ? 'خطوة لفوق' : 'One step up'}
              </span>
            </header>
            <div className="mb-4 rounded-xl bg-navy p-3.5 text-center text-white shadow-xs">
              <p className="text-sm font-bold">
                {isAr ? 'محل يبان ويجيب زباين' : 'Visible, Trusted Local Brand'}
              </p>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              {rows.map((r, idx) => {
                const isSpotlight = activeRowIndex === idx
                return (
                  <li
                    key={r.label}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSpotlight}
                    onMouseEnter={() => setActiveRowIndex(idx)}
                    onClick={() => setActiveRowIndex(idx)}
                    onKeyDown={(e) => handleRowKeyDown(e, idx)}
                    className={cn(
                      'cursor-pointer rounded-xl border px-3 py-2.5 transition-all duration-micro',
                      isSpotlight
                        ? 'border-oasis/45 bg-oasis/10 shadow-2xs scale-[1.02]'
                        : 'border-subtle/60 bg-canvas/40 hover:bg-canvas/80',
                    )}
                  >
                    <span className="block text-[11px] font-bold text-navy/80">
                      {r.label}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 font-bold text-oasis">
                      <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      <span className="min-w-0 leading-snug">{r.after}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </article>
      </div>

      {/* Mandatory Honesty Disclosure Badge (BR-009) + Accessible Pause Mechanism */}
      <div className="flex-wrap-balance mt-3 items-center justify-center gap-2 text-xs font-medium text-muted">
        <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-subtle bg-canvas-sand px-3.5 py-1.5 text-navy">
          {isAr ? 'نموذج توضيحي للمقارنة' : 'Sample concept illustration'}
        </span>

        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-pressed={isPaused}
          aria-label={
            isPaused
              ? isAr
                ? 'تشغيل العرض التلقائي للمقارنة'
                : 'Play automatic comparison spotlight'
              : isAr
                ? 'إيقاف العرض التلقائي للمقارنة مؤقتًا'
                : 'Pause automatic comparison spotlight'
          }
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-subtle bg-surface px-3.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-canvas-sand"
        >
          {isPaused ? (
            <>
              <Play aria-hidden="true" className="h-3 w-3 text-oasis" />
              <span>{isAr ? 'تشغيل' : 'Play'}</span>
            </>
          ) : (
            <>
              <Pause aria-hidden="true" className="h-3 w-3 text-muted" />
              <span>{isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
