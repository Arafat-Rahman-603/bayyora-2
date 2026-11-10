import { z } from 'zod'
import { normalizeSaudiPhone } from '@/lib/utils'

/**
 * Validates optional Instagram handle (@shopname) or HTTP/HTTPS URL (Google Maps / Instagram / Website).
 * Strictly blocks javascript:, data:, vbscript:, and file: protocols (AUD-026).
 */
export const safeSocialOrMapsLinkSchema = z
  .string()
  .trim()
  .max(300)
  .optional()
  .or(z.literal(''))
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true
      const trimmed = val.trim()
      if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
        return false
      }
      // Allow @handle or handle or http(s) URL
      if (trimmed.startsWith('@') && /^@[a-zA-Z0-9._-]{2,60}$/.test(trimmed)) {
        return true
      }
      if (/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(trimmed)) {
        return true
      }
      // Also allow clean domain/handle text without scheme
      return /^[\p{L}\p{N}._\-/]+$/u.test(trimmed)
    },
    {
      message: 'يرجى إدخال معرف حساب صحيح (@shop) أو رابط يبدأ بـ https:// / Please enter a valid @handle or https:// link.',
    },
  )

export const saudiWhatsAppSchema = z
  .string()
  .trim()
  .min(9, 'رقم الواتساب مطلوب / WhatsApp number is required')
  .transform((val, ctx) => {
    const normalized = normalizeSaudiPhone(val)
    if (!normalized.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 0551234567 أو ٠٥٥١٢٣٤٥٦٧) / Please enter a valid Saudi mobile number (05XXXXXXXX).',
      })
      return z.NEVER
    }
    return normalized.e164
  })

/**
 * 6-Field Free Mini Audit Form Schema (/free-audit)
 * Note: Uses a single full-name field supporting Arabic & international characters (modern-web-guidance: forms).
 */
export const auditFormSchema = z.object({
  locale: z.enum(['ar', 'en']).default('ar'),
  name: z
    .string()
    .trim()
    .min(2, 'الاسم مطلوب / Your name is required')
    .max(100),
  shopName: z
    .string()
    .trim()
    .min(2, 'اسم المحل أو المشروع مطلوب / Shop name is required')
    .max(120),
  businessType: z.enum(['restaurant', 'cafe', 'pharmacy', 'salon', 'retail', 'other']),
  city: z.enum(['al-ahsa', 'hofuf', 'mubarraz', 'dammam', 'khobar', 'other']),
  instagramOrMapsLink: safeSocialOrMapsLinkSchema,
  whatsapp: saudiWhatsAppSchema,
  pdplConsent: z.literal(true, {
    errorMap: () => ({
      message: 'يرجى الموافقة على سياسة الخصوصية لإرسال التحليل / Please agree to the privacy policy to proceed.',
    }),
  }),
  website_hp: z.string().max(0).optional().default(''),
})

export type AuditFormInput = z.input<typeof auditFormSchema>
export type AuditFormParsed = z.output<typeof auditFormSchema>

/**
 * Contact & Visit Inquiry Form Schema (/contact)
 */
export const contactFormSchema = z.object({
  locale: z.enum(['ar', 'en']).default('ar'),
  name: z
    .string()
    .trim()
    .min(2, 'الاسم مطلوب / Your name is required')
    .max(100),
  shopName: z
    .string()
    .trim()
    .min(2, 'اسم المحل مطلوب / Shop name is required')
    .max(120),
  city: z.enum(['al-ahsa', 'hofuf', 'mubarraz', 'dammam', 'khobar', 'other']),
  whatsapp: saudiWhatsAppSchema,
  message: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .default(''),
  pdplConsent: z.literal(true, {
    errorMap: () => ({
      message: 'يرجى الموافقة على سياسة الخصوصية / Please agree to the privacy policy.',
    }),
  }),
  website_hp: z.string().max(0).optional().default(''),
})

export type ContactFormInput = z.input<typeof contactFormSchema>
export type ContactFormParsed = z.output<typeof contactFormSchema>

