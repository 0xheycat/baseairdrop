'use client'

import { Loader2, ExternalLink, Check, Trophy, Swords } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'
import { safeComposeCast } from '@/lib/miniapp'
import { formatNumber, formatUSD } from '@/lib/estimation'
import type { AllocationResult, ModelParams } from '@/lib/estimation'
import type { ActivityScore } from '@/lib/scoring'
import type { NftHolder } from '@/lib/blockscout'

interface ShareButtonProps {
  address: string
  score: ActivityScore
  allocation: AllocationResult
  params: ModelParams
  username?: string
  nfts?: NftHolder[]
}

const TIER_MAP: Record<number, { tier: string; emoji: string; flavor: string }> = {
  90: { tier: 'S-TIER LEGEND', emoji: '🏆', flavor: 'Wallet is absolutely cooked with on-chain activity' },
  80: { tier: 'S-TIER', emoji: '🔥', flavor: 'Elite degen energy detected' },
  70: { tier: 'A-TIER', emoji: '⚡', flavor: 'Strong on-chain presence' },
  60: { tier: 'A-TIER', emoji: '💪', flavor: 'Solid wallet activity' },
  50: { tier: 'B-TIER', emoji: '📊', flavor: 'Decent on-chain footprint' },
  40: { tier: 'B-TIER', emoji: '👀', flavor: 'Room to level up' },
  30: { tier: 'C-TIER', emoji: '🌱', flavor: 'Getting started on Base' },
  20: { tier: 'C-TIER', emoji: '🐌', flavor: 'Low activity wallet' },
  10: { tier: 'D-TIER', emoji: '😴', flavor: 'Ghost wallet vibes' },
  0: { tier: 'D-TIER', emoji: '👻', flavor: 'Basically invisible on Base' },
}

function getTier(score: number) {
  const thresholds = [90, 80, 70, 60, 50, 40, 30, 20, 10, 0]
  const threshold = thresholds.find(t => score >= t) ?? 0
  return TIER_MAP[threshold]
}

function formatNftLine(nfts: NftHolder[]): string {
  const owned = nfts.filter(n => n.balance > 0)
  if (owned.length === 0) return ''
  const parts = owned.map(n => `${n.name} x${n.balance}`)
  return `\n🏅 ${parts.join(' | ')}`
}

function formatNftStats(nfts: NftHolder[]): string {
  const lines = nfts.map(n => {
    const status = n.balance > 0 ? `✅ x${n.balance}` : '❌'
    return `${n.name}: ${status} (${n.holders > 0 ? n.holders.toLocaleString() : '?'} holders)`
  })
  return `\n\n📦 Official Base NFTs:\n${lines.join('\n')}`
}

const SHARE_VARIANTS = [
  (t: ReturnType<typeof getTier>, tokens: string, value: string, score: number, fdv: string, nftLine: string, nftStats: string) =>
    `${t.emoji} Just checked my Base allocation — ${t.tier}\n\n` +
    `🎯 Score: ${score}/100\n` +
    `🪙 Est. ${tokens} tokens (~${value})\n` +
    `💎 FDV: ${fdv}${nftLine}\n` +
    `${t.flavor}${nftStats}\n\n` +
    `Think you can beat my score? 👇`,

  (t: ReturnType<typeof getTier>, tokens: string, value: string, score: number, fdv: string, nftLine: string, nftStats: string) =>
    `${t.emoji} BASE AIRDROP SCORE: ${score}/100 — ${t.tier}\n\n` +
    `💰 Potential allocation: ${tokens} tokens (~${value})\n` +
    `💎 FDV: ${fdv}${nftLine}\n` +
    `📈 ${t.flavor}${nftStats}\n\n` +
    `Drop your score below 👇🔥`,

  (t: ReturnType<typeof getTier>, tokens: string, value: string, score: number, fdv: string, nftLine: string, nftStats: string) =>
    `${t.emoji} ${t.tier} on Base Checker!\n\n` +
    `Score: ${score}/100\n` +
    `Est. ${tokens} tokens (~${value})\n` +
    `FDV: ${fdv}${nftLine}\n` +
    `${t.flavor}${nftStats}\n\n` +
    `Can you beat my score? 🏆`,

  (t: ReturnType<typeof getTier>, tokens: string, value: string, score: number, fdv: string, nftLine: string, nftStats: string) =>
    `🔮 My Base airdrop prediction just dropped\n\n` +
    `${t.emoji} ${t.tier} — ${score}/100\n` +
    `🪙 ${tokens} tokens (~${value})\n` +
    `💎 FDV: ${fdv}${nftLine}\n\n` +
    `${t.flavor}${nftStats}\n\n` +
    `Check yours 👇`,
]

