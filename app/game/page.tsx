'use client'
import { saveGameProgress } from '@/lib/db'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { GameState, Era, Message, DEFAULT_STATS } from '@/types'
import { loadState, saveState } from '@/lib/storage'
import { buildSystemPrompt } from '@/lib/systemPrompt'
import EraSelector from '@/components/game/EraSelector'
import PlayerSidebar from '@/components/game/PlayerSidebar'
import GamePanel from '@/components/game/GamePanel'

type View = 'explore' | 'game'

export default function GamePage() {
  const router = useRouter()
  const [state, setState] = useState<GameState | null>(null)
  const [view, setView] = useState<View>('explore')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loaded = loadState()
    if (!loaded?.profile) { router.push('/'); return }
    if (!loaded.stats) loaded.stats = { ...DEFAULT_STATS }
    if (!loaded.chapters) loaded.chapters = []
    setState(loaded)
    if (loaded.currentEra && loaded.history?.length > 0) setView('game')
    setMounted(true)
  }, [router])

  const sendToAI = useCallback(async (currentState: GameState, userMsg: string) => {
    if (!currentState.profile || !currentState.currentEra || isLoading) return
    setIsLoading(true)

    const userMessage: Message = { role: 'user', content: userMsg, timestamp: Date.now() }
    const updatedHistory = [...(currentState.history || []), userMessage]
    setState({ ...currentState, history: updatedHistory })

    try {
      const system = buildSystemPrompt(
        currentState.currentEra.name,
        currentState.currentEra.year,
        currentState.currentEra.description,
        currentState.profile.charName
      )
      const res = await fetch('/api/chronicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedHistory.map(m => ({ role: m.role, content: m.content })), system }),
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'The Chronicler falls silent...'
      const assistantMessage: Message = { role: 'assistant', content: reply, timestamp: Date.now() }

      const newStats = { ...currentState.stats }
      const lower = reply.toLowerCase()
      if (lower.includes('wisdom') || lower.includes('knowledge')) newStats.wisdom = Math.min(100, newStats.wisdom + 2)
      if (lower.includes('courage') || lower.includes('brave') || lower.includes('fight')) newStats.courage = Math.min(100, newStats.courage + 2)
      if (lower.includes('persuade') || lower.includes('charm') || lower.includes('negotiate')) newStats.charisma = Math.min(100, newStats.charisma + 2)
      newStats.xp = (newStats.xp || 0) + 10
      newStats.level = Math.floor(newStats.xp / 100) + 1

      const aiCount = updatedHistory.filter(m => m.role === 'assistant').length + 1
      const newChapters = [...(currentState.chapters || [])]
      if (aiCount % 3 === 1 || newChapters.length === 0) {
        newChapters.unshift({ title: '', timestamp: Date.now(), preview: reply.slice(0, 80) })
      }

      const finalState: GameState = {
        ...currentState,
        history: [...updatedHistory, assistantMessage],
        stats: newStats,
        chapters: newChapters.slice(0, 8)
      }

      setState(finalState)
      saveState(finalState)

      if (finalState.profile?.email) {
        saveGameProgress(finalState.profile.email, finalState)
      }

    } catch (e) {
      const errMsg: Message = { role: 'assistant', content: 'The Chronicle wavers... Cannot reach the Chronicler.', timestamp: Date.now() }
      const errState = { ...currentState, history: [...updatedHistory, errMsg] }
      setState(errState)
      saveState(errState)
    }

    setIsLoading(false)
  }, [isLoading])

  const selectEra = useCallback(async (era: Era) => {
    if (!state?.profile) return
    const newState: GameState = { ...state, currentEra: era, history: [], chapters: [], stats: { ...DEFAULT_STATS } }
    setState(newState)
    saveState(newState)
    setView('game')
    await sendToAI(newState, `Begin. Introduce the world of ${era.name} (${era.year}) and ask me to choose my role.`)
  }, [state, sendToAI])

  const handleSend = useCallback((text: string) => {
    if (state) sendToAI(state, text)
  }, [state, sendToAI])

  if (!mounted || !state?.profile) return (
    <div className="min-h-screen bg-[#0a0806] flex items-center justify-center">
      <div className="font-cinzel text-[#c8922a] text-sm tracking-widest animate-pulse-gold">Opening the Chronicle...</div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#0a0806] overflow-hidden">
      {view === 'explore' ? (
        <EraSelector onSelect={selectEra} currentEra={state.currentEra} onBack={() => state.currentEra && setView('game')}/>
      ) : (
        <>
          <PlayerSidebar profile={state.profile} stats={state.stats || DEFAULT_STATS} chapters={state.chapters || []} currentEra={state.currentEra} onExplore={() => setView('explore')}/>
          {state.currentEra ? (
            <GamePanel era={state.currentEra} messages={state.history || []} isLoading={isLoading} onSend={handleSend} stats={state.stats || DEFAULT_STATS} charName={state.profile.charName}/>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <button onClick={() => setView('explore')} className="font-cinzel text-sm tracking-widest uppercase px-8 py-4 border border-[rgba(200,146,42,0.3)] text-[#c8922a] hover:border-[#e8b040] hover:text-[#e8b040] transition-colors">◈ Choose an Era</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}