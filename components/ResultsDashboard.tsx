'use client'

import { Coins, DollarSign, BarChart3, Percent, Flame, Clock, Code, Wallet, Trophy, Zap, Award, Image } from 'lucide-react'
import ScoreRing from './ScoreRing'
import type { ActivityScore } from '@/lib/scoring'
import type { WalletMetrics } from '@/lib/blockscout'
import type { AllocationResult, ModelParams } from '@/lib/estimation'
import { formatNumber, formatUSD } from '@/lib/estimation'

const TIER_MAP: Record<number, { tier: string; emoji: string; flavor: string; color: string }> = {
  90: { tier: 'S-TIER LEGEND', emoji: '\u{1F3C6}', flavor: 'Wallet is absolutely cooked with on-chain activity', color: '#f59e0b' },
  80: { tier: 'S-TIER', emoji: '\u{1F525}', flavor: 'Elite degen energy detected', color: '#10b981' },
  70: { tier: 'A-TIER', emoji: '\u26A1', flavor: 'Strong on-chain presence', color: '#3b82f6' },
  60: { tier: 'A-TIER', emoji: '\u{1F4AA}', flavor: 'Solid wallet activity', color: '#3b82f6' },
  50: { tier: 'B-TIER', emoji: '\u{1F4CA}', flavor: 'Decent on-chain footprint', color: '#8b5cf6' },
  40: { tier: 'B-TIER', emoji: '\u{1F440}', flavor: 'Room to level up', color: '#8b5cf6' },
  30: { tier: 'C-TIER', emoji: '\u{1F331}', flavor: 'Getting started on Base', color: '#f59e0b' },
  20: { tier: 'C-TIER', emoji: '\u{1F40C}', flavor: 'Low activity wallet', color: '#f59e0b' },
  10: { tier: 'D-TIER', emoji: '\u{1F634}', flavor: 'Ghost wallet vibes', color: '#ef4444' },
  0: { tier: 'D-TIER', emoji: '\u{1F47B}', flavor: 'Basically invisible on Base', color: '#ef4444' },
}

function getTier(score: number) {
  const thresholds = [90, 80, 70, 60, 50, 40, 30, 20, 10, 0]
  const threshold = thresholds.find(t => score >= t) ?? 0
  return TIER_MAP[threshold]
}

interface ResultsDashboardProps {
  address: string
  score: ActivityScore
  metrics: WalletMetrics
  allocation: AllocationResult
  params: ModelParams
}

