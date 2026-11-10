import React from 'react'
import { cn } from '@/lib/utils'

interface RisingLineSvgProps {
  className?: string
  dir?: 'rtl' | 'ltr'
  variant?: 'saffron' | 'terracotta' | 'oasis'
  width?: number
  height?: number
}

/**
 * Bayyora Signature Brand Motif: The Rising Line ("خطوة لفوق" / "One step up").
 * Automatically mirrors direction in RTL (sweeps right-to-left upward) vs LTR (sweeps left-to-right upward),
 * and animates its stroke draw via `.rising-line-path`.
 * Marked aria-hidden="true" as decorative SVG per modern-web-guidance: accessibility.
 */
export function RisingLineSvg({
  className,
  dir = 'rtl',
  variant = 'saffron',
  width = 128,
  height = 24,
}: RisingLineSvgProps) {
  const strokeColor =
    variant === 'saffron'
      ? '#F2A541'
      : variant === 'terracotta'
        ? '#C7441F'
        : '#136F63'

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 128 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={cn(
        'inline-block shrink-0 select-none',
        dir === 'rtl' ? 'scale-x-[-1]' : '',
        className,
      )}
    >
      <path
        d="M4 19C36 18.5 74 14.5 118 5.5"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        className="rising-line-path"
      />
      <path
        d="M110 2.5L120.5 4.8L114.5 13.5"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="rising-line-path"
      />
    </svg>
  )
}
