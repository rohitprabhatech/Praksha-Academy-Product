import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Courses from '../pages/Courses'
import CourseDetails from '../pages/CourseDetails'
import Programs from '../pages/Programs'
import About from '../pages/About'
import Blog from '../pages/Blog'
import BlogDetail from '../pages/BlogDetail'
import Contact from '../pages/Contact'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import Terms from '../pages/Terms'
import RefundPolicy from '../pages/RefundPolicy'
import NotFound from '../pages/NotFound'

// Auth
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import VerifyOtp from '../pages/auth/VerifyOtp'
import ResetPassword from '../pages/auth/ResetPassword'
import AccessDenied from '../pages/auth/AccessDenied'
import Unauthorized from '../pages/auth/Unauthorized'
import RequireAuth from '../components/auth/RequireAuth'
import RequireRole from '../components/auth/RequireRole'
import { STUDENT_ROLES } from '../constants/roles'

// Student
import StudentLayout from '../layouts/StudentLayout'
import StudentDashboard from '../pages/student/Dashboard'
import MyCourses from '../pages/student/MyCourses'
import Wishlist from '../pages/student/Wishlist'
import Certificates from '../pages/student/Certificates'
import StudentNotifications from '../pages/student/Notifications'
import StudentProfile from '../pages/student/Profile'

// Admin / Teacher
import AdminRoutes from './AdminRoutes'
import TeacherRoutes from './TeacherRoutes'
import PlatformRoutes from './PlatformRoutes'

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public / Marketing ───────────────────────────────── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetails />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
      </Route>

      {/* ── Auth ─────────────────────────────────────────────── */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ── Student (auth + role guards) ─────────────────────── */}
      <Route element={<RequireAuth loginPath="/login" />}>
        <Route element={<RequireRole allowedRoles={STUDENT_ROLES} />}>
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<MyCourses />} />
            <Route path="/student/wishlist" element={<Wishlist />} />
            <Route path="/student/certificates" element={<Certificates />} />
            <Route path="/student/notifications" element={<StudentNotifications />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
          </Route>
        </Route>
      </Route>

      {/* ── Teacher ──────────────────────────────────────────── */}
      <Route path="/teacher/*" element={<TeacherRoutes />} />

      {/* ── Prabha Technology (Master Admin) ─────────────────── */}
      <Route path="/platform/*" element={<PlatformRoutes />} />

      {/* ── Admin / Owner ────────────────────────────────────── */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* ── 404 ──────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
