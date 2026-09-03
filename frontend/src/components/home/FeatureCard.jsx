import { Card, CardContent, Typography } from '@mui/material'

function FeatureCard({ title, description, icon }) {
 return (
  <Card className="card-surface feature-card" elevation={0}>
   <CardContent>
    <div className="feature-icon">{icon}</div>
    <Typography variant="h6" component="h3" gutterBottom>
     {title}
    </Typography>
    <Typography variant="body2">{description}</Typography>
   </CardContent>
  </Card>
 )
}

export default FeatureCard