import { ThemeProvider, CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes/AppRoutes'
import getTheme from './constants/theme'
import { ThemeModeProvider, useThemeMode } from './context/ThemeModeContext'
import { AuthProvider } from './context/AuthContext'
import { WebsiteProvider } from './context/WebsiteContext'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import './index.css'

function ThemedApp() {
  const { mode } = useThemeMode()
  const theme = getTheme(mode)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <WebsiteProvider>
          <AppRoutes />
        </WebsiteProvider>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={mode}
          toastClassName="premium-toast"
          bodyClassName="premium-toast-body"
        />
      </BrowserRouter>
    </ThemeProvider>
  )
}

function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ThemeModeProvider>
  )
}

export default App
