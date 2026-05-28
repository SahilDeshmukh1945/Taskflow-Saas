import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { StatusSelect } from '../ui/StatusBadge'
import { useToast } from '../ui/Toast'
import { useWorkspace } from '../../context/WorkspaceContext'

export function EditTaskModal({ isOpen, onClose, task, onSubmit }) {
  const { activeWorkspace } = useWorkspace()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    status: 'todo',
    assignedTo: '',
  })

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        status: task.status || 'todo',
        assignedTo: task.assignedTo?._id || task.assignedTo || '',
      })
    }
  }, [task])

  const members = activeWorkspace?.members || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(task._id, {
        title: form.title,
        status: form.status,
        assignedTo: form.assignedTo || undefined,
      })
      toast({ message: 'Task updated!', type: 'success' })
      onClose()
    } catch (err) {
      toast({ message: err.response?.data?.message || 'Failed to update task', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input
            className="input"
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
            {members.map(m => (
              <option key={m.user?._id || m.user} value={m.user?._id || m.user}>
                {m.user?.name || m.user?.email || 'Member'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}