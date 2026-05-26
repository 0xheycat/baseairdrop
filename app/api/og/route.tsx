import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Fetch Inter font at module level so it is reused across invocations
// on the same edge isolate.
const interRegular = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2')
).then((res) => res.arrayBuffer())

const interBold = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2')
).then((res) => res.arrayBuffer())

const interBlack = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2')
).then((res) => res.arrayBuffer())

export async function GET(req: NextRequest) {
  const score = req.nextUrl.searchParams.get('score') || '0'
  const address = req.nextUrl.searchParams.get('address') || ''
  const value = req.nextUrl.searchParams.get('value') || '$0.00'
  const tokens = req.nextUrl.searchParams.get('tokens') || '0'
  const username = req.nextUrl.searchParams.get('username') || ''

  const scoreNum = parseInt(score, 10)
  const scoreColor =
    scoreNum >= 80 ? '#10b981'
      : scoreNum >= 60 ? '#0052FF'
        : scoreNum >= 40 ? '#f59e0b'
          : '#ef4444'

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
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  // Await fonts
  const [regularFont, boldFont, blackFont] = await Promise.all([
    interRegular.catch(() => undefined),
    interBold.catch(() => undefined),
    interBlack.catch(() => undefined),
  ])

  const fonts = [
    regularFont && { name: 'Inter', data: regularFont, weight: 400 as const, style: 'normal' as const },
    boldFont && { name: 'Inter', data: boldFont, weight: 700 as const, style: 'normal' as const },
    blackFont && { name: 'Inter', data: blackFont, weight: 900 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 700 | 900; style: 'normal' }[]

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '600px',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
          color: '#f1f5f9',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glows - transparent replaced with rgba(0,0,0,0) for Satori */}
        <div style={{
          position: 'absolute', top: '-75px', left: '-50px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,82,255,0.2) 0%, rgba(0,0,0,0) 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-40px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)',
        }} />

        {/* Top bar: Brand + User */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px 0 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%', background: '#0052FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '-0.3px' }}>Base Checker</span>
              <span style={{ fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#f59e0b' }}>Unofficial Estimate</span>
            </div>
          </div>

          {/* User badge */}
          {(username || truncAddr) && (
            <span style={{
              fontSize: '9px', fontWeight: 600, color: '#94a3b8',
              background: 'rgba(255,255,255,0.04)',
              padding: '3px 8px', borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {username ? `@${username}` : truncAddr}
            </span>
          )}
        </div>

        {/* Main content - centered row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flex: 1, gap: '24px', padding: '0 20px',
        }}>
          {/* Score circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '110px', height: '110px', borderRadius: '50%',
              border: `6px solid ${scoreColor}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '40px', fontWeight: 900, color: scoreColor, lineHeight: '1' }}>{score}</span>
              <span style={{ fontSize: '10px', color: '#475569', fontWeight: 500, marginTop: '2px' }}>/ 100</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px',
            }}>
              <span style={{
                fontSize: '9px', fontWeight: 800, color: scoreColor,
                padding: '2px 8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)',
              }}>{scoreLabel}</span>
              <span style={{
                fontSize: '8px', fontWeight: 900, color: '#f59e0b',
                padding: '2px 6px', borderRadius: '999px', background: 'rgba(245,158,11,0.12)',
                letterSpacing: '1px',
              }}>{tier}</span>
            </div>
          </div>

          {/* Right side: stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, maxWidth: '280px' }}>
            {/* Big value card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', padding: '12px 14px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>Estimated Allocation</span>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#10b981', lineHeight: '1.1', marginTop: '2px' }}>{tokens} <span style={{ fontSize: '9px', fontWeight: 600, color: '#334155' }}>tokens</span></span>
              </div>
              <div style={{
                width: '30px', height: '30px', borderRadius: '8px',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#10b981' }}>$</span>
              </div>
            </div>

            {/* 2-col grid */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px', padding: '8px 10px',
              }}>
                <span style={{ fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>Est. Value</span>
                <span style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#0052FF', marginTop: '2px' }}>{value}</span>
              </div>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px', padding: '8px 10px',
              }}>
                <span style={{ fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>Token Price</span>
                <span style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#a78bfa', marginTop: '2px' }}>$4.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px 12px 20px',
        }}>
          <span style={{ fontSize: '8px', color: '#1e293b', fontFamily: 'monospace' }}>{truncAddr}</span>
          <span style={{ fontSize: '8px', color: '#1e293b' }}>baseairdrop-mu.vercel.app</span>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 400,
      ...(fonts.length > 0 ? { fonts } : {}),
    }
  )
}
