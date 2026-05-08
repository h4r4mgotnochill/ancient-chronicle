'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vy: number
  vx: number
  size: number
  opacity: number
  color: string
}

const COLORS = ['#c89828', '#e8b840', '#f8d868', '#8b6820', '#d4a030']

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: -(0.2 + Math.random() * 0.5),
      vx: (Math.random() - 0.5) * 0.3,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.y += p.vy
        p.x += p.vx
        p.opacity += (Math.random() - 0.5) * 0.02

        if (p.y < -4) {
          p.y = canvas.height + 4
          p.x = Math.random() * canvas.width
        }
        p.opacity = Math.max(0.05, Math.min(0.7, p.opacity))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      })
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
