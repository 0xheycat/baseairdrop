'use client'

import { AlertTriangle, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="mb-6 animate-fadeIn" aria-labelledby="hero-heading">
      {/* Disclaimer */}
      <div
        className="glass-card-sm mb-5 border-amber-500/15 bg-amber-500/[0.04] p-3.5"
        role="note"
        aria-label="Disclaimer"
      >
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
            <AlertTriangle className="h-3 w-3 text-amber-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-amber-300/90">
              Unofficial Tool &mdash; Estimates Only
            </p>
            <p className="mt-0.5 text-[10.5px] leading-relaxed text-amber-200/50">
              No official BASE token or airdrop has been announced. This tool analyzes
              public on-chain activity to generate hypothetical estimates. Not financial advice.
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#0052FF]/20 bg-[#0052FF]/[0.08] px-3 py-1">
          <Zap className="h-3 w-3 text-[#0052FF]" aria-hidden="true" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0052FF]/90">
            Base L2 Analysis
          </span>
        </div>
        <h1
          id="hero-heading"
          className="text-gradient-blue text-[22px] font-extrabold tracking-tight sm:text-[26px]"
        >
          Base Allocation Estimator
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-gray-500">
          Analyze your on-chain Base activity and estimate a hypothetical airdrop allocation.
        </p>
      </div>
    </section>
  )
}
