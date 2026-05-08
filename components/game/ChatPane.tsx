'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

interface ChatPaneProps {
  messages: Message[]
  loading: boolean
}

export default function ChatPane({ messages, loading }: ChatPaneProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-full min-h-64 text-center gap-4 text-gold/30">
          <div className="text-5xl">⚜️</div>
          <p className="font-cinzel-decorative text-sm tracking-widest">
            Select an era from the ribbon above
          </p>
          <p className="font-fell text-base italic">
            The Chronicle awaits your choosing...
          </p>
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.timestamp} message={msg} />
      ))}
      {loading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
