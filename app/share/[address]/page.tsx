import type { Metadata } from 'next'
import { getWalletMetrics } from '@/lib/blockscout'
import { computeActivityScore } from '@/lib/scoring'
import { computeAllocation, DEFAULT_PARAMS, formatNumber, formatUSD } from '@/lib/estimation'
import { fetchFidByAddress, fetchUserByFid } from '@/lib/neynar'
import ShareClient from './ShareClient'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://baseairdrop-mu.vercel.app'

type Props = { params: { address: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const address = params.address
  let title = 'Base Checker'
  let description = 'Check your estimated Base airdrop allocation'
  let ogScore = '0'
  let ogValue = '$0.00'
  let ogTokens = '0'
  let username = ''
  let pfpUrl = ''

  try {
    // Fetch on-chain data
    const metrics = await getWalletMetrics(address)
    const score = computeActivityScore(metrics)
    const alloc = computeAllocation(score.overall, DEFAULT_PARAMS)
    ogScore = String(score.overall)
    ogTokens = formatNumber(alloc.userAllocation)
    ogValue = formatUSD(alloc.estimatedValue)
    title = `Base Checker: Score ${score.overall}/100 - ${ogTokens} tokens`
    description = `Estimated allocation: ${ogTokens} tokens (~${ogValue})`

    // Fetch Farcaster profile for the OG image
    try {
      const fid = await fetchFidByAddress(address)
      if (fid) {
        const user = await fetchUserByFid(fid)
        if (user) {
          username = user.username || ''
          pfpUrl = user.pfpUrl || ''
        }
      }
    } catch {
      // Profile fetch is optional
    }
  } catch {
    // Use defaults if fetch fails
  }

  const fdvLabel = DEFAULT_PARAMS.fdv >= 1_000_000_000
    ? `$${(DEFAULT_PARAMS.fdv / 1_000_000_000).toFixed(0)}B`
    : `$${(DEFAULT_PARAMS.fdv / 1_000_000).toFixed(0)}M`

  const ogParams = new URLSearchParams({
    score: ogScore,
    address,
    value: ogValue,
    tokens: ogTokens,
    fdv: fdvLabel,
  })
  if (username) ogParams.set('username', username)
  if (pfpUrl) ogParams.set('pfp', pfpUrl)

  const ogUrl = `${baseUrl}/api/og?${ogParams.toString()}`

  const miniappEmbed = {
    version: '1',
    imageUrl: ogUrl,
    button: {
      title: 'Check Yours',
      action: {
        type: 'launch_frame',
        name: 'Base Checker',
        url: baseUrl,
        splashImageUrl: `${baseUrl}/icon.png`,
        splashBackgroundColor: '#0a0a0f',
      },
    },
  }

  return {
    title,
    description,
    openGraph: { title, description, images: [ogUrl] },
    twitter: { card: 'summary_large_image' as const },
    other: {
      'fc:miniapp': JSON.stringify(miniappEmbed),
      'fc:frame': JSON.stringify(miniappEmbed),
    },
  }
}

export default async function SharePage({ params }: Props) {
  const address = params.address
  let initialData = null
  let username = ''
  let pfpUrl = ''

  try {
    const metrics = await getWalletMetrics(address)
    const score = computeActivityScore(metrics)
    const allocation = computeAllocation(score.overall, DEFAULT_PARAMS)
    initialData = { metrics, score, allocation }

    // Fetch Farcaster profile
    try {
      const fid = await fetchFidByAddress(address)
      if (fid) {
        const user = await fetchUserByFid(fid)
        if (user) {
          username = user.username || ''
          pfpUrl = user.pfpUrl || ''
        }
      }
    } catch {}
  } catch {}

  return (
    <div className="min-h-screen">
      <main
        id="main-content"
        className="mx-auto max-w-lg px-4 pb-8 pt-6"
        role="main"
        aria-label="Shared wallet results"
      >
        <div className="mb-6 text-center">
          <h1 className="bg-gradient-to-r from-blue-400 to-[#0052FF] bg-clip-text text-xl font-bold text-transparent">
            Base Checker Results
          </h1>
          <p className="mt-1 font-mono text-xs text-gray-500" aria-label={`Address: ${address}`}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>

        {initialData ? (
          <ShareClient
            address={address}
            initialScore={initialData.score}
            initialMetrics={initialData.metrics}
            initialAllocation={initialData.allocation}
            username={username}
            pfpUrl={pfpUrl}
          />
        ) : (
          <div className="glass-card p-8 text-center" role="alert">
            <p className="text-sm text-gray-400">
              Could not load results for this address.
            </p>
            <p className="mt-2 text-[11px] text-gray-600">
              The address may be invalid or the network may be temporarily unavailable.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
