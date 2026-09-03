import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import NotFound from '../pages/NotFound'
import RequireAuth from '../components/auth/RequireAuth'
import RequireRole from '../components/auth/RequireRole'
import { OWNER_ROLES } from '../constants/roles'

import Dashboard from '../pages/admin/Dashboard/Dashboard'
import AdminProfile from '../pages/admin/Profile/AdminProfile'
import AdminSettings from '../pages/admin/Settings/AdminSettings'

import BlogList from '../pages/admin/Blog/BlogList'
import CreateBlog from '../pages/admin/Blog/CreateBlog'
import EditBlog from '../pages/admin/Blog/EditBlog'
import BlogDetails from '../pages/admin/Blog/BlogDetails'

import GalleryList from '../pages/admin/Gallery/GalleryList'
import AddImage from '../pages/admin/Gallery/AddImage'
import AddVideo from '../pages/admin/Gallery/AddVideo'

import FAQList from '../pages/admin/FAQ/FAQList'
import AddFAQ from '../pages/admin/FAQ/AddFAQ'
import EditFAQ from '../pages/admin/FAQ/EditFAQ'

import TestimonialsList from '../pages/admin/Testimonials/TestimonialsList'
import AddTestimonial from '../pages/admin/Testimonials/AddTestimonial'
import EditTestimonial from '../pages/admin/Testimonials/EditTestimonial'

import NotificationList from '../pages/admin/Notifications/NotificationList'
import CreateNotification from '../pages/admin/Notifications/CreateNotification'

import ContactMessagesList from '../pages/admin/ContactMessages/ContactMessagesList'
import MessageDetails from '../pages/admin/ContactMessages/MessageDetails'

import StudentReports from '../pages/admin/Reports/StudentReports'
import CourseReports from '../pages/admin/Reports/CourseReports'
import RevenueReports from '../pages/admin/Reports/RevenueReports'
import PerformanceReports from '../pages/admin/Reports/PerformanceReports'

import WebsiteOverview from '../pages/admin/Website/WebsiteOverview'
import BrandingEditor from '../pages/admin/Website/BrandingEditor'
import NavigationEditor from '../pages/admin/Website/NavigationEditor'
import HomeEditor from '../pages/admin/Website/HomeEditor'
import CoursesPageEditor from '../pages/admin/Website/CoursesPageEditor'
import ProgramsEditor from '../pages/admin/Website/ProgramsEditor'
import AboutEditor from '../pages/admin/Website/AboutEditor'
import ContactEditor from '../pages/admin/Website/ContactEditor'

/**
 * Admin / Owner routes (/admin/*).
 * Q-01 interim: Owner uses Admin UI paths.
 */
function AdminRoutes() {
  return (
    <Routes>
      {/* Unified login — keep old URL working */}
      <Route path="login" element={<Navigate to="/login" replace />} />

      <Route element={<RequireAuth loginPath="/login" />}>
        <Route element={<RequireRole allowedRoles={OWNER_ROLES} loginPath="/login" />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />

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

            <Route path="notifications" element={<NotificationList />} />
            <Route path="notifications/create" element={<CreateNotification />} />

            <Route path="contact-messages" element={<ContactMessagesList />} />
            <Route path="contact-messages/:id" element={<MessageDetails />} />

            <Route path="reports/students" element={<StudentReports />} />
            <Route path="reports/courses" element={<CourseReports />} />
            <Route path="reports/revenue" element={<RevenueReports />} />
            <Route path="reports/performance" element={<PerformanceReports />} />

            {/* Tenant public website CMS */}
            <Route path="website" element={<WebsiteOverview />} />
            <Route path="website/branding" element={<BrandingEditor />} />
            <Route path="website/navigation" element={<NavigationEditor />} />
            <Route path="website/home" element={<HomeEditor />} />
            <Route path="website/courses" element={<CoursesPageEditor />} />
            <Route path="website/programs" element={<ProgramsEditor />} />
            <Route path="website/about" element={<AboutEditor />} />
            <Route path="website/contact" element={<ContactEditor />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AdminRoutes
