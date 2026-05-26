import type { Metadata } from 'next'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://baseairdrop-mu.vercel.app'

const miniappEmbed = {
  version: '1',
  imageUrl: `${baseUrl}/api/og?score=0&value=$0.00&tokens=0`,
  button: {
    title: 'Check Allocation',
    action: {
      type: 'launch_frame',
      name: 'Base Checker',
      url: baseUrl,
      splashImageUrl: `${baseUrl}/icon.png`,
      splashBackgroundColor: '#0a0a0f',
    },
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Base Checker - Base Allocation Estimator',
    template: '%s | Base Checker',
  },
  description:
    'Check your estimated Base airdrop allocation. Analyze on-chain activity and get hypothetical token estimates.',
  openGraph: {
    title: 'Base Checker',
    description: 'Check your estimated Base airdrop allocation',
    images: [`${baseUrl}/api/og?score=0`],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Checker',
    description: 'Check your estimated Base airdrop allocation',
  },
  other: {
    'fc:miniapp': JSON.stringify(miniappEmbed),
    'fc:frame': JSON.stringify(miniappEmbed),
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="fc:frame" content={JSON.stringify(miniappEmbed)} />
      </head>
      <body className="min-h-screen">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
