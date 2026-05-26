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

  const truncAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: '#0a0a0f',
          color: '#f1f5f9',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Left: Score */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '480px',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '220px',
              height: '220px',
              borderRadius: '110px',
              border: `12px solid ${scoreColor}`,
            }}
          >
            <span style={{ fontSize: '80px', fontWeight: 900, color: scoreColor, lineHeight: '1' }}>
              {score}
            </span>
            <span style={{ fontSize: '16px', color: '#475569', fontWeight: 500 }}>
              / 100
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <span style={{
              fontSize: '14px', fontWeight: 800, color: scoreColor,
              padding: '4px 16px', borderRadius: '999px', background: '#111827',
            }}>
              {tier}
            </span>
          </div>
        </div>

        {/* Right: Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '40px 48px 40px 24px',
            gap: '20px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '18px', background: '#0052FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '7px', background: 'white' }} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 800 }}>Base Checker</span>
          </div>

          {/* Tokens */}
          <div style={{
            background: '#111827', borderRadius: '16px', padding: '20px 24px',
            border: '1px solid #1f2937',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '1.5px' }}>
              ESTIMATED ALLOCATION
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '38px', fontWeight: 900, color: '#10b981' }}>
                {tokens}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>tokens</span>
            </div>
          </div>

          {/* Value + Price row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              flex: 1, background: '#111827', borderRadius: '12px', padding: '16px',
              border: '1px solid #1f2937',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', letterSpacing: '1.5px' }}>
                EST. VALUE
              </span>
              <span style={{ display: 'block', fontSize: '24px', fontWeight: 800, color: '#0052FF', marginTop: '4px' }}>
                {value}
              </span>
            </div>
            <div style={{
              flex: 1, background: '#111827', borderRadius: '12px', padding: '16px',
              border: '1px solid #1f2937',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', letterSpacing: '1.5px' }}>
                TOKEN PRICE
              </span>
              <span style={{ display: 'block', fontSize: '24px', fontWeight: 800, color: '#a78bfa', marginTop: '4px' }}>
                $4.00
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: '#374151' }}>{truncAddr}</span>
            <span style={{ fontSize: '11px', color: '#374151', fontWeight: 600 }}>baseairdrop-mu.vercel.app</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
