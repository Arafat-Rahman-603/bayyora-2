import { env } from '@/env'

export interface LeadSubmissionPayload {
  formType: 'free_audit' | 'contact'
  locale: 'ar' | 'en'
  name: string
  shopName: string
  businessType: string
  city: string
  instagramOrMapsLink?: string
  whatsappE164: string
  message?: string
  pdplConsentGranted: boolean
}

export interface CRMSubmissionResult {
  synced: boolean
  status: 'synced' | 'queued_local' | 'failed'
  contactId?: string
}

export interface CRMProvider {
  submitLead(lead: LeadSubmissionPayload): Promise<CRMSubmissionResult>
}

export class GoHighLevelProvider implements CRMProvider {
  async submitLead(lead: LeadSubmissionPayload): Promise<CRMSubmissionResult> {
    // If live GHL credentials are not configured yet (OD-003), safely queue locally without failing the user request
    if (!env.GHL_API_KEY && !env.GHL_WEBHOOK_URL) {
      return {
        synced: false,
        status: 'queued_local',
      }
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
      if (env.GHL_WEBHOOK_URL) {
        const res = await fetch(env.GHL_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            source: 'Bayyora Website',
            formType: lead.formType,
            locale: lead.locale,
            name: lead.name,
            companyName: lead.shopName,
            phone: lead.whatsappE164,
            city: lead.city,
            customField: {
              businessType: lead.businessType,
              instagramOrMapsLink: lead.instagramOrMapsLink || '',
              message: lead.message || '',
            },
            tags: ['bayyora-web-lead', lead.formType, `locale-${lead.locale}`, `city-${lead.city}`],
          }),
        })

        if (res.ok) {
          return { synced: true, status: 'synced', contactId: `ghl-wh-${Date.now()}` }
        }
      }

      return { synced: false, status: 'failed' }
    } catch {
      return { synced: false, status: 'failed' }
    } finally {
      clearTimeout(timeout)
    }
  }
}

export const crmProvider: CRMProvider = new GoHighLevelProvider()

