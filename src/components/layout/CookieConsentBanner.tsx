'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { localizePath, type Locale } from '@/i18n/config'

interface CookieConsentBannerProps {
  locale: Locale
  message?: string | null
  acceptLabel?: string | null
  essentialOnlyLabel?: string | null
}

const CONSENT_STORAGE_KEY = 'bayyora_pdpl_cookie_consent'

export function CookieConsentBanner({
  locale,
  message,
  acceptLabel,
  essentialOnlyLabel,
}: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(CONSENT_STORAGE_KEY)
      if (!existing) {
        setVisible(true)
      }
    } catch {
      // Ignore storage access errors in strict privacy browsers
    }
  }, [])

  const handleChoice = (choice: 'accepted' | 'essential_only') => {
    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ choice, timestamp: new Date().toISOString() }),
      )
    } catch {
      // Ignore storage write error
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      role="region"
      aria-label={locale === 'ar' ? 'إشعار ملفات تعريف الارتباط والخصوصية' : 'Privacy and cookie consent notice'}
      className="fixed bottom-20 start-4 end-4 z-40 rounded-2xl border border-subtle bg-surface p-4 shadow-xl sm:bottom-4 sm:end-auto sm:max-w-md sm:p-5"
    >
      <p className="text-xs leading-relaxed text-ink sm:text-sm">
        {message ||
          (locale === 'ar'
            ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وفق نظام حماية البيانات الشخصية السعودي (PDPL).'
            : 'We use cookies to improve your browsing experience under the Saudi Personal Data Protection Law (PDPL).')}{' '}
        <Link
          href={localizePath('/privacy', locale)}
          className="font-bold text-oasis underline underline-offset-2"
        >
          {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleChoice('accepted')}
          className="min-h-10 rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-elevated"
        >
          {acceptLabel || (locale === 'ar' ? 'موافق' : 'Accept All')}
        </button>
        <button
          type="button"
          onClick={() => handleChoice('essential_only')}
          className="min-h-10 rounded-lg border border-input bg-surface px-3.5 py-2 text-xs font-semibold text-navy hover:bg-canvas-sand"
        >
          {essentialOnlyLabel || (locale === 'ar' ? 'الضرورية فقط' : 'Essential Only')}
        </button>
      </div>
    </aside>
  )
}

