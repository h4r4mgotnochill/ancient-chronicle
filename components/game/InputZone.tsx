'use client'

import { useState, useRef, KeyboardEvent } from 'react'

interface InputZoneProps {
  onSend: (text: string) => void
  disabled: boolean
}

const QUICK_CHIPS = ['status', 'map', 'look around', 'inventory', 'who is near?']

export default function InputZone({ onSend, disabled }: InputZoneProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const send = () => {
    const t = text.trim().slice(0, 500)
    if (!t || disabled) return
    onSend(t)
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handleInput = () => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
  }

  return (
    <div className="sticky bottom-0 z-30 bg-black/80 backdrop-blur-md border-t border-gold/20">
      {/* Quick chips */}
      <div className="flex gap-2 overflow-x-auto px-4 pt-2 pb-1" style={{ scrollbarWidth: 'none' }}>
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => !disabled && onSend(chip)}
            disabled={disabled}
            className="shrink-0 px-3 py-1 text-xs font-cinzel tracking-wide border border-gold/20 text-gold/50 hover:border-gold/50 hover:text-gold/80 hover:bg-gold/5 transition-all whitespace-nowrap disabled:opacity-30"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Textarea + send */}
      <div className="flex gap-3 items-end px-4 pb-4 pt-1">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => { setText(e.target.value); handleInput() }}
          onKeyDown={onKey}
          disabled={disabled}
          rows={1}
          maxLength={500}
          placeholder="What do you do? Speak freely..."
          className="flex-1 resize-none bg-black/60 border-0 border-b-2 border-gold/40 text-parchment font-fell placeholder:text-stone-600 px-3 py-2.5 focus:outline-none focus:border-gold/80 transition-colors text-base leading-relaxed disabled:opacity-50"
          style={{ minHeight: 44, maxHeight: 120 }}
        />
        <button
          onClick={send}
          disabled={disabled || !text.trim()}
          className="w-10 h-10 shrink-0 rounded-full border border-gold/50 text-gold bg-stone-950 hover:bg-gold/10 hover:shadow-[0_0_16px_rgba(200,152,40,0.3)] transition-all flex items-center justify-center disabled:opacity-30 text-sm"
        >
          ➤
        </button>
      </div>
    </div>
  )
}
