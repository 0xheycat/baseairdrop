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
    scoreNum >= 80
      ? '#10b981'
      : scoreNum >= 60
        ? '#0052FF'
        : scoreNum >= 40
          ? '#f59e0b'
          : '#ef4444'

  const scoreLabel =
    scoreNum >= 80
      ? 'Excellent'
      : scoreNum >= 60
        ? 'Strong'
        : scoreNum >= 40
          ? 'Moderate'
          : scoreNum >= 20
            ? 'Low'
            : 'Minimal'

  const truncAddr = address
    ? `${address.slice(0, 6)}\u00B7\u00B7\u00B7${address.slice(-4)}`
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
            top: '-120px',
            left: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,82,255,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-60px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Left side - Score */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '420px',
            padding: '40px',
          }}
        >
          {/* Score ring */}
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: `10px solid ${scoreColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 60px ${scoreColor}30, inset 0 0 30px ${scoreColor}10`,
            }}
          >
            <span style={{ fontSize: '72px', fontWeight: '900', color: scoreColor, lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '16px', color: '#475569', fontWeight: '500', marginTop: '2px' }}>
              / 100
            </span>
          </div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: scoreColor,
              marginTop: '16px',
              padding: '4px 16px',
              borderRadius: '999px',
              background: `${scoreColor}15`,
            }}
          >
            {scoreLabel}
          </span>
        </div>

        {/* Right side - Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '40px 40px 40px 0',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#0052FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 24px rgba(0,82,255,0.5)',
              }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                Base Checker
              </span>
              <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#f59e0b' }}>
                Unofficial Estimate
              </span>
            </div>
          </div>

          {/* Stats cards */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            {/* Tokens card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px 20px',
                flex: 1,
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#475569', marginBottom: '6px' }}>
                Est. Tokens
              </span>
              <span style={{ fontSize: '28px', fontWeight: '800', color: '#10b981' }}>
                {tokens}
              </span>
            </div>
            {/* Value card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px 20px',
                flex: 1,
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#475569', marginBottom: '6px' }}>
                Est. Value
              </span>
              <span style={{ fontSize: '28px', fontWeight: '800', color: '#0052FF' }}>
                {value}
              </span>
            </div>
          </div>

          {/* Address badge */}
          {truncAddr && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '999px',
                padding: '8px 20px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#334155',
              }}
            >
              {truncAddr}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
