// models/Payment.js
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    booking_id: { type: DataTypes.UUID, allowNull: false },
    payment_method: { type: DataTypes.STRING(50), defaultValue: 'PAYOS' },
    transaction_code: { type: DataTypes.STRING(100), unique: true },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: { type: DataTypes.STRING(50), defaultValue: 'PENDING' }
  }, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Payment.associate = function(models) {
    Payment.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
  };

  return Payment;
};