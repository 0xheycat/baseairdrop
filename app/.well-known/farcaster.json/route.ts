import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://baseairdrop-mu.vercel.app'

  return NextResponse.json({
    accountAssociation: {
      header: 'eyJmaWQiOjE4MTM5LCJ0eXBlIjoiYXV0aCIsImtleSI6IjB4OGEzMDk0ZTQ0NTc3NTc5ZDZmNDFGNjIxNGE4NkMyNTBiN2RCREM0ZSJ9',
      payload: 'eyJkb21haW4iOiJiYXNlYWlyZHJvcC1tdS52ZXJjZWwuYXBwIn0',
      signature: '7d6l1fnIxfrJOh7rOI4+gNMMSAVv2NaJu7dCW3JNxjsxLsTMkNOwAv1dTP/WTt8wwYAsyhr+ztSS0Fr8BvflXxs=',
    },
    miniapp: {
      version: '1',
      name: 'Base Checker',
      iconUrl: `${baseUrl}/icon.png`,
      homeUrl: baseUrl,
      imageUrl: `${baseUrl}/api/og?score=0&value=$0.00&tokens=0`,
      buttonTitle: 'Check Allocation',
      splashImageUrl: `${baseUrl}/icon.png`,
      splashBackgroundColor: '#0a0a0f',
    },
  })
}
