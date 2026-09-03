/**
 * Central content configuration for the About page.
 *
 * Sections that depend on real company facts (faculty, academy history,
 * recognition/awards) are DATA-DRIVEN and start empty. The components that
 * read this file are written to hide themselves gracefully when the
 * relevant array is empty, instead of showing invented people, dates, or
 * awards. Fill these in as real information becomes available — no
 * component code needs to change.
 */

const aboutData = {
  // Editorial "Who We Are" copy. Replace with real Praksha Academy content —
  // this is placeholder structure, not a fabricated company history.
  whoWeAre: {
    story:
      "Praksha Academy teaches Class 8–12 academics alongside English communication and career-focused tech courses like programming, web development, and data science. // TODO: replace with the real founding story once written.",
    belief:
      "We believe students learn best with structure, direct feedback, and a teacher who has time for their questions — not just recorded lectures. // TODO: refine to match the academy's actual teaching philosophy.",
    approach:
      "Courses are built around live instruction, practice, and progress tracking, so students know exactly where they stand. // TODO: confirm this matches how classes are actually run.",
  },

  // "What Makes Us Different" — educational principles, not quantitative claims.
  differentiators: [
    {
      title: "Concept-first learning",
      description:
        "Every topic starts with the underlying idea, not a shortcut to the answer — so what students learn actually transfers to the next problem.",
    },
    {
      title: "Mentor-led guidance",
      description:
        "Teachers track individual progress across a batch rather than teaching to an average student.",
    },
    {
      title: "Practice over passive watching",
      description:
        "Courses are structured around doing the work — exercises, projects, and problem sets — not just consuming lecture time.",
    },
    {
      title: "Structured learning paths",
      description:
        "Each program follows a defined sequence, so students always know what comes next instead of piecing a curriculum together themselves.",
    },
  ],

  // Learning philosophy — the pedagogical loop applied across courses.
  learningPhilosophy: [
    { step: "Understand", description: "Build the underlying concept before touching a problem set." },
    { step: "Practice", description: "Work through structured exercises with immediate context." },
    { step: "Apply", description: "Use the concept in a real problem, project, or past exam question." },
    { step: "Get Feedback", description: "A teacher reviews the work, not just an auto-graded score." },
    { step: "Improve", description: "Revisit the specific gap, not the whole topic again." },
    { step: "Build Confidence", description: "Move to the next concept once the current one is solid." },
  ],

  // Student journey — from discovery to ongoing progress.
  studentJourney: [
    { step: "Discover", description: "Browse programs by class, subject, or skill track." },
    { step: "Choose a Program", description: "Compare curriculum, format, and schedule before enrolling." },
    { step: "Learn", description: "Attend structured live and recorded sessions." },
    { step: "Practice", description: "Work through exercises tied to each lesson." },
    { step: "Get Mentorship", description: "Ask questions and get feedback from an instructor." },
    { step: "Track Progress", description: "See where you stand from your student dashboard." },
  ],

  mission:
    "To make quality education accessible and personal — combining structured curriculum, teacher feedback, and technology so students from Class 8 through career-focused tracks can learn at a pace that works for them.",

  vision:
    "To be a learning platform students turn to for both academic fundamentals and future-ready skills, without losing the personal guidance of a real teacher.",

  values: [
    {
      title: "Student First",
      description:
        "Decisions about batch sizes, pacing, and pricing start with what actually helps a student learn.",
    },
    {
      title: "Clarity Over Complexity",
      description:
        "Concepts are taught in plain language first — technical vocabulary comes after the idea is understood.",
    },
    {
      title: "Learn By Doing",
      description:
        "Every course pairs instruction with exercises, so students practice the skill, not just watch it demonstrated.",
    },
    {
      title: "Continuous Improvement",
      description:
        "Curriculum and teaching methods are revised based on what's actually working for students, term over term.",
    },
  ],

  // FACULTY — intentionally empty. Do not populate with invented people.
  // Add real entries here once available, in this shape:
  // { name: "", role: "", expertise: "", bio: "", photo: "" }
  faculty: [],

  // ACADEMY TIMELINE — intentionally empty. Do not invent founding dates or
  // milestones. Add real entries here once confirmed, in this shape:
  // { year: "", title: "", description: "" }
  timeline: [],

  // STATISTICS — intentionally empty. Do not invent enrollment numbers,
  // ratings, or city counts. Add real, confirmed figures here, in this
  // shape: { value: 0, suffix: "", label: "", decimals: 0 }
  stats: [],

  // RECOGNITION — intentionally empty. Do not invent awards, press mentions,
  // or certifications. Add real, verifiable entries here, in this shape:
  // { title: "", issuer: "", year: "" }
  recognition: [],

  // Hero "Watch Our Story" video. Leave videoUrl null until a real video
  // exists — the hero hides the button entirely when this is null.
  storyVideo: {
    videoUrl: null, // e.g. "https://www.youtube.com/embed/REAL_VIDEO_ID"
  },

  faqs: [
    {
      q: "Who can join Praksha Academy?",
      a: "Students from Class 8 through Class 12, plus anyone interested in our English communication or tech skill courses — see the Courses page for the full list.",
    },
    {
      q: "What programs are available?",
      a: "Academic classes (Class 8–12), English Grammar and Spoken English, and career-track courses in Programming, Web Development, AI, and Data Science.",
    },
    {
      q: "How do I choose the right course?",
      a: "Browse the Courses page for a full breakdown of each program, or use the \"Talk to an Academic Advisor\" option on the Contact page if you'd like guidance.",
    },
    {
      q: "Do students receive mentorship or just recorded lectures?",
      a: "Courses are built around live instruction and teacher feedback, not just pre-recorded content. // TODO: confirm the exact mentorship model to describe here.",
    },
    {
      q: "Are programs online, offline, or both?",
      a: "This varies by program — check the specific course page for its format.",
    },
    {
      q: "How can I get admission information?",
      a: "Reach out through the Contact page — by form, phone, or WhatsApp, whichever is available — and a team member will guide you through enrollment.",
    },
  ],
};

export default aboutData;
