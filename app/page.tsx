'use client'

import { useState, useCallback } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import WalletInput from '@/components/WalletInput'
import ResultsDashboard from '@/components/ResultsDashboard'
import ModelParameters from '@/components/ModelParameters'
import ShareButton from '@/components/ShareButton'
import Footer from '@/components/Footer'
import { DEFAULT_PARAMS, computeAllocation } from '@/lib/estimation'
import type { ModelParams } from '@/lib/estimation'
import type { ActivityScore } from '@/lib/scoring'
import type { WalletMetrics } from '@/lib/blockscout'
import type { AllocationResult } from '@/lib/estimation'

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-fadeIn" role="status" aria-label="Loading results">
      <span className="sr-only">Analyzing wallet, please wait...</span>
      {/* Score ring skeleton */}
      <div className="glass-card flex flex-col items-center py-6 px-4">
        <div className="skeleton h-3 w-24 mb-4" />
        <div className="skeleton h-[150px] w-[150px] rounded-full" />
        <div className="skeleton h-5 w-16 mt-3" />
      </div>
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass-card-sm p-3.5">
            <div className="skeleton h-3 w-16 mb-3" />
            <div className="skeleton h-6 w-24" />
          </div>
        ))}
      </div>
      {/* Metric bars skeleton */}
      <div className="glass-card p-4">
        <div className="skeleton h-3 w-28 mb-4" />
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="skeleton h-3 w-20 mb-2" />
              <div className="skeleton h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [score, setScore] = useState<ActivityScore | null>(null)
  const [metrics, setMetrics] = useState<WalletMetrics | null>(null)
  const [allocation, setAllocation] = useState<AllocationResult | null>(null)
  const [params, setParams] = useState<ModelParams>(DEFAULT_PARAMS)

  const handleCheck = useCallback(async (addr: string) => {
    setIsLoading(true)
    setError(null)
    setAddress(addr)
    setScore(null)
    setMetrics(null)
    setAllocation(null)

    try {
      const res = await fetch('/api/check-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to check wallet')
      }

      const data = await res.json()
      setScore(data.score)
      setMetrics(data.metrics)
      setAllocation(computeAllocation(data.score.overall, params))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [params])

  const handleParamsChange = useCallback((newParams: ModelParams) => {
    setParams(newParams)
    if (score) {
      setAllocation(computeAllocation(score.overall, newParams))
    }
  }, [score])

  const handleRetry = useCallback(() => {
    if (address) handleCheck(address)
  }, [address, handleCheck])

  return (
    <div className="min-h-screen">
      <Header />
      <main
        id="main-content"
        className="mx-auto max-w-lg px-4 pb-10 pt-[72px]"
        role="main"
        aria-label="Base allocation checker"
      >
        <Hero />

        <WalletInput onCheck={handleCheck} isLoading={isLoading} />

        {/* Loading state */}
        {isLoading && (
          <div className="mt-4">
            <LoadingSkeleton />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="mt-4 animate-fadeIn">
            <div
              role="alert"
              className="glass-card border-red-500/20 bg-red-500/[0.06] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15">
                  <AlertCircle className="h-3 w-3 text-red-400" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-red-300">
                    Unable to check wallet
                  </p>
                  <p className="mt-0.5 text-[11px] text-red-300/60 break-words">
                    {error}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                className="mt-3 flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-1.5 text-[11px] font-medium text-red-300 transition-colors hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-2"
              >
                <RefreshCw className="h-3 w-3" aria-hidden="true" />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && score && metrics && allocation && address && (
          <div className="mt-4 space-y-3">
            <ResultsDashboard
              address={address}
              score={score}
              metrics={metrics}
              allocation={allocation}
              params={params}
            />
            <ModelParameters params={params} onChange={handleParamsChange} />
            <ShareButton
              address={address}
              score={score.overall}
              allocation={allocation}
            />
          </div>
        )}

        <Footer />
      </main>
    </div>
  )
}
