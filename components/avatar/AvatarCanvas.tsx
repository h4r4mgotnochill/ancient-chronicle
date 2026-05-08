'use client'

import { useEffect, useRef } from 'react'
import { AvatarConfig } from '@/types'
import { drawPixelAvatar } from '@/lib/avatarRenderer'

interface AvatarCanvasProps {
  config: AvatarConfig
  size?: number
  className?: string
}

export default function AvatarCanvas({ config, size = 192, className = '' }: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    drawPixelAvatar(canvasRef.current, config, size)
  }, [config, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`${className}`}
      style={{ imageRendering: 'pixelated', width: size, height: size }}
    />
  )
}
