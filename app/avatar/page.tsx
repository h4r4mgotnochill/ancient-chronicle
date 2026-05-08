'use client'

import dynamic from 'next/dynamic'
import Candles from '@/components/ui/Candles'

const ParticleCanvas = dynamic(() => import('@/components/ui/ParticleCanvas'), { ssr: false })
const AvatarBuilder = dynamic(() => import('@/components/avatar/AvatarBuilder'), { ssr: false })

export default function AvatarPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start px-4 py-10 overflow-hidden">
      <ParticleCanvas />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,6,4,0.85) 100%)',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-cinzel-decorative text-2xl sm:text-3xl text-gold tracking-wide drop-shadow-[0_0_20px_rgba(200,152,40,0.35)]">
            Craft Your Legend
          </h1>
          <p className="font-fell text-base italic text-gold/50 mt-1">
            Choose the face that history shall remember
          </p>
        </div>
        <AvatarBuilder />
      </div>

      <Candles />
    </main>
  )
}
