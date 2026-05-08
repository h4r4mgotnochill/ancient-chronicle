'use client'

import { ReactNode } from 'react'

interface ParchmentCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export default function ParchmentCard({ children, className = '', glow }: ParchmentCardProps) {
  return (
    <div
      className={`relative bg-gradient-to-b from-stone-950 to-black border border-gold/40 rounded-sm p-6 ${glow ? 'shadow-[0_0_32px_rgba(200,152,40,0.18)]' : ''} ${className}`}
    >
      {/* Corner ornaments */}
      <span className="absolute top-1.5 left-2 text-gold/50 text-xs leading-none select-none">✦</span>
      <span className="absolute top-1.5 right-2 text-gold/50 text-xs leading-none select-none">✦</span>
      <span className="absolute bottom-1.5 left-2 text-gold/50 text-xs leading-none select-none">✦</span>
      <span className="absolute bottom-1.5 right-2 text-gold/50 text-xs leading-none select-none">✦</span>
      {/* Inner gold glow line */}
      <div className="absolute inset-[2px] rounded-sm border border-gold/10 pointer-events-none" />
      {children}
    </div>
  )
}
