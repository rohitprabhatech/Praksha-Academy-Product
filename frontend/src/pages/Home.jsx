import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiSearch,
  FiStar,
  FiUser,
  FiUsers,
} from 'react-icons/fi'
import courses from '../data/courses'
import { testimonialData } from '../constants/siteData'
import { useWebsite } from '../context/WebsiteContext'
import './Home.css'
import heroLearning from '../assets/hero-learning.jpg'


const learningPaths = [
  { title: 'Web Developer', steps: ['Fundamentals', 'Frontend', 'Backend', 'Projects'] },
  { title: 'Python Developer', steps: ['Python', 'Problem Solving', 'Applications', 'Projects'] },
  { title: 'Data Scientist', steps: ['Python', 'Statistics', 'Data Analysis', 'ML'] },
  { title: 'Cloud Engineer', steps: ['Cloud Basics', 'AWS', 'Deployment', 'Projects'] },
]

// Mock/sample data only — no live-session backend exists yet.
// Shape: { date, title, type, time, instructor }. Replace with real
// session/event API data once available.
const upcomingSessions = [
  { date: 'AUG 18', title: 'React Fundamentals', type: 'Live Workshop', time: '7:00 PM', instructor: 'Rohan Mehta' },
  { date: 'AUG 22', title: 'Python Project Q&A', type: 'Live Q&A', time: '6:30 PM', instructor: 'Sneha Kapoor' },
  { date: 'AUG 27', title: 'Cloud Deployment Basics', type: 'Live Class', time: '7:30 PM', instructor: 'Vikram Rao' },
]

const featuredCourses = courses
  .filter((course) => ['Web Development', 'Programming', 'Data Science', 'AI'].includes(course.category))
  .slice(0, 4)

const popularThisWeek = featuredCourses.slice(0, 4)

const featuredTeachers = Object.values(
  courses.reduce((teachers, course) => {
    if (!teachers[course.instructor]) {
      teachers[course.instructor] = course.instructorDetails
    }
    return teachers
  }, {})
).slice(0, 3)

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const dailyQuotes = [
  {
    quote: 'The expert in anything was once a beginner.',
    author: 'Helen Hayes',
  },
  {
    quote: 'Learning never exhausts the mind.',
    author: 'Leonardo da Vinci',
  },
  {
    quote: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
  },
  {
    quote: 'The beautiful thing about learning is that nobody can take it away from you.',
    author: 'B. B. King',
  },
  {
    quote: 'Great things are done by a series of small things brought together.',
    author: 'Vincent van Gogh',
  },
  {
    quote: 'Education is the most powerful weapon which you can use to change the world.',
    author: 'Nelson Mandela',
  },
  {
    quote: 'The future belongs to those who learn more skills and combine them in creative ways.',
    author: 'Robert Greene',
  },
]

function getDailyQuote() {
  const today = new Date()

  const startOfYear = new Date(today.getFullYear(), 0, 0)
  const difference = today - startOfYear
  const dayOfYear = Math.floor(difference / (1000 * 60 * 60 * 24))

  return dailyQuotes[dayOfYear % dailyQuotes.length]
}

