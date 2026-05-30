import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'
import { useAuth } from './AuthContext'

const WorkspaceContext = createContext(null)

export function WorkspaceProvider({ children }) {
  const { user } = useAuth()
  const [workspaces, setWorkspaces] = useState([])
  const [activeWorkspace, setActiveWorkspace] = useState(null)
  const [projects, setProjects] = useState([])
  const [activeProject, setActiveProject] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) fetchWorkspaces()
  }, [user])

  useEffect(() => {
    if (activeWorkspace) fetchProjects(activeWorkspace._id)
    else setProjects([])
  }, [activeWorkspace])

  const fetchWorkspaces = async () => {
  setLoading(true)
  try {
    const { data } = await api.get('/workspace')
    const list = data.workspaces || data || []
    setWorkspaces(list)
    if (list.length > 0) setActiveWorkspace(list[0])
  } catch (e) {
    console.error(e)
  } finally {
    setLoading(false)
  }
}

  const createWorkspace = async (name) => {
    const { data } = await api.post('/workspace/create', { name })
    const ws = data.workspace
    setWorkspaces(prev => [...prev, ws])
    setActiveWorkspace(ws)
    return ws
  }

  const fetchProjects = async (workspaceId) => {
    try {
      const { data } = await api.get(`/project/${workspaceId}`)
      setProjects(data)
      if (data.length > 0) setActiveProject(data[0])
      else setActiveProject(null)
    } catch (e) {
      console.error(e)
    }
  }

  const createProject = async (name) => {
    const { data } = await api.post('/project/create', {
      name,
      workspaceId: activeWorkspace._id,
    })
    setProjects(prev => [...prev, data])
    setActiveProject(data)
    return data
  }
  const deleteProject = async (projectId) => {
  await api.delete(`/project/${projectId}`)
  setProjects(prev => prev.filter(p => p._id !== projectId))
  if (activeProject?._id === projectId) setActiveProject(null)
}
const addMember = async (email, role) => {
  const { data } = await api.post('/workspace/add-member', {
    workspaceId: activeWorkspace._id,
    email,
    role,
  })
  await fetchWorkspaces()
  return data
}

return (
  <WorkspaceContext.Provider value={{
    workspaces, activeWorkspace, setActiveWorkspace,
    projects, activeProject, setActiveProject,
    loading, fetchWorkspaces, createWorkspace,
    createProject, deleteProject, addMember,
  }}>
    {children}
  </WorkspaceContext.Provider>
)
}

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be inside WorkspaceProvider')
  return ctx
}