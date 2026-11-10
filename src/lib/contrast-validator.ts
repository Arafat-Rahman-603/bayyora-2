/**
 * WCAG 2.2 AA Relative Luminance & Contrast Ratio Calculator
 * Enforces mathematical contrast verification for ThemeSettings (18-DESIGN-CUSTOMIZATION-AND-THEMING.md & 25-DESIGN-SYSTEM-SPECIFICATION.md).
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return null
  }
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned

  const num = parseInt(full, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

/**
 * Converts a hex color string (e.g. "#F7F3EB") into space-separated RGB channels ("247 243 235")
 * for Tailwind CSS `<alpha-value>` variable composition (`rgb(var(--rgb-*) / <alpha-value>)`).
 */
export function hexToRgbChannels(hex: string | undefined | null, fallbackChannels: string): string {
  if (!hex) return fallbackChannels
  const rgb = hexToRgb(hex)
  if (!rgb) return fallbackChannels
  return `${rgb.r} ${rgb.g} ${rgb.b}`
}

export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) {
    throw new Error(`Invalid hex color: ${hex}`)
  }

  const transform = (channel: number): number => {
    const sRGB = channel / 255
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
  }

  const R = transform(rgb.r)
  const G = transform(rgb.g)
  const B = transform(rgb.b)

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1)
  const lum2 = getRelativeLuminance(hex2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2))
}

export function passesWcagAA(
  foregroundHex: string,
  backgroundHex: string,
  level: 'normal_text' | 'large_text' | 'ui_component' = 'normal_text',
): { passes: boolean; ratio: number; required: number } {
  const ratio = getContrastRatio(foregroundHex, backgroundHex)
  const required = level === 'normal_text' ? 4.5 : 3.0
  return {
    passes: ratio >= required,
    ratio,
    required,
  }
}

/**
 * Automatically selects the highest-contrast text color (#0D2235 Navy vs #FFFFFF White)
 * for a given accent button background.
 */
export function selectAccessibleOnAccentColor(accentHex: string): '#0D2235' | '#FFFFFF' {
  const navyRatio = getContrastRatio(accentHex, '#0D2235')
  const whiteRatio = getContrastRatio(accentHex, '#FFFFFF')
  return navyRatio >= whiteRatio ? '#0D2235' : '#FFFFFF'
}

