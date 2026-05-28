import { useState } from 'react'
import { Plus, List, LayoutGrid, Trash2, Pencil, AlertCircle } from 'lucide-react'
import { Topbar } from '../components/layout/Topbar'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Avatar } from '../components/ui/Avatar'
import { CreateTaskModal } from '../components/tasks/CreateTaskModal'
import { EditTaskModal } from '../components/tasks/EditTaskModal'
import { PageLoader, EmptyState } from '../components/ui/Spinner'
import { useWorkspace } from '../context/WorkspaceContext'
import { useTasks } from '../hooks/useTasks'
import { useToast } from '../components/ui/Toast'
import { cn, STATUS_CONFIG } from '../lib/utils'

export default function TasksPage() {
  const { activeProject, activeWorkspace } = useWorkspace()
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks(activeProject?._id)
  const { toast } = useToast()
  const [view, setView] = useState('list')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editTask, setEditTask] = useState(null)

  const members = activeWorkspace?.members || []

  const filtered = tasks.filter(t => {
    if (statusFilter && t.status !== statusFilter) return false
    return true
  })

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(taskId)
      toast({ message: 'Task deleted', type: 'success' })
    } catch {
      toast({ message: 'Failed to delete task', type: 'error' })
    }
  }

  return (
    <div>
      <Topbar
        title={activeProject?.name || 'Tasks'}
        subtitle={activeWorkspace?.name}
        actions={
          <button
            onClick={() => setShowCreate(true)}
            disabled={!activeProject}
            className="btn-primary"
          >
            <Plus size={14} /> New Task
          </button>
        }
      />

      <div className="p-6 space-y-4">

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              className="input !w-auto text-xs py-1.5"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            {statusFilter && (
              <button
                onClick={() => setStatusFilter('')}
                className="text-xs text-[#525C6E] hover:text-[#E8ECF4] px-2 py-1.5 bg-[#161B2A] rounded-lg border border-[#1E2535] transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[#111520] p-1 rounded-lg border border-[#1E2535]">
            <button
              onClick={() => setView('list')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                view === 'list' ? 'bg-[#1C2235] text-[#E8ECF4]' : 'text-[#525C6E] hover:text-[#8B95A8]'
              )}
            >
              <List size={13} /> List
            </button>
            <button
              onClick={() => setView('board')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                view === 'board' ? 'bg-[#1C2235] text-[#E8ECF4]' : 'text-[#525C6E] hover:text-[#8B95A8]'
              )}
            >
              <LayoutGrid size={13} /> Board
            </button>
          </div>
        </div>

        {/* Content */}
        {!activeProject ? (
          <EmptyState
            icon={AlertCircle}
            title="No project selected"
            description="Select a project from the sidebar to view tasks."
          />
        ) : loading ? (
          <PageLoader />
        ) : error ? (
          <div className="card p-4 flex items-center gap-3 text-red-400 border-red-500/20">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No tasks yet"
            description="Create your first task to get started."
            action={
              <button onClick={() => setShowCreate(true)} className="btn-primary">
                <Plus size={14} /> Create Task
              </button>
            }
          />
        ) : view === 'list' ? (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E2535]">
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-[#353E50] uppercase tracking-wider">Task</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-[#353E50] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-[#353E50] uppercase tracking-wider">Assignee</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2535]">
                {filtered.map(task => (
                  <tr key={task._id} className="group hover:bg-[#111520] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#E8ECF4]">{task.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-3">
                      {task.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={task.assignedTo?.name || '?'} size="xs" />
                          <span className="text-xs text-[#8B95A8]">{task.assignedTo?.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#353E50]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditTask(task)}
                          className="p-1.5 rounded text-[#525C6E] hover:text-[#E8ECF4] hover:bg-[#161B2A] transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-1.5 rounded text-[#525C6E] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Object.entries(STATUS_CONFIG).map(([statusKey, statusVal]) => {
              const colTasks = filtered.filter(t => t.status === statusKey)
              return (
                <div key={statusKey} className="shrink-0 w-72">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn('w-2 h-2 rounded-full', statusVal.dot)} />
                    <span className="text-xs font-semibold text-[#8B95A8] uppercase tracking-wider">
                      {statusVal.label}
                    </span>
                    <span className="ml-auto text-xs text-[#353E50] bg-[#161B2A] px-2 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {colTasks.map(task => (
                      <div key={task._id} className="card p-4 group hover:border-[#252D40] transition-all">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <p className="text-sm font-medium text-[#E8ECF4] leading-snug">{task.title}</p>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => setEditTask(task)}
                              className="p-1 rounded text-[#525C6E] hover:text-[#E8ECF4] hover:bg-[#161B2A]"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => handleDelete(task._id)}
                              className="p-1 rounded text-[#525C6E] hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        {task.assignedTo && (
                          <div className="flex items-center gap-2">
                            <Avatar name={task.assignedTo?.name || '?'} size="xs" />
                            <span className="text-xs text-[#525C6E]">{task.assignedTo?.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="h-20 rounded-xl border border-dashed border-[#1E2535] flex items-center justify-center">
                        <span className="text-xs text-[#353E50]">No tasks</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <CreateTaskModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={createTask}
      />
      <EditTaskModal
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        task={editTask}
        onSubmit={updateTask}
      />
    </div>
  )
}