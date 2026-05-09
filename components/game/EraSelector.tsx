'use client'
import { Era } from '@/types'
import { ERAS } from '@/lib/eras'
import { useState } from 'react'

interface Props {
  onSelect: (era: Era) => void
  currentEra: Era | null
  onBack: () => void
}

export default function EraSelector({ onSelect, currentEra, onBack }: Props) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? ERAS.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.period.toLowerCase().includes(search.toLowerCase()) ||
        e.region.toLowerCase().includes(search.toLowerCase()) ||
        e.year.toLowerCase().includes(search.toLowerCase())
      )
    : ERAS

  return (
    <div className="min-h-screen bg-[#0a0806] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[rgba(10,8,6,0.97)] border-b border-[rgba(200,146,42,0.12)] px-6 md:px-10 py-5">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 border border-[rgba(200,146,42,0.3)] flex items-center justify-center text-[#c8922a] hover:border-[#e8b040] hover:text-[#e8b040] transition-colors font-cinzel text-sm flex-shrink-0"
          >←</button>
          <div>
            <h1 className="font-cinzel-deco text-xl md:text-2xl text-[#e8b040]" style={{textShadow:'0 0 30px rgba(200,146,42,0.3)'}}>
              Explore Eras
            </h1>
            <p className="font-garamond text-xs text-[rgba(240,228,192,0.35)] mt-0.5">
              {filtered.length} eras await your legend
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8922a] text-sm">◈</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, region, time period... (e.g. 'samurai', 'Africa', '1200 BCE')"
            className="w-full bg-[rgba(20,16,10,0.8)] border border-[rgba(200,146,42,0.2)] focus:border-[#c8922a] outline-none pl-8 pr-8 py-2.5 font-garamond text-sm text-[#f0e4c0] placeholder-[rgba(240,228,192,0.2)] transition-colors rounded-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(200,146,42,0.4)] hover:text-[#e8b040] transition-colors text-xs">✕</button>
          )}
        </div>
      </div>

      {/* Era grid */}
      <div className="px-6 md:px-10 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="font-cinzel-deco text-[#c8922a] text-2xl mb-3">✦</div>
            <p className="font-garamond italic text-[rgba(240,228,192,0.3)]">No eras found for "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((era, i) => (
              <div
                key={era.id}
                onClick={() => onSelect(era)}
                style={{animation:`fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) ${Math.min(i,12)*0.04}s forwards`, opacity:0}}
                className={`group cursor-pointer border rounded-sm p-4 transition-all duration-250 hover:border-[rgba(200,146,42,0.5)] hover:bg-[rgba(200,146,42,0.06)] ${
                  currentEra?.id === era.id
                    ? 'border-[#e8b040] bg-[rgba(200,146,42,0.1)]'
                    : 'border-[rgba(200,146,42,0.15)] bg-[rgba(15,12,8,0.6)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Emoji + selected dot */}
                  <div className="flex-shrink-0 w-9 h-9 border border-[rgba(200,146,42,0.2)] flex items-center justify-center text-base group-hover:border-[rgba(200,146,42,0.4)] transition-colors">
                    {era.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-cinzel text-[11px] md:text-xs tracking-wider text-[#f0e4c0] group-hover:text-[#e8b040] transition-colors leading-tight">
                        {era.name}
                      </h3>
                      {currentEra?.id === era.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#e8b040] flex-shrink-0" />
                      )}
                    </div>
                    <div className="font-cinzel text-[9px] tracking-widest text-[rgba(200,146,42,0.5)] mt-0.5">
                      {era.period}
                    </div>
                    <p className="font-garamond text-xs text-[rgba(240,228,192,0.45)] mt-1.5 leading-snug line-clamp-1">
                      {era.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}