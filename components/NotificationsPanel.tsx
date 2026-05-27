'use client'

import { useState } from 'react'
import { Bell, Award, Image, Sparkles, Zap, Share2, ChevronDown, ChevronUp } from 'lucide-react'

interface Notification {
  id: string
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  date: string
  isNew?: boolean
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 'nft-tracking',
    icon: <Award className="h-3.5 w-3.5 text-blue-400" />,
    iconBg: 'bg-blue-500/15',
    title: 'Official Base NFTs',
    description: 'Now tracking Beta Access & Base Builder NFT holdings with live holder counts.',
    date: 'May 26',
    isNew: true,
  },
  {
    id: 'og-frames',
    icon: <Image className="h-3.5 w-3.5 text-purple-400" />,
    iconBg: 'bg-purple-500/15',
    title: 'Rich Share Cards',
    description: 'Improved Farcaster frame previews with score, tier, and allocation data.',
    date: 'May 26',
    isNew: true,
  },
  {
    id: 'blockscout',
    icon: <Zap className="h-3.5 w-3.5 text-emerald-400" />,
    iconBg: 'bg-emerald-500/15',
    title: 'Free On-Chain Data',
    description: 'Switched to Blockscout — no API key needed, faster lookups.',
    date: 'May 25',
  },
  {
    id: 'tier-system',
    icon: <Sparkles className="h-3.5 w-3.5 text-amber-400" />,
    iconBg: 'bg-amber-500/15',
    title: 'Activity Tiers',
    description: 'New S through D tier rankings with flavor text for your wallet.',
    date: 'May 25',
  },
  {
    id: 'farcaster-share',
    icon: <Share2 className="h-3.5 w-3.5 text-cyan-400" />,
    iconBg: 'bg-cyan-500/15',
    title: 'Farcaster Sharing',
    description: 'Share results directly as a Farcaster cast with embedded frame.',
    date: 'May 24',
  },
]

export default function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const newCount = NOTIFICATIONS.filter(n => n.isNew).length

  return (
    <div className="animate-fadeIn">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-[#0052FF] focus-visible:outline-offset-2"
        aria-expanded={isOpen}
        aria-label={`What's new${newCount > 0 ? `, ${newCount} new updates` : ''}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#0052FF]/15">
            <Bell className="h-3.5 w-3.5 text-[#0052FF]" aria-hidden="true" />
            {newCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0052FF] text-[8px] font-bold text-white">
                {newCount}
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="text-[12px] font-semibold text-gray-200">What&apos;s New</p>
            <p className="text-[10px] text-gray-500">Latest updates & features</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
        )}
      </button>

      {/* Notification list */}
      {isOpen && (
        <div className="mt-1 space-y-1 animate-slideUp" role="list" aria-label="Feature updates">
          {NOTIFICATIONS.map((notification, i) => (
            <div
              key={notification.id}
              className={`glass-card-sm flex items-start gap-3 px-3.5 py-3 animate-fadeIn stagger-${i + 1}`}
              role="listitem"
            >
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${notification.iconBg}`}
                aria-hidden="true"
              >
                {notification.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-semibold text-gray-200">{notification.title}</p>
                  {notification.isNew && (
                    <span className="rounded-full bg-[#0052FF]/15 px-1.5 py-px text-[8px] font-bold uppercase tracking-wider text-[#0052FF]">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[10px] leading-relaxed text-gray-500">
                  {notification.description}
                </p>
                <p className="mt-1 text-[9px] text-gray-600">{notification.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
