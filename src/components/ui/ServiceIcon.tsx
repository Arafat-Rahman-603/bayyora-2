import React from 'react'
import {
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  MessageCircle,
  Monitor,
  PenTool,
  Printer,
  Share2,
  ShieldCheck,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceIconProps {
  name?: string | null
  className?: string
}

/**
 * Renders decorative Lucide icons for services, pain points, and value propositions.
 * Always includes aria-hidden="true" per modern-web-guidance: accessibility.
 */
export function ServiceIcon({ name, className = 'h-6 w-6' }: ServiceIconProps) {
  const props = {
    className: cn('shrink-0', className),
    'aria-hidden': true as const,
    focusable: false as const,
  }

  switch (name) {
    case 'pen-tool':
      return <PenTool {...props} />
    case 'printer':
      return <Printer {...props} />
    case 'monitor':
      return <Monitor {...props} />
    case 'share-2':
      return <Share2 {...props} />
    case 'video':
      return <Video {...props} />
    case 'camera':
      return <Camera {...props} />
    case 'map-pin':
      return <MapPin {...props} />
    case 'message-circle':
      return <MessageCircle {...props} />
    case 'calendar':
      return <Calendar {...props} />
    case 'layers':
      return <Layers {...props} />
    case 'shield-check':
      return <ShieldCheck {...props} />
    case 'clock':
      return <Clock {...props} />
    case 'check-circle':
      return <CheckCircle2 {...props} />
    default:
      return <CheckCircle2 {...props} />
  }
}

