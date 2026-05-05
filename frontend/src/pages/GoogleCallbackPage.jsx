import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function GoogleCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    const userRaw = params.get('user')
    const error = params.get('error')

    if (error || !token || !userRaw) {
      navigate('/login?error=google_failed')
      return
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw))
      login(user, token)  // AuthContext: login(userData, authToken)

      // Redirect theo role
      if (user.role_id === 1) navigate('/admin/dashboard')
      else if (user.role_id === 3) navigate('/admin/my-schedule')
      else navigate('/')
    } catch {
      navigate('/login?error=google_failed')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-mist/30">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-navy/20 border-t-navy rounded-full animate-spin mx-auto mb-4" />
        <p className="text-navy font-medium">Đang xác thực Google...</p>
      </div>
    </div>
  )
}
