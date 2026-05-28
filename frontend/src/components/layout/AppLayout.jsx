import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Modal } from '../ui/Modal'
import { useWorkspace } from '../../context/WorkspaceContext'
import { useToast } from '../ui/Toast'

function CreateWorkspaceModal({ isOpen, onClose }) {
  const { createWorkspace } = useWorkspace()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await createWorkspace(name)
      toast({ message: 'Workspace created!', type: 'success' })
      onClose()
      setName('')
    } catch (err) {
      toast({ message: err.response?.data?.message || 'Failed', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Workspace" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Workspace Name</label>
          <input
            className="input"
            placeholder="e.g. Acme Engineering"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading || !name.trim()} className="btn-primary flex-1">
            {loading ? 'Creating…' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function CreateProjectModal({ isOpen, onClose }) {
  const { createProject, activeWorkspace } = useWorkspace()
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await createProject(name)
      toast({ message: 'Project created!', type: 'success' })
      onClose()
      setName('')
    } catch (err) {
      toast({ message: err.response?.data?.message || 'Failed', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Project" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-[#525C6E]">
          Adding to <span className="text-[#8B95A8]">{activeWorkspace?.name}</span>
        </p>
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
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading || !name.trim()} className="btn-primary flex-1">
            {loading ? 'Creating…' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export function AppLayout({ children }) {
  const [showCreateWs, setShowCreateWs] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)

  return (
    <div className="flex h-screen bg-[#080A0E] overflow-hidden">
      <Sidebar
        onCreateWorkspace={() => setShowCreateWs(true)}
        onCreateProject={() => setShowCreateProject(true)}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <CreateWorkspaceModal isOpen={showCreateWs} onClose={() => setShowCreateWs(false)} />
      <CreateProjectModal isOpen={showCreateProject} onClose={() => setShowCreateProject(false)} />
    </div>
  )
}