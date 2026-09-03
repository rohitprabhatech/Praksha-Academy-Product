import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '@mui/material/styles'
import { courseEnrollmentData } from '../../../constants/adminDashboard'
import ChartSurface from './ChartSurface'

const COLORS = ['#2563EB', '#F59E0B', '#16A34A', '#0891B2', '#64748B']

function CourseEnrollmentChart() {
 const theme = useTheme()

 return (
  <ChartSurface title="Course Enrollments" subtitle="Enrollment share by popular categories">
   <ResponsiveContainer>
    <PieChart>
     <Pie
      data={courseEnrollmentData}
      dataKey="enrollments"
      nameKey="name"
      innerRadius={58}
      outerRadius={90}
      paddingAngle={2}
      stroke={theme.palette.background.paper}
      strokeWidth={2}
     >
      {courseEnrollmentData.map((entry, index) => (
       <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
      ))}
     </Pie>
     <Tooltip
      contentStyle={{
       borderRadius: 8,
       borderColor: theme.palette.divider,
       background: theme.palette.background.paper,
       color: theme.palette.text.primary,
      }}
     />
     <Legend wrapperStyle={{ fontSize: 12 }} />
    </PieChart>
   </ResponsiveContainer>
  </ChartSurface>
 )
}

export default CourseEnrollmentChart
