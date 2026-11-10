import { describe, expect, it } from 'vitest'
import {
  calculateJaccardSimilarity,
  calculateReadingTimeMinutes,
  normalizeDigits,
  normalizeSaudiPhone,
} from '@/lib/utils'
import {
  getContrastRatio,
  hexToRgbChannels,
  passesWcagAA,
  selectAccessibleOnAccentColor,
} from '@/lib/contrast-validator'
import { decryptLeadPayload, encryptLeadPayload, timingSafeCompare } from '@/lib/crypto'
import { auditFormSchema, contactFormSchema } from '@/validations/lead-schemas'
import { buildCanonicalUrl, buildPageMetadata } from '@/seo/metadata'
import { safeJsonLdStringify } from '@/seo/json-ld'
import { localizePath, stripLocaleFromPath } from '@/i18n/config'
import { buildWhatsAppUrl } from '@/integrations/whatsapp'

describe('Saudi Phone & Arabic-Indic Digit Normalization', () => {
  it('converts Arabic-Indic (٠-٩) and Eastern Arabic (۰-۹) digits to ASCII', () => {
    expect(normalizeDigits('٠٥٥١٢٣٤٥٦٧')).toBe('0551234567')
    expect(normalizeDigits('۰۵۵۱۲۳۴۵۶۷')).toBe('0551234567')
  })

  it('normalizes Saudi mobile numbers in local, international, and Arabic-Indic formats', () => {
    const fromArabicIndic = normalizeSaudiPhone('٠٥٥ ١٢٣ ٤٥٦٧')
    expect(fromArabicIndic).toEqual({
      isValid: true,
      e164: '+966551234567',
      waDigits: '966551234567',
    })

    const fromLocal = normalizeSaudiPhone('0509876543')
    expect(fromLocal).toEqual({
      isValid: true,
      e164: '+966509876543',
      waDigits: '966509876543',
    })

    const fromE164 = normalizeSaudiPhone('+966 54-111-2233')
    expect(fromE164).toEqual({
      isValid: true,
      e164: '+966541112233',
      waDigits: '966541112233',
    })

    const invalid = normalizeSaudiPhone('0138889999') // landline, not mobile 05X
    expect(invalid.isValid).toBe(false)
  })
})

describe('Lead Form Validation (Free Audit & Contact Schemas)', () => {
  it('validates a complete 6-field Free Mini Audit submission with Arabic-Indic WhatsApp digits', () => {
    const parsed = auditFormSchema.safeParse({
      locale: 'ar',
      name: 'عبدالرحمن العتيبي',
      shopName: 'مقهى نجد المختص',
      businessType: 'cafe',
      city: 'al-ahsa',
      instagramOrMapsLink: '@najdcafe_ahsa',
      whatsapp: '٠٥٥١٢٣٤٥٦٧',
      pdplConsent: true,
      website_hp: '',
    })

    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.whatsapp).toBe('+966551234567')
    }
  })

  it('rejects XSS / javascript: protocol links in instagramOrMapsLink (AUD-026)', () => {
    const parsed = auditFormSchema.safeParse({
      locale: 'en',
      name: 'Test User',
      shopName: 'Test Shop',
      businessType: 'retail',
      city: 'dammam',
      instagramOrMapsLink: 'javascript:alert(document.cookie)',
      whatsapp: '0551234567',
      pdplConsent: true,
      website_hp: '',
    })

    expect(parsed.success).toBe(false)
  })

  it('rejects submissions without Saudi PDPL consent', () => {
    const parsed = contactFormSchema.safeParse({
      locale: 'ar',
      name: 'فهد الدوسري',
      shopName: 'مطعم الديرة',
      city: 'hofuf',
      whatsapp: '0551234567',
      message: 'نرغب في طلب زيارة ميدانية',
      pdplConsent: false,
      website_hp: '',
    })

    expect(parsed.success).toBe(false)
  })
})

describe('WCAG 2.2 AA Contrast & Luminance Validator', () => {
  it('validates Bayyora Deep Navy (#0D2235) on Warm Cream (#FBF7F0) passes AAA/AA normal text', () => {
    const check = passesWcagAA('#0D2235', '#FBF7F0', 'normal_text')
    expect(check.passes).toBe(true)
    expect(check.ratio).toBeGreaterThan(13)
  })

  it('validates Golden Amber (#F2A541) with Deep Navy (#0D2235) text and rejects white text on Golden Amber', () => {
    const withNavy = passesWcagAA('#0D2235', '#F2A541', 'normal_text')
    expect(withNavy.passes).toBe(true)
    expect(withNavy.ratio).toBeGreaterThanOrEqual(7.0)
    expect(selectAccessibleOnAccentColor('#F2A541')).toBe('#0D2235')
  })

  it('validates form input border token (#7A869A) on White (#FFFFFF) meets WCAG 1.4.11 (>= 3.0:1)', () => {
    const borderCheck = passesWcagAA('#7A869A', '#FFFFFF', 'ui_component')
    expect(borderCheck.passes).toBe(true)
    expect(borderCheck.ratio).toBeGreaterThanOrEqual(3.0)
  })

  it('validates Darker Coral (#C83E1B) on White (#FFFFFF) passes 4.5:1 normal text while raw #E4572E fails', () => {
    const darkerCoral = passesWcagAA('#C83E1B', '#FFFFFF', 'normal_text')
    expect(darkerCoral.passes).toBe(true)
    expect(darkerCoral.ratio).toBeGreaterThanOrEqual(4.5)

    const rawCoralText = getContrastRatio('#E4572E', '#FFFFFF')
    expect(rawCoralText).toBeLessThan(4.5)
  })

  it('converts hex tokens to space-separated RGB channels for Tailwind alpha composition', () => {
    expect(hexToRgbChannels('#F7F3EB', '0 0 0')).toBe('247 243 235')
    expect(hexToRgbChannels('#FFFFFF', '0 0 0')).toBe('255 255 255')
    expect(hexToRgbChannels('#0D2235', '0 0 0')).toBe('13 34 53')
    expect(hexToRgbChannels(null, '247 243 235')).toBe('247 243 235')
  })
})

