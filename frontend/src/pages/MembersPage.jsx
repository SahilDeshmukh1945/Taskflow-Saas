import { useState } from 'react'
import { UserPlus, Crown, Shield, User } from 'lucide-react'
import { Topbar } from '../components/layout/Topbar'
import { Modal } from '../components/ui/Modal'
import { Avatar } from '../components/ui/Avatar'
import { useWorkspace } from '../context/WorkspaceContext'
import { useToast } from '../components/ui/Toast'
import { cn } from '../lib/utils'

const ROLE_CONFIG = {
  owner: { label: 'Owner', color: 'bg-violet-500/15 text-violet-400', Icon: Crown },
  admin: { label: 'Admin', color: 'bg-blue-500/15 text-blue-400', Icon: Shield },
  member: { label: 'Member', color: 'bg-[#161B2A] text-[#8B95A8]', Icon: User },
}

export default function MembersPage() {
  const { activeWorkspace, addMember } = useWorkspace()
  const { toast } = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const members = activeWorkspace?.members || []

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await addMember(email, 'member')
      toast({ message: 'Member added!', type: 'success' })
      setShowAdd(false)
      setEmail('')
    } catch (err) {
      toast({ message: err.response?.data?.message || 'Failed to add member', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Topbar
        title="Members"
        subtitle={activeWorkspace?.name}
        actions={
          <button onClick={() => setShowAdd(true)} className="btn-primary" disabled={!activeWorkspace}>
            <UserPlus size={14} /> Add Member
          </button>
        }
      />

      <div className="p-6 max-w-2xl">
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1E2535] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#E8ECF4]">Team Members</h3>
            <span className="text-xs text-[#525C6E] bg-[#161B2A] px-2 py-0.5 rounded-full">
              {members.length}
            </span>
          </div>

          {members.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#525C6E]">No members yet</div>
          ) : (
            <div className="divide-y divide-[#1E2535]">
              {members.map((m, i) => {
                const role = m.role || 'member'
                const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.member
                const RoleIcon = cfg.Icon

                return (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-[#111520] transition-colors">
                    <Avatar name={m.user?.name || m.user?.email || '?'} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#E8ECF4]">
                        {m.user?.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-[#525C6E] truncate">{m.user?.email}</p>
                    </div>
                    <span className={cn('badge', cfg.color)}>
                      <RoleIcon size={10} />
                      {cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Member" size="sm">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="colleague@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <p className="text-xs text-[#525C6E] mt-1.5">
              The user must already have a TaskFlow account.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading || !email.trim()} className="btn-primary flex-1">
              {loading ? 'Adding…' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}