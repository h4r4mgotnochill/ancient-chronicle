export interface AvatarConfig {
  skin: number
  hair: number
  hairColor: number
  eyes: number
  expression: number
  outfit: number
  accessory: number
}

export interface UserProfile {
  name: string
  email: string
  charName: string
  avatar: AvatarConfig
  createdAt: string
}

export interface Era {
  id: string
  name: string
  year: string
  region: string
  emoji: string
  description: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface GameState {
  profile: UserProfile | null
  currentEra: Era | null
  history: Message[]
}
