import {
  REVOKED_SESSION_SWEEP_INTERVAL_SECONDS,
  SESSION_MAX_AGE_SECONDS,
} from "./constants"

const TTL_MS = SESSION_MAX_AGE_SECONDS * 1000
const SWEEP_INTERVAL_MS = REVOKED_SESSION_SWEEP_INTERVAL_SECONDS * 1000

const revoked = new Map<string, number>()

export function revokeSession(sid: string) {
  revoked.set(sid, Date.now() + TTL_MS)
}

export function isSessionRevoked(sid: string) {
  const expiresAt = revoked.get(sid)
  if (!expiresAt) return false
  if (Date.now() > expiresAt) {
    revoked.delete(sid)
    return false
  }
  return true
}

// Prevent duplicate intervals across Next.js hot reloads in dev
const globalForSweep = globalThis as unknown as {
  __revocationSweepStarted?: boolean
}
if (!globalForSweep.__revocationSweepStarted) {
  globalForSweep.__revocationSweepStarted = true
  setInterval(() => {
    const now = Date.now()
    for (const [sid, expiresAt] of revoked) {
      if (now > expiresAt) revoked.delete(sid)
    }
  }, SWEEP_INTERVAL_MS)
}
