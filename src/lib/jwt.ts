/**
 * JWT verification using the Web Crypto API.
 * No external dependencies — works in Vercel Edge Runtime and Node.js.
 * Currently supports HS256 (HMAC-SHA256 shared secret).
 */

function b64urlDecode(s: string) {
  // Base64url → Base64 → binary
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  const binary = atob(padded)
  return Uint8Array.from(binary, c => c.charCodeAt(0))
}

export interface JwtPayload {
  sub?: string
  iss?: string
  aud?: string | string[]
  exp?: number   // unix seconds
  iat?: number
  nbf?: number
  [key: string]: unknown
}

/**
 * Verify a JWT signed with HS256.
 * Returns the decoded payload on success, null on any failure
 * (bad signature, expired, wrong algorithm, malformed).
 */
export async function verifyJwt(
  token: string,
  secret: string
): Promise<JwtPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [headerB64, payloadB64, signatureB64] = parts

    // Decode and check algorithm
    const headerBytes = b64urlDecode(headerB64)
    const header = JSON.parse(new TextDecoder().decode(headerBytes)) as { alg?: string }
    if (header.alg !== 'HS256') return null

    // Import HMAC key
    const enc = new TextEncoder()
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    // Verify signature over "headerB64.payloadB64"
    const signingInput = enc.encode(`${headerB64}.${payloadB64}`)
    const signature = b64urlDecode(signatureB64)
    const valid = await crypto.subtle.verify('HMAC', cryptoKey, signature, signingInput)
    if (!valid) return null

    // Decode payload
    const payloadBytes = b64urlDecode(payloadB64)
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as JwtPayload

    // Time checks
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp !== undefined && now > payload.exp) return null
    if (payload.nbf !== undefined && now < payload.nbf) return null

    return payload
  } catch {
    return null
  }
}
