import React, { useState } from 'react';
import { X } from 'lucide-react';
import { vehicleService } from '../../services/vehicle.service';

const VehicleModal = ({ isOpen, onClose, vehicle = null, onSuccess }) => {
  // 1. Đưa useState lên TRÊN CÙNG để không vi phạm rule của React Hooks
  const [formData, setFormData] = useState(
    vehicle || {
      license_plate: '',
      brand: '',
      model: '',
      seat_capacity: 16, // Mặc định là xe 16 chỗ theo quy định dự án
      fuel_type: 'Xăng',
      year_of_manufacture: new Date().getFullYear(),
      status: 'Hoạt động',
    }
  );

  // 2. Đưa lệnh ẩn Modal xuống dưới các Hooks
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Ép kiểu dữ liệu về dạng Số (Number) cho sức chứa và năm sản xuất
    const parsedValue = (name === 'seat_capacity' || name === 'year_of_manufacture') 
      ? Number(value) 
      : value;

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!vehicle) {
        // Chế độ Thêm mới
        const res = await vehicleService.createVehicle(formData);
        if (res.success) {
          alert('Thêm phương tiện thành công!');
          if (onSuccess) onSuccess(); 
        }
      } else {
        // Chế độ Cập nhật (Sửa)
        const res = await vehicleService.updateVehicle(vehicle.id, formData);
        if (res.success) {
          alert('Cập nhật phương tiện thành công!');
          if (onSuccess) onSuccess();
        }
      }
    } catch (error) {
      console.error('Lỗi khi submit form:', error);
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      alert(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {vehicle ? 'Chỉnh sửa thông tin xe' : 'Thêm phương tiện mới'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe *</label>
              <input
                type="text"
                name="license_plate"
                required
                value={formData.license_plate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="VD: 43A-123.45"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hãng xe *</label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="VD: Toyota"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dòng xe (Model) *</label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="VD: Innova"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa (Chỗ ngồi) *</label>
              <select
                name="seat_capacity"
                value={formData.seat_capacity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value={16}>Xe 16 chỗ</option>
                <option value={29}>Xe 29 chỗ</option>
                <option value={45}>Xe 45 chỗ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại nhiên liệu</label>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Xăng">Xăng</option>
                <option value="Dầu Diesel">Dầu Diesel</option>
                <option value="Điện">Điện</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Năm sản xuất</label>
              <input
                type="number"
                name="year_of_manufacture"
                min="2000"
                max={new Date().getFullYear()}
                value={formData.year_of_manufacture}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Bảo dưỡng">Bảo dưỡng</option>
                <option value="Ngừng hoạt động">Ngừng hoạt động</option>
              </select>
            </div>
          </div>

          {/* Footer Modal - Nút hành động */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              {vehicle ? 'Lưu thay đổi' : 'Xác nhận Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;