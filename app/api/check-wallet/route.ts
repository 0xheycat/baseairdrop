import { NextRequest, NextResponse } from 'next/server'
import { getWalletMetrics } from '@/lib/blockscout'
import { computeActivityScore } from '@/lib/scoring'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json()

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
    }

    const metrics = await getWalletMetrics(address)
    const score = computeActivityScore(metrics)

    return NextResponse.json({ metrics, score })
  } catch (err: any) {
    console.error('[api/check-wallet] error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to check wallet' },
      { status: 500 }
    )
  }
}
