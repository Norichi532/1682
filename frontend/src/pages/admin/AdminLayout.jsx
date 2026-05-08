import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../../components/NotificationBell'
import api from '../../services/api'

function EyeToggle({ visible, onClick }) {
  return (
    <button type="button" onClick={onClick} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition">
      {visible
        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
      }
    </button>
  )
}

function ProfileModal({ onClose }) {
  const { user } = useAuth()
  const [profileForm, setProfileForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '' })
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState({ oldPassword: false, newPassword: false, confirmPassword: false })
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const iCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ochre/40 focus:border-ochre focus:outline-none transition text-sm"

  const handleProfileSubmit = async (e) => {
    e.preventDefault(); setProfileLoading(true); setError(''); setSuccess('')
    try {
      await api.patch('/auth/profile', { full_name: profileForm.full_name, phone: profileForm.phone })
      setSuccess('Profile updated successfully!')
    } catch (err) { setError(err.response?.data?.message || 'Update failed') }
    finally { setProfileLoading(false) }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault(); setPasswordLoading(true); setError(''); setSuccess('')
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) throw new Error('New passwords do not match')
      await api.patch('/auth/change-password', { oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword })
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setSuccess('Password changed successfully!')
    } catch (err) { setError(err.response?.data?.message || err.message || 'Failed to change password') }
    finally { setPasswordLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-bold text-base">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-navy text-sm">{user?.full_name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          {success && <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">{success}</div>}

          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Personal Information
            </h3>
            <form onSubmit={handleProfileSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full name</label>
                <input type="text" value={profileForm.full_name}
                  onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))} className={iCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone number</label>
                <input type="tel" value={profileForm.phone}
                  onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} className={iCls} />
              </div>
              <button type="submit" disabled={profileLoading}
                className="w-full py-2.5 bg-navy hover:bg-navy-light disabled:bg-navy/50 text-white font-semibold rounded-xl transition text-sm">
                {profileLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          <div className="border-t border-dashed border-gray-100" />

          {/* Change Password */}
          <div>
            <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              {[
                { field: 'oldPassword',     label: 'Current password' },
                { field: 'newPassword',     label: 'New Password' },
                { field: 'confirmPassword', label: 'Confirm New Password' },
              ].map(({ field, label }) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <div className="relative">
                    <input type={showPw[field] ? 'text' : 'password'} value={passwordForm[field]}
                      onChange={e => setPasswordForm(f => ({ ...f, [field]: e.target.value }))}
                      className={iCls + ' pr-10'} />
                    <EyeToggle visible={showPw[field]} onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))} />
                  </div>
                </div>
              ))}
              <button type="submit" disabled={passwordLoading}
                className="w-full py-2.5 bg-navy hover:bg-navy-light disabled:bg-navy/50 text-white font-semibold rounded-xl transition text-sm">
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const ADMIN_MENU = [
  {
    label: 'Dashboard', href: '/admin', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    label: 'Booking', href: '/admin/bookings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  },
  {
    label: 'Services', href: '/admin/products', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    label: 'Vehicle model', href: '/admin/car-models', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1h8zm0 0l2 1h3l1-4-5-2" />
      </svg>
    )
  },
  {
    label: 'Manage xe', href: '/admin/cars', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="1" y="3" width="15" height="13" rx="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8h5l2 5v3h-2m-5 0H9m8 0a2 2 0 11-4 0 2 2 0 014 0zM5 21a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    )
  },
  {
    label: 'Manage Users', href: '/admin/users', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    label: 'Schedule Calendar', href: '/admin/calendar', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
]

const DRIVER_MENU = [
  {
    label: 'My Schedule', href: '/admin/schedule', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
]

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }
  const isActive = (path) => location.pathname === path
  const menu = user?.role_id === 1 ? ADMIN_MENU : DRIVER_MENU

  const getPageTitle = () => {
    if (title) return title
    const item = menu.find(m => m.href === location.pathname)
    return item ? item.label : 'Dashboard'
  }

  const getInitial = () => user?.full_name?.charAt(0)?.toUpperCase() || 'U'
  const roleLabel = user?.role_id === 1 ? 'Admin' : 'Driver'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-gray-900 text-white transition-all duration-300 flex flex-col flex-shrink-0`}>
        {/* Logo */}
        <Link to="/" className={`flex items-center gap-3 px-4 py-5 border-b border-gray-800 hover:bg-gray-800 transition ${!sidebarOpen && 'justify-center'}`}>
          <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
          {sidebarOpen && <span className="font-bold text-sm truncate">PhuOng Tourist</span>}
        </Link>

        {/* Role badge */}
        {sidebarOpen && (
          <div className="px-4 py-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user?.role_id === 1 ? 'bg-blue-600/30 text-blue-300' : 'bg-green-600/30 text-green-300'}`}>
              {roleLabel}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {menu.map(item => (
            <Link
              key={item.href}
              to={item.href}
              title={!sidebarOpen ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } ${!sidebarOpen && 'justify-center'}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-gray-800 p-3 space-y-2">
          {sidebarOpen && (
            <button
              onClick={() => setProfileOpen(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition text-left"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{getInitial()}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          )}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition text-sm ${!sidebarOpen && 'justify-center'}`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-800 transition p-1 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">{getPageTitle()}</h1>
          <div className="ml-auto flex items-center gap-3">
            <NotificationBell />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </div>
  )
}
