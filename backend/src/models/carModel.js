// models/CarModel.js
module.exports = (sequelize, DataTypes) => {
  const CarModel = sequelize.define('CarModel', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    model_name: { type: DataTypes.STRING(150), allowNull: false },
    num_seats: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT },
    features: { type: DataTypes.JSONB }, // Lưu các tiện ích như ["wifi", "nước suối"]
    image_url: { type: DataTypes.TEXT },
    images: { type: DataTypes.JSONB, defaultValue: [] } // Gallery nhiều ảnh
  }, {
    tableName: 'car_models',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  CarModel.associate = function(models) {
    // 1 Dòng xe (vd: Ford Transit 16 chỗ) sẽ có nhiều chiếc xe thực tế chạy trên đường
    CarModel.hasMany(models.Car, { foreignKey: 'model_id', as: 'cars' });
  };

  return CarModel;
};