import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  LEAD_ENCRYPTION_KEY: z
    .string()
    .regex(/^[0-9a-fA-F]{64}$/, 'LEAD_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)')
    .default('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  GHL_API_KEY: z.string().optional().default(''),
  GHL_LOCATION_ID: z.string().optional().default(''),
  GHL_WEBHOOK_URL: z.string().optional().default(''),
  NEXT_PUBLIC_GTM_ID: z.string().optional().default(''),
  NEXT_PUBLIC_GA4_ID: z.string().optional().default(''),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional().default(''),
  NEXT_PUBLIC_SNAP_PIXEL_ID: z.string().optional().default(''),
})

function parseEnv() {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    LEAD_ENCRYPTION_KEY: process.env.LEAD_ENCRYPTION_KEY,
    GHL_API_KEY: process.env.GHL_API_KEY,
    GHL_LOCATION_ID: process.env.GHL_LOCATION_ID,
    GHL_WEBHOOK_URL: process.env.GHL_WEBHOOK_URL,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
    NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    NEXT_PUBLIC_SNAP_PIXEL_ID: process.env.NEXT_PUBLIC_SNAP_PIXEL_ID,
  })

  if (!parsed.success) {
    console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}

export const env = parseEnv()
