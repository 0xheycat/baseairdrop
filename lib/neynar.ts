import 'server-only'
import { Configuration, NeynarAPIClient } from '@neynar/nodejs-sdk'

let cachedClient: NeynarAPIClient | null = null

function getNeynarClient(): NeynarAPIClient {
  const apiKey = process.env.NEYNAR_API_KEY
  if (!apiKey) throw new Error('Missing NEYNAR_API_KEY')
  if (!cachedClient) {
    cachedClient = new NeynarAPIClient(new Configuration({ apiKey }))
  }
  return cachedClient
}

export interface FarcasterUser {
  fid: number
  username: string
  displayName?: string | null
  pfpUrl?: string | null
  bio?: string
  followerCount: number
  followingCount: number
  verifications: string[]
  custodyAddress: string
  ethAddresses: string[]
}

function mapUser(u: any): FarcasterUser | null {
  if (!u) return null
  return {
    fid: u.fid,
    username: u.username,
    displayName: u.display_name,
    pfpUrl: u.pfp_url,
    bio: u.profile?.bio?.text,
    followerCount: u.follower_count,
    followingCount: u.following_count,
    verifications: u.verifications || [],
    custodyAddress: u.custody_address,
    ethAddresses: u.verified_addresses?.eth_addresses || [],
  }
}

export async function fetchUserByFid(fid: number): Promise<FarcasterUser | null> {
  try {
    const client = getNeynarClient()
    const resp = await client.fetchBulkUsers({ fids: [fid] })
    return mapUser(resp.users?.[0])
  } catch (err) {
    console.error('[neynar] fetchUserByFid error:', err)
    return null
  }
}

export async function fetchFidByAddress(address: string): Promise<number | null> {
  try {
    const client = getNeynarClient()
    const resp = await client.fetchBulkUsersByEthOrSolAddress({ addresses: [address] })
    // Response is keyed by original address
    const users = resp[address] || resp[address.toLowerCase()]
    if (Array.isArray(users) && users.length > 0) {
      return users[0].fid
    }
    return null
  } catch (err) {
    console.error('[neynar] fetchFidByAddress error:', err)
    return null
  }
}

export async function fetchVerifiedWallets(fid: number): Promise<string[]> {
  try {
    const client = getNeynarClient()
    const resp = await client.fetchBulkUsers({ fids: [fid] })
    const user = resp.users?.[0]
    if (!user) return []
    const wallets: string[] = []
    if (user.custody_address) wallets.push(user.custody_address)
    if (user.verified_addresses?.eth_addresses) {
      wallets.push(...user.verified_addresses.eth_addresses)
    }
    return [...new Set(wallets.map(w => w.toLowerCase()))]
  } catch (err) {
    console.error('[neynar] fetchVerifiedWallets error:', err)
    return []
  }
}
