const VehicleModel = require('./vehicle.model');

const VehicleController = {
  // 1. Xử lý GET /api/vehicles
  getVehicles: async (req, res) => {
    try {
      const vehicles = await VehicleModel.getAll();
      res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách xe:', error);
      res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu xe' });
    }
  }, // <-- Chú ý: Cần có dấu phẩy ở đây

  // 2. Xử lý POST /api/vehicles
  createVehicle: async (req, res) => {
    try {
      const newVehicle = await VehicleModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Thêm xe thành công',
        data: newVehicle
      });
    } catch (error) {
      console.error('Lỗi khi thêm xe:', error);
      if (error.code === '23505') {
        return res.status(400).json({ success: false, message: 'Biển số xe đã tồn tại' });
      }
      res.status(500).json({ success: false, message: 'Lỗi server khi thêm xe mới' });
    }
  }, // <-- CHÍNH LÀ DẤU PHẨY NÀY ĐÂY (Nơi gây ra lỗi của bạn)

  // 3. Xử lý PUT /api/vehicles/:id
  updateVehicle: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedVehicle = await VehicleModel.update(id, req.body);
      
      if (!updatedVehicle) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy phương tiện để cập nhật' });
      }

      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công',
        data: updatedVehicle
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật xe:', error);
      if (error.code === '23505') {
        return res.status(400).json({ success: false, message: 'Biển số xe đã tồn tại trên một xe khác' });
      }
      res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật xe' });
    }
  }, // <-- Cần có dấu phẩy ở đây

  // 4. Xử lý DELETE /api/vehicles/:id
  deleteVehicle: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedVehicle = await VehicleModel.delete(id);
      
      if (!deletedVehicle) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy phương tiện để xóa' });
      }

      res.status(200).json({
        success: true,
        message: 'Xóa phương tiện thành công'
      });
    } catch (error) {
      console.error('Lỗi khi xóa xe:', error);
      if (error.code === '23503') {
        return res.status(400).json({ 
          success: false, 
          message: 'Không thể xóa vì phương tiện này đang được sử dụng trong hệ thống (đã xếp lịch hoặc có chuyến)' 
        });
      }
      res.status(500).json({ success: false, message: 'Lỗi server khi xóa xe' });
    }
  }
};

module.exports = VehicleController;