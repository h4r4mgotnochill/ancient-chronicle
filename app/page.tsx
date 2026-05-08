'use client'

import dynamic from 'next/dynamic'
import LoginForm from '@/components/login/LoginForm'
import Candles from '@/components/ui/Candles'

const ParticleCanvas = dynamic(() => import('@/components/ui/ParticleCanvas'), { ssr: false })

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <ParticleCanvas />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,6,4,0.85) 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
        {/* Shield Logo */}
        <div className="flex flex-col items-center gap-3">
          <svg
            width="72"
            height="80"
            viewBox="0 0 72 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_16px_rgba(200,152,40,0.5)]"
          >
            <path
              d="M36 4L4 16V44C4 60 18 72 36 76C54 72 68 60 68 44V16L36 4Z"
              fill="#0e0b08"
              stroke="#c89828"
              strokeWidth="2"
            />
            <path
              d="M36 14L12 24V44C12 56 22 66 36 70C50 66 60 56 60 44V24L36 14Z"
              fill="#181410"
              stroke="#c89828"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              x="36"
              y="50"
              textAnchor="middle"
              fontSize="28"
              fill="#c89828"
              fontFamily="serif"
            >
              ⚜
            </text>
          </svg>

          <h1 className="font-cinzel-decorative text-3xl sm:text-4xl text-gold text-center leading-tight tracking-wide drop-shadow-[0_0_24px_rgba(200,152,40,0.4)]">
            The Ancient<br />Chronicle
          </h1>
          <p className="font-fell text-lg italic text-gold/60 text-center">
            250 historical eras. One eternal story.
          </p>
          <div className="flex items-center gap-3 text-gold/30 text-xs font-cinzel tracking-widest uppercase">
            <span>✦</span>
            <span>Powered by AI · Guided by History</span>
            <span>✦</span>
          </div>
        </div>

        <LoginForm />

        <p className="text-gold/25 text-xs font-fell italic text-center">
          Your chronicle is saved locally — no account required.
        </p>
      </div>

      <Candles />
    </main>
  )
}
