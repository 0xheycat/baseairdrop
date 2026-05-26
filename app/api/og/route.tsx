import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const score = req.nextUrl.searchParams.get('score') || '0'
  const address = req.nextUrl.searchParams.get('address') || ''
  const value = req.nextUrl.searchParams.get('value') || '$0.00'
  const tokens = req.nextUrl.searchParams.get('tokens') || '0'

  const scoreNum = parseInt(score, 10)

  const scoreColor =
    scoreNum >= 80 ? '#10b981'
      : scoreNum >= 60 ? '#0052FF'
        : scoreNum >= 40 ? '#f59e0b'
          : '#ef4444'

  const tier =
    scoreNum >= 80 ? 'S-TIER'
      : scoreNum >= 60 ? 'A-TIER'
        : scoreNum >= 40 ? 'B-TIER'
          : scoreNum >= 20 ? 'C-TIER'
            : 'D-TIER'

  const tierLabel =
    scoreNum >= 80 ? 'EXCELLENT'
      : scoreNum >= 60 ? 'STRONG'
        : scoreNum >= 40 ? 'MODERATE'
          : scoreNum >= 20 ? 'LOW'
            : 'MINIMAL'

  const truncAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#f1f5f9',
          position: 'relative',
        }}
      >
        {/* Background glow — using linear-gradient (Satori-safe) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,82,255,0.12) 0%, transparent 40%), linear-gradient(315deg, rgba(139,92,246,0.08) 0%, transparent 40%)',
        }} />

        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '32px 48px 0 48px', position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', background: '#0052FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>Base Checker</span>
              <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', color: '#f59e0b' }}>
                UNOFFICIAL ESTIMATE
              </span>
            </div>
          </div>
          {truncAddr && (
            <span style={{
              fontSize: '13px', fontWeight: '500', color: '#475569',
              background: 'rgba(255,255,255,0.04)',
              padding: '6px 16px', borderRadius: '999px',
            }}>{truncAddr}</span>
          )}
        </div>

        {/* Main content */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flex: 1, gap: '56px', padding: '0 48px', position: 'relative',
        }}>
          {/* Score circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '240px', height: '240px', borderRadius: '50%',
              border: `14px solid ${scoreColor}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '88px', fontWeight: '900', color: scoreColor, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: '18px', color: '#475569', fontWeight: '500', marginTop: '6px' }}>/ 100</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px',
            }}>
              <span style={{
                fontSize: '14px', fontWeight: '800', color: scoreColor,
                padding: '5px 16px', borderRadius: '999px', background: `${scoreColor}18`,
              }}>{tierLabel}</span>
              <span style={{
                fontSize: '13px', fontWeight: '900', color: '#f59e0b',
                padding: '5px 12px', borderRadius: '999px', background: 'rgba(245,158,11,0.12)',
                letterSpacing: '1.5px',
              }}>{tier}</span>
            </div>
          </div>

          {/* Right side: stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, maxWidth: '400px' }}>
            {/* Allocation card */}
            <div style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '24px 28px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', color: '#475569' }}>
                  ESTIMATED ALLOCATION
                </span>
                <span style={{ fontSize: '40px', fontWeight: '900', color: '#10b981', lineHeight: 1.2, marginTop: '4px' }}>
                  {tokens}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>tokens</span>
              </div>
              <div style={{
                width: '52px', height: '52px', borderRadius: '12px',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px',
              }}>🪙</div>
            </div>

            {/* 2x2 grid */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '16px 18px',
              }}>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', color: '#475569' }}>
                  EST. VALUE
                </span>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: '800', color: '#0052FF', marginTop: '6px' }}>
                  {value}
                </span>
              </div>
              <div style={{
                flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '16px 18px',
              }}>
                <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', color: '#475569' }}>
                  TOKEN PRICE
                </span>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: '800', color: '#a78bfa', marginTop: '6px' }}>
                  $4.00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px 28px 48px', position: 'relative',
        }}>
          <span style={{ fontSize: '12px', color: '#1e293b' }}>
            {truncAddr}
          </span>
          <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600' }}>
            baseairdrop-mu.vercel.app
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
