export interface ModelParams {
  fdv: number        // Fully diluted valuation in USD
  supply: number     // Total token supply
  poolPercent: number // Airdrop pool as % of supply
  recipients: number // Estimated number of recipients
}

export interface AllocationResult {
  tokenPrice: number
  poolSize: number
  avgAllocation: number
  userAllocation: number
  estimatedValue: number
}

export const DEFAULT_PARAMS: ModelParams = {
  fdv: 4_000_000_000,
  supply: 1_000_000_000,
  poolPercent: 10,
  recipients: 200_000,
}

export const PARAM_OPTIONS = {
  fdv: [
    { label: '$2B', value: 2_000_000_000 },
    { label: '$4B', value: 4_000_000_000 },
    { label: '$6B', value: 6_000_000_000 },
    { label: '$8B', value: 8_000_000_000 },
    { label: '$10B', value: 10_000_000_000 },
    { label: '$12B', value: 12_000_000_000 },
  ],
  supply: [
    { label: '1B', value: 1_000_000_000 },
    { label: '5B', value: 5_000_000_000 },
    { label: '10B', value: 10_000_000_000 },
  ],
  poolPercent: [
    { label: '2.5%', value: 2.5 },
    { label: '5%', value: 5 },
    { label: '10%', value: 10 },
    { label: '15%', value: 15 },
    { label: '20%', value: 20 },
  ],
  recipients: [
    { label: '50K', value: 50_000 },
    { label: '100K', value: 100_000 },
    { label: '200K', value: 200_000 },
    { label: '500K', value: 500_000 },
    { label: '1M', value: 1_000_000 },
  ],
}

export function computeAllocation(score: number, params: ModelParams): AllocationResult {
  const tokenPrice = params.fdv / params.supply
  const poolSize = params.supply * (params.poolPercent / 100)
  const avgAllocation = poolSize / params.recipients
  const userAllocation = avgAllocation * (score / 100)
  const estimatedValue = userAllocation * tokenPrice

  return { tokenPrice, poolSize, avgAllocation, userAllocation, estimatedValue }
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toFixed(2)
}

export function formatUSD(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
