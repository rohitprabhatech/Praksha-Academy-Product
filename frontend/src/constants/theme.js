import { createTheme } from '@mui/material/styles'

const getTheme = (mode = 'light') =>
 createTheme({
  palette: {
   mode,
   primary: {
    main: '#2563EB',
    dark: '#1D4ED8',
    contrastText: '#ffffff',
   },
   secondary: {
    main: '#F59E0B',
    contrastText: '#111827',
   },
   background: {
    default: mode === 'dark' ? '#0F172A' : '#F8FAFC',
    paper: mode === 'dark' ? '#1E293B' : '#ffffff',
   },
   text: {
    primary: mode === 'dark' ? '#F1F5F9' : '#1E293B',
    secondary: mode === 'dark' ? '#94A3B8' : '#64748B',
   },
  },
  typography: {
   fontFamily: ['Inter', 'system-ui', 'sans-serif'].join(','),
   h1: { fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em' },
   h2: { fontSize: '2rem', fontWeight: 700 },
   h3: { fontSize: '1.5rem', fontWeight: 600 },
   body1: { fontSize: '1rem', lineHeight: 1.7 },
   button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  spacing: 8,
  components: {
   MuiButton: {
    styleOverrides: {
     root: { borderRadius: 999, padding: '0.9rem 1.8rem' },
    },
   },
   MuiCard: {
    styleOverrides: {
     root: {
      borderRadius: 24,
      boxShadow:
       mode === 'dark'
        ? '0 30px 60px rgba(0, 0, 0, 0.4)'
        : '0 30px 60px rgba(15, 23, 42, 0.08)',
     },
    },
   },
  },
 })

export default getTheme