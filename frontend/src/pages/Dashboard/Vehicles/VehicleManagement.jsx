import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import VehicleTable from '../../../components/Vehicles/VehicleTable';
import VehicleModal from '../../../components/Vehicles/VehicleModal';
import { vehicleService } from '../../../services/vehicle.service';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State lưu trữ xe đang được chọn để Sửa
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Hàm gọi API lấy danh sách xe
  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const res = await vehicleService.getAllVehicles();
      if (res.success) {
        setVehicles(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động lấy danh sách khi load trang
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Xử lý khi bấm nút "Thêm xe mới"
  const handleAddNew = () => {
    setSelectedVehicle(null); // Đảm bảo form trống
    setIsModalOpen(true);
  };

  // Xử lý khi bấm nút "Sửa" trên bảng
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle); // Nạp dữ liệu xe vào state
    setIsModalOpen(true);        // Mở Modal lên
  };

  // Xử lý khi bấm nút "Xóa" trên bảng
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phương tiện này? Hành động này không thể hoàn tác!')) {
      try {
        const res = await vehicleService.deleteVehicle(id);
        if (res.success) {
          alert('Xóa thành công!');
          fetchVehicles(); // Tải lại danh sách sau khi xóa
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi xóa!';
        alert(errorMsg);
      }
    }
  };

  // Hàm gọi sau khi Thêm/Sửa thành công ở Form
  const handleSuccess = () => {
    fetchVehicles();
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Xe</h1>
          <p className="text-sm text-gray-500 mt-1">Xem danh sách, thêm, sửa hoặc xóa thông tin phương tiện.</p>
        </div>
        
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors"
        >
          <Plus size={20} />
          Thêm xe mới
        </button>
      </div>

      {/* Hiển thị Loading hoặc Bảng */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <VehicleTable 
          vehicles={vehicles} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}

      {/* Render Modal. Dùng điều kiện && để đảm bảo Modal luôn reset state mỗi khi mở */}
      {isModalOpen && (
        <VehicleModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          vehicle={selectedVehicle} 
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default VehicleManagement;