import { useEffect, useRef, useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import { useNavigate } from 'react-router-dom'

const STATS = [
  { value: '5+', label: 'Năm kinh nghiệm' },
  { value: '50+', label: 'Chuyến xe mỗi tháng' },
  { value: '3', label: 'Loại phương tiện' },
  { value: '100%', label: 'Tài xế được đào tạo' },
]

const VALUES = [
  { icon: '🛡️', title: 'An toàn', desc: 'Xe được kiểm định định kỳ, tài xế được huấn luyện kỹ năng lái xe an toàn và xử lý tình huống.' },
  { icon: '⏰', title: 'Đúng giờ', desc: 'Theo dõi lịch bay thực tế, cập nhật tình trạng giao thông để đảm bảo đón đúng hẹn.' },
  { icon: '💼', title: 'Chuyên nghiệp', desc: 'Tài xế ăn mặc lịch sự, thái độ niềm nở, am hiểu địa bàn Đà Nẵng và các tỉnh lân cận.' },
  { icon: '💰', title: 'Giá minh bạch', desc: 'Bảng giá công khai theo từng loại xe và tuyến đường, không phát sinh chi phí ẩn.' },
]

function AnimatedCard({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative overflow-hidden bg-navy py-24 px-4">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 60%, hsl(38,92%,45%) 0%, transparent 50%), radial-gradient(circle at 75% 25%, hsl(214,32%,91%) 0%, transparent 40%)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-ochre text-sm font-semibold uppercase tracking-widest mb-3 font-body">Về chúng tôi</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
            PhuOng Tourist Car
          </h1>
          <p className="text-white/70 font-body text-lg leading-relaxed max-w-2xl mx-auto">
            Đơn vị cung cấp dịch vụ xe du lịch chuyên nghiệp tại Đà Nẵng, phục vụ đưa đón sân bay, tour tham quan và các hành trình đặc biệt cho cá nhân lẫn đoàn khách.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <AnimatedCard key={s.label} delay={i * 80}>
              <div className="text-center p-4">
                <div className="font-display text-4xl font-extrabold text-ochre mb-1">{s.value}</div>
                <div className="text-gray-500 text-sm font-body">{s.label}</div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <AnimatedCard>
          <h2 className="font-display text-3xl font-bold text-navy mb-5">Câu chuyện của chúng tôi</h2>
          <p className="text-gray-600 leading-relaxed mb-4 font-body">
            PhuOng Tourist Car được thành lập với mong muốn mang đến dịch vụ vận chuyển du lịch tiện lợi, an toàn và đáng tin cậy tại thành phố biển Đà Nẵng — một trong những điểm đến hàng đầu Việt Nam.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4 font-body">
            Với đội xe gồm Ford Transit 16 chỗ, Hyundai County 29 chỗ và Hyundai Universe 45 chỗ, chúng tôi phục vụ từ nhóm nhỏ đến đoàn khách lớn, phù hợp với mọi nhu cầu di chuyển.
          </p>
          <p className="text-gray-600 leading-relaxed font-body">
            Toàn bộ xe đều màu trắng tinh tế, được bảo dưỡng định kỳ và trang bị đầy đủ tiện nghi hiện đại để mang lại trải nghiệm tốt nhất cho hành khách.
          </p>
        </AnimatedCard>
        <AnimatedCard delay={150}>
          <div className="rounded-2xl overflow-hidden shadow-2xl h-72 group">
            <img
              src="https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800"
              alt="PhuOng Tourist Car"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </AnimatedCard>
      </div>

      {/* Values */}
      <div className="bg-mist/50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatedCard>
            <h2 className="font-display text-3xl font-bold text-navy text-center mb-12">Giá trị cốt lõi</h2>
          </AnimatedCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <AnimatedCard key={v.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm text-center hover-lift">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-display font-bold text-navy mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-body">{v.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '📍', label: 'Địa chỉ', value: 'Đà Nẵng, Việt Nam' },
          { icon: '📞', label: 'Điện thoại', value: '0901 000 001' },
          { icon: '✉️', label: 'Email', value: 'admin@phuongtravel.vn' },
        ].map((c, i) => (
          <AnimatedCard key={c.label} delay={i * 80}>
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm hover-lift">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <p className="text-xs text-ochre uppercase tracking-wide mb-1 font-semibold">{c.label}</p>
                <p className="font-semibold text-navy">{c.value}</p>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-navy py-16 px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-white mb-4">Sẵn sàng đặt xe?</h2>
        <p className="text-white/60 font-body mb-8">Xem ngay danh sách dịch vụ và chọn tuyến đường phù hợp.</p>
        <button
          onClick={() => navigate('/services')}
          className="px-10 py-3.5 bg-ochre hover:bg-ochre-light text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg"
        >
          Xem dịch vụ →
        </button>
      </div>
    </PublicLayout>
  )
}
