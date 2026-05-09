'use client'
import { useEffect, useRef, useState } from 'react'
import { Message, Era, PlayerStats } from '@/types'

interface Props {
  era: Era
  messages: Message[]
  isLoading: boolean
  onSend: (text: string) => void
  stats: PlayerStats
  charName: string
}

const QUICK_ACTIONS = [
  { icon:'👁', label:'Look around' },
  { icon:'🗣', label:'Talk to someone' },
  { icon:'🎒', label:'Inventory' },
  { icon:'⚠', label:'Dangers' },
  { icon:'📜', label:'Find quest' },
  { icon:'ℹ', label:'Status' },
]

function fmt(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#e8b040]">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-[#c8922a]">$1</em>')
    .replace(/\(([^)]+)\)/g, '<span class="font-cinzel text-[10px] tracking-wider text-[#c8922a] opacity-70">($1)</span>')
    .replace(/\n/g, '<br/>')
}

export default function GamePanel({ era, messages, isLoading, onSend, charName }: Props) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isLoading])

  function send(text?: string) {
    const msg = (text || input).trim()
    if (!msg || isLoading) return
    setInput('')
    onSend(msg)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  function grow(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  const chapterNum = Math.max(1, Math.ceil(messages.filter(m => m.role === 'assistant').length / 3))

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Era hero */}
      <div className="relative h-36 md:h-48 flex-shrink-0 overflow-hidden">
        <img src={era.image} alt={era.name} className="w-full h-full object-cover object-center"/>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,8,6,0.3)] to-[#0a0806]"/>
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,8,6,0.6)] to-transparent"/>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => onSend('map')} className="font-cinzel text-[9px] tracking-widest uppercase px-3 py-1.5 border border-[rgba(200,146,42,0.3)] text-[rgba(200,146,42,0.7)] hover:border-[#e8b040] hover:text-[#e8b040] transition-colors bg-[rgba(10,8,6,0.7)]">◉ Map</button>
          <button onClick={() => onSend('status')} className="font-cinzel text-[9px] tracking-widest uppercase px-3 py-1.5 border border-[rgba(200,146,42,0.3)] text-[rgba(200,146,42,0.7)] hover:border-[#e8b040] hover:text-[#e8b040] transition-colors bg-[rgba(10,8,6,0.7)]">✦ Status</button>
        </div>
        <div className="absolute bottom-4 left-6">
          <div className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#c8922a] mb-1">Chapter {chapterNum}</div>
          <h2 className="font-cinzel-deco text-xl md:text-2xl text-[#f0e4c0]" style={{textShadow:'0 2px 20px rgba(0,0,0,0.8)'}}>{era.name}</h2>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-8 py-6 flex flex-col gap-6">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <div className="font-cinzel-deco text-[#c8922a] text-2xl mb-3 animate-pulse-gold">✦</div>
            <p className="font-garamond italic text-[rgba(240,228,192,0.3)] text-sm">The Chronicle opens...</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'assistant' ? 'msg-narr' : 'msg-player'}>
            {msg.role === 'assistant' ? (
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-px bg-[rgba(200,146,42,0.4)]"/>
                  <span className="font-cinzel text-[9px] tracking-[0.25em] uppercase text-[rgba(200,146,42,0.5)]">The Chronicler</span>
                  <div className="flex-1 h-px bg-[rgba(200,146,42,0.1)]"/>
                </div>
                <div className="border-l-2 border-[rgba(200,146,42,0.35)] pl-5 py-1">
                  <p className="font-garamond text-base md:text-lg text-[rgba(240,228,192,0.85)] leading-relaxed"
                    dangerouslySetInnerHTML={{__html: fmt(msg.content)}}/>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="max-w-md">
                  <div className="flex items-center justify-end gap-2 mb-2">
                    <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-[rgba(200,146,42,0.4)]">{charName}</span>
                    <div className="w-5 h-px bg-[rgba(200,146,42,0.3)]"/>
                  </div>
                  <div className="border-r-2 border-[rgba(139,26,26,0.5)] pr-4 py-1 text-right">
                    <p className="font-garamond italic text-sm text-[rgba(240,228,192,0.55)] leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="msg-narr max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-px bg-[rgba(200,146,42,0.4)]"/>
              <span className="font-cinzel text-[9px] tracking-[0.25em] uppercase text-[rgba(200,146,42,0.5)]">The Chronicler</span>
              <div className="flex-1 h-px bg-[rgba(200,146,42,0.1)]"/>
            </div>
            <div className="border-l-2 border-[rgba(200,146,42,0.35)] pl-5 py-1 flex items-center gap-2">
              <div className="typing-dot w-1.5 h-1.5 rounded-full bg-[#c8922a]"/>
              <div className="typing-dot w-1.5 h-1.5 rounded-full bg-[#c8922a]"/>
              <div className="typing-dot w-1.5 h-1.5 rounded-full bg-[#c8922a]"/>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-[rgba(200,146,42,0.12)] bg-[rgba(10,8,6,0.97)]">
        <div className="flex gap-2 px-6 pt-3 pb-2 flex-wrap">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.label} onClick={() => send(a.label)} disabled={isLoading}
              className="font-cinzel text-[9px] tracking-wider uppercase px-2.5 py-1 border border-[rgba(200,146,42,0.12)] text-[rgba(240,228,192,0.28)] hover:border-[rgba(200,146,42,0.35)] hover:text-[#e8b040] transition-colors disabled:opacity-30">
              {a.icon} {a.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3 px-6 pb-5 pt-1 items-end">
          <textarea value={input} onChange={(e) => {setInput(e.target.value); grow(e.target)}}
            onKeyDown={handleKey} disabled={isLoading}
            placeholder="What do you do? This world is yours..."
            rows={1}
            className="flex-1 bg-transparent border-b border-[rgba(200,146,42,0.25)] focus:border-[#c8922a] outline-none font-garamond text-base text-[#f0e4c0] placeholder-[rgba(240,228,192,0.15)] resize-none py-2 transition-colors"
            style={{maxHeight:'120px'}}/>
          <button onClick={() => send()} disabled={isLoading || !input.trim()}
            className="w-10 h-10 border border-[rgba(200,146,42,0.3)] flex items-center justify-center text-[#c8922a] hover:border-[#e8b040] hover:text-[#e8b040] hover:bg-[rgba(200,146,42,0.08)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}