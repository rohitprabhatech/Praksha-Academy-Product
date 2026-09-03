import { Box, Typography } from '@mui/material';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { FiBookOpen, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageHeader from '../../../components/admin/common/PageHeader';
import StatCard from '../../../components/admin/common/StatCard';
import DataTable from '../../../components/admin/common/DataTable';

const ENROLLMENT_DATA = [
  { course: 'React JS', enrollments: 210 },
  { course: 'Python', enrollments: 185 },
  { course: 'Cloud', enrollments: 142 },
  { course: 'UI/UX', enrollments: 128 },
  { course: 'Data Sci', enrollments: 98 },
  { course: 'ML', enrollments: 76 },
];

const COMPLETION_TREND = [
  { month: 'Mar', rate: 62 }, { month: 'Apr', rate: 65 },
  { month: 'May', rate: 70 }, { month: 'Jun', rate: 68 },
  { month: 'Jul', rate: 74 }, { month: 'Aug', rate: 79 },
];

const TOP_COURSES = [
  { id: 1, title: 'React & Modern JS', category: 'Technology', enrolled: 210, completion: '78%', rating: '4.8' },
  { id: 2, title: 'Python for Beginners', category: 'Development', enrolled: 185, completion: '65%', rating: '4.6' },
  { id: 3, title: 'Cloud Computing', category: 'Cloud', enrolled: 142, completion: '72%', rating: '4.7' },
  { id: 4, title: 'UI/UX Design', category: 'Design', enrolled: 128, completion: '81%', rating: '4.9' },
];

const tooltipStyle = { fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', borderRadius: 10, border: '1px solid #E2E8F0' };

const ChartCard = ({ title, children }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3, height: '100%' }}
  >
    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2.5 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const CourseReports = () => (
  <Box>
    <PageHeader
      title="Course Reports"
      subtitle="Track enrollment numbers, completion rates, and top-performing courses."
      breadcrumbs={[{ label: 'Admin' }, { label: 'Reports' }, { label: 'Courses' }]}
    />

    <div className="row g-3 mb-4">
      {[
        { label: 'Total Courses', value: '48', icon: FiBookOpen, color: '#2563EB', bg: 'rgba(37,99,235,0.1)', trend: '6 added this month', trendUp: true },
        { label: 'Published', value: '36', icon: FiCheckCircle, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', trend: '75% of total', trendUp: true },
        { label: 'Draft', value: '12', icon: FiClock, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', trend: 'Pending review', trendUp: false },
        { label: 'Avg Completion', value: '74%', icon: FiTrendingUp, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', trend: '+4% this quarter', trendUp: true },
      ].map((s, i) => (
        <div key={s.label} className="col-12 col-sm-6 col-xl-3">
          <StatCard {...s} index={i} />
        </div>
      ))}
    </div>

    <div className="row g-4 mb-4">
      <div className="col-12 col-lg-7">
        <ChartCard title="Enrollments by Course">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ENROLLMENT_DATA} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="course" type="category" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="enrollments" name="Enrollments" fill="#2563EB" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="col-12 col-lg-5">
        <ChartCard title="Completion Rate Trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={COMPLETION_TREND} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} unit="%" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Completion']} />
              <Line type="monotone" dataKey="rate" stroke="#22C55E" strokeWidth={2.5} dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>

    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1E293B', mb: 2 }}>Top Courses by Enrollment</Typography>
      <DataTable
        columns={[
          { id: 'title', label: 'Course', minWidth: 200 },
          { id: 'category', label: 'Category', minWidth: 120 },
          { id: 'enrolled', label: 'Enrolled', minWidth: 100 },
          { id: 'completion', label: 'Completion', minWidth: 110 },
          { id: 'rating', label: 'Rating', minWidth: 90 },
        ]}
        rows={TOP_COURSES}
        searchKey="title"
        emptyText="No courses found."
      />
    </Box>
  </Box>
);

export default CourseReports;
