'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { submitAuditAction } from '@/actions/lead-actions'
import { Button, WhatsAppIcon } from '@/components/ui/Button'
import { localizePath, type Locale } from '@/i18n/config'

interface FreeAuditFormProps {
  locale: Locale
  whatsappUrl: string
  uiLabels?: {
    nameLabel?: string | null
    namePlaceholder?: string | null
    shopNameLabel?: string | null
    shopNamePlaceholder?: string | null
    businessTypeLabel?: string | null
    cityLabel?: string | null
    linkLabel?: string | null
    linkPlaceholder?: string | null
    linkHelperText?: string | null
    whatsappLabel?: string | null
    whatsappPlaceholder?: string | null
    whatsappHelperText?: string | null
    pdplConsentLabel?: string | null
    submitButtonLabel?: string | null
    submittingLabel?: string | null
    successHeadline?: string | null
    successMessage?: string | null
    urgentWhatsappCtaLabel?: string | null
  }
}

export function FreeAuditForm({ locale, whatsappUrl, uiLabels }: FreeAuditFormProps) {
  const isAr = locale === 'ar'
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [businessType, setBusinessType] = useState('cafe')
  const [city, setCity] = useState('al-ahsa')
  const [instagramOrMapsLink, setInstagramOrMapsLink] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [pdplConsent, setPdplConsent] = useState(false)
  const [websiteHp, setWebsiteHp] = useState('')

  const [submitted, setSubmitted] = useState(false)
  const [errorBanner, setErrorBanner] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorBanner(null)
    setFieldErrors({})

    startTransition(async () => {
      const res = await submitAuditAction({
        locale,
        name,
        shopName,
        businessType,
        city,
        instagramOrMapsLink,
        whatsapp,
        pdplConsent,
        website_hp: websiteHp,
      })

      if (res.success) {
        setSubmitted(true)
      } else {
        setErrorBanner(res.message)
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors)
        }
      }
    })
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border-2 border-oasis bg-surface p-7 text-center shadow-md sm:p-10"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-oasis/15 text-oasis">
          <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-navy">
          {uiLabels?.successHeadline ||
            (isAr ? 'وصلنا طلبك! محلّك الحين تحت الفحص' : 'Request Received! Your Audit Is Underway')}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-ink">
          {uiLabels?.successMessage ||
            (isAr
              ? 'فريقنا بيراجع ظهور محلّك في خرائط جوجل وحسابات السوشال ميديا، وبيرسل لك ٣ ملاحظات عملية واضحة على الواتساب خلال ٤٨ ساعة عمل.'
              : 'Our local team will review your Google Maps presence and social accounts, and send 3 practical recommendations to your WhatsApp within 48 business hours.')}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href={whatsappUrl} variant="whatsapp" external>
            <WhatsAppIcon />
            <span>
              {uiLabels?.urgentWhatsappCtaLabel ||
                (isAr ? 'مستعجل؟ راسلنا على واتساب الحين' : 'In a hurry? Chat with us on WhatsApp now')}
            </span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-subtle bg-surface p-6 shadow-sm sm:p-8"
    >
      {errorBanner && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 flex items-start gap-3 rounded-xl border-2 border-danger bg-danger/5 p-4 text-sm font-semibold text-danger"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p>{errorBanner}</p>
          </div>
        </div>
      )}

      {/* Honeypot field hidden from assistive tech and visual users */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="audit-website-hp">Website</label>
        <input
          id="audit-website-hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={websiteHp}
          onChange={(e) => setWebsiteHp(e.target.value)}
        />
      </div>

      <div className="space-y-5">
        {/* Field 1: Single Full Name Field (modern-web-guidance: forms) */}
        <div>
          <label
            htmlFor="audit-name"
            className="mb-1.5 block text-sm font-bold text-navy"
          >
            {uiLabels?.nameLabel || (isAr ? 'اسمك الكريم' : 'Your Name')} *
          </label>
          <input
            id="audit-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={
              uiLabels?.namePlaceholder ||
              (isAr ? 'مثال: محمد العبدالله' : 'e.g. Mohammed Al-Abdullah')
            }
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'audit-name-error' : undefined}
            className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-base text-ink placeholder:text-muted/70 focus-visible:border-navy"
          />
          {fieldErrors.name && (
            <p id="audit-name-error" className="mt-1.5 text-xs font-semibold text-danger">
              {fieldErrors.name[0]}
            </p>
          )}
        </div>

        {/* Field 2: Shop or Business Name */}
        <div>
          <label
            htmlFor="audit-shopName"
            className="mb-1.5 block text-sm font-bold text-navy"
          >
            {uiLabels?.shopNameLabel || (isAr ? 'اسم المحل أو المشروع' : 'Shop or Business Name')} *
          </label>
          <input
            id="audit-shopName"
            name="shopName"
            type="text"
            required
            autoComplete="organization"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder={
              uiLabels?.shopNamePlaceholder ||
              (isAr ? 'مثال: كافيه سعف / صيدلية النور' : 'e.g. Saaf Cafe / Al Noor Pharmacy')
            }
            aria-invalid={Boolean(fieldErrors.shopName)}
            aria-describedby={fieldErrors.shopName ? 'audit-shop-error' : undefined}
            className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-base text-ink placeholder:text-muted/70 focus-visible:border-navy"
          />
          {fieldErrors.shopName && (
            <p id="audit-shop-error" className="mt-1.5 text-xs font-semibold text-danger">
              {fieldErrors.shopName[0]}
            </p>
          )}
        </div>

        {/* Fields 3 & 4: Business Category + City */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="audit-businessType"
              className="mb-1.5 block text-sm font-bold text-navy"
            >
              {uiLabels?.businessTypeLabel || (isAr ? 'نوع النشاط التجاري' : 'Business Category')} *
            </label>
            <select
              id="audit-businessType"
              name="businessType"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-surface px-3.5 text-base text-ink focus-visible:border-navy"
            >
              <option value="restaurant">{isAr ? 'مطعم' : 'Restaurant'}</option>
              <option value="cafe">{isAr ? 'كافيه / قهوة مختصة' : 'Cafe & Coffee Shop'}</option>
              <option value="pharmacy">{isAr ? 'صيدلية / عيادة' : 'Pharmacy & Clinic'}</option>
              <option value="salon">{isAr ? 'صالون / مركز عناية' : 'Salon & Beauty'}</option>
              <option value="retail">{isAr ? 'محل تجزئة / معرض' : 'Retail Shop'}</option>
              <option value="other">{isAr ? 'نشاط آخر' : 'Other Business'}</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="audit-city"
              className="mb-1.5 block text-sm font-bold text-navy"
            >
              {uiLabels?.cityLabel || (isAr ? 'المدينة' : 'City')} *
            </label>
            <select
              id="audit-city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-surface px-3.5 text-base text-ink focus-visible:border-navy"
            >
              <option value="al-ahsa">{isAr ? 'الأحساء' : 'Al Ahsa'}</option>
              <option value="hofuf">{isAr ? 'الهفوف' : 'Hofuf'}</option>
              <option value="mubarraz">{isAr ? 'المبرز' : 'Mubarraz'}</option>
              <option value="dammam">{isAr ? 'الدمام' : 'Dammam'}</option>
              <option value="khobar">{isAr ? 'الخبر' : 'Khobar'}</option>
              <option value="other">{isAr ? 'مدينة أخرى في السعودية' : 'Other Saudi City'}</option>
            </select>
          </div>
        </div>

        {/* Field 5: Instagram Handle or Google Maps URL */}
        <div>
          <label
            htmlFor="audit-link"
            className="mb-1.5 block text-sm font-bold text-navy"
          >
            {uiLabels?.linkLabel ||
              (isAr
                ? 'رابط حساب إنستغرام أو خرائط جوجل (اختياري)'
                : 'Instagram Handle or Google Maps Link (Optional)')}
          </label>
          <input
            id="audit-link"
            name="instagramOrMapsLink"
            type="text"
            dir="auto"
            value={instagramOrMapsLink}
            onChange={(e) => setInstagramOrMapsLink(e.target.value)}
            placeholder={
              uiLabels?.linkPlaceholder ||
              (isAr
                ? 'مثال: حساب المحل في إنستقرام أو رابط خرائط جوجل'
                : '@shopname / https://maps.google.com/...')
            }
            aria-invalid={Boolean(fieldErrors.instagramOrMapsLink)}
            aria-describedby={
              fieldErrors.instagramOrMapsLink
                ? 'audit-link-helper audit-link-error'
                : 'audit-link-helper'
            }
            className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-start text-base text-ink placeholder:text-muted/70 focus-visible:border-navy"
          />
          <p id="audit-link-helper" className="mt-1 text-xs text-muted">
            {uiLabels?.linkHelperText ||
              (isAr
                ? 'يساعدنا نفحص حسابك وظهورك في الخريطة قبل ما نتواصل معك'
                : 'Helps our team inspect your profile and map listing before we message you')}
          </p>
          {fieldErrors.instagramOrMapsLink && (
            <p id="audit-link-error" className="mt-1 text-xs font-semibold text-danger">
              {fieldErrors.instagramOrMapsLink[0]}
            </p>
          )}
        </div>

        {/* Field 6: WhatsApp Number (Supports Arabic-Indic ٠-٩ and ASCII 0-9) */}
        <div>
          <label
            htmlFor="audit-whatsapp"
            className="mb-1.5 block text-sm font-bold text-navy"
          >
            {uiLabels?.whatsappLabel ||
              (isAr ? 'رقم الواتساب (لإرسال التقرير)' : 'WhatsApp Number (to receive your audit)')} *
          </label>
          <input
            id="audit-whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            dir="ltr"
            required
            autoComplete="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder={uiLabels?.whatsappPlaceholder || '05XXXXXXXX'}
            aria-invalid={Boolean(fieldErrors.whatsapp)}
            aria-describedby={
              fieldErrors.whatsapp
                ? 'audit-whatsapp-helper audit-whatsapp-error'
                : 'audit-whatsapp-helper'
            }
            className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-start font-mono text-base text-ink placeholder:text-muted/70 focus-visible:border-navy"
          />
          <p id="audit-whatsapp-helper" className="mt-1 text-xs text-muted">
            {uiLabels?.whatsappHelperText ||
              (isAr
                ? 'يدعم الأرقام العربية (٠٥...) أو الإنجليزية (05...)'
                : 'Accepts Saudi mobile numbers in Arabic (٠٥...) or English (05...) digits')}
          </p>
          {fieldErrors.whatsapp && (
            <p id="audit-whatsapp-error" className="mt-1 text-xs font-semibold text-danger">
              {fieldErrors.whatsapp[0]}
            </p>
          )}
        </div>

        {/* Saudi PDPL Explicit Consent Checkbox */}
        <div className="rounded-xl border border-subtle bg-canvas p-4">
          <div className="flex items-start gap-3">
            <input
              id="audit-pdpl-consent"
              name="pdplConsent"
              type="checkbox"
              required
              checked={pdplConsent}
              onChange={(e) => setPdplConsent(e.target.checked)}
              aria-invalid={Boolean(fieldErrors.pdplConsent)}
              aria-describedby={fieldErrors.pdplConsent ? 'audit-pdpl-error' : undefined}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-input accent-navy"
            />
            <label htmlFor="audit-pdpl-consent" className="cursor-pointer text-xs leading-relaxed text-ink sm:text-sm">
              {uiLabels?.pdplConsentLabel ||
                (isAr
                  ? 'أوافق على سياسة الخصوصية واستخدام بياناتي لإرسال التحليل المجاني عبر واتساب وفق نظام حماية البيانات الشخصية السعودي (PDPL).'
                  : 'I agree to the Privacy Policy and consent to Bayyora processing my details to send my free mini audit via WhatsApp under the Saudi PDPL.')}{' '}
              <Link
                href={localizePath('/privacy', locale)}
                className="font-bold text-oasis underline underline-offset-2"
              >
                {isAr ? '(سياسة الخصوصية)' : '(Privacy Policy)'}
              </Link>
            </label>
          </div>
          {fieldErrors.pdplConsent && (
            <p id="audit-pdpl-error" className="mt-2 text-xs font-semibold text-danger">
              {fieldErrors.pdplConsent[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full"
        >
          {isPending
            ? uiLabels?.submittingLabel || (isAr ? 'جاري إرسال طلبك...' : 'Submitting your request...')
            : uiLabels?.submitButtonLabel ||
              (isAr ? 'اطلب التحليل المجاني الآن' : 'Request My Free Mini Audit')}
        </Button>
      </div>
    </form>
  )
}

