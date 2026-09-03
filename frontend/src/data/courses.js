const baseCourses = [
 {
  id: 1,
  slug: 'complete-web-development',
  title: 'Complete Web Development',
  category: 'Web Development',
  description: 'Master HTML, CSS, JavaScript and React by building real-world projects from scratch.',
  instructor: 'Praksha Academy',
  rating: 4.8,
  reviews: 1245,
  students: 3200,
  lessons: 48,
  duration: '18 hours',
  level: 'Beginner',
  createdAt: '2026-04-12',
  price: 999,
  originalPrice: 1499,
  badge: 'Bestseller',
  image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
 },
 {
  id: 2,
  slug: 'class-10-science-mastery',
  title: 'Class 10 Science Mastery',
  category: 'Class 10',
  description: 'Build strong concepts in physics, chemistry and biology with exam-focused practice lessons.',
  instructor: 'Praksha Academy',
  rating: 4.7,
  reviews: 986,
  students: 2850,
  lessons: 52,
  duration: '24 hours',
  level: 'Intermediate',
  createdAt: '2026-03-20',
  price: 799,
  originalPrice: 1199,
  badge: 'Popular',
  image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
 },
 {
  id: 3,
  slug: 'english-grammar-foundation',
  title: 'English Grammar Foundation',
  category: 'English Grammar',
  description: 'Improve grammar, sentence structure, vocabulary and writing accuracy for academic success.',
  instructor: 'Praksha Academy',
  rating: 4.6,
  reviews: 742,
  students: 2100,
  lessons: 36,
  duration: '12 hours',
  level: 'Beginner',
  createdAt: '2026-05-04',
  price: 599,
  originalPrice: 999,
  badge: 'New',
  image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
 },
 {
  id: 4,
  slug: 'spoken-english-confidence',
  title: 'Spoken English Confidence',
  category: 'Spoken English',
  description: 'Practice everyday conversations, pronunciation and presentation skills with guided activities.',
  instructor: 'Praksha Academy',
  rating: 4.9,
  reviews: 1138,
  students: 3400,
  lessons: 42,
  duration: '15 hours',
  level: 'Beginner',
  createdAt: '2026-06-02',
  price: 899,
  originalPrice: 1399,
  badge: 'Top Rated',
  image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
 },
 {
  id: 5,
  slug: 'python-programming-for-students',
  aliases: ['python-programming'],
  title: 'Python Programming for Students',
  category: 'Programming',
  description: 'Learn Python fundamentals, problem solving and mini projects designed for school learners.',
  instructor: 'Praksha Academy',
  rating: 4.8,
  reviews: 1320,
  students: 4100,
  lessons: 44,
  duration: '16 hours',
  level: 'Beginner',
  createdAt: '2026-02-15',
  price: 999,
  originalPrice: 1599,
  badge: 'Bestseller',
  image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80',
 },
 {
  id: 6,
  slug: 'ai-for-young-learners',
  title: 'AI for Young Learners',
  category: 'AI',
  description: 'Understand artificial intelligence, prompts, automation and ethical technology through simple projects.',
  instructor: 'Praksha Academy',
  rating: 4.7,
  reviews: 654,
  students: 1650,
  lessons: 30,
  duration: '10 hours',
  level: 'Beginner',
  createdAt: '2026-07-01',
  price: 1099,
  originalPrice: 1699,
  badge: 'Trending',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
 },
 {
  id: 7,
  slug: 'class-12-mathematics-board-prep',
  title: 'Class 12 Mathematics Board Prep',
  category: 'Class 12',
  description: 'Revise calculus, algebra and probability with structured lessons and board-style problem practice.',
  instructor: 'Praksha Academy',
  rating: 4.6,
  reviews: 824,
  students: 2300,
  lessons: 58,
  duration: '28 hours',
  level: 'Advanced',
  createdAt: '2026-01-18',
  price: 1199,
  originalPrice: 1899,
  badge: 'Exam Ready',
  image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80',
 },
 {
  id: 8,
  slug: 'data-science-starter-path',
  title: 'Data Science Starter Path',
  category: 'Data Science',
  description: 'Explore data analysis, visualization and statistics using practical datasets and beginner-friendly tools.',
  instructor: 'Praksha Academy',
  rating: 4.8,
  reviews: 576,
  students: 1480,
  lessons: 40,
  duration: '20 hours',
  level: 'Intermediate',
  createdAt: '2026-06-18',
  price: 1299,
  originalPrice: 1999,
  badge: 'Career Track',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
 },
 {
  id: 9,
  slug: 'class-8-maths-foundation',
  title: 'Class 8 Maths Foundation',
  category: 'Class 8',
  description: 'Strengthen number systems, algebra, geometry and practical maths with clear guided practice.',
  instructor: 'Aditya Kshirsagar',
  rating: 4.5,
  reviews: 438,
  students: 1250,
  lessons: 34,
  duration: '14 hours',
  level: 'Beginner',
  createdAt: '2026-07-15',
  price: 699,
  originalPrice: 999,
  badge: 'Foundation',
  image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80',
 },
 {
  id: 10,
  slug: 'class-9-science-concepts',
  title: 'Class 9 Science Concepts',
  category: 'Class 9',
  description: 'Learn motion, matter, cells and natural resources with visual explanations and regular quizzes.',
  instructor: 'Praksha Academy',
  rating: 4.6,
  reviews: 512,
  students: 1380,
  lessons: 38,
  duration: '17 hours',
  level: 'Beginner',
  createdAt: '2026-04-28',
  price: 749,
  originalPrice: 1099,
  badge: 'Concept Builder',
  image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=900&q=80',
 },
 {
  id: 11,
  slug: 'class-11-physics-essentials',
  title: 'Class 11 Physics Essentials',
  category: 'Class 11',
  description: 'Build confidence in mechanics, waves and thermodynamics through structured lessons and numericals.',
  instructor: 'Aditya Kshirsagar',
  rating: 4.7,
  reviews: 690,
  students: 1725,
  lessons: 46,
  duration: '22 hours',
  level: 'Intermediate',
  createdAt: '2026-05-26',
  price: 1099,
  originalPrice: 1599,
  badge: 'New',
  image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=900&q=80',
 },
]

