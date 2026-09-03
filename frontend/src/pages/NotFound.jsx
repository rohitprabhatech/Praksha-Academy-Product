import { Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

function NotFound() {
 return (
  <section className="section-wrapper">
   <div className="card-surface p-5 text-center" data-aos="fade-up">
    <Typography variant="h3" gutterBottom>
     404 — Page not found
    </Typography>
    <Typography paragraph>
     The page you are looking for does not exist yet or has moved. Return to the home experience and continue exploring.
    </Typography>
    <Button component={Link} to="/" variant="contained" color="primary" size="large">
     Back to Home
    </Button>
   </div>
  </section>
 )
}

export default NotFound
