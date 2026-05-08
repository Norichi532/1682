import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function VNPayReturnPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading | success | fail
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries())
        const res = await api.get('/payments/vnpay-return', { params })
        if (res.data.success) {
          setStatus('success')
          setMessage('Deposit payment successful! Your booking has been confirmed.')
        } else {
          setStatus('fail')
          setMessage(res.data.message || 'Payment failed or was cancelled.')
        }
      } catch {
        setStatus('fail')
        setMessage('An error occurred while confirming payment.')
      }
    }
    verify()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-mist/30 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-14 h-14 border-4 border-navy/20 border-t-ochre rounded-full animate-spin mx-auto mb-6" />
            <p className="text-gray-500">Confirming payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-navy mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500 mb-8">{message}</p>
            <div className="space-y-3">
              <button onClick={() => navigate('/my-orders')}
                className="w-full py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-light transition">
                View my bookings
              </button>
              <button onClick={() => navigate('/')}
                className="w-full py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                Back to home
              </button>
            </div>
          </>
        )}

        {status === 'fail' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-navy mb-2">Payment Failed</h1>
            <p className="text-gray-500 mb-8">{message}</p>
            <div className="space-y-3">
              <button onClick={() => navigate(-1)}
                className="w-full py-3 bg-ochre text-white font-semibold rounded-xl hover:bg-ochre-light transition">
                Try again
              </button>
              <button onClick={() => navigate('/')}
                className="w-full py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                Back to home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
