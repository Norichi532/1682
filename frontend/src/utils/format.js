export const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '—';

export const formatDateTime = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
    : '—';
