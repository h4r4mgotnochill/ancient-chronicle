'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createOrGetUser, getUserByEmail, loadGameProgress } from '@/lib/db'
import { saveState, loadState } from '@/lib/storage'
import { DEFAULT_STATS } from '@/types'

export default function LoginForm() {
  const router = useRouter()
  const [tab, setTab] = useState<'new' | 'returning'>('new')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const handleNew = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Enter your name, traveller.')
    if (!validateEmail(email)) return setError('A valid email is required.')
    setLoading(true)

    try {
      const profile = await createOrGetUser(
        email.trim(),
        name.trim(),
        name.trim(),
        { skin: 0, hair: 0, hairColor: 0, eyes: 0, expression: 0, outfit: 0, accessory: 0 }
      )
      if (!profile) { setError('Something went wrong. Try again.'); setLoading(false); return }
      profile.stats = DEFAULT_STATS
      const state = loadState() ?? { profile: null, currentEra: null, history: [], chapters: [], stats: DEFAULT_STATS }
      saveState({ ...state, profile })
      router.push('/avatar')
    } catch (err) {
      setError('Connection error. Try again.')
    }
    setLoading(false)
  }

  const handleReturning = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validateEmail(email)) return setError('A valid email is required.')
    setLoading(true)

    try {
      const profile = await getUserByEmail(email.trim())
      if (!profile) { setError('No chronicle found for this soul. Begin anew?'); setLoading(false); return }

      // Load cloud progress
      const progress = await loadGameProgress(email.trim())
      const state = loadState() ?? { profile: null, currentEra: null, history: [], chapters: [], stats: DEFAULT_STATS }
      saveState({
        ...state,
        profile,
        history: progress?.history || [],
        chapters: progress?.chapters || [],
        stats: progress?.stats || DEFAULT_STATS,
      })
      router.push('/game')
    } catch (err) {
      setError('Connection error. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md bg-[rgba(20,15,8,0.97)] border border-[rgba(240,192,80,0.25)] p-8 rounded-sm">
      {/* Tabs */}
      <div className="flex border-b border-[rgba(240,192,80,0.15)] mb-6">
        {(['new', 'returning'] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setError('') }}
            className={`flex-1 py-2 text-xs font-cinzel tracking-widest uppercase transition-colors ${
              tab === t ? 'text-[#f0c050] border-b-2 border-[#f0c050]' : 'text-[rgba(248,240,216,0.35)] hover:text-[rgba(248,240,216,0.6)]'
            }`}>
            {t === 'new' ? 'New Soul' : 'Returning Wanderer'}
          </button>
        ))}
      </div>

      {tab === 'new' ? (
        <form onSubmit={handleNew} className="space-y-4">
          <div>
            <label className="block text-[rgba(240,192,80,0.6)] text-xs font-cinzel tracking-widest uppercase mb-1.5">Your Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Enter your name..." maxLength={40}
              className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(240,192,80,0.25)] text-[#f8f0d8] placeholder-[rgba(248,240,216,0.2)] px-3 py-2.5 focus:outline-none focus:border-[rgba(240,192,80,0.6)] transition-colors text-sm font-garamond"/>
          </div>
          <div>
            <label className="block text-[rgba(240,192,80,0.6)] text-xs font-cinzel tracking-widest uppercase mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(240,192,80,0.25)] text-[#f8f0d8] placeholder-[rgba(248,240,216,0.2)] px-3 py-2.5 focus:outline-none focus:border-[rgba(240,192,80,0.6)] transition-colors text-sm font-garamond"/>
          </div>
          {error && <p className="text-red-400 text-xs font-garamond italic">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[rgba(20,15,8,0.9)] border border-[rgba(240,192,80,0.35)] border-b-2 border-b-[#f0c050] text-[#f0c050] font-cinzel text-xs tracking-widest uppercase py-3 hover:bg-[rgba(240,192,80,0.08)] transition-all disabled:opacity-50">
            {loading ? 'Opening the Chronicle...' : '✦ Begin Your Chronicle'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReturning} className="space-y-4">
          <div>
            <label className="block text-[rgba(240,192,80,0.6)] text-xs font-cinzel tracking-widest uppercase mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(240,192,80,0.25)] text-[#f8f0d8] placeholder-[rgba(248,240,216,0.2)] px-3 py-2.5 focus:outline-none focus:border-[rgba(240,192,80,0.6)] transition-colors text-sm font-garamond"/>
          </div>
          {error && <p className="text-red-400 text-xs font-garamond italic">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[rgba(20,15,8,0.9)] border border-[rgba(240,192,80,0.35)] border-b-2 border-b-[#f0c050] text-[#f0c050] font-cinzel text-xs tracking-widest uppercase py-3 hover:bg-[rgba(240,192,80,0.08)] transition-all disabled:opacity-50">
            {loading ? 'Searching the Archives...' : '✦ Resume Chronicle'}
          </button>
        </form>
      )}
    </div>
  )
}