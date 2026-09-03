/**
 * Default public-website content for a tenant academy.
 * Owners edit a copy of this structure from /admin/website/*.
 */

import logoMark from '../assets/praksha-mark.png'
import heroLearning from '../assets/hero-learning.jpg'

export const DEFAULT_TENANT_ID = 'mock-tenant-a'

export function createDefaultWebsiteContent(academyName = 'Praksha Academy') {
  return {
    version: 1,
    branding: {
      academyName,
      shortName: academyName.split(' ')[0] || academyName,
      tagline: 'Learn · Build · Succeed',
      logoUrl: logoMark,
      heroImageUrl: heroLearning,
      primaryColor: '#2563EB',
    },
    navigation: [
      { id: 'home', label: 'Home', path: '/', visible: true },
      { id: 'courses', label: 'Courses', path: '/courses', visible: true },
      { id: 'programs', label: 'Programs', path: '/programs', visible: true },
      { id: 'blog', label: 'Blog', path: '/blog', visible: true },
      { id: 'about', label: 'About', path: '/about', visible: true },
      { id: 'contact', label: 'Contact', path: '/contact', visible: true },
    ],
    home: {
      heroEyebrow: 'Mentor-led learning',
      heroTitle: `${academyName} helps students learn with clarity`,
      heroSubtitle:
        'Live classes, structured practice, and mentors who track progress — for school, skills, and careers.',
      heroCtaLabel: 'Explore courses',
      heroCtaPath: '/courses',
      secondaryCtaLabel: 'Talk to us',
      secondaryCtaPath: '/contact',
      highlights: [
        'Live mentoring for every student',
        'Career-ready programming and English tracks',
        'Structured revision for exam success',
      ],
      sectionTitles: {
        featuredCourses: 'Featured courses',
        programs: 'Learning paths',
        teachers: 'Meet mentors',
        testimonials: 'What learners say',
      },
    },
    coursesPage: {
      title: 'Courses',
      subtitle: 'Browse programs by class, skill, and career track.',
      emptyMessage: 'No courses published yet. Check back soon.',
    },
    programs: {
      title: 'Programs',
      subtitle: 'Cohort-based tracks designed for steady progress.',
      items: [
        {
          id: 'prog-1',
          title: 'Career Foundation',
          description:
            'English, logic, and study habits that support long-term academic growth.',
        },
        {
          id: 'prog-2',
          title: 'Programming Acceleration',
          description:
            'Coding practice and project work for modern software skills.',
        },
        {
          id: 'prog-3',
          title: 'Exam Readiness',
          description:
            'Focused preparation with strategy, mocks, and review sessions.',
        },
      ],
    },
    about: {
      title: 'About us',
      subtitle: 'Who we are and how we teach.',
      whoWeAre: {
        story: `${academyName} teaches Class 8–12 academics alongside English communication and career-focused tech courses.`,
        belief:
          'Students learn best with structure, direct feedback, and a teacher who has time for questions.',
        approach:
          'Courses combine live instruction, practice, and progress tracking so learners know where they stand.',
      },
      differentiators: [
        {
          id: 'diff-1',
          title: 'Concept-first learning',
          description: 'Start with the idea, then practice — so knowledge transfers.',
        },
        {
          id: 'diff-2',
          title: 'Mentor-led guidance',
          description: 'Teachers track individual progress across a batch.',
        },
        {
          id: 'diff-3',
          title: 'Practice over passive watching',
          description: 'Exercises, projects, and problem sets drive the schedule.',
        },
      ],
    },
    contact: {
      title: 'Contact',
      subtitle: 'Reach the academy team for admissions and support.',
      email: 'support@example.com',
      phone: '+91 90000 00000',
      whatsapp: '',
      address: 'Update your academy address in Website settings',
      city: '',
      state: '',
      postalCode: '',
      mapUrl: '',
      workingHours: [
        { id: 'wh-1', day: 'Monday – Friday', time: '9:00 AM – 7:00 PM' },
        { id: 'wh-2', day: 'Saturday', time: '10:00 AM – 5:00 PM' },
        { id: 'wh-3', day: 'Sunday', time: 'Closed' },
      ],
      programInterests: [
        'Class 8–10',
        'Class 11–12',
        'Programming',
        'Spoken English',
        'Other',
      ],
    },
    footer: {
      blurb: `${academyName} provides mentor-led learning for school and career growth.`,
      socialLinks: {
        instagram: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        twitter: '',
      },
    },
    blogPage: {
      title: 'Blog',
      subtitle: 'Updates, tips, and academy news.',
    },
    updatedAt: null,
    publishedAt: null,
  }
}
