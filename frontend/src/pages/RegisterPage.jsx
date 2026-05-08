import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import heroBg from '../assets/hero.png'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/
const PHONE_REGEX = /^0\d{9}$/

function EyeIcon({ visible }) {
  return visible ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!EMAIL_REGEX.test(form.email)) return setError('Email must be a valid @gmail.com address.')
    if (!PHONE_REGEX.test(form.phone)) return setError('Phone number must be exactly 10 digits and start with 0.')
    if (!PASSWORD_REGEX.test(form.password)) return setError('Password must be at least 6 characters including letters, numbers, and special characters.')
    if (form.password !== confirmPassword) return setError('Passwords do not match.')

    setLoading(true)
    try {
      await api.post('/auth/register', form)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ochre/40 focus:border-ochre transition"

  return (
    <div className="min-h-screen flex font-body">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={heroBg} alt="PhuOng Tourist Car" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 bg-ochre rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/>
                  <circle cx="7.5" cy="14.5" r="1.5"/>
                  <circle cx="16.5" cy="14.5" r="1.5"/>
                </svg>
              </div>
              <span className="font-display text-2xl font-bold tracking-wide">PhuOng Tourist Car</span>
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight mb-4">Create your account</h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Register to experience our premium tour car services.
            </p>
          </div>
          <div className="space-y-4">
            {['Quick and easy booking', 'Track your trip history', 'Receive notifications and special offers'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-ochre/20 border border-ochre/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-ochre" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-mist/30 px-6 py-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 bg-navy rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/>
                <circle cx="16.5" cy="14.5" r="1.5"/>
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-navy">PhuOng Tourist Car</span>
          </div>

          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-navy">Register</h1>
            <p className="text-gray-500 mt-2">Fill in your details to create an account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Full name <span className="text-red-500">*</span></label>
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Nguyễn Văn A" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@gmail.com" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Phone number <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="0901234567" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required className={inputClass + ' pr-12'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition">
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Confirm password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError('') }} placeholder="••••••••" required className={inputClass + ' pr-12'} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition">
                  <EyeIcon visible={showConfirm} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-navy hover:bg-navy-light disabled:bg-navy/50 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : 'Create account'}
            </button>
          </form>

          {/* Google Register */}
          <div className="mt-5">
            <div className="relative flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <a
              href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 font-semibold text-gray-700 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </a>
          </div>

          <p className="mt-5 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-ochre font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
