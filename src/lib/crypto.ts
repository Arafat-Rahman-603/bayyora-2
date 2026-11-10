import crypto from 'crypto'
import { env } from '@/env'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

/**
 * Encrypts sensitive lead submission payloads using AES-256-GCM before storing in LeadSubmissions (AUD-030 / Saudi PDPL).
 */
export function encryptLeadPayload(data: Record<string, unknown>): string {
  const key = Buffer.from(env.LEAD_ENCRYPTION_KEY, 'hex')
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  const plaintext = JSON.stringify(data)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

/**
 * Decrypts an AES-256-GCM encrypted lead payload for authorized Owner/Admin inspection.
 */
export function decryptLeadPayload(ciphertext: string): Record<string, unknown> | null {
  try {
    const parts = ciphertext.split(':')
    if (parts.length !== 3) return null
    const [ivHex, authTagHex, encryptedHex] = parts
    if (!ivHex || !authTagHex || !encryptedHex) return null

    const key = Buffer.from(env.LEAD_ENCRYPTION_KEY, 'hex')
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const encrypted = Buffer.from(encryptedHex, 'hex')

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return JSON.parse(decrypted.toString('utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

/**
 * Constant-time string comparison using SHA-256 digests so secret length is never leaked via timing side-channels (AUD-003).
 */
export function timingSafeCompare(provided: string, expected: string): boolean {
  if (!provided || !expected) return false
  const hashA = crypto.createHash('sha256').update(provided).digest()
  const hashB = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(hashA, hashB)
}

