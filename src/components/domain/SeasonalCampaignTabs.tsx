'use client'

import React, { useState } from 'react'
import { Calendar, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { localizePath, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

export interface SeasonItem {
  seasonKey: string
  label: string
  headline: string
  description: string
  deliverablesSummary?: string | null
  ctaLabel?: string | null
}

interface SeasonalCampaignTabsProps {
  locale: Locale
  seasons: SeasonItem[]
}

const DEFAULT_SEASON_DATA: Record<
  string,
  {
    label: { ar: string; en: string }
    headline: { ar: string; en: string }
    description: { ar: string; en: string }
    cta: { ar: string; en: string }
  }
> = {
  ramadan: {
    label: { ar: 'رمضان', en: 'Ramadan' },
    headline: {
      ar: 'حملة شهر رمضان المبارك',
      en: 'Ramadan Gathering & Iftar Campaign',
    },
    description: {
      ar: 'تصميم منيو وبوكسات رمضان، تغليف موسمي، تصوير الأطباق الرمضانية، وإعلانات أوقات الذروة.',
      en: 'Ramadan menus, sharing boxes, branded sleeves, food photography, and peak-hour local ads.',
    },
    cta: { ar: 'جهّز حملة رمضان لمحلّك', en: 'Plan my Ramadan campaign' },
  },
  eid: {
    label: { ar: 'العيد', en: 'Eid' },
    headline: {
      ar: 'حملة موسم العيد والبوكسات',
      en: 'Eid Gifting & Pre-Booking Campaign',
    },
    description: {
      ar: 'تصميم بطاقات المعايدة، بوكسات العيد، وحملات الحجز المبكر في الصوالين والمطاعم.',
      en: 'Eid gift boxes, early salon/restaurant booking campaigns, and festive storefront visuals.',
    },
    cta: { ar: 'جهّز حملة العيد لمحلّك', en: 'Plan my Eid campaign' },
  },
  founding_day: {
    label: { ar: 'يوم التأسيس', en: 'Founding Day' },
    headline: {
      ar: 'حملة يوم التأسيس السعودي (٢٢ فبراير)',
      en: 'Saudi Founding Day Campaign (Feb 22)',
    },
    description: {
      ar: 'تصاميم مستوحاة من الهوية الوطنية والتراثية، ملصقات النوافذ وأكواب التأسيس.',
      en: 'Heritage-inspired Founding Day promotions, cup sleeves, window posters, and Reels.',
    },
    cta: { ar: 'جهّز حملة يوم التأسيس لمحلّك', en: 'Plan my Founding Day campaign' },
  },
  national_day: {
    label: { ar: 'اليوم الوطني', en: 'National Day' },
    headline: {
      ar: 'حملة اليوم الوطني السعودي (٢٣ سبتمبر)',
      en: 'Saudi National Day Campaign (Sep 23)',
    },
    description: {
      ar: 'باقات عروض اليوم الوطني، تزيين واجهة المحل، وحملات إعلانية جغرافية مكثفة.',
      en: 'National Day bundles, themed store graphics, and geo-targeted local ad sprints.',
    },
    cta: { ar: 'جهّز حملة اليوم الوطني لمحلّك', en: 'Plan my National Day campaign' },
  },
  white_friday: {
    label: { ar: 'الجمعة البيضاء', en: 'White Friday' },
    headline: {
      ar: 'عروض الجمعة البيضاء والعودة للمدارس',
      en: 'White Friday & Back-to-School Retail Sprints',
    },
    description: {
      ar: 'حملات ترويجية عالية التحويل لتصريف المنتجات واستقطاب زوار نهاية الأسبوع.',
      en: 'High-conversion promotional campaigns to move inventory and capture seasonal foot traffic.',
    },
    cta: { ar: 'جهّز عروض متجرك', en: 'Plan my retail promo' },
  },
}

export function SeasonalCampaignTabs({ locale, seasons }: SeasonalCampaignTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const isAr = locale === 'ar'

  const resolvedSeasons: SeasonItem[] =
    seasons && seasons.length > 0
      ? seasons
      : Object.entries(DEFAULT_SEASON_DATA).map(([seasonKey, data]) => ({
          seasonKey,
          label: data.label[isAr ? 'ar' : 'en'],
          headline: data.headline[isAr ? 'ar' : 'en'],
          description: data.description[isAr ? 'ar' : 'en'],
          ctaLabel: data.cta[isAr ? 'ar' : 'en'],
        }))

  const activeSeason = resolvedSeasons[activeIndex] || resolvedSeasons[0]!
  const activeFallback = DEFAULT_SEASON_DATA[activeSeason.seasonKey]
  const activeHeadline =
    activeSeason.headline || activeFallback?.headline[isAr ? 'ar' : 'en'] || ''
  const activeDescription =
    activeSeason.description || activeFallback?.description[isAr ? 'ar' : 'en'] || ''
  const activeCta =
    activeSeason.ctaLabel ||
    activeFallback?.cta[isAr ? 'ar' : 'en'] ||
    (isAr ? 'جهّز حملة الموسم' : 'Plan seasonal campaign')

  return (
    <div>
      {/* Season Selector Pill Bar */}
      <div
        role="tablist"
        aria-label={isAr ? 'مواسم الحملات التسويقية' : 'Seasonal campaign occasions'}
        className="flex-wrap-balance items-center justify-center gap-2 sm:gap-3"
      >
        {resolvedSeasons.map((season, index) => {
          const isSelected = index === activeIndex
          const fallback = DEFAULT_SEASON_DATA[season.seasonKey]
          const label =
            season.label || fallback?.label[isAr ? 'ar' : 'en'] || season.seasonKey

          return (
            <button
              key={season.seasonKey}
              type="button"
              role="tab"
              id={`season-tab-${season.seasonKey}`}
              aria-selected={isSelected}
              aria-controls={`season-panel-${season.seasonKey}`}
              aria-label={label}
              onClick={() => {
                setHasInteracted(true)
                setActiveIndex(index)
              }}
              className={cn(
                'min-h-11 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-micro active:scale-[0.97]',
                isSelected
                  ? 'bg-navy text-white shadow-sm'
                  : 'border border-subtle bg-surface text-navy hover:bg-canvas-sand',
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Active Season Content Panel — Only animates when user switches tabs */}
      <div
        key={activeSeason.seasonKey}
        id={`season-panel-${activeSeason.seasonKey}`}
        role="tabpanel"
        aria-labelledby={`season-tab-${activeSeason.seasonKey}`}
        className={cn(
          'mx-auto mt-7 max-w-3xl rounded-2xl border border-subtle bg-surface p-6 shadow-sm sm:p-8',
          hasInteracted && 'animate-panel-switch',
        )}
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3.5 py-1 text-xs font-bold text-navy">
              <Calendar aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-oasis" />
              <span>
                {isAr
                  ? 'التجهيز يبدأ قبل الموسم بـ ٢–٣ أسابيع'
                  : 'Prepared 2–3 weeks before the season'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-navy sm:text-2xl">{activeHeadline}</h3>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              {activeDescription}
            </p>
            {activeSeason.deliverablesSummary && (
              <div className="flex items-start gap-2 rounded-xl bg-canvas p-3.5 text-xs font-semibold text-navy sm:text-sm">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-oasis"
                />
                <span>{activeSeason.deliverablesSummary}</span>
              </div>
            )}
          </div>

          <div className="w-full shrink-0 md:w-auto">
            <Button
              href={localizePath('/services/seasonal-campaigns', locale)}
              variant="primary"
              className="w-full text-center md:w-auto"
            >
              {activeCta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
