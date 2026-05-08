import { AvatarConfig } from '@/types'

const SKINS = ['#f5c896', '#d4956a', '#a86840', '#6e3d1e', '#3a1a08']
const HAIR_COLORS = ['#1a0a04', '#5c2e0a', '#c89020', '#880000', '#d0d0d0', '#0a1840']
const OUTFIT_COLORS = ['#1a1220', '#1a2a6e', '#1a4a1a', '#6e1a1a', '#8a6a10', '#c8a850']
const EYE_COLOR = '#1a0a04'
const HIGHLIGHT = '#ffffff'
const BLUSH = 'rgba(220,130,100,0.35)'

export function drawPixelAvatar(
  canvas: HTMLCanvasElement,
  config: AvatarConfig,
  size: number
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const GRID = 16
  const S = size / GRID
  canvas.width = size
  canvas.height = size
  ctx.imageSmoothingEnabled = false

  const px = (x: number, y: number, color: string, w = 1, h = 1) => {
    ctx.fillStyle = color
    ctx.fillRect(x * S, y * S, w * S, h * S)
  }

  // Background — starfield
  ctx.fillStyle = '#0e0b18'
  ctx.fillRect(0, 0, size, size)

  // Draw a few star dots
  ctx.fillStyle = 'rgba(255,255,200,0.6)'
  const stars = [[1,1],[3,2],[14,1],[15,3],[2,13],[13,14],[0,7],[15,8]]
  stars.forEach(([sx, sy]) => ctx.fillRect(sx * S, sy * S, S * 0.4, S * 0.4))

  const skin = SKINS[config.skin] ?? SKINS[0]
  const hairCol = HAIR_COLORS[config.hairColor] ?? HAIR_COLORS[0]
  const outfitCol = OUTFIT_COLORS[config.outfit] ?? OUTFIT_COLORS[0]

  // Body / torso (rows 9-13, cols 4-11)
  px(4, 9, outfitCol, 8, 5)

  // Neck
  px(7, 8, skin, 2, 1)

  // Head (rows 2-8, cols 5-10)
  px(5, 2, skin, 6, 6)

  // Hair
  drawHair(ctx, config.hair, hairCol, S)

  // Eyes
  drawEyes(ctx, config.eyes, skin, S, HIGHLIGHT, EYE_COLOR)

  // Expression
  drawExpression(ctx, config.expression, skin, S)

  // Blush
  ctx.fillStyle = BLUSH
  ctx.fillRect(5 * S, 6 * S, S, S * 0.7)
  ctx.fillRect(10 * S, 6 * S, S, S * 0.7)

  // Accessory
  drawAccessory(ctx, config.accessory, hairCol, outfitCol, S)

  // Arms (rows 9-12, cols 2-3 left, 12-13 right)
  px(2, 9, outfitCol, 2, 4)
  px(12, 9, outfitCol, 2, 4)

  // Hands
  px(2, 13, skin, 2, 1)
  px(12, 13, skin, 2, 1)

  // Legs (rows 14-15)
  px(4, 14, outfitCol, 3, 2)
  px(9, 14, outfitCol, 3, 2)
}

