import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, CheckSquare,
  Users, LogOut, Plus, ChevronDown, Zap
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useWorkspace } from '../../context/WorkspaceContext'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../lib/utils'
import { useState } from 'react'

export function Sidebar({ onCreateWorkspace, onCreateProject }) {
  const { user, logout } = useAuth()
  const {
    workspaces, activeWorkspace, setActiveWorkspace,
    projects, activeProject, setActiveProject
  } = useWorkspace()
  const location = useLocation()
  const navigate = useNavigate()
  const [wsOpen, setWsOpen] = useState(false)

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Users, label: 'Members', path: '/members' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col bg-[#0D1017] border-r border-[#1E2535]">

      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#1E2535]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-semibold text-[#E8ECF4]">TaskFlow</span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 pt-3">
        <button
          onClick={() => setWsOpen(!wsOpen)}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#161B2A] transition-all"
        >
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-white">
              {activeWorkspace?.name?.[0]?.toUpperCase() || 'W'}
            </span>
          </div>
          <span className="text-sm font-medium text-[#E8ECF4] truncate flex-1 text-left">
            {activeWorkspace?.name || 'Select Workspace'}
          </span>
          <ChevronDown size={13} className={cn('text-[#525C6E] transition-transform', wsOpen && 'rotate-180')} />
        </button>

        {wsOpen && (
          <div className="mt-1 bg-[#111520] border border-[#252D40] rounded-xl overflow-hidden animate-slide-up">
            {workspaces.map(ws => (
              <button
                key={ws._id}
                onClick={() => { setActiveWorkspace(ws); setWsOpen(false) }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left',
                  ws._id === activeWorkspace?._id
                    ? 'text-[#E8ECF4] bg-[#161B2A]'
                    : 'text-[#8B95A8] hover:text-[#E8ECF4] hover:bg-[#161B2A]'
                )}
              >
                <div className="w-4 h-4 rounded-sm bg-violet-600 flex items-center justify-center text-[8px] font-bold text-white">
                  {ws.name[0]?.toUpperCase()}
                </div>
                <span className="truncate">{ws.name}</span>
              </button>
            ))}
            <div className="border-t border-[#1E2535]">
              <button
                onClick={() => { setWsOpen(false); onCreateWorkspace?.() }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[#525C6E] hover:text-[#E8ECF4] hover:bg-[#161B2A] transition-colors"
              >
                <Plus size={13} /> New workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={location.pathname === path ? 'sidebar-item-active' : 'sidebar-item'}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}

        {/* Projects List */}
        {projects.length > 0 && (
          <div className="pt-3">
            <p className="px-2 py-1 text-[10px] font-semibold text-[#353E50] uppercase tracking-widest">
              Projects
            </p>
            {projects.map(p => (
              <button
                key={p._id}
                onClick={() => { setActiveProject(p); navigate('/tasks') }}
                className={cn(
                  'sidebar-item',
                  activeProject?._id === p._id && 'sidebar-item-active'
                )}
              >
                <div className="w-2 h-2 rounded-sm bg-blue-500 shrink-0" />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
            <button
              onClick={onCreateProject}
              className="sidebar-item text-[#353E50] hover:text-[#525C6E]"
            >
              <Plus size={13} /> New project
            </button>
          </div>
        )}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-3 border-t border-[#1E2535]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[#161B2A] transition-all group cursor-pointer">
          <Avatar name={user?.name || user?.email || 'U'} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#E8ECF4] truncate">
              {user?.name || user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#525C6E] hover:text-red-400 transition-all"
            title="Logout"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}