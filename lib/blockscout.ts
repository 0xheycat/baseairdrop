import 'server-only'

const BASE_BLOCKSCOUT_API = 'https://base.blockscout.com/api'

export interface WalletMetrics {
  txCount: number
  activeDays: number
  contractCount: number
  ethBalance: number
}

// In-memory cache (10s TTL for stats)
const cache = new Map<string, { data: WalletMetrics; timestamp: number }>()
const CACHE_TTL = 10 * 1000

async function blockscoutFetch(path: string, timeout = 25000): Promise<any> {
  const url = `${BASE_BLOCKSCOUT_API}${path}`
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(timeout),
    })
    if (!res.ok) {
      console.error(`[Blockscout] API error for ${path}: ${res.status} ${res.statusText}`)
      throw new Error(`Blockscout error: ${res.status}`)
    }
    return res.json()
  } catch (err) {
    console.error(`[Blockscout] Fetch failed for ${path}:`, err)
    throw err
  }
}

/**
 * Get address counters (accurate total counts from Blockscout)
 * /api/v2/addresses/{address}/counters
 */
async function getAddressCounters(address: string): Promise<{
  transactionsCount: number
  tokenTransfersCount: number
} | null> {
  try {
    const data = await blockscoutFetch(`/v2/addresses/${address}/counters`)
    return {
      transactionsCount: parseInt(data.transactions_count || '0') || 0,
      tokenTransfersCount: parseInt(data.token_transfers_count || '0') || 0,
    }
  } catch {
    return null
  }
}

/**
 * Get recent transactions using Blockscout v2 API
 * /api/v2/addresses/{address}/transactions
 */
async function getTransactions(
  address: string,
  maxPages = 3
): Promise<Array<{ timeStamp: string; from: string; to: string; gas_used: number; gas_price: string }>> {
  const allTxs: any[] = []
  let nextPageParams: string | null = null
  let page = 1

  while (page <= maxPages) {
    let url = `/v2/addresses/${address}/transactions`
    if (nextPageParams) url += `?${nextPageParams}`

    try {
      const data = await blockscoutFetch(url, 20000)
      const items = data.items || []
      if (items.length === 0) break

      for (const item of items) {
        allTxs.push({
          timeStamp: item.timestamp ? Math.floor(new Date(item.timestamp).getTime() / 1000).toString() : '0',
          from: item.from?.hash || '',
          to: item.to?.hash || '',
          gas_used: item.gas_used || 0,
          gas_price: item.gas_price || '0',
        })
      }

      nextPageParams = data.next_page_params
        ? new URLSearchParams(data.next_page_params).toString()
        : null
      if (!nextPageParams) break
      page++
    } catch {
      break
    }
  }

  return allTxs
}

/**
 * Get ETH balance from Blockscout v2 address info
 */
async function getBalance(address: string): Promise<number> {
  try {
    const data = await blockscoutFetch(`/v2/addresses/${address}`)
    const balanceWei = data.coin_balance || '0'
    return parseFloat(balanceWei) / 1e18
  } catch {
    return 0
  }
}

/**
 * Get wallet metrics using Blockscout (FREE, no API key)
 */
export async function getWalletMetrics(address: string): Promise<WalletMetrics> {
  const normalized = address.toLowerCase()
  const cacheKey = `base:${normalized}`

  // Check cache
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  // Parallel fetch: counters + recent transactions + balance (use allSettled to handle partial failures)
  const results = await Promise.allSettled([
    getAddressCounters(normalized),
    getTransactions(normalized, 3),
    getBalance(normalized),
  ])

  const counters = results[0].status === 'fulfilled' ? results[0].value : null
  const txs = results[1].status === 'fulfilled' ? results[1].value : []
  const ethBalance = results[2].status === 'fulfilled' ? results[2].value : 0

  // Count unique active days from recent transactions
  const uniqueDays = new Set<string>()
  for (const tx of txs) {
    const date = new Date(parseInt(tx.timeStamp) * 1000).toISOString().split('T')[0]
    uniqueDays.add(date)
  }

  // Count unique contracts interacted with
  const contracts = new Set<string>()
  for (const tx of txs) {
    if (tx.to && tx.to.toLowerCase() !== normalized) {
      // Check if it looks like a contract interaction (has meaningful input data)
      contracts.add(tx.to.toLowerCase())
    }
  }

  const data: WalletMetrics = {
    txCount: counters?.transactionsCount || txs.length,
    activeDays: uniqueDays.size,
    contractCount: contracts.size,
    ethBalance,
  }

  console.log(`[Blockscout] Metrics for ${normalized}:`, data)

  // Cache the result
  cache.set(cacheKey, { data, timestamp: Date.now() })

  return data
}
