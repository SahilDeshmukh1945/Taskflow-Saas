export function Topbar({ title, subtitle, actions }) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-[#1E2535] bg-[#080A0E] sticky top-0 z-10">
      <div>
        <h1 className="text-sm font-semibold text-[#E8ECF4]">{title}</h1>
        {subtitle && (
          <p className="text-[11px] text-[#525C6E]">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
      </div>
    </header>
  )
}