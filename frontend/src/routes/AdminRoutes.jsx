import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import NotFound from '../pages/NotFound'

// ── Core pages ────────────────────────────────────────────────────────────────
import AdminLogin from '../pages/admin/Login/AdminLogin'
import Dashboard from '../pages/admin/Dashboard/Dashboard'
import AdminProfile from '../pages/admin/Profile/AdminProfile'
import AdminSettings from '../pages/admin/Settings/AdminSettings'

// ── Blog ─────────────────────────────────────────────────────────────────────
import BlogList from '../pages/admin/Blog/BlogList'
import CreateBlog from '../pages/admin/Blog/CreateBlog'
import EditBlog from '../pages/admin/Blog/EditBlog'
import BlogDetails from '../pages/admin/Blog/BlogDetails'

// ── Gallery ───────────────────────────────────────────────────────────────────
import GalleryList from '../pages/admin/Gallery/GalleryList'
import AddImage from '../pages/admin/Gallery/AddImage'
import AddVideo from '../pages/admin/Gallery/AddVideo'

// ── FAQ ───────────────────────────────────────────────────────────────────────
import FAQList from '../pages/admin/FAQ/FAQList'
import AddFAQ from '../pages/admin/FAQ/AddFAQ'
import EditFAQ from '../pages/admin/FAQ/EditFAQ'

// ── Testimonials ──────────────────────────────────────────────────────────────
import TestimonialsList from '../pages/admin/Testimonials/TestimonialsList'
import AddTestimonial from '../pages/admin/Testimonials/AddTestimonial'
import EditTestimonial from '../pages/admin/Testimonials/EditTestimonial'

// ── Notifications ─────────────────────────────────────────────────────────────
import NotificationList from '../pages/admin/Notifications/NotificationList'
import CreateNotification from '../pages/admin/Notifications/CreateNotification'

// ── Contact Messages ──────────────────────────────────────────────────────────
import ContactMessagesList from '../pages/admin/ContactMessages/ContactMessagesList'
import MessageDetails from '../pages/admin/ContactMessages/MessageDetails'

// ── Reports ───────────────────────────────────────────────────────────────────
import StudentReports from '../pages/admin/Reports/StudentReports'
import CourseReports from '../pages/admin/Reports/CourseReports'
import RevenueReports from '../pages/admin/Reports/RevenueReports'
import PerformanceReports from '../pages/admin/Reports/PerformanceReports'

/**
 * AdminRoutes
 * All /admin/* routes live here, sharing the single AdminLayout shell
 * (unified sidebar + TopNavbar). This is the canonical routing file for Sprint 04+.
 */
function AdminRoutes() {
  return (
    <Routes>
      {/* Login — outside layout */}
      <Route path="login" element={<AdminLogin />} />

      {/* Protected shell — all pages inside AdminLayout */}
      <Route element={<AdminLayout />}>
        {/* Redirect /admin → /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* ── Overview ──────────────────────────────────────── */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* ── Settings group ────────────────────────────────── */}
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />

        {/* ── Content ───────────────────────────────────────── */}
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/create" element={<CreateBlog />} />
        <Route path="blog/:id/edit" element={<EditBlog />} />
        <Route path="blog/:id" element={<BlogDetails />} />

        <Route path="gallery" element={<GalleryList />} />
        <Route path="gallery/add-image" element={<AddImage />} />
        <Route path="gallery/add-video" element={<AddVideo />} />

        <Route path="faq" element={<FAQList />} />
        <Route path="faq/add" element={<AddFAQ />} />
        <Route path="faq/:id/edit" element={<EditFAQ />} />

        <Route path="testimonials" element={<TestimonialsList />} />
        <Route path="testimonials/add" element={<AddTestimonial />} />
        <Route path="testimonials/:id/edit" element={<EditTestimonial />} />

        {/* ── Communication ─────────────────────────────────── */}
        <Route path="notifications" element={<NotificationList />} />
        <Route path="notifications/create" element={<CreateNotification />} />

        <Route path="contact-messages" element={<ContactMessagesList />} />
        <Route path="contact-messages/:id" element={<MessageDetails />} />

        {/* ── Reports ───────────────────────────────────────── */}
        <Route path="reports/students" element={<StudentReports />} />
        <Route path="reports/courses" element={<CourseReports />} />
        <Route path="reports/revenue" element={<RevenueReports />} />
        <Route path="reports/performance" element={<PerformanceReports />} />
      </Route>

      {/* Catch-all — prevents 404 for unknown /admin/* paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AdminRoutes