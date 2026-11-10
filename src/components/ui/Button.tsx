import React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-button text-center font-semibold leading-snug transition-all duration-micro ease-out-cubic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-on-accent shadow-sm hover:brightness-95 hover:-translate-y-0.5',
        whatsapp:
          'bg-whatsapp text-white shadow-sm hover:brightness-95 hover:-translate-y-0.5',
        secondary:
          'bg-navy text-white shadow-sm hover:bg-navy-elevated hover:-translate-y-0.5',
        outline:
          'border-2 border-navy bg-transparent text-navy hover:bg-navy/5',
        outlineLight:
          'border-2 border-white/40 bg-white/5 text-white hover:bg-white/15 focus-visible:ring-accent focus-visible:ring-offset-navy',
        ghost:
          'bg-transparent text-navy hover:bg-canvas-sand',
      },
      size: {
        default: 'min-h-12 px-6 py-3 text-base',
        sm: 'min-h-11 px-4 py-2.5 text-sm',
        compact: 'min-h-10 px-3.5 py-2 text-sm',
        lg: 'min-h-[52px] px-7 py-3.5 text-base sm:text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string
  external?: boolean
}

export function Button({
  className,
  variant,
  size,
  href,
  external,
  children,
  ...props
}: ButtonProps) {
  if (href) {
    const isExternal = external || href.startsWith('http') || href.startsWith('https://wa.me')
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant, size }), className)}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>
        {children}
      </Link>
    )
  }

  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  )
}

export function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', className)}
    >
      <path d="M12.031 2c-5.516 0-9.998 4.485-9.998 10.001 0 1.766.461 3.49 1.337 5.012L2 22l5.122-1.343a9.957 9.957 0 0 0 4.909 1.298h.004c5.515 0 9.998-4.485 9.998-10.001 0-2.672-1.04-5.184-2.928-7.073A9.936 9.936 0 0 0 12.031 2Zm5.822 14.127c-.246.693-1.425 1.326-1.987 1.411-.51.076-1.155.108-1.868-.118-.434-.138-.99-.324-1.703-.632-2.999-1.295-4.957-4.316-5.107-4.516-.15-.2-1.219-1.622-1.219-3.094 0-1.472.771-2.196 1.045-2.496.274-.3.598-.375.798-.375.199 0 .399.002.573.01.184.009.43-.07.673.514.249.599.846 2.071.921 2.221.075.15.125.325.025.524-.1.2-.15.325-.299.499-.15.175-.314.391-.449.525-.15.149-.305.311-.131.611.174.3.773 1.275 1.66 2.066 1.141 1.018 2.103 1.333 2.402 1.483.299.15.474.125.649-.075.174-.2.748-.873.947-1.173.199-.3.399-.25.673-.15.274.1 1.745.823 2.044.973.299.15.499.225.573.35.075.125.075.724-.171 1.417Z" />
    </svg>
  )
}

