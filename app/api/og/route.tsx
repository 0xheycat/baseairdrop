import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import { getWalletMetrics } from '@/lib/blockscout'
import { computeActivityScore } from '@/lib/scoring'
import { computeAllocation, DEFAULT_PARAMS, formatNumber, formatUSD } from '@/lib/estimation'

export const runtime = 'nodejs'
export const maxDuration = 30

// Disable caching for dynamic OG images
export const revalidate = 0

export async function GET(req: NextRequest) {
  const scoreParam = req.nextUrl.searchParams.get('score') || '0'
  const address = req.nextUrl.searchParams.get('address') || ''
  let value = req.nextUrl.searchParams.get('value') || '$0.00'
  let tokens = req.nextUrl.searchParams.get('tokens') || '0'
  let username = decodeURIComponent(req.nextUrl.searchParams.get('username') || '')
  let pfp = decodeURIComponent(req.nextUrl.searchParams.get('pfp') || '')
  const fdv = req.nextUrl.searchParams.get('fdv') || '$4B'

  // If score is 0 and we have an address, fetch data ourselves
  let score = parseInt(scoreParam, 10)
  if (score === 0 && address) {
    try {
      console.log(`[OG] Fetching metrics for ${address}`)
      const metrics = await getWalletMetrics(address)
      const activityScore = computeActivityScore(metrics)
      const alloc = computeAllocation(activityScore.overall, DEFAULT_PARAMS)
      score = activityScore.overall
      tokens = formatNumber(alloc.userAllocation)
      value = formatUSD(alloc.estimatedValue)
      console.log(`[OG] Computed: score=${score}, tokens=${tokens}, value=${value}`)
    } catch (err) {
      console.error('[OG] Failed to fetch metrics:', err)
    }
  }
  const scoreColor =
    score >= 80
      ? '#10b981'
      : score >= 60
        ? '#0052FF'
        : score >= 40
          ? '#f59e0b'
          : '#ef4444'

  const tier =
    score >= 90
      ? { label: 'S-TIER LEGEND', emoji: '\u{1F3C6}' }
      : score >= 80
        ? { label: 'S-TIER', emoji: '\u{1F525}' }
        : score >= 70
          ? { label: 'A-TIER', emoji: '\u26A1' }
          : score >= 60
            ? { label: 'A-TIER', emoji: '\u{1F4AA}' }
            : score >= 50
              ? { label: 'B-TIER', emoji: '\u{1F4CA}' }
              : score >= 40
                ? { label: 'B-TIER', emoji: '\u{1F440}' }
                : score >= 30
                  ? { label: 'C-TIER', emoji: '\u{1F331}' }
                  : score >= 20
                    ? { label: 'C-TIER', emoji: '\u{1F40C}' }
                    : { label: 'D-TIER', emoji: '\u{1F634}' }

  const truncAddr = address
    ? `${address.slice(0, 6)}\u00B7\u00B7\u00B7${address.slice(-4)}`
    : ''

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
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
            top: '-100px',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${scoreColor}20 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-60px',
            width: '300px',
            height: '300px',
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
            height: '4px',
            background: `linear-gradient(90deg, transparent, ${scoreColor}, transparent)`,
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px', gap: '12px', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#0052FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', lineHeight: 1 }}>Base Checker</span>
              <span style={{ fontSize: '8px', fontWeight: '600', color: '#f59e0b' }}>ESTIMATE</span>
            </div>
          </div>
          {pfp && (
            <span style={{ fontSize: '16px', fontWeight: '800', color: scoreColor }}>
              {score}/100
            </span>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flex: 1, padding: '8px 16px 12px', gap: '12px', alignItems: 'flex-start' }}>
          {/* Left - Avatar & Tier */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: 'fit-content' }}>
            {pfp ? (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: `4px solid ${scoreColor}`,
                  overflow: 'hidden',
                  display: 'flex',
                  boxShadow: `0 0 20px ${scoreColor}40`,
                }}
              >
                <img
                  src={pfp}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: `4px solid ${scoreColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${scoreColor}08`,
                  boxShadow: `0 0 20px ${scoreColor}20`,
                }}
              >
                <span style={{ fontSize: '36px', fontWeight: '900', color: scoreColor, lineHeight: 1 }}>
                  {score}
                </span>
              </div>
            )}
            
            {/* Tier badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: `${scoreColor}15`,
                border: `1px solid ${scoreColor}30`,
                borderRadius: '999px',
                padding: '3px 10px',
                minWidth: '100%',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '12px' }}>{tier.emoji}</span>
              <span style={{ fontSize: '9px', fontWeight: '700', color: scoreColor }}>{tier.label}</span>
            </div>

            {username && (
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textAlign: 'center', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                @{username}
              </span>
            )}
          </div>

          {/* Right - Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '6px', justifyContent: 'flex-start' }}>
            {/* Tokens & Value Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#10b98110',
                  border: '1px solid #10b98120',
                  borderRadius: '8px',
                  padding: '8px 10px',
                }}
              >
                <span style={{ fontSize: '8px', fontWeight: '600', textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.5px' }}>
                  Tokens
                </span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>
                  {tokens}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#0052FF10',
                  border: '1px solid #0052FF20',
                  borderRadius: '8px',
                  padding: '8px 10px',
                }}
              >
                <span style={{ fontSize: '8px', fontWeight: '600', textTransform: 'uppercase', color: '#0052FF', letterSpacing: '0.5px' }}>
                  Value
                </span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#0052FF' }}>
                  {value}
                </span>
              </div>
            </div>

            {/* FDV & Address Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#8b5cf610',
                  border: '1px solid #8b5cf620',
                  borderRadius: '8px',
                  padding: '8px 10px',
                }}
              >
                <span style={{ fontSize: '8px', fontWeight: '600', textTransform: 'uppercase', color: '#a78bfa', letterSpacing: '0.5px' }}>
                  FDV
                </span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#a78bfa' }}>
                  {fdv}
                </span>
              </div>
              {truncAddr && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#ffffff08',
                    border: '1px solid #ffffff10',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontFamily: 'monospace',
                    fontSize: '9px',
                    color: '#475569',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {truncAddr}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  )

  // Add cache control headers to prevent caching of dynamic OG images
  imageResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, public')
  imageResponse.headers.set('Pragma', 'no-cache')
  imageResponse.headers.set('Expires', '0')
  
  return imageResponse
}
