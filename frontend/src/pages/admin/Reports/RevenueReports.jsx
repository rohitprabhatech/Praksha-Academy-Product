import { Box, Typography, Chip } from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { FiDollarSign, FiTrendingUp, FiClock, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PageHeader from '../../../components/admin/common/PageHeader';
import StatCard from '../../../components/admin/common/StatCard';
import DataTable from '../../../components/admin/common/DataTable';

const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 18500 }, { month: 'Feb', revenue: 22400 },
  { month: 'Mar', revenue: 27800 }, { month: 'Apr', revenue: 24100 },
  { month: 'May', revenue: 31500 }, { month: 'Jun', revenue: 38900 },
  { month: 'Jul', revenue: 35200 }, { month: 'Aug', revenue: 42600 },
];

const REVENUE_BY_COURSE = [
  { course: 'React JS', revenue: 52000 },
  { course: 'Python', revenue: 41000 },
  { course: 'Cloud', revenue: 36000 },
  { course: 'Data Sci', revenue: 28000 },
  { course: 'UI/UX', revenue: 22000 },
];

const TRANSACTIONS = [
  { id: 1, student: 'Aditi Sharma', course: 'React & JS', amount: '₹4,999', date: '2025-08-13', status: 'Completed' },
  { id: 2, student: 'Rohan Mehta', course: 'Cloud Computing', amount: '₹6,499', date: '2025-08-12', status: 'Completed' },
  { id: 3, student: 'Priya Patel', course: 'Data Science', amount: '₹8,999', date: '2025-08-11', status: 'Pending' },
  { id: 4, student: 'Karan Singh', course: 'UI/UX Design', amount: '₹3,999', date: '2025-08-10', status: 'Refunded' },
  { id: 5, student: 'Sneha Kapoor', course: 'Python', amount: '₹3,499', date: '2025-08-09', status: 'Completed' },
];

const STATUS_CHIP = {
  Completed: { bgcolor: 'rgba(34,197,94,0.1)', color: '#16A34A' },
  Pending:   { bgcolor: 'rgba(245,158,11,0.1)', color: '#D97706' },
  Refunded:  { bgcolor: 'rgba(239,68,68,0.1)', color: '#DC2626' },
};

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

const RevenueReports = () => (
  <Box>
    <PageHeader
      title="Revenue Reports"
      subtitle="Monitor revenue trends, course earnings, and transaction history."
      breadcrumbs={[{ label: 'Admin' }, { label: 'Reports' }, { label: 'Revenue' }]}
    />

    <div className="row g-3 mb-4">
      {[
        { label: 'Total Revenue', value: '₹2.4L', icon: FiDollarSign, color: '#2563EB', bg: 'rgba(37,99,235,0.1)', trend: '+28% this year', trendUp: true },
        { label: 'This Month', value: '₹42,600', icon: FiTrendingUp, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', trend: '+21% vs last month', trendUp: true },
        { label: 'Pending', value: '₹8,999', icon: FiClock, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', trend: '2 transactions', trendUp: false },
        { label: 'Refunds', value: '₹3,999', icon: FiRefreshCw, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', trend: '1 refund this month', trendUp: false },
      ].map((s, i) => (
        <div key={s.label} className="col-12 col-sm-6 col-xl-3">
          <StatCard {...s} index={i} />
        </div>
      ))}
    </div>

    <div className="row g-4 mb-4">
      <div className="col-12 col-lg-8">
        <ChartCard title="Monthly Revenue Trend">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, left: -5, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="col-12 col-lg-4">
        <ChartCard title="Revenue by Course">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={REVENUE_BY_COURSE} layout="vertical" margin={{ top: 5, right: 10, left: 45, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="course" type="category" tick={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#F59E0B" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>

    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1E293B', mb: 2 }}>Recent Transactions</Typography>
      <DataTable
        columns={[
          { id: 'student', label: 'Student', minWidth: 150 },
          { id: 'course', label: 'Course', minWidth: 160 },
          { id: 'amount', label: 'Amount', minWidth: 100 },
          { id: 'date', label: 'Date', minWidth: 110 },
          {
            id: 'status', label: 'Status', minWidth: 110,
            render: (val) => <Chip label={val} size="small" sx={{ ...(STATUS_CHIP[val] ?? {}), fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', height: 24 }} />,
          },
        ]}
        rows={TRANSACTIONS}
        searchKey="student"
        emptyText="No transactions found."
      />
    </Box>
  </Box>
);

export default RevenueReports;
