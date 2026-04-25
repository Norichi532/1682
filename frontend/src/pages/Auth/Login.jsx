import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth.service';
import { setCredentials, setLoading } from '../../store/slices/authSlice';

const Login = () => {
  // --- LOGIC GỐC CỦA BẠN ---
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
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = () => {
    alert('Tính năng đăng nhập Google đang được phát triển');
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      
      {/* CỘT TRÁI: Hero Section (Chiếm 60%) */}
      <div className="hidden lg:flex lg:w-3/5 relative items-center justify-center overflow-hidden">
        {/* Lớp nền Gradient xanh hiện đại */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-800"></div>
        {/* Ảnh nền mờ tạo chiều sâu */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        
        <div className="relative z-10 text-center px-12 max-w-2xl">
          <h1 className="text-6xl font-black text-white tracking-tighter mb-6 drop-shadow-lg">
            PhuOngtravel
          </h1>
          <p className="text-blue-100 text-xl font-medium leading-relaxed mb-10 opacity-90">
            Hệ thống quản lý vận tải du lịch chuyên nghiệp. 
            Đặt xe 16 - 45 chỗ, điều phối lịch trình thông minh.
          </p>
          <div className="flex gap-4 justify-center">
            <div className="px-6 py-2 bg-white/10 rounded-full border border-white/20 text-white text-sm backdrop-blur-md">
              Hơn 500+ Tour mỗi tháng
            </div>
            <div className="px-6 py-2 bg-white/10 rounded-full border border-white/20 text-white text-sm backdrop-blur-md">
              Đội ngũ tài xế chuyên nghiệp
            </div>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: Login Form (Chiếm 40%) */}
      <div className="flex w-full lg:w-2/5 items-center justify-center p-8 sm:p-16 bg-white">
        <div className="w-full max-w-md">
          
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Chào mừng trở lại</h2>
            <p className="text-gray-500 mt-2 font-medium">Vui lòng đăng nhập để quản trị hệ thống</p>
          </div>

          {/* Google Login */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Tiếp tục với Google
          </button>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Hoặc dùng Email</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          {/* Thông báo lỗi */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@phuongtravel.vn"
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium bg-gray-50/50"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium bg-gray-50/50"
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex items-center justify-end text-sm">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang xử lý...
                </div>
              ) : 'Đăng nhập ngay'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-10">
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline transition-all">
              Đăng ký tài khoản mới
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;