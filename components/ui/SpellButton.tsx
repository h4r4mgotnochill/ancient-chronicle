'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface SpellButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export default function SpellButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: SpellButtonProps) {
  const base =
    'font-cinzel tracking-widest uppercase transition-all duration-200 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-stone-950 border border-gold/60 text-gold border-b-2 border-b-gold hover:bg-gold/10 hover:shadow-[0_4px_24px_rgba(200,152,40,0.25)] hover:-translate-y-px active:translate-y-0',
    ghost:
      'bg-transparent border border-gold/30 text-gold/70 hover:border-gold/60 hover:text-gold hover:bg-gold/5',
    danger:
      'bg-stone-950 border border-crimson/60 text-crimson/80 border-b-2 border-b-crimson hover:bg-crimson/10 hover:text-crimson',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
