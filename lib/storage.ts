import { GameState, UserProfile, Era, Message } from '@/types'

const STORAGE_KEY = 'ancient_chronicle_v1'

export function saveState(state: GameState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save state', e)
  }
}

export function loadState(): GameState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as GameState
  } catch (e) {
    console.error('Failed to load state', e)
    return null
  }
}

export function saveProfile(profile: UserProfile): void {
  const state = loadState() ?? { profile: null, currentEra: null, history: [] }
  saveState({ ...state, profile })
}

export function findProfileByEmail(email: string): UserProfile | null {
  const state = loadState()
  if (!state?.profile) return null
  return state.profile.email.toLowerCase() === email.toLowerCase() ? state.profile : null
}

export function saveEra(era: Era): void {
  const state = loadState() ?? { profile: null, currentEra: null, history: [] }
  saveState({ ...state, currentEra: era, history: [] })
}

export function appendMessage(msg: Message): void {
  const state = loadState() ?? { profile: null, currentEra: null, history: [] }
  const history = [...(state.history ?? []), msg]
  saveState({ ...state, history })
}

export function clearHistory(): void {
  const state = loadState() ?? { profile: null, currentEra: null, history: [] }
  saveState({ ...state, history: [] })
}

export function clearState(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
