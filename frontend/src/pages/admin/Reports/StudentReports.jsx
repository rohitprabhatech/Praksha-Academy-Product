import { Box, Stack, Typography } from '@mui/material';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { FiUsers, FiTrendingUp, FiUserCheck, FiUserX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageHeader from '../../../components/admin/common/PageHeader';
import StatCard from '../../../components/admin/common/StatCard';
import DataTable from '../../../components/admin/common/DataTable';

const MONTHLY_SIGNUPS = [
  { month: 'Jan', students: 42 }, { month: 'Feb', students: 58 },
  { month: 'Mar', students: 75 }, { month: 'Apr', students: 63 },
  { month: 'May', students: 91 }, { month: 'Jun', students: 110 },
  { month: 'Jul', students: 98 }, { month: 'Aug', students: 134 },
];

const CATEGORY_DIST = [
  { name: 'Technology', value: 340 },
  { name: 'Design', value: 180 },
  { name: 'Business', value: 120 },
  { name: 'AI/ML', value: 210 },
  { name: 'Cloud', value: 95 },
];
const PIE_COLORS = ['#2563EB', '#F59E0B', '#22C55E', '#8B5CF6', '#EF4444'];

const RECENT_STUDENTS = [
  { id: 1, name: 'Aditi Sharma', email: 'aditi@email.com', course: 'React & JS', enrolledOn: '2025-08-10', status: 'Active' },
  { id: 2, name: 'Rohan Mehta', email: 'rohan@email.com', course: 'Cloud Computing', enrolledOn: '2025-08-09', status: 'Active' },
  { id: 3, name: 'Priya Patel', email: 'priya@email.com', course: 'Data Science', enrolledOn: '2025-08-08', status: 'Inactive' },
  { id: 4, name: 'Karan Singh', email: 'karan@email.com', course: 'UI/UX Design', enrolledOn: '2025-08-07', status: 'Active' },
];

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

const tooltipStyle = { fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', borderRadius: 10, border: '1px solid #E2E8F0' };

const StudentReports = () => (
  <Box>
    <PageHeader
      title="Student Reports"
      subtitle="Overview of student enrollment, activity, and distribution."
      breadcrumbs={[{ label: 'Admin' }, { label: 'Reports' }, { label: 'Students' }]}
    />

    {/* Stats */}
    <div className="row g-3 mb-4">
      {[
        { label: 'Total Students', value: '1,248', icon: FiUsers, color: '#2563EB', bg: 'rgba(37,99,235,0.1)', trend: '+18% this month', trendUp: true },
        { label: 'New This Month', value: '134', icon: FiTrendingUp, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', trend: '+22% vs last month', trendUp: true },
        { label: 'Active Students', value: '986', icon: FiUserCheck, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', trend: '79% of total', trendUp: true },
        { label: 'Inactive', value: '262', icon: FiUserX, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', trend: '21% of total', trendUp: false },
      ].map((s, i) => (
        <div key={s.label} className="col-12 col-sm-6 col-xl-3">
          <StatCard {...s} index={i} />
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="row g-4 mb-4">
      <div className="col-12 col-lg-8">
        <ChartCard title="Monthly New Enrollments">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_SIGNUPS} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="students" name="Students" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="col-12 col-lg-4">
        <ChartCard title="Students by Category">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={CATEGORY_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {CATEGORY_DIST.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>

    {/* Recent students table */}
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1E293B', mb: 2 }}>Recent Signups</Typography>
      <DataTable
        columns={[
          { id: 'name', label: 'Name', minWidth: 150 },
          { id: 'email', label: 'Email', minWidth: 180 },
          { id: 'course', label: 'Course', minWidth: 160 },
          { id: 'enrolledOn', label: 'Enrolled', minWidth: 120 },
        ]}
        rows={RECENT_STUDENTS}
        searchKey="name"
        emptyText="No students found."
      />
    </Box>
  </Box>
);

export default StudentReports;
