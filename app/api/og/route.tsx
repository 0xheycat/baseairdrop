import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

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
    scoreNum >= 80 ? 'Excellent'
      : scoreNum >= 60 ? 'Strong'
        : scoreNum >= 40 ? 'Moderate'
          : scoreNum >= 20 ? 'Low'
            : 'Minimal'

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
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#f1f5f9',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background ambient glows */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '-30px',
            width: '225px',
            height: '225px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,82,255,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            right: '-20px',
            width: '190px',
            height: '190px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Left column — Score */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '220px',
            padding: '20px 10px 20px 20px',
          }}
        >
          {/* Score ring */}
          <div
            style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              border: `6px solid ${scoreColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '39px', fontWeight: '900', color: scoreColor, lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '8px', color: '#475569', fontWeight: '500', marginTop: '1px' }}>
              / 100
            </span>
          </div>

          {/* Labels */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
            <span
              style={{
                fontSize: '8px',
                fontWeight: '700',
                color: scoreColor,
                padding: '2px 7px',
                borderRadius: '999px',
                background: `${scoreColor}15`,
              }}
            >
              {scoreLabel}
            </span>
            <span
              style={{
                fontSize: '6px',
                fontWeight: '800',
                color: '#f59e0b',
                padding: '2px 5px',
                borderRadius: '999px',
                background: 'rgba(245,158,11,0.1)',
                letterSpacing: '1px',
              }}
            >
              {tier}
            </span>
          </div>
        </div>

        {/* Right column — Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '18px 20px 18px 8px',
            gap: '8px',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '19px',
                  height: '19px',
                  borderRadius: '50%',
                  background: '#0052FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                  Base Checker
                </span>
                <span style={{ fontSize: '5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#f59e0b' }}>
                  Unofficial Estimate
                </span>
              </div>
            </div>

            {/* User badge */}
            {(username || truncAddr) && (
              <span style={{
                fontSize: '7px', fontWeight: '600', color: '#64748b',
                background: 'rgba(255,255,255,0.04)',
                padding: '3px 7px', borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                {username ? `@${username}` : truncAddr}
              </span>
            )}
          </div>

          {/* Big allocation card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>
                Estimated Allocation
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginTop: '2px' }}>
                <span style={{ fontSize: '18px', fontWeight: '900', color: '#10b981' }}>
                  {tokens}
                </span>
                <span style={{ fontSize: '7px', fontWeight: '600', color: '#334155' }}>tokens</span>
              </div>
            </div>
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '12px', fontWeight: '900', color: '#10b981' }}>$</span>
            </div>
          </div>

          {/* 2-col stats */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '6px',
                padding: '7px 8px',
              }}
            >
              <span style={{ fontSize: '5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>
                Est. Value
              </span>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#0052FF', marginTop: '2px' }}>
                {value}
              </span>
            </div>
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '6px',
                padding: '7px 8px',
              }}
            >
              <span style={{ fontSize: '5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>
                Token Price
              </span>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#a78bfa', marginTop: '2px' }}>
                $4.00
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ fontSize: '6px', color: '#1e293b', fontFamily: 'monospace' }}>{truncAddr}</span>
            <span style={{ fontSize: '6px', color: '#1e293b' }}>baseairdrop-mu.vercel.app</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  )
}
