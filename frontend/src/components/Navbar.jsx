import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

const SERVICE_CATEGORIES = [
  { id: 1, name: 'Airport Transfer', icon: '✈️' },
  { id: 2, name: 'Tours', icon: '🗺️' },
  { id: 3, name: 'Golf Transfer', icon: '⛳' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [serviceDropdown, setServiceDropdown] = useState(false)
  const serviceRef = useRef(null)
  const userRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (serviceRef.current && !serviceRef.current.contains(e.target)) setServiceDropdown(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdown(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserDropdown(false)
    setMobileMenuOpen(false)
  }

  const getInitial = () => user?.full_name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="PhuOng Tourist Car" className="w-10 h-10 rounded-lg object-contain" />
            <span className="hidden sm:inline text-xl font-bold text-gray-900">PhuOng Tourist Car</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition">
              Home
            </Link>

            {/* Services dropdown */}
            <div ref={serviceRef} className="relative">
              <button
                onClick={() => setServiceDropdown(!serviceDropdown)}
                className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
              >
                Services
                <svg className={`w-4 h-4 transition-transform ${serviceDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {serviceDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {SERVICE_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { navigate(`/services/cat/${cat.id}`); setServiceDropdown(false) }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium text-sm">{cat.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => { navigate('/services'); setServiceDropdown(false) }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-50 transition text-sm"
                    >
                      View all services →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/vehicles" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition">
              Vehicles
            </Link>
            <Link to="/about" className="px-3 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition">
              About
            </Link>
          </div>

          {/* Right: Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <Link to="/login" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm">
                Login
              </Link>
            ) : user.role_id === 2 ? (
              <>
                {/* Orders icon */}
                <Link to="/my-orders" title="My Bookings" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </Link>
                <NotificationBell />
                <div ref={userRef} className="relative">
                  <button onClick={() => setUserDropdown(!userDropdown)} className="flex items-center gap-2 hover:opacity-80 transition">
                    <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {getInitial()}
                    </div>
                  </button>
                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">Edit Profile</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100">Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button onClick={() => navigate(user.role_id === 3 ? '/admin/schedule' : '/admin')} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm">
                Go to Dashboard
              </button>
            )}
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-600 hover:text-gray-900 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}/>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2 space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Home</Link>
            <div className="px-4 py-1 text-xs text-gray-400 uppercase tracking-wide">Services</div>
            {SERVICE_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { navigate(`/services/cat/${cat.id}`); setMobileMenuOpen(false) }}
                className="w-full text-left flex items-center gap-2 px-6 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-sm">
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
            <Link to="/vehicles" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">Vehicles</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">About</Link>
            {user?.role_id === 2 && <>
              <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">My Bookings</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">Profile</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
            </>}
            {!user && <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-center mt-2">Login</Link>}
          </div>
        )}
      </div>
    </nav>
  )
}