export default function ResultsDashboard({
  address,
  score,
  metrics,
  allocation,
  params,
}: ResultsDashboardProps) {
  const safeAddress = address || ''
  const truncatedAddress = safeAddress.length > 10
    ? `${safeAddress.slice(0, 6)}\u00B7\u00B7\u00B7${safeAddress.slice(-4)}`
    : safeAddress

  const tier = getTier(score.overall)
  const fdv = params.fdv >= 1_000_000_000
    ? `$${(params.fdv / 1_000_000_000).toFixed(0)}B`
    : `$${(params.fdv / 1_000_000).toFixed(0)}M`

  return (
    <div
      className="space-y-3 animate-slideUp"
      role="region"
      aria-label="Wallet analysis results"
    >
      {/* Score Ring */}
      <div className="glass-card flex flex-col items-center px-4 py-6">
        <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
          Activity Score
        </h2>
        <ScoreRing score={score.overall} />
        {/* Tier badge */}
        <div
          className="mt-3 flex items-center gap-2 rounded-xl border px-4 py-2"
          style={{ borderColor: `${tier.color}20`, background: `${tier.color}08` }}
        >
          <Trophy className="h-4 w-4" style={{ color: tier.color }} aria-hidden="true" />
          <span className="text-[12px] font-bold" style={{ color: tier.color }}>{tier.emoji} {tier.tier}</span>
        </div>
        <p className="mt-1.5 text-[10px] text-gray-500">{tier.flavor}</p>
      </div>

      {/* Allocation Cards */}
      <div
        className="grid grid-cols-2 gap-2.5"
        role="list"
        aria-label="Allocation estimates"
      >
        <StatCard
          icon={<Coins className="h-3.5 w-3.5" />}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          label="Est. Tokens"
          value={formatNumber(allocation.userAllocation)}
          valueColor="text-gradient-green"
          delay={0}
        />
        <StatCard
          icon={<DollarSign className="h-3.5 w-3.5" />}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          label="Est. Value"
          value={formatUSD(allocation.estimatedValue)}
          valueColor="text-gradient-blue"
          delay={1}
        />
        <StatCard
          icon={<Zap className="h-3.5 w-3.5" />}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
          label="FDV"
          value={fdv}
          valueColor="text-purple-300"
          delay={2}
        />
        <StatCard
          icon={<Percent className="h-3.5 w-3.5" />}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          label="Pool Size"
          value={formatNumber(params.supply * (params.poolPercent / 100))}
          valueColor="text-amber-300"
          delay={3}
        />
      </div>

      {/* Activity Metrics */}
      <div className="glass-card p-4">
        <h2 className="mb-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
          On-Chain Activity
        </h2>
        <div className="space-y-3.5" role="list" aria-label="On-chain activity metrics">
          <MetricBar
            icon={<Flame className="h-3 w-3 text-gray-500" />}
            label="Transactions"
            value={metrics.txCount}
            max={500}
            score={score.txScore}
          />
          <MetricBar
            icon={<Clock className="h-3 w-3 text-gray-500" />}
            label="Active Days"
            value={metrics.activeDays}
            max={180}
            score={score.dayScore}
          />
          <MetricBar
            icon={<Code className="h-3 w-3 text-gray-500" />}
            label="Contracts"
            value={metrics.contractCount}
            max={50}
            score={score.contractScore}
          />
          <MetricBar
            icon={<Wallet className="h-3 w-3 text-gray-500" />}
            label="ETH Balance"
            value={metrics.ethBalance}
            max={10}
            score={score.balanceScore}
            decimals={4}
          />
          <MetricBar
            icon={<Image className="h-3 w-3 text-gray-500" />}
            label="Base NFTs"
            value={metrics.nfts?.filter(n => n.balance > 0).length || 0}
            max={2}
            score={score.nftScore}
          />
        </div>
      </div>

      {/* Official Base NFTs */}
      {metrics.nfts && metrics.nfts.length > 0 && (
        <div className="glass-card p-4">
          <h2 className="mb-3.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
            Official Base NFTs
          </h2>
          <div className="space-y-2.5">
            {metrics.nfts.map(nft => {
              const owned = nft.balance > 0
              return (
                <div key={nft.contract} className={`rounded-lg border px-3 py-3 ${owned ? 'border-blue-500/20 bg-blue-500/[0.04]' : 'border-white/[0.04] bg-white/[0.02]'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${owned ? 'bg-blue-500/15' : 'bg-white/[0.04]'}`}>
                        <Award className={`h-4 w-4 ${owned ? 'text-blue-400' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-gray-200">{nft.name}</p>
                        {nft.symbol && <p className="text-[9px] font-medium text-gray-600">{nft.symbol}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono text-[14px] font-bold tabular-nums ${owned ? 'text-blue-400' : 'text-gray-600'}`}>
                        {nft.balance}
                      </span>
                      <p className="text-[9px] text-gray-600">owned</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-3 border-t border-white/[0.04] pt-2.5">
                    <div className="flex-1">
                      <p className="text-[9px] uppercase tracking-wider text-gray-600">Holders</p>
                      <p className="font-mono text-[11px] font-semibold text-gray-400 tabular-nums">
                        {nft.holders > 0 ? nft.holders.toLocaleString() : '\u2014'}
                      </p>
                    </div>
                    <div className="h-5 w-px bg-white/[0.06]" />
                    <div className="flex-1">
                      <p className="text-[9px] uppercase tracking-wider text-gray-600">Total Supply</p>
                      <p className="font-mono text-[11px] font-semibold text-gray-400 tabular-nums">
                        {nft.totalSupply > 0 ? nft.totalSupply.toLocaleString() : '\u2014'}
                      </p>
                    </div>
                    <div className="h-5 w-px bg-white/[0.06]" />
                    <div className="flex-1">
                      <p className="text-[9px] uppercase tracking-wider text-gray-600">Held</p>
                      <p className={`font-mono text-[11px] font-semibold tabular-nums ${owned ? 'text-blue-400' : 'text-gray-500'}`}>
                        {owned && nft.totalSupply > 0
                          ? `${((nft.balance / nft.totalSupply) * 100).toFixed(3)}%`
                          : '0%'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Address badge */}
      <div className="flex justify-center pt-1">
        <span
          className="rounded-full bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-gray-600"
          aria-label={`Analyzed address: ${safeAddress}`}
        >
          {truncatedAddress}
        </span>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  valueColor,
  delay,
}: {
  icon: React.ReactNode
  iconColor: string
  iconBg: string
  label: string
  value: string
  valueColor: string
  delay: number
}) {
  return (
    <div
      className={`glass-card-sm p-3.5 animate-fadeIn stagger-${delay + 1}`}
      role="listitem"
      aria-label={`${label}: ${value}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-lg ${iconBg}`}
          aria-hidden="true"
        >
          <span className={iconColor}>{icon}</span>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-600">
          {label}
        </span>
      </div>
      <p className={`text-[17px] font-bold tabular-nums ${valueColor}`}>
        {value || '\u2014'}
      </p>
    </div>
  )
}

function MetricBar({
  icon,
  label,
  value,
  max,
  score,
  decimals = 0,
}: {
  icon: React.ReactNode
  label: string
  value: number
  max: number
  score: number
  decimals?: number
}) {
  const safeValue = typeof value === 'number' && isFinite(value) ? value : 0
  const pct = Math.min((safeValue / max) * 100, 100)
  const gradientClass =
    score >= 80
      ? 'from-emerald-500 to-emerald-400'
      : score >= 60
        ? 'from-blue-500 to-blue-400'
        : score >= 40
          ? 'from-amber-500 to-amber-400'
          : 'from-red-500 to-red-400'

  const displayValue = decimals > 0 ? safeValue.toFixed(decimals) : safeValue.toLocaleString()
  const barId = `metric-bar-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div role="listitem">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[11px] font-medium text-gray-400">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold text-gray-300 tabular-nums">
            {displayValue}
          </span>
          <span className="font-mono text-[9px] text-gray-600" aria-hidden="true">
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div
        className="metric-bar-track"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${displayValue}, ${Math.round(pct)}% of maximum`}
        id={barId}
      >
        <div
          className={`metric-bar-fill bg-gradient-to-r ${gradientClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
