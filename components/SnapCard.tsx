'use client'

import { useRef, forwardRef } from 'react'
import { getScoreColor, getScoreLabel, type ActivityScore } from '@/lib/scoring'
import { formatNumber, formatUSD, type AllocationResult } from '@/lib/estimation'
import BaseLogo from './BaseLogo'

interface SnapCardProps {
  address: string
  score: ActivityScore
  allocation: AllocationResult
}

/**
 * A beautiful, self-contained result card designed for screenshot/snap sharing.
 * Renders at 600x600 for crisp social media embeds.
 */
const SnapCard = forwardRef<HTMLDivElement, SnapCardProps>(
  function SnapCard({ address, score, allocation }, ref) {
    const color = getScoreColor(score.overall)
    const label = getScoreLabel(score.overall)
    const truncAddr = address
      ? `${address.slice(0, 6)}\u00B7\u00B7\u00B7${address.slice(-4)}`
      : ''

    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl border border-white/[0.08]"
        style={{
          width: 600,
          height: 600,
          background: '#0a0a0f',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Ambient glows */}
        <div
          className="absolute"
          style={{
            top: -80,
            left: -40,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,82,255,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: -60,
            right: -30,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-between p-8">
          {/* Header */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <BaseLogo size={32} />
              <div>
                <div className="text-[18px] font-extrabold tracking-tight text-white">
                  Base Checker
                </div>
                <div className="text-[9px] font-bold uppercase tracking-[2px] text-amber-400">
                  Unofficial Estimate
                </div>
              </div>
            </div>
            <div
              className="rounded-full px-3 py-1 text-[11px] font-bold"
              style={{ color, backgroundColor: `${color}15` }}
            >
              {label}
            </div>
          </div>

          {/* Score Ring */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
              <svg width={180} height={180} viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                  <linearGradient id="snap-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="1" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <circle cx="90" cy="90" r="75" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
                <circle
                  cx="90"
                  cy="90"
                  r="75"
                  fill="none"
                  stroke="url(#snap-grad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 75}
                  strokeDashoffset={2 * Math.PI * 75 * (1 - score.overall / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[56px] font-black leading-none" style={{ color }}>
                  {score.overall}
                </span>
                <span className="text-[14px] font-medium text-gray-600">/ 100</span>
              </div>
            </div>
            <span className="text-[13px] font-semibold text-gray-500">Activity Score</span>
          </div>

          {/* Stats Grid */}
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Est. Tokens</div>
              <div className="mt-1 text-[24px] font-extrabold text-emerald-400">
                {formatNumber(allocation.userAllocation)}
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Est. Value</div>
              <div className="mt-1 text-[24px] font-extrabold text-blue-400">
                {formatUSD(allocation.estimatedValue)}
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Token Price</div>
              <div className="mt-1 text-[24px] font-extrabold text-purple-400">
                {formatUSD(allocation.tokenPrice)}
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Transactions</div>
              <div className="mt-1 text-[24px] font-extrabold text-amber-400">
                {score.txScore.toFixed(0)}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex w-full items-center justify-between">
            {truncAddr && (
              <span className="font-mono text-[12px] text-gray-600">{truncAddr}</span>
            )}
            <span className="text-[10px] font-medium text-gray-700">
              baseairdrop-mu.vercel.app
            </span>
          </div>
        </div>
      </div>
    )
  }
)

export default SnapCard
