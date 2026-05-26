'use client'

import { Shield, Info } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="mt-10 border-t border-white/[0.04] pt-6 pb-8"
      role="contentinfo"
    >
      <div className="mx-auto max-w-sm space-y-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Shield className="h-3 w-3 shrink-0 text-gray-600" aria-hidden="true" />
          <p className="text-[10px] font-medium text-gray-600">
            This is an unofficial, hypothetical tool. Not affiliated with Base or Coinbase.
          </p>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Info className="h-3 w-3 shrink-0 text-gray-700" aria-hidden="true" />
          <p className="text-[10px] font-medium text-gray-700">
            No official BASE token or airdrop has been announced.
          </p>
        </div>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.02] px-2.5 py-1 text-[9px] font-medium text-gray-700">
            Data powered by Blockscout &amp; Neynar
          </span>
        </div>
      </div>
    </footer>
  )
}
