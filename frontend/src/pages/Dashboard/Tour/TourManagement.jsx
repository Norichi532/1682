import React, { useState, useEffect } from 'react';
import TourService from '../../../services/tour.service';
import { useSelector } from 'react-redux';
import TourModal from './TourModal'; 

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const canEdit = user?.role_id === 1 || user?.role_id === 2;

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await TourService.getAllTours();
      if (response.success) {
        setTours(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách Tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tour này?')) {
      try {
        await TourService.deleteTour(id);
        alert('Xóa thành công!');
        fetchTours();
      } catch (error) {
        console.error("Lỗi chi tiết khi xóa tour:", error);
        alert('Lỗi khi xóa tour. Vui lòng thử lại!');
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingTour(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tour) => {
    setEditingTour(tour);
    setIsModalOpen(true);
  };

  const handleSaveTour = async (tourData) => {
    try {
      if (editingTour) {
        await TourService.updateTour(editingTour.id, tourData);
        alert('Cập nhật thành công!');
      } else {
        await TourService.createTour(tourData);
        alert('Thêm tour thành công!');
      }
      setIsModalOpen(false); 
      fetchTours(); 
    } catch (error) {
      console.error('Lỗi khi lưu tour:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Tour</h1>
        {canEdit && (
          <button onClick={handleOpenAdd} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            + Thêm Tour Mới
          </button>
        )}
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-4">ID</th>
                <th className="p-4">Tên Tour</th>
                <th className="p-4">Điểm đến</th>
                <th className="p-4">Giá (VNĐ)</th>
                <th className="p-4">Trạng thái</th>
                {canEdit && <th className="p-4 text-center">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{tour.id}</td>
                  <td className="p-4 font-medium">{tour.name}</td>
                  <td className="p-4">{tour.end_location}</td>
                  <td className="p-4">{tour.price_per_person?.toLocaleString()} đ</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {tour.status}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="p-4 text-center">
                      {/* ĐÃ SỬA: Thay thế text link bằng các nút có nền và bo góc xịn xò */}
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(tour)} 
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition-colors font-medium"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(tour.id)} 
                          className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {tours.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">Chưa có tour nào trong hệ thống.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <TourModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveTour} 
          tourToEdit={editingTour}
        />
      )}
    </div>
  );
};

export default TourManagement;