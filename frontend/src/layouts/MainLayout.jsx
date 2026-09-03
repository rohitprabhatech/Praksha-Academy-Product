import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Navbar from '../components/navigation/Navbar'
import Footer from '../components/navigation/Footer'

function MainLayout() {
 useEffect(() => {
  AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic' })
 }, [])

 return (
  <div className="app-shell">
   <Navbar />
   <main className="main-content">
    <Outlet />
   </main>
   <Footer />
  </div>
 )
}

export default MainLayout
