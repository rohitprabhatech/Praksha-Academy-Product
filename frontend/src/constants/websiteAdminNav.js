import { FiGlobe, FiImage, FiLayout, FiMail, FiNavigation, FiBookOpen, FiInfo, FiEdit3 } from 'react-icons/fi'

/**
 * Owner website CMS navigation (tenant public site).
 */
export const websiteNavItems = [
  { label: 'Overview', path: '/admin/website', icon: FiGlobe },
  { label: 'Branding', path: '/admin/website/branding', icon: FiImage },
  { label: 'Navigation', path: '/admin/website/navigation', icon: FiNavigation },
  { label: 'Home', path: '/admin/website/home', icon: FiLayout },
  { label: 'Courses page', path: '/admin/website/courses', icon: FiBookOpen },
  { label: 'Programs', path: '/admin/website/programs', icon: FiEdit3 },
  { label: 'About', path: '/admin/website/about', icon: FiInfo },
  { label: 'Contact', path: '/admin/website/contact', icon: FiMail },
]