describe('AES-256-GCM Lead Payload Encryption & Timing-Safe Secret Comparison', () => {
  it('encrypts and decrypts PII lead payloads losslessly using AES-256-GCM (AUD-030)', () => {
    const payload = {
      name: 'سلمان الأحمد',
      shopName: 'صيدلية الشفاء',
      whatsapp: '+966551234567',
      city: 'khobar',
    }

    const ciphertext = encryptLeadPayload(payload)
    expect(ciphertext).not.toContain('سلمان')
    expect(ciphertext.split(':')).toHaveLength(3)

    const decrypted = decryptLeadPayload(ciphertext)
    expect(decrypted).toEqual(payload)
  })

  it('returns null when AES-256-GCM authTag or ciphertext is tampered with', () => {
    const ciphertext = encryptLeadPayload({ name: 'Test' })
    const tampered = `${ciphertext.slice(0, -4)}ffff`
    expect(decryptLeadPayload(tampered)).toBeNull()
  })

  it('compares secrets in constant time via SHA-256 digest (AUD-003)', () => {
    expect(timingSafeCompare('secret_123', 'secret_123')).toBe(true)
    expect(timingSafeCompare('secret_123', 'secret_124')).toBe(false)
    expect(timingSafeCompare('', 'secret_123')).toBe(false)
  })
})

describe('Anti-Doorway City Similarity & SEO / i18n Utilities', () => {
  it('computes low Jaccard similarity for genuinely distinct Eastern Province city pages (AUD-019)', () => {
    const alAhsaText =
      'نخدم أصحاب المحلات والمطاعم والمقاهي والعيادات في الأحساء بسوق القيصرية التاريخي وشارع الظهران والهفوف والمبرز بزيارات ميدانية وتصوير احترافي.'
    const khobarText =
      'نساعد العلامات التجارية الفاخرة والكافيهات المختصة في كورنيش الخبر وحي العقربية والحزام الذهبي على بناء هوية بصرية راقية وإعلانات بحث محلية.'

    const similarity = calculateJaccardSimilarity(alAhsaText, khobarText)
    expect(similarity).toBeLessThanOrEqual(0.4)

    const duplicateSimilarity = calculateJaccardSimilarity(alAhsaText, alAhsaText)
    expect(duplicateSimilarity).toBe(1)
  })

  it('builds canonical URLs and reciprocal hreflang metadata without trailing slashes (AUD-018)', () => {
    expect(localizePath('/', 'ar')).toBe('/')
    expect(localizePath('/', 'en')).toBe('/en')
    expect(localizePath('/services/brand-identity', 'ar')).toBe('/services/brand-identity')
    expect(localizePath('/services/brand-identity', 'en')).toBe('/en/services/brand-identity')
    expect(stripLocaleFromPath('/en/packages').barePath).toBe('/packages')

    expect(buildCanonicalUrl('/')).toBe('https://bayyora.com')
    expect(buildCanonicalUrl('/en/services/')).toBe('https://bayyora.com/en/services')

    const meta = buildPageMetadata({
      locale: 'ar',
      barePath: '/services/brand-identity',
      title: 'الهوية والشعار',
      description: 'تصميم هوية بصرية وشعار للمحلات في الشرقية',
    })

    expect(meta.alternates?.canonical).toBe('https://bayyora.com/services/brand-identity')
    expect(meta.alternates?.languages).toEqual({
      'ar-SA': 'https://bayyora.com/services/brand-identity',
      en: 'https://bayyora.com/en/services/brand-identity',
      'x-default': 'https://bayyora.com/services/brand-identity',
    })
  })

  it('escapes "</script>" sequences in JSON-LD serialization (AUD-025)', () => {
    const serialized = safeJsonLdStringify({
      '@context': 'https://schema.org',
      name: 'Evil </script><script>alert(1)</script>',
    })
    expect(serialized).not.toContain('</script>')
    expect(serialized).toContain('\\u003c/script\\u003e')
  })

  it('generates localized WhatsApp deep links and reading time estimates', () => {
    const waUrl = buildWhatsAppUrl('+966 53 749 2314', 'مرحباً بيّورا — أرغب في الاستفسار عن باقة نمو')
    expect(waUrl.startsWith('https://wa.me/966537492314?text=')).toBe(true)
    expect(decodeURIComponent(waUrl)).toContain('باقة نمو')
    expect(calculateReadingTimeMinutes('كلمة '.repeat(420))).toBe(3)
  })
})
