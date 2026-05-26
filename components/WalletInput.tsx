'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Loader2, User, Wallet, CheckCircle2, Radio, AlertCircle } from 'lucide-react'
import { probeMiniappReady, getMiniappContext } from '@/lib/miniapp'

interface WalletInputProps {
  onCheck: (address: string) => void
  isLoading: boolean
}

export default function WalletInput({ onCheck, isLoading }: WalletInputProps) {
  const [address, setAddress] = useState('')
  const [fid, setFid] = useState<number | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [pfpUrl, setPfpUrl] = useState<string | null>(null)
  const [autoDetected, setAutoDetected] = useState(false)
  const [detecting, setDetecting] = useState(true)
  const [inputError, setInputError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pfpRef = useRef<HTMLImageElement>(null)

  const detectWallet = useCallback(async () => {
    try {
      const ok = await probeMiniappReady()
      if (!ok) { setDetecting(false); return }

      const ctx = await getMiniappContext()
      if (!ctx?.user?.fid) { setDetecting(false); return }

      const userFid = ctx.user.fid
      setFid(userFid)

      const res = await fetch(`/api/farcaster/user?fid=${userFid}`)
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUsername(data.user.username || null)
          setPfpUrl(data.user.pfpUrl || null)
          const verifiedAddrs = data.user?.ethAddresses || []
          const custodyAddr = data.user?.custodyAddress
          const wallet = verifiedAddrs[0] || custodyAddr
          if (wallet) {
            setAddress(wallet)
            setAutoDetected(true)
          }
        }
      }
    } catch (err) {
      console.warn('[WalletInput] Detection failed:', err)
    } finally {
      setDetecting(false)
    }
  }, [])

  useEffect(() => { detectWallet() }, [detectWallet])

  const isValid = address.trim() === '' || /^0x[a-fA-F0-9]{40}$/.test(address.trim())
  const hasValue = address.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = address.trim()
    if (!trimmed) {
      setInputError('Please enter a wallet address')
      inputRef.current?.focus()
      return
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      setInputError('Invalid address format. Must be 0x followed by 40 hex characters.')
      inputRef.current?.focus()
      return
    }
    setInputError(null)
    onCheck(trimmed)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
    setAutoDetected(false)
    if (inputError) setInputError(null)
  }

  const handlePfpError = () => {
    if (pfpRef.current) {
      pfpRef.current.style.display = 'none'
    }
  }

  return (
    <section
      className="glass-card gradient-border p-4 sm:p-5 animate-fadeInUp stagger-2"
      aria-labelledby="wallet-input-heading"
    >
      <h2 id="wallet-input-heading" className="sr-only">
        Enter wallet address
      </h2>

      {/* Farcaster profile badge */}
      {fid && username && (
        <div
          className="mb-3.5 flex items-center gap-2.5 rounded-xl border border-blue-500/15 bg-blue-500/[0.06] px-3 py-2.5"
          role="status"
          aria-label={`Connected as @${username}`}
        >
          {pfpUrl ? (
            <img
              ref={pfpRef}
              src={pfpUrl}
              alt=""
              className="h-7 w-7 rounded-full ring-2 ring-blue-500/20 object-cover"
              onError={handlePfpError}
              loading="lazy"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20" aria-hidden="true">
              <User className="h-3.5 w-3.5 text-blue-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-semibold text-blue-200 truncate">
              @{username}
            </span>
            <span className="text-[10px] text-blue-400/50">FID: {fid}</span>
          </div>
          {autoDetected && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              Auto
            </span>
          )}
        </div>
      )}

      {/* Detecting spinner */}
      {detecting && (
        <div
          className="mb-3.5 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
          role="status"
          aria-label="Detecting Farcaster wallet"
        >
          <Radio className="h-4 w-4 animate-pulse text-blue-400" aria-hidden="true" />
          <span className="text-xs text-gray-400">Detecting Farcaster wallet...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="wallet-address"
          className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500"
        >
          Wallet Address
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Wallet
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id="wallet-address"
              type="text"
              value={address}
              onChange={handleChange}
              placeholder="0x..."
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              aria-describedby={`wallet-hint${inputError ? ' wallet-error' : ''}`}
              aria-invalid={inputError ? 'true' : 'false'}
              className={`w-full rounded-xl border bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:bg-white/[0.05] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                inputError
                  ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/10'
                  : 'border-white/[0.08] focus:border-[#0052FF]/40 focus:ring-[#0052FF]/10'
              }`}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || (hasValue && !/^0x[a-fA-F0-9]{40}$/.test(address.trim()))}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0052FF] to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0052FF]/20 transition-all hover:shadow-[#0052FF]/30 hover:brightness-110 active:scale-[0.97] disabled:opacity-40 disabled:shadow-none disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-[#0052FF] focus-visible:outline-offset-2"
            aria-label={isLoading ? 'Checking wallet...' : 'Check wallet allocation'}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Search className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{isLoading ? 'Checking...' : 'Check'}</span>
          </button>
        </div>

        {/* Error message */}
        {inputError && (
          <p
            id="wallet-error"
            className="mt-2 flex items-center gap-1.5 text-[11px] text-red-400"
            role="alert"
          >
            <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
            {inputError}
          </p>
        )}

        <p id="wallet-hint" className="mt-2 text-[10.5px] text-gray-600 leading-relaxed">
          Reads public Base activity only. Never connect a wallet or sign a transaction here.
        </p>
      </form>
    </section>
  )
}
