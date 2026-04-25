const ok = (res, data, message = 'Thành công', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

const created = (res, data, message = 'Tạo mới thành công') =>
  res.status(201).json({ success: true, message, data });

const fail = (res, message = 'Lỗi server', statusCode = 500) =>
  res.status(statusCode).json({ success: false, message });

const paginated = (res, data, meta) =>
  res.status(200).json({ success: true, data, meta });

module.exports = { ok, created, fail, paginated };
