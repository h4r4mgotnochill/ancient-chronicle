'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AvatarConfig, UserProfile } from '@/types'
import { loadState, saveProfile } from '@/lib/storage'
import AvatarCanvas from './AvatarCanvas'
import OptionPanel from './OptionPanel'
import SpellButton from '@/components/ui/SpellButton'
import ParchmentCard from '@/components/ui/ParchmentCard'

const SKIN_SWATCHES = [
  { color: '#f5c896', label: 'Ivory' },
  { color: '#d4956a', label: 'Tan' },
  { color: '#a86840', label: 'Brown' },
  { color: '#6e3d1e', label: 'Dark' },
  { color: '#3a1a08', label: 'Deep' },
]

const HAIR_SWATCHES = [
  { color: '#1a0a04', label: 'Raven' },
  { color: '#5c2e0a', label: 'Chestnut' },
  { color: '#c89020', label: 'Gold' },
  { color: '#880000', label: 'Auburn' },
  { color: '#d0d0d0', label: 'Silver' },
  { color: '#0a1840', label: 'Midnight' },
]

const HAIR_STYLES = ['Short', 'Long', 'Mohawk', 'Bun', 'Bald']
const EYE_STYLES = ['Round', 'Narrow', 'Star', 'Closed']
const EXPRESSIONS = ['Neutral', 'Smile', 'Stern', 'Smirk']
const OUTFITS = ['Dark Cloak', 'Royal Blue', 'Forest Green', 'Crimson', 'Gold Trim', 'Desert Sand']
const ACCESSORIES = ['None', 'Crown', 'Hood', 'Witch Hat', 'Halo']

export default function AvatarBuilder() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [charName, setCharName] = useState('')
  const [avatar, setAvatar] = useState<AvatarConfig>({
    skin: 0, hair: 0, hairColor: 0, eyes: 0, expression: 0, outfit: 0, accessory: 0,
  })

  useEffect(() => {
    const state = loadState()
    if (!state?.profile) {
      router.push('/')
      return
    }
    setProfile(state.profile)
    setCharName(state.profile.charName || state.profile.name)
    if (state.profile.avatar) setAvatar(state.profile.avatar)
  }, [router])

  const set = (key: keyof AvatarConfig) => (v: number) =>
    setAvatar((prev) => ({ ...prev, [key]: v }))

  const handleEnter = () => {
    if (!profile) return
    const updated: UserProfile = { ...profile, charName: charName.trim() || profile.name, avatar }
    saveProfile(updated)
    router.push('/game')
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl mx-auto">
      {/* Preview */}
      <ParchmentCard className="flex flex-col items-center gap-4 lg:w-72 shrink-0" glow>
        <h2 className="font-cinzel-decorative text-gold text-sm tracking-widest uppercase">Your Visage</h2>
        <div className="border-2 border-gold/30 p-3 bg-black/60">
          <AvatarCanvas config={avatar} size={192} />
        </div>
        <div className="w-full">
          <label className="block text-gold/60 text-xs font-cinzel tracking-widest uppercase mb-1.5">
            Character Name
          </label>
          <input
            type="text"
            value={charName}
            onChange={(e) => setCharName(e.target.value)}
            maxLength={32}
            placeholder="Name your character..."
            className="w-full bg-black/40 border border-gold/30 text-parchment font-fell placeholder:text-stone-600 px-3 py-2 focus:outline-none focus:border-gold/60 text-sm"
          />
        </div>
        <SpellButton size="lg" className="w-full" onClick={handleEnter}>
          Enter the Chronicle
        </SpellButton>
      </ParchmentCard>

      {/* Options */}
      <ParchmentCard className="flex-1 overflow-y-auto max-h-[70vh] lg:max-h-none">
        <h2 className="font-cinzel-decorative text-gold text-sm tracking-widest uppercase mb-6">
          Craft Your Form
        </h2>
        <OptionPanel label="Skin Tone" options={SKIN_SWATCHES} value={avatar.skin} onChange={set('skin')} type="swatch" />
        <OptionPanel label="Hair Style" options={HAIR_STYLES} value={avatar.hair} onChange={set('hair')} />
        <OptionPanel label="Hair Color" options={HAIR_SWATCHES} value={avatar.hairColor} onChange={set('hairColor')} type="swatch" />
        <OptionPanel label="Eyes" options={EYE_STYLES} value={avatar.eyes} onChange={set('eyes')} />
        <OptionPanel label="Expression" options={EXPRESSIONS} value={avatar.expression} onChange={set('expression')} />
        <OptionPanel label="Outfit" options={OUTFITS} value={avatar.outfit} onChange={set('outfit')} />
        <OptionPanel label="Accessory" options={ACCESSORIES} value={avatar.accessory} onChange={set('accessory')} />
      </ParchmentCard>
    </div>
  )
}
