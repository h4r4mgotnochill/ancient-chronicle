'use client'

import { Era } from '@/types'
import { ERAS } from '@/lib/eras'

interface EraRibbonProps {
  current: Era | null
  onSelect: (era: Era) => void
}

export default function EraRibbon({ current, onSelect }: EraRibbonProps) {
  return (
    <div className="sticky top-[56px] z-30 bg-black/70 backdrop-blur-sm border-b border-gold/10">
      <div
        className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {ERAS.map((era) => (
          <button
            key={era.id}
            onClick={() => onSelect(era)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel tracking-wide border transition-all whitespace-nowrap ${
              current?.id === era.id
                ? 'border-gold bg-gold/15 text-gold shadow-[0_0_12px_rgba(200,152,40,0.3)]'
                : 'border-gold/15 text-gold/40 hover:border-gold/40 hover:text-gold/70 hover:bg-gold/5'
            }`}
          >
            <span>{era.emoji}</span>
            <span>{era.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
