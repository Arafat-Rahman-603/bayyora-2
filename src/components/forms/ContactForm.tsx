'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { submitContactAction } from '@/actions/lead-actions'
import { Button } from '@/components/ui/Button'
import { localizePath, type Locale } from '@/i18n/config'

interface ContactFormProps {
  locale: Locale
  uiLabels?: {
    formHeading?: string | null
    messageLabel?: string | null
    messagePlaceholder?: string | null
    submitButtonLabel?: string | null
    successHeadline?: string | null
    successMessage?: string | null
  }
}

export function ContactForm({ locale, uiLabels }: ContactFormProps) {
  const isAr = locale === 'ar'
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [city, setCity] = useState('al-ahsa')
  const [whatsapp, setWhatsapp] = useState('')
  const [message, setMessage] = useState('')
  const [pdplConsent, setPdplConsent] = useState(false)

  const [submitted, setSubmitted] = useState(false)
  const [errorBanner, setErrorBanner] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorBanner(null)
    setFieldErrors({})

    startTransition(async () => {
      const res = await submitContactAction({
        locale,
        name,
        shopName,
        city,
        whatsapp,
        message,
        pdplConsent,
      })

      if (res.success) {
        setSubmitted(true)
      } else {
        setErrorBanner(res.message)
        if (res.fieldErrors) setFieldErrors(res.fieldErrors)
      }
    })
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border-2 border-oasis bg-surface p-7 text-center shadow-sm"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-oasis/15 text-oasis">
          <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-navy">
          {uiLabels?.successHeadline ||
            (isAr ? 'شكرًا لتواصلك مع بيّورا!' : 'Thank You for Reaching Out to Bayyora!')}
        </h3>
        <p className="mt-2 text-sm text-ink">
          {uiLabels?.successMessage ||
            (isAr
              ? 'استلمنا رسالتك وبيتواصل معك فريقنا عبر الواتساب في أقرب وقت.'
              : 'We have received your message and our team will reply via WhatsApp shortly.')}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-subtle bg-surface p-6 shadow-sm sm:p-8"
    >
      <h2 className="mb-5 text-xl font-bold text-navy sm:text-2xl">
        {uiLabels?.formHeading || (isAr ? 'أرسل لنا رسالة سريعة' : 'Send Us a Quick Message')}
      </h2>

      {errorBanner && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 flex items-start gap-2.5 rounded-xl border border-danger bg-danger/5 p-3.5 text-xs font-semibold text-danger sm:text-sm"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorBanner}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-bold text-navy">
            {isAr ? 'اسمك الكريم' : 'Your Name'} *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
            className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-base text-ink"
          />
          {fieldErrors.name && (
            <p id="contact-name-error" className="mt-1 text-xs font-semibold text-danger">
              {fieldErrors.name[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-shop" className="mb-1.5 block text-sm font-bold text-navy">
              {isAr ? 'اسم المحل أو المشروع' : 'Shop Name'} *
            </label>
            <input
              id="contact-shop"
              name="shopName"
              type="text"
              required
              autoComplete="organization"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              aria-invalid={Boolean(fieldErrors.shopName)}
              aria-describedby={fieldErrors.shopName ? 'contact-shop-error' : undefined}
              className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-base text-ink"
            />
            {fieldErrors.shopName && (
              <p id="contact-shop-error" className="mt-1 text-xs font-semibold text-danger">
                {fieldErrors.shopName[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-city" className="mb-1.5 block text-sm font-bold text-navy">
              {isAr ? 'المدينة' : 'City'} *
            </label>
            <select
              id="contact-city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 w-full rounded-xl border border-input bg-surface px-3.5 text-base text-ink"
            >
              <option value="al-ahsa">{isAr ? 'الأحساء' : 'Al Ahsa'}</option>
              <option value="hofuf">{isAr ? 'الهفوف' : 'Hofuf'}</option>
              <option value="mubarraz">{isAr ? 'المبرز' : 'Mubarraz'}</option>
              <option value="dammam">{isAr ? 'الدمام' : 'Dammam'}</option>
              <option value="khobar">{isAr ? 'الخبر' : 'Khobar'}</option>
              <option value="other">{isAr ? 'مدينة أخرى' : 'Other City'}</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contact-whatsapp" className="mb-1.5 block text-sm font-bold text-navy">
            {isAr ? 'رقم الواتساب' : 'WhatsApp Number'} *
          </label>
          <input
            id="contact-whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            dir="ltr"
            required
            autoComplete="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="05XXXXXXXX"
            aria-invalid={Boolean(fieldErrors.whatsapp)}
            aria-describedby={fieldErrors.whatsapp ? 'contact-whatsapp-error' : undefined}
            className="h-12 w-full rounded-xl border border-input bg-surface px-4 text-start font-mono text-base text-ink"
          />
          {fieldErrors.whatsapp && (
            <p id="contact-whatsapp-error" className="mt-1 text-xs font-semibold text-danger">
              {fieldErrors.whatsapp[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-bold text-navy">
            {uiLabels?.messageLabel ||
              (isAr ? 'كيف نقدر نساعد محلّك؟' : 'How can we help your shop?')}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              uiLabels?.messagePlaceholder ||
              (isAr
                ? 'اكتب لنا باختصار وش الخدمة أو الباقة اللي تفكر فيها...'
                : 'Tell us briefly which service or package you are exploring...')
            }
            className="w-full rounded-xl border border-input bg-surface p-3.5 text-base text-ink"
          />
        </div>

        <div className="rounded-xl border border-subtle bg-canvas p-3.5">
          <div className="flex items-start gap-2.5">
            <input
              id="contact-pdpl"
              type="checkbox"
              required
              checked={pdplConsent}
              onChange={(e) => setPdplConsent(e.target.checked)}
              aria-invalid={Boolean(fieldErrors.pdplConsent)}
              aria-describedby={fieldErrors.pdplConsent ? 'contact-pdpl-error' : undefined}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-input accent-navy"
            />
            <label htmlFor="contact-pdpl" className="cursor-pointer text-xs leading-relaxed text-ink">
              {isAr
                ? 'أوافق على سياسة الخصوصية والتواصل معي عبر واتساب وفق نظام حماية البيانات الشخصية السعودي (PDPL).'
                : 'I agree to the Privacy Policy and consent to being contacted via WhatsApp under the Saudi PDPL.'}{' '}
              <Link
                href={localizePath('/privacy', locale)}
                className="font-bold text-oasis underline"
              >
                {isAr ? '(سياسة الخصوصية)' : '(Privacy Policy)'}
              </Link>
            </label>
          </div>
          {fieldErrors.pdplConsent && (
            <p id="contact-pdpl-error" className="mt-2 text-xs font-semibold text-danger">
              {fieldErrors.pdplConsent[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full"
        >
          {isPending
            ? isAr
              ? 'جاري الإرسال...'
              : 'Sending...'
            : uiLabels?.submitButtonLabel || (isAr ? 'إرسال الرسالة' : 'Send Message')}
        </Button>
      </div>
    </form>
  )
}

