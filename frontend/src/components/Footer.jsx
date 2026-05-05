export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="PhuOng Tourist Car" className="w-8 h-8 rounded-lg object-contain" />
              <span className="text-lg font-bold text-white">PhuOng Tourist Car</span>
            </div>
            <p className="text-sm text-gray-400">Dịch vụ xe du lịch chuyên nghiệp tại Đà Nẵng</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition">Trang chủ</a></li>
              <li><a href="/services" className="hover:text-white transition">Dịch vụ</a></li>
              <li><a href="/vehicles" className="hover:text-white transition">Phương tiện</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Liên hệ</h3>
            <div className="space-y-2 text-sm">
              <p>Địa chỉ: 09 Tiên Sơn 06, Đà Nẵng</p>
              <p>Email: impphat69@gmail.com</p>
              <p>Điện thoại: 0335 966 977</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 PhuOng Tourist Car. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  )
}
