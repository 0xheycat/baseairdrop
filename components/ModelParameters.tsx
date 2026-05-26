'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Sliders } from 'lucide-react'
import { PARAM_OPTIONS } from '@/lib/estimation'
import type { ModelParams } from '@/lib/estimation'

interface ModelParametersProps {
  params: ModelParams
  onChange: (params: ModelParams) => void
}

export default function ModelParameters({ params, onChange }: ModelParametersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleSelect = (key: keyof ModelParams, value: number) => {
    onChange({ ...params, [key]: value })
  }

  // Close panel on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div className="glass-card overflow-hidden animate-fadeIn" role="region" aria-label="Model parameters">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="model-params-panel"
        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-white/[0.03] active:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-[#0052FF] focus-visible:outline-offset-[-2px]"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10" aria-hidden="true">
            <Sliders className="h-3 w-3 text-purple-400" />
          </div>
          <span className="text-[12px] font-semibold text-gray-300">Model Parameters</span>
          <span className="rounded-full border border-purple-500/20 bg-purple-500/[0.06] px-2 py-px text-[9px] font-bold uppercase tracking-wider text-purple-400/80">
            Hypothetical
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        id="model-params-panel"
        ref={panelRef}
        role="region"
        aria-label="Parameter controls"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-white/[0.05] px-4 pb-4 pt-3.5">
          <div className="grid grid-cols-2 gap-3">
            <ParamSelect
              label="FDV Scenario"
              options={PARAM_OPTIONS.fdv}
              value={params.fdv}
              onChange={(v) => handleSelect('fdv', v)}
            />
            <ParamSelect
              label="Total Supply"
              options={PARAM_OPTIONS.supply}
              value={params.supply}
              onChange={(v) => handleSelect('supply', v)}
            />
            <ParamSelect
              label="Airdrop Pool"
              options={PARAM_OPTIONS.poolPercent}
              value={params.poolPercent}
              onChange={(v) => handleSelect('poolPercent', v)}
            />
            <ParamSelect
              label="Recipients"
              options={PARAM_OPTIONS.recipients}
              value={params.recipients}
              onChange={(v) => handleSelect('recipients', v)}
            />
          </div>
          <p className="mt-3 text-[9.5px] leading-relaxed text-gray-600">
            These parameters are hypothetical and for estimation purposes only. Adjust to model
            different airdrop scenarios.
          </p>
        </div>
      </div>
    </div>
  )
}

function ParamSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { label: string; value: number }[]
  value: number
  onChange: (v: number) => void
}) {
  const selectId = `param-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div>
      <label
        htmlFor={selectId}
        className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-600"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 pr-8 text-[11px] font-medium text-white outline-none transition-all focus:border-[#0052FF]/40 focus:ring-2 focus:ring-[#0052FF]/10 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0f0f1a] text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
