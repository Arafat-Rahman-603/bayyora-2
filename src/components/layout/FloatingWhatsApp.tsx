import React from 'react'
import { WhatsAppIcon } from '@/components/ui/Button'
import type { Locale } from '@/i18n/config'

interface FloatingWhatsAppProps {
  locale: Locale
  whatsappUrl: string
}

export function FloatingWhatsApp({ locale, whatsappUrl }: FloatingWhatsAppProps) {
  return (
    <div className="fixed bottom-5 end-5 z-40">
      <div className="relative inline-flex">
        <span
          aria-hidden="true"
          className="animate-whatsapp-ring pointer-events-none absolute inset-0 rounded-full bg-whatsapp"
        />
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            locale === 'ar'
              ? 'تواصل مع فريق بيّورا عبر واتساب مباشرة'
              : 'Chat with Bayyora directly on WhatsApp'
          }
          className="relative inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-micro ease-out-quart hover:-translate-y-1 hover:brightness-95 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span>{locale === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
        </a>
      </div>
    </div>
  )
}