function Home() {
  const trendingTrackRef = useRef(null)
  const dailyQuote = getDailyQuote()
  const { content, branding } = useWebsite()
  const home = content?.home
  const academyName = branding?.academyName || 'Praksha Academy'

  const scrollTrendingCourses = (direction) => {
    const track = trendingTrackRef.current
    if (!track) return
    const card = track.querySelector('.home-course-card')
    const cardWidth = card?.getBoundingClientRect().width || 280
    track.scrollBy({ left: direction * (cardWidth + 22), behavior: 'smooth' })
  }

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="home-hero-container">

          {/* LEFT CONTENT */}
          <div className="home-hero-content">

            <span className="home-hero-eyebrow">
              {(home?.heroEyebrow || 'PRACTICAL TECHNOLOGY LEARNING').toUpperCase()}
            </span>

            <h1>
              {home?.heroTitle ? (
                home.heroTitle
              ) : (
                <>
                  Learn today.
                  <br />
                  Build <span>tomorrow.</span>
                </>
              )}
            </h1>

            <p className="home-hero-description">
              {home?.heroSubtitle ||
                'Practical courses, real projects and expert guidance to help you build skills that shape your future.'}
            </p>

            {/* SEARCH */}
            <div className="home-hero-search">
              <div className="home-search-input">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  placeholder="What do you want to learn?"
                />
              </div>

              <button>Search</button>
            </div>

            {/* ACTIONS */}
            <div className="home-hero-actions">
              <Link to={home?.heroCtaPath || '/courses'} className="hero-primary-btn">
                {home?.heroCtaLabel || 'Explore Courses'}
                <span>→</span>
              </Link>

              <Link to={home?.secondaryCtaPath || '/programs'} className="hero-secondary-btn">
                {home?.secondaryCtaLabel || 'View Learning Paths'}
                <span>→</span>
              </Link>
            </div>

          </div>


          {/* RIGHT - LEARNING JOURNEY */}
          <div className="home-hero-visual">

            <div className="learning-journey">

              <div className="journey-decoration"></div>

              <div className="journey-line"></div>

              {/* STEP 01 */}
              <div className="journey-step active">
                <div className="journey-number">01</div>

                <div className="journey-content">
                  <strong>Learn</strong>
                  <small>Build your foundation</small>
                </div>
              </div>

              {/* STEP 02 */}
              <div className="journey-step">
                <div className="journey-number">02</div>

                <div className="journey-content">
                  <strong>Practice</strong>
                  <small>Turn knowledge into skill</small>
                </div>
              </div>

              {/* STEP 03 */}
              <div className="journey-step">
                <div className="journey-number">03</div>

                <div className="journey-content">
                  <strong>Build</strong>
                  <small>Create real projects</small>
                </div>
              </div>

              {/* STEP 04 */}
              <div className="journey-step">
                <div className="journey-number">04</div>

                <div className="journey-content">
                  <strong>Grow</strong>
                  <small>Keep improving</small>
                </div>
              </div>

              {/* STEP 05 */}
              <div className="journey-step success">
                <div className="journey-number">05</div>

                <div className="journey-content">
                  <strong>Success</strong>
                  <small>Turn skills into opportunities</small>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      <section className="home-section home-trending-section">
        <div className="section-wrapper">
          <div className="home-course-section-top">
            <div className="home-section-header">
              <span>Trending Courses</span>
              <h2>Courses learners choose first</h2>
              <p>Explore practical programs with clear outcomes, real course pages and structured lesson plans.</p>
            </div>

            <div className="home-course-arrows" aria-label="Trending course carousel controls">
              <button type="button" onClick={() => scrollTrendingCourses(-1)} aria-label="Previous courses">
                <FiArrowRight aria-hidden="true" />
              </button>
              <button type="button" onClick={() => scrollTrendingCourses(1)} aria-label="Next courses">
                <FiArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="home-course-grid" ref={trendingTrackRef}>
            {featuredCourses.map((course) => (
              <article className="home-course-card" key={course.id}>
                <Link to={`/courses/${course.slug}`} className="home-course-image-link" aria-label={`View ${course.title}`}>
                  <img src={course.image} alt={course.title} loading="lazy" />
                  {course.badge && <span>{course.badge}</span>}
                </Link>
                <div className="home-course-body">
                  <span className="home-course-category">{course.category}</span>
                  <h3>
                    <Link to={`/courses/${course.slug}`}>{course.title}</Link>
                  </h3>
                  <div className="home-course-instructor">
                    <FiUser aria-hidden="true" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="home-course-meta">
                    <span className="home-course-rating">
                      <FiStar aria-hidden="true" />
                      {course.rating}
                    </span>
                    <span className="home-course-reviews">{course.reviews.toLocaleString()} ratings</span>
                  </div>
                  <div className="home-course-footer">
                    <strong>₹{course.price.toLocaleString('en-IN')}.00</strong>
                    <Link to={`/courses/${course.slug}`}>
                      View Course
                      <FiArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section className="home-section">
        <div className="section-wrapper">
          <div className="home-section-header home-path-header">
            <div>
              <span>Your Learning Journey</span>
              <h2>Choose a path. Build your future.</h2>
              <p>Follow a practical roadmap from fundamentals to real projects.</p>
            </div>


          </div>

          <div className="home-path-list">
            {learningPaths.map((path) => (
              <article className="home-path-row" key={path.title}>
                <div className="home-path-number">
                  {String(learningPaths.indexOf(path) + 1).padStart(2, '0')}
                </div>

                <div className="home-path-main">
                  <h3>{path.title}</h3>

                  <div className="home-path-steps">
                    {path.steps.map((step, index) => (
                      <span key={step}>
                        {step}
                        {index < path.steps.length - 1 && (
                          <FiArrowRight aria-hidden="true" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <Link to="/programs" className="home-path-action">
                  View roadmap
                  <FiArrowRight aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="live-sessions-section">
        <div className="live-sessions-container">

          <div className="live-sessions-header">
            <div>
              <span className="section-eyebrow">LEARN TOGETHER</span>

              <h2>Learn together, live.</h2>

              <p>
                Join live sessions, workshops and Q&A events designed to
                help you learn by doing.
              </p>
            </div>

            <button className="view-all-sessions">
              View all sessions <span>→</span>
            </button>
          </div>


          <div className="sessions-list">

            {/* Session 1 */}
            <div className="session-row">

              <div className="session-date">
                <span>AUG</span>
                <strong>18</strong>
                <small>MON</small>
              </div>

              <div className="session-main">

                <div className="session-status live">
                  <span></span>
                  LIVE
                </div>

                <h3>React Fundamentals</h3>

                <div className="session-meta">
                  <span>◷</span>
                  7:00 PM

                  <i></i>

                  <span>♙</span>
                  Rohan Mehta
                </div>

              </div>

              <div className="session-type workshop">
                <span>▣</span>
                LIVE WORKSHOP
              </div>

              <button className="session-action">
                View session <span>→</span>
              </button>

            </div>


            {/* Session 2 */}
            <div className="session-row">

              <div className="session-date">
                <span>AUG</span>
                <strong>22</strong>
                <small>FRI</small>
              </div>

              <div className="session-main">

                <div className="session-status upcoming">
                  <span></span>
                  UPCOMING
                </div>

                <h3>Python Project Q&amp;A</h3>

                <div className="session-meta">
                  <span>◷</span>
                  6:30 PM

                  <i></i>

                  <span>♙</span>
                  Sneha Kapoor
                </div>

              </div>

              <div className="session-type qa">
                <span>▢</span>
                LIVE Q&amp;A
              </div>

              <button className="session-action">
                View session <span>→</span>
              </button>

            </div>


            {/* Session 3 */}
            <div className="session-row">

              <div className="session-date">
                <span>AUG</span>
                <strong>27</strong>
                <small>WED</small>
              </div>

              <div className="session-main">

                <div className="session-status upcoming">
                  <span></span>
                  UPCOMING
                </div>

                <h3>Cloud Deployment Basics</h3>

                <div className="session-meta">
                  <span>◷</span>
                  7:30 PM

                  <i></i>

                  <span>♙</span>
                  Vikram Rao
                </div>

              </div>

              <div className="session-type class">
                <span>▣</span>
                LIVE CLASS
              </div>

              <button className="session-action">
                View session <span>→</span>
              </button>

            </div>

          </div>


          <div className="sessions-footer">
            <span>▣</span>
            All times are shown in IST
          </div>

        </div>
      </section>

      <section className="home-section home-why-section">
        <div className="section-wrapper">
          <div className="home-why-header">
            <span>Why {academyName}</span>
            <h2>More than courses. A better way to learn.</h2>
            <p>
              Learn through a structured experience designed to help you build real skills.
            </p>
          </div>

          <div className="home-benefit-grid">
            <article className="home-benefit-card">
              <FiBookOpen aria-hidden="true" />
              <h3>Practical Learning</h3>
              <p>Learn through useful exercises, examples and hands-on practice.</p>
            </article>

            <article className="home-benefit-card">
              <FiUsers aria-hidden="true" />
              <h3>Expert Mentors</h3>
              <p>Get guidance from experienced instructors when you need it.</p>
            </article>

            <article className="home-benefit-card">
              <FiBriefcase aria-hidden="true" />
              <h3>Real Projects</h3>
              <p>Apply what you learn by building practical projects.</p>
            </article>
          </div>

          <div className="home-benefit-proof">
            <span>Structured paths</span>
            <i aria-hidden="true">•</i>
            <span>Live sessions</span>
            <i aria-hidden="true">•</i>
            <span>Certificates</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-wrapper">
          <div className="home-section-header">
            <span>Meet Your Mentors</span>
            <h2>Learn from people who build.</h2>
            <p>Experienced mentors guide learners through practical courses and structured programs.</p>
          </div>

          <div className="home-teacher-grid">
            {featuredTeachers.map((teacher) => (
              <article className="home-teacher-card" key={teacher.name}>

                <div className="home-teacher-photo">
                  {teacher.image ? (
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="home-teacher-placeholder">
                      {getInitials(teacher.name)}
                    </div>
                  )}
                </div>

                <div className="home-teacher-info">
                  <span className="home-teacher-label">
                    Instructor
                  </span>

                  <h3>{teacher.name}</h3>

                  <p>{teacher.designation}</p>

                  <div className="home-teacher-meta">
                    <span>★ {teacher.rating}</span>
                    <span>{teacher.courses} courses</span>
                  </div>

                  <Link
                    to="/programs"
                    className="home-teacher-link"
                  >
                    View profile
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>

              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section-muted home-success-section">
        <div className="section-wrapper">

          <div className="home-section-header home-success-header">
            <span>Student Stories</span>
            <h2>From learning to building.</h2>
            <p>
              See how learners are turning new skills into real projects,
              confidence and progress.
            </p>
          </div>

          <article className="home-featured-story">

            <div className="home-story-photo">
              <div className="home-story-photo-placeholder">
                PS
              </div>
            </div>

            <div className="home-story-content">

              <span className="home-story-label">
                Learner Story
              </span>

              <blockquote>
                “I started with the basics, but the practical projects
                helped me understand how to actually build things.”
              </blockquote>

              <div className="home-story-author">
                <strong>Priya Sharma</strong>
                <span>Web Development Learner</span>
              </div>

              <div className="home-story-outcomes">

                <div>
                  <span>✓</span>
                  <div>
                    <strong>Completed</strong>
                    <small>Web Development Program</small>
                  </div>
                </div>

                <div>
                  <span>✓</span>
                  <div>
                    <strong>Built</strong>
                    <small>Portfolio Projects</small>
                  </div>
                </div>

              </div>

              <Link to="/programs" className="home-story-link">
                Read learner story
                <FiArrowRight aria-hidden="true" />
              </Link>

            </div>

          </article>

        </div>
      </section>

      <section className="home-final-cta">
        <div className="section-wrapper">
          <div className="home-final-cta-inner">
            <div>
              <span>Start today</span>
              <h2>Ready to Start Learning?</h2>
              <p>Explore practical courses and choose the program that matches your goals.</p>
            </div>
            <Link to="/courses" className="home-button home-button-primary">
              Explore Courses
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home