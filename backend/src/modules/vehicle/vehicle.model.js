const db = require('../../config/database');

const VehicleModel = {
  // Lấy danh sách tất cả xe (sắp xếp theo thời gian tạo mới nhất)
  getAll: async () => {
    const query = `
      SELECT id, license_plate, brand, model, seat_capacity, 
             fuel_type, year_of_manufacture, status, created_at, updated_at
      FROM vehicles
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query);
    return result.rows;
  },

  // Thêm xe mới
  create: async (vehicleData) => {
    const { license_plate, brand, model, seat_capacity, fuel_type, year_of_manufacture, status } = vehicleData;
    const query = `
      INSERT INTO vehicles (license_plate, brand, model, seat_capacity, fuel_type, year_of_manufacture, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [license_plate, brand, model, seat_capacity, fuel_type, year_of_manufacture, status];
    const result = await db.query(query, values);
    return result.rows[0];
  },
  // Cập nhật thông tin xe
  update: async (id, vehicleData) => {
    const { license_plate, brand, model, seat_capacity, fuel_type, year_of_manufacture, status } = vehicleData;
    const query = `
      UPDATE vehicles 
      SET license_plate = $1, brand = $2, model = $3, seat_capacity = $4, 
          fuel_type = $5, year_of_manufacture = $6, status = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *;
    `;
    const values = [license_plate, brand, model, seat_capacity, fuel_type, year_of_manufacture, status, id];
    const result = await db.query(query, values);
    return result.rows[0]; // Trả về undefined nếu không tìm thấy ID
  },

  // Xóa xe
  delete: async (id) => {
    const query = `
      DELETE FROM vehicles 
      WHERE id = $1
      RETURNING id;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0]; 
  }
};


module.exports = VehicleModel;