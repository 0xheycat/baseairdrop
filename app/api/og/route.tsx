import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const score = req.nextUrl.searchParams.get('score') || '0'

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '1200px', height: '630px', background: '#0a0a0f', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
          <div style={{ fontSize: '80px', fontWeight: 900, color: '#0052FF' }}>{score}</div>
          <div style={{ fontSize: '24px', color: '#999' }}>Base Checker</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
