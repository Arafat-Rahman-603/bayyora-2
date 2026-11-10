import { normalizeDigits } from '@/lib/utils'

/**
 * Builds a clean wa.me link with URL-encoded pre-filled text.
 */
export function buildWhatsAppUrl(
  rawPhone: string | undefined | null,
  prefillMessage: string | undefined | null,
): string {
  const fallbackPhone = '966500000000'
  const cleanedPhone = normalizeDigits(rawPhone || fallbackPhone).replace(/\D/g, '') || fallbackPhone
  const message = (prefillMessage || '').trim()

  if (!message) {
    return `https://wa.me/${cleanedPhone}`
  }

  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`
}

