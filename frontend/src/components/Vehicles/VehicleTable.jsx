import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

// 1. Nhận thêm onEdit và onDelete từ Component cha truyền xuống
const VehicleTable = ({ vehicles, onEdit, onDelete }) => {
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Hoạt động': return 'bg-green-100 text-green-700';
      case 'Bảo dưỡng': return 'bg-yellow-100 text-yellow-700';
      case 'Ngừng hoạt động': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="px-6 py-4 font-medium">Biển số</th>
              <th className="px-6 py-4 font-medium">Hãng / Dòng xe</th>
              <th className="px-6 py-4 font-medium">Chỗ ngồi</th>
              <th className="px-6 py-4 font-medium">Nhiên liệu</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50 text-sm text-gray-800">
                <td className="px-6 py-4 font-medium">{vehicle.license_plate}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{vehicle.brand}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{vehicle.model}</div>
                </td>
                <td className="px-6 py-4">{vehicle.seat_capacity} chỗ</td>
                <td className="px-6 py-4">{vehicle.fuel_type}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    {/* 2. Gắn sự kiện mở Form Sửa */}
                    <button 
                      onClick={() => onEdit(vehicle)}
                      className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    
                    {/* 3. Gắn sự kiện Xóa xe */}
                    <button 
                      onClick={() => onDelete(vehicle.id)}
                      className="text-gray-400 hover:text-red-600 cursor-pointer transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Chưa có dữ liệu xe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleTable;