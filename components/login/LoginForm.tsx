'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { findProfileByEmail, saveProfile } from '@/lib/storage'
import { UserProfile, AvatarConfig } from '@/types'
import SpellButton from '@/components/ui/SpellButton'
import ParchmentCard from '@/components/ui/ParchmentCard'

const DEFAULT_AVATAR: AvatarConfig = {
  skin: 0,
  hair: 0,
  hairColor: 0,
  eyes: 0,
  expression: 0,
  outfit: 0,
  accessory: 0,
}

export default function LoginForm() {
  const router = useRouter()
  const [tab, setTab] = useState<'new' | 'returning'>('new')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const handleNew = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Enter your name, traveller.')
    if (!validateEmail(email)) return setError('A valid email is required.')

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      charName: name.trim(),
      avatar: DEFAULT_AVATAR,
stats: { wisdom: 10, courage: 10, charisma: 10, xp: 0, level: 1 },
      createdAt: new Date().toISOString(),
    }
    saveProfile(profile)
    router.push('/avatar')
  }

  const handleReturning = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (!validateEmail(email)) {
      setLoading(false)
      return setError('A valid email is required.')
    }
    const found = findProfileByEmail(email.trim().toLowerCase())
    setLoading(false)
    if (!found) return setError('No chronicle found for this soul. Begin anew?')
    router.push('/game')
  }

  return (
    <ParchmentCard className="w-full max-w-md" glow>
      {/* Tabs */}
      <div className="flex border-b border-gold/20 mb-6 -mt-2">
        {(['new', 'returning'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError('') }}
            className={`flex-1 py-2 text-xs font-cinzel tracking-widest uppercase transition-colors ${
              tab === t ? 'text-gold border-b-2 border-gold' : 'text-gold/40 hover:text-gold/60'
            }`}
          >
            {t === 'new' ? 'New Soul' : 'Returning Wanderer'}
          </button>
        ))}
      </div>

      {tab === 'new' ? (
        <form onSubmit={handleNew} className="space-y-4">
          <div>
            <label className="block text-gold/60 text-xs font-cinzel tracking-widest uppercase mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={40}
              className="w-full bg-black/40 border border-gold/30 text-parchment font-fell placeholder:text-stone-600 px-3 py-2.5 focus:outline-none focus:border-gold/60 transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-gold/60 text-xs font-cinzel tracking-widest uppercase mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-black/40 border border-gold/30 text-parchment font-fell placeholder:text-stone-600 px-3 py-2.5 focus:outline-none focus:border-gold/60 transition-colors text-sm"
            />
          </div>
          {error && (
            <p className="text-crimson text-xs font-fell italic">{error}</p>
          )}
          <SpellButton type="submit" size="lg" className="w-full mt-2">
            Begin Your Chronicle
          </SpellButton>
        </form>
      ) : (
        <form onSubmit={handleReturning} className="space-y-4">
          <div>
            <label className="block text-gold/60 text-xs font-cinzel tracking-widest uppercase mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-black/40 border border-gold/30 text-parchment font-fell placeholder:text-stone-600 px-3 py-2.5 focus:outline-none focus:border-gold/60 transition-colors text-sm"
            />
          </div>
          {error && (
            <p className="text-crimson text-xs font-fell italic">{error}</p>
          )}
          <SpellButton type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? 'Searching the Archives...' : 'Resume Chronicle'}
          </SpellButton>
        </form>
      )}
    </ParchmentCard>
  )
}
