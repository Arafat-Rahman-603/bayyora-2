import React from 'react'
import { Check } from 'lucide-react'
import { Button, WhatsAppIcon } from '@/components/ui/Button'
import { AnimatedStaggerGrid, AnimatedStaggerItem } from '@/components/ui/AnimatedSection'
import { buildWhatsAppUrl } from '@/integrations/whatsapp'
import { localizePath, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

export interface PackageCardItem {
  slug: string
  packageType: 'monthly' | 'one_time_bundle'
  isHighlighted?: boolean | null
  name: string
  positioningSubline: string
  badgeText?: string | null
  description: string
  quantifiedDeliverables?: {
    platformsCount?: number | null
    designsCount?: number | null
    storiesCount?: number | null
    reelsCountText?: string | null
    reportingCadence?: string | null
  } | null
  featureBullets?: Array<{ text: string; isKeyHighlight?: boolean | null }> | null
  ctaLabel: string
  whatsappPrefillMessage?: string | null
  internalPriceSar?: number | null
}

interface PackageCardGridProps {
  locale: Locale
  packages: PackageCardItem[]
  publicPricingEnabled: boolean
  whatsappNumber?: string | null
}

export function PackageCardGrid({
  locale,
  packages,
  publicPricingEnabled,
  whatsappNumber,
}: PackageCardGridProps) {
  const isAr = locale === 'ar'

  const gridColumnsClass =
    packages.length === 1
      ? 'grid-cols-1 max-w-xl mx-auto'
      : packages.length === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <AnimatedStaggerGrid
      className={cn('grid gap-6 lg:gap-8 items-stretch', gridColumnsClass)}
    >
      {packages.map((pkg) => {
        const isDark = Boolean(pkg.isHighlighted)
        const waUrl = buildWhatsAppUrl(whatsappNumber, pkg.whatsappPrefillMessage)

        return (
          <AnimatedStaggerItem key={pkg.slug} className="flex w-full min-w-0">
            <article
              className={cn(
                'cq-card card-interactive relative flex w-full flex-1 min-w-0 flex-col justify-between rounded-2xl p-6 sm:p-8',
                isDark
                  ? 'section-navy bg-navy text-white border-2 border-accent shadow-xl lg:-translate-y-2'
                  : 'bg-surface text-ink border border-subtle shadow-xs hover:border-navy/25',
              )}
            >
              <div className="min-w-0">
                {/* Stacked Card Header — Badge sits above Title & Subtitle so text never gets squished horizontally */}
                <header className="min-w-0">
                  {pkg.badgeText && (
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold',
                          isDark
                            ? 'bg-accent text-on-accent shadow-xs'
                            : 'bg-canvas-sand text-navy border border-subtle',
                        )}
                      >
                        <span>{pkg.badgeText}</span>
                      </span>
                    </div>
                  )}

                  <h3
                    className={cn(
                      'text-xl font-bold leading-snug sm:text-2xl',
                      isDark ? 'text-white' : 'text-navy',
                    )}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    className={cn(
                      'mt-1.5 text-sm font-semibold leading-relaxed',
                      isDark ? 'text-white/85' : 'text-oasis',
                    )}
                  >
                    {pkg.positioningSubline}
                  </p>
                </header>

                {/* Price or Quote-Only Scope Box (Governed by SiteSettings.publicPricingEnabled per BR-003) */}
                <div
                  className={cn(
                    'mt-5 rounded-xl p-4',
                    isDark
                      ? 'bg-navy-elevated border border-white/15'
                      : 'bg-canvas border border-subtle',
                  )}
                >
                  {publicPricingEnabled && typeof pkg.internalPriceSar === 'number' ? (
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span
                        className={cn(
                          'font-mono text-3xl font-bold tabular-nums',
                          isDark ? 'text-accent' : 'text-navy',
                        )}
                      >
                        {pkg.internalPriceSar.toLocaleString('en-US')}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          isDark ? 'text-white/80' : 'text-muted',
                        )}
                      >
                        {pkg.packageType === 'monthly'
                          ? isAr
                            ? 'ريال / شهريًا'
                            : 'SAR / month'
                          : isAr
                            ? 'ريال (لمرة واحدة)'
                            : 'SAR (one-time)'}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p
                        className={cn(
                          'text-sm font-bold leading-snug',
                          isDark ? 'text-accent' : 'text-navy',
                        )}
                      >
                        {isAr
                          ? 'عرض سعر مخصّص حسب احتياج محلّك'
                          : 'Custom quote tailored to your shop'}
                      </p>
                      <p
                        className={cn(
                          'mt-1 text-xs leading-relaxed',
                          isDark ? 'text-white/80' : 'text-muted',
                        )}
                      >
                        {isAr
                          ? 'نحدّد التكلفة الدقيقة بعد التحليل المجاني لمحلّك'
                          : 'Exact scope & quote shared after your free mini audit'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quantified Deliverables Strip */}
                {pkg.quantifiedDeliverables && (
                  <div className="flex-wrap-balance mt-4 gap-2 text-xs font-semibold">
                    {typeof pkg.quantifiedDeliverables.platformsCount === 'number' && (
                      <span
                        className={cn(
                          'rounded-lg px-2.5 py-1 font-mono tabular-nums',
                          isDark ? 'bg-white/10 text-white' : 'bg-canvas-sand text-navy',
                        )}
                      >
                        {pkg.quantifiedDeliverables.platformsCount}{' '}
                        {isAr ? 'منصات' : 'Platforms'}
                      </span>
                    )}
                    {typeof pkg.quantifiedDeliverables.designsCount === 'number' && (
                      <span
                        className={cn(
                          'rounded-lg px-2.5 py-1 font-mono tabular-nums',
                          isDark ? 'bg-white/10 text-white' : 'bg-canvas-sand text-navy',
                        )}
                      >
                        {pkg.quantifiedDeliverables.designsCount}{' '}
                        {isAr ? 'تصميم' : 'Designs'}
                      </span>
                    )}
                    {typeof pkg.quantifiedDeliverables.storiesCount === 'number' && (
                      <span
                        className={cn(
                          'rounded-lg px-2.5 py-1 font-mono tabular-nums',
                          isDark ? 'bg-white/10 text-white' : 'bg-canvas-sand text-navy',
                        )}
                      >
                        {pkg.quantifiedDeliverables.storiesCount}{' '}
                        {isAr ? 'ستوري' : 'Stories'}
                      </span>
                    )}
                    {pkg.quantifiedDeliverables.reelsCountText && (
                      <span
                        className={cn(
                          'rounded-lg px-2.5 py-1',
                          isDark ? 'bg-accent/20 text-accent' : 'bg-oasis/10 text-oasis',
                        )}
                      >
                        {pkg.quantifiedDeliverables.reelsCountText}
                      </span>
                    )}
                  </div>
                )}

                <p
                  className={cn(
                    'mt-4 text-sm leading-relaxed',
                    isDark ? 'text-white/85' : 'text-muted',
                  )}
                >
                  {pkg.description}
                </p>

                {/* Feature Bullets */}
                <ul className="mt-5 space-y-2.5 border-t border-subtle/30 pt-4 text-sm">
                  {(pkg.featureBullets || []).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check
                        aria-hidden="true"
                        className={cn(
                          'mt-1 h-4 w-4 shrink-0',
                          isDark ? 'text-accent' : 'text-oasis',
                        )}
                      />
                      <span
                        className={cn(
                          'min-w-0 leading-relaxed',
                          b.isKeyHighlight ? 'font-bold' : 'font-normal',
                          isDark ? 'text-white' : 'text-ink',
                        )}
                      >
                        {b.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer Actions */}
              <footer className="mt-7 flex flex-col gap-2.5 border-t border-subtle/20 pt-4">
                <Button
                  href={localizePath('/free-audit', locale)}
                  variant={isDark ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {pkg.ctaLabel}
                </Button>
                <Button
                  href={waUrl}
                  variant={isDark ? 'outlineLight' : 'outline'}
                  size="sm"
                  className="w-full"
                  external
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  <span>
                    {isAr ? 'استفسر عن الباقة بالواتساب' : 'Ask about this package on WhatsApp'}
                  </span>
                </Button>
              </footer>
            </article>
          </AnimatedStaggerItem>
        )
      })}
    </AnimatedStaggerGrid>
  )
}
