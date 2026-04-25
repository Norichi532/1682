import React, { useState } from 'react';

const TourModal = ({ onClose, onSave, tourToEdit }) => {
  // Nạp dữ liệu ngay từ lúc khởi tạo State, loại bỏ hoàn toàn useEffect
  const [formData, setFormData] = useState(() => {
    if (tourToEdit) {
      // Cắt bớt chuỗi thời gian thừa để tương thích với input type="datetime-local"
      return {
        ...tourToEdit,
        start_time: tourToEdit.start_time ? new Date(tourToEdit.start_time).toISOString().slice(0, 16) : '',
        end_time: tourToEdit.end_time ? new Date(tourToEdit.end_time).toISOString().slice(0, 16) : '',
      };
    }
    // Nếu không có tourToEdit (khi Thêm mới) thì trả về form rỗng
    return {
      name: '', description: '', start_location: '', end_location: '',
      start_time: '', end_time: '', price_per_person: '',
      vehicle_type_required: 16, status: 'Sắp khởi hành'
    };
  });

  // Hàm xử lý khi người dùng gõ vào các ô input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi bấm nút Lưu
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ép kiểu số cho giá và loại xe trước khi gửi đi
    const dataToSave = {
      ...formData,
      price_per_person: Number(formData.price_per_person),
      vehicle_type_required: Number(formData.vehicle_type_required)
    };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{tourToEdit ? 'Chỉnh sửa Tour' : 'Thêm Tour Mới'}</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Tên Tour *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Vd: Tour Khám phá Bà Nà Hills..." />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" rows="2"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Điểm đón *</label>
            <input required type="text" name="start_location" value={formData.start_location} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Điểm đến *</label>
            <input required type="text" name="end_location" value={formData.end_location} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Khởi hành *</label>
            <input required type="datetime-local" name="start_time" value={formData.start_time} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kết thúc *</label>
            <input required type="datetime-local" name="end_time" value={formData.end_time} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Giá vé / Người (VNĐ) *</label>
            <input required type="number" min="0" name="price_per_person" value={formData.price_per_person} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Yêu cầu loại xe *</label>
            <select name="vehicle_type_required" value={formData.vehicle_type_required} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="16">Xe 16 chỗ</option>
              <option value="29">Xe 29 chỗ</option>
              <option value="45">Xe 45 chỗ</option>
            </select>
          </div>

          {tourToEdit && (
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="Sắp khởi hành">Sắp khởi hành</option>
                <option value="Đang diễn ra">Đang diễn ra</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
          )}

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu thông tin</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourModal;