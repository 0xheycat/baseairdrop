'use client'

import { Share2, Loader2, ExternalLink, Check, Camera } from 'lucide-react'
import { useState, useCallback, useRef } from 'react'
import { safeComposeCast } from '@/lib/miniapp'
import { formatNumber, formatUSD } from '@/lib/estimation'
import type { AllocationResult } from '@/lib/estimation'
import type { ActivityScore } from '@/lib/scoring'
import SnapCard from './SnapCard'

interface ShareButtonProps {
  address: string
  score: ActivityScore
  allocation: AllocationResult
}

export default function ShareButton({ address, score, allocation }: ShareButtonProps) {
  const [sharing, setSharing] = useState(false)
  const [shared, setShared] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)
  const [showSnap, setShowSnap] = useState(false)
  const snapRef = useRef<HTMLDivElement>(null)

  const shareText = `My Base airdrop estimate: ${formatNumber(allocation.userAllocation)} tokens (~${formatUSD(allocation.estimatedValue)}) | Score: ${score.overall}/100\n\nCheck yours:`
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://baseairdrop-mu.vercel.app'
  const shareUrl = `${baseUrl}/share/${address}`
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

  const handleSnap = useCallback(async () => {
    if (!snapRef.current) return
    setSharing(true)
    setShareError(null)

    try {
      // Dynamic import html-to-image (must be installed)
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(snapRef.current, {
        width: 600,
        height: 600,
        pixelRatio: 2,
        backgroundColor: '#0a0a0f',
        style: {
          borderRadius: '0',
          border: 'none',
        },
      })

      // Try native share API first (mobile)
      if (navigator.share && navigator.canShare) {
        const blob = await fetch(dataUrl).then(r => r.blob())
        const file = new File([blob], 'base-checker-snap.png', { type: 'image/png' })
        const shareData = {
          title: 'Base Checker Result',
          text: shareText,
          files: [file],
        }
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData)
          setShared(true)
          return
        }
      }

      // Fallback: compose cast with text only (image can't be embedded via SDK)
      await safeComposeCast({ text: shareText, embeds: [shareUrl] })
      setShared(true)
    } catch (err) {
      console.error('[ShareButton] Snap failed:', err)
      setShareError('Snap capture failed. Try sharing as a cast instead.')
    } finally {
      setSharing(false)
    }
  }, [shareText, shareUrl])

  const getShareIcon = () => {
    if (sharing) return <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
    if (shared) return <Check className="h-4 w-4" aria-hidden="true" />
    return <Share2 className="h-4 w-4" aria-hidden="true" />
  }

  const getShareLabel = () => {
    if (sharing) return 'Sharing...'
    if (shared) return 'Shared!'
    return 'Share on Farcaster'
  }

  return (
    <div className="space-y-2.5 animate-fadeIn stagger-5" role="region" aria-label="Share results">
      {/* Share as cast */}
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

      {/* Snap button */}
      <button
        onClick={() => setShowSnap(!showSnap)}
        disabled={sharing}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/[0.06] px-4 py-2.5 text-[12px] font-semibold text-purple-300 transition-all hover:border-purple-500/30 hover:bg-purple-500/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#0052FF] focus-visible:outline-offset-2"
        aria-label="Create a snap image of your results"
      >
        <Camera className="h-4 w-4" aria-hidden="true" />
        Snap Result
      </button>

      {/* Snap preview */}
      {showSnap && (
        <div className="animate-fadeIn space-y-3">
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <SnapCard
              ref={snapRef}
              address={address}
              score={score}
              allocation={allocation}
            />
          </div>

          <button
            onClick={handleSnap}
            disabled={sharing}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-2.5 text-[12px] font-semibold text-emerald-300 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#0052FF] focus-visible:outline-offset-2"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            {sharing ? 'Capturing...' : 'Capture & Share Snap'}
          </button>

          <p className="text-center text-[10px] text-gray-600">
            Creates a shareable image card of your results
          </p>
        </div>
      )}

      {/* Error state */}
      {shareError && (
        <p className="text-center text-[11px] text-red-400" role="alert">
          {shareError}
        </p>
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
