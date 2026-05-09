export interface AvatarConfig {
  skin: number
  hair: number
  hairColor: number
  eyes: number
  expression: number
  outfit: number
  accessory: number
}

export interface PlayerStats {
  wisdom: number
  courage: number
  charisma: number
  xp: number
  level: number
}

export interface UserProfile {
  name: string
  email: string
  charName: string
  avatar: AvatarConfig
  stats: PlayerStats
  createdAt: string
}

export interface Era {
  id: string
  name: string
  year: string
  region: string
  emoji: string
  description: string
  image: string
  period: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ChapterEntry {
  title: string
  timestamp: number
  preview: string
}

export interface GameState {
  profile: UserProfile | null
  currentEra: Era | null
  history: Message[]
  chapters: ChapterEntry[]
  stats: PlayerStats
}

export const DEFAULT_STATS: PlayerStats = {
  wisdom: 10,
  courage: 10,
  charisma: 10,
  xp: 0,
  level: 1,
}