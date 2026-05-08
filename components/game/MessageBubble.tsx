'use client'

import { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isNarrator = message.role === 'assistant'

  const text = message.content
    .replace(/\(([^)]+)\)/g, '<span class="stat-tag">($1)</span>')

  if (isNarrator) {
    return (
      <div className="flex gap-3 pr-8">
        <div className="text-gold/70 text-sm mt-0.5 shrink-0 font-cinzel select-none">✦</div>
        <div className="flex-1">
          <div
            className="border-l-2 border-gold/40 pl-4 py-1"
          >
            <p
              className="text-parchment font-fell text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 pl-8 justify-end">
      <div className="flex-1 max-w-sm">
        <div className="border-r-2 border-crimson/50 pr-4 py-1 text-right">
          <p className="text-stone-300 font-fell text-base leading-relaxed italic">{message.content}</p>
        </div>
      </div>
      <div className="text-crimson/60 text-sm mt-0.5 shrink-0 font-cinzel select-none">⚔</div>
    </div>
  )
}
