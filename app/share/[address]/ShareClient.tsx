'use client'

import { useState, useCallback } from 'react'
import ResultsDashboard from '@/components/ResultsDashboard'
import ModelParameters from '@/components/ModelParameters'
import ShareButton from '@/components/ShareButton'
import Footer from '@/components/Footer'
import { DEFAULT_PARAMS, computeAllocation } from '@/lib/estimation'
import type { ModelParams, AllocationResult } from '@/lib/estimation'
import type { ActivityScore } from '@/lib/scoring'
import type { WalletMetrics } from '@/lib/blockscout'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ShareClientProps {
  address: string
  initialScore: ActivityScore
  initialMetrics: WalletMetrics
  initialAllocation: AllocationResult
}

export default function ShareClient({
  address,
  initialScore,
  initialMetrics,
  initialAllocation,
}: ShareClientProps) {
  const [params, setParams] = useState<ModelParams>(DEFAULT_PARAMS)
  const [allocation, setAllocation] = useState(initialAllocation)

  const handleParamsChange = useCallback((newParams: ModelParams) => {
    setParams(newParams)
    setAllocation(computeAllocation(initialScore.overall, newParams))
  }, [initialScore])

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="group inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[11px] font-medium text-gray-500 transition-all hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-gray-300 focus-visible:outline-2 focus-visible:outline-[#0052FF] focus-visible:outline-offset-2"
        aria-label="Go back to the main checker"
      >
        <ArrowLeft
          className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back to Checker
      </Link>

      <ResultsDashboard
        address={address}
        score={initialScore}
        metrics={initialMetrics}
        allocation={allocation}
        params={params}
      />

      <ModelParameters params={params} onChange={handleParamsChange} />

      <ShareButton
        address={address}
        score={initialScore}
        allocation={allocation}
      />

      <Footer />
    </div>
  )
}
