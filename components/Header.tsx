'use client'

import { ExternalLink } from 'lucide-react'
import BaseLogo from './BaseLogo'

export default function Header() {
  return (
    <header
      role="banner"
      className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-2xl backdrop-saturate-150"
    >
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        {/* Logo + brand */}
        <a
          href="/"
          className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[#0052FF] focus-visible:outline-offset-2"
          aria-label="Base Checker - home"
        >
          <BaseLogo size={28} className="shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white">
              Base Checker
            </span>
            <span
              className="rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-amber-400/80"
              aria-label="Unofficial tool"
            >
              Unofficial
            </span>
          </div>
        </a>

        {/* Nav links */}
        <nav aria-label="External resources" className="flex items-center gap-0.5">
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-gray-500 transition-colors hover:bg-white/[0.05] hover:text-gray-300 focus-visible:outline-2 focus-visible:outline-[#0052FF]"
          >
            BaseScan
            <ExternalLink
              className="h-3 w-3 opacity-40 transition-opacity group-hover:opacity-70"
              aria-hidden="true"
            />
          </a>
          <a
            href="https://docs.base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-gray-500 transition-colors hover:bg-white/[0.05] hover:text-gray-300 focus-visible:outline-2 focus-visible:outline-[#0052FF]"
          >
            Docs
            <ExternalLink
              className="h-3 w-3 opacity-40 transition-opacity group-hover:opacity-70"
              aria-hidden="true"
            />
          </a>
        </nav>
      </div>
    </header>
  )
}
