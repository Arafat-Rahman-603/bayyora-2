'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { RisingLineSvg } from '@/components/domain/RisingLineSvg'

export default function NotFound() {
  const pathname = usePathname() || '/'
  const isEn = pathname === '/en' || pathname.startsWith('/en/')
  const isAr = !isEn

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-narrow px-4 text-center sm:px-6">
        <div className="mb-4 flex justify-center">
          <RisingLineSvg dir={isAr ? 'rtl' : 'ltr'} variant="saffron" width={110} height={20} />
        </div>
        <p className="font-mono text-4xl font-bold text-accent-terracotta">404</p>
        <h1 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
          {isAr ? 'الصفحة غير موجودة (٤٠٤)' : 'Page Not Found (404)'}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted sm:text-base">
          {isAr
            ? 'يبدو أن الرابط الذي تبحث عنه غير متاح أو تم نقله. يمكنك العودة للصفحة الرئيسية أو طلب تحليل مجاني لمحلّك.'
            : 'The page you are looking for might have been moved or is no longer available. Return to the homepage or request a free shop audit.'}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href={isAr ? '/' : '/en'} variant="primary">
            {isAr ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
          <Button href={isAr ? '/free-audit' : '/en/free-audit'} variant="outline">
            {isAr ? 'اطلب تحليل مجاني' : 'Request Free Audit'}
          </Button>
        </div>
      </div>
    </section>
  )
}
