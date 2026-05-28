export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const STATUS_CONFIG = {
  'todo': {
    label: 'Todo',
    color: 'bg-slate-500/20 text-slate-400',
    dot: 'bg-slate-400',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-blue-500/15 text-blue-400',
    dot: 'bg-blue-400',
  },
  'done': {
    label: 'Done',
    color: 'bg-emerald-500/15 text-emerald-400',
    dot: 'bg-emerald-400',
  },
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getAvatarColor(name = '') {
  const colors = [
    'from-blue-500 to-blue-700',
    'from-violet-500 to-violet-700',
    'from-emerald-500 to-emerald-700',
    'from-amber-500 to-amber-700',
    'from-rose-500 to-rose-700',
    'from-cyan-500 to-cyan-700',
  ]
  const idx = (name.charCodeAt(0) || 0) % colors.length
  return colors[idx]
}