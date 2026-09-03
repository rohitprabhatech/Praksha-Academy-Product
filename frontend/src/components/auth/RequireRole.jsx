import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { roleMatchesAllowed } from '../../constants/roles'

const RequireRole = ({ allowedRoles, loginPath = '/login' }) => {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />
  }

  if (!roleMatchesAllowed(role, allowedRoles)) {
    return <Navigate to="/access-denied" replace />
  }

  return <Outlet />
}

export default RequireRole
