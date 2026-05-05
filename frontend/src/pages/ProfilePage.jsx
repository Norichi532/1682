import { useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function EyeToggle({ visible, onClick }) {
  return (
    <button type="button" onClick={onClick} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition">
      {visible ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  )
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  })
  const [profileSubmitting, setProfileSubmitting] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState({ oldPassword: false, newPassword: false, confirmPassword: false })

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
    setError(''); setSuccess('')
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    setError(''); setSuccess('')
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileSubmitting(true)
    setError(''); setSuccess('')
    try {
      await api.patch('/auth/profile', { full_name: profileForm.full_name, phone: profileForm.phone })
      setSuccess('Cập nhật hồ sơ thành công!')
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật hồ sơ thất bại')
    } finally {
      setProfileSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordSubmitting(true)
    setError(''); setSuccess('')
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) throw new Error('Mật khẩu mới không khớp')
      await api.patch('/auth/change-password', { oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword })
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setSuccess('Đổi mật khẩu thành công!')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Đổi mật khẩu thất bại')
    } finally {
      setPasswordSubmitting(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-ochre/40 focus:border-ochre focus:outline-none transition font-body"
  const disabledClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed font-body"

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-navy py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-ochre text-sm font-semibold uppercase tracking-widest mb-2">Tài khoản</p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-ochre/20 border-2 border-ochre/40 flex items-center justify-center text-white font-display text-2xl font-bold">
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{user?.full_name}</h1>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-mist/30 min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-2 text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <h2 className="font-display text-xl font-bold text-navy mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Thông tin cá nhân
              </h2>
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">Họ và tên</label>
                  <input type="text" name="full_name" value={profileForm.full_name} onChange={handleProfileChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">Email</label>
                  <input type="email" value={user?.email || ''} disabled className={disabledClass} />
                  <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">Số điện thoại</label>
                  <input type="tel" name="phone" value={profileForm.phone} onChange={handleProfileChange} className={inputClass} />
                </div>
                <button type="submit" disabled={profileSubmitting}
                  className="w-full py-3 bg-navy hover:bg-navy-light disabled:bg-navy/50 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg">
                  {profileSubmitting ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
                </button>
              </form>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
              <h2 className="font-display text-xl font-bold text-navy mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Đổi mật khẩu
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => {
                  const labels = { oldPassword: 'Mật khẩu cũ', newPassword: 'Mật khẩu mới', confirmPassword: 'Xác nhận mật khẩu' }
                  return (
                    <div key={field}>
                      <label className="block text-sm font-medium text-navy mb-1.5">{labels[field]}</label>
                      <div className="relative">
                        <input
                          type={showPassword[field] ? 'text' : 'password'}
                          name={field}
                          value={passwordForm[field]}
                          onChange={handlePasswordChange}
                          className={inputClass + ' pr-12'}
                        />
                        <EyeToggle visible={showPassword[field]} onClick={() => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))} />
                      </div>
                    </div>
                  )
                })}
                <button type="submit" disabled={passwordSubmitting}
                  className="w-full py-3 bg-navy hover:bg-navy-light disabled:bg-navy/50 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg">
                  {passwordSubmitting ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
