import {
  Box,
  Stack,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  InputAdornment,
  TextField,
  Chip,
} from '@mui/material';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * DataTable — generic admin list table.
 *
 * Props:
 *  columns   {Array}  — [{ id, label, minWidth?, align?, render? }]
 *  rows      {Array}  — array of row data objects
 *  searchKey {string} — field to search against (default: 'title')
 *  emptyText {string} — text when no results
 */
const DataTable = ({ columns = [], rows = [], searchKey = 'title', emptyText = 'No records found.' }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = rows.filter((row) => {
    const val = row[searchKey];
    if (!val) return true;
    return String(val).toLowerCase().includes(search.toLowerCase());
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Search bar */}
      <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #F1F5F9' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
          <TextField
            size="small"
            placeholder={`Search by ${searchKey}…`}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch size={16} color="#94A3B8" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: 280 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                '& fieldset': { borderColor: '#E2E8F0' },
                '&:hover fieldset': { borderColor: '#CBD5E1' },
                '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: 1.5 },
              },
            }}
          />
          <Chip
            label={`${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{
              bgcolor: 'rgba(37, 99, 235, 0.08)',
              color: '#2563EB',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 26,
              alignSelf: { xs: 'flex-start', sm: 'center' },
            }}
          />
        </Stack>
      </Box>

      {/* Table */}
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #E2E8F0',
                    minWidth: col.minWidth,
                    py: 1.5,
                    px: 2.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 5 }}>
                  <Typography sx={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8', fontSize: '0.875rem' }}>
                    {emptyText}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row, rowIdx) => (
                <TableRow
                  key={row.id ?? rowIdx}
                  hover
                  sx={{
                    '&:last-child td': { border: 0 },
                    '&:hover': { bgcolor: '#F8FAFC' },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align || 'left'}
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: '#1E293B',
                        borderBottom: '1px solid #F1F5F9',
                        py: 1.5,
                        px: 2.5,
                      }}
                    >
                      {col.render ? col.render(row[col.id], row) : row[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box sx={{ borderTop: '1px solid #F1F5F9' }}>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8125rem',
            color: '#64748B',
            '& .MuiTablePagination-toolbar': { px: 2 },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8125rem',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default DataTable;
