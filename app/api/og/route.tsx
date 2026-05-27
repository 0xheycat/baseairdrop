import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import { getWalletMetrics } from '@/lib/blockscout'
import { computeActivityScore } from '@/lib/scoring'
import { computeAllocation, DEFAULT_PARAMS, formatNumber, formatUSD } from '@/lib/estimation'

export const runtime = 'nodejs'
export const maxDuration = 30
export const revalidate = 0

export async function GET(req: NextRequest) {
  const scoreParam = req.nextUrl.searchParams.get('score') || '0'
  const address = req.nextUrl.searchParams.get('address') || ''
  let value = req.nextUrl.searchParams.get('value') || '$0.00'
  let tokens = req.nextUrl.searchParams.get('tokens') || '0'
  let username = decodeURIComponent(req.nextUrl.searchParams.get('username') || '')
  let pfp = decodeURIComponent(req.nextUrl.searchParams.get('pfp') || '')
  const fdv = req.nextUrl.searchParams.get('fdv') || '$4B'

  let score = parseInt(scoreParam, 10)
  if (score === 0 && address) {
    try {
      const metrics = await getWalletMetrics(address)
      const activityScore = computeActivityScore(metrics)
      const alloc = computeAllocation(activityScore.overall, DEFAULT_PARAMS)
      score = activityScore.overall
      tokens = formatNumber(alloc.userAllocation)
      value = formatUSD(alloc.estimatedValue)
    } catch {}
  }

  const sc =
    score >= 80 ? '#10b981' : score >= 60 ? '#0052FF' : score >= 40 ? '#f59e0b' : '#ef4444'

  const tier =
    score >= 90
      ? 'S-TIER LEGEND'
      : score >= 80
        ? 'S-TIER'
        : score >= 70
          ? 'A-TIER'
          : score >= 60
            ? 'A-TIER'
            : score >= 50
              ? 'B-TIER'
              : score >= 40
                ? 'B-TIER'
                : score >= 30
                  ? 'C-TIER'
                  : score >= 20
                    ? 'C-TIER'
                    : 'D-TIER'

  const truncAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#06060e',
          fontFamily: 'Inter, system-ui, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* === BACKGROUND LAYERS === */}

        {/* Top-left glow */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${sc}18 0%, transparent 65%)`,
          }}
        />
        {/* Bottom-right glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-60px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #8b5cf615 0%, transparent 65%)',
          }}
        />
        {/* Center subtle glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, #0052FF08 0%, transparent 70%)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent 5%, ${sc}90 30%, #0052FF90 70%, transparent 95%)`,
          }}
        />

        {/* === MAIN CONTENT === */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            padding: '20px 22px',
            gap: '16px',
          }}
        >
          {/* === LEFT COLUMN — Profile & Score === */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '155px',
              gap: '10px',
              paddingTop: '4px',
            }}
          >
            {/* Avatar / Score circle */}
            {pfp ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: `2.5px solid ${sc}`,
                    overflow: 'hidden',
                    display: 'flex',
                    boxShadow: `0 0 24px ${sc}35, 0 0 48px ${sc}15`,
                  }}
                >
                  <img src={pfp} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {username && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      letterSpacing: '0.2px',
                    }}
                  >
                    @{username}
                  </span>
                )}
              </div>
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: `3px solid ${sc}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 30px ${sc}30, inset 0 0 20px ${sc}10`,
                  background: `radial-gradient(circle, ${sc}08 0%, transparent 70%)`,
                }}
              >
                <span
                  style={{
                    fontSize: '30px',
                    fontWeight: '900',
                    color: sc,
                    lineHeight: 1,
                  }}
                >
                  {score}
                </span>
                <span
                  style={{
                    fontSize: '8px',
                    color: '#475569',
                    fontWeight: '600',
                    marginTop: '2px',
                  }}
                >
                  / 100
                </span>
              </div>
            )}

            {/* Tier badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${sc}12`,
                border: `1px solid ${sc}25`,
                borderRadius: '999px',
                padding: '4px 12px',
              }}
            >
              <span
                style={{
                  fontSize: '8px',
                  fontWeight: '800',
                  color: sc,
                  letterSpacing: '0.8px',
                }}
              >
                {tier}
              </span>
            </div>

            {/* Score bar */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                gap: '4px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '5px',
                  borderRadius: '3px',
                  background: '#ffffff0a',
                  overflow: 'hidden',
                  display: 'flex',
                  boxShadow: `0 0 8px ${sc}15`,
                }}
              >
                <div
                  style={{
                    width: `${score}%`,
                    height: '100%',
                    borderRadius: '3px',
                    background: `linear-gradient(90deg, ${sc}cc, ${sc})`,
                    boxShadow: `0 0 10px ${sc}40`,
                  }}
                />
              </div>
              <span style={{ fontSize: '7px', color: '#475569', fontWeight: '600' }}>
                ACTIVITY SCORE
              </span>
            </div>

            {/* Address pill */}
            {truncAddr && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff06',
                  border: '1px solid #ffffff0a',
                  borderRadius: '999px',
                  padding: '3px 10px',
                  fontFamily: 'monospace',
                  fontSize: '7px',
                  color: '#334155',
                  marginTop: '2px',
                }}
              >
                {truncAddr}
              </div>
            )}
          </div>

          {/* === RIGHT COLUMN — Stats === */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#0052FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 14px #0052FF70',
                }}
              >
                <div
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'white',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#f1f5f9',
                    letterSpacing: '-0.3px',
                  }}
                >
                  Base Checker
                </span>
                <span
                  style={{
                    fontSize: '6px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: '#f59e0b',
                  }}
                >
                  Airdrop Estimate
                </span>
              </div>
              {pfp && (
                <div
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    background: '#ffffff08',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    border: '1px solid #ffffff0a',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: '900', color: sc }}>{score}</span>
                  <span style={{ fontSize: '7px', color: '#475569', fontWeight: '600' }}>/100</span>
                </div>
              )}
            </div>

            {/* Main value cards — 2 columns */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Tokens */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b9810a, #10b98105)',
                  border: '1px solid #10b98118',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #10b98110 0%, transparent 70%)',
                  }}
                />
                <span
                  style={{
                    fontSize: '6px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    color: '#10b981',
                    marginBottom: '4px',
                  }}
                >
                  Est. Tokens
                </span>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    color: '#10b981',
                    lineHeight: 1,
                    textShadow: '0 0 20px #10b98130',
                  }}
                >
                  {tokens}
                </span>
              </div>
              {/* Value */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  background: 'linear-gradient(135deg, #0052FF0a, #0052FF05)',
                  border: '1px solid #0052FF18',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #0052FF10 0%, transparent 70%)',
                  }}
                />
                <span
                  style={{
                    fontSize: '6px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    color: '#0052FF',
                    marginBottom: '4px',
                  }}
                >
                  Est. Value
                </span>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    color: '#0052FF',
                    lineHeight: 1,
                    textShadow: '0 0 20px #0052FF30',
                  }}
                >
                  {value}
                </span>
              </div>
            </div>

            {/* FDV + Pool row */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {/* FDV */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  background: '#ffffff04',
                  border: '1px solid #ffffff0a',
                  borderRadius: '8px',
                  padding: '7px 10px',
                }}
              >
                <span
                  style={{
                    fontSize: '5.5px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#64748b',
                    marginBottom: '3px',
                  }}
                >
                  FDV Scenario
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#a78bfa',
                  }}
                >
                  {fdv}
                </span>
              </div>
              {/* Pool */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  background: '#ffffff04',
                  border: '1px solid #ffffff0a',
                  borderRadius: '8px',
                  padding: '7px 10px',
                }}
              >
                <span
                  style={{
                    fontSize: '5.5px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#64748b',
                    marginBottom: '3px',
                  }}
                >
                  Airdrop Pool
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#34d399',
                  }}
                >
                  10%
                </span>
              </div>
            </div>

            {/* Bottom XP bar */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                marginTop: '2px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '6px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#64748b',
                  }}
                >
                  XP Progress
                </span>
                <span
                  style={{
                    fontSize: '7px',
                    fontWeight: '700',
                    color: '#94a3b8',
                  }}
                >
                  {score}/100
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  background: '#ffffff08',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                <div
                  style={{
                    width: `${score}%`,
                    height: '100%',
                    borderRadius: '2px',
                    background: `linear-gradient(90deg, ${sc}80, ${sc}, #8b5cf6)`,
                    boxShadow: `0 0 12px ${sc}40`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom edge glow */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${sc}30, #0052FF30, transparent)`,
          }}
        />
      </div>
    ),
    { width: 600, height: 400 }
  )

  // Add cache control headers to prevent caching of dynamic OG images
  imageResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, public')
  imageResponse.headers.set('Pragma', 'no-cache')
  imageResponse.headers.set('Expires', '0')

  return imageResponse
}
