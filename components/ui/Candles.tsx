'use client'

const candleData = [
  { left: '3%', height: 40, delay: '0s' },
  { left: '6%', height: 56, delay: '0.4s' },
  { left: '91%', height: 48, delay: '0.8s' },
  { left: '95%', height: 38, delay: '0.2s' },
]

export default function Candles() {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-10">
      {candleData.map((c, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{ left: c.left }}
        >
          {/* Flame */}
          <div
            className="relative mx-auto mb-0.5"
            style={{
              width: 8,
              height: 16,
              animation: `flicker ${0.8 + i * 0.15}s ease-in-out infinite alternate`,
              animationDelay: c.delay,
            }}
          >
            {/* Outer flame */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(ellipse at 50% 70%, #f8d868, #c89020 50%, transparent 100%)',
                filter: 'blur(1px)',
              }}
            />
            {/* Inner flame */}
            <div
              className="absolute inset-1 rounded-full"
              style={{
                background: 'radial-gradient(ellipse at 50% 80%, #fff8e0, #f8d868 60%, transparent)',
                filter: 'blur(0.5px)',
              }}
            />
            {/* Glow */}
            <div
              className="absolute -inset-2 rounded-full opacity-40"
              style={{
                background: 'radial-gradient(circle, rgba(200,152,40,0.5), transparent 70%)',
                animation: `glow ${0.6 + i * 0.12}s ease-in-out infinite alternate`,
                animationDelay: c.delay,
              }}
            />
          </div>
          {/* Wick */}
          <div className="mx-auto bg-stone-600" style={{ width: 2, height: 4 }} />
          {/* Body */}
          <div
            className="mx-auto relative"
            style={{
              width: 10,
              height: c.height,
              background: 'linear-gradient(to bottom, #f0e4c0, #d0c890, #b8a870)',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                height: 6,
                background: 'radial-gradient(ellipse at 50% 0%, #fff8e0, transparent)',
                opacity: 0.7,
              }}
            />
          </div>
          {/* Base */}
          <div
            className="mx-auto"
            style={{
              width: 14,
              height: 6,
              background: 'linear-gradient(to bottom, #c89828, #8a6a10)',
              borderRadius: '2px 2px 0 0',
            }}
          />
        </div>
      ))}
    </div>
  )
}
