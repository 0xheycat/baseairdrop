'use client'

import { useEffect, useRef, useState } from 'react'
import { getScoreColor, getScoreLabel } from '@/lib/scoring'

interface ScoreRingProps {
  score: number
  size?: number
}

export default function ScoreRing({ score, size = 150 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const rafRef = useRef<number | null>(null)
  const color = getScoreColor(score)
  const label = getScoreLabel(score)
  const strokeWidth = 10
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  useEffect(() => {
    const duration = 1200
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setAnimatedScore(Math.round(score * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [score])

  const offset = circumference - (animatedScore / 100) * circumference
  const gradientId = `score-gradient-${score}`
  const glowId = `score-glow-${score}`

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="score-ring"
        style={{ width: size, height: size }}
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Activity score: ${score} out of 100`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.5" />
            </linearGradient>
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={strokeWidth}
          />

          {/* Subtle tick marks for visual depth */}
          {[0, 25, 50, 75].map((tick) => {
            const tickAngle = (tick / 100) * 2 * Math.PI - Math.PI / 2
            const x1 = center + (radius - strokeWidth) * Math.cos(tickAngle)
            const y1 = center + (radius - strokeWidth) * Math.sin(tickAngle)
            const x2 = center + (radius + strokeWidth / 2) * Math.cos(tickAngle)
            const y2 = center + (radius + strokeWidth / 2) * Math.sin(tickAngle)
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            )
          })}

          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={`url(#${glowId})`}
            style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[36px] font-extrabold leading-none tabular-nums"
            style={{ color }}
          >
            {animatedScore}
          </span>
          <span className="mt-0.5 text-[10px] font-medium text-gray-600">
            / 100
          </span>
        </div>
      </div>

      <span
        className="rounded-full px-3 py-1 text-[11px] font-semibold"
        style={{
          color,
          backgroundColor: `${color}15`,
        }}
      >
        {label}
      </span>
    </div>
  )
}
