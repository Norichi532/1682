import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import GoogleCallbackPage from './pages/GoogleCallbackPage'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import CategoryPage from './pages/CategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import VehiclesPage from './pages/VehiclesPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import AboutPage from './pages/AboutPage'

// Customer Pages
import BookingPage from './pages/BookingPage'
import MyOrdersPage from './pages/MyOrdersPage'
import ProfilePage from './pages/ProfilePage'

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage'
import BookingsManagePage from './pages/admin/BookingsManagePage'
import UsersManagePage from './pages/admin/UsersManagePage'
import CarsManagePage from './pages/admin/CarsManagePage'
import CarModelsManagePage from './pages/admin/CarModelsManagePage'
import ProductsManagePage from './pages/admin/ProductsManagePage'
import CalendarPage from './pages/admin/CalendarPage'

// Driver Pages
import SchedulePage from './pages/driver/SchedulePage'

// Payment Pages
import VNPayReturnPage from './pages/VNPayReturnPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/cat/:categoryId" element={<CategoryPage />} />
          <Route path="/services/:id" element={<ProductDetailPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

          {/* Customer */}
          <Route path="/booking/:productId" element={<ProtectedRoute allowedRoles={[2]}><BookingPage /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute allowedRoles={[2]}><MyOrdersPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={[2, 3]}><ProfilePage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={[1]}><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={[1]}><BookingsManagePage /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute allowedRoles={[1]}><ProductsManagePage /></ProtectedRoute>} />
          <Route path="/admin/car-models" element={<ProtectedRoute allowedRoles={[1]}><CarModelsManagePage /></ProtectedRoute>} />
          <Route path="/admin/cars" element={<ProtectedRoute allowedRoles={[1]}><CarsManagePage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={[1]}><UsersManagePage /></ProtectedRoute>} />
          <Route path="/admin/calendar" element={<ProtectedRoute allowedRoles={[1]}><CalendarPage /></ProtectedRoute>} />

          {/* Driver */}
          <Route path="/admin/schedule" element={<ProtectedRoute allowedRoles={[3]}><SchedulePage /></ProtectedRoute>} />

          {/* Payment callback */}
          <Route path="/vnpay-return" element={<VNPayReturnPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
