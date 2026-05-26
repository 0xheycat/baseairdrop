import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://base-checker.vercel.app'

  return NextResponse.json({
    accountAssociation: {
      header: '',
      payload: '',
      signature: '',
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
