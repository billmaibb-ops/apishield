import type { KeyPolicy } from './keys'

export interface PolicyResult {
  allowed: boolean
  status?: number
  error?: string
  details?: string
}

// ─── IP Allowlist ─────────────────────────────────────────────────────────────

/**
 * Match a client IP against an allowlist.
 * Supports exact match or /8 /16 /24 /32 CIDR prefix.
 * Uses the first IP from x-forwarded-for chains.
 */
function ipInAllowlist(ip: string, allowlist: string[]): boolean {
  const client = ip.split(',')[0].trim()
  return allowlist.some(entry => {
    if (!entry.includes('/')) return client === entry
    const [base, prefixStr] = entry.split('/')
    const bits = parseInt(prefixStr, 10)
    const baseParts = base.split('.')
    if (bits === 32) return client === base
    if (bits === 24) return client.startsWith(baseParts.slice(0, 3).join('.') + '.')
    if (bits === 16) return client.startsWith(baseParts.slice(0, 2).join('.') + '.')
    if (bits === 8)  return client.startsWith(baseParts[0] + '.')
    return client === base
  })
}

export function enforceIpAllowlist(clientIp: string, policy: KeyPolicy): PolicyResult {
  if (!policy.ipAllowlist?.length) return { allowed: true }
  if (!clientIp) {
    return { allowed: false, status: 403, error: 'IP allowlist active but client IP is unknown' }
  }
  if (!ipInAllowlist(clientIp, policy.ipAllowlist)) {
    return {
      allowed: false,
      status: 403,
      error: 'IP address not permitted',
      details: `${clientIp} is not in the key's IP allowlist`,
    }
  }
  return { allowed: true }
}

// ─── Request Size ─────────────────────────────────────────────────────────────

export function enforceMaxRequestSize(
  contentLengthHeader: string | null,
  policy: KeyPolicy
): PolicyResult {
  if (!policy.maxRequestSizeBytes) return { allowed: true }
  if (!contentLengthHeader) return { allowed: true } // unknown; body streaming check is too costly
  const bytes = parseInt(contentLengthHeader, 10)
  if (isNaN(bytes)) return { allowed: true }
  if (bytes > policy.maxRequestSizeBytes) {
    return {
      allowed: false,
      status: 413,
      error: 'Request body too large',
      details: `${bytes} bytes exceeds limit of ${policy.maxRequestSizeBytes} bytes`,
    }
  }
  return { allowed: true }
}

// ─── Header Policy ────────────────────────────────────────────────────────────

/**
 * Returns headers to inject into the upstream request and a set of
 * header names (lowercase) that should be stripped before forwarding.
 */
export function buildHeaderPolicy(policy: KeyPolicy): {
  inject: Record<string, string>
  strip: Set<string>
} {
  return {
    inject: { ...(policy.injectHeaders ?? {}) },
    strip: new Set((policy.stripHeaders ?? []).map(h => h.toLowerCase())),
  }
}
