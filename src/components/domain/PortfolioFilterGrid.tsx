'use client'

import React, { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { localizePath, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

export interface PortfolioProjectCardItem {
  slug: string
  title: string
  isSampleConcept: boolean
  hasFullCaseStudyPage?: boolean | null
  serviceCategory: string
  businessType: string
  cityTag?: string | null
  summary: string
  beforeHeadline?: string | null
  afterHeadline?: string | null
  beforeMetrics?: Array<{ label: string; value: string }> | null
  afterMetrics?: Array<{ label: string; value: string }> | null
}

interface PortfolioFilterGridProps {
  locale: Locale
  projects: PortfolioProjectCardItem[]
  showFilters?: boolean
  uiLabels?: {
    allServicesLabel?: string | null
    allBusinessTypesLabel?: string | null
    sampleConceptBadgeLabel?: string | null
    beforeLabel?: string | null
    afterLabel?: string | null
    emptyStateText?: string | null
    resetFiltersLabel?: string | null
  }
}

export function PortfolioFilterGrid({
  locale,
  projects,
  showFilters = true,
  uiLabels,
}: PortfolioFilterGridProps) {
  const isAr = locale === 'ar'

  const [selectedService, setSelectedService] = useState<string>('all')
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('all')
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)

  const serviceOptions = isAr
    ? [
        { value: 'all', label: uiLabels?.allServicesLabel || 'كل الخدمات' },
        { value: 'brand-identity', label: 'الهوية والشعار' },
        { value: 'print-shop-design', label: 'مطبوعات ولوحات المحل' },
        { value: 'websites-online-stores', label: 'المواقع والمتاجر' },
        { value: 'social-media', label: 'السوشال ميديا' },
        { value: 'video-animation', label: 'الفيديو والموشن' },
        { value: 'photography', label: 'التصوير الاحترافي' },
        { value: 'ads-local-search', label: 'خرائط جوجل والإعلانات' },
        { value: 'whatsapp-follow-up', label: 'واتساب ومتابعة العملاء' },
        { value: 'seasonal-campaigns', label: 'حملات المواسم' },
      ]
    : [
        { value: 'all', label: uiLabels?.allServicesLabel || 'All Services' },
        { value: 'brand-identity', label: 'Brand & Identity' },
        { value: 'print-shop-design', label: 'Print & Shop Design' },
        { value: 'websites-online-stores', label: 'Websites & Stores' },
        { value: 'social-media', label: 'Social Media' },
        { value: 'video-animation', label: 'Video & Motion' },
        { value: 'photography', label: 'Photography' },
        { value: 'ads-local-search', label: 'Google Maps & Ads' },
        { value: 'whatsapp-follow-up', label: 'WhatsApp & Follow-Up' },
        { value: 'seasonal-campaigns', label: 'Seasonal Campaigns' },
      ]

  const businessOptions = isAr
    ? [
        { value: 'all', label: uiLabels?.allBusinessTypesLabel || 'كل الأنشطة' },
        { value: 'restaurant', label: 'مطاعم' },
        { value: 'cafe', label: 'كافيهات' },
        { value: 'pharmacy', label: 'صيدليات وعيادات' },
        { value: 'salon', label: 'صالونات وعناية' },
        { value: 'retail', label: 'محلات تجزئة' },
      ]
    : [
        { value: 'all', label: uiLabels?.allBusinessTypesLabel || 'All Business Types' },
        { value: 'restaurant', label: 'Restaurants' },
        { value: 'cafe', label: 'Cafes' },
        { value: 'pharmacy', label: 'Pharmacies' },
        { value: 'salon', label: 'Salons' },
        { value: 'retail', label: 'Retail Shops' },
      ]

  const filteredProjects = projects.filter((p) => {
    const matchesService = selectedService === 'all' || p.serviceCategory === selectedService
    const matchesBusiness =
      selectedBusinessType === 'all' || p.businessType === selectedBusinessType
    return matchesService && matchesBusiness
  })

  const sampleBadge =
    uiLabels?.sampleConceptBadgeLabel || (isAr ? 'نموذج توضيحي' : 'Sample concept')

  return (
    <div>
      {showFilters && (
        <div className="mb-8 space-y-4 rounded-2xl border border-subtle bg-surface p-4 sm:p-6">
          {/* Filter 1: By Service */}
          <div>
            <span className="mb-2 block text-xs font-bold text-muted">
              {isAr ? 'فلترة حسب الخدمة:' : 'Filter by Service:'}
            </span>
            <div className="flex-wrap-balance gap-2">
              {serviceOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setHasInteracted(true)
                    setSelectedService(opt.value)
                  }}
                  aria-pressed={selectedService === opt.value}
                  className={cn(
                    'min-h-10 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-micro active:scale-[0.97] sm:text-sm',
                    selectedService === opt.value
                      ? 'bg-navy text-white shadow-2xs'
                      : 'border border-subtle bg-canvas text-navy hover:bg-canvas-sand',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 2: By Business Type */}
          <div className="border-t border-subtle pt-3">
            <span className="mb-2 block text-xs font-bold text-muted">
              {isAr ? 'فلترة حسب نوع النشاط:' : 'Filter by Business Type:'}
            </span>
            <div className="flex-wrap-balance gap-2">
              {businessOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setHasInteracted(true)
                    setSelectedBusinessType(opt.value)
                  }}
                  aria-pressed={selectedBusinessType === opt.value}
                  className={cn(
                    'min-h-10 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-micro active:scale-[0.97] sm:text-sm',
                    selectedBusinessType === opt.value
                      ? 'bg-oasis text-white shadow-2xs'
                      : 'border border-subtle bg-canvas text-navy hover:bg-canvas-sand',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-subtle bg-canvas-sand p-10 text-center">
          <p className="text-base font-semibold text-navy">
            {uiLabels?.emptyStateText ||
              (isAr
                ? 'لا توجد نماذج مطابقة لهذا الفلتر حاليًا.'
                : 'No portfolio items match the selected filter combination.')}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSelectedService('all')
              setSelectedBusinessType('all')
            }}
          >
            {uiLabels?.resetFiltersLabel ||
              (isAr ? 'عرض كل الأعمال والنماذج' : 'Show All Work & Concepts')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredProjects.map((project) => (
            <article
              key={`${project.slug}-${selectedService}-${selectedBusinessType}`}
              className={cn(
                'cq-card card-interactive flex min-w-0 flex-col justify-between rounded-2xl border border-subtle bg-surface p-6 shadow-xs',
                hasInteracted && 'animate-panel-switch',
              )}
            >
              <div className="min-w-0">
                {/* Top Badges: Mandatory Sample Concept Badge + City */}
                <header className="mb-3 flex flex-wrap items-center gap-2">
                  {project.isSampleConcept && (
                    <span className="inline-flex items-center rounded-full border border-navy/20 bg-canvas-sand px-3 py-1 text-xs font-bold text-navy">
                      {sampleBadge}
                    </span>
                  )}
                  {project.cityTag && (
                    <span className="inline-flex items-center rounded-full bg-oasis/10 px-3 py-1 text-xs font-bold text-oasis">
                      {project.cityTag}
                    </span>
                  )}
                </header>

                <h3 className="text-lg font-bold leading-snug text-navy sm:text-xl">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>

                {/* Before vs After Mini Comparison Grid */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0 rounded-xl border border-subtle bg-canvas p-3.5">
                    <span className="text-xs font-bold text-danger">
                      {project.beforeHeadline ||
                        uiLabels?.beforeLabel ||
                        (isAr ? 'قبل بيّورا' : 'Before Bayyora')}
                    </span>
                    <ul className="mt-2 space-y-1.5 text-xs">
                      {(project.beforeMetrics || []).map((m, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-1.5 text-muted">
                          <X
                            aria-hidden="true"
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger"
                          />
                          <span className="min-w-0 leading-relaxed">
                            <strong className="text-ink">{m.label}:</strong> {m.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="min-w-0 rounded-xl border border-oasis/40 bg-oasis/5 p-3.5">
                    <span className="text-xs font-bold text-oasis">
                      {project.afterHeadline ||
                        uiLabels?.afterLabel ||
                        (isAr ? 'بعد بيّورا' : 'After Bayyora')}
                    </span>
                    <ul className="mt-2 space-y-1.5 text-xs">
                      {(project.afterMetrics || []).map((m, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-1.5 text-ink">
                          <Check
                            aria-hidden="true"
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-oasis"
                          />
                          <span className="min-w-0 leading-relaxed">
                            <strong className="text-navy">{m.label}:</strong> {m.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <footer className="mt-5 flex flex-col items-stretch justify-between gap-2.5 border-t border-subtle pt-4 sm:flex-row sm:items-center">
                <Button
                  href={localizePath(`/services/${project.serviceCategory}`, locale)}
                  variant="ghost"
                  size="sm"
                  className="w-full text-center sm:w-auto"
                >
                  {isAr ? 'استكشف الخدمة المرتبطة ←' : 'Explore related service →'}
                </Button>
                <Button
                  href={localizePath('/free-audit', locale)}
                  variant="primary"
                  size="sm"
                  className="w-full text-center sm:w-auto"
                >
                  {isAr ? 'اطلب تحليل لمحلّك' : 'Audit my shop'}
                </Button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
