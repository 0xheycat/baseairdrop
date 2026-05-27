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
    default: 'Base Checker - $BASE Allocation Estimator',
    template: '%s | Base Checker',
  },
  description:
    'Check your estimated Base airdrop allocation. Analyze on-chain activity and get $BASE token estimates.',
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
    'talentapp:project_verification': 'faec422be9a71b187a3fca93a07f65f2978808ba8c654a6e958b3b070a68997309dd8c3e4950768fb737d8c26eadc26af52dfb9bca8dc33dc62975a3b1515db4',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
