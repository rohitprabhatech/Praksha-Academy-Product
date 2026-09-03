import {
 Area,
 AreaChart,
 CartesianGrid,
 ResponsiveContainer,
 Tooltip,
 XAxis,
 YAxis,
} from 'recharts'
import { useTheme } from '@mui/material/styles'
import { revenueData } from '../../../constants/adminDashboard'
import ChartSurface from './ChartSurface'

function RevenueChart() {
 const theme = useTheme()
 const gridColor = theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.18)' : 'rgba(148, 163, 184, 0.24)'
 const tickColor = theme.palette.text.secondary

 return (
  <ChartSurface title="Revenue Overview" subtitle="Revenue in lakhs against monthly target">
   <ResponsiveContainer>
    <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
     <defs>
      <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
       <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
       <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
      </linearGradient>
     </defs>
     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
     <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
     <Tooltip
      formatter={(value) => `₹${value}L`}
      contentStyle={{
       borderRadius: 8,
       borderColor: theme.palette.divider,
       background: theme.palette.background.paper,
       color: theme.palette.text.primary,
      }}
     />
     <Area type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={2} fill="transparent" />
     <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#revenueFill)" />
    </AreaChart>
   </ResponsiveContainer>
  </ChartSurface>
 )
}

export default RevenueChart
