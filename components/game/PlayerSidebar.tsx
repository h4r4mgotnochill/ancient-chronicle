'use client'
import { UserProfile, PlayerStats, ChapterEntry, Era } from '@/types'

interface Props {
  profile: UserProfile
  stats: PlayerStats
  chapters: ChapterEntry[]
  currentEra: Era | null
  onExplore: () => void
}

export default function PlayerSidebar({ profile, stats, chapters, currentEra, onExplore }: Props) {
  const xpToNext = 100
  const xpPercent = Math.min((stats.xp % xpToNext) / xpToNext * 100, 100)

  return (
    <aside className="w-60 flex-shrink-0 border-r border-[rgba(200,146,42,0.15)] flex flex-col bg-[rgba(10,8,6,0.95)] overflow-y-auto">
      <div className="p-5 border-b border-[rgba(200,146,42,0.12)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-[rgba(200,146,42,0.3)] flex items-center justify-center text-base flex-shrink-0">{currentEra ? currentEra.emoji : '◈'}</div>
          <div>
            <div className="font-cinzel text-[11px] tracking-wider text-[#e8b040] leading-tight">{currentEra ? currentEra.name : 'No Era Selected'}</div>
            <div className="font-garamond text-[10px] text-[rgba(200,146,42,0.5)] mt-0.5">{currentEra ? currentEra.period : 'Choose an era to begin'}</div>
          </div>
        </div>
      </div>

      <div className="p-5 border-b border-[rgba(200,146,42,0.12)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-sm border border-[rgba(200,146,42,0.3)] bg-[rgba(200,146,42,0.08)] flex items-center justify-center font-cinzel-deco text-[#c8922a] text-sm">
            {profile.charName[0].toUpperCase()}
          </div>
          <div>
            <div className="font-cinzel text-[11px] tracking-wider text-[#f0e4c0]">{profile.charName}</div>
            <div className="font-garamond text-[10px] text-[rgba(200,146,42,0.5)]">Level {stats.level} · Traveller</div>
          </div>
        </div>

        <div className="mb-1 flex justify-between">
          <span className="font-cinzel text-[9px] tracking-widest text-[rgba(200,146,42,0.4)] uppercase">XP</span>
          <span className="font-cinzel text-[9px] text-[rgba(200,146,42,0.4)]">{stats.xp % xpToNext}/{xpToNext}</span>
        </div>
        <div className="stat-bar mb-4">
          <div className="xp-shimmer stat-bar-fill" style={{width:`${xpPercent}%`}}/>
        </div>

        {[
          { key:'wisdom', label:'Wisdom', color:'#4a90d9', icon:'◈' },
          { key:'courage', label:'Courage', color:'#c84040', icon:'⚔' },
          { key:'charisma', label:'Charisma', color:'#8040c8', icon:'✦' },
        ].map((stat) => (
          <div key={stat.key} className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]" style={{color:stat.color}}>{stat.icon}</span>
                <span className="font-cinzel text-[9px] tracking-widest uppercase" style={{color:'rgba(240,228,192,0.5)'}}>{stat.label}</span>
              </div>
              <span className="font-cinzel text-[9px]" style={{color:stat.color}}>{stats[stat.key as keyof PlayerStats]}</span>
            </div>
            <div className="stat-bar">
              <div className="stat-bar-fill" style={{width:`${stats[stat.key as keyof PlayerStats]}%`, background:stat.color, boxShadow:`0 0 6px ${stat.color}40`}}/>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 flex-1">
        <div className="font-cinzel text-[9px] tracking-[0.25em] uppercase text-[rgba(200,146,42,0.4)] mb-4">Journey Log</div>
        {chapters.length === 0 ? (
          <div className="font-garamond text-xs text-[rgba(240,228,192,0.25)] italic">Your chronicle is yet unwritten...</div>
        ) : (
          <div className="flex flex-col gap-2">
            {chapters.map((ch, i) => (
              <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-sm border transition-colors ${i === 0 ? 'border-[rgba(200,146,42,0.3)] bg-[rgba(200,146,42,0.08)]' : 'border-transparent opacity-40'}`}>
                <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#c8922a]' : 'bg-[rgba(200,146,42,0.3)]'}`}/>
                </div>
                <div>
                  <div className="font-cinzel text-[9px] tracking-wider text-[rgba(200,146,42,0.7)] uppercase">Chapter {chapters.length - i}</div>
                  <div className="font-garamond text-[11px] text-[rgba(240,228,192,0.6)] mt-0.5 leading-tight">{ch.preview.slice(0, 45)}...</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 border-t border-[rgba(200,146,42,0.12)]">
        <button onClick={onExplore} className="w-full font-cinzel text-[9px] tracking-[0.2em] uppercase py-2.5 border border-[rgba(139,26,26,0.4)] text-[rgba(200,100,100,0.6)] hover:border-[#8b1a1a] hover:text-[#c04040] transition-colors">
          ← Exit Era
        </button>
      </div>
    </aside>
  )
}