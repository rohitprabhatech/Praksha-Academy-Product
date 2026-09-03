import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '@mui/material/styles'
import { studentGrowthData } from '../../../constants/adminDashboard'
import ChartSurface from './ChartSurface'

function StudentChart() {
 const theme = useTheme()
 const gridColor = theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.18)' : 'rgba(148, 163, 184, 0.24)'
 const tickColor = theme.palette.text.secondary

 return (
  <ChartSurface title="Student Growth" subtitle="Active and newly enrolled students">
   <ResponsiveContainer>
    <BarChart data={studentGrowthData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
     <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
     <Tooltip
      contentStyle={{
       borderRadius: 8,
       borderColor: theme.palette.divider,
       background: theme.palette.background.paper,
       color: theme.palette.text.primary,
      }}
     />
     <Legend wrapperStyle={{ fontSize: 12 }} />
     <Bar dataKey="active" name="Active Students" fill="#2563EB" radius={[6, 6, 0, 0]} />
     <Bar dataKey="new" name="New Enrollments" fill="#16A34A" radius={[6, 6, 0, 0]} />
    </BarChart>
   </ResponsiveContainer>
  </ChartSurface>
 )
}

export default StudentChart
