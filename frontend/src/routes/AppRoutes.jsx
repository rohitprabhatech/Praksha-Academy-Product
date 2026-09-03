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

// Student
import StudentLayout from '../layouts/StudentLayout'
import StudentDashboard from '../pages/student/Dashboard'
import MyCourses from '../pages/student/MyCourses'
import Wishlist from '../pages/student/Wishlist'
import Certificates from '../pages/student/Certificates'
import StudentNotifications from '../pages/student/Notifications'
import StudentProfile from '../pages/student/Profile'

// Admin — all /admin/* routes delegated to AdminRoutes
import AdminRoutes from './AdminRoutes'

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
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Route>

            {/* ── Auth ─────────────────────────────────────────────── */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* ── Student ──────────────────────────────────────────── */}
            <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/courses" element={<MyCourses />} />
                <Route path="/student/wishlist" element={<Wishlist />} />
                <Route path="/student/certificates" element={<Certificates />} />
                <Route path="/student/notifications" element={<StudentNotifications />} />
                <Route path="/student/profile" element={<StudentProfile />} />
            </Route>

            {/* ── Admin — all /admin/* delegated to AdminRoutes ────── */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* ── 404 ──────────────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes
