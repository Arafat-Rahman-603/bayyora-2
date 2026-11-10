import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Converts Arabic-Indic (٠-٩) and Eastern Arabic/Persian (۰-۹) digits to ASCII (0-9).
 */
export function normalizeDigits(input: string): string {
  return input
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
}

/**
 * Normalizes a Saudi mobile/WhatsApp phone number into E.164 format (+9665XXXXXXXX)
 * or digits-only format (9665XXXXXXXX) for wa.me URLs.
 * Accepts inputs like "0551234567", "٠٥٥١٢٣٤٥٦٧", "+966 55 123 4567", "966551234567", "551234567".
 */
export function normalizeSaudiPhone(input: string): {
  isValid: boolean
  e164: string
  waDigits: string
} {
  const ascii = normalizeDigits(input).replace(/[\s\-().]/g, '')
  const cleaned = ascii.startsWith('+') ? ascii.slice(1) : ascii.startsWith('00') ? ascii.slice(2) : ascii

  let nationalNine = ''
  if (/^9665\d{8}$/.test(cleaned)) {
    nationalNine = cleaned.slice(3)
  } else if (/^05\d{8}$/.test(cleaned)) {
    nationalNine = cleaned.slice(1)
  } else if (/^5\d{8}$/.test(cleaned)) {
    nationalNine = cleaned
  } else {
    return {
      isValid: false,
      e164: input.trim(),
      waDigits: cleaned.replace(/\D/g, ''),
    }
  }

  return {
    isValid: true,
    e164: `+966${nationalNine}`,
    waDigits: `966${nationalNine}`,
  }
}

/**
 * Computes word-level Jaccard similarity (0.0 to 1.0) between two texts.
 * Used by the Cities collection anti-doorway hook (AUD-019) to prevent duplicate city copy (> 0.40 threshold).
 */
export function calculateJaccardSimilarity(textA: string, textB: string): number {
  const tokenize = (str: string) =>
    new Set(
      str
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter((token) => token.length > 2),
    )

  const setA = tokenize(textA)
  const setB = tokenize(textB)

  if (setA.size === 0 || setB.size === 0) return 0

  let intersection = 0
  for (const word of setA) {
    if (setB.has(word)) intersection++
  }

  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}

/**
 * Estimates reading time in minutes for Arabic and English text (~200 words/min).
 */
export function calculateReadingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

