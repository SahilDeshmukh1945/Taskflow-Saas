import { getInitials, getAvatarColor, cn } from '../../lib/utils'

export function Avatar({ name = '', size = 'sm', className }) {
  const initials = getInitials(name)
  const gradient = getAvatarColor(name)

  const sizes = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  return (
    <div className={cn(
      'flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shrink-0',
      sizes[size],
      gradient,
      className
    )}>
      {initials}
    </div>
  )
}