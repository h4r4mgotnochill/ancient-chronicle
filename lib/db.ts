import { supabase } from './supabase'
import { UserProfile, GameState, DEFAULT_STATS } from '@/types'

export async function createOrGetUser(email: string, name: string, charName: string, avatar: object): Promise<UserProfile | null> {
  // Check if user exists
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (existing) {
    return {
      name: existing.name,
      email: existing.email,
      charName: existing.char_name,
      avatar: existing.avatar,
      stats: DEFAULT_STATS,
      createdAt: existing.created_at,
    }
  }

  // Create new user
  const { data, error } = await supabase
    .from('users')
    .insert({ email: email.toLowerCase(), name, char_name: charName, avatar })
    .select()
    .single()

  if (error || !data) return null

  return {
    name: data.name,
    email: data.email,
    charName: data.char_name,
    avatar: data.avatar,
    stats: DEFAULT_STATS,
    createdAt: data.created_at,
  }
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !data) return null

  // Get their save too
  const { data: save } = await supabase
    .from('game_saves')
    .select('*')
    .eq('user_id', data.id)
    .single()

  return {
    name: data.name,
    email: data.email,
    charName: data.char_name,
    avatar: data.avatar,
    stats: save?.stats || DEFAULT_STATS,
    createdAt: data.created_at,
  }
}

export async function saveGameProgress(email: string, state: GameState): Promise<void> {
  // Get user id
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (!user) return

  // Upsert game save
  await supabase
    .from('game_saves')
    .upsert({
      user_id: user.id,
      era_id: state.currentEra?.id || null,
      era_name: state.currentEra?.name || null,
      history: state.history || [],
      chapters: state.chapters || [],
      stats: state.stats || DEFAULT_STATS,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
}

export async function loadGameProgress(email: string): Promise<Partial<GameState> | null> {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (!user) return null

  const { data: save } = await supabase
    .from('game_saves')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!save) return null

  return {
    history: save.history || [],
    chapters: save.chapters || [],
    stats: save.stats || DEFAULT_STATS,
  }
}