export default function ShareButton({ address, score, allocation, params, username, nfts = [] }: ShareButtonProps) {
  const [sharing, setSharing] = useState(false)
  const [shared, setShared] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://baseairdrop-mu.vercel.app'
  const shareParams = new URLSearchParams({
    fdv: String(params.fdv),
    supply: String(params.supply),
    pool: String(params.poolPercent),
    rec: String(params.recipients),
  })
  const shareUrl = `${baseUrl}/share/${address}?${shareParams.toString()}`

  const tier = useMemo(() => getTier(score.overall), [score.overall])
  const tokens = formatNumber(allocation.userAllocation)
  const value = formatUSD(allocation.estimatedValue)
  const fdv = useMemo(() => {
    if (params.fdv >= 1_000_000_000) return `$${(params.fdv / 1_000_000_000).toFixed(0)}B`
    return `$${(params.fdv / 1_000_000).toFixed(0)}M`
  }, [params.fdv])

  const nftLine = useMemo(() => formatNftLine(nfts), [nfts])
  const nftStats = useMemo(() => formatNftStats(nfts), [nfts])

  const shareText = useMemo(() => {
    const idx = Math.floor(Math.random() * SHARE_VARIANTS.length)
    return SHARE_VARIANTS[idx](tier, tokens, value, score.overall, fdv, nftLine, nftStats)
  }, [tier, tokens, value, score.overall, fdv, nftLine, nftStats])

  const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`

  const handleShare = useCallback(async () => {
    setSharing(true)
    setShareError(null)
    try {
      await safeComposeCast({ text: shareText, embeds: [shareUrl] })
      setShared(true)
    } catch (err) {
      console.error('[ShareButton] Share failed:', err)
      setShareError('Share failed. Try opening in Warpcast directly.')
    } finally {
      setSharing(false)
    }
  }, [shareText, shareUrl])

  const getShareIcon = () => {
    if (sharing) return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    if (shared) return <Check className="h-4 w-4" aria-hidden="true" />
    return <Swords className="h-4 w-4" aria-hidden="true" />
  }

  const getShareLabel = () => {
    if (sharing) return 'Sharing...'
    if (shared) return 'Shared!'
    return 'Challenge Friends'
  }

  return (
    <div className="space-y-2.5 animate-fadeIn stagger-5" role="region" aria-label="Share results">
      {/* Tier badge */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
        <Trophy className="h-4 w-4 text-amber-400" aria-hidden="true" />
        <span className="text-[12px] font-bold text-amber-300">{tier.tier}</span>
        <span className="text-[11px] text-gray-500">— {tier.flavor}</span>
      </div>

      {/* Challenge friends — composeCast with frame embed */}
      <button
        onClick={handleShare}
        disabled={sharing}
        aria-label={getShareLabel()}
        className={`group flex w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-[#0052FF] focus-visible:outline-offset-2 ${
          shared
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-emerald-600/15'
            : 'bg-gradient-to-r from-[#0052FF] via-purple-600 to-[#0052FF] bg-[length:200%_100%] shadow-purple-600/15 hover:bg-right hover:shadow-purple-600/25'
        }`}
      >
        {getShareIcon()}
        {getShareLabel()}
      </button>

      {/* Error state */}
      {shareError && (
        <p className="text-center text-[11px] text-red-400" role="alert">{shareError}</p>
      )}

      {/* Direct warpcast link fallback */}
      <a
        href={warpcastUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[11px] font-medium text-gray-400 transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-gray-300 focus-visible:outline-2 focus-visible:outline-[#0052FF] focus-visible:outline-offset-2"
        aria-label="Open in Warpcast to share results"
      >
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
        Open in Warpcast
      </a>
    </div>
  )
}
