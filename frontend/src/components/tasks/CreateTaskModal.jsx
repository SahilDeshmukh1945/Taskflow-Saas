import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { StatusSelect } from '../ui/StatusBadge'
import { useToast } from '../ui/Toast'
import { useWorkspace } from '../../context/WorkspaceContext'

export function CreateTaskModal({ isOpen, onClose, onSubmit }) {
  const { activeWorkspace } = useWorkspace()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    status: 'todo',
    assignedTo: '',
  })
const members = (activeWorkspace?.members || []).filter(m => m.user && (m.user._id || typeof m.user === 'string'))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try {
     await onSubmit({
  title: form.title,
  status: form.status,
  assignedTo: form.assignedTo || undefined,
})
      toast({ message: 'Task created!', type: 'success' })
      onClose()
      setForm({ title: '', status: 'todo', assignedTo: '' })
    } catch (err) {
      toast({ message: err.response?.data?.message || 'Failed to create task', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input
            className="input"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="label">Status</label>
          <StatusSelect
            value={form.status}
            onChange={val => setForm(p => ({ ...p, status: val }))}
          />
        </div>

        <div>
          <label className="label">Assign To</label>
          <select
            className="input"
            value={form.assignedTo}
            onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}
          >
            <option value="">Unassigned</option>
  {members.map(m => {
    const userId = m.user?._id || m.user
    const userName = m.user?.name || m.user?.email || 'Member'
    if (!userId) return null
    return (
      <option key={userId} value={userId}>
        {userName}
      </option>
    )
  })}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading || !form.title.trim()} className="btn-primary flex-1">
            {loading ? 'Creating…' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}