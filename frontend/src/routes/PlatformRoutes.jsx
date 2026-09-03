import { Navigate, Route, Routes } from 'react-router-dom'
import RequireAuth from '../components/auth/RequireAuth'
import RequireRole from '../components/auth/RequireRole'
import { PLATFORM_ROLES } from '../constants/roles'
import PlatformLayout from '../layouts/PlatformLayout'
import PlatformDashboard from '../pages/platform/Dashboard'
import RegistrationRequests from '../pages/platform/RegistrationRequests'
import AcademiesList from '../pages/platform/Academies'

function PlatformRoutes() {
  return (
    <Routes>
      <Route element={<RequireAuth loginPath="/login" />}>
        <Route element={<RequireRole allowedRoles={PLATFORM_ROLES} />}>
          <Route element={<PlatformLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PlatformDashboard />} />
            <Route path="requests" element={<RegistrationRequests />} />
            <Route path="academies" element={<AcademiesList />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default PlatformRoutes
