import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button, IconButton, InputBase } from '@mui/material'
import { FiSearch, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import { navItems } from '../../constants/siteData'
import { useThemeMode } from '../../context/ThemeModeContext'
import logoMark from '../../assets/praksha-mark.png'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') // Added state for search
  const { mode, toggleMode } = useThemeMode()
  const navigate = useNavigate() // Added navigation hook

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Added Search Handler
  const handleSearch = (e) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery) {
      navigate(`/courses?q=${encodeURIComponent(trimmedQuery)}`)
    } else {
      navigate(`/courses`)
    }
    setMobileOpen(false) // Close mobile menu if searching from there
  }

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="section-wrapper navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <img src={logoMark} alt="Praksha Academy" className="navbar-logo" />
          <span>Praksha Academy</span>
        </Link>

        <nav className="navbar-menu" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `navbar-link${isActive ? ' navbar-link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Changed to <form> to handle Enter key presses */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <button 
            type="submit" 
            aria-label="Submit search"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
          >
            <FiSearch size={16} aria-hidden="true" color="#64748b" />
          </button>
          <InputBase 
            placeholder="Search courses..." 
            aria-label="Search courses" 
            fullWidth 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="navbar-actions">
          <IconButton
            onClick={toggleMode}
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            sx={{ color: 'text.secondary' }}
          >
            {mode === 'dark' ? <FiSun size={19} /> : <FiMoon size={19} />}
          </IconButton>
          <Button variant="outlined" color="primary" component={Link} to="/login">
            Login
          </Button>
          <Button variant="contained" color="primary" component={Link} to="/register">
            Register
          </Button>
        </div>

        <IconButton
          className="navbar-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </IconButton>
      </div>

      <div className={`navbar-mobile${mobileOpen ? ' navbar-mobile--open' : ''}`}>
        
        {/* Changed to <form> for mobile as well */}
        <form className="navbar-search navbar-search--mobile" onSubmit={handleSearch}>
          <button 
            type="submit" 
            aria-label="Submit search"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
          >
            <FiSearch size={16} aria-hidden="true" color="#64748b" />
          </button>
          <InputBase 
            placeholder="Search courses..." 
            aria-label="Search courses" 
            fullWidth 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <nav className="navbar-mobile-menu" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `navbar-link${isActive ? ' navbar-link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-mobile-actions">
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            component={Link}
            to="/login"
            onClick={() => setMobileOpen(false)}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            to="/register"
            onClick={() => setMobileOpen(false)}
          >
            Register
          </Button>
          <IconButton
            onClick={toggleMode}
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            sx={{ color: 'text.secondary', alignSelf: 'center' }}
          >
            {mode === 'dark' ? <FiSun size={19} /> : <FiMoon size={19} />}
          </IconButton>
        </div>
      </div>
    </header>
  )
}

export default Navbar