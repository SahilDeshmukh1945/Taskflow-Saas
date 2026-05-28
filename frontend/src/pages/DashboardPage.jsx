import { useNavigate } from 'react-router-dom'
import { CheckSquare, FolderKanban, Users, Plus, ArrowRight } from 'lucide-react'
import { Topbar } from '../components/layout/Topbar'
import { StatusBadge } from '../components/ui/StatusBadge'
import { PageLoader } from '../components/ui/Spinner'
import { useWorkspace } from '../context/WorkspaceContext'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'

export default function DashboardPage() {
  const { user } = useAuth()
  const { activeWorkspace, projects, activeProject, setActiveProject } = useWorkspace()
  const { tasks, loading } = useTasks(activeProject?._id)
  const navigate = useNavigate()

  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const todo = tasks.filter(t => t.status === 'todo').length

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div>
      <Topbar
        title="Dashboard"
        subtitle={activeWorkspace?.name}
      />

      <div className="p-6 space-y-6 max-w-5xl">

        {/* Greeting */}
        <div>
          <h2 className="text-xl font-semibold text-[#E8ECF4]">
            Welcome back 👋
          </h2>
          <p className="text-sm text-[#525C6E] mt-1">
            Here's what's happening in {activeWorkspace?.name || 'your workspace'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Tasks', value: total, icon: CheckSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'In Progress', value: inProgress, icon: CheckSquare, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Completed', value: done, icon: CheckSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Projects', value: projects.length, icon: FolderKanban, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card p-5">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={color} />
              </div>
              <div className="text-2xl font-semibold text-[#E8ECF4]">{value}</div>
              <div className="text-xs text-[#8B95A8] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Tasks */}
          <div className="lg:col-span-2 card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2535]">
              <h3 className="text-sm font-semibold text-[#E8ECF4]">Recent Tasks</h3>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs text-[#525C6E] hover:text-[#E8ECF4] flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>

            {loading ? (
              <PageLoader />
            ) : recentTasks.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#525C6E]">No tasks yet</div>
            ) : (
              <div className="divide-y divide-[#1E2535]">
                {recentTasks.map(task => (
                  <div key={task._id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#111520] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#E8ECF4] truncate">{task.title}</p>
                      {task.assignedTo && (
                        <p className="text-xs text-[#525C6E] mt-0.5">
                          {task.assignedTo?.name || task.assignedTo?.email}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2535]">
              <h3 className="text-sm font-semibold text-[#E8ECF4]">Projects</h3>
              <span className="text-xs text-[#525C6E] bg-[#161B2A] px-2 py-0.5 rounded-full">
                {projects.length}
              </span>
            </div>
            <div className="divide-y divide-[#1E2535]">
              {projects.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#525C6E]">No projects yet</div>
              ) : (
                projects.map(p => (
                  <button
                    key={p._id}
                    onClick={() => { setActiveProject(p); navigate('/tasks') }}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#111520] transition-colors text-left"
                  >
                    <div className="w-2 h-2 rounded-sm bg-blue-500 shrink-0" />
                    <span className="text-sm text-[#E8ECF4] truncate flex-1">{p.name}</span>
                    <ArrowRight size={12} className="text-[#353E50]" />
                  </button>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}