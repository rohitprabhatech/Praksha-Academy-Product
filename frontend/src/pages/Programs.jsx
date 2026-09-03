import { Typography } from '@mui/material'
import SectionHeader from '../components/common/SectionHeading'
import { useWebsite } from '../context/WebsiteContext'

function Programs() {
  const { content, loading } = useWebsite()
  const programs = content?.programs

  if (loading || !programs) {
    return (
      <section className="section-wrapper">
        <SectionHeader title="Programs" subtitle="Loading…" />
      </section>
    )
  }

  return (
    <section className="section-wrapper">
      <SectionHeader title={programs.title} subtitle={programs.subtitle} />
      <div className="section-grid">
        {programs.items.map((program) => (
          <div className="card-surface p-4" key={program.id || program.title} data-aos="fade-up">
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
