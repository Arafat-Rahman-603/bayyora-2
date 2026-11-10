'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import type { Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

export interface FaqItemData {
  id: string | number
  question: string
  answer: string
  category?: string | null
}

interface FaqAccordionProps {
  locale: Locale
  faqs: FaqItemData[]
  showCategoryFilter?: boolean
}

export function FaqAccordion({
  locale,
  faqs,
  showCategoryFilter = false,
}: FaqAccordionProps) {
  const isAr = locale === 'ar'
  const [openId, setOpenId] = useState<string | number | null>(faqs[0]?.id ?? null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hasInteracted, setHasInteracted] = useState<boolean>(false)

  const categories = isAr
    ? [
        { value: 'all', label: 'كل الأسئلة' },
        { value: 'pricing_packages', label: 'الأسعار والباقات' },
        { value: 'work_timing', label: 'طريقة العمل والوقت' },
        { value: 'accounts_payment', label: 'ملكية الحسابات والدفع' },
        { value: 'service_specific', label: 'أسئلة الخدمات' },
      ]
    : [
        { value: 'all', label: 'All Questions' },
        { value: 'pricing_packages', label: 'Pricing & Packages' },
        { value: 'work_timing', label: 'How We Work & Timing' },
        { value: 'accounts_payment', label: 'Account Ownership & Payment' },
        { value: 'service_specific', label: 'Service Specific' },
      ]

  const visibleFaqs =
    showCategoryFilter && selectedCategory !== 'all'
      ? faqs.filter((f) => f.category === selectedCategory)
      : faqs

  return (
    <div className="mx-auto max-w-narrow">
      {showCategoryFilter && (
        <div className="flex-wrap-balance mb-6 items-center justify-center gap-2">
          {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => {
                  setHasInteracted(true)
                  setSelectedCategory(cat.value)
                }}
                aria-pressed={selectedCategory === cat.value}
              className={cn(
                'min-h-10 rounded-full px-4 py-2 text-xs font-bold transition-all duration-micro active:scale-[0.97] sm:text-sm',
                selectedCategory === cat.value
                  ? 'bg-navy text-white shadow-xs'
                  : 'border border-subtle bg-surface text-navy hover:bg-canvas-sand',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {visibleFaqs.map((faq) => {
          const isOpen = String(openId) === String(faq.id)
          const contentId = `faq-panel-${faq.id}`
          const triggerId = `faq-trigger-${faq.id}`

          return (
            <div
              key={faq.id}
              className={cn(
                'overflow-hidden rounded-2xl border bg-surface transition-all duration-ui',
                isOpen
                  ? 'border-oasis/50 shadow-md'
                  : 'border-subtle shadow-2xs hover:border-navy/25',
              )}
            >
              <h3>
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => {
                    setHasInteracted(true)
                    setOpenId(isOpen ? null : faq.id)
                  }}
                  className="group flex min-h-[58px] w-full items-center justify-between gap-4 px-5 py-4 text-start text-base font-bold text-navy transition-colors hover:bg-canvas/60 sm:px-6 sm:text-lg"
                >
                  <span>{faq.question}</span>
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-ui ease-out-quart',
                      isOpen
                        ? 'rotate-45 bg-oasis text-white shadow-2xs'
                        : 'bg-canvas-sand text-navy group-hover:bg-oasis/15 group-hover:text-oasis',
                    )}
                  >
                    <Plus aria-hidden="true" className="h-4 w-4" />
                  </span>
                </button>
              </h3>

              {isOpen && (
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={cn(
                    'border-t border-subtle/60 bg-surface px-5 pb-5 pt-3.5 text-sm leading-relaxed text-ink sm:px-6 sm:text-base',
                    hasInteracted && 'animate-panel-switch',
                  )}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
