import { Box, Typography } from '@mui/material';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { FiAward, FiCheckSquare, FiTrendingUp, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageHeader from '../../../components/admin/common/PageHeader';
import StatCard from '../../../components/admin/common/StatCard';
import DataTable from '../../../components/admin/common/DataTable';

const COURSE_PERFORMANCE = [
  { course: 'React JS', avgScore: 82 },
  { course: 'Python', avgScore: 76 },
  { course: 'Cloud', avgScore: 79 },
  { course: 'UI/UX', avgScore: 88 },
  { course: 'Data Sci', avgScore: 74 },
  { course: 'ML', avgScore: 71 },
];

const MONTHLY_PERFORMANCE = [
  { month: 'Mar', score: 68 }, { month: 'Apr', score: 71 },
  { month: 'May', score: 74 }, { month: 'Jun', score: 76 },
  { month: 'Jul', score: 79 }, { month: 'Aug', score: 82 },
];

const TOP_STUDENTS = [
  { id: 1, name: 'Aditi Sharma', course: 'React & JS', quizScore: '94%', assignments: 12, certificates: 2, rank: '#1' },
  { id: 2, name: 'Meera Iyer', course: 'Data Science', quizScore: '91%', assignments: 10, certificates: 1, rank: '#2' },
  { id: 3, name: 'Rohan Mehta', course: 'Cloud', quizScore: '89%', assignments: 11, certificates: 2, rank: '#3' },
  { id: 4, name: 'Karan Singh', course: 'UI/UX', quizScore: '87%', assignments: 9, certificates: 1, rank: '#4' },
  { id: 5, name: 'Priya Patel', course: 'ML', quizScore: '85%', assignments: 8, certificates: 1, rank: '#5' },
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

const PerformanceReports = () => (
  <Box>
    <PageHeader
      title="Performance Reports"
      subtitle="Track quiz scores, assignment completion, and student academic performance."
      breadcrumbs={[{ label: 'Admin' }, { label: 'Reports' }, { label: 'Performance' }]}
    />

    <div className="row g-3 mb-4">
      {[
        { label: 'Avg Quiz Score', value: '82%', icon: FiStar, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', trend: '+6% this quarter', trendUp: true },
        { label: 'Assignments Done', value: '4,820', icon: FiCheckSquare, color: '#2563EB', bg: 'rgba(37,99,235,0.1)', trend: '+340 this month', trendUp: true },
        { label: 'Pass Rate', value: '91%', icon: FiTrendingUp, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', trend: '+3% vs last month', trendUp: true },
        { label: 'Certificates', value: '312', icon: FiAward, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', trend: '+24 this month', trendUp: true },
      ].map((s, i) => (
        <div key={s.label} className="col-12 col-sm-6 col-xl-3">
          <StatCard {...s} index={i} />
        </div>
      ))}
    </div>

    <div className="row g-4 mb-4">
      <div className="col-12 col-lg-7">
        <ChartCard title="Avg Score by Course">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={COURSE_PERFORMANCE} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="course" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} unit="%" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Avg Score']} />
              <Bar dataKey="avgScore" name="Avg Score" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="col-12 col-lg-5">
        <ChartCard title="Monthly Avg Score Trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MONTHLY_PERFORMANCE} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} unit="%" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Avg Score']} />
              <Line type="monotone" dataKey="score" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>

    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1E293B', mb: 2 }}>Top Performing Students</Typography>
      <DataTable
        columns={[
          { id: 'rank', label: 'Rank', minWidth: 70 },
          { id: 'name', label: 'Student', minWidth: 150 },
          { id: 'course', label: 'Course', minWidth: 160 },
          { id: 'quizScore', label: 'Quiz Score', minWidth: 110 },
          { id: 'assignments', label: 'Assignments', minWidth: 110 },
          { id: 'certificates', label: 'Certificates', minWidth: 110 },
        ]}
        rows={TOP_STUDENTS}
        searchKey="name"
        emptyText="No performance data available."
      />
    </Box>
  </Box>
);

export default PerformanceReports;