function drawHair(
  ctx: CanvasRenderingContext2D,
  style: number,
  color: string,
  S: number
) {
  const px = (x: number, y: number, w = 1, h = 1) => {
    ctx.fillStyle = color
    ctx.fillRect(x * S, y * S, w * S, h * S)
  }

  switch (style) {
    case 0: // short — top block
      px(5, 1, 6, 2)
      px(4, 2, 1, 1)
      px(11, 2, 1, 1)
      break
    case 1: // long — side extensions
      px(5, 1, 6, 2)
      px(4, 2, 1, 5)
      px(11, 2, 1, 5)
      px(4, 1, 1, 1)
      px(11, 1, 1, 1)
      break
    case 2: // mohawk — center spike
      px(7, 0, 2, 3)
      px(6, 1, 1, 1)
      px(9, 1, 1, 1)
      break
    case 3: // bun — top circle
      px(6, 0, 4, 1)
      px(5, 1, 6, 1)
      px(4, 2, 1, 1)
      px(11, 2, 1, 1)
      break
    case 4: // bald
      break
  }
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  style: number,
  _skin: string,
  S: number,
  highlight: string,
  eyeColor: string
) {
  const px = (x: number, y: number, color: string, w = 1, h = 1) => {
    ctx.fillStyle = color
    ctx.fillRect(x * S, y * S, w * S, h * S)
  }

  switch (style) {
    case 0: // round 2×2
      px(6, 4, eyeColor, 2, 2)
      px(9, 4, eyeColor, 2, 2)
      px(6, 4, highlight, 0.7, 0.7)
      px(9, 4, highlight, 0.7, 0.7)
      break
    case 1: // narrow 1px line
      px(6, 5, eyeColor, 2, 1)
      px(9, 5, eyeColor, 2, 1)
      break
    case 2: // star — diamond gold
      ctx.fillStyle = '#c89020'
      ctx.fillRect(7 * S, 4 * S, S, S)
      ctx.fillRect(6 * S, 5 * S, 3 * S, S)
      ctx.fillRect(7 * S, 6 * S, S, S)
      ctx.fillStyle = '#c89020'
      ctx.fillRect(10 * S, 4 * S, S, S)
      ctx.fillRect(9 * S, 5 * S, 3 * S, S)
      ctx.fillRect(10 * S, 6 * S, S, S)
      break
    case 3: // closed — line
      ctx.fillStyle = eyeColor
      ctx.fillRect(6 * S, 5.4 * S, 2 * S, S * 0.3)
      ctx.fillRect(9 * S, 5.4 * S, 2 * S, S * 0.3)
      break
  }
}

function drawExpression(
  ctx: CanvasRenderingContext2D,
  style: number,
  skin: string,
  S: number
) {
  ctx.fillStyle = '#8b3a2a'
  switch (style) {
    case 0: // neutral
      ctx.fillRect(7 * S, 7 * S, 2 * S, S * 0.3)
      break
    case 1: // smile U
      ctx.beginPath()
      ctx.arc(8 * S, 7 * S, S * 0.9, 0, Math.PI)
      ctx.strokeStyle = '#8b3a2a'
      ctx.lineWidth = S * 0.35
      ctx.stroke()
      break
    case 2: // stern flat + brows
      ctx.fillRect(7 * S, 7 * S, 2 * S, S * 0.3)
      ctx.fillStyle = '#4a2010'
      ctx.fillRect(6 * S, 3.3 * S, 2 * S, S * 0.4)
      ctx.fillRect(9 * S, 3.3 * S, 2 * S, S * 0.4)
      break
    case 3: // smirk asymmetric
      ctx.beginPath()
      ctx.arc(8.5 * S, 7 * S, S * 0.7, 0, Math.PI * 0.7)
      ctx.strokeStyle = '#8b3a2a'
      ctx.lineWidth = S * 0.35
      ctx.stroke()
      break
  }
}

function drawAccessory(
  ctx: CanvasRenderingContext2D,
  style: number,
  _hairColor: string,
  outfitColor: string,
  S: number
) {
  switch (style) {
    case 0: break // none
    case 1: { // crown — gold pixels above hair
      ctx.fillStyle = '#c89020'
      ctx.fillRect(5 * S, 0 * S, 6 * S, S * 0.8)
      ctx.fillStyle = '#e8b840'
      for (let i = 0; i < 3; i++) {
        ctx.fillRect((5 + i * 2) * S, -0.5 * S, S * 0.7, S * 0.7)
      }
      break
    }
    case 2: { // hood — outfit color wraps head
      ctx.fillStyle = outfitColor
      ctx.fillRect(4 * S, 1 * S, 1 * S, 8 * S)
      ctx.fillRect(11 * S, 1 * S, 1 * S, 8 * S)
      ctx.fillRect(4 * S, 1 * S, 8 * S, 1.5 * S)
      break
    }
    case 3: { // witch hat — triangle
      ctx.fillStyle = '#1a0a04'
      ctx.beginPath()
      ctx.moveTo(8 * S, -S)
      ctx.lineTo(5 * S, 2 * S)
      ctx.lineTo(11 * S, 2 * S)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#c89020'
      ctx.fillRect(4 * S, 2 * S, 8 * S, S * 0.5)
      break
    }
    case 4: { // halo — ellipse stroke gold
      ctx.strokeStyle = '#f8d868'
      ctx.lineWidth = S * 0.4
      ctx.beginPath()
      ctx.ellipse(8 * S, 0.5 * S, 3 * S, S * 0.7, 0, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
  }
}
