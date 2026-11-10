'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type RevealPhase = 'idle' | 'animating' | 'done'

interface AnimatedRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'scale' | 'fade'
}

/**
 * High-performance, GPU-composited viewport entrance & scroll reveal component.
 * - Smoothly animates initial above-the-fold content on load (e.g. Hero).
 * - Smoothly animates below-the-fold content as the user scrolls into view.
 * - Releases animation locks upon completion so all hover and interactive transitions work flawlessly.
 * - Fully respects WCAG 2.2 prefers-reduced-motion preferences.
 */
export function AnimatedReveal({
  children,
  className,
  delay = 0,
  duration = 0.65,
  direction = 'up',
}: AnimatedRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<RevealPhase>('idle')

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setPhase('done')
      return
    }

    const durationMs = Math.min(Math.max(Math.round(duration * 1000), 300), 1000)
    const delayMs = Math.min(Math.max(Math.round(delay * 1000), 0), 800)
    let cleanupTimer: number | undefined

    const triggerAnimation = () => {
      setPhase('animating')
      cleanupTimer = window.setTimeout(() => {
        setPhase('done')
      }, durationMs + delayMs + 120)
    }

    const rect = node.getBoundingClientRect()
    // Element is already within viewport on initial load
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const startTimer = window.setTimeout(() => {
        triggerAnimation()
      }, 40)
      return () => {
        window.clearTimeout(startTimer)
        if (cleanupTimer !== undefined) window.clearTimeout(cleanupTimer)
      }
    }

    // Element is below the fold: animate when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            triggerAnimation()
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (cleanupTimer !== undefined) {
        window.clearTimeout(cleanupTimer)
      }
    }
  }, [delay, duration])

  const delayMs = Math.min(Math.max(Math.round(delay * 1000), 0), 800)
  const durationMs = Math.min(Math.max(Math.round(duration * 1000), 300), 1000)

  const animClass =
    direction === 'scale'
      ? 'animate-reveal-scale'
      : direction === 'fade'
      ? 'animate-reveal-fade'
      : 'animate-reveal-up'

  return (
    <div
      ref={ref}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) {
          setPhase('done')
        }
      }}
      style={
        phase === 'animating'
          ? ({
              '--reveal-delay': `${delayMs}ms`,
              '--reveal-duration': `${durationMs}ms`,
            } as React.CSSProperties)
          : undefined
      }
      className={cn(
        phase === 'animating' && animClass,
        className,
      )}
    >
      {children}
    </div>
  )
}

interface AnimatedStaggerGridProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function AnimatedStaggerGrid({
  children,
  className,
  staggerDelay = 90,
}: AnimatedStaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<RevealPhase>('idle')

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setPhase('done')
      return
    }

    let cleanupTimer: number | undefined

    const triggerAnimation = () => {
      setPhase('animating')
      const count = node.querySelectorAll('.stagger-item').length || 6
      const totalDuration = 650 + count * staggerDelay + 150
      cleanupTimer = window.setTimeout(() => {
        setPhase('done')
      }, totalDuration)
    }

    const rect = node.getBoundingClientRect()
    // Grid is already visible on page load
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const startTimer = window.setTimeout(() => {
        triggerAnimation()
      }, 60)
      return () => {
        window.clearTimeout(startTimer)
        if (cleanupTimer !== undefined) window.clearTimeout(cleanupTimer)
      }
    }

    // Grid enters through scroll
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            triggerAnimation()
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (cleanupTimer !== undefined) {
        window.clearTimeout(cleanupTimer)
      }
    }
  }, [staggerDelay])

  return (
    <div ref={ref} data-stagger-state={phase} className={className}>
      {children}
    </div>
  )
}

interface AnimatedStaggerItemProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function AnimatedStaggerItem({
  children,
  className,
  style,
}: AnimatedStaggerItemProps) {
  return (
    <div style={style} className={cn('stagger-item', className)}>
      {children}
    </div>
  )
}
