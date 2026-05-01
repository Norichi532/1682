// models/Review.js
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    booking_id: { type: DataTypes.UUID, allowNull: false, unique: true },
    customer_id: { type: DataTypes.UUID, allowNull: false },
    rating: { type: DataTypes.INTEGER },
    comment: { type: DataTypes.TEXT }
  }, {
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Review.associate = function(models) {
    Review.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
    Review.belongsTo(models.User, { foreignKey: 'customer_id', as: 'reviewer' });
  };

  return Review;
};