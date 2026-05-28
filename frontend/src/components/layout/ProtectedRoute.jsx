import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AppLayout } from './AppLayout'
import { WorkspaceProvider } from '../../context/WorkspaceContext'

export function ProtectedRoute() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  return (
    <WorkspaceProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </WorkspaceProvider>
  )
}