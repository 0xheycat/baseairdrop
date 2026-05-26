'use client'

import { Coins, DollarSign, BarChart3, Percent, Flame, Clock, Code, Wallet } from 'lucide-react'
import ScoreRing from './ScoreRing'
import type { ActivityScore } from '@/lib/scoring'
import type { WalletMetrics } from '@/lib/blockscout'
import type { AllocationResult, ModelParams } from '@/lib/estimation'
import { formatNumber, formatUSD } from '@/lib/estimation'

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
          icon={<BarChart3 className="h-3.5 w-3.5" />}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/10"
          label="Token Price"
          value={formatUSD(allocation.tokenPrice)}
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
        </div>
      </div>

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
