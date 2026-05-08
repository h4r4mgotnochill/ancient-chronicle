'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { UserProfile, Era, Message, GameState } from '@/types'
import { loadState, saveState, clearState } from '@/lib/storage'
import { buildSystemPrompt } from '@/lib/systemPrompt'
import TopBar from '@/components/game/TopBar'
import EraRibbon from '@/components/game/EraRibbon'
import ChatPane from '@/components/game/ChatPane'
import InputZone from '@/components/game/InputZone'

const ParticleCanvas = dynamic(() => import('@/components/ui/ParticleCanvas'), { ssr: false })

export default function GamePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [era, setEra] = useState<Era | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const stateRef = useRef<GameState>({ profile: null, currentEra: null, history: [] })

  // Load persisted state on mount
  useEffect(() => {
    const state = loadState()
    if (!state?.profile) {
      router.push('/')
      return
    }
    setProfile(state.profile)
    setEra(state.currentEra)
    setMessages(state.history ?? [])
    stateRef.current = state
  }, [router])

  // Persist whenever state changes
  const persist = useCallback(
    (newMessages: Message[], newEra: Era | null) => {
      if (!profile) return
      const updated: GameState = {
        profile,
        currentEra: newEra,
        history: newMessages,
      }
      stateRef.current = updated
      saveState(updated)
    },
    [profile]
  )

  const sendToAPI = useCallback(
    async (userText: string, currentMessages: Message[], currentEra: Era) => {
      const userMsg: Message = { role: 'user', content: userText, timestamp: Date.now() }
      const updated = [...currentMessages, userMsg]
      setMessages(updated)
      setLoading(true)

      const system = buildSystemPrompt(
        currentEra.name,
        currentEra.year,
        currentEra.description,
        profile?.charName ?? 'Traveller'
      )

      const apiMessages = updated.map((m) => ({ role: m.role, content: m.content }))

      try {
        const res = await fetch('/api/chronicle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages, system }),
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.error ?? 'API error')

        const textBlock = (data.content as { type: string; text?: string }[]).find(
          (b) => b.type === 'text'
        )
        const assistantText = textBlock?.text ?? '(The Chronicler is silent...)'
        const assistantMsg: Message = {
          role: 'assistant',
          content: assistantText,
          timestamp: Date.now(),
        }

        const final = [...updated, assistantMsg]
        setMessages(final)
        persist(final, currentEra)
      } catch (err) {
        console.error(err)
        const errMsg: Message = {
          role: 'assistant',
          content: 'The Chronicle wavers... The Chronicler cannot be reached. Check your connection and try again.',
          timestamp: Date.now(),
        }
        const final = [...updated, errMsg]
        setMessages(final)
        persist(final, currentEra)
      } finally {
        setLoading(false)
      }
    },
    [profile, persist]
  )

  const handleSend = useCallback(
    (text: string) => {
      if (!era) return
      sendToAPI(text, messages, era)
    },
    [era, messages, sendToAPI]
  )

  const handleEraSelect = useCallback(
    (newEra: Era) => {
      if (newEra.id === era?.id) return
      setEra(newEra)
      setMessages([])
      persist([], newEra)
      // Auto-trigger the opening narration
      setTimeout(() => sendToAPI('begin', [], newEra), 100)
    },
    [era, persist, sendToAPI]
  )

  const handleStatus = () => {
    if (!era) return
    handleSend('status')
  }

  const handleMap = () => {
    if (!era) return
    handleSend('map')
  }

  const handleNewEra = () => {
    const ribbon = document.querySelector('[data-era-ribbon]') as HTMLElement
    ribbon?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogout = () => {
    clearState()
    router.push('/')
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gold/50 font-cinzel tracking-widest">
        Loading Chronicle...
      </div>
    )
  }

  return (
    <div className="relative flex flex-col h-screen bg-[#080604] overflow-hidden">
      <ParticleCanvas />

      <div className="relative z-10 flex flex-col h-full">
        <TopBar
          profile={profile}
          era={era}
          onStatus={handleStatus}
          onMap={handleMap}
          onNewEra={handleNewEra}
          onLogout={handleLogout}
        />

        <div data-era-ribbon>
          <EraRibbon current={era} onSelect={handleEraSelect} />
        </div>

        {/* Era intro banner */}
        {era && messages.length === 0 && !loading && (
          <div className="text-center py-6 px-4 border-b border-gold/10 bg-black/40">
            <div className="text-3xl mb-2">{era.emoji}</div>
            <h2 className="font-cinzel-decorative text-gold text-lg">{era.name}</h2>
            <p className="text-gold/50 font-fell text-sm italic mt-1">{era.year} · {era.region}</p>
            <p className="text-parchment/60 font-fell text-sm mt-2 max-w-md mx-auto">{era.description}</p>
          </div>
        )}

        <ChatPane messages={messages} loading={loading} />

        <InputZone onSend={handleSend} disabled={loading || !era} />
      </div>
    </div>
  )
}
