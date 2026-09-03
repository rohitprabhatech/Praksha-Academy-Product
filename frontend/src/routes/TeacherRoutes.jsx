import { Routes, Route } from 'react-router-dom'
import RequireAuth from '../components/auth/RequireAuth'
import RequireRole from '../components/auth/RequireRole'
import { TEACHER_ROLES } from '../constants/roles'
import TeacherDashboard from '../pages/teacher/Dashboard'

function TeacherRoutes() {
  return (
    <Routes>
      <Route element={<RequireAuth loginPath="/login" />}>
        <Route element={<RequireRole allowedRoles={TEACHER_ROLES} />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="*" element={<TeacherDashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default TeacherRoutes
