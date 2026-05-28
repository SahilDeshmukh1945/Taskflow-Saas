import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FolderKanban, ArrowRight, Trash2 } from 'lucide-react'
import { Topbar } from '../components/layout/Topbar'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/Spinner'
import { useWorkspace } from '../context/WorkspaceContext'
import { useToast } from '../components/ui/Toast'

export default function ProjectsPage() {
  const { projects, activeWorkspace, createProject, deleteProject, setActiveProject } = useWorkspace()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await createProject(name)
      toast({ message: 'Project created!', type: 'success' })
      setShowCreate(false)
      setName('')
    } catch (err) {
      toast({ message: err.response?.data?.message || 'Failed', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e, projectId) => {
    e.stopPropagation()
    if (!confirm('Delete this project and all its tasks?')) return
    setDeletingId(projectId)
    try {
      await deleteProject(projectId)
      toast({ message: 'Project deleted', type: 'success' })
    } catch (err) {
      toast({ message: err.response?.data?.message || 'Failed to delete', type: 'error' })
    } finally {
      setDeletingId(null)
    }
  }

  const colors = [
    'from-blue-500 to-blue-700',
    'from-violet-500 to-violet-700',
    'from-emerald-500 to-emerald-700',
    'from-amber-500 to-amber-700',
    'from-rose-500 to-rose-700',
    'from-cyan-500 to-cyan-700',
  ]

  return (
    <div>
      <Topbar
        title="Projects"
        subtitle={activeWorkspace?.name}
        actions={
          <button onClick={() => setShowCreate(true)} className="btn-primary" disabled={!activeWorkspace}>
            <Plus size={14} /> New Project
          </button>
        }
      />

      <div className="p-6">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start organizing tasks."
            action={
              <button onClick={() => setShowCreate(true)} className="btn-primary">
                <Plus size={14} /> Create Project
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((project, i) => (
              <div
                key={project._id}
                onClick={() => { setActiveProject(project); navigate('/tasks') }}
                className="card p-5 hover:border-[#252D40] transition-all group cursor-pointer relative"
              >
                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(e, project._id)}
                  disabled={deletingId === project._id}
                  className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-[#525C6E] hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  {deletingId === project._id
                    ? <span className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin block" />
                    : <Trash2 size={13} />
                  }
                </button>

                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-white font-semibold text-sm mb-4`}>
                  {project.name[0]?.toUpperCase()}
                </div>

                <div className="flex items-start justify-between pr-4">
                  <h3 className="text-sm font-semibold text-[#E8ECF4]">{project.name}</h3>
                  <ArrowRight size={14} className="text-[#353E50] group-hover:text-[#525C6E] transition-colors mt-0.5 shrink-0" />
                </div>

                <p className="text-[11px] text-[#353E50] mt-2">
                  {new Date(project.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>
              </div>
            ))}

            {/* Create new card */}
            <button
              onClick={() => setShowCreate(true)}
              className="card p-5 border-dashed hover:border-[#252D40] transition-all group flex flex-col items-center justify-center gap-2 min-h-[140px]"
            >
              <div className="w-9 h-9 rounded-lg bg-[#161B2A] border border-[#252D40] flex items-center justify-center">
                <Plus size={16} className="text-[#525C6E]" />
              </div>
              <span className="text-sm text-[#525C6E]">New Project</span>
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Project" size="sm">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Project Name</label>
            <input
              className="input"
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading || !name.trim()} className="btn-primary flex-1">
              {loading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}