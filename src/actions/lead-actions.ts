'use server'

import fs from 'fs'
import path from 'path'
import { headers } from 'next/headers'
import { auditFormSchema, contactFormSchema } from '@/validations/lead-schemas'
import { encryptLeadPayload } from '@/lib/crypto'
import { crmProvider } from '@/integrations/crm'

export interface LeadActionResponse {
  success: boolean
  message: string
  fieldErrors?: Record<string, string[]>
}

// In-memory sliding window rate limiter (5 requests per 15 minutes per IP)
const rateLimitStore = new Map<string, number[]>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 5

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = (rateLimitStore.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitStore.set(ip, timestamps)
    return false
  }
  timestamps.push(now)
  rateLimitStore.set(ip, timestamps)
  return true
}

async function getClientIp(): Promise<string> {
  try {
    const hdrs = await headers()
    return (
      hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      hdrs.get('x-real-ip') ||
      '127.0.0.1'
    )
  } catch {
    return '127.0.0.1'
  }
}

async function saveSubmission(submission: Record<string, unknown>) {
  try {
    const submissionsFile = path.resolve(process.cwd(), 'src/data/submissions/submissions.json')
    const dir = path.dirname(submissionsFile)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    let list: Array<Record<string, unknown>> = []
    if (fs.existsSync(submissionsFile)) {
      try {
        const content = fs.readFileSync(submissionsFile, 'utf-8')
        list = JSON.parse(content)
      } catch {
        list = []
      }
    }
    list.push({
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...submission,
    })
    fs.writeFileSync(submissionsFile, JSON.stringify(list, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to persist encrypted lead submission to JSON:', err)
  }
}

export async function submitAuditAction(rawInput: Record<string, unknown>): Promise<LeadActionResponse> {
  const locale = rawInput.locale === 'en' ? 'en' : 'ar'

  // Silent honeypot trap
  if (typeof rawInput.website_hp === 'string' && rawInput.website_hp.length > 0) {
    return {
      success: true,
      message: locale === 'ar' ? 'تم استلام طلبك بنجاح.' : 'Your request has been received.',
    }
  }

  const ip = await getClientIp()
  if (!checkRateLimit(`audit:${ip}`)) {
    return {
      success: false,
      message:
        locale === 'ar'
          ? 'تم إرسال عدة طلبات متتالية. يرجى الانتظار قليلًا أو مراسلتنا عبر واتساب مباشرة.'
          : 'Too many requests submitted recently. Please wait a few minutes or message us directly on WhatsApp.',
    }
  }

  const parsed = auditFormSchema.safeParse(rawInput)
  if (!parsed.success) {
    return {
      success: false,
      message:
        locale === 'ar'
          ? 'يرجى التأكد من تعبئة الحقول المطلوبة بشكل صحيح.'
          : 'Please review the highlighted fields and try again.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data

  const encryptedCiphertext = encryptLeadPayload({
    name: data.name,
    shopName: data.shopName,
    businessType: data.businessType,
    city: data.city,
    instagramOrMapsLink: data.instagramOrMapsLink || '',
    whatsappE164: data.whatsapp,
    submittedAt: new Date().toISOString(),
  })

  const crmResult = await crmProvider.submitLead({
    formType: 'free_audit',
    locale: data.locale,
    name: data.name,
    shopName: data.shopName,
    businessType: data.businessType,
    city: data.city,
    instagramOrMapsLink: data.instagramOrMapsLink || '',
    whatsappE164: data.whatsapp,
    pdplConsentGranted: data.pdplConsent,
  })

  await saveSubmission({
    formType: 'free_audit',
    locale: data.locale,
    shopNameSummary: data.shopName,
    businessType: data.businessType,
    city: data.city,
    encryptedPayloadCiphertext: encryptedCiphertext,
    pdplConsentGranted: true,
    consentPolicyVersion: 'v1.0-2026',
    ghlSyncStatus: crmResult.status,
    ghlContactId: crmResult.contactId || '',
    retryCount: 0,
  })

  return {
    success: true,
    message:
      locale === 'ar'
        ? 'وصلنا طلبك! بيرسل لك فريقنا التحليل المجاني على الواتساب خلال ٤٨ ساعة عمل.'
        : 'Request received! Our team will send your free mini audit via WhatsApp within 48 business hours.',
  }
}

export async function submitContactAction(rawInput: Record<string, unknown>): Promise<LeadActionResponse> {
  const locale = rawInput.locale === 'en' ? 'en' : 'ar'

  if (typeof rawInput.website_hp === 'string' && rawInput.website_hp.length > 0) {
    return {
      success: true,
      message: locale === 'ar' ? 'تم استلام رسالتك بنجاح.' : 'Your message has been received.',
    }
  }

  const ip = await getClientIp()
  if (!checkRateLimit(`contact:${ip}`)) {
    return {
      success: false,
      message:
        locale === 'ar'
          ? 'تم إرسال عدة طلبات متتالية. يرجى مراسلتنا عبر واتساب مباشرة.'
          : 'Too many requests submitted recently. Please message us directly on WhatsApp.',
    }
  }

  const parsed = contactFormSchema.safeParse(rawInput)
  if (!parsed.success) {
    return {
      success: false,
      message:
        locale === 'ar'
          ? 'يرجى التأكد من تعبئة الحقول المطلوبة بشكل صحيح.'
          : 'Please review the highlighted fields and try again.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data

  const encryptedCiphertext = encryptLeadPayload({
    name: data.name,
    shopName: data.shopName,
    city: data.city,
    whatsappE164: data.whatsapp,
    message: data.message || '',
    submittedAt: new Date().toISOString(),
  })

  const crmResult = await crmProvider.submitLead({
    formType: 'contact',
    locale: data.locale,
    name: data.name,
    shopName: data.shopName,
    businessType: 'contact_inquiry',
    city: data.city,
    whatsappE164: data.whatsapp,
    message: data.message,
    pdplConsentGranted: data.pdplConsent,
  })

  await saveSubmission({
    formType: 'contact',
    locale: data.locale,
    shopNameSummary: data.shopName,
    businessType: 'contact_inquiry',
    city: data.city,
    encryptedPayloadCiphertext: encryptedCiphertext,
    pdplConsentGranted: true,
    consentPolicyVersion: 'v1.0-2026',
    ghlSyncStatus: crmResult.status,
    ghlContactId: crmResult.contactId || '',
    retryCount: 0,
  })

  return {
    success: true,
    message:
      locale === 'ar'
        ? 'شكرًا لتواصلك مع بيّورا! بيتواصل معك فريقنا عبر الواتساب قريبًا.'
        : 'Thank you for contacting Bayyora! Our team will reply via WhatsApp shortly.',
  }
}
