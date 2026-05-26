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
        ? '#3b82f6'
        : scoreNum >= 40
          ? '#f59e0b'
          : '#ef4444'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(150deg, #0a0a0f 0%, #0f1029 40%, #0a0a0f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#f1f5f9',
          padding: '40px',
          position: 'relative',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '20%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,82,255,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '40px',
          }}
        >
          {/* Base logo circle */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#0052FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(0,82,255,0.4)',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'white',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              Base Checker
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#f59e0b',
                marginTop: '-2px',
              }}
            >
              Unofficial Estimate
            </span>
          </div>
        </div>

        {/* Score Ring */}
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            border: `8px solid ${scoreColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            boxShadow: `0 0 40px ${scoreColor}25`,
          }}
        >
          <span style={{ fontSize: '52px', fontWeight: '800', color: scoreColor }}>
            {score}
          </span>
          <span style={{ fontSize: '14px', color: '#475569', marginTop: '-4px', fontWeight: '500' }}>
            / 100
          </span>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '40px', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '26px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #34d399, #6ee7b7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {tokens}
            </div>
            <div style={{ fontSize: '12px', color: '#475569', fontWeight: '500', marginTop: '2px' }}>
              Est. Tokens
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '26px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: '12px', color: '#475569', fontWeight: '500', marginTop: '2px' }}>
              Est. Value
            </div>
          </div>
        </div>

        {/* Address */}
        {address && (
          <div
            style={{
              fontSize: '13px',
              color: '#334155',
              fontFamily: 'monospace',
              marginTop: '8px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '999px',
              padding: '6px 16px',
            }}
          >
            {address.slice(0, 6)}&middot;&middot;&middot;{address.slice(-4)}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
