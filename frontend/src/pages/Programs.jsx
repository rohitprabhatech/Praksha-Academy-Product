import { Typography, List, ListItem, ListItemText } from '@mui/material'
import SectionHeader from '../components/common/SectionHeading'

const programs = [
 {
  title: 'Career Foundation',
  description: 'A strong foundation in English, logic, and study habits for long-term success.',
 },
 {
  title: 'Programming Acceleration',
  description: 'Coding practice, project work, and application-based learning for modern software skills.',
 },
 {
  title: 'Exam Readiness',
  description: 'Focused preparation for competitive exams with strategy, mock tests, and review sessions.',
 },
]

function Programs() {
 return (
  <section className="section-wrapper">
   <SectionHeader title="Programs" subtitle="Live programs and cohort-based tracks for learning progress and accountability." />
   <div className="section-grid">
    {programs.map((program) => (
     <div className="card-surface p-4" key={program.title} data-aos="fade-up">
      <Typography variant="h5" gutterBottom>
       {program.title}
      </Typography>
      <Typography>{program.description}</Typography>
     </div>
    ))}
   </div>
  </section>
 )
}

export default Programs
