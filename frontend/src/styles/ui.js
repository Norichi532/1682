/**
 * PhuOngtravel Design System — class constants
 *
 * Cách dùng:
 *   import { btn, input, badge, table, modal, page } from '@/styles/ui';
 *   <button className={btn.primary}>Lưu</button>
 */

// ─── MÀU SẮC THƯƠNG HIỆU ────────────────────────────────────────────────────
export const color = {
  // Primary — Blue
  primary:        'blue-600',
  primaryHover:   'blue-700',
  primaryLight:   'blue-50',
  primaryText:    'blue-600',

  // Trạng thái
  success:        'green',   // active / success
  warning:        'yellow',  // maintenance / warning
  danger:         'red',     // inactive / error

  // Neutral
  bg:             'gray-50',
  border:         'gray-200',
  textPrimary:    'gray-900',
  textSecondary:  'gray-500',
  textMuted:      'gray-400',
};

// ─── LAYOUT / PAGE ───────────────────────────────────────────────────────────
export const page = {
  /** Wrapper toàn trang (dùng trong mỗi page component) */
  wrapper:    'p-6 bg-gray-50 min-h-screen',

  /** Thanh đầu trang: tiêu đề bên trái + nút hành động bên phải */
  header:     'flex justify-between items-center mb-6',

  /** Tiêu đề trang h1 */
  title:      'text-2xl font-bold text-gray-900',

  /** Mô tả nhỏ dưới tiêu đề */
  subtitle:   'text-sm text-gray-500 mt-1',
};

// ─── BUTTONS ─────────────────────────────────────────────────────────────────
export const btn = {
  /** Nút chính — xanh đậm, dùng cho hành động chính (Thêm mới, Lưu) */
  primary:
    'flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors',

  /** Nút submit trong form modal */
  submit:
    'px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer',

  /** Nút phụ — xám nhạt, dùng cho Hủy / Back */
  secondary:
    'px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer',

  /** Nút icon nhỏ — dùng trong cột Hành động của bảng */
  iconEdit:   'text-gray-400 hover:text-blue-600 cursor-pointer transition-colors',
  iconDelete: 'text-gray-400 hover:text-red-600 cursor-pointer transition-colors',

  /** Nút full-width trang Login */
  loginPrimary:
    'w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]',

  /** Nút đăng nhập Google (outline) */
  loginGoogle:
    'w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm',
};

// ─── INPUTS & FORM ────────────────────────────────────────────────────────────
export const input = {
  /** Input / Select tiêu chuẩn dùng trong Modal */
  base:
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors',

  /** Select cần thêm bg-white để tránh bị trong suốt */
  select:
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white',

  /** Input lớn trang Login */
  login:
    'w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium bg-gray-50/50',

  /** Label của form field */
  label:      'block text-sm font-medium text-gray-700 mb-1',

  /** Label đậm hơn (dùng ở trang Login) */
  labelBold:  'block text-sm font-bold text-gray-700 mb-2',

  /** Wrapper 2 cột trong modal form */
  grid2:      'grid grid-cols-1 md:grid-cols-2 gap-4',
};

// ─── BADGES / TRẠNG THÁI ─────────────────────────────────────────────────────
export const badge = {
  /** Wrapper chung cho mọi badge */
  base: 'px-3 py-1 rounded-full text-xs font-semibold',

  /** Màu theo trạng thái */
  active:   'bg-green-100 text-green-700',
  warning:  'bg-yellow-100 text-yellow-700',
  inactive: 'bg-red-100 text-red-700',
  default:  'bg-gray-100 text-gray-700',
  info:     'bg-blue-100 text-blue-700',
};

/** Helper: tự chọn màu badge theo giá trị status */
export const getBadgeClass = (status) => {
  const map = {
    'Hoạt động':        badge.active,
    'Đang diễn ra':     badge.active,
    'Sắp khởi hành':    badge.info,
    'Bảo dưỡng':        badge.warning,
    'Tạm dừng':         badge.warning,
    'Ngừng hoạt động':  badge.inactive,
    'Đã kết thúc':      badge.inactive,
    'Đã huỷ':           badge.inactive,
  };
  return `${badge.base} ${map[status] ?? badge.default}`;
};

