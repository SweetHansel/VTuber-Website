'use client'

import { cn } from '@/lib/utils'

interface TagProps {
  children: React.ReactNode
  color?: string
  variant?: 'filled' | 'outline'
  size?: 'sm' | 'md'
  onClick?: () => void
  className?: string
}

export function Tag({
  children,
  color,
  variant = 'filled',
  size = 'sm',
  onClick,
  className,
}: TagProps) {
  const isClickable = !!onClick

  const baseStyles = cn(
    'inline-flex items-center rounded-full font-medium transition-colors',
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
    isClickable && 'cursor-pointer'
  )

  const variantStyles = {
    filled: color
      ? `text-white`
      : 'bg-white/10 text-white/80 hover:bg-white/20',
    outline: color
      ? `border text-current`
      : 'border border-white/20 text-white/70 hover:border-white/40',
  }

  const style = color
    ? {
        backgroundColor: variant === 'filled' ? color : 'transparent',
        borderColor: variant === 'outline' ? color : undefined,
        color: variant === 'outline' ? color : undefined,
      }
    : undefined

  const Component = isClickable ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
    >
      {children}
    </Component>
  )
}
