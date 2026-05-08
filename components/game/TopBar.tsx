'use client'

import { UserProfile, Era } from '@/types'
import AvatarCanvas from '@/components/avatar/AvatarCanvas'
import SpellButton from '@/components/ui/SpellButton'

interface TopBarProps {
  profile: UserProfile
  era: Era | null
  onStatus: () => void
  onMap: () => void
  onNewEra: () => void
  onLogout: () => void
}

export default function TopBar({ profile, era, onStatus, onMap, onNewEra, onLogout }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gold/20">
      <div className="flex items-center gap-3 px-4 py-2">
        {/* Avatar thumbnail */}
        <div className="border border-gold/30 shrink-0 bg-black">
          <AvatarCanvas config={profile.avatar} size={40} />
        </div>

        {/* Name + era */}
        <div className="flex-1 min-w-0">
          <p className="font-cinzel text-gold text-sm leading-tight truncate">{profile.charName}</p>
          {era && (
            <p className="text-gold/50 text-xs font-fell truncate">
              {era.emoji} {era.name} · {era.year}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 shrink-0">
          <SpellButton size="sm" variant="ghost" onClick={onStatus}>Status</SpellButton>
          <SpellButton size="sm" variant="ghost" onClick={onMap}>Map</SpellButton>
          <SpellButton size="sm" variant="ghost" onClick={onNewEra}>New Era</SpellButton>
          <SpellButton size="sm" variant="danger" onClick={onLogout}>Exit</SpellButton>
        </div>
      </div>
    </div>
  )
}
