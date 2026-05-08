'use client'

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 pr-8">
      <div className="text-gold/70 text-sm mt-0.5 shrink-0 font-cinzel select-none">✦</div>
      <div className="border-l-2 border-gold/40 pl-4 py-2 flex items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold/60"
              style={{
                animation: `typing-orb 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <span className="text-gold/40 text-xs font-cinzel tracking-widest uppercase">
          Chronicler writes...
        </span>
      </div>
    </div>
  )
}
