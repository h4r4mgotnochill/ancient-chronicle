'use client'

interface Swatch {
  color: string
  label: string
}

interface OptionPanelProps {
  label: string
  options: string[] | Swatch[]
  value: number
  onChange: (v: number) => void
  type?: 'pill' | 'swatch'
}

function isSwatch(o: string | Swatch): o is Swatch {
  return typeof o === 'object' && 'color' in o
}

export default function OptionPanel({ label, options, value, onChange, type = 'pill' }: OptionPanelProps) {
  return (
    <div className="mb-5">
      <p className="text-gold/60 text-xs font-cinzel tracking-widest uppercase mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => (
          type === 'swatch' && isSwatch(opt) ? (
            <button
              key={i}
              onClick={() => onChange(i)}
              title={opt.label}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                value === i ? 'border-gold scale-110 shadow-[0_0_8px_rgba(200,152,40,0.6)]' : 'border-stone-700 hover:border-gold/50'
              }`}
              style={{ backgroundColor: opt.color }}
            />
          ) : (
            <button
              key={i}
              onClick={() => onChange(i)}
              className={`px-3 py-1 text-xs font-cinzel tracking-wide border transition-all ${
                value === i
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-gold/20 text-gold/50 hover:border-gold/40 hover:text-gold/70'
              }`}
            >
              {String(opt)}
            </button>
          )
        ))}
      </div>
    </div>
  )
}
