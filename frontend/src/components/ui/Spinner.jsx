import { cn } from '../../lib/utils'

export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div className={cn(
      'rounded-full border-2 border-[#252D40] border-t-blue-500 animate-spin',
      sizes[size],
      className
    )} />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#161B2A] border border-[#252D40] flex items-center justify-center mb-4">
        {Icon && <Icon size={20} className="text-[#525C6E]" />}
      </div>
      <h3 className="text-sm font-semibold text-[#E8ECF4] mb-1">{title}</h3>
      <p className="text-sm text-[#525C6E] mb-4 max-w-xs">{description}</p>
      {action}
    </div>
  )
}