import type { WalletMetrics } from './blockscout'

export interface ActivityScore {
  overall: number
  txScore: number
  dayScore: number
  contractScore: number
  balanceScore: number
}

export function computeActivityScore(metrics: WalletMetrics): ActivityScore {
  const txScore = Math.min(metrics.txCount / 500, 1) * 100
  const dayScore = Math.min(metrics.activeDays / 180, 1) * 100
  const contractScore = Math.min(metrics.contractCount / 50, 1) * 100
  const balanceScore = Math.min(metrics.ethBalance / 10, 1) * 100

  const overall = Math.round(
    txScore * 0.35 + dayScore * 0.30 + contractScore * 0.20 + balanceScore * 0.15
  )

  return { overall, txScore, dayScore, contractScore, balanceScore }
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Strong'
  if (score >= 40) return 'Moderate'
  if (score >= 20) return 'Low'
  return 'Minimal'
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#3b82f6'
  if (score >= 40) return '#f59e0b'
  if (score >= 20) return '#f97316'
  return '#ef4444'
}
