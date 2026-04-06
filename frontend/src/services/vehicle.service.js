import axios from 'axios';

// Thay đổi URL này nếu Backend của bạn chạy ở cổng khác
const API_URL = 'http://localhost:5000/api/vehicles';

export const vehicleService = {
  // Lấy danh sách xe
  getAllVehicles: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Lỗi API getVehicles:', error);
      throw error;
    }
  },

  // Thêm xe mới
  createVehicle: async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi API createVehicle:', error);
      throw error;
    }
  },

  // MỚI THÊM: Cập nhật (Sửa) thông tin xe
  updateVehicle: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi API updateVehicle:', error);
      throw error;
    }
  },

  // MỚI THÊM: Xóa xe
  deleteVehicle: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi API deleteVehicle:', error);
      throw error;
    }
  }
};