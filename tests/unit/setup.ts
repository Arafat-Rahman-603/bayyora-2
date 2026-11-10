import '@testing-library/jest-dom/vitest'

process.env.PAYLOAD_SECRET =
  process.env.PAYLOAD_SECRET ||
  '8f7e6d5c4b3a291807f6e5d4c3b2a1908f7e6d5c4b3a291807f6e5d4c3b2a190'
process.env.LEAD_ENCRYPTION_KEY =
  process.env.LEAD_ENCRYPTION_KEY ||
  '1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809'
process.env.PREVIEW_SECRET =
  process.env.PREVIEW_SECRET || 'bayyora_local_preview_secret_token_32chars_min'
process.env.REVALIDATION_SECRET =
  process.env.REVALIDATION_SECRET || 'bayyora_local_revalidation_secret_token_32chars'
process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bayyora.com'

