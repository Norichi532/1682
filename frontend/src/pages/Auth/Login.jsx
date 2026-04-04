import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth.service';
import { setCredentials, setLoading } from '../../store/slices/authSlice';
import '../../styles/Login.css';

const Login = () => {
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

  return (
    <div className="login-page">
      {/* Left Column - Hero Section like Landing Page */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">PhuOngtravel</h1>
          <p className="hero-description">
            Book tour vehicles from 16 to 45 seats. Easy scheduling, verified drivers, unforgettable trips.
          </p>
          <div className="hero-buttons">
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="login-section">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue your journey</p>

          {/* Google Button on top */}
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
            />
            Continue with Google
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="login-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
            <span className="footer-separator">•</span>
            <Link to="/register" className="signup-link-text">
              Need an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;