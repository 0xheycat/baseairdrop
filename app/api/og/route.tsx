import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const score = req.nextUrl.searchParams.get('score') || '0'
  const address = req.nextUrl.searchParams.get('address') || ''
  const value = req.nextUrl.searchParams.get('value') || '$0.00'
  const tokens = req.nextUrl.searchParams.get('tokens') || '0'
  const username = req.nextUrl.searchParams.get('username') || ''
  const pfp = req.nextUrl.searchParams.get('pfp') || ''
  const fdv = req.nextUrl.searchParams.get('fdv') || '$4B'

  const scoreNum = parseInt(score, 10)
  const scoreColor =
    scoreNum >= 80
      ? '#10b981'
      : scoreNum >= 60
        ? '#0052FF'
        : scoreNum >= 40
          ? '#f59e0b'
          : '#ef4444'

  const tier =
    scoreNum >= 90
      ? { label: 'S-TIER LEGEND', emoji: '\u{1F3C6}' }
      : scoreNum >= 80
        ? { label: 'S-TIER', emoji: '\u{1F525}' }
        : scoreNum >= 70
          ? { label: 'A-TIER', emoji: '\u26A1' }
          : scoreNum >= 60
            ? { label: 'A-TIER', emoji: '\u{1F4AA}' }
            : scoreNum >= 50
              ? { label: 'B-TIER', emoji: '\u{1F4CA}' }
              : scoreNum >= 40
                ? { label: 'B-TIER', emoji: '\u{1F440}' }
                : scoreNum >= 30
                  ? { label: 'C-TIER', emoji: '\u{1F331}' }
                  : scoreNum >= 20
                    ? { label: 'C-TIER', emoji: '\u{1F40C}' }
                    : { label: 'D-TIER', emoji: '\u{1F634}' }

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
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.03,
            backgroundImage:
              'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Background ambient glows */}
        <div
          style={{
            position: 'absolute',
            top: '-160px',
            left: '-120px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${scoreColor}20 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #8b5cf620 0%, transparent 70%)',
          }}
        />

        {/* Top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: `linear-gradient(90deg, transparent, ${scoreColor}, transparent)`,
          }}
        />

        {/* Left column - Score & PFP */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '400px',
            padding: '32px',
            gap: '20px',
          }}
        >
          {/* PFP or Score ring */}
          {pfp ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '144px',
                  height: '144px',
                  borderRadius: '50%',
                  border: `6px solid ${scoreColor}`,
                  overflow: 'hidden',
                  display: 'flex',
                  boxShadow: `0 0 40px ${scoreColor}40`,
                }}
              >
                <img
                  src={pfp}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              {username && (
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#94a3b8' }}>
                  @{username}
                </span>
              )}
            </div>
          ) : (
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: `8px solid ${scoreColor}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 60px ${scoreColor}30, inset 0 0 30px ${scoreColor}10`,
              }}
            >
              <span style={{ fontSize: '64px', fontWeight: '900', color: scoreColor, lineHeight: 1 }}>
                {score}
              </span>
              <span style={{ fontSize: '16px', color: '#475569', fontWeight: '500', marginTop: '2px' }}>
                / 100
              </span>
            </div>
          )}

          {/* Tier badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: `${scoreColor}15`,
              border: `1px solid ${scoreColor}30`,
              borderRadius: '999px',
              padding: '6px 20px',
            }}
          >
            <span style={{ fontSize: '20px' }}>{tier.emoji}</span>
            <span style={{ fontSize: '16px', fontWeight: '800', color: scoreColor, letterSpacing: '0.5px' }}>
              {tier.label}
            </span>
          </div>

          {/* Score bar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '6px' }}>
            <div
              style={{
                width: '100%',
                height: '12px',
                borderRadius: '6px',
                background: '#ffffff0f',
                overflow: 'hidden',
                display: 'flex',
              }}
            >
              <div
                style={{
                  width: `${scoreNum}%`,
                  height: '100%',
                  borderRadius: '6px',
                  background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}aa)`,
                }}
              />
            </div>
            <span style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>
              Activity Score
            </span>
          </div>
        </div>

        {/* Right side - Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '32px 40px 32px 16px',
            gap: '20px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#0052FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 24px #0052FF80',
              }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                Base Checker
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: '#f59e0b' }}>
                Unofficial Estimate
              </span>
            </div>
            {pfp && (
              <div
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffffff08',
                  borderRadius: '999px',
                  padding: '6px 16px',
                }}
              >
                <span style={{ fontSize: '32px', fontWeight: '900', color: scoreColor }}>
                  {score}
                </span>
                <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>/100</span>
              </div>
            )}
          </div>

          {/* Main stats grid */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Tokens card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#10b98110',
                border: '1px solid #10b98126',
                borderRadius: '16px',
                padding: '16px 20px',
                flex: 1,
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: '#10b981', marginBottom: '4px' }}>
                Est. Tokens
              </span>
              <span style={{ fontSize: '30px', fontWeight: '900', color: '#10b981' }}>
                {tokens}
              </span>
            </div>
            {/* Value card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#0052FF10',
                border: '1px solid #0052FF26',
                borderRadius: '16px',
                padding: '16px 20px',
                flex: 1,
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: '#0052FF', marginBottom: '4px' }}>
                Est. Value
              </span>
              <span style={{ fontSize: '30px', fontWeight: '900', color: '#0052FF' }}>
                {value}
              </span>
            </div>
          </div>

          {/* FDV & Address row */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* FDV badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#8b5cf614',
                border: '1px solid #8b5cf626',
                borderRadius: '12px',
                padding: '10px 20px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: '#a78bfa' }}>
                FDV
              </span>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#a78bfa' }}>
                {fdv}
              </span>
            </div>
            {/* Address */}
            {truncAddr && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff08',
                  border: '1px solid #ffffff10',
                  borderRadius: '999px',
                  padding: '8px 20px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: '#334155',
                  flex: 1,
                }}
              >
                {truncAddr}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
