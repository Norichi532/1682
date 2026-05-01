// models/Booking.js
module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    customer_id: { type: DataTypes.UUID, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    model_id: { type: DataTypes.INTEGER, allowNull: false },
    car_id: { type: DataTypes.INTEGER },
    driver_id: { type: DataTypes.UUID },
    start_time: { type: DataTypes.DATE, allowNull: false },
    total_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: { type: DataTypes.STRING(50), defaultValue: 'PENDING' },
    additional_data: { type: DataTypes.JSONB } // Lưu thông tin phụ như số hiệu chuyến bay, số túi golf
  }, {
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Booking.associate = function(models) {
    Booking.belongsTo(models.User, { foreignKey: 'customer_id', as: 'customer' });
    Booking.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    Booking.belongsTo(models.CarModel, { foreignKey: 'model_id', as: 'car_model' });
    Booking.belongsTo(models.Car, { foreignKey: 'car_id', as: 'assigned_car' });
    Booking.belongsTo(models.User, { foreignKey: 'driver_id', as: 'assigned_driver' });
    
    Booking.hasOne(models.Payment, { foreignKey: 'booking_id', as: 'payment' });
    Booking.hasOne(models.Review, { foreignKey: 'booking_id', as: 'review' });
  };

  return Booking;
};