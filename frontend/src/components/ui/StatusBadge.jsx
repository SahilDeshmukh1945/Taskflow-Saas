import { STATUS_CONFIG, cn } from '../../lib/utils'

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['todo']

  return (
    <span className={cn('badge', config.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}

export function StatusSelect({ value, onChange }) {
  const statuses = ['todo', 'in-progress', 'done']

  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map(s => {
        const cfg = STATUS_CONFIG[s]
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={cn(
              'badge border transition-all',
              value === s
                ? `${cfg.color} border-current`
                : 'bg-[#161B2A] text-[#525C6E] border-[#1E2535] hover:text-[#8B95A8]'
            )}
          >
            <span className={cn(
              'w-1.5 h-1.5 rounded-full',
              value === s ? cfg.dot : 'bg-[#525C6E]'
            )} />
            {cfg.label}
          </button>
        )
      })}
    </div>
  )
}