'use client'

const ALLOWED_SUFFIXES = ['farcaster.xyz', 'warpcast.com', 'base.dev']

export function isEmbedded(): boolean {
  try {
    return typeof window !== 'undefined' && window.self !== window.top
  } catch {
    return false
  }
}

function referrerHost(): string | null {
  try {
    const ref = typeof document !== 'undefined' ? document.referrer : ''
    if (!ref) return null
    return new URL(ref).hostname
  } catch {
    return null
  }
}

function isAllowedReferrer(): boolean {
  const h = referrerHost()
  return !!h && ALLOWED_SUFFIXES.some(s => h === s || h.endsWith(`.${s}`))
}

export async function probeMiniappReady(timeoutMs = 10000): Promise<boolean> {
  // Strategy 1: referrer + embedded
  if (isEmbedded() && isAllowedReferrer()) {
    try {
      const { sdk } = await import('@farcaster/miniapp-sdk')
      const ok = await Promise.race<boolean>([
        (async () => {
          await sdk.context
          await sdk.actions.ready?.()
          return true
        })(),
        new Promise<boolean>(r => setTimeout(() => r(false), timeoutMs)),
      ])
      if (ok) return true
    } catch {}
  }

  // Strategy 2: embedded, no referrer (mobile privacy)
  if (isEmbedded() && !referrerHost()) {
    try {
      const { sdk } = await import('@farcaster/miniapp-sdk')
      const ok = await Promise.race<boolean>([
        (async () => {
          await sdk.context
          await sdk.actions.ready?.()
          return true
        })(),
        new Promise<boolean>(r => setTimeout(() => r(false), timeoutMs)),
      ])
      if (ok) return true
    } catch {}
  }

  // Strategy 3: mobile WebView fallback
  try {
    const { sdk } = await import('@farcaster/miniapp-sdk')
    const ok = await Promise.race<boolean>([
      (async () => {
        const ctx = await sdk.context
        if (ctx) {
          await sdk.actions.ready?.()
          return true
        }
        return false
      })(),
      new Promise<boolean>(r => setTimeout(() => r(false), timeoutMs)),
    ])
    if (ok) return true
  } catch {}

  return false
}

export async function getMiniappContext(): Promise<any | null> {
  try {
    const { sdk } = await import('@farcaster/miniapp-sdk')
    const context = await Promise.race([
      sdk.context,
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000)),
    ])
    return context || null
  } catch {
    return null
  }
}

export async function safeComposeCast(opts: { text: string; embeds?: string[] }) {
  const ok = await probeMiniappReady()
  if (ok) {
    try {
      const { sdk } = await import('@farcaster/miniapp-sdk')
      if (sdk?.actions?.composeCast) {
        const payload: any = { text: opts.text }
        if (opts.embeds?.length) {
          payload.embeds = opts.embeds.length === 1
            ? [opts.embeds[0]]
            : [opts.embeds[0], opts.embeds[1]]
        }
        return await sdk.actions.composeCast(payload)
      }
    } catch {}
  }
  const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(opts.text)}` +
    (opts.embeds || []).map(e => `&embeds[]=${encodeURIComponent(e)}`).join('')
  window.open(url, '_blank', 'noopener,noreferrer')
}
