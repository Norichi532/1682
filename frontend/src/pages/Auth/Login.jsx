import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth.service';
import { setCredentials, setLoading } from '../../store/slices/authSlice';

const Login = () => {
  // === TOÀN BỘ LOGIC CŨ CỦA BẠN ĐƯỢC GIỮ NGUYÊN ===
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const data = await login(email, password);
      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = () => {
    alert('Google login will be implemented soon');
  };

  // === GIAO DIỆN TAILWIND MỚI (TỶ LỆ 60-40) ===
  return (
    <div className="flex h-screen w-full bg-white font-sans">
      
      {/* CỘT TRÁI: Hero Section (Chiếm 60%) */}
      <div className="hidden lg:flex lg:w-3/5 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-800"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        
        <div className="relative z-10 text-center px-12 max-w-2xl">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md mb-6">
            PhuOngtravel
          </h1>
          <p className="text-blue-100 text-lg font-medium leading-relaxed mb-8">
            Book tour vehicles from 16 to 45 seats. Easy scheduling, verified drivers, unforgettable trips.
          </p>
          <button className="px-8 py-3 border-2 border-white/30 rounded-full text-white font-medium hover:bg-white/10 transition-colors duration-300">
            Learn More
          </button>
        </div>
      </div>

      {/* CỘT PHẢI: Login Form (Chiếm 40%) */}
      <div className="flex w-full lg:w-2/5 items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-2">Sign in to continue your journey</p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Or</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Hiển thị lỗi nếu đăng nhập sai */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-md shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-8">
            <Link to="/forgot-password" className="text-blue-600 font-medium hover:underline">
              Forgot password?
            </Link>
            <span>•</span>
            <Link to="/register" className="text-gray-600 hover:text-gray-900">
              Need an account? <span className="text-blue-600 font-medium hover:underline">Sign up</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;