// ─── TABLE ───────────────────────────────────────────────────────────────────
export const table = {
  /** Card bao ngoài bảng */
  card:       'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',

  /** Wrapper scroll ngang */
  scroll:     'overflow-x-auto',

  /** Thẻ <table> */
  root:       'w-full text-left border-collapse',

  /** Hàng <thead> */
  head:       'bg-gray-50 border-b border-gray-200 text-sm text-gray-600',

  /** Cell <th> */
  th:         'px-6 py-4 font-medium',

  /** <tbody> — có đường kẻ phân cách */
  body:       'divide-y divide-gray-200',

  /** Hàng dữ liệu */
  tr:         'hover:bg-gray-50 text-sm text-gray-800',

  /** Cell <td> */
  td:         'px-6 py-4',

  /** Trạng thái rỗng (không có dữ liệu) */
  empty:      'px-6 py-8 text-center text-gray-500',
};

// ─── MODAL ───────────────────────────────────────────────────────────────────
export const modal = {
  /** Lớp phủ nền đen mờ */
  overlay:    'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm',

  /** Hộp modal */
  container:  'bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto',

  /** Header modal (sticky) */
  header:     'flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10',

  /** Tiêu đề trong header */
  title:      'text-xl font-bold text-gray-800',

  /** Nút X đóng modal */
  closeBtn:   'text-gray-400 hover:text-red-500 transition-colors',

  /** Body (phần form) */
  body:       'p-6 space-y-4',

  /** Footer (hàng nút hành động) */
  footer:     'flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6',
};

// ─── CARD THỐNG KÊ (Dashboard) ───────────────────────────────────────────────
export const statCard = {
  /** Base card */
  base:     'bg-white p-6 rounded-lg shadow border-l-4',

  /** Màu viền trái theo loại */
  blue:     'border-blue-500',
  green:    'border-green-500',
  yellow:   'border-yellow-500',
  red:      'border-red-500',

  /** Nhãn trên */
  label:    'text-gray-500 text-sm font-medium uppercase tracking-wide',

  /** Số liệu chính */
  value:    'text-3xl font-bold text-gray-800 mt-2',

  /** Chú thích nhỏ (tăng/giảm) */
  note:     'text-sm font-normal',
  noteGood: 'text-green-500',
  noteBad:  'text-red-500',
};

// ─── LOADING ─────────────────────────────────────────────────────────────────
export const loading = {
  /** Spinner nhỏ (dùng trong button) */
  spinner:    'w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin',

  /** Wrapper spinner trong button */
  btnWrapper: 'flex items-center justify-center gap-2',

  /** Loading toàn trang */
  page:       'text-center py-10 text-gray-500',
};

// ─── THÔNG BÁO LỖI / ALERT ───────────────────────────────────────────────────
export const alert = {
  /** Thông báo lỗi (form) */
  error:
    'mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 font-semibold flex items-center gap-2',

  /** Dot nhấp nháy trong error */
  errorDot: 'w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse',

  /** Thông báo thành công */
  success:
    'mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700 font-semibold flex items-center gap-2',
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
export const sidebar = {
  /** Container */
  root:       'w-64 bg-white border-r border-gray-200 flex flex-col h-screen',

  /** Khu vực logo */
  logo:       'h-16 flex items-center px-6 border-b border-gray-200 text-2xl font-bold text-blue-600 tracking-tight',

  /** Khu vực nav */
  nav:        'flex-1 p-4 space-y-2',

  /** Nav item — class base */
  navItem:    'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',

  /** Nav item active */
  navActive:  'bg-blue-50 text-blue-600 shadow-sm',

  /** Nav item inactive */
  navInactive:'text-gray-500 hover:bg-gray-50',
};
