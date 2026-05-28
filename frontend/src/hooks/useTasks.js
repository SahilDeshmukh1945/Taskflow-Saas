import { useState, useEffect, useCallback } from 'react'
import api from '../lib/api'

export function useTasks(projectId) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async (filters = {}) => {
    if (!projectId) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo)
      const { data } = await api.get(`/task/${projectId}?${params}`)
      setTasks(data)
      setError(null)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (payload) => {
    const { data } = await api.post('/task/create', {
      ...payload,
      projectId,
    })
    setTasks(prev => [data, ...prev])
    return data
  }

  const updateTask = async (taskId, payload) => {
    const { data } = await api.put(`/task/${taskId}`, payload)
    setTasks(prev => prev.map(t => t._id === taskId ? data : t))
    return data
  }

  const deleteTask = async (taskId) => {
    await api.delete(`/task/${taskId}`)
    setTasks(prev => prev.filter(t => t._id !== taskId))
  }

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask }
}