const instructorProfiles = {
 'Aditya Kshirsagar': {
  name: 'Aditya Kshirsagar',
  designation: 'Senior Web Development Instructor',
  image: '',
  bio: 'Experienced educator focused on practical, project-based learning that helps students turn concepts into confident real-world execution.',
  rating: 4.8,
  students: 12450,
  courses: 8,
 },
 'Praksha Academy': {
  name: 'Praksha Academy',
  designation: 'Expert Learning Team',
  image: '',
  bio: 'A dedicated team of mentors designing structured learning paths for school learners, skill builders and career-focused students.',
  rating: 4.7,
  students: 18600,
  courses: 14,
 },
}

const categoryOutcomes = {
 'Web Development': [
  'Build responsive web pages using modern layout techniques.',
  'Understand HTML, CSS, JavaScript and React fundamentals.',
  'Work with reusable components and clean project structure.',
  'Create real-world interfaces that adapt across devices.',
  'Improve debugging and frontend problem-solving skills.',
  'Prepare portfolio-ready projects with practical workflows.',
 ],
 Programming: [
  'Write clean programs using core programming concepts.',
  'Solve beginner-friendly logic and algorithm problems.',
  'Build mini projects that reinforce practical coding skills.',
  'Use variables, functions, loops and data structures confidently.',
  'Debug common errors with a structured approach.',
  'Develop habits for consistent coding practice.',
 ],
 AI: [
  'Understand AI concepts through simple, practical examples.',
  'Use prompts and automation responsibly in learning workflows.',
  'Create small projects that demonstrate AI use cases.',
  'Recognize ethical and safety considerations in AI tools.',
  'Build confidence with modern technology vocabulary.',
  'Apply AI ideas to school and personal productivity tasks.',
 ],
 'Data Science': [
  'Understand datasets, patterns and basic statistics.',
  'Explore data cleaning and visualization concepts.',
  'Use practical examples to interpret information.',
  'Build beginner-friendly analysis projects.',
  'Connect data thinking with real-world decisions.',
  'Prepare for more advanced analytics learning paths.',
 ],
}

const defaultLearningOutcomes = [
 'Build strong concepts with structured lessons.',
 'Practice with focused activities after each topic.',
 'Learn at a pace designed for practical progress.',
 'Improve confidence through guided examples.',
 'Apply concepts to assignments, projects or exams.',
 'Create a strong foundation for the next learning level.',
]

function createOverview(course) {
 return {
  summary: `Learn ${course.title.toLowerCase()} through a structured learning experience designed for students who want clear guidance, practical examples and steady progress.`,
  language: 'English',
  benefits: [
   'Structured lessons with practical examples.',
   'Revision-friendly content for long-term clarity.',
   'Activities designed to build confidence step by step.',
  ],
 }
}

function createRequirements(course) {
 if (['Programming', 'Web Development', 'AI', 'Data Science'].includes(course.category)) {
  return ['Basic computer knowledge', 'A laptop or desktop recommended', 'No prior advanced experience required']
 }

 return ['Notebook for practice', 'Regular revision time', 'Basic familiarity with the previous class concepts']
}

