import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-700 mb-2">Phương Tourist Car</h1>
      <p className="text-gray-500 mb-8">Hệ thống quản lý xe du lịch</p>
      <Link
        to="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Đăng nhập
      </Link>
    </div>
  );
}
