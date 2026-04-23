import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { Zap, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { state, logout } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,5,8,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-black text-lg" style={{ background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            SkillSignal
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {state.isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm transition-colors"
                style={{ color: location.pathname === '/dashboard' ? '#a78bfa' : 'rgba(148,163,184,0.7)' }}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm transition-colors"
                style={{ color: 'rgba(148,163,184,0.7)' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="text-sm transition-colors"
                style={{ color: location.pathname === '/' ? '#fff' : 'rgba(148,163,184,0.7)' }}
              >
                Home
              </Link>
              <Link
                to="/login"
                className="text-sm transition-all duration-300 px-3 py-1.5 rounded-lg"
                style={{ color: location.pathname === '/login' ? '#fff' : 'rgba(148,163,184,0.7)' }}
                onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = '#fff'
                el.style.background = 'rgba(255,255,255,0.06)'
                }}
               onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = 'rgba(148,163,184,0.7)'
                el.style.background = 'transparent'
              }}
              >
              Login
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-2 rounded-xl text-white font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}