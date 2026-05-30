import type { WalletMetrics } from './blockscout'

export interface ActivityScore {
  overall: number
  txScore: number
  dayScore: number
  contractScore: number
  balanceScore: number
  nftScore: number
}

export function computeActivityScore(metrics: WalletMetrics): ActivityScore {
  const txScore = Math.min(metrics.txCount / 500, 1) * 100
  const dayScore = Math.min(metrics.activeDays / 180, 1) * 100
  const contractScore = Math.min(metrics.contractCount / 50, 1) * 100
  const balanceScore = Math.min(metrics.ethBalance / 10, 1) * 100

  // NFT score: each official Base NFT held adds significant signal
  // Holding both = max score, holding one = partial
  const nftsHeld = metrics.nfts?.filter(n => n.balance > 0).length || 0
  const nftScore = Math.min(nftsHeld / BASE_NFT_CONTRACTS.length, 1) * 100

  const overall = Math.round(
    txScore * 0.30 + dayScore * 0.25 + contractScore * 0.15 + balanceScore * 0.10 + nftScore * 0.20
  )

  return { overall, txScore, dayScore, contractScore, balanceScore, nftScore }
}

const BASE_NFT_CONTRACTS = [
  '0xe3EB165C9ED6D6D87A59C410C8F30bABac44FeFD',
  '0x8DC80A209A3362f0586e6C116973Bb6908170c84',
]

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
