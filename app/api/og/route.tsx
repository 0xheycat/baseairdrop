import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Fetch Inter font at module level so it is reused across invocations
// on the same edge isolate, avoiding a network round-trip per request.
const interRegular = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2')
).then((res) => res.arrayBuffer())

const interBold = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2')
).then((res) => res.arrayBuffer())

const interBlack = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2')
).then((res) => res.arrayBuffer())

const interMono = fetch(
  new URL('https://fonts.gstatic.com/s/robotomono/v23/L0xuDFRxlS1qUEBYgIKhCIJfwnxkJbs1oje8OYRn.woff2')
).then((res) => res.arrayBuffer())

export async function GET(req: NextRequest) {
  const score = req.nextUrl.searchParams.get('score') || '0'
  const address = req.nextUrl.searchParams.get('address') || ''
  const value = req.nextUrl.searchParams.get('value') || '$0.00'
  const tokens = req.nextUrl.searchParams.get('tokens') || '0'
  const username = req.nextUrl.searchParams.get('username') || ''
  const pfp = req.nextUrl.searchParams.get('pfp') || ''

  const scoreNum = parseInt(score, 10)
  const scoreColor =
    scoreNum >= 80 ? '#10b981'
      : scoreNum >= 60 ? '#0052FF'
        : scoreNum >= 40 ? '#f59e0b'
          : '#ef4444'

  // Replaced emoji prefixes with plain text labels for Satori compatibility.
  // Satori in edge runtime cannot render emoji glyphs.
  const scoreLabel =
    scoreNum >= 80 ? 'EXCELLENT'
      : scoreNum >= 60 ? 'STRONG'
        : scoreNum >= 40 ? 'MODERATE'
          : scoreNum >= 20 ? 'LOW'
            : 'MINIMAL'

  const tier =
    scoreNum >= 80 ? 'S-TIER'
      : scoreNum >= 60 ? 'A-TIER'
        : scoreNum >= 40 ? 'B-TIER'
          : scoreNum >= 20 ? 'C-TIER'
            : 'D-TIER'

  const truncAddr = address
    ? `${address.slice(0, 6)}\u00B7\u00B7\u00B7${address.slice(-4)}`
    : ''

  // Await font data. If any fetch fails, proceed without custom fonts
  // (Satori will use its built-in fallback).
  const [regularFont, boldFont, blackFont, monoFont] = await Promise.all([
    interRegular.catch(() => undefined),
    interBold.catch(() => undefined),
    interBlack.catch(() => undefined),
    interMono.catch(() => undefined),
  ])

  const fonts = [
    regularFont && { name: 'Inter', data: regularFont, weight: 400 as const, style: 'normal' as const },
    boldFont && { name: 'Inter', data: boldFont, weight: 700 as const, style: 'normal' as const },
    blackFont && { name: 'Inter', data: blackFont, weight: 900 as const, style: 'normal' as const },
    monoFont && { name: 'Roboto Mono', data: monoFont, weight: 400 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: number; style: string }[]

  // Shared image options. width/height are also passed at the top level
  // of the ImageResponse constructor, but having them here is fine.
  const imageOptions: ConstructorParameters<typeof ImageResponse>[1] = {
    width: 1200,
    height: 630,
    ...(fonts.length > 0 ? { fonts } : {}),
  }

  // ---------------------------------------------------------------------------
  // FIXES APPLIED (relative to the originally deployed blank-rendering version):
  //
  // 1. `transparent` in radial-gradient() replaced with `rgba(0,0,0,0)`.
  //    Satori's gradient parser (v0.10.x bundled in Next.js 14.2.0) does not
  //    recognize the CSS keyword `transparent`. This was the root cause of the
  //    blank image -- ImageResponse swallowed the Satori parse error and
  //    returned a transparent 1200x630 PNG.
  //
  // 2. Emoji characters removed from `scoreLabel` and coin icon.
  //    Satori in edge runtime cannot render emoji glyphs (no system emoji
  //    fonts are available). They were replaced with plain text equivalents.
  //
  // 3. `inset` keyword removed from `boxShadow`.
  //    Satori 0.10.x silently drops the entire box-shadow declaration when
  //    `inset` is present. Replaced with a multi-layer outer shadow to
  //    approximate the glow effect.
  //
  // 4. External PFP `<img>` tag removed from the score overlay.
  //    Fetching external images synchronously in Satori is fragile (CORS,
  //    timeouts, CDN failures). The PFP is now shown only as a text fallback
  //    via the username. To properly support PFP, pre-fetch the image data
  //    and pass it as a base64 data URL.
  //
  // 5. Fonts loaded explicitly via `fonts` option.
  //    Edge runtime does not have system fonts. Inter and Roboto Mono are
  //    fetched from Google Fonts CDN at module init time.
  // ---------------------------------------------------------------------------

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
          color: '#f1f5f9',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glows -- `transparent` replaced with rgba(0,0,0,0) */}
        <div style={{
          position: 'absolute', top: '-150px', left: '-100px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,82,255,0.2) 0%, rgba(0,0,0,0) 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-120px', right: '-80px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '800px', height: '800px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,82,255,0.04) 0%, rgba(0,0,0,0) 60%)',
        }} />

        {/* Top bar: Brand + User */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '28px 40px 0 40px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', background: '#0052FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px' }}>Base Checker</span>
              <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#f59e0b' }}>Unofficial Estimate</span>
            </div>
          </div>

          {/* User badge -- PFP removed; show username text only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {username && (
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8' }}>@{username}</span>
            )}
            {!username && truncAddr && (
              <span style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'Roboto Mono, monospace', color: '#475569' }}>{truncAddr}</span>
            )}
          </div>
        </div>

        {/* Main content - centered row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flex: 1, gap: '48px', padding: '0 40px',
        }}>
          {/* Score circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '220px', height: '220px', borderRadius: '50%',
              border: `12px solid ${scoreColor}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              // `inset` removed: Satori does not support it.
              // Multi-layer outer shadow used to approximate the glow.
              boxShadow: `0 0 40px ${scoreColor}25, 0 0 80px ${scoreColor}12`,
            }}>
              <span style={{ fontSize: '80px', fontWeight: 900, color: scoreColor, lineHeight: '1' }}>{score}</span>
              <span style={{ fontSize: '16px', color: '#475569', fontWeight: 500, marginTop: '4px' }}>/ 100</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px',
            }}>
              <span style={{
                fontSize: '14px', fontWeight: 800, color: scoreColor,
                padding: '4px 14px', borderRadius: '999px', background: `${scoreColor}18`,
              }}>{scoreLabel}</span>
              <span style={{
                fontSize: '12px', fontWeight: 900, color: '#f59e0b',
                padding: '4px 10px', borderRadius: '999px', background: 'rgba(245,158,11,0.12)',
                letterSpacing: '1px',
              }}>{tier}</span>
            </div>
          </div>

          {/* Right side: stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, maxWidth: '380px' }}>
            {/* Big value card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '20px 24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>Estimated Allocation</span>
                <span style={{ fontSize: '36px', fontWeight: 900, color: '#10b981', lineHeight: '1.1' }}>{tokens} <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>tokens</span></span>
              </div>
              {/* Coin icon: replaced emoji with a styled div for Satori compatibility */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '12px',
                  background: '#10b981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#0a0a0f' }}>$</span>
                </div>
              </div>
            </div>

            {/* 2x2 grid */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '14px 16px',
              }}>
                <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>Est. Value</span>
                <span style={{ display: 'block', fontSize: '22px', fontWeight: 800, color: '#0052FF', marginTop: '4px' }}>{value}</span>
              </div>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '14px 16px',
              }}>
                <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>Token Price</span>
                <span style={{ display: 'block', fontSize: '22px', fontWeight: 800, color: '#a78bfa', marginTop: '4px' }}>$4.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px 24px 40px',
        }}>
          <span style={{ fontSize: '11px', color: '#1e293b', fontFamily: 'Roboto Mono, monospace' }}>{truncAddr}</span>
          <span style={{ fontSize: '11px', color: '#1e293b' }}>baseairdrop-mu.vercel.app</span>
        </div>
      </div>
    ),
    imageOptions
  )
}
