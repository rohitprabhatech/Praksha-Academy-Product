import {
 FiActivity,
 FiArchive,
 FiBookOpen,
 FiCalendar,
 FiCreditCard,
 FiFileText,
 FiGrid,
 FiImage,
 FiMessageCircle,
 FiSettings,
 FiTrendingUp,
 FiUser,
 FiUserPlus,
 FiUsers,
} from 'react-icons/fi'

export const adminTokens = {
 colors: {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  sidebarLight: '#FFFFFF',
  sidebarDark: '#0F172A',
  sidebarText: '#10233F',
  sidebarMuted: '#43627F',
  sidebarBorder: 'rgba(37, 99, 235, 0.16)',
  accent: '#F59E0B',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#0891B2',
  borderLight: 'rgba(15, 23, 42, 0.1)',
  borderDark: 'rgba(255, 255, 255, 0.12)',
 },
 radius: {
  card: 2,
  control: 1.5,
 },
 shadow: {
  light: '0 8px 24px rgba(15, 23, 42, 0.04)',
  dark: '0 10px 28px rgba(0, 0, 0, 0.22)',
 },
}

export const adminIdentity = {
 name: 'Admin',
 role: 'Administrator',
 email: 'admin@praksha.academy',
 phone: '+91 90000 00000',
 department: 'Administration',
 location: 'Praksha Academy',
}

export const adminNavGroups = [
 {
  title: 'Overview',
  items: [{ label: 'Dashboard', path: '/admin/dashboard', icon: FiGrid }],
 },
 {
  title: 'Users',
  items: [
   { label: 'Students', path: '/admin/students', icon: FiUsers, disabled: true },
   { label: 'Teachers', path: '/admin/teachers', icon: FiUser, disabled: true },
  ],
 },
 {
  title: 'Academic',
  items: [
   { label: 'Classes', path: '/admin/classes', icon: FiArchive, disabled: true },
   { label: 'Subjects', path: '/admin/subjects', icon: FiFileText, disabled: true },
   { label: 'Courses', path: '/admin/courses', icon: FiBookOpen, disabled: true },
  ],
 },
 {
  title: 'Learning',
  items: [
   { label: 'Materials', path: '/admin/materials', icon: FiFileText, disabled: true },
   { label: 'Live Classes', path: '/admin/live-classes', icon: FiCalendar, disabled: true },
   { label: 'Assignments', path: '/admin/assignments', icon: FiArchive, disabled: true },
   { label: 'Exams', path: '/admin/exams', icon: FiFileText, disabled: true },
  ],
 },
 {
  title: 'Sales',
  items: [
   { label: 'Enrollments', path: '/admin/enrollments', icon: FiActivity, disabled: true },
   { label: 'Payments', path: '/admin/payments', icon: FiCreditCard, disabled: true },
   { label: 'Coupons', path: '/admin/coupons', icon: FiArchive, disabled: true },
  ],
 },
 {
  title: 'Content',
  items: [
   { label: 'Blog', path: '/admin/blog', icon: FiFileText, disabled: true },
   { label: 'Gallery', path: '/admin/gallery', icon: FiImage, disabled: true },
   { label: 'FAQ', path: '/admin/faq', icon: FiMessageCircle, disabled: true },
   { label: 'Testimonials', path: '/admin/testimonials', icon: FiUserPlus, disabled: true },
  ],
 },
 {
  title: 'Communication',
  items: [
   { label: 'Notifications', path: '/admin/notifications', icon: FiMessageCircle, disabled: true },
   { label: 'Contact Messages', path: '/admin/contact-messages', icon: FiMessageCircle, disabled: true },
  ],
 },
 {
  title: 'Reports',
  items: [{ label: 'Reports', path: '/admin/reports', icon: FiTrendingUp, disabled: true }],
 },
 {
  title: 'Settings',
  items: [
   { label: 'Profile', path: '/admin/profile', icon: FiUser },
   { label: 'Settings', path: '/admin/settings', icon: FiSettings },
  ],
 },
]

export const dashboardStats = [
 {
  title: 'Total Students',
  value: '4,820',
  change: '+12.4%',
  detail: 'Compared with last month',
  trend: 'up',
  icon: FiUsers,
 },
 {
  title: 'Total Teachers',
  value: '128',
  change: '+8 new',
  detail: 'vs last month',
  trend: 'up',
  icon: FiUser,
 },
 {
  title: 'Total Courses',
  value: '312',
  change: '+18.2%',
  detail: 'vs last month',
  trend: 'up',
  icon: FiBookOpen,
 },
 {
  title: 'Total Revenue',
  value: '₹24.8L',
  change: '+15.8%',
  detail: 'vs last quarter',
  trend: 'up',
  icon: FiCreditCard,
 },
 {
  title: 'New Enrollments',
  value: '486',
  change: '+42 today',
  detail: 'New students in 30 days',
  trend: 'up',
  icon: FiUserPlus,
 },
 {
  title: 'Active Students',
  value: '3,964',
  change: '82.2%',
  detail: 'Learning this week',
  trend: 'neutral',
  icon: FiActivity,
 },
]

export const revenueData = [
 { month: 'Jan', revenue: 4.2, target: 3.8 },
 { month: 'Feb', revenue: 5.1, target: 4.2 },
 { month: 'Mar', revenue: 6.4, target: 5.2 },
 { month: 'Apr', revenue: 7.8, target: 6.4 },
 { month: 'May', revenue: 9.2, target: 7.5 },
 { month: 'Jun', revenue: 10.7, target: 8.6 },
]

export const studentGrowthData = [
 { month: 'Jan', active: 2300, new: 210 },
 { month: 'Feb', active: 2640, new: 280 },
 { month: 'Mar', active: 2980, new: 320 },
 { month: 'Apr', active: 3340, new: 360 },
 { month: 'May', active: 3710, new: 390 },
 { month: 'Jun', active: 3964, new: 486 },
]

export const courseEnrollmentData = [
 { name: 'Class 10', enrollments: 980 },
 { name: 'Class 12', enrollments: 820 },
 { name: 'JEE', enrollments: 640 },
 { name: 'NEET', enrollments: 590 },
 { name: 'Foundation', enrollments: 430 },
]

export const recentActivities = [
 {
  title: 'Class 10 Science evening batch was scheduled',
  description: 'New batch created by academic operations.',
  time: '12 min ago',
  type: 'info',
 },
 {
  title: '₹18,500 collected from 4 enrollments',
  description: 'Payment received through online checkout.',
  time: '36 min ago',
  type: 'success',
 },
 {
  title: 'Teacher availability slots were updated',
  description: 'Profile availability details were refreshed.',
  time: '1 hr ago',
  type: 'warning',
 },
 {
  title: 'Physics crash course is awaiting approval',
  description: 'Course review pending for publishing.',
  time: '2 hrs ago',
  type: 'error',
 },
]

export const upcomingClasses = [
 { subject: 'Mathematics Revision', teacher: 'Math Faculty', date: 'Aug 12', time: '5:00 PM', status: 'Scheduled' },
 { subject: 'Physics Numericals', teacher: 'Physics Faculty', date: 'Aug 12', time: '7:30 PM', status: 'Live Soon' },
 { subject: 'Organic Chemistry', teacher: 'Chemistry Faculty', date: 'Aug 13', time: '6:00 PM', status: 'Scheduled' },
]

export const notifications = [
 { title: 'Monthly revenue report is ready', time: '10 min ago' },
 { title: '5 teacher profiles need verification', time: '42 min ago' },
 { title: 'Backup completed successfully', time: 'Today, 9:00 AM' },
]
