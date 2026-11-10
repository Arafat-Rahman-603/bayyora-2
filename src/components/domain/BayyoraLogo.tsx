import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { localizePath, type Locale } from '@/i18n/config'

interface BayyoraLogoProps {
  locale: Locale
  variant?: 'dark-on-light' | 'light-on-dark'
  className?: string
  showTagline?: boolean
}

/**
 * Bayyora (بيّورا) Official Bilingual Wordmark with the Rising Line Accent ("خطوة لفوق").
 * Preserves the mandatory shadda on يّ in Arabic.
 */
export function BayyoraLogo({
  locale,
  variant = 'dark-on-light',
  className,
  showTagline = false,
}: BayyoraLogoProps) {
  const isLightText = variant === 'light-on-dark'
  const href = localizePath('/', locale)

  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        className,
      )}
      aria-label={locale === 'ar' ? 'بيّورا — خطوة لفوق (الرئيسية)' : 'Bayyora — One step up (Home)'}
    >
      <span className="relative inline-flex flex-col">
        <span
          className={cn(
            'text-2xl font-bold tracking-tight transition-colors duration-micro',
            isLightText ? 'text-white' : 'text-navy',
          )}
        >
          {locale === 'ar' ? 'بيّورا' : 'Bayyora'}
        </span>
        <svg
          width="68"
          height="10"
          viewBox="0 0 68 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={cn(
            '-mt-1 transition-transform duration-ui ease-out-cubic group-hover:scale-x-105',
            locale === 'ar' ? 'scale-x-[-1]' : '',
          )}
        >
          <path
            d="M2 8C22 7.5 44 5.5 63 2"
            stroke="#F2A541"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M58 1L64.5 1.8L61 6.5"
            stroke="#F2A541"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showTagline && (
        <span
          className={cn(
            'hidden border-s ps-2.5 text-xs font-medium whitespace-nowrap xl:inline-block',
            isLightText ? 'border-white/20 text-white/80' : 'border-subtle text-muted',
          )}
        >
          {locale === 'ar' ? 'خطوة لفوق' : 'One step up'}
        </span>
      )}
    </Link>
  )
}

