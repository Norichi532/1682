// models/Car.js
module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define('Car', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    model_id: { type: DataTypes.INTEGER, allowNull: false },
    driver_id: { type: DataTypes.UUID },
    license_plate: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    color: { type: DataTypes.STRING(50) },
    status: { type: DataTypes.STRING(50), defaultValue: 'AVAILABLE' },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'cars',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Car.associate = function(models) {
    // Mỗi chiếc xe phải thuộc về 1 dòng xe
    Car.belongsTo(models.CarModel, { foreignKey: 'model_id', as: 'model_info' });
    
    // Mỗi chiếc xe được giao cho 1 tài xế quản lý (có thể null nếu chưa giao)
    Car.belongsTo(models.User, { foreignKey: 'driver_id', as: 'driver' });
  };

  return Car;
};