function createTargetAudience(course) {
 if (course.category.startsWith('Class')) {
  return [`${course.category} students`, 'School learners preparing for exams', 'Students who want stronger fundamentals']
 }

 return ['Beginners', 'Students', 'Career-focused learners', `Anyone interested in ${course.category}`]
}

function createCurriculum(course) {
 const practicalTitle = ['Programming', 'Web Development', 'AI', 'Data Science'].includes(course.category)
  ? 'Project Practice'
  : 'Practice and Revision'

 return [
  {
   id: 1,
   title: 'Getting Started',
   duration: '42m',
   lessons: [
    { id: 1, title: 'Welcome to the course', duration: '08:20', type: 'video' },
    { id: 2, title: 'How this course is structured', duration: '10:15', type: 'video' },
    { id: 3, title: `Understanding ${course.category}`, duration: '23:25', type: 'video' },
   ],
  },
  {
   id: 2,
   title: 'Core Concepts',
   duration: '2h 10m',
   lessons: [
    { id: 1, title: 'Foundation concepts explained clearly', duration: '32:00', type: 'video' },
    { id: 2, title: 'Guided examples and demonstrations', duration: '44:15', type: 'video' },
    { id: 3, title: 'Common mistakes to avoid', duration: '28:40', type: 'lesson' },
    { id: 4, title: 'Checkpoint quiz and recap', duration: '25:05', type: 'lesson' },
   ],
  },
  {
   id: 3,
   title: practicalTitle,
   duration: '1h 35m',
   lessons: [
    { id: 1, title: 'Hands-on practice session', duration: '35:30', type: 'video' },
    { id: 2, title: 'Apply the concepts independently', duration: '30:00', type: 'lesson' },
    { id: 3, title: 'Review, feedback and next steps', duration: '29:30', type: 'video' },
   ],
  },
 ]
}

function createReviews(course) {
 return [
  {
   id: 1,
   name: 'Aarav Sharma',
   rating: 5,
   date: '2 weeks ago',
   text: 'Excellent course. The explanations were clear and the practical examples made the concepts much easier to remember.',
  },
  {
   id: 2,
   name: 'Meera Patil',
   rating: 5,
   date: '1 month ago',
   text: `The ${course.category} lessons are well organized and helpful for building confidence step by step.`,
  },
  {
   id: 3,
   name: 'Rohan Deshmukh',
   rating: 4,
   date: '2 months ago',
   text: 'Good pace, useful practice tasks and a clean structure. I liked the recap sections after important topics.',
  },
 ]
}

function createFaq(course) {
 return [
  {
   question: 'Who is this course for?',
   answer: `This course is designed for ${createTargetAudience(course).join(', ').toLowerCase()} who want a structured path for ${course.category}.`,
  },
  {
   question: 'What prerequisites are required?',
   answer: createRequirements(course).join('. ') + '.',
  },
  {
   question: 'How long will I have access to the course?',
   answer: 'You can revisit the learning material during your active enrollment period and continue practicing at your own pace.',
  },
  {
   question: 'Can I learn from a mobile device?',
   answer: 'Yes. The course pages are responsive, though a laptop or desktop is recommended for assignments and coding practice.',
  },
  {
   question: 'Will I receive a certificate?',
   answer: 'Certificate availability depends on the course plan and completion requirements shared by Praksha Academy.',
  },
  {
   question: 'Is there a course completion assessment?',
   answer: 'Most courses include practice tasks, recap activities or assessments to help you measure your progress.',
  },
 ]
}

function createRatingDistribution(rating) {
 const fiveStars = Math.min(88, Math.max(68, Math.round(rating * 16)))
 const fourStars = Math.max(8, 92 - fiveStars)

 return [
  { stars: 5, percentage: fiveStars },
  { stars: 4, percentage: fourStars },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 2 },
  { stars: 1, percentage: 1 },
 ]
}

const courses = baseCourses.map((course) => ({
 ...course,
 overview: createOverview(course),
 requirements: createRequirements(course),
 targetAudience: createTargetAudience(course),
 learningOutcomes: categoryOutcomes[course.category] || defaultLearningOutcomes,
 curriculum: createCurriculum(course),
 instructorDetails: instructorProfiles[course.instructor] || {
  name: course.instructor,
  designation: `${course.category} Instructor`,
  image: '',
  bio: `Experienced instructor helping learners build confidence in ${course.category}.`,
  rating: course.rating,
  students: course.students,
  courses: 1,
 },
 reviewList: createReviews(course),
 ratingDistribution: createRatingDistribution(course.rating),
 faq: createFaq(course),
}))

export default courses
