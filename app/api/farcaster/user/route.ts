import { NextRequest, NextResponse } from 'next/server'
import { fetchUserByFid, fetchFidByAddress } from '@/lib/neynar'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const fid = req.nextUrl.searchParams.get('fid')
    const address = req.nextUrl.searchParams.get('address')

    if (fid) {
      const user = await fetchUserByFid(parseInt(fid, 10))
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      return NextResponse.json({ user })
    }

    if (address) {
      const resolvedFid = await fetchFidByAddress(address)
      if (!resolvedFid) return NextResponse.json({ fid: null })
      const user = await fetchUserByFid(resolvedFid)
      return NextResponse.json({ fid: resolvedFid, user })
    }

    return NextResponse.json({ error: 'Provide fid or address' }, { status: 400 })
  } catch (err: any) {
    console.error('[api/farcaster/user] error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
