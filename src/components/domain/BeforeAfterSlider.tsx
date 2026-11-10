'use client'

import React, { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

export interface ComparisonProjectData {
  slug: string
  title: string
  isSampleConcept: boolean
  cityTag?: string | null
  summary: string
  beforeHeadline?: string | null
  afterHeadline?: string | null
  beforeMetrics?: Array<{ label: string; value: string }> | null
  afterMetrics?: Array<{ label: string; value: string }> | null
}

interface BeforeAfterSliderProps {
  locale: Locale
  project: ComparisonProjectData
  sampleBadgeLabel?: string
}

/**
 * Accessible Before/After Comparison Component (WCAG 2.2 SC 2.5.7 Compliant):
 * Provides both an interactive range slider AND single-click preset buttons
 * ("عرض قبل / Show Before", "٥٠/٥٠ / Split View", "عرض بعد / Show After")
 * so keyboard and motor-impaired users never rely solely on dragging movements.
 */
export function BeforeAfterSlider({
  locale,
  project,
  sampleBadgeLabel,
}: BeforeAfterSliderProps) {
  const isAr = locale === 'ar'
  const [splitPercent, setSplitPercent] = useState<number>(50)

  const badgeText =
    sampleBadgeLabel || (isAr ? 'نموذج توضيحي' : 'Sample concept')

  return (
    <article className="cq-card rounded-2xl border border-subtle bg-surface p-5 shadow-sm sm:p-6 lg:p-8">
      <header className="flex flex-col justify-between gap-4 border-b border-subtle pb-5 lg:flex-row lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {project.isSampleConcept && (
              <span className="inline-flex items-center rounded-full border border-navy/20 bg-canvas-sand px-3 py-1 text-xs font-bold text-navy">
                {badgeText}
              </span>
            )}
            {project.cityTag && (
              <span className="inline-flex items-center rounded-full bg-oasis/10 px-3 py-1 text-xs font-bold text-oasis">
                {project.cityTag}
              </span>
            )}
          </div>
          <h3 className="mt-2.5 text-lg font-bold leading-snug text-navy sm:text-xl">
            {project.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{project.summary}</p>
        </div>

        {/* Non-Drag Single-Click Preset Buttons (WCAG 2.2 SC 2.5.7 Dragging Movements) */}
        <div
          role="group"
          aria-label={isAr ? 'أزرار التحكم السريع بالمقارنة' : 'Comparison view presets'}
          className="flex w-full shrink-0 flex-wrap items-center justify-center gap-1.5 rounded-xl bg-canvas p-1.5 sm:w-auto"
        >
          <button
            type="button"
            aria-pressed={splitPercent < 35}
            onClick={() => setSplitPercent(15)}
            className={cn(
              'min-h-9 flex-1 rounded-lg px-3.5 py-1.5 text-center text-xs font-bold whitespace-nowrap transition-colors sm:flex-initial',
              splitPercent < 35 ? 'bg-navy text-white shadow-2xs' : 'text-navy hover:bg-canvas-sand',
            )}
          >
            {isAr ? 'عرض قبل' : 'Before'}
          </button>
          <button
            type="button"
            aria-pressed={splitPercent >= 35 && splitPercent <= 65}
            onClick={() => setSplitPercent(50)}
            className={cn(
              'min-h-9 flex-1 rounded-lg px-3.5 py-1.5 text-center text-xs font-bold whitespace-nowrap transition-colors sm:flex-initial',
              splitPercent >= 35 && splitPercent <= 65
                ? 'bg-navy text-white shadow-2xs'
                : 'text-navy hover:bg-canvas-sand',
            )}
          >
            {isAr ? 'مقارنة ٥٠/٥٠' : '50/50 Split'}
          </button>
          <button
            type="button"
            aria-pressed={splitPercent > 65}
            onClick={() => setSplitPercent(85)}
            className={cn(
              'min-h-9 flex-1 rounded-lg px-3.5 py-1.5 text-center text-xs font-bold whitespace-nowrap transition-colors sm:flex-initial',
              splitPercent > 65 ? 'bg-oasis text-white shadow-2xs' : 'text-navy hover:bg-canvas-sand',
            )}
          >
            {isAr ? 'عرض بعد' : 'After'}
          </button>
        </div>
      </header>

      {/* Interactive Split Comparison Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Before State */}
        <div
          className={cn(
            'min-w-0 rounded-xl border p-5 transition-opacity duration-ui',
            splitPercent > 75
              ? 'border-subtle/50 bg-canvas/50 opacity-60'
              : 'border-subtle bg-canvas',
          )}
        >
          <div className="mb-3.5 flex items-center justify-between">
            <span className="rounded-md bg-danger/10 px-2.5 py-1 text-xs font-bold text-danger">
              {project.beforeHeadline || (isAr ? 'قبل بيّورا' : 'Before Bayyora')}
            </span>
          </div>
          <ul className="space-y-3 text-sm">
            {(project.beforeMetrics || []).map((m, idx) => (
              <li
                key={idx}
                className="flex flex-col gap-1 border-b border-subtle/60 pb-2.5 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
              >
                <span className="shrink-0 font-medium text-muted">{m.label}</span>
                <span className="inline-flex min-w-0 items-start gap-1.5 font-semibold text-danger sm:text-end">
                  <X aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="min-w-0 leading-snug">{m.value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* After State */}
        <div
          className={cn(
            'min-w-0 rounded-xl border-2 p-5 transition-opacity duration-ui',
            splitPercent < 25
              ? 'border-subtle bg-surface opacity-60'
              : 'border-oasis bg-surface shadow-sm',
          )}
        >
          <div className="mb-3.5 flex items-center justify-between">
            <span className="rounded-md bg-oasis px-2.5 py-1 text-xs font-bold text-white">
              {project.afterHeadline || (isAr ? 'بعد بيّورا' : 'After Bayyora')}
            </span>
          </div>
          <ul className="space-y-3 text-sm">
            {(project.afterMetrics || []).map((m, idx) => (
              <li
                key={idx}
                className="flex flex-col gap-1 border-b border-subtle/60 pb-2.5 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
              >
                <span className="shrink-0 font-semibold text-navy">{m.label}</span>
                <span className="inline-flex min-w-0 items-start gap-1.5 font-bold text-oasis sm:text-end">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="min-w-0 leading-snug">{m.value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Accessible Range Input Control */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <label
          htmlFor={`slider-${project.slug}`}
          className="shrink-0 text-xs font-semibold text-muted"
        >
          {isAr ? 'شريط المقارنة:' : 'Comparison Slider:'}
        </label>
        <input
          id={`slider-${project.slug}`}
          type="range"
          min={0}
          max={100}
          step={5}
          value={splitPercent}
          onChange={(e) => setSplitPercent(Number(e.target.value))}
          aria-valuetext={`${splitPercent}%`}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-canvas-sand accent-navy"
        />
      </div>
    </article>
  